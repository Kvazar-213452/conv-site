"use client";

import { useState, useCallback } from "react";
import { parseEnv, envToJson, jsonToEnv, serializeEnv, type EnvEntry } from "./utils";
import { Table, Braces, ArrowRight, ArrowLeft, Plus, Trash2, AlertCircle } from "lucide-react";
import { EXAMPLE_ENV } from "@/lib/const";

import "@/app/css/main.css";
import "./main.css";

// ── Examples ──────────────────────────────────────────────────

const EXAMPLE_JSON = `{
  "APP_NAME": "My App",
  "APP_ENV": "production",
  "APP_DEBUG": "false",
  "APP_URL": "https://example.com",
  "DB_HOST": "localhost",
  "DB_PORT": "5432",
  "DB_NAME": "myapp_db",
  "DB_USER": "postgres",
  "DB_PASSWORD": "p@ssw0rd#secret",
  "JWT_SECRET": "super_long_secret_key_here",
  "JWT_EXPIRES_IN": "3600"
}`;

type Mode = "parse" | "env2json" | "json2env";

// ── Visual table editor ───────────────────────────────────────

function EnvTable({ entries, onChange }: {
  entries: EnvEntry[];
  onChange: (entries: EnvEntry[]) => void;
}) {
  const pairs = entries.filter((e) => e.type === "pair");

  const updateEntry = (idx: number, field: "key" | "value" | "comment", val: string) => {
    const updated = entries.map((e) => {
      if (e.type === "pair") {
        const pairIdx = entries.filter((x) => x.type === "pair").indexOf(e);
        if (pairIdx === idx) return { ...e, [field]: val };
      }
      return e;
    });
    onChange(updated);
  };

  const deleteEntry = (idx: number) => {
    let count = -1;
    const updated = entries.filter((e) => {
      if (e.type === "pair") {
        count++;
        return count !== idx;
      }
      return true;
    });
    onChange(updated);
  };

  const addEntry = () => {
    onChange([...entries, { type: "pair", key: "", value: "", line: 0 }]);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
      {/* Header */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "2fr 3fr 2fr 32px",
        gap: "0",
        padding: "8px 14px",
        background: "var(--surface-2)",
        borderBottom: "1px solid var(--border)",
        fontSize: "11px",
        fontFamily: "var(--font-mono)",
        color: "var(--text-3)",
        letterSpacing: ".06em",
        textTransform: "uppercase",
      }}>
        <span>KEY</span>
        <span>VALUE</span>
        <span># COMMENT</span>
        <span />
      </div>

      {/* Rows */}
      <div style={{ overflowY: "auto", maxHeight: "400px" }}>
        {pairs.length === 0 && (
          <div style={{ padding: "24px", textAlign: "center", color: "var(--text-3)", fontSize: "13px", fontFamily: "var(--font-mono)" }}>
            No variables yet — add one below
          </div>
        )}
        {pairs.map((entry, idx) => (
          <div key={idx} style={{
            display: "grid",
            gridTemplateColumns: "2fr 3fr 2fr 32px",
            gap: "0",
            borderBottom: "1px solid var(--border)",
            alignItems: "stretch",
          }}>
            <input
              value={entry.key ?? ""}
              onChange={(e) => updateEntry(idx, "key", e.target.value)}
              placeholder="VARIABLE_NAME"
              spellCheck={false}
              style={{
                background: "transparent",
                border: "none",
                borderRight: "1px solid var(--border)",
                outline: "none",
                color: "var(--accent)",
                fontFamily: "var(--font-mono)",
                fontSize: "12px",
                padding: "10px 14px",
              }}
            />
            <input
              value={entry.value ?? ""}
              onChange={(e) => updateEntry(idx, "value", e.target.value)}
              placeholder="value"
              spellCheck={false}
              style={{
                background: "transparent",
                border: "none",
                borderRight: "1px solid var(--border)",
                outline: "none",
                color: "var(--text)",
                fontFamily: "var(--font-mono)",
                fontSize: "12px",
                padding: "10px 14px",
              }}
            />
            <input
              value={entry.comment ?? ""}
              onChange={(e) => updateEntry(idx, "comment", e.target.value)}
              placeholder="optional comment"
              spellCheck={false}
              style={{
                background: "transparent",
                border: "none",
                borderRight: "1px solid var(--border)",
                outline: "none",
                color: "var(--text-3)",
                fontFamily: "var(--font-mono)",
                fontSize: "12px",
                padding: "10px 14px",
                fontStyle: "italic",
              }}
            />
            <button
              onClick={() => deleteEntry(idx)}
              title="Delete row"
              style={{
                background: "transparent",
                border: "none",
                color: "var(--text-3)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "color .15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--error)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-3)")}
            >
              <Trash2 size={13} />
            </button>
          </div>
        ))}
      </div>

      {/* Add row */}
      <div style={{ padding: "8px 14px", borderTop: pairs.length ? "none" : "1px solid var(--border)" }}>
        <button
          onClick={addEntry}
          className="btn-ghost"
          style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px" }}
        >
          <Plus size={13} /> Add variable
        </button>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────

export default function EnvParser() {
  const [mode, setMode] = useState<Mode>("parse");
  const [input, setInput] = useState(EXAMPLE_ENV);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [converting, setConverting] = useState(false);
  const [tableEntries, setTableEntries] = useState<EnvEntry[] | null>(null);

  const switchMode = (next: Mode) => {
    setMode(next);
    setInput(next === "json2env" ? EXAMPLE_JSON : EXAMPLE_ENV);
    setOutput("");
    setError("");
    setTableEntries(null);
  };

  const swapWithOutput = () => {
    if (!output) return;
    if (mode === "env2json") { setMode("json2env"); setInput(output); }
    else if (mode === "json2env") { setMode("env2json"); setInput(output); }
    else { setInput(output); }
    setOutput("");
    setError("");
    setTableEntries(null);
  };

  const convert = useCallback(() => {
    setError("");
    setOutput("");
    setTableEntries(null);
    setConverting(true);
    setTimeout(() => {
      try {
        if (mode === "parse") {
          const { entries, errors } = parseEnv(input);
          if (errors.length > 0) {
            setError(errors.map((e) => `Line ${e.line}: ${e.message}`).join("\n"));
          } else {
            setTableEntries(entries);
          }
        } else if (mode === "env2json") {
          setOutput(envToJson(input));
        } else {
          setOutput(jsonToEnv(input));
        }
      } catch (e) {
        setError((e as Error).message);
      }
      setConverting(false);
    }, 280);
  }, [input, mode]);

  const exportFromTable = () => {
    if (!tableEntries) return;
    const src = serializeEnv(tableEntries);
    setOutput(src);
    setTableEntries(null);
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadOutput = () => {
    const ext = mode === "env2json" ? "json" : ".env";
    const mime = mode === "env2json" ? "application/json" : "text/plain;charset=utf-8;";
    const blob = new Blob([output], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = mode === "env2json" ? "env.json" : ".env";
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearAll = () => { setInput(""); setOutput(""); setError(""); setTableEntries(null); };
  const loadExample = () => {
    setInput(mode === "json2env" ? EXAMPLE_JSON : EXAMPLE_ENV);
    setOutput("");
    setError("");
    setTableEntries(null);
  };

  const inputLabel = mode === "json2env" ? "JSON Input" : ".env Input";
  const outputLabel = mode === "env2json" ? "JSON Output" : ".env Output";
  const errorPrefix = "Parse Error";

  const outputPlaceholder =
    mode === "parse" ? "// Parsed variables will appear in the table above…" :
      mode === "env2json" ? "// JSON output will appear here…" :
        "// .env output will appear here…";

  const inputPlaceholder =
    mode === "json2env"
      ? '{\n  "APP_NAME": "My App",\n  "DB_HOST": "localhost"\n}'
      : "APP_NAME=My App\nDB_HOST=localhost\n# comment";

  return (
    <>
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-eyebrow">
          <div className="hero-dot" aria-hidden="true" />
          Free · No sign-up · Runs in browser
        </div>
        <h1 id="hero-heading">
          <em>.env</em> Parser
          <br />& Converter
        </h1>
        <p>
          Parse, validate and visually edit <code style={{ fontFamily: "var(--font-mono)", fontSize: "14px", background: "var(--surface-2)", padding: "1px 6px", borderRadius: "4px" }}>.env</code> files.
          Convert between <code style={{ fontFamily: "var(--font-mono)", fontSize: "14px", background: "var(--surface-2)", padding: "1px 6px", borderRadius: "4px" }}>.env</code> and JSON.
          Handles quoted values, escape sequences, inline comments, and export declarations.
          Runs 100% in your browser — nothing leaves your device.
        </p>

        <div className="mode-toggle" role="group" aria-label="Mode">
          <button className={`mode-btn${mode === "parse" ? " active" : ""}`} onClick={() => switchMode("parse")}>
            <Table size={13} style={{ display: "inline", marginRight: "5px", verticalAlign: "middle" }} />
            Parse
          </button>
          <button
            className="mode-swap-btn"
            onClick={() => output ? swapWithOutput() : switchMode(mode === "env2json" ? "json2env" : "env2json")}
            title="Flip direction"
            aria-label="Swap direction"
          >
            ⇄
          </button>
          <button className={`mode-btn${mode === "env2json" ? " active" : ""}`} onClick={() => switchMode("env2json")}>
            .env → JSON
          </button>
          <button className={`mode-btn${mode === "json2env" ? " active" : ""}`} onClick={() => switchMode("json2env")}>
            JSON → .env
          </button>
        </div>
      </section>

      {error && (
        <div className="error-bar" role="alert" aria-live="assertive">
          <AlertCircle size={14} style={{ flexShrink: 0 }} />
          <span style={{ whiteSpace: "pre" }}>{errorPrefix}: {error}</span>
        </div>
      )}

      <section aria-label="Converter">
        <div className="converter">

          {/* Input panel */}
          <div className={`panel${error ? " has-error" : ""}`}>
            <div className="panel-header">
              <div className="panel-title">
                <div className="dot json" aria-hidden="true" />
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
              onChange={(e) => { setInput(e.target.value); setError(""); setTableEntries(null); }}
              spellCheck={false} autoCorrect="off" autoCapitalize="off"
            />
          </div>

          {/* Output panel */}
          <div className={`panel${(output || tableEntries) ? " has-output" : ""}`}>
            <div className="panel-header">
              <div className="panel-title">
                <div className="dot sql" aria-hidden="true" />
                {mode === "parse" ? "Visual Editor" : outputLabel}
                {(output || tableEntries) && !converting && <span className="success-tag">✓ parsed</span>}
              </div>
              <div className="panel-actions">
                {tableEntries && (
                  <button className="btn-ghost" onClick={exportFromTable}>
                    ↓ Export .env
                  </button>
                )}
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

            {/* Table editor */}
            {tableEntries ? (
              <EnvTable
                entries={tableEntries}
                onChange={(updated) => setTableEntries(updated)}
              />
            ) : (
              <pre
                className={`output-pre${output && !converting ? "" : " empty"}${converting ? " loading" : ""}`}
                aria-label={outputLabel} aria-live="polite"
              >
                {converting ? "// Parsing…" : (output || outputPlaceholder)}
              </pre>
            )}
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
              ? <><div className="btn-spinner" aria-hidden="true" /> Parsing…</>
              : mode === "parse"
                ? <><Table size={15} aria-hidden="true" className="mr-1" /> Parse & Edit</>
                : mode === "env2json"
                  ? <><ArrowRight size={16} aria-hidden="true" className="mr-1" /> Convert to JSON</>
                  : <><ArrowLeft size={16} aria-hidden="true" className="mr-1" /> Convert to .env</>
            }
          </button>
          <button className="btn-secondary" onClick={clearAll}>Clear All</button>
        </div>
      </section>

      <section className="seo-content" aria-labelledby="about-heading">
        <h2 id="about-heading">About .env Parser & Converter</h2>
        <p>
          This free online .env parser and converter tool allows you to parse, validate, edit, and convert environment
          variable files instantly. Whether you're a developer managing configuration files, converting between .env and
          JSON formats, or troubleshooting environment variables, our tool handles parsing with full dotenv specification
          support including quoted values, escape sequences, inline comments, and export declarations. Everything runs
          100% in your browser with no server uploads.
        </p>

        <h3>Why Use a .env Parser and Converter?</h3>
        <p>
          Environment variable files (.env) are critical for modern application configuration, storing API keys, database
          credentials, and feature flags separately from code. However, .env files can be tricky to work with manually—
          they require proper escaping for special characters, correct quote handling, and careful formatting. A dedicated
          parser validates syntax, catches errors before deployment, provides visual editing capabilities, and enables
          seamless conversion to JSON for APIs, configuration management tools, or documentation. This prevents common
          mistakes like unescaped quotes, missing newlines, or invalid syntax that can break deployments.
        </p>

        <h3>How to Use This Tool</h3>
        <p>
          Choose your mode: Parse mode validates and displays your .env in an editable table where you can add, edit,
          or delete variables visually, then export back to a clean .env file. .env → JSON mode converts your environment
          file to a JSON object for APIs or config management. JSON → .env mode generates a properly formatted .env file
          from any flat JSON key-value object. Paste your content, click the convert or parse button, and get instant
          results with options to copy, download, or swap for further editing.
        </p>

        <h3>Key Benefits</h3>
        <ul>
          <li><strong>No installation required:</strong> Works directly in your browser without any software downloads</li>
          <li><strong>Completely free:</strong> No registration, credit card, or hidden fees</li>
          <li><strong>Secure and private:</strong> All parsing happens locally - your secrets never reach our servers</li>
          <li><strong>Fast processing:</strong> Instant parsing and conversion with no waiting time</li>
          <li><strong>Visual editor:</strong> Parse mode shows variables in an editable table for easy management</li>
          <li><strong>Bidirectional conversion:</strong> Convert .env ↔ JSON with proper formatting</li>
          <li><strong>Full spec support:</strong> Handles quoted strings, escape sequences, comments, export statements</li>
          <li><strong>Validation:</strong> Catches syntax errors with detailed line-by-line error messages</li>
        </ul>

        <h3>Common Use Cases</h3>
        <p>
          Developers use .env parsers for validating environment files before deployment, debugging configuration issues
          in development and production, converting .env to JSON for Kubernetes ConfigMaps or AWS Parameter Store,
          migrating environment variables between hosting platforms, generating .env files from JSON API responses or
          configuration tools, cleaning up messy .env files with inconsistent formatting, adding or removing variables
          visually without manual text editing. DevOps engineers validate CI/CD environment configurations, security
          teams audit environment variables for exposed secrets, and project managers document configuration requirements
          by exporting to JSON.
        </p>

        <h3>Supported .env Features</h3>
        <p>
          Our parser fully supports the dotenv specification including: double-quoted strings with escape sequences
          (\n for newlines, \t for tabs, \" for quotes, \\ for backslashes), single-quoted strings (literal values with
          no escaping), unquoted values, inline comments with # symbol, blank lines and whitespace, export declarations
          (export VAR=value), multi-line values in quotes, special characters in keys and values, and automatic trimming
          of whitespace. Error messages pinpoint exact line numbers for quick debugging.
        </p>

        <h3>Technical Features</h3>
        <p>
          Parse mode displays variables in an interactive table with add/edit/delete capabilities and export to clean
          .env format. Conversion modes handle bidirectional .env ↔ JSON transformation with proper escaping. The parser
          validates syntax and reports detailed errors with line numbers, preserves comments and formatting where
          appropriate, handles edge cases like empty values and special characters, supports both Unix and Windows line
          endings, and provides download options for .env or JSON files. Quick actions include copy to clipboard, swap
          input/output, and load examples.
        </p>

        <h3>Privacy and Security</h3>
        <p>
          Unlike online converters that upload your files to remote servers, this tool processes everything locally in
          your browser using JavaScript. Your API keys, database passwords, JWT secrets, OAuth tokens, and other
          sensitive environment variables never leave your computer, making it completely safe for parsing production
          .env files with real credentials. No cookies, tracking, or data storage. Perfect for working with confidential
          configuration files, secrets management, or any sensitive environment variables.
        </p>
      </section>

      <section className="features" aria-label="Features">
        {[
          {
            icon: <Table size={24} />,
            title: "Visual table editor",
            desc: 'Parse mode renders your .env into an editable table — add, edit, or delete variables, then export back to a clean .env file.',
          },
          {
            icon: <Braces size={24} />,
            title: "Full dotenv spec",
            desc: 'Handles double-quoted strings with escape sequences (\\n, \\t), single-quoted literals, inline comments, blank lines, and "export" declarations.',
          },
          {
            icon: <ArrowRight size={24} />,
            title: ".env ↔ JSON",
            desc: "Convert .env to a JSON object for use in APIs and configs, or generate a .env from any flat JSON key-value object.",
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