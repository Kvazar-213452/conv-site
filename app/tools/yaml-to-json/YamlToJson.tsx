"use client";

import { useState, useCallback } from "react";
import { FileCode2, Zap, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { yamlToJson } from "./utils";
import { EXAMPLE_YAML } from "@/lib/const";

import "@/style/main.css";

export default function YamlToJson() {
  const [input, setInput] = useState(EXAMPLE_YAML);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [converting, setConverting] = useState(false);

  const run = useCallback(() => {
    setError(""); setOutput("");
    if (!input.trim()) return;
    setConverting(true);
    setTimeout(() => {
      try { setOutput(JSON.stringify(yamlToJson(input), null, 2)); }
      catch (e) { setError((e as Error).message); }
      setConverting(false);
    }, 200);
  }, [input]);

  const copyOutput = () => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const loadExample = () => { setInput(EXAMPLE_YAML); setOutput(""); setError(""); };
  const clearAll   = () => { setInput(""); setOutput(""); setError(""); };

  return (
    <>
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-eyebrow"><div className="hero-dot" />Free · No sign-up · Runs in browser</div>
        <h1 id="hero-heading">YAML <em>→</em> JSON</h1>
        <p>
          Parse YAML configuration files (Kubernetes, GitHub Actions, docker-compose,
          Ansible) into clean JSON. Supports block mappings, sequences, flow syntax,
          and scalar type inference. 100% client-side.
        </p>
      </section>

      {error && <div className="error-bar" role="alert"><span>✕</span><span>Parse Error: {error}</span></div>}

      <section aria-label="YAML to JSON">
        <div className="converter">
          <div className={`panel${error ? " has-error" : ""}`}>
            <div className="panel-header">
              <div className="panel-title"><div className="dot json" />YAML Input</div>
              <div className="panel-actions">
                <button className="btn-ghost" onClick={loadExample}>Example</button>
                <button className="btn-ghost" onClick={() => { setInput(""); setError(""); }}>Clear</button>
              </div>
            </div>
            <textarea value={input} onChange={(e) => { setInput(e.target.value); setError(""); }} spellCheck={false} />
          </div>

          <div className={`panel${output ? " has-output" : ""}`}>
            <div className="panel-header">
              <div className="panel-title">
                <div className="dot yaml" />JSON Output
                {output && !converting && <span className="success-tag">✓ converted</span>}
              </div>
              {output && !converting && (
                <div className="panel-actions">
                  <button className="btn-ghost" onClick={copyOutput}>{copied ? "✓ Copied!" : "Copy"}</button>
                </div>
              )}
            </div>
            <pre className={`output-pre${output && !converting ? "" : " empty"}${converting ? " loading" : ""}`} aria-live="polite">
              {converting ? "// Converting…" : (output || "// JSON will appear here…")}
            </pre>
          </div>
        </div>

        <div className="actions">
          <button className="btn-secondary" onClick={loadExample}>Load Example</button>
          <button className="btn-convert" onClick={run} disabled={converting || !input.trim()}>
            {converting ? <><div className="btn-spinner" /> Converting…</> : <><ArrowRight size={16} className="mr-1" /> Convert to JSON</>}
          </button>
          <button className="btn-secondary" onClick={clearAll}>Clear All</button>
        </div>
      </section>

      <section className="seo-content" aria-labelledby="about-heading">
        <h2 id="about-heading">YAML to JSON Converter</h2>
        <p>
          Convert YAML configuration files into clean JSON. Perfect for inspecting
          Kubernetes manifests, GitHub Actions workflows, docker-compose files, and
          Ansible playbooks in a format your scripts and APIs can parse without a
          YAML library.
        </p>

        <h3>Supported YAML Features</h3>
        <ul>
          <li>Block mappings and sequences at any nesting depth</li>
          <li>Flow syntax: inline arrays <code>[a, b, c]</code> and maps <code>{"{"}a: 1{"}"}</code></li>
          <li>Scalar types: strings (plain, single, double quoted), integers, floats, booleans, null, inf, nan</li>
          <li>Comments with <code>#</code></li>
          <li>Standard escape sequences in double-quoted strings</li>
        </ul>

        <h3>Common Use Cases</h3>
        <ul>
          <li>Convert Kubernetes manifests for Node.js tooling</li>
          <li>Inspect GitHub Actions workflow data in a REPL</li>
          <li>Feed docker-compose config into TypeScript scripts</li>
          <li>Migrate Ansible vars to JSON-based config stores</li>
        </ul>

        <h3>FAQ</h3>
        <h3>What's the Norway problem?</h3>
        <p>In YAML 1.1, <code>country: NO</code> parsed as <code>false</code> instead of the string "NO". This converter follows YAML 1.2 rules where <code>NO</code> stays a string.</p>

        <h3>Is my YAML uploaded?</h3>
        <p>No. Parsing is client-side — safe for configs containing API keys and secrets.</p>

        <h3>Related</h3>
        <p>
          Convert the other direction with <Link href="/tools/json-to-yaml">JSON → YAML</Link>,
          or read the <Link href="/blog/json-vs-yaml">JSON vs YAML</Link> guide.
        </p>
      </section>

      <section className="features" aria-label="Features">
        {[
          { icon: <FileCode2 size={24} />, title: "YAML 1.2 subset", desc: "Block + flow syntax, nested docs, scalar type inference." },
          { icon: <Zap size={24} />,       title: "Instant",         desc: "Parse and emit happen in milliseconds, right in your browser." },
          { icon: <Lock size={24} />,      title: "Fully private",   desc: "Config files never leave your device." },
        ].map(({ icon, title, desc }) => (
          <div className="feature" key={title}>
            <div className="feature-icon">{icon}</div><h3>{title}</h3><p>{desc}</p>
          </div>
        ))}
      </section>
    </>
  );
}
