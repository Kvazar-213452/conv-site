import { POPULAR_SLUGS, convertPopular, examplePopular } from './popular-conversions.mjs';
import { PROTOCOL_SLUGS, PROTOCOL_TEXT_SLUGS, convertProtocol, exampleProtocol } from './protocol-conversions.mjs';
import { EXTENDED_SLUGS, EXTENDED_TEXT_SLUGS, EXTENDED_MULTI_SLUGS, convertExtended, exampleExtended, openRenderedPdf } from './extended-conversions.mjs';
import ExcelJS from 'exceljs';
import { parse as parseCsv } from 'csv-parse/sync';
import { parseDocument } from 'htmlparser2';
import { PDFDocument, PDFName, PDFRef, degrees, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import mammoth from 'mammoth';
import sanitizeHtml from 'sanitize-html';
import { convert as htmlToText } from 'html-to-text';
import sharp from 'sharp';
import JSON5 from 'json5';
import { stringify as stringifyToml } from 'smol-toml';
import iconv from 'iconv-lite';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import yauzl from 'yauzl';
import JSZip from 'jszip';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

export const SERVER_SLUGS = ['xlsx-to-csv','json-to-xlsx','xlsx-to-json','csv-to-xlsx','html-table-to-xlsx','docx-converter','pdf-merger','pdf-page-extractor','pdf-rotate','pdf-metadata-remover','pdf-resize','text-to-pdf','pdf-watermark','pdf-page-numbers','image-to-avif','tiff-to-image','gif-sprite-sheet','json5-to-json','json-to-toml','text-encoding-converter','text-to-docx','stereo-to-mono-wav','word-to-pdf','pdf-to-excel','jpg-to-pdf','png-to-svg','ppt-to-pdf',...EXTENDED_SLUGS,...PROTOCOL_SLUGS,...POPULAR_SLUGS];
export const MAX_FILE_BYTES = 4 * 1024 * 1024;
const MAX_PIXELS = 16000000;
export class InputError extends Error { constructor(message,status=400){super(message);this.status=status;} }
const ensure = (condition, message) => { if (!condition) throw new InputError(message); };
const pick = (values,key,choices) => { ensure(choices.includes(values[key]),'Choose a valid '+key+'.');return values[key]; };
const numeric = (values,key,min,max) => { const n=Number(values[key]);ensure(typeof values[key]==='string'&&values[key].trim()&&Number.isFinite(n)&&n>=min&&n<=max,key+': enter a number from '+min+' to '+max+'.');return n; };
const integer = (values,key,min,max) => {const n=numeric(values,key,min,max);ensure(Number.isInteger(n),key+' must be a whole number.');return n;};
const textResult = (text,name,type='text/plain;charset=utf-8') => ({bytes:Buffer.from(text,'utf8'),name,type});
const binaryResult = (bytes,name,type) => ({bytes,name,type});
const jsonResult = (value,name='result.json') => textResult(JSON.stringify(value,null,2),name,'application/json;charset=utf-8');
function validateData(value,depth=0,noNull=false) {
  ensure(depth<=32,'Use at most 32 nested levels.');
  ensure(!noNull||value!==null,'TOML cannot represent null values.');
  if(typeof value==='number')ensure(Number.isFinite(value)&&(!Number.isInteger(value)||Number.isSafeInteger(value)),'Use finite numbers and represent unsafe integer identifiers as strings.');
  if(value&&typeof value==='object')for(const child of Object.values(value))validateData(child,depth+1,noNull);
}
const csv = rows => rows.map(row=>row.map(value=>{const s=String(value??'');return /[",\r\n]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s;}).join(',')).join('\r\n');

// Validate actual inflated sizes before the Office parsers see an archive.
export async function validateOfficeZip(bytes,kind) {
  ensure(bytes.length<=2*1024*1024,'Office files must be at most 2 MiB compressed.');
  const archive=await new Promise((resolve,reject)=>yauzl.fromBuffer(Buffer.from(bytes),{lazyEntries:true,validateEntrySizes:true},(error,zip)=>error?reject(new InputError('Invalid Office ZIP archive.')):resolve(zip)));
  await new Promise((resolve,reject)=>{
    let size=0,count=0,done=false;const names=new Set();
    const fail=message=>{if(done)return;done=true;archive.close();reject(new InputError(message));};
    archive.on('error',()=>fail('Invalid or corrupt Office archive.'));
    archive.on('end',()=>{if(done)return;done=true;const required=kind==='xlsx'?'xl/workbook.xml':kind==='pptx'?'ppt/presentation.xml':kind==='odt'?'content.xml':'word/document.xml';if(names.has(required)&&names.has(kind==='odt'?'mimetype':'[Content_Types].xml'))resolve();else reject(new InputError('The file is not a supported '+kind.toUpperCase()+' document.'));});
    archive.on('entry',entry=>{
      if(++count>2000||entry.uncompressedSize>32*1024*1024||size+entry.uncompressedSize>32*1024*1024)return fail('Office archive exceeds 2,000 entries or 32 MiB expanded content.');
      if(entry.generalPurposeBitFlag&1)return fail('Encrypted Office archives are unsupported.');
      if(names.has(entry.fileName))return fail('Duplicate Office archive entry.');names.add(entry.fileName);
      if(entry.fileName.endsWith('/')){archive.readEntry();return;}
      archive.openReadStream(entry,(error,stream)=>{
        if(error)return fail('Could not read Office archive entry.');let actual=0,tail='';
        stream.on('data',chunk=>{
          actual+=chunk.length;size+=chunk.length;
          if(size>32*1024*1024||actual>entry.uncompressedSize){stream.destroy();fail('Office archive expands beyond the supported limit.');return;}
          if(entry.fileName.endsWith('.xml')){const source=tail+chunk.toString('utf8');if(/<!DOCTYPE|<!ENTITY/i.test(source)){stream.destroy();fail('Office XML declarations with entities are unsupported.');return;}tail=source.slice(-64);}
        });
        stream.on('error',()=>fail('Corrupt or oversized Office archive entry.'));
        stream.on('end',()=>{if(!done)archive.readEntry();});
      });
    });archive.readEntry();
  });
}
function cellValue(cell) {
  const value=cell.value;
  if(value===null||value===undefined)return null;
  if(value instanceof Date)return value.toISOString();
  if(['string','number','boolean'].includes(typeof value)){validateData(value);return value;}
  if(value.formula!==undefined||value.sharedFormula!==undefined){ensure(value.result!==undefined,'A formula has no cached result. Recalculate and save the workbook first.');return cellValue({value:value.result});}
  if(value.richText)return value.richText.map(part=>part.text).join('');
  if(value.hyperlink!==undefined)return String(value.text??value.hyperlink);
  throw new InputError('Unsupported Excel cell value or stored formula error.');
}
async function readWorksheet(bytes,values) {
  await validateOfficeZip(bytes,'xlsx');const book=new ExcelJS.Workbook();await book.xlsx.load(Buffer.from(bytes));
  const index=integer(values,'sheet',1,100),sheet=book.worksheets[index-1];ensure(sheet,'Worksheet does not exist.');
  ensure(sheet.rowCount<=10000&&sheet.columnCount<=200&&sheet.rowCount*sheet.columnCount<=50000,'Use at most 10,000 rows, 200 columns and 50,000 cells.');
  ensure(sheet.rowCount>0&&sheet.columnCount>0,'The selected worksheet is empty.');
  return Array.from({length:sheet.rowCount},(_,r)=>Array.from({length:sheet.columnCount},(_,c)=>cellValue(sheet.getCell(r+1,c+1))));
}
async function jsonWorkbook(text) {
  const records=JSON.parse(text);validateData(records);ensure(Array.isArray(records)&&records.length>0&&records.length<=10000,'Use a nonempty JSON array of records, at most 10,000 records.');
  ensure(records.every(r=>r&&typeof r==='object'&&!Array.isArray(r)),'Every JSON record must be an object.');
  const headers=[...new Set(records.flatMap(r=>Object.keys(r)))];ensure(headers.length>0&&headers.length<=200&&(records.length+1)*headers.length<=50000,'Use at most 200 columns and 50,000 cells.');
  ensure(headers.every(h=>h.trim()&&h.length<=32767),'Column names must be nonblank and within the Excel text limit.');
  const book=new ExcelJS.Workbook(),sheet=book.addWorksheet('Data');sheet.addRow(headers);
  for(const record of records){const row=headers.map(h=>{const v=Object.hasOwn(record,h)?record[h]:null;ensure(v===null||['string','number','boolean'].includes(typeof v),'Flatten nested records before creating a worksheet.');if(typeof v==='string')ensure(v.length<=32767,'Excel text cells support at most 32,767 characters.');return v;});sheet.addRow(row);}
  sheet.getRow(1).font={bold:true};sheet.views=[{state:'frozen',ySplit:1}];return binaryResult(await book.xlsx.writeBuffer(),'data.xlsx','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
}
async function csvWorkbook(text) {
  let rows;try{rows=parseCsv(text,{bom:true,relax_column_count:false,skip_empty_lines:false,max_record_size:32767});}catch{throw new InputError('Invalid CSV. Check quoted fields, line breaks and row lengths.');}
  ensure(Array.isArray(rows)&&rows.length>=2&&rows.length<=10000,'Include a header and at least one record, with no more than 10,000 rows.');
  const headers=rows[0].map(value=>String(value));ensure(headers.length>0&&headers.length<=200&&(rows.length*headers.length)<=50000,'Use at most 200 columns and 50,000 cells.');
  ensure(headers.every(value=>value.trim()&&value.length<=32767&&!/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(value))&&new Set(headers).size===headers.length,'Column names must be unique, nonblank, XML-safe and within the Excel text limit.');
  for(let i=1;i<rows.length;i++){ensure(rows[i].length===headers.length,`CSV row ${i+1} has ${rows[i].length} cells; expected ${headers.length}.`);ensure(rows[i].every(value=>typeof value==='string'&&value.length<=32767&&!/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(value)),'Excel cells must be XML-safe and contain at most 32,767 characters.');}
  const book=new ExcelJS.Workbook(),sheet=book.addWorksheet('Data');
  for(const row of rows)sheet.addRow(row.map(value=>String(value)));
  sheet.getRow(1).font={bold:true};sheet.views=[{state:'frozen',ySplit:1}];
  sheet.columns=headers.map(header=>({width:Math.max(12,Math.min(36,header.length+2))}));
  return binaryResult(await book.xlsx.writeBuffer(),'converted.xlsx','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
}
function htmlTableCsv(source) {
  const root=parseDocument(source,{decodeEntities:true});
  const firstTable=node=>{if(node?.type==='tag'&&node.name==='table')return node;for(const child of node?.children??[]){const found=firstTable(child);if(found)return found;}return null;};
  const table=firstTable(root);ensure(table,'No HTML table found.');const rows=[];
  const cellText=node=>{if(node.type==='text')return node.data??'';if(node.name==='script'||node.name==='style'||node.name==='table')return '';if(node.name==='br')return '\n';return (node.children??[]).map(cellText).join('');};
  const cellsIn=row=>{const cells=[];const visit=node=>{for(const child of node.children??[]){if(child.type==='tag'&&['td','th'].includes(child.name)){ensure(!child.attribs?.rowspan||child.attribs.rowspan==='1','Merged cells are not supported.');ensure(!child.attribs?.colspan||child.attribs.colspan==='1','Merged cells are not supported.');cells.push(cellText(child).trim());}else if(child.type==='tag'&&child.name!=='table')visit(child);}};visit(row);return cells;};
  const visitRows=node=>{for(const child of node.children??[]){if(child.type==='tag'&&child.name==='table')continue;if(child.type==='tag'&&child.name==='tr'){const cells=cellsIn(child);if(cells.length)rows.push(cells);}else visitRows(child);}};visitRows(table);
  ensure(rows.length>=2&&rows[0].length>0,'The table needs a header and at least one data row.');const headers=rows[0];ensure(headers.every(value=>value.trim())&&new Set(headers).size===headers.length,'Column headings must be unique and non-empty.');
  rows.slice(1).forEach((row,index)=>ensure(row.length===headers.length,`HTML table row ${index+2} has a different number of cells than the header.`));
  ensure(rows.length<=10000&&headers.length<=200&&rows.length*headers.length<=50000,'Use at most 10,000 rows, 200 columns and 50,000 cells.');return csv(rows);
}
async function loadPdf(bytes) {
  ensure(Buffer.from(bytes).subarray(0,1024).includes(Buffer.from('%PDF-')),'Choose a PDF document.');
  let doc;try{doc=await PDFDocument.load(bytes,{updateMetadata:false});}catch{throw new InputError('Invalid, unsupported or encrypted PDF.');}
  ensure(!doc.isEncrypted,'Encrypted PDFs are unsupported.');ensure(doc.getPageCount()>0&&doc.getPageCount()<=200,'Use a PDF with between 1 and 200 pages.');return doc;
}
export function selectedPages(input,count) {
  ensure(typeof input==='string'&&input.length<=2000,'Enter page numbers or ranges.');const pages=[],seen=new Set();
  for(const part of input.split(',')){const m=/^\s*(\d+)(?:\s*-\s*(\d+))?\s*$/.exec(part);ensure(m,'Use comma-separated page numbers and ascending ranges.');const start=Number(m[1]),end=m[2]?Number(m[2]):start;ensure(start>=1&&end>=start&&end<=count,'Page selection is outside the document or reversed.');for(let page=start;page<=end;page++){ensure(!seen.has(page),'Repeated page selections are unsupported.');seen.add(page);pages.push(page-1);}}
  return pages;
}
async function embedFont(doc,text) {
  doc.registerFontkit(fontkit);const bytes=await readFile(path.join(process.cwd(),'public/fonts/NotoSans-Regular.ttf'));const font=await doc.embedFont(bytes,{subset:true});
  const supported=new Set(font.getCharacterSet());for(const c of text){if(/[\n\r\t]/.test(c))continue;ensure(supported.has(c.codePointAt(0)),'The embedded font does not support one of these characters. Use common Latin or Cyrillic text.');}
  ensure(!/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]|[\u0590-\u08ff]/u.test(text),'Use left-to-right text without unsupported control characters.');return font;
}
function pageSize() {return [595.28,841.89];}
async function textPdf(text,values) {
  ensure(text.trim()&&text.length<=20000,'Use between 1 and 20,000 text characters.');text=text.replace(/\r\n?/g,'\n').replace(/\t/g,'    ');
  const doc=await PDFDocument.create(),font=await embedFont(doc,text),size=integer(values,'fontSize',8,24),leading=size*1.4,width=499.28;
  let page=doc.addPage(pageSize()),y=793.89;
  const draw=line=>{if(y<48){ensure(doc.getPageCount()<50,'Text would exceed 50 PDF pages.');page=doc.addPage(pageSize());y=793.89;}if(line)page.drawText(line,{x:48,y,size,font});y-=leading;};
  for(const paragraph of text.split('\n')){let line='';for(const character of paragraph){if(line&&font.widthOfTextAtSize(line+character,size)>width){draw(line);line='';}line+=character;}draw(line);}
  return binaryResult(await doc.save(),'text.pdf','application/pdf');
}
function decodeXmlText(value) {
  return value.replace(/&#x([\da-f]+);/gi,(_,code)=>String.fromCodePoint(parseInt(code,16))).replace(/&#(\d+);/g,(_,code)=>String.fromCodePoint(Number(code))).replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&apos;/g,"'").replace(/&amp;/g,'&');
}
async function powerpointToPdf(bytes,values) {
  await validateOfficeZip(bytes,'pptx');
  const archive=await JSZip.loadAsync(Buffer.from(bytes),{checkCRC32:true,createFolders:false});
  const slides=Object.keys(archive.files).filter(name=>/^ppt\/slides\/slide\d+\.xml$/.test(name)).sort((a,b)=>Number(/slide(\d+)/.exec(a)?.[1])-Number(/slide(\d+)/.exec(b)?.[1]));
  ensure(slides.length>0&&slides.length<=50,'Use a presentation with 1–50 slides.');
  const blocks=[];
  for(let i=0;i<slides.length;i++){
    const xml=await archive.file(slides[i]).async('string');
    const paragraphs=[...xml.matchAll(/<a:p(?:\s[^>]*)?>([\s\S]*?)<\/a:p>/g)].map(match=>[...match[1].matchAll(/<a:t(?:\s[^>]*)?>([\s\S]*?)<\/a:t>/g)].map(item=>decodeXmlText(item[1])).join('').trim()).filter(Boolean);
    blocks.push(`Slide ${i+1}${paragraphs.length?'\n'+paragraphs.join('\n'): '\n[No selectable text on this slide]'}`);
  }
  const result=await textPdf(blocks.join('\n\n'),values);result.name='presentation.pdf';return result;
}
async function convertRequestedFile(slug,bytes,values) {
  if(slug==='word-to-pdf'){
    await validateOfficeZip(bytes,'docx');const extracted=await mammoth.extractRawText({buffer:Buffer.from(bytes)},{externalFileAccess:false});
    ensure(!extracted.messages.some(m=>m.type==='error'),'Could not safely read the Word document.');
    const result=await textPdf(extracted.value,values);result.name='document.pdf';return result;
  }
  if(slug==='ppt-to-pdf')return powerpointToPdf(bytes,values);
  if(slug==='pdf-to-excel'){
    const pdf=await openRenderedPdf(bytes,sharedHelpers());
    const pageLimit=integer(values,'sheet',1,50);ensure(pdf.numPages<=pageLimit,'PDF has more pages than the selected page limit.');const extracted=[];
    for(let i=1;i<=pdf.numPages;i++){const page=await pdf.getPage(i),content=await page.getTextContent(),items=content.items.filter(item=>typeof item.str==='string'&&item.str.trim()).map(item=>({text:item.str.trim(),x:Number(item.transform?.[4]??0),y:Number(item.transform?.[5]??0),width:Number(item.width??0)})).sort((a,b)=>Math.abs(a.y-b.y)>3?b.y-a.y:a.x-b.x);const lines=[];for(const item of items){let line=lines.find(row=>Math.abs(row.y-item.y)<=3);if(!line){line={y:item.y,items:[]};lines.push(line);}line.items.push(item);}for(const line of lines){line.items.sort((a,b)=>a.x-b.x);const cells=[];let value='',right=-Infinity;for(const item of line.items){const gap=item.x-right;if(value&&gap>18){cells.push(value.trim());value=item.text;}else value+=(value&&gap>1?' ':'')+item.text;right=item.x+item.width;}if(value.trim())cells.push(value.trim());if(cells.length)extracted.push({page:i,cells});}page.cleanup();}
    await pdf.destroy();ensure(extracted.length>0,'No selectable text found. Scanned pages need OCR before conversion.');const columns=Math.min(30,Math.max(...extracted.map(row=>row.cells.length))),workbook=new ExcelJS.Workbook(),sheet=workbook.addWorksheet('Extracted tables');sheet.addRow(['Page','Row',...Array.from({length:columns},(_,i)=>`Column ${i+1}`)]);let rowNumber=0,lastPage=0;for(const row of extracted){if(row.page!==lastPage){lastPage=row.page;rowNumber=0;}sheet.addRow([row.page,++rowNumber,...Array.from({length:columns},(_,i)=>row.cells[i]??'')]);}sheet.getRow(1).font={bold:true};sheet.views=[{state:'frozen',ySplit:1,xSplit:2}];sheet.columns=[{width:9},{width:9},...Array.from({length:columns},()=>({width:22}))];return binaryResult(await workbook.xlsx.writeBuffer(),'pdf-tables.xlsx','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  }
  if(slug==='jpg-to-pdf'){
    const meta=await sharp(bytes,{limitInputPixels:MAX_PIXELS}).metadata();ensure(['jpeg','png'].includes(meta.format),'Choose a JPG or PNG image.');const normalized=await sharp(bytes,{limitInputPixels:MAX_PIXELS}).rotate().png().toBuffer(),image=await PDFDocument.create(),embedded=await image.embedPng(normalized);ensure(embedded.width*embedded.height<=MAX_PIXELS,'Image is too large to place in a PDF.');const page=image.addPage([embedded.width,embedded.height]);page.drawImage(embedded,{x:0,y:0,width:embedded.width,height:embedded.height});return binaryResult(await image.save(),'image.pdf','application/pdf');
  }
  if(slug==='png-to-svg'){
    const meta=await sharp(bytes,{limitInputPixels:MAX_PIXELS}).metadata();ensure(meta.format==='png','Choose a PNG image.');const side=integer(values,'resolution',8,128),maxColors=integer(values,'colors',2,16),scale=Math.min(1,side/Math.max(meta.width,meta.height)),width=Math.max(1,Math.round(meta.width*scale)),height=Math.max(1,Math.round(meta.height*scale));
    const {data}=await sharp(bytes,{limitInputPixels:MAX_PIXELS}).resize(width,height,{kernel:'nearest'}).ensureAlpha().raw().toBuffer({resolveWithObject:true});const histogram=new Map();for(let i=0;i<data.length;i+=4){if(data[i+3]<16)continue;const key=`${data[i]},${data[i+1]},${data[i+2]}`;histogram.set(key,(histogram.get(key)??0)+1);}const palette=[...histogram].sort((a,b)=>b[1]-a[1]).slice(0,maxColors).map(([key])=>key.split(',').map(Number));ensure(palette.length,'The PNG has no visible pixels.');const colorFor=(r,g,b)=>{let best=palette[0],distance=Infinity;for(const color of palette){const d=(r-color[0])**2+(g-color[1])**2+(b-color[2])**2;if(d<distance){distance=d;best=color;}}return `#${best.map(n=>n.toString(16).padStart(2,'0')).join('')}`;};const mapped=new Map();let rects='';
    for(let y=0;y<height;y++){let x=0;while(x<width){const at=(y*width+x)*4,alpha=data[at+3];if(alpha<16){x++;continue;}const raw=`${data[at]},${data[at+1]},${data[at+2]}`,color=mapped.get(raw)??colorFor(data[at],data[at+1],data[at+2]);mapped.set(raw,color);let end=x+1;while(end<width){const p=(y*width+end)*4;if(data[p+3]<16)break;const nextRaw=`${data[p]},${data[p+1]},${data[p+2]}`,next=mapped.get(nextRaw)??colorFor(data[p],data[p+1],data[p+2]);mapped.set(nextRaw,next);if(next!==color)break;end++;}rects+=`<rect x="${x}" y="${y}" width="${end-x}" height="1" fill="${color}"/>`;x=end;}}
    const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" shape-rendering="crispEdges">${rects}</svg>`;return textResult(svg,'traced-image.svg','image/svg+xml;charset=utf-8');
  }
  throw new InputError('Unsupported file tool.');
}
async function transformPdf(slug,files,values) {
  if(slug==='pdf-merger'){ensure(files.length>=2&&files.length<=8,'Choose between two and eight PDFs.');const output=await PDFDocument.create();let total=0;for(const file of files){const input=await loadPdf(file.bytes);total+=input.getPageCount();ensure(total<=200,'Merged PDFs must contain at most 200 pages.');for(const page of await output.copyPages(input,input.getPageIndices()))output.addPage(page);}return binaryResult(await output.save(),'merged.pdf','application/pdf');}
  const input=await loadPdf(files[0].bytes);
  if(slug==='pdf-page-extractor'){const output=await PDFDocument.create();for(const page of await output.copyPages(input,selectedPages(values.pages,input.getPageCount())))output.addPage(page);return binaryResult(await output.save(),'selected-pages.pdf','application/pdf');}
  if(slug==='pdf-rotate'){const angle=Number(pick(values,'angle',['90','180','270']));for(const page of input.getPages())page.setRotation(degrees((page.getRotation().angle+angle)%360));}
  else if(slug==='pdf-metadata-remover'){const info=input.context.trailerInfo.Info,metadata=input.catalog.get(PDFName.of('Metadata'));if(info)input.context.delete(info);if(metadata instanceof PDFRef)input.context.delete(metadata);input.context.trailerInfo.Info=undefined;input.catalog.delete(PDFName.of('Metadata'));}
  else if(slug==='pdf-resize'){
    const paper=pick(values,'paper',['a4','letter']),margin=integer(values,'margin',0,100),target=paper==='a4'?[595.28,841.89]:[612,792],output=await PDFDocument.create();
    for(const source of input.getPages()){
      const contents=source.node.Contents();
      if(!contents||(typeof contents.size==='function'&&contents.size()===0)){output.addPage(target);continue;}
      const angle=((source.getRotation().angle%360)+360)%360;ensure([0,90,180,270].includes(angle),'Unsupported PDF page rotation.');
      const embedded=await output.embedPage(source),w=embedded.width,h=embedded.height,visualW=angle%180?h:w,visualH=angle%180?w:h;
      ensure(visualW>0&&visualH>0,'Invalid PDF page dimensions.');const scale=Math.min((target[0]-2*margin)/visualW,(target[1]-2*margin)/visualH),page=output.addPage(target),left=(target[0]-visualW*scale)/2,bottom=(target[1]-visualH*scale)/2;
      // PDF viewer rotation is clockwise; drawing rotation uses counterclockwise coordinates.
      const x=left+(angle===180?w*scale:angle===270?h*scale:0),y=bottom+(angle===90?w*scale:angle===180?h*scale:0);
      page.drawPage(embedded,{x,y,width:w*scale,height:h*scale,rotate:degrees(-angle)});
    }return binaryResult(await output.save(),'resized.pdf','application/pdf');
  }else if(slug==='pdf-watermark'){
    const text=values.text??'';ensure(text.trim()&&text.length<=80&&!/[\r\n]/.test(text),'Use a single watermark line of 1–80 characters.');const opacity=integer(values,'opacity',5,100)/100,font=await embedFont(input,text);
    for(const page of input.getPages()){const {width,height}=page.getSize(),size=Math.min(48,width*.65/Math.max(font.widthOfTextAtSize(text,1),1));page.drawText(text,{x:width*.18,y:height*.45,size,font,rotate:degrees(30),opacity,color:rgb(.35,.35,.35)});}
  }else if(slug==='pdf-page-numbers'){
    const start=integer(values,'start',0,999999),size=integer(values,'fontSize',8,24),font=await embedFont(input,'0123456789');input.getPages().forEach((page,index)=>{const text=String(start+index);page.drawText(text,{x:(page.getWidth()-font.widthOfTextAtSize(text,size))/2,y:18,font,size,color:rgb(.15,.15,.15)});});
  }else throw new InputError('Unsupported PDF conversion.');
  return binaryResult(await input.save(),slug+'.pdf','application/pdf');
}
async function convertImage(slug,bytes,values) {
  const signature=Buffer.from(bytes).subarray(0,12);
  const png=signature.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])),jpeg=signature[0]===255&&signature[1]===216&&signature[2]===255,webp=signature.toString('ascii',0,4)==='RIFF'&&signature.toString('ascii',8,12)==='WEBP';
  const tiff=signature.length>=4&&(signature[0]===73&&signature[1]===73&&[42,43].includes(signature[2])&&signature[3]===0||signature[0]===77&&signature[1]===77&&signature[2]===0&&[42,43].includes(signature[3]));
  const gif=['GIF87a','GIF89a'].includes(signature.toString('ascii',0,6));
  ensure(slug==='image-to-avif'?png||jpeg||webp:slug==='tiff-to-image'?tiff:gif,'File signature does not match a supported input image.');
  const metadata=await sharp(bytes,{limitInputPixels:MAX_PIXELS}).metadata();
  if(slug==='image-to-avif'){ensure(['png','jpeg','webp'].includes(metadata.format)&&(!metadata.pages||metadata.pages===1),'Choose a still PNG, JPEG or WebP.');return binaryResult(await sharp(bytes,{limitInputPixels:MAX_PIXELS}).autoOrient().avif({quality:integer(values,'quality',1,100),effort:3}).toBuffer(),'converted.avif','image/avif');}
  if(slug==='tiff-to-image'){ensure(metadata.format==='tiff','Choose a TIFF image.');const page=integer(values,'page',1,metadata.pages??1)-1,format=pick(values,'format',['png','jpeg']);let image=sharp(bytes,{page,pages:1,limitInputPixels:MAX_PIXELS}).autoOrient();image=format==='png'?image.png():image.flatten({background:'#ffffff'}).jpeg({quality:90});return binaryResult(await image.toBuffer(),'tiff-page-'+(page+1)+(format==='png'?'.png':'.jpg'),'image/'+format);}
  ensure(metadata.format==='gif','Choose a GIF image.');const frames=metadata.pages??1;ensure(frames<=64,'Use a GIF with at most 64 frames.');const columns=Math.min(integer(values,'columns',1,16),frames);
  const framePixels=metadata.width*(metadata.pageHeight??metadata.height);
  ensure(Number.isSafeInteger(framePixels)&&framePixels>0&&framePixels*frames<=MAX_PIXELS&&framePixels*columns*Math.ceil(frames/columns)<=MAX_PIXELS,'Decoded frames and output sheet must stay within 16 million pixels.');
  const {data,info}=await sharp(bytes,{animated:true,limitInputPixels:MAX_PIXELS}).ensureAlpha().raw().toBuffer({resolveWithObject:true});const height=info.pageHeight??Math.round(info.height/frames),width=info.width,rows=Math.ceil(frames/columns);
  ensure(width*height*frames<=MAX_PIXELS&&width*height*columns*rows<=MAX_PIXELS,'Decoded frames and output sheet must stay within 16 million pixels.');
  const layers=Array.from({length:frames},(_,i)=>({input:data.subarray(i*width*height*4,(i+1)*width*height*4),raw:{width,height,channels:4},left:(i%columns)*width,top:Math.floor(i/columns)*height}));
  const output=await sharp({create:{width:width*columns,height:height*rows,channels:4,background:{r:0,g:0,b:0,alpha:0}}}).composite(layers).png().toBuffer();return binaryResult(output,'sprite-sheet.png','image/png');
}
export function monoWav(input) {
  const bytes=Buffer.from(input);ensure(bytes.length>=44&&bytes.toString('ascii',0,4)==='RIFF'&&bytes.toString('ascii',8,12)==='WAVE','Choose an uncompressed RIFF/WAVE audio file.');
  const end=bytes.readUInt32LE(4)+8;ensure(end<=bytes.length&&end>=44,'Invalid WAV container length.');let format=null,data=null;
  for(let offset=12;offset+8<=end;){const name=bytes.toString('ascii',offset,offset+4),size=bytes.readUInt32LE(offset+4),start=offset+8;ensure(start+size<=end,'Truncated WAV chunk.');if(name==='fmt '){ensure(!format&&size>=16,'Invalid WAV format chunk.');format={code:bytes.readUInt16LE(start),channels:bytes.readUInt16LE(start+2),rate:bytes.readUInt32LE(start+4),byteRate:bytes.readUInt32LE(start+8),align:bytes.readUInt16LE(start+12),bits:bytes.readUInt16LE(start+14)};}if(name==='data'){ensure(!data,'Multiple WAV data chunks are unsupported.');data=bytes.subarray(start,start+size);}offset=start+size+(size%2);}
  ensure(format&&data,'WAV format or data chunk is missing.');const {code,channels,rate,bits,align,byteRate}=format;
  ensure((code===1&&[8,16,24,32].includes(bits)||code===3&&bits===32)&&[1,2].includes(channels),'Use mono/stereo PCM 8/16/24/32-bit or IEEE float32 WAV.');
  ensure(rate>=8000&&rate<=192000&&align===channels*bits/8&&byteRate===rate*align&&data.length%align===0,'Invalid WAV sample rate or block alignment.');
  const frames=data.length/align;ensure(frames>0&&44+frames*2<=MAX_FILE_BYTES,'Mono output must contain samples and stay within 4 MiB.');const output=Buffer.alloc(44+frames*2);
  output.write('RIFF',0);output.writeUInt32LE(output.length-8,4);output.write('WAVEfmt ',8);output.writeUInt32LE(16,16);output.writeUInt16LE(1,20);output.writeUInt16LE(1,22);output.writeUInt32LE(rate,24);output.writeUInt32LE(rate*2,28);output.writeUInt16LE(2,32);output.writeUInt16LE(16,34);output.write('data',36);output.writeUInt32LE(frames*2,40);
  const sample=offset=>code===3?data.readFloatLE(offset):bits===8?(data[offset]-128)/128:bits===16?data.readInt16LE(offset)/32768:bits===24?data.readIntLE(offset,3)/8388608:data.readInt32LE(offset)/2147483648;
  for(let frame=0;frame<frames;frame++){let total=0;for(let channel=0;channel<channels;channel++){const value=sample(frame*align+channel*bits/8);ensure(Number.isFinite(value),'WAV contains a non-finite sample.');total+=value/channels;}const value=Math.max(-1,Math.min(1,total));output.writeInt16LE(Math.max(-32768,Math.min(32767,Math.round(value*32768))),44+frame*2);}
  return output;
}
async function textDocx(text) {
  ensure(text.trim()&&text.length<=20000,'Use between 1 and 20,000 plain-text characters.');ensure(!/[\u0000-\u0008\u000b\u000c\u000e-\u001f\ufffe\uffff\ud800-\udfff]/u.test(text),'Unsupported XML control character.');
  const children=text.replace(/\r\n?/g,'\n').split(/\n\n+/).map(paragraph=>new Paragraph({children:paragraph.split('\n').map((line,index)=>new TextRun({text:line,...(index?{break:1}:{})}))}));
  return binaryResult(await Packer.toBuffer(new Document({sections:[{children}]})),'document.docx','application/vnd.openxmlformats-officedocument.wordprocessingml.document');
}
async function examplePptx() {
  const zip=new JSZip();
  zip.file('[Content_Types].xml','<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/><Override PartName="/ppt/slides/slide1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/></Types>');
  zip.file('ppt/presentation.xml','<?xml version="1.0" encoding="UTF-8"?><p:presentation xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"><p:sldIdLst><p:sldId id="256" r:id="rId1" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"/></p:sldIdLst></p:presentation>');
  zip.file('ppt/slides/slide1.xml','<?xml version="1.0" encoding="UTF-8"?><p:sld xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"><p:cSld><p:spTree><p:sp><p:txBody><a:p><a:r><a:t>Example presentation slide</a:t></a:r></a:p><a:p><a:r><a:t>Text extracted to a PDF outline.</a:t></a:r></a:p></p:txBody></p:sp></p:spTree></p:cSld></p:sld>');
  return zip.generateAsync({type:'nodebuffer',compression:'DEFLATE'});
}
export async function convert(slug,files=[],text='',values={},second='',runtime) {
  ensure(SERVER_SLUGS.includes(slug),'Unknown conversion.');ensure(typeof text==='string'&&typeof second==='string'&&text.length+second.length<=2*1024*1024,'Use at most 2 MiB of input text.');
  ensure(Array.isArray(files)&&files.length<=8&&files.reduce((n,f)=>n+f.bytes.length,0)<=MAX_FILE_BYTES,'Use at most eight files and 4 MiB combined input.');
  const textSlugs=['json-to-xlsx','csv-to-xlsx','html-table-to-xlsx','text-to-pdf','json5-to-json','json-to-toml','text-to-docx',...EXTENDED_TEXT_SLUGS,...PROTOCOL_TEXT_SLUGS];
  ensure(textSlugs.includes(slug)?files.length===0:['pdf-merger',...EXTENDED_MULTI_SLUGS].includes(slug)?files.length>=2:files.length===1,'Choose the required input files.');
  let result;
  if(['word-to-pdf','pdf-to-excel','jpg-to-pdf','png-to-svg','ppt-to-pdf'].includes(slug))result=await convertRequestedFile(slug,files[0].bytes,values);
  else if(POPULAR_SLUGS.includes(slug))result=await convertPopular(slug,files,text,values,sharedHelpers());
  else if(PROTOCOL_SLUGS.includes(slug))result=await convertProtocol(slug,files,text,values,{...sharedHelpers(),second});
  else if(EXTENDED_SLUGS.includes(slug))result=await convertExtended(slug,files,text,values,sharedHelpers());
  else if(slug==='json-to-xlsx')result=await jsonWorkbook(text);
  else if(slug==='csv-to-xlsx')result=await csvWorkbook(text);
  else if(slug==='html-table-to-xlsx')result=await csvWorkbook(htmlTableCsv(text));
  else if(slug==='xlsx-to-csv'||slug==='xlsx-to-json'){
    const table=await readWorksheet(files[0].bytes,values);if(slug==='xlsx-to-csv')result=textResult(csv(table),'worksheet.csv','text/csv;charset=utf-8');
    else{const [first,...body]=table,headers=first.map(v=>String(v??''));ensure(headers.every(h=>h.trim())&&new Set(headers).size===headers.length,'JSON headers must be unique and nonblank.');result=jsonResult(body.filter(row=>row.some(v=>v!==null)).map(row=>Object.fromEntries(headers.map((h,i)=>[h,row[i]]))));}
  }else if(slug==='docx-converter'){
    await validateOfficeZip(files[0].bytes,'docx');const format=pick(values,'format',['text','html']),options={externalFileAccess:false,convertImage:mammoth.images.imgElement(async()=>({src:'data:,'}))};
    const output=await mammoth.convertToHtml({buffer:Buffer.from(files[0].bytes)},options);
    const cleanHtml=sanitizeHtml(output.value,{allowedTags:['p','h1','h2','h3','h4','h5','h6','strong','em','u','s','ul','ol','li','a','table','thead','tbody','tr','td','th','br','blockquote','pre','code'],allowedAttributes:{a:['href'],td:['colspan','rowspan'],th:['colspan','rowspan']},allowedSchemes:['http','https','mailto'],allowProtocolRelative:false});
    const value=format==='html'?cleanHtml:htmlToText(cleanHtml,{wordwrap:false,selectors:[{selector:'a',options:{ignoreHref:true}},...['h1','h2','h3','h4','h5','h6'].map(selector=>({selector,options:{uppercase:false}}))]});
    result=textResult(value,'document.'+(format==='html'?'html':'txt'),format==='html'?'text/html;charset=utf-8':'text/plain;charset=utf-8');
  }else if(slug==='text-to-pdf')result=await textPdf(text,values);
  else if(slug.startsWith('pdf-'))result=await transformPdf(slug,files,values);
  else if(['image-to-avif','tiff-to-image','gif-sprite-sheet'].includes(slug))result=await convertImage(slug,files[0].bytes,values);
  else if(slug==='json5-to-json'){const value=JSON5.parse(text);validateData(value);result=jsonResult(value);}
  else if(slug==='json-to-toml'){const value=JSON.parse(text);ensure(value&&typeof value==='object'&&!Array.isArray(value),'TOML input must be a JSON object.');validateData(value,0,true);result=textResult(stringifyToml(value),'config.toml','application/toml;charset=utf-8');}
  else if(slug==='text-encoding-converter'){
    const options=['utf8','utf16le','utf16be','win1251','win1252','shift_jis'],from=pick(values,'from',options),to=pick(values,'to',options),source=Buffer.from(files[0].bytes);
    let decoded=iconv.decode(source,from,{stripBOM:false});if(decoded.charCodeAt(0)===0xfeff)decoded=decoded.slice(1);
    const removeBom=buffer=>from==='utf8'&&buffer.subarray(0,3).equals(Buffer.from([239,187,191]))?buffer.subarray(3):['utf16le','utf16be'].includes(from)&&buffer.length>=2&&[0xfeff,0xfffe].includes(buffer.readUInt16BE(0))?buffer.subarray(2):buffer;
    ensure(decoded.length<=2000000&&iconv.encode(decoded,from).equals(removeBom(source)),'Malformed source bytes or a lossy source decoding. Check the chosen charset.');
    const output=iconv.encode(decoded,to);ensure(iconv.decode(output,to,{stripBOM:false})===decoded,'Target charset cannot represent all characters without loss.');result=binaryResult(output,'converted-'+to+'.txt','application/octet-stream');
  }else if(slug==='text-to-docx')result=await textDocx(text);
  else if(slug==='stereo-to-mono-wav')result=binaryResult(monoWav(files[0].bytes),'mono.wav','audio/wav');
  else throw new InputError('Unsupported conversion.');
  if(result.bytes.length>MAX_FILE_BYTES)throw new InputError('Converted output exceeds 4 MiB. Try a smaller input or lower output quality.',413);return result;
}
export async function example(slug,runtime) {
  ensure(SERVER_SLUGS.includes(slug),'Unknown example.');
  if(POPULAR_SLUGS.includes(slug))return examplePopular(slug,{...sharedHelpers(),defaultPdf:()=>example('pdf-merger'),defaultExcel:()=>example('xlsx-to-csv')});
  if(PROTOCOL_SLUGS.includes(slug))return exampleProtocol(slug,sharedHelpers());
  if(EXTENDED_SLUGS.includes(slug))return exampleExtended(slug,{...sharedHelpers(),defaultPdf:()=>example('pdf-merger'),defaultWav:()=>example('stereo-to-mono-wav')});
  if(slug==='word-to-pdf'){const doc=new Document({sections:[{children:[new Paragraph({children:[new TextRun('Example Word document')]}),new Paragraph({children:[new TextRun('This sample converts to a text PDF.')]} )]}]});return binaryResult(await Packer.toBuffer(doc),'example.docx','application/vnd.openxmlformats-officedocument.wordprocessingml.document');}
  if(slug==='ppt-to-pdf')return binaryResult(await examplePptx(),'example.pptx','application/vnd.openxmlformats-officedocument.presentationml.presentation');
  if(slug==='pdf-to-excel'){const doc=await PDFDocument.create();const page=doc.addPage([320,200]);page.drawText('Example PDF text',{x:24,y:150,size:20});return binaryResult(await doc.save(),'example.pdf','application/pdf');}
  if(slug==='jpg-to-pdf')return binaryResult(await sharp({create:{width:320,height:200,channels:3,background:'#dfede4'}}).jpeg().toBuffer(),'example.jpg','image/jpeg');
  if(slug==='png-to-svg')return binaryResult(await sharp({create:{width:24,height:24,channels:4,background:'#2878a5'}}).png().toBuffer(),'example.png','image/png');
  if(slug.startsWith('xlsx-')){const result=await jsonWorkbook('[{"id":"001","name":"Ada","score":95},{"id":"002","name":"Grace","score":98}]');return {...result,name:'example.xlsx'};}
  if(slug==='docx-converter')return {...await textDocx('Example document\n\nHello, world!\nВітаємо з Word.'),name:'example.docx'};
  if(slug.startsWith('pdf-')){const doc=await PDFDocument.create();doc.setTitle('Example title');doc.setAuthor('Example author');for(let i=1;i<=2;i++){const page=doc.addPage([300,400]);page.drawText('Example page '+i,{x:30,y:340,size:18});page.drawRectangle({x:30,y:40,width:80,height:50,color:rgb(i===1?1:0,0,i===2?1:0)});}return binaryResult(await doc.save(),'example.pdf','application/pdf');}
  if(slug==='image-to-avif')return binaryResult(await sharp({create:{width:32,height:24,channels:4,background:{r:240,g:80,b:40,alpha:.8}}}).png().toBuffer(),'example.png','image/png');
  if(slug==='tiff-to-image')return binaryResult(await sharp({create:{width:32,height:24,channels:3,background:'#3366cc'}}).tiff().toBuffer(),'example.tiff','image/tiff');
  if(slug==='gif-sprite-sheet')return binaryResult(await sharp({create:{width:24,height:24,channels:4,background:'#ff6633'}}).gif().toBuffer(),'example.gif','image/gif');
  if(slug==='text-encoding-converter')return textResult('Hello, world!\nВітаємо!\n','example.txt');
  if(slug==='stereo-to-mono-wav'){const frames=800,bytes=Buffer.alloc(44+frames*4);bytes.write('RIFF');bytes.writeUInt32LE(bytes.length-8,4);bytes.write('WAVEfmt ',8);bytes.writeUInt32LE(16,16);bytes.writeUInt16LE(1,20);bytes.writeUInt16LE(2,22);bytes.writeUInt32LE(8000,24);bytes.writeUInt32LE(32000,28);bytes.writeUInt16LE(4,32);bytes.writeUInt16LE(16,34);bytes.write('data',36);bytes.writeUInt32LE(frames*4,40);for(let i=0;i<frames;i++){bytes.writeInt16LE(Math.round(Math.sin(i*2*Math.PI*440/8000)*16000),44+i*4);bytes.writeInt16LE(Math.round(Math.sin(i*2*Math.PI*440/8000)*8000),46+i*4);}return binaryResult(bytes,'example.wav','audio/wav');}
  throw new InputError('This tool provides its text example directly in the editor.');
}

function sharedHelpers(){return {ensure,pick,numeric,integer,textResult,binaryResult,jsonResult,validateData,loadPdf,embedFont,selectedPages,readWorksheet,validateOfficeZip,InputError};}
