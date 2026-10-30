"use client";

import { useState, useCallback } from "react";
import { Hash, Lock, Zap, ArrowRight } from "lucide-react";
import { hashAll, HASH_ALGORITHMS, type HashResult } from "./utils";
import { EXAMPLE_HASH_INPUT } from "@/lib/const";

import "@/style/main.css";
import "./main.css";

export default function HashGenerator() {
  const [input, setInput] = useState(EXAMPLE_HASH_INPUT);
  const [results, setResults] = useState<HashResult[]>([]);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");
  const [hashing, setHashing] = useState(false);

  const generate = useCallback(() => {
    setError("");
    setResults([]);
    if (!input) return;
    setHashing(true);
    setTimeout(async () => {
      try {
        setResults(await hashAll(input));
      } catch (e) {
        setError((e as Error).message);
      }
      setHashing(false);
    }, 220);
  }, [input]);

  const copyValue = (algo: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopied(algo);
    setTimeout(() => setCopied(""), 2000);
  };

  const loadExample = () => { setInput(EXAMPLE_HASH_INPUT); setResults([]); setError(""); };
  const clearAll   = () => { setInput(""); setResults([]); setError(""); };

  return (
    <>
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-eyebrow">
          <div className="hero-dot" aria-hidden="true" />
          Free · No sign-up · Runs in browser
        </div>
        <h1 id="hero-heading">
          Hash <em>Generator</em>
        </h1>
        <p>
          Instantly compute MD5, SHA-1, SHA-256, SHA-384, and SHA-512 hashes from any text.
          Everything runs locally in your browser — your input never leaves your device.
        </p>
      </section>

      {error && (
        <div className="error-bar" role="alert" aria-live="assertive">
          <span aria-hidden="true">✕</span>
          <span>Hash Error: {error}</span>
        </div>
      )}

      <section aria-label="Hash Generator">
        <div className="converter">

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
              placeholder="Enter any text, password, token, or data…"
              value={input}
              onChange={(e) => { setInput(e.target.value); setError(""); }}
              spellCheck={false} autoCorrect="off" autoCapitalize="off"
            />
          </div>

          <div className={`panel${results.length ? " has-output" : ""}`}>
            <div className="panel-header">
              <div className="panel-title">
                <div className="dot yaml" aria-hidden="true" />
                Hashes
                {results.length > 0 && !hashing && <span className="success-tag">✓ generated</span>}
              </div>
            </div>

            {hashing && (
              <pre className="output-pre loading" aria-live="polite">// Hashing…</pre>
            )}
            {!hashing && results.length === 0 && (
              <pre className="output-pre empty" aria-live="polite">
                {`// Your hashes will appear here…`}
              </pre>
            )}
            {!hashing && results.length > 0 && (
              <div className="hg-list" aria-live="polite">
                {results.map(({ algorithm, hex }) => (
                  <div className="hg-row" key={algorithm}>
                    <div className="hg-row-head">
                      <span className="hg-algo">{algorithm}</span>
                      <button className="btn-ghost" onClick={() => copyValue(algorithm, hex)}>
                        {copied === algorithm ? "✓ Copied!" : "Copy"}
                      </button>
                    </div>
                    <code className="hg-hex">{hex}</code>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        <div className="actions">
          <button className="btn-secondary" onClick={loadExample}>Load Example</button>
          <button
            className="btn-convert"
            onClick={generate}
            disabled={hashing || !input}
            aria-busy={hashing}
          >
            {hashing
              ? <><div className="btn-spinner" aria-hidden="true" /> Hashing…</>
              : <><ArrowRight size={16} aria-hidden="true" className="mr-1" /> Generate Hashes</>
            }
          </button>
          <button className="btn-secondary" onClick={clearAll}>Clear All</button>
        </div>
      </section>

      <section className="seo-content" aria-labelledby="about-heading">
        <h2 id="about-heading">About Hash Generator Tool</h2>
        <p>
          This free online hash generator computes cryptographic fingerprints from any text using
          five industry-standard algorithms — {HASH_ALGORITHMS.join(", ")}. All computation happens
          locally via the browser's Web Crypto API, so your input never leaves the page. Perfect for
          verifying file integrity, generating checksums, debugging authentication flows, and
          comparing hashes during security research.
        </p>

        <h3>Why Use Hashing?</h3>
        <p>
          A cryptographic hash collapses arbitrary input into a fixed-size fingerprint. Developers
          use hashes to verify downloads, detect tampering, index content in deduplication systems,
          build Merkle trees, and store password digests. MD5 and SHA-1 are considered broken for
          adversarial use but remain useful for non-security checksums; SHA-256 and above are the
          recommended choices for integrity verification and digital signatures.
        </p>

        <h3>Key Benefits</h3>
        <ul>
          <li><strong>Five algorithms at once:</strong> MD5, SHA-1, SHA-256, SHA-384, and SHA-512 computed together</li>
          <li><strong>Fully private:</strong> No uploads — safe for secrets, passwords, and tokens</li>
          <li><strong>Instant results:</strong> Browser-native Web Crypto API, plus a bundled MD5 implementation</li>
          <li><strong>UTF-8 ready:</strong> Correctly hashes multibyte characters and emoji</li>
          <li><strong>Copy per algorithm:</strong> Grab exactly the digest you need with one click</li>
        </ul>
      </section>

      <section className="features" aria-label="Features">
        {[
          {
            icon: <Zap size={24} />,
            title: "Instant hashing",
            desc: "All five digests computed in parallel using the browser's native Web Crypto API.",
          },
          {
            icon: <Lock size={24} />,
            title: "Fully private",
            desc: "Hashes are computed locally — safe for secrets, passwords, and confidential data.",
          },
          {
            icon: <Hash size={24} />,
            title: "Full algorithm set",
            desc: "MD5, SHA-1, SHA-256, SHA-384, and SHA-512 — the complete modern checksum lineup.",
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
