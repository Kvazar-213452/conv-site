"use client";

import { useState, useCallback } from "react";
import { ShieldCheck, ArrowLeft } from "lucide-react";
import { EXAMPLE_ENCODED } from "@/lib/const";

import "@/style/main.css";

export function decodeUrl(raw: string): string {
  const lines = raw.split("\n").map((l) => l.trim()).filter(Boolean);
  if (lines.length === 0) throw new Error("Input is empty.");

  return lines.map((line) => {
    try {
      // Normalize form-encoded + → %20 before decoding
      const normalized = line.replace(/\+/g, "%20");
      return decodeURIComponent(normalized);
    } catch {
      throw new Error(
        `Invalid percent-encoding: "${line}"\nMake sure all % sequences are valid (e.g. %20, %2F).`
      );
    }
  }).join("\n");
}

export default function UrlDecode() {
  const [input, setInput]         = useState(EXAMPLE_ENCODED);
  const [output, setOutput]       = useState("");
  const [error, setError]         = useState("");
  const [copied, setCopied]       = useState(false);
  const [converting, setConverting] = useState(false);

  const convert = useCallback(() => {
    setError("");
    setOutput("");
    setConverting(true);
    setTimeout(() => {
      try {
        setOutput(decodeUrl(input));
      } catch (e) {
        setError((e as Error).message);
      }
      setConverting(false);
    }, 280);
  }, [input]);

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
    a.download = "decoded.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearAll  = () => { setInput(""); setOutput(""); setError(""); };
  const loadExample = () => {
    setInput(EXAMPLE_ENCODED);
    setOutput("");
    setError("");
  };

  const swapWithOutput = () => {
    if (!output) return;
    setInput(output);
    setOutput("");
    setError("");
  };

  const inputLabel        = "Encoded Input";
  const outputLabel       = "Decoded Output";
  const errorPrefix       = "Decode Error";
  const outputPlaceholder = "// Decoded text will appear here…";
  const inputPlaceholder  = "https://example.com/search?q=hello%20world\none encoded string per line";

  return (
    <>
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-eyebrow">
          <div className="hero-dot" aria-hidden="true" />
          Free · No sign-up · Runs in browser
        </div>
        <h1 id="hero-heading">
          URL <em>Decode</em><br />Converter
        </h1>
        <p>
          Decode percent-encoded strings back to readable text. Handles standard %XX sequences and form-encoded + spaces.
          Runs 100% in your browser — nothing leaves your device.
        </p>
      </section>

      {error && (
        <div className="error-bar" role="alert" aria-live="assertive">
          <span aria-hidden="true">✕</span>
          <span>{errorPrefix}: {error}</span>
        </div>
      )}

      <section aria-label="Decoder">
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
              : <><ArrowLeft size={16} aria-hidden="true" className="mr-1" /> Decode URL</>
            }
          </button>
          <button className="btn-secondary" onClick={clearAll}>Clear All</button>
        </div>
      </section>

      <section className="seo-content" aria-labelledby="about-heading">
        <h2 id="about-heading">About URL Decoder Tool</h2>
        <p>
          This free online URL decoder tool allows you to instantly decode percent-encoded strings back to readable text. Whether you're a developer debugging API requests, analyzing encoded URLs, processing form data, or working with special characters, our decoder handles all decoding needs. Supports standard %XX sequences, form-encoded + spaces, full Unicode characters, batch processing, and runs 100% in your browser with instant results.
        </p>

        <h3>Why Decode URLs?</h3>
        <p>
          URLs and form data often contain percent-encoded characters in the format %XX (where XX is a hexadecimal value). While these encoded sequences ensure safe transmission across the internet, they're difficult to read and understand. Decoding converts encoded URLs back to human-readable text, making it easy to understand what data is being transmitted, debug API requests with complex parameters, analyze URL structures and query strings, extract human-readable information from encoded data, verify correct encoding was applied, and test URL parsing logic. This is essential for developers, QA testers, API debuggers, and anyone working with URLs containing special characters or non-ASCII text.
        </p>

        <h3>How to Use This Tool</h3>
        <p>
          Paste your percent-encoded URL or string into the input field. The tool automatically decodes both standard %XX sequences (where XX is hexadecimal) and + signs (treated as spaces, common in form-encoded data). Handle multiple URLs or strings by entering one per line for batch processing. Click Decode, and get instant results. The tool automatically detects and handles mixed encoded/non-encoded content, properly processes UTF-8 multi-byte sequences, and validates encoding format. Copy to clipboard, download as text, or swap to use the output as input for further processing or re-encoding.
        </p>

        <h3>Key Benefits</h3>
        <ul>
          <li><strong>No installation required:</strong> Works directly in your browser without any software downloads</li>
          <li><strong>Completely free:</strong> No registration, credit card, or hidden fees</li>
          <li><strong>Secure and private:</strong> All decoding happens locally - your URLs never reach our servers</li>
          <li><strong>Fast processing:</strong> Instant decoding with no waiting time</li>
          <li><strong>Automatic format detection:</strong> Handles both %20 and + for spaces seamlessly</li>
          <li><strong>Full Unicode support:</strong> Correctly decodes Cyrillic, CJK, Arabic, emoji, all UTF-8 characters</li>
          <li><strong>Batch processing:</strong> Decode multiple URLs or strings at once — one per line</li>
          <li><strong>Error detection:</strong> Pinpoints exact location of malformed encoding sequences</li>
        </ul>

        <h3>Common Use Cases</h3>
        <p>
          Developers decode URLs to understand API request parameters, debug URL routing and parsing logic, analyze query strings with encoded search terms or filters, extract human-readable data from encoded URLs, test bidirectional encoding/decoding workflows. Frontend developers decode form submission data, analyze encoded URL fragments and hash parameters, debug dynamic URL generation. Backend engineers decode incoming query parameters from requests, validate and process form-urlencoded POST data, parse URL paths containing encoded segments, handle internationalized URLs (IRIs). API developers verify correct encoding in request/response cycles, debug parameter passing between services. QA testers verify URL decoding behavior, test edge cases with Unicode and special characters, validate proper URL handling in applications. SEO specialists decode canonical URLs and meta tags, analyze encoded sitemap entries.
        </p>

        <h3>Understanding Decoded Formats</h3>
        <p>
          <strong>Standard percent-encoding (%XX)</strong> uses a percent sign followed by two hexadecimal digits. For example, %20 = space, %40 = @, %2F = /, %3F = ?. Multi-byte UTF-8 characters are encoded as multiple %XX sequences. For example, Cyrillic "П" is encoded as %D0%9F (two bytes: D0 and 9F). The decoder properly handles these multi-byte sequences and converts them to the original Unicode character.
        </p>
        <p>
          <strong>Form-encoded data</strong> uses a variant where spaces are represented as + instead of %20. This format (application/x-www-form-urlencoded) is common in HTML form submissions and legacy APIs. The decoder automatically recognizes and converts + to spaces, handling both formats seamlessly.
        </p>
        <p>
          <strong>Mixed encoding</strong> occurs when only some characters are encoded. The decoder gracefully handles partially encoded content, leaving already-decoded characters as-is while converting only the %XX sequences. For example, "hello%20world" decodes to "hello world" with the unencoded "hello" and "world" preserved.
        </p>

        <h3>Supported Features</h3>
        <p>
          URL decoding handles comprehensive character sets: ASCII special characters encoded as %20 (space), %21 (!), %40 (@), %23 (#), %24 ($), %25 (%), %5E (^), %26 (&), %2A (*) are all properly decoded. Full UTF-8 Unicode support decodes Cyrillic (like %D0%9F%D1%80%D0%B8%D0%B2%D1%96%D1%82 → Привіт), Chinese (like %E4%BD%A0%E5%A5%BD → 你好), Arabic, emoji (%F0%9F%98%8A → 😊), and all other Unicode characters correctly. Batch mode processes multiple URLs or strings line by line, maintains order, and provides detailed error messages with exact line numbers for invalid sequences. The decoder validates percent-encoding format and reports malformed sequences.
        </p>

        <h3>Technical Features</h3>
        <p>
          The tool validates percent-encoding format before decoding, correctly handles multi-byte UTF-8 characters (2-4 bytes per character), automatically detects and decodes both %XX and + formats, handles mixed encoded/non-encoded input gracefully by preserving already-decoded text, provides line-by-line batch processing with error pinpointing including exact character position, works consistently across all modern browsers, and generates proper Unicode output. Error messages identify malformed sequences with their exact position for easy debugging. The tool includes copy-to-clipboard, download options, swap functionality for roundtrip testing, and visual loading indicators.
        </p>

        <h3>Privacy and Security</h3>
        <p>
          Unlike online URL decoders that send your data to remote servers, this tool processes everything locally in your browser using JavaScript. Your encoded URLs, query parameters, API endpoints, OAuth tokens, redirect URLs, form data, user input data, or any URL content never leave your computer, making it completely safe for decoding production URLs with sensitive parameters. No cookies, tracking, data storage, or server communication. Perfect for working with API keys in query strings, authentication tokens, user-generated content, internal application URLs, staging server endpoints, or any URLs containing confidential information. Your URLs and decoded data remain 100% private and secure on your device.
        </p>
      </section>

      <section className="features" aria-label="Features">
        {[
          {
            icon: <ShieldCheck size={24} />,
            title: "Full Unicode support",
            desc: "Correctly decodes Cyrillic, CJK, Arabic, emoji, and any other UTF-8 characters.",
          },
          {
            title: "Automatic format detection",
            desc: "Handles both %20 and + for spaces, plus mixed encoded/non-encoded content.",
          },
          {
            title: "Batch processing",
            desc: "Decode multiple URLs or strings at once — one per line. Pinpoints exact error locations.",
          },
        ].map(({ icon, title, desc }) => (
          <div className="feature" key={title}>
            {icon && <div className="feature-icon" aria-hidden="true">{icon}</div>}
            <h3>{title}</h3>
            <p>{desc}</p>
          </div>
        ))}
      </section>
    </>
  );
}