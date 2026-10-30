"use client";

import { useState, useCallback } from "react";
import { Code2, Shield, Lock, ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { encodeHtml, decodeHtml, type EncodeMode } from "./utils";

import "@/style/main.css";
import "@/style/bar.css";

type Mode = "encode" | "decode";

const EXAMPLE_PLAIN = `<p class="warn">5 < 7 & "quotes" aren't safe</p>
Price: 25 € · ©2026 Acme — all rights reserved.`;

const EXAMPLE_ENCODED = `&lt;p class=&quot;warn&quot;&gt;5 &lt; 7 &amp; &quot;quotes&quot; aren&#39;t safe&lt;/p&gt;
Price: 25 &euro; &middot; &copy;2026 Acme &mdash; all rights reserved.`;

export default function HtmlEntityEncoder() {
  const [mode, setMode] = useState<Mode>("encode");
  const [encodeMode, setEncodeMode] = useState<EncodeMode>("named");
  const [input, setInput] = useState(EXAMPLE_PLAIN);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [running, setRunning] = useState(false);

  const isEncode = mode === "encode";

  const switchMode = (next: Mode) => {
    setMode(next);
    setInput(next === "encode" ? EXAMPLE_PLAIN : EXAMPLE_ENCODED);
    setOutput("");
    setError("");
  };

  const swapWithOutput = () => {
    if (!output) return;
    const next: Mode = isEncode ? "decode" : "encode";
    setMode(next);
    setInput(output);
    setOutput("");
    setError("");
  };

  const run = useCallback(() => {
    setError("");
    setOutput("");
    setRunning(true);
    setTimeout(() => {
      try {
        setOutput(isEncode ? encodeHtml(input, encodeMode) : decodeHtml(input));
      } catch (e) {
        setError((e as Error).message);
      }
      setRunning(false);
    }, 220);
  }, [input, isEncode, encodeMode]);

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const loadExample = () => {
    setInput(isEncode ? EXAMPLE_PLAIN : EXAMPLE_ENCODED);
    setOutput("");
    setError("");
  };
  const clearAll = () => { setInput(""); setOutput(""); setError(""); };

  return (
    <>
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-eyebrow">
          <div className="hero-dot" aria-hidden="true" />
          Free · No sign-up · Runs in browser
        </div>
        <h1 id="hero-heading">
          HTML Entity <em>{isEncode ? "Encoder" : "Decoder"}</em>
        </h1>
        <p>
          {isEncode
            ? "Escape &, <, >, quotes, and non-ASCII characters as HTML entities — named, numeric, or hex. Essential for safe HTML rendering and XSS prevention."
            : "Decode any HTML-entity-encoded string back to its original text. Supports named (&amp;, &copy;), numeric (&#38;), and hex (&#x26;) entities."}
          {" "}Runs 100% in your browser.
        </p>

        <div className="mode-toggle" role="group" aria-label="Direction">
          <button className={`mode-btn${isEncode ? " active" : ""}`} onClick={() => switchMode("encode")}>
            Encode
          </button>
          <button
            className="mode-swap-btn"
            onClick={() => (output ? swapWithOutput() : switchMode(isEncode ? "decode" : "encode"))}
            title={output ? "Move output to input & flip" : "Flip direction"}
            aria-label="Swap"
          >
            ⇄
          </button>
          <button className={`mode-btn${!isEncode ? " active" : ""}`} onClick={() => switchMode("decode")}>
            Decode
          </button>
        </div>
      </section>

      {error && (
        <div className="error-bar" role="alert" aria-live="assertive">
          <span aria-hidden="true">✕</span>
          <span>Error: {error}</span>
        </div>
      )}

      <section aria-label="HTML Entity Encoder">
        <div className="converter">
          <div className={`panel${error ? " has-error" : ""}`}>
            <div className="panel-header">
              <div className="panel-title">
                <div className="dot json" aria-hidden="true" />
                {isEncode ? "Plain text" : "Encoded HTML"}
              </div>
              <div className="panel-actions">
                <button className="btn-ghost" onClick={loadExample}>Example</button>
                <button className="btn-ghost" onClick={() => { setInput(""); setError(""); }}>Clear</button>
              </div>
            </div>
            <textarea
              aria-label={isEncode ? "Plain text" : "Encoded HTML"}
              placeholder={isEncode ? "Paste text to encode…" : "Paste HTML-encoded text…"}
              value={input}
              onChange={(e) => { setInput(e.target.value); setError(""); }}
              spellCheck={false} autoCorrect="off" autoCapitalize="off"
            />
          </div>

          <div className={`panel${output ? " has-output" : ""}`}>
            <div className="panel-header">
              <div className="panel-title">
                <div className="dot yaml" aria-hidden="true" />
                {isEncode ? "HTML entities" : "Decoded text"}
                {output && !running && <span className="success-tag">✓ {isEncode ? "encoded" : "decoded"}</span>}
              </div>
              {output && !running && (
                <div className="panel-actions">
                  <button className="btn-ghost" onClick={copyOutput}>
                    {copied ? "✓ Copied!" : "Copy"}
                  </button>
                  <button className="btn-ghost" onClick={swapWithOutput} title="Use output as new input">
                    ⇄ Swap
                  </button>
                </div>
              )}
            </div>
            <pre
              className={`output-pre${output && !running ? "" : " empty"}${running ? " loading" : ""}`}
              aria-live="polite"
            >
              {running ? "// Converting…" : (output || `// ${isEncode ? "Encoded" : "Decoded"} output will appear here…`)}
            </pre>
          </div>
        </div>

        {isEncode && (
          <div className="options-bar">
            <label>
              Encoding:
              <select
                value={encodeMode}
                onChange={(e) => setEncodeMode(e.target.value as EncodeMode)}
              >
                <option value="named">Named (recommended)</option>
                <option value="numeric">Decimal (&amp;#38;)</option>
                <option value="hex">Hex (&amp;#x26;)</option>
                <option value="minimal">Minimal (only &amp; &lt; &gt; " ')</option>
              </select>
            </label>
          </div>
        )}

        <div className="actions">
          <button className="btn-secondary" onClick={loadExample}>Load Example</button>
          <button
            className="btn-convert"
            onClick={run}
            disabled={running || !input.trim()}
            aria-busy={running}
          >
            {running
              ? <><div className="btn-spinner" aria-hidden="true" /> Running…</>
              : isEncode
                ? <><ArrowRight size={16} aria-hidden="true" className="mr-1" /> Encode</>
                : <><ArrowLeft size={16} aria-hidden="true" className="mr-1" /> Decode</>
            }
          </button>
          <button className="btn-secondary" onClick={clearAll}>Clear All</button>
        </div>
      </section>

      <section className="seo-content" aria-labelledby="about-heading">
        <h2 id="about-heading">About the HTML Entity Encoder & Decoder</h2>
        <p>
          This free online tool encodes and decodes HTML entities so that special
          characters display correctly in web pages and so that user input is safely
          embedded without triggering cross-site scripting (XSS). It supports named
          entities (<code>&amp;amp;</code>, <code>&amp;copy;</code>), decimal
          numeric references (<code>&amp;#38;</code>), and hex references
          (<code>&amp;#x26;</code>).
        </p>

        <h3>Why Entities Matter</h3>
        <p>
          Browsers interpret characters like <code>&lt;</code>, <code>&gt;</code>,
          <code> &amp;</code>, and quotes as HTML syntax. If untrusted user input
          contains these characters and is inserted into a page without encoding, an
          attacker can inject tags or script. Encoding converts them to safe
          entities that render as the original character but are not parsed as
          markup — the simplest and most effective XSS defense in HTML contexts.
        </p>

        <h3>Encoding Modes</h3>
        <ul>
          <li><strong>Named</strong> — human-readable (<code>&amp;copy;</code>, <code>&amp;euro;</code>), great for documentation</li>
          <li><strong>Decimal numeric</strong> — <code>&amp;#38;</code>; universal and works for every Unicode code point</li>
          <li><strong>Hex numeric</strong> — <code>&amp;#x26;</code>; shorter for high code points like emoji</li>
          <li><strong>Minimal</strong> — only the five XML-reserved characters, which is what most templating engines do by default</li>
        </ul>

        <h3>Common Use Cases</h3>
        <ul>
          <li>Display sample code in HTML without the browser parsing it</li>
          <li>Sanitize user-generated content for safe insertion in a page</li>
          <li>Debug XSS findings and verify entity-based payloads</li>
          <li>Prepare copy for RSS feeds, Atom entries, and email templates</li>
          <li>Encode non-ASCII characters for older systems that force ASCII output</li>
        </ul>

        <h3>Frequently Asked Questions</h3>

        <h3>Is HTML entity encoding enough to prevent XSS?</h3>
        <p>
          For HTML <em>text content</em> and most attribute values, yes — provided
          you encode the right set of characters for the context. Inside
          <code>&lt;script&gt;</code>, URL attributes, and inline CSS, entity
          encoding alone is <em>not</em> enough; use context-specific escaping or
          a safe templating library instead.
        </p>

        <h3>Which entities does the encoder know by name?</h3>
        <p>
          A curated set of ~50 commonly-used entities (currency, punctuation,
          arrows, math) plus the five XML-reserved characters. For anything else,
          switch to numeric or hex mode and every Unicode code point is encoded
          correctly.
        </p>

        <h3>Is my text sent anywhere?</h3>
        <p>
          No. Encoding and decoding happen in your browser — safe for
          user-generated content, secrets, and private documents.
        </p>

        <h3>Related Guides</h3>
        <p>
          Deep-dive on safe HTML output in{" "}
          <Link href="/blog/html-entities-xss">HTML entities and XSS</Link>, or
          encode URLs with the <Link href="/tools/url-encode">URL Encoder</Link>.
        </p>
      </section>

      <section className="features" aria-label="Features">
        {[
          { icon: <Code2 size={24} />, title: "Three encodings",   desc: "Named, decimal numeric, or hex numeric — plus a minimal mode." },
          { icon: <Shield size={24} />, title: "XSS defense",       desc: "Safely embed user input in HTML without opening injection holes." },
          { icon: <Lock size={24} />,  title: "Fully private",     desc: "Text stays in your browser — safe for user-generated content and secrets." },
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
