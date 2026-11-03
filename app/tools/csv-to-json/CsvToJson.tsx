"use client";

import { useState, useCallback } from "react";
import { Table2, Zap, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { csvToJson, DEFAULT_OPTIONS, type CsvOptions } from "./utils";
import { EXAMPLE_CSV } from "@/lib/const";

import "@/style/main.css";
import "@/style/bar.css";

export default function CsvToJson() {
  const [input, setInput] = useState(EXAMPLE_CSV);
  const [output, setOutput] = useState("");
  const [opts, setOpts] = useState<CsvOptions>(DEFAULT_OPTIONS);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [converting, setConverting] = useState(false);

  const run = useCallback(() => {
    setError(""); setOutput("");
    if (!input.trim()) return;
    setConverting(true);
    setTimeout(() => {
      try { setOutput(JSON.stringify(csvToJson(input, opts), null, 2)); }
      catch (e) { setError((e as Error).message); }
      setConverting(false);
    }, 200);
  }, [input, opts]);

  const copyOutput = () => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const loadExample = () => { setInput(EXAMPLE_CSV); setOutput(""); setError(""); };
  const clearAll   = () => { setInput(""); setOutput(""); setError(""); };
  const setOpt = <K extends keyof CsvOptions>(k: K, v: CsvOptions[K]) => { setOpts((p) => ({ ...p, [k]: v })); setOutput(""); };

  return (
    <>
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-eyebrow">
          <div className="hero-dot" aria-hidden="true" />
          Free · No sign-up · Runs in browser
        </div>
        <h1 id="hero-heading">CSV <em>→</em> JSON</h1>
        <p>
          Parse CSV, TSV, or semicolon-separated spreadsheet data into clean JSON with
          intelligent type inference. Handles quoted fields, embedded commas, and newlines.
          100% client-side.
        </p>
      </section>

      {error && <div className="error-bar" role="alert"><span>✕</span><span>Parse Error: {error}</span></div>}

      <section aria-label="CSV to JSON">
        <div className="converter">
          <div className={`panel${error ? " has-error" : ""}`}>
            <div className="panel-header">
              <div className="panel-title"><div className="dot json" />CSV Input</div>
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
          <label>
            Delimiter:
            <select value={opts.delimiter} onChange={(e) => setOpt("delimiter", e.target.value as CsvOptions["delimiter"])}>
              <option value=",">comma</option>
              <option value=";">semicolon</option>
              <option value={"\t"}>tab</option>
            </select>
          </label>
          <label>
            <input type="checkbox" checked={opts.hasHeader} onChange={(e) => setOpt("hasHeader", e.target.checked)} /> First row is header
          </label>
          <label>
            <input type="checkbox" checked={opts.typeInference} onChange={(e) => setOpt("typeInference", e.target.checked)} /> Type inference
          </label>
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
        <h2 id="about-heading">CSV to JSON Converter</h2>
        <p>
          Convert any CSV, TSV, or semicolon-separated file into clean JSON. Perfect
          for feeding spreadsheet exports into JavaScript apps, REST APIs, Elasticsearch,
          MongoDB, or any JSON-expecting pipeline. Type inference turns
          <code> "42"</code> into <code>42</code>, <code>"true"</code> into
          <code> true</code>, and <code>""</code> into <code>null</code>.
        </p>

        <h3>Correctness Details</h3>
        <ul>
          <li>Standard CSV quoting: embedded commas, newlines, and <code>""</code> escapes</li>
          <li>Three delimiters: comma, semicolon (European Excel), tab (TSV)</li>
          <li>Optional type inference for numbers, booleans, nulls</li>
          <li>Empty columns auto-named <code>col1</code>, <code>col2</code>… when headerless</li>
        </ul>

        <h3>Common Use Cases</h3>
        <ul>
          <li>Import spreadsheet data into JavaScript tests and seeds</li>
          <li>Feed CSV exports into MongoDB, Elasticsearch, or Firestore</li>
          <li>Transform legacy data for REST and GraphQL APIs</li>
          <li>Build analytics pipelines that expect JSON lines</li>
        </ul>

        <h3>FAQ</h3>
        <h3>Does it handle quoted multi-line cells?</h3>
        <p>Yes. Cells enclosed in double quotes may span multiple lines; the parser preserves them.</p>

        <h3>Is my data uploaded?</h3>
        <p>No. Parsing is 100% client-side — safe for internal spreadsheets and confidential exports.</p>

        <h3>Related</h3>
        <p>
          Convert in the other direction with <Link href="/tools/json-to-csv">JSON → CSV</Link>,
          or turn CSV into a <Link href="/tools/csv-to-markdown">Markdown table</Link>.
        </p>
      </section>

      <section className="features" aria-label="Features">
        {[
          { icon: <Table2 size={24} />, title: "RFC 4180 parsing", desc: "Quoted fields, embedded commas, and newlines all handled correctly." },
          { icon: <Zap size={24} />,    title: "Type inference",   desc: "Numbers, booleans, and nulls auto-detected instead of staying strings." },
          { icon: <Lock size={24} />,   title: "Fully private",    desc: "Parsing happens locally — safe for internal data." },
        ].map(({ icon, title, desc }) => (
          <div className="feature" key={title}>
            <div className="feature-icon">{icon}</div>
            <h3>{title}</h3>
            <p>{desc}</p>
          </div>
        ))}
      </section>
    </>
  );
}
