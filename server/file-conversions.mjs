import sharp from 'sharp';
import JSZip from 'jszip';
import { promisify } from 'node:util';
import { gzip, gunzip } from 'node:zlib';
import { PDFDocument } from 'pdf-lib';
import { Document, Paragraph, Table, TableRow, TableCell, TextRun, Packer } from 'docx';
import MarkdownIt from 'markdown-it';
import sanitizeHtml from 'sanitize-html';
import { convert as htmlToText } from 'html-to-text';
import TurndownService from 'turndown';
import { DOMParser, XMLSerializer } from '@xmldom/xmldom';
import { parse as parseCsv } from 'csv-parse/sync';
import mammoth from 'mammoth';
import path from 'node:path';
import { openRenderedPdf, renderPage } from './extended-conversions.mjs';

export const FILE_CONVERSION_SLUGS = [
  'svg-to-jpeg-webp','webp-to-gif','avif-converter','tiff-to-webp','gif-to-webp','gif-compressor',
  'pdf-flatten-forms','pdf-extract-attachments','scanned-pdf-to-text','pdf-to-markdown','pdf-to-epub',
  'csv-to-pdf','json-to-pdf','markdown-to-pdf','csv-to-docx','json-to-docx','docx-to-markdown','odt-to-docx','html-to-epub','gzip-file-compressor',
];
export const FILE_TEXT_SLUGS = ['csv-to-pdf','json-to-pdf','markdown-to-pdf','csv-to-docx','json-to-docx','html-to-epub'];
const gzipAsync=promisify(gzip),gunzipAsync=promisify(gunzip),PIXELS=16_000_000;
const escapeHtml=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const cleanName=value=>path.basename(String(value||'attachment.bin')).replace(/[\u0000-\u001f\u007f]/g,'_').slice(0,120)||'attachment.bin';
const allElements=doc=>{const nodes=doc.getElementsByTagName('*'),items=[];for(let i=0;i<nodes.length;i++)items.push(nodes.item(i));return items;};

