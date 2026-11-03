"use client";

import { useState, useCallback } from "react";
import { Radio, Zap, Lock, ArrowRight, ArrowLeft } from "lucide-react";
import { textToMorse, morseToText } from "./utils";

import "@/style/main.css";

type Mode = "txt2morse" | "morse2txt";

const EX_TEXT  = "SOS Help me!";
const EX_MORSE = "... --- ... / .... . .-.. .--. / -- . -.-.--";

export default function MorseCode() {
  const [mode, setMode] = useState<Mode>("txt2morse");
  const [input, setInput] = useState(EX_TEXT);
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const isT2M = mode === "txt2morse";

  const switchMode = (next: Mode) => {
    setMode(next);
    setInput(next === "txt2morse" ? EX_TEXT : EX_MORSE);
    setOutput("");
  };

  const run = useCallback(() => setOutput(isT2M ? textToMorse(input) : morseToText(input)), [input, isT2M]);
  const copy = () => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <>
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-eyebrow"><div className="hero-dot" />Free · No sign-up · Runs in browser</div>
        <h1 id="hero-heading">Morse Code <em>Translator</em></h1>
        <p>Encode text as Morse code and decode Morse back to text. Supports letters, digits, and standard punctuation. Words separated by <code>/</code>.</p>
        <div className="mode-toggle">
          <button className={`mode-btn${isT2M ? " active" : ""}`} onClick={() => switchMode("txt2morse")}>Text → Morse</button>
          <button className="mode-swap-btn" onClick={() => switchMode(isT2M ? "morse2txt" : "txt2morse")}>⇄</button>
          <button className={`mode-btn${!isT2M ? " active" : ""}`} onClick={() => switchMode("morse2txt")}>Morse → Text</button>
        </div>
      </section>

      <section aria-label="Morse Code Translator">
        <div className="converter">
          <div className="panel">
            <div className="panel-header">
              <div className="panel-title"><div className="dot json" />{isT2M ? "Text" : "Morse"} Input</div>
              <div className="panel-actions">
                <button className="btn-ghost" onClick={() => setInput(isT2M ? EX_TEXT : EX_MORSE)}>Example</button>
                <button className="btn-ghost" onClick={() => setInput("")}>Clear</button>
              </div>
            </div>
            <textarea value={input} onChange={(e) => setInput(e.target.value)} spellCheck={false} />
          </div>
          <div className={`panel${output ? " has-output" : ""}`}>
            <div className="panel-header">
              <div className="panel-title"><div className="dot yaml" />{isT2M ? "Morse" : "Text"}{output && <span className="success-tag">✓ translated</span>}</div>
              {output && <div className="panel-actions"><button className="btn-ghost" onClick={copy}>{copied ? "✓ Copied!" : "Copy"}</button></div>}
            </div>
            <pre className={`output-pre${output ? "" : " empty"}`} style={{ whiteSpace: "pre-wrap", wordBreak: "break-all" }} aria-live="polite">
              {output || "// Translation will appear here…"}
            </pre>
          </div>
        </div>

        <div className="actions">
          <button className="btn-convert" onClick={run} disabled={!input.trim()}>
            {isT2M ? <><ArrowRight size={16} className="mr-1" /> Encode</> : <><ArrowLeft size={16} className="mr-1" /> Decode</>}
          </button>
        </div>
      </section>

      <section className="seo-content" aria-labelledby="about-heading">
        <h2 id="about-heading">Morse Code Translator</h2>
        <p>Encode text as International Morse Code and decode Morse back to text. Covers all 26 Latin letters, 10 digits, and standard punctuation. Letters within a word are separated by a single space; words are separated by <code>/</code>.</p>

        <h3>Format Convention</h3>
        <ul>
          <li>Dot: <code>.</code></li>
          <li>Dash: <code>-</code></li>
          <li>Letter gap: single space</li>
          <li>Word gap: <code>/</code> surrounded by spaces</li>
        </ul>

        <h3>FAQ</h3>
        <h3>Does it handle non-English letters?</h3>
        <p>Only standard International Morse. Diacritics and Cyrillic are not supported — remove accents first.</p>
      </section>

      <section className="features" aria-label="Features">
        {[
          { icon: <Radio size={24} />, title: "International Morse", desc: "26 letters, 10 digits, standard punctuation." },
          { icon: <Zap size={24} />,   title: "Instant",              desc: "Encoding and decoding run in your browser." },
          { icon: <Lock size={24} />,  title: "Fully private",        desc: "Your text never leaves the page." },
        ].map(({ icon, title, desc }) => (
          <div className="feature" key={title}><div className="feature-icon">{icon}</div><h3>{title}</h3><p>{desc}</p></div>
        ))}
      </section>
    </>
  );
}
