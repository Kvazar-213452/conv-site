"use client";

import { useState, useCallback } from "react";
import { Image, Zap, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";
import {
  optimizeSvg,
  DEFAULT_SVG_OPTIONS,
  formatBytes,
  type SvgOptions,
  type OptimizeResult,
} from "./utils";

import "@/style/main.css";
import "@/style/bar.css";
import "./main.css";

const EXAMPLE_SVG = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!-- Created with Inkscape (http://www.inkscape.org/) -->
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
     xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.0.dtd"
     xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
     width="64" height="64" viewBox="0 0 64 64">
  <title>Example icon</title>
  <desc>Hand-drawn example</desc>
  <metadata id="metadata1"><rdf:RDF/></metadata>
  <sodipodi:namedview inkscape:zoom="1.0" />
  <circle cx="32.00000" cy="32.00000" r="24.000000" fill="#3366ff" />
  <path d="M20.000000 32.000000 L32.000000 44.000000 L52.000000 20.000000"
        stroke="#ffffff" stroke-width="4.0000000" fill="none" />
</svg>`;

export default function SvgOptimizer() {
  const [input, setInput] = useState(EXAMPLE_SVG);
  const [result, setResult] = useState<OptimizeResult | null>(null);
  const [opts, setOpts] = useState<SvgOptions>(DEFAULT_SVG_OPTIONS);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [working, setWorking] = useState(false);

  const run = useCallback(() => {
    setError("");
    setResult(null);
    if (!input.trim()) return;
    setWorking(true);
    setTimeout(() => {
      try {
        setResult(optimizeSvg(input, opts));
      } catch (e) {
        setError((e as Error).message);
      }
      setWorking(false);
    }, 220);
  }, [input, opts]);

  const copyOutput = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadOutput = () => {
    if (!result) return;
    const blob = new Blob([result.output], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "optimized.svg";
    a.click();
    URL.revokeObjectURL(url);
  };

  const loadExample = () => { setInput(EXAMPLE_SVG); setResult(null); setError(""); };
  const clearAll   = () => { setInput(""); setResult(null); setError(""); };

  const setOpt = <K extends keyof SvgOptions>(key: K, val: SvgOptions[K]) => {
    setOpts((prev) => ({ ...prev, [key]: val }));
    setResult(null);
  };

  return (
    <>
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-eyebrow">
          <div className="hero-dot" aria-hidden="true" />
          Free · No sign-up · Runs in browser
        </div>
        <h1 id="hero-heading">
          SVG <em>Optimizer</em>
        </h1>
        <p>
          Minify SVG files for the web — strip editor metadata (Inkscape, Illustrator),
          shorten hex colors, round long decimals, and collapse whitespace. Live
          preview and size readout. 100% client-side.
        </p>
      </section>

      {error && (
        <div className="error-bar" role="alert" aria-live="assertive">
          <span aria-hidden="true">✕</span>
          <span>Error: {error}</span>
        </div>
      )}

      <section aria-label="SVG Optimizer">
        <div className="converter">

          <div className={`panel${error ? " has-error" : ""}`}>
            <div className="panel-header">
              <div className="panel-title">
                <div className="dot json" aria-hidden="true" />
                SVG Input
              </div>
              <div className="panel-actions">
                <button className="btn-ghost" onClick={loadExample}>Example</button>
                <button className="btn-ghost" onClick={() => { setInput(""); setError(""); }}>Clear</button>
              </div>
            </div>
            <textarea
              aria-label="SVG input"
              placeholder="<svg xmlns=…>…</svg>"
              value={input}
              onChange={(e) => { setInput(e.target.value); setError(""); }}
              spellCheck={false} autoCorrect="off" autoCapitalize="off"
            />
            <div className="svg-preview">
              <div className="svg-preview-box" dangerouslySetInnerHTML={{ __html: input }} />
              <span className="svg-preview-label">Input preview</span>
            </div>
          </div>

          <div className={`panel${result ? " has-output" : ""}`}>
            <div className="panel-header">
              <div className="panel-title">
                <div className="dot yaml" aria-hidden="true" />
                Optimized SVG
                {result && !working && <span className="success-tag">✓ −{result.savedPercent}%</span>}
              </div>
              {result && !working && (
                <div className="panel-actions">
                  <button className="btn-ghost" onClick={copyOutput}>
                    {copied ? "✓ Copied!" : "Copy"}
                  </button>
                  <button className="btn-ghost" onClick={downloadOutput}>↓ .svg</button>
                </div>
              )}
            </div>
            <pre
              className={`output-pre${result && !working ? "" : " empty"}${working ? " loading" : ""}`}
              aria-live="polite"
            >
              {working ? "// Optimizing…" : (result?.output || "// Optimized SVG will appear here…")}
            </pre>
            {result && !working && (
              <>
                <div className="svg-preview">
                  <div className="svg-preview-box" dangerouslySetInnerHTML={{ __html: result.output }} />
                  <span className="svg-preview-label">Optimized preview</span>
                </div>
                <div className="svg-stats">
                  <span className="svg-stat"><strong>Before:</strong>{formatBytes(result.before)}</span>
                  <span className="svg-stat"><strong>After:</strong>{formatBytes(result.after)}</span>
                  <span className="svg-stat saved"><strong>Saved:</strong>{result.savedPercent}%</span>
                </div>
              </>
            )}
          </div>

        </div>

        <div className="options-bar">
          <label>
            <input type="checkbox" checked={opts.removeComments} onChange={(e) => setOpt("removeComments", e.target.checked)} />
            Comments
          </label>
          <label>
            <input type="checkbox" checked={opts.removeMetadata} onChange={(e) => setOpt("removeMetadata", e.target.checked)} />
            Metadata/title/desc
          </label>
          <label>
            <input type="checkbox" checked={opts.removeXmlDecl} onChange={(e) => setOpt("removeXmlDecl", e.target.checked)} />
            XML/DOCTYPE
          </label>
          <label>
            <input type="checkbox" checked={opts.removeEditorAttrs} onChange={(e) => setOpt("removeEditorAttrs", e.target.checked)} />
            Editor attrs (Inkscape/Illustrator)
          </label>
          <label>
            <input type="checkbox" checked={opts.shortenHexColors} onChange={(e) => setOpt("shortenHexColors", e.target.checked)} />
            Shorten hex
          </label>
          <label>
            <input type="checkbox" checked={opts.collapseWhitespace} onChange={(e) => setOpt("collapseWhitespace", e.target.checked)} />
            Collapse whitespace
          </label>
          <label>
            <input type="checkbox" checked={opts.roundNumbers} onChange={(e) => setOpt("roundNumbers", e.target.checked)} />
            Round numbers to
            <input
              type="number"
              min={0}
              max={6}
              value={opts.decimals}
              onChange={(e) => setOpt("decimals", Math.max(0, Math.min(6, parseInt(e.target.value) || 0)))}
            />
            dp
          </label>
        </div>

        <div className="actions">
          <button className="btn-secondary" onClick={loadExample}>Load Example</button>
          <button
            className="btn-convert"
            onClick={run}
            disabled={working || !input.trim()}
            aria-busy={working}
          >
            {working
              ? <><div className="btn-spinner" aria-hidden="true" /> Optimizing…</>
              : <><ArrowRight size={16} aria-hidden="true" className="mr-1" /> Optimize</>
            }
          </button>
          <button className="btn-secondary" onClick={clearAll}>Clear All</button>
        </div>
      </section>

      <section className="seo-content" aria-labelledby="about-heading">
        <h2 id="about-heading">About the SVG Optimizer</h2>
        <p>
          This free online SVG optimizer shrinks SVG files for the web by stripping
          editor metadata, shortening colors, rounding numbers, and collapsing
          whitespace. SVGs exported from Inkscape, Figma, Illustrator, and Sketch
          regularly carry 30–60% of bytes that no browser ever uses — this tool
          removes them.
        </p>

        <h3>What Gets Removed</h3>
        <ul>
          <li>XML declaration and DOCTYPE (inline SVGs don't need them)</li>
          <li>Comments (<code>&lt;!-- --&gt;</code>) and <code>&lt;metadata&gt;</code>, <code>&lt;title&gt;</code>, <code>&lt;desc&gt;</code> blocks</li>
          <li>Inkscape, Sodipodi, Illustrator-specific namespaces and attributes</li>
          <li><code>xmlns:dc</code>, <code>xmlns:cc</code>, <code>xmlns:rdf</code> declarations</li>
          <li>Trailing zeros on long decimals (<code>32.000000</code> → <code>32</code>)</li>
          <li>6-digit hex colors reducible to 3-digit (<code>#ffffff</code> → <code>#fff</code>)</li>
          <li>Redundant whitespace between tags</li>
        </ul>

        <h3>What Stays Intact</h3>
        <p>
          The optimizer avoids transformations that can change rendering:
          <code> &lt;defs&gt;</code>, <code>&lt;style&gt;</code>,
          <code> &lt;linearGradient&gt;</code>, <code>&lt;mask&gt;</code>, and
          <code> &lt;filter&gt;</code> elements are preserved. Element IDs are
          kept because external CSS and JavaScript may reference them.
        </p>

        <h3>Common Use Cases</h3>
        <ul>
          <li>Shrink hero and marketing-page SVGs for faster page loads</li>
          <li>Prepare icons for inline SVG sprites in React/Vue/Svelte components</li>
          <li>Clean up logos exported from Figma or Illustrator</li>
          <li>Reduce bundle size in Next.js, SvelteKit, and Astro projects</li>
          <li>Minimize SVGs embedded as data URIs in CSS</li>
        </ul>

        <h3>Frequently Asked Questions</h3>

        <h3>How much smaller will my SVGs get?</h3>
        <p>
          Exports from vector editors typically shrink 30–70%. Hand-written SVGs are
          already lean and will see 5–15% savings. The exact number is shown in the
          Saved readout after each run.
        </p>

        <h3>Does rounding break small icons?</h3>
        <p>
          Two decimal places are enough for icons from 16×16 to 2048×2048. Drop to
          0 or 1 decimal for larger savings on simple shapes; raise to 3–4 for
          tightly curved paths where precision matters.
        </p>

        <h3>Is my SVG uploaded anywhere?</h3>
        <p>
          No. Parsing, rewriting, and preview all happen in your browser — safe for
          brand assets and unreleased designs.
        </p>

        <h3>Related Tools</h3>
        <p>
          Minify <Link href="/tools/minify-json">JSON</Link>, format{" "}
          <Link href="/tools/sql-formatter">SQL</Link>, or convert{" "}
          <Link href="/tools/markdown-to-html">Markdown to HTML</Link>.
        </p>
      </section>

      <section className="features" aria-label="Features">
        {[
          { icon: <Image size={24} />, title: "Live preview",     desc: "Side-by-side preview of input and optimized SVG so you can spot regressions." },
          { icon: <Zap size={24} />,   title: "Big savings",      desc: "30–70% smaller output on editor-exported SVGs, with configurable aggressiveness." },
          { icon: <Lock size={24} />,  title: "Fully private",    desc: "Parsing and rewriting are local — safe for brand assets and unreleased designs." },
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
