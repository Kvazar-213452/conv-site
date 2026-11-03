"use client";

import { useState, useCallback } from "react";
import { Binary, Zap, Lock, ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { textToBinary, binaryToText } from "./utils";

import "@/style/main.css";

type Mode = "txt2bin" | "bin2txt";

const EXAMPLE_TEXT = "Hello, 世界!";
const EXAMPLE_BIN  = "01001000 01100101 01101100 01101100 01101111";

export default function BinaryToText() {
  const [mode, setMode] = useState<Mode>("txt2bin");
  const [input, setInput] = useState(EXAMPLE_TEXT);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const isTxt2Bin = mode === "txt2bin";

  const switchMode = (next: Mode) => {
    setMode(next);
    setInput(next === "txt2bin" ? EXAMPLE_TEXT : EXAMPLE_BIN);
    setOutput(""); setError("");
  };

  const run = useCallback(() => {
    setError(""); setOutput("");
    try { setOutput(isTxt2Bin ? textToBinary(input) : binaryToText(input)); }
    catch (e) { setError((e as Error).message); }
  }, [input, isTxt2Bin]);

  const copy = () => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <>
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-eyebrow"><div className="hero-dot" />Free · No sign-up · Runs in browser</div>
        <h1 id="hero-heading">{isTxt2Bin ? <>Text <em>→</em> Binary</> : <>Binary <em>→</em> Text</>}</h1>
        <p>Convert between UTF-8 text and binary representation (8 bits per byte). Handles emoji and non-ASCII correctly via UTF-8. 100% client-side.</p>
        <div className="mode-toggle">
          <button className={`mode-btn${isTxt2Bin ? " active" : ""}`} onClick={() => switchMode("txt2bin")}>Text → Binary</button>
          <button className="mode-swap-btn" onClick={() => switchMode(isTxt2Bin ? "bin2txt" : "txt2bin")}>⇄</button>
          <button className={`mode-btn${!isTxt2Bin ? " active" : ""}`} onClick={() => switchMode("bin2txt")}>Binary → Text</button>
        </div>
      </section>

      {error && <div className="error-bar" role="alert"><span>✕</span><span>Error: {error}</span></div>}

      <section aria-label="Binary ↔ Text">
        <div className="converter">
          <div className={`panel${error ? " has-error" : ""}`}>
            <div className="panel-header">
              <div className="panel-title"><div className="dot json" />{isTxt2Bin ? "Text" : "Binary"} Input</div>
              <div className="panel-actions">
                <button className="btn-ghost" onClick={() => setInput(isTxt2Bin ? EXAMPLE_TEXT : EXAMPLE_BIN)}>Example</button>
                <button className="btn-ghost" onClick={() => setInput("")}>Clear</button>
              </div>
            </div>
            <textarea value={input} onChange={(e) => { setInput(e.target.value); setError(""); }} spellCheck={false} />
          </div>
          <div className={`panel${output ? " has-output" : ""}`}>
            <div className="panel-header">
              <div className="panel-title"><div className="dot yaml" />{isTxt2Bin ? "Binary" : "Text"} Output{output && <span className="success-tag">✓ converted</span>}</div>
              {output && <div className="panel-actions"><button className="btn-ghost" onClick={copy}>{copied ? "✓ Copied!" : "Copy"}</button></div>}
            </div>
            <pre className={`output-pre${output ? "" : " empty"}`} style={{ whiteSpace: "pre-wrap", wordBreak: "break-all" }} aria-live="polite">
              {output || "// Output will appear here…"}
            </pre>
          </div>
        </div>

        <div className="actions">
          <button className="btn-convert" onClick={run} disabled={!input.trim()}>
            {isTxt2Bin ? <><ArrowRight size={16} className="mr-1" /> Encode</> : <><ArrowLeft size={16} className="mr-1" /> Decode</>}
          </button>
        </div>
      </section>

      <section className="seo-content" aria-labelledby="about-heading">
        <h2 id="about-heading">Binary to Text Converter</h2>
        <p>Convert between UTF-8 encoded text and binary representation. Each byte becomes exactly 8 bits of <code>0</code>s and <code>1</code>s, with bytes separated by spaces for readability. Decoding tolerates spaces, newlines, and tabs between groups.</p>

        <h3>FAQ</h3>
        <h3>Does it handle non-ASCII characters?</h3>
        <p>Yes. The encoder uses UTF-8, so <code>世</code>, <code>🚀</code>, and other multi-byte characters round-trip correctly.</p>

        <h3>Related</h3>
        <p>Convert between numeric bases with <Link href="/tools/number-base-converter">Number Base Converter</Link>, or encode/decode <Link href="/tools/string-to-base64">Base64</Link>.</p>
      </section>

      <section className="features" aria-label="Features">
        {[
          { icon: <Binary size={24} />, title: "UTF-8 bytes",    desc: "Each byte → 8 bits; emoji and non-ASCII round-trip correctly." },
          { icon: <Zap size={24} />,    title: "Instant",        desc: "Conversion runs in milliseconds in your browser." },
          { icon: <Lock size={24} />,   title: "Fully private",  desc: "Text and binary stay on your device." },
        ].map(({ icon, title, desc }) => (
          <div className="feature" key={title}><div className="feature-icon">{icon}</div><h3>{title}</h3><p>{desc}</p></div>
        ))}
      </section>
    </>
  );
}
