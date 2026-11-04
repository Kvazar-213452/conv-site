"use client";

import { useState, useCallback } from "react";
import { htmlToJsx, jsxToHtml, EXAMPLE_HTML, EXAMPLE_JSX } from "./utils";
import { Code2, Lock, ArrowLeftRight } from "lucide-react";

import "@/style/main.css";

export default function HtmlToJsx() {
  const [input, setInput] = useState(EXAMPLE_HTML);
  const [output, setOutput] = useState("");
  const [direction, setDirection] = useState<"toJsx" | "toHtml">("toJsx");
  const [converting, setConverting] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const convert = useCallback(() => {
    setError("");
    if (!input.trim()) { setOutput(""); return; }
    setConverting(true);
    setTimeout(() => {
      try {
        setOutput(direction === "toJsx" ? htmlToJsx(input) : jsxToHtml(input));
      } catch (e) {
        setError((e as Error).message);
      }
      setConverting(false);
    }, 180);
  }, [input, direction]);

  const loadExample = () => {
    setInput(direction === "toJsx" ? EXAMPLE_HTML : EXAMPLE_JSX);
    setOutput(""); setError("");
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
          HTML to <em>JSX</em>
        </h1>
        <p>
          Convert HTML to React JSX — class to className, style strings to objects,
          self-closing tags, and HTML comments to JSX. Bidirectional.
        </p>
      </section>

      {error && (
        <div className="error-bar" role="alert" aria-live="assertive">
          <span aria-hidden="true">✕</span>
          <span>Error: {error}</span>
        </div>
      )}

      <section aria-label="HTML to JSX Converter">
        <div className="mode-toggle">
          <button className={`mode-btn${direction === "toJsx" ? " active" : ""}`} onClick={() => { setDirection("toJsx"); setOutput(""); }}>HTML → JSX</button>
          <button className={`mode-btn${direction === "toHtml" ? " active" : ""}`} onClick={() => { setDirection("toHtml"); setOutput(""); }}>JSX → HTML</button>
        </div>

        <div className="converter" style={{ marginTop: 16 }}>
          <div className={`panel${error ? " has-error" : ""}`}>
            <div className="panel-header">
              <div className="panel-title">
                <div className="dot json" aria-hidden="true" />
                {direction === "toJsx" ? "HTML Input" : "JSX Input"}
              </div>
              <div className="panel-actions">
                <button className="btn-ghost" onClick={loadExample}>Example</button>
                <button className="btn-ghost" onClick={() => { setInput(""); setOutput(""); setError(""); }}>Clear</button>
              </div>
            </div>
            <textarea
              aria-label={direction === "toJsx" ? "HTML input" : "JSX input"}
              placeholder={direction === "toJsx" ? "Paste HTML here…" : "Paste JSX here…"}
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
                <div className="dot yaml" aria-hidden="true" />
                {direction === "toJsx" ? "JSX Output" : "HTML Output"}
                {output && !converting && <span className="success-tag">✓ converted</span>}
              </div>
              <div className="panel-actions">
                <button className="btn-ghost" onClick={copyOutput} disabled={!output}>
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>
            <pre className={`output-pre${!output && !converting ? " empty" : ""}${converting ? " loading" : ""}`} aria-live="polite">
              {converting ? "Converting…" : output || "// Result will appear here…"}
            </pre>
          </div>
        </div>

        <div className="actions">
          <button className="btn-secondary" onClick={loadExample}>Load Example</button>
          <button className="btn-convert" onClick={convert} disabled={converting || !input.trim()} aria-busy={converting}>
            {converting
              ? <><div className="btn-spinner" aria-hidden="true" /> Converting…</>
              : <><Code2 size={16} aria-hidden="true" className="mr-1" /> Convert</>
            }
          </button>
          <button className="btn-secondary" onClick={clearAll}>Clear All</button>
        </div>
      </section>

      <section className="seo-content" aria-labelledby="about-heading">
        <h2 id="about-heading">About HTML to JSX Converter Tool</h2>
        <p>
          This free online HTML to JSX converter transforms standard HTML into valid React JSX syntax and vice versa.
          It handles all the common conversions that trip up React developers: class to className, for to htmlFor,
          inline style strings to JavaScript objects, self-closing tags (img, br, input, hr), HTML comments to JSX
          comments, and 20+ attribute name mappings. Perfect for migrating HTML templates to React components.
        </p>

        <h3>Why Convert HTML to JSX?</h3>
        <p>
          React uses JSX instead of raw HTML, and the differences cause frequent errors: "class" is a reserved word in
          JavaScript (use "className"), "for" conflicts with loops (use "htmlFor"), style attributes must be objects
          with camelCase properties instead of strings, void elements need self-closing slashes, and HTML comments
          use a different syntax. Manually fixing these across a large HTML template is tedious and error-prone. This
          converter handles all transformations instantly.
        </p>

        <h3>Key Benefits</h3>
        <ul>
          <li><strong>Attribute mapping:</strong> class → className, for → htmlFor, tabindex → tabIndex, and 20+ more</li>
          <li><strong>Style conversion:</strong> Inline style strings become JSX style objects with camelCase properties</li>
          <li><strong>Self-closing tags:</strong> img, br, input, hr, meta, link get proper JSX self-closing syntax</li>
          <li><strong>Comment conversion:</strong> HTML comments become JSX {/* */} comments and back</li>
          <li><strong>Bidirectional:</strong> Convert HTML to JSX and JSX back to HTML</li>
          <li><strong>Completely private:</strong> Your HTML/JSX code never leaves your browser</li>
        </ul>

        <h3>Common Use Cases</h3>
        <p>
          React developers converting HTML templates from designers into JSX components. Next.js and Gatsby developers
          migrating static HTML pages. Teams porting jQuery or vanilla JS projects to React. Developers copying HTML
          from CodePen, StackOverflow, or documentation into React projects. Email template developers moving between
          HTML and React Email components. UI library maintainers converting HTML examples to React code.
        </p>

        <h3>Privacy and Security</h3>
        <p>
          All conversion runs locally in your browser using regex-based text transformations. Your HTML templates,
          component code, and markup never leave your computer. No server uploads, no cookies, no tracking. Safe for
          proprietary code and confidential projects.
        </p>
      </section>

      <section className="features" aria-label="Features">
        {[
          { icon: <Code2 size={24} />, title: "Smart conversion", desc: "Handles className, htmlFor, style objects, self-closing tags, and 20+ attribute mappings." },
          { icon: <Lock size={24} />, title: "Fully private", desc: "Your code never leaves the browser. Safe for proprietary templates and components." },
          { icon: <ArrowLeftRight size={24} />, title: "Bidirectional", desc: "Convert HTML to JSX and JSX back to HTML with a single toggle." },
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
