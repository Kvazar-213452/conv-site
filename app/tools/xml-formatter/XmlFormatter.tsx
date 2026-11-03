"use client";

import { useState, useCallback } from "react";
import { Code2, Zap, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { formatXml } from "./utils";
import { EXAMPLE_XML } from "@/lib/const";

import "@/style/main.css";
import "@/style/bar.css";

export default function XmlFormatter() {
  const [input, setInput] = useState(EXAMPLE_XML.replace(/\n\s+/g, "").replace(/>\s+</g, "><"));
  const [output, setOutput] = useState("");
  const [indent, setIndent] = useState("  ");
  const [copied, setCopied] = useState(false);

  const run = useCallback(() => setOutput(formatXml(input, indent)), [input, indent]);
  const copy = () => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <>
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-eyebrow"><div className="hero-dot" />Free · No sign-up · Runs in browser</div>
        <h1 id="hero-heading">XML <em>Formatter</em></h1>
        <p>Pretty-print minified XML — SOAP responses, RSS feeds, SVG, OpenXML — with configurable indentation. 100% client-side.</p>
      </section>

      <section aria-label="XML Formatter">
        <div className="converter">
          <div className="panel">
            <div className="panel-header">
              <div className="panel-title"><div className="dot json" />XML Input</div>
              <div className="panel-actions">
                <button className="btn-ghost" onClick={() => setInput(EXAMPLE_XML)}>Example</button>
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
            <pre className={`output-pre${output ? "" : " empty"}`} aria-live="polite">{output || "// Formatted XML will appear here…"}</pre>
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
        <h2 id="about-heading">XML Formatter</h2>
        <p>Pretty-print XML with configurable indentation. Handles self-closing tags, comments, XML declarations, and DOCTYPE lines. Great for making minified SOAP/RSS/SVG actually readable.</p>

        <h3>Related</h3>
        <p>Convert XML to <Link href="/tools/xml-to-json">JSON</Link> or back from <Link href="/tools/json-to-xml">JSON</Link>.</p>
      </section>

      <section className="features" aria-label="Features">
        {[
          { icon: <Code2 size={24} />, title: "Depth-aware",   desc: "Nested elements indent correctly by brace depth." },
          { icon: <Zap size={24} />,   title: "Instant",       desc: "Formatting runs in your browser." },
          { icon: <Lock size={24} />,  title: "Fully private", desc: "XML never leaves your device." },
        ].map(({ icon, title, desc }) => (
          <div className="feature" key={title}><div className="feature-icon">{icon}</div><h3>{title}</h3><p>{desc}</p></div>
        ))}
      </section>
    </>
  );
}
