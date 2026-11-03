"use client";

import { useState, useCallback } from "react";
import { Code2, Zap, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { formatHtml } from "./utils";

import "@/style/main.css";
import "@/style/bar.css";

const EXAMPLE = `<!DOCTYPE html><html><head><title>Example</title></head><body><div class="container"><h1>Hello, <em>world</em></h1><ul><li>One</li><li>Two</li></ul><img src="x.png" alt=""><pre>  preserved
  code  </pre></div></body></html>`;

export default function HtmlFormatter() {
  const [input, setInput] = useState(EXAMPLE);
  const [output, setOutput] = useState("");
  const [indent, setIndent] = useState("  ");
  const [copied, setCopied] = useState(false);

  const run = useCallback(() => setOutput(formatHtml(input, indent)), [input, indent]);
  const copy = () => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <>
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-eyebrow"><div className="hero-dot" />Free · No sign-up · Runs in browser</div>
        <h1 id="hero-heading">HTML <em>Formatter</em></h1>
        <p>Pretty-print HTML with configurable indentation. Inline elements stay inline; block elements wrap. Content inside <code>&lt;pre&gt;</code>, <code>&lt;textarea&gt;</code>, <code>&lt;script&gt;</code>, and <code>&lt;style&gt;</code> is preserved exactly. 100% client-side.</p>
      </section>

      <section aria-label="HTML Formatter">
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
              <div className="panel-title"><div className="dot yaml" />Formatted{output && <span className="success-tag">✓ formatted</span>}</div>
              {output && (<div className="panel-actions"><button className="btn-ghost" onClick={copy}>{copied ? "✓ Copied!" : "Copy"}</button></div>)}
            </div>
            <pre className={`output-pre${output ? "" : " empty"}`} aria-live="polite">{output || "// Formatted HTML will appear here…"}</pre>
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
        <h2 id="about-heading">HTML Formatter</h2>
        <p>Pretty-print HTML so it reads well in code review and version control. Breaks block elements onto their own lines, keeps inline elements (<code>a</code>, <code>em</code>, <code>strong</code>, <code>span</code>, …) inline, and preserves whitespace-sensitive content inside <code>pre</code>, <code>textarea</code>, <code>script</code>, and <code>style</code>.</p>

        <h3>FAQ</h3>
        <h3>Does it validate HTML?</h3>
        <p>No — only reformats. For validation, use the W3C validator.</p>

        <h3>Related</h3>
        <p>Shrink the output with the <Link href="/tools/html-minifier">HTML Minifier</Link>.</p>
      </section>

      <section className="features" aria-label="Features">
        {[
          { icon: <Code2 size={24} />, title: "Block vs inline aware", desc: "Inline tags stay inline; block tags wrap and indent." },
          { icon: <Zap size={24} />,   title: "Instant",                desc: "Formatting runs in your browser." },
          { icon: <Lock size={24} />,  title: "Fully private",          desc: "Templates stay on your device." },
        ].map(({ icon, title, desc }) => (
          <div className="feature" key={title}><div className="feature-icon">{icon}</div><h3>{title}</h3><p>{desc}</p></div>
        ))}
      </section>
    </>
  );
}
