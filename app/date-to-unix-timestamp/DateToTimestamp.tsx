"use client";

import { useState, useCallback } from "react";
import {
  dateToTimestamp, timestampToDate, nowTimestamp,
  FORMAT_OPTIONS, type TimestampUnit, type DateFormat,
} from "./utils";
import { Clock, RefreshCw, ArrowRight, ArrowLeft, Timer } from "lucide-react";
import { EXAMPLE_DATES, EXAMPLE_TIMESTAMPS } from "@/lib/const";

import "@/app/css/main.css";

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
  const [mode, setMode]     = useState<Mode>("date2ts");
  const [input, setInput]   = useState(EXAMPLE_DATES);
  const [output, setOutput] = useState("");
  const [error, setError]   = useState("");
  const [copied, setCopied] = useState(false);
  const [converting, setConverting] = useState(false);
  const [unit, setUnit]     = useState<TimestampUnit>("seconds");
  const [fmt, setFmt]       = useState<DateFormat>("iso");

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

  const clearAll    = () => { setInput(""); setOutput(""); setError(""); };
  const loadExample = () => {
    setInput(isDate2Ts ? EXAMPLE_DATES : EXAMPLE_TIMESTAMPS);
    setOutput("");
    setError("");
  };

  const inputLabel        = isDate2Ts ? "Date Input" : "Timestamp Input";
  const outputLabel       = isDate2Ts ? "Unix Timestamp Output" : "Date Output";
  const errorPrefix       = isDate2Ts ? "Date Parse Error" : "Timestamp Error";
  const outputPlaceholder = isDate2Ts
    ? "// Unix timestamps will appear here…"
    : "// Formatted dates will appear here…";
  const inputPlaceholder  = isDate2Ts
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