"use client";

import { useState, useCallback } from "react";
import { Binary, Lock, Zap, ArrowRight } from "lucide-react";
import { convertAll, BASES, type Base } from "./utils";

import "@/style/main.css";
import "./main.css";

const EXAMPLES: Record<Base, string> = {
  2:  "101010",
  8:  "52",
  10: "42",
  16: "2A",
};

export default function NumberBaseConverter() {
  const [from, setFrom] = useState<Base>(10);
  const [input, setInput] = useState(EXAMPLES[10]);
  const [result, setResult] = useState<Record<Base, string> | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");
  const [converting, setConverting] = useState(false);

  const convert = useCallback(() => {
    setError("");
    setResult(null);
    if (!input.trim()) return;
    setConverting(true);
    setTimeout(() => {
      try {
        setResult(convertAll(input, from));
      } catch (e) {
        setError((e as Error).message);
      }
      setConverting(false);
    }, 180);
  }, [input, from]);

  const switchFrom = (next: Base) => {
    setFrom(next);
    setInput(EXAMPLES[next]);
    setResult(null);
    setError("");
  };

  const copyValue = (key: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopied(key);
    setTimeout(() => setCopied(""), 2000);
  };

  const loadExample = () => { setInput(EXAMPLES[from]); setResult(null); setError(""); };
  const clearAll   = () => { setInput(""); setResult(null); setError(""); };

  return (
    <>
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-eyebrow">
          <div className="hero-dot" aria-hidden="true" />
          Free · No sign-up · Runs in browser
        </div>
        <h1 id="hero-heading">
          Number Base <em>Converter</em>
        </h1>
        <p>
          Convert integers between binary, octal, decimal, and hexadecimal using arbitrary-precision
          BigInt arithmetic. Signed numbers and 0b/0o/0x prefixes supported. Runs entirely in your browser.
        </p>

        <div className="mode-toggle" role="group" aria-label="Input base">
          {BASES.map(({ value, label }) => (
            <button
              key={value}
              className={`mode-btn${from === value ? " active" : ""}`}
              onClick={() => switchFrom(value)}
            >
              {label} ({value})
            </button>
          ))}
        </div>
      </section>

      {error && (
        <div className="error-bar" role="alert" aria-live="assertive">
          <span aria-hidden="true">✕</span>
          <span>Parse Error: {error}</span>
        </div>
      )}

      <section aria-label="Number Base Converter">
        <div className="converter">

          <div className={`panel${error ? " has-error" : ""}`}>
            <div className="panel-header">
              <div className="panel-title">
                <div className="dot json" aria-hidden="true" />
                Base-{from} Input
              </div>
              <div className="panel-actions">
                <button className="btn-ghost" onClick={loadExample}>Example</button>
                <button className="btn-ghost" onClick={() => { setInput(""); setError(""); }}>Clear</button>
              </div>
            </div>
            <textarea
              aria-label={`Base-${from} input`}
              placeholder={`e.g. ${EXAMPLES[from]}`}
              value={input}
              onChange={(e) => { setInput(e.target.value); setError(""); }}
              spellCheck={false} autoCorrect="off" autoCapitalize="off"
            />
          </div>

          <div className={`panel${result ? " has-output" : ""}`}>
            <div className="panel-header">
              <div className="panel-title">
                <div className="dot yaml" aria-hidden="true" />
                Converted
                {result && !converting && <span className="success-tag">✓ converted</span>}
              </div>
            </div>

            {converting && (
              <pre className="output-pre loading" aria-live="polite">// Converting…</pre>
            )}
            {!converting && !result && (
              <pre className="output-pre empty" aria-live="polite">
                {`// Converted values will appear here…`}
              </pre>
            )}
            {!converting && result && (
              <div className="nb-list" aria-live="polite">
                {BASES.map(({ value, label, prefix }) => (
                  <div className="nb-row" key={value}>
                    <div className="nb-row-head">
                      <span className="nb-label">{label} (base {value})</span>
                      <button className="btn-ghost" onClick={() => copyValue(label, result[value])}>
                        {copied === label ? "✓ Copied!" : "Copy"}
                      </button>
                    </div>
                    <code className="nb-value">
                      {prefix && <span className="nb-prefix">{prefix}</span>}
                      {result[value]}
                    </code>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        <div className="actions">
          <button className="btn-secondary" onClick={loadExample}>Load Example</button>
          <button
            className="btn-convert"
            onClick={convert}
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
        <h2 id="about-heading">About Number Base Converter</h2>
        <p>
          This free online number base converter translates integers between the four most common
          numeric bases — binary (base 2), octal (base 8), decimal (base 10), and hexadecimal
          (base 16). Powered by JavaScript's <code>BigInt</code>, it handles arbitrarily large
          numbers without loss of precision. Accepts <code>0b</code>, <code>0o</code>, and
          <code>0x</code> prefixes and allows underscores as digit separators.
        </p>

        <h3>Common Use Cases</h3>
        <p>
          Reading bitmasks and flag enums, decoding packed binary protocols, inspecting
          hex-encoded identifiers (object IDs, color codes, memory addresses), auditing low-level
          encodings, and teaching introductory computer science concepts.
        </p>

        <h3>Key Benefits</h3>
        <ul>
          <li><strong>Arbitrary precision:</strong> Uses BigInt — safe for numbers beyond 2⁵³</li>
          <li><strong>Signed support:</strong> Negative integers handled transparently</li>
          <li><strong>Prefix aware:</strong> Accepts 0b, 0o, 0x and strips underscores</li>
          <li><strong>Four bases:</strong> Convert once, see all four results</li>
          <li><strong>Fully private:</strong> Everything runs locally — no network calls</li>
        </ul>
      </section>

      <section className="features" aria-label="Features">
        {[
          {
            icon: <Zap size={24} />,
            title: "Instant conversion",
            desc: "All four bases computed from a single input in milliseconds.",
          },
          {
            icon: <Lock size={24} />,
            title: "Fully private",
            desc: "Everything runs locally — safe for sensitive identifiers and bitmasks.",
          },
          {
            icon: <Binary size={24} />,
            title: "BigInt precision",
            desc: "Convert integers of any size without the usual 2⁵³ JavaScript limit.",
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
