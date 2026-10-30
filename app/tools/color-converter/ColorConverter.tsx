"use client";

import { useState, useCallback } from "react";
import { Palette, Lock, Zap, ArrowRight } from "lucide-react";
import {
  convertColor,
  formatRgb,
  formatHsl,
  type ColorFormat,
  type ColorFormats,
} from "./utils";
import {
  EXAMPLE_COLOR_HEX,
  EXAMPLE_COLOR_RGB,
  EXAMPLE_COLOR_HSL,
} from "@/lib/const";

import "@/style/main.css";
import "./main.css";

const EXAMPLES: Record<ColorFormat, string> = {
  hex: EXAMPLE_COLOR_HEX,
  rgb: EXAMPLE_COLOR_RGB,
  hsl: EXAMPLE_COLOR_HSL,
};

export default function ColorConverter() {
  const [format, setFormat] = useState<ColorFormat>("hex");
  const [input, setInput] = useState(EXAMPLES.hex);
  const [result, setResult] = useState<ColorFormats | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");
  const [converting, setConverting] = useState(false);

  const convert = useCallback(() => {
    setError("");
    setResult(null);
    if (!input.trim()) return;
    setConverting(true);
    setTimeout(() => {
      try {
        setResult(convertColor(input, format));
      } catch (e) {
        setError((e as Error).message);
      }
      setConverting(false);
    }, 220);
  }, [input, format]);

  const switchFormat = (next: ColorFormat) => {
    setFormat(next);
    setInput(EXAMPLES[next]);
    setResult(null);
    setError("");
  };

  const copyValue = (key: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopied(key);
    setTimeout(() => setCopied(""), 2000);
  };

  const loadExample = () => { setInput(EXAMPLES[format]); setResult(null); setError(""); };
  const clearAll   = () => { setInput(""); setResult(null); setError(""); };

  const outputs = result
    ? [
        { label: "HEX", value: result.hex },
        { label: "RGB", value: formatRgb(result.rgb) },
        { label: "HSL", value: formatHsl(result.hsl) },
      ]
    : [];

  return (
    <>
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-eyebrow">
          <div className="hero-dot" aria-hidden="true" />
          Free · No sign-up · Runs in browser
        </div>
        <h1 id="hero-heading">
          Color <em>Converter</em>
        </h1>
        <p>
          Convert any color between HEX, RGB, and HSL instantly with a live preview swatch.
          Runs 100% in your browser — nothing leaves your device.
        </p>

        <div className="mode-toggle" role="group" aria-label="Input color format">
          {(["hex", "rgb", "hsl"] as ColorFormat[]).map((f) => (
            <button
              key={f}
              className={`mode-btn${format === f ? " active" : ""}`}
              onClick={() => switchFormat(f)}
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>
      </section>

      {error && (
        <div className="error-bar" role="alert" aria-live="assertive">
          <span aria-hidden="true">✕</span>
          <span>Conversion Error: {error}</span>
        </div>
      )}

      <section aria-label="Color Converter">
        <div className="converter">

          <div className={`panel${error ? " has-error" : ""}`}>
            <div className="panel-header">
              <div className="panel-title">
                <div className="dot json" aria-hidden="true" />
                {format.toUpperCase()} Input
              </div>
              <div className="panel-actions">
                <button className="btn-ghost" onClick={loadExample}>Example</button>
                <button className="btn-ghost" onClick={() => { setInput(""); setError(""); }}>Clear</button>
              </div>
            </div>
            <textarea
              aria-label={`${format.toUpperCase()} input`}
              placeholder={EXAMPLES[format]}
              value={input}
              onChange={(e) => { setInput(e.target.value); setError(""); }}
              spellCheck={false} autoCorrect="off" autoCapitalize="off"
            />
          </div>

          <div className={`panel${result ? " has-output" : ""}`}>
            <div className="panel-header">
              <div className="panel-title">
                <div className="dot yaml" aria-hidden="true" />
                Converted
                {result && !converting && <span className="success-tag">✓ converted</span>}
              </div>
            </div>

            {converting && (
              <pre className="output-pre loading" aria-live="polite">// Converting…</pre>
            )}
            {!converting && !result && (
              <pre className="output-pre empty" aria-live="polite">
                {`// Converted values will appear here…`}
              </pre>
            )}
            {!converting && result && (
              <div className="cc-list" aria-live="polite">
                <div
                  className="cc-swatch"
                  aria-label={`Preview of ${result.hex}`}
                  style={{ background: result.hex }}
                />
                {outputs.map(({ label, value }) => (
                  <div className="cc-row" key={label}>
                    <div className="cc-row-head">
                      <span className="cc-label">{label}</span>
                      <button className="btn-ghost" onClick={() => copyValue(label, value)}>
                        {copied === label ? "✓ Copied!" : "Copy"}
                      </button>
                    </div>
                    <code className="cc-value">{value}</code>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

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
              : <><ArrowRight size={16} aria-hidden="true" className="mr-1" /> Convert Color</>
            }
          </button>
          <button className="btn-secondary" onClick={clearAll}>Clear All</button>
        </div>
      </section>

      <section className="seo-content" aria-labelledby="about-heading">
        <h2 id="about-heading">About Color Converter Tool</h2>
        <p>
          This free online color converter translates colors between the three most common web
          formats — HEX, RGB, and HSL — and renders a live preview swatch for instant visual
          confirmation. Accepts shorthand (<code>#abc</code>) and full HEX notation, standard
          <code>rgb()</code>, and standard <code>hsl()</code>. Perfect for CSS authoring, design
          systems, and quick palette inspection.
        </p>

        <h3>HEX vs RGB vs HSL</h3>
        <p>
          HEX is compact and widely used in HTML/CSS. RGB maps directly to display channels and is
          useful for programmatic manipulation. HSL (hue, saturation, lightness) is friendliest for
          generating variations — tweaking lightness or saturation gives predictable visual results.
        </p>

        <h3>Key Benefits</h3>
        <ul>
          <li><strong>Three-way conversion:</strong> HEX ↔ RGB ↔ HSL from a single input</li>
          <li><strong>Live preview:</strong> A swatch renders the parsed color so you can confirm visually</li>
          <li><strong>Shorthand friendly:</strong> Accepts both #RGB and #RRGGBB forms</li>
          <li><strong>Fully private:</strong> Everything runs locally — safe for internal brand palettes</li>
          <li><strong>Copy per format:</strong> Grab exactly the notation you need with one click</li>
        </ul>
      </section>

      <section className="features" aria-label="Features">
        {[
          {
            icon: <Zap size={24} />,
            title: "Instant conversion",
            desc: "All three formats computed from a single input in milliseconds.",
          },
          {
            icon: <Lock size={24} />,
            title: "Fully private",
            desc: "Everything runs locally — safe for internal brand palettes and client work.",
          },
          {
            icon: <Palette size={24} />,
            title: "Live preview",
            desc: "A swatch renders the parsed color so you can confirm the result visually.",
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
