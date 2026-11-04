/* eslint-disable @next/next/no-img-element -- The preview uses a locally encoded PNG blob. */
"use client";
import { useEffect, useState } from 'react';
import { growthTools } from '@/lib/growth-tools';
import { downloadBlob, svgPng } from '@/lib/growth-files';
import GrowthControls, { defaultValues } from './GrowthControls';
import '@/style/main.css';
import '@/style/growth.css';
export default function SvgWorkbench({ slug }: { slug: string }) {
  const tool = growthTools.find(t => t.slug === slug)!;
  const [input, setInput] = useState(tool.example), [values, setValues] = useState(() => defaultValues(tool.fields));
  const [result, setResult] = useState<{ blob: Blob; url: string } | null>(null), [busy, setBusy] = useState(false), [error, setError] = useState('');
  useEffect(() => () => { if (result) URL.revokeObjectURL(result.url); }, [result]);
  function clearResult() { setResult(null); setError(''); }
  async function run() {
    clearResult(); setBusy(true);
    try { const blob = await svgPng(input, Number(values.width), Number(values.height), values.background); setResult({ blob, url: URL.createObjectURL(blob) }); }
    catch (e) { setError(e instanceof Error ? e.message : 'Unable to convert SVG.'); }
    finally { setBusy(false); }
  }
  return <><section className="hero"><div className="hero-eyebrow">Vector to pixels · Local processing</div><h1>{tool.title}</h1><p>{tool.description}</p></section><section aria-label={tool.title}>
    <GrowthControls fields={tool.fields} values={values} disabled={busy} onChange={(key, value) => { setValues(v => ({ ...v, [key]: value })); clearResult(); }} />
    <div className="panel"><div className="panel-header"><label className="panel-title" htmlFor="svg-source">Complete SVG document</label></div><textarea id="svg-source" value={input} disabled={busy} spellCheck={false} onChange={e => { setInput(e.target.value); clearResult(); }} /></div><div className="actions"><button className="btn-convert" disabled={busy} onClick={run}>{busy ? 'Rendering…' : tool.action}</button><button className="btn-secondary" disabled={busy} onClick={() => { setInput(tool.example); clearResult(); }}>Load example</button></div>
    {error && <p role="alert" className="error-bar">{error}</p>}{result && <div aria-live="polite"><div className="growth-images"><figure><figcaption>PNG preview</figcaption><img src={result.url} width={Number(values.width)} height={Number(values.height)} alt="Rasterized SVG as PNG" /></figure></div><p id="growth-result" className="growth-status">{values.width} × {values.height} pixels · {result.blob.size.toLocaleString()} bytes</p><button className="btn-convert" onClick={() => downloadBlob(result.blob, 'converted-svg.png')}>Download PNG</button></div>}
  </section></>;
}
