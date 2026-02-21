"use client";

import { useState, useCallback } from "react";
import { EXAMPLE_JSON, EXAMPLE_PRISMA } from "@/lib/const";
import { jsonToPrisma, prismaToJson } from "./utils";
import { CloudLightning, Lock, Star, ArrowRight, ArrowLeft } from "lucide-react";

import "@/app/css/main.css";

type Mode = "json2prisma" | "prisma2json";

export default function JSON_TO_PRISMA() {
  const [mode, setMode] = useState<Mode>("json2prisma");
  const [input, setInput] = useState(EXAMPLE_JSON);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [converting, setConverting] = useState(false);

  const isJson2Prisma = mode === "json2prisma";

  const switchMode = (next: Mode) => {
    setMode(next);
    setInput(next === "json2prisma" ? EXAMPLE_JSON : EXAMPLE_PRISMA);
    setOutput("");
    setError("");
  };

  const swapWithOutput = () => {
    if (!output) return;
    const next: Mode = isJson2Prisma ? "prisma2json" : "json2prisma";
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
        if (isJson2Prisma) {
          setOutput(jsonToPrisma(JSON.parse(input.trim())));
        } else {
          setOutput(JSON.stringify(prismaToJson(input), null, 2));
        }
      } catch (e) {
        setError((e as Error).message);
      }
      setConverting(false);
    }, 280);
  }, [input, isJson2Prisma]);

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadOutput = () => {
    const ext = isJson2Prisma ? "prisma" : "json";
    const blob = new Blob([output], { type: "text/plain;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `schema.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearAll = () => { setInput(""); setOutput(""); setError(""); };
  const loadExample = () => {
    setInput(isJson2Prisma ? EXAMPLE_JSON : EXAMPLE_PRISMA);
    setOutput("");
    setError("");
  };

  const inputLabel        = isJson2Prisma ? "JSON Input" : "Prisma Schema Input";
  const outputLabel       = isJson2Prisma ? "Prisma Schema Output" : "JSON Output";
  const errorPrefix       = isJson2Prisma ? "JSON Parse Error" : "Prisma Parse Error";
  const outputPlaceholder = isJson2Prisma
    ? "// Your Prisma schema will appear here…"
    : "// Your JSON will appear here…";
  const inputPlaceholder  = isJson2Prisma
    ? '{\n  "User": {\n    "name": "Alice",\n    "age": 30,\n    "email": "alice@example.com"\n  }\n}'
    : 'model User {\n  id   Int    @id @default(autoincrement())\n  name String\n}';

  return (
    <>
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-eyebrow">
          <div className="hero-dot" aria-hidden="true" />
          Free · No sign-up · Runs in browser
        </div>
        <h1 id="hero-heading">
          {isJson2Prisma
            ? <>JSON <em>→</em> Prisma</>
            : <>Prisma <em>→</em> JSON</>}
          <br />Schema Converter
        </h1>
        <p>
          {isJson2Prisma
            ? "Paste your JSON object or array, get a ready-to-use Prisma schema with inferred types, relations, and decorators."
            : "Paste your Prisma schema, get a JSON structure that reflects your models and field types."
          }{" "}
          Runs 100% in your browser — nothing leaves your device.
        </p>

        {/* Mode toggle */}
        <div className="mode-toggle" role="group" aria-label="Conversion direction">
          <button
            className={`mode-btn${isJson2Prisma ? " active" : ""}`}
            onClick={() => switchMode("json2prisma")}
          >
            JSON → Prisma
          </button>
          <button
            className="mode-swap-btn"
            onClick={() => output ? swapWithOutput() : switchMode(isJson2Prisma ? "prisma2json" : "json2prisma")}
            title={output ? "Move output to input & flip direction" : "Flip direction"}
            aria-label="Swap conversion direction"
          >
            ⇄
          </button>
          <button
            className={`mode-btn${!isJson2Prisma ? " active" : ""}`}
            onClick={() => switchMode("prisma2json")}
          >
            Prisma → JSON
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
                <div className={`dot ${isJson2Prisma ? "json" : "prisma"}`} aria-hidden="true" />
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
                <div className={`dot ${isJson2Prisma ? "prisma" : "json"}`} aria-hidden="true" />
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
              {converting ? "// Generating schema…" : (output || outputPlaceholder)}
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
              : isJson2Prisma
                ? <><ArrowRight size={16} aria-hidden="true" className="mr-1" /> Generate Schema</>
                : <><ArrowLeft size={16} aria-hidden="true" className="mr-1" /> Convert to JSON</>
            }
          </button>
          <button className="btn-secondary" onClick={clearAll}>Clear All</button>
        </div>
      </section>

      {/* Features */}
      <section className="features" aria-label="Features">
        {[
          { icon: <CloudLightning size={24} />, title: "Smart type inference", desc: "Automatically maps JSON types to Prisma: String, Int, Float, Boolean, DateTime, and nested model relations." },
          { icon: <Lock size={24} />, title: "Fully private", desc: "Your data never leaves the browser. Safely convert real schemas and sensitive data structures." },
          { icon: <Star size={24} />, title: "Relations & decorators", desc: "Detects nested objects as related models, arrays as one-to-many, and adds @id, @default, @unique where appropriate." },
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