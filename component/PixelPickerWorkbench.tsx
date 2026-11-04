"use client";
import { useRef, useState } from 'react';
import { growthTools } from '@/lib/growth-tools';
import { downloadBlob, MAX_BINARY_BYTES, MAX_IMAGE_PIXELS, sampledPixel, pixelCoordinates } from '@/lib/growth-files';
import GrowthControls, { defaultValues } from './GrowthControls';
import '@/style/main.css';
import '@/style/growth.css';
export default function PixelPickerWorkbench({ slug }: { slug: string }) {
  const tool = growthTools.find(t => t.slug === slug)!;
  const canvas = useRef<HTMLCanvasElement>(null), [ready, setReady] = useState(false), [busy, setBusy] = useState(false), [values, setValues] = useState(() => defaultValues(tool.fields));
  const [result, setResult] = useState<ReturnType<typeof sampledPixel> | null>(null), [error, setError] = useState(''), [copied, setCopied] = useState(false);
  function read(x: number, y: number) {
    setError(''); setResult(null); setCopied(false);
    try { const c = canvas.current; if (!ready || !c) throw new Error('Choose an image first.'); if (!Number.isInteger(x) || !Number.isInteger(y) || x < 0 || y < 0 || x >= c.width || y >= c.height) throw new Error('Coordinates must point to a pixel inside the source image.'); const ctx = c.getContext('2d'); if (!ctx) throw new Error('Canvas unavailable.'); setResult(sampledPixel(ctx.getImageData(x, y, 1, 1).data, x, y)); }
    catch (e) { setError(e instanceof Error ? e.message : 'Pixel sampling failed.'); }
  }
  async function select(file?: File) {
    setReady(false); setResult(null); setError(''); if (!file) return; setBusy(true);
    let bitmap: ImageBitmap | null = null;
    try {
      if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type) || file.size > MAX_BINARY_BYTES) throw new Error('Choose PNG, JPEG or WebP up to 20 MiB.');
      bitmap = await createImageBitmap(file); if (bitmap.width * bitmap.height > MAX_IMAGE_PIXELS) throw new Error('Image exceeds the decoded pixel limit.');
      const c = canvas.current; if (!c) throw new Error('Canvas unavailable.'); c.width = bitmap.width; c.height = bitmap.height; const ctx = c.getContext('2d'); if (!ctx) throw new Error('Canvas unavailable.'); ctx.drawImage(bitmap, 0, 0);
      setValues(v => ({ ...v, x: '0', y: '0' })); setReady(true);
    } catch (e) { setError(e instanceof Error ? e.message : 'Unable to load image.'); }
    finally { bitmap?.close(); setBusy(false); }
  }
  return <><section className="hero"><div className="hero-eyebrow">Source pixel sampling · Local canvas</div><h1>{tool.title}</h1><p>{tool.description}</p></section><section aria-label={tool.title}>
    <div className="growth-file-picker"><label htmlFor="source-image">PNG, JPEG or WebP</label><input id="source-image" type="file" accept="image/png,image/jpeg,image/webp" disabled={busy} onChange={e => select(e.target.files?.[0])} /></div>
    <GrowthControls fields={tool.fields} values={values} disabled={busy} onChange={(key, value) => { setValues(v => ({ ...v, [key]: value })); setResult(null); setError(''); }} />
    <div className="actions"><button className="btn-convert" disabled={!ready || busy} onClick={() => read(Number(values.x), Number(values.y))}>{tool.action}</button></div>
    {error && <p role="alert" className="error-bar">{error}</p>}
    <div className="pixel-canvas-stage" hidden={!ready}><p>Click a pixel, or use the coordinate fields above.</p><canvas ref={canvas} aria-label="Image canvas for pixel selection" onClick={e => { if (!ready || busy) return; try { const c = e.currentTarget, { x, y } = pixelCoordinates(e.clientX, e.clientY, c.getBoundingClientRect(), c.width, c.height); setValues(v => ({ ...v, x: String(x), y: String(y) })); read(x, y); } catch (error) { setError(error instanceof Error ? error.message : 'Unable to select this canvas pixel.'); } }} /></div>
    {result && <div aria-live="polite"><p className="growth-status">Pixel ({result.x}, {result.y}) · {result.hex} · {result.css}</p><div className="pixel-swatch" style={{ background: result.css }} aria-label={'Selected color ' + result.hex} /><div className="panel"><div className="panel-header"><label className="panel-title" htmlFor="growth-result">Pixel data</label></div><textarea id="growth-result" readOnly value={JSON.stringify(result, null, 2)} /></div><div className="actions"><button className="btn-secondary" onClick={async () => { try { await navigator.clipboard.writeText(result.hex); setCopied(true); } catch { setError('Clipboard unavailable. Copy from the result manually.'); } }}>{copied ? 'Copied' : 'Copy HEX'}</button><button className="btn-secondary" onClick={() => downloadBlob(new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' }), 'pixel-color.json')}>Download JSON</button></div></div>}
  </section></>;
}
