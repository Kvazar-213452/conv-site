"use client";
import { useRef, useState } from 'react';
import { growthTools } from '@/lib/growth-tools';
import { checksumBytes, decodeBase64, downloadBlob, encodeBase64, MAX_BINARY_BYTES } from '@/lib/growth-files';
import GrowthControls, { defaultValues } from './GrowthControls';
import '@/style/main.css';
import '@/style/growth.css';
export default function FileWorkbench({ slug }: { slug: string }) {
  const tool = growthTools.find(t => t.slug === slug)!;
  const [values, setValues] = useState(() => defaultValues(tool.fields));
  const [file, setFile] = useState<File | null>(null), [input, setInput] = useState('');
  const [result, setResult] = useState<{ text: string; blob?: Blob; size?: number } | null>(null);
  const [error, setError] = useState(''), [busy, setBusy] = useState(false), [copied, setCopied] = useState(false);
  const picker = useRef<HTMLInputElement>(null);
  const decode = slug === 'file-to-base64' && values.mode === 'decode';
  function invalidate() { setResult(null); setError(''); setCopied(false); }
  async function run() {
    invalidate(); setBusy(true);
    try {
      if (decode) {
        const bytes = decodeBase64(input);
        setResult({ text: `Decoded ${bytes.byteLength.toLocaleString()} bytes. Download as decoded.bin and rename only if you know the original format.`, blob: new Blob([bytes], { type: 'application/octet-stream' }), size: bytes.byteLength });
      } else {
        if (!file) throw new Error('Choose a file first.');
        const max = slug === 'file-checksum' ? 100 * 1024 * 1024 : MAX_BINARY_BYTES;
        if (file.size > max) throw new Error(`File must be at most ${max / 1024 / 1024} MiB.`);
        const bytes = await file.arrayBuffer();
        if (slug === 'file-checksum') setResult({ text: await checksumBytes(bytes, values.expected) });
        else {
          const encoded = encodeBase64(new Uint8Array(bytes));
          const mime = /^[\w.+-]+\/[\w.+-]+$/.test(file.type) ? file.type : 'application/octet-stream';
          setResult({ text: (values.style === 'data' ? `data:${mime};base64,` : '') + encoded });
        }
      }
    } catch (e) { setError(e instanceof Error ? e.message : 'Unable to process the file.'); }
    finally { setBusy(false); }
  }
  return <>
    <section className="hero"><div className="hero-eyebrow">Free · Local file processing · No sign-up</div><h1>{tool.title}</h1><p>{tool.description}</p></section>
    <section aria-label={tool.title}>
      <GrowthControls fields={tool.fields} values={values} disabled={busy} onChange={(key, value) => { setValues(v => ({ ...v, [key]: value })); invalidate(); }} />
      {decode ? <div className="panel"><div className="panel-header"><label className="panel-title" htmlFor="base64-input">Base64 or data URL</label></div><textarea id="base64-input" spellCheck={false} disabled={busy} value={input} onChange={e => { setInput(e.target.value); invalidate(); }} /></div> : <div className="growth-file-picker"><label htmlFor="binary-file">Choose local file</label><input id="binary-file" ref={picker} type="file" disabled={busy} onChange={e => { setFile(e.target.files?.[0] ?? null); invalidate(); }} />{file && <span>{file.name} · {file.size.toLocaleString()} bytes</span>}</div>}
      <div className="actions"><button className="btn-convert" disabled={busy} onClick={run}>{busy ? 'Processing…' : decode ? 'Decode to file' : tool.action}</button><button className="btn-secondary" disabled={busy} onClick={() => { if (decode) setInput('SGVsbG8sIHdvcmxkIQ=='); else { setFile(new File(['Hello, world!'], 'example.txt', { type: 'text/plain' })); if (picker.current) picker.current.value = ''; } invalidate(); }}>Load example</button><button className="btn-secondary" disabled={busy} onClick={() => { setInput(''); setFile(null); if (picker.current) picker.current.value = ''; invalidate(); }}>Clear</button></div>
      {error && <p className="error-bar" role="alert">{error}</p>}
      {result && <div aria-live="polite"><div className="panel"><div className="panel-header"><label className="panel-title" htmlFor="file-result">{result.blob ? 'Decoded file' : 'Result'}</label></div><textarea id="file-result" readOnly value={result.text} spellCheck={false} /></div><div className="actions">{!result.blob && <button className="btn-secondary" onClick={async () => { try { await navigator.clipboard.writeText(result.text); setCopied(true); } catch { setError('Clipboard unavailable. Select and copy the result manually.'); } }}>{copied ? 'Copied' : 'Copy result'}</button>}<button className="btn-secondary" onClick={() => downloadBlob(result.blob ?? new Blob([result.text], { type: 'text/plain;charset=utf-8' }), result.blob ? 'decoded.bin' : slug + '.txt')}>Download {result.blob ? 'decoded file' : 'result'}</button></div></div>}
    </section>
  </>;
}
