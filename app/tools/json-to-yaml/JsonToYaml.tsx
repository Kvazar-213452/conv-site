"use client";

import { useState, useCallback } from "react";
import { EXAMPLE_JSON, EXAMPLE_YAML } from "@/lib/const";
import { jsonToYaml, yamlToJson } from "./utils";
import { CloudLightning, Lock, Star, ArrowRight, ArrowLeft } from "lucide-react";

import "@/style/main.css";

type Mode = "json2yaml" | "yaml2json";

export default function JsonToYaml() {
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

  const inputLabel = isJson2Yaml ? "JSON Input" : "YAML Input";
  const outputLabel = isJson2Yaml ? "YAML Output" : "JSON Output";
  const errorPrefix = isJson2Yaml ? "JSON Parse Error" : "YAML Parse Error";
  const outputPlaceholder = isJson2Yaml ? "# Your YAML will appear here…" : "// Your JSON will appear here…";
  const inputPlaceholder = isJson2Yaml
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

      <section className="seo-content" aria-labelledby="about-heading">
        <h2 id="about-heading">About JSON to YAML Converter</h2>
        <p>
          This free online JSON to YAML converter tool allows you to transform data between JSON and YAML formats instantly.
          Whether you're a developer working with configuration files, Kubernetes manifests, Docker Compose files, CI/CD
          pipelines, or API definitions, our bidirectional converter handles the transformation seamlessly. Convert JSON
          to human-readable YAML or parse YAML back to JSON with proper type preservation for booleans, numbers, nulls,
          arrays, and nested objects. Everything runs 100% in your browser with no server uploads.
        </p>

        <h3>Why Convert Between JSON and YAML?</h3>
        <p>
          JSON (JavaScript Object Notation) and YAML (YAML Ain't Markup Language) serve different purposes in modern
          development. JSON is compact, widely supported, and perfect for APIs and data interchange, while YAML is
          human-readable, supports comments, and is the standard for configuration files in Kubernetes, Docker, Ansible,
          GitHub Actions, and CI/CD tools. Converting between them is essential for migrating configurations, integrating
          systems with different format requirements, editing complex configs in your preferred format, validating syntax,
          and generating documentation. Manual conversion is tedious and error-prone, especially with deeply nested structures,
          special characters, and type preservation requirements.
        </p>

        <h3>How to Use This Converter</h3>
        <p>
          Choose your conversion direction using the toggle: JSON → YAML converts JSON objects and arrays into clean,
          indented YAML with proper spacing and readability. YAML → JSON parses YAML syntax (including lists, nested mappings,
          scalars, booleans, numbers, nulls) and generates properly formatted JSON. Paste your data into the input field,
          click Convert, and get instant results. Download as .yaml or .json files, copy to clipboard, or use the swap
          button to reverse the conversion and transform the output back for roundtrip testing.
        </p>

        <h3>Key Benefits</h3>
        <ul>
          <li><strong>No installation required:</strong> Works directly in your browser without any software downloads</li>
          <li><strong>Completely free:</strong> No registration, credit card, or hidden fees</li>
          <li><strong>Secure and private:</strong> All conversion happens locally - your data never reaches our servers</li>
          <li><strong>Fast processing:</strong> Instant conversion with no waiting time or rate limits</li>
          <li><strong>Bidirectional:</strong> Convert JSON ↔ YAML with full roundtrip support</li>
          <li><strong>Type preservation:</strong> Correctly handles strings, numbers, booleans, null, arrays, objects</li>
          <li><strong>Clean formatting:</strong> Generates properly indented, readable YAML and formatted JSON</li>
          <li><strong>Nested structure support:</strong> Handles deeply nested objects and arrays correctly</li>
        </ul>

        <h3>Common Use Cases</h3>
        <p>
          Developers use JSON to YAML converters for converting Kubernetes manifests between formats for different tools,
          transforming Docker Compose files to/from JSON for programmatic editing, converting GitHub Actions workflows,
          CI/CD pipeline configurations (GitLab CI, CircleCI, Travis), Ansible playbooks and inventory files, AWS
          CloudFormation templates, Swagger/OpenAPI specifications, converting API responses to YAML for configuration,
          editing complex YAML configs in JSON format with better tooling support, migrating configuration files between
          systems with different format requirements. DevOps engineers convert infrastructure-as-code templates, Helm charts,
          and deployment configurations. Backend developers transform application configs, database connection strings, and
          feature flags between JSON and YAML formats for different environments.
        </p>

        <h3>Supported Format Features</h3>
        <p>
          JSON to YAML conversion generates clean, properly indented YAML with 2-space indentation, preserves data types
          (strings, numbers, booleans, null), handles nested objects and arrays with correct list syntax (- item), maintains
          key order, escapes special characters appropriately, and produces human-readable output. YAML to JSON parsing
          supports standard YAML syntax including mappings (key: value), sequences (lists with -), scalars (strings, numbers,
          booleans), null values, nested structures, multi-line strings, flow style (inline) arrays and objects, anchors
          and aliases for repeated data, and generates properly formatted JSON with consistent indentation. Both directions
          handle edge cases like empty arrays, null values, special characters, and deeply nested structures.
        </p>

        <h3>Technical Features</h3>
        <p>
          The converter processes data entirely client-side with zero latency, validates syntax and reports detailed parse
          errors with line numbers, preserves data types accurately during conversion (no type coercion), handles UTF-8
          and special characters correctly, generates consistent formatting with proper indentation, supports large files
          and complex nested structures efficiently, provides clear error messages for malformed input, and includes quick
          actions for copy, download (.yaml or .json), and swap functionality. The tool follows YAML 1.2 specification and
          JSON RFC 8259 standards for maximum compatibility.
        </p>

        <h3>Privacy and Security</h3>
        <p>
          Unlike online converters that upload your files to remote servers, this tool processes everything locally in your
          browser using JavaScript. Your Kubernetes secrets, Docker environment variables, API keys in config files, database
          credentials, CI/CD pipeline configurations, or any sensitive YAML/JSON data never leave your computer, making it
          completely safe for converting production configurations and confidential settings. No cookies, tracking, data
          storage, or server communication. Perfect for working with infrastructure secrets, application configs, deployment
          manifests, or any sensitive configuration files that require strict privacy and security controls.
        </p>
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