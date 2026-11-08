'use client';
import { useState } from 'react';
import { growthTools } from '@/lib/growth-tools';
import '@/style/api-lookups.css';

function inputType(key:string):string{return ['year','latitude','longitude'].includes(key)?'number':'text';}

export default function ApiLookupWorkbench({slug}:{slug:string}){
 const tool=growthTools.find(item=>item.slug===slug&&item.api);
 if(!tool)throw new Error(`Unknown API lookup tool: ${slug}`);
 const fields=tool.apiFields??[];
 const initial=()=>Object.fromEntries(fields.map(field=>[field.key,field.example]));
 const [values,setValues]=useState<Record<string,string>>(initial);
 const [result,setResult]=useState<unknown>(null),[error,setError]=useState(''),[busy,setBusy]=useState(false),[copied,setCopied]=useState(false);
 async function submit(event:React.FormEvent<HTMLFormElement>){
  event.preventDefault();setBusy(true);setResult(null);setError('');setCopied(false);
  try{
   const response=await fetch(`/api/lookup/${encodeURIComponent(slug)}`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(values)});
   const body=await response.json();if(!response.ok)throw new Error(typeof body?.error==='string'?body.error:'The lookup could not be completed.');
   setResult(body);
  }catch(reason){setError(reason instanceof Error?reason.message:'The lookup could not be completed. Check your connection and try again.');}
  finally{setBusy(false);}
 }
 const output=result===null?'':JSON.stringify(result,null,2);
 return <>
  <section className="hero"><div className="hero-eyebrow">Live public data · No account required</div><h1>{tool.title}</h1><p>{tool.description}</p></section>
  <section className="api-lookup-workbench" aria-label={tool.title}>
   <div className="panel api-lookup-panel">
    <div className="panel-header"><span className="panel-title">Enter lookup details</span></div>
    <form onSubmit={submit}>
     <div className="api-lookup-fields">{fields.map(field=><label className="api-lookup-field" key={field.key}>
      <span>{field.label}</span><input required autoComplete="off" type={inputType(field.key)} inputMode={inputType(field.key)==='number'?'decimal':'text'} min={field.key==='latitude'?'-90':field.key==='longitude'?'-180':field.key==='year'?'1900':undefined} max={field.key==='latitude'?'90':field.key==='longitude'?'180':field.key==='year'?'2100':undefined} step={inputType(field.key)==='number'?'any':undefined} value={values[field.key]??''} placeholder={field.placeholder} onChange={event=>setValues(current=>({...current,[field.key]:event.target.value}))}/>
     </label>)}</div>
     <p className="api-lookup-privacy">Submitting sends these values through this site to the named public data provider. Providers may process requests under their own policies; this site does not keep a lookup history.</p>
     <div className="actions"><button className="btn-convert" type="submit" disabled={busy}>{busy?'Looking up…':tool.action}</button><button className="btn-secondary" type="button" disabled={busy} onClick={()=>{setValues(initial());setError('');setResult(null);}}>Use example</button></div>
    </form>
    {error&&<p role="alert" className="error-bar">{error}</p>}
   </div>
   {result!==null&&<div className="api-lookup-result" aria-live="polite">
    <div className="panel"><div className="panel-header"><span className="panel-title">Lookup result</span></div><pre className="api-lookup-output">{output}</pre></div>
    <div className="actions"><button className="btn-secondary" type="button" onClick={async()=>{try{await navigator.clipboard.writeText(output);setCopied(true)}catch{setError('Clipboard unavailable. Select and copy the result manually.')}}}>{copied?'Copied':'Copy result'}</button><a className="btn-secondary api-source-link" href={tool.reference} target="_blank" rel="noopener noreferrer">Data source &amp; documentation</a></div>
   </div>}
   {tool.reference&&<p className="api-lookup-source">Data provided by <a href={tool.reference} target="_blank" rel="noopener noreferrer">{slug==='core-web-vitals-checker'?'Google PageSpeed Insights':slug.startsWith('weather-')||slug.includes('geocod')||slug==='city-time-lookup'||slug==='elevation-lookup'||slug.includes('quality')||slug.includes('pollen')||slug.includes('sunrise')?'Open-Meteo':slug==='dns-lookup'?'Cloudflare DNS':slug==='public-holiday-lookup'?'Nager.Date':slug==='postal-code-lookup'?'Zippopotam.us':slug==='ip-geolocation'?'ipwho.is':slug.startsWith('github-')?'GitHub':slug==='npm-package-lookup'?'npm':slug==='pypi-package-lookup'?'PyPI':slug==='docker-image-lookup'?'Docker Hub':slug==='isbn-book-lookup'?'Open Library':'Open Food Facts'}</a>. Provider availability and data coverage can vary.</p>}
  </section>
 </>;
}
