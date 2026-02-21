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