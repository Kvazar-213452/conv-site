"use client";

import { useState, useCallback } from "react";
import {
  dateToTimestamp, timestampToDate, nowTimestamp,
  FORMAT_OPTIONS, type TimestampUnit, type DateFormat,
} from "./utils";
import { Clock, RefreshCw, ArrowRight, ArrowLeft, Timer } from "lucide-react";
import { EXAMPLE_DATES, EXAMPLE_TIMESTAMPS } from "@/lib/const";

import "@/style/main.css";

type Mode = "date2ts" | "ts2date";

// ── Live clock ────────────────────────────────────────────────

function LiveNow({ unit }: { unit: TimestampUnit }) {
  const [ts, setTs] = useState(() => nowTimestamp(unit));

  useState(() => {
    const id = setInterval(() => setTs(nowTimestamp(unit)), unit === "seconds" ? 1000 : 100);
    return () => clearInterval(id);
  });

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: "10px",
      marginTop: "14px",
      fontFamily: "var(--font-mono)",
      fontSize: "13px",
      color: "var(--text-2)",
    }}>
      <Timer size={14} style={{ color: "var(--accent)" }} />
      <span>Now:</span>
      <span style={{ color: "var(--text)", fontWeight: 600, letterSpacing: ".04em" }}>{ts}</span>
      <span style={{ color: "var(--text-3)" }}>({unit})</span>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────

