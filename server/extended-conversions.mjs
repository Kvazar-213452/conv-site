import { PDFDocument, PDFName, PDFDict, PDFTextField, PDFCheckBox, PDFDropdown, PDFOptionList, PDFRadioGroup } from 'pdf-lib';
import { createCanvas } from '@napi-rs/canvas';
import sharp from 'sharp';
import JSZip from 'jszip';
import yauzl from 'yauzl';
import MarkdownIt from 'markdown-it';
import sanitizeHtml from 'sanitize-html';
import { parseDocument } from 'htmlparser2';
import { parse as parseCsv } from 'csv-parse/sync';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, ExternalHyperlink, LevelFormat } from 'docx';
import { randomUUID } from 'node:crypto';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

export const EXTENDED_SLUGS=['pdf-to-text','pdf-to-image','pdf-contact-sheet','pdf-form-to-json','pdf-form-filler','pdf-crop','pdf-grayscale','bmp-converter','image-contact-sheet','transparent-png-trimmer','image-exif-remover','wav-trimmer','wav-normalizer','zip-creator','zip-extractor','markdown-to-docx','html-to-docx','csv-to-vcard','csv-to-icalendar','json-to-geojson'];
export const EXTENDED_TEXT_SLUGS=['markdown-to-docx','html-to-docx','csv-to-vcard','csv-to-icalendar','json-to-geojson'];
export const EXTENDED_MULTI_SLUGS=['image-contact-sheet','zip-creator'];
const PIXELS=16000000;
export async function openRenderedPdf(bytes,h){
  await h.loadPdf(bytes);
  const pdfjs=await import('pdfjs-dist/legacy/build/pdf.mjs');
  const root=path.join(process.cwd(),'node_modules/pdfjs-dist');
  pdfjs.GlobalWorkerOptions.workerSrc=pathToFileURL(path.join(root,'legacy/build/pdf.worker.mjs')).href;
  class BoundedCanvasFactory {
    getNoAlphaContext(canvas){return canvas.getContext('2d',{alpha:false,willReadFrequently:true});}
    create(width,height){h.ensure(Number.isFinite(width)&&Number.isFinite(height)&&width>0&&height>0&&width*height<=PIXELS,'PDF canvas exceeds 16 million pixels.');const canvas=createCanvas(Math.ceil(width),Math.ceil(height));return {canvas,context:canvas.getContext('2d')};}
    reset(target,width,height){h.ensure(width>0&&height>0&&width*height<=PIXELS,'PDF canvas exceeds 16 million pixels.');target.canvas.width=Math.ceil(width);target.canvas.height=Math.ceil(height);}
    destroy(target){target.canvas.width=0;target.canvas.height=0;target.canvas=null;target.context=null;}
  }
  return pdfjs.getDocument({data:Uint8Array.from(bytes),isEvalSupported:false,enableXfa:false,useSystemFonts:false,disableFontFace:true,useWorkerFetch:false,isOffscreenCanvasSupported:false,verbosity:0,maxImageSize:PIXELS,CanvasFactory:BoundedCanvasFactory,cMapUrl:root+'/cmaps/',cMapPacked:true,standardFontDataUrl:root+'/standard_fonts/',wasmUrl:root+'/wasm/'}).promise;
}
export async function renderPage(doc,index,scale,h){
  const page=await doc.getPage(index),viewport=page.getViewport({scale}),width=Math.ceil(viewport.width),height=Math.ceil(viewport.height);
  h.ensure(width>0&&height>0&&width*height<=PIXELS,'Rendered page exceeds 16 million pixels.');const canvas=createCanvas(width,height);
  try{await page.render({canvasContext:canvas.getContext('2d'),canvas,viewport,background:'rgb(255,255,255)'}).promise;return {bytes:canvas.toBuffer('image/png'),width,height,points:page.getViewport({scale:1})};}finally{canvas.width=0;canvas.height=0;page.cleanup();}
}
async function renderedPdf(slug,bytes,values,h){
  const doc=await openRenderedPdf(bytes,h);
  try{
    if(slug==='pdf-to-text'){
      const pages=[];for(let i=1;i<=doc.numPages;i++){const page=await doc.getPage(i),content=await page.getTextContent();let text='';for(const item of content.items){if(typeof item.str!=='string')continue;text+=item.str+(item.hasEOL?'\n':' ');}pages.push(text.trimEnd());page.cleanup();}return h.textResult(pages.join('\n\f\n'),'extracted.txt');
    }
    if(slug==='pdf-to-image'){const page=h.integer(values,'page',1,doc.numPages),dpi=Number(h.pick(values,'dpi',['72','144'])),format=h.pick(values,'format',['png','jpeg']),image=await renderPage(doc,page,dpi/72,h);return h.binaryResult(format==='png'?image.bytes:await sharp(image.bytes).jpeg({quality:90}).toBuffer(),'page-'+page+(format==='png'?'.png':'.jpg'),'image/'+format);}
    h.ensure(doc.numPages<=20,'This rendering operation supports at most 20 pages.');
    if(slug==='pdf-contact-sheet'){
      const columns=Math.min(h.integer(values,'columns',1,6),doc.numPages),cell=h.integer(values,'thumbWidth',80,400),height=Math.round(cell*1.4),gap=12,rows=Math.ceil(doc.numPages/columns),width=columns*(cell+gap)+gap,totalHeight=rows*(height+gap)+gap;
      h.ensure(width*totalHeight<=PIXELS,'Contact sheet exceeds 16 million pixels.');const layers=[];
      for(let i=1;i<=doc.numPages;i++){const page=await doc.getPage(i),view=page.getViewport({scale:1}),scale=Math.min(cell/view.width,height/view.height),rendered=await renderPage(doc,i,scale,h);layers.push({input:await sharp(rendered.bytes).resize(cell,height,{fit:'contain',background:'#ffffff'}).png().toBuffer(),left:gap+((i-1)%columns)*(cell+gap),top:gap+Math.floor((i-1)/columns)*(height+gap)});}
      return h.binaryResult(await sharp({create:{width,height:totalHeight,channels:3,background:'#ffffff'}}).composite(layers).png().toBuffer(),'pdf-contact-sheet.png','image/png');
    }
    const output=await PDFDocument.create();for(let i=1;i<=doc.numPages;i++){const image=await renderPage(doc,i,1,h),gray=await sharp(image.bytes).grayscale().png().toBuffer(),embedded=await output.embedPng(gray),page=output.addPage([image.points.width,image.points.height]);page.drawImage(embedded,{x:0,y:0,width:page.getWidth(),height:page.getHeight()});}return h.binaryResult(await output.save(),'grayscale.pdf','application/pdf');
  }finally{await doc.loadingTask.destroy();}
}
async function pdfForms(slug,bytes,text,values,h){
  const doc=await h.loadPdf(bytes);
  if(slug==='pdf-crop'){const margins=Object.fromEntries(['top','right','bottom','left'].map(k=>[k,h.numeric(values,k,0,500)]));for(const page of doc.getPages()){const crop=page.getCropBox(),width=crop.width-margins.left-margins.right,height=crop.height-margins.top-margins.bottom;h.ensure(width>0&&height>0,'Margins leave no visible area on a page.');page.setCropBox(crop.x+margins.left,crop.y+margins.bottom,width,height);}return h.binaryResult(await doc.save(),'cropped.pdf','application/pdf');}
  const acro=doc.catalog.lookupMaybe(PDFName.of('AcroForm'),PDFDict);h.ensure(!acro?.has(PDFName.of('XFA')),'XFA forms are unsupported.');
  const form=doc.getForm(),fields=form.getFields();h.ensure(fields.length<=1000,'Use at most 1,000 form fields.');
  const describe=field=>{let value=null,options;const type=field instanceof PDFTextField?'text':field instanceof PDFCheckBox?'checkbox':field instanceof PDFRadioGroup?'radio':field instanceof PDFDropdown?'dropdown':field instanceof PDFOptionList?'list':'unsupported';
    if(type==='text')value=field.getText()??'';else if(type==='checkbox')value=field.isChecked();else if(type==='radio')value=field.getSelected()??null;else if(type==='dropdown'||type==='list')value=field.getSelected();if(['radio','dropdown','list'].includes(type))options=field.getOptions();return {name:field.getName(),type,value,readOnly:field.isReadOnly(),...(options?{options}:{})};};
  if(slug==='pdf-form-to-json'){const described=fields.map(describe);return h.jsonResult({values:Object.fromEntries(described.filter(f=>f.type!=='unsupported').map(f=>[f.name,f.value])),fields:described},'form-fields.json');}
  const map=JSON.parse(text);h.validateData(map);h.ensure(map&&typeof map==='object'&&!Array.isArray(map)&&Object.keys(map).length>0,'Provide a nonempty JSON object mapping field names to values.');h.ensure(fields.length>0,'This PDF does not contain AcroForm fields.');let fontText='';
  for(const [name,value]of Object.entries(map)){const field=fields.find(f=>f.getName()===name);h.ensure(field,'Unknown form field: '+name);h.ensure(!field.isReadOnly(),'Read-only field: '+name);
    if(field instanceof PDFTextField){h.ensure(typeof value==='string','Text fields require string values.');field.setText(value);fontText+=value;}
    else if(field instanceof PDFCheckBox){h.ensure(typeof value==='boolean','Checkbox fields require booleans.');if(value)field.check();else field.uncheck();}
    else if(field instanceof PDFDropdown||field instanceof PDFOptionList||field instanceof PDFRadioGroup){const selected=Array.isArray(value)?value:[value];h.ensure(selected.every(v=>typeof v==='string'&&field.getOptions().includes(v)),'Select only available options for '+name);h.ensure(!(field instanceof PDFRadioGroup)&&(!(field instanceof PDFDropdown)||field.isMultiselect())||selected.length<=1,'This field accepts one option.');if(selected.length)field.select(field instanceof PDFRadioGroup?selected[0]:selected);else{h.ensure(!(field instanceof PDFRadioGroup),'A radio group needs one selected option.');field.clear();}fontText+=selected.join('');}
    else throw new h.InputError('Unsupported field type: '+name);
  }
  const font=await h.embedFont(doc,fontText);form.updateFieldAppearances(font);if(h.pick(values,'flatten',['true','false'])==='true')form.flatten();return h.binaryResult(await doc.save(),'filled-form.pdf','application/pdf');
}
async function rasterSource(bytes,h){
  const head=Buffer.from(bytes).subarray(0,12),png=head.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])),jpg=head[0]===255&&head[1]===216&&head[2]===255,webp=head.toString('ascii',0,4)==='RIFF'&&head.toString('ascii',8,12)==='WEBP';h.ensure(png||jpg||webp,'Choose a still PNG, JPEG or WebP image.');const metadata=await sharp(bytes,{limitInputPixels:PIXELS}).metadata();h.ensure(!metadata.pages||metadata.pages===1,'Animated images are unsupported.');return metadata;
}
export function decodeBmp(bytes,h){
  const b=Buffer.from(bytes);h.ensure(b.length>=54&&b.toString('ascii',0,2)==='BM','Invalid BMP header.');const offset=b.readUInt32LE(10),dib=b.readUInt32LE(14);h.ensure(dib>=40&&14+dib<=b.length&&offset>=14+dib,'Unsupported BMP header.');const width=b.readInt32LE(18),signedHeight=b.readInt32LE(22),height=Math.abs(signedHeight),bits=b.readUInt16LE(28);h.ensure(width>0&&height>0&&width*height<=PIXELS&&[24,32].includes(bits)&&b.readUInt16LE(26)===1&&b.readUInt32LE(30)===0,'Use uncompressed 24/32-bit BI_RGB BMP within 16 million pixels.');const stride=Math.ceil(width*bits/32)*4;h.ensure(offset+stride*height<=b.length,'Truncated BMP pixels.');const data=Buffer.alloc(width*height*4);
  for(let y=0;y<height;y++)for(let x=0;x<width;x++){const from=offset+(signedHeight<0?y:height-1-y)*stride+x*bits/8,to=(y*width+x)*4;data[to]=b[from+2];data[to+1]=b[from+1];data[to+2]=b[from];data[to+3]=255;}return {data,width,height};
}
export async function encodeBmp(bytes,h){
  await rasterSource(bytes,h);const {data,info}=await sharp(bytes,{limitInputPixels:PIXELS}).autoOrient().flatten({background:'#ffffff'}).removeAlpha().toColourspace('srgb').raw().toBuffer({resolveWithObject:true});const width=info.width,height=info.height,stride=Math.ceil(width*3/4)*4,size=54+stride*height;h.ensure(size<=4*1024*1024,'Uncompressed BMP output exceeds 4 MiB.');const out=Buffer.alloc(size);out.write('BM');out.writeUInt32LE(size,2);out.writeUInt32LE(54,10);out.writeUInt32LE(40,14);out.writeInt32LE(width,18);out.writeInt32LE(height,22);out.writeUInt16LE(1,26);out.writeUInt16LE(24,28);out.writeUInt32LE(stride*height,34);
  for(let y=0;y<height;y++)for(let x=0;x<width;x++){const from=(y*width+x)*info.channels,to=54+(height-1-y)*stride+x*3;out[to]=data[from+2];out[to+1]=data[from+1];out[to+2]=data[from];}return out;
}
async function imageTask(slug,files,values,h){
  if(slug==='bmp-converter'){if(h.pick(values,'direction',['bmp-png','image-bmp'])==='image-bmp')return h.binaryResult(await encodeBmp(files[0].bytes,h),'converted.bmp','image/bmp');const image=decodeBmp(files[0].bytes,h);return h.binaryResult(await sharp(image.data,{raw:{width:image.width,height:image.height,channels:4}}).png().toBuffer(),'converted.png','image/png');}
  if(slug==='image-contact-sheet'){const columns=Math.min(h.integer(values,'columns',1,4),files.length),cell=h.integer(values,'cell',80,600),gap=12,width=columns*(cell+gap)+gap,height=Math.ceil(files.length/columns)*(cell+gap)+gap;h.ensure(width*height<=PIXELS,'Image contact sheet exceeds 16 million pixels.');const layers=[];for(let i=0;i<files.length;i++){await rasterSource(files[i].bytes,h);layers.push({input:await sharp(files[i].bytes,{limitInputPixels:PIXELS}).autoOrient().resize(cell,cell,{fit:'contain',background:'#ffffff'}).flatten({background:'#ffffff'}).png().toBuffer(),left:gap+i%columns*(cell+gap),top:gap+Math.floor(i/columns)*(cell+gap)});}return h.binaryResult(await sharp({create:{width,height,channels:3,background:'#ffffff'}}).composite(layers).png().toBuffer(),'image-contact-sheet.png','image/png');}
  const bytes=files[0].bytes,metadata=await rasterSource(bytes,h);
  if(slug==='transparent-png-trimmer'){h.ensure(metadata.format==='png','Choose a PNG file.');const threshold=h.integer(values,'threshold',0,254),{data,info}=await sharp(bytes,{limitInputPixels:PIXELS}).autoOrient().toColourspace('srgb').ensureAlpha().raw().toBuffer({resolveWithObject:true});let left=info.width,top=info.height,right=-1,bottom=-1;for(let y=0;y<info.height;y++)for(let x=0;x<info.width;x++)if(data[(y*info.width+x)*4+3]>threshold){left=Math.min(left,x);top=Math.min(top,y);right=Math.max(right,x);bottom=Math.max(bottom,y);}h.ensure(right>=left,'The PNG is completely transparent at this threshold.');return h.binaryResult(await sharp(data,{raw:{width:info.width,height:info.height,channels:4}}).extract({left,top,width:right-left+1,height:bottom-top+1}).png().toBuffer(),'trimmed.png','image/png');}
  let image=sharp(bytes,{limitInputPixels:PIXELS}).autoOrient();image=metadata.format==='jpeg'?image.jpeg({quality:95}):metadata.format==='webp'?image.webp({quality:95}):image.png();return h.binaryResult(await image.toBuffer(),'metadata-removed.'+(metadata.format==='jpeg'?'jpg':metadata.format),'image/'+metadata.format);
}
export function readPcm(bytes,h){
  const b=Buffer.from(bytes);h.ensure(b.length>=44&&b.toString('ascii',0,4)==='RIFF'&&b.toString('ascii',8,12)==='WAVE','Choose an integer PCM RIFF/WAVE file.');const end=b.readUInt32LE(4)+8;h.ensure(end<=b.length&&end>=44,'Invalid WAV length.');let format=null,data=null;
  for(let position=12;position+8<=end;){const name=b.toString('ascii',position,position+4),size=b.readUInt32LE(position+4),start=position+8;h.ensure(start+size<=end,'Truncated WAV chunk.');if(name==='fmt '){h.ensure(!format&&size>=16,'Invalid WAV format.');format={code:b.readUInt16LE(start),channels:b.readUInt16LE(start+2),rate:b.readUInt32LE(start+4),byteRate:b.readUInt32LE(start+8),align:b.readUInt16LE(start+12),bits:b.readUInt16LE(start+14)};}if(name==='data'){h.ensure(!data,'Multiple WAV data chunks are unsupported.');data=b.subarray(start,start+size);}position=start+size+size%2;}
  h.ensure(format&&data&&format.code===1&&[1,2].includes(format.channels)&&[8,16,24,32].includes(format.bits),'Use mono/stereo integer PCM at 8, 16, 24 or 32 bits.');h.ensure(format.rate>=8000&&format.rate<=192000&&format.align===format.channels*format.bits/8&&format.byteRate===format.rate*format.align&&data.length>0&&data.length%format.align===0,'Invalid PCM sample layout.');return {...format,data,frames:data.length/format.align};
}
function pcmContainer(pcm,data,bits=pcm.bits){const align=pcm.channels*bits/8,padding=data.length%2,out=Buffer.alloc(44+data.length+padding);out.write('RIFF');out.writeUInt32LE(out.length-8,4);out.write('WAVEfmt ',8);out.writeUInt32LE(16,16);out.writeUInt16LE(1,20);out.writeUInt16LE(pcm.channels,22);out.writeUInt32LE(pcm.rate,24);out.writeUInt32LE(pcm.rate*align,28);out.writeUInt16LE(align,32);out.writeUInt16LE(bits,34);out.write('data',36);out.writeUInt32LE(data.length,40);data.copy(out,44);return out;}
function audioTask(slug,bytes,values,h){
  const pcm=readPcm(bytes,h);
  if(slug==='wav-trimmer'){const duration=pcm.frames/pcm.rate,start=h.numeric(values,'start',0,duration),end=values.end?.trim()?Number(values.end):duration;h.ensure(Number.isFinite(end)&&end>start&&end<=duration,'Select an ordered time range within the recording.');const first=Math.floor(start*pcm.rate),last=Math.floor(end*pcm.rate+1e-8);h.ensure(last>first,'The range must contain at least one sample frame.');return h.binaryResult(pcmContainer(pcm,pcm.data.subarray(first*pcm.align,last*pcm.align)),'trimmed.wav','audio/wav');}
  const target=10**(h.numeric(values,'db',-24,0)/20),sample=i=>pcm.bits===8?(pcm.data[i]-128)/128:pcm.data.readIntLE(i*pcm.bits/8,pcm.bits/8)/2**(pcm.bits-1),count=pcm.frames*pcm.channels;let peak=0;for(let i=0;i<count;i++)peak=Math.max(peak,Math.abs(sample(i)));const gain=peak?target/peak:1,data=Buffer.alloc(count*2);for(let i=0;i<count;i++)data.writeInt16LE(Math.max(-32768,Math.min(32767,Math.round(sample(i)*gain*32768))),i*2);return h.binaryResult(pcmContainer(pcm,data,16),'normalized.wav','audio/wav');
}
function safeName(name,h){const leaf=name.replace(/\\/g,'/').split('/').at(-1).replace(/[\u0000-\u001f\u007f<>:"|?*]/g,'_').replace(/[. ]+$/g,'');h.ensure(Buffer.byteLength(leaf)<=255,'Filename is too long.');h.ensure(leaf&&leaf!=='.'&&leaf!=='..','File needs a safe leaf name.');return leaf;}
async function archiveTask(slug,files,values,h){
  if(slug==='zip-creator'){const zip=new JSZip(),names=new Set();for(const file of files){const name=safeName(file.name,h);h.ensure(!names.has(name),'Two files have the same normalized name: '+name);names.add(name);zip.file(name,file.bytes);}return h.binaryResult(await zip.generateAsync({type:'nodebuffer',compression:'DEFLATE',compressionOptions:{level:6}}),'archive.zip','application/zip');}
  const zip=await new Promise((resolve,reject)=>yauzl.fromBuffer(Buffer.from(files[0].bytes),{lazyEntries:true,validateEntrySizes:true},(error,result)=>error?reject(new h.InputError('Invalid ZIP archive.')):resolve(result)));
  const selection=values.entry??'';return new Promise((resolve,reject)=>{let done=false,total=0,count=0,selected=null;const entries=[];
    const fail=message=>{if(done)return;done=true;zip.close();reject(new h.InputError(message));};
    zip.on('error',()=>fail('Invalid ZIP entry or archive.'));
    zip.on('end',()=>{if(done)return;done=true;if(selection){if(!selected)return reject(new h.InputError('Entry not found. Leave the path blank to list the archive.'));resolve(h.binaryResult(selected.bytes,safeName(selected.name,h),'application/octet-stream'));}else resolve(h.jsonResult({entries},'archive-entries.json'));});
    zip.on('entry',entry=>{if(++count>1000||entry.uncompressedSize>4*1024*1024||(total+=entry.uncompressedSize)>64*1024*1024)return fail('ZIP exceeds 1,000 entries, 4 MiB per entry or 64 MiB total expanded size.');if(entry.generalPurposeBitFlag&1)return fail('Encrypted ZIP entries are unsupported.');if(entries.some(e=>e.path===entry.fileName))return fail('Duplicate ZIP paths are unsupported.');entries.push({path:entry.fileName,size:entry.uncompressedSize,compressedSize:entry.compressedSize,directory:entry.fileName.endsWith('/')});
      if(entry.fileName!==selection){zip.readEntry();return;}if(entry.fileName.endsWith('/'))return fail('Select a file entry, not a directory.');zip.openReadStream(entry,(error,stream)=>{if(error)return fail('Could not open selected ZIP entry.');const chunks=[];let length=0;stream.on('data',chunk=>{length+=chunk.length;if(length>4*1024*1024){stream.destroy();fail('Extracted entry exceeds 4 MiB.');}else chunks.push(chunk);});stream.on('error',()=>fail('Selected ZIP entry is corrupt or exceeds its declared size.'));stream.on('end',()=>{if(!done){selected={name:entry.fileName,bytes:Buffer.concat(chunks)};zip.readEntry();}});});
    });zip.readEntry();
  });
}
function cleanDocumentHtml(input){return sanitizeHtml(input,{allowedTags:['p','h1','h2','h3','h4','h5','h6','strong','b','em','i','u','s','del','ul','ol','li','a','table','thead','tbody','tfoot','tr','td','th','br','blockquote','pre','code','div','span'],allowedAttributes:{a:['href'],td:['colspan','rowspan'],th:['colspan','rowspan']},allowedSchemes:['http','https','mailto'],allowProtocolRelative:false});}
async function richDocx(slug,text,h){
  h.ensure(text.trim()&&text.length<=20000&&!/[\u0000-\u0008\u000b\u000c\u000e-\u001f\ufffe\uffff\ud800-\udfff]/u.test(text),'Use 1–20,000 text characters without invalid XML controls.');
  const html=cleanDocumentHtml(slug==='markdown-to-docx'?new MarkdownIt({html:false,breaks:false,linkify:false}).render(text):text),root=parseDocument(html),paragraphs=[],numbering=[];let listId=0,cellCount=0;
  const plain=node=>node.type==='text'?node.data:(node.children??[]).map(plain).join('');
  const runs=(nodes,format={})=>nodes.flatMap(node=>{if(node.type==='text')return [new TextRun({text:node.data,...format})];if(node.name==='br')return [new TextRun({text:'',break:1})];const next={...format,...(['b','strong'].includes(node.name)?{bold:true}:{}),...(['i','em'].includes(node.name)?{italics:true}:{}),...(node.name==='u'?{underline:{}}:{}),...(['s','del'].includes(node.name)?{strike:true}:{}),...(node.name==='code'?{font:'Courier New'}:{})};if(node.name==='a'&&/^(https?:|mailto:)/.test(node.attribs?.href??''))return [new ExternalHyperlink({link:node.attribs.href,children:runs(node.children??[],next)})];return runs(node.children??[],next);});
  const walk=(nodes,target=paragraphs,depth=0)=>{h.ensure(depth<=6,'Lists and document structure exceed supported nesting.');for(const node of nodes){if(node.type==='text'){if(node.data.trim())target.push(new Paragraph({children:runs([node])}));continue;}const name=node.name;
      if(name==='table'){const rowNodes=[];const collect=n=>{if(n.name==='tr')rowNodes.push(n);else for(const child of n.children??[])collect(child);};collect(node);h.ensure(rowNodes.length<=100,'Use at most 100 rows in a table.');const rows=rowNodes.map(row=>new TableRow({children:row.children.filter(c=>['td','th'].includes(c.name)).map(cell=>{h.ensure(++cellCount<=1000,'Use at most 1,000 table cells.');h.ensure(!['colspan','rowspan'].some(k=>cell.attribs?.[k]&&cell.attribs[k]!=='1'),'Merged HTML table cells are unsupported.');const children=[];walk(cell.children??[],children,depth+1);return new TableCell({children:children.length?children:[new Paragraph('') ]});})}));if(rows.length)target.push(new Table({rows}));continue;}
      if(name==='ul'||name==='ol'){const ordered=name==='ol',reference='list-'+(++listId);if(ordered)numbering.push({reference,levels:Array.from({length:6},(_,level)=>({level,format:LevelFormat.DECIMAL,text:'%'+(level+1)+'.',style:{paragraph:{indent:{left:720*(level+1),hanging:260}}}}))});for(const item of (node.children??[]).filter(n=>n.name==='li')){const inline=(item.children??[]).filter(n=>!['ul','ol'].includes(n.name));target.push(new Paragraph({children:runs(inline),...(ordered?{numbering:{reference,level:Math.min(depth,5)}}:{bullet:{level:Math.min(depth,5)}})}));walk((item.children??[]).filter(n=>['ul','ol'].includes(n.name)),target,depth+1);}continue;}
      if(/^h[1-6]$/.test(name??'')){target.push(new Paragraph({heading:HeadingLevel['HEADING_'+name.slice(1)],children:runs(node.children??[])}));continue;}
      if(['p','pre','blockquote'].includes(name)){target.push(new Paragraph({children:name==='pre'?plain(node).split('\n').map((line,index)=>new TextRun({text:line,font:'Courier New',...(index?{break:1}:{})})):runs(node.children??[])}));continue;}
      walk(node.children??[],target,depth+1);
    }};
  h.ensure(!/[\u0000-\u0008\u000b\u000c\u000e-\u001f\ufffe\uffff\ud800-\udfff]/u.test(plain(root)),'Unsupported decoded XML control character.');
  walk(root.children);h.ensure(paragraphs.length>0,'No supported document content found.');const bytes=await Packer.toBuffer(new Document({numbering:{config:numbering},sections:[{children:paragraphs}]}));return h.binaryResult(bytes,'document.docx','application/vnd.openxmlformats-officedocument.wordprocessingml.document');
}
function csvRecords(text,h){let table;try{table=parseCsv(text,{bom:true,skip_empty_lines:true,relax_column_count:false,max_record_size:200000});}catch{throw new h.InputError('Provide rectangular comma-separated CSV with valid quoting.');}h.ensure(table.length>=2&&table.length<=1001,'Use between 1 and 1,000 CSV data rows.');const [headers,...rows]=table;h.ensure(headers.length&&headers.every(v=>v.trim())&&new Set(headers).size===headers.length&&table.length*headers.length<=50000,'Use unique nonblank headers and at most 50,000 CSV cells.');return rows.map(row=>Object.fromEntries(headers.map((key,i)=>[key,row[i]])));}
const escapeText=text=>String(text??'').replace(/\\/g,'\\\\').replace(/\r\n?|\n/g,'\\n').replace(/;/g,'\\;').replace(/,/g,'\\,');
export function foldLine(line){let output='',length=0;for(const character of line){const bytes=Buffer.byteLength(character);if(length+bytes>75){output+='\r\n ';length=1;}output+=character;length+=bytes;}return output;}
function csvCards(text,h){const records=csvRecords(text,h),lines=[];for(const record of records){h.ensure(Object.hasOwn(record,'givenName')&&Object.hasOwn(record,'familyName'),'CSV needs givenName and familyName headers.');const first=record.givenName.trim(),last=record.familyName.trim();h.ensure(first||last,'Each contact needs a name.');const email=record.email?.trim()??'',phone=record.phone?.trim()??'';h.ensure(!email||/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),'Invalid contact email.');h.ensure(!/[\r\n\u0000-\u001f]/.test(phone),'Phone values cannot contain line breaks or control characters.');lines.push('BEGIN:VCARD','VERSION:3.0','N:'+escapeText(last)+';'+escapeText(first)+';;;','FN:'+escapeText([first,last].filter(Boolean).join(' ')).replace(/\\;/g,';'));if(email)lines.push('EMAIL:'+escapeText(email));if(phone)lines.push('TEL:'+escapeText(phone));if(record.organization)lines.push('ORG:'+escapeText(record.organization));lines.push('END:VCARD');}return h.textResult(lines.map(foldLine).join('\r\n')+'\r\n','contacts.vcf','text/vcard;charset=utf-8');}
function csvCalendar(text,h){const records=csvRecords(text,h),lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Utilixio//CSV Calendar//EN','CALSCALE:GREGORIAN'],stamp=new Date().toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');
  const timestamp=value=>{h.ensure(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(value??'')&&!value.startsWith('0000'),'Use UTC timestamps with seconds ending in Z.');const date=new Date(value);h.ensure(Number.isFinite(date.getTime())&&date.toISOString()===value.replace('Z','.000Z'),'Invalid UTC calendar date or time.');return date;};
  for(const record of records){h.ensure(record.summary?.trim(),'Each event needs a summary.');const start=timestamp(record.start),end=timestamp(record.end);h.ensure(end>start,'Event end must be after start.');lines.push('BEGIN:VEVENT','UID:'+randomUUID()+'@utilixio.com','DTSTAMP:'+stamp,'DTSTART:'+record.start.replace(/[-:]/g,''),'DTEND:'+record.end.replace(/[-:]/g,''),'SUMMARY:'+escapeText(record.summary));if(record.location)lines.push('LOCATION:'+escapeText(record.location));if(record.description)lines.push('DESCRIPTION:'+escapeText(record.description));lines.push('END:VEVENT');}lines.push('END:VCALENDAR');return h.textResult(lines.map(foldLine).join('\r\n')+'\r\n','events.ics','text/calendar;charset=utf-8');}
function geoJson(text,values,h){const rows=JSON.parse(text);h.validateData(rows);h.ensure(Array.isArray(rows)&&rows.length<=10000,'Use a JSON array of at most 10,000 records.');h.ensure(values.latitude&&values.longitude&&values.latitude!==values.longitude,'Choose distinct latitude and longitude properties.');const coordinate=(value,min,max)=>{h.ensure(typeof value==='number'||typeof value==='string'&&/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(value.trim()),'Coordinates must be numeric values or plain numeric strings.');const n=Number(value);h.ensure(Number.isFinite(n)&&n>=min&&n<=max,'Coordinate is outside the latitude/longitude range.');return n;};return h.jsonResult({type:'FeatureCollection',features:rows.map(record=>{h.ensure(record&&typeof record==='object'&&!Array.isArray(record)&&Object.hasOwn(record,values.latitude)&&Object.hasOwn(record,values.longitude),'Every record needs both coordinate properties.');return {type:'Feature',geometry:{type:'Point',coordinates:[coordinate(record[values.longitude],-180,180),coordinate(record[values.latitude],-90,90)]},properties:Object.fromEntries(Object.entries(record).filter(([key])=>key!==values.latitude&&key!==values.longitude))};})},'locations.geojson');}
export async function convertExtended(slug,files,text,values,h){
  if(['pdf-to-text','pdf-to-image','pdf-contact-sheet','pdf-grayscale'].includes(slug))return renderedPdf(slug,files[0].bytes,values,h);
  if(['pdf-form-to-json','pdf-form-filler','pdf-crop'].includes(slug))return pdfForms(slug,files[0].bytes,text,values,h);
  if(['bmp-converter','image-contact-sheet','transparent-png-trimmer','image-exif-remover'].includes(slug))return imageTask(slug,files,values,h);
  if(slug==='wav-trimmer'||slug==='wav-normalizer')return audioTask(slug,files[0].bytes,values,h);
  if(slug==='zip-creator'||slug==='zip-extractor')return archiveTask(slug,files,values,h);
  if(slug==='html-to-docx'||slug==='markdown-to-docx')return richDocx(slug,text,h);
  if(slug==='csv-to-vcard')return csvCards(text,h);
  if(slug==='csv-to-icalendar')return csvCalendar(text,h);
  if(slug==='json-to-geojson')return geoJson(text,values,h);
  throw new h.InputError('Unknown extended conversion.');
}
export async function exampleExtended(slug,h){
  if(slug==='pdf-form-to-json'||slug==='pdf-form-filler'){const doc=await PDFDocument.create(),page=doc.addPage([400,300]),form=doc.getForm(),name=form.createTextField('name');name.setText('Ada Lovelace');name.addToPage(page,{x:30,y:200,width:280,height:30});const box=form.createCheckBox('subscribed');box.addToPage(page,{x:30,y:150,width:20,height:20});return h.binaryResult(await doc.save(),'example-form.pdf','application/pdf');}
  if(slug.startsWith('pdf-'))return h.defaultPdf();
  if(slug.startsWith('wav-'))return h.defaultWav();
  if(slug==='zip-extractor'){const zip=new JSZip();zip.file('example.txt','Hello, archive!\n');zip.file('notes/readme.txt','A nested entry.\n');return h.binaryResult(await zip.generateAsync({type:'nodebuffer',compression:'DEFLATE'}),'example.zip','application/zip');}
  if(slug==='zip-creator')return h.textResult('Hello from a ZIP input example.\n','example.txt');
  if(slug==='bmp-converter'){const png=await sharp({create:{width:8,height:6,channels:3,background:'#f05020'}}).png().toBuffer();return h.binaryResult(await encodeBmp(png,h),'example.bmp','image/bmp');}
  if(slug==='transparent-png-trimmer'){const data=Buffer.alloc(8*6*4);for(let y=2;y<4;y++)for(let x=2;x<6;x++){data[(y*8+x)*4]=255;data[(y*8+x)*4+3]=255;}return h.binaryResult(await sharp(data,{raw:{width:8,height:6,channels:4}}).png().toBuffer(),'example.png','image/png');}
  if(slug==='image-contact-sheet'||slug==='image-exif-remover')return h.binaryResult(await sharp({create:{width:32,height:24,channels:3,background:'#4466dd'}}).png().toBuffer(),'example.png','image/png');
  throw new h.InputError('This converter has a text example in the editor.');
}
