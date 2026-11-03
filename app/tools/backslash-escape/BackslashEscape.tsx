"use client";

import { useState, useCallback } from "react";
import {
  escapeString,
  unescapeString,
  MODE_LABELS,
  EXAMPLE_INPUTS,
  type EscapeMode,
} from "./utils";
import { Shield, Lock, Settings2 } from "lucide-react";

import "@/style/main.css";
import "@/style/bar.css";

export default function BackslashEscape() {
  const [input, setInput] = useState(EXAMPLE_INPUTS.json);
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<EscapeMode>("json");
  const [direction, setDirection] = useState<"escape" | "unescape">("escape");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const convert = useCallback(() => {
    setError("");
    if (!input.trim()) { setOutput(""); return; }
    setProcessing(true);
    setTimeout(() => {
      try {
        const fn = direction === "escape" ? escapeString : unescapeString;
        setOutput(fn(input, mode));
      } catch (e) {
        setError((e as Error).message);
      }
      setProcessing(false);
    }, 180);
  }, [input, mode, direction]);

  const loadExample = () => {
    setInput(EXAMPLE_INPUTS[mode]);
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

  return (
    <>
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-eyebrow">
          <div className="hero-dot" aria-hidden="true" />
          Free · No sign-up · Runs in browser
        </div>
        <h1 id="hero-heading">
          Backslash <em>Escape</em>
        </h1>
        <p>
          Escape and unescape strings for JSON, JavaScript, Python, HTML, and URLs.
          Handle special characters safely. Runs 100% in your browser.
        </p>
      </section>

      {error && (
        <div className="error-bar" role="alert" aria-live="assertive">
          <span aria-hidden="true">✕</span>
          <span>Error: {error}</span>
        </div>
      )}

      <section aria-label="Backslash Escape/Unescape">
        <div className="converter">
          {/* Input */}
          <div className={`panel${error ? " has-error" : ""}`}>
            <div className="panel-header">
              <div className="panel-title">
                <div className="dot json" aria-hidden="true" />
                {direction === "escape" ? "Raw Text" : "Escaped Text"}
              </div>
              <div className="panel-actions">
                <button className="btn-ghost" onClick={loadExample}>Example</button>
                <button className="btn-ghost" onClick={() => { setInput(""); setOutput(""); setError(""); }}>Clear</button>
              </div>
            </div>
            <textarea
              aria-label="Input text"
              placeholder={direction === "escape" ? "Paste raw text to escape…" : "Paste escaped text to unescape…"}
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
                {direction === "escape" ? "Escaped" : "Unescaped"}
                {output && !processing && (
                  <span className="success-tag">✓ done</span>
                )}
              </div>
              <div className="panel-actions">
                <button className="btn-ghost" onClick={copyOutput} disabled={!output}>
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>
            <pre
              className={`output-pre${!output && !processing ? " empty" : ""}${processing ? " loading" : ""}`}
              aria-live="polite"
            >
              {processing ? "Processing…" : output || "// Result will appear here…"}
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
            Mode:
            <select
              value={mode}
              onChange={(e) => { setMode(e.target.value as EscapeMode); setOutput(""); }}
              style={{ marginLeft: 6, padding: "3px 8px", borderRadius: 6, border: "1px solid var(--color-border-bright)", background: "var(--color-surface)", color: "var(--color-text)", fontFamily: "'Geist Mono', monospace", fontSize: 12 }}
            >
              {(Object.keys(MODE_LABELS) as EscapeMode[]).map((m) => (
                <option key={m} value={m}>{MODE_LABELS[m]}</option>
              ))}
            </select>
          </label>
          <label>
            Direction:
            <select
              value={direction}
              onChange={(e) => { setDirection(e.target.value as "escape" | "unescape"); setOutput(""); }}
              style={{ marginLeft: 6, padding: "3px 8px", borderRadius: 6, border: "1px solid var(--color-border-bright)", background: "var(--color-surface)", color: "var(--color-text)", fontFamily: "'Geist Mono', monospace", fontSize: 12 }}
            >
              <option value="escape">Escape</option>
              <option value="unescape">Unescape</option>
            </select>
          </label>
        </div>

        {/* Actions */}
        <div className="actions">
          <button className="btn-secondary" onClick={loadExample}>Load Example</button>
          <button
            className="btn-convert"
            onClick={convert}
            disabled={processing || !input.trim()}
            aria-busy={processing}
          >
            {processing
              ? <><div className="btn-spinner" aria-hidden="true" /> Processing…</>
              : <><Shield size={16} aria-hidden="true" className="mr-1" /> {direction === "escape" ? "Escape" : "Unescape"}</>
            }
          </button>
          <button className="btn-secondary" onClick={clearAll}>Clear All</button>
        </div>
      </section>

      <section className="seo-content" aria-labelledby="about-heading">
        <h2 id="about-heading">About Backslash Escape/Unescape Tool</h2>
        <p>
          This free online string escaper tool handles escape sequences for five common formats: JSON, JavaScript, Python,
          HTML, and URL encoding. Whether you need to embed a string in a JSON payload, escape user input for safe HTML
          rendering, or encode query parameters in a URL, this tool converts special characters to their escaped equivalents
          and reverses the process. All processing happens in your browser — your strings are never uploaded.
        </p>

        <h3>Why Escape Strings?</h3>
        <p>
          String escaping is fundamental to secure and correct programming. Unescaped quotes break JSON parsing and cause
          syntax errors. Unescaped HTML characters enable cross-site scripting (XSS) attacks. Unescaped URL characters
          corrupt query strings and break API requests. Backslash sequences (\n, \t, \\) must be handled correctly when
          embedding strings in source code, configuration files, log parsers, and data pipelines. Manual escaping is
          error-prone — a single missed backslash can cause hard-to-debug issues in production.
        </p>

        <h3>How to Use This Tool</h3>
        <p>
          Select your target format (JSON, JavaScript, Python, HTML, or URL), choose "Escape" or "Unescape" direction,
          paste your text, and click the action button. The tool converts all special characters according to the selected
          format's rules: backslash sequences for JSON/JS/Python, HTML entities for HTML, and percent-encoding for URLs.
          Copy the result with one click and paste it directly into your code, config file, or API request.
        </p>

        <h3>Key Benefits</h3>
        <ul>
          <li><strong>Five formats:</strong> JSON, JavaScript, Python, HTML entities, and URL percent-encoding</li>
          <li><strong>Bidirectional:</strong> Both escape and unescape in every format</li>
          <li><strong>Correct handling:</strong> Handles newlines, tabs, quotes, backslashes, null bytes, and Unicode</li>
          <li><strong>XSS prevention:</strong> HTML mode escapes all dangerous characters for safe rendering</li>
          <li><strong>URL-safe output:</strong> URL mode uses standard percent-encoding for query parameters</li>
          <li><strong>Instant results:</strong> No round-trips — everything runs locally in your browser</li>
          <li><strong>Copy-paste ready:</strong> Output is ready to embed directly in your code</li>
          <li><strong>Completely private:</strong> Your strings never leave your device</li>
        </ul>

        <h3>Common Use Cases</h3>
        <p>
          Backend developers escape strings for JSON API payloads, database queries, and log messages. Frontend developers
          escape user input for safe HTML rendering and prevent XSS vulnerabilities. DevOps engineers escape strings in
          YAML configs, shell scripts, and CI/CD pipeline variables. QA engineers prepare test data with special characters.
          Security researchers test escape handling in web applications. Data engineers escape strings in ETL pipelines
          and CSV/JSON transformations.
        </p>

        <h3>Supported Escape Formats</h3>
        <p>
          JSON mode handles double quotes, backslashes, and control characters (newline \n, tab \t, carriage return \r,
          backspace \b, form feed \f) per RFC 8259. JavaScript mode adds single quotes, backticks, and null byte escaping.
          Python mode covers single quotes, double quotes, null bytes, and escape sequences. HTML mode converts ampersands,
          angle brackets, quotes, and apostrophes to named entities (&amp;, &lt;, &gt;, &quot;, &#39;). URL mode uses
          encodeURIComponent for full percent-encoding of all special characters.
        </p>

        <h3>Privacy and Security</h3>
        <p>
          All escaping and unescaping happens locally in your browser using JavaScript. Your strings, API keys, passwords,
          configuration values, and sensitive data never leave your computer. No cookies, no tracking, no server uploads.
          Safe for production secrets, authentication tokens, and confidential content.
        </p>
      </section>

      <section className="features" aria-label="Features">
        {[
          {
            icon: <Shield size={24} />,
            title: "Multi-format escaping",
            desc: "JSON, JavaScript, Python, HTML entities, and URL encoding — all in one tool with correct handling.",
          },
          {
            icon: <Lock size={24} />,
            title: "Fully private",
            desc: "Your strings never leave the browser. Safe for API keys, passwords, and production data.",
          },
          {
            icon: <Settings2 size={24} />,
            title: "Bidirectional",
            desc: "Escape and unescape in every format. Switch direction with a single dropdown.",
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
