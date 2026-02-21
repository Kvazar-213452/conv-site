"use client";

import { useState, useCallback } from "react";
import { convertCase, DEFAULT_OPTIONS, EXAMPLE_INPUTS, CASE_LABELS, type CaseType, type CaseOptions } from "./utils";
import { Type, Lock, Settings2, ArrowRight } from "lucide-react";

import "@/app/css/main.css";
import "@/app/css/bar.css";
import "@/app/css/bar_footer.css";
import "./main.css";

const CASE_GROUPS: { label: string; cases: CaseType[] }[] = [
  { label: "Basic", cases: ["upper", "lower", "sentence", "title"] },
  { label: "Code", cases: ["camel", "pascal", "snake", "kebab", "constant"] },
  { label: "Fun", cases: ["alternating", "inverse"] },
];

export default function CaseConverter() {
  const [input, setInput] = useState(EXAMPLE_INPUTS[0]);
  const [output, setOutput] = useState("");
  const [caseType, setCaseType] = useState<CaseType>("upper");
  const [opts, setOpts] = useState<CaseOptions>(DEFAULT_OPTIONS);
  const [copied, setCopied] = useState(false);
  const [converting, setConverting] = useState(false);
  const [error, setError] = useState("");
  const [stats, setStats] = useState<{ charCount: number; wordCount: number; lineCount: number } | null>(null);

  const convert = useCallback(() => {
    setError("");
    setOutput("");
    setStats(null);
    if (!input.trim()) return;
    setConverting(true);
    setTimeout(() => {
      try {
        const res = convertCase(input, caseType, opts);
        if (!res.output) throw new Error("Result is empty.");
        setOutput(res.output);
        setStats({ charCount: res.charCount, wordCount: res.wordCount, lineCount: res.lineCount });
      } catch (e) {
        setError((e as Error).message);
      }
      setConverting(false);
    }, 220);
  }, [input, caseType, opts]);

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
    a.download = "converted.txt";
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

  const setOpt = <K extends keyof CaseOptions>(key: K, val: CaseOptions[K]) => {
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
          Case <em>Converter</em>
        </h1>
        <p>
          Instantly convert text to UPPER, lower, Title, Sentence, camelCase, snake_case,
          kebab-case, and more. Runs 100% in your browser — nothing leaves your device.
        </p>
      </section>

      {/* Error */}
      {error && (
        <div className="error-bar" role="alert" aria-live="assertive">
          <span aria-hidden="true">✕</span>
          <span>Error: {error}</span>
        </div>
      )}

      {/* Case type selector */}
      <section aria-label="Case Type Selector">
        <div className="case-selector">
          {CASE_GROUPS.map(({ label, cases }) => (
            <div className="case-group" key={label}>
              <span className="case-group-label">{label}</span>
              <div className="case-group-buttons">
                {cases.map((c) => (
                  <button
                    key={c}
                    className={`case-btn${caseType === c ? " active" : ""}`}
                    onClick={() => { setCaseType(c); setOutput(""); setStats(null); }}
                    aria-pressed={caseType === c}
                  >
                    {CASE_LABELS[c]}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Converter */}
      <section aria-label="Case Converter">
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
              placeholder="Type or paste your text here…"
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
                Converted Text
                {output && !converting && (
                  <span className="success-tag">✓ {CASE_LABELS[caseType]}</span>
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
              aria-label="Converted Text Output"
              aria-live="polite"
            >
              {converting
                ? "// Processing…"
                : output || "// Your converted text will appear here…"}
            </pre>
          </div>
        </div>

        {/* Stats bar */}
        {stats && !converting && (
          <div className="stats-bar" aria-live="polite">
            <div className="stat">
              <span className="stat-value">{stats.charCount}</span>
              <span className="stat-label">characters</span>
            </div>
            <div className="stat-divider" aria-hidden="true">·</div>
            <div className="stat">
              <span className="stat-value stat-value--unique">{stats.wordCount}</span>
              <span className="stat-label">words</span>
            </div>
            <div className="stat-divider" aria-hidden="true">·</div>
            <div className="stat">
              <span className="stat-value stat-value--removed">{stats.lineCount}</span>
              <span className="stat-label">lines</span>
            </div>
          </div>
        )}

        {/* Options */}
        <div className="options-bar">
          <label>
            <input
              type="checkbox"
              checked={opts.preserveNewlines}
              onChange={(e) => setOpt("preserveNewlines", e.target.checked)}
            />
            Preserve newlines
          </label>

          <label>
            <input
              type="checkbox"
              checked={opts.trimLines}
              onChange={(e) => setOpt("trimLines", e.target.checked)}
            />
            Trim whitespace
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
              : <><ArrowRight size={16} aria-hidden="true" className="mr-1" /> Convert Case</>
            }
          </button>
          <button className="btn-secondary" onClick={clearAll}>Clear All</button>
        </div>
      </section>

      {/* Features */}
      <section className="features" aria-label="Features">
        {[
          {
            icon: <Type size={24} />,
            title: "11 case formats",
            desc: "UPPER, lower, Title, Sentence, camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE, aLtErNaTiNg, and iNVERSE.",
          },
          {
            icon: <Lock size={24} />,
            title: "Fully private",
            desc: "Your text never leaves the browser. Safe for code, passwords, configs, or any sensitive content.",
          },
          {
            icon: <Settings2 size={24} />,
            title: "Flexible options",
            desc: "Preserve newlines for multi-line text, trim whitespace per line — all configurable before conversion.",
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