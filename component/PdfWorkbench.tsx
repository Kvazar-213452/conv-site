/* eslint-disable @next/next/no-img-element -- The source preview is a local blob URL. */
"use client";
import { useEffect, useState } from 'react';
import { growthTools } from '@/lib/growth-tools';
import { downloadBlob, imagePdf } from '@/lib/growth-files';
import GrowthControls, { defaultValues } from './GrowthControls';
import ToolStepHeading from './ToolStepHeading';
import '@/style/main.css';
import '@/style/growth.css';
export default function PdfWorkbench({ slug }: { slug: string }) {
  const tool = growthTools.find(t => t.slug === slug)!;
  const [source, setSource] = useState<{ file: File; url: string } | null>(null), [values, setValues] = useState(() => defaultValues(tool.fields));
  const [result, setResult] = useState<Blob | null>(null), [busy, setBusy] = useState(false), [error, setError] = useState('');
  useEffect(() => () => { if (source) URL.revokeObjectURL(source.url); }, [source]);
  function clearResult() { setResult(null); setError(''); }
  async function run() { clearResult(); setBusy(true); try { if (!source) throw new Error('Choose an image first.'); setResult(await imagePdf(source.file, values)); } catch (e) { setError(e instanceof Error ? e.message : 'PDF generation failed.'); } finally { setBusy(false); } }
  return <><section className="hero"><div className="hero-eyebrow">One image · One PDF page · Local processing</div><h1>{tool.title}</h1><p>{tool.description}</p></section><section aria-label={tool.title}>
    <ToolStepHeading number={1} title="Choose your image" description="Select a PNG, JPEG, or WebP image to place on a PDF page." />
    <div className="growth-file-picker"><label htmlFor="source-image">PNG, JPEG or WebP</label><input id="source-image" type="file" accept="image/png,image/jpeg,image/webp" disabled={busy} onChange={e => { const file = e.target.files?.[0]; setSource(file ? { file, url: URL.createObjectURL(file) } : null); clearResult(); }} /></div>
    {tool.fields.length > 0 && <ToolStepHeading number={2} title="Set the page options" description="Choose the paper size, orientation, or fit before creating your PDF." />}
    {tool.fields.length > 0 && <GrowthControls fields={tool.fields} values={values} disabled={busy} onChange={(key, value) => { setValues(v => ({ ...v, [key]: value })); clearResult(); }} />}
    <div className="actions"><button className="btn-convert" disabled={!source || busy} onClick={run}>{busy ? 'Creating…' : tool.action}</button></div>
    {error && <p role="alert" className="error-bar">{error}</p>}{source && <div className="growth-images"><figure><figcaption>Source image · fitted proportionally in the PDF</figcaption><img src={source.url} alt="Source image for the one-page PDF" /></figure></div>}
    {result && <div aria-live="polite"><ToolStepHeading number={3} title="Your PDF is ready" description="The image has been fitted to one page. Save the PDF to your device." /><p id="growth-result" className="growth-status">One-page {values.paper === 'a4' ? 'A4' : 'Letter'} PDF ready · {result.size.toLocaleString()} bytes · {values.orientation}</p><button className="btn-convert" onClick={() => downloadBlob(result, 'image.pdf')}>Download PDF</button></div>}
  </section></>;
}
