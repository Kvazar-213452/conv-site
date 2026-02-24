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
  Hash,
  KeyRound,
  Link2,
  Type,
  Layers,
  FileText,
  RefreshCw,
  Clock,
  FileType2,
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
    longDesc: "Our JSON to YAML converter is perfect for developers working with configuration files and data serialization. Instantly transform complex JSON structures into human-readable YAML format. Supports bidirectional conversion with full preservation of data types and nested structures.",
    badge: "Bidirectional",
    href: "/json-to-yaml",
  },
  {
    icon: <Table2 size={22} />,
    label: "JSON → CSV",
    desc: "Turn JSON arrays into CSV spreadsheets and parse CSV back to JSON with type inference.",
    longDesc: "Transform JSON arrays into CSV format instantly. Perfect for exporting data to Excel, Google Sheets, or any spreadsheet application. Our CSV to JSON converter includes intelligent type inference and handles complex nested data structures.",
    badge: "Bidirectional",
    href: "/json-to-csv",
  },
  {
    icon: <Code2 size={22} />,
    label: "JSON → XML",
    desc: "Generate well-formed XML from JSON and parse XML tags back to JSON objects.",
    longDesc: "Convert JSON payloads to valid XML documents with proper formatting and structure. Our JSON to XML tool supports namespace handling and generates clean, standards-compliant XML. Great for SOAP APIs, configuration files, and data exchange.",
    badge: "Bidirectional",
    href: "/json-to-xml",
  },
  {
    icon: <Braces size={22} />,
    label: "JSON → Prisma",
    desc: "Scaffold Prisma schema models from a JSON payload with inferred types and relations.",
    longDesc: "Automatically generate Prisma ORM schema definitions from sample JSON data. Our converter intelligently infers field types, optional fields, and relationships. Save hours of manual schema writing for your Node.js and TypeScript projects.",
    badge: "Bidirectional",
    href: "/json-to-prisma",
  },
  {
    icon: <Database size={22} />,
    label: "JSON → PostgreSQL",
    desc: "Generate batch INSERT statements from JSON and parse INSERT SQL back to JSON.",
    longDesc: "Convert JSON arrays into PostgreSQL INSERT statements instantly. Perfect for database migrations, bulk imports, and data seeding. Our tool generates properly escaped SQL and handles all PostgreSQL data types correctly.",
    badge: "Bidirectional",
    href: "/json-to-postgresql-insert",
  },
  {
    icon: <Hash size={22} />,
    label: "Word Counter",
    desc: "Count words, characters, sentences, and paragraphs in any text. Great for essays and content writing.",
    longDesc: "Analyze your text with detailed statistics including word count, character count, sentence count, paragraph count, and reading time estimation. Ideal for writers, students, and content creators who need precise content metrics.",
    badge: "Options",
    href: "/word-counter",
  },
  {
    icon: <KeyRound size={22} />,
    label: "UUID to Base64",
    desc: "Encode UUIDs to compact Base64 strings and decode Base64 back to standard UUID format.",
    longDesc: "Convert standard UUID format to compact Base64 encoding and vice versa. Perfect for URL shortening, API parameters, and data compression. Our UUID Base64 converter maintains perfect reversibility.",
    badge: "Bidirectional",
    href: "/uuid-to-base64",
  },
  {
    icon: <Link2 size={22} />,
    label: "URL Encode / Decode",
    desc: "Percent-encode special characters in URLs and decode encoded strings back to plain text.",
    longDesc: "Encode URLs safely for use in query parameters, form submissions, and API requests. Our URL encoder handles all special characters correctly. Decode percent-encoded strings instantly without errors.",
    badge: "Options",
    href: "/url-encode-or-decode",
  },
  {
    icon: <Layers size={22} />,
    label: "String to Base64",
    desc: "Encode any string to Base64 and decode Base64 back to its original text instantly.",
    longDesc: "Fast and reliable Base64 encoding and decoding for any text string. Perfect for encoding API keys, authentication tokens, and sensitive data. Works with Unicode characters and special symbols.",
    badge: "Bidirectional",
    href: "/string-to-base64",
  },
  {
    icon: <Layers size={22} />,
    label: "Remove Duplicate Lines",
    desc: "Paste any text and instantly strip duplicate lines, keeping only unique entries.",
    longDesc: "Clean up text files, CSV data, and lists by removing duplicate lines in seconds. Our deduplication tool preserves the order of first occurrence and handles all text formats. Essential for data cleaning and quality assurance.",
    badge: "Options",
    href: "/remove-duplicate-lines",
  },
  {
    icon: <FileText size={22} />,
    label: "Markdown to HTML",
    desc: "Render Markdown to clean HTML and convert HTML tags back to Markdown syntax.",
    longDesc: "Convert Markdown syntax to valid HTML instantly. Perfect for blog posts, documentation, and static site generators. Our converter supports tables, code blocks, and all standard Markdown features.",
    badge: "Bidirectional",
    href: "/markdown-to-html",
  },
  {
    icon: <Type size={22} />,
    label: "Case Converter",
    desc: "Transform text between camelCase, snake_case, PascalCase, kebab-case, and more.",
    longDesc: "Convert text between multiple naming conventions including camelCase, snake_case, PascalCase, kebab-case, UPPERCASE, and lowercase. Essential tool for programmers working with different coding languages and style guides.",
    badge: "Bidirectional",
    href: "/case-converter",
  },
  {
    icon: <Clock size={22} />,
    label: "Date to Unix Timestamp",
    desc: "Convert human-readable dates to Unix timestamps and timestamps back to readable dates.",
    longDesc: "Transform between human-readable dates and Unix timestamps (epoch time) instantly. Handles timezone conversion, different date formats, and millisecond precision. Essential for developers working with APIs and databases.",
    badge: "Bidirectional",
    href: "/date-to-unix-timestamp",
  },
  {
    icon: <Braces size={22} />,
    label: "JSON to Prisma Schema",
    desc: "Generate a full Prisma schema file from a JSON object with inferred field types and models.",
    longDesc: "Create complete Prisma schema files from sample JSON data with automatic type inference. Our generator understands relationships, optional fields, and complex data structures. Perfect for accelerating database setup in modern Node.js projects.",
    badge: "Bidirectional",
    href: "/json-to-prisma-schema",
  },
  {
    icon: <FileType2 size={22} />,
    label: "JSON to TypeScript Interface",
    desc: "Instantly generate TypeScript interfaces from any JSON payload with nested type support.",
    longDesc: "Auto-generate TypeScript interfaces and types from JSON samples. Supports nested objects, arrays, unions, and optional properties. Save development time by eliminating manual interface creation and ensure type safety across your codebase.",
    badge: "Bidirectional",
    href: "/json-to-typescript-interface",
  },
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
          Transform, encode, decode, and convert data formats without uploading to any server.
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
            Click any converter to start transforming your data immediately.
          </p>
        </div>

        <div className="converter-grid">
          {CONVERTERS.map(({ icon, label, desc, longDesc, badge, href }, i) => (
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

        {/* SEO Content Section */}
        <div className="home-converters-seo">
          <h3 className="home-converters-seo-title">Comprehensive Data Format Conversion Tools</h3>
          <p>
            Our JSON Converter Toolkit includes 15+ essential tools for developers, data engineers, and content creators. 
            From JSON format conversions (YAML, CSV, XML) to code generation (Prisma schemas, TypeScript interfaces), 
            we've covered every common data transformation need.
          </p>
          <p>
            Each converter is designed for speed and reliability. Convert between formats bidirectionally, encode/decode strings, 
            count words, generate database schemas, and manipulate text — all without leaving your browser. 
            Perfect for API development, database migrations, documentation, and daily developer workflows.
          </p>
          <p>
            Whether you're a full-stack developer, data scientist, or technical writer, our free converter toolkit 
            eliminates the need for multiple specialized tools. Work with JSON, YAML, CSV, XML, SQL, Markdown, 
            Base64, UUID, URLs, timestamps, and more in a single unified platform.
          </p>
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
              longDesc: "Experience blazing-fast conversions with zero latency. Since everything runs locally in your browser, you get instant results for JSON parsing, YAML formatting, CSV transformation, and all other conversions.",
            },
            {
              icon: "🔒",
              title: "Your data stays yours",
              desc: "Nothing is uploaded anywhere. Paste real API responses, database dumps, or secrets without worry.",
              longDesc: "Maximum privacy and security. Your sensitive data, API keys, database credentials, and personal information never leave your device. All processing happens locally in your browser, giving you complete control.",
            },
            {
              icon: "⇄",
              title: "Bidirectional by default",
              desc: "Every converter works both ways. Convert JSON → YAML, then flip back with a single click.",
              longDesc: "Most of our converters support bidirectional transformation. Convert JSON to CSV and back, transform YAML to JSON and vice versa, or switch between any supported formats seamlessly.",
            },
          ].map(({ icon, title, desc, longDesc }) => (
            <div className="feature" key={title}>
              <div className="feature-icon" aria-hidden="true">{icon}</div>
              <h3>{title}</h3>
              <p>{desc}</p>
              <p style={{ fontSize: "0.9rem", color: "#666", marginTop: "0.5rem", display: "none" }}>{longDesc}</p>
            </div>
          ))}
        </div>

        {/* Additional Features Section */}
        <div className="home-features-grid">
          <h3 className="home-features-title">
            Developer-First Features
          </h3>
          <div className="home-features-container">
            {[
              {
                title: "Multiple Data Formats",
                desc: "Support for JSON, YAML, CSV, XML, SQL, Markdown, Base64, UUID, and more."
              },
              {
                title: "Smart Type Inference",
                desc: "Automatic type detection for database schemas, TypeScript interfaces, and data mapping."
              },
              {
                title: "No Dependencies",
                desc: "100% client-side JavaScript with no external API calls or server dependencies."
              },
              {
                title: "Batch Processing",
                desc: "Handle large files and bulk conversions efficiently in your browser."
              },
              {
                title: "Copy & Paste Ready",
                desc: "All outputs are formatted and ready to paste directly into your projects."
              },
              {
                title: "Always Free",
                desc: "No premium features, no ads, no paywalls. Everything is completely free forever."
              },
            ].map(({ title, desc }) => (
              <div key={title} className="home-feature-item">
                <h4 className="home-feature-item-title">{title}</h4>
                <p className="home-feature-item-desc">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="home-faq">
          <h3 className="home-faq-title">
            Frequently Asked Questions
          </h3>
          
          <div className="home-faq-item">
            <h4 className="home-faq-question">Is JSON Converter Toolkit really free?</h4>
            <p className="home-faq-answer">
              Yes, 100% free. No sign-ups, no premium tiers, no ads. Our toolkit is completely free forever.
            </p>
          </div>

          <div className="home-faq-item">
            <h4 className="home-faq-question">Are my conversions private?</h4>
            <p className="home-faq-answer">
              Absolutely. All conversions run in your browser with zero server uploads. Your data stays on your device.
            </p>
          </div>

          <div className="home-faq-item">
            <h4 className="home-faq-question">Can I use this offline?</h4>
            <p className="home-faq-answer">
              Yes, once loaded, the toolkit works offline. No internet connection required for conversions.
            </p>
          </div>

          <div className="home-faq-item">
            <h4 className="home-faq-question">What formats are supported?</h4>
            <p className="home-faq-answer">
              We support JSON, YAML, CSV, XML, Prisma schemas, TypeScript interfaces, PostgreSQL, Base64, URLs, 
              Unix timestamps, Markdown, case conversion, and more.
            </p>
          </div>

          <div className="home-faq-item">
            <h4 className="home-faq-question">Can I convert large files?</h4>
            <p className="home-faq-answer">
              Yes, the toolkit handles large files efficiently. Your browser's capabilities set the limit.
            </p>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ──────────────────────────────────────── */}
      <section className="home-final-cta">
        <h2 className="home-final-cta-title">
          Start Converting Today
        </h2>
        <p className="home-final-cta-subtitle">
          Transform your data formats instantly with our free, privacy-first converter toolkit. 
          No sign-ups, no limits, no server uploads.
        </p>
        <Link href={CONVERTERS[0].href} className="btn-convert home-cta">
          Start Converting Now
          <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </section>
    </>
  );
}