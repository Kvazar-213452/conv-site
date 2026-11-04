"use client";
import { useState } from 'react';
import { growthTools } from '@/lib/growth-tools';
import { bcryptOperation } from '@/lib/bcrypt-tool';
import { downloadBlob } from '@/lib/growth-files';
import GrowthControls, { defaultValues } from './GrowthControls';
import '@/style/main.css';
import '@/style/growth.css';
export default function BcryptWorkbench({ slug }: { slug: string }) {
  const tool = growthTools.find(t => t.slug === slug)!;
  const [password, setPassword] = useState(tool.example), [hash, setHash] = useState(''), [show, setShow] = useState(false);
  const [values, setValues] = useState(() => defaultValues(tool.fields)), [result, setResult] = useState<string | null>(null), [error, setError] = useState(''), [busy, setBusy] = useState(false), [copied, setCopied] = useState(false);
  function invalidate() { setResult(null); setError(''); setCopied(false); }
  async function run() {
    invalidate(); setBusy(true);
    try { setResult(await bcryptOperation(password, values.mode, Number(values.cost), hash)); }
    catch (e) { setError(e instanceof Error ? e.message : 'Unable to process this password and hash.'); }
    finally { setBusy(false); }
  }
  return <><section className="hero"><div className="hero-eyebrow">Local hashing · Random salts · No sign-up</div><h1>{tool.title}</h1><p>{tool.description}</p></section><section aria-label={tool.title}>
    <GrowthControls fields={tool.fields} values={values} disabled={busy} onChange={(key, value) => { setValues(v => ({ ...v, [key]: value })); invalidate(); }} />
    <div className="growth-controls"><label htmlFor="bcrypt-password"><span>Password (1–72 UTF-8 bytes)</span><input id="bcrypt-password" type={show ? 'text' : 'password'} autoComplete="off" spellCheck={false} disabled={busy} value={password} onChange={e => { setPassword(e.target.value); invalidate(); }} /></label><label htmlFor="bcrypt-visible"><span>Show password</span><input id="bcrypt-visible" type="checkbox" checked={show} onChange={e => setShow(e.target.checked)} /></label></div>
    {values.mode === 'verify' && <div className="panel"><div className="panel-header"><label className="panel-title" htmlFor="bcrypt-hash">Existing bcrypt hash</label></div><textarea id="bcrypt-hash" disabled={busy} value={hash} spellCheck={false} onChange={e => { setHash(e.target.value); invalidate(); }} /></div>}
    <div className="actions"><button className="btn-convert" disabled={busy} onClick={run}>{busy ? 'Working…' : values.mode === 'verify' ? 'Check password' : tool.action}</button><button className="btn-secondary" disabled={busy} onClick={() => { setPassword(tool.example); setHash(''); setValues(defaultValues(tool.fields)); invalidate(); }}>Load example</button><button className="btn-secondary" disabled={busy} onClick={() => { setPassword(''); setHash(''); invalidate(); }}>Clear</button></div>
    {error && <p role="alert" className="error-bar">{error}</p>}{result !== null && <div aria-live="polite"><div className="panel"><div className="panel-header"><label className="panel-title" htmlFor="growth-result">{values.mode === 'hash' ? 'Salted bcrypt hash' : 'Verification result'}</label></div><textarea id="growth-result" readOnly value={result} spellCheck={false} /></div><div className="actions"><button className="btn-secondary" onClick={async () => { try { await navigator.clipboard.writeText(result); setCopied(true); } catch { setError('Clipboard unavailable. Select and copy the result manually.'); } }}>{copied ? 'Copied' : 'Copy result'}</button><button className="btn-secondary" onClick={() => downloadBlob(new Blob([result], { type: 'text/plain;charset=utf-8' }), 'bcrypt-result.txt')}>Download result</button></div></div>}
  </section></>;
}
