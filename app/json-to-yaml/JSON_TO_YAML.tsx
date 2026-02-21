"use client";

import { useState, useCallback } from "react";
import { EXAMPLE_JSON, EXAMPLE_YAML } from "@/lib/const";
import { jsonToYaml, yamlToJson } from "./utils";
import { CloudLightning, Lock, Star, ArrowRight, ArrowLeft } from "lucide-react";

import "@/app/css/main.css";

type Mode = "json2yaml" | "yaml2json";

export default function JSON_TO_YAML() {
  const [mode, setMode] = useState<Mode>("json2yaml");
  const [input, setInput] = useState(EXAMPLE_JSON);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [converting, setConverting] = useState(false);

  const isJson2Yaml = mode === "json2yaml";

  const switchMode = (next: Mode) => {
    setMode(next);
    setInput(next === "json2yaml" ? EXAMPLE_JSON : EXAMPLE_YAML);
    setOutput("");
    setError("");
  };

  const swapWithOutput = () => {
    if (!output) return;
    const next: Mode = isJson2Yaml ? "yaml2json" : "json2yaml";
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
        if (isJson2Yaml) {
          setOutput(jsonToYaml(JSON.parse(input.trim())));
        } else {
          setOutput(JSON.stringify(yamlToJson(input), null, 2));
        }
      } catch (e) {
        setError((e as Error).message);
      }
      setConverting(false);
    }, 280);
  }, [input, isJson2Yaml]);

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadOutput = () => {
    const ext = isJson2Yaml ? "yaml" : "json";
    const mime = isJson2Yaml ? "text/yaml;charset=utf-8;" : "application/json";
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
    setInput(isJson2Yaml ? EXAMPLE_JSON : EXAMPLE_YAML);
    setOutput("");
    setError("");
  };

  const inputLabel        = isJson2Yaml ? "JSON Input" : "YAML Input";
  const outputLabel       = isJson2Yaml ? "YAML Output" : "JSON Output";
  const errorPrefix       = isJson2Yaml ? "JSON Parse Error" : "YAML Parse Error";
  const outputPlaceholder = isJson2Yaml ? "# Your YAML will appear here…" : "// Your JSON will appear here…";
  const inputPlaceholder  = isJson2Yaml
    ? '{\n  "key": "value"\n}'
    : "key: value\nlist:\n  - item1\n  - item2";

  return (
    <>
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-eyebrow">
          <div className="hero-dot" aria-hidden="true" />
          Free · No sign-up · Runs in browser
        </div>
        <h1 id="hero-heading">
          {isJson2Yaml ? <>JSON <em>→</em> YAML</> : <>YAML <em>→</em> JSON</>}
          <br />Converter
        </h1>
        <p>
          {isJson2Yaml
            ? "Paste your JSON, press Convert. Runs 100% in your browser — nothing leaves your device."
            : "Paste your YAML, press Convert. Auto-parses keys, lists, and scalar types."
          }
        </p>

        {/* Mode toggle */}
        <div className="mode-toggle" role="group" aria-label="Conversion direction">
          <button
            className={`mode-btn${isJson2Yaml ? " active" : ""}`}
            onClick={() => switchMode("json2yaml")}
          >
            JSON → YAML
          </button>
          <button
            className="mode-swap-btn"
            onClick={() => output ? swapWithOutput() : switchMode(isJson2Yaml ? "yaml2json" : "json2yaml")}
            title={output ? "Move output to input & flip direction" : "Flip direction"}
            aria-label="Swap conversion direction"
          >
            ⇄
          </button>
          <button
            className={`mode-btn${!isJson2Yaml ? " active" : ""}`}
            onClick={() => switchMode("yaml2json")}
          >
            YAML → JSON
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
                <div className={`dot ${isJson2Yaml ? "json" : "yaml"}`} aria-hidden="true" />
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
                <div className={`dot ${isJson2Yaml ? "yaml" : "json"}`} aria-hidden="true" />
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
              : isJson2Yaml
                ? <><ArrowRight size={16} aria-hidden="true" className="mr-1" /> Convert to YAML</>
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
          { icon: <Lock size={24} />, title: "Fully private", desc: "Your data never leaves the browser. Convert sensitive configs safely." },
          { icon: <Star size={24} />, title: "Bidirectional", desc: "Convert JSON → YAML and straight back. Handles nested objects, arrays, nulls, and booleans correctly." },
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