"use client";

import { useState, useCallback } from "react";
import { EXAMPLE_JSON, EXAMPLE_XML } from "@/lib/const";
import { jsonToXml, xmlToJson } from "./utils";
import { CloudLightning, Lock, Star, ArrowRight, ArrowLeft } from "lucide-react";
import "@/app/css/main.css";

// ─────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────

type Mode = "json2xml" | "xml2json";

// ─────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────

export default function JSON_TO_XML() {
  // ── State ──────────────────────────────────────────────────────
  const [mode, setMode] = useState<Mode>("json2xml");
  const [input, setInput] = useState(EXAMPLE_JSON);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [converting, setConverting] = useState(false);

  // ── Computed ───────────────────────────────────────────────────
  const isJson2Xml = mode === "json2xml";

  // ── Handlers ───────────────────────────────────────────────────
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

  const clearAll = () => {
    setInput("");
    setOutput("");
    setError("");
  };

  const loadExample = () => {
    setInput(isJson2Xml ? EXAMPLE_JSON : EXAMPLE_XML);
    setOutput("");
    setError("");
  };

  // ── Labels & Text ──────────────────────────────────────────────
  const inputLabel = isJson2Xml ? "JSON Input" : "XML Input";
  const outputLabel = isJson2Xml ? "XML Output" : "JSON Output";
  const errorPrefix = isJson2Xml ? "JSON Parse Error" : "XML Parse Error";
  const outputPlaceholder = isJson2Xml ? "<!-- Your XML will appear here… -->" : "// Your JSON will appear here…";
  const inputPlaceholder = isJson2Xml
    ? '{\n  "key": "value"\n}'
    : '<?xml version="1.0"?>\n<root>\n  <key>value</key>\n</root>';

  // ─────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════
          HERO SECTION
          ═══════════════════════════════════════════════════════════ */}
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

        {/* Mode Toggle */}
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

      {/* ═══════════════════════════════════════════════════════════
          ERROR BAR
          ═══════════════════════════════════════════════════════════ */}
      {error && (
        <div className="error-bar" role="alert" aria-live="assertive">
          <span aria-hidden="true">✕</span>
          <span>{errorPrefix}: {error}</span>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          CONVERTER SECTION
          ═══════════════════════════════════════════════════════════ */}
      <section aria-label="Converter">
        <div className="converter">

          {/* Input Panel */}
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
              spellCheck={false}
              autoCorrect="off"
              autoCapitalize="off"
            />
          </div>

          {/* Output Panel */}
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
              aria-label={outputLabel}
              aria-live="polite"
            >
              {converting ? "<!-- Converting… -->" : (output || outputPlaceholder)}
            </pre>
          </div>

        </div>

        {/* Action Buttons */}
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

      <section className="seo-content" aria-labelledby="about-heading">
        <h2 id="about-heading">About JSON to XML Converter</h2>
        <p>
          This free online JSON to XML converter tool allows you to transform data between JSON and XML formats instantly.
          Whether you're a developer working with APIs, configuration files, or data interchange formats, our converter
          handles the transformation seamlessly in your browser.
        </p>

        <h3>Why Convert Between JSON and XML?</h3>
        <p>
          JSON (JavaScript Object Notation) and XML (eXtensible Markup Language) are two of the most popular data formats
          used in web development and data exchange. While JSON is lightweight and easier to read, XML offers more flexibility
          with attributes and is widely used in enterprise systems, SOAP APIs, and configuration files.
        </p>

        <h3>How to Use This Converter</h3>
        <p>
          Converting between JSON and XML is simple: paste your JSON or XML data into the input field, click the Convert
          button, and get your formatted output instantly. You can switch between JSON to XML and XML to JSON modes using
          the toggle buttons. The tool supports nested objects, arrays, attributes, text nodes, and complex data structures.
        </p>

        <h3>Key Benefits</h3>
        <ul>
          <li><strong>No installation required:</strong> Works directly in your browser without any software downloads</li>
          <li><strong>Completely free:</strong> No registration, no credit card, no hidden fees</li>
          <li><strong>Secure and private:</strong> All conversion happens locally - your data never reaches our servers</li>
          <li><strong>Fast processing:</strong> Instant conversion with no waiting time</li>
          <li><strong>Bidirectional:</strong> Convert JSON to XML or XML to JSON with one click</li>
        </ul>

        <h3>Common Use Cases</h3>
        <p>
          Developers use JSON to XML converters for various tasks: transforming API responses, migrating data between
          systems, converting configuration files, working with SOAP web services, generating XML feeds from JSON data,
          and testing data formats. This tool is perfect for backend developers, frontend engineers, QA testers,
          DevOps professionals, and data analysts.
        </p>

        <h3>Technical Features</h3>
        <p>
          Our converter preserves data structure integrity, maintains proper indentation for readability, handles XML
          attributes and CDATA sections, supports nested arrays and objects, includes XML declaration headers, and
          provides detailed error messages for invalid input. The output is always well-formed and properly formatted.
        </p>

        <h3>Privacy and Security</h3>
        <p>
          Unlike online converters that send your data to remote servers, this tool processes everything locally in your
          browser using JavaScript. Your sensitive configuration files, API keys, or proprietary data never leave your
          computer, making it safe for converting confidential information.
        </p>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FEATURES SECTION
          ═══════════════════════════════════════════════════════════ */}
      <section className="features" aria-labelledby="features-heading">
        <h2 id="features-heading" style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: 0 }}>
          Key Features
        </h2>
        {[
          {
            icon: <CloudLightning size={24} />,
            title: "Instant conversion",
            desc: "Pure client-side processing. No latency, no rate limits, no server roundtrips."
          },
          {
            icon: <Lock size={24} />,
            title: "Fully private",
            desc: "Your data never leaves the browser. Convert sensitive configs and payloads safely."
          },
          {
            icon: <Star size={24} />,
            title: "Bidirectional",
            desc: "Convert JSON → XML and straight back. Handles nested objects, arrays, attributes, and text nodes."
          },
        ].map(({ icon, title, desc }) => (
          <article className="feature" key={title}>
            <div className="feature-icon" aria-hidden="true">{icon}</div>
            <h3>{title}</h3>
            <p>{desc}</p>
          </article>
        ))}
      </section>
    </>
  );
}