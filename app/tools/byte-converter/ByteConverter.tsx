"use client";

import { useState, useCallback } from "react";
import { convertBytes, UNIT_LABELS, type ByteUnit, type ByteStandard, type ConversionResult } from "./utils";
import { HardDrive, Lock, Settings2 } from "lucide-react";

import "@/style/main.css";
import "@/style/bar.css";

export default function ByteConverter() {
  const [value, setValue] = useState("1024");
  const [fromUnit, setFromUnit] = useState<ByteUnit>("mb");
  const [standard, setStandard] = useState<ByteStandard>("binary");
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [error, setError] = useState("");

  const convert = useCallback(() => {
    setError("");
    const num = parseFloat(value);
    if (isNaN(num) || num < 0) { setError("Enter a valid positive number"); setResult(null); return; }
    try {
      setResult(convertBytes(num, fromUnit, standard));
    } catch (e) {
      setError((e as Error).message);
    }
  }, [value, fromUnit, standard]);

  const clearAll = () => { setValue(""); setResult(null); setError(""); };

  const units: ByteUnit[] = ["b", "kb", "mb", "gb", "tb", "pb"];

  const resultRows = result ? [
    { label: "Bits", value: result.bits },
    { label: "Bytes (B)", value: result.bytes },
    { label: standard === "binary" ? "Kibibytes (KiB)" : "Kilobytes (KB)", value: result.kilobytes },
    { label: standard === "binary" ? "Mebibytes (MiB)" : "Megabytes (MB)", value: result.megabytes },
    { label: standard === "binary" ? "Gibibytes (GiB)" : "Gigabytes (GB)", value: result.gigabytes },
    { label: standard === "binary" ? "Tebibytes (TiB)" : "Terabytes (TB)", value: result.terabytes },
    { label: standard === "binary" ? "Pebibytes (PiB)" : "Petabytes (PB)", value: result.petabytes },
  ] : [];

  return (
    <>
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-eyebrow">
          <div className="hero-dot" aria-hidden="true" />
          Free · No sign-up · Runs in browser
        </div>
        <h1 id="hero-heading">
          Byte <em>Converter</em>
        </h1>
        <p>
          Convert between bytes, KB, MB, GB, TB, and PB. Supports both binary
          (1024-based) and decimal (1000-based) standards.
        </p>
      </section>

      {error && (
        <div className="error-bar" role="alert" aria-live="assertive">
          <span aria-hidden="true">✕</span>
          <span>Error: {error}</span>
        </div>
      )}

      <section aria-label="Byte Converter">
        <div style={{ border: "1px solid var(--color-border)", borderRadius: 12, background: "var(--color-surface)", padding: 20, display: "flex", flexWrap: "wrap", gap: 16, alignItems: "flex-end" }}>
          <div style={{ flex: "1 1 200px" }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--color-text-muted)", marginBottom: 6 }}>Value</label>
            <input
              type="number"
              value={value}
              onChange={(e) => { setValue(e.target.value); setResult(null); }}
              placeholder="1024"
              min="0"
              step="any"
              style={{ width: "100%", padding: "10px 14px", fontSize: 16, fontFamily: "'Geist Mono', monospace", background: "var(--color-accent-soft)", border: "1px solid var(--color-border-bright)", borderRadius: 8, color: "var(--color-text)", boxSizing: "border-box" }}
            />
          </div>
          <div style={{ flex: "0 0 auto" }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--color-text-muted)", marginBottom: 6 }}>Unit</label>
            <select
              value={fromUnit}
              onChange={(e) => { setFromUnit(e.target.value as ByteUnit); setResult(null); }}
              style={{ padding: "10px 14px", fontSize: 14, fontFamily: "'Geist Mono', monospace", background: "var(--color-accent-soft)", border: "1px solid var(--color-border-bright)", borderRadius: 8, color: "var(--color-text)" }}
            >
              {units.map((u) => (
                <option key={u} value={u}>{UNIT_LABELS[u][standard]}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="options-bar">
          <label><Settings2 size={14} aria-hidden="true" /> Standard:</label>
          <label>
            <input type="radio" name="standard" checked={standard === "binary"} onChange={() => { setStandard("binary"); setResult(null); }} />
            Binary (1024)
          </label>
          <label>
            <input type="radio" name="standard" checked={standard === "decimal"} onChange={() => { setStandard("decimal"); setResult(null); }} />
            Decimal (1000)
          </label>
        </div>

        <div className="actions">
          <button className="btn-convert" onClick={convert} disabled={!value}>
            <HardDrive size={16} aria-hidden="true" className="mr-1" /> Convert
          </button>
          <button className="btn-secondary" onClick={clearAll}>Clear</button>
        </div>

        {result && (
          <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 8 }} aria-live="polite">
            {resultRows.map(({ label, value: val }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", borderRadius: 10, border: "1px solid var(--color-border)", background: "var(--color-surface)" }}>
                <span style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--color-text-muted)", minWidth: 140 }}>{label}</span>
                <code style={{ flex: 1, fontSize: 14, fontFamily: "'Geist Mono', monospace", color: "var(--color-text)", fontVariantNumeric: "tabular-nums" }}>{val}</code>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="seo-content" aria-labelledby="about-heading">
        <h2 id="about-heading">About Byte Converter Tool</h2>
        <p>
          This free online byte converter instantly converts between bytes, kilobytes, megabytes, gigabytes, terabytes,
          and petabytes. It supports both the binary standard (1 KiB = 1024 bytes, used by operating systems and
          memory) and the decimal standard (1 KB = 1000 bytes, used by storage manufacturers and network speeds).
          Understanding this distinction is critical when sizing cloud storage, planning bandwidth, or comparing
          hardware specifications.
        </p>

        <h3>Binary vs Decimal</h3>
        <p>
          The binary standard (IEC) uses powers of 1024: 1 KiB = 1024 B, 1 MiB = 1,048,576 B. This is what your
          operating system reports for RAM and file sizes. The decimal standard (SI) uses powers of 1000: 1 KB = 1000 B,
          1 MB = 1,000,000 B. This is what hard drive and SSD manufacturers use. The difference grows with scale — a
          "1 TB" drive is 931 GiB in binary terms. This tool converts in both standards to eliminate confusion.
        </p>

        <h3>Key Benefits</h3>
        <ul>
          <li><strong>Dual standards:</strong> Binary (1024) and decimal (1000) conversion in one tool</li>
          <li><strong>Full range:</strong> Bytes to petabytes with bits included</li>
          <li><strong>Precise output:</strong> Up to 6 significant digits for accurate calculations</li>
          <li><strong>Instant results:</strong> No server round-trips — everything runs locally</li>
          <li><strong>Completely private:</strong> Your data never leaves your device</li>
          <li><strong>No installation:</strong> Works in any modern browser</li>
        </ul>

        <h3>Common Use Cases</h3>
        <p>
          DevOps engineers convert between units for disk provisioning (EBS volumes, persistent disks), memory limits
          (Kubernetes resource requests, Docker memory), and bandwidth calculations. Developers estimate API payload
          sizes and database storage requirements. System administrators compare reported vs actual storage capacities.
          Network engineers convert bandwidth units for capacity planning.
        </p>

        <h3>Privacy and Security</h3>
        <p>
          All conversion happens locally in your browser using simple arithmetic. No data is sent to any server. No
          cookies, no tracking, no sign-ups required. Free forever.
        </p>
      </section>

      <section className="features" aria-label="Features">
        {[
          { icon: <HardDrive size={24} />, title: "Dual standards", desc: "Binary (1024, KiB/MiB/GiB) and decimal (1000, KB/MB/GB) conversion side by side." },
          { icon: <Lock size={24} />, title: "Fully private", desc: "Pure math in your browser. No server, no tracking, no data leaves your device." },
          { icon: <Settings2 size={24} />, title: "Full range", desc: "Bits through petabytes with precise decimal output for accurate sizing calculations." },
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
