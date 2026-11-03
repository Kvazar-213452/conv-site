"use client";

import { useState, useCallback } from "react";
import { Minimize2, Zap, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { minifyCss } from "./utils";

import "@/style/main.css";

const EXAMPLE = `/* Site styles */
.container {
  margin: 0 auto;
  padding: 0px 20px;
  color: #ffffff;
  background-color: #000000;
}

.btn {
  border-radius: 0.5em;
  transition: background 0.2s ease, color 0.2s ease;
}`;

export default function CssMinifier() {
  const [input, setInput] = useState(EXAMPLE);
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const run = useCallback(() => setOutput(minifyCss(input)), [input]);
  const copy = () => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  const before = new Blob([input]).size;
  const after  = new Blob([output]).size;
  const saved  = before === 0 ? 0 : Math.round(((before - after) / before) * 100);

  return (
    <>
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-eyebrow"><div className="hero-dot" />Free · No sign-up · Runs in browser</div>
        <h1 id="hero-heading">CSS <em>Minifier</em></h1>
        <p>Strip comments, whitespace, redundant semicolons, and shorten colors in CSS. 100% client-side.</p>
      </section>

      <section aria-label="CSS Minifier">
        <div className="converter">
          <div className="panel">
            <div className="panel-header">
              <div className="panel-title"><div className="dot json" />CSS Input</div>
              <div className="panel-actions">
                <button className="btn-ghost" onClick={() => setInput(EXAMPLE)}>Example</button>
                <button className="btn-ghost" onClick={() => setInput("")}>Clear</button>
              </div>
            </div>
            <textarea value={input} onChange={(e) => setInput(e.target.value)} spellCheck={false} />
          </div>
          <div className={`panel${output ? " has-output" : ""}`}>
            <div className="panel-header">
              <div className="panel-title"><div className="dot yaml" />Minified{output && <span className="success-tag">✓ −{saved}%</span>}</div>
              {output && <div className="panel-actions"><button className="btn-ghost" onClick={copy}>{copied ? "✓ Copied!" : "Copy"}</button></div>}
            </div>
            <pre className={`output-pre${output ? "" : " empty"}`} aria-live="polite">{output || "// Minified CSS will appear here…"}</pre>
          </div>
        </div>

        <div className="actions">
          <button className="btn-convert" onClick={run} disabled={!input.trim()}><ArrowRight size={16} className="mr-1" /> Minify</button>
        </div>
      </section>

      <section className="seo-content" aria-labelledby="about-heading">
        <h2 id="about-heading">CSS Minifier</h2>
        <p>Shrink CSS output for faster page loads. Strips comments, removes unnecessary whitespace and semicolons, converts <code>#ffffff</code> to <code>#fff</code>, strips <code>0px</code> units from zero values, and leaves selectors and properties intact. Typical savings: 20–40% depending on original formatting.</p>

        <h3>Common Use Cases</h3>
        <ul>
          <li>Pre-compile hand-written CSS before shipping to a CDN</li>
          <li>Inline critical CSS inside <code>&lt;style&gt;</code> for first paint</li>
          <li>Minify Tailwind output when a build step isn't an option</li>
          <li>Compress emailed CSS templates to fit size budgets</li>
        </ul>

        <h3>FAQ</h3>
        <h3>Does it break selectors with pseudo-classes?</h3>
        <p>No. Colons inside selectors (<code>a:hover</code>, <code>:first-child</code>) are preserved.</p>

        <h3>Is my CSS sent anywhere?</h3>
        <p>No. Minification happens locally.</p>

        <h3>Related</h3>
        <p>Pretty-print instead with the <Link href="/tools/css-formatter">CSS Formatter</Link>.</p>
      </section>

      <section className="features" aria-label="Features">
        {[
          { icon: <Minimize2 size={24} />, title: "Smart shortening", desc: "6-digit → 3-digit hex, 0px → 0, 0.5 → .5." },
          { icon: <Zap size={24} />,       title: "Instant",         desc: "Minification runs in milliseconds in your browser." },
          { icon: <Lock size={24} />,      title: "Fully private",   desc: "Styles never leave your device." },
        ].map(({ icon, title, desc }) => (
          <div className="feature" key={title}><div className="feature-icon">{icon}</div><h3>{title}</h3><p>{desc}</p></div>
        ))}
      </section>
    </>
  );
}
