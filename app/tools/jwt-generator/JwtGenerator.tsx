"use client";

import { useState, useCallback } from "react";
import { KeyRound, Lock, Zap, ArrowRight } from "lucide-react";
import Link from "next/link";
import { signJwt, type HsAlg } from "./utils";

import "@/style/main.css";
import "@/style/bar.css";

const EXAMPLE_PAYLOAD = `{
  "sub": "1234567890",
  "name": "Alice",
  "iat": 1716239022,
  "exp": 1716242622
}`;

export default function JwtGenerator() {
  const [payload, setPayload] = useState(EXAMPLE_PAYLOAD);
  const [secret, setSecret] = useState("your-256-bit-secret");
  const [alg, setAlg] = useState<HsAlg>("HS256");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [signing, setSigning] = useState(false);

  const run = useCallback(async () => {
    setError(""); setOutput("");
    if (!payload.trim()) return;
    setSigning(true);
    try {
      const obj = JSON.parse(payload);
      const jwt = await signJwt(obj, secret, alg);
      setOutput(jwt);
    } catch (e) {
      setError((e as Error).message);
    }
    setSigning(false);
  }, [payload, secret, alg]);

  const copy = () => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <>
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-eyebrow"><div className="hero-dot" />Free · No sign-up · Runs in browser</div>
        <h1 id="hero-heading">JWT <em>Generator</em></h1>
        <p>Sign JSON Web Tokens with HS256, HS384, or HS512. Uses the Web Crypto API — your secret and payload never leave the browser.</p>
      </section>

      {error && <div className="error-bar" role="alert"><span>✕</span><span>Error: {error}</span></div>}

      <section aria-label="JWT Generator">
        <div className="converter">
          <div className={`panel${error ? " has-error" : ""}`}>
            <div className="panel-header">
              <div className="panel-title"><div className="dot json" />Payload (JSON)</div>
              <div className="panel-actions">
                <button className="btn-ghost" onClick={() => setPayload(EXAMPLE_PAYLOAD)}>Example</button>
                <button className="btn-ghost" onClick={() => setPayload("")}>Clear</button>
              </div>
            </div>
            <textarea value={payload} onChange={(e) => { setPayload(e.target.value); setError(""); }} spellCheck={false} />
          </div>

          <div className={`panel${output ? " has-output" : ""}`}>
            <div className="panel-header">
              <div className="panel-title"><div className="dot yaml" />Signed JWT{output && <span className="success-tag">✓ {alg}</span>}</div>
              {output && !signing && <div className="panel-actions"><button className="btn-ghost" onClick={copy}>{copied ? "✓ Copied!" : "Copy"}</button></div>}
            </div>
            <pre className={`output-pre${output ? "" : " empty"}${signing ? " loading" : ""}`} style={{ wordBreak: "break-all", whiteSpace: "pre-wrap" }} aria-live="polite">
              {signing ? "// Signing…" : (output || "// Signed JWT will appear here…")}
            </pre>
          </div>
        </div>

        <div className="options-bar">
          <label>Algorithm:
            <select value={alg} onChange={(e) => setAlg(e.target.value as HsAlg)}>
              <option value="HS256">HS256</option>
              <option value="HS384">HS384</option>
              <option value="HS512">HS512</option>
            </select>
          </label>
          <label style={{ flex: 1 }}>Secret:
            <input type="text" value={secret} onChange={(e) => setSecret(e.target.value)} style={{ flex: 1, width: "16rem" }} />
          </label>
        </div>

        <div className="actions">
          <button className="btn-convert" onClick={run} disabled={signing || !payload.trim()}>
            {signing ? <><div className="btn-spinner" /> Signing…</> : <><ArrowRight size={16} className="mr-1" /> Sign JWT</>}
          </button>
        </div>
      </section>

      <section className="seo-content" aria-labelledby="about-heading">
        <h2 id="about-heading">JWT Generator (Signer)</h2>
        <p>Sign JSON Web Tokens with symmetric HMAC algorithms (HS256, HS384, HS512) using the Web Crypto API. Perfect for testing auth flows, generating fixture tokens, or decoding + resigning a token with new claims.</p>

        <h3>FAQ</h3>
        <h3>Why not RS256 or ES256?</h3>
        <p>Asymmetric algorithms need a private key import — not a text secret. For HS* algorithms a secret string is enough, which is what this tool handles.</p>

        <h3>Is my secret sent anywhere?</h3>
        <p>No. HMAC signing is done locally with the browser's Web Crypto API.</p>

        <h3>Related</h3>
        <p>Decode a JWT with the <Link href="/tools/jwt-decoder">JWT Decoder</Link>; learn more in <Link href="/blog/understanding-jwt">Understanding JWT</Link>.</p>
      </section>

      <section className="features" aria-label="Features">
        {[
          { icon: <KeyRound size={24} />, title: "HS256/384/512", desc: "Symmetric HMAC algorithms via native Web Crypto." },
          { icon: <Lock size={24} />,     title: "Fully private",  desc: "Secrets stay in your browser — never logged or sent." },
          { icon: <Zap size={24} />,      title: "Instant",        desc: "Signing happens in milliseconds in your browser." },
        ].map(({ icon, title, desc }) => (
          <div className="feature" key={title}><div className="feature-icon">{icon}</div><h3>{title}</h3><p>{desc}</p></div>
        ))}
      </section>
    </>
  );
}
