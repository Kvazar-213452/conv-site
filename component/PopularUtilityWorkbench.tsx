/* eslint-disable @next/next/no-img-element -- User-selected and public thumbnail previews are runtime blob/CDN URLs. */
"use client";
import { useState } from 'react';
import QRCode from 'qrcode';
import jsQR from 'jsqr';
import { growthTools } from '@/lib/growth-tools';
import { downloadBlob } from '@/lib/growth-files';
import ToolStepHeading from './ToolStepHeading';
import '@/style/main.css';
import '@/style/growth.css';

const CURRENCIES = ['USD','EUR','GBP','CAD','AUD','NZD','CHF','JPY','CNY','INR','SGD','HKD','KRW','MXN','BRL','ZAR','TRY','PLN','CZK','HUF','RON','BGN','SEK','NOK','DKK','ISK','UAH'];

export default function PopularUtilityWorkbench({ slug }: { slug: string }) {
  const tool = growthTools.find(item => item.slug === slug)!;
  if (slug === 'wifi-qr-generator') return <WifiQr tool={tool} />;
  if (slug === 'qr-code-reader') return <QrReader tool={tool} />;
  if (slug === 'currency-converter') return <CurrencyConverter tool={tool} />;
  return <YoutubeThumbnail tool={tool} />;
}

