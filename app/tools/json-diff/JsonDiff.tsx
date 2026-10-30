"use client";

import { useState, useMemo } from "react";
import { GitCompare, Braces, Zap } from "lucide-react";
import Link from "next/link";
import {
  parseJson,
  diffJson,
  diffStats,
  formatValue,
  type JsonDiffEntry,
} from "./utils";

import "@/style/main.css";
import "./main.css";

const EXAMPLE_A = `{
  "name": "service",
  "version": "1.0.0",
  "replicas": 3,
  "env": { "LOG_LEVEL": "info" },
  "ports": [80, 443]
}`;

const EXAMPLE_B = `{
  "name": "service",
  "version": "1.1.0",
  "replicas": 5,
  "env": { "LOG_LEVEL": "debug", "FEATURE_FLAG": true },
  "ports": [80, 443, 8080]
}`;

const TAG: Record<JsonDiffEntry["kind"], string> = {
  add: "ADD", remove: "DEL", change: "CHG", equal: "EQ",
};

export default function JsonDiff() {
  const [a, setA] = useState(EXAMPLE_A);
  const [b, setB] = useState(EXAMPLE_B);
  const [showEqual, setShowEqual] = useState(false);

  const { entries, stats, error } = useMemo(() => {
    try {
      const parsedA = parseJson(a, "A");
      const parsedB = parseJson(b, "B");
      const entries = diffJson(parsedA, parsedB);
      return { entries, stats: diffStats(entries), error: "" };
    } catch (e) {
      return { entries: [] as JsonDiffEntry[], stats: null, error: (e as Error).message };
    }
  }, [a, b]);

  const visible = showEqual ? entries : entries.filter((e) => e.kind !== "equal");

  const loadExample = () => { setA(EXAMPLE_A); setB(EXAMPLE_B); };
  const clearAll   = () => { setA(""); setB(""); };

  return (
    <>
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-eyebrow">
          <div className="hero-dot" aria-hidden="true" />
          Free · No sign-up · Runs in browser
        </div>
        <h1 id="hero-heading">
          JSON <em>Diff</em>
        </h1>
        <p>
          Semantic JSON diff that ignores whitespace and key order. See every added,
          removed, and changed property as a dotted path with before/after values.
          Perfect for comparing API responses, config files, and database records.
        </p>
      </section>

      {error && (
        <div className="error-bar" role="alert" aria-live="assertive">
          <span aria-hidden="true">✕</span>
          <span>Parse Error: {error}</span>
        </div>
      )}

      <section aria-label="JSON Diff">
        <div className="converter">
          <div className={`panel${error ? " has-error" : ""}`}>
            <div className="panel-header">
              <div className="panel-title">
                <div className="dot json" aria-hidden="true" />
                JSON A (before)
              </div>
              <div className="panel-actions">
                <button className="btn-ghost" onClick={loadExample}>Example</button>
                <button className="btn-ghost" onClick={() => setA("")}>Clear</button>
              </div>
            </div>
            <textarea
              aria-label="JSON A"
              placeholder="Paste the original JSON…"
              value={a}
              onChange={(e) => setA(e.target.value)}
              spellCheck={false} autoCorrect="off" autoCapitalize="off"
            />
          </div>

          <div className={`panel${error ? " has-error" : ""}`}>
            <div className="panel-header">
              <div className="panel-title">
                <div className="dot yaml" aria-hidden="true" />
                JSON B (after)
              </div>
              <div className="panel-actions">
                <button className="btn-ghost" onClick={() => setB("")}>Clear</button>
              </div>
            </div>
            <textarea
              aria-label="JSON B"
              placeholder="Paste the modified JSON…"
              value={b}
              onChange={(e) => setB(e.target.value)}
              spellCheck={false} autoCorrect="off" autoCapitalize="off"
            />
          </div>
        </div>

        <div className="converter" style={{ marginTop: "16px", gridTemplateColumns: "1fr" }}>
          <div className={`panel jd-panel${entries.length ? " has-output" : ""}`}>
            <div className="panel-header">
              <div className="panel-title">
                <div className="dot prisma" aria-hidden="true" />
                Diff
                {!error && stats && (
                  <span className="success-tag">
                    ✓ +{stats.added} / −{stats.removed} / ~{stats.changed}
                  </span>
                )}
              </div>
              <div className="panel-actions">
                <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", color: "var(--color-text-muted)" }}>
                  <input type="checkbox" checked={showEqual} onChange={(e) => setShowEqual(e.target.checked)} />
                  Show unchanged
                </label>
              </div>
            </div>

            {entries.length === 0 && (
              <pre className="output-pre empty" aria-live="polite">
                {`// Paste JSON into both panels to see the diff…`}
              </pre>
            )}
            {entries.length > 0 && (
              <div className="jd-list" aria-live="polite">
                {visible.map((e, i) => (
                  <div className={`jd-row ${e.kind}`} key={i}>
                    <span className="jd-tag">{TAG[e.kind]}</span>
                    <div className="jd-body">
                      <code className="jd-path">{e.path}</code>
                      {e.kind === "add" && (
                        <code className="jd-after">+ {formatValue(e.after)}</code>
                      )}
                      {e.kind === "remove" && (
                        <code className="jd-before">− {formatValue(e.before)}</code>
                      )}
                      {e.kind === "change" && (
                        <>
                          <code className="jd-before">− {formatValue(e.before)}</code>
                          <code className="jd-after">+ {formatValue(e.after)}</code>
                        </>
                      )}
                      {e.kind === "equal" && (
                        <code className="jd-arrow">= {formatValue(e.before)}</code>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {stats && (
              <div className="jd-stats" aria-label="Diff stats">
                <span className="jd-stat added"><strong>+{stats.added}</strong> added</span>
                <span className="jd-stat removed"><strong>−{stats.removed}</strong> removed</span>
                <span className="jd-stat changed"><strong>~{stats.changed}</strong> changed</span>
                <span className="jd-stat"><strong>={stats.equal}</strong> unchanged</span>
              </div>
            )}
          </div>
        </div>

        <div className="actions">
          <button className="btn-secondary" onClick={loadExample}>Load Example</button>
          <button className="btn-secondary" onClick={clearAll}>Clear All</button>
        </div>
      </section>

      <section className="seo-content" aria-labelledby="about-heading">
        <h2 id="about-heading">About the Semantic JSON Diff</h2>
        <p>
          This free online JSON diff tool compares two JSON documents <em>structurally</em>,
          ignoring whitespace, indentation, and key order. Unlike line-based diffs,
          reordering keys never shows up as a change — only genuine data differences do.
          Every change is reported as a dotted path (<code>env.LOG_LEVEL</code>,
          <code>ports[2]</code>) along with the before and after values.
        </p>

        <h3>Why Semantic Beats Line-Based</h3>
        <p>
          Line diffs are noisy for JSON. Pretty-printing with 2 spaces vs 4 spaces,
          trailing commas, or reordered keys all show up as "changes" even when the
          data is identical. A structural diff walks the object tree and reports only
          what actually changed, which is what you usually want when comparing API
          responses, configuration files, or database records.
        </p>

        <h3>Common Use Cases</h3>
        <ul>
          <li>Compare two API responses to spot regressions</li>
          <li>Audit <code>package.json</code> or <code>tsconfig.json</code> before merging</li>
          <li>Diff Kubernetes manifests expressed as JSON</li>
          <li>Compare GraphQL introspection results across versions</li>
          <li>Review Elasticsearch index settings between environments</li>
          <li>Check which secrets/env vars drifted between deploys</li>
        </ul>

        <h3>Diff Output Format</h3>
        <ul>
          <li><strong>ADD</strong> — the path exists only in B (added)</li>
          <li><strong>DEL</strong> — the path exists only in A (removed)</li>
          <li><strong>CHG</strong> — the path exists in both but with different values</li>
          <li><strong>EQ</strong> — unchanged (hidden by default; toggle to show)</li>
        </ul>

        <h3>How Arrays Are Compared</h3>
        <p>
          Arrays are compared by index. If A has <code>[1, 2, 3]</code> and B has
          <code>[1, 4, 3]</code>, you'll see a single CHG at index 1. Inserts and
          deletes shift every subsequent index, so for ordered logs you may prefer
          a line diff instead — the <Link href="/tools/text-diff">Text Diff</Link>
          tool is better for that.
        </p>

        <h3>Frequently Asked Questions</h3>

        <h3>Does it preserve key order?</h3>
        <p>
          Yes, but order does not affect equality. If both inputs contain the same
          keys with the same values, the output shows them as unchanged regardless of
          the order they appeared in each file.
        </p>

        <h3>Can it diff JSON that is syntactically invalid?</h3>
        <p>
          No — both inputs must parse as JSON. If either one fails,
          the error bar shows the parser's message and highlights the broken input.
        </p>

        <h3>Is my JSON sent anywhere?</h3>
        <p>
          No. Both inputs stay in your browser. Safe for API payloads with tokens or
          personal data.
        </p>

        <h3>Related Tools</h3>
        <p>
          Format or minify huge JSON files with the{" "}
          <Link href="/tools/json-formatter">JSON Formatter</Link>, or compare raw text
          line by line with the <Link href="/tools/text-diff">Text Diff</Link> tool.
        </p>
      </section>

      <section className="features" aria-label="Features">
        {[
          { icon: <GitCompare size={24} />, title: "Structural diff", desc: "Compares values, not whitespace — key order never shows as a change." },
          { icon: <Braces size={24} />,     title: "Dotted paths",    desc: "Every difference points at an exact JSON path like env.LOG_LEVEL." },
          { icon: <Zap size={24} />,        title: "Live & private",  desc: "Updates as you type; nothing leaves your browser." },
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
