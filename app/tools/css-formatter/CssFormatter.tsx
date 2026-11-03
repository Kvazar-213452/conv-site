"use client";

import { useState, useCallback } from "react";
import { Code2, Zap, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { formatCss } from "./utils";

import "@/style/main.css";
import "@/style/bar.css";

const EXAMPLE = `.container{margin:0 auto;padding:20px;color:#fff;background:#000}.btn{border-radius:6px;transition:all .2s ease}@media (max-width:640px){.btn{padding:8px 12px}}`;

export default function CssFormatter() {
  const [input, setInput] = useState(EXAMPLE);
  const [output, setOutput] = useState("");
  const [indent, setIndent] = useState("  ");
  const [copied, setCopied] = useState(false);

  const run = useCallback(() => setOutput(formatCss(input, indent)), [input, indent]);
  const copy = () => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <>
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-eyebrow"><div className="hero-dot" />Free · No sign-up · Runs in browser</div>
        <h1 id="hero-heading">CSS <em>Formatter</em></h1>
        <p>Pretty-print CSS with configurable indentation. Handles rules, media queries, and nested at-rules. 100% client-side.</p>
      </section>

      <section aria-label="CSS Formatter">
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
              <div className="panel-title"><div className="dot yaml" />Formatted{output && <span className="success-tag">✓ formatted</span>}</div>
              {output && <div className="panel-actions"><button className="btn-ghost" onClick={copy}>{copied ? "✓ Copied!" : "Copy"}</button></div>}
            </div>
            <pre className={`output-pre${output ? "" : " empty"}`} aria-live="polite">{output || "// Formatted CSS will appear here…"}</pre>
          </div>
        </div>

        <div className="options-bar">
          <label>Indent:
            <select value={indent} onChange={(e) => setIndent(e.target.value)}>
              <option value="  ">2 spaces</option>
              <option value="    ">4 spaces</option>
              <option value={"\t"}>Tab</option>
            </select>
          </label>
        </div>

        <div className="actions">
          <button className="btn-convert" onClick={run} disabled={!input.trim()}><ArrowRight size={16} className="mr-1" /> Format</button>
        </div>
      </section>

      <section className="seo-content" aria-labelledby="about-heading">
        <h2 id="about-heading">CSS Formatter</h2>
        <p>Pretty-print minified or hand-written CSS so it's readable in code review. Handles nested at-rules and media queries, aligns property values on each line, and uses the indentation style you pick.</p>

        <h3>Related</h3>
        <p>Shrink the output with the <Link href="/tools/css-minifier">CSS Minifier</Link>.</p>
      </section>

      <section className="features" aria-label="Features">
        {[
          { icon: <Code2 size={24} />, title: "Nested rules",  desc: "Media queries and nested at-rules indent correctly." },
          { icon: <Zap size={24} />,   title: "Instant",       desc: "Formatting runs in your browser." },
          { icon: <Lock size={24} />,  title: "Fully private", desc: "Styles stay on your device." },
        ].map(({ icon, title, desc }) => (
          <div className="feature" key={title}><div className="feature-icon">{icon}</div><h3>{title}</h3><p>{desc}</p></div>
        ))}
      </section>
    </>
  );
}
