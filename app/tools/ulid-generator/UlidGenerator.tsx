"use client";

import { useState, useCallback, useEffect } from "react";
import { Clock, Shuffle, ArrowRight, KeyRound } from "lucide-react";
import Link from "next/link";
import { generateBatch } from "./utils";

import "@/style/main.css";
import "@/style/bar.css";

export default function UlidGenerator() {
  const [count, setCount] = useState(10);
  const [list, setList] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const run = useCallback(() => setList(generateBatch(count)), [count]);
  useEffect(() => { run(); /* eslint-disable-next-line */ }, []);

  const copyAll = () => {
    navigator.clipboard.writeText(list.join("\n"));
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-eyebrow">
          <div className="hero-dot" aria-hidden="true" />
          Free · No sign-up · Runs in browser
        </div>
        <h1 id="hero-heading">ULID <em>Generator</em></h1>
        <p>
          Generate ULID (Universally Unique Lexicographically Sortable Identifier) —
          26-character Base32 IDs that sort by creation time out of the box. 128 bits
          of entropy (48 timestamp + 80 random). Up to 1000 per batch, fully client-side.
        </p>
      </section>

      <section aria-label="ULID Generator">
        <div className="converter" style={{ gridTemplateColumns: "1fr" }}>
          <div className="panel has-output">
            <div className="panel-header">
              <div className="panel-title">
                <div className="dot yaml" aria-hidden="true" />
                {list.length} ULID{list.length === 1 ? "" : "s"}
                <span className="success-tag">✓ time-sortable</span>
              </div>
              <div className="panel-actions">
                <button className="btn-ghost" onClick={copyAll}>{copied ? "✓ Copied!" : "Copy All"}</button>
                <button className="btn-ghost" onClick={run}><Shuffle size={13} aria-hidden="true" /> Shuffle</button>
              </div>
            </div>
            <pre className="output-pre" aria-live="polite">{list.join("\n")}</pre>
          </div>
        </div>

        <div className="options-bar">
          <label>
            Count:
            <input type="number" min={1} max={1000} value={count}
              onChange={(e) => setCount(Math.max(1, Math.min(1000, parseInt(e.target.value) || 1)))} />
          </label>
        </div>

        <div className="actions">
          <button className="btn-convert" onClick={run}>
            <ArrowRight size={16} aria-hidden="true" className="mr-1" /> Generate
          </button>
        </div>
      </section>

      <section className="seo-content" aria-labelledby="about-heading">
        <h2 id="about-heading">About the ULID Generator</h2>
        <p>
          A ULID is a 128-bit identifier like a UUID but encoded in 26 characters of
          Crockford Base32 instead of 36 characters of hex. The first 10 characters
          are a millisecond timestamp, making ULIDs <strong>lexicographically
          sortable</strong> — a huge advantage for logs, events, and database primary
          keys.
        </p>

        <h3>ULID vs UUID</h3>
        <ul>
          <li><strong>Length:</strong> ULID 26 chars vs UUID 36 chars (URL-friendlier)</li>
          <li><strong>Sortability:</strong> ULID sorts by time; UUID v4 does not</li>
          <li><strong>Entropy:</strong> ULID 80 random bits; UUID v4 122 random bits — both are far beyond collision reach</li>
          <li><strong>Case:</strong> ULID is uppercase Base32 (no 0/O or 1/I/L confusion)</li>
        </ul>

        <h3>When ULID Shines</h3>
        <ul>
          <li>Primary keys in a database where insert locality matters</li>
          <li>Correlation IDs for distributed logs — they sort naturally in time order</li>
          <li>Event IDs in event-sourced systems</li>
          <li>Short-enough public URLs where UUIDs feel bulky</li>
        </ul>

        <h3>FAQ</h3>
        <h3>Is the random part cryptographically secure?</h3>
        <p>Yes. The 80 random bits come from <code>crypto.getRandomValues</code>.</p>

        <h3>Do ULIDs from the same millisecond collide?</h3>
        <p>With 80 bits of randomness per millisecond, a collision needs ~2⁴⁰ IDs in one ms — practically impossible.</p>

        <h3>Related</h3>
        <p>
          Compare ULID with other formats in{" "}
          <Link href="/blog/uuid-vs-nanoid">UUID vs NanoID vs ULID</Link>, or generate
          classic UUIDs with the <Link href="/tools/uuid-generator">UUID Generator</Link>.
        </p>
      </section>

      <section className="features" aria-label="Features">
        {[
          { icon: <Clock size={24} />,    title: "Time-sortable",  desc: "48-bit millisecond timestamp prefix sorts ULIDs by creation order." },
          { icon: <KeyRound size={24} />, title: "80 random bits", desc: "Crypto-strong randomness from the Web Crypto API." },
          { icon: <Shuffle size={24} />,  title: "Batch 1000",     desc: "Generate large batches for seed data, event streams, logs." },
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
