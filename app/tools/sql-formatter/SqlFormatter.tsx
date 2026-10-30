"use client";

import { useState, useCallback } from "react";
import { Database, Zap, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";
import {
  formatSql,
  DEFAULT_FORMAT_OPTIONS,
  type FormatOptions,
} from "./utils";

import "@/style/main.css";
import "@/style/bar.css";

const EXAMPLE_SQL = `select u.id, u.email, count(o.id) as total_orders, sum(o.amount) as revenue from users u left join orders o on o.user_id = u.id where u.active = true and u.created_at > '2024-01-01' group by u.id, u.email having count(o.id) > 5 order by revenue desc limit 50;`;

export default function SqlFormatter() {
  const [input, setInput] = useState(EXAMPLE_SQL);
  const [output, setOutput] = useState("");
  const [opts, setOpts] = useState<FormatOptions>(DEFAULT_FORMAT_OPTIONS);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [formatting, setFormatting] = useState(false);

  const run = useCallback(() => {
    setError("");
    setOutput("");
    if (!input.trim()) return;
    setFormatting(true);
    setTimeout(() => {
      try {
        setOutput(formatSql(input, opts));
      } catch (e) {
        setError((e as Error).message);
      }
      setFormatting(false);
    }, 220);
  }, [input, opts]);

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const loadExample = () => { setInput(EXAMPLE_SQL); setOutput(""); setError(""); };
  const clearAll   = () => { setInput(""); setOutput(""); setError(""); };

  const setOpt = <K extends keyof FormatOptions>(key: K, val: FormatOptions[K]) => {
    setOpts((prev) => ({ ...prev, [key]: val }));
    setOutput("");
  };

  return (
    <>
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-eyebrow">
          <div className="hero-dot" aria-hidden="true" />
          Free · No sign-up · Runs in browser
        </div>
        <h1 id="hero-heading">
          SQL <em>Formatter</em>
        </h1>
        <p>
          Pretty-print any SQL query — SELECT, INSERT, UPDATE, DELETE, DDL — with
          configurable indentation and uppercase keywords. Works for Postgres, MySQL,
          SQLite, and MSSQL. 100% client-side.
        </p>
      </section>

      {error && (
        <div className="error-bar" role="alert" aria-live="assertive">
          <span aria-hidden="true">✕</span>
          <span>Format Error: {error}</span>
        </div>
      )}

      <section aria-label="SQL Formatter">
        <div className="converter">

          <div className={`panel${error ? " has-error" : ""}`}>
            <div className="panel-header">
              <div className="panel-title">
                <div className="dot json" aria-hidden="true" />
                SQL Input
              </div>
              <div className="panel-actions">
                <button className="btn-ghost" onClick={loadExample}>Example</button>
                <button className="btn-ghost" onClick={() => { setInput(""); setError(""); }}>Clear</button>
              </div>
            </div>
            <textarea
              aria-label="SQL input"
              placeholder="Paste a SQL query…"
              value={input}
              onChange={(e) => { setInput(e.target.value); setError(""); }}
              spellCheck={false} autoCorrect="off" autoCapitalize="off"
            />
          </div>

          <div className={`panel${output ? " has-output" : ""}`}>
            <div className="panel-header">
              <div className="panel-title">
                <div className="dot yaml" aria-hidden="true" />
                Formatted SQL
                {output && !formatting && <span className="success-tag">✓ formatted</span>}
              </div>
              {output && !formatting && (
                <div className="panel-actions">
                  <button className="btn-ghost" onClick={copyOutput}>
                    {copied ? "✓ Copied!" : "Copy"}
                  </button>
                </div>
              )}
            </div>
            <pre
              className={`output-pre${output && !formatting ? "" : " empty"}${formatting ? " loading" : ""}`}
              aria-live="polite"
            >
              {formatting ? "// Formatting…" : (output || "// Formatted SQL will appear here…")}
            </pre>
          </div>

        </div>

        <div className="options-bar">
          <label>
            Indent:
            <select
              value={opts.indent}
              onChange={(e) => setOpt("indent", e.target.value)}
            >
              <option value="  ">2 spaces</option>
              <option value="    ">4 spaces</option>
              <option value={"\t"}>Tab</option>
            </select>
          </label>
          <label>
            <input
              type="checkbox"
              checked={opts.uppercase}
              onChange={(e) => setOpt("uppercase", e.target.checked)}
            />
            Uppercase keywords
          </label>
        </div>

        <div className="actions">
          <button className="btn-secondary" onClick={loadExample}>Load Example</button>
          <button
            className="btn-convert"
            onClick={run}
            disabled={formatting || !input.trim()}
            aria-busy={formatting}
          >
            {formatting
              ? <><div className="btn-spinner" aria-hidden="true" /> Formatting…</>
              : <><ArrowRight size={16} aria-hidden="true" className="mr-1" /> Format SQL</>
            }
          </button>
          <button className="btn-secondary" onClick={clearAll}>Clear All</button>
        </div>
      </section>

      <section className="seo-content" aria-labelledby="about-heading">
        <h2 id="about-heading">About the SQL Formatter</h2>
        <p>
          This free online SQL formatter pretty-prints any SQL query so you can read
          it, review it in a pull request, or paste it into documentation. It breaks
          major clauses (FROM, WHERE, GROUP BY, ORDER BY, JOIN…) onto their own
          lines, aligns column lists, and optionally uppercases keywords. Works with
          Postgres, MySQL, MariaDB, SQLite, and MSSQL dialects.
        </p>

        <h3>Why Readable SQL Matters</h3>
        <p>
          A production query often lives longer than the ticket that produced it.
          Formatting makes it easy to spot missing joins, forgotten WHERE clauses,
          wrong column aliases, and off-by-one <code>LIMIT</code>s. Reviewers can
          see the shape of the query in one glance instead of chasing it through
          one unwrapped line.
        </p>

        <h3>Common Use Cases</h3>
        <ul>
          <li>Reformat ad-hoc queries pasted from Slack or chat</li>
          <li>Normalize SQL in migration scripts before committing</li>
          <li>Clean up ORM-generated queries (Hibernate, Prisma, Sequelize) for debugging</li>
          <li>Prepare SQL for documentation and runbooks</li>
          <li>Review DBA scripts and stored procedures</li>
        </ul>

        <h3>Formatting Rules</h3>
        <ul>
          <li>Each major clause starts on a new line</li>
          <li>Column lists in <code>SELECT</code> get one line per column</li>
          <li><code>AND</code> and <code>OR</code> are indented under <code>WHERE</code></li>
          <li><code>JOIN … ON …</code> stays on two lines for clarity</li>
          <li>Comments (<code>-- …</code> and <code>/* … */</code>) are preserved</li>
        </ul>

        <h3>Frequently Asked Questions</h3>

        <h3>Does it support stored procedures and PL/pgSQL?</h3>
        <p>
          Partially — the formatter is clause-aware rather than a full dialect
          parser, so complex procedural blocks keep their internals mostly intact.
          For heavy procedural code, run it through your IDE's dialect-specific
          formatter instead.
        </p>

        <h3>Is my SQL sent to a server?</h3>
        <p>
          No. The query is parsed and rewritten entirely in your browser — safe for
          queries that reference internal table names or confidential column
          structures.
        </p>

        <h3>Does it validate my SQL?</h3>
        <p>
          No — formatting is syntax-agnostic by design. A query that doesn't execute
          will still format. For validation, run the query against an actual
          database or use your dialect's EXPLAIN output.
        </p>

        <h3>Related Tools and Guides</h3>
        <p>
          Convert JSON data to <Link href="/tools/json-to-postgresql">PostgreSQL INSERT</Link>{" "}
          statements, or generate a <Link href="/tools/json-to-prisma-schema">Prisma
          schema</Link> from JSON. Read the{" "}
          <Link href="/blog/sql-formatting-guide">SQL formatting guide</Link> for
          deeper conventions.
        </p>
      </section>

      <section className="features" aria-label="Features">
        {[
          { icon: <Database size={24} />, title: "Dialect-friendly", desc: "Postgres, MySQL, SQLite, MSSQL — same formatter, same output." },
          { icon: <Zap size={24} />,      title: "Readable layout",  desc: "Clause-per-line output and indented AND/OR so reviews actually read." },
          { icon: <Lock size={24} />,     title: "Fully private",    desc: "Queries stay in your browser — never sent to a server." },
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
