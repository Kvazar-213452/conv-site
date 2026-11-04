/* eslint-disable @next/next/no-img-element -- The QR preview is a locally generated data URL. */
"use client";
import { useState } from 'react';
import QRCode from 'qrcode';
import { growthTools } from '@/lib/growth-tools';
import { decodeBase64, downloadBlob } from '@/lib/growth-files';
import GrowthControls, { defaultValues } from './GrowthControls';
import '@/style/main.css';
import '@/style/growth.css';
export default function QrWorkbench({ slug }: { slug: string }) {
  const tool = growthTools.find(t => t.slug === slug)!;
  const [input, setInput] = useState(tool.example), [values, setValues] = useState(() => defaultValues(tool.fields));
  const [result, setResult] = useState<{ png: string; svg: string } | null>(null), [busy, setBusy] = useState(false), [error, setError] = useState('');
  function clearResult() { setResult(null); setError(''); }
  async function run() {
    clearResult(); setBusy(true);
    try {
      if (!input.trim() || new TextEncoder().encode(input).length > 1500) throw new Error('Enter between 1 and 1500 UTF-8 bytes of text.');
      const width = Number(values.size); if (!Number.isInteger(width) || width < 128 || width > 2048) throw new Error('Choose a whole PNG width between 128 and 2048.');
      if (!['L', 'M', 'Q', 'H'].includes(values.level)) throw new Error('Choose an error-correction level.');
      const options = { errorCorrectionLevel: values.level as 'L' | 'M' | 'Q' | 'H', margin: 4, width, color: { dark: '#000000', light: '#ffffff' } };
      const minimum = (QRCode.create(input, { errorCorrectionLevel: options.errorCorrectionLevel }).modules.size + 8) * 2;
      if (width < minimum) throw new Error(`This content needs a PNG width of at least ${minimum}px for two pixels per module.`);
      const [png, svg] = await Promise.all([QRCode.toDataURL(input, options), QRCode.toString(input, { ...options, type: 'svg' })]);
      setResult({ png, svg });
    } catch (e) { setError(e instanceof Error ? e.message : 'QR generation failed.'); }
    finally { setBusy(false); }
  }
  return <><section className="hero"><div className="hero-eyebrow">Static codes · Local generation · No sign-up</div><h1>{tool.title}</h1><p>{tool.description}</p></section><section aria-label={tool.title}>
    <GrowthControls fields={tool.fields} values={values} disabled={busy} onChange={(key, value) => { setValues(v => ({ ...v, [key]: value })); clearResult(); }} />
    <div className="panel"><div className="panel-header"><label className="panel-title" htmlFor="qr-input">URL or text</label></div><textarea id="qr-input" disabled={busy} value={input} spellCheck={false} onChange={e => { setInput(e.target.value); clearResult(); }} /></div>
    <div className="actions"><button className="btn-convert" disabled={busy} onClick={run}>{busy ? 'Generating…' : tool.action}</button><button className="btn-secondary" disabled={busy} onClick={() => { setInput(tool.example); clearResult(); }}>Load example</button></div>
    {error && <p className="error-bar" role="alert">{error}</p>}{result && <div aria-live="polite"><div className="qr-preview"><img src={result.png} alt="Generated QR code. Scan it to verify the encoded content." width={Number(values.size)} height={Number(values.size)} /></div><p id="growth-result" className="growth-status">QR code ready. Scan-test the downloaded code before sharing.</p><div className="actions"><button className="btn-convert" onClick={() => downloadBlob(new Blob([decodeBase64(result.png)], { type: 'image/png' }), 'qr-code.png')}>Download PNG</button><button className="btn-secondary" onClick={() => downloadBlob(new Blob([result.svg], { type: 'image/svg+xml' }), 'qr-code.svg')}>Download SVG</button></div></div>}
  </section></>;
}
