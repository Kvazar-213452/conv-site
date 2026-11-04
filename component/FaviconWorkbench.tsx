/* eslint-disable @next/next/no-img-element -- These are generated local icon blob previews. */
"use client";
import { useEffect, useState } from 'react';
import { growthTools } from '@/lib/growth-tools';
import { downloadBlob, faviconFiles, storedZip } from '@/lib/growth-files';
import GrowthControls, { defaultValues } from './GrowthControls';
import '@/style/main.css';
import '@/style/growth.css';
type IconFile = { name: string; blob: Blob; url: string };
export default function FaviconWorkbench({ slug }: { slug: string }) {
  const tool = growthTools.find(t => t.slug === slug)!;
  const [values, setValues] = useState(() => defaultValues(tool.fields)), [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<{ files: IconFile[]; zip: Blob; html: string } | null>(null), [busy, setBusy] = useState(false), [error, setError] = useState('');
  useEffect(() => () => { result?.files.forEach(f => URL.revokeObjectURL(f.url)); }, [result]);
  function invalidate() { setResult(null); setError(''); }
  async function run() {
    invalidate(); setBusy(true);
    try {
      if (!file) throw new Error('Choose an image first.');
      const files = await faviconFiles(file, values);
      const members = await Promise.all(files.map(async f => ({ name: f.name, bytes: new Uint8Array(await f.blob.arrayBuffer()) })));
      const zip = new Blob([storedZip(members)], { type: 'application/zip' });
      const html = await files.find(f => f.name === 'head-snippet.html')!.blob.text();
      setResult({ files: files.map(f => ({ ...f, url: URL.createObjectURL(f.blob) })), zip, html });
    } catch (e) { setError(e instanceof Error ? e.message : 'Icon generation failed.'); }
    finally { setBusy(false); }
  }
  return <><section className="hero"><div className="hero-eyebrow">Local icon package · ICO + PNG + manifest</div><h1>{tool.title}</h1><p>{tool.description}</p></section><section aria-label={tool.title}>
    <div className="growth-file-picker"><label htmlFor="source-image">PNG, JPEG or WebP source</label><input id="source-image" type="file" disabled={busy} accept="image/png,image/jpeg,image/webp" onChange={e => { setFile(e.target.files?.[0] ?? null); invalidate(); }} /></div>
    <GrowthControls fields={tool.fields} values={values} disabled={busy} onChange={(key, value) => { setValues(v => ({ ...v, [key]: value })); invalidate(); }} />
    <div className="actions"><button className="btn-convert" disabled={busy || !file} onClick={run}>{busy ? 'Generating…' : tool.action}</button></div>
    {error && <p className="error-bar" role="alert">{error}</p>}{result && <div aria-live="polite"><p className="growth-status">Icon package ready: {result.files.length} files. Edit the placeholder application names in the manifest before publishing.</p><div className="favicon-grid">{result.files.map(f => <div key={f.name}>{f.blob.type === 'image/png' && <img src={f.url} alt={f.name + ' preview'} />}<span>{f.name}</span><button className="btn-secondary" onClick={() => downloadBlob(f.blob, f.name)}>Download</button></div>)}</div><div className="actions"><button className="btn-convert" onClick={() => downloadBlob(result.zip, 'favicon-package.zip')}>Download all as ZIP</button></div><h2>HTML head snippet</h2><pre className="output-pre">{result.html}</pre></div>}
  </section></>;
}
