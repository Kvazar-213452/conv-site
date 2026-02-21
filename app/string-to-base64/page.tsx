"use client";

import { useState, useCallback } from "react";
import { stringToBase64, base64ToString } from "./utils";
import { KeyRound, Globe, ArrowRight, ArrowLeft } from "lucide-react";

import "@/app/css/main.css";

// ── Examples ──────────────────────────────────────────────────

const EXAMPLE_STRING = `Hello, World!
Привіт, Світе!
{"token":"abc123","expires":3600}`;

const EXAMPLE_BASE64 = `SGVsbG8sIFdvcmxkIQ==
0J/RgNC40LLRltGCLCDQodCy0ZbRgtC1IQ==
eyJ0b2tlbiI6ImFiYzEyMyIsImV4cGlyZXMiOjM2MDB9`;

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

  const inputLabel        = isStr2B64 ? "String Input" : "Base64 Input";
  const outputLabel       = isStr2B64 ? "Base64 Output" : "String Output";
  const errorPrefix       = isStr2B64 ? "Encode Error" : "Decode Error";
  const outputPlaceholder = isStr2B64
    ? "// Base64-encoded strings will appear here…"
    : "// Decoded strings will appear here…";
  const inputPlaceholder  = isStr2B64
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