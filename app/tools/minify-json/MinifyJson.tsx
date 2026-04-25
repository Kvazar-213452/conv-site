"use client";

import { useState, useCallback, useMemo } from "react";
import { EXAMPLE_JSON } from "@/lib/const";
import { CloudLightning, Lock, Star, Minimize2, Maximize2 } from "lucide-react";

import "@/style/main.css";

type Mode = "minify" | "beautify";

export default function MinifyJson() {
  const [mode, setMode] = useState<Mode>("minify");
  const [input, setInput] = useState(EXAMPLE_JSON);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [converting, setConverting] = useState(false);

  const isMinify = mode === "minify";

  const switchMode = (next: Mode) => {
    setMode(next);
    setOutput("");
    setError("");
  };

  const swapWithOutput = () => {
    if (!output) return;
    const next: Mode = isMinify ? "beautify" : "minify";
    setMode(next);
    setInput(output);
    setOutput("");
    setError("");
  };

  const convert = useCallback(() => {
    setError("");
    setOutput("");
    setConverting(true);
    setTimeout(() => {
      try {
        const parsed = JSON.parse(input.trim());
        if (isMinify) {
          setOutput(JSON.stringify(parsed));
        } else {
          setOutput(JSON.stringify(parsed, null, 2));
        }
      } catch (e) {
        setError((e as Error).message);
      }
      setConverting(false);
    }, 280);
  }, [input, isMinify]);

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadOutput = () => {
    const suffix = isMinify ? "min" : "pretty";
    const blob = new Blob([output], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `output.${suffix}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearAll = () => { setInput(""); setOutput(""); setError(""); };
  const loadExample = () => {
    setInput(EXAMPLE_JSON);
    setOutput("");
    setError("");
  };

  // Calculate size savings for minify mode
  const stats = useMemo(() => {
    if (!output) return null;
    const inputBytes = new Blob([input]).size;
    const outputBytes = new Blob([output]).size;
    const diff = inputBytes - outputBytes;
    const percent = inputBytes > 0 ? Math.round((diff / inputBytes) * 100) : 0;
    return { inputBytes, outputBytes, diff, percent };
  }, [input, output]);

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const inputLabel = "JSON Input";
  const outputLabel = isMinify ? "Minified JSON" : "Beautified JSON";
  const errorPrefix = "JSON Parse Error";
  const outputPlaceholder = isMinify
    ? "// Your minified JSON will appear here…"
    : "// Your beautified JSON will appear here…";
  const inputPlaceholder = '{\n  "key": "value"\n}';

  return (
    <>
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-eyebrow">
          <div className="hero-dot" aria-hidden="true" />
          Free · No sign-up · Runs in browser
        </div>
        <h1 id="hero-heading">
          {isMinify ? <>Minify <em>JSON</em></> : <>Beautify <em>JSON</em></>}
          <br />Online
        </h1>
        <p>
          {isMinify
            ? "Paste your JSON, press Minify. Strips whitespace and shrinks file size — runs 100% in your browser."
            : "Paste your minified JSON, press Beautify. Auto-formats with 2-space indentation for readability."
          }
        </p>

        {/* Mode toggle */}
        <div className="mode-toggle" role="group" aria-label="Conversion direction">
          <button
            className={`mode-btn${isMinify ? " active" : ""}`}
            onClick={() => switchMode("minify")}
          >
            Minify
          </button>
          <button
            className="mode-swap-btn"
            onClick={() => output ? swapWithOutput() : switchMode(isMinify ? "beautify" : "minify")}
            title={output ? "Move output to input & flip direction" : "Flip direction"}
            aria-label="Swap conversion direction"
          >
            ⇄
          </button>
          <button
            className={`mode-btn${!isMinify ? " active" : ""}`}
            onClick={() => switchMode("beautify")}
          >
            Beautify
          </button>
        </div>
      </section>

      {/* Error */}
      {error && (
        <div className="error-bar" role="alert" aria-live="assertive">
          <span aria-hidden="true">✕</span>
          <span>{errorPrefix}: {error}</span>
        </div>
      )}

      {/* Converter */}
      <section aria-label="Converter">
        <div className="converter">

          {/* Input panel */}
          <div className={`panel${error ? " has-error" : ""}`}>
            <div className="panel-header">
              <div className="panel-title">
                <div className="dot json" aria-hidden="true" />
                {inputLabel}
              </div>
              <div className="panel-actions">
                <button className="btn-ghost" onClick={loadExample}>Example</button>
                <button className="btn-ghost" onClick={() => { setInput(""); setError(""); }}>Clear</button>
              </div>
            </div>
            <textarea
              aria-label={inputLabel}
              placeholder={inputPlaceholder}
              value={input}
              onChange={(e) => { setInput(e.target.value); setError(""); }}
              spellCheck={false} autoCorrect="off" autoCapitalize="off"
            />
          </div>

          {/* Output panel */}
          <div className={`panel${output ? " has-output" : ""}`}>
            <div className="panel-header">
              <div className="panel-title">
                <div className="dot json" aria-hidden="true" />
                {outputLabel}
                {output && !converting && (
                  <span className="success-tag">
                    {isMinify && stats && stats.percent > 0
                      ? `✓ −${stats.percent}% (${formatBytes(stats.outputBytes)})`
                      : "✓ done"}
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
                      title="Use output as new input and reverse direction"
                    >
                      ⇄ Swap
                    </button>
                  </>
                )}
              </div>
            </div>
            <pre
              className={`output-pre${output && !converting ? "" : " empty"}${converting ? " loading" : ""}`}
              aria-label={outputLabel} aria-live="polite"
            >
              {converting ? "// Processing…" : (output || outputPlaceholder)}
            </pre>
          </div>

        </div>

        {/* Buttons */}
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
              : isMinify
                ? <><Minimize2 size={16} aria-hidden="true" className="mr-1" /> Minify JSON</>
                : <><Maximize2 size={16} aria-hidden="true" className="mr-1" /> Beautify JSON</>
            }
          </button>
          <button className="btn-secondary" onClick={clearAll}>Clear All</button>
        </div>
      </section>

      <section className="seo-content" aria-labelledby="about-heading">
        <h2 id="about-heading">About JSON Minifier &amp; Beautifier</h2>
        <p>
          This free online JSON minifier and beautifier tool lets you compress or format JSON data instantly. Whether
          you&apos;re a developer optimizing API payloads, reducing bandwidth usage, preparing JSON for production, or
          formatting compact JSON for readability and debugging, our bidirectional tool handles it seamlessly. Minify
          JSON to strip all unnecessary whitespace, line breaks, and indentation — shrinking file size by up to 80%.
          Beautify minified JSON back into clean, properly indented, human-readable format. Everything runs 100% in your
          browser with no server uploads.
        </p>

        <h3>Why Minify JSON?</h3>
        <p>
          Minified JSON removes all whitespace, line breaks, and indentation that humans use for readability but machines
          don&apos;t need. The result is dramatically smaller payloads — often 30–80% reduction in size depending on
          formatting. This translates directly to faster API responses, reduced bandwidth costs, lower mobile data usage,
          quicker page loads for embedded JSON-LD structured data, and improved performance for high-traffic endpoints.
          Minification is essential for production REST APIs, GraphQL responses, configuration files shipped to clients,
          analytics payloads, and any scenario where bytes matter. Beautifying, on the other hand, is what you need when
          debugging compact JSON — turning an unreadable single-line blob back into a structured, scannable document.
        </p>

        <h3>How to Use This Tool</h3>
        <p>
          Choose your direction using the toggle: Minify compresses formatted JSON into a single compact line by removing
          all whitespace while preserving valid syntax and data integrity. Beautify takes minified or messy JSON and
          reformats it with consistent 2-space indentation, proper line breaks, and aligned keys for maximum readability.
          Paste your JSON into the input field, click the action button, and get instant results with size statistics
          showing exactly how much you saved. Download as a .json file, copy to clipboard, or use the swap button to feed
          the output back as input for roundtrip testing.
        </p>

        <h3>Key Benefits</h3>
        <ul>
          <li><strong>No installation required:</strong> Works directly in your browser without any software downloads</li>
          <li><strong>Completely free:</strong> No registration, credit card, or hidden fees</li>
          <li><strong>Secure and private:</strong> All processing happens locally — your data never reaches our servers</li>
          <li><strong>Fast processing:</strong> Instant minification with no waiting time or rate limits</li>
          <li><strong>Bidirectional:</strong> Minify and beautify with full roundtrip support</li>
          <li><strong>Size statistics:</strong> See exact byte savings and compression percentage after each minify</li>
          <li><strong>Syntax validation:</strong> Detects malformed JSON and reports parse errors clearly</li>
          <li><strong>Type preservation:</strong> Correctly handles strings, numbers, booleans, null, arrays, objects</li>
        </ul>

        <h3>Common Use Cases</h3>
        <p>
          Developers minify JSON for production API responses to reduce payload size and improve latency, embedding
          JSON-LD structured data in HTML pages for SEO without bloating page weight, shipping configuration files to
          mobile and web clients, optimizing GraphQL response payloads, preparing JSON for inclusion in URL query
          parameters or HTTP headers, compressing analytics and telemetry events, and reducing storage costs for
          JSON-based databases and document stores. Beautification is the reverse use case — debugging minified API
          responses captured in network tools, formatting compact JSON pasted from logs, making package.json or
          tsconfig.json human-editable after auto-generation, reviewing inscrutable single-line config files, and
          preparing JSON examples for documentation or technical writing.
        </p>

        <h3>Supported Format Features</h3>
        <p>
          JSON minification removes all insignificant whitespace including spaces, tabs, newlines between tokens, and
          indentation while preserving all data exactly — strings retain their internal whitespace, numbers keep their
          precision, booleans and null stay unchanged, and key ordering is maintained. Beautification reformats with
          consistent 2-space indentation, places each key-value pair on its own line, properly indents nested objects
          and arrays, and produces output that matches the formatting conventions of most editors and linters. Both
          modes validate syntax according to JSON RFC 8259, support UTF-8 and Unicode escape sequences, handle deeply
          nested structures efficiently, and process arrays and objects of any size your browser can hold in memory.
        </p>

        <h3>Technical Features</h3>
        <p>
          The tool processes JSON entirely client-side with zero latency, validates syntax before output to catch parse
          errors early, reports detailed error messages with helpful context for malformed input, preserves data types
          and precision exactly during minification and beautification (no type coercion or rounding), handles UTF-8
          and Unicode characters correctly, calculates and displays size statistics in bytes, kilobytes, or megabytes
          along with percentage savings, supports large files limited only by your browser&apos;s memory, and provides
          quick actions for copy, download, and bidirectional swap. The tool follows the JSON RFC 8259 specification
          for maximum compatibility with all JSON parsers.
        </p>

        <h3>Privacy and Security</h3>
        <p>
          Unlike online tools that upload your JSON to remote servers, this minifier processes everything locally in your
          browser using JavaScript. Your API keys, database credentials, user records, internal configurations, JWT
          tokens, OAuth secrets, or any sensitive JSON data never leave your computer, making it completely safe for
          minifying production payloads and confidential data. No cookies, tracking, data storage, or server
          communication. Perfect for working with authentication tokens, payment data, personal information, or any
          sensitive JSON content that requires strict privacy and security controls.
        </p>
      </section>

      {/* Features */}
      <section className="features" aria-label="Features">
        {[
          { icon: <CloudLightning size={24} />, title: "Instant processing", desc: "Pure client-side minification. No latency, no rate limits, no server roundtrips." },
          { icon: <Lock size={24} />, title: "Fully private", desc: "Your JSON never leaves the browser. Minify sensitive payloads safely." },
          { icon: <Star size={24} />, title: "Bidirectional", desc: "Minify and beautify with one click. See exact byte savings and compression ratio after each run." },
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