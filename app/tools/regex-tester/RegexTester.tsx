"use client";

import { useState, useMemo } from "react";
import { Search, Lock, Zap } from "lucide-react";
import { findMatches, highlightMatches, type RegexMatch } from "./utils";
import {
  EXAMPLE_REGEX_PATTERN,
  EXAMPLE_REGEX_FLAGS,
  EXAMPLE_REGEX_TEXT,
} from "@/lib/const";

import "@/style/main.css";
import "./main.css";

type RunResult = {
  matches: RegexMatch[];
  error: string;
};

export default function RegexTester() {
  const [pattern, setPattern] = useState(EXAMPLE_REGEX_PATTERN);
  const [flags, setFlags] = useState(EXAMPLE_REGEX_FLAGS);
  const [text, setText] = useState(EXAMPLE_REGEX_TEXT);

  const { matches, error }: RunResult = useMemo(() => {
    if (!pattern) return { matches: [], error: "" };
    try {
      return { matches: findMatches(pattern, flags, text), error: "" };
    } catch (e) {
      return { matches: [], error: (e as Error).message };
    }
  }, [pattern, flags, text]);

  const segments = useMemo(() => highlightMatches(text, matches), [text, matches]);

  const loadExample = () => {
    setPattern(EXAMPLE_REGEX_PATTERN);
    setFlags(EXAMPLE_REGEX_FLAGS);
    setText(EXAMPLE_REGEX_TEXT);
  };

  const clearAll = () => { setPattern(""); setFlags(""); setText(""); };

  return (
    <>
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-eyebrow">
          <div className="hero-dot" aria-hidden="true" />
          Free · No sign-up · Runs in browser
        </div>
        <h1 id="hero-heading">
          Regex <em>Tester</em>
        </h1>
        <p>
          Build and debug JavaScript regular expressions with live highlighting,
          capture groups, and match counts. All processing runs locally in your browser.
        </p>
      </section>

      {error && (
        <div className="error-bar" role="alert" aria-live="assertive">
          <span aria-hidden="true">✕</span>
          <span>Regex Error: {error}</span>
        </div>
      )}

      <section aria-label="Regex Tester">
        <div className="converter">

          <div className={`panel${error ? " has-error" : ""}`}>
            <div className="panel-header">
              <div className="panel-title">
                <div className="dot json" aria-hidden="true" />
                Pattern &amp; Test Text
              </div>
              <div className="panel-actions">
                <button className="btn-ghost" onClick={loadExample}>Example</button>
                <button className="btn-ghost" onClick={clearAll}>Clear</button>
              </div>
            </div>

            <div className="rx-pattern-bar">
              <input
                type="text"
                aria-label="Regex pattern"
                placeholder="Pattern…"
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                spellCheck={false} autoCorrect="off" autoCapitalize="off"
                className="rx-input"
              />
              <input
                type="text"
                aria-label="Flags"
                placeholder="flags"
                value={flags}
                onChange={(e) => setFlags(e.target.value)}
                spellCheck={false} autoCorrect="off" autoCapitalize="off"
                className="rx-input rx-flags"
              />
            </div>

            <textarea
              aria-label="Test text"
              placeholder="Paste or type the text to search…"
              value={text}
              onChange={(e) => setText(e.target.value)}
              spellCheck={false} autoCorrect="off" autoCapitalize="off"
            />
          </div>

          <div className={`panel${matches.length ? " has-output" : ""}`}>
            <div className="panel-header">
              <div className="panel-title">
                <div className="dot yaml" aria-hidden="true" />
                Matches
                {!error && matches.length > 0 && (
                  <span className="success-tag">
                    ✓ {matches.length} match{matches.length === 1 ? "" : "es"}
                  </span>
                )}
              </div>
            </div>

            {!pattern && (
              <pre className="output-pre empty" aria-live="polite">
                {`// Enter a pattern to see matches…`}
              </pre>
            )}
            {pattern && !matches.length && !error && (
              <pre className="output-pre empty" aria-live="polite">
                {`// No matches`}
              </pre>
            )}
            {matches.length > 0 && (
              <>
                <div className="rx-highlight" aria-live="polite">
                  {segments.map((seg, i) =>
                    seg.kind === "match"
                      ? <mark key={i} className="rx-mark">{seg.value}</mark>
                      : <span key={i}>{seg.value}</span>,
                  )}
                </div>
                <div className="rx-list">
                  {matches.slice(0, 50).map((m, i) => (
                    <div className="rx-list-item" key={i}>
                      <span className="rx-list-index">#{i + 1}</span>
                      <code>{JSON.stringify(m.match)}</code>
                      <span className="rx-list-pos">at {m.index}</span>
                      {m.groups.length > 0 && (
                        <span className="rx-list-pos">
                          · groups: {m.groups.map((g) => JSON.stringify(g)).join(", ")}
                        </span>
                      )}
                    </div>
                  ))}
                  {matches.length > 50 && (
                    <span className="rx-list-more">
                      … and {matches.length - 50} more
                    </span>
                  )}
                </div>
              </>
            )}
          </div>

        </div>
      </section>

      <section className="seo-content" aria-labelledby="about-heading">
        <h2 id="about-heading">About Regex Tester Tool</h2>
        <p>
          This free online regex tester lets you build and debug JavaScript regular expressions
          with live match highlighting. Enter a pattern, choose your flags (<code>gimsuy</code>),
          and watch matches update in real time as you type. Positional and named capture groups
          are listed for every match. Perfect for building validators, scrapers, parsers, and
          search features.
        </p>

        <h3>Supported Flags</h3>
        <p>
          <strong>g</strong> global, <strong>i</strong> case-insensitive, <strong>m</strong> multiline,
          <strong>s</strong> dotAll, <strong>u</strong> Unicode, <strong>y</strong> sticky. The tool
          enforces the <code>g</code> flag internally to enumerate matches while preserving the
          semantics of your other flags.
        </p>

        <h3>Key Benefits</h3>
        <ul>
          <li><strong>Live highlighting:</strong> Matches appear in-text as you edit the pattern or flags</li>
          <li><strong>Capture groups:</strong> Positional and named groups are listed for every match</li>
          <li><strong>Match positions:</strong> Each match shows its start index in the source text</li>
          <li><strong>Fully private:</strong> Patterns and test data stay in your browser</li>
          <li><strong>Guard rails:</strong> Up to 1000 matches displayed to keep the UI responsive</li>
        </ul>
      </section>

      <section className="features" aria-label="Features">
        {[
          {
            icon: <Zap size={24} />,
            title: "Live matching",
            desc: "Matches update instantly as you edit the pattern, flags, or test text.",
          },
          {
            icon: <Lock size={24} />,
            title: "Fully private",
            desc: "Patterns and test data stay in your browser — safe for proprietary data.",
          },
          {
            icon: <Search size={24} />,
            title: "Group capture",
            desc: "Positional and named groups are shown for every match for easy debugging.",
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
