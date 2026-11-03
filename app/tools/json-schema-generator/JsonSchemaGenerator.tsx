"use client";

import { useState, useCallback } from "react";
import { FileCode2, Zap, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { jsonToSchema } from "./utils";
import { EXAMPLE_JSON } from "@/lib/const";

import "@/style/main.css";

export default function JsonSchemaGenerator() {
  const [input, setInput] = useState(EXAMPLE_JSON);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [running, setRunning] = useState(false);

  const run = useCallback(() => {
    setError(""); setOutput("");
    if (!input.trim()) return;
    setRunning(true);
    setTimeout(() => {
      try { setOutput(JSON.stringify(jsonToSchema(JSON.parse(input)), null, 2)); }
      catch (e) { setError((e as Error).message); }
      setRunning(false);
    }, 200);
  }, [input]);

  const copy = () => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <>
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-eyebrow"><div className="hero-dot" />Free · No sign-up · Runs in browser</div>
        <h1 id="hero-heading">JSON <em>Schema</em> Generator</h1>
        <p>Infer a Draft 2020-12 JSON Schema from any sample JSON. Perfect for OpenAPI, config validation, GraphQL input types, and documenting legacy APIs.</p>
      </section>

      {error && <div className="error-bar" role="alert"><span>✕</span><span>Error: {error}</span></div>}

      <section aria-label="JSON Schema Generator">
        <div className="converter">
          <div className={`panel${error ? " has-error" : ""}`}>
            <div className="panel-header">
              <div className="panel-title"><div className="dot json" />Sample JSON</div>
              <div className="panel-actions">
                <button className="btn-ghost" onClick={() => setInput(EXAMPLE_JSON)}>Example</button>
                <button className="btn-ghost" onClick={() => setInput("")}>Clear</button>
              </div>
            </div>
            <textarea value={input} onChange={(e) => { setInput(e.target.value); setError(""); }} spellCheck={false} />
          </div>
          <div className={`panel${output ? " has-output" : ""}`}>
            <div className="panel-header">
              <div className="panel-title"><div className="dot yaml" />JSON Schema{output && !running && <span className="success-tag">✓ generated</span>}</div>
              {output && !running && <div className="panel-actions"><button className="btn-ghost" onClick={copy}>{copied ? "✓ Copied!" : "Copy"}</button></div>}
            </div>
            <pre className={`output-pre${output && !running ? "" : " empty"}${running ? " loading" : ""}`} aria-live="polite">
              {running ? "// Analyzing…" : (output || "// JSON Schema will appear here…")}
            </pre>
          </div>
        </div>

        <div className="actions">
          <button className="btn-convert" onClick={run} disabled={running || !input.trim()}>
            {running ? <><div className="btn-spinner" /> Analyzing…</> : <><ArrowRight size={16} className="mr-1" /> Generate Schema</>}
          </button>
        </div>
      </section>

      <section className="seo-content" aria-labelledby="about-heading">
        <h2 id="about-heading">JSON Schema Generator</h2>
        <p>Infer a JSON Schema (Draft 2020-12) from a sample payload. The generator detects object properties, array item types, required fields, and distinguishes integer vs number. Perfect for drafting OpenAPI specs, Ajv/zod validators, or documentation for legacy JSON APIs.</p>

        <h3>Inference Rules</h3>
        <ul>
          <li>Objects → <code>type: "object"</code> with <code>properties</code> and all keys <code>required</code></li>
          <li>Arrays → <code>type: "array"</code> with merged <code>items</code> schema</li>
          <li>Numbers → <code>integer</code> if the value is whole, else <code>number</code></li>
          <li>Mixed types across array elements collapse into a union</li>
        </ul>

        <h3>FAQ</h3>
        <h3>Is the output valid for Ajv?</h3>
        <p>Yes — Draft 2020-12 is the current spec; Ajv 8+ supports it.</p>

        <h3>Related</h3>
        <p>Generate <Link href="/tools/json-to-typescript-interface">TypeScript interfaces</Link> instead, or compare JSON with <Link href="/tools/json-diff">JSON Diff</Link>.</p>
      </section>

      <section className="features" aria-label="Features">
        {[
          { icon: <FileCode2 size={24} />, title: "Draft 2020-12",    desc: "Output is validated against the current JSON Schema spec." },
          { icon: <Zap size={24} />,       title: "Smart inference",   desc: "Merges array item types, splits integer vs number." },
          { icon: <Lock size={24} />,      title: "Fully private",     desc: "JSON stays in your browser." },
        ].map(({ icon, title, desc }) => (
          <div className="feature" key={title}><div className="feature-icon">{icon}</div><h3>{title}</h3><p>{desc}</p></div>
        ))}
      </section>
    </>
  );
}
