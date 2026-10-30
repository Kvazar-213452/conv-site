"use client";

import { useState, useCallback } from "react";
import { FileCode2, Lock, Zap, ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { tomlToJson, jsonToToml } from "./utils";

import "@/style/main.css";

type Mode = "toml2json" | "json2toml";

const EXAMPLE_TOML = `title = "Example"
version = 2

[database]
host = "localhost"
port = 5432
enabled = true

[[servers]]
name = "alpha"
ip   = "10.0.0.1"

[[servers]]
name = "beta"
ip   = "10.0.0.2"`;

const EXAMPLE_JSON = `{
  "title": "Example",
  "version": 2,
  "database": {
    "host": "localhost",
    "port": 5432,
    "enabled": true
  },
  "servers": [
    { "name": "alpha", "ip": "10.0.0.1" },
    { "name": "beta",  "ip": "10.0.0.2" }
  ]
}`;

export default function TomlToJson() {
  const [mode, setMode] = useState<Mode>("toml2json");
  const [input, setInput] = useState(EXAMPLE_TOML);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [converting, setConverting] = useState(false);

  const isToml2Json = mode === "toml2json";

  const switchMode = (next: Mode) => {
    setMode(next);
    setInput(next === "toml2json" ? EXAMPLE_TOML : EXAMPLE_JSON);
    setOutput("");
    setError("");
  };

  const swapWithOutput = () => {
    if (!output) return;
    const next: Mode = isToml2Json ? "json2toml" : "toml2json";
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
        if (isToml2Json) {
          setOutput(JSON.stringify(tomlToJson(input), null, 2));
        } else {
          const parsed = JSON.parse(input);
          setOutput(jsonToToml(parsed));
        }
      } catch (e) {
        setError((e as Error).message);
      }
      setConverting(false);
    }, 220);
  }, [input, isToml2Json]);

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const loadExample = () => {
    setInput(isToml2Json ? EXAMPLE_TOML : EXAMPLE_JSON);
    setOutput("");
    setError("");
  };
  const clearAll = () => { setInput(""); setOutput(""); setError(""); };

  return (
    <>
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-eyebrow">
          <div className="hero-dot" aria-hidden="true" />
          Free · No sign-up · Runs in browser
        </div>
        <h1 id="hero-heading">
          {isToml2Json ? <>TOML <em>→</em> JSON</> : <>JSON <em>→</em> TOML</>}
          <br />Converter
        </h1>
        <p>
          Convert between TOML and JSON for Cargo.toml, pyproject.toml, Hugo config,
          and Zola themes. Supports tables, dotted keys, inline tables, and arrays of
          tables. 100% client-side.
        </p>

        <div className="mode-toggle" role="group" aria-label="Conversion direction">
          <button className={`mode-btn${isToml2Json ? " active" : ""}`} onClick={() => switchMode("toml2json")}>
            TOML → JSON
          </button>
          <button
            className="mode-swap-btn"
            onClick={() => (output ? swapWithOutput() : switchMode(isToml2Json ? "json2toml" : "toml2json"))}
            title={output ? "Move output to input & flip direction" : "Flip direction"}
            aria-label="Swap conversion direction"
          >
            ⇄
          </button>
          <button className={`mode-btn${!isToml2Json ? " active" : ""}`} onClick={() => switchMode("json2toml")}>
            JSON → TOML
          </button>
        </div>
      </section>

      {error && (
        <div className="error-bar" role="alert" aria-live="assertive">
          <span aria-hidden="true">✕</span>
          <span>{isToml2Json ? "TOML" : "JSON"} Parse Error: {error}</span>
        </div>
      )}

      <section aria-label="Converter">
        <div className="converter">
          <div className={`panel${error ? " has-error" : ""}`}>
            <div className="panel-header">
              <div className="panel-title">
                <div className="dot json" aria-hidden="true" />
                {isToml2Json ? "TOML Input" : "JSON Input"}
              </div>
              <div className="panel-actions">
                <button className="btn-ghost" onClick={loadExample}>Example</button>
                <button className="btn-ghost" onClick={() => { setInput(""); setError(""); }}>Clear</button>
              </div>
            </div>
            <textarea
              aria-label={isToml2Json ? "TOML Input" : "JSON Input"}
              placeholder={isToml2Json ? "key = \"value\"\n\n[section]\n…" : '{ "key": "value" }'}
              value={input}
              onChange={(e) => { setInput(e.target.value); setError(""); }}
              spellCheck={false} autoCorrect="off" autoCapitalize="off"
            />
          </div>

          <div className={`panel${output ? " has-output" : ""}`}>
            <div className="panel-header">
              <div className="panel-title">
                <div className="dot yaml" aria-hidden="true" />
                {isToml2Json ? "JSON Output" : "TOML Output"}
                {output && !converting && <span className="success-tag">✓ converted</span>}
              </div>
              <div className="panel-actions">
                {output && !converting && (
                  <>
                    <button className="btn-ghost" onClick={copyOutput}>
                      {copied ? "✓ Copied!" : "Copy"}
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
              aria-live="polite"
            >
              {converting ? "// Converting…" : (output || `// ${isToml2Json ? "JSON" : "TOML"} output will appear here…`)}
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
              : isToml2Json
                ? <><ArrowRight size={16} aria-hidden="true" className="mr-1" /> Convert to JSON</>
                : <><ArrowLeft size={16} aria-hidden="true" className="mr-1" /> Convert to TOML</>
            }
          </button>
          <button className="btn-secondary" onClick={clearAll}>Clear All</button>
        </div>
      </section>

      <section className="seo-content" aria-labelledby="about-heading">
        <h2 id="about-heading">About the TOML ↔ JSON Converter</h2>
        <p>
          TOML (Tom's Obvious Minimal Language) is the configuration format used by
          Rust's <code>Cargo.toml</code>, Python's <code>pyproject.toml</code>, Hugo,
          Zola, and many Go projects. This free online converter translates between
          TOML and JSON in both directions, handling tables, dotted keys, inline
          tables, and arrays of tables. Everything runs in your browser.
        </p>

        <h3>Supported Syntax</h3>
        <ul>
          <li>Basic key/value pairs: strings, numbers, booleans, dates (as strings)</li>
          <li>Numeric formats: decimal, hex (<code>0x</code>), octal (<code>0o</code>), binary (<code>0b</code>)</li>
          <li>Underscores in numbers: <code>1_000_000</code></li>
          <li>Standard tables: <code>[database.primary]</code></li>
          <li>Inline tables: <code>point = &#123; x = 1, y = 2 &#125;</code></li>
          <li>Arrays of tables: <code>[[servers]]</code> (becomes a JSON array of objects)</li>
          <li>Dotted keys: <code>a.b.c = 1</code></li>
          <li>Line comments with <code>#</code></li>
        </ul>

        <h3>Why Projects Chose TOML</h3>
        <p>
          TOML was designed to be unambiguous and friendly to humans editing it by
          hand. Unlike YAML, it has no indentation significance and no "Norway
          problem" — <code>country = "NO"</code> stays a string. Unlike JSON, it
          allows comments and multi-line strings.
        </p>

        <h3>Common Use Cases</h3>
        <ul>
          <li>Convert <code>Cargo.toml</code> to JSON for CI pipelines or dashboards</li>
          <li>Inspect <code>pyproject.toml</code> dependencies programmatically</li>
          <li>Migrate Hugo/Zola site configs between TOML and JSON</li>
          <li>Share settings between tools that speak only one format</li>
        </ul>

        <h3>Frequently Asked Questions</h3>

        <h3>Does the converter support TOML 1.0 completely?</h3>
        <p>
          It supports the common 95% of TOML 1.0: tables, dotted keys, inline tables,
          arrays of tables, numeric literals with underscores, hex/octal/binary ints,
          and standard escape sequences in basic strings. Multi-line triple-quoted
          strings and offset date-times are passed through as strings.
        </p>

        <h3>How are datetimes handled?</h3>
        <p>
          TOML datetimes have no direct JSON representation, so they are preserved as
          ISO 8601 strings on both sides of the conversion. Date parsing in your
          target language can take over from there.
        </p>

        <h3>Is my config sent to a server?</h3>
        <p>
          No. Parsing and emitting both happen in your browser — safe for config files
          containing API keys, database credentials, or private tokens.
        </p>

        <h3>Related Tools</h3>
        <p>
          Convert the same data to <Link href="/tools/json-to-yaml">YAML</Link>,{" "}
          <Link href="/tools/json-to-csv">CSV</Link>, or{" "}
          <Link href="/tools/json-to-xml">XML</Link>. Learn when to pick each format
          in the <Link href="/blog/json-vs-yaml">JSON vs YAML</Link> guide.
        </p>
      </section>

      <section className="features" aria-label="Features">
        {[
          { icon: <FileCode2 size={24} />, title: "Bidirectional",   desc: "Convert TOML to JSON and back without losing structure." },
          { icon: <Zap size={24} />,       title: "TOML 1.0 subset", desc: "Tables, dotted keys, inline tables, and arrays of tables all supported." },
          { icon: <Lock size={24} />,      title: "Fully private",   desc: "Config files stay in your browser — never uploaded." },
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
