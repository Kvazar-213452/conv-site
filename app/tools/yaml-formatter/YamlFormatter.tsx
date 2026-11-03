"use client";

import { useState, useCallback } from "react";
import {
  formatYaml,
  minifyYaml,
  EXAMPLE_YAML,
  type YamlIndent,
} from "./utils";
import { FileCode2, Lock, Settings2 } from "lucide-react";

import "@/style/main.css";
import "@/style/bar.css";

export default function YamlFormatter() {
  const [input, setInput] = useState(EXAMPLE_YAML);
  const [output, setOutput] = useState("");
  const [indent, setIndent] = useState<YamlIndent>(2);
  const [mode, setMode] = useState<"format" | "minify">("format");
  const [formatting, setFormatting] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const convert = useCallback(() => {
    setError("");
    if (!input.trim()) { setOutput(""); return; }
    setFormatting(true);
    setTimeout(() => {
      try {
        if (mode === "format") {
          setOutput(formatYaml(input, indent));
        } else {
          setOutput(minifyYaml(input));
        }
      } catch (e) {
        setError((e as Error).message);
      }
      setFormatting(false);
    }, 180);
  }, [input, indent, mode]);

  const loadExample = () => {
    setInput(EXAMPLE_YAML);
    setOutput("");
    setError("");
  };

  const clearAll = () => { setInput(""); setOutput(""); setError(""); };

  const copyOutput = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-eyebrow">
          <div className="hero-dot" aria-hidden="true" />
          Free · No sign-up · Runs in browser
        </div>
        <h1 id="hero-heading">
          YAML <em>Formatter</em>
        </h1>
        <p>
          Pretty-print or minify YAML configuration files with configurable indentation.
          Perfect for Kubernetes, Docker Compose, GitHub Actions, and Ansible. Runs 100% in your browser.
        </p>
      </section>

      {error && (
        <div className="error-bar" role="alert" aria-live="assertive">
          <span aria-hidden="true">✕</span>
          <span>Error: {error}</span>
        </div>
      )}

      <section aria-label="YAML Formatter">
        <div className="converter">
          {/* Input */}
          <div className={`panel${error ? " has-error" : ""}`}>
            <div className="panel-header">
              <div className="panel-title">
                <div className="dot yaml" aria-hidden="true" />
                YAML Input
              </div>
              <div className="panel-actions">
                <button className="btn-ghost" onClick={loadExample}>Example</button>
                <button className="btn-ghost" onClick={() => { setInput(""); setOutput(""); setError(""); }}>Clear</button>
              </div>
            </div>
            <textarea
              aria-label="YAML Input"
              placeholder="Paste your YAML here…"
              value={input}
              onChange={(e) => { setInput(e.target.value); setOutput(""); setError(""); }}
              spellCheck={false}
              autoCorrect="off"
              autoCapitalize="off"
            />
          </div>

          {/* Output */}
          <div className={`panel${output ? " has-output" : ""}`}>
            <div className="panel-header">
              <div className="panel-title">
                <div className="dot yaml" aria-hidden="true" />
                {mode === "format" ? "Formatted YAML" : "Minified YAML"}
                {output && !formatting && (
                  <span className="success-tag">✓ {mode === "format" ? "formatted" : "minified"}</span>
                )}
              </div>
              <div className="panel-actions">
                <button className="btn-ghost" onClick={copyOutput} disabled={!output}>
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>
            <pre
              className={`output-pre${!output && !formatting ? " empty" : ""}${formatting ? " loading" : ""}`}
              aria-live="polite"
            >
              {formatting ? "Formatting…" : output || "// Formatted YAML will appear here…"}
            </pre>
          </div>
        </div>

        {/* Options */}
        <div className="options-bar">
          <label>
            <Settings2 size={14} aria-hidden="true" />
            Options:
          </label>
          <label>
            Mode:
            <select
              value={mode}
              onChange={(e) => { setMode(e.target.value as "format" | "minify"); setOutput(""); }}
              style={{ marginLeft: 6, padding: "3px 8px", borderRadius: 6, border: "1px solid var(--color-border-bright)", background: "var(--color-surface)", color: "var(--color-text)", fontFamily: "'Geist Mono', monospace", fontSize: 12 }}
            >
              <option value="format">Format (Pretty-print)</option>
              <option value="minify">Minify</option>
            </select>
          </label>
          {mode === "format" && (
            <label>
              Indent:
              <select
                value={indent}
                onChange={(e) => { setIndent(Number(e.target.value) as YamlIndent); setOutput(""); }}
                style={{ marginLeft: 6, padding: "3px 8px", borderRadius: 6, border: "1px solid var(--color-border-bright)", background: "var(--color-surface)", color: "var(--color-text)", fontFamily: "'Geist Mono', monospace", fontSize: 12 }}
              >
                <option value={2}>2 spaces</option>
                <option value={4}>4 spaces</option>
                <option value={8}>8 spaces</option>
              </select>
            </label>
          )}
        </div>

        {/* Actions */}
        <div className="actions">
          <button className="btn-secondary" onClick={loadExample}>Load Example</button>
          <button
            className="btn-convert"
            onClick={convert}
            disabled={formatting || !input.trim()}
            aria-busy={formatting}
          >
            {formatting
              ? <><div className="btn-spinner" aria-hidden="true" /> Formatting…</>
              : <><FileCode2 size={16} aria-hidden="true" className="mr-1" /> {mode === "format" ? "Format" : "Minify"}</>
            }
          </button>
          <button className="btn-secondary" onClick={clearAll}>Clear All</button>
        </div>
      </section>

      <section className="seo-content" aria-labelledby="about-heading">
        <h2 id="about-heading">About YAML Formatter Tool</h2>
        <p>
          This free online YAML formatter tool pretty-prints messy or minified YAML configuration files with consistent
          indentation, or minifies verbose YAML by stripping comments and excess whitespace. Whether you're working with
          Kubernetes manifests, Docker Compose files, GitHub Actions workflows, Ansible playbooks, or any other YAML-based
          configuration, our formatter ensures clean, readable output. Everything runs 100% in your browser.
        </p>

        <h3>Why Format YAML?</h3>
        <p>
          YAML files are whitespace-sensitive — incorrect indentation breaks parsing and causes deployment failures.
          Manual editing often introduces inconsistent spacing, mixed tabs and spaces, and uneven nesting. A YAML
          formatter normalizes indentation across the entire file, making it easier to read, review, and maintain.
          Consistent formatting is critical for code reviews, where reviewers need to quickly scan structure without
          counting spaces. It also prevents "indentation drift" that accumulates as multiple developers edit the same
          config files over time.
        </p>

        <h3>How to Use This YAML Formatter</h3>
        <p>
          Paste your YAML into the input panel and select either "Format" for pretty-printing or "Minify" to strip
          comments and whitespace. For formatting, choose your preferred indentation (2 spaces, 4 spaces, or 8 spaces).
          Click the action button and the formatted YAML appears in the output panel. Copy the result with one click.
          The formatter preserves all YAML values, structure, and semantic meaning while normalizing whitespace.
        </p>

        <h3>Key Benefits</h3>
        <ul>
          <li><strong>Consistent indentation:</strong> Normalize mixed spacing to clean, uniform indentation</li>
          <li><strong>Configurable indent:</strong> Choose 2 spaces, 4 spaces, or 8 spaces for your project style</li>
          <li><strong>Minification:</strong> Strip comments and whitespace to reduce YAML file size</li>
          <li><strong>Structure preservation:</strong> All keys, values, arrays, and nesting remain semantically identical</li>
          <li><strong>Comment handling:</strong> Formatter preserves comments; minifier strips them for production</li>
          <li><strong>Instant formatting:</strong> No server round-trips — everything runs locally in your browser</li>
          <li><strong>Completely private:</strong> Your YAML configs never leave your device</li>
          <li><strong>No installation:</strong> Works instantly in any modern browser</li>
        </ul>

        <h3>Common Use Cases</h3>
        <p>
          DevOps engineers format Kubernetes manifests (deployments, services, configmaps, ingresses) before committing
          to Git. Backend developers clean up Docker Compose files and docker-stack.yml configurations. CI/CD engineers
          maintain GitHub Actions, GitLab CI, CircleCI, and Azure Pipelines YAML workflows. Ansible users format playbooks,
          roles, and inventory files. Infrastructure teams normalize Terraform and CloudFormation YAML templates. Frontend
          developers format i18n translation files and static site generator configs (Hugo, Jekyll, Eleventy).
        </p>

        <h3>Supported YAML Features</h3>
        <p>
          The formatter handles all common YAML constructs: scalar values (strings, numbers, booleans, null), quoted strings,
          block sequences (arrays with -), nested mappings, comments (preserved in format mode, stripped in minify), blank
          lines, multi-level nesting, and mixed indentation correction. It works with Kubernetes, Docker Compose, Ansible,
          GitHub Actions, and all standard YAML 1.1/1.2 files.
        </p>

        <h3>Privacy and Security</h3>
        <p>
          All formatting and minification happens locally in your browser using JavaScript. Your Kubernetes secrets,
          database credentials, API keys, cloud configurations, and any other sensitive YAML data never leave your
          computer. No cookies, no tracking, no server communication. Safe for production configs and confidential
          infrastructure definitions.
        </p>
      </section>

      <section className="features" aria-label="Features">
        {[
          {
            icon: <FileCode2 size={24} />,
            title: "Clean formatting",
            desc: "Normalize inconsistent YAML indentation to clean, uniform spacing in one click.",
          },
          {
            icon: <Lock size={24} />,
            title: "Fully private",
            desc: "Your YAML configs never leave the browser. Safe for secrets, credentials, and production data.",
          },
          {
            icon: <Settings2 size={24} />,
            title: "Format or minify",
            desc: "Pretty-print for readability or strip comments and whitespace for production deployment.",
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
