'use client';
import { useRef, useState } from 'react';
import { growthTools } from '@/lib/growth-tools';
import { downloadBlob } from '@/lib/growth-files';
import FileInput from './FileInput';
import '@/style/main.css';
import '@/style/growth.css';

function safePrintMarkup(source: string) {
  const parsed = new DOMParser().parseFromString(source, 'text/html');
  const allowed = new Set(['P','H1','H2','H3','H4','H5','H6','UL','OL','LI','STRONG','B','EM','I','BR','TABLE','THEAD','TBODY','TR','TD','TH','BLOCKQUOTE','PRE','CODE','HR']);
  const clean = (node: Node): Node | null => {
    if (node.nodeType === Node.TEXT_NODE) return document.createTextNode(node.textContent ?? '');
    if (!(node instanceof HTMLElement)) return null;
    if (!allowed.has(node.tagName)) { const fragment=document.createDocumentFragment();node.childNodes.forEach(child=>{const safe=clean(child);if(safe)fragment.append(safe)});return fragment; }
    const output=document.createElement(node.tagName.toLowerCase());
    if (['TD','TH'].includes(node.tagName)) for (const key of ['colspan','rowspan']) { const value=node.getAttribute(key);if(value&&/^\d{1,2}$/.test(value))output.setAttribute(key,value); }
    node.childNodes.forEach(child=>{const safe=clean(child);if(safe)output.append(safe)});return output;
  };
  const fragment=document.createDocumentFragment();parsed.body.childNodes.forEach(node=>{const safe=clean(node);if(safe)fragment.append(safe)});
  const holder=document.createElement('div');holder.append(fragment);return holder.innerHTML;
}

