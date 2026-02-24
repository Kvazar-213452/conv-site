"use client";

import { useState, useCallback } from "react";
import { uuidsToBase64, base64sToUuid } from "./utils";
import { Hash, ShieldCheck, ArrowRight, ArrowLeft } from "lucide-react";
import { EXAMPLE_UUID, EXAMPLE_BASE641 as EXAMPLE_BASE64 } from "@/lib/const";

import "@/app/css/main.css";

type Mode = "uuid2b64" | "b642uuid";

export default function UuidToBase64() {
  const [mode, setMode] = useState<Mode>("uuid2b64");
  const [input, setInput] = useState(EXAMPLE_UUID);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [converting, setConverting] = useState(false);
  const [urlSafe, setUrlSafe] = useState(false);

  const isUuid2B64 = mode === "uuid2b64";

  const switchMode = (next: Mode) => {
    setMode(next);
    setInput(next === "uuid2b64" ? EXAMPLE_UUID : EXAMPLE_BASE64);
    setOutput("");
    setError("");
  };

  const swapWithOutput = () => {
    if (!output) return;
    const next: Mode = isUuid2B64 ? "b642uuid" : "uuid2b64";
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
        if (isUuid2B64) {
          setOutput(uuidsToBase64(input, urlSafe));
        } else {
          setOutput(base64sToUuid(input));
        }
      } catch (e) {
        setError((e as Error).message);
      }
      setConverting(false);
    }, 280);
  }, [input, isUuid2B64, urlSafe]);

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadOutput = () => {
    const ext = isUuid2B64 ? "txt" : "txt";
    const blob = new Blob([output], { type: "text/plain;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `output.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearAll = () => { setInput(""); setOutput(""); setError(""); };
  const loadExample = () => {
    setInput(isUuid2B64 ? EXAMPLE_UUID : EXAMPLE_BASE64);
    setOutput("");
    setError("");
  };

  const inputLabel        = isUuid2B64 ? "UUID Input" : "Base64 Input";
  const outputLabel       = isUuid2B64 ? "Base64 Output" : "UUID Output";
  const errorPrefix       = isUuid2B64 ? "UUID Error" : "Base64 Error";
  const outputPlaceholder = isUuid2B64
    ? "// Base64-encoded UUIDs will appear here…"
    : "// Decoded UUIDs will appear here…";
  const inputPlaceholder  = isUuid2B64
    ? "550e8400-e29b-41d4-a716-446655440000\none UUID per line"
    : "VQ6EAOKbQdSnFkRmVUQAAA==\none Base64 per line";

  return (
    <>
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-eyebrow">
          <div className="hero-dot" aria-hidden="true" />
          Free · No sign-up · Runs in browser
        </div>
        <h1 id="hero-heading">
          {isUuid2B64
            ? <>UUID <em>→</em> Base64</>
            : <>Base64 <em>→</em> UUID</>}
          <br />Converter
        </h1>
        <p>
          {isUuid2B64
            ? "Paste UUIDs (one per line) and get compact 22-character Base64 strings — standard or URL-safe. Perfect for databases, URLs, and APIs."
            : "Paste Base64-encoded UUIDs (standard or URL-safe) and get back the original UUID format with hyphens."
          }{" "}
          Runs 100% in your browser — nothing leaves your device.
        </p>

        <div className="mode-toggle" role="group" aria-label="Conversion direction">
          <button
            className={`mode-btn${isUuid2B64 ? " active" : ""}`}
            onClick={() => switchMode("uuid2b64")}
          >
            UUID → Base64
          </button>
          <button
            className="mode-swap-btn"
            onClick={() => output ? swapWithOutput() : switchMode(isUuid2B64 ? "b642uuid" : "uuid2b64")}
            title={output ? "Move output to input & flip direction" : "Flip direction"}
            aria-label="Swap conversion direction"
          >
            ⇄
          </button>
          <button
            className={`mode-btn${!isUuid2B64 ? " active" : ""}`}
            onClick={() => switchMode("b642uuid")}
          >
            Base64 → UUID
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

        {/* URL-safe toggle (only relevant for UUID → Base64) */}
        {isUuid2B64 && (
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
              : isUuid2B64
                ? <><ArrowRight size={16} aria-hidden="true" className="mr-1" /> Encode to Base64</>
                : <><ArrowLeft size={16} aria-hidden="true" className="mr-1" /> Decode to UUID</>
            }
          </button>
          <button className="btn-secondary" onClick={clearAll}>Clear All</button>
        </div>
      </section>

      <section className="seo-content" aria-labelledby="about-heading">
        <h2 id="about-heading">About UUID to Base64 Converter</h2>
        <p>
          This free online UUID to Base64 converter tool allows you to convert UUIDs (Universally Unique Identifiers)
          to compact Base64-encoded strings and decode them back instantly. Whether you're a developer optimizing database
          storage, shortening URLs with UUID identifiers, building API tokens, or migrating data between systems, our
          bidirectional converter reduces 36-character UUIDs (with hyphens) to 22-character Base64 strings—saving 39%
          space. Supports standard and URL-safe Base64 encoding, batch processing, and runs 100% in your browser with
          instant conversion.
        </p>

        <h3>Why Convert UUIDs to Base64?</h3>
        <p>
          UUIDs are standard 128-bit identifiers represented as 36-character strings with hyphens
          (550e8400-e29b-41d4-a716-446655440000). While excellent for uniqueness and distribution, they're verbose for
          URLs, database indexes, and APIs. Converting UUIDs to Base64 reduces length from 36 to 22 characters (39% space
          savings), creates more compact URLs and API responses, improves database index efficiency, reduces bandwidth and
          storage costs, makes identifiers easier to copy/paste, and maintains full UUID uniqueness and reversibility.
          This is essential for public-facing URLs (example.com/p/VQ6EAOKbQdSnFkRmVUQAAA instead of
          example.com/p/550e8400-e29b-41d4-a716-446655440000), REST API endpoints, QR codes with UUID data, mobile apps
          with bandwidth constraints, and high-volume database tables.
        </p>

        <h3>How to Use This Converter</h3>
        <p>
          Choose your conversion direction: UUID → Base64 mode converts standard UUID format (8-4-4-4-12 hexadecimal with
          hyphens) into compact 22-character Base64 strings—optionally enable URL-safe encoding (replaces + with -, / with _,
          removes padding) for use in URLs, filenames, and query parameters. Base64 → UUID mode decodes Base64-encoded UUIDs
          (standard or URL-safe) back to canonical UUID format with hyphens. Paste your UUIDs or Base64 strings into the
          input field (one per line for batch processing), click Encode or Decode, and get instant results. Copy to clipboard
          for immediate use, download as text, or swap to reverse the conversion and decode what you just encoded.
        </p>

        <h3>Key Benefits</h3>
        <ul>
          <li><strong>No installation required:</strong> Works directly in your browser without any software downloads</li>
          <li><strong>Completely free:</strong> No registration, credit card, or hidden fees</li>
          <li><strong>Secure and private:</strong> All conversion happens locally - your UUIDs never reach our servers</li>
          <li><strong>Fast processing:</strong> Instant encoding and decoding with no waiting time</li>
          <li><strong>39% space savings:</strong> 36-character UUIDs become 22-character Base64 strings</li>
          <li><strong>Bidirectional:</strong> Convert UUID ↔ Base64 with perfect reversibility</li>
          <li><strong>URL-safe option:</strong> Standard or URL-safe Base64 for different use cases</li>
          <li><strong>Batch processing:</strong> Convert hundreds of UUIDs simultaneously (one per line)</li>
        </ul>

        <h3>Common Use Cases</h3>
        <p>
          Developers use UUID to Base64 conversion for shortening public-facing URLs with UUID identifiers (blog posts,
          products, user profiles), creating compact REST API endpoints and resource identifiers, building shorter API
          tokens and session identifiers, optimizing database indexes and foreign keys for better performance, reducing
          JSON payload sizes in API responses, generating compact QR codes with UUID data, shortening mobile deep links
          and share URLs, migrating from UUID to shorter identifiers without breaking uniqueness. Database administrators
          optimize table indexes by storing UUIDs as Base64 BINARY(16) instead of VARCHAR(36), reduce row size and improve
          query performance, save storage space in high-volume tables (millions of rows), maintain referential integrity
          with compact foreign keys. API developers create shorter authentication tokens, build compact webhook signatures,
          generate short-lived access codes, create user-friendly share links. Mobile app developers reduce bandwidth usage
          in API responses, create compact push notification payloads, optimize local database storage. DevOps engineers
          shorten container IDs and build IDs in logs, create compact Kubernetes resource names, optimize monitoring and
          logging systems.
        </p>

        <h3>UUID Format and Standards</h3>
        <p>
          UUIDs (defined in RFC 4122) are 128-bit identifiers represented as 32 hexadecimal digits in 8-4-4-4-12 format with
          hyphens: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx. Common UUID versions include: UUIDv1 (timestamp-based),
          UUIDv4 (random), UUIDv5 (namespace + SHA-1 hash), and UUIDv7 (timestamp + random, newest standard). All versions
          are exactly 128 bits (16 bytes) and convert identically to Base64. The conversion process: remove hyphens (32 hex
          chars → 16 bytes), encode 16 bytes as Base64 (produces 24 characters including padding), remove padding for
          compact 22-character result. The conversion is lossless and fully reversible—every UUID has exactly one Base64
          representation and vice versa, maintaining uniqueness guarantees and collision resistance.
        </p>

        <h3>Standard vs URL-Safe Base64</h3>
        <p>
          Standard Base64 uses A-Z, a-z, 0-9, +, /, and = for padding. For UUIDs, this produces 22 characters plus 2 padding
          characters (==), totaling 24 characters. However, + and / are problematic in URLs and filenames. URL-safe Base64
          (RFC 4648 §5) replaces + with -, / with _, and removes padding entirely, resulting in exactly 22 characters safe
          for URLs, filenames, and query parameters. Use standard Base64 for database storage (BINARY columns), JSON payloads,
          internal systems, and Base64 fields in protocols. Use URL-safe Base64 for public URLs and routes, query parameters
          and fragments, filenames and paths, OAuth tokens in URLs, QR codes and shortened links, and any scenario where +, /,
          or = would be problematic. Our tool supports both formats and automatically detects the type during decoding.
        </p>

        <h3>Technical Features</h3>
        <p>
          The converter validates UUID format (8-4-4-4-12 with hyphens, case-insensitive hexadecimal), handles both lowercase
          and uppercase UUIDs, removes hyphens and converts to binary (16 bytes), encodes bytes as Base64 using browser-native
          APIs, optionally generates URL-safe Base64 (- _ instead of + /, no padding), validates Base64 input during decode
          (proper length, valid characters), reconstructs 16-byte binary from Base64, formats output as canonical UUID with
          lowercase hex and hyphens, supports batch processing with line-by-line conversion, provides detailed error messages
          for invalid UUIDs or Base64 strings, and handles edge cases correctly. The tool includes copy-to-clipboard, download
          options, swap functionality for roundtrip verification, and clear error reporting pinpointing exact invalid input.
        </p>

        <h3>Privacy and Security</h3>
        <p>
          Unlike online converters that upload your data to remote servers, this tool processes everything locally in your
          browser using JavaScript. Your UUIDs (user IDs, session tokens, resource identifiers, database keys, API tokens,
          authentication credentials) never leave your computer, making it completely safe for converting production identifiers
          and sensitive UUIDs. No cookies, tracking, data storage, or server communication. Perfect for working with user account
          UUIDs, session identifiers, API keys, database primary keys, order IDs, transaction references, or any identifiers
          that require strict privacy controls. Your UUIDs and identifiers remain 100% private and secure on your device.
          Note: Base64 encoding provides no security—it only changes representation, not confidentiality.
        </p>
      </section>

      <section className="features" aria-label="Features">
        {[
          {
            icon: <Hash size={24} />,
            title: "Batch conversion",
            desc: "Convert multiple UUIDs or Base64 strings at once — just paste them one per line. Perfect for bulk data migrations.",
          },
          {
            icon: <ShieldCheck size={24} />,
            title: "Fully private",
            desc: "All conversion happens in your browser using native APIs. Your UUIDs and tokens never leave your device.",
          },
          {
            icon: <ArrowRight size={24} />,
            title: "Standard & URL-safe",
            desc: "Choose between standard Base64 (+, /, ==) or URL-safe Base64 (-, _, no padding) — both decode back cleanly.",
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