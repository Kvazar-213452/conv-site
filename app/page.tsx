"use client";

import Link from "next/link";
import {
  ArrowRight,
  Braces,
  FileCode2,
  Table2,
  Code2,
  Database,
  FileJson,
} from "lucide-react";

import "@/app/css/main.css";
import "@/app/css/home.css";

// ── Converter registry ────────────────────────────────────────
// Add or remove converters here — the UI updates automatically.
const CONVERTERS = [
  {
    icon: <FileCode2 size={22} />,
    label: "JSON → YAML",
    desc: "Convert JSON to clean YAML and back. Handles nested objects, arrays, and special strings.",
    badge: "Bidirectional",
    href: "/json-to-yaml",
  },
  {
    icon: <Table2 size={22} />,
    label: "JSON → CSV",
    desc: "Turn JSON arrays into CSV spreadsheets and parse CSV back to JSON with type inference.",
    badge: "Bidirectional",
    href: "/json-to-csv",
  },
  {
    icon: <Code2 size={22} />,
    label: "JSON → XML",
    desc: "Generate well-formed XML from JSON and parse XML tags back to JSON objects.",
    badge: "Bidirectional",
    href: "/json-to-xml",
  },
  {
    icon: <Braces size={22} />,
    label: "JSON → Prisma",
    desc: "Scaffold Prisma schema models from a JSON payload with inferred types and relations.",
    badge: "Bidirectional",
    href: "/json-to-prisma",
  },
  {
    icon: <Database size={22} />,
    label: "JSON → PostgreSQL",
    desc: "Generate batch INSERT statements from JSON and parse INSERT SQL back to JSON.",
    badge: "Bidirectional",
    href: "/json-to-postgresql-insert",
  },
  // ── add more converters below ────────────────────────────────
  // {
  //   icon: <FileJson size={22} />,
  //   label: "JSON → ...",
  //   desc: "...",
  //   badge: "Bidirectional",
  //   href: "/json-to-...",
  // },
];

const STATS = [
  { value: `${CONVERTERS.length}`, label: "converters" },
  { value: "100%", label: "client-side" },
  { value: "0", label: "sign-ups" },
  { value: "∞", label: "free forever" },
];

export default function HomePage() {
  return (
    <>
      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="hero home-hero" aria-labelledby="home-heading">
        <div className="hero-eyebrow">
          <div className="hero-dot" aria-hidden="true" />
          Free · No sign-up · Runs in browser
        </div>

        <h1 id="home-heading" className="home-title">
          JSON<br />
          <em>Converter</em><br />
          Toolkit
        </h1>

        <p className="home-subtitle">
          A collection of fast, private, browser-only converters for developers.
          Paste JSON, get YAML, CSV, XML, Prisma schemas, SQL — instantly.
        </p>

        <div className="home-cta-row">
          <Link href={CONVERTERS[0].href} className="btn-convert home-cta">
            Start Converting
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
          <span className="home-cta-hint">No account needed</span>
        </div>

        {/* Stats strip */}
        <div className="home-stats" aria-label="Site stats">
          {STATS.map(({ value, label }) => (
            <div className="home-stat" key={label}>
              <span className="home-stat-value">{value}</span>
              <span className="home-stat-label">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── CONVERTER GRID ────────────────────────────────────── */}
      <section aria-labelledby="tools-heading">
        <div className="home-section-header">
          <h2 id="tools-heading" className="home-section-title">All converters</h2>
          <p className="home-section-sub">
            Every tool runs entirely in your browser. Nothing is sent to a server.
          </p>
        </div>

        <div className="converter-grid">
          {CONVERTERS.map(({ icon, label, desc, badge, href }, i) => (
            <Link
              key={href}
              href={href}
              className="converter-card"
              style={{ animationDelay: `${0.05 * i + 0.1}s` }}
              aria-label={`Open ${label} converter`}
            >
              <div className="converter-card-top">
                <div className="converter-card-icon" aria-hidden="true">
                  {icon}
                </div>
                {badge && (
                  <span className="converter-card-badge">{badge}</span>
                )}
              </div>
              <h3 className="converter-card-title">{label}</h3>
              <p className="converter-card-desc">{desc}</p>
              <div className="converter-card-arrow" aria-hidden="true">
                <ArrowRight size={15} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── WHY SECTION ───────────────────────────────────────── */}
      <section className="home-why" aria-labelledby="why-heading">
        <h2 id="why-heading" className="home-section-title">Why use this toolkit?</h2>
        <div className="features">
          {[
            {
              icon: "⚡",
              title: "Instant, no waiting",
              desc: "All conversions run in your browser via pure JavaScript — zero server round-trips, zero latency.",
            },
            {
              icon: "🔒",
              title: "Your data stays yours",
              desc: "Nothing is uploaded anywhere. Paste real API responses, database dumps, or secrets without worry.",
            },
            {
              icon: "⇄",
              title: "Bidirectional by default",
              desc: "Every converter works both ways. Convert JSON → YAML, then flip back with a single click.",
            },
          ].map(({ icon, title, desc }) => (
            <div className="feature" key={title}>
              <div className="feature-icon" aria-hidden="true">{icon}</div>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}