"use client";

import { useState, useCallback } from "react";
import { generateAllHmacs, EXAMPLE_MESSAGE, EXAMPLE_SECRET } from "./utils";
import type { HmacResult } from "./utils";
import { ShieldCheck, Lock, Key } from "lucide-react";

import "@/style/main.css";

export default function HmacGenerator() {
  const [message, setMessage] = useState(EXAMPLE_MESSAGE);
  const [secret, setSecret] = useState(EXAMPLE_SECRET);
  const [results, setResults] = useState<HmacResult[]>([]);
  const [hashing, setHashing] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");

  const generate = useCallback(async () => {
    setError("");
    if (!message || !secret) { setResults([]); return; }
    setHashing(true);
    try {
      const r = await generateAllHmacs(message, secret);
      setResults(r);
    } catch (e) {
      setError((e as Error).message);
    }
    setHashing(false);
  }, [message, secret]);

  const clearAll = () => { setMessage(""); setSecret(""); setResults([]); setError(""); };
  const loadExample = () => { setMessage(EXAMPLE_MESSAGE); setSecret(EXAMPLE_SECRET); setResults([]); setError(""); };

  const copyValue = (key: string, val: string) => {
    navigator.clipboard.writeText(val);
    setCopied(key);
    setTimeout(() => setCopied(""), 2000);
  };

  return (
    <>
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-eyebrow">
          <div className="hero-dot" aria-hidden="true" />
          Free · No sign-up · Runs in browser
        </div>
        <h1 id="hero-heading">
          HMAC <em>Generator</em>
        </h1>
        <p>
          Generate HMAC signatures with SHA-256, SHA-384, SHA-512, and SHA-1.
          Output in hex and Base64. Powered by the Web Crypto API.
        </p>
      </section>

      {error && (
        <div className="error-bar" role="alert" aria-live="assertive">
          <span aria-hidden="true">✕</span>
          <span>Error: {error}</span>
        </div>
      )}

      <section aria-label="HMAC Generator">
        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 16 }}>
          <div className="panel panel--full">
            <div className="panel-header">
              <div className="panel-title">
                <div className="dot json" aria-hidden="true" />
                Message
              </div>
              <div className="panel-actions">
                <button className="btn-ghost" onClick={loadExample}>Example</button>
                <button className="btn-ghost" onClick={() => { setMessage(""); setResults([]); }}>Clear</button>
              </div>
            </div>
            <textarea
              aria-label="Message"
              placeholder="Enter message to sign…"
              value={message}
              onChange={(e) => { setMessage(e.target.value); setResults([]); }}
              spellCheck={false}
              autoCorrect="off"
              autoCapitalize="off"
              style={{ minHeight: 100 }}
            />
          </div>

          <div className="panel panel--full">
            <div className="panel-header">
              <div className="panel-title">
                <div className="dot yaml" aria-hidden="true" />
                Secret Key
              </div>
              <div className="panel-actions">
                <button className="btn-ghost" onClick={() => { setSecret(""); setResults([]); }}>Clear</button>
              </div>
            </div>
            <textarea
              aria-label="Secret Key"
              placeholder="Enter secret key…"
              value={secret}
              onChange={(e) => { setSecret(e.target.value); setResults([]); }}
              spellCheck={false}
              autoCorrect="off"
              autoCapitalize="off"
              style={{ minHeight: 60 }}
            />
          </div>
        </div>

        <div className="actions">
          <button className="btn-secondary" onClick={loadExample}>Load Example</button>
          <button className="btn-convert" onClick={generate} disabled={hashing || !message || !secret} aria-busy={hashing}>
            {hashing
              ? <><div className="btn-spinner" aria-hidden="true" /> Generating…</>
              : <><ShieldCheck size={16} aria-hidden="true" className="mr-1" /> Generate HMAC</>
            }
          </button>
          <button className="btn-secondary" onClick={clearAll}>Clear All</button>
        </div>

        {results.length > 0 && (
          <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 12 }} aria-live="polite">
            {results.map((r) => (
              <div key={r.algorithm} style={{ border: "1px solid var(--color-border)", borderRadius: 10, background: "var(--color-surface)", padding: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-accent)", marginBottom: 8 }}>{r.algorithm}</div>
                <div style={{ marginBottom: 8 }}>
                  <div style={{ fontSize: 11, color: "var(--color-text-muted)", marginBottom: 4 }}>Hex:</div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <code style={{ flex: 1, fontSize: 12, fontFamily: "'Geist Mono', monospace", color: "var(--color-text)", wordBreak: "break-all" }}>{r.hex}</code>
                    <button className="btn-ghost" onClick={() => copyValue(`${r.algorithm}-hex`, r.hex)}>{copied === `${r.algorithm}-hex` ? "Copied!" : "Copy"}</button>
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: "var(--color-text-muted)", marginBottom: 4 }}>Base64:</div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <code style={{ flex: 1, fontSize: 12, fontFamily: "'Geist Mono', monospace", color: "var(--color-text)", wordBreak: "break-all" }}>{r.base64}</code>
                    <button className="btn-ghost" onClick={() => copyValue(`${r.algorithm}-b64`, r.base64)}>{copied === `${r.algorithm}-b64` ? "Copied!" : "Copy"}</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="seo-content" aria-labelledby="about-heading">
        <h2 id="about-heading">About HMAC Generator Tool</h2>
        <p>
          This free online HMAC generator computes Hash-based Message Authentication Codes using SHA-256, SHA-384,
          SHA-512, and SHA-1 algorithms. HMAC combines a secret key with a message to produce a signature that verifies
          both data integrity and authenticity. Output is provided in both hexadecimal and Base64 formats. All computation
          uses the browser's Web Crypto API — your secrets never leave your device.
        </p>

        <h3>Why Use HMAC?</h3>
        <p>
          HMAC is the standard mechanism for API authentication (AWS Signature V4, Stripe webhooks, GitHub webhooks),
          message integrity verification, and secure token generation. Unlike plain hashes, HMAC requires a secret key,
          making it resistant to length extension attacks. Developers need HMAC generators for testing webhook signature
          verification, debugging API authentication, generating test fixtures, and verifying third-party implementations.
        </p>

        <h3>Key Benefits</h3>
        <ul>
          <li><strong>Four algorithms:</strong> SHA-256, SHA-384, SHA-512, and SHA-1 computed simultaneously</li>
          <li><strong>Dual output:</strong> Both hex and Base64 encoding for each algorithm</li>
          <li><strong>Web Crypto API:</strong> Cryptographically correct implementation using browser standards</li>
          <li><strong>One-click copy:</strong> Copy any individual hash value instantly</li>
          <li><strong>Completely private:</strong> Your secrets and messages never leave your browser</li>
          <li><strong>No installation:</strong> Works in any modern browser without plugins</li>
        </ul>

        <h3>Privacy and Security</h3>
        <p>
          All HMAC computation happens locally in your browser using the Web Crypto API. Your secret keys, messages,
          API credentials, and webhook secrets never leave your computer. No cookies, no tracking, no server uploads.
          Safe for production secrets, API keys, and confidential authentication data.
        </p>
      </section>

      <section className="features" aria-label="Features">
        {[
          { icon: <ShieldCheck size={24} />, title: "Multi-algorithm", desc: "SHA-256, SHA-384, SHA-512, and SHA-1 — all four HMAC signatures computed at once." },
          { icon: <Lock size={24} />, title: "Fully private", desc: "Your secrets and messages never leave the browser. Powered by the Web Crypto API." },
          { icon: <Key size={24} />, title: "Dual output", desc: "Both hex and Base64 encoding for each algorithm. One-click copy for any value." },
        ].map(({ icon, title, desc }) => (
          <div className="feature" key={title}>
            <div className="feature-icon" aria-hidden="true">{icon}</div>
            <h3>{title}</h3>
            <p>{desc}</p>
          </div>
        ))}
      </section>
    </>
  );
}
