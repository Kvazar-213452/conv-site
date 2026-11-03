"use client";

import { useState, useCallback } from "react";
import {
  sortJson,
  EXAMPLE_INPUT,
  DEFAULT_OPTIONS,
  type SortOptions,
  type SortOrder,
} from "./utils";
import { ArrowDownAZ, Lock, Settings2 } from "lucide-react";

import "@/style/main.css";
import "@/style/bar.css";

export default function JsonSorter() {
  const [input, setInput] = useState(EXAMPLE_INPUT);
  const [output, setOutput] = useState("");
  const [opts, setOpts] = useState<SortOptions>(DEFAULT_OPTIONS);
  const [indent, setIndent] = useState(2);
  const [sorting, setSorting] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const sort = useCallback(() => {
    setError("");
    if (!input.trim()) { setOutput(""); return; }
    setSorting(true);
    setTimeout(() => {
      try {
        setOutput(sortJson(input, opts, indent));
      } catch (e) {
        setError((e as Error).message);
      }
      setSorting(false);
    }, 180);
  }, [input, opts, indent]);

  const loadExample = () => {
    setInput(EXAMPLE_INPUT);
    setOutput("");
    setError("");
  };

  const clearAll = () => { setInput(""); setOutput(""); setError(""); };

  const copyOutput = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const setOpt = <K extends keyof SortOptions>(key: K, val: SortOptions[K]) => {
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
          JSON Key <em>Sorter</em>
        </h1>
        <p>
          Sort JSON object keys alphabetically or in reverse order. Supports recursive
          deep sorting for nested objects. Runs 100% in your browser.
        </p>
      </section>

      {error && (
        <div className="error-bar" role="alert" aria-live="assertive">
          <span aria-hidden="true">✕</span>
          <span>Error: {error}</span>
        </div>
      )}

      <section aria-label="JSON Key Sorter">
        <div className="converter">
          {/* Input */}
          <div className={`panel${error ? " has-error" : ""}`}>
            <div className="panel-header">
              <div className="panel-title">
                <div className="dot json" aria-hidden="true" />
                JSON Input
              </div>
              <div className="panel-actions">
                <button className="btn-ghost" onClick={loadExample}>Example</button>
                <button className="btn-ghost" onClick={() => { setInput(""); setOutput(""); setError(""); }}>Clear</button>
              </div>
            </div>
            <textarea
              aria-label="JSON Input"
              placeholder='Paste your JSON here…'
              value={input}
              onChange={(e) => { setInput(e.target.value); setOutput(""); setError(""); }}
              spellCheck={false}
              autoCorrect="off"
              autoCapitalize="off"
            />
          </div>

          {/* Output */}
          <div className={`panel${output ? " has-output" : ""}`}>
            <div className="panel-header">
              <div className="panel-title">
                <div className="dot yaml" aria-hidden="true" />
                Sorted JSON
                {output && !sorting && (
                  <span className="success-tag">✓ sorted</span>
                )}
              </div>
              <div className="panel-actions">
                <button className="btn-ghost" onClick={copyOutput} disabled={!output}>
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>
            <pre
              className={`output-pre${!output && !sorting ? " empty" : ""}${sorting ? " loading" : ""}`}
              aria-live="polite"
            >
              {sorting ? "Sorting…" : output || "// Sorted JSON will appear here…"}
            </pre>
          </div>
        </div>

        {/* Options */}
        <div className="options-bar">
          <label>
            <Settings2 size={14} aria-hidden="true" />
            Options:
          </label>
          <label>
            Order:
            <select
              value={opts.order}
              onChange={(e) => setOpt("order", e.target.value as SortOrder)}
              style={{ marginLeft: 6, padding: "3px 8px", borderRadius: 6, border: "1px solid var(--color-border-bright)", background: "var(--color-surface)", color: "var(--color-text)", fontFamily: "'Geist Mono', monospace", fontSize: 12 }}
            >
              <option value="asc">A → Z</option>
              <option value="desc">Z → A</option>
            </select>
          </label>
          <label>
            <input
              type="checkbox"
              checked={opts.recursive}
              onChange={(e) => setOpt("recursive", e.target.checked)}
            />
            Recursive (deep sort)
          </label>
          <label>
            <input
              type="checkbox"
              checked={opts.sortArrays}
              onChange={(e) => setOpt("sortArrays", e.target.checked)}
            />
            Sort primitive arrays
          </label>
          <label>
            Indent:
            <select
              value={indent}
              onChange={(e) => { setIndent(Number(e.target.value)); setOutput(""); }}
              style={{ marginLeft: 6, padding: "3px 8px", borderRadius: 6, border: "1px solid var(--color-border-bright)", background: "var(--color-surface)", color: "var(--color-text)", fontFamily: "'Geist Mono', monospace", fontSize: 12 }}
            >
              <option value={2}>2 spaces</option>
              <option value={4}>4 spaces</option>
              <option value={8}>Tab (8)</option>
            </select>
          </label>
        </div>

        {/* Actions */}
        <div className="actions">
          <button className="btn-secondary" onClick={loadExample}>Load Example</button>
          <button
            className="btn-convert"
            onClick={sort}
            disabled={sorting || !input.trim()}
            aria-busy={sorting}
          >
            {sorting
              ? <><div className="btn-spinner" aria-hidden="true" /> Sorting…</>
              : <><ArrowDownAZ size={16} aria-hidden="true" className="mr-1" /> Sort Keys</>
            }
          </button>
          <button className="btn-secondary" onClick={clearAll}>Clear All</button>
        </div>
      </section>

      <section className="seo-content" aria-labelledby="about-heading">
        <h2 id="about-heading">About JSON Key Sorter Tool</h2>
        <p>
          This free online JSON key sorter tool lets you alphabetically sort all keys in a JSON object with a single click.
          Whether you need consistent key ordering for version control diffs, API response comparison, or code style
          enforcement, our tool handles nested objects, arrays, and all JSON data types while preserving values exactly.
          Everything runs 100% in your browser with no data uploaded anywhere.
        </p>

        <h3>Why Sort JSON Keys?</h3>
        <p>
          Unsorted JSON objects produce noisy diffs in version control when keys appear in different orders across commits.
          Sorting keys alphabetically makes JSON files deterministic — identical data always produces identical output.
          This is essential for configuration files (package.json, tsconfig.json), API contract testing, snapshot testing
          in Jest or Vitest, comparing database records, generating stable hashes, and maintaining readable codebases.
          Many linters and formatters (ESLint, Prettier, sort-package-json) enforce key ordering for exactly these reasons.
        </p>

        <h3>How to Use This JSON Sorter</h3>
        <p>
          Paste your JSON into the input panel and click "Sort Keys." The tool parses the JSON, recursively sorts all
          object keys in alphabetical (A→Z) or reverse (Z→A) order, and outputs the result with your chosen indentation.
          Toggle "Recursive" to sort only top-level keys, or enable "Sort primitive arrays" to also sort arrays of
          strings and numbers. The output preserves all values, types, and array element order (unless you enable array
          sorting). Copy the result with one click.
        </p>

        <h3>Key Benefits</h3>
        <ul>
          <li><strong>Deterministic output:</strong> Same data always produces the same JSON string, perfect for diffs and hashing</li>
          <li><strong>Deep recursive sorting:</strong> Sorts keys at every nesting level, not just the top</li>
          <li><strong>Configurable direction:</strong> Alphabetical (A→Z) or reverse (Z→A) ordering</li>
          <li><strong>Array sorting option:</strong> Optionally sort arrays of primitive values (strings, numbers)</li>
          <li><strong>Value preservation:</strong> All values, types, arrays, and nulls remain exactly as they were</li>
          <li><strong>Configurable indentation:</strong> Choose 2 spaces, 4 spaces, or tab indentation for output</li>
          <li><strong>Completely private:</strong> Your JSON never leaves your browser — safe for secrets and credentials</li>
          <li><strong>No installation:</strong> Works instantly in any modern browser without plugins or sign-ups</li>
        </ul>

        <h3>Common Use Cases</h3>
        <p>
          Developers sort JSON keys for clean git diffs in package.json, tsconfig.json, and other config files. QA engineers
          use sorted JSON to compare API responses deterministically. DevOps teams normalize Terraform state files and
          Kubernetes manifests. Frontend developers sort component prop types and theme tokens for consistency. Database
          administrators compare JSON columns across records. Security teams generate stable hashes of JSON payloads for
          integrity verification. Technical writers maintain consistent documentation examples.
        </p>

        <h3>Technical Features</h3>
        <p>
          The sorter uses JavaScript's localeCompare for culturally-aware key ordering, handles deeply nested objects
          and arrays of any depth, preserves null, boolean, number, and string values exactly, supports both standard
          and minified JSON input, produces clean formatted output with configurable indentation, handles large JSON
          documents efficiently, and validates input syntax before sorting with clear error messages for malformed JSON.
        </p>

        <h3>Privacy and Security</h3>
        <p>
          All JSON sorting happens locally in your browser using JavaScript. Your configuration files, API responses,
          database records, secrets, and any other JSON data never leave your computer. No cookies, no tracking, no
          server communication. Safe for production data, credentials, and confidential information.
        </p>
      </section>

      <section className="features" aria-label="Features">
        {[
          {
            icon: <ArrowDownAZ size={24} />,
            title: "Alphabetical sorting",
            desc: "Sort all object keys A→Z or Z→A with recursive deep sorting for nested structures.",
          },
          {
            icon: <Lock size={24} />,
            title: "Fully private",
            desc: "Your JSON never leaves the browser. Safe for config files, secrets, and production data.",
          },
          {
            icon: <Settings2 size={24} />,
            title: "Configurable options",
            desc: "Choose sort direction, toggle recursion, enable array sorting, and pick your indentation style.",
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
