"use client";

import { useState, useCallback } from "react";
import { EXAMPLE_JSON, EXAMPLE_SQL } from "@/lib/const";
import { jsonToPostgres, postgresInsertToJson } from "./utils";
import { CloudLightning, Lock, Star, ArrowRight, ArrowLeft } from "lucide-react";

import "@/style/main.css";

type Mode = "json2sql" | "sql2json";

export default function JsonToPostgres() {
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

      <section className="seo-content" aria-labelledby="about-heading">
        <h2 id="about-heading">About JSON to PostgreSQL INSERT Generator</h2>
        <p>
          This free online JSON to PostgreSQL converter tool allows you to transform JSON data into ready-to-run PostgreSQL
          INSERT statements and vice versa. Whether you're a developer seeding databases, migrating data, testing queries,
          or converting SQL results back to JSON, our bidirectional converter generates properly formatted, type-aware SQL
          with correct quoting, escaping, and batch INSERT optimization. Everything runs 100% in your browser with no
          server uploads.
        </p>

        <h3>Why Convert Between JSON and PostgreSQL?</h3>
        <p>
          Modern applications frequently need to move data between JSON (the standard API format) and PostgreSQL databases.
          Developers export JSON from APIs or frontend applications and need to insert it into PostgreSQL for storage and
          querying. Database administrators need to generate seed data, migrate records between environments, or create
          test datasets. Writing INSERT statements manually is tedious, error-prone (missing quotes, incorrect escaping,
          wrong type casting), and slow for large datasets. Automated conversion ensures proper SQL syntax, handles special
          characters correctly, optimizes for performance with multi-row INSERTs, and saves hours of manual work.
        </p>

        <h3>How to Use This Converter</h3>
        <p>
          Choose your conversion direction: JSON → SQL mode converts JSON arrays of objects into PostgreSQL INSERT statements
          with a single multi-row INSERT for optimal performance. SQL → JSON mode parses INSERT statements and extracts the
          data back into a clean JSON array. Paste your JSON array or SQL INSERT statement into the input field, click
          Generate INSERT or Convert to JSON, and get instant results. The output is ready to copy into psql, pgAdmin, or
          your SQL client, or download as .sql or .json files.
        </p>

        <h3>Key Benefits</h3>
        <ul>
          <li><strong>No installation required:</strong> Works directly in your browser without any software downloads</li>
          <li><strong>Completely free:</strong> No registration, credit card, or hidden fees</li>
          <li><strong>Secure and private:</strong> All conversion happens locally - your data never reaches our servers</li>
          <li><strong>Fast processing:</strong> Instant conversion with no waiting time</li>
          <li><strong>Bidirectional:</strong> Convert JSON ↔ SQL INSERT statements with full roundtrip support</li>
          <li><strong>Type-aware:</strong> Strings are escaped and quoted, numbers/booleans unquoted, nulls become NULL</li>
          <li><strong>Batch optimization:</strong> Generates single multi-row INSERT for maximum database performance</li>
          <li><strong>Proper escaping:</strong> Handles special characters, quotes, and SQL injection prevention</li>
        </ul>

        <h3>Common Use Cases</h3>
        <p>
          Developers use JSON to SQL converters for seeding databases with initial data from JSON configuration files,
          migrating data from NoSQL databases or APIs to PostgreSQL, generating test datasets for development and staging
          environments, importing JSON exports from other systems into PostgreSQL tables, creating migration scripts with
          INSERT statements for version control, batch inserting records from API responses or web scraping results. Database
          administrators use it for data migration between environments (dev to prod), creating backup INSERT scripts from
          JSON exports, generating seed data for testing and demos, converting JSON logs or analytics into relational tables.
          QA engineers create test fixtures, populate test databases, and verify data transformations.
        </p>

        <h3>Supported PostgreSQL Features</h3>
        <p>
          JSON to SQL conversion generates multi-row INSERT statements (VALUES with multiple tuples) for optimal performance,
          properly escapes single quotes and special characters in strings, handles PostgreSQL-specific types (timestamptz
          for dates, boolean for true/false), converts JSON null to SQL NULL, preserves numeric precision, quotes column
          and table names for reserved keywords, and generates valid PostgreSQL 9.5+ syntax. SQL to JSON parsing extracts
          table names, column names, and all values from INSERT statements, handles both single and multi-row INSERTs,
          unescapes quoted strings correctly, interprets NULL values, and preserves data types (numbers, booleans, strings).
        </p>

        <h3>Technical Features</h3>
        <p>
          The converter intelligently detects data types and applies correct SQL quoting rules: strings are single-quoted
          with escape sequences for apostrophes and backslashes, numbers (integers and decimals) are unquoted, booleans
          are rendered as true/false, null values become NULL, dates are cast to timestamptz, and arrays/objects are
          serialized. The generated SQL uses efficient multi-row INSERT syntax instead of separate statements per row,
          reducing database round-trips. Error messages pinpoint syntax issues in both JSON and SQL inputs. Quick actions
          include copy, download (.sql or .json), and swap for roundtrip conversion testing.
        </p>

        <h3>Privacy and Security</h3>
        <p>
          Unlike online converters that upload your data to remote servers, this tool processes everything locally in your
          browser using JavaScript. Your database records, customer data, user credentials, API payloads, or any sensitive
          information never leave your computer, making it completely safe for converting production data. No cookies,
          tracking, data storage, or server communication. Perfect for working with real database records, PII (personally
          identifiable information), financial data, or any confidential datasets that require strict privacy controls.
          Your PostgreSQL credentials and database schema remain secure.
        </p>
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