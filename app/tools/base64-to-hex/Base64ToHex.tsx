"use client";

import { useState, useCallback } from "react";
import {
  base64ToHex,
  hexToBase64,
  EXAMPLE_BASE64,
  EXAMPLE_HEX,
  DEFAULT_OPTIONS,
  type ConvertOptions,
  type HexSeparator,
  type HexCase,
} from "./utils";
import { Layers, Lock, Settings2 } from "lucide-react";

import "@/style/main.css";
import "@/style/bar.css";

export default function Base64ToHex() {
  const [input, setInput] = useState(EXAMPLE_BASE64);
  const [output, setOutput] = useState("");
  const [opts, setOpts] = useState<ConvertOptions>(DEFAULT_OPTIONS);
  const [direction, setDirection] = useState<"b64ToHex" | "hexToB64">("b64ToHex");
  const [converting, setConverting] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const convert = useCallback(() => {
    setError("");
    if (!input.trim()) { setOutput(""); return; }
    setConverting(true);
    setTimeout(() => {
      try {
        if (direction === "b64ToHex") {
          setOutput(base64ToHex(input, opts));
        } else {
          setOutput(hexToBase64(input));
        }
      } catch (e) {
        setError((e as Error).message);
      }
      setConverting(false);
    }, 180);
  }, [input, opts, direction]);

  const loadExample = () => {
    setInput(direction === "b64ToHex" ? EXAMPLE_BASE64 : EXAMPLE_HEX);
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

  const setOpt = <K extends keyof ConvertOptions>(key: K, val: ConvertOptions[K]) => {
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
          Base64 to <em>Hex</em>
        </h1>
        <p>
          Convert Base64 encoded strings to hexadecimal and hex back to Base64.
          Configurable output format. Runs 100% in your browser.
        </p>
      </section>

      {error && (
        <div className="error-bar" role="alert" aria-live="assertive">
          <span aria-hidden="true">✕</span>
          <span>Error: {error}</span>
        </div>
      )}

      <section aria-label="Base64 to Hex Converter">
        <div className="converter">
          {/* Input */}
          <div className={`panel${error ? " has-error" : ""}`}>
            <div className="panel-header">
              <div className="panel-title">
                <div className="dot json" aria-hidden="true" />
                {direction === "b64ToHex" ? "Base64 Input" : "Hex Input"}
              </div>
              <div className="panel-actions">
                <button className="btn-ghost" onClick={loadExample}>Example</button>
                <button className="btn-ghost" onClick={() => { setInput(""); setOutput(""); setError(""); }}>Clear</button>
              </div>
            </div>
            <textarea
              aria-label={direction === "b64ToHex" ? "Base64 input" : "Hex input"}
              placeholder={direction === "b64ToHex" ? "Paste Base64 string here…" : "Paste hex string here…"}
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
                {direction === "b64ToHex" ? "Hex Output" : "Base64 Output"}
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
              onChange={(e) => { setDirection(e.target.value as "b64ToHex" | "hexToB64"); setOutput(""); setInput(""); }}
              style={{ marginLeft: 6, padding: "3px 8px", borderRadius: 6, border: "1px solid var(--color-border-bright)", background: "var(--color-surface)", color: "var(--color-text)", fontFamily: "'Geist Mono', monospace", fontSize: 12 }}
            >
              <option value="b64ToHex">Base64 → Hex</option>
              <option value="hexToB64">Hex → Base64</option>
            </select>
          </label>
          {direction === "b64ToHex" && (
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
              : <><Layers size={16} aria-hidden="true" className="mr-1" /> Convert</>
            }
          </button>
          <button className="btn-secondary" onClick={clearAll}>Clear All</button>
        </div>
      </section>

      <section className="seo-content" aria-labelledby="about-heading">
        <h2 id="about-heading">About Base64 to Hex Converter Tool</h2>
        <p>
          This free online Base64 to Hex converter transforms Base64 encoded data into its hexadecimal byte representation
          and converts hex strings back to Base64 encoding. Essential for developers working with binary data, cryptographic
          hashes, certificates, and encoded payloads where you need to switch between these two common encoding formats.
          Everything runs locally in your browser — no data is sent to any server.
        </p>

        <h3>Why Convert Between Base64 and Hex?</h3>
        <p>
          Base64 and hexadecimal are the two most common ways to represent binary data as text. Base64 is compact (4 characters
          per 3 bytes) and used in data URIs, JWTs, email attachments, and API payloads. Hexadecimal is verbose (2 characters
          per byte) but easier to read byte-by-byte, making it standard for cryptographic hashes, MAC addresses, color codes,
          and binary protocol debugging. Developers frequently need to convert between these formats when comparing hash values,
          inspecting certificate data, debugging encoded API payloads, or translating between different tool outputs.
        </p>

        <h3>How to Use This Converter</h3>
        <p>
          Select "Base64 → Hex" to decode Base64 to hexadecimal, or "Hex → Base64" for the reverse. For Base64-to-hex
          output, choose your preferred separator (space, colon, 0x prefix, or none) and case (lowercase or uppercase).
          Paste your input and click "Convert." The hex-to-Base64 direction accepts any hex format with mixed separators.
          Copy the result instantly with one click.
        </p>

        <h3>Key Benefits</h3>
        <ul>
          <li><strong>Bidirectional conversion:</strong> Base64 to hex and hex to Base64 in one tool</li>
          <li><strong>Multiple hex formats:</strong> Space, colon, 0x prefix, or continuous hex output</li>
          <li><strong>Case options:</strong> Choose lowercase or uppercase hex digits</li>
          <li><strong>Smart hex parsing:</strong> Tolerates mixed separators, spaces, and 0x prefixes on input</li>
          <li><strong>Standard Base64:</strong> RFC 4648 compliant encoding and decoding</li>
          <li><strong>Instant conversion:</strong> No server round-trips — everything runs in your browser</li>
          <li><strong>Completely private:</strong> Your data never leaves your device</li>
          <li><strong>No installation:</strong> Works in any modern browser without sign-ups</li>
        </ul>

        <h3>Common Use Cases</h3>
        <p>
          Security engineers convert Base64-encoded certificate data to hex for byte-level inspection. Backend developers
          translate hash values between formats when comparing outputs from different tools (openssl, shasum, Node.js crypto).
          Frontend developers decode data URIs to inspect embedded file contents. Cryptography practitioners convert keys and
          nonces between representations. DevOps engineers translate encoded secrets in Kubernetes and Docker configs. Forensics
          analysts examine encoded payloads in log files.
        </p>

        <h3>Privacy and Security</h3>
        <p>
          All conversion happens locally in your browser using JavaScript's built-in atob/btoa functions. Your Base64 data,
          hex strings, certificates, cryptographic keys, and any other sensitive content never leave your computer. No cookies,
          no tracking, no server communication. Safe for production secrets, TLS certificates, and confidential data.
        </p>
      </section>

      <section className="features" aria-label="Features">
        {[
          {
            icon: <Layers size={24} />,
            title: "Format conversion",
            desc: "Switch between Base64 and hexadecimal — the two most common binary-to-text encodings.",
          },
          {
            icon: <Lock size={24} />,
            title: "Fully private",
            desc: "Your encoded data never leaves the browser. Safe for certificates, keys, and secrets.",
          },
          {
            icon: <Settings2 size={24} />,
            title: "Flexible output",
            desc: "Four separator formats and two case options for hex. Smart parsing accepts any hex input format.",
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
