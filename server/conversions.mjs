import { POPULAR_SLUGS, convertPopular, examplePopular } from './popular-conversions.mjs';
import { PROTOCOL_SLUGS, PROTOCOL_TEXT_SLUGS, convertProtocol, exampleProtocol } from './protocol-conversions.mjs';
import { EXTENDED_SLUGS, EXTENDED_TEXT_SLUGS, EXTENDED_MULTI_SLUGS, convertExtended, exampleExtended } from './extended-conversions.mjs';
import ExcelJS from 'exceljs';
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
import { readFile } from 'node:fs/promises';
import path from 'node:path';

export const SERVER_SLUGS = ['xlsx-to-csv','json-to-xlsx','xlsx-to-json','docx-converter','pdf-merger','pdf-page-extractor','pdf-rotate','pdf-metadata-remover','pdf-resize','text-to-pdf','pdf-watermark','pdf-page-numbers','image-to-avif','tiff-to-image','gif-sprite-sheet','json5-to-json','json-to-toml','text-encoding-converter','text-to-docx','stereo-to-mono-wav',...EXTENDED_SLUGS,...PROTOCOL_SLUGS,...POPULAR_SLUGS];
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
export async function convert(slug,files=[],text='',values={},second='',runtime) {
  ensure(SERVER_SLUGS.includes(slug),'Unknown conversion.');ensure(typeof text==='string'&&typeof second==='string'&&text.length+second.length<=2*1024*1024,'Use at most 2 MiB of input text.');
  ensure(Array.isArray(files)&&files.length<=8&&files.reduce((n,f)=>n+f.bytes.length,0)<=MAX_FILE_BYTES,'Use at most eight files and 4 MiB combined input.');
  const textSlugs=['json-to-xlsx','text-to-pdf','json5-to-json','json-to-toml','text-to-docx',...EXTENDED_TEXT_SLUGS,...PROTOCOL_TEXT_SLUGS];
  ensure(textSlugs.includes(slug)?files.length===0:['pdf-merger',...EXTENDED_MULTI_SLUGS].includes(slug)?files.length>=2:files.length===1,'Choose the required input files.');
  let result;
  if(POPULAR_SLUGS.includes(slug))result=await convertPopular(slug,files,text,values,sharedHelpers());
  else if(PROTOCOL_SLUGS.includes(slug))result=await convertProtocol(slug,files,text,values,{...sharedHelpers(),second});
  else if(EXTENDED_SLUGS.includes(slug))result=await convertExtended(slug,files,text,values,sharedHelpers());
  else if(slug==='json-to-xlsx')result=await jsonWorkbook(text);
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
