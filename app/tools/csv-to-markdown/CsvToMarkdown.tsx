"use client";

import { useState, useCallback } from "react";
import { Table2, FileText, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";
import {
  csvToMarkdown,
  DEFAULT_OPTIONS,
  type Options,
  type Align,
} from "./utils";

import "@/style/main.css";
import "@/style/bar.css";

const EXAMPLE_CSV = `name,role,joined
Alice,Backend,2023-04-01
Bob,Frontend,2023-11-20
Carol,DevOps,2024-02-15
Dan,Design,2024-08-02`;

export default function CsvToMarkdown() {
  const [input, setInput] = useState(EXAMPLE_CSV);
  const [output, setOutput] = useState("");
  const [opts, setOpts] = useState<Options>(DEFAULT_OPTIONS);
  const [copied, setCopied] = useState(false);
  const [converting, setConverting] = useState(false);
  const [error, setError] = useState("");

  const run = useCallback(() => {
    setError("");
    setOutput("");
    if (!input.trim()) return;
    setConverting(true);
    setTimeout(() => {
      try {
        const md = csvToMarkdown(input, opts);
        if (!md) throw new Error("No rows parsed — check delimiter and input");
        setOutput(md);
      } catch (e) {
        setError((e as Error).message);
      }
      setConverting(false);
    }, 220);
  }, [input, opts]);

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const loadExample = () => { setInput(EXAMPLE_CSV); setOutput(""); setError(""); };
  const clearAll   = () => { setInput(""); setOutput(""); setError(""); };

  const setOpt = <K extends keyof Options>(key: K, val: Options[K]) => {
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
          CSV <em>→</em> Markdown Table
        </h1>
        <p>
          Convert any CSV (or TSV, or semicolon-separated) file into a GitHub-ready
          Markdown table with aligned columns. Quoted fields, embedded commas, and
          multi-line cells are handled correctly.
        </p>
      </section>

      {error && (
        <div className="error-bar" role="alert" aria-live="assertive">
          <span aria-hidden="true">✕</span>
          <span>Parse Error: {error}</span>
        </div>
      )}

      <section aria-label="CSV to Markdown Table">
        <div className="converter">

          <div className={`panel${error ? " has-error" : ""}`}>
            <div className="panel-header">
              <div className="panel-title">
                <div className="dot json" aria-hidden="true" />
                CSV Input
              </div>
              <div className="panel-actions">
                <button className="btn-ghost" onClick={loadExample}>Example</button>
                <button className="btn-ghost" onClick={() => { setInput(""); setError(""); }}>Clear</button>
              </div>
            </div>
            <textarea
              aria-label="CSV input"
              placeholder="col1,col2,col3&#10;a,b,c"
              value={input}
              onChange={(e) => { setInput(e.target.value); setError(""); }}
              spellCheck={false} autoCorrect="off" autoCapitalize="off"
            />
          </div>

          <div className={`panel${output ? " has-output" : ""}`}>
            <div className="panel-header">
              <div className="panel-title">
                <div className="dot yaml" aria-hidden="true" />
                Markdown Table
                {output && !converting && <span className="success-tag">✓ converted</span>}
              </div>
              {output && !converting && (
                <div className="panel-actions">
                  <button className="btn-ghost" onClick={copyOutput}>
                    {copied ? "✓ Copied!" : "Copy"}
                  </button>
                </div>
              )}
            </div>
            <pre
              className={`output-pre${output && !converting ? "" : " empty"}${converting ? " loading" : ""}`}
              aria-live="polite"
            >
              {converting ? "// Converting…" : (output || "// Markdown table will appear here…")}
            </pre>
          </div>
        </div>

        <div className="options-bar">
          <label>
            Delimiter:
            <select
              value={opts.delimiter}
              onChange={(e) => setOpt("delimiter", e.target.value as Options["delimiter"])}
            >
              <option value=",">comma (CSV)</option>
              <option value=";">semicolon</option>
              <option value={"\t"}>tab (TSV)</option>
            </select>
          </label>
          <label>
            Alignment:
            <select
              value={opts.align}
              onChange={(e) => setOpt("align", e.target.value as Align)}
            >
              <option value="left">left</option>
              <option value="right">right</option>
              <option value="center">center</option>
              <option value="none">none</option>
            </select>
          </label>
          <label>
            <input
              type="checkbox"
              checked={opts.hasHeader}
              onChange={(e) => setOpt("hasHeader", e.target.checked)}
            />
            First row is header
          </label>
          <label>
            <input
              type="checkbox"
              checked={opts.trimCells}
              onChange={(e) => setOpt("trimCells", e.target.checked)}
            />
            Trim whitespace
          </label>
        </div>

        <div className="actions">
          <button className="btn-secondary" onClick={loadExample}>Load Example</button>
          <button
            className="btn-convert"
            onClick={run}
            disabled={converting || !input.trim()}
            aria-busy={converting}
          >
            {converting
              ? <><div className="btn-spinner" aria-hidden="true" /> Converting…</>
              : <><ArrowRight size={16} aria-hidden="true" className="mr-1" /> Convert</>
            }
          </button>
          <button className="btn-secondary" onClick={clearAll}>Clear All</button>
        </div>
      </section>

      <section className="seo-content" aria-labelledby="about-heading">
        <h2 id="about-heading">About the CSV to Markdown Converter</h2>
        <p>
          This free online converter turns CSV, TSV, or semicolon-separated data into
          a GitHub-flavored Markdown table with aligned columns. Paste a spreadsheet
          export, click Convert, and get a table ready to drop into a README, pull
          request description, Confluence page, or static-site post. Everything runs
          in your browser — your data never leaves the page.
        </p>

        <h3>Why Markdown Tables?</h3>
        <p>
          Markdown tables are the lingua franca of developer documentation. GitHub,
          GitLab, Bitbucket, and most static-site generators render them to proper
          HTML tables. They are also diff-friendly in pull requests, unlike pasted
          images or HTML blobs.
        </p>

        <h3>Correctness Details</h3>
        <ul>
          <li>Quoted fields handle commas, newlines, and embedded quotes (<code>""</code>)</li>
          <li>Pipes (<code>|</code>) inside cells are escaped as <code>\|</code> per GFM spec</li>
          <li>Newlines inside quoted cells collapse to spaces so the table stays single-row</li>
          <li>Column widths are padded so the raw Markdown source is also readable</li>
          <li>Alignment uses <code>:---</code> / <code>---:</code> / <code>:---:</code> markers</li>
        </ul>

        <h3>Common Use Cases</h3>
        <ul>
          <li>Convert spreadsheet exports to README tables</li>
          <li>Document API parameter lists from a CSV source</li>
          <li>Turn test case matrices into pull-request descriptions</li>
          <li>Paste benchmark results into blog posts</li>
          <li>Export data from a database and drop it into docs</li>
        </ul>

        <h3>Frequently Asked Questions</h3>

        <h3>What if my file uses semicolons instead of commas?</h3>
        <p>
          Pick <strong>semicolon</strong> from the Delimiter dropdown. European
          Excel exports typically use semicolons so that decimal commas don't
          collide with field separators.
        </p>

        <h3>Does it handle Excel-exported CSVs with BOMs?</h3>
        <p>
          Yes — a leading UTF-8 BOM is stripped automatically by the browser's
          text handling before parsing starts.
        </p>

        <h3>Is my data uploaded anywhere?</h3>
        <p>
          No. CSV parsing and Markdown emission happen locally — safe for internal
          data, employee lists, benchmark numbers, and confidential exports.
        </p>

        <h3>Related Tools</h3>
        <p>
          Convert between <Link href="/tools/json-to-csv">JSON and CSV</Link> or
          render Markdown with the{" "}
          <Link href="/tools/markdown-to-html">Markdown to HTML</Link> tool. Full
          Markdown syntax reference lives in the{" "}
          <Link href="/blog/markdown-guide">Markdown guide</Link>.
        </p>
      </section>

      <section className="features" aria-label="Features">
        {[
          { icon: <Table2 size={24} />, title: "GFM-compliant", desc: "Alignment markers and pipe escaping follow the GitHub Flavored Markdown spec." },
          { icon: <FileText size={24} />, title: "Diff-friendly", desc: "Padded columns make the raw Markdown source scannable in pull requests." },
          { icon: <Lock size={24} />,     title: "Fully private", desc: "No uploads — safe for internal data and confidential CSV exports." },
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
