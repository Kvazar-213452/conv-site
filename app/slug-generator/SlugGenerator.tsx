"use client";

import { useState, useCallback } from "react";
import { generateSlug, DEFAULT_OPTIONS, EXAMPLE_INPUTS, type SlugOptions } from "./utils";
import { Zap, Lock, Settings2, ArrowRight } from "lucide-react";

import "@/app/css/main.css";
import "@/app/css/bar.css";

export default function SlugGenerator() {
  const [input, setInput] = useState(EXAMPLE_INPUTS[0]);
  const [output, setOutput] = useState("");
  const [opts, setOpts] = useState<SlugOptions>(DEFAULT_OPTIONS);
  const [copied, setCopied] = useState(false);
  const [converting, setConverting] = useState(false);
  const [error, setError] = useState("");

  const convert = useCallback(() => {
    setError("");
    setOutput("");
    if (!input.trim()) return;
    setConverting(true);
    setTimeout(() => {
      try {
        const slug = generateSlug(input, opts);
        if (!slug) throw new Error("Result is empty — try different options or input text.");
        setOutput(slug);
      } catch (e) {
        setError((e as Error).message);
      }
      setConverting(false);
    }, 220);
  }, [input, opts]);

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const loadExample = () => {
    const random = EXAMPLE_INPUTS[Math.floor(Math.random() * EXAMPLE_INPUTS.length)];
    setInput(random);
    setOutput("");
    setError("");
  };

  const clearAll = () => { setInput(""); setOutput(""); setError(""); };

  const setOpt = <K extends keyof SlugOptions>(key: K, val: SlugOptions[K]) => {
    setOpts((prev: any) => ({ ...prev, [key]: val }));
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
          Slug <em>Generator</em>
        </h1>
        <p>
          Turn any text into a clean, URL-friendly slug. Supports Cyrillic transliteration,
          stop-word removal, custom separators, and length limits.
          Runs 100% in your browser — nothing leaves your device.
        </p>
      </section>

      {/* Error */}
      {error && (
        <div className="error-bar" role="alert" aria-live="assertive">
          <span aria-hidden="true">✕</span>
          <span>Error: {error}</span>
        </div>
      )}

      {/* Converter */}
      <section aria-label="Slug Converter">
        <div className="converter">

          {/* Input panel */}
          <div className={`panel${error ? " has-error" : ""}`}>
            <div className="panel-header">
              <div className="panel-title">
                <div className="dot json" aria-hidden="true" />
                Text Input
              </div>
              <div className="panel-actions">
                <button className="btn-ghost" onClick={loadExample}>Example</button>
                <button className="btn-ghost" onClick={() => { setInput(""); setError(""); }}>Clear</button>
              </div>
            </div>
            <textarea
              aria-label="Text Input"
              placeholder="Enter any text, title, or phrase…"
              value={input}
              onChange={(e) => { setInput(e.target.value); setError(""); setOutput(""); }}
              spellCheck={false}
              autoCorrect="off"
              autoCapitalize="off"
            />
          </div>

          {/* Output panel */}
          <div className={`panel${output ? " has-output" : ""}`}>
            <div className="panel-header">
              <div className="panel-title">
                <div className="dot xml" aria-hidden="true" />
                Slug Output
                {output && !converting && <span className="success-tag">✓ generated</span>}
              </div>
              <div className="panel-actions">
                {output && !converting && (
                  <button className="btn-ghost" onClick={copyOutput}>
                    {copied ? "✓ Copied!" : "Copy"}
                  </button>
                )}
              </div>
            </div>
            <pre
              className={`output-pre${output && !converting ? "" : " empty"}${converting ? " loading" : ""}`}
              aria-label="Slug Output"
              aria-live="polite"
            >
              {converting
                ? "// Generating…"
                : output || "// Your slug will appear here…"}
            </pre>
          </div>
        </div>

        {/* Options */}
        <div className="options-bar" style={{ marginTop: "1rem", display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "center" }}>
          <label style={{ display: "flex", alignItems: "center", gap: ".4rem", fontSize: ".85rem" }}>
            <Settings2 size={14} />
            Separator:
            <select
              value={opts.separator}
              onChange={(e) => setOpt("separator", e.target.value as SlugOptions["separator"])}
              style={{ marginLeft: ".3rem" }}
            >
              <option value="-">hyphen ( - )</option>
              <option value="_">underscore ( _ )</option>
              <option value=".">dot ( . )</option>
            </select>
          </label>

          <label style={{ display: "flex", alignItems: "center", gap: ".4rem", fontSize: ".85rem" }}>
            <input
              type="checkbox"
              checked={opts.lowercase}
              onChange={(e) => setOpt("lowercase", e.target.checked)}
            />
            Lowercase
          </label>

          <label style={{ display: "flex", alignItems: "center", gap: ".4rem", fontSize: ".85rem" }}>
            <input
              type="checkbox"
              checked={opts.removeStopWords}
              onChange={(e) => setOpt("removeStopWords", e.target.checked)}
            />
            Remove stop words
          </label>

          <label style={{ display: "flex", alignItems: "center", gap: ".4rem", fontSize: ".85rem" }}>
            Locale:
            <select
              value={opts.locale}
              onChange={(e) => setOpt("locale", e.target.value as SlugOptions["locale"])}
              style={{ marginLeft: ".3rem" }}
            >
              <option value="en">English</option>
              <option value="uk">Ukrainian</option>
              <option value="de">German</option>
              <option value="fr">French</option>
              <option value="es">Spanish</option>
            </select>
          </label>

          <label style={{ display: "flex", alignItems: "center", gap: ".4rem", fontSize: ".85rem" }}>
            Max length:
            <input
              type="number"
              min={10}
              max={200}
              placeholder="none"
              value={opts.maxLength ?? ""}
              onChange={(e) => setOpt("maxLength", e.target.value ? parseInt(e.target.value) : null)}
              style={{ width: "4.5rem", marginLeft: ".3rem" }}
            />
          </label>
        </div>

        {/* Action Buttons */}
        <div className="actions">
          <button className="btn-secondary" onClick={loadExample}>Load Example</button>
          <button
            className="btn-convert"
            onClick={convert}
            disabled={converting || !input.trim()}
            aria-busy={converting}
          >
            {converting
              ? <><div className="btn-spinner" aria-hidden="true" /> Generating…</>
              : <><ArrowRight size={16} aria-hidden="true" className="mr-1" /> Generate Slug</>
            }
          </button>
          <button className="btn-secondary" onClick={clearAll}>Clear All</button>
        </div>
      </section>

      {/* Features */}
      <section className="features" aria-label="Features">
        {[
          {
            icon: <Zap size={24} />,
            title: "Instant generation",
            desc: "Pure client-side processing. No latency, no server — results appear immediately.",
          },
          {
            icon: <Lock size={24} />,
            title: "Fully private",
            desc: "Your text never leaves the browser. Safe for sensitive titles, drafts, or internal docs.",
          },
          {
            icon: <Settings2 size={24} />,
            title: "Highly configurable",
            desc: "Cyrillic transliteration, stop-word removal, custom separators, length limits, and multi-locale support.",
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