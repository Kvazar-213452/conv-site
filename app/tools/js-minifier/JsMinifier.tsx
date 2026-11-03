"use client";

import { useState, useCallback } from "react";
import { Minimize2, Zap, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { minifyJs } from "./utils";

import "@/style/main.css";

const EXAMPLE = `// Greet a user
function greet(name) {
  // Fallback for empty names
  if (!name) {
    name = "friend";
  }
  console.log("Hello, " + name + "!");
  return name.length;
}

greet("World");`;

export default function JsMinifier() {
  const [input, setInput] = useState(EXAMPLE);
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const run = useCallback(() => setOutput(minifyJs(input)), [input]);
  const copy = () => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  const before = new Blob([input]).size;
  const after  = new Blob([output]).size;
  const saved  = before === 0 ? 0 : Math.round(((before - after) / before) * 100);

  return (
    <>
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-eyebrow"><div className="hero-dot" />Free · No sign-up · Runs in browser</div>
        <h1 id="hero-heading">JavaScript <em>Minifier</em></h1>
        <p>Strip comments and whitespace from JavaScript. Preserves string, template, and regex literals. Safe for inline <code>&lt;script&gt;</code> blocks when a build tool isn't an option.</p>
      </section>

      <section aria-label="JavaScript Minifier">
        <div className="converter">
          <div className="panel">
            <div className="panel-header">
              <div className="panel-title"><div className="dot json" />JavaScript Input</div>
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
            <pre className={`output-pre${output ? "" : " empty"}`} aria-live="polite">{output || "// Minified JavaScript will appear here…"}</pre>
          </div>
        </div>

        <div className="actions">
          <button className="btn-convert" onClick={run} disabled={!input.trim()}><ArrowRight size={16} className="mr-1" /> Minify</button>
        </div>
      </section>

      <section className="seo-content" aria-labelledby="about-heading">
        <h2 id="about-heading">JavaScript Minifier</h2>
        <p>A lightweight JavaScript minifier that strips comments and whitespace while preserving the <em>exact</em> semantics of your code. No identifier mangling, no dead-code elimination — those require an AST-aware tool like Terser or esbuild. Perfect when you need smaller bytes for inline scripts, email templates, bookmarklets, or quick deploys where a build step is overkill.</p>

        <h3>What's Preserved</h3>
        <ul>
          <li>String, template, and regex literals byte-for-byte</li>
          <li>Variable and function names (no mangling)</li>
          <li>Program semantics — the output runs identically</li>
        </ul>

        <h3>FAQ</h3>
        <h3>Does it work with TypeScript?</h3>
        <p>Only after compilation. TypeScript annotations are not JavaScript — strip them first with <code>tsc</code> or esbuild.</p>

        <h3>Is my code uploaded?</h3>
        <p>No. Minification is 100% client-side.</p>

        <h3>Related</h3>
        <p>Pretty-print instead with the <Link href="/tools/js-formatter">JS Formatter</Link>.</p>
      </section>

      <section className="features" aria-label="Features">
        {[
          { icon: <Minimize2 size={24} />, title: "Literal-safe", desc: "Strings, templates, and regex are preserved exactly." },
          { icon: <Zap size={24} />,       title: "No build step", desc: "Paste → minify → copy. No npm install." },
          { icon: <Lock size={24} />,      title: "Fully private", desc: "Code never leaves your browser." },
        ].map(({ icon, title, desc }) => (
          <div className="feature" key={title}><div className="feature-icon">{icon}</div><h3>{title}</h3><p>{desc}</p></div>
        ))}
      </section>
    </>
  );
}
