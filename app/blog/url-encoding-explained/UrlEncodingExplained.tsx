"use client";

import { Link2, Globe, AlertTriangle } from "lucide-react";
import Link from "next/link";

import "@/style/main.css";

const PLAIN = `https://example.com/search?q=hello world&tag=café`;
const ENCODED_COMPONENT = `https%3A%2F%2Fexample.com%2Fsearch%3Fq%3Dhello%20world%26tag%3Dcaf%C3%A9`;
const ENCODED_URI = `https://example.com/search?q=hello%20world&tag=caf%C3%A9`;

export default function UrlEncodingExplained() {
  return (
    <>
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-eyebrow">
          <div className="hero-dot" aria-hidden="true" />
          URLs · Encoding · Deep dive
        </div>
        <h1 id="hero-heading">
          URL Encoding <em>Explained</em>
        </h1>
        <p>
          Three encode modes, one bytes-to-characters rule, and a surprising number
          of ways to break URLs. Here is the full picture.
        </p>
      </section>

      <section aria-label="Example">
        <div className="converter">
          <div className="panel">
            <div className="panel-header">
              <div className="panel-title">
                <div className="dot json" aria-hidden="true" />
                encodeURIComponent (aggressive)
              </div>
            </div>
            <pre className="output-pre" style={{ wordBreak: "break-all", whiteSpace: "pre-wrap" }}>
              {`${PLAIN}\n→\n${ENCODED_COMPONENT}`}
            </pre>
          </div>
          <div className="panel">
            <div className="panel-header">
              <div className="panel-title">
                <div className="dot yaml" aria-hidden="true" />
                encodeURI (preserves structure)
              </div>
            </div>
            <pre className="output-pre" style={{ wordBreak: "break-all", whiteSpace: "pre-wrap" }}>
              {`${PLAIN}\n→\n${ENCODED_URI}`}
            </pre>
          </div>
        </div>
      </section>

      <section className="seo-content" aria-labelledby="about-heading">
        <h2 id="about-heading">The Core Rule</h2>
        <p>
          URL characters are limited to <code>A–Z a–z 0–9</code> plus a handful of
          symbols. Anything else must be <strong>percent-encoded</strong>: each
          byte of the UTF-8 representation becomes <code>%XX</code>, where XX is
          the hex value of the byte.
        </p>

        <h3>Three Encode Modes in JavaScript</h3>
        <ul>
          <li>
            <code>encodeURIComponent</code> — encodes everything except
            <code> A–Z a–z 0–9 - _ . ! ~ * ' ( )</code>. Use this for query values
            and path segments.
          </li>
          <li>
            <code>encodeURI</code> — leaves URL-structural characters alone
            (<code>:/?#[]@!$&amp;'()*+,;=</code>). Use for whole URL strings where
            you want to keep the scheme, host, and separators intact.
          </li>
          <li>
            <code>form-urlencoded</code> — like <code>encodeURIComponent</code> but
            spaces become <code>+</code>. HTML form submissions use this.
          </li>
        </ul>

        <h3>Reserved vs Unreserved (RFC 3986)</h3>
        <p>
          Unreserved characters never need encoding. Reserved characters
          (<code>: / ? # [ ] @ ! $ &amp; ' ( ) * + , ; =</code>) have special
          meaning in the URL grammar and <em>must</em> be encoded when used
          literally in a value.
        </p>

        <h3>Common Mistakes</h3>
        <ul>
          <li><strong>Double-encoding:</strong> encoding an already-encoded string turns <code>%20</code> into <code>%2520</code></li>
          <li><strong>Using <code>encodeURI</code> on a query value:</strong> <code>&amp;</code> and <code>=</code> leak through and break parsing</li>
          <li><strong>Forgetting UTF-8:</strong> non-ASCII must be encoded as UTF-8 bytes, not Latin-1</li>
          <li><strong>Mixing <code>+</code> and <code>%20</code>:</strong> query strings accept both for spaces; be consistent</li>
        </ul>

        <h3>Try It</h3>
        <p>
          Encode or decode any string in your browser with our free{" "}
          <Link href="/tools/url-encode">URL Encoder</Link> and{" "}
          <Link href="/tools/url-decode">URL Decoder</Link>.
        </p>
      </section>

      <section className="features" aria-label="Takeaways">
        {[
          { icon: <Link2 size={24} />, title: "Encode values, not URLs", desc: "Use encodeURIComponent for query values; encodeURI for whole URLs." },
          { icon: <Globe size={24} />, title: "Always UTF-8",            desc: "Non-ASCII goes in as UTF-8 bytes before percent-encoding." },
          { icon: <AlertTriangle size={24} />, title: "Encode once",      desc: "Double-encoding is a top-10 production bug source." },
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
