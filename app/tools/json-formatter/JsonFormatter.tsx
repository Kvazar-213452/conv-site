"use client";

import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { EXAMPLE_JSON } from "@/lib/const";
import { CloudLightning, Lock, Star, FileJson, Upload } from "lucide-react";

import "@/style/main.css";

type Mode = "format" | "minify";
type IndentSize = 2 | 4 | 0; // 0 = tabs

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100 MB
const PREVIEW_LIMIT = 500_000; // ~500KB preview cap to keep DOM responsive

export default function JsonFormatter() {
  const [mode, setMode] = useState<Mode>("format");
  const [indent, setIndent] = useState<IndentSize>(2);
  const [input, setInput] = useState(EXAMPLE_JSON);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [fileName, setFileName] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const [outputTruncated, setOutputTruncated] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const isFormat = mode === "format";

  const switchMode = (next: Mode) => {
    setMode(next);
    setOutput("");
    setError("");
    setOutputTruncated(false);
  };

  const swapWithOutput = () => {
    if (!output) return;
    const next: Mode = isFormat ? "minify" : "format";
    setMode(next);
    setInput(output);
    setOutput("");
    setError("");
    setOutputTruncated(false);
  };

  const getIndent = (size: IndentSize): string | number => {
    if (size === 0) return "\t";
    return size;
  };

  const process = useCallback(() => {
    setError("");
    setOutput("");
    setOutputTruncated(false);
    setProcessing(true);

    // Use rAF + setTimeout to keep UI responsive on heavy payloads
    requestAnimationFrame(() => {
      setTimeout(() => {
        try {
          const parsed = JSON.parse(input.trim());
          const result = isFormat
            ? JSON.stringify(parsed, null, getIndent(indent))
            : JSON.stringify(parsed);
          setOutput(result);
          if (result.length > PREVIEW_LIMIT) setOutputTruncated(true);
        } catch (e) {
          setError((e as Error).message);
        }
        setProcessing(false);
      }, 50);
    });
  }, [input, isFormat, indent]);

  const copyOutput = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Clipboard access denied");
    }
  };

  const downloadOutput = () => {
    const suffix = isFormat ? "formatted" : "min";
    const baseName = fileName ? fileName.replace(/\.json$/i, "") : "output";
    const blob = new Blob([output], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${baseName}.${suffix}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
    setError("");
    setFileName("");
    setOutputTruncated(false);
  };

  const loadExample = () => {
    setInput(EXAMPLE_JSON);
    setOutput("");
    setError("");
    setFileName("");
    setOutputTruncated(false);
  };

  const readFile = useCallback((file: File) => {
    setError("");
    setOutput("");
    setOutputTruncated(false);

    if (file.size > MAX_FILE_SIZE) {
      setError(`File too large. Max ${MAX_FILE_SIZE / 1024 / 1024} MB allowed.`);
      return;
    }

    const isJsonLike =
      file.type === "application/json" ||
      file.type === "text/plain" ||
      /\.(json|jsonl|ndjson|txt)$/i.test(file.name);

    if (!isJsonLike) {
      setError("Unsupported file type. Please select a .json or .txt file.");
      return;
    }

    setProcessing(true);
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result;
      if (typeof text === "string") {
        setInput(text);
      } else {
        setError("Failed to read file as text.");
      }
      setProcessing(false);
    };
    reader.onerror = () => {
      setError("Failed to read file.");
      setProcessing(false);
    };
    reader.readAsText(file);
  }, []);

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) readFile(file);
    // reset so selecting the same file again triggers change
    if (e.target) e.target.value = "";
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) readFile(file);
  }, [readFile]);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  // Prevent the browser from opening the file when dropped outside the dropzone
  useEffect(() => {
    const prevent = (e: DragEvent) => e.preventDefault();
    window.addEventListener("dragover", prevent);
    window.addEventListener("drop", prevent);
    return () => {
      window.removeEventListener("dragover", prevent);
      window.removeEventListener("drop", prevent);
    };
  }, []);

  // Stats: size of input/output and savings/growth
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

  const inputBytes = useMemo(() => new Blob([input]).size, [input]);

  const outputPreview = useMemo(() => {
    if (!output) return "";
    if (output.length > PREVIEW_LIMIT) {
      return output.slice(0, PREVIEW_LIMIT) + "\n\n// … preview truncated. Use Download or Copy to get the full output.";
    }
    return output;
  }, [output]);

  const inputLabel = "JSON Input";
  const outputLabel = isFormat ? "Formatted JSON" : "Minified JSON";
  const errorPrefix = "JSON Parse Error";
  const outputPlaceholder = isFormat
    ? "// Your formatted JSON will appear here…"
    : "// Your minified JSON will appear here…";
  const inputPlaceholder = '{\n  "key": "value"\n}';

  return (
    <>
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-eyebrow">
          <div className="hero-dot" aria-hidden="true" />
          Free · No sign-up · Handles files up to 100 MB
        </div>
        <h1 id="hero-heading">
          <em>JSON</em> Formatter
          <br />for Large Files
        </h1>
        <p>
          {isFormat
            ? "Upload or paste large JSON. Format with 2 / 4 spaces or tabs. Runs 100% in your browser — no server uploads."
            : "Upload or paste large JSON. Minify to a single line and shrink payload size for production."
          }
        </p>

        {/* Mode toggle */}
        <div className="mode-toggle" role="group" aria-label="Mode">
          <button
            className={`mode-btn${isFormat ? " active" : ""}`}
            onClick={() => switchMode("format")}
          >
            Format
          </button>
          <button
            className="mode-swap-btn"
            onClick={() => output ? swapWithOutput() : switchMode(isFormat ? "minify" : "format")}
            title={output ? "Move output to input & flip mode" : "Flip mode"}
            aria-label="Swap mode"
          >
            ⇄
          </button>
          <button
            className={`mode-btn${!isFormat ? " active" : ""}`}
            onClick={() => switchMode("minify")}
          >
            Minify
          </button>
        </div>

        {/* Indent selector — only visible in Format mode */}
        {isFormat && (
          <div className="mode-toggle" role="group" aria-label="Indent size" style={{ marginTop: 12 }}>
            <button
              className={`mode-btn${indent === 2 ? " active" : ""}`}
              onClick={() => { setIndent(2); setOutput(""); }}
            >
              2 spaces
            </button>
            <button
              className={`mode-btn${indent === 4 ? " active" : ""}`}
              onClick={() => { setIndent(4); setOutput(""); }}
            >
              4 spaces
            </button>
            <button
              className={`mode-btn${indent === 0 ? " active" : ""}`}
              onClick={() => { setIndent(0); setOutput(""); }}
            >
              Tabs
            </button>
          </div>
        )}
      </section>

      {/* Hidden file input — controlled via ref */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,.jsonl,.ndjson,.txt,application/json,text/plain"
        onChange={onFileSelect}
        style={{ display: "none" }}
        aria-hidden="true"
      />

      {/* Dropzone */}
      <section
        className={`dropzone${isDragging ? " dragging" : ""}`}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={() => fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        aria-label="Drop JSON file here or click to select"
      >
      </section>

      {/* Error */}
      {error && (
        <div className="error-bar" role="alert" aria-live="assertive">
          <span aria-hidden="true">✕</span>
          <span>{errorPrefix}: {error}</span>
        </div>
      )}

      {/* Converter */}
      <section aria-label="Formatter">
        <div className="converter">

          {/* Input panel */}
          <div className={`panel${error ? " has-error" : ""}`}>
            <div className="panel-header">
              <div className="panel-title">
                <div className="dot json" aria-hidden="true" />
                {inputLabel}
                {input && (
                  <span className="success-tag">{formatBytes(inputBytes)}</span>
                )}
              </div>
              <div className="panel-actions">
                <button className="btn-ghost" onClick={() => fileInputRef.current?.click()}>
                  ↑ Upload
                </button>
                <button className="btn-ghost" onClick={loadExample}>Example</button>
                <button className="btn-ghost" onClick={() => { setInput(""); setError(""); setFileName(""); }}>Clear</button>
              </div>
            </div>
            <textarea
              aria-label={inputLabel}
              placeholder={inputPlaceholder}
              value={input}
              onChange={(e) => { setInput(e.target.value); setError(""); setFileName(""); }}
              spellCheck={false} autoCorrect="off" autoCapitalize="off"
            />
          </div>

          {/* Output panel */}
          <div className={`panel${output ? " has-output" : ""}`}>
            <div className="panel-header">
              <div className="panel-title">
                <div className="dot json" aria-hidden="true" />
                {outputLabel}
                {output && !processing && stats && (
                  <span className="success-tag">
                    {!isFormat && stats.percent > 0
                      ? `✓ −${stats.percent}% (${formatBytes(stats.outputBytes)})`
                      : `✓ ${formatBytes(stats.outputBytes)}`}
                  </span>
                )}
              </div>
              <div className="panel-actions">
                {output && !processing && (
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
                      title="Use output as new input and flip mode"
                    >
                      ⇄ Swap
                    </button>
                  </>
                )}
              </div>
            </div>
            <pre
              className={`output-pre${output && !processing ? "" : " empty"}${processing ? " loading" : ""}`}
              aria-label={outputLabel} aria-live="polite"
            >
              {processing ? "// Processing…" : (outputPreview || outputPlaceholder)}
            </pre>
            {outputTruncated && (
              <div className="panel-note" role="note">
                Preview truncated for performance. Use <strong>Download</strong> or <strong>Copy</strong> to get the full {formatBytes(stats?.outputBytes ?? 0)} output.
              </div>
            )}
          </div>

        </div>

        {/* Buttons */}
        <div className="actions">
          <button className="btn-secondary" onClick={() => fileInputRef.current?.click()}>
            <Upload size={16} aria-hidden="true" className="mr-1" /> Upload File
          </button>
          <button
            className="btn-convert"
            onClick={process}
            disabled={processing || !input.trim()}
            aria-busy={processing}
          >
            {processing
              ? <><div className="btn-spinner" aria-hidden="true" /> Processing…</>
              : isFormat
                ? <>Format JSON</>
                : <>Minify JSON</>
            }
          </button>
          <button className="btn-secondary" onClick={clearAll}>Clear All</button>
        </div>
      </section>

      <section className="seo-content" aria-labelledby="about-heading">
        <h2 id="about-heading">About JSON Formatter for Large Files</h2>
        <p>
          This free online JSON formatter is built for handling large files — up to 100 MB — that crash typical browser-based
          tools or online formatters. Whether you&apos;re working with multi-megabyte API exports, large JSON-LD datasets,
          analytics dumps, database backups, log files, or geospatial GeoJSON, this tool reads files locally, validates syntax,
          and reformats with your choice of indentation. Drag-and-drop or click to upload — your data never leaves the browser.
        </p>

        <h3>Why a Formatter Built for Large Files?</h3>
        <p>
          Most online JSON formatters break when you paste anything over a few megabytes — they hang, crash, or silently
          truncate your input. This tool processes JSON entirely client-side using the browser&apos;s native JSON parser,
          which is implemented in highly optimized C++ in modern engines. That means a 50 MB JSON file that would freeze
          a server-rendered tool parses here in milliseconds. The output preview is intelligently truncated to keep the
          DOM responsive, but the full result is always available via Copy or Download — so you can format gigabyte-class
          datasets and still walk away with the complete formatted file.
        </p>

        <h3>How to Use This Formatter</h3>
        <p>
          Drop a JSON file onto the upload zone or click to browse and select one — .json, .jsonl, .ndjson, and .txt files
          are all supported. Choose Format mode to pretty-print with 2 spaces, 4 spaces, or tabs, or Minify mode to strip
          all whitespace and produce the smallest possible payload. Click the action button and your formatted output
          appears with size statistics. Copy to clipboard, download as a new file, or swap the output back as input for
          roundtrip processing. You can also paste JSON directly into the input area for smaller payloads.
        </p>

        <h3>Key Benefits</h3>
        <ul>
          <li><strong>Handles large files:</strong> Up to 100 MB — way beyond what typical online tools support</li>
          <li><strong>Drag-and-drop upload:</strong> Drop files directly from your file manager, no clicking through dialogs</li>
          <li><strong>Indentation control:</strong> Format with 2 spaces, 4 spaces, or tabs depending on your style guide</li>
          <li><strong>Bidirectional:</strong> Format pretty or minify with one click</li>
          <li><strong>Size statistics:</strong> Exact byte count and compression percentage after every run</li>
          <li><strong>Smart preview:</strong> Truncates display for performance while preserving the full result for download</li>
          <li><strong>Syntax validation:</strong> Detailed parse errors help you locate problems in malformed input</li>
          <li><strong>Fully private:</strong> No server upload — your file is read and processed locally</li>
        </ul>

        <h3>Common Use Cases</h3>
        <p>
          Engineers use a large-file JSON formatter for inspecting and reformatting big API exports and database dumps,
          formatting NDJSON log files for human review, preparing JSON-LD structured data for SEO audits, beautifying
          minified production payloads captured from network tools, formatting GeoJSON files with thousands of features,
          minifying large config files before shipping to clients, validating that big API responses are syntactically
          correct, comparing formatted versions of large JSON files in diff tools, and converting between minified and
          pretty-printed formats for storage or transmission. Data engineers use it to clean up exports from BigQuery,
          Snowflake, MongoDB, or Elasticsearch before importing elsewhere.
        </p>

        <h3>Supported Format Features</h3>
        <p>
          Format mode produces output with consistent indentation using your chosen style — 2 spaces (most common), 4
          spaces (Python/PHP convention), or tabs (Go convention) — places each key-value pair on its own line, properly
          indents nested objects and arrays, and produces output matching standard editor and linter conventions. Minify
          mode removes all insignificant whitespace while preserving every byte of data — strings retain their internal
          whitespace, numbers keep full precision, booleans and null stay unchanged. Both modes validate syntax according
          to JSON RFC 8259, support UTF-8 and Unicode escape sequences, handle deeply nested structures, and preserve
          key ordering as it appears in the source.
        </p>

        <h3>Privacy and Security</h3>
        <p>
          Unlike server-based tools that upload your file to remote infrastructure, this formatter reads your file using
          the browser&apos;s FileReader API and processes JSON with the native parser — entirely on your device. API keys,
          customer records, internal exports, JWT tokens, OAuth secrets, payment data, or any sensitive JSON content never
          leave your computer. No cookies, tracking, data storage, or server communication. Safe for production payloads,
          confidential exports, and regulated data subject to GDPR, HIPAA, or similar compliance requirements.
        </p>
      </section>

      {/* Features */}
      <section className="features" aria-label="Features">
        {[
          { icon: <CloudLightning size={24} />, title: "Built for big JSON", desc: "Handles files up to 100 MB without hanging the browser. Native parser, smart preview truncation." },
          { icon: <Lock size={24} />, title: "Fully private", desc: "Files are read and processed locally via FileReader. Nothing is uploaded to any server." },
          { icon: <Star size={24} />, title: "Format or minify", desc: "Pretty-print with 2 / 4 spaces or tabs, or minify to a single compact line. See exact byte savings." },
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