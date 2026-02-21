"use client";

import { useState, useCallback } from "react";
import { EXAMPLE_JSON, EXAMPLE_CSV } from "@/lib/const";
import { jsonToCsv, csvToJson } from "./utils";
import { CloudLightning, Lock, Star, ArrowRight, ArrowLeft } from "lucide-react";

import "@/app/css/main.css";

type Mode = "json2csv" | "csv2json";

export default function JSON_CSV_CONVERTER() {
  const [mode, setMode] = useState<Mode>("json2csv");
  const [input, setInput] = useState(EXAMPLE_JSON);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [converting, setConverting] = useState(false);

  const isJson2Csv = mode === "json2csv";

  const switchMode = (next: Mode) => {
    setMode(next);
    setInput(next === "json2csv" ? EXAMPLE_JSON : EXAMPLE_CSV);
    setOutput("");
    setError("");
  };

  // Swap current output → new input, reverse direction
  const swapWithOutput = () => {
    if (!output) return;
    const next: Mode = isJson2Csv ? "csv2json" : "json2csv";
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
        if (isJson2Csv) {
          setOutput(jsonToCsv(JSON.parse(input.trim())));
        } else {
          setOutput(JSON.stringify(csvToJson(input), null, 2));
        }
      } catch (e) {
        setError((e as Error).message);
      }
      setConverting(false);
    }, 280);
  }, [input, isJson2Csv]);

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadOutput = () => {
    const ext = isJson2Csv ? "csv" : "json";
    const mime = isJson2Csv ? "text/csv;charset=utf-8;" : "application/json";
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
    setInput(isJson2Csv ? EXAMPLE_JSON : EXAMPLE_CSV);
    setOutput("");
    setError("");
  };

  const inputLabel    = isJson2Csv ? "JSON Input" : "CSV Input";
  const outputLabel   = isJson2Csv ? "CSV Output" : "JSON Output";
  const inputDot      = isJson2Csv ? "json" : "csv";
  const outputDot     = isJson2Csv ? "csv" : "json";
  const errorPrefix   = isJson2Csv ? "JSON Parse Error" : "CSV Parse Error";
  const outputPlaceholder = isJson2Csv ? "# Your CSV will appear here…" : "// Your JSON will appear here…";
  const inputPlaceholder  = isJson2Csv
    ? '[\n  { "name": "Alice", "age": 30 },\n  { "name": "Bob", "age": 25 }\n]'
    : "name,age,city\nAlice,30,Kyiv\nBob,25,Lviv";

  return (
    <>
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-eyebrow">
          <div className="hero-dot" aria-hidden="true" />
          Free · No sign-up · Runs in browser
        </div>
        <h1 id="hero-heading">
          {isJson2Csv ? <>JSON <em>→</em> CSV</> : <>CSV <em>→</em> JSON</>}
          <br />Converter
        </h1>
        <p>
          {isJson2Csv
            ? "Paste your JSON, press Convert. Supports arrays of objects and nested values."
            : "Paste your CSV, press Convert. Auto-detects headers and infers value types."
          }{" "}
          Runs 100% in your browser — nothing leaves your device.
        </p>

        {/* Mode toggle */}
        <div className="mode-toggle" role="group" aria-label="Conversion direction">
          <button
            className={`mode-btn${isJson2Csv ? " active" : ""}`}
            onClick={() => switchMode("json2csv")}
          >
            JSON → CSV
          </button>
          <button
            className="mode-swap-btn"
            onClick={() => output ? swapWithOutput() : switchMode(isJson2Csv ? "csv2json" : "json2csv")}
            title={output ? "Move output to input & flip direction" : "Flip direction"}
            aria-label="Swap conversion direction"
          >
            ⇄
          </button>
          <button
            className={`mode-btn${!isJson2Csv ? " active" : ""}`}
            onClick={() => switchMode("csv2json")}
          >
            CSV → JSON
          </button>
        </div>
      </section>

      {/* Error */}
      {error && (
        <div className="error-bar" role="alert" aria-live="assertive">
          <span aria-hidden="true">✕</span>
          <span>{errorPrefix}: {error}</span>
        </div>
      )}

      {/* Converter */}
      <section aria-label="Converter">
        <div className="converter">

          {/* Input panel */}
          <div className={`panel${error ? " has-error" : ""}`}>
            <div className="panel-header">
              <div className="panel-title">
                <div className={`dot ${inputDot}`} aria-hidden="true" />
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

          {/* Output panel */}
          <div className={`panel${output ? " has-output" : ""}`}>
            <div className="panel-header">
              <div className="panel-title">
                <div className={`dot ${outputDot}`} aria-hidden="true" />
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
                    <button
                      className="btn-ghost"
                      onClick={swapWithOutput}
                      title="Use output as new input and reverse direction"
                    >
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
              {converting ? "# Converting…" : (output || outputPlaceholder)}
            </pre>
          </div>

        </div>

        {/* Buttons */}
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
              : isJson2Csv
                ? <><ArrowRight size={16} aria-hidden="true" className="mr-1" /> Convert to CSV</>
                : <><ArrowLeft size={16} aria-hidden="true" className="mr-1" /> Convert to JSON</>
            }
          </button>
          <button className="btn-secondary" onClick={clearAll}>Clear All</button>
        </div>
      </section>

      {/* Features */}
      <section className="features" aria-label="Features">
        {[
          { icon: <CloudLightning size={24} />, title: "Instant conversion", desc: "Pure client-side processing. No latency, no rate limits, no server roundtrips." },
          { icon: <Lock size={24} />, title: "Fully private", desc: "Your data never leaves the browser. Convert sensitive configs and datasets safely." },
          { icon: <Star size={24} />, title: "Bidirectional", desc: "Convert JSON → CSV and straight back. Smart type inference restores numbers, booleans, and nulls." },
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