"use client";

import { Shield, Code2, AlertTriangle } from "lucide-react";
import Link from "next/link";

import "@/style/main.css";

const UNSAFE = `<div>Hello, ${"${name}"}!</div>`;
const SAFE   = `<div>Hello, ${"${encodeHtml(name)}"}!</div>`;

export default function HtmlEntitiesXss() {
  return (
    <>
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-eyebrow">
          <div className="hero-dot" aria-hidden="true" />
          Security · XSS · Guide
        </div>
        <h1 id="hero-heading">
          HTML Entities <em>&amp;</em> XSS
        </h1>
        <p>
          HTML entity encoding is the single most effective defense against XSS in
          HTML contexts — but only if you use it in the right place. Here is how
          to think about escaping by context.
        </p>
      </section>

      <section aria-label="Example">
        <div className="converter">
          <div className="panel">
            <div className="panel-header">
              <div className="panel-title">
                <div className="dot json" aria-hidden="true" />
                Unsafe (<code>name</code> comes from user input)
              </div>
            </div>
            <pre className="output-pre">{UNSAFE}</pre>
          </div>
          <div className="panel">
            <div className="panel-header">
              <div className="panel-title">
                <div className="dot yaml" aria-hidden="true" />
                Safe (entity-encoded)
              </div>
            </div>
            <pre className="output-pre">{SAFE}</pre>
          </div>
        </div>
      </section>

      <section className="seo-content" aria-labelledby="about-heading">
        <h2 id="about-heading">What XSS Really Is</h2>
        <p>
          Cross-site scripting happens when an attacker's text ends up executed as
          code in another user's browser. The usual vehicle is HTML:
          <code>{`<script>fetch('/steal?c=' + document.cookie)</script>`}</code>
          inserted into a comment or a profile field, rendered by a server that
          forgot to escape it.
        </p>

        <h3>Entity Encoding Breaks the Vehicle</h3>
        <p>
          Replacing <code>&lt;</code> with <code>&amp;lt;</code>, <code>&gt;</code>{" "}
          with <code>&amp;gt;</code>, <code>&amp;</code> with <code>&amp;amp;</code>,
          and the two quote characters with <code>&amp;quot;</code> and
          <code> &amp;#39;</code> turns markup into literal text. The browser
          renders it, but never parses it as HTML — the attack becomes a visible
          string instead of a running script.
        </p>

        <h3>Context Matters More Than You Think</h3>
        <p>
          HTML entities protect only HTML text and most attribute values. Different
          contexts need different escaping:
        </p>
        <ul>
          <li><strong>HTML body / text</strong> — HTML entity encode (<code>&lt; &gt; &amp; " '</code>)</li>
          <li><strong>HTML attribute (quoted)</strong> — HTML entity encode; always quote your attributes</li>
          <li><strong>URL in href / src</strong> — URL-encode the value <em>and</em> validate the scheme (block <code>javascript:</code>)</li>
          <li><strong>Inside <code>&lt;script&gt;</code></strong> — JavaScript string escape (<code>\u00XX</code>) or render data as JSON</li>
          <li><strong>Inline CSS</strong> — allow a strict whitelist only; never substitute untrusted strings</li>
          <li><strong>Inside <code>&lt;style&gt;</code></strong> — same as inline CSS; prefer separate stylesheets</li>
        </ul>

        <h3>Templates Already Do This — Mostly</h3>
        <p>
          React, Vue, Svelte, Angular, Handlebars, Jinja2 (with autoescape),
          Mustache (<code>{"{{name}}"}</code>), and ERB (<code>&lt;%= h name %&gt;</code>)
          all HTML-escape text interpolations by default. The holes are:
        </p>
        <ul>
          <li>React's <code>dangerouslySetInnerHTML</code>, Vue's <code>v-html</code>, Svelte's <code>{"{@html}"}</code></li>
          <li>Writing to <code>element.innerHTML</code> directly in JavaScript</li>
          <li>Attribute values interpolated without quoting</li>
          <li><code>href=&quot;{"${url}"}&quot;</code> without scheme validation (allows <code>javascript:</code>)</li>
          <li>Templates that <em>disable</em> autoescape (don't)</li>
        </ul>

        <h3>Content Security Policy Buys You Depth</h3>
        <p>
          Even with perfect escaping, a strict CSP (<code>script-src 'self'</code>,
          no <code>'unsafe-inline'</code>) limits the damage from any bug that
          slips through. Think of entity encoding as the fence and CSP as the
          moat; use both.
        </p>

        <h3>Common Mistakes</h3>
        <ul>
          <li>Encoding on <strong>input</strong> instead of on <strong>output</strong> — same string ends up in HTML, JSON, logs, and the DB, all with different escaping needs</li>
          <li>Double-encoding — the browser already decodes once, so <code>&amp;amp;amp;</code> renders as <code>&amp;amp;</code> instead of <code>&amp;</code></li>
          <li>Trusting a sanitizer to strip "bad" tags; keep an allowlist, don't guess what is bad</li>
          <li>Thinking Base64 is encoding for safety — it isn't. See <Link href="/blog/base64-explained">Base64 explained</Link>.</li>
        </ul>

        <h3>Try It</h3>
        <p>
          Encode or decode HTML entities instantly with our free{" "}
          <Link href="/tools/html-entity-encoder">HTML Entity Encoder</Link>.
          For URLs, use the <Link href="/tools/url-encode">URL Encoder</Link>.
        </p>
      </section>

      <section className="features" aria-label="Takeaways">
        {[
          { icon: <Shield size={24} />,       title: "Encode on output",       desc: "Not on input — same string lives in HTML, JSON, logs with different needs." },
          { icon: <Code2 size={24} />,        title: "Context-specific",       desc: "HTML, attribute, URL, JS, CSS all need different escaping." },
          { icon: <AlertTriangle size={24} />, title: "CSP as depth",           desc: "Strict Content-Security-Policy limits any slip-ups." },
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