export default function DateToTimestamp() {
  const [mode, setMode] = useState<Mode>("date2ts");
  const [input, setInput] = useState(EXAMPLE_DATES);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [converting, setConverting] = useState(false);
  const [unit, setUnit] = useState<TimestampUnit>("seconds");
  const [fmt, setFmt] = useState<DateFormat>("iso");

  const isDate2Ts = mode === "date2ts";

  const switchMode = (next: Mode) => {
    setMode(next);
    setInput(next === "date2ts" ? EXAMPLE_DATES : EXAMPLE_TIMESTAMPS);
    setOutput("");
    setError("");
  };

  const swapWithOutput = () => {
    if (!output) return;
    const next: Mode = isDate2Ts ? "ts2date" : "date2ts";
    setMode(next);
    setInput(output);
    setOutput("");
    setError("");
  };

  const insertNow = () => {
    const ts = nowTimestamp(unit);
    if (isDate2Ts) {
      setInput((prev) => (prev ? prev + "\n" + new Date().toISOString() : new Date().toISOString()));
    } else {
      setInput((prev) => (prev ? prev + "\n" + ts : ts));
    }
    setError("");
  };

  const convert = useCallback(() => {
    setError("");
    setOutput("");
    setConverting(true);
    setTimeout(() => {
      try {
        if (isDate2Ts) {
          setOutput(dateToTimestamp(input, unit));
        } else {
          setOutput(timestampToDate(input, unit, fmt));
        }
      } catch (e) {
        setError((e as Error).message);
      }
      setConverting(false);
    }, 280);
  }, [input, isDate2Ts, unit, fmt]);

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadOutput = () => {
    const blob = new Blob([output], { type: "text/plain;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "output.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearAll = () => { setInput(""); setOutput(""); setError(""); };
  const loadExample = () => {
    setInput(isDate2Ts ? EXAMPLE_DATES : EXAMPLE_TIMESTAMPS);
    setOutput("");
    setError("");
  };

  const inputLabel = isDate2Ts ? "Date Input" : "Timestamp Input";
  const outputLabel = isDate2Ts ? "Unix Timestamp Output" : "Date Output";
  const errorPrefix = isDate2Ts ? "Date Parse Error" : "Timestamp Error";
  const outputPlaceholder = isDate2Ts
    ? "// Unix timestamps will appear here…"
    : "// Formatted dates will appear here…";
  const inputPlaceholder = isDate2Ts
    ? "2024-01-15\n2024-01-15T08:00:00Z\none date per line"
    : "1705305600\none timestamp per line";

  return (
    <>
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-eyebrow">
          <div className="hero-dot" aria-hidden="true" />
          Free · No sign-up · Runs in browser
        </div>
        <h1 id="hero-heading">
          {isDate2Ts
            ? <>Date <em>→</em> Unix</>
            : <>Unix <em>→</em> Date</>}
          <br />Timestamp Converter
        </h1>
        <p>
          {isDate2Ts
            ? "Convert human-readable dates to Unix timestamps — seconds or milliseconds. Accepts ISO 8601, RFC 2822, locale strings, and more."
            : "Convert Unix timestamps back to readable dates. Choose from ISO 8601, UTC, locale, or RFC 2822 output formats."
          }{" "}
          Runs 100% in your browser — nothing leaves your device.
        </p>

        <div className="mode-toggle" role="group" aria-label="Conversion direction">
          <button
            className={`mode-btn${isDate2Ts ? " active" : ""}`}
            onClick={() => switchMode("date2ts")}
          >
            Date → Unix
          </button>
          <button
            className="mode-swap-btn"
            onClick={() => output ? swapWithOutput() : switchMode(isDate2Ts ? "ts2date" : "date2ts")}
            title={output ? "Move output to input & flip direction" : "Flip direction"}
            aria-label="Swap conversion direction"
          >
            ⇄
          </button>
          <button
            className={`mode-btn${!isDate2Ts ? " active" : ""}`}
            onClick={() => switchMode("ts2date")}
          >
            Unix → Date
          </button>
        </div>
      </section>

      {error && (
        <div className="error-bar" role="alert" aria-live="assertive">
          <span aria-hidden="true">✕</span>
          <span style={{ whiteSpace: "pre" }}>{errorPrefix}: {error}</span>
        </div>
      )}

      <section aria-label="Converter">
        <div className="converter">

          <div className={`panel${error ? " has-error" : ""}`}>
            <div className="panel-header">
              <div className="panel-title">
                <div className="dot json" aria-hidden="true" />
                {inputLabel}
              </div>
              <div className="panel-actions">
                <button className="btn-ghost" onClick={insertNow} title="Insert current time">
                  <RefreshCw size={11} style={{ display: "inline", marginRight: "4px", verticalAlign: "middle" }} />
                  Now
                </button>
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
                <div className="dot sql" aria-hidden="true" />
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
              {converting ? "// Converting…" : (output || outputPlaceholder)}
            </pre>
          </div>

        </div>

        {/* Options row */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "20px", marginTop: "14px", flexWrap: "wrap" }}>

          {/* Unit toggle */}
          <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "var(--text-2)", fontFamily: "var(--font-mono)" }}>
            Unit:
            {(["seconds", "milliseconds"] as TimestampUnit[]).map((u) => (
              <button
                key={u}
                onClick={() => setUnit(u)}
                style={{
                  padding: "5px 12px",
                  borderRadius: "99px",
                  border: `1px solid ${unit === u ? "var(--accent)" : "var(--border-2)"}`,
                  background: unit === u ? "var(--accent-dim)" : "transparent",
                  color: unit === u ? "var(--accent)" : "var(--text-2)",
                  fontSize: "12px",
                  fontFamily: "var(--font-mono)",
                  cursor: "pointer",
                  transition: "all .15s",
                }}
              >
                {u === "seconds" ? "s" : "ms"}
              </button>
            ))}
          </label>

          {/* Format selector — only for ts2date */}
          {!isDate2Ts && (
            <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "var(--text-2)", fontFamily: "var(--font-mono)", flexWrap: "wrap", justifyContent: "center" }}>
              Format:
              {FORMAT_OPTIONS.map(({ value, label, example }) => (
                <button
                  key={value}
                  onClick={() => setFmt(value)}
                  title={example}
                  style={{
                    padding: "5px 12px",
                    borderRadius: "99px",
                    border: `1px solid ${fmt === value ? "var(--accent)" : "var(--border-2)"}`,
                    background: fmt === value ? "var(--accent-dim)" : "transparent",
                    color: fmt === value ? "var(--accent)" : "var(--text-2)",
                    fontSize: "12px",
                    fontFamily: "var(--font-mono)",
                    cursor: "pointer",
                    transition: "all .15s",
                  }}
                >
                  {label}
                </button>
              ))}
            </label>
          )}
        </div>

        {/* Live clock */}
        <LiveNow unit={unit} />

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
              : isDate2Ts
                ? <><ArrowRight size={16} aria-hidden="true" className="mr-1" /> To Timestamp</>
                : <><ArrowLeft size={16} aria-hidden="true" className="mr-1" /> To Date</>
            }
          </button>
          <button className="btn-secondary" onClick={clearAll}>Clear All</button>
        </div>
      </section>

      <section className="seo-content" aria-labelledby="about-heading">
        <h2 id="about-heading">About Date to Unix Timestamp Converter</h2>
        <p>
          This free online date and Unix timestamp converter tool allows you to transform between human-readable dates
          and Unix timestamps instantly. Whether you're a developer working with APIs, databases, or system logs, our
          bidirectional converter handles both date-to-timestamp and timestamp-to-date conversions seamlessly in your browser.
          Switch between seconds and milliseconds, choose from 5 different output formats, and convert multiple entries at once.
        </p>

        <h3>Why Convert Between Dates and Unix Timestamps?</h3>
        <p>
          Unix timestamps (also known as Epoch time or POSIX time) represent time as the number of seconds (or milliseconds)
          since January 1, 1970 00:00:00 UTC. They're essential for programming, databases, and system administration because
          they provide a timezone-independent way to store and compare dates. Converting between human-readable dates and
          timestamps is crucial for debugging logs, working with APIs, scheduling tasks, analyzing data, and synchronizing
          systems across different timezones.
        </p>

        <h3>How to Use This Converter</h3>
        <p>
          Converting dates and timestamps is straightforward: choose your conversion direction (Date → Unix or Unix → Date)
          using the mode toggle at the top. Paste or type your dates or timestamps into the input field (one per line for
          batch conversion). Select your preferred unit (seconds or milliseconds) and output format if converting timestamps
          to dates. Click the convert button to get your results instantly. Use the "Now" button to insert the current
          timestamp, and the swap button to flip the conversion direction with your output.
        </p>

        <h3>Key Benefits</h3>
        <ul>
          <li><strong>No installation required:</strong> Works directly in your browser without any software downloads</li>
          <li><strong>Completely free:</strong> No registration, credit card, or hidden fees</li>
          <li><strong>Secure and private:</strong> All conversion happens locally - your data never reaches our servers</li>
          <li><strong>Fast processing:</strong> Instant conversion with no waiting time</li>
          <li><strong>Bidirectional:</strong> Convert Date → Unix or Unix → Date with one click</li>
          <li><strong>Batch conversion:</strong> Process multiple dates or timestamps simultaneously</li>
          <li><strong>5 output formats:</strong> ISO 8601 UTC, ISO 8601 Local, UTC string, Locale, and RFC 2822</li>
          <li><strong>Live clock:</strong> See current timestamp updating in real-time</li>
        </ul>

        <h3>Common Use Cases</h3>
        <p>
          Developers use timestamp converters for debugging server logs with Unix timestamps, converting API response dates
          for database storage, scheduling cron jobs and automated tasks, working with JavaScript Date.now() milliseconds,
          analyzing log files from different systems and timezones. Database administrators convert timestamps for queries
          and data migration. DevOps engineers troubleshoot deployment timestamps and system events. Data analysts transform
          timestamps for visualization and reporting. QA testers verify date handling in applications across timezones.
        </p>

        <h3>Supported Date Formats</h3>
        <p>
          Our converter accepts a wide variety of date input formats including ISO 8601 (2024-01-15T08:00:00Z), RFC 2822
          (Mon, 15 Jan 2024 08:00:00 GMT), locale strings (January 15, 2024), natural formats (Jan 15 2024, 1/15/2024),
          and more. For timestamp-to-date conversion, choose from ISO 8601 UTC, ISO 8601 Local (with timezone offset),
          UTC string format, locale-specific format, or RFC 2822 format depending on your system requirements.
        </p>

        <h3>Technical Features</h3>
        <p>
          Our converter handles both Unix seconds (standard) and milliseconds (JavaScript), processes multiple dates or
          timestamps in batch mode (one per line), displays a live updating clock showing current timestamp, provides
          accurate timezone conversion, validates input and shows clear error messages, preserves precision for
          millisecond timestamps, supports dates from 1970 to 2038+ (64-bit timestamps), and includes quick actions
          like "Now" button, copy, download, and swap functionality for efficient workflow.
        </p>

        <h3>Privacy and Security</h3>
        <p>
          Unlike online converters that send your data to remote servers, this tool processes everything locally in your
          browser using JavaScript. Your server logs, database timestamps, deployment times, or any time-sensitive data
          never leave your computer, making it safe for converting confidential information. No cookies, tracking, or
          data storage. Perfect for working with production logs, internal system times, or any sensitive temporal data.
        </p>
      </section>

      <section className="features" aria-label="Features">
        {[
          {
            icon: <Clock size={24} />,
            title: "Flexible date input",
            desc: "Accepts ISO 8601, RFC 2822, locale strings, and natural formats like Jan 15 2024. One date per line for batch conversion.",
          },
          {
            icon: <Timer size={24} />,
            title: "Seconds & milliseconds",
            desc: "Switch between Unix seconds (standard) and milliseconds (JavaScript Date.now()) with one click. Live clock always shown.",
          },
          {
            icon: <RefreshCw size={24} />,
            title: "5 output formats",
            desc: "ISO 8601 UTC, ISO 8601 Local, UTC string, Locale, RFC 2822 — pick the format your system needs.",
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