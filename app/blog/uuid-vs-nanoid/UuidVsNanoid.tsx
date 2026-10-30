"use client";

import { KeyRound, Database, Clock } from "lucide-react";
import Link from "next/link";

import "@/style/main.css";

const UUID_V4 = `550e8400-e29b-41d4-a716-446655440000`;
const UUID_V7 = `0192f8c1-9c88-7f3a-9e7e-45b1a8c7d0d1`;
const NANOID  = `V1StGXR8_Z5jdHi6B-myT`;
const ULID    = `01HN2PX7JGK5R2YQ9VQAHZX6EK`;

export default function UuidVsNanoid() {
  return (
    <>
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-eyebrow">
          <div className="hero-dot" aria-hidden="true" />
          Identifiers · Comparison · Guide
        </div>
        <h1 id="hero-heading">
          UUID <em>vs</em> NanoID <em>vs</em> ULID
        </h1>
        <p>
          Four flavors of unique ID, four different tradeoffs. Pick the one that
          matches your indexing, URL, and sort requirements.
        </p>
      </section>

      <section aria-label="Example">
        <div className="converter">
          <div className="panel">
            <div className="panel-header">
              <div className="panel-title">
                <div className="dot json" aria-hidden="true" />
                UUID v4 / v7
              </div>
            </div>
            <pre className="output-pre" style={{ wordBreak: "break-all" }}>
              {`${UUID_V4}\n${UUID_V7}`}
            </pre>
          </div>
          <div className="panel">
            <div className="panel-header">
              <div className="panel-title">
                <div className="dot yaml" aria-hidden="true" />
                NanoID / ULID
              </div>
            </div>
            <pre className="output-pre" style={{ wordBreak: "break-all" }}>
              {`${NANOID}\n${ULID}`}
            </pre>
          </div>
        </div>
      </section>

      <section className="seo-content" aria-labelledby="about-heading">
        <h2 id="about-heading">Four Flavors of Unique ID</h2>

        <h3>UUID v4 (random)</h3>
        <p>
          122 bits of randomness, 36-character string. Ubiquitous, well-supported in
          every language and database. Downsides: non-sortable, large (16 bytes
          binary / 36 bytes string), and fragments B-tree indexes because random
          values scatter inserts across pages.
        </p>

        <h3>UUID v7 (time-ordered)</h3>
        <p>
          Combines a millisecond timestamp with randomness in a UUID-compatible
          layout. Monotonically increasing within the same millisecond, so inserts
          cluster at the end of the index — kinder to Postgres and MySQL B-trees than
          v4. Standardized in RFC 9562 (2024).
        </p>

        <h3>NanoID</h3>
        <p>
          21-character URL-safe string, 126 bits of entropy — about the same
          collision resistance as UUID v4 in less space. Great for public URLs
          (shorter than UUID) but non-sortable like v4.
        </p>

        <h3>ULID</h3>
        <p>
          26-character Crockford Base32 string with a 48-bit millisecond timestamp
          prefix and 80 random bits. Lexicographically sortable, URL-safe, slightly
          shorter than UUID. Great for logs and event IDs.
        </p>

        <h3>Which to Pick</h3>
        <ul>
          <li><strong>Primary keys in a RDBMS:</strong> UUID v7 (or ULID stored as 16-byte binary)</li>
          <li><strong>Public URLs:</strong> NanoID (short) or ULID (sortable)</li>
          <li><strong>Legacy compatibility:</strong> UUID v4 — everyone speaks it</li>
          <li><strong>Distributed logs / events:</strong> ULID or UUID v7</li>
          <li><strong>Short share codes:</strong> NanoID with a custom alphabet and length</li>
        </ul>

        <h3>Try It</h3>
        <p>
          Encode or decode a UUID to compact Base64 with our free{" "}
          <Link href="/tools/uuid-to-base64">UUID ↔ Base64 converter</Link>.
        </p>
      </section>

      <section className="features" aria-label="Takeaways">
        {[
          { icon: <Database size={24} />, title: "Index locality",      desc: "Time-ordered IDs (v7, ULID) are kinder to B-tree indexes." },
          { icon: <KeyRound size={24} />, title: "Collision odds tiny", desc: "All four have >120 bits of entropy — collisions are effectively impossible." },
          { icon: <Clock size={24} />,   title: "Sortability",          desc: "ULID and UUID v7 sort by creation time out of the box." },
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
