"use client";

import { Layers, Lock, AlertTriangle } from "lucide-react";
import Link from "next/link";

import "@/style/main.css";

const PLAIN = `Hello, World!`;
const ENCODED = `SGVsbG8sIFdvcmxkIQ==`;

export default function Base64Explained() {
  return (
    <>
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-eyebrow">
          <div className="hero-dot" aria-hidden="true" />
          Encoding · Explainer · Guide
        </div>
        <h1 id="hero-heading">
          Base64 <em>Explained</em>
        </h1>
        <p>
          Base64 is one of the most frequently misused tools in a developer's belt.
          It is <em>encoding</em>, not <em>encryption</em> — and that distinction matters.
        </p>
      </section>

      <section aria-label="Example">
        <div className="converter">
          <div className="panel">
            <div className="panel-header">
              <div className="panel-title">
                <div className="dot json" aria-hidden="true" />
                Plain text
              </div>
            </div>
            <pre className="output-pre">{PLAIN}</pre>
          </div>
          <div className="panel">
            <div className="panel-header">
              <div className="panel-title">
                <div className="dot yaml" aria-hidden="true" />
                Base64
              </div>
            </div>
            <pre className="output-pre">{ENCODED}</pre>
          </div>
        </div>
      </section>

      <section className="seo-content" aria-labelledby="about-heading">
        <h2 id="about-heading">What Base64 Really Is</h2>
        <p>
          Base64 is a scheme for representing arbitrary binary data using only 64 printable
          ASCII characters: <code>A–Z</code>, <code>a–z</code>, <code>0–9</code>,
          <code> + </code>, and <code>/</code>, with <code>=</code> as padding. Three bytes
          of input become four characters of output — a 33% size increase.
        </p>

        <h3>Why It Exists</h3>
        <p>
          Many protocols originally allowed only 7-bit ASCII: SMTP, early HTTP headers,
          URL paths. If you need to carry a PNG, a key, or a JWT through such a channel,
          you need a text-safe representation. Base64 is that representation.
        </p>

        <h3>Standard vs URL-Safe</h3>
        <p>
          Standard Base64 (RFC 4648 §4) uses <code>+</code> and <code>/</code>. In URLs
          and filenames these characters have special meanings, so URL-safe Base64
          (§5) swaps them for <code>-</code> and <code>_</code> and often drops padding.
          JWTs use URL-safe Base64 for exactly this reason.
        </p>

        <h3>Legitimate Uses</h3>
        <ul>
          <li><strong>Data URIs:</strong> inline images in CSS/HTML</li>
          <li><strong>JWT:</strong> header and payload segments are URL-safe Base64</li>
          <li><strong>HTTP Basic Auth:</strong> <code>username:password</code> encoded</li>
          <li><strong>Email attachments (MIME):</strong> binary parts of emails</li>
          <li><strong>Binary in JSON:</strong> small blobs embedded in text payloads</li>
        </ul>

        <h3>Common Mistakes</h3>
        <p>
          <strong>Base64 is not encryption.</strong> Anyone can decode it with one line of
          code. Never use it to "hide" secrets. Don't Base64-encode a password hash and
          think you've added security — you haven't. If data must be confidential, encrypt
          it; if data must be authenticated, sign it.
        </p>
        <p>
          <strong>Beware of size inflation.</strong> A 10 MB PDF becomes a ~13.3 MB
          Base64 string. For large payloads, prefer binary channels (multipart uploads,
          gRPC, raw WebSocket frames).
        </p>

        <h3>Try It</h3>
        <p>
          Encode and decode strings in your browser with our free{" "}
          <Link href="/tools/string-to-base64">String ↔ Base64 converter</Link>, or
          decode JWT tokens with the{" "}
          <Link href="/tools/jwt-decoder">JWT Decoder</Link>.
        </p>
      </section>

      <section className="features" aria-label="Takeaways">
        {[
          { icon: <Layers size={24} />, title: "Transport, not security", desc: "Base64 is a text-safe wrapper for binary data." },
          { icon: <Lock size={24} />, title: "Not encryption",             desc: "Trivially reversible — use real crypto for secrets." },
          { icon: <AlertTriangle size={24} />, title: "33% bigger",         desc: "Avoid for large payloads; prefer binary transport." },
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
