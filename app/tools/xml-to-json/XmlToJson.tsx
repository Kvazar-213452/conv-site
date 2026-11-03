"use client";

import { useState, useCallback } from "react";
import { Code2, Zap, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { xmlToJson, DEFAULT_OPTIONS, type Options } from "./utils";
import { EXAMPLE_XML } from "@/lib/const";

import "@/style/main.css";
import "@/style/bar.css";

export default function XmlToJson() {
  const [input, setInput] = useState(EXAMPLE_XML);
  const [output, setOutput] = useState("");
  const [opts, setOpts] = useState<Options>(DEFAULT_OPTIONS);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [converting, setConverting] = useState(false);

  const run = useCallback(() => {
    setError(""); setOutput("");
    if (!input.trim()) return;
    setConverting(true);
    setTimeout(() => {
      try { setOutput(JSON.stringify(xmlToJson(input, opts), null, 2)); }
      catch (e) { setError((e as Error).message); }
      setConverting(false);
    }, 220);
  }, [input, opts]);

  const copyOutput = () => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const loadExample = () => { setInput(EXAMPLE_XML); setOutput(""); setError(""); };
  const clearAll   = () => { setInput(""); setOutput(""); setError(""); };
  const setOpt = <K extends keyof Options>(k: K, v: Options[K]) => { setOpts((p) => ({ ...p, [k]: v })); setOutput(""); };

  return (
    <>
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-eyebrow"><div className="hero-dot" />Free · No sign-up · Runs in browser</div>
        <h1 id="hero-heading">XML <em>→</em> JSON</h1>
        <p>
          Convert any XML document to JSON — SOAP responses, RSS/Atom feeds, SVG, config
          files, OpenXML. Attributes are prefixed, repeated elements become arrays, and
          scalars gain type inference. 100% client-side using the browser's native DOMParser.
        </p>
      </section>

      {error && <div className="error-bar" role="alert"><span>✕</span><span>Parse Error: {error}</span></div>}

      <section aria-label="XML to JSON">
        <div className="converter">
          <div className={`panel${error ? " has-error" : ""}`}>
            <div className="panel-header">
              <div className="panel-title"><div className="dot json" />XML Input</div>
              <div className="panel-actions">
                <button className="btn-ghost" onClick={loadExample}>Example</button>
                <button className="btn-ghost" onClick={() => { setInput(""); setError(""); }}>Clear</button>
              </div>
            </div>
            <textarea value={input} onChange={(e) => { setInput(e.target.value); setError(""); }} spellCheck={false} />
          </div>

          <div className={`panel${output ? " has-output" : ""}`}>
            <div className="panel-header">
              <div className="panel-title">
                <div className="dot yaml" />JSON Output
                {output && !converting && <span className="success-tag">✓ converted</span>}
              </div>
              {output && !converting && (
                <div className="panel-actions">
                  <button className="btn-ghost" onClick={copyOutput}>{copied ? "✓ Copied!" : "Copy"}</button>
                </div>
              )}
            </div>
            <pre className={`output-pre${output && !converting ? "" : " empty"}${converting ? " loading" : ""}`} aria-live="polite">
              {converting ? "// Converting…" : (output || "// JSON will appear here…")}
            </pre>
          </div>
        </div>

        <div className="options-bar">
          <label>Attribute prefix: <input type="text" value={opts.attributePrefix} onChange={(e) => setOpt("attributePrefix", e.target.value)} style={{ width: "4rem" }} /></label>
          <label>Text node key: <input type="text" value={opts.textKey} onChange={(e) => setOpt("textKey", e.target.value)} style={{ width: "6rem" }} /></label>
          <label><input type="checkbox" checked={opts.typeInference} onChange={(e) => setOpt("typeInference", e.target.checked)} /> Type inference</label>
        </div>

        <div className="actions">
          <button className="btn-secondary" onClick={loadExample}>Load Example</button>
          <button className="btn-convert" onClick={run} disabled={converting || !input.trim()}>
            {converting ? <><div className="btn-spinner" /> Converting…</> : <><ArrowRight size={16} className="mr-1" /> Convert to JSON</>}
          </button>
          <button className="btn-secondary" onClick={clearAll}>Clear All</button>
        </div>
      </section>

      <section className="seo-content" aria-labelledby="about-heading">
        <h2 id="about-heading">XML to JSON Converter</h2>
        <p>
          Convert XML documents to JSON with configurable attribute prefix and text-node
          key. Powered by the browser's native <code>DOMParser</code> for correctness
          and speed. Perfect for SOAP responses, RSS feeds, OpenXML office docs, SVG
          data, and any legacy XML API you want to feed into modern JavaScript.
        </p>

        <h3>Conversion Rules</h3>
        <ul>
          <li>Attributes become keys prefixed with <code>@</code> (configurable)</li>
          <li>Repeated child elements collapse to an array</li>
          <li>Mixed content gets a <code>#text</code> key (configurable)</li>
          <li>Pure text elements with no attributes become bare values</li>
          <li>Type inference turns <code>"42"</code> → <code>42</code>, <code>"true"</code> → <code>true</code></li>
        </ul>

        <h3>FAQ</h3>
        <h3>Does it validate XML schema?</h3>
        <p>No — only well-formedness. Use XSD/DTD tools for schema validation.</p>

        <h3>Is my XML sent anywhere?</h3>
        <p>No. The browser's DOMParser runs locally — safe for SOAP payloads with tokens.</p>

        <h3>Related</h3>
        <p>
          Convert the other way with <Link href="/tools/json-to-xml">JSON → XML</Link>,
          or read <Link href="/blog/json-vs-xml">JSON vs XML</Link>.
        </p>
      </section>

      <section className="features" aria-label="Features">
        {[
          { icon: <Code2 size={24} />, title: "Native DOMParser", desc: "Browser-grade XML parsing — the same one browsers use for XHTML." },
          { icon: <Zap size={24} />,   title: "Array collapsing", desc: "Repeated elements become arrays automatically." },
          { icon: <Lock size={24} />,  title: "Fully private",    desc: "Nothing is uploaded — safe for SOAP responses with secrets." },
        ].map(({ icon, title, desc }) => (
          <div className="feature" key={title}>
            <div className="feature-icon">{icon}</div><h3>{title}</h3><p>{desc}</p>
          </div>
        ))}
      </section>
    </>
  );
}
