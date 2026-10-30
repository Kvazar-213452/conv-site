"use client";

import { FileText, Code2, Table2 } from "lucide-react";
import Link from "next/link";

import "@/style/main.css";

const MD_SOURCE = `# Heading 1
## Heading 2

Paragraph with **bold**, *italic*, and \`inline code\`.

- Bullet one
- Bullet two
  - Nested

1. First
2. Second

[Link text](https://example.com)
![Alt text](/img.png)

> Blockquote line

\`\`\`ts
const x: number = 42;
\`\`\`

| Col A | Col B |
|-------|-------|
| 1     | 2     |`;

export default function MarkdownGuide() {
  return (
    <>
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-eyebrow">
          <div className="hero-dot" aria-hidden="true" />
          Reference · Markdown · CommonMark
        </div>
        <h1 id="hero-heading">
          Markdown <em>Guide</em>
        </h1>
        <p>
          The complete syntax you need day to day — CommonMark plus the GitHub
          Flavored Markdown extras everyone treats as standard.
        </p>
      </section>

      <section aria-label="Full example">
        <div className="converter" style={{ gridTemplateColumns: "1fr" }}>
          <div className="panel">
            <div className="panel-header">
              <div className="panel-title">
                <div className="dot json" aria-hidden="true" />
                Markdown source
              </div>
            </div>
            <pre className="output-pre">{MD_SOURCE}</pre>
          </div>
        </div>
      </section>

      <section className="seo-content" aria-labelledby="about-heading">
        <h2 id="about-heading">Core Syntax</h2>

        <h3>Headings</h3>
        <p>
          Use <code>#</code> through <code>######</code> for H1–H6. Leave a blank
          line before and after each heading. Avoid skipping levels (H1 → H3) for
          accessibility.
        </p>

        <h3>Emphasis</h3>
        <ul>
          <li><code>*italic*</code> or <code>_italic_</code> → <em>italic</em></li>
          <li><code>**bold**</code> → <strong>bold</strong></li>
          <li><code>***both***</code> → <strong><em>both</em></strong></li>
          <li>GFM: <code>~~strike~~</code> → <del>strike</del></li>
        </ul>

        <h3>Lists</h3>
        <p>
          Unordered lists use <code>-</code>, <code>*</code>, or <code>+</code>.
          Ordered lists use any number followed by <code>.</code>. Nest with two
          spaces of indentation (four if your renderer is strict).
        </p>

        <h3>Links and Images</h3>
        <ul>
          <li><code>[text](url)</code> — inline link</li>
          <li><code>[text](url "title")</code> — link with hover title</li>
          <li><code>![alt](url)</code> — inline image</li>
          <li>Reference style: <code>[text][id]</code> then <code>[id]: url</code> at the bottom</li>
        </ul>

        <h3>Code</h3>
        <p>
          Backticks for inline <code>`code`</code>. Fenced blocks use three
          backticks with an optional language tag for syntax highlighting.
        </p>

        <h3>Tables (GFM)</h3>
        <p>
          Pipes separate cells; a divider row sets alignment:{" "}
          <code>:---</code> left, <code>:---:</code> center, <code>---:</code> right.
        </p>

        <h3>Common Pitfalls</h3>
        <ul>
          <li><strong>Hard line breaks</strong> require two trailing spaces or a blank line</li>
          <li><strong>HTML inside Markdown</strong> works, but mixing can confuse strict parsers</li>
          <li><strong>Underscores inside words</strong> may be interpreted as emphasis — use backticks for identifiers</li>
          <li><strong>Tables in CommonMark</strong> are a GFM extension, not core</li>
        </ul>

        <h3>Try It</h3>
        <p>
          Render Markdown to HTML in your browser with our free{" "}
          <Link href="/tools/markdown-to-html">Markdown ↔ HTML converter</Link>.
        </p>
      </section>

      <section className="features" aria-label="Takeaways">
        {[
          { icon: <FileText size={24} />, title: "CommonMark baseline", desc: "If it works in CommonMark, it works everywhere." },
          { icon: <Code2 size={24} />,   title: "Fenced code",         desc: "Prefer ``` with a language tag over indented blocks." },
          { icon: <Table2 size={24} />,  title: "GFM for tables",      desc: "Pipes and dashes — just make sure your renderer supports GFM." },
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
