"use client";

import { useState, useCallback } from "react";
import { calculateRatio, scaleToWidth, scaleToHeight, COMMON_RATIOS } from "./utils";
import type { RatioResult } from "./utils";
import { Maximize2, Lock, Monitor } from "lucide-react";

import "@/style/main.css";

export default function AspectRatioCalculator() {
  const [width, setWidth] = useState("1920");
  const [height, setHeight] = useState("1080");
  const [result, setResult] = useState<RatioResult | null>(null);
  const [scaleW, setScaleW] = useState("");
  const [scaleH, setScaleH] = useState("");
  const [scaled, setScaled] = useState<{ width: number; height: number } | null>(null);
  const [error, setError] = useState("");

  const calculate = useCallback(() => {
    setError("");
    const w = parseInt(width); const h = parseInt(height);
    if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) { setError("Enter positive width and height"); return; }
    try {
      setResult(calculateRatio(w, h));
      setScaled(null); setScaleW(""); setScaleH("");
    } catch (e) {
      setError((e as Error).message);
    }
  }, [width, height]);

  const scaleByWidth = () => {
    if (!result || !scaleW) return;
    const nw = parseInt(scaleW);
    if (isNaN(nw) || nw <= 0) return;
    setScaled(scaleToWidth(result.width, result.height, nw));
    setScaleH("");
  };

  const scaleByHeight = () => {
    if (!result || !scaleH) return;
    const nh = parseInt(scaleH);
    if (isNaN(nh) || nh <= 0) return;
    setScaled(scaleToHeight(result.width, result.height, nh));
    setScaleW("");
  };

  const loadPreset = (w: number, h: number) => {
    setWidth(String(w)); setHeight(String(h)); setResult(null); setScaled(null);
  };

  return (
    <>
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-eyebrow">
          <div className="hero-dot" aria-hidden="true" />
          Free · No sign-up · Runs in browser
        </div>
        <h1 id="hero-heading">
          Aspect Ratio <em>Calculator</em>
        </h1>
        <p>
          Calculate aspect ratios from width and height. Scale dimensions proportionally.
          Common presets for screens, photos, and video.
        </p>
      </section>

      {error && (
        <div className="error-bar" role="alert" aria-live="assertive">
          <span aria-hidden="true">✕</span>
          <span>Error: {error}</span>
        </div>
      )}

      <section aria-label="Aspect Ratio Calculator">
        <div style={{ border: "1px solid var(--color-border)", borderRadius: 12, background: "var(--color-surface)", padding: 20 }}>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "flex-end" }}>
            <div style={{ flex: "1 1 150px" }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--color-text-muted)", marginBottom: 6 }}>Width</label>
              <input type="number" value={width} onChange={(e) => { setWidth(e.target.value); setResult(null); }} min="1"
                style={{ width: "100%", padding: "10px 14px", fontSize: 16, fontFamily: "'Geist Mono', monospace", background: "var(--color-accent-soft)", border: "1px solid var(--color-border-bright)", borderRadius: 8, color: "var(--color-text)", boxSizing: "border-box" }} />
            </div>
            <span style={{ fontSize: 24, color: "var(--color-text-muted)", paddingBottom: 8 }}>×</span>
            <div style={{ flex: "1 1 150px" }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--color-text-muted)", marginBottom: 6 }}>Height</label>
              <input type="number" value={height} onChange={(e) => { setHeight(e.target.value); setResult(null); }} min="1"
                style={{ width: "100%", padding: "10px 14px", fontSize: 16, fontFamily: "'Geist Mono', monospace", background: "var(--color-accent-soft)", border: "1px solid var(--color-border-bright)", borderRadius: 8, color: "var(--color-text)", boxSizing: "border-box" }} />
            </div>
          </div>

          <div style={{ marginTop: 16, display: "flex", flexWrap: "wrap", gap: 6 }}>
            {COMMON_RATIOS.map(({ label, width: w, height: h }) => (
              <button key={label} className="btn-ghost" onClick={() => loadPreset(w, h)}>{label}</button>
            ))}
          </div>
        </div>

        <div className="actions">
          <button className="btn-convert" onClick={calculate} disabled={!width || !height}>
            <Maximize2 size={16} aria-hidden="true" className="mr-1" /> Calculate
          </button>
        </div>

        {result && (
          <div style={{ marginTop: 24 }} aria-live="polite">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12, marginBottom: 24 }}>
              {[
                { label: "Aspect Ratio", value: result.ratio },
                { label: "Decimal", value: result.decimal },
                { label: "Dimensions", value: `${result.width} × ${result.height}` },
                { label: "GCD", value: result.gcd },
              ].map(({ label, value }) => (
                <div key={label} style={{ padding: "16px 12px", borderRadius: 10, border: "1px solid var(--color-border)", background: "var(--color-surface)", textAlign: "center" }}>
                  <div style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--color-text)", fontFamily: "'Geist Mono', monospace" }}>{value}</div>
                  <div style={{ fontSize: "0.7rem", fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--color-text-muted)" }}>{label}</div>
                </div>
              ))}
            </div>

            <div style={{ border: "1px solid var(--color-border)", borderRadius: 12, background: "var(--color-surface)", padding: 20 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--color-text)", marginBottom: 12 }}>Scale Proportionally</h3>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
                <div>
                  <label style={{ display: "block", fontSize: 11, color: "var(--color-text-muted)", marginBottom: 4 }}>New width:</label>
                  <div style={{ display: "flex", gap: 6 }}>
                    <input type="number" value={scaleW} onChange={(e) => setScaleW(e.target.value)} min="1" placeholder="e.g. 1280"
                      style={{ width: 120, padding: "8px 10px", fontSize: 13, fontFamily: "'Geist Mono', monospace", background: "var(--color-accent-soft)", border: "1px solid var(--color-border-bright)", borderRadius: 6, color: "var(--color-text)" }} />
                    <button className="btn-ghost" onClick={scaleByWidth}>Scale</button>
                  </div>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 11, color: "var(--color-text-muted)", marginBottom: 4 }}>New height:</label>
                  <div style={{ display: "flex", gap: 6 }}>
                    <input type="number" value={scaleH} onChange={(e) => setScaleH(e.target.value)} min="1" placeholder="e.g. 720"
                      style={{ width: 120, padding: "8px 10px", fontSize: 13, fontFamily: "'Geist Mono', monospace", background: "var(--color-accent-soft)", border: "1px solid var(--color-border-bright)", borderRadius: 6, color: "var(--color-text)" }} />
                    <button className="btn-ghost" onClick={scaleByHeight}>Scale</button>
                  </div>
                </div>
              </div>
              {scaled && (
                <div style={{ marginTop: 12, padding: "10px 16px", borderRadius: 8, background: "var(--color-accent-soft)", border: "1px solid var(--color-border-bright)" }}>
                  <code style={{ fontSize: 15, fontWeight: 600, fontFamily: "'Geist Mono', monospace", color: "var(--color-text)" }}>
                    {scaled.width} × {scaled.height}
                  </code>
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      <section className="seo-content" aria-labelledby="about-heading">
        <h2 id="about-heading">About Aspect Ratio Calculator Tool</h2>
        <p>
          This free online aspect ratio calculator computes the simplified ratio (like 16:9) from any width and height,
          shows the decimal equivalent, finds the greatest common divisor, and lets you scale dimensions proportionally
          by entering a new width or height. Includes presets for common screen, photo, and video aspect ratios. Perfect
          for designers, photographers, videographers, and developers working with responsive layouts.
        </p>

        <h3>Why Calculate Aspect Ratios?</h3>
        <p>
          Aspect ratios are fundamental to visual media: screens (16:9, 21:9), cameras (3:2, 4:3), social media platforms
          (1:1 Instagram, 9:16 Stories/Reels), and video standards (16:9 HD, 2.39:1 cinema). Knowing the ratio lets you
          resize images without distortion, plan responsive layouts, set CSS aspect-ratio properties, configure video
          exports, and create thumbnails at the right proportions.
        </p>

        <h3>Key Benefits</h3>
        <ul>
          <li><strong>Simplified ratio:</strong> Reduces any dimensions to the simplest integer ratio (e.g., 1920×1080 → 16:9)</li>
          <li><strong>Proportional scaling:</strong> Enter a new width or height and get the matching dimension</li>
          <li><strong>Common presets:</strong> One-click 16:9, 4:3, 1:1, 21:9, 9:16, 3:2, 2:3, and 5:4</li>
          <li><strong>Decimal output:</strong> The ratio as a decimal for CSS aspect-ratio and programmatic use</li>
          <li><strong>Instant calculation:</strong> No server round-trips</li>
          <li><strong>Completely free:</strong> No sign-ups or limits</li>
        </ul>

        <h3>Privacy and Security</h3>
        <p>
          Pure math in your browser. No data is sent to any server. No cookies, no tracking. Free forever.
        </p>
      </section>

      <section className="features" aria-label="Features">
        {[
          { icon: <Maximize2 size={24} />, title: "Ratio calculation", desc: "Get the simplified ratio, decimal, and GCD from any width and height." },
          { icon: <Lock size={24} />, title: "Fully private", desc: "Pure client-side math. Nothing is sent anywhere." },
          { icon: <Monitor size={24} />, title: "Common presets", desc: "16:9, 4:3, 1:1, 21:9, 9:16, 3:2, and more — one click to load." },
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
