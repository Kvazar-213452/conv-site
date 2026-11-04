"use client";

import { useState, useCallback } from "react";
import { parseUrl, EXAMPLE_URLS } from "./utils";
import type { ParsedUrl } from "./utils";
import { Link2, Lock, Search } from "lucide-react";

import "@/style/main.css";

export default function UrlParser() {
  const [input, setInput] = useState(EXAMPLE_URLS[0]);
  const [result, setResult] = useState<ParsedUrl | null>(null);
  const [parsing, setParsing] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");

  const parse = useCallback(() => {
    setError("");
    if (!input.trim()) { setResult(null); return; }
    setParsing(true);
    setTimeout(() => {
      try {
        setResult(parseUrl(input.trim()));
      } catch (e) {
        setError((e as Error).message);
      }
      setParsing(false);
    }, 180);
  }, [input]);

  const loadExample = () => {
    const url = EXAMPLE_URLS[Math.floor(Math.random() * EXAMPLE_URLS.length)];
    setInput(url);
    setResult(null);
    setError("");
  };

  const clearAll = () => { setInput(""); setResult(null); setError(""); };

  const copyValue = (key: string, val: string) => {
    navigator.clipboard.writeText(val);
    setCopied(key);
    setTimeout(() => setCopied(""), 2000);
  };

  const fields = result ? [
    { label: "Protocol", value: result.protocol },
    { label: "Hostname", value: result.hostname },
    { label: "Port", value: result.port || "(default)" },
    { label: "Path", value: result.pathname },
    { label: "Query String", value: result.search || "(none)" },
    { label: "Hash", value: result.hash || "(none)" },
    { label: "Origin", value: result.origin },
    { label: "Username", value: result.username || "(none)" },
    { label: "Password", value: result.password || "(none)" },
    { label: "Full URL", value: result.href },
  ] : [];

  return (
    <>
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-eyebrow">
          <div className="hero-dot" aria-hidden="true" />
          Free · No sign-up · Runs in browser
        </div>
        <h1 id="hero-heading">
          URL <em>Parser</em>
        </h1>
        <p>
          Break down any URL into its components — protocol, host, port, path, query
          parameters, and hash fragment. Decode and inspect every part.
        </p>
      </section>

      {error && (
        <div className="error-bar" role="alert" aria-live="assertive">
          <span aria-hidden="true">✕</span>
          <span>Error: {error}</span>
        </div>
      )}

      <section aria-label="URL Parser">
        <div className={`panel panel--full${error ? " has-error" : ""}${result ? " has-output" : ""}`}>
          <div className="panel-header">
            <div className="panel-title">
              <div className="dot json" aria-hidden="true" />
              URL Input
              {result && <span className="success-tag">✓ parsed</span>}
            </div>
            <div className="panel-actions">
              <button className="btn-ghost" onClick={loadExample}>Example</button>
              <button className="btn-ghost" onClick={clearAll}>Clear</button>
            </div>
          </div>
          <textarea
            aria-label="URL Input"
            placeholder="Paste a URL here…"
            value={input}
            onChange={(e) => { setInput(e.target.value); setResult(null); setError(""); }}
            spellCheck={false}
            autoCorrect="off"
            autoCapitalize="off"
            style={{ minHeight: 80 }}
          />
        </div>

        <div className="actions">
          <button className="btn-secondary" onClick={loadExample}>Load Example</button>
          <button className="btn-convert" onClick={parse} disabled={parsing || !input.trim()} aria-busy={parsing}>
            {parsing
              ? <><div className="btn-spinner" aria-hidden="true" /> Parsing…</>
              : <><Search size={16} aria-hidden="true" className="mr-1" /> Parse URL</>
            }
          </button>
          <button className="btn-secondary" onClick={clearAll}>Clear All</button>
        </div>

        {result && (
          <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 8 }} aria-live="polite">
            {fields.map(({ label, value }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", borderRadius: 10, border: "1px solid var(--color-border)", background: "var(--color-surface)" }}>
                <span style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--color-text-muted)", minWidth: 100 }}>{label}</span>
                <code style={{ flex: 1, fontSize: 13, fontFamily: "'Geist Mono', monospace", color: "var(--color-text)", wordBreak: "break-all" }}>{value}</code>
                <button className="btn-ghost" onClick={() => copyValue(label, value)} style={{ flexShrink: 0 }}>
                  {copied === label ? "Copied!" : "Copy"}
                </button>
              </div>
            ))}

            {result.params.length > 0 && (
              <div style={{ marginTop: 12, padding: 16, borderRadius: 10, border: "1px solid var(--color-border)", background: "var(--color-surface)" }}>
                <h3 style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-text-muted)", margin: "0 0 12px" }}>Query Parameters ({result.params.length})</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {result.params.map(({ key, value }, i) => (
                    <div key={`${key}-${i}`} style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
                      <code style={{ fontFamily: "'Geist Mono', monospace", fontSize: 13, color: "var(--color-accent)", fontWeight: 600 }}>{key}</code>
                      <span style={{ color: "var(--color-text-muted)" }}>=</span>
                      <code style={{ fontFamily: "'Geist Mono', monospace", fontSize: 13, color: "var(--color-text)", wordBreak: "break-all" }}>{value}</code>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      <section className="seo-content" aria-labelledby="about-heading">
        <h2 id="about-heading">About URL Parser Tool</h2>
        <p>
          This free online URL parser breaks down any URL into its individual components: protocol (scheme), hostname,
          port, path, query string with decoded parameters, hash fragment, origin, and authentication credentials.
          Essential for debugging API endpoints, analyzing redirect chains, inspecting tracking URLs, and understanding
          URL structure. Everything runs locally in your browser using the native URL API.
        </p>

        <h3>Why Parse URLs?</h3>
        <p>
          URLs encode multiple pieces of information in a compact string, and manually reading them — especially with
          encoded characters, multiple query parameters, and fragments — is error-prone. Developers parse URLs to debug
          API requests, inspect OAuth callback URLs with token parameters, analyze UTM tracking links, verify redirect
          chains, extract query parameters from user-reported URLs, compare endpoints across environments, and validate
          URL construction in routing code.
        </p>

        <h3>Key Benefits</h3>
        <ul>
          <li><strong>Complete breakdown:</strong> Protocol, hostname, port, path, query, hash, origin, and auth</li>
          <li><strong>Query parameter parsing:</strong> Each parameter displayed separately with decoded values</li>
          <li><strong>Copy individual parts:</strong> Copy any URL component with a single click</li>
          <li><strong>Standard parsing:</strong> Uses the browser's native URL API for standards-compliant results</li>
          <li><strong>Instant results:</strong> No server round-trips — everything runs locally</li>
          <li><strong>Completely private:</strong> Your URLs never leave your device</li>
        </ul>

        <h3>Privacy and Security</h3>
        <p>
          All URL parsing happens locally in your browser using the built-in URL constructor. Your API endpoints, OAuth
          tokens, tracking URLs, and any other URL data never leave your computer. No cookies, no tracking, no server
          communication. Safe for production URLs containing authentication tokens and sensitive parameters.
        </p>
      </section>

      <section className="features" aria-label="Features">
        {[
          { icon: <Link2 size={24} />, title: "Complete breakdown", desc: "Protocol, host, port, path, query params, hash, origin — every URL component at a glance." },
          { icon: <Lock size={24} />, title: "Fully private", desc: "Your URLs never leave the browser. Safe for OAuth tokens, API endpoints, and tracking links." },
          { icon: <Search size={24} />, title: "Parameter parsing", desc: "Each query parameter displayed separately with decoded values and one-click copy." },
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
