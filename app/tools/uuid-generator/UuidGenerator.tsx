"use client";

import { useState, useCallback, useEffect } from "react";
import { KeyRound, Shuffle, Zap, ArrowRight } from "lucide-react";
import Link from "next/link";
import { generateBatch, type UuidVersion } from "./utils";

import "@/style/main.css";
import "@/style/bar.css";

const VERSIONS: { value: UuidVersion; label: string }[] = [
  { value: "v4",  label: "v4 (random)" },
  { value: "v7",  label: "v7 (time-ordered)" },
  { value: "nil", label: "Nil" },
];

export default function UuidGenerator() {
  const [version, setVersion] = useState<UuidVersion>("v4");
  const [count, setCount] = useState(10);
  const [uppercase, setUppercase] = useState(false);
  const [braces, setBraces] = useState(false);
  const [list, setList] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const run = useCallback(() => {
    let items = generateBatch(version, count);
    if (uppercase) items = items.map((u) => u.toUpperCase());
    if (braces)    items = items.map((u) => `{${u}}`);
    setList(items);
  }, [version, count, uppercase, braces]);

  useEffect(() => { run(); /* initial batch */ /* eslint-disable-next-line */ }, []);

  const copyAll = () => {
    navigator.clipboard.writeText(list.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const download = () => {
    const blob = new Blob([list.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `uuid-${version}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-eyebrow">
          <div className="hero-dot" aria-hidden="true" />
          Free · No sign-up · Runs in browser
        </div>
        <h1 id="hero-heading">
          UUID <em>Generator</em>
        </h1>
        <p>
          Generate v4 (random), v7 (time-ordered), or nil UUIDs — up to 1000 at a time.
          Uses the browser's cryptographic PRNG; nothing is logged or stored.
        </p>

        <div className="mode-toggle" role="group" aria-label="UUID version">
          {VERSIONS.map(({ value, label }) => (
            <button
              key={value}
              className={`mode-btn${version === value ? " active" : ""}`}
              onClick={() => setVersion(value)}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      <section aria-label="UUID Generator">
        <div className="converter" style={{ gridTemplateColumns: "1fr" }}>
          <div className="panel has-output">
            <div className="panel-header">
              <div className="panel-title">
                <div className="dot yaml" aria-hidden="true" />
                {list.length} UUID{list.length === 1 ? "" : "s"}
                <span className="success-tag">✓ {version.toUpperCase()}</span>
              </div>
              <div className="panel-actions">
                <button className="btn-ghost" onClick={copyAll}>
                  {copied ? "✓ Copied!" : "Copy All"}
                </button>
                <button className="btn-ghost" onClick={download}>↓ .txt</button>
                <button className="btn-ghost" onClick={run} title="Regenerate">
                  <Shuffle size={13} aria-hidden="true" /> Shuffle
                </button>
              </div>
            </div>
            <pre
              className={`output-pre${list.length ? "" : " empty"}`}
              aria-live="polite"
            >
              {list.length ? list.join("\n") : "// Click Generate to produce UUIDs…"}
            </pre>
          </div>
        </div>

        <div className="options-bar">
          <label>
            Count:
            <input
              type="number"
              min={1}
              max={1000}
              value={count}
              onChange={(e) => setCount(Math.max(1, Math.min(1000, parseInt(e.target.value) || 1)))}
            />
          </label>
          <label>
            <input type="checkbox" checked={uppercase} onChange={(e) => setUppercase(e.target.checked)} />
            Uppercase
          </label>
          <label>
            <input type="checkbox" checked={braces} onChange={(e) => setBraces(e.target.checked)} />
            Braces {"{…}"}
          </label>
        </div>

        <div className="actions">
          <button className="btn-convert" onClick={run}>
            <ArrowRight size={16} aria-hidden="true" className="mr-1" /> Generate
          </button>
        </div>
      </section>

      <section className="seo-content" aria-labelledby="about-heading">
        <h2 id="about-heading">About the UUID Generator</h2>
        <p>
          This free online UUID generator produces universally unique identifiers in your
          browser using <code>crypto.getRandomValues</code>, the same CSPRNG the browser
          uses for TLS keys. Supports UUID <strong>v4</strong> (122-bit random,
          RFC 4122) and the newer <strong>v7</strong> (RFC 9562, 2024) which
          embeds a millisecond timestamp for natural sortability. Generate up to
          1000 at a time with uppercase and brace-style options.
        </p>

        <h3>UUID v4 vs v7</h3>
        <ul>
          <li><strong>v4</strong> — fully random. Ubiquitous. Downsides: non-sortable; scatters B-tree index inserts, which hurts database performance at scale.</li>
          <li><strong>v7</strong> — millisecond timestamp + randomness. Monotonic. Inserts cluster at the end of the index, keeping Postgres and MySQL happy. Use for new primary keys.</li>
          <li><strong>Nil UUID</strong> — <code>00000000-0000-0000-0000-000000000000</code>. Reserved as a sentinel; sometimes needed for seed data or default values.</li>
        </ul>

        <h3>Common Use Cases</h3>
        <ul>
          <li>Primary keys for new database rows</li>
          <li>Correlation IDs for distributed tracing (OpenTelemetry, Jaeger)</li>
          <li>Session tokens, idempotency keys, request IDs</li>
          <li>Public-facing identifiers that must not expose row counts</li>
          <li>Deduplication keys for event streams</li>
        </ul>

        <h3>Frequently Asked Questions</h3>

        <h3>Is this cryptographically secure?</h3>
        <p>
          Yes — v4 uses <code>crypto.getRandomValues</code>, which is a CSPRNG.
          The chance of a collision in a 122-bit v4 UUID is effectively zero even
          after generating billions of them.
        </p>

        <h3>Should I use v4 or v7?</h3>
        <p>
          For new systems — v7. For legacy compatibility, URLs you cannot change,
          or ecosystems that still default to v4 (most ORMs today) — v4. Both are
          valid RFC-standardized UUIDs.
        </p>

        <h3>Does my data leave the browser?</h3>
        <p>
          No. UUIDs are generated locally; nothing is sent to a server, logged, or
          stored. Safe for API keys and tokens.
        </p>

        <h3>Related Tools</h3>
        <p>
          Encode UUIDs to compact Base64 with our{" "}
          <Link href="/tools/uuid-to-base64">UUID ↔ Base64</Link> tool, or read the
          <Link href="/blog/uuid-vs-nanoid"> UUID vs NanoID vs ULID</Link> guide
          for picking the right ID format.
        </p>
      </section>

      <section className="features" aria-label="Features">
        {[
          { icon: <KeyRound size={24} />, title: "v4 and v7",       desc: "RFC-standard random and time-ordered UUIDs, with nil as a sentinel option." },
          { icon: <Shuffle size={24} />,  title: "Batch up to 1000", desc: "Generate large batches in one click for seed data, tests, and migrations." },
          { icon: <Zap size={24} />,      title: "CSPRNG",            desc: "Powered by crypto.getRandomValues — same primitive used for TLS keys." },
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
