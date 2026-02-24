"use client";

import { useState, useCallback } from "react";
import { EXAMPLE_JSON, EXAMPLE_PRISMA } from "@/lib/const";
import { jsonToPrisma, prismaToJson } from "./utils";
import { CloudLightning, Lock, Star, ArrowRight, ArrowLeft } from "lucide-react";

import "@/style/main.css";

type Mode = "json2prisma" | "prisma2json";

export default function JsonToPrisma() {
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

  const inputLabel = isJson2Prisma ? "JSON Input" : "Prisma Schema Input";
  const outputLabel = isJson2Prisma ? "Prisma Schema Output" : "JSON Output";
  const errorPrefix = isJson2Prisma ? "JSON Parse Error" : "Prisma Parse Error";
  const outputPlaceholder = isJson2Prisma
    ? "// Your Prisma schema will appear here…"
    : "// Your JSON will appear here…";
  const inputPlaceholder = isJson2Prisma
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

      <section className="seo-content" aria-labelledby="about-heading">
        <h2 id="about-heading">About JSON to Prisma Schema Converter</h2>
        <p>
          This free online JSON to Prisma schema converter tool allows you to transform JSON data into ready-to-use Prisma
          ORM schemas and vice versa. Whether you're a developer prototyping database models, migrating from NoSQL to SQL,
          or converting existing data structures to Prisma format, our bidirectional converter intelligently infers types,
          generates model relations, adds appropriate decorators (@id, @default, @unique), and creates production-ready
          schema.prisma files. Everything runs 100% in your browser with no server uploads.
        </p>

        <h3>Why Convert Between JSON and Prisma Schema?</h3>
        <p>
          Prisma ORM is the modern database toolkit for TypeScript and Node.js, providing type-safe database access through
          schema.prisma files. Converting JSON to Prisma schemas accelerates development by transforming API responses,
          sample data, or existing JSON structures into proper database models instantly. This eliminates manual schema
          writing, reduces type definition errors, speeds up prototyping, and ensures consistency between data shapes and
          database schemas. Reverse conversion (Prisma to JSON) helps document database structures, generate API contracts,
          create mock data templates, and analyze schema relationships programmatically.
        </p>

        <h3>How to Use This Converter</h3>
        <p>
          Choose your conversion direction: JSON → Prisma mode analyzes JSON objects or arrays, infers field types (String,
          Int, Float, Boolean, DateTime), detects nested objects as related models, recognizes arrays as one-to-many
          relationships, and generates a complete Prisma schema with model definitions, decorators, and relations. Prisma →
          JSON mode parses schema.prisma files and extracts model structures into clean JSON format for documentation or
          analysis. Paste your data, click Generate Schema or Convert to JSON, and get instant results ready to use in your
          Prisma project or download as schema.prisma files.
        </p>

        <h3>Key Benefits</h3>
        <ul>
          <li><strong>No installation required:</strong> Works directly in your browser without any software downloads</li>
          <li><strong>Completely free:</strong> No registration, credit card, or hidden fees</li>
          <li><strong>Secure and private:</strong> All conversion happens locally - your data never reaches our servers</li>
          <li><strong>Fast processing:</strong> Instant schema generation with no waiting time</li>
          <li><strong>Bidirectional:</strong> Convert JSON ↔ Prisma schema with full roundtrip support</li>
          <li><strong>Smart type inference:</strong> Automatically detects String, Int, Float, Boolean, DateTime types</li>
          <li><strong>Relation detection:</strong> Identifies nested objects and arrays as model relationships</li>
          <li><strong>Decorator generation:</strong> Adds @id, @default, @unique, @relation where appropriate</li>
        </ul>

        <h3>Common Use Cases</h3>
        <p>
          Developers use JSON to Prisma converters for rapid prototyping database schemas from API response examples,
          migrating from MongoDB or other NoSQL databases to SQL with Prisma ORM, generating Prisma models from existing
          JSON data structures or TypeScript interfaces, creating database schemas from GraphQL query results, converting
          sample data into proper Prisma models for testing, bootstrapping new projects with schema.prisma from JSON configs.
          Backend engineers use it to document API contracts by converting Prisma schemas to JSON, generate mock data
          templates from database models, analyze schema relationships programmatically, create data migration scripts,
          validate schema consistency across microservices. Full-stack developers prototype quickly, maintain type safety
          between frontend and backend, and keep schemas synchronized with data shapes.
        </p>

        <h3>Supported Prisma Features</h3>
        <p>
          JSON to Prisma conversion generates proper model definitions with field types (String, Int, Float, Boolean,
          DateTime, Json), detects required vs optional fields, adds @id decorators for primary keys, includes @default
          for default values (autoincrement, now, uuid), recognizes unique fields with @unique, infers one-to-many and
          many-to-many relationships from nested arrays, creates relation fields with @relation decorators, and handles
          enum definitions. Prisma to JSON parsing extracts model names, field definitions with types and modifiers,
          relationship mappings, decorator metadata, and preserves schema structure. Both directions support Prisma 4+
          syntax and conventions.
        </p>

        <h3>Technical Features</h3>
        <p>
          The converter intelligently analyzes JSON structure and applies Prisma best practices: string fields become String
          type, numbers map to Int or Float based on decimals, booleans become Boolean, ISO date strings convert to DateTime
          with @default(now), null values mark fields as optional with ?, nested objects generate related models with proper
          @relation syntax, arrays indicate one-to-many relationships, and id/uuid fields automatically get @id decorator.
          The generated schema is ready to use with prisma migrate, prisma generate, and Prisma Client. Error messages help
          debug invalid JSON or Prisma syntax. Quick actions include copy, download (schema.prisma or .json), and swap for
          roundtrip testing.
        </p>

        <h3>Privacy and Security</h3>
        <p>
          Unlike online converters that upload your data to remote servers, this tool processes everything locally in your
          browser using JavaScript. Your database schemas, model definitions, API structures, user data examples, or any
          sensitive information never leave your computer, making it completely safe for converting production schemas and
          real data samples. No cookies, tracking, data storage, or server communication. Perfect for working with proprietary
          database structures, confidential API contracts, internal data models, or any sensitive schema information that
          requires privacy. Your Prisma configuration and database credentials remain secure.
        </p>
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