"use client";

import { useState, useCallback } from "react";
import { ArrowUpDown, Shuffle, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { sortLines, type Order, type Compare } from "./utils";

import "@/style/main.css";
import "@/style/bar.css";

const EXAMPLE = `Banana
apple
Cherry
banana
10
2
abc`;

export default function LineSorter() {
  const [input, setInput] = useState(EXAMPLE);
  const [output, setOutput] = useState("");
  const [order, setOrder] = useState<Order>("asc");
  const [compare, setCompare] = useState<Compare>("natural");
  const [dedupe, setDedupe] = useState(false);
  const [ci, setCi] = useState(true);
  const [copied, setCopied] = useState(false);

  const run = useCallback(() => setOutput(sortLines(input, order, compare, dedupe, ci)), [input, order, compare, dedupe, ci]);
  const copy = () => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <>
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-eyebrow"><div className="hero-dot" />Free · No sign-up · Runs in browser</div>
        <h1 id="hero-heading">Line <em>Sorter</em></h1>
        <p>Sort lines alphabetically, naturally (10 after 2), numerically, or by length. Reverse, shuffle, dedupe, and case-insensitive options. 100% client-side.</p>
      </section>

      <section aria-label="Line Sorter">
        <div className="converter">
          <div className="panel">
            <div className="panel-header">
              <div className="panel-title"><div className="dot json" />Input</div>
              <div className="panel-actions">
                <button className="btn-ghost" onClick={() => setInput(EXAMPLE)}>Example</button>
                <button className="btn-ghost" onClick={() => setInput("")}>Clear</button>
              </div>
            </div>
            <textarea value={input} onChange={(e) => setInput(e.target.value)} spellCheck={false} />
          </div>
          <div className={`panel${output ? " has-output" : ""}`}>
            <div className="panel-header">
              <div className="panel-title"><div className="dot yaml" />Sorted{output && <span className="success-tag">✓ sorted</span>}</div>
              {output && <div className="panel-actions"><button className="btn-ghost" onClick={copy}>{copied ? "✓ Copied!" : "Copy"}</button></div>}
            </div>
            <pre className={`output-pre${output ? "" : " empty"}`} aria-live="polite">{output || "// Sorted output will appear here…"}</pre>
          </div>
        </div>

        <div className="options-bar">
          <label>Order:
            <select value={order} onChange={(e) => setOrder(e.target.value as Order)}>
              <option value="asc">ascending</option>
              <option value="desc">descending</option>
              <option value="reverse">reverse (as-is)</option>
              <option value="shuffle">shuffle (random)</option>
            </select>
          </label>
          <label>Compare:
            <select value={compare} onChange={(e) => setCompare(e.target.value as Compare)} disabled={order === "reverse" || order === "shuffle"}>
              <option value="natural">natural (10 after 2)</option>
              <option value="alpha">alphabetical</option>
              <option value="length">length</option>
              <option value="numeric">numeric</option>
            </select>
          </label>
          <label><input type="checkbox" checked={dedupe} onChange={(e) => setDedupe(e.target.checked)} /> Remove duplicates</label>
          <label><input type="checkbox" checked={ci} onChange={(e) => setCi(e.target.checked)} /> Case-insensitive</label>
        </div>

        <div className="actions">
          <button className="btn-convert" onClick={run} disabled={!input}><ArrowRight size={16} className="mr-1" /> Sort</button>
        </div>
      </section>

      <section className="seo-content" aria-labelledby="about-heading">
        <h2 id="about-heading">Line Sorter</h2>
        <p>Sort text lines with four comparison modes:</p>
        <ul>
          <li><strong>Natural</strong> — <code>file2.txt</code> before <code>file10.txt</code> (via <code>Intl.Collator</code>)</li>
          <li><strong>Alphabetical</strong> — strict character-by-character</li>
          <li><strong>Length</strong> — shortest to longest</li>
          <li><strong>Numeric</strong> — parses leading numbers</li>
        </ul>

        <h3>Related</h3>
        <p>Remove duplicates only with <Link href="/tools/remove-duplicate-lines">Remove Duplicate Lines</Link>, or diff two blocks with <Link href="/tools/text-diff">Text Diff</Link>.</p>
      </section>

      <section className="features" aria-label="Features">
        {[
          { icon: <ArrowUpDown size={24} />, title: "4 comparisons", desc: "Natural, alpha, length, numeric — plus asc/desc/reverse/shuffle." },
          { icon: <Shuffle size={24} />,     title: "Dedupe inline", desc: "Remove duplicates in one pass, case-aware." },
          { icon: <Lock size={24} />,        title: "Fully private", desc: "Text never leaves your browser." },
        ].map(({ icon, title, desc }) => (
          <div className="feature" key={title}><div className="feature-icon">{icon}</div><h3>{title}</h3><p>{desc}</p></div>
        ))}
      </section>
    </>
  );
}
