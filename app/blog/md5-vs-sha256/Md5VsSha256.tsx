"use client";

import { ShieldCheck, AlertTriangle, Zap } from "lucide-react";
import Link from "next/link";

import "@/style/main.css";

const SAMPLE = `The quick brown fox jumps over the lazy dog`;
const MD5    = `9e107d9d372bb6826bd81d3542a419d6`;
const SHA256 = `d7a8fbb307d7809469ca9abcb0082e4f8d5651e46d3cdb762d02d0bf37c9e592`;

export default function Md5VsSha256() {
  return (
    <>
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-eyebrow">
          <div className="hero-dot" aria-hidden="true" />
          Crypto · Comparison · Guide
        </div>
        <h1 id="hero-heading">
          MD5 <em>vs</em> SHA-256
        </h1>
        <p>
          Both produce a short fingerprint of arbitrary data. One is still safe for
          security-sensitive work; the other has been broken for over a decade.
        </p>
      </section>

      <section aria-label="Example">
        <div className="converter">
          <div className="panel">
            <div className="panel-header">
              <div className="panel-title">
                <div className="dot json" aria-hidden="true" />
                MD5 of “{SAMPLE}”
              </div>
            </div>
            <pre className="output-pre" style={{ wordBreak: "break-all", whiteSpace: "pre-wrap" }}>{MD5}</pre>
          </div>
          <div className="panel">
            <div className="panel-header">
              <div className="panel-title">
                <div className="dot yaml" aria-hidden="true" />
                SHA-256 of “{SAMPLE}”
              </div>
            </div>
            <pre className="output-pre" style={{ wordBreak: "break-all", whiteSpace: "pre-wrap" }}>{SHA256}</pre>
          </div>
        </div>
      </section>

      <section className="seo-content" aria-labelledby="about-heading">
        <h2 id="about-heading">What a Hash Does</h2>
        <p>
          A cryptographic hash collapses arbitrary input into a fixed-size fingerprint.
          For a good hash, you cannot deduce the input from the digest, and you cannot
          find two inputs that produce the same digest (collision resistance).
        </p>

        <h3>MD5 (128 bits)</h3>
        <p>
          MD5 is <strong>cryptographically broken</strong>. Practical collisions have
          been demonstrated since 2004, including chosen-prefix attacks against real
          X.509 certificates. Treat MD5 as a non-adversarial checksum only — fine for
          deduplication or caching keys, never for security.
        </p>

        <h3>SHA-1 (160 bits)</h3>
        <p>
          Also broken. The SHAttered attack (2017) produced the first public SHA-1
          collision. Browsers no longer accept SHA-1 certificates. Avoid for new
          systems; migrate legacy uses where feasible.
        </p>

        <h3>SHA-256 and SHA-512 (SHA-2)</h3>
        <p>
          Still considered secure against collision and preimage attacks. SHA-256 is
          ubiquitous in TLS, Bitcoin, Git (as of SHA-256 support), code signing, and
          package integrity. SHA-512 produces a larger digest and is often faster on
          64-bit CPUs.
        </p>

        <h3>What You Should Use</h3>
        <ul>
          <li><strong>Download checksums:</strong> SHA-256 (never MD5)</li>
          <li><strong>Git-style content IDs:</strong> SHA-256 for new systems</li>
          <li><strong>HMAC / signatures:</strong> SHA-256 or SHA-512</li>
          <li><strong>Password storage:</strong> none of the above — use Argon2, bcrypt, or scrypt</li>
          <li><strong>Non-security dedup:</strong> MD5 or xxHash are fine</li>
        </ul>

        <h3>Try It</h3>
        <p>
          Compute MD5 and the full SHA family of any string with our free{" "}
          <Link href="/tools/hash-generator">Hash Generator</Link>.
        </p>
      </section>

      <section className="features" aria-label="Takeaways">
        {[
          { icon: <AlertTriangle size={24} />, title: "MD5 is broken",      desc: "Only safe for non-adversarial checksums." },
          { icon: <ShieldCheck size={24} />,   title: "SHA-256 is the baseline", desc: "Default for integrity and signatures today." },
          { icon: <Zap size={24} />,           title: "Passwords need KDFs",     desc: "Use Argon2 / bcrypt / scrypt, never a plain hash." },
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
