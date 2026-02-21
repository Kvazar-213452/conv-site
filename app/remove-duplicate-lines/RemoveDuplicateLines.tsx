"use client";

import { useState, useCallback } from "react";
import { dedupeLines, DEFAULT_OPTIONS, EXAMPLE_INPUTS, type DedupeOptions } from "./utils";
import { Layers, Lock, Settings2, ArrowRight } from "lucide-react";

import "@/app/css/main.css";
import "@/app/css/bar.css";
import "@/app/css/bar_footer.css";

export default function RemoveDuplicateLines() {
  const [input, setInput] = useState(EXAMPLE_INPUTS[0]);
  const [output, setOutput] = useState("");
  const [opts, setOpts] = useState<DedupeOptions>(DEFAULT_OPTIONS);
  const [copied, setCopied] = useState(false);
  const [converting, setConverting] = useState(false);
  const [error, setError] = useState("");
  const [stats, setStats] = useState<{ original: number; unique: number; removed: number } | null>(null);

  const convert = useCallback(() => {
    setError("");
    setOutput("");
    setStats(null);
    if (!input.trim()) return;
    setConverting(true);
    setTimeout(() => {
      try {
        const res = dedupeLines(input, opts);
        if (!res.output && res.uniqueCount === 0) {
          throw new Error("Result is empty — all lines were removed.");
        }
        setOutput(res.output);
        setStats({ original: res.originalCount, unique: res.uniqueCount, removed: res.removedCount });
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

  const downloadOutput = () => {
    const blob = new Blob([output], { type: "text/plain;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "deduplicated.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const swapWithOutput = () => {
    if (!output) return;
    setInput(output);
    setOutput("");
    setStats(null);
    setError("");
  };

  const loadExample = () => {
    const random = EXAMPLE_INPUTS[Math.floor(Math.random() * EXAMPLE_INPUTS.length)];
    setInput(random);
    setOutput("");
    setStats(null);
    setError("");
  };

  const clearAll = () => { setInput(""); setOutput(""); setStats(null); setError(""); };

  const setOpt = <K extends keyof DedupeOptions>(key: K, val: DedupeOptions[K]) => {
    setOpts((prev) => ({ ...prev, [key]: val }));
    setOutput("");
    setStats(null);
  };

  return (
    <>
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-eyebrow">
          <div className="hero-dot" aria-hidden="true" />
          Free · No sign-up · Runs in browser
        </div>
        <h1 id="hero-heading">
          Remove <em>Duplicate</em>
          <br />Lines
        </h1>
        <p>
          Paste any text and instantly remove duplicate lines. Supports case-insensitive
          matching, trimming, empty line removal, and sorting.
          Runs 100% in your browser — nothing leaves your device.
        </p>
      </section>

      {/* Error */}
      {error && (
        <div className="error-bar" role="alert" aria-live="assertive">
          <span aria-hidden="true">✕</span>
          <span>Error: {error}</span>
        </div>
      )}

      {/* Converter */}
      <section aria-label="Duplicate Line Remover">
        <div className="converter">

          {/* Input panel */}
          <div className={`panel${error ? " has-error" : ""}`}>
            <div className="panel-header">
              <div className="panel-title">
                <div className="dot json" aria-hidden="true" />
                Text Input
              </div>
              <div className="panel-actions">
                <button className="btn-ghost" onClick={loadExample}>Example</button>
                <button className="btn-ghost" onClick={() => { setInput(""); setError(""); }}>Clear</button>
              </div>
            </div>
            <textarea
              aria-label="Text Input"
              placeholder={"line one\nline two\nline one\nduplicate\nduplicate"}
              value={input}
              onChange={(e) => { setInput(e.target.value); setError(""); setOutput(""); setStats(null); }}
              spellCheck={false}
              autoCorrect="off"
              autoCapitalize="off"
            />
          </div>

          {/* Output panel */}
          <div className={`panel${output ? " has-output" : ""}`}>
            <div className="panel-header">
              <div className="panel-title">
                <div className="dot xml" aria-hidden="true" />
                Unique Lines
                {output && !converting && stats && (
                  <span className="success-tag">
                    ✓ -{stats.removed} duplicate{stats.removed !== 1 ? "s" : ""}
                  </span>
                )}
              </div>
              <div className="panel-actions">
                {output && !converting && (
                  <>
                    <button className="btn-ghost" onClick={copyOutput}>
                      {copied ? "✓ Copied!" : "Copy"}
                    </button>
                    <button className="btn-ghost" onClick={downloadOutput}>
                      ↓ Download
                    </button>
                    <button
                      className="btn-ghost"
                      onClick={swapWithOutput}
                      title="Use output as new input"
                    >
                      ⇄ Swap
                    </button>
                  </>
                )}
              </div>
            </div>
            <pre
              className={`output-pre${output && !converting ? "" : " empty"}${converting ? " loading" : ""}`}
              aria-label="Unique Lines Output"
              aria-live="polite"
            >
              {converting
                ? "// Processing…"
                : output || "// Your deduplicated text will appear here…"}
            </pre>
          </div>
        </div>

        {/* Stats bar */}
        {stats && !converting && (
          <div className="stats-bar" aria-live="polite">
            <div className="stat">
              <span className="stat-value">{stats.original}</span>
              <span className="stat-label">original</span>
            </div>
            <div className="stat-divider" aria-hidden="true">→</div>
            <div className="stat">
              <span className="stat-value stat-value--unique">{stats.unique}</span>
              <span className="stat-label">unique</span>
            </div>
            <div className="stat-divider" aria-hidden="true">·</div>
            <div className="stat">
              <span className="stat-value stat-value--removed">{stats.removed}</span>
              <span className="stat-label">removed</span>
            </div>
          </div>
        )}

        {/* Options */}
        <div className="options-bar">
          <label>
            <Settings2 size={14} aria-hidden="true" />
            Keep:
            <select
              value={opts.keepOrder}
              onChange={(e) => setOpt("keepOrder", e.target.value as DedupeOptions["keepOrder"])}
            >
              <option value="first">First occurrence</option>
              <option value="last">Last occurrence</option>
            </select>
          </label>

          <label>
            <input
              type="checkbox"
              checked={opts.caseSensitive}
              onChange={(e) => setOpt("caseSensitive", e.target.checked)}
            />
            Case sensitive
          </label>

          <label>
            <input
              type="checkbox"
              checked={opts.trimLines}
              onChange={(e) => setOpt("trimLines", e.target.checked)}
            />
            Trim whitespace
          </label>

          <label>
            <input
              type="checkbox"
              checked={opts.removeEmpty}
              onChange={(e) => setOpt("removeEmpty", e.target.checked)}
            />
            Remove empty lines
          </label>

          <label>
            <input
              type="checkbox"
              checked={opts.sortResult}
              onChange={(e) => setOpt("sortResult", e.target.checked)}
            />
            Sort result
          </label>
        </div>

        {/* Action Buttons */}
        <div className="actions">
          <button className="btn-secondary" onClick={loadExample}>Load Example</button>
          <button
            className="btn-convert"
            onClick={convert}
            disabled={converting || !input.trim()}
            aria-busy={converting}
          >
            {converting
              ? <><div className="btn-spinner" aria-hidden="true" /> Processing…</>
              : <><ArrowRight size={16} aria-hidden="true" className="mr-1" /> Remove Duplicates</>
            }
          </button>
          <button className="btn-secondary" onClick={clearAll}>Clear All</button>
        </div>
      </section>

      {/* Features */}
      <section className="features" aria-label="Features">
        {[
          {
            icon: <Layers size={24} />,
            title: "Smart deduplication",
            desc: "Remove exact or case-insensitive duplicates. Choose to keep the first or last occurrence of each line.",
          },
          {
            icon: <Lock size={24} />,
            title: "Fully private",
            desc: "Your text never leaves the browser. Safe for logs, configs, passwords, or any sensitive data.",
          },
          {
            icon: <Settings2 size={24} />,
            title: "Flexible options",
            desc: "Trim whitespace, remove empty lines, sort the result — all configurable before or after conversion.",
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