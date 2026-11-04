"use client";

import { useState, useCallback } from "react";
import { createEmptyTable, generateMarkdownTable, type TableData, type Alignment } from "./utils";
import { Table2, Lock, Copy } from "lucide-react";

import "@/style/main.css";

export default function MarkdownTableGenerator() {
  const [data, setData] = useState<TableData>(createEmptyTable(3, 3));
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const generate = useCallback(() => {
    setOutput(generateMarkdownTable(data));
  }, [data]);

  const setHeader = (col: number, value: string) => {
    setData((prev) => {
      const headers = [...prev.headers];
      headers[col] = value;
      return { ...prev, headers };
    });
    setOutput("");
  };

  const setCell = (row: number, col: number, value: string) => {
    setData((prev) => {
      const rows = prev.rows.map((r) => [...r]);
      rows[row][col] = value;
      return { ...prev, rows };
    });
    setOutput("");
  };

  const setAlignment = (col: number, align: Alignment) => {
    setData((prev) => {
      const alignments = [...prev.alignments];
      alignments[col] = align;
      return { ...prev, alignments };
    });
    setOutput("");
  };

  const addRow = () => {
    setData((prev) => ({
      ...prev,
      rows: [...prev.rows, Array.from({ length: prev.headers.length }, () => "")],
    }));
    setOutput("");
  };

  const addColumn = () => {
    setData((prev) => ({
      headers: [...prev.headers, `Header ${prev.headers.length + 1}`],
      rows: prev.rows.map((r) => [...r, ""]),
      alignments: [...prev.alignments, "left"],
    }));
    setOutput("");
  };

  const removeRow = (idx: number) => {
    if (data.rows.length <= 1) return;
    setData((prev) => ({
      ...prev,
      rows: prev.rows.filter((_, i) => i !== idx),
    }));
    setOutput("");
  };

  const removeColumn = (idx: number) => {
    if (data.headers.length <= 1) return;
    setData((prev) => ({
      headers: prev.headers.filter((_, i) => i !== idx),
      rows: prev.rows.map((r) => r.filter((_, i) => i !== idx)),
      alignments: prev.alignments.filter((_, i) => i !== idx),
    }));
    setOutput("");
  };

  const reset = () => { setData(createEmptyTable(3, 3)); setOutput(""); };

  const copyOutput = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-eyebrow">
          <div className="hero-dot" aria-hidden="true" />
          Free · No sign-up · Runs in browser
        </div>
        <h1 id="hero-heading">
          Markdown <em>Table</em> Generator
        </h1>
        <p>
          Create GitHub-flavored Markdown tables with an interactive editor.
          Set column alignment, add rows and columns, and copy the result.
        </p>
      </section>

      <section aria-label="Markdown Table Generator">
        <div style={{ overflowX: "auto", border: "1px solid var(--color-border)", borderRadius: 12, background: "var(--color-surface)", padding: 16, marginBottom: 16 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {data.headers.map((h, ci) => (
                  <th key={ci} style={{ padding: "6px 4px", borderBottom: "2px solid var(--color-border)" }}>
                    <input
                      value={h}
                      onChange={(e) => setHeader(ci, e.target.value)}
                      style={{ width: "100%", padding: "6px 8px", fontSize: 13, fontFamily: "'Geist Mono', monospace", fontWeight: 600, background: "var(--color-accent-soft)", border: "1px solid var(--color-border-bright)", borderRadius: 6, color: "var(--color-text)", textAlign: "center" }}
                    />
                    <div style={{ marginTop: 4, display: "flex", gap: 2, justifyContent: "center" }}>
                      {(["left", "center", "right"] as Alignment[]).map((a) => (
                        <button
                          key={a}
                          onClick={() => setAlignment(ci, a)}
                          style={{
                            fontSize: 10, padding: "2px 6px", borderRadius: 4, cursor: "pointer",
                            border: data.alignments[ci] === a ? "1px solid var(--color-accent)" : "1px solid var(--color-border)",
                            background: data.alignments[ci] === a ? "var(--color-accent)" : "transparent",
                            color: data.alignments[ci] === a ? "var(--color-text-inverse)" : "var(--color-text-muted)",
                          }}
                        >
                          {a[0].toUpperCase()}
                        </button>
                      ))}
                      {data.headers.length > 1 && (
                        <button onClick={() => removeColumn(ci)} style={{ fontSize: 10, padding: "2px 6px", borderRadius: 4, border: "1px solid var(--color-border)", background: "transparent", color: "var(--color-text-muted)", cursor: "pointer" }}>✕</button>
                      )}
                    </div>
                  </th>
                ))}
                <th style={{ width: 40 }} />
              </tr>
            </thead>
            <tbody>
              {data.rows.map((row, ri) => (
                <tr key={ri}>
                  {row.map((cell, ci) => (
                    <td key={ci} style={{ padding: "4px" }}>
                      <input
                        value={cell}
                        onChange={(e) => setCell(ri, ci, e.target.value)}
                        placeholder="…"
                        style={{ width: "100%", padding: "6px 8px", fontSize: 13, fontFamily: "'Geist Mono', monospace", background: "transparent", border: "1px solid var(--color-border)", borderRadius: 6, color: "var(--color-text)" }}
                      />
                    </td>
                  ))}
                  <td style={{ padding: "4px" }}>
                    {data.rows.length > 1 && (
                      <button onClick={() => removeRow(ri)} className="btn-ghost" style={{ fontSize: 10, padding: "4px 6px" }}>✕</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <button className="btn-ghost" onClick={addRow}>+ Row</button>
            <button className="btn-ghost" onClick={addColumn}>+ Column</button>
            <button className="btn-ghost" onClick={reset}>Reset</button>
          </div>
        </div>

        <div className="actions">
          <button className="btn-convert" onClick={generate}>
            <Table2 size={16} aria-hidden="true" className="mr-1" /> Generate Markdown
          </button>
          {output && (
            <button className="btn-secondary" onClick={copyOutput}>
              <Copy size={14} aria-hidden="true" style={{ marginRight: 4 }} /> {copied ? "Copied!" : "Copy"}
            </button>
          )}
        </div>

        {output && (
          <div className={`panel panel--full has-output`} style={{ marginTop: 16 }}>
            <div className="panel-header">
              <div className="panel-title">
                <div className="dot yaml" aria-hidden="true" />
                Markdown Output
                <span className="success-tag">✓ generated</span>
              </div>
              <div className="panel-actions">
                <button className="btn-ghost" onClick={copyOutput}>{copied ? "Copied!" : "Copy"}</button>
              </div>
            </div>
            <pre className="output-pre" aria-live="polite">{output}</pre>
          </div>
        )}
      </section>

      <section className="seo-content" aria-labelledby="about-heading">
        <h2 id="about-heading">About Markdown Table Generator Tool</h2>
        <p>
          This free online Markdown table generator lets you create GitHub-flavored Markdown (GFM) tables with an
          interactive visual editor. Add rows and columns, set per-column alignment (left, center, right), type your
          data directly, and generate copy-paste ready Markdown table syntax. Perfect for README files, pull request
          descriptions, documentation, and any Markdown-based content. No need to manually type pipes and dashes.
        </p>

        <h3>Why Use a Markdown Table Generator?</h3>
        <p>
          Manually writing Markdown tables is tedious — you need to align pipes, count dashes for separator rows, and
          escape special characters. One misaligned column breaks the entire table. A visual generator eliminates these
          formatting headaches and lets you focus on the data. It's especially valuable for large tables with many columns
          or when you need precise alignment control.
        </p>

        <h3>Key Benefits</h3>
        <ul>
          <li><strong>Interactive editor:</strong> Type directly in cells instead of managing pipe-delimited text</li>
          <li><strong>Column alignment:</strong> Set left, center, or right alignment per column</li>
          <li><strong>Dynamic sizing:</strong> Add or remove rows and columns as needed</li>
          <li><strong>GFM-compatible:</strong> Output works on GitHub, GitLab, Bitbucket, and all GFM renderers</li>
          <li><strong>Pipe escaping:</strong> Pipe characters in cell data are automatically escaped</li>
          <li><strong>One-click copy:</strong> Copy the generated Markdown instantly</li>
          <li><strong>No sign-up:</strong> Free forever with no account required</li>
        </ul>

        <h3>Privacy and Security</h3>
        <p>
          Everything runs locally in your browser. Your table data never leaves your device. No server uploads, no
          cookies, no tracking. Safe for any content including confidential documentation and internal reports.
        </p>
      </section>

      <section className="features" aria-label="Features">
        {[
          { icon: <Table2 size={24} />, title: "Visual editor", desc: "Type in cells, set alignment, add/remove rows and columns — no manual pipe formatting." },
          { icon: <Lock size={24} />, title: "Fully private", desc: "Your table data never leaves the browser. Safe for documentation and internal content." },
          { icon: <Copy size={24} />, title: "Copy-paste ready", desc: "Generated Markdown works on GitHub, GitLab, Bitbucket, and all GFM-compatible renderers." },
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
