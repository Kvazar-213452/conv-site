"use client";

import { useState, useMemo } from "react";
import { GitCompare, Lock, Zap, ArrowRight } from "lucide-react";
import { diffLines, diffStats, type DiffLine } from "./utils";
import { EXAMPLE_DIFF_A, EXAMPLE_DIFF_B } from "@/lib/const";

import "@/style/main.css";
import "./main.css";

const SIGN: Record<DiffLine["op"], string> = { add: "+", remove: "−", equal: " " };

export default function TextDiff() {
  const [a, setA] = useState(EXAMPLE_DIFF_A);
  const [b, setB] = useState(EXAMPLE_DIFF_B);
  const [run, setRun] = useState(0);

  const diff = useMemo(() => (a === "" && b === "" ? [] : diffLines(a, b)), [a, b, run]);
  const stats = useMemo(() => diffStats(diff), [diff]);

  const loadExample = () => { setA(EXAMPLE_DIFF_A); setB(EXAMPLE_DIFF_B); setRun((n) => n + 1); };
  const clearAll   = () => { setA(""); setB(""); };

  const hasDiff = diff.some((d) => d.op !== "equal");

  return (
    <>
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-eyebrow">
          <div className="hero-dot" aria-hidden="true" />
          Free · No sign-up · Runs in browser
        </div>
        <h1 id="hero-heading">
          Text <em>Diff</em>
        </h1>
        <p>
          Compare two blocks of text and see added, removed, and unchanged lines
          side-by-side. Everything runs locally in your browser.
        </p>
      </section>

      <section aria-label="Text Diff">
        <div className="converter">

          <div className="panel">
            <div className="panel-header">
              <div className="panel-title">
                <div className="dot json" aria-hidden="true" />
                Original (A)
              </div>
              <div className="panel-actions">
                <button className="btn-ghost" onClick={loadExample}>Example</button>
                <button className="btn-ghost" onClick={() => setA("")}>Clear</button>
              </div>
            </div>
            <textarea
              aria-label="Original text"
              placeholder="Paste the original text…"
              value={a}
              onChange={(e) => setA(e.target.value)}
              spellCheck={false} autoCorrect="off" autoCapitalize="off"
            />
          </div>

          <div className="panel">
            <div className="panel-header">
              <div className="panel-title">
                <div className="dot yaml" aria-hidden="true" />
                Modified (B)
              </div>
              <div className="panel-actions">
                <button className="btn-ghost" onClick={() => setB("")}>Clear</button>
              </div>
            </div>
            <textarea
              aria-label="Modified text"
              placeholder="Paste the modified text…"
              value={b}
              onChange={(e) => setB(e.target.value)}
              spellCheck={false} autoCorrect="off" autoCapitalize="off"
            />
          </div>
        </div>

        <div className="converter" style={{ marginTop: "16px", gridTemplateColumns: "1fr" }}>
          <div className={`panel td-panel${hasDiff ? " has-output" : ""}`}>
            <div className="panel-header">
              <div className="panel-title">
                <div className="dot prisma" aria-hidden="true" />
                Diff
                {hasDiff && <span className="success-tag">✓ compared</span>}
              </div>
            </div>

            {diff.length === 0 && (
              <pre className="output-pre empty" aria-live="polite">
                {`// Enter text on both sides to compare…`}
              </pre>
            )}
            {diff.length > 0 && (
              <div className="td-view" aria-live="polite">
                {diff.map((line, i) => (
                  <div className={`td-row ${line.op}`} key={i}>
                    <span className="td-ln">{line.aIndex ?? ""}</span>
                    <span className="td-ln">{line.bIndex ?? ""}</span>
                    <span className="td-sign">{SIGN[line.op]}</span>
                    <span className="td-text">{line.value || " "}</span>
                  </div>
                ))}
              </div>
            )}

            {diff.length > 0 && (
              <div className="td-stats" aria-label="Diff stats">
                <span className="td-stat added"><strong>+{stats.added}</strong> added</span>
                <span className="td-stat removed"><strong>−{stats.removed}</strong> removed</span>
                <span className="td-stat"><strong>{stats.unchanged}</strong> unchanged</span>
              </div>
            )}
          </div>
        </div>

        <div className="actions">
          <button className="btn-secondary" onClick={loadExample}>Load Example</button>
          <button
            className="btn-convert"
            onClick={() => setRun((n) => n + 1)}
            disabled={!a && !b}
          >
            <ArrowRight size={16} aria-hidden="true" className="mr-1" /> Recompute Diff
          </button>
          <button className="btn-secondary" onClick={clearAll}>Clear All</button>
        </div>
      </section>

      <section className="seo-content" aria-labelledby="about-heading">
        <h2 id="about-heading">About Text Diff Tool</h2>
        <p>
          This free online text diff tool compares two blocks of text and shows the differences
          line by line using an LCS (longest-common-subsequence) algorithm — the same technique
          used by Git and most diff viewers. Added lines are shown in green, removed lines in red,
          and unchanged lines in neutral.
        </p>

        <h3>How It Works</h3>
        <p>
          The algorithm computes the longest common subsequence between the two inputs, then
          walks the result to emit the minimal set of insertions and deletions. Everything
          happens locally — your text never leaves the browser.
        </p>

        <h3>Key Benefits</h3>
        <ul>
          <li><strong>Line-by-line output:</strong> Added, removed, and unchanged lines clearly marked</li>
          <li><strong>Dual line numbers:</strong> See original and modified positions side-by-side</li>
          <li><strong>Diff stats:</strong> Totals for added, removed, and unchanged lines</li>
          <li><strong>Fully private:</strong> No uploads — safe for proprietary code and documents</li>
          <li><strong>Fast:</strong> Handles several thousand lines comfortably</li>
        </ul>
      </section>

      <section className="features" aria-label="Features">
        {[
          {
            icon: <Zap size={24} />,
            title: "Fast LCS diff",
            desc: "Minimal insertions and deletions computed via a classic longest-common-subsequence pass.",
          },
          {
            icon: <Lock size={24} />,
            title: "Fully private",
            desc: "Both inputs stay in your browser — ideal for internal source code and documents.",
          },
          {
            icon: <GitCompare size={24} />,
            title: "Readable output",
            desc: "Added, removed, and unchanged lines shown with color, line numbers, and totals.",
          },
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
