"use client";

import { Search, Zap, Lock } from "lucide-react";
import Link from "next/link";

import "@/style/main.css";

export default function RegexCheatsheet() {
  return (
    <>
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-eyebrow">
          <div className="hero-dot" aria-hidden="true" />
          Reference · Regex · Cheatsheet
        </div>
        <h1 id="hero-heading">
          JavaScript Regex <em>Cheatsheet</em>
        </h1>
        <p>
          The patterns you reach for most — character classes, anchors, flags,
          lookarounds, and common recipes. Keep this tab open next to your editor.
        </p>
      </section>

      <section className="seo-content" aria-labelledby="about-heading">
        <h2 id="about-heading">Core Syntax</h2>

        <h3>Character Classes</h3>
        <ul>
          <li><code>.</code> any character except newline (or any with <code>s</code> flag)</li>
          <li><code>\d</code> digit, <code>\D</code> non-digit</li>
          <li><code>\w</code> word character, <code>\W</code> non-word</li>
          <li><code>\s</code> whitespace, <code>\S</code> non-whitespace</li>
          <li><code>[abc]</code> any of a, b, c · <code>[^abc]</code> none of them · <code>[a-z]</code> range</li>
        </ul>

        <h3>Quantifiers</h3>
        <ul>
          <li><code>*</code> zero or more · <code>+</code> one or more · <code>?</code> optional</li>
          <li><code>{"{n}"}</code> exactly n · <code>{"{n,}"}</code> n or more · <code>{"{n,m}"}</code> between n and m</li>
          <li>Add <code>?</code> for lazy matching: <code>.*?</code> smallest match</li>
        </ul>

        <h3>Anchors</h3>
        <ul>
          <li><code>^</code> start of input (or line with <code>m</code> flag)</li>
          <li><code>$</code> end of input (or line with <code>m</code> flag)</li>
          <li><code>\b</code> word boundary · <code>\B</code> non-boundary</li>
        </ul>

        <h3>Groups</h3>
        <ul>
          <li><code>(abc)</code> capturing group</li>
          <li><code>(?:abc)</code> non-capturing group</li>
          <li><code>(?&lt;name&gt;abc)</code> named group</li>
          <li><code>\1</code> backreference · <code>$1</code>, <code>$&lt;name&gt;</code> in replacement</li>
        </ul>

        <h3>Lookarounds</h3>
        <ul>
          <li><code>(?=abc)</code> positive lookahead</li>
          <li><code>(?!abc)</code> negative lookahead</li>
          <li><code>(?&lt;=abc)</code> positive lookbehind</li>
          <li><code>(?&lt;!abc)</code> negative lookbehind</li>
        </ul>

        <h3>Flags</h3>
        <ul>
          <li><code>g</code> global · <code>i</code> case-insensitive · <code>m</code> multiline</li>
          <li><code>s</code> dot matches newline · <code>u</code> Unicode · <code>y</code> sticky</li>
        </ul>

        <h2>Common Recipes</h2>

        <h3>Email (loose)</h3>
        <pre className="output-pre" style={{ minHeight: "unset", padding: "16px 20px" }}>
          <code>{String.raw`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`}</code>
        </pre>

        <h3>UUID v4</h3>
        <pre className="output-pre" style={{ minHeight: "unset", padding: "16px 20px" }}>
          <code>{String.raw`/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i`}</code>
        </pre>

        <h3>ISO date (YYYY-MM-DD)</h3>
        <pre className="output-pre" style={{ minHeight: "unset", padding: "16px 20px" }}>
          <code>{String.raw`/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/`}</code>
        </pre>

        <h3>Slug (URL fragment)</h3>
        <pre className="output-pre" style={{ minHeight: "unset", padding: "16px 20px" }}>
          <code>{String.raw`/^[a-z0-9]+(?:-[a-z0-9]+)*$/`}</code>
        </pre>

        <h3>HEX color</h3>
        <pre className="output-pre" style={{ minHeight: "unset", padding: "16px 20px" }}>
          <code>{String.raw`/^#(?:[0-9a-f]{3}){1,2}$/i`}</code>
        </pre>

        <h3>Try It</h3>
        <p>
          Test any of these patterns in our free{" "}
          <Link href="/tools/regex-tester">Regex Tester</Link> with live match
          highlighting and capture-group inspection.
        </p>
      </section>

      <section className="features" aria-label="Takeaways">
        {[
          { icon: <Zap size={24} />,  title: "Fail fast",       desc: "Anchor patterns with ^ and $ when you need a full-string match." },
          { icon: <Search size={24} />, title: "Name your groups", desc: "Named groups beat $1/$2 for anything you'll re-read later." },
          { icon: <Lock size={24} />, title: "Validate at the edge", desc: "Regex is for shape, not business rules — parse, don't validate." },
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
