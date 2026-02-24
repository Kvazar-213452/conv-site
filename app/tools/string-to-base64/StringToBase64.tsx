"use client";

import { useState, useCallback } from "react";
import { stringToBase64, base64ToString } from "./utils";
import { KeyRound, Globe, ArrowRight, ArrowLeft } from "lucide-react";
import { EXAMPLE_STRING, EXAMPLE_BASE64 } from "@/lib/const";

import "@/style/main.css";

type Mode = "str2b64" | "b642str";

export default function StringToBase64() {
  const [mode, setMode] = useState<Mode>("str2b64");
  const [input, setInput] = useState(EXAMPLE_STRING);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [converting, setConverting] = useState(false);
  const [urlSafe, setUrlSafe] = useState(false);

  const isStr2B64 = mode === "str2b64";

  const switchMode = (next: Mode) => {
    setMode(next);
    setInput(next === "str2b64" ? EXAMPLE_STRING : EXAMPLE_BASE64);
    setOutput("");
    setError("");
  };

  const swapWithOutput = () => {
    if (!output) return;
    const next: Mode = isStr2B64 ? "b642str" : "str2b64";
    setMode(next);
    setInput(output);
    setOutput("");
    setError("");
  };

  const convert = useCallback(() => {
    setError("");
    setOutput("");
    setConverting(true);
    setTimeout(() => {
      try {
        if (isStr2B64) {
          setOutput(stringToBase64(input, urlSafe));
        } else {
          setOutput(base64ToString(input));
        }
      } catch (e) {
        setError((e as Error).message);
      }
      setConverting(false);
    }, 280);
  }, [input, isStr2B64, urlSafe]);

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
    a.download = isStr2B64 ? "encoded.txt" : "decoded.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearAll = () => { setInput(""); setOutput(""); setError(""); };
  const loadExample = () => {
    setInput(isStr2B64 ? EXAMPLE_STRING : EXAMPLE_BASE64);
    setOutput("");
    setError("");
  };

  const inputLabel = isStr2B64 ? "String Input" : "Base64 Input";
  const outputLabel = isStr2B64 ? "Base64 Output" : "String Output";
  const errorPrefix = isStr2B64 ? "Encode Error" : "Decode Error";
  const outputPlaceholder = isStr2B64
    ? "// Base64-encoded strings will appear here…"
    : "// Decoded strings will appear here…";
  const inputPlaceholder = isStr2B64
    ? "One line per string\nSupports UTF-8, JSON, tokens…"
    : "SGVsbG8sIFdvcmxkIQ==\none Base64 per line";

  return (
    <>
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-eyebrow">
          <div className="hero-dot" aria-hidden="true" />
          Free · No sign-up · Runs in browser
        </div>
        <h1 id="hero-heading">
          {isStr2B64
            ? <>String <em>→</em> Base64</>
            : <>Base64 <em>→</em> String</>}
          <br />Encoder / Decoder
        </h1>
        <p>
          {isStr2B64
            ? "Paste any text — plain strings, JSON, tokens, Unicode — and get Base64-encoded output. Standard or URL-safe, one line at a time."
            : "Paste Base64-encoded strings (standard or URL-safe) and get back the original UTF-8 text."
          }{" "}
          Runs 100% in your browser — nothing leaves your device.
        </p>

        <div className="mode-toggle" role="group" aria-label="Conversion direction">
          <button
            className={`mode-btn${isStr2B64 ? " active" : ""}`}
            onClick={() => switchMode("str2b64")}
          >
            String → Base64
          </button>
          <button
            className="mode-swap-btn"
            onClick={() => output ? swapWithOutput() : switchMode(isStr2B64 ? "b642str" : "str2b64")}
            title={output ? "Move output to input & flip direction" : "Flip direction"}
            aria-label="Swap conversion direction"
          >
            ⇄
          </button>
          <button
            className={`mode-btn${!isStr2B64 ? " active" : ""}`}
            onClick={() => switchMode("b642str")}
          >
            Base64 → String
          </button>
        </div>
      </section>

      {error && (
        <div className="error-bar" role="alert" aria-live="assertive">
          <span aria-hidden="true">✕</span>
          <span>{errorPrefix}: {error}</span>
        </div>
      )}

      <section aria-label="Converter">
        <div className="converter">

          <div className={`panel${error ? " has-error" : ""}`}>
            <div className="panel-header">
              <div className="panel-title">
                <div className="dot json" aria-hidden="true" />
                {inputLabel}
              </div>
              <div className="panel-actions">
                <button className="btn-ghost" onClick={loadExample}>Example</button>
                <button className="btn-ghost" onClick={() => { setInput(""); setError(""); }}>Clear</button>
              </div>
            </div>
            <textarea
              aria-label={inputLabel}
              placeholder={inputPlaceholder}
              value={input}
              onChange={(e) => { setInput(e.target.value); setError(""); }}
              spellCheck={false} autoCorrect="off" autoCapitalize="off"
            />
          </div>

          <div className={`panel${output ? " has-output" : ""}`}>
            <div className="panel-header">
              <div className="panel-title">
                <div className="dot sql" aria-hidden="true" />
                {outputLabel}
                {output && !converting && <span className="success-tag">✓ converted</span>}
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
                    <button className="btn-ghost" onClick={swapWithOutput} title="Use output as new input">
                      ⇄ Swap
                    </button>
                  </>
                )}
              </div>
            </div>
            <pre
              className={`output-pre${output && !converting ? "" : " empty"}${converting ? " loading" : ""}`}
              aria-label={outputLabel} aria-live="polite"
            >
              {converting ? "// Encoding…" : (output || outputPlaceholder)}
            </pre>
          </div>

        </div>

        {isStr2B64 && (
          <div style={{ display: "flex", justifyContent: "center", marginTop: "14px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "13px", color: "var(--text-2)", fontFamily: "var(--font-mono)" }}>
              <input
                type="checkbox"
                checked={urlSafe}
                onChange={(e) => setUrlSafe(e.target.checked)}
                style={{ accentColor: "var(--accent)", width: "14px", height: "14px" }}
              />
              URL-safe Base64 <span style={{ color: "var(--text-3)" }}>(use - _ instead of + /, no padding)</span>
            </label>
          </div>
        )}

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
              : isStr2B64
                ? <><ArrowRight size={16} aria-hidden="true" className="mr-1" /> Encode to Base64</>
                : <><ArrowLeft size={16} aria-hidden="true" className="mr-1" /> Decode to String</>
            }
          </button>
          <button className="btn-secondary" onClick={clearAll}>Clear All</button>
        </div>
      </section>

      <section className="seo-content" aria-labelledby="about-heading">
        <h2 id="about-heading">About Base64 Encoder & Decoder Tool</h2>
        <p>
          This free online Base64 encoder and decoder tool allows you to convert strings to Base64 encoding and decode
          Base64 back to original text instantly. Whether you're a developer working with APIs, encoding authentication
          tokens, transmitting binary data as text, or debugging Base64-encoded payloads, our bidirectional converter
          handles UTF-8 text, JSON objects, JWT tokens, API keys, and special characters with full Unicode support.
          Choose between standard Base64 or URL-safe Base64 encoding. Everything runs 100% in your browser with instant
          processing and batch conversion support.
        </p>

        <h3>Why Use Base64 Encoding?</h3>
        <p>
          Base64 encoding converts binary data or text into ASCII characters (A-Z, a-z, 0-9, +, /, =) that can be safely
          transmitted over text-based protocols like HTTP, email, JSON, and XML. It's essential for encoding authentication
          tokens (Basic Auth, JWT), transmitting binary files as text (images in data URLs, email attachments), storing
          binary data in JSON or XML, encoding URL parameters with special characters, transmitting encrypted data, embedding
          images in CSS or HTML, and ensuring data integrity across systems that don't handle binary data. Without Base64
          encoding, binary data or special characters can be corrupted during transmission, cause parsing errors in text
          formats, break URL parameters, or fail authentication protocols. Base64 ensures safe, reliable data transport
          in text-only environments.
        </p>

        <h3>How to Use This Tool</h3>
        <p>
          Choose your conversion direction: String → Base64 mode encodes plain text, JSON, tokens, or any UTF-8 string
          into Base64 format—optionally enable URL-safe encoding (replaces + with -, / with _, removes padding) for use
          in URLs and filenames. Base64 → String mode decodes Base64-encoded strings (standard or URL-safe) back to
          original UTF-8 text. Paste your content into the input field (one item per line for batch processing), click
          Encode or Decode, and get instant results. Copy to clipboard for immediate use, download as a text file, or
          use the swap button to reverse the conversion and decode what you just encoded.
        </p>

        <h3>Key Benefits</h3>
        <ul>
          <li><strong>No installation required:</strong> Works directly in your browser without any software downloads</li>
          <li><strong>Completely free:</strong> No registration, credit card, or hidden fees</li>
          <li><strong>Secure and private:</strong> All encoding happens locally - your data never reaches our servers</li>
          <li><strong>Fast processing:</strong> Instant encoding and decoding with no waiting time</li>
          <li><strong>Bidirectional:</strong> Encode String → Base64 or decode Base64 → String with one click</li>
          <li><strong>URL-safe option:</strong> Standard (+/=) or URL-safe (-_, no padding) Base64 encoding</li>
          <li><strong>Full Unicode support:</strong> Handles UTF-8, emoji, Cyrillic, Chinese, Arabic, all languages</li>
          <li><strong>Batch processing:</strong> Convert multiple strings or Base64 values simultaneously (one per line)</li>
        </ul>

        <h3>Common Use Cases</h3>
        <p>
          Developers use Base64 encoding for creating HTTP Basic Authentication headers (username:password encoded),
          encoding JWT tokens and OAuth credentials for APIs, generating data URLs for inline images (data:image/png;base64,...),
          encoding file uploads in JSON payloads, transmitting binary data over REST APIs, encoding email attachments
          in MIME format, storing binary data in databases or JSON files, encoding URL parameters with special characters
          safely, debugging API responses containing Base64 data, creating secure tokens for password reset links. Backend
          engineers encode configuration secrets, API keys, and encryption keys for storage and transmission, decode
          Base64-encoded request bodies and authorization headers, process file uploads sent as Base64, handle email
          attachments and embedded images. Frontend developers embed inline images in CSS and HTML, encode form data
          for submission, decode Base64 image previews, handle file upload responses. Security engineers work with
          encoded credentials, encrypted tokens, and obfuscated data for testing and auditing.
        </p>

        <h3>Standard vs URL-Safe Base64</h3>
        <p>
          Standard Base64 uses characters A-Z, a-z, 0-9, +, /, and = for padding. However, + and / have special meanings
          in URLs (+ becomes space, / is path separator) and = can cause issues in some contexts. URL-safe Base64 replaces
          + with -, / with _, and removes padding (=) to create strings safe for URLs, filenames, and query parameters.
          Use standard Base64 for HTTP headers, email attachments, JSON/XML data, and general encoding. Use URL-safe Base64
          for JWT tokens in URLs, query parameters with encoded data, filenames and file paths, OAuth state parameters,
          and any scenario where + / = characters would be problematic. Our tool supports both formats with automatic
          detection during decoding.
        </p>

        <h3>Supported Features</h3>
        <p>
          String to Base64 encoding handles UTF-8 text with full Unicode support (all languages, emoji, special characters),
          JSON objects and arrays, API tokens and keys, multiline text and strings with line breaks, binary-like data
          represented as strings, and generates standard or URL-safe Base64 output. Base64 to string decoding automatically
          detects standard and URL-safe Base64 formats, handles both padded and unpadded Base64, correctly decodes UTF-8
          multibyte characters, validates Base64 syntax and reports clear errors, preserves original text including newlines
          and special characters. Batch mode processes multiple strings or Base64 values (one per line) simultaneously,
          maintaining order and providing line-by-line conversion.
        </p>

        <h3>Technical Features</h3>
        <p>
          The encoder uses browser-native btoa/atob with UTF-8 handling via TextEncoder/TextDecoder for proper Unicode
          support, correctly encodes multibyte characters (2-4 bytes for Unicode), generates RFC 4648 compliant Base64
          output, supports both standard (RFC 4648 §4) and URL-safe (RFC 4648 §5) variants, handles line breaks and special
          characters properly, validates Base64 syntax during decoding with detailed error messages, and processes large
          texts efficiently. The tool includes copy-to-clipboard, download options, swap functionality for roundtrip testing,
          and clear error reporting for invalid Base64 input (wrong characters, incorrect padding, malformed strings).
          Works reliably across all modern browsers with consistent results.
        </p>

        <h3>Privacy and Security</h3>
        <p>
          Unlike online Base64 converters that upload your data to remote servers, this tool processes everything locally
          in your browser using JavaScript. Your API keys, authentication tokens, JWT payloads, passwords, encryption keys,
          OAuth credentials, sensitive JSON data, or any text content never leave your computer, making it completely safe
          for encoding production secrets and confidential data. No cookies, tracking, data storage, or server communication.
          Perfect for working with production API tokens, user credentials, encrypted payloads, authentication headers, or
          any sensitive strings that require strict privacy controls. Your data remains 100% private and secure on your device.
          Note: Base64 is encoding, not encryption—it provides no security, only safe text representation of binary data.
        </p>
      </section>

      <section className="features" aria-label="Features">
        {[
          {
            icon: <Globe size={24} />,
            title: "Full Unicode support",
            desc: "Handles any UTF-8 text — Cyrillic, Chinese, Arabic, emoji, special characters — encoded correctly every time.",
          },
          {
            icon: <KeyRound size={24} />,
            title: "Tokens & JSON",
            desc: "Encode API tokens, JWT payloads, JSON blobs, or any raw string into compact Base64 for safe transport.",
          },
          {
            icon: <ArrowRight size={24} />,
            title: "Standard & URL-safe",
            desc: "Switch between standard Base64 (+, /, ==) and URL-safe Base64 (-, _, no padding) with one click.",
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