function wrapPdfText(text,values,h){
  const size=h.integer(values,'fontSize',6,18),orientation=values.orientation==='landscape'?'landscape':'portrait';
  const [pw,ph]=orientation==='landscape'?[841.89,595.28]:[595.28,841.89],margin=38,width=pw-margin*2;
  const docPromise=PDFDocument.create();
  return {size,pw,ph,margin,width,docPromise};
}
async function textPdf(text,values,h,name){
  h.ensure(text.trim()&&text.length<=180000,'Use non-empty content up to 180,000 characters.');
  const config=wrapPdfText(text,values,h),doc=await config.docPromise,font=await h.embedFont(doc,text),leading=config.size*1.4;
  let page=doc.addPage([config.pw,config.ph]),y=config.ph-config.margin;
  const draw=line=>{if(y<config.margin){h.ensure(doc.getPageCount()<60,'Output exceeds 60 PDF pages.');page=doc.addPage([config.pw,config.ph]);y=config.ph-config.margin;}if(line)page.drawText(line,{x:config.margin,y,size:config.size,font});y-=leading;};
  for(const paragraph of text.replace(/\r\n?/g,'\n').split('\n')){let line='';for(const character of paragraph){if(line&&font.widthOfTextAtSize(line+character,config.size)>config.width){draw(line);line='';}line+=character;}draw(line);}
  return h.binaryResult(await doc.save(),name,'application/pdf');
}
function parseCsvRows(text,h){let rows;try{rows=parseCsv(text,{bom:true,skip_empty_lines:true,relax_column_count:false,max_record_size:100000});}catch{throw new h.InputError('Provide valid CSV with consistent column counts and quoted fields.');}h.ensure(rows.length>=2&&rows.length<=501&&rows[0].length<=24&&rows.length*rows[0].length<=6000,'Use 1–500 data rows, up to 24 columns and 6,000 cells.');return rows;}
function epubPackage(title,body,zip){
  const safeTitle=escapeHtml(title.slice(0,180)||'Untitled document');
  zip.file('mimetype','application/epub+zip',{compression:'STORE'});
  zip.file('META-INF/container.xml','<?xml version="1.0" encoding="UTF-8"?><container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container"><rootfiles><rootfile full-path="OEBPS/package.opf" media-type="application/oebps-package+xml"/></rootfiles></container>');
  zip.file('OEBPS/content.xhtml',`<?xml version="1.0" encoding="UTF-8"?><html xmlns="http://www.w3.org/1999/xhtml"><head><title>${safeTitle}</title><meta charset="utf-8"/></head><body>${body}</body></html>`);
  zip.file('OEBPS/nav.xhtml',`<?xml version="1.0" encoding="UTF-8"?><html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops"><head><title>Contents</title><meta charset="utf-8"/></head><body><nav epub:type="toc"><h1>Contents</h1><ol><li><a href="content.xhtml">${safeTitle}</a></li></ol></nav></body></html>`);
  zip.file('OEBPS/package.opf',`<?xml version="1.0" encoding="UTF-8"?><package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="bookid"><metadata xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:identifier id="bookid">urn:uuid:utilixio-${Date.now()}</dc:identifier><dc:title>${safeTitle}</dc:title><dc:language>en</dc:language></metadata><manifest><item id="content" href="content.xhtml" media-type="application/xhtml+xml"/><item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/></manifest><spine><itemref idref="content"/></spine></package>`);
}
async function pdfText(bytes,h){const doc=await openRenderedPdf(bytes,h);try{h.ensure(doc.numPages<=80,'Use a PDF with at most 80 pages.');const pages=[];for(let i=1;i<=doc.numPages;i++){const page=await doc.getPage(i),content=await page.getTextContent();let text='';for(const item of content.items){if(typeof item.str!=='string')continue;text+=item.str+(item.hasEOL?'\n':' ');}pages.push(text.trim());page.cleanup();}return pages;}finally{await doc.destroy();}}
async function pdfEpub(bytes,h){const pages=await pdfText(bytes,h),zip=new JSZip(),body=pages.map((text,i)=>`<section><h2>Page ${i+1}</h2><pre>${escapeHtml(text)}</pre></section>`).join('');epubPackage('Converted PDF',body,zip);return h.binaryResult(await zip.generateAsync({type:'nodebuffer',compression:'DEFLATE',compressionOptions:{level:6}}),'converted.epub','application/epub+zip');}
async function pdfMarkdown(bytes,h){const pages=await pdfText(bytes,h);return h.textResult(pages.map((text,i)=>`## Page ${i+1}\n\n${text}`).join('\n\n---\n\n')+'\n','converted.md','text/markdown;charset=utf-8');}
async function pdfAttachments(bytes,h){
  const doc=await openRenderedPdf(bytes,h);try{const attachments=await doc.getAttachments();h.ensure(attachments&&attachments.size,'This PDF has no embedded file attachments.');h.ensure(attachments.size<=50,'Use a PDF with at most 50 attachments.');const zip=new JSZip(),used=new Set();let total=0;
    for(const item of attachments.values()){const name=cleanName(item.filename),unique=used.has(name)?`${used.size+1}-${name}`:name;used.add(unique);const data=Buffer.from(item.content);total+=data.length;h.ensure(total<=12*1024*1024,'Extracted attachments exceed 12 MiB.');zip.file(unique,data);}
    return h.binaryResult(await zip.generateAsync({type:'nodebuffer',compression:'DEFLATE',compressionOptions:{level:5}}),'pdf-attachments.zip','application/zip');
  }finally{await doc.destroy();}
}
async function scannedPdfText(bytes,values,h){
  const doc=await openRenderedPdf(bytes,h),limit=h.integer(values,'pages',1,5);
  const {createWorker}=await import('tesseract.js'),root=path.join(process.cwd(),'node_modules');
  const worker=await createWorker('eng',1,{langPath:path.join(root,'@tesseract.js-data/eng/4.0.0'),cacheMethod:'none',gzip:true,workerPath:path.join(root,'tesseract.js/src/worker-script/node/index.js'),corePath:path.join(root,'tesseract.js-core'),errorHandler:()=>{}});
  try{const pages=[];for(let i=1;i<=Math.min(doc.numPages,limit);i++){const rendered=await renderPage(doc,i,1.25,h),image=await sharp(rendered.bytes).resize({width:2000,height:2000,fit:'inside',withoutEnlargement:true}).grayscale().png().toBuffer(),recognized=await worker.recognize(image);pages.push(`--- Page ${i} ---\n${recognized.data.text.trim()}`);}const text=pages.join('\n\n');h.ensure(text.trim(),'No readable text was recognized. Try a clearer scan.');return h.textResult(text+'\n','recognized-text.txt');}finally{await worker.terminate();await doc.destroy();}
}
async function renderSvg(text,values,h){
  h.ensure(text.length<=500000&&/<svg\b/i.test(text),'Provide an SVG document up to 500 KB.');
  h.ensure(!/<!DOCTYPE|<!ENTITY|<script\b|<foreignObject\b|@import\b|url\(\s*["']?(?!#)|(?:href|xlink:href)\s*=\s*["']\s*(?:https?:|file:|\/\/|data:)/i.test(text),'SVG scripts, entities, foreign objects, and external resources are unsupported.');
  const width=h.integer(values,'width',1,4096),quality=h.integer(values,'quality',30,100),format=h.pick(values,'format',['jpeg','webp']);
  let pipeline=sharp(Buffer.from(text)).resize({width,withoutEnlargement:true});if(format==='jpeg')pipeline=pipeline.flatten({background:'#ffffff'}).jpeg({quality});else pipeline=pipeline.webp({quality});
  return h.binaryResult(await pipeline.toBuffer(),format==='jpeg'?'converted.jpg':'converted.webp',format==='jpeg'?'image/jpeg':'image/webp');
}
async function optimizeSvg(bytes,h){
  const text=bytes.toString('utf8');h.ensure(text.length<=500000&&/<svg\b/i.test(text),'Choose an SVG document up to 500 KB.');h.ensure(!/<!DOCTYPE|<!ENTITY|<script\b|<foreignObject\b|@import\b|url\(\s*["']?(?!#)|(?:href|xlink:href)\s*=\s*["']\s*(?:https?:|file:|\/\/|data:)/i.test(text),'SVG scripts, entities, and external resources are unsupported.');
  const parser=new DOMParser({errorHandler:{warning:()=>{},error:()=>{},fatalError:()=>{throw new h.InputError('Invalid SVG XML.');}}}),doc=parser.parseFromString(text,'image/svg+xml'),root=doc.documentElement;
  h.ensure(root?.localName==='svg','Choose a valid SVG document.');
  const remove=[];const walk=node=>{for(let child=node.firstChild;child;child=child.nextSibling){if(child.nodeType===8||child.nodeType===1&&child.localName?.toLowerCase()==='metadata')remove.push(child);else if(child.nodeType===1)walk(child);}};walk(root);for(const node of remove)node.parentNode?.removeChild(node);
  const output=new XMLSerializer().serializeToString(doc).replace(/>\s+</g,'><').trim();return h.textResult(output+'\n','optimized.svg','image/svg+xml;charset=utf-8');
}
async function imageConvert(slug,files,values,h){
  const bytes=files[0].bytes,meta=await sharp(bytes,{animated:slug==='gif-to-webp'||slug==='gif-compressor'}).metadata();
  h.ensure(meta.width>0&&meta.height>0&&meta.width*meta.height<=PIXELS,'Image exceeds 16 million pixels.');
  if(slug==='avif-converter')h.ensure(['avif','heif'].includes(meta.format),'Choose an AVIF image.');
  if(slug==='tiff-to-webp')h.ensure(meta.format==='tiff','Choose a TIFF image.');if(slug==='webp-to-gif')h.ensure(meta.format==='webp','Choose a WebP image.');
  if(slug==='gif-to-webp'||slug==='gif-compressor')h.ensure(meta.format==='gif'&&(meta.pages??1)<=300,'Choose a GIF animation with at most 300 frames.');
  if(slug==='webp-to-gif')return h.binaryResult(await sharp(bytes).gif({effort:7,colors:256}).toBuffer(),'converted.gif','image/gif');
  if(slug==='tiff-to-webp'){
    const page=h.integer(values,'page',1,meta.pages??1),quality=h.integer(values,'quality',30,100),output=await sharp(bytes,{page:page-1,pages:1}).webp({quality}).toBuffer();
    return h.binaryResult(output,'page-'+page+'.webp','image/webp');
  }
  if(slug==='gif-to-webp'){
    const quality=h.integer(values,'quality',30,100),output=await sharp(bytes,{animated:true}).webp({quality,effort:4}).toBuffer();
    return h.binaryResult(output,'animation.webp','image/webp');
  }
  if(slug==='gif-compressor'){
    const colors=h.integer(values,'colors',32,256);h.ensure([32,64,128,256].includes(colors),'Choose 32, 64, 128, or 256 colors.');const output=await sharp(bytes,{animated:true}).gif({colors,effort:7,dither:0.7}).toBuffer();
    return h.binaryResult(output,'compressed.gif','image/gif');
  }
  const format=h.pick(values,'format',['png','jpeg','webp']),quality=h.integer(values,'quality',30,100);let image=sharp(bytes);
  if(format==='png')image=image.png({compressionLevel:9});else if(format==='jpeg')image=image.flatten({background:'#ffffff'}).jpeg({quality});else image=image.webp({quality});
  return h.binaryResult(await image.toBuffer(),format==='jpeg'?'converted.jpg':`converted.${format}`,`image/${format}`);
}
async function csvPdf(text,values,h){const rows=parseCsvRows(text,h),rendered=rows.map((row,index)=>`${index===0?'HEADER':'ROW '+index}: ${row.map(v=>String(v).replace(/\s+/g,' ').trim()).join('  |  ')}`).join('\n');return textPdf(rendered,values,h,'table.pdf');}
async function jsonDoc(text,h){let data;try{data=JSON.parse(text);}catch{throw new h.InputError('Enter valid JSON.');}h.validateData(data);return JSON.stringify(data,null,2);}
async function markdownPlain(text){const md=new MarkdownIt({html:false,linkify:false,typographer:false});return htmlToText(md.render(text),{wordwrap:100,preserveNewlines:true});}
async function htmlEpub(text,values,h){h.ensure(text.length<=250000,'Use at most 250,000 characters of HTML.');const title=String(values.title??'Untitled document').trim();h.ensure(title&&title.length<=180,'Enter a title up to 180 characters.');const safe=sanitizeHtml(text,{allowedTags:['h1','h2','h3','h4','p','ul','ol','li','blockquote','pre','code','strong','em','b','i','br','hr','a'],allowedAttributes:{a:['href','title']},allowedSchemes:['https','http','mailto']});h.ensure(safe.replace(/<[^>]*>/g,'').trim(),'Provide HTML with readable text.');const zip=new JSZip();epubPackage(title,safe,zip);return h.binaryResult(await zip.generateAsync({type:'nodebuffer',compression:'DEFLATE',compressionOptions:{level:6}}),'document.epub','application/epub+zip');}
async function gzipFile(files,values,h){const input=files[0],mode=h.pick(values,'mode',['compress','decompress']);if(mode==='compress'){const output=await gzipAsync(input.bytes,{level:9});return h.binaryResult(output,cleanName(input.name)+'.gz','application/gzip');}h.ensure(input.bytes.length>=2&&input.bytes[0]===0x1f&&input.bytes[1]===0x8b,'Choose a valid GZIP file to decompress.');let output;try{output=await gunzipAsync(input.bytes,{maxOutputLength:16*1024*1024});}catch{throw new h.InputError('Invalid GZIP data or decompressed output exceeds 16 MiB.');}const name=cleanName(input.name).replace(/\.gz$/i,'')||'decompressed.bin';return h.binaryResult(output,name,'application/octet-stream');}
async function odtToDocx(bytes,h){
  await h.validateOfficeZip(bytes,'odt');const zip=await JSZip.loadAsync(bytes),xml=await zip.file('content.xml').async('string');h.ensure(xml.length<=8*1024*1024&&!/<!DOCTYPE|<!ENTITY/i.test(xml),'ODT document has unsupported or oversized XML.');
  const doc=new DOMParser({errorHandler:{warning:()=>{},error:()=>{},fatalError:()=>{throw new h.InputError('Invalid ODT XML.');}}}).parseFromString(xml,'text/xml'),paragraphs=allElements(doc).filter(n=>['p','h'].includes(n.localName));
  const children=paragraphs.map(node=>{const value=node.textContent??'';return new Paragraph({text:value,heading:node.localName==='h'? 'Heading1':undefined});});h.ensure(children.length>0,'The ODT document contains no readable paragraphs.');h.ensure(children.length<=10000,'ODT contains too many paragraphs.');
  return h.binaryResult(await Packer.toBuffer(new Document({sections:[{children}]})),'converted.docx','application/vnd.openxmlformats-officedocument.wordprocessingml.document');
}
async function csvDocx(text,h){const rows=parseCsvRows(text,h);const table=new Table({rows:rows.map((row,index)=>new TableRow({tableHeader:index===0,children:row.map(cell=>new TableCell({children:[new Paragraph({children:[new TextRun({text:String(cell),bold:index===0})]})]}))}))});const doc=new Document({sections:[{children:[table]}]});return h.binaryResult(await Packer.toBuffer(doc),'table.docx','application/vnd.openxmlformats-officedocument.wordprocessingml.document');}

export async function convertFile(slug,files,text,values,h){
  if(slug==='svg-to-jpeg-webp')return renderSvg(files[0].bytes.toString('utf8'),values,h);
  if(slug==='svg-optimizer')return optimizeSvg(files[0].bytes,h);
  if(['avif-converter','tiff-to-webp','webp-to-gif','gif-to-webp','gif-compressor'].includes(slug))return imageConvert(slug,files,values,h);
  if(slug==='pdf-flatten-forms'){const doc=await h.loadPdf(files[0].bytes),form=doc.getForm();h.ensure(form.getFields().length>0,'This PDF does not contain interactive form fields.');form.flatten();return h.binaryResult(await doc.save(),'flattened.pdf','application/pdf');}
  if(slug==='pdf-extract-attachments')return pdfAttachments(files[0].bytes,h);
  if(slug==='scanned-pdf-to-text')return scannedPdfText(files[0].bytes,values,h);
  if(slug==='pdf-to-markdown')return pdfMarkdown(files[0].bytes,h);
  if(slug==='pdf-to-epub')return pdfEpub(files[0].bytes,h);
  if(slug==='csv-to-pdf')return csvPdf(text,values,h);
  if(slug==='json-to-pdf'){let value;try{value=JSON.parse(text);}catch{throw new h.InputError('Enter valid JSON before creating the PDF.');}h.validateData(value);return textPdf(JSON.stringify(value,null,2),values,h,'data.pdf');}
  if(slug==='markdown-to-pdf')return textPdf(await markdownPlain(text),values,h,'document.pdf');
  if(slug==='csv-to-docx')return csvDocx(text,h);
  if(slug==='json-to-docx')return h.binaryResult(await Packer.toBuffer(new Document({sections:[{children:(await jsonDoc(text,h)).split('\n').map(line=>new Paragraph({children:[new TextRun({text:line,font:'Consolas'})]}))}]})),'data.docx','application/vnd.openxmlformats-officedocument.wordprocessingml.document');
  if(slug==='docx-to-markdown'){const result=await mammoth.convertToHtml({buffer:Buffer.from(files[0].bytes)});const turndown=new TurndownService({headingStyle:'atx',codeBlockStyle:'fenced'});h.ensure(result.value.trim(),'No readable document text was found.');return h.textResult(turndown.turndown(result.value)+'\n','document.md','text/markdown;charset=utf-8');}
  if(slug==='odt-to-docx')return odtToDocx(files[0].bytes,h);
  if(slug==='html-to-epub')return htmlEpub(text,values,h);
  if(slug==='gzip-file-compressor')return gzipFile(files,values,h);
  throw new h.InputError('Unknown file conversion.');
}
export async function exampleFile(slug,h){
  if(slug==='svg-optimizer')return h.textResult('<svg xmlns="http://www.w3.org/2000/svg" width="80" height="40"><!-- editor note --><metadata>draft</metadata><rect width="80" height="40" fill="#2878a5"/></svg>','example.svg','image/svg+xml');
  if(FILE_TEXT_SLUGS.includes(slug))return h.textResult(slug==='csv-to-pdf'||slug==='csv-to-docx'?'Name,City\nAda,London\nLinus,Helsinki':slug==='json-to-pdf'||slug==='json-to-docx'?'{"name":"Ada","active":true}':slug==='markdown-to-pdf'?'# Example document\n\nA short **formatted** page.':'<h1>Example article</h1><p>Readable ebook content.</p>','example.txt');
  if(slug==='gzip-file-compressor')return h.textResult('Example text to compress.\n','example.txt');
  if(slug==='svg-to-jpeg-webp')return h.textResult('<svg xmlns="http://www.w3.org/2000/svg" width="120" height="80"><rect width="120" height="80" fill="#2878a5"/><circle cx="60" cy="40" r="22" fill="#f5bd4f"/></svg>','example.svg','image/svg+xml');
  if(slug==='avif-converter')return h.binaryResult(await sharp({create:{width:48,height:32,channels:3,background:'#3875b7'}}).avif().toBuffer(),'example.avif','image/avif');
  if(slug==='webp-to-gif')return h.binaryResult(await sharp({create:{width:48,height:32,channels:3,background:'#3875b7'}}).webp().toBuffer(),'example.webp','image/webp');
  if(slug==='tiff-to-webp')return h.binaryResult(await sharp({create:{width:48,height:32,channels:3,background:'#3875b7'}}).tiff().toBuffer(),'example.tiff','image/tiff');
  if(slug==='gif-to-webp'||slug==='gif-compressor')return h.binaryResult(await sharp({create:{width:48,height:32,channels:3,background:'#3875b7'}}).gif().toBuffer(),'example.gif','image/gif');
  if(slug==='pdf-flatten-forms'){const d=await PDFDocument.create(),p=d.addPage([400,300]),field=d.getForm().createTextField('full_name');p.drawText('Name',{x:32,y:220,size:14});field.setText('Ada Lovelace');field.addToPage(p,{x:32,y:175,width:240,height:26});return h.binaryResult(await d.save(),'example-form.pdf','application/pdf');}
  if(slug==='pdf-extract-attachments'){const d=await PDFDocument.create();d.addPage([400,300]).drawText('Example PDF with an attachment',{x:32,y:240,size:16});await d.attach(Buffer.from('A sample embedded note.\n'),'notes.txt',{mimeType:'text/plain',description:'Example attachment'});return h.binaryResult(await d.save(),'example-attachment.pdf','application/pdf');}
  if(slug==='pdf-to-markdown'||slug==='pdf-to-epub'||slug==='scanned-pdf-to-text'){const d=await PDFDocument.create(),p=d.addPage([400,300]);p.drawText('Example document page',{x:32,y:240,size:20});p.drawText('Selectable text can also be rendered for OCR.',{x:32,y:200,size:12});return h.binaryResult(await d.save(),'example.pdf','application/pdf');}
  if(slug==='docx-to-markdown'){const doc=new Document({sections:[{children:[new Paragraph({text:'Example document',heading:'Heading1'}),new Paragraph({text:'A short paragraph for Markdown conversion.'})]}]});return h.binaryResult(await Packer.toBuffer(doc),'example.docx','application/vnd.openxmlformats-officedocument.wordprocessingml.document');}
  if(slug==='odt-to-docx'){const zip=new JSZip();zip.file('mimetype','application/vnd.oasis.opendocument.text',{compression:'STORE'});zip.file('META-INF/manifest.xml','<?xml version="1.0"?><manifest:manifest xmlns:manifest="urn:oasis:names:tc:opendocument:xmlns:manifest"><manifest:file-entry manifest:full-path="/" manifest:media-type="application/vnd.oasis.opendocument.text"/></manifest:manifest>');zip.file('content.xml','<?xml version="1.0"?><office:document-content xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0" xmlns:text="urn:oasis:names:tc:opendocument:xmlns:text:1.0"><office:body><office:text><text:h>Example heading</text:h><text:p>A short ODT paragraph.</text:p></office:text></office:body></office:document-content>');return h.binaryResult(await zip.generateAsync({type:'nodebuffer',compression:'DEFLATE'}),'example.odt','application/vnd.oasis.opendocument.text');}
  throw new h.InputError('Load an example or choose a file.');
}
