"use client";

import { useState, useCallback } from "react";
import { Minimize2, Zap, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { minifyHtml, DEFAULT_OPTIONS, formatBytes, type Options } from "./utils";

import "@/style/main.css";
import "@/style/bar.css";

const EXAMPLE = `<!DOCTYPE html>
<html>
<head>
  <!-- site meta -->
  <title>Example</title>
</head>
<body>
  <div class="container">
    <h1>  Hello,  world  </h1>
    <p disabled="disabled">Preserved content.</p>
  </div>
</body>
</html>`;

export default function HtmlMinifier() {
  const [input, setInput] = useState(EXAMPLE);
  const [output, setOutput] = useState("");
  const [opts, setOpts] = useState<Options>(DEFAULT_OPTIONS);
  const [copied, setCopied] = useState(false);

  const run = useCallback(() => setOutput(minifyHtml(input, opts)), [input, opts]);
  const copy = () => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const setOpt = <K extends keyof Options>(k: K, v: Options[K]) => { setOpts((p) => ({ ...p, [k]: v })); setOutput(""); };

  const before = new Blob([input]).size;
  const after  = new Blob([output]).size;
  const saved  = before === 0 ? 0 : Math.round(((before - after) / before) * 100);

  return (
    <>
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-eyebrow"><div className="hero-dot" />Free · No sign-up · Runs in browser</div>
        <h1 id="hero-heading">HTML <em>Minifier</em></h1>
        <p>Strip whitespace, comments, and redundant attributes from HTML. Preserves content inside <code>&lt;pre&gt;</code>, <code>&lt;textarea&gt;</code>, <code>&lt;script&gt;</code>, and <code>&lt;style&gt;</code>. 100% client-side.</p>
      </section>

      <section aria-label="HTML Minifier">
        <div className="converter">
          <div className="panel">
            <div className="panel-header">
              <div className="panel-title"><div className="dot json" />HTML Input</div>
              <div className="panel-actions">
                <button className="btn-ghost" onClick={() => setInput(EXAMPLE)}>Example</button>
                <button className="btn-ghost" onClick={() => setInput("")}>Clear</button>
              </div>
            </div>
            <textarea value={input} onChange={(e) => setInput(e.target.value)} spellCheck={false} />
          </div>

          <div className={`panel${output ? " has-output" : ""}`}>
            <div className="panel-header">
              <div className="panel-title">
                <div className="dot yaml" />Minified
                {output && <span className="success-tag">✓ −{saved}%</span>}
              </div>
              {output && (
                <div className="panel-actions">
                  <button className="btn-ghost" onClick={copy}>{copied ? "✓ Copied!" : "Copy"}</button>
                </div>
              )}
            </div>
            <pre className={`output-pre${output ? "" : " empty"}`} aria-live="polite">{output || "// Minified HTML will appear here…"}</pre>
            {output && (
              <div style={{ display: "flex", gap: "16px", padding: "12px 20px", borderTop: "1px solid var(--color-border)", fontFamily: "'Geist Mono', monospace", fontSize: "12px", color: "var(--color-text-muted)" }}>
                <span>Before: <strong>{formatBytes(before)}</strong></span>
                <span>After: <strong>{formatBytes(after)}</strong></span>
                <span style={{ color: "var(--color-success)" }}>Saved: <strong>{saved}%</strong></span>
              </div>
            )}
          </div>
        </div>

        <div className="options-bar">
          <label><input type="checkbox" checked={opts.collapseWhitespace} onChange={(e) => setOpt("collapseWhitespace", e.target.checked)} /> Collapse whitespace</label>
          <label><input type="checkbox" checked={opts.removeComments} onChange={(e) => setOpt("removeComments", e.target.checked)} /> Remove comments</label>
          <label><input type="checkbox" checked={opts.shortenAttrs} onChange={(e) => setOpt("shortenAttrs", e.target.checked)} /> Shorten boolean attrs</label>
        </div>

        <div className="actions">
          <button className="btn-convert" onClick={run} disabled={!input.trim()}>
            <ArrowRight size={16} className="mr-1" /> Minify
          </button>
        </div>
      </section>

      <section className="seo-content" aria-labelledby="about-heading">
        <h2 id="about-heading">HTML Minifier</h2>
        <p>
          Shrink HTML output for faster page loads. Strips comments, collapses
          whitespace between tags, and normalizes redundant boolean attributes
          (<code>disabled="disabled"</code> → <code>disabled</code>). Content inside
          <code> &lt;pre&gt;</code>, <code>&lt;textarea&gt;</code>,
          <code> &lt;script&gt;</code>, and <code>&lt;style&gt;</code> is preserved so
          you don't accidentally break code samples or layout-sensitive text.
        </p>

        <h3>Common Use Cases</h3>
        <ul>
          <li>Shrink static-site output before uploading to a CDN</li>
          <li>Pre-process email templates to fit within size limits</li>
          <li>Reduce transfer size for SSR Node.js responses</li>
          <li>Clean up WYSIWYG HTML before storing in a database</li>
        </ul>

        <h3>FAQ</h3>
        <h3>Will this break my <code>&lt;pre&gt;</code> blocks?</h3>
        <p>No. Content inside preserved tags is restored verbatim after whitespace collapsing.</p>

        <h3>Is my HTML uploaded?</h3>
        <p>No. Minification is entirely client-side — safe for proprietary templates.</p>

        <h3>Related</h3>
        <p>Pretty-print instead with the <Link href="/tools/html-formatter">HTML Formatter</Link>.</p>
      </section>

      <section className="features" aria-label="Features">
        {[
          { icon: <Minimize2 size={24} />, title: "Preserves code", desc: "pre/textarea/script/style content is kept byte-for-byte." },
          { icon: <Zap size={24} />,       title: "Instant",        desc: "Minification runs in milliseconds in your browser." },
          { icon: <Lock size={24} />,      title: "Fully private",  desc: "Templates never leave your device." },
        ].map(({ icon, title, desc }) => (
          <div className="feature" key={title}><div className="feature-icon">{icon}</div><h3>{title}</h3><p>{desc}</p></div>
        ))}
      </section>
    </>
  );
}
