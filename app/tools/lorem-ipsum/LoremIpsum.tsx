"use client";

import { useState, useCallback } from "react";
import { FileText, Zap, Settings2, ArrowRight } from "lucide-react";
import {
  generateLorem,
  DEFAULT_LOREM_OPTIONS,
  type LoremOptions,
  type LoremUnit,
} from "./utils";

import "@/style/main.css";
import "@/style/bar.css";

export default function LoremIpsum() {
  const [opts, setOpts] = useState<LoremOptions>(DEFAULT_LOREM_OPTIONS);
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);

  const generate = useCallback(() => {
    setGenerating(true);
    setTimeout(() => {
      setOutput(generateLorem(opts));
      setGenerating(false);
    }, 220);
  }, [opts]);

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
    a.download = "lorem.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearAll = () => setOutput("");

  const setOpt = <K extends keyof LoremOptions>(key: K, val: LoremOptions[K]) => {
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
          Lorem Ipsum <em>Generator</em>
        </h1>
        <p>
          Generate placeholder text in paragraphs, sentences, or words. Perfect for mockups,
          wireframes, and layout testing. Runs entirely in your browser.
        </p>
      </section>

      <section aria-label="Lorem Ipsum Generator">
        <div className="converter">

          <div className="panel">
            <div className="panel-header">
              <div className="panel-title">
                <div className="dot json" aria-hidden="true" />
                Options
              </div>
            </div>
            <pre className="output-pre empty" aria-hidden="true">
              {`// Configure your placeholder text below.
// Click Generate to produce lorem ipsum.`}
            </pre>
          </div>

          <div className={`panel${output ? " has-output" : ""}`}>
            <div className="panel-header">
              <div className="panel-title">
                <div className="dot yaml" aria-hidden="true" />
                Generated Text
                {output && !generating && <span className="success-tag">✓ generated</span>}
              </div>
              {output && !generating && (
                <div className="panel-actions">
                  <button className="btn-ghost" onClick={copyOutput}>
                    {copied ? "✓ Copied!" : "Copy"}
                  </button>
                  <button className="btn-ghost" onClick={downloadOutput}>
                    ↓ Download
                  </button>
                </div>
              )}
            </div>
            <pre
              className={`output-pre${output && !generating ? "" : " empty"}${generating ? " loading" : ""}`}
              aria-label="Generated text"
              aria-live="polite"
              style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
            >
              {generating
                ? "// Generating…"
                : output || "// Click Generate to produce lorem ipsum…"}
            </pre>
          </div>

        </div>

        {/* Options */}
        <div className="options-bar">
          <label>
            <Settings2 size={14} aria-hidden="true" />
            Unit:
            <select
              value={opts.unit}
              onChange={(e) => setOpt("unit", e.target.value as LoremUnit)}
            >
              <option value="paragraphs">Paragraphs</option>
              <option value="sentences">Sentences</option>
              <option value="words">Words</option>
            </select>
          </label>

          <label>
            Count:
            <input
              type="number"
              min={1}
              max={500}
              value={opts.count}
              onChange={(e) => setOpt("count", Math.max(1, parseInt(e.target.value) || 1))}
            />
          </label>

          <label>
            <input
              type="checkbox"
              checked={opts.startWithLorem}
              onChange={(e) => setOpt("startWithLorem", e.target.checked)}
            />
            Start with “Lorem ipsum dolor sit amet…”
          </label>
        </div>

        <div className="actions">
          <button
            className="btn-convert"
            onClick={generate}
            disabled={generating}
            aria-busy={generating}
          >
            {generating
              ? <><div className="btn-spinner" aria-hidden="true" /> Generating…</>
              : <><ArrowRight size={16} aria-hidden="true" className="mr-1" /> Generate</>
            }
          </button>
          <button className="btn-secondary" onClick={clearAll}>Clear</button>
        </div>
      </section>

      <section className="seo-content" aria-labelledby="about-heading">
        <h2 id="about-heading">About Lorem Ipsum Generator</h2>
        <p>
          Lorem Ipsum is standardized placeholder text used in design and typography since the
          1500s. This generator produces configurable amounts of paragraphs, sentences, or words —
          perfect for mockups, wireframes, email templates, CMS seed data, and layout testing.
          Everything runs locally in your browser.
        </p>

        <h3>How to Use</h3>
        <p>
          Pick a unit (paragraphs, sentences, or words), set the count, decide whether the output
          should begin with the classic “Lorem ipsum dolor sit amet…” phrase, and click Generate.
          Copy the result straight into your design tool, CMS, or code.
        </p>

        <h3>Key Benefits</h3>
        <ul>
          <li><strong>Three units:</strong> Paragraphs, sentences, or words — your choice</li>
          <li><strong>Flexible count:</strong> From 1 to 500 units in a single run</li>
          <li><strong>Classic opener:</strong> Toggle the familiar “Lorem ipsum dolor sit amet…” start</li>
          <li><strong>Fully private:</strong> No network calls — safe behind firewalls and VPNs</li>
          <li><strong>Copy &amp; download:</strong> Grab the output as text or save it to a file</li>
        </ul>
      </section>

      <section className="features" aria-label="Features">
        {[
          {
            icon: <Zap size={24} />,
            title: "Instant generation",
            desc: "Pure client-side JavaScript — new text appears the moment you click Generate.",
          },
          {
            icon: <Settings2 size={24} />,
            title: "Fully configurable",
            desc: "Choose paragraphs, sentences, or words, pick a count, and toggle the classic opener.",
          },
          {
            icon: <FileText size={24} />,
            title: "Design-ready",
            desc: "Clean prose with natural sentence lengths and commas — paste straight into any layout.",
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
