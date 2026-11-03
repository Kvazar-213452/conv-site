"use client";

import { useState, useCallback } from "react";
import { Lock, Zap, ArrowRight } from "lucide-react";
import { rot13, rot47, caesar, type Variant } from "./utils";

import "@/style/main.css";
import "@/style/bar.css";

const EXAMPLE = "Hello, World! The quick brown fox jumps over the lazy dog.";

export default function Rot13() {
  const [variant, setVariant] = useState<Variant>("rot13");
  const [shift, setShift] = useState(13);
  const [input, setInput] = useState(EXAMPLE);
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const run = useCallback(() => {
    if (variant === "rot13") setOutput(rot13(input));
    else if (variant === "rot47") setOutput(rot47(input));
    else setOutput(caesar(input, shift));
  }, [variant, input, shift]);

  const copy = () => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <>
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-eyebrow"><div className="hero-dot" />Free · No sign-up · Runs in browser</div>
        <h1 id="hero-heading">ROT13 <em>/ ROT47</em> / Caesar</h1>
        <p>Shift-cipher text encoder/decoder. ROT13 is self-inverting (rotates letters by 13), ROT47 covers all printable ASCII, and a general Caesar shift lets you pick any offset. 100% client-side.</p>
        <div className="mode-toggle">
          <button className={`mode-btn${variant === "rot13" ? " active" : ""}`} onClick={() => setVariant("rot13")}>ROT13</button>
          <button className={`mode-btn${variant === "rot47" ? " active" : ""}`} onClick={() => setVariant("rot47")}>ROT47</button>
          <button className={`mode-btn${variant === "caesar" ? " active" : ""}`} onClick={() => setVariant("caesar")}>Caesar</button>
        </div>
      </section>

      <section aria-label="ROT Cipher">
        <div className="converter">
          <div className="panel">
            <div className="panel-header">
              <div className="panel-title"><div className="dot json" />Input</div>
              <div className="panel-actions">
                <button className="btn-ghost" onClick={() => setInput(EXAMPLE)}>Example</button>
                <button className="btn-ghost" onClick={() => setInput("")}>Clear</button>
              </div>
            </div>
            <textarea value={input} onChange={(e) => setInput(e.target.value)} spellCheck={false} />
          </div>
          <div className={`panel${output ? " has-output" : ""}`}>
            <div className="panel-header">
              <div className="panel-title"><div className="dot yaml" />Output{output && <span className="success-tag">✓ {variant}</span>}</div>
              {output && <div className="panel-actions"><button className="btn-ghost" onClick={copy}>{copied ? "✓ Copied!" : "Copy"}</button></div>}
            </div>
            <pre className={`output-pre${output ? "" : " empty"}`} style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }} aria-live="polite">{output || "// Output will appear here…"}</pre>
          </div>
        </div>

        {variant === "caesar" && (
          <div className="options-bar">
            <label>Shift:
              <input type="number" min={-25} max={25} value={shift} onChange={(e) => setShift(parseInt(e.target.value) || 0)} />
            </label>
          </div>
        )}

        <div className="actions">
          <button className="btn-convert" onClick={run} disabled={!input}><ArrowRight size={16} className="mr-1" /> Apply</button>
        </div>
      </section>

      <section className="seo-content" aria-labelledby="about-heading">
        <h2 id="about-heading">ROT13, ROT47, and Caesar Cipher</h2>
        <p>Classic rotation ciphers. <strong>ROT13</strong> shifts each Latin letter by 13 positions — because 13 is half of 26, applying it twice returns the original. Common in Usenet to hide spoilers. <strong>ROT47</strong> extends the idea to the 94 printable ASCII characters (<code>!</code> to <code>~</code>). <strong>Caesar</strong> is the general case — pick any shift.</p>

        <h3>Important</h3>
        <p>These are not encryption. Anyone can decode in seconds. Use them for puzzles, obfuscation, or hiding spoilers — never for secrets.</p>
      </section>

      <section className="features" aria-label="Features">
        {[
          { icon: <Zap size={24} />,  title: "Self-inverting",  desc: "ROT13 undoes itself; apply twice to get back the original." },
          { icon: <Lock size={24} />, title: "Fully private",   desc: "Text never leaves your browser." },
          { icon: <ArrowRight size={24} />, title: "Three variants", desc: "ROT13, ROT47, or custom Caesar shift." },
        ].map(({ icon, title, desc }) => (
          <div className="feature" key={title}><div className="feature-icon">{icon}</div><h3>{title}</h3><p>{desc}</p></div>
        ))}
      </section>
    </>
  );
}
