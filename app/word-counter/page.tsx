"use client";

import { useState, useCallback } from "react";
import {
  countText,
  formatReadingTime,
  DEFAULT_OPTIONS,
  EXAMPLE_INPUTS,
  type CountOptions,
  type CountResult,
} from "./utils";
import { BarChart2, Lock, Settings2 } from "lucide-react";

import "@/app/css/main.css";
import "@/app/css/bar.css";
import "@/app/css/bar_footer.css";
import "./main.css";

const STAT_CARDS = (r: CountResult) => [
  { value: r.words,               label: "Words",               accent: true  },
  { value: r.characters,          label: "Characters",          accent: false },
  { value: r.charactersNoSpaces,  label: "No spaces",           accent: false },
  { value: r.sentences,           label: "Sentences",           accent: false },
  { value: r.paragraphs,          label: "Paragraphs",          accent: false },
  { value: r.lines,               label: "Lines",               accent: false },
  { value: r.uniqueWords,         label: "Unique words",        accent: false },
  { value: formatReadingTime(r.readingTimeSec), label: "Reading time", accent: false },
];

export default function WordCounter() {
  const [input, setInput] = useState(EXAMPLE_INPUTS[0]);
  const [opts, setOpts] = useState<CountOptions>(DEFAULT_OPTIONS);
  const [result, setResult] = useState<CountResult | null>(null);
  const [counting, setCounting] = useState(false);
  const [error, setError] = useState("");

  const count = useCallback(() => {
    setError("");
    if (!input.trim()) { setResult(null); return; }
    setCounting(true);
    setTimeout(() => {
      try {
        setResult(countText(input, opts));
      } catch (e) {
        setError((e as Error).message);
      }
      setCounting(false);
    }, 180);
  }, [input, opts]);

  const loadExample = () => {
    const r = EXAMPLE_INPUTS[Math.floor(Math.random() * EXAMPLE_INPUTS.length)];
    setInput(r);
    setResult(null);
    setError("");
  };

  const clearAll = () => { setInput(""); setResult(null); setError(""); };

  const setOpt = <K extends keyof CountOptions>(key: K, val: CountOptions[K]) => {
    setOpts((prev) => ({ ...prev, [key]: val }));
    setResult(null);
  };

  const maxTopCount = result?.topWords[0]?.count ?? 1;

  return (
    <>
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-eyebrow">
          <div className="hero-dot" aria-hidden="true" />
          Free · No sign-up · Runs in browser
        </div>
        <h1 id="hero-heading">
          Word <em>Counter</em>
        </h1>
        <p>
          Paste any text and instantly get words, characters, sentences, paragraphs,
          reading time, unique words, and top word frequency. Runs 100% in your
          browser — nothing leaves your device.
        </p>
      </section>

      {error && (
        <div className="error-bar" role="alert" aria-live="assertive">
          <span aria-hidden="true">✕</span>
          <span>Error: {error}</span>
        </div>
      )}

      <section aria-label="Word Counter">

        {/* Single textarea panel */}
        <div className={`panel panel--full${error ? " has-error" : ""}`}>
          <div className="panel-header">
            <div className="panel-title">
              <div className="dot json" aria-hidden="true" />
              Text Input
              {result && !counting && (
                <span className="success-tag">✓ {result.words} words</span>
              )}
            </div>
            <div className="panel-actions">
              <button className="btn-ghost" onClick={loadExample}>Example</button>
              <button className="btn-ghost" onClick={() => { setInput(""); setResult(null); setError(""); }}>Clear</button>
            </div>
          </div>
          <textarea
            aria-label="Text Input"
            placeholder={"Paste or type your text here…"}
            value={input}
            onChange={(e) => { setInput(e.target.value); setResult(null); setError(""); }}
            spellCheck={false}
            autoCorrect="off"
            autoCapitalize="off"
            style={{ minHeight: "220px" }}
          />
        </div>

        {/* Options */}
        <div className="options-bar">
          <label>
            <Settings2 size={14} aria-hidden="true" />
            Options:
          </label>
          <label>
            <input
              type="checkbox"
              checked={opts.ignoreCase}
              onChange={(e) => setOpt("ignoreCase", e.target.checked)}
            />
            Case-insensitive word frequency
          </label>
          <label>
            <input
              type="checkbox"
              checked={opts.excludePunctuation}
              onChange={(e) => setOpt("excludePunctuation", e.target.checked)}
            />
            Exclude punctuation
          </label>
          <label>
            <input
              type="checkbox"
              checked={opts.excludeNumbers}
              onChange={(e) => setOpt("excludeNumbers", e.target.checked)}
            />
            Exclude numbers
          </label>
        </div>

        {/* Action Buttons */}
        <div className="actions">
          <button className="btn-secondary" onClick={loadExample}>Load Example</button>
          <button
            className="btn-convert"
            onClick={count}
            disabled={counting || !input.trim()}
            aria-busy={counting}
          >
            {counting
              ? <><div className="btn-spinner" aria-hidden="true" /> Counting…</>
              : <><BarChart2 size={16} aria-hidden="true" className="mr-1" /> Count Words</>
            }
          </button>
          <button className="btn-secondary" onClick={clearAll}>Clear All</button>
        </div>

        {/* Stats grid */}
        {result && !counting && (
          <div className="wc-stats" aria-live="polite">
            <div className="wc-grid">
              {STAT_CARDS(result).map(({ value, label, accent }) => (
                <div className={`wc-card${accent ? " wc-card--accent" : ""}`} key={label}>
                  <span className="wc-card-value">{value}</span>
                  <span className="wc-card-label">{label}</span>
                </div>
              ))}
            </div>

            {/* Top words */}
            {result.topWords.length > 0 && (
              <div className="wc-top">
                <h3 className="wc-top-title">Top Words</h3>
                <div className="wc-bars">
                  {result.topWords.map(({ word, count }) => (
                    <div className="wc-bar-row" key={word}>
                      <span className="wc-bar-word">{word}</span>
                      <div className="wc-bar-track">
                        <div
                          className="wc-bar-fill"
                          style={{ width: `${Math.round((count / maxTopCount) * 100)}%` }}
                          aria-label={`${count} occurrences`}
                        />
                      </div>
                      <span className="wc-bar-count">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Features */}
      <section className="features" aria-label="Features">
        {[
          {
            icon: <BarChart2 size={24} />,
            title: "Detailed statistics",
            desc: "Words, characters, sentences, paragraphs, lines, unique words, and estimated reading time — all at a glance.",
          },
          {
            icon: <Lock size={24} />,
            title: "Fully private",
            desc: "Your text never leaves the browser. Safe for drafts, essays, emails, or any sensitive content.",
          },
          {
            icon: <Settings2 size={24} />,
            title: "Configurable counting",
            desc: "Toggle case-insensitive frequency, exclude punctuation or numbers to suit your specific analysis needs.",
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