"use client";

import { useState, useCallback } from "react";
import { Type, Zap, Lock, ArrowRight } from "lucide-react";
import { reverseText, type Mode } from "./utils";

import "@/style/main.css";
import "@/style/bar.css";

const EXAMPLE = `Hello, World!
This is a test
Line three.`;

export default function TextReverser() {
  const [input, setInput] = useState(EXAMPLE);
  const [mode, setMode] = useState<Mode>("characters");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const run = useCallback(() => setOutput(reverseText(input, mode)), [input, mode]);
  const copy = () => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <>
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-eyebrow"><div className="hero-dot" />Free · No sign-up · Runs in browser</div>
        <h1 id="hero-heading">Text <em>Reverser</em></h1>
        <p>Reverse strings by characters, words, lines, or reverse the characters within each line. Unicode-safe. 100% client-side.</p>
      </section>

      <section aria-label="Text Reverser">
        <div className="converter">
          <div className="panel">
            <div className="panel-header">
              <div className="panel-title"><div className="dot json" />Text Input</div>
              <div className="panel-actions">
                <button className="btn-ghost" onClick={() => setInput(EXAMPLE)}>Example</button>
                <button className="btn-ghost" onClick={() => setInput("")}>Clear</button>
              </div>
            </div>
            <textarea value={input} onChange={(e) => setInput(e.target.value)} spellCheck={false} />
          </div>
          <div className={`panel${output ? " has-output" : ""}`}>
            <div className="panel-header">
              <div className="panel-title"><div className="dot yaml" />Reversed{output && <span className="success-tag">✓ reversed</span>}</div>
              {output && <div className="panel-actions"><button className="btn-ghost" onClick={copy}>{copied ? "✓ Copied!" : "Copy"}</button></div>}
            </div>
            <pre className={`output-pre${output ? "" : " empty"}`} aria-live="polite">{output || "// Reversed text will appear here…"}</pre>
          </div>
        </div>

        <div className="options-bar">
          <label>Reverse by:
            <select value={mode} onChange={(e) => setMode(e.target.value as Mode)}>
              <option value="characters">characters</option>
              <option value="words">words</option>
              <option value="lines">lines</option>
              <option value="lines-each">chars within each line</option>
            </select>
          </label>
        </div>

        <div className="actions">
          <button className="btn-convert" onClick={run} disabled={!input}><ArrowRight size={16} className="mr-1" /> Reverse</button>
        </div>
      </section>

      <section className="seo-content" aria-labelledby="about-heading">
        <h2 id="about-heading">Text Reverser</h2>
        <p>Reverse text in four different ways: by individual characters, by words (preserving whitespace), by whole lines, or by characters within each line independently. Uses JavaScript's iterator protocol for proper Unicode handling — emoji and accented characters count as single units, not pairs of surrogates.</p>

        <h3>Common Use Cases</h3>
        <ul>
          <li>Debug palindrome puzzles and interview exercises</li>
          <li>Reverse CSV columns or log lines for chronological ordering</li>
          <li>Create mirror text for creative design</li>
          <li>Test string handling in Unicode-aware code</li>
        </ul>

        <h3>FAQ</h3>
        <h3>Does it handle emoji correctly?</h3>
        <p>Yes. Spread syntax (<code>[...input]</code>) splits by code points, so emoji and combining characters stay intact.</p>
      </section>

      <section className="features" aria-label="Features">
        {[
          { icon: <Type size={24} />, title: "Four modes",     desc: "Characters, words, lines, or chars within each line." },
          { icon: <Zap size={24} />,  title: "Unicode-safe",   desc: "Emoji and accented chars count as single units." },
          { icon: <Lock size={24} />, title: "Fully private",  desc: "Text never leaves your browser." },
        ].map(({ icon, title, desc }) => (
          <div className="feature" key={title}><div className="feature-icon">{icon}</div><h3>{title}</h3><p>{desc}</p></div>
        ))}
      </section>
    </>
  );
}
