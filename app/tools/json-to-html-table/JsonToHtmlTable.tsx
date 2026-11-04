"use client";

import { useState, useCallback } from "react";
import { jsonToHtmlTable, EXAMPLE_INPUT, DEFAULT_OPTIONS, type TableOptions } from "./utils";
import { Table2, Lock, Settings2 } from "lucide-react";

import "@/style/main.css";
import "@/style/bar.css";

export default function JsonToHtmlTable() {
  const [input, setInput] = useState(EXAMPLE_INPUT);
  const [output, setOutput] = useState("");
  const [opts, setOpts] = useState<TableOptions>(DEFAULT_OPTIONS);
  const [converting, setConverting] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const convert = useCallback(() => {
    setError("");
    if (!input.trim()) { setOutput(""); return; }
    setConverting(true);
    setTimeout(() => {
      try {
        setOutput(jsonToHtmlTable(input, opts));
      } catch (e) {
        setError((e as Error).message);
      }
      setConverting(false);
    }, 180);
  }, [input, opts]);

  const loadExample = () => { setInput(EXAMPLE_INPUT); setOutput(""); setError(""); };
  const clearAll = () => { setInput(""); setOutput(""); setError(""); };
  const copyOutput = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const setOpt = <K extends keyof TableOptions>(key: K, val: TableOptions[K]) => {
    setOpts((prev) => ({ ...prev, [key]: val }));
    setOutput("");
  };

  return (
    <>
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-eyebrow">
          <div className="hero-dot" aria-hidden="true" />
          Free · No sign-up · Runs in browser
        </div>
        <h1 id="hero-heading">
          JSON to HTML <em>Table</em>
        </h1>
        <p>
          Convert JSON arrays into clean HTML tables with automatic header detection.
          Optional row indexing and pretty-printed output.
        </p>
      </section>

      {error && (
        <div className="error-bar" role="alert" aria-live="assertive">
          <span aria-hidden="true">✕</span>
          <span>Error: {error}</span>
        </div>
      )}

      <section aria-label="JSON to HTML Table">
        <div className="converter">
          <div className={`panel${error ? " has-error" : ""}`}>
            <div className="panel-header">
              <div className="panel-title">
                <div className="dot json" aria-hidden="true" />
                JSON Array
              </div>
              <div className="panel-actions">
                <button className="btn-ghost" onClick={loadExample}>Example</button>
                <button className="btn-ghost" onClick={() => { setInput(""); setOutput(""); setError(""); }}>Clear</button>
              </div>
            </div>
            <textarea
              aria-label="JSON Array Input"
              placeholder='Paste a JSON array of objects here…'
              value={input}
              onChange={(e) => { setInput(e.target.value); setOutput(""); setError(""); }}
              spellCheck={false}
              autoCorrect="off"
              autoCapitalize="off"
            />
          </div>

          <div className={`panel${output ? " has-output" : ""}`}>
            <div className="panel-header">
              <div className="panel-title">
                <div className="dot xml" aria-hidden="true" />
                HTML Table
                {output && !converting && <span className="success-tag">✓ generated</span>}
              </div>
              <div className="panel-actions">
                <button className="btn-ghost" onClick={copyOutput} disabled={!output}>
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>
            <pre className={`output-pre${!output && !converting ? " empty" : ""}${converting ? " loading" : ""}`} aria-live="polite">
              {converting ? "Generating…" : output || "// HTML table will appear here…"}
            </pre>
          </div>
        </div>

        <div className="options-bar">
          <label><Settings2 size={14} aria-hidden="true" /> Options:</label>
          <label>
            <input type="checkbox" checked={opts.includeIndex} onChange={(e) => setOpt("includeIndex", e.target.checked)} />
            Include row index (#)
          </label>
          <label>
            <input type="checkbox" checked={opts.prettify} onChange={(e) => setOpt("prettify", e.target.checked)} />
            Pretty-print HTML
          </label>
        </div>

        <div className="actions">
          <button className="btn-secondary" onClick={loadExample}>Load Example</button>
          <button className="btn-convert" onClick={convert} disabled={converting || !input.trim()} aria-busy={converting}>
            {converting
              ? <><div className="btn-spinner" aria-hidden="true" /> Generating…</>
              : <><Table2 size={16} aria-hidden="true" className="mr-1" /> Generate Table</>
            }
          </button>
          <button className="btn-secondary" onClick={clearAll}>Clear All</button>
        </div>
      </section>

      <section className="seo-content" aria-labelledby="about-heading">
        <h2 id="about-heading">About JSON to HTML Table Tool</h2>
        <p>
          This free online tool converts JSON arrays of objects into clean, semantic HTML tables. It automatically detects
          column headers from object keys, handles missing fields gracefully, escapes HTML entities for safety, and produces
          properly structured table markup with thead and tbody. Perfect for displaying API data, generating reports, and
          creating data tables for web pages. Everything runs in your browser.
        </p>

        <h3>Why Convert JSON to HTML Tables?</h3>
        <p>
          JSON is the standard data exchange format for APIs, but displaying it to users requires HTML rendering. Converting
          JSON arrays to HTML tables is one of the most common frontend tasks — for admin dashboards, report pages, data
          exports, email templates, and documentation examples. Doing this manually is repetitive; this tool generates
          the table markup instantly so you can paste it into your project.
        </p>

        <h3>Key Benefits</h3>
        <ul>
          <li><strong>Automatic headers:</strong> Column names extracted from object keys across all array items</li>
          <li><strong>Semantic HTML:</strong> Proper thead, tbody, th, and td structure for accessibility and styling</li>
          <li><strong>HTML-safe:</strong> Values are entity-escaped to prevent XSS when pasting into pages</li>
          <li><strong>Row indexing:</strong> Optional # column for numbered rows</li>
          <li><strong>Pretty-print:</strong> Formatted output for readability or minified for production</li>
          <li><strong>Completely private:</strong> Your JSON data never leaves your browser</li>
        </ul>

        <h3>Privacy and Security</h3>
        <p>
          All conversion happens locally in your browser. Your API responses, database exports, and sensitive data never
          leave your device. No cookies, no tracking, no server uploads. Safe for production data and confidential records.
        </p>
      </section>

      <section className="features" aria-label="Features">
        {[
          { icon: <Table2 size={24} />, title: "Automatic headers", desc: "Column names detected from object keys across all items. Handles mixed schemas gracefully." },
          { icon: <Lock size={24} />, title: "Fully private", desc: "Your JSON data never leaves the browser. Safe for API data, records, and sensitive content." },
          { icon: <Settings2 size={24} />, title: "Configurable output", desc: "Optional row indexing, pretty-printed or minified HTML, and safe entity escaping." },
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
