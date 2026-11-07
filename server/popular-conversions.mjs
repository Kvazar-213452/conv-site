import {PDFDocument,rgb} from 'pdf-lib';
import {Document,Packer,Paragraph,TextRun} from 'docx';
import sharp from 'sharp';
import JSZip from 'jszip';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {openRenderedPdf,renderPage} from './extended-conversions.mjs';
export const POPULAR_SLUGS=['pdf-compressor','pdf-splitter','pdf-page-remover','pdf-to-word','pdf-to-powerpoint','excel-to-pdf','heic-to-jpg','image-to-text','image-target-size','image-dpi-converter','passport-photo-maker','split-image'];
const PIXELS=16000000;
async function imageInput(bytes,h){
  const b=Buffer.from(bytes),valid=b.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))||b[0]===255&&b[1]===216&&b[2]===255||b.toString('ascii',0,4)==='RIFF'&&b.toString('ascii',8,12)==='WEBP';
  h.ensure(valid,'Choose a still PNG, JPEG or WebP image.');const pipeline=sharp(b,{limitInputPixels:PIXELS,failOn:'error'}),meta=await pipeline.metadata();
  h.ensure(meta.width&&meta.height&&(meta.pages??1)===1&&meta.width*meta.height<=PIXELS,'Use a still image within 16 million pixels.');
  const {data,info}=await pipeline.rotate().png().toBuffer({resolveWithObject:true});return {bytes:data,width:info.width,height:info.height};
}
async function pdfTask(slug,bytes,values,h){
  const input=await h.loadPdf(bytes);
  if(slug==='pdf-page-remover'){const removed=new Set(h.selectedPages(values.pages,input.getPageCount())),indices=input.getPageIndices().filter(i=>!removed.has(i));h.ensure(indices.length,'Keep at least one page.');const doc=await PDFDocument.create();for(const page of await doc.copyPages(input,indices))doc.addPage(page);return h.binaryResult(await doc.save(),'pages-removed.pdf','application/pdf');}
  if(slug==='pdf-splitter'){const size=h.integer(values,'pagesPerFile',1,200),count=Math.ceil(input.getPageCount()/size);h.ensure(count<=50,'Choose a group size producing at most 50 PDF files.');const zip=new JSZip();let total=0;for(let start=0;start<input.getPageCount();start+=size){const doc=await PDFDocument.create(),indices=input.getPageIndices().slice(start,start+size);for(const page of await doc.copyPages(input,indices))doc.addPage(page);const output=await doc.save();h.ensure((total+=output.length)<=4*1024*1024,'Split output exceeds 4 MiB.');zip.file(`pages-${start+1}-${start+indices.length}.pdf`,output);}return h.binaryResult(await zip.generateAsync({type:'nodebuffer',compression:'DEFLATE'}),'split-pdfs.zip','application/zip');}
  const source=await openRenderedPdf(bytes,h);
  try{
    if(slug==='pdf-to-word'){
      const paragraphs=[];let chars=0,found=false;h.ensure(source.numPages<=50,'Text export supports at most 50 pages.');
      for(let i=1;i<=source.numPages;i++){const page=await source.getPage(i),content=await page.getTextContent();let line='',lines=[];for(const item of content.items){if(typeof item.str!=='string')continue;line+=item.str+' ';if(item.hasEOL){lines.push(line.trimEnd());line='';}}if(line)lines.push(line.trimEnd());const text=lines.join('\n');chars+=text.length;h.ensure(chars<=100000,'Extracted text exceeds 100,000 characters.');h.ensure(!/[\u0000-\u0008\u000b\u000c\u000e-\u001f\ufffe\uffff]/u.test(text),'Extracted text contains unsupported document characters.');found ||= Boolean(text.trim());if(!lines.length)lines=[''];lines.forEach((line,index)=>paragraphs.push(new Paragraph({pageBreakBefore:i>1&&index===0,children:[new TextRun(line)]})));page.cleanup();}
      h.ensure(found,'No selectable PDF text was found. Scanned documents need OCR first.');return h.binaryResult(await Packer.toBuffer(new Document({sections:[{children:paragraphs}]})),'converted.docx','application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    }
    h.ensure(source.numPages<=20,'Rendering supports at most 20 PDF pages.');
    if(slug==='pdf-to-powerpoint'){
      const {default:PptxGenJS}=await import('pptxgenjs'),pptx=new PptxGenJS();const first=await source.getPage(1),view=first.getViewport({scale:1}),w=10,ht=10*view.height/view.width;h.ensure(ht>=1&&ht<=30,'Use ordinary page proportions for PowerPoint export.');pptx.defineLayout({name:'PDF',width:w,height:ht});pptx.layout='PDF';pptx.author='Utilixio';pptx.subject='PDF pages as slide images';let total=0;
      for(let i=1;i<=source.numPages;i++){const image=await renderPage(source,i,1.5,h);h.ensure((total+=image.bytes.length)<=4*1024*1024,'Rendered slide images exceed 4 MiB.');const ratio=Math.min(w/image.width,ht/image.height),iw=image.width*ratio,ih=image.height*ratio;pptx.addSlide().addImage({data:'image/png;base64,'+image.bytes.toString('base64'),x:(w-iw)/2,y:(ht-ih)/2,w:iw,h:ih});}
      return h.binaryResult(await pptx.write({outputType:'nodebuffer',compression:true}),'converted.pptx','application/vnd.openxmlformats-officedocument.presentationml.presentation');
    }
    const dpi=Number(h.pick(values,'dpi',['72','96','144'])),quality=h.integer(values,'quality',30,90),doc=await PDFDocument.create();let total=0;
    for(let i=1;i<=source.numPages;i++){const image=await renderPage(source,i,dpi/72,h),jpeg=await sharp(image.bytes).flatten({background:'#fff'}).jpeg({quality,mozjpeg:true}).toBuffer();h.ensure((total+=jpeg.length)<=4*1024*1024,'Compressed image data exceeds 4 MiB.');const embedded=await doc.embedJpg(jpeg),page=doc.addPage([image.points.width,image.points.height]);page.drawImage(embedded,{x:0,y:0,width:page.getWidth(),height:page.getHeight()});}
    const output=await doc.save();if(h.pick(values,'keepOriginal',['true','false'])==='true'&&output.length>=bytes.length)return h.binaryResult(bytes,'original-already-smaller.pdf','application/pdf');return h.binaryResult(output,'compressed.pdf','application/pdf');
  }finally{await source.loadingTask.destroy();}
}
async function excelPdf(bytes,values,h){
  const rows=await h.readWorksheet(bytes,values);h.ensure(rows.length<=1000,'Use at most 1,000 worksheet rows.');const cells=rows.map(r=>r.map(v=>v===null?'':String(v))),all=cells.flat().join('');h.ensure(all.length<=100000,'Use at most 100,000 worksheet text characters.');
  const doc=await PDFDocument.create(),font=await h.embedFont(doc,all),fontSize=h.integer(values,'fontSize',7,14),columns=h.integer(values,'columns',1,10),landscape=h.pick(values,'orientation',['portrait','landscape'])==='landscape',[pw,ph]=landscape?[841.89,595.28]:[595.28,841.89],margin=30;
  const wrap=(text,width)=>{const out=[];let line='';for(const c of text.replace(/\r\n?/g,'\n').replace(/\t/g,' ')){if(c==='\n'){out.push(line);line='';continue;}if(font.widthOfTextAtSize(line+c,fontSize)>width&&line){out.push(line);line='';}line+=c;}out.push(line);h.ensure(out.length<=40,'A cell needs more than 40 wrapped lines. Shorten it before exporting.');return out;};
  for(let start=0;start<cells[0].length;start+=columns){const count=Math.min(columns,cells[0].length-start),cw=(pw-2*margin)/count;let page,y;
    const newPage=()=>{h.ensure(doc.getPageCount()<60,'Worksheet export exceeds 60 pages.');page=doc.addPage([pw,ph]);y=ph-margin;};
    const drawRow=(row,header=false)=>{const lines=row.slice(start,start+count).map(c=>wrap(c,cw-10)),height=Math.max(...lines.map(l=>l.length))*fontSize*1.35+10;h.ensure(height<ph-2*margin,'A row is taller than the printable page.');if(y-height<margin){newPage();if(!header){const head=cells[0].slice(start,start+count).map(c=>wrap(c,cw-10)),hh=Math.max(...head.map(l=>l.length))*fontSize*1.35+10;h.ensure(y-hh-height>=margin,'A row cannot fit beneath the repeated header.');paint(head,hh,true);}}paint(lines,height,header);};
    const paint=(lines,height,header)=>{for(let col=0;col<count;col++){page.drawRectangle({x:margin+col*cw,y:y-height,width:cw,height,borderWidth:.4,borderColor:rgb(.75,.78,.82),...(header?{color:rgb(.93,.95,.98)}:{})});lines[col].forEach((line,i)=>{if(line)page.drawText(line,{x:margin+col*cw+5,y:y-7-fontSize-i*fontSize*1.35,size:fontSize,font});});}y-=height;};
    newPage();cells.forEach((row,i)=>drawRow(row,i===0));
  }
  return h.binaryResult(await doc.save(),'worksheet.pdf','application/pdf');
}
async function heicJpg(bytes,values,h){
  h.ensure(Buffer.from(bytes).toString('ascii',4,8)==='ftyp','Choose a HEIC/HEIF image.');const {default:decode}=await import('heic-decode');let images;
  try{images=await decode.all({buffer:Buffer.from(bytes)});h.ensure(images.length>0&&images.length<=32,'Use a HEIC file with at most 32 top-level images.');const image=images[0];h.ensure(image.width>0&&image.height>0&&image.width*image.height<=PIXELS,'HEIC image exceeds 16 million pixels.');const data=await image.decode();return h.binaryResult(await sharp(Buffer.from(data.data),{raw:{width:data.width,height:data.height,channels:4}}).flatten({background:'#ffffff'}).jpeg({quality:h.integer(values,'quality',40,100)}).toBuffer(),'converted.jpg','image/jpeg');}finally{images?.dispose();}
}
async function recognizeImage(bytes,h){
  const image=await imageInput(bytes,h);h.ensure(image.width*image.height<=6000000,'OCR images must be at most 6 million pixels.');const normalized=await sharp(image.bytes).resize({width:2000,height:2000,fit:'inside',withoutEnlargement:true}).flatten({background:'#fff'}).grayscale().png().toBuffer();
  const {createWorker}=await import('tesseract.js');const root=path.join(process.cwd(),'node_modules');
  const worker=await createWorker('eng',1,{langPath:path.join(root,'@tesseract.js-data/eng/4.0.0'),cacheMethod:'none',gzip:true,workerPath:path.join(root,'tesseract.js/src/worker-script/node/index.js'),corePath:path.join(root,'tesseract.js-core'),errorHandler:()=>{}});
  try{const {data}=await worker.recognize(normalized);h.ensure(data.text.trim(),'No readable text was found. Try a clearer, upright image of printed English text.');return h.textResult(data.text.trim()+'\n','recognized-text.txt');}finally{await worker.terminate();}
}
async function targetSize(image,values,h){
  const target=h.integer(values,'kilobytes',10,5000)*1024,resize=h.pick(values,'allowResize',['true','false'])==='true';let width=image.width,height=image.height;
  for(let attempt=0;attempt<7;attempt++){
    const base=sharp(image.bytes).resize(width,height,{fit:'fill'}).flatten({background:'#fff'}),low=await base.clone().jpeg({quality:20}).toBuffer();
    if(low.length<=target){let best=low,left=21,right=95;while(left<=right){const quality=Math.floor((left+right)/2),encoded=await base.clone().jpeg({quality}).toBuffer();if(encoded.length<=target){best=encoded;left=quality+1;}else right=quality-1;}return h.binaryResult(best,'under-'+values.kilobytes+'kb.jpg','image/jpeg');}
    h.ensure(resize,'The target cannot be met at these dimensions. Allow resizing or increase the target.');const factor=Math.min(.85,Math.sqrt(target/low.length)*.9);const w=Math.max(1,Math.floor(width*factor)),ht=Math.max(1,Math.floor(height*factor));h.ensure(w<width||ht<height,'Target is too small for this image.');width=w;height=ht;
  }
  throw new h.InputError('Could not meet the target. Increase the file-size limit.');
}
async function dpiImage(image,values,h){const dpi=h.integer(values,'dpi',72,1200),mode=h.pick(values,'mode',['metadata','resize']);let pipeline=sharp(image.bytes).flatten({background:'#fff'});if(mode==='resize'){const width=Math.round(h.numeric(values,'widthMm',1,1000)/25.4*dpi),height=Math.round(h.numeric(values,'heightMm',1,1000)/25.4*dpi);h.ensure(width>0&&height>0&&width*height<=PIXELS,'Print dimensions exceed 16 million pixels.');pipeline=pipeline.resize(width,height,{fit:'contain',background:'#fff'});}return h.binaryResult(await pipeline.withMetadata({density:dpi}).jpeg({quality:95}).toBuffer(),'print-'+dpi+'dpi.jpg','image/jpeg');}
async function passport(image,values,h){
  const dpi=h.integer(values,'dpi',150,600),width=Math.round(h.numeric(values,'widthMm',20,70)/25.4*dpi),height=Math.round(h.numeric(values,'heightMm',20,70)/25.4*dpi),mode=h.pick(values,'output',['single','sheet']);const photo=await sharp(image.bytes).resize(width,height,{fit:'cover',position:'centre'}).flatten({background:'#fff'}).jpeg({quality:95}).toBuffer();
  if(mode==='single')return h.binaryResult(await sharp(photo).withMetadata({density:dpi}).jpeg({quality:95}).toBuffer(),'passport-photo.jpg','image/jpeg');
  const sw=4*dpi,sh=6*dpi,gap=Math.round(dpi*.08),columns=Math.floor((sw-gap)/(width+gap)),rows=Math.floor((sh-gap)/(height+gap));h.ensure(columns>0&&rows>0&&sw*sh<=PIXELS,'Photo does not fit on a 4 × 6 inch print sheet.');const offsetX=Math.floor((sw-(columns*width+(columns-1)*gap))/2),offsetY=Math.floor((sh-(rows*height+(rows-1)*gap))/2),layers=[];for(let y=0;y<rows;y++)for(let x=0;x<columns;x++)layers.push({input:photo,left:offsetX+x*(width+gap),top:offsetY+y*(height+gap)});return h.binaryResult(await sharp({create:{width:sw,height:sh,channels:3,background:'#fff'}}).composite(layers).withMetadata({density:dpi}).jpeg({quality:95}).toBuffer(),'passport-print-sheet.jpg','image/jpeg');
}
async function splitImage(image,values,h){const columns=h.integer(values,'columns',1,6),rows=h.integer(values,'rows',1,6),format=h.pick(values,'format',['jpeg','png']);h.ensure(image.width>=columns&&image.height>=rows,'Use fewer tiles or a larger image.');const zip=new JSZip();let total=0;for(let row=0;row<rows;row++)for(let col=0;col<columns;col++){const left=Math.floor(col*image.width/columns),top=Math.floor(row*image.height/rows),width=Math.floor((col+1)*image.width/columns)-left,height=Math.floor((row+1)*image.height/rows)-top;let tile=sharp(image.bytes).extract({left,top,width,height});const output=await (format==='png'?tile.png():tile.flatten({background:'#fff'}).jpeg({quality:92})).toBuffer();h.ensure((total+=output.length)<=4*1024*1024,'Tile output exceeds 4 MiB.');zip.file(`tile-r${row+1}-c${col+1}.`+(format==='jpeg'?'jpg':'png'),output);}return h.binaryResult(await zip.generateAsync({type:'nodebuffer',compression:'STORE'}),'image-tiles.zip','application/zip');}
export async function convertPopular(slug,files,text,values,h){const bytes=files[0].bytes;if(slug.startsWith('pdf-'))return pdfTask(slug,bytes,values,h);if(slug==='excel-to-pdf')return excelPdf(bytes,values,h);if(slug==='heic-to-jpg')return heicJpg(bytes,values,h);if(slug==='image-to-text')return recognizeImage(bytes,h);const image=await imageInput(bytes,h);if(slug==='image-target-size')return targetSize(image,values,h);if(slug==='image-dpi-converter')return dpiImage(image,values,h);if(slug==='passport-photo-maker')return passport(image,values,h);return splitImage(image,values,h);}
export async function examplePopular(slug,h){
  if(slug.startsWith('pdf-'))return h.defaultPdf();if(slug==='excel-to-pdf')return h.defaultExcel();if(slug==='heic-to-jpg')return h.binaryResult(await readFile(path.join(process.cwd(),'server/assets/example.heic')),'example.heic','image/heic');
  if(slug==='image-to-text'){const {createCanvas,GlobalFonts}=await import('@napi-rs/canvas');GlobalFonts.registerFromPath(path.join(process.cwd(),'public/fonts/NotoSans-Regular.ttf'),'Example Noto');const canvas=createCanvas(1000,240),ctx=canvas.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,1000,240);ctx.fillStyle='#111';ctx.font='48px "Example Noto"';ctx.fillText('HELLO WORLD',50,85);ctx.fillText('Receipt total 42.50',50,165);return h.binaryResult(canvas.toBuffer('image/png'),'example-text.png','image/png');}
  const pixels=Buffer.alloc(600*800*3);for(let y=0;y<800;y++)for(let x=0;x<600;x++){const i=(y*600+x)*3;pixels[i]=Math.round(x/600*255);pixels[i+1]=Math.round(y/800*255);pixels[i+2]=140;}return h.binaryResult(await sharp(pixels,{raw:{width:600,height:800,channels:3}}).png().toBuffer(),'example-photo.png','image/png');
}
