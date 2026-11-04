/* eslint-disable @next/next/no-img-element -- Local blob previews have no remote image optimizer or stable asset URL. */
"use client";
import { useEffect, useRef, useState } from 'react';
import { growthTools } from '@/lib/growth-tools';
import { downloadBlob, MAX_BINARY_BYTES, processImage, type ImageResult } from '@/lib/growth-files';
import GrowthControls, { defaultValues } from './GrowthControls';
import '@/style/main.css';
import '@/style/growth.css';
export default function ImageWorkbench({ slug }: { slug: string }) {
  const tool = growthTools.find(t => t.slug === slug)!;
  const [values, setValues] = useState(() => defaultValues(tool.fields));
  const [selected, setSelected] = useState<{ file: File; url: string } | null>(null);
  const [result, setResult] = useState<(ImageResult & { url: string }) | null>(null);
  const [error, setError] = useState(''), [busy, setBusy] = useState(false);
  const picker = useRef<HTMLInputElement>(null);
  useEffect(() => () => { if (selected) URL.revokeObjectURL(selected.url); }, [selected]);
  useEffect(() => () => { if (result) URL.revokeObjectURL(result.url); }, [result]);
  function invalidate() { setResult(null); setError(''); }
  async function run() {
    invalidate(); setBusy(true);
    try {
      if (!selected) throw new Error('Choose an image first.');
      const output = await processImage(selected.file, slug, values);
      setResult({ ...output, url: URL.createObjectURL(output.blob) });
    } catch (e) { setError(e instanceof Error ? e.message : 'Unable to decode or transform this image.'); }
    finally { setBusy(false); }
  }
  return <>
    <section className="hero"><div className="hero-eyebrow">Free · Private image processing · No sign-up</div><h1>{tool.title}</h1><p>{tool.description}</p></section>
    <section aria-label={tool.title}>
      <div className="growth-file-picker"><label htmlFor="source-image">PNG, JPEG or WebP · up to 20 MiB</label><input id="source-image" ref={picker} type="file" accept="image/png,image/jpeg,image/webp" disabled={busy} onChange={e => {
        invalidate(); const file = e.target.files?.[0]; setSelected(null); if (!file) return;
        if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type) || file.size > MAX_BINARY_BYTES) { setError('Select a PNG, JPEG or WebP file no larger than 20 MiB.'); return; }
        setSelected({ file, url: URL.createObjectURL(file) });
      }} /></div>
      <GrowthControls fields={tool.fields} values={values} disabled={busy} onChange={(key, value) => { setValues(v => ({ ...v, [key]: value })); invalidate(); }} />
      {slug === 'image-resizer' && values.lock === 'true' && <p>Aspect ratio is locked: the target width controls the result; height is calculated from the source.</p>}
      <div className="actions"><button className="btn-convert" disabled={busy || !selected} onClick={run}>{busy ? 'Processing…' : tool.action}</button><button className="btn-secondary" disabled={busy} onClick={() => { setSelected(null); setValues(defaultValues(tool.fields)); if (picker.current) picker.current.value = ''; invalidate(); }}>Reset</button></div>
      {error && <p className="error-bar" role="alert">{error}</p>}
      <div className="growth-images">{selected && <figure><figcaption>Original · {selected.file.name} · {selected.file.size.toLocaleString()} bytes</figcaption><img src={selected.url} alt="Selected source image" /></figure>}{result && <figure><figcaption>Result · {result.width} × {result.height} · {result.blob.size.toLocaleString()} bytes</figcaption><img src={result.url} width={result.width} height={result.height} alt="Processed output image" /></figure>}</div>
      {selected && result && <div aria-live="polite"><p className="growth-status">{result.originalWidth} × {result.originalHeight} → {result.width} × {result.height} pixels. {result.blob.size < selected.file.size ? `${((1 - result.blob.size / selected.file.size) * 100).toFixed(1)}% smaller` : slug === 'image-compressor' ? 'The output is not smaller than the original; try a lower quality or smaller dimensions.' : 'Output size may differ because the pixels are re-encoded.'} · {result.blob.type}. Source metadata and animation are not preserved.</p><div className="actions"><button className="btn-convert" onClick={() => { const ext = result.blob.type === 'image/jpeg' ? 'jpg' : result.blob.type === 'image/webp' ? 'webp' : 'png'; const name = selected.file.name.replace(/\.[^.]+$/, '') || 'image'; downloadBlob(result.blob, `${name}-${slug}.${ext}`); }}>Download image</button></div></div>}
    </section>
  </>;
}
