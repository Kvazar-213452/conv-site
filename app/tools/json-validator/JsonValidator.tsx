"use client";

import { useState, useCallback } from "react";
import { validateJson, EXAMPLE_VALID, EXAMPLE_INVALID } from "./utils";
import type { ValidationResult } from "./utils";
import { CheckCircle, Lock, AlertTriangle } from "lucide-react";

import "@/style/main.css";

export default function JsonValidator() {
  const [input, setInput] = useState(EXAMPLE_VALID);
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [validating, setValidating] = useState(false);

  const validate = useCallback(() => {
    if (!input.trim()) { setResult(null); return; }
    setValidating(true);
    setTimeout(() => {
      setResult(validateJson(input));
      setValidating(false);
    }, 180);
  }, [input]);

  const loadValid = () => { setInput(EXAMPLE_VALID); setResult(null); };
  const loadInvalid = () => { setInput(EXAMPLE_INVALID); setResult(null); };
  const clearAll = () => { setInput(""); setResult(null); };

  return (
    <>
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-eyebrow">
          <div className="hero-dot" aria-hidden="true" />
          Free · No sign-up · Runs in browser
        </div>
        <h1 id="hero-heading">
          JSON <em>Validator</em>
        </h1>
        <p>
          Validate JSON syntax instantly with detailed error messages and structure
          statistics. Check keys, arrays, nesting depth, and data types.
        </p>
      </section>

      <section aria-label="JSON Validator">
        <div className={`panel panel--full${result && !result.valid ? " has-error" : ""}${result?.valid ? " has-output" : ""}`}>
          <div className="panel-header">
            <div className="panel-title">
              <div className="dot json" aria-hidden="true" />
              JSON Input
              {result?.valid && <span className="success-tag">✓ Valid JSON</span>}
              {result && !result.valid && (
                <span style={{ color: "var(--color-error)", fontSize: 11, fontFamily: "'Geist Mono', monospace" }}>✕ Invalid</span>
              )}
            </div>
            <div className="panel-actions">
              <button className="btn-ghost" onClick={loadValid}>Valid example</button>
              <button className="btn-ghost" onClick={loadInvalid}>Invalid example</button>
              <button className="btn-ghost" onClick={clearAll}>Clear</button>
            </div>
          </div>
          <textarea
            aria-label="JSON Input"
            placeholder="Paste your JSON here to validate…"
            value={input}
            onChange={(e) => { setInput(e.target.value); setResult(null); }}
            spellCheck={false}
            autoCorrect="off"
            autoCapitalize="off"
            style={{ minHeight: 280 }}
          />
        </div>

        <div className="actions">
          <button className="btn-secondary" onClick={loadValid}>Load Valid</button>
          <button
            className="btn-convert"
            onClick={validate}
            disabled={validating || !input.trim()}
            aria-busy={validating}
          >
            {validating
              ? <><div className="btn-spinner" aria-hidden="true" /> Validating…</>
              : <><CheckCircle size={16} aria-hidden="true" className="mr-1" /> Validate JSON</>
            }
          </button>
          <button className="btn-secondary" onClick={clearAll}>Clear All</button>
        </div>

        {result && (
          <div style={{ marginTop: 24 }} aria-live="polite">
            {!result.valid && (
              <div className="error-bar" role="alert" aria-live="assertive">
                <span aria-hidden="true">✕</span>
                <span>{result.error}</span>
              </div>
            )}

            {result.valid && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 12 }}>
                {[
                  { label: "Keys", value: result.stats.keys },
                  { label: "Objects", value: result.stats.objects },
                  { label: "Arrays", value: result.stats.arrays },
                  { label: "Strings", value: result.stats.strings },
                  { label: "Numbers", value: result.stats.numbers },
                  { label: "Booleans", value: result.stats.booleans },
                  { label: "Nulls", value: result.stats.nulls },
                  { label: "Max depth", value: result.stats.depth },
                  { label: "Size", value: `${result.stats.bytes} B` },
                ].map(({ label, value }) => (
                  <div key={label} style={{ padding: "16px 12px", borderRadius: 10, border: "1px solid var(--color-border)", background: "var(--color-surface)", textAlign: "center" }}>
                    <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--color-text)", fontVariantNumeric: "tabular-nums" }}>{value}</div>
                    <div style={{ fontSize: "0.7rem", fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--color-text-muted)" }}>{label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      <section className="seo-content" aria-labelledby="about-heading">
        <h2 id="about-heading">About JSON Validator Tool</h2>
        <p>
          This free online JSON validator checks your JSON syntax instantly and provides detailed error messages when
          parsing fails. Beyond simple validation, it analyzes your JSON structure — counting keys, objects, arrays,
          strings, numbers, booleans, nulls, nesting depth, and byte size. Whether you're debugging API responses,
          checking configuration files, or verifying data exports, our validator gives you comprehensive feedback in
          milliseconds. Everything runs 100% in your browser.
        </p>

        <h3>Why Validate JSON?</h3>
        <p>
          Invalid JSON breaks API integrations, crashes parsers, and causes silent data loss. Common mistakes include
          trailing commas (forbidden in JSON but allowed in JavaScript), single quotes instead of double quotes,
          unescaped special characters in strings, missing commas between elements, and unquoted keys. These errors
          can be hard to spot in large payloads. A dedicated validator catches them instantly with precise error
          locations, saving debugging time and preventing production incidents.
        </p>

        <h3>How to Use This Validator</h3>
        <p>
          Paste your JSON into the input area and click "Validate JSON." If the JSON is valid, you'll see a green
          confirmation with detailed statistics about the structure. If invalid, you'll see the exact error message
          from the JSON parser with information about where parsing failed. Use the "Invalid example" button to see
          how error reporting works with a common mistake (trailing commas).
        </p>

        <h3>Key Benefits</h3>
        <ul>
          <li><strong>Instant validation:</strong> Parse and check JSON syntax in milliseconds</li>
          <li><strong>Detailed error messages:</strong> Exact parser error text with position information</li>
          <li><strong>Structure statistics:</strong> Count keys, objects, arrays, types, depth, and byte size</li>
          <li><strong>Common error detection:</strong> Catches trailing commas, missing quotes, and syntax errors</li>
          <li><strong>Large file support:</strong> Handles big JSON payloads efficiently in the browser</li>
          <li><strong>Completely private:</strong> Your JSON never leaves your device</li>
          <li><strong>No installation:</strong> Works instantly in any modern browser</li>
          <li><strong>No sign-up required:</strong> Free forever with no account needed</li>
        </ul>

        <h3>Common Use Cases</h3>
        <p>
          Backend developers validate API responses before integrating with frontend code. Frontend developers check
          JSON payloads from fetch/axios calls. DevOps engineers verify configuration files (package.json, tsconfig.json,
          Terraform state). Database administrators validate JSON columns and exports. QA engineers check test fixture
          data. Technical writers validate JSON examples in documentation. Data engineers verify ETL pipeline outputs.
        </p>

        <h3>Privacy and Security</h3>
        <p>
          All validation happens locally in your browser using JavaScript's built-in JSON.parse. Your API responses,
          configuration files, database exports, secrets, and any other JSON data never leave your computer. No cookies,
          no tracking, no server communication. Safe for production data and confidential information.
        </p>
      </section>

      <section className="features" aria-label="Features">
        {[
          {
            icon: <CheckCircle size={24} />,
            title: "Instant validation",
            desc: "Parse and validate JSON syntax in milliseconds with detailed error messages and position info.",
          },
          {
            icon: <Lock size={24} />,
            title: "Fully private",
            desc: "Your JSON never leaves the browser. Safe for API responses, configs, and production data.",
          },
          {
            icon: <AlertTriangle size={24} />,
            title: "Structure analysis",
            desc: "Count keys, objects, arrays, types, nesting depth, and byte size for comprehensive JSON inspection.",
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
