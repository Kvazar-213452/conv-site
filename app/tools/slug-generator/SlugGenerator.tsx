"use client";

import { useState, useCallback } from "react";
import { generateSlug, DEFAULT_OPTIONS, EXAMPLE_INPUTS, type SlugOptions } from "./utils";
import { Zap, Lock, Settings2, ArrowRight } from "lucide-react";

import "@/style/main.css";
import "@/style/bar.css";

export default function SlugGenerator() {
  const [input, setInput] = useState(EXAMPLE_INPUTS[0]);
  const [output, setOutput] = useState("");
  const [opts, setOpts] = useState<SlugOptions>(DEFAULT_OPTIONS);
  const [copied, setCopied] = useState(false);
  const [converting, setConverting] = useState(false);
  const [error, setError] = useState("");

  const convert = useCallback(() => {
    setError("");
    setOutput("");
    if (!input.trim()) return;
    setConverting(true);
    setTimeout(() => {
      try {
        const slug = generateSlug(input, opts);
        if (!slug) throw new Error("Result is empty — try different options or input text.");
        setOutput(slug);
      } catch (e) {
        setError((e as Error).message);
      }
      setConverting(false);
    }, 220);
  }, [input, opts]);

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const loadExample = () => {
    const random = EXAMPLE_INPUTS[Math.floor(Math.random() * EXAMPLE_INPUTS.length)];
    setInput(random);
    setOutput("");
    setError("");
  };

  const clearAll = () => { setInput(""); setOutput(""); setError(""); };

  const setOpt = <K extends keyof SlugOptions>(key: K, val: SlugOptions[K]) => {
    setOpts((prev: any) => ({ ...prev, [key]: val }));
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
          Slug <em>Generator</em>
        </h1>
        <p>
          Turn any text into a clean, URL-friendly slug. Supports Cyrillic transliteration,
          stop-word removal, custom separators, and length limits.
          Runs 100% in your browser — nothing leaves your device.
        </p>
      </section>

      {/* Error */}
      {error && (
        <div className="error-bar" role="alert" aria-live="assertive">
          <span aria-hidden="true">✕</span>
          <span>Error: {error}</span>
        </div>
      )}

      {/* Converter */}
      <section aria-label="Slug Converter">
        <div className="converter">

          {/* Input panel */}
          <div className={`panel${error ? " has-error" : ""}`}>
            <div className="panel-header">
              <div className="panel-title">
                <div className="dot json" aria-hidden="true" />
                Text Input
              </div>
              <div className="panel-actions">
                <button className="btn-ghost" onClick={loadExample}>Example</button>
                <button className="btn-ghost" onClick={() => { setInput(""); setError(""); }}>Clear</button>
              </div>
            </div>
            <textarea
              aria-label="Text Input"
              placeholder="Enter any text, title, or phrase…"
              value={input}
              onChange={(e) => { setInput(e.target.value); setError(""); setOutput(""); }}
              spellCheck={false}
              autoCorrect="off"
              autoCapitalize="off"
            />
          </div>

          {/* Output panel */}
          <div className={`panel${output ? " has-output" : ""}`}>
            <div className="panel-header">
              <div className="panel-title">
                <div className="dot xml" aria-hidden="true" />
                Slug Output
                {output && !converting && <span className="success-tag">✓ generated</span>}
              </div>
              <div className="panel-actions">
                {output && !converting && (
                  <button className="btn-ghost" onClick={copyOutput}>
                    {copied ? "✓ Copied!" : "Copy"}
                  </button>
                )}
              </div>
            </div>
            <pre
              className={`output-pre${output && !converting ? "" : " empty"}${converting ? " loading" : ""}`}
              aria-label="Slug Output"
              aria-live="polite"
            >
              {converting
                ? "// Generating…"
                : output || "// Your slug will appear here…"}
            </pre>
          </div>
        </div>

        {/* Options */}
        <div className="options-bar" style={{ marginTop: "1rem", display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "center" }}>
          <label style={{ display: "flex", alignItems: "center", gap: ".4rem", fontSize: ".85rem" }}>
            <Settings2 size={14} />
            Separator:
            <select
              value={opts.separator}
              onChange={(e) => setOpt("separator", e.target.value as SlugOptions["separator"])}
              style={{ marginLeft: ".3rem" }}
            >
              <option value="-">hyphen ( - )</option>
              <option value="_">underscore ( _ )</option>
              <option value=".">dot ( . )</option>
            </select>
          </label>

          <label style={{ display: "flex", alignItems: "center", gap: ".4rem", fontSize: ".85rem" }}>
            <input
              type="checkbox"
              checked={opts.lowercase}
              onChange={(e) => setOpt("lowercase", e.target.checked)}
            />
            Lowercase
          </label>

          <label style={{ display: "flex", alignItems: "center", gap: ".4rem", fontSize: ".85rem" }}>
            <input
              type="checkbox"
              checked={opts.removeStopWords}
              onChange={(e) => setOpt("removeStopWords", e.target.checked)}
            />
            Remove stop words
          </label>

          <label style={{ display: "flex", alignItems: "center", gap: ".4rem", fontSize: ".85rem" }}>
            Locale:
            <select
              value={opts.locale}
              onChange={(e) => setOpt("locale", e.target.value as SlugOptions["locale"])}
              style={{ marginLeft: ".3rem" }}
            >
              <option value="en">English</option>
              <option value="uk">Ukrainian</option>
              <option value="de">German</option>
              <option value="fr">French</option>
              <option value="es">Spanish</option>
            </select>
          </label>

          <label style={{ display: "flex", alignItems: "center", gap: ".4rem", fontSize: ".85rem" }}>
            Max length:
            <input
              type="number"
              min={10}
              max={200}
              placeholder="none"
              value={opts.maxLength ?? ""}
              onChange={(e) => setOpt("maxLength", e.target.value ? parseInt(e.target.value) : null)}
              style={{ width: "4.5rem", marginLeft: ".3rem" }}
            />
          </label>
        </div>

        {/* Action Buttons */}
        <div className="actions">
          <button className="btn-secondary" onClick={loadExample}>Load Example</button>
          <button
            className="btn-convert"
            onClick={convert}
            disabled={converting || !input.trim()}
            aria-busy={converting}
          >
            {converting
              ? <><div className="btn-spinner" aria-hidden="true" /> Generating…</>
              : <><ArrowRight size={16} aria-hidden="true" className="mr-1" /> Generate Slug</>
            }
          </button>
          <button className="btn-secondary" onClick={clearAll}>Clear All</button>
        </div>
      </section>

      <section className="seo-content" aria-labelledby="about-heading">
        <h2 id="about-heading">About URL Slug Generator Tool</h2>
        <p>
          This free online slug generator tool converts any text into clean, SEO-friendly, URL-safe slugs instantly.
          Whether you're a developer building URLs, a content creator formatting blog post links, or a marketer optimizing
          page URLs, our tool generates lowercase, hyphenated slugs with Cyrillic transliteration support (Ukrainian, Russian),
          stop-word removal, custom separators (hyphen, underscore, dot), length limits, and multi-locale support for
          English, Ukrainian, German, French, and Spanish. Everything runs 100% in your browser with instant generation.
        </p>

        <h3>Why Generate URL-Friendly Slugs?</h3>
        <p>
          URL slugs are the readable, SEO-friendly parts of web addresses that come after the domain name (example.com/this-is-a-slug).
          Good slugs improve search engine rankings, make URLs memorable and shareable, indicate page content to users and
          search engines, and provide better user experience. However, creating slugs manually is tedious: you need to
          convert to lowercase, replace spaces with hyphens, remove special characters, handle accented letters and Cyrillic
          text, remove stop words (a, the, and, or, etc.) for shorter URLs, and ensure compatibility with all browsers and
          servers. Automated slug generation ensures consistency, saves time, prevents URL encoding issues (%20, %D0, etc.),
          and follows best practices for SEO and readability.
        </p>

        <h3>How to Use This Slug Generator</h3>
        <p>
          Type or paste your text (blog post title, product name, page title, or any phrase) into the input field. Configure
          your slug preferences: choose a separator (hyphen for standard URLs, underscore for some systems, dot for special
          cases), enable lowercase conversion (recommended for consistency), enable stop-word removal to create shorter,
          focused slugs, select your locale for proper transliteration (Ukrainian/Cyrillic to Latin, German umlauts, French
          accents, etc.), and optionally set a maximum length to keep URLs concise. Click "Generate Slug" to get your
          instant, URL-ready slug. Copy it to clipboard for immediate use in your CMS, website, or application.
        </p>

        <h3>Key Benefits</h3>
        <ul>
          <li><strong>No installation required:</strong> Works directly in your browser without any software downloads</li>
          <li><strong>Completely free:</strong> No registration, credit card, or hidden fees</li>
          <li><strong>Secure and private:</strong> All generation happens locally - your content never reaches our servers</li>
          <li><strong>Instant generation:</strong> Results appear immediately with zero latency</li>
          <li><strong>Cyrillic transliteration:</strong> Ukrainian and Russian text converts to Latin characters properly</li>
          <li><strong>SEO-optimized:</strong> Removes stop words, converts to lowercase, uses proper separators</li>
          <li><strong>Multi-locale support:</strong> Handles English, Ukrainian, German, French, Spanish text correctly</li>
          <li><strong>Highly configurable:</strong> Custom separators, length limits, stop-word removal, case options</li>
        </ul>

        <h3>Common Use Cases</h3>
        <p>
          Developers use slug generators for creating blog post URLs from titles programmatically, generating product page
          slugs for e-commerce sites, building CMS URL routing with clean slugs, creating API endpoint names from descriptions,
          generating file names for uploads and static assets, building permalink structures for WordPress, Drupal, or custom
          CMS. Content creators and bloggers convert article titles to URL-friendly slugs before publishing, optimize blog
          post URLs for SEO and readability, create memorable URLs for landing pages and campaigns, generate consistent URL
          structures across multiple posts, fix poorly formatted URLs from imported content. SEO specialists optimize page
          URLs with keyword-focused slugs, remove stop words to shorten URLs and improve focus, ensure URLs follow best
          practices (lowercase, hyphenated, concise), create canonical URLs for duplicate content, audit and fix existing
          URL structures. Marketers generate campaign URLs, landing page slugs, and tracking links with clean, branded URLs.
        </p>

        <h3>Supported Features</h3>
        <p>
          The slug generator handles comprehensive text transformations: Cyrillic transliteration converts Ukrainian (і→i,
          є→ye, ї→yi, Ґ→g) and Russian (ы→y, э→e, ю→yu, я→ya) to Latin characters using proper phonetic mappings. Accented
          character normalization converts ä→a, ö→o, ü→u (German), é→e, è→e, ê→e (French), ñ→n, á→a (Spanish), and other
          diacritics to ASCII equivalents. Stop word removal eliminates common words (a, an, the, and, or, but, in, on, at,
          to, for, of, with, from) in English and other configured locales for shorter, more focused slugs. Special character
          removal strips punctuation, symbols, emoji, and non-alphanumeric characters. Multiple separator options (hyphen
          for standard URLs, underscore for database-friendly slugs, dot for alternative formats). Lowercase conversion
          ensures consistency (recommended for all modern web servers). Maximum length limiting truncates slugs at word
          boundaries to maintain readability while meeting length constraints.
        </p>

        <h3>Technical Features</h3>
        <p>
          The generator processes text with intelligent algorithms: strips HTML tags and special characters, normalizes
          Unicode characters to ASCII equivalents, applies locale-specific transliteration rules, removes or replaces
          stop words based on selected language, converts to lowercase or preserves case as configured, replaces whitespace
          with chosen separator, removes consecutive separators (avoid example--slug), trims separators from start and end,
          optionally truncates to maximum length at word boundaries (never cuts mid-word), validates output for URL safety,
          and handles edge cases like all-numeric input, emoji-only text, or special Unicode characters. The tool generates
          slugs that work correctly in all modern browsers, web servers (Apache, Nginx), and frameworks (WordPress, Next.js,
          Django, Rails). Copy-to-clipboard functionality for instant use.
        </p>

        <h3>Privacy and Security</h3>
        <p>
          Unlike online slug generators that upload your text to remote servers, this tool processes everything locally
          in your browser using JavaScript. Your blog post titles, product names, page titles, internal documentation,
          draft content, or any text never leave your computer, making it completely safe for generating slugs from
          confidential content. No cookies, tracking, data storage, or server communication. Perfect for working with
          unpublished articles, internal project names, proprietary product titles, client websites, or any sensitive
          content that requires privacy. Your content and URL structure remain 100% private and secure on your device.
        </p>
      </section>

      {/* Features */}
      <section className="features" aria-label="Features">
        {[
          {
            icon: <Zap size={24} />,
            title: "Instant generation",
            desc: "Pure client-side processing. No latency, no server — results appear immediately.",
          },
          {
            icon: <Lock size={24} />,
            title: "Fully private",
            desc: "Your text never leaves the browser. Safe for sensitive titles, drafts, or internal docs.",
          },
          {
            icon: <Settings2 size={24} />,
            title: "Highly configurable",
            desc: "Cyrillic transliteration, stop-word removal, custom separators, length limits, and multi-locale support.",
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