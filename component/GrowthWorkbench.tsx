"use client";
import { useState } from 'react';
import { growthTools } from '@/lib/growth-tools';
import { calculateGrowth, type GrowthResult } from '@/lib/growth-transforms';
import { downloadBlob } from '@/lib/growth-files';
import TableInputEditor from './TableInputEditor';
import GrowthControls, { defaultValues } from './GrowthControls';
import DesignPreviews from './DesignPreviews';
import ToolStepHeading from './ToolStepHeading';
import '@/style/main.css';
import '@/style/growth.css';
export default function GrowthWorkbench({ slug }: { slug: string }) {
  const tool = growthTools.find(t => t.slug === slug)!;
  const [input, setInput] = useState(tool.example), [second, setSecond] = useState(tool.exampleB ?? '');
  const [values, setValues] = useState(() => { const initial=defaultValues(tool.fields); if(slug==='countdown-timer'&&typeof window!=='undefined'){const params=new URLSearchParams(window.location.search); for(const key of ['date','time','event'])if(params.has(key))initial[key]=params.get(key)??'';}return initial; });
  const [result, setResult] = useState<GrowthResult | null>(null), [error, setError] = useState(''), [copied, setCopied] = useState(false);
  const hasInput = tool.kind === 'text' && slug !== 'percentage-calculator';
  function invalidate() { setResult(null); setError(''); setCopied(false); }
  async function run() {
    invalidate();
    try {
      if (input.length + second.length > 2 * 1024 * 1024) throw new Error('Use at most 2 MiB of input text per conversion.');
      if (slug === 'api-response-time-tester') {
        const target = new URL(values.url || input.trim());
        if (target.protocol !== 'https:' && target.protocol !== 'http:') throw new Error('Use an HTTP or HTTPS URL.');
        const start = performance.now();
        try { const response = await fetch(target, { method: 'GET', mode: 'cors', cache: 'no-store' }); const elapsed = performance.now() - start; const body = await response.text(); setResult({ text: `URL: ${target.href}\nStatus: ${response.status} ${response.statusText}\nBrowser-observed response time: ${elapsed.toFixed(0)} ms\nResponse body read: ${new Blob([body]).size.toLocaleString()} bytes\n\nThis measurement is from your browser and includes network conditions. CORS restrictions may prevent reading some endpoints; it is not a server-side uptime monitor.` }); return; }
        catch (error) { throw new Error(error instanceof Error ? `Request could not be read by this browser (often due to CORS): ${error.message}` : 'Request failed or was blocked by CORS.'); }
      }
      if (slug === 'website-speed-test' || slug === 'ssl-certificate-checker') {
        const target = new URL(input.trim());
        if (!['https:', 'http:'].includes(target.protocol)) throw new Error('Enter an HTTP or HTTPS URL.');
        const start = performance.now();
        try {
          const response = await fetch(target.href, { mode: 'cors', cache: 'no-store' });
          const elapsed = performance.now() - start;
          const bytes = new Blob([await response.arrayBuffer()]).size;
          setResult({ text: `${slug === 'website-speed-test' ? 'Browser-observed response test' : 'HTTPS connection check'}\nURL: ${target.href}\nStatus: ${response.status} ${response.statusText}\nResponse time: ${elapsed.toFixed(0)} ms\nReadable response bytes: ${bytes.toLocaleString()}\n\nThis browser measurement depends on your connection and CORS access. It is not a Lighthouse/PageSpeed score or a complete certificate-chain and expiry audit.${slug === 'ssl-certificate-checker' && target.protocol !== 'https:' ? '\nWarning: this URL uses HTTP, not HTTPS.' : ''}` }); return;
        } catch (reason) { throw new Error(reason instanceof Error ? `The browser could not read this URL (often due to CORS): ${reason.message}` : 'The request failed or was blocked by browser security.'); }
      }
      if (slug === 'domain-age-checker') {
        const domain = input.trim().replace(/^https?:\/\//i, '').split(/[/?#:]/)[0].toLowerCase();
        if (!/^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/.test(domain)) throw new Error('Enter a valid domain name, such as example.com.');
        const response = await fetch(`https://rdap.org/domain/${encodeURIComponent(domain)}`, { headers: { Accept: 'application/rdap+json, application/json' } });
        if (!response.ok) throw new Error(`The public RDAP lookup returned ${response.status}. Some registries do not publish a creation date.`);
        const record = await response.json();
        const created = record.events?.find((event: { eventAction?: string }) => event.eventAction === 'registration')?.eventDate;
        if (!created) throw new Error('This registry did not return a registration date.');
        const date = new Date(created), age = Math.max(0, (Date.now() - +date) / 86400000 / 365.2425);
        setResult({ text: `Domain: ${domain}\nRegistration date (RDAP): ${date.toLocaleDateString()}\nApproximate age: ${age.toFixed(1)} years\n\nThis is the registry's registration date where available. It does not show when a website first launched or whether ownership changed.` }); return;
      }
      if (slug === 'email-deliverability-checker') {
        const domain = input.trim().toLowerCase().replace(/^@/, '');
        if (!/^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/.test(domain)) throw new Error('Enter a domain such as example.com.');
        const lookup = async (name: string, type: string) => { const url = new URL('https://dns.google/resolve');url.searchParams.set('name',name);url.searchParams.set('type',type);const response=await fetch(url);if(!response.ok)throw new Error('DNS-over-HTTPS lookup failed.');return response.json(); };
        const [mx, spf, dmarc] = await Promise.all([lookup(domain,'MX'),lookup(domain,'TXT'),lookup(`_dmarc.${domain}`,'TXT')]);
        const txt=(x: {Answer?:{data:string}[]})=>(x.Answer??[]).map(a=>a.data.replace(/^"|"$/g,''));
        const spfRecords=txt(spf).filter((x:string)=>x.startsWith('v=spf1'));
        const dmarcRecords=txt(dmarc).filter((x:string)=>x.toLowerCase().startsWith('v=dmarc1'));
        setResult({ text: `Domain: ${domain}\nMX records: ${(mx.Answer??[]).map((x:{data:string})=>x.data).join('\n')||'None found'}\nSPF TXT: ${spfRecords.join('\n')||'No SPF record found'}\nDMARC TXT: ${dmarcRecords.join('\n')||'No DMARC record found'}\n\nDNS presence checks only. This does not send mail or test inbox placement, IP reputation, DKIM signing or provider-specific policy.` }); return;
      }
      setResult(calculateGrowth(slug, input, values, second));
    } catch (e) { setError(e instanceof Error ? e.message : 'Unable to process this input.'); }
  }
  return <>
    <section className="hero"><div className="hero-eyebrow">Free · No sign-up · Runs in your browser</div><h1>{tool.title}</h1><p>{tool.description}</p></section>
    <section aria-label={tool.title}>
      {hasInput && <ToolStepHeading number={1} title="Start with your input" description="Edit the example or replace it with your own text." />}
      {hasInput && tool.tableInput && <TableInputEditor headers={tool.tableInput.headers} value={input} onChange={value => { setInput(value); invalidate(); }} />}
      {hasInput && !tool.tableInput && <div className="converter"><div className="panel"><div className="panel-header"><label className="panel-title" htmlFor="growth-input">{tool.inputLabel ?? (slug === 'list-compare' ? 'List A' : 'Input')}</label></div><textarea id="growth-input" spellCheck={false} value={input} onChange={e => { setInput(e.target.value); invalidate(); }} /></div>{tool.exampleB !== undefined && <div className="panel"><div className="panel-header"><label className="panel-title" htmlFor="growth-second">{tool.secondInputLabel ?? 'List B'}</label></div><textarea id="growth-second" spellCheck={false} value={second} onChange={e => { setSecond(e.target.value); invalidate(); }} /></div>}</div>}
        {tool.fields.length > 0 && <ToolStepHeading number={hasInput ? 2 : 1} title={hasInput ? 'Choose your options' : 'Set your values'} description={hasInput ? 'These settings are optional. Keep the defaults to get started.' : 'Adjust the values, then calculate your result.'} />}
      {tool.fields.length > 0 && <GrowthControls fields={tool.fields} values={values} onChange={(key, value) => { setValues(v => ({ ...v, [key]: value })); invalidate(); }} />}
      <div className="actions"><button className="btn-convert" onClick={run}>{tool.action}</button><button className="btn-secondary" onClick={() => { setInput(tool.example); setSecond(tool.exampleB ?? ''); setValues(defaultValues(tool.fields)); invalidate(); }}>Reset example</button>{hasInput && <button className="btn-secondary" onClick={() => { setInput(''); setSecond(''); invalidate(); }}>Clear</button>}</div>
      {error && <p role="alert" className="error-bar">{error}</p>}
      {result && <div aria-live="polite">
        <ToolStepHeading number={hasInput && tool.fields.length > 0 ? 3 : 2} title="Your result is ready" description="Review the result below, then copy or download it." />
        {result.notice && <p role="status">{result.notice}</p>}
        <DesignPreviews result={result} />
        {['business-card-maker','barcode-generator'].includes(slug) && <iframe title={`${tool.title} preview`} sandbox="" srcDoc={result.text} style={{ width: '100%', minHeight: 260, border: '1px solid var(--border, #d9ded8)', borderRadius: 12, background: '#fff' }} />}
        {result.grid && <div className="css-grid-preview" aria-label="Generated CSS Grid preview" style={{ display: 'grid', gridTemplateColumns: result.grid.template, gap: result.grid.gap }}>{Array.from({ length: result.grid.items }, (_, i) => <div key={i}>{i + 1}</div>)}</div>}
        {result.preview && <div className="growth-preview-stage" aria-label="Generated CSS preview"><div className={'growth-design-preview ' + (slug === 'css-gradient-generator' ? 'growth-gradient-preview' : slug === 'css-text-shadow-generator' ? 'growth-shadow-preview' : '')} style={result.preview}><span>Preview</span></div></div>}
        <div className="panel"><div className="panel-header"><label className="panel-title" htmlFor="growth-result">Result</label></div><textarea id="growth-result" readOnly spellCheck={false} value={result.text} /></div>
        {!result.text && <p role="status">{slug.includes('extractor') ? 'No matching candidates found.' : 'The result is empty.'}</p>}
        <div className="actions"><button className="btn-secondary" onClick={async () => { try { await navigator.clipboard.writeText(result.text); setCopied(true); } catch { setError('Clipboard unavailable. Select and copy the result manually.'); } }}>{copied ? 'Copied' : 'Copy result'}</button><button className="btn-secondary" onClick={() => downloadBlob(new Blob([result.text], { type: ['ean13-barcode-generator','barcode-generator','business-card-maker'].includes(slug) ? 'image/svg+xml;charset=utf-8' : 'text/plain;charset=utf-8' }), `${slug}.${slug === 'srt-to-vtt' ? (values.direction === 'srt-vtt' ? 'vtt' : 'srt') : slug === 'subtitle-time-shifter' ? values.format : tool.extension}`)}>Download result</button></div>
      </div>}
    </section>
  </>;
}
