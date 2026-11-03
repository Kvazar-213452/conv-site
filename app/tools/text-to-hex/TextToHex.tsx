"use client";

import { useState, useCallback } from "react";
import {
  textToHex,
  hexToText,
  EXAMPLE_TEXT,
  EXAMPLE_HEX,
  DEFAULT_OPTIONS,
  type HexOptions,
  type HexSeparator,
  type HexCase,
} from "./utils";
import { Binary, Lock, Settings2 } from "lucide-react";

import "@/style/main.css";
import "@/style/bar.css";

export default function TextToHex() {
  const [input, setInput] = useState(EXAMPLE_TEXT);
  const [output, setOutput] = useState("");
  const [opts, setOpts] = useState<HexOptions>(DEFAULT_OPTIONS);
  const [direction, setDirection] = useState<"toHex" | "toText">("toHex");
  const [converting, setConverting] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const convert = useCallback(() => {
    setError("");
    if (!input.trim()) { setOutput(""); return; }
    setConverting(true);
    setTimeout(() => {
      try {
        if (direction === "toHex") {
          setOutput(textToHex(input, opts));
        } else {
          setOutput(hexToText(input));
        }
      } catch (e) {
        setError((e as Error).message);
      }
      setConverting(false);
    }, 180);
  }, [input, opts, direction]);

  const loadExample = () => {
    setInput(direction === "toHex" ? EXAMPLE_TEXT : EXAMPLE_HEX);
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

  const setOpt = <K extends keyof HexOptions>(key: K, val: HexOptions[K]) => {
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
          Text to <em>Hex</em>
        </h1>
        <p>
          Convert text to hexadecimal and hex back to text. Full UTF-8 support with
          configurable separators and case. Runs 100% in your browser.
        </p>
      </section>

      {error && (
        <div className="error-bar" role="alert" aria-live="assertive">
          <span aria-hidden="true">✕</span>
          <span>Error: {error}</span>
        </div>
      )}

      <section aria-label="Text to Hex Converter">
        <div className="converter">
          {/* Input */}
          <div className={`panel${error ? " has-error" : ""}`}>
            <div className="panel-header">
              <div className="panel-title">
                <div className="dot json" aria-hidden="true" />
                {direction === "toHex" ? "Text Input" : "Hex Input"}
              </div>
              <div className="panel-actions">
                <button className="btn-ghost" onClick={loadExample}>Example</button>
                <button className="btn-ghost" onClick={() => { setInput(""); setOutput(""); setError(""); }}>Clear</button>
              </div>
            </div>
            <textarea
              aria-label={direction === "toHex" ? "Text input" : "Hex input"}
              placeholder={direction === "toHex" ? "Type or paste text here…" : "Paste hex string here…"}
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
                {direction === "toHex" ? "Hex Output" : "Text Output"}
                {output && !converting && (
                  <span className="success-tag">✓ converted</span>
                )}
              </div>
              <div className="panel-actions">
                <button className="btn-ghost" onClick={copyOutput} disabled={!output}>
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>
            <pre
              className={`output-pre${!output && !converting ? " empty" : ""}${converting ? " loading" : ""}`}
              aria-live="polite"
            >
              {converting ? "Converting…" : output || "// Result will appear here…"}
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
            Direction:
            <select
              value={direction}
              onChange={(e) => { setDirection(e.target.value as "toHex" | "toText"); setOutput(""); setInput(""); }}
              style={{ marginLeft: 6, padding: "3px 8px", borderRadius: 6, border: "1px solid var(--color-border-bright)", background: "var(--color-surface)", color: "var(--color-text)", fontFamily: "'Geist Mono', monospace", fontSize: 12 }}
            >
              <option value="toHex">Text → Hex</option>
              <option value="toText">Hex → Text</option>
            </select>
          </label>
          {direction === "toHex" && (
            <>
              <label>
                Separator:
                <select
                  value={opts.separator}
                  onChange={(e) => setOpt("separator", e.target.value as HexSeparator)}
                  style={{ marginLeft: 6, padding: "3px 8px", borderRadius: 6, border: "1px solid var(--color-border-bright)", background: "var(--color-surface)", color: "var(--color-text)", fontFamily: "'Geist Mono', monospace", fontSize: 12 }}
                >
                  <option value="space">Space</option>
                  <option value="none">None</option>
                  <option value="colon">Colon (:)</option>
                  <option value="0x">0x prefix</option>
                </select>
              </label>
              <label>
                Case:
                <select
                  value={opts.hexCase}
                  onChange={(e) => setOpt("hexCase", e.target.value as HexCase)}
                  style={{ marginLeft: 6, padding: "3px 8px", borderRadius: 6, border: "1px solid var(--color-border-bright)", background: "var(--color-surface)", color: "var(--color-text)", fontFamily: "'Geist Mono', monospace", fontSize: 12 }}
                >
                  <option value="lower">lowercase</option>
                  <option value="upper">UPPERCASE</option>
                </select>
              </label>
            </>
          )}
        </div>

        {/* Actions */}
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
              : <><Binary size={16} aria-hidden="true" className="mr-1" /> Convert</>
            }
          </button>
          <button className="btn-secondary" onClick={clearAll}>Clear All</button>
        </div>
      </section>

      <section className="seo-content" aria-labelledby="about-heading">
        <h2 id="about-heading">About Text to Hex Converter Tool</h2>
        <p>
          This free online text to hex converter transforms any text string into its hexadecimal byte representation
          and converts hex strings back to readable text. It uses UTF-8 encoding for full Unicode support including
          emoji, accented characters, Chinese, Arabic, Cyrillic, and all other scripts. Multiple output formats
          (space-separated, colon-separated, 0x-prefixed, continuous) and case options make it versatile for any
          use case. Everything runs locally in your browser.
        </p>

        <h3>Why Convert Text to Hex?</h3>
        <p>
          Hexadecimal representation is essential for debugging network protocols, inspecting binary data, analyzing
          character encoding issues, working with cryptographic functions, examining file headers and magic bytes,
          debugging Unicode text rendering, building binary protocol parsers, crafting raw HTTP requests, and understanding
          how text is stored in memory. Developers frequently need to see the exact bytes behind a string to diagnose
          encoding bugs, verify hash outputs, or construct binary payloads for testing.
        </p>

        <h3>How to Use This Converter</h3>
        <p>
          Select "Text → Hex" to convert text to hexadecimal, or "Hex → Text" for the reverse. For text-to-hex,
          choose your preferred separator format (space, colon, 0x prefix, or none) and hex case (lowercase or
          uppercase). Paste your input and click "Convert." The hex decoder accepts any format — spaces, colons,
          0x prefixes, and mixed separators are all handled automatically. Copy the result with one click.
        </p>

        <h3>Key Benefits</h3>
        <ul>
          <li><strong>Full UTF-8 support:</strong> Handles all Unicode characters including emoji, CJK, and RTL scripts</li>
          <li><strong>Multiple separators:</strong> Space, colon, 0x prefix, or no separator for different use cases</li>
          <li><strong>Case options:</strong> Choose lowercase (48 65 6c) or UPPERCASE (48 65 6C) hex output</li>
          <li><strong>Smart decoding:</strong> Hex-to-text accepts mixed formats and tolerates extra whitespace</li>
          <li><strong>Bidirectional:</strong> Convert text to hex and hex back to text with perfect round-trips</li>
          <li><strong>Instant conversion:</strong> No server round-trips — everything runs in your browser</li>
          <li><strong>Completely private:</strong> Your data never leaves your device</li>
          <li><strong>No installation:</strong> Works in any modern browser without plugins</li>
        </ul>

        <h3>Common Use Cases</h3>
        <p>
          Network engineers inspect packet payloads and debug protocol implementations. Security researchers analyze
          binary exploits and craft fuzzing payloads. Backend developers debug character encoding issues in APIs and
          databases. Embedded systems developers convert between text and hex for UART/SPI communication. Cryptography
          practitioners verify hash and key values. DevOps engineers decode hex-encoded log entries and error codes.
          QA engineers prepare binary test data for API endpoints.
        </p>

        <h3>Privacy and Security</h3>
        <p>
          All conversion happens locally in your browser using the Web TextEncoder/TextDecoder APIs. Your text, hex
          data, binary payloads, and any sensitive content never leave your computer. No cookies, no tracking, no
          server communication. Safe for production data, cryptographic keys, and confidential information.
        </p>
      </section>

      <section className="features" aria-label="Features">
        {[
          {
            icon: <Binary size={24} />,
            title: "Full UTF-8 support",
            desc: "Handles every Unicode character — Latin, Cyrillic, CJK, emoji, and more — with correct multi-byte encoding.",
          },
          {
            icon: <Lock size={24} />,
            title: "Fully private",
            desc: "Your text and hex data never leave the browser. Safe for sensitive payloads and production data.",
          },
          {
            icon: <Settings2 size={24} />,
            title: "Flexible output",
            desc: "Four separator formats and two case options for any hex representation you need.",
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
