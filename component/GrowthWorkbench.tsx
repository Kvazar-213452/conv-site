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
        {result.grid && <div className="css-grid-preview" aria-label="Generated CSS Grid preview" style={{ display: 'grid', gridTemplateColumns: result.grid.template, gap: result.grid.gap }}>{Array.from({ length: result.grid.items }, (_, i) => <div key={i}>{i + 1}</div>)}</div>}
        {result.preview && <div className="growth-preview-stage" aria-label="Generated CSS preview"><div className={'growth-design-preview ' + (slug === 'css-gradient-generator' ? 'growth-gradient-preview' : slug === 'css-text-shadow-generator' ? 'growth-shadow-preview' : '')} style={result.preview}><span>Preview</span></div></div>}
        <div className="panel"><div className="panel-header"><label className="panel-title" htmlFor="growth-result">Result</label></div><textarea id="growth-result" readOnly spellCheck={false} value={result.text} /></div>
        {!result.text && <p role="status">{slug.includes('extractor') ? 'No matching candidates found.' : 'The result is empty.'}</p>}
        <div className="actions"><button className="btn-secondary" onClick={async () => { try { await navigator.clipboard.writeText(result.text); setCopied(true); } catch { setError('Clipboard unavailable. Select and copy the result manually.'); } }}>{copied ? 'Copied' : 'Copy result'}</button><button className="btn-secondary" onClick={() => downloadBlob(new Blob([result.text], { type: slug === 'ean13-barcode-generator' ? 'image/svg+xml' : 'text/plain;charset=utf-8' }), `${slug}.${slug === 'srt-to-vtt' ? (values.direction === 'srt-vtt' ? 'vtt' : 'srt') : slug === 'subtitle-time-shifter' ? values.format : tool.extension}`)}>Download result</button></div>
      </div>}
    </section>
  </>;
}
