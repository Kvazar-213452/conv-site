'use client';
import { useEffect, useRef, useState } from 'react';
import { growthTools } from '@/lib/growth-tools';
import { downloadBlob, MAX_BINARY_BYTES, MAX_IMAGE_PIXELS } from '@/lib/growth-files';
import FileInput from './FileInput';
import GrowthControls, { defaultValues } from './GrowthControls';
import ToolStepHeading from './ToolStepHeading';
import '@/style/main.css';
import '@/style/growth.css';

export default function PhotoCollageWorkbench() {
  const tool=growthTools.find(item=>item.slug==='photo-collage-maker')!;
  const [files,setFiles]=useState<File[]>([]),[values,setValues]=useState(()=>defaultValues(tool.fields)),[result,setResult]=useState<{url:string;blob:Blob;width:number;height:number}|null>(null),[error,setError]=useState(''),[busy,setBusy]=useState(false);
  const canvas=useRef<HTMLCanvasElement>(null),picker=useRef<HTMLInputElement>(null);
  useEffect(()=>()=>{if(result)URL.revokeObjectURL(result.url)},[result]);
  function clearResult(){setResult(null);setError('');}
  async function create(){clearResult();if(files.length<2||files.length>6){setError('Choose between 2 and 6 photos.');return;}setBusy(true);const bitmaps:ImageBitmap[]=[];try{
    if(files.some(file=>!['image/png','image/jpeg','image/webp'].includes(file.type)||file.size>MAX_BINARY_BYTES)||files.reduce((total,file)=>total+file.size,0)>40*1024*1024)throw new Error('Choose PNG, JPEG or WebP photos, up to 20 MiB each and 40 MiB combined.');
    for(const file of files){const bitmap=await createImageBitmap(file);if(bitmap.width*bitmap.height>MAX_IMAGE_PIXELS)throw new Error(`${file.name} exceeds the 40-million-pixel limit.`);bitmaps.push(bitmap);}
    const layouts:Record<string,{columns:number;maxRows:number}>={'2×1':{columns:2,maxRows:1},'2×2':{columns:2,maxRows:2},'3×2':{columns:3,maxRows:2},'1×3':{columns:1,maxRows:3}},layout=layouts[values.layout]??layouts['2×2'],columns=layout.columns,rows=Math.ceil(files.length/columns);if(rows>layout.maxRows)throw new Error(`The ${values.layout} layout holds up to ${columns*layout.maxRows} photos. Choose a larger layout.`);
    const cell=600,gap=Number(values.gap);if(!Number.isInteger(gap)||gap<0||gap>40)throw new Error('Choose spacing from 0 to 40 pixels.');const c=canvas.current,ctx=c?.getContext('2d');if(!c||!ctx)throw new Error('Canvas is unavailable.');c.width=columns*cell+(columns-1)*gap;c.height=rows*cell+(rows-1)*gap;ctx.fillStyle='#ffffff';ctx.fillRect(0,0,c.width,c.height);
    bitmaps.forEach((bitmap,index)=>{const x=(index%columns)*(cell+gap),y=Math.floor(index/columns)*(cell+gap),scale=Math.max(cell/bitmap.width,cell/bitmap.height),sourceWidth=cell/scale,sourceHeight=cell/scale,sx=(bitmap.width-sourceWidth)/2,sy=(bitmap.height-sourceHeight)/2;ctx.drawImage(bitmap,sx,sy,sourceWidth,sourceHeight,x,y,cell,cell);});
    const blob=await new Promise<Blob>((resolve,reject)=>c.toBlob(value=>value?resolve(value):reject(new Error('Could not export the collage as PNG.')),'image/png'));setResult({url:URL.createObjectURL(blob),blob,width:c.width,height:c.height});
  }catch(reason){setError(reason instanceof Error?reason.message:'Could not create the photo collage.');}finally{bitmaps.forEach(bitmap=>bitmap.close());setBusy(false);}}
  return <><section className="hero"><div className="hero-eyebrow">Free · Private image processing · No sign-up</div><h1>{tool.title}</h1><p>{tool.description}</p></section><section aria-label="Photo collage maker"><ToolStepHeading number={1} title="Choose 2–6 photos" description="Images are arranged in order and processed on this device."/><FileInput id="collage-photos" label="Add photos" hint="PNG, JPEG or WebP · up to 20 MiB per image and 40 MiB total" accept="image/png,image/jpeg,image/webp" multiple disabled={busy} files={files} inputRef={picker} onFilesChange={next=>{clearResult();if(next.length>6){setFiles(next.slice(0,6));setError('The collage supports up to 6 photos.');}else{setFiles(next);setError('');}}}/>
    <ToolStepHeading number={2} title="Choose a layout" description="Photos fill the grid from left to right, then top to bottom."/><GrowthControls fields={tool.fields} values={values} disabled={busy} onChange={(key,value)=>{setValues(current=>({...current,[key]:value}));clearResult();}}/>
    <canvas ref={canvas} className="visually-hidden"/><div className="actions"><button type="button" className="btn-convert" disabled={busy||files.length<2} onClick={create}>{busy?'Creating collage…':'Create photo collage'}</button><button type="button" className="btn-secondary" disabled={busy} onClick={()=>{setFiles([]);setValues(defaultValues(tool.fields));clearResult();if(picker.current)picker.current.value='';}}>Reset</button></div>
    {error&&<p role="alert" className="error-bar">{error}</p>}{result&&<div className="panel" aria-live="polite"><ToolStepHeading number={3} title="Your collage is ready" description={`${files.length} photos · ${result.width} × ${result.height} px`} /><img src={result.url} alt="Preview of your photo collage" style={{display:'block',maxWidth:'100%',height:'auto',margin:'0 auto',borderRadius:12}}/><div className="actions"><button type="button" className="btn-convert" onClick={()=>downloadBlob(result.blob,'photo-collage.png')}>Download PNG</button></div></div>}
  </section></>;
}
