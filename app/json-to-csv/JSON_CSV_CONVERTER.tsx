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

  const inputLabel = isJson2Csv ? "JSON Input" : "CSV Input";
  const outputLabel = isJson2Csv ? "CSV Output" : "JSON Output";
  const inputDot = isJson2Csv ? "json" : "csv";
  const outputDot = isJson2Csv ? "csv" : "json";
  const errorPrefix = isJson2Csv ? "JSON Parse Error" : "CSV Parse Error";
  const outputPlaceholder = isJson2Csv ? "# Your CSV will appear here…" : "// Your JSON will appear here…";
  const inputPlaceholder = isJson2Csv
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

      <section className="seo-content" aria-labelledby="about-heading">
        <h2 id="about-heading">About JSON to CSV Converter</h2>
        <p>
          This free online JSON to CSV converter tool allows you to transform data between JSON and CSV formats instantly.
          Whether you're a developer working with APIs, a data analyst preparing spreadsheet exports, or anyone needing to
          convert structured data, our bidirectional converter handles JSON arrays to CSV tables and CSV files to JSON
          objects seamlessly in your browser. Supports nested values, type inference, and header detection.
        </p>

        <h3>Why Convert Between JSON and CSV?</h3>
        <p>
          JSON (JavaScript Object Notation) is the standard format for APIs and web applications, offering nested structures
          and complex data types. CSV (Comma-Separated Values) is universally compatible with spreadsheet software like
          Excel, Google Sheets, and database imports. Converting between them is essential for data analysis workflows,
          exporting API responses to Excel, importing spreadsheet data into applications, sharing data with non-technical
          stakeholders, and migrating data between systems. Manual conversion is error-prone and time-consuming, especially
          with large datasets or complex structures.
        </p>

        <h3>How to Use This Converter</h3>
        <p>
          Choose your conversion direction using the toggle: JSON → CSV converts JSON arrays of objects into CSV tables
          with proper headers and comma-separated values. CSV → JSON converts CSV files into JSON arrays with automatic
          type inference for numbers, booleans, and null values. Paste your data into the input field, click Convert, and
          get instant results. Download as .csv or .json files, copy to clipboard, or use the swap button to reverse the
          conversion and transform the output back.
        </p>

        <h3>Key Benefits</h3>
        <ul>
          <li><strong>No installation required:</strong> Works directly in your browser without any software downloads</li>
          <li><strong>Completely free:</strong> No registration, credit card, or hidden fees</li>
          <li><strong>Secure and private:</strong> All conversion happens locally - your data never reaches our servers</li>
          <li><strong>Fast processing:</strong> Instant conversion with no waiting time or rate limits</li>
          <li><strong>Bidirectional:</strong> Convert JSON ↔ CSV with full roundtrip support</li>
          <li><strong>Smart type inference:</strong> Automatically detects numbers, booleans, and null values</li>
          <li><strong>Header detection:</strong> Auto-detects CSV headers and maps them to JSON keys</li>
          <li><strong>Nested value support:</strong> Handles complex JSON structures in CSV conversion</li>
        </ul>

        <h3>Common Use Cases</h3>
        <p>
          Developers use JSON to CSV converters for exporting API responses to Excel for stakeholder reports, converting
          database query results to spreadsheet format, transforming JSON logs or analytics data for analysis, importing
          CSV configuration files into applications, generating CSV reports from JSON datasets, testing data transformations
          in ETL pipelines. Data analysts convert JSON API data to CSV for Excel pivot tables and charts, import web scraping
          results into Google Sheets, prepare data for visualization tools, and share datasets with non-technical teams.
          Business users export JSON from web apps to CSV for budget tracking, inventory management, customer databases,
          and sales reports.
        </p>

        <h3>Supported Features</h3>
        <p>
          JSON to CSV conversion supports arrays of objects (standard format for tabular data), nested object flattening,
          consistent column ordering, proper CSV escaping for commas and quotes, and UTF-8 character encoding. CSV to JSON
          conversion includes automatic header detection, smart type inference (converts "123" to number, "true" to boolean,
          "null" to null), handling of quoted values and escaped commas, empty value interpretation, and proper JSON array
          structure generation. Both directions preserve data integrity and handle edge cases like special characters,
          multi-line values, and empty fields.
        </p>

        <h3>Technical Features</h3>
        <p>
          The converter processes data entirely client-side with zero latency, handles large datasets efficiently, provides
          detailed error messages for malformed input, preserves UTF-8 and special characters correctly, generates properly
          formatted output with consistent indentation, offers download options for both .csv and .json files, includes
          copy-to-clipboard functionality, and features a swap button for quick roundtrip conversion. The tool validates
          input syntax and reports specific parse errors to help debug data issues.
        </p>

        <h3>Privacy and Security</h3>
        <p>
          Unlike online converters that upload your files to remote servers, this tool processes everything locally in your
          browser using JavaScript. Your customer data, financial records, API responses, analytics datasets, or any
          sensitive information never leave your computer, making it completely safe for converting confidential data.
          No cookies, tracking, data storage, or server communication. Perfect for working with GDPR-protected data,
          internal business records, personal information, or any proprietary datasets that require privacy.
        </p>
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