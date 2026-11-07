"use client";
import { useRef, useState } from 'react';
import { expansionTools } from '@/lib/expansion-tools';
import { transformTool } from '@/lib/expansion-transforms';
import ToolStepHeading from './ToolStepHeading';
import '@/style/main.css';
import '@/style/bar.css';
export default function ToolWorkbench({ slug }: { slug: string }) {
  const tool = expansionTools.find(t => t.slug === slug)!;
  const [input, setInput] = useState<string>(tool.example);
  const [output, setOutput] = useState('');
  const [reverse, setReverse] = useState(false);
  const [base, setBase] = useState('16');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [copied, setCopied] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  function clearFile() { setFile(null); if (fileInput.current) fileInput.current.value = ''; }
  function invalidate() { setOutput(''); setError(''); setCopied(false); }
  async function run() {
    setBusy(true); invalidate();
    try { setOutput(await transformTool(slug, input, reverse, Number(base), file ? await file.arrayBuffer() : undefined)); }
    catch (e) { setError(e instanceof Error ? e.message : 'Unable to process input.'); }
    finally { setBusy(false); }
  }
  return <>
    <section className="hero"><div className="hero-eyebrow">Free · No sign-up · Browser processing</div><h1>{tool.title}</h1><p>{tool.description}</p></section>
    <section aria-label={tool.title}>
      <p className="tool-help-note">{tool.note}</p>
      <ToolStepHeading number={1} title="Enter or paste your input" description="The example is ready to edit. Your input stays in this browser." />
      <div className="converter">
        <div className="panel"><div className="panel-header"><label className="panel-title" htmlFor="tool-input">{file ? `File selected: ${file.name}` : 'Your input'}</label></div><textarea id="tool-input" spellCheck={false} disabled={busy || !!file} value={input} onChange={e => { setInput(e.target.value); invalidate(); }} /></div>
        <div className="panel"><div className="panel-header"><label className="panel-title" htmlFor="tool-output">{output ? 'Your result' : 'Result preview'}</label></div><textarea id="tool-output" spellCheck={false} readOnly value={output} placeholder="Your result will appear here after you run the tool." aria-live="polite" /></div>
      </div>
      {(tool.reverse || slug === 'px-to-rem' || slug === 'sri-generator') && <>
        <ToolStepHeading number={2} title="Choose your settings" description="Change the direction or options only if you need to." />
        <div className="options-bar">
          {tool.reverse && <label>Direction <select disabled={busy} value={reverse ? 'reverse' : 'forward'} onChange={e => { setReverse(e.target.value === 'reverse'); invalidate(); }}><option value="forward">{tool.forward}</option><option value="reverse">{tool.reverse}</option></select></label>}
          {slug === 'px-to-rem' && <label>Root font size (px) <input disabled={busy} type="number" min="0.01" step="any" value={base} onChange={e => { setBase(e.target.value); invalidate(); }} /></label>}
          {slug === 'sri-generator' && <label>Exact file bytes <input disabled={busy} type="file" ref={fileInput} onChange={e => { setFile(e.target.files?.[0] ?? null); invalidate(); }} /></label>}
        </div>
      </>}
      {error && <p className="error-bar" role="alert">{error}</p>}
      <div className="actions">
        <button className="btn-convert" disabled={busy || (!input && !file)} onClick={run}>{busy ? 'Processing…' : reverse ? tool.reverse : tool.forward}</button>
        <button className="btn-secondary" disabled={busy} onClick={() => { setInput(tool.example); clearFile(); setReverse(false); invalidate(); }}>Load example</button>
        <button className="btn-secondary" disabled={busy} onClick={() => { setInput(''); clearFile(); invalidate(); }}>Clear</button>
        <button className="btn-secondary" disabled={!output} onClick={async () => { try { await navigator.clipboard.writeText(output); setCopied(true); } catch { setError('Clipboard unavailable. Select and copy the result manually.'); } }}>{copied ? 'Copied' : 'Copy result'}</button>
        <button className="btn-secondary" disabled={!output} onClick={() => { const url = URL.createObjectURL(new Blob([output], { type: 'text/plain;charset=utf-8' })); const a = document.createElement('a'); a.href = url; const ext = slug === 'json-to-ndjson' ? (reverse ? 'json' : 'ndjson') : slug === 'tsv-to-json' ? (reverse ? 'tsv' : 'json') : slug === 'json-flattener' ? 'json' : 'txt'; a.download = slug + '.' + ext; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); }}>Download</button>
      </div>
      <p className="tool-help-note">Processed locally in your browser. Avoid sharing the result if it contains private data.</p>
    </section>
  </>;
}
