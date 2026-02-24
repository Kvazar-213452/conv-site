"use client";

import { useState, useCallback } from "react";
import { encodeUrl, decodeUrl } from "./utils";
import { Link, ShieldCheck, ArrowRight, ArrowLeft } from "lucide-react";
import { EXAMPLE_PLAIN, EXAMPLE_ENCODED } from "@/lib/const";

import "@/app/css/main.css";

type Mode = "encode" | "decode";
type EncodeMode = "component" | "full" | "form";

const ENCODE_OPTIONS: { value: EncodeMode; label: string; desc: string }[] = [
  { value: "component", label: "encodeURIComponent", desc: "Encodes all special chars except: A–Z a–z 0–9 - _ . ! ~ * ' ( )" },
  { value: "full",      label: "encodeURI",          desc: "Preserves full URL structure: : / ? # [ ] @ ! $ & ' ( ) * + , ; =" },
  { value: "form",      label: "Form-encoded",       desc: "Like encodeURIComponent but spaces become + (application/x-www-form-urlencoded)" },
];

export default function UrlEncodeDecode() {
  const [mode, setMode]           = useState<Mode>("encode");
  const [encodeMode, setEncodeMode] = useState<EncodeMode>("component");
  const [input, setInput]         = useState(EXAMPLE_PLAIN);
  const [output, setOutput]       = useState("");
  const [error, setError]         = useState("");
  const [copied, setCopied]       = useState(false);
  const [converting, setConverting] = useState(false);

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

  const convert = useCallback(() => {
    setError("");
    setOutput("");
    setConverting(true);
    setTimeout(() => {
      try {
        if (isEncode) {
          setOutput(encodeUrl(input, encodeMode));
        } else {
          setOutput(decodeUrl(input));
        }
      } catch (e) {
        setError((e as Error).message);
      }
      setConverting(false);
    }, 280);
  }, [input, isEncode, encodeMode]);

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
    a.download = isEncode ? "encoded.txt" : "decoded.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearAll  = () => { setInput(""); setOutput(""); setError(""); };
  const loadExample = () => {
    setInput(isEncode ? EXAMPLE_PLAIN : EXAMPLE_ENCODED);
    setOutput("");
    setError("");
  };

  const inputLabel        = isEncode ? "Plain Text Input" : "Encoded Input";
  const outputLabel       = isEncode ? "URL-Encoded Output" : "Decoded Output";
  const errorPrefix       = isEncode ? "Encode Error" : "Decode Error";
  const outputPlaceholder = isEncode
    ? "// URL-encoded output will appear here…"
    : "// Decoded text will appear here…";
  const inputPlaceholder  = isEncode
    ? "https://example.com/search?q=hello world\none URL or string per line"
    : "https://example.com/search?q=hello%20world\none encoded string per line";

  return (
    <>
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-eyebrow">
          <div className="hero-dot" aria-hidden="true" />
          Free · No sign-up · Runs in browser
        </div>
        <h1 id="hero-heading">
          {isEncode
            ? <>URL <em>Encode</em></>
            : <>URL <em>Decode</em></>}
          <br />Converter
        </h1>
        <p>
          {isEncode
            ? "Percent-encode URLs, query params, and form data. Choose between encodeURIComponent, encodeURI, or form-urlencoded — one line at a time."
            : "Decode percent-encoded strings back to readable text. Handles standard %XX sequences and form-encoded + spaces."
          }{" "}
          Runs 100% in your browser — nothing leaves your device.
        </p>

        <div className="mode-toggle" role="group" aria-label="Conversion direction">
          <button
            className={`mode-btn${isEncode ? " active" : ""}`}
            onClick={() => switchMode("encode")}
          >
            Encode
          </button>
          <button
            className="mode-swap-btn"
            onClick={() => output ? swapWithOutput() : switchMode(isEncode ? "decode" : "encode")}
            title={output ? "Move output to input & flip direction" : "Flip direction"}
            aria-label="Swap conversion direction"
          >
            ⇄
          </button>
          <button
            className={`mode-btn${!isEncode ? " active" : ""}`}
            onClick={() => switchMode("decode")}
          >
            Decode
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
              {converting ? "// Converting…" : (output || outputPlaceholder)}
            </pre>
          </div>

        </div>

        {/* Encode mode selector */}
        {isEncode && (
          <div style={{ display: "flex", justifyContent: "center", marginTop: "14px", gap: "6px", flexWrap: "wrap" }}>
            {ENCODE_OPTIONS.map(({ value, label, desc }) => (
              <button
                key={value}
                onClick={() => setEncodeMode(value)}
                title={desc}
                style={{
                  padding: "6px 14px",
                  borderRadius: "99px",
                  border: `1px solid ${encodeMode === value ? "var(--accent)" : "var(--border-2)"}`,
                  background: encodeMode === value ? "var(--accent-dim)" : "transparent",
                  color: encodeMode === value ? "var(--accent)" : "var(--text-2)",
                  fontSize: "12px",
                  fontFamily: "var(--font-mono)",
                  cursor: "pointer",
                  transition: "all .15s",
                }}
              >
                {label}
              </button>
            ))}
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
              : isEncode
                ? <><ArrowRight size={16} aria-hidden="true" className="mr-1" /> Encode URL</>
                : <><ArrowLeft size={16} aria-hidden="true" className="mr-1" /> Decode URL</>
            }
          </button>
          <button className="btn-secondary" onClick={clearAll}>Clear All</button>
        </div>
      </section>

      <section className="seo-content" aria-labelledby="about-heading">
        <h2 id="about-heading">About URL Encoder & Decoder Tool</h2>
        <p>
          This free online URL encoder and decoder tool allows you to percent-encode URLs and decode percent-encoded
          strings instantly. Whether you're a developer building query parameters, encoding form data, debugging API
          requests, or working with special characters in URLs, our bidirectional converter handles all encoding needs
          with three modes: encodeURIComponent for query parameters and values, encodeURI for full URL strings preserving
          structure, and form-urlencoded for HTML form submissions (spaces become +). Supports full Unicode, batch
          processing, and runs 100% in your browser with instant results.
        </p>

        <h3>Why Use URL Encoding?</h3>
        <p>
          URLs can only contain a limited set of ASCII characters (A-Z, a-z, 0-9, and a few special characters). Any other
          characters—including spaces, special symbols, Unicode characters (Cyrillic, Chinese, Arabic, emoji), and reserved
          characters (?, &, =, #, /, etc.)—must be percent-encoded to work correctly in URLs. Without proper encoding,
          URLs break: spaces cause parsing errors, special characters create invalid URLs, query parameters get corrupted,
          non-ASCII text fails to transmit, and servers can't interpret requests correctly. URL encoding converts these
          characters to %XX format (percent sign + two hexadecimal digits) ensuring safe transmission, proper parsing,
          compatibility across all browsers and servers, and preventing injection attacks. This is essential for query
          strings, form submissions, API requests, and any URL with user-generated content.
        </p>

        <h3>How to Use This Tool</h3>
        <p>
          Choose your mode: Encode mode converts plain text URLs, query parameters, or strings into percent-encoded format—
          select encodeURIComponent to encode query parameter values and form data (encodes all special characters except
          A-Z a-z 0-9 - _ . ! ~ * ' ( )), encodeURI to encode complete URLs while preserving URL structure characters
          (: / ? # [ ] @), or form-urlencoded for HTML form data where spaces become + instead of %20. Decode mode converts
          percent-encoded strings (%20, %D0%BF, etc.) back to readable text, automatically handling both %20 and + for spaces.
          Paste your content (one URL or string per line for batch processing), click Encode or Decode, and get instant
          results. Copy to clipboard, download as text, or swap to reverse the conversion.
        </p>

        <h3>Key Benefits</h3>
        <ul>
          <li><strong>No installation required:</strong> Works directly in your browser without any software downloads</li>
          <li><strong>Completely free:</strong> No registration, credit card, or hidden fees</li>
          <li><strong>Secure and private:</strong> All encoding happens locally - your URLs never reach our servers</li>
          <li><strong>Fast processing:</strong> Instant encoding and decoding with no waiting time</li>
          <li><strong>Bidirectional:</strong> Encode URLs or decode percent-encoded strings with one click</li>
          <li><strong>Three encoding modes:</strong> encodeURIComponent, encodeURI, or form-urlencoded for different use cases</li>
          <li><strong>Full Unicode support:</strong> Correctly handles Cyrillic, CJK, Arabic, emoji, all special characters</li>
          <li><strong>Batch processing:</strong> Encode or decode multiple URLs simultaneously (one per line)</li>
        </ul>

        <h3>Common Use Cases</h3>
        <p>
          Developers use URL encoding for building query string parameters with special characters (search terms, user input,
          filters), encoding API request URLs with Unicode data, constructing redirect URLs with encoded destination paths,
          generating share links with encoded content, building OAuth callback URLs with state parameters, encoding file
          names and paths in URLs, creating mailto links with encoded subjects and bodies, debugging API requests with
          improperly encoded parameters, testing URL parsing and routing logic. Frontend developers encode form submission
          data, build dynamic URLs from user input, create search functionality with special character support, encode URL
          fragments and hash parameters. Backend engineers decode incoming query parameters, validate and sanitize URL inputs,
          parse form-urlencoded POST data, build API endpoint URLs programmatically, handle internationalized URLs (IRIs).
          SEO specialists encode canonical URLs, create properly formatted sitemap entries, encode meta tag URLs with special
          characters. QA testers verify URL encoding behavior, test edge cases with Unicode and special characters, debug
          URL parsing issues.
        </p>

        <h3>Understanding Encoding Modes</h3>
        <p>
          encodeURIComponent is the most aggressive encoding mode, converting all characters except A-Z a-z 0-9 - _ . ! ~ * ' ( )
          into percent-encoded format. Use this for query parameter values, form data, path segments, or any content that
          needs maximum encoding. Example: "hello world" becomes "hello%20world", "user@example.com" becomes "user%40example.com".
          encodeURI preserves URL structure by not encoding : / ? # [ ] @ ! $ & ' ( ) * + , ; = characters, making it suitable
          for encoding complete URLs while keeping the structure intact. Use for full URL strings where you want to preserve
          the protocol, domain, path, and query string separators. Example: "https://example.com/search?q=hello world" becomes
          "https://example.com/search?q=hello%20world". form-urlencoded (application/x-www-form-urlencoded) works like
          encodeURIComponent but encodes spaces as + instead of %20, matching the format used by HTML form submissions and
          some legacy APIs. Use for HTML form POST data or APIs expecting this format.
        </p>

        <h3>Supported Features</h3>
        <p>
          URL encoding handles comprehensive character sets: ASCII special characters (space, !, @, #, $, %, ^, &, *, etc.)
          convert to %20, %21, %40, %23, %24, %25, %5E, %26, %2A respectively. Full UTF-8 Unicode support encodes Cyrillic
          (Привіт → %D0%9F%D1%80%D0%B8%D0%B2%D1%96%D1%82), Chinese (你好 → %E4%BD%A0%E5%A5%BD), Arabic (مرحبا), emoji
          (😊 → %F0%9F%98%8A), and all other Unicode characters correctly. URL decoding automatically detects and decodes
          standard %XX sequences, handles + as space in form-encoded data, validates percent-encoding format, reports
          malformed sequences with exact position, and preserves already-decoded text. Batch mode processes multiple URLs
          or strings line by line, maintains order, and provides detailed error messages for invalid encoding on specific lines.
        </p>

        <h3>Technical Features</h3>
        <p>
          The tool uses browser-native encodeURIComponent and encodeURI functions with proper UTF-8 handling, generates
          RFC 3986 compliant percent-encoded output, correctly handles multi-byte UTF-8 characters (2-4 bytes), validates
          percent-encoding during decode (detects malformed %XX sequences), handles mixed encoded/non-encoded input gracefully,
          supports both %20 and + for spaces during decode, provides line-by-line batch processing with error pinpointing,
          and works consistently across all modern browsers. Error messages identify exact invalid characters or sequences
          with their position for easy debugging. The tool includes copy-to-clipboard, download options, swap functionality
          for roundtrip testing, and visual indicators showing which encoding mode is active.
        </p>

        <h3>Privacy and Security</h3>
        <p>
          Unlike online URL encoders that send your data to remote servers, this tool processes everything locally in your
          browser using JavaScript. Your URLs with query parameters, API endpoints, OAuth tokens, redirect URLs, search terms,
          user input data, or any URL content never leave your computer, making it completely safe for encoding production
          URLs with sensitive parameters. No cookies, tracking, data storage, or server communication. Perfect for working
          with API keys in query strings, authentication tokens, user-generated content, internal application URLs, staging
          server endpoints, or any URLs containing confidential information. Your URLs and parameters remain 100% private
          and secure on your device. Note: URL encoding is not encryption—it only ensures safe transmission, not security.
        </p>
      </section>

      <section className="features" aria-label="Features">
        {[
          {
            icon: <Link size={24} />,
            title: "Three encode modes",
            desc: "encodeURIComponent for query values, encodeURI for full URLs, or form-urlencoded for HTML form data (spaces → +).",
          },
          {
            icon: <ShieldCheck size={24} />,
            title: "Full Unicode support",
            desc: "Correctly encodes and decodes Cyrillic, CJK, Arabic, emoji, and any other UTF-8 characters.",
          },
          {
            icon: <ArrowRight size={24} />,
            title: "Batch processing",
            desc: "Encode or decode multiple URLs or strings at once — one per line. Pinpoints the exact invalid sequence on error.",
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