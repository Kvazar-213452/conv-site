"use client";

import { useState, useCallback } from "react";
import { dedupeLines, DEFAULT_OPTIONS, EXAMPLE_INPUTS, type DedupeOptions } from "./utils";
import { Layers, Lock, Settings2, ArrowRight } from "lucide-react";

import "@/style/main.css";
import "@/style/bar.css";
import "@/style/bar_footer.css";

export default function RemoveDuplicateLines() {
  const [input, setInput] = useState(EXAMPLE_INPUTS[0]);
  const [output, setOutput] = useState("");
  const [opts, setOpts] = useState<DedupeOptions>(DEFAULT_OPTIONS);
  const [copied, setCopied] = useState(false);
  const [converting, setConverting] = useState(false);
  const [error, setError] = useState("");
  const [stats, setStats] = useState<{ original: number; unique: number; removed: number } | null>(null);

  const convert = useCallback(() => {
    setError("");
    setOutput("");
    setStats(null);
    if (!input.trim()) return;
    setConverting(true);
    setTimeout(() => {
      try {
        const res = dedupeLines(input, opts);
        if (!res.output && res.uniqueCount === 0) {
          throw new Error("Result is empty — all lines were removed.");
        }
        setOutput(res.output);
        setStats({ original: res.originalCount, unique: res.uniqueCount, removed: res.removedCount });
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

  const downloadOutput = () => {
    const blob = new Blob([output], { type: "text/plain;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "deduplicated.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const swapWithOutput = () => {
    if (!output) return;
    setInput(output);
    setOutput("");
    setStats(null);
    setError("");
  };

  const loadExample = () => {
    const random = EXAMPLE_INPUTS[Math.floor(Math.random() * EXAMPLE_INPUTS.length)];
    setInput(random);
    setOutput("");
    setStats(null);
    setError("");
  };

  const clearAll = () => { setInput(""); setOutput(""); setStats(null); setError(""); };

  const setOpt = <K extends keyof DedupeOptions>(key: K, val: DedupeOptions[K]) => {
    setOpts((prev) => ({ ...prev, [key]: val }));
    setOutput("");
    setStats(null);
  };

  return (
    <>
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-eyebrow">
          <div className="hero-dot" aria-hidden="true" />
          Free · No sign-up · Runs in browser
        </div>
        <h1 id="hero-heading">
          Remove <em>Duplicate</em>
          <br />Lines
        </h1>
        <p>
          Paste any text and instantly remove duplicate lines. Supports case-insensitive
          matching, trimming, empty line removal, and sorting.
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
      <section aria-label="Duplicate Line Remover">
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
              placeholder={"line one\nline two\nline one\nduplicate\nduplicate"}
              value={input}
              onChange={(e) => { setInput(e.target.value); setError(""); setOutput(""); setStats(null); }}
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
                Unique Lines
                {output && !converting && stats && (
                  <span className="success-tag">
                    ✓ -{stats.removed} duplicate{stats.removed !== 1 ? "s" : ""}
                  </span>
                )}
              </div>
              <div className="panel-actions">
                {output && !converting && (
                  <>
                    <button className="btn-ghost" onClick={copyOutput}>
                      {copied ? "✓ Copied!" : "Copy"}
                    </button>
                    <button className="btn-ghost" onClick={downloadOutput}>
                      ↓ Download
                    </button>
                    <button
                      className="btn-ghost"
                      onClick={swapWithOutput}
                      title="Use output as new input"
                    >
                      ⇄ Swap
                    </button>
                  </>
                )}
              </div>
            </div>
            <pre
              className={`output-pre${output && !converting ? "" : " empty"}${converting ? " loading" : ""}`}
              aria-label="Unique Lines Output"
              aria-live="polite"
            >
              {converting
                ? "// Processing…"
                : output || "// Your deduplicated text will appear here…"}
            </pre>
          </div>
        </div>

        {/* Stats bar */}
        {stats && !converting && (
          <div className="stats-bar" aria-live="polite">
            <div className="stat">
              <span className="stat-value">{stats.original}</span>
              <span className="stat-label">original</span>
            </div>
            <div className="stat-divider" aria-hidden="true">→</div>
            <div className="stat">
              <span className="stat-value stat-value--unique">{stats.unique}</span>
              <span className="stat-label">unique</span>
            </div>
            <div className="stat-divider" aria-hidden="true">·</div>
            <div className="stat">
              <span className="stat-value stat-value--removed">{stats.removed}</span>
              <span className="stat-label">removed</span>
            </div>
          </div>
        )}

        {/* Options */}
        <div className="options-bar">
          <label>
            <Settings2 size={14} aria-hidden="true" />
            Keep:
            <select
              value={opts.keepOrder}
              onChange={(e) => setOpt("keepOrder", e.target.value as DedupeOptions["keepOrder"])}
            >
              <option value="first">First occurrence</option>
              <option value="last">Last occurrence</option>
            </select>
          </label>

          <label>
            <input
              type="checkbox"
              checked={opts.caseSensitive}
              onChange={(e) => setOpt("caseSensitive", e.target.checked)}
            />
            Case sensitive
          </label>

          <label>
            <input
              type="checkbox"
              checked={opts.trimLines}
              onChange={(e) => setOpt("trimLines", e.target.checked)}
            />
            Trim whitespace
          </label>

          <label>
            <input
              type="checkbox"
              checked={opts.removeEmpty}
              onChange={(e) => setOpt("removeEmpty", e.target.checked)}
            />
            Remove empty lines
          </label>

          <label>
            <input
              type="checkbox"
              checked={opts.sortResult}
              onChange={(e) => setOpt("sortResult", e.target.checked)}
            />
            Sort result
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
              ? <><div className="btn-spinner" aria-hidden="true" /> Processing…</>
              : <><ArrowRight size={16} aria-hidden="true" className="mr-1" /> Remove Duplicates</>
            }
          </button>
          <button className="btn-secondary" onClick={clearAll}>Clear All</button>
        </div>
      </section>

      <section className="seo-content" aria-labelledby="about-heading">
        <h2 id="about-heading">About Duplicate Line Remover Tool</h2>
        <p>
          This free online duplicate line remover tool allows you to instantly remove duplicate lines from any text
          with powerful filtering options. Whether you're a developer cleaning log files, a data analyst deduplicating
          datasets, or anyone working with lists and text files, our tool removes exact and case-insensitive duplicates,
          trims whitespace, removes empty lines, and optionally sorts results. Choose to keep the first or last occurrence
          of each unique line. Everything runs 100% in your browser with instant processing and detailed statistics.
        </p>

        <h3>Why Remove Duplicate Lines?</h3>
        <p>
          Duplicate lines appear frequently in many workflows: log files contain repeated error messages, data exports
          have redundant entries, email lists include duplicate addresses, configuration files accumulate repeated settings,
          and text processing creates unwanted repetition. Manually finding and removing duplicates in large files is
          time-consuming, error-prone, and impractical for hundreds or thousands of lines. Automated deduplication saves
          hours of manual work, ensures accuracy, reduces file sizes, improves data quality for analysis, and helps identify
          unique values in datasets. This tool handles everything from simple exact match deduplication to advanced
          case-insensitive matching with whitespace normalization.
        </p>

        <h3>How to Use This Tool</h3>
        <p>
          Paste or type your text into the input field (each item on a separate line), configure your deduplication
          preferences: choose whether to keep the first or last occurrence of each duplicate, enable case-insensitive
          matching to treat "Apple" and "apple" as duplicates, enable trim whitespace to ignore leading/trailing spaces,
          remove empty lines to clean up your output, or sort results alphabetically for better organization. Click
          "Remove Duplicates" and get instant results with statistics showing original line count, unique lines retained,
          and duplicates removed. Copy to clipboard, download as a text file, or use the swap button to process the
          output again.
        </p>

        <h3>Key Benefits</h3>
        <ul>
          <li><strong>No installation required:</strong> Works directly in your browser without any software downloads</li>
          <li><strong>Completely free:</strong> No registration, credit card, or hidden fees</li>
          <li><strong>Secure and private:</strong> All processing happens locally - your data never reaches our servers</li>
          <li><strong>Fast processing:</strong> Instant deduplication even for thousands of lines</li>
          <li><strong>Smart matching:</strong> Case-sensitive or case-insensitive duplicate detection</li>
          <li><strong>Flexible options:</strong> Trim whitespace, remove empty lines, sort results, choose first/last occurrence</li>
          <li><strong>Detailed statistics:</strong> See exactly how many lines were original, unique, and removed</li>
          <li><strong>Batch processing:</strong> Handle large text files with thousands of lines efficiently</li>
        </ul>

        <h3>Common Use Cases</h3>
        <p>
          Developers use duplicate line removers for cleaning log files with repeated error messages or warnings,
          deduplicating import statements or dependency lists in code, removing duplicate environment variables or config
          settings, cleaning up test data and mock datasets, processing git commit messages or changelog entries,
          deduplicating API endpoint lists or URL collections. Data analysts and scientists clean CSV data before analysis,
          deduplicate customer lists or email addresses, remove repeated entries from survey responses, clean scraped
          web data with duplicate records, prepare unique value lists for database imports, merge multiple data sources
          and remove overlaps. System administrators process server logs, deduplicate host names or IP addresses, clean
          up package lists and dependency files, remove duplicate cron jobs or scheduled tasks. Content managers
          deduplicate keyword lists, remove repeated tags or categories, clean up link collections and bookmarks, process
          mailing lists and contact databases.
        </p>

        <h3>Advanced Features</h3>
        <p>
          The tool offers powerful deduplication options: Case-sensitive mode treats "Apple", "apple", and "APPLE" as
          three different lines, while case-insensitive mode (default) treats them as the same. Whitespace trimming
          removes leading and trailing spaces before comparison, so " text " and "text" are treated as duplicates.
          Choose to keep the first occurrence (preserves original order) or last occurrence (useful when later entries
          are more recent/accurate). Remove empty lines option eliminates blank lines from the output for cleaner results.
          Sort result option alphabetically orders the deduplicated lines for better readability and comparison. The tool
          preserves the original content of kept lines (doesn't modify the text itself unless trimming is enabled).
        </p>

        <h3>Technical Features</h3>
        <p>
          The remover processes text line by line with efficient algorithms that handle large files quickly, uses hash-based
          lookup for O(n) performance with thousands of lines, preserves line order unless sorting is enabled, handles
          UTF-8 and special characters correctly, provides real-time statistics (original count, unique count, removed count),
          supports both Windows (CRLF) and Unix (LF) line endings, generates clean output ready for further processing or
          download, includes swap functionality to use output as new input for iterative processing, and offers copy-to-clipboard
          and download options. The tool displays a success badge showing how many duplicates were removed for immediate
          feedback.
        </p>

        <h3>Privacy and Security</h3>
        <p>
          Unlike online tools that upload your files to remote servers, this duplicate remover processes everything locally
          in your browser using JavaScript. Your log files, customer lists, email addresses, API keys, configuration files,
          proprietary data, or any sensitive text never leave your computer, making it completely safe for processing
          confidential information. No cookies, tracking, data storage, or server communication. Perfect for working with
          production logs, internal customer databases, security credentials, private email lists, confidential datasets,
          or any sensitive text that requires strict privacy controls. Your data remains 100% private and secure on your
          device.
        </p>
      </section>

      {/* Features */}
      <section className="features" aria-label="Features">
        {[
          {
            icon: <Layers size={24} />,
            title: "Smart deduplication",
            desc: "Remove exact or case-insensitive duplicates. Choose to keep the first or last occurrence of each line.",
          },
          {
            icon: <Lock size={24} />,
            title: "Fully private",
            desc: "Your text never leaves the browser. Safe for logs, configs, passwords, or any sensitive data.",
          },
          {
            icon: <Settings2 size={24} />,
            title: "Flexible options",
            desc: "Trim whitespace, remove empty lines, sort the result — all configurable before or after conversion.",
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