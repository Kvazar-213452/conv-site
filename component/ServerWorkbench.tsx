"use client";
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { growthTools } from '@/lib/growth-tools';
import { downloadBlob } from '@/lib/growth-files';
import GrowthControls, { defaultValues } from './GrowthControls';
import ToolStepHeading from './ToolStepHeading';
import FileInput from './FileInput';
import '@/style/main.css';
import '@/style/growth.css';
export default function ServerWorkbench({slug}:{slug:string}){
  const tool=growthTools.find(t=>t.slug===slug)!;
  const [text,setText]=useState(tool.example),[second,setSecond]=useState(tool.exampleB??''),[files,setFiles]=useState<File[]>([]),[values,setValues]=useState(()=>defaultValues(tool.fields));
  const [busy,setBusy]=useState(false),[error,setError]=useState(''),[result,setResult]=useState<{blob:Blob;name:string;text:string;previewUrl:string|null}|null>(null),[copied,setCopied]=useState(false);
  useEffect(()=>()=>{if(result?.previewUrl)URL.revokeObjectURL(result.previewUrl);},[result]);
  const picker=useRef<HTMLInputElement>(null),request=useRef<AbortController|null>(null);
  useEffect(()=>()=>request.current?.abort(),[]);
  function invalidate(){setResult(null);setError('');setCopied(false);}
  async function responseError(response:Response){let message='Unable to process this request.';try{message=(await response.json()).error??message;}catch{}return new Error(message);}
  async function loadExample(){invalidate();setText(tool.example);setSecond(tool.exampleB??'');setValues(defaultValues(tool.fields));if(tool.server!.input==='text'){setText(tool.example);return;}setBusy(true);const controller=new AbortController();request.current=controller;
    try{const response=await fetch('/api/convert/'+slug+'?example=1',{signal:controller.signal,cache:'no-store'});if(!response.ok)throw await responseError(response);const blob=await response.blob(),name=/filename="([^"]+)"/.exec(response.headers.get('content-disposition')??'')?.[1]??'example.bin';setFiles(tool.server!.multiple?[new File([blob],'first-'+name,{type:blob.type}),new File([blob],'second-'+name,{type:blob.type})]:[new File([blob],name,{type:blob.type})]);if(picker.current)picker.current.value='';}
    catch(e){setError(e instanceof Error?e.message:'Could not load the example.');}finally{setBusy(false);}
  }
  async function run(){invalidate();if(tool.server!.input==='files'&&(!files.length||tool.server!.multiple&&files.length<2)){setError(tool.server!.multiple?'Choose at least two files.':'Choose a file or load the example.');return;}if(files.length>8||files.reduce((n,f)=>n+f.size,0)>4*1024*1024){setError('Use at most eight files and 4 MiB combined.');return;}if(text.length+second.length>2*1024*1024){setError('Use at most 2 MiB of input text.');return;}
    const controller=new AbortController();request.current=controller;const timeout=setTimeout(()=>controller.abort(),65000);setBusy(true);
    try{const form=new FormData();form.set('values',JSON.stringify(values));form.set('text',text);form.set('second',second);for(const file of files)form.append('files',file);if((await new Response(form).arrayBuffer()).byteLength>4*1024*1024+64*1024)throw new Error('Combined request is too large. Use smaller files or less text.');const response=await fetch('/api/convert/'+slug,{method:'POST',body:form,signal:controller.signal});if(!response.ok)throw await responseError(response);const blob=await response.blob(),name=/filename="([^"]+)"/.exec(response.headers.get('content-disposition')??'')?.[1]??'result.'+tool.extension;const readable=/^(?:text\/|application\/(?:json|toml))/.test(blob.type);setResult({blob,name,previewUrl:/^(?:image\/(?:jpeg|png|webp|gif)|audio\/(?:mpeg|wav|mp4|ogg|flac)|video\/(?:mp4|webm))$/.test(blob.type)?URL.createObjectURL(blob):null,text:readable?await blob.text():`${name}\n${blob.size.toLocaleString()} bytes\nReady to download. No conversion history is saved.`});}
    catch(e){setError(e instanceof Error&&e.name==='AbortError'?'The request timed out or was cancelled. Try a smaller input.':e instanceof Error?e.message:'Unable to convert this input.');}finally{clearTimeout(timeout);setBusy(false);}
  }
  return <>
    <section className="hero">
      <div className="hero-eyebrow">Free · Server conversion · No sign-up</div>
      <h1>{tool.title}</h1>
      <p>{tool.description}</p>
    </section>
    <section aria-label={tool.title}>
      <p className="server-processing-note">
        Your input is sent to this site only after you choose <strong>{tool.action}</strong>.
        The conversion runs for this request and no history is saved. Upload up to 4 MiB
        combined; Office files have a 2 MiB limit.
      </p>
      {tool.server!.warning && <p className="public-format-note"><strong>Before you convert:</strong> {tool.server!.warning}</p>}

      <ToolStepHeading
        number={1}
        title={tool.server!.input === 'files' ? tool.server!.multiple ? 'Choose your files' : 'Choose your file' : 'Enter your text'}
        description={tool.server!.input === 'files'
          ? tool.server!.multiple ? 'Add at least two files, then arrange them in the order you want.' : 'Choose a file or load the example to see how the converter works.'
          : 'Edit the example text or paste your own content.'}
      />
      {(tool.server!.input === 'text' || tool.server!.textLabel) && <div className="panel">
        <div className="panel-header"><label htmlFor="server-input">{tool.server!.textLabel ?? tool.inputLabel ?? 'Input text'}</label></div>
        <textarea id="server-input" value={text} disabled={busy} spellCheck={false} onChange={e => { setText(e.target.value); invalidate(); }} />
      </div>}
      {tool.exampleB !== undefined && <div className="panel">
        <div className="panel-header"><label htmlFor="server-second">{tool.secondInputLabel ?? 'Second input'}</label></div>
        <textarea id="server-second" disabled={busy} spellCheck={false} value={second} onChange={e => { setSecond(e.target.value); invalidate(); }} />
      </div>}
      {tool.server!.input === 'files' && <>
        <FileInput id="server-files" label={tool.server!.multiple ? 'Choose files in output order' : 'Choose input file'} hint={tool.server!.multiple ? 'Add at least two files, then arrange their order below.' : 'Select a file from your device. Your upload is processed for this request only.'} accept={tool.server!.accept} multiple={tool.server!.multiple} disabled={busy} files={files} inputRef={picker} showSelection={false} onFilesChange={next => { setFiles(next); invalidate(); }} />
        {files.length > 0 && <ol className="server-file-list">{files.map((file, index) => <li key={index}>
          <span>{file.name} · {file.size.toLocaleString()} bytes</span>
          {tool.server!.multiple && <>
            <button className="btn-secondary" type="button" disabled={busy || index === 0} aria-label={'Move ' + file.name + ' up'} onClick={() => { setFiles(previous => { const next = [...previous]; [next[index - 1], next[index]] = [next[index], next[index - 1]]; return next; }); invalidate(); }}>↑</button>
            <button className="btn-secondary" type="button" disabled={busy || index === files.length - 1} aria-label={'Move ' + file.name + ' down'} onClick={() => { setFiles(previous => { const next = [...previous]; [next[index], next[index + 1]] = [next[index + 1], next[index]]; return next; }); invalidate(); }}>↓</button>
          </>}
        </li>)}</ol>}
      </>}

      {tool.fields.length > 0 && <ToolStepHeading number={2} title="Choose your options" description="The defaults work for most files. Change a setting only when you need to." />}
      {tool.fields.length > 0 && <GrowthControls fields={tool.fields} values={values} disabled={busy} onChange={(key, value) => { setValues(v => ({ ...v, [key]: value })); invalidate(); }} />}
      <div className="actions">
        <button className="btn-convert" type="button" disabled={busy} onClick={run}>{busy ? 'Processing…' : tool.action}</button>
        <button className="btn-secondary" type="button" disabled={busy} onClick={loadExample}>Load example</button>
        <button className="btn-secondary" type="button" disabled={busy} onClick={() => { setText(''); setSecond(''); setFiles([]); if (picker.current) picker.current.value = ''; invalidate(); }}>Clear</button>
      </div>
      {busy && <p className="tool-feedback" role="status">Processing your file…</p>}
      {error && <p role="alert" className="error-bar">{error}</p>}
      {result && <div aria-live="polite" className="tool-result">
        <ToolStepHeading number={3} title="Your result is ready" description="Preview it here, then download a copy to your device." />
        {result.previewUrl && result.blob.type.startsWith('audio/') && <div className="public-media-result"><p>Listen to the result</p><audio controls preload="metadata" src={result.previewUrl} /></div>}
        {result.previewUrl && result.blob.type.startsWith('video/') && <div className="public-media-result"><p>Preview the result</p><video controls playsInline preload="metadata" src={result.previewUrl} /></div>}
        {result.previewUrl && result.blob.type.startsWith('image/') && <figure className="public-image-result"><Image src={result.previewUrl} alt="Converted image preview" width={900} height={600} unoptimized /><figcaption>{result.name} · {result.blob.size.toLocaleString()} bytes</figcaption></figure>}
        {['pdf-compressor', 'image-target-size'].includes(slug) && files.length === 1 && <p className="public-size-result">Original: {files[0].size.toLocaleString()} bytes · Result: {result.blob.size.toLocaleString()} bytes · {Math.max(0, (1 - result.blob.size / files[0].size) * 100).toFixed(1)}% smaller</p>}
        <div className="panel"><div className="panel-header"><label htmlFor="growth-result">Result</label></div><textarea id="growth-result" readOnly value={result.text} spellCheck={false} /></div>
        {!result.text && <p className="tool-feedback" role="status">The converted output is empty. Check whether the source contains extractable content.</p>}
        <div className="actions">
          <button className="btn-convert" type="button" onClick={() => downloadBlob(result.blob, result.name)}>Download file</button>
          <button className="btn-secondary" type="button" onClick={async () => { try { await navigator.clipboard.writeText(result.text); setCopied(true); } catch { setError('Select and copy the result manually.'); } }}>{copied ? 'Copied' : 'Copy result text'}</button>
        </div>
      </div>}
    </section>
  </>;
}
