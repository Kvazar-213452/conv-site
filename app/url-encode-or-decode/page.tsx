"use client";

import { useState, useCallback } from "react";
import { encodeUrl, decodeUrl } from "./utils";
import { Link, ShieldCheck, ArrowRight, ArrowLeft } from "lucide-react";

import "@/app/css/main.css";

// ── Examples ──────────────────────────────────────────────────

const EXAMPLE_PLAIN = `https://example.com/search?q=hello world&lang=uk&tag=привіт
user@example.com
price=100$&discount=20%`;

const EXAMPLE_ENCODED = `https://example.com/search?q=hello%20world&lang=uk&tag=%D0%BF%D1%80%D0%B8%D0%B2%D1%96%D1%82
user%40example.com
price%3D100%24%26discount%3D20%25`;

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