"use client";

import { useState, useCallback } from "react";
import { EXAMPLE_JSON, EXAMPLE_SQL } from "@/lib/const";
import { jsonToPostgres, postgresInsertToJson } from "./utils";
import { CloudLightning, Lock, Star, ArrowRight, ArrowLeft } from "lucide-react";

import "@/app/css/main.css";

type Mode = "json2sql" | "sql2json";

export default function JSON_TO_POSTGRES() {
  const [mode, setMode] = useState<Mode>("json2sql");
  const [input, setInput] = useState(EXAMPLE_JSON);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [converting, setConverting] = useState(false);

  const isJson2Sql = mode === "json2sql";

  const switchMode = (next: Mode) => {
    setMode(next);
    setInput(next === "json2sql" ? EXAMPLE_JSON : EXAMPLE_SQL);
    setOutput("");
    setError("");
  };

  const swapWithOutput = () => {
    if (!output) return;
    const next: Mode = isJson2Sql ? "sql2json" : "json2sql";
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
        if (isJson2Sql) {
          setOutput(jsonToPostgres(JSON.parse(input.trim())));
        } else {
          setOutput(JSON.stringify(postgresInsertToJson(input), null, 2));
        }
      } catch (e) {
        setError((e as Error).message);
      }
      setConverting(false);
    }, 280);
  }, [input, isJson2Sql]);

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadOutput = () => {
    const ext = isJson2Sql ? "sql" : "json";
    const mime = isJson2Sql ? "text/plain;charset=utf-8;" : "application/json";
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
    setInput(isJson2Sql ? EXAMPLE_JSON : EXAMPLE_SQL);
    setOutput("");
    setError("");
  };

  const inputLabel        = isJson2Sql ? "JSON Input" : "SQL Input";
  const outputLabel       = isJson2Sql ? "PostgreSQL Output" : "JSON Output";
  const errorPrefix       = isJson2Sql ? "JSON Parse Error" : "SQL Parse Error";
  const outputPlaceholder = isJson2Sql
    ? "-- Your INSERT statements will appear here…"
    : "// Your JSON will appear here…";
  const inputPlaceholder  = isJson2Sql
    ? '[\n  { "name": "Alice", "age": 30, "email": "alice@example.com" },\n  { "name": "Bob",   "age": 25, "email": "bob@example.com"   }\n]'
    : 'INSERT INTO "users" ("name", "age")\nVALUES\n  (\'Alice\', 30),\n  (\'Bob\', 25);';

  return (
    <>
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-eyebrow">
          <div className="hero-dot" aria-hidden="true" />
          Free · No sign-up · Runs in browser
        </div>
        <h1 id="hero-heading">
          {isJson2Sql
            ? <>JSON <em>→</em> PostgreSQL</>
            : <>SQL <em>→</em> JSON</>}
          <br />INSERT Generator
        </h1>
        <p>
          {isJson2Sql
            ? "Paste your JSON array, get ready-to-run PostgreSQL INSERT statements with proper quoting and type casting."
            : "Paste your INSERT statement, get back a clean JSON array of row objects."
          }{" "}
          Runs 100% in your browser — nothing leaves your device.
        </p>

        {/* Mode toggle */}
        <div className="mode-toggle" role="group" aria-label="Conversion direction">
          <button
            className={`mode-btn${isJson2Sql ? " active" : ""}`}
            onClick={() => switchMode("json2sql")}
          >
            JSON → SQL
          </button>
          <button
            className="mode-swap-btn"
            onClick={() => output ? swapWithOutput() : switchMode(isJson2Sql ? "sql2json" : "json2sql")}
            title={output ? "Move output to input & flip direction" : "Flip direction"}
            aria-label="Swap conversion direction"
          >
            ⇄
          </button>
          <button
            className={`mode-btn${!isJson2Sql ? " active" : ""}`}
            onClick={() => switchMode("sql2json")}
          >
            SQL → JSON
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
                <div className={`dot ${isJson2Sql ? "json" : "sql"}`} aria-hidden="true" />
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
                <div className={`dot ${isJson2Sql ? "sql" : "json"}`} aria-hidden="true" />
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
              {converting ? "-- Generating SQL…" : (output || outputPlaceholder)}
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
              : isJson2Sql
                ? <><ArrowRight size={16} aria-hidden="true" className="mr-1" /> Generate INSERT</>
                : <><ArrowLeft size={16} aria-hidden="true" className="mr-1" /> Convert to JSON</>
            }
          </button>
          <button className="btn-secondary" onClick={clearAll}>Clear All</button>
        </div>
      </section>

      {/* Features */}
      <section className="features" aria-label="Features">
        {[
          { icon: <CloudLightning size={24} />, title: "Batch INSERT", desc: "Generates a single multi-row INSERT for maximum performance — no separate statement per row." },
          { icon: <Lock size={24} />, title: "Fully private", desc: "Your data never leaves the browser. Safely convert real records and sensitive payloads." },
          { icon: <Star size={24} />, title: "Type-aware quoting", desc: "Strings are escaped and quoted, numbers and booleans are unquoted, nulls become NULL, dates cast to timestamptz." },
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