function WifiQr({ tool }: { tool: (typeof growthTools)[number] }) {
  const [ssid,setSsid]=useState(''),[password,setPassword]=useState(''),[security,setSecurity]=useState('WPA'),[hidden,setHidden]=useState(false);
  const [result,setResult]=useState<{png:string;svg:string}|null>(null),[error,setError]=useState(''),[busy,setBusy]=useState(false);
  async function create() {
    setError('');setResult(null);
    if(!ssid.trim()||ssid.length>32){setError('Enter a WiFi name up to 32 characters.');return;}
    if(security!=='nopass'&&(!password||password.length>63)){setError('Enter a WiFi password up to 63 characters.');return;}
    const escape=(s:string)=>s.replace(/[\\;,:"]/g,'\\$&');
    const payload=`WIFI:T:${security};S:${escape(ssid)};P:${security==='nopass'?'':escape(password)};H:${hidden?'true':'false'};;`;
    setBusy(true);
    try { const [png,svg]=await Promise.all([QRCode.toDataURL(payload,{width:480,margin:4,errorCorrectionLevel:'M'}),QRCode.toString(payload,{type:'svg',width:480,margin:4,errorCorrectionLevel:'M'})]);setResult({png,svg}); }
    catch { setError('Could not create the QR code in this browser.'); }
    finally { setBusy(false); }
  }
  return <>
    <ToolHero tool={tool} />
    <section aria-label={tool.title}>
      <ToolStepHeading number={1} title="Enter your WiFi details" description="These details are encoded in the QR code and stay in this browser." />
      <div className="growth-controls">
        <label>WiFi network name (SSID)<input autoComplete="off" maxLength={32} value={ssid} onChange={e=>setSsid(e.target.value)} /></label>
        {security!=='nopass'&&<label>WiFi password<input autoComplete="new-password" type="password" maxLength={63} value={password} onChange={e=>setPassword(e.target.value)} /></label>}
        <label>Security<select value={security} onChange={e=>setSecurity(e.target.value)}><option value="WPA">WPA / WPA2 / WPA3</option><option value="WEP">WEP</option><option value="nopass">Open network</option></select></label>
        <label className="quick-check">Hidden network<input type="checkbox" checked={hidden} onChange={e=>setHidden(e.target.checked)} /></label>
      </div>
      <div className="actions"><button className="btn-convert" disabled={busy} onClick={create}>{busy?'Creating…':tool.action}</button></div>
      {error&&<p className="error-bar" role="alert">{error}</p>}
      {result&&<div aria-live="polite"><ToolStepHeading number={2} title="Your WiFi QR code is ready" description="Scan it with a second device before you share it." /><div className="qr-preview"><img src={result.png} width="480" height="480" alt="WiFi connection QR code" /></div><div className="actions"><button className="btn-convert" onClick={()=>downloadBlob(new Blob([Uint8Array.from(atob(result.png.split(',')[1]),c=>c.charCodeAt(0))],{type:'image/png'}),'wifi-qr.png')}>Download PNG</button><button className="btn-secondary" onClick={()=>downloadBlob(new Blob([result.svg],{type:'image/svg+xml'}),'wifi-qr.svg')}>Download SVG</button></div></div>}
    </section>
  </>;
}

function QrReader({ tool }: { tool: (typeof growthTools)[number] }) {
  const [name,setName]=useState(''),[result,setResult]=useState(''),[error,setError]=useState(''),[busy,setBusy]=useState(false),[copied,setCopied]=useState(false);
  async function scan(file?:File) {
    setError('');setResult('');setCopied(false);if(!file)return;
    if(!file.type.startsWith('image/')||file.size>20*1024*1024){setError('Choose an image file no larger than 20 MiB.');return;}
    setName(file.name);setBusy(true);
    try {
      const bitmap=await createImageBitmap(file);
      try {
        if(bitmap.width*bitmap.height>40_000_000)throw new Error('Image dimensions are too large. Choose an image below 40 megapixels.');
        const scale=Math.min(1,2400/Math.max(bitmap.width,bitmap.height)),canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(bitmap.width*scale));canvas.height=Math.max(1,Math.round(bitmap.height*scale));
        const context=canvas.getContext('2d',{willReadFrequently:true});if(!context)throw new Error('Canvas reading is unavailable in this browser.');
        context.drawImage(bitmap,0,0,canvas.width,canvas.height);const pixels=context.getImageData(0,0,canvas.width,canvas.height);const code=jsQR(pixels.data,canvas.width,canvas.height,{inversionAttempts:'attemptBoth'});
        if(!code)throw new Error('No readable QR code found. Try a sharper image with the full code visible.');
        setResult(code.data);
      } finally { bitmap.close(); }
    } catch(e){setError(e instanceof Error?e.message:'Could not read this image.');}
    finally{setBusy(false);}
  }
  return <><ToolHero tool={tool}/><section aria-label={tool.title}>
    <ToolStepHeading number={1} title="Choose an image with a QR code" description="The image is scanned locally. Links are shown as text and will not open automatically." />
    <div className="growth-file-picker"><label htmlFor="qr-image">PNG, JPG, WebP or another browser-readable image · up to 20 MiB</label><input id="qr-image" type="file" accept="image/*" disabled={busy} onChange={e=>void scan(e.target.files?.[0])}/></div>
    {busy&&<p role="status" className="tool-feedback">Scanning {name}…</p>}{error&&<p role="alert" className="error-bar">{error}</p>}
    {result&&<div aria-live="polite"><ToolStepHeading number={2} title="QR code decoded" description="Review the result before opening or sharing it."/><div className="panel"><div className="panel-header"><label className="panel-title" htmlFor="qr-result">Decoded content</label></div><textarea id="qr-result" readOnly value={result}/></div><div className="actions"><button className="btn-convert" onClick={async()=>{try{await navigator.clipboard.writeText(result);setCopied(true)}catch{setError('Select and copy the result manually.')}}}>{copied?'Copied':'Copy decoded text'}</button></div></div>}
  </section></>;
}

function CurrencyConverter({ tool }: { tool: (typeof growthTools)[number] }) {
  const [amount,setAmount]=useState('100'),[from,setFrom]=useState('USD'),[to,setTo]=useState('EUR'),[result,setResult]=useState(''),[rateDate,setRateDate]=useState(''),[error,setError]=useState(''),[busy,setBusy]=useState(false);
  async function convert() {
    setError('');setResult('');const n=Number(amount);if(!amount.trim()||!Number.isFinite(n)||n<0){setError('Enter a non-negative amount.');return;}
    setBusy(true);
    try {
      let rate=1,date='Same currency';
      if(from!==to){const response=await fetch(`https://api.frankfurter.dev/v2/rate/${encodeURIComponent(from)}/${encodeURIComponent(to)}`,{cache:'no-store'});if(!response.ok)throw new Error(response.status===422?'Currency code not available. Choose a supported ISO code.':'Exchange rates are temporarily unavailable. Try again shortly.');const data=await response.json();if(typeof data.rate!=='number'||!Number.isFinite(data.rate))throw new Error('The rate provider returned an invalid response.');rate=data.rate;date=data.date;}
      const formatted=new Intl.NumberFormat(undefined,{style:'currency',currency:to,maximumFractionDigits:4}).format(n*rate);setResult(formatted);setRateDate(date);
    }catch(e){setError(e instanceof Error?e.message:'Unable to load an exchange rate.');}finally{setBusy(false);}
  }
  return <><ToolHero tool={tool}/><section aria-label={tool.title}>
    <ToolStepHeading number={1} title="Choose currencies and amount" description="The rate request goes to the public Frankfurter service when you convert." />
    <div className="growth-controls currency-fields"><label>Amount<input type="number" min="0" step="any" value={amount} onChange={e=>setAmount(e.target.value)}/></label><label>From<select value={from} onChange={e=>setFrom(e.target.value)}>{CURRENCIES.map(c=><option key={c}>{c}</option>)}</select></label><label>To<select value={to} onChange={e=>setTo(e.target.value)}>{CURRENCIES.map(c=><option key={c}>{c}</option>)}</select></label></div>
    <div className="actions"><button className="btn-convert" disabled={busy} onClick={convert}>{busy?'Getting rate…':tool.action}</button></div>
    {error&&<p role="alert" className="error-bar">{error}</p>}{result&&<div aria-live="polite"><ToolStepHeading number={2} title="Conversion result" description={`Reference rate date: ${rateDate}. Rates can differ from card and bank rates.`}/><p className="growth-status"><strong>{result}</strong></p></div>}
  </section></>;
}

function YoutubeThumbnail({ tool }: { tool: (typeof growthTools)[number] }) {
  const [input,setInput]=useState(''),[id,setId]=useState(''),[error,setError]=useState('');
  function find(){setError('');setId('');try{const raw=input.trim();let video='';if(/^[\w-]{11}$/.test(raw))video=raw;else{const url=new URL(raw);if(!['youtube.com','www.youtube.com','m.youtube.com','youtu.be','www.youtube-nocookie.com'].includes(url.hostname))throw new Error();video=url.hostname==='youtu.be'?url.pathname.slice(1):url.searchParams.get('v')??url.pathname.split('/').filter(Boolean).at(-1)??'';}if(!/^[\w-]{11}$/.test(video))throw new Error();setId(video)}catch{setError('Paste a YouTube video URL or an 11-character video ID.')}}
  const sizes=[['maxresdefault','Maximum resolution'],['sddefault','Standard'],['hqdefault','High quality'],['mqdefault','Medium quality']];
  return <><ToolHero tool={tool}/><section aria-label={tool.title}><ToolStepHeading number={1} title="Paste a YouTube video link" description="Only public thumbnail images are shown. This does not download the video."/><div className="panel"><div className="panel-header"><label className="panel-title" htmlFor="youtube-url">YouTube URL or video ID</label></div><textarea id="youtube-url" rows={2} value={input} onChange={e=>setInput(e.target.value)} placeholder="https://www.youtube.com/watch?v=…"/></div><div className="actions"><button className="btn-convert" onClick={find}>{tool.action}</button></div>{error&&<p role="alert" className="error-bar">{error}</p>}{id&&<div aria-live="polite"><ToolStepHeading number={2} title="Available thumbnail sizes" description="Some videos do not provide every resolution. Open an image to save it from your browser."/><div className="growth-images">{sizes.map(([size,label])=><figure key={size}><figcaption>{label}</figcaption><a href={`https://i.ytimg.com/vi/${id}/${size}.jpg`} target="_blank" rel="noopener noreferrer"><img loading="lazy" src={`https://i.ytimg.com/vi/${id}/${size}.jpg`} alt={`${label} YouTube thumbnail`} onError={e=>{e.currentTarget.closest('figure')?.setAttribute('data-unavailable','true')}}/></a></figure>)}</div></div>}</section></>;
}

function ToolHero({tool}:{tool:(typeof growthTools)[number]}) { return <section className="hero"><div className="hero-eyebrow">Free · No sign-up · Browser tool</div><h1>{tool.title}</h1><p>{tool.description}</p></section>; }
