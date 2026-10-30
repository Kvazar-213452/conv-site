"use client";

import Link from "next/link";
import {
  ArrowRight,
  Braces,
  FileCode2,
  Table2,
  Code2,
  Database,
  Hash,
  KeyRound,
  Link2,
  Type,
  Layers,
  FileText,
  Clock,
  FileType2,
  FileJson,
  Minimize2,
  Palette,
  Search,
  ShieldCheck,
  Lock,
  GitCompare,
  Binary,
  CalendarClock,
  Terminal,
  Diff,
  FileCog,
  Network,
  Image as ImageIcon,
  Shield,
  Settings2,
  ArrowLeft
} from "lucide-react";

import "@/style/main.css";
import "@/style/home.css";

// ── Converter registry ────────────────────────────────────────
// Add or remove converters here — the UI updates automatically.
const CONVERTERS = [
  {
    icon: <FileCode2 size={22} />,
    label: "JSON → YAML",
    desc: "Convert JSON to clean YAML and back. Handles nested objects, arrays, and special strings.",
    longDesc: "Our JSON to YAML converter is perfect for developers working with configuration files and data serialization. Instantly transform complex JSON structures into human-readable YAML format. Supports bidirectional conversion with full preservation of data types and nested structures.",
    badge: "Bidirectional",
    href: "/tools/json-to-yaml",
  },
  {
    icon: <Table2 size={22} />,
    label: "JSON → CSV",
    desc: "Turn JSON arrays into CSV spreadsheets and parse CSV back to JSON with type inference.",
    longDesc: "Transform JSON arrays into CSV format instantly. Perfect for exporting data to Excel, Google Sheets, or any spreadsheet application. Our CSV to JSON converter includes intelligent type inference and handles complex nested data structures.",
    badge: "Bidirectional",
    href: "/tools/json-to-csv",
  },
  {
    icon: <Code2 size={22} />,
    label: "JSON → XML",
    desc: "Generate well-formed XML from JSON and parse XML tags back to JSON objects.",
    longDesc: "Convert JSON payloads to valid XML documents with proper formatting and structure. Our JSON to XML tool supports namespace handling and generates clean, standards-compliant XML. Great for SOAP APIs, configuration files, and data exchange.",
    badge: "Bidirectional",
    href: "/tools/json-to-xml",
  },
  {
    icon: <Database size={22} />,
    label: "JSON → PostgreSQL",
    desc: "Generate batch INSERT statements from JSON and parse INSERT SQL back to JSON.",
    longDesc: "Convert JSON arrays into PostgreSQL INSERT statements instantly. Perfect for database migrations, bulk imports, and data seeding. Our tool generates properly escaped SQL and handles all PostgreSQL data types correctly.",
    badge: "Bidirectional",
    href: "/tools/json-to-postgresql",
  },
  {
    icon: <Hash size={22} />,
    label: "Word Counter",
    desc: "Count words, characters, sentences, and paragraphs in any text. Great for essays and content writing.",
    longDesc: "Analyze your text with detailed statistics including word count, character count, sentence count, paragraph count, and reading time estimation. Ideal for writers, students, and content creators who need precise content metrics.",
    badge: "Options",
    href: "/tools/word-counter",
  },
  {
    icon: <KeyRound size={22} />,
    label: "UUID to Base64",
    desc: "Encode UUIDs to compact Base64 strings and decode Base64 back to standard UUID format.",
    longDesc: "Convert standard UUID format to compact Base64 encoding and vice versa. Perfect for URL shortening, API parameters, and data compression. Our UUID Base64 converter maintains perfect reversibility.",
    badge: "Bidirectional",
    href: "/tools/uuid-to-base64",
  },
  {
    icon: <Link2 size={22} />,
    label: "URL Encode / Decode",
    desc: "Percent-encode special characters in URLs and decode encoded strings back to plain text.",
    longDesc: "Encode URLs safely for use in query parameters, form submissions, and API requests. Our URL encoder handles all special characters correctly. Decode percent-encoded strings instantly without errors.",
    badge: "Options",
    href: "/tools/url-encode",
  },
  {
    icon: <Layers size={22} />,
    label: "String to Base64",
    desc: "Encode any string to Base64 and decode Base64 back to its original text instantly.",
    longDesc: "Fast and reliable Base64 encoding and decoding for any text string. Perfect for encoding API keys, authentication tokens, and sensitive data. Works with Unicode characters and special symbols.",
    badge: "Bidirectional",
    href: "/tools/string-to-base64",
  },
  {
    icon: <Layers size={22} />,
    label: "Remove Duplicate Lines",
    desc: "Paste any text and instantly strip duplicate lines, keeping only unique entries.",
    longDesc: "Clean up text files, CSV data, and lists by removing duplicate lines in seconds. Our deduplication tool preserves the order of first occurrence and handles all text formats. Essential for data cleaning and quality assurance.",
    badge: "Options",
    href: "/tools/remove-duplicate-lines",
  },
  {
    icon: <FileText size={22} />,
    label: "Markdown to HTML",
    desc: "Render Markdown to clean HTML and convert HTML tags back to Markdown syntax.",
    longDesc: "Convert Markdown syntax to valid HTML instantly. Perfect for blog posts, documentation, and static site generators. Our converter supports tables, code blocks, and all standard Markdown features.",
    badge: "Bidirectional",
    href: "/tools/markdown-to-html",
  },
  {
    icon: <Type size={22} />,
    label: "Case Converter",
    desc: "Transform text between camelCase, snake_case, PascalCase, kebab-case, and more.",
    longDesc: "Convert text between multiple naming conventions including camelCase, snake_case, PascalCase, kebab-case, UPPERCASE, and lowercase. Essential tool for programmers working with different coding languages and style guides.",
    badge: "Bidirectional",
    href: "/tools/case-converter",
  },
  {
    icon: <Clock size={22} />,
    label: "Date to Unix Timestamp",
    desc: "Convert human-readable dates to Unix timestamps and timestamps back to readable dates.",
    longDesc: "Transform between human-readable dates and Unix timestamps (epoch time) instantly. Handles timezone conversion, different date formats, and millisecond precision. Essential for developers working with APIs and databases.",
    badge: "Bidirectional",
    href: "/tools/date-to-unix-timestamp",
  },
  {
    icon: <Braces size={22} />,
    label: "JSON to Prisma Schema",
    desc: "Generate a full Prisma schema file from a JSON object with inferred field types and models.",
    longDesc: "Create complete Prisma schema files from sample JSON data with automatic type inference. Our generator understands relationships, optional fields, and complex data structures. Perfect for accelerating database setup in modern Node.js projects.",
    badge: "Bidirectional",
    href: "/tools/json-to-prisma-schema",
  },
  {
    icon: <FileType2 size={22} />,
    label: "JSON to TypeScript Interface",
    desc: "Instantly generate TypeScript interfaces from any JSON payload with nested type support.",
    longDesc: "Auto-generate TypeScript interfaces and types from JSON samples. Supports nested objects, arrays, unions, and optional properties. Save development time by eliminating manual interface creation and ensure type safety across your codebase.",
    badge: "Bidirectional",
    href: "/tools/json-to-typescript-interface",
  },
  {
    icon: <FileJson size={22} />,
    label: "JSON Formatter for Large Files",
    desc: "Format or minify JSON files up to 100 MB right in your browser with drag-and-drop upload.",
    longDesc: "Pretty-print or compress massive JSON payloads — API exports, NDJSON logs, GeoJSON, database dumps — without crashing your browser. Choose 2 spaces, 4 spaces, or tabs, drag files directly from your file manager, and get instant size statistics. Everything runs client-side: your data never reaches a server, making it safe for production payloads and confidential exports.",
    badge: "Up to 100 MB",
    href: "/tools/json-formatter",
  },
  {
    icon: <Minimize2 size={22} />,
    label: "Minify JSON Online",
    desc: "Compress JSON to a single line or beautify it back with one click and instant size savings.",
    longDesc: "Strip whitespace, line breaks, and indentation to shrink JSON payloads by up to 80% — or beautify minified blobs into clean, indented format for debugging. Perfect for production REST APIs, JSON-LD structured data, GraphQL responses, and analytics events where every byte matters. Bidirectional with roundtrip support, full type preservation, and detailed compression statistics.",
    badge: "Bidirectional",
    href: "/tools/minify-json",
  },
  {
    icon: <ShieldCheck size={22} />,
    label: "Hash Generator",
    desc: "Generate MD5, SHA-1, SHA-256, SHA-384, and SHA-512 hashes from any text in a single click.",
    longDesc: "Compute every common cryptographic hash — MD5, SHA-1, SHA-256, SHA-384, SHA-512 — from a single input. Perfect for verifying file integrity, generating checksums, debugging auth flows, and comparing hashes during security research. All processing runs locally via the Web Crypto API.",
    badge: "Multi-Algorithm",
    href: "/tools/hash-generator",
  },
  {
    icon: <KeyRound size={22} />,
    label: "JWT Decoder",
    desc: "Decode JSON Web Tokens and inspect header, payload, and signature with formatted timestamps.",
    longDesc: "Split any JWT into its three parts and parse the Base64URL-encoded JSON. Timestamp claims like iat, exp, and nbf are converted to human-readable ISO dates. Perfect for debugging OAuth, OpenID Connect, and custom auth flows. Runs entirely in your browser — never send production tokens to a third-party site.",
    badge: "Inspect",
    href: "/tools/jwt-decoder",
  },
  {
    icon: <Palette size={22} />,
    label: "Color Converter",
    desc: "Convert between HEX, RGB, and HSL with a live preview swatch for CSS and design work.",
    longDesc: "Instantly translate colors between the three most common web formats — HEX, RGB, HSL — with a live preview swatch. Accepts shorthand (#abc) and full HEX, rgb() and hsl() notations. Perfect for CSS authoring, design-system work, and brand palette inspection.",
    badge: "Bidirectional",
    href: "/tools/color-converter",
  },
  {
    icon: <Search size={22} />,
    label: "Regex Tester",
    desc: "Live-highlighting JavaScript regex playground with capture groups, named groups, and match counts.",
    longDesc: "Build and debug JavaScript regular expressions with live match highlighting as you type. Supports all standard flags (gimsuy) and shows positional and named capture groups for every match. Perfect for building validators, scrapers, parsers, and search features.",
    badge: "Live",
    href: "/tools/regex-tester",
  },
  {
    icon: <FileText size={22} />,
    label: "Lorem Ipsum Generator",
    desc: "Generate placeholder text by paragraphs, sentences, or words with the classic opener option.",
    longDesc: "Produce configurable amounts of Lorem Ipsum placeholder text — paragraphs, sentences, or words — perfect for mockups, wireframes, email templates, and layout testing. Toggle the classic 'Lorem ipsum dolor sit amet…' opener and copy straight into your design tool, CMS, or code.",
    badge: "Options",
    href: "/tools/lorem-ipsum",
  },
  {
    icon: <Lock size={22} />,
    label: "Password Generator",
    desc: "Create strong, cryptographically secure passwords with configurable length and character classes.",
    longDesc: "Generate strong, cryptographically secure passwords powered by crypto.getRandomValues — the same CSPRNG the browser uses for TLS keys. Choose length (4–256), toggle character classes (a-z, A-Z, 0-9, symbols), exclude ambiguous characters, and see entropy readouts. 100% client-side, nothing is logged or stored.",
    badge: "Secure",
    href: "/tools/password-generator",
  },
  {
    icon: <GitCompare size={22} />,
    label: "Text Diff",
    desc: "Compare two blocks of text line by line with added, removed, and unchanged highlighting.",
    longDesc: "Side-by-side line diff powered by the classic longest-common-subsequence algorithm. Perfect for comparing code revisions, configuration files, legal documents, and translations. Line numbers for both sides, color-coded output, and diff stats — all computed locally in your browser.",
    badge: "LCS Diff",
    href: "/tools/text-diff",
  },
  {
    icon: <Binary size={22} />,
    label: "Number Base Converter",
    desc: "Convert integers between binary, octal, decimal, and hexadecimal with BigInt precision.",
    longDesc: "Convert integers between the four most common numeric bases — binary, octal, decimal, hex — using BigInt for arbitrary precision. Accepts 0b/0o/0x prefixes and underscores as digit separators. Perfect for reading bitmasks, decoding binary protocols, inspecting hex IDs, and CS coursework.",
    badge: "BigInt",
    href: "/tools/number-base-converter",
  },
  {
    icon: <CalendarClock size={22} />,
    label: "Cron Expression Parser",
    desc: "Translate any cron expression to plain English and preview the next five executions in your timezone.",
    longDesc: "Decode Unix-style cron expressions used by crontab, Kubernetes CronJobs, GitHub Actions, Vercel Cron, GitLab CI, and AWS EventBridge. Supports 5-field and 6-field forms, ranges, lists, steps, month and day-of-week aliases, with next-run preview computed locally in your browser.",
    badge: "Explainer",
    href: "/tools/cron-parser",
  },
  {
    icon: <Terminal size={22} />,
    label: "cURL to Fetch",
    desc: "Convert any cURL command to idiomatic JavaScript — fetch, axios, or XMLHttpRequest.",
    longDesc: "Paste any cURL command (including Chrome DevTools' Copy as cURL output) and get idiomatic JavaScript. Handles headers, HTTP methods, JSON and form bodies, Basic auth, user agents, cookies, and multi-line commands. Smart JSON detection emits readable JSON.stringify output.",
    badge: "3 targets",
    href: "/tools/curl-to-fetch",
  },
  {
    icon: <Diff size={22} />,
    label: "JSON Diff",
    desc: "Semantic structural JSON diff ignoring whitespace and key order with dotted path output.",
    longDesc: "Compare two JSON documents structurally rather than line-by-line. Every change is reported as a dotted path (env.LOG_LEVEL, ports[2]) with before and after values. Perfect for comparing API responses, config files, and database records without noise from whitespace or key reordering.",
    badge: "Semantic",
    href: "/tools/json-diff",
  },
  {
    icon: <FileCog size={22} />,
    label: "TOML to JSON",
    desc: "Convert between TOML and JSON for Cargo.toml, pyproject.toml, Hugo, and Zola configs.",
    longDesc: "Bidirectional TOML ↔ JSON converter supporting tables, dotted keys, inline tables, arrays of tables, and numeric literals with underscores. Covers the common 95% of TOML 1.0 for Rust Cargo.toml, Python pyproject.toml, Hugo site configs, and Zola themes.",
    badge: "Bidirectional",
    href: "/tools/toml-to-json",
  },
  {
    icon: <Network size={22} />,
    label: "CIDR Calculator",
    desc: "IPv4 subnet calculator — mask, wildcard, network/broadcast addresses, host range, and classification.",
    longDesc: "Parse any IPv4 CIDR block for the netmask, wildcard, network and broadcast addresses, first and last usable host, total addresses, and RFC-1918 classification (private, public, loopback, multicast). Perfect for VPC design, firewall rule review, and network troubleshooting.",
    badge: "IPv4",
    href: "/tools/cidr-calculator",
  },
  {
    icon: <Database size={22} />,
    label: "SQL Formatter",
    desc: "Pretty-print SQL queries with configurable indentation and uppercase keywords for Postgres, MySQL, SQLite, MSSQL.",
    longDesc: "Format any SQL query — SELECT, INSERT, UPDATE, DELETE, DDL — with one clause per line, indented AND/OR, and preserved comments. Works for Postgres, MySQL, MariaDB, SQLite, and MSSQL. Perfect for reformatting ORM-generated queries, Slack-pasted snippets, and migration scripts before committing.",
    badge: "Pretty-print",
    href: "/tools/sql-formatter",
  },
  {
    icon: <Terminal size={22} />,
    label: "Unix Permissions",
    desc: "chmod calculator — numeric notation (755) ↔ symbolic (rwxr-xr-x) with setuid, setgid, and sticky bit.",
    longDesc: "Translate between chmod numeric notation and ls -l symbolic notation with a live permission matrix. Toggle setuid, setgid, and sticky bit; see plain-English descriptions. Essential for sysadmins, Dockerfile authors, and anyone configuring server permissions.",
    badge: "chmod",
    href: "/tools/unix-permissions",
  },
  {
    icon: <Table2 size={22} />,
    label: "CSV to Markdown",
    desc: "Convert CSV, TSV, or semicolon-separated data to GitHub-flavored Markdown tables with aligned columns.",
    longDesc: "Turn any CSV spreadsheet export into a GitHub-ready Markdown table with aligned columns, pipe escaping per GFM spec, and configurable text alignment. Handles quoted fields, embedded commas, newlines, and multiple delimiters. Perfect for README tables, pull request descriptions, and documentation.",
    badge: "GFM",
    href: "/tools/csv-to-markdown",
  },
  {
    icon: <Shield size={22} />,
    label: "HTML Entity Encoder",
    desc: "Encode HTML entities (named, numeric, hex) and decode entity-encoded strings for safe HTML rendering.",
    longDesc: "Essential XSS defense tool — encode HTML entities with named (&copy;), decimal (&#38;), hex (&#x26;), or minimal modes. Also decodes any entity-encoded string back to plain text. Perfect for template authors, security researchers, and anyone embedding user content in HTML.",
    badge: "Bidirectional",
    href: "/tools/html-entity-encoder",
  },
  {
    icon: <ImageIcon size={22} />,
    label: "SVG Optimizer",
    desc: "Minify SVG files — strip editor metadata, shorten hex colors, round decimals, collapse whitespace.",
    longDesc: "Shrink SVGs exported from Inkscape, Figma, Illustrator, and Sketch by 30–70% with side-by-side preview and byte savings readout. Removes XML declarations, metadata blocks, editor-specific namespaces, and unused precision. Perfect for shipping fast, bundle-friendly SVGs in React/Vue/Svelte components.",
    badge: "30–70% smaller",
    href: "/tools/svg-optimizer",
  },
  {
    icon: <Link2 size={22} />,
    label: "Slug Generator",
    desc: "Turn any text into a clean, URL-friendly slug with Cyrillic transliteration and stop-word removal.",
    longDesc: "Generate SEO-friendly URL slugs from blog titles, product names, or any phrase. Supports Cyrillic transliteration (Ukrainian, Russian), stop-word removal in multiple languages, custom separators, lowercase conversion, and max length limits. Perfect for CMS workflows, blog permalinks, and e-commerce product URLs.",
    badge: "Multi-locale",
    href: "/tools/slug-generator",
  },
  {
    icon: <Settings2 size={22} />,
    label: "ENV Parser",
    desc: "Parse .env files and convert between .env, JSON, and YAML for safe secret management.",
    longDesc: "Convert .env configuration files to JSON or YAML and back. Handles quoted values, multi-line entries, comments, and interpolation references. Perfect for migrating secrets between formats, auditing environment variables, and preparing config for Docker, Kubernetes, and CI/CD pipelines.",
    badge: "Multi-format",
    href: "/tools/env-parser",
  },
  {
    icon: <ArrowLeft size={22} />,
    label: "URL Decode",
    desc: "Decode percent-encoded URLs and query parameters back to plain text with full Unicode support.",
    longDesc: "Instantly decode percent-encoded URLs, query strings, and form data back to their original form. Handles all Unicode characters correctly — Cyrillic, Chinese, Arabic, emoji. Perfect for debugging API requests, parsing logs, and inspecting redirect chains.",
    badge: "Unicode",
    href: "/tools/url-decode",
  }
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

      {/* ── BLOG TEASER ────────────────────────────────────── */}
      <section aria-labelledby="blog-heading" className="home-why">
        <h2 id="blog-heading" className="home-section-title">From the blog</h2>
        <p className="home-section-sub">
          Deep-dive guides and cheatsheets that pair with the tools above —
          format comparisons, security explainers, and reference docs.
        </p>
        <div className="features">
          {[
            { href: "/blog/json-vs-yaml",         title: "JSON vs YAML",            desc: "When to use each, with examples and the Norway problem." },
            { href: "/blog/understanding-jwt",    title: "Understanding JWT",       desc: "Anatomy, signing algorithms, and the usual mistakes." },
            { href: "/blog/regex-cheatsheet",     title: "Regex Cheatsheet",        desc: "Classes, flags, groups, lookarounds, and recipes." },
            { href: "/blog/chmod-explained",      title: "chmod Explained",         desc: "Octal math, special bits, umask, and chown together." },
            { href: "/blog/html-entities-xss",    title: "HTML Entities & XSS",     desc: "Context-aware escaping done right — HTML, URLs, JS, CSS." },
            { href: "/blog/sql-formatting-guide", title: "SQL Formatting Guide",    desc: "Readable SQL conventions for code review and incidents." },
          ].map(({ href, title, desc }) => (
            <Link key={href} href={href} className="feature" style={{ textDecoration: "none", color: "inherit" }}>
              <h3>{title}</h3>
              <p>{desc}</p>
            </Link>
          ))}
        </div>
        <div className="home-cta-row" style={{ marginTop: "24px" }}>
          <Link href="/blog" className="btn-convert home-cta">
            Read all posts
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
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