export default function RequestedInteractiveWorkbench({ slug }: { slug: string }) {
  const tool = growthTools.find(item => item.slug === slug)!;
  const [text,setText]=useState(tool.example),[top,setTop]=useState(''),[bottom,setBottom]=useState(''),[file,setFile]=useState<File|null>(null),[busy,setBusy]=useState(false),[error,setError]=useState(''),[done,setDone]=useState(false),[business,setBusiness]=useState('Your business'),[customer,setCustomer]=useState('Customer'),[items,setItems]=useState('Service,1,100.00'),[tax,setTax]=useState('0');
  const canvas=useRef<HTMLCanvasElement>(null);
  const isSpeech=slug==='text-to-speech', isHtml=slug==='html-to-pdf', isGif=slug==='gif-to-mp4', isInvoice=['invoice-template','receipt-maker'].includes(slug), isGraphic=['meme-generator','youtube-thumbnail-maker','signature-generator'].includes(slug);
  const speak=()=>{if(!('speechSynthesis'in window)){setError('Speech synthesis is not available in this browser.');return;}speechSynthesis.cancel();speechSynthesis.speak(new SpeechSynthesisUtterance(text));setError('');};
  async function render(){setError('');setDone(false);setBusy(true);try{
    if(isInvoice){const escape=(s:string)=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));const rows=items.split(/\r?\n/).map(line=>line.split(','));let subtotal=0;const body=rows.map((row,i)=>{const qty=Number(row[1]),price=Number(row[2]);if(!row[0]?.trim()||!Number.isFinite(qty)||qty<=0||!Number.isFinite(price)||price<0)throw new Error(`Line ${i+1}: use item name, quantity, unit price.`);subtotal+=qty*price;return `<tr><td>${escape(row[0])}</td><td>${qty}</td><td>$${price.toFixed(2)}</td><td>$${(qty*price).toFixed(2)}</td></tr>`;}).join('');const taxRate=Number(tax);if(!Number.isFinite(taxRate)||taxRate<0||taxRate>100)throw new Error('Enter a tax rate from 0 to 100%.');const taxAmount=subtotal*taxRate/100,kind=slug==='receipt-maker'?'Receipt':'Invoice',win=window.open('','_blank');if(!win)throw new Error('Allow pop-ups to open the printable document.');win.document.write(`<!doctype html><meta charset="utf-8"><title>${kind}</title><style>body{font:16px/1.5 Arial,sans-serif;max-width:850px;margin:40px auto;padding:0 24px;color:#202820}h1{font-size:36px}table{width:100%;border-collapse:collapse;margin:28px 0}th,td{padding:12px;border-bottom:1px solid #ddd;text-align:left}td:nth-child(n+2),th:nth-child(n+2){text-align:right}.total{text-align:right;font-size:22px;font-weight:bold}@media print{body{margin:0;max-width:none}}</style><h1>${kind}</h1><p><b>${escape(business)}</b></p><p>For: ${escape(customer)}<br>Date: ${new Date().toLocaleDateString()}</p><table><thead><tr><th>Item</th><th>Qty</th><th>Unit price</th><th>Amount</th></tr></thead><tbody>${body}</tbody></table><p class="total">Subtotal: $${subtotal.toFixed(2)}<br>Tax (${taxRate}%): $${taxAmount.toFixed(2)}<br>Total: $${(subtotal+taxAmount).toFixed(2)}</p>`);win.document.close();win.focus();win.print();setDone(true);return;}
    if(isHtml){const printable=safePrintMarkup(text);const win=window.open('','_blank');if(!win)throw new Error('Allow pop-ups to open the print-ready document.');win.document.write(`<!doctype html><meta charset="utf-8"><title>Print document</title><style>body{font:16px/1.6 Arial,sans-serif;max-width:800px;margin:40px auto;padding:0 24px}img{max-width:100%}table{border-collapse:collapse}td,th{border:1px solid #aaa;padding:8px}@media print{body{margin:0;max-width:none}}</style><main>${printable}</main>`);win.document.close();win.focus();win.print();setDone(true);return;}
    if(isGif){if(!file||file.type!=='image/gif')throw new Error('Choose an animated GIF.');if(!('MediaRecorder'in window)||!MediaRecorder.isTypeSupported('video/mp4'))throw new Error('This browser does not include an MP4 video encoder. Use a browser or desktop editor with MP4 export support.');const image=new Image(),url=URL.createObjectURL(file);await new Promise<void>((resolve,reject)=>{image.onload=()=>resolve();image.onerror=()=>reject(new Error('Could not read this GIF.'));image.src=url;});const c=canvas.current,ctx=c?.getContext('2d');if(!c||!ctx)throw new Error('Canvas is unavailable.');const scale=Math.min(1,1280/image.width,720/image.height);c.width=Math.max(1,Math.round(image.width*scale));c.height=Math.max(1,Math.round(image.height*scale));const stream=c.captureStream(30),recorder=new MediaRecorder(stream,{mimeType:'video/mp4'}),chunks:BlobPart[]=[];recorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data);};const stopped=new Promise<void>(resolve=>recorder.onstop=()=>resolve());recorder.start();const draw=window.setInterval(()=>ctx.drawImage(image,0,0,c.width,c.height),33);await new Promise(resolve=>setTimeout(resolve,2500));clearInterval(draw);recorder.stop();await stopped;stream.getTracks().forEach(track=>track.stop());URL.revokeObjectURL(url);const blob=new Blob(chunks,{type:'video/mp4'});if(!blob.size)throw new Error('The browser did not produce an MP4 stream.');downloadBlob(blob,'animation.mp4');setDone(true);return;}
    const c=canvas.current,ctx=c?.getContext('2d');if(!c||!ctx)throw new Error('Canvas is unavailable.');
    if(slug==='signature-generator'){
      c.width=1200;c.height=360;ctx.clearRect(0,0,c.width,c.height);ctx.fillStyle='#18211d';ctx.font='italic 120px cursive';ctx.textBaseline='middle';ctx.fillText(text.trim()||'Your Name',40,180,1120);
    }else{
      if(!file)throw new Error('Choose an image first.');const bitmap=await createImageBitmap(file);const w=slug==='youtube-thumbnail-maker'?1280:Math.max(640,bitmap.width),h=slug==='youtube-thumbnail-maker'?720:Math.round(w*bitmap.height/bitmap.width);c.width=w;c.height=h;ctx.drawImage(bitmap,0,0,w,h);bitmap.close();
      if(slug==='meme-generator'){ctx.font=`bold ${Math.max(28,Math.floor(w/12))}px Impact, sans-serif`;ctx.textAlign='center';ctx.lineWidth=Math.max(3,w/100);ctx.strokeStyle='#111';ctx.fillStyle='white';ctx.textBaseline='top';if(top.trim()){ctx.strokeText(top.toUpperCase(),w/2,20,w-40);ctx.fillText(top.toUpperCase(),w/2,20,w-40);}ctx.textBaseline='bottom';if(bottom.trim()){ctx.strokeText(bottom.toUpperCase(),w/2,h-20,w-40);ctx.fillText(bottom.toUpperCase(),w/2,h-20,w-40);}}
      else {ctx.fillStyle='rgba(0,0,0,.62)';ctx.fillRect(0,h*.57,w,h*.43);ctx.fillStyle='white';ctx.textAlign='left';ctx.textBaseline='middle';ctx.font='bold 68px Arial';ctx.fillText(top||'Your video title',48,h*.69,w-96);ctx.font='36px Arial';ctx.fillText(bottom||'Add a subtitle',48,h*.84,w-96);}
    }
    const blob=await new Promise<Blob>((resolve,reject)=>c.toBlob(b=>b?resolve(b):reject(new Error('Image export failed.')),'image/png'));downloadBlob(blob,`${slug}.png`);setDone(true);
  }catch(e){setError(e instanceof Error?e.message:'Could not create the output.');}finally{setBusy(false);}}
  return <><section className="hero"><div className="hero-eyebrow">Free · Runs in your browser · No sign-up</div><h1>{tool.title}</h1><p>{tool.description}</p></section><section className="panel" aria-label={tool.title}>
    {(isGraphic&&slug!=='signature-generator'||isGif)&&<FileInput id="popular-art-image" label="Choose an image" hint={isGif?'Animated GIF · MP4 output depends on browser codec support':'PNG, JPEG or WebP. The image stays in your browser.'} accept={isGif?'image/gif':'image/png,image/jpeg,image/webp'} disabled={busy} files={file?[file]:[]} onFilesChange={files=>{setFile(files[0]??null);setDone(false);}}/>}
    {isInvoice&&<div className="growth-controls"><label>Business name<input value={business} onChange={e=>setBusiness(e.target.value)}/></label><label>Bill to / customer<input value={customer} onChange={e=>setCustomer(e.target.value)}/></label><label>Items (one per line: name, quantity, unit price)<textarea rows={5} value={items} onChange={e=>setItems(e.target.value)}/></label><label>Tax rate (%)<input type="number" min="0" max="100" step="0.01" value={tax} onChange={e=>setTax(e.target.value)}/></label></div>}
    {!isGif&&!isInvoice&&<><label className="panel-title" htmlFor="popular-tool-input">{isSpeech?'Text to read aloud':slug==='signature-generator'?'Type your signature':isHtml?'Text or HTML to print':'Main title or top caption'}</label>
    <textarea id="popular-tool-input" rows={6} value={text} onChange={e=>{setText(e.target.value);setDone(false);}} /></>}
    {slug==='meme-generator'&&<label className="panel-title" htmlFor="popular-bottom">Bottom caption<textarea id="popular-bottom" value={bottom} onChange={e=>setBottom(e.target.value)} /></label>}
    {slug==='youtube-thumbnail-maker'&&<label className="panel-title" htmlFor="popular-bottom">Subtitle<textarea id="popular-bottom" value={bottom} onChange={e=>setBottom(e.target.value)} /></label>}
    <canvas ref={canvas} className="visually-hidden" />
    <div className="actions">{isSpeech?<><button className="btn-convert" type="button" onClick={speak}>Read aloud</button><button className="btn-secondary" type="button" onClick={()=>speechSynthesis.cancel()}>Stop</button></>:<button className="btn-convert" type="button" disabled={busy} onClick={render}>{busy?'Preparing…':isHtml||isInvoice?'Open print dialog':tool.action}</button>}</div>
    {done&&<p role="status">{isHtml||isInvoice?'Print-ready page opened. Choose “Save as PDF” in the print dialog.':isGif?'MP4 video downloaded.':'PNG file downloaded.'}</p>}{error&&<p className="error-bar" role="alert">{error}</p>}
  </section></>;
}
