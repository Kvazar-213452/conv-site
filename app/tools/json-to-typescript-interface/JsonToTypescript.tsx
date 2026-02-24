"use client";

import { useState, useCallback } from "react";
import { EXAMPLE_JSON, EXAMPLE_TS } from "@/lib/const";
import { jsonToTypescript, typescriptToJson } from "./utils";
import { Braces, FileCode, ArrowRight, ArrowLeft, Repeat2 } from "lucide-react";

import "@/style/main.css";

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

  const inputLabel = isJson2Ts ? "JSON Input" : "TypeScript Input";
  const outputLabel = isJson2Ts ? "TypeScript Output" : "JSON Output";
  const errorPrefix = isJson2Ts ? "JSON Parse Error" : "TS Parse Error";
  const outputPlaceholder = isJson2Ts
    ? "// Your TypeScript interfaces will appear here…"
    : "// Your JSON skeleton will appear here…";
  const inputPlaceholder = isJson2Ts
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

      <section className="seo-content" aria-labelledby="about-heading">
        <h2 id="about-heading">About JSON to TypeScript Interface Generator</h2>
        <p>
          This free online JSON to TypeScript converter tool allows you to transform JSON data into accurate, ready-to-use
          TypeScript interfaces and vice versa. Whether you're a developer working with APIs, defining type contracts,
          or generating mock data from type definitions, our bidirectional converter intelligently infers types (string,
          number, boolean, Date, arrays, nested objects), detects optional fields, handles union types, and creates
          production-ready TypeScript interfaces. Everything runs 100% in your browser with no server uploads.
        </p>

        <h3>Why Convert Between JSON and TypeScript?</h3>
        <p>
          TypeScript's type system is essential for modern web development, providing compile-time type safety and better
          IDE autocomplete. However, manually writing TypeScript interfaces from API responses, database records, or JSON
          configuration files is tedious, time-consuming, and error-prone. Automated JSON to TypeScript conversion eliminates
          manual typing errors, ensures type accuracy, speeds up development by generating interfaces instantly, maintains
          consistency between data shapes and type definitions, and helps document API contracts. Reverse conversion
          (TypeScript to JSON) generates mock data templates, creates test fixtures, documents expected data structures,
          and provides examples for API documentation.
        </p>

        <h3>How to Use This Converter</h3>
        <p>
          Choose your conversion direction: JSON → TypeScript mode analyzes your JSON data (object or array), infers field
          types (string, number, boolean, Date for ISO strings, arrays, nested objects), detects optional fields (marked
          with ?) when keys are missing or null in array elements, handles union types for mixed values, and generates
          clean TypeScript interface definitions ready to paste into your code. TypeScript → JSON mode parses interface
          definitions and creates matching JSON skeletons with placeholder values for testing or documentation. Paste your
          data, click Generate Interface or Convert to JSON, and get instant results ready to use in your TypeScript project.
        </p>

        <h3>Key Benefits</h3>
        <ul>
          <li><strong>No installation required:</strong> Works directly in your browser without any software downloads</li>
          <li><strong>Completely free:</strong> No registration, credit card, or hidden fees</li>
          <li><strong>Secure and private:</strong> All conversion happens locally - your data never reaches our servers</li>
          <li><strong>Fast processing:</strong> Instant interface generation with no waiting time</li>
          <li><strong>Bidirectional:</strong> Convert JSON ↔ TypeScript interfaces with full roundtrip support</li>
          <li><strong>Smart type inference:</strong> Automatically detects string, number, boolean, Date, arrays, objects</li>
          <li><strong>Optional field detection:</strong> Keys missing in some array elements become optional (?)</li>
          <li><strong>Nested structure support:</strong> Handles deeply nested objects and arrays correctly</li>
        </ul>

        <h3>Common Use Cases</h3>
        <p>
          Developers use JSON to TypeScript converters for generating interfaces from API responses instantly instead of
          manual typing, creating type definitions for third-party API integrations, defining types for database query
          results and ORM models, converting JSON configuration files to typed interfaces for better IDE support, generating
          TypeScript types from GraphQL query results, creating mock data types for testing and development, documenting
          API contracts with accurate type definitions. Frontend engineers type Redux state, API payloads, and component
          props from sample data. Backend developers generate types for request/response bodies, database schemas, and
          microservice contracts. Full-stack teams maintain type safety between frontend and backend by generating shared
          interfaces from JSON examples.
        </p>

        <h3>Supported TypeScript Features</h3>
        <p>
          JSON to TypeScript conversion generates proper interface definitions with accurate type inference: strings become
          string type, numbers map to number, booleans to boolean, ISO date strings (YYYY-MM-DD, ISO 8601) convert to Date,
          null values result in optional fields with ?, arrays generate proper array syntax (Type[] or Array&lt;Type&gt;),
          nested objects create separate interfaces with proper references, mixed-type arrays produce union types (string |
          number), and objects with varying structures generate union types or discriminated unions. TypeScript to JSON
          parsing extracts interface names, field types, optional modifiers, array types, nested interfaces, and generates
          matching JSON with appropriate placeholder values (empty strings for string, 0 for number, false for boolean,
          ISO date string for Date, empty arrays/objects for complex types).
        </p>

        <h3>Technical Features</h3>
        <p>
          The converter intelligently analyzes JSON structure and applies TypeScript best practices: generates clean,
          readable interface definitions with proper indentation, names interfaces based on context (RootObject, ItemType,
          etc.), handles edge cases like empty arrays, null values, and undefined, supports deeply nested structures with
          multiple levels, detects and creates union types for heterogeneous data, preserves field order from original JSON,
          generates proper export statements for module usage, and includes JSDoc comments for complex types. Error messages
          help debug invalid JSON or TypeScript syntax. Quick actions include copy to clipboard, download (.ts or .json files),
          and swap for roundtrip conversion testing.
        </p>

        <h3>Privacy and Security</h3>
        <p>
          Unlike online converters that upload your data to remote servers, this tool processes everything locally in your
          browser using JavaScript. Your API responses, database records, user data, configuration files, or any sensitive
          JSON structures never leave your computer, making it completely safe for converting production data and confidential
          API contracts. No cookies, tracking, data storage, or server communication. Perfect for working with proprietary
          API schemas, internal service contracts, customer data structures, financial records, healthcare data, or any
          sensitive information that requires strict privacy controls. Your TypeScript code and data shapes remain secure.
        </p>
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