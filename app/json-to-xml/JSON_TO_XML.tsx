"use client";

import { useState, useCallback } from "react";
import { EXAMPLE_JSON, EXAMPLE_XML } from "@/lib/const";
import { jsonToXml, xmlToJson } from "./utils";
import { CloudLightning, Lock, Star, ArrowRight, ArrowLeft } from "lucide-react";

import "@/app/css/main.css";

type Mode = "json2xml" | "xml2json";

export default function JSON_TO_XML() {
  const [mode, setMode] = useState<Mode>("json2xml");
  const [input, setInput] = useState(EXAMPLE_JSON);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [converting, setConverting] = useState(false);

  const isJson2Xml = mode === "json2xml";

  const switchMode = (next: Mode) => {
    setMode(next);
    setInput(next === "json2xml" ? EXAMPLE_JSON : EXAMPLE_XML);
    setOutput("");
    setError("");
  };

  const swapWithOutput = () => {
    if (!output) return;
    const next: Mode = isJson2Xml ? "xml2json" : "json2xml";
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
        if (isJson2Xml) {
          setOutput(jsonToXml(JSON.parse(input.trim())));
        } else {
          setOutput(JSON.stringify(xmlToJson(input), null, 2));
        }
      } catch (e) {
        setError((e as Error).message);
      }
      setConverting(false);
    }, 280);
  }, [input, isJson2Xml]);

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadOutput = () => {
    const ext = isJson2Xml ? "xml" : "json";
    const mime = isJson2Xml ? "application/xml;charset=utf-8;" : "application/json";
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
    setInput(isJson2Xml ? EXAMPLE_JSON : EXAMPLE_XML);
    setOutput("");
    setError("");
  };

  const inputLabel        = isJson2Xml ? "JSON Input" : "XML Input";
  const outputLabel       = isJson2Xml ? "XML Output" : "JSON Output";
  const errorPrefix       = isJson2Xml ? "JSON Parse Error" : "XML Parse Error";
  const outputPlaceholder = isJson2Xml ? "<!-- Your XML will appear here… -->" : "// Your JSON will appear here…";
  const inputPlaceholder  = isJson2Xml
    ? '{\n  "key": "value"\n}'
    : '<?xml version="1.0"?>\n<root>\n  <key>value</key>\n</root>';

  return (
    <>
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-eyebrow">
          <div className="hero-dot" aria-hidden="true" />
          Free · No sign-up · Runs in browser
        </div>
        <h1 id="hero-heading">
          {isJson2Xml ? <>JSON <em>→</em> XML</> : <>XML <em>→</em> JSON</>}
          <br />Converter
        </h1>
        <p>
          {isJson2Xml
            ? "Paste your JSON, press Convert. Generates clean, indented XML with a declaration header."
            : "Paste your XML, press Convert. Parses tags, attributes, and nested elements into JSON."
          }{" "}
          Runs 100% in your browser — nothing leaves your device.
        </p>

        {/* Mode toggle */}
        <div className="mode-toggle" role="group" aria-label="Conversion direction">
          <button
            className={`mode-btn${isJson2Xml ? " active" : ""}`}
            onClick={() => switchMode("json2xml")}
          >
            JSON → XML
          </button>
          <button
            className="mode-swap-btn"
            onClick={() => output ? swapWithOutput() : switchMode(isJson2Xml ? "xml2json" : "json2xml")}
            title={output ? "Move output to input & flip direction" : "Flip direction"}
            aria-label="Swap conversion direction"
          >
            ⇄
          </button>
          <button
            className={`mode-btn${!isJson2Xml ? " active" : ""}`}
            onClick={() => switchMode("xml2json")}
          >
            XML → JSON
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
                <div className={`dot ${isJson2Xml ? "json" : "xml"}`} aria-hidden="true" />
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
                <div className={`dot ${isJson2Xml ? "xml" : "json"}`} aria-hidden="true" />
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
              {converting ? "<!-- Converting… -->" : (output || outputPlaceholder)}
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
              : isJson2Xml
                ? <><ArrowRight size={16} aria-hidden="true" className="mr-1" /> Convert to XML</>
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
          { icon: <Lock size={24} />, title: "Fully private", desc: "Your data never leaves the browser. Convert sensitive configs and payloads safely." },
          { icon: <Star size={24} />, title: "Bidirectional", desc: "Convert JSON → XML and straight back. Handles nested objects, arrays, attributes, and text nodes." },
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