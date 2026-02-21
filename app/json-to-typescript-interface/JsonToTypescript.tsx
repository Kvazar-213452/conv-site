"use client";

import { useState, useCallback } from "react";
import { EXAMPLE_JSON, EXAMPLE_TS } from "@/lib/const";
import { jsonToTypescript, typescriptToJson } from "./utils";
import { Braces, FileCode, ArrowRight, ArrowLeft, Repeat2 } from "lucide-react";

import "@/app/css/main.css";

type Mode = "json2ts" | "ts2json";

// ── Component ─────────────────────────────────────────────────

export default function JsonToTypescript() {
  const [mode, setMode] = useState<Mode>("json2ts");
  const [input, setInput] = useState(EXAMPLE_JSON);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [converting, setConverting] = useState(false);

  const isJson2Ts = mode === "json2ts";

  const switchMode = (next: Mode) => {
    setMode(next);
    setInput(next === "json2ts" ? EXAMPLE_JSON : EXAMPLE_TS);
    setOutput("");
    setError("");
  };

  const swapWithOutput = () => {
    if (!output) return;
    const next: Mode = isJson2Ts ? "ts2json" : "json2ts";
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
        if (isJson2Ts) {
          setOutput(jsonToTypescript(JSON.parse(input.trim())));
        } else {
          setOutput(JSON.stringify(typescriptToJson(input), null, 2));
        }
      } catch (e) {
        setError((e as Error).message);
      }
      setConverting(false);
    }, 280);
  }, [input, isJson2Ts]);

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadOutput = () => {
    const ext = isJson2Ts ? "ts" : "json";
    const mime = isJson2Ts ? "text/plain;charset=utf-8;" : "application/json";
    const blob = new Blob([output], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `output.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearAll = () => { setInput(""); setOutput(""); setError(""); };
  const loadExample = () => {
    setInput(isJson2Ts ? EXAMPLE_JSON : EXAMPLE_TS);
    setOutput("");
    setError("");
  };

  const inputLabel        = isJson2Ts ? "JSON Input" : "TypeScript Input";
  const outputLabel       = isJson2Ts ? "TypeScript Output" : "JSON Output";
  const errorPrefix       = isJson2Ts ? "JSON Parse Error" : "TS Parse Error";
  const outputPlaceholder = isJson2Ts
    ? "// Your TypeScript interfaces will appear here…"
    : "// Your JSON skeleton will appear here…";
  const inputPlaceholder  = isJson2Ts
    ? '[\n  { "id": 1, "name": "Alice", "active": true }\n]'
    : 'interface User {\n  id: number;\n  name: string;\n  active: boolean;\n}';

  return (
    <>

      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-eyebrow">
          <div className="hero-dot" aria-hidden="true" />
          Free · No sign-up · Runs in browser
        </div>
        <h1 id="hero-heading">
          {isJson2Ts
            ? <>JSON <em>→</em> TypeScript</>
            : <>TypeScript <em>→</em> JSON</>}
          <br />Interface Generator
        </h1>
        <p>
          {isJson2Ts
            ? "Paste your JSON array or object and get accurate, ready-to-use TypeScript interfaces with proper types, optional fields, and nested structures."
            : "Paste your TypeScript interfaces and get back a matching JSON skeleton with placeholder values."
          }{" "}
          Runs 100% in your browser — nothing leaves your device.
        </p>

        <div className="mode-toggle" role="group" aria-label="Conversion direction">
          <button
            className={`mode-btn${isJson2Ts ? " active" : ""}`}
            onClick={() => switchMode("json2ts")}
          >
            JSON → TS
          </button>
          <button
            className="mode-swap-btn"
            onClick={() => output ? swapWithOutput() : switchMode(isJson2Ts ? "ts2json" : "json2ts")}
            title={output ? "Move output to input & flip direction" : "Flip direction"}
            aria-label="Swap conversion direction"
          >
            ⇄
          </button>
          <button
            className={`mode-btn${!isJson2Ts ? " active" : ""}`}
            onClick={() => switchMode("ts2json")}
          >
            TS → JSON
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
                <div className={`dot ${isJson2Ts ? "json" : "ts"}`} aria-hidden="true" />
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
                <div className={`dot ${isJson2Ts ? "ts" : "json"}`} aria-hidden="true" />
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
              {converting ? "// Generating interfaces…" : (output || outputPlaceholder)}
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
              : isJson2Ts
                ? <><ArrowRight size={16} aria-hidden="true" className="mr-1" /> Generate Interface</>
                : <><ArrowLeft size={16} aria-hidden="true" className="mr-1" /> Convert to JSON</>
            }
          </button>
          <button className="btn-secondary" onClick={clearAll}>Clear All</button>
        </div>
      </section>

      <section className="features" aria-label="Features">
        {[
          {
            icon: <FileCode size={24} />,
            title: "Smart type inference",
            desc: "Strings, numbers, booleans, Date (ISO), arrays, nested objects and JSONB — all detected and typed accurately.",
          },
          {
            icon: <Braces size={24} />,
            title: "Optional fields",
            desc: "When converting arrays, keys missing or null in any row become optional (?) in the generated interface.",
          },
          {
            icon: <Repeat2 size={24} />,
            title: "Bidirectional",
            desc: "Convert JSON → TypeScript interfaces, or paste existing interfaces to get a JSON skeleton back.",
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