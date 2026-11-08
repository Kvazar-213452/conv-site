'use client';
import { useState } from 'react';
import { growthTools } from '@/lib/growth-tools';
import '@/style/deepseek-tools.css';

export default function DeepSeekWorkbench({slug}:{slug:string}){
 const tool=growthTools.find(item=>item.slug===slug&&item.ai);
 if(!tool)throw new Error(`Unknown AI tool: ${slug}`);
 const field=tool.fields[0];
 const [input,setInput]=useState(tool.example),[result,setResult]=useState(''),[error,setError]=useState(''),[busy,setBusy]=useState(false),[copied,setCopied]=useState(false);
 async function submit(event:React.FormEvent<HTMLFormElement>){event.preventDefault();setBusy(true);setError('');setResult('');setCopied(false);try{const response=await fetch(`/api/ai/${encodeURIComponent(slug)}`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({content:input})});const body=await response.json();if(!response.ok)throw new Error(typeof body?.error==='string'?body.error:'Could not generate a response.');setResult(body.text)}catch(reason){setError(reason instanceof Error?reason.message:'Could not reach the AI service. Please try again.')}finally{setBusy(false)}}
 return <>
  <section className="hero"><div className="hero-eyebrow">AI writing helper · Powered by DeepSeek</div><h1>{tool.title}</h1><p>{tool.description}</p></section>
  <section className="deepseek-workbench" aria-label={tool.title}>
   <div className="panel deepseek-input-panel"><div className="panel-header"><span className="panel-title">Your details</span></div>
    <form onSubmit={submit}><label className="deepseek-input-label" htmlFor="deepseek-content">{field.label}</label><textarea id="deepseek-content" required minLength={3} maxLength={6000} rows={9} value={input} placeholder={tool.aiPlaceholder} onChange={event=>setInput(event.target.value)}/><div className="deepseek-input-footer"><span>{input.length.toLocaleString()} / 6,000 characters</span><button className="btn-secondary" type="button" disabled={busy} onClick={()=>{setInput(tool.example);setResult('');setError('')}}>Use example</button></div>
     <p className="deepseek-privacy">Your text is sent to DeepSeek to generate a draft. Avoid passwords, private records and confidential information. Review AI output before using it.</p><button className="btn-convert" type="submit" disabled={busy||input.trim().length<3}>{busy?'Generating…':tool.action}</button>
    </form>{error&&<p role="alert" className="error-bar">{error}</p>}
   </div>
   {result&&<div className="deepseek-result panel" aria-live="polite"><div className="panel-header"><span className="panel-title">Your draft</span><button className="btn-secondary" type="button" onClick={async()=>{try{await navigator.clipboard.writeText(result);setCopied(true)}catch{setError('Clipboard unavailable. Select and copy the text manually.')}}}>{copied?'Copied':'Copy draft'}</button></div><div className="deepseek-result-text">{result}</div><p className="deepseek-review-note">AI can make mistakes. Check names, facts, numbers and tone before using this draft.</p></div>}
  </section>
 </>;
}
