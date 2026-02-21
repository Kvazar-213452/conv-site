"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { Eye, Code, FileText, Maximize2, Zap } from "lucide-react";

import "@/app/css/main.css";
import "./main.css";

// ── Types ──────────────────────────────────────────────────────
type OutputTab = "preview" | "html";

// ── Markdown → HTML parser ─────────────────────────────────────
function parseMarkdown(md: string): string {
  let html = md;
  const codeBlocks: string[] = [];
  html = html.replace(/```([\w]*)\n?([\s\S]*?)```/g, (_, lang, code) => {
    const escaped = code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const idx = codeBlocks.length;
    codeBlocks.push(`<pre><code class="language-${lang || "plaintext"}">${escaped.trimEnd()}</code></pre>`);
    return `\x00CODE${idx}\x00`;
  });
  const inlineCodes: string[] = [];
  html = html.replace(/`([^`]+)`/g, (_, code) => {
    const escaped = code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const idx = inlineCodes.length;
    inlineCodes.push(`<code>${escaped}</code>`);
    return `\x00INLINE${idx}\x00`;
  });
  html = html.replace(/^###### (.+)$/gm, "<h6>$1</h6>");
  html = html.replace(/^##### (.+)$/gm,  "<h5>$1</h5>");
  html = html.replace(/^#### (.+)$/gm,   "<h4>$1</h4>");
  html = html.replace(/^### (.+)$/gm,    "<h3>$1</h3>");
  html = html.replace(/^## (.+)$/gm,     "<h2>$1</h2>");
  html = html.replace(/^# (.+)$/gm,      "<h1>$1</h1>");
  html = html.replace(/^(?:---|\*\*\*|___)\s*$/gm, "<hr>");
  html = html.replace(/^> (.+)$/gm, "<blockquote>$1</blockquote>");
  html = html.replace(/^(?:[-*+] .+\n?)+/gm, (block) => {
    const items = block.trim().split("\n").map((l) => `  <li>${l.replace(/^[-*+] /, "")}</li>`).join("\n");
    return `<ul>\n${items}\n</ul>`;
  });
  html = html.replace(/^(?:\d+\. .+\n?)+/gm, (block) => {
    const items = block.trim().split("\n").map((l) => `  <li>${l.replace(/^\d+\. /, "")}</li>`).join("\n");
    return `<ol>\n${items}\n</ol>`;
  });
  html = html.replace(/(?:^.+\|.+\n)+/gm, (block) => {
    const lines = block.trim().split("\n").filter((l) => !/^[-| :]+$/.test(l.trim()));
    if (lines.length < 1) return block;
    const [header, ...rows] = lines;
    const th = header.split("|").filter(Boolean).map((c) => `    <th>${c.trim()}</th>`).join("\n");
    const trs = rows.map((row) => {
      const tds = row.split("|").filter(Boolean).map((c) => `      <td>${c.trim()}</td>`).join("\n");
      return `  <tr>\n${tds}\n  </tr>`;
    }).join("\n");
    return `<table>\n  <thead>\n  <tr>\n${th}\n  </tr>\n  </thead>\n  <tbody>\n${trs}\n  </tbody>\n</table>`;
  });
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>");
  html = html.replace(/\*\*(.+?)\*\*/g,     "<strong>$1</strong>");
  html = html.replace(/__(.+?)__/g,          "<strong>$1</strong>");
  html = html.replace(/\*(.+?)\*/g,          "<em>$1</em>");
  html = html.replace(/_(.+?)_/g,            "<em>$1</em>");
  html = html.replace(/~~(.+?)~~/g,          "<del>$1</del>");
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img alt="$1" src="$2">');
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g,  '<a href="$2" target="_blank" rel="noopener">$1</a>');
  html = html
    .split(/\n{2,}/)
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return "";
      if (/^<(h[1-6]|ul|ol|pre|blockquote|hr|table|p)/i.test(trimmed)) return trimmed;
      if (trimmed.startsWith("\x00CODE")) return trimmed;
      return `<p>${trimmed.replace(/\n/g, "<br>")}</p>`;
    })
    .filter(Boolean)
    .join("\n\n");
  inlineCodes.forEach((code, i) => { html = html.replace(`\x00INLINE${i}\x00`, code); });
  codeBlocks.forEach((block, i)  => { html = html.replace(`\x00CODE${i}\x00`,  block); });
  return html;
}

// ── Inline Markdown highlighter ────────────────────────────────
function applyInline(s: string): string {
  const codes: string[] = [];
  s = s.replace(/`([^`]+)`/g, (_, c) => {
    const idx = codes.length;
    codes.push(`<span class="hl-inline-code">\`${c}\`</span>`);
    return `\x00IC${idx}\x00`;
  });
  s = s.replace(/(\*\*\*)(.*?)\1/g,  '<span class="hl-bold-italic">$1$2$1</span>');
  s = s.replace(/(\*\*)(.*?)\1/g,    '<span class="hl-bold">$1$2$1</span>');
  s = s.replace(/(__)(.*?)\1/g,      '<span class="hl-bold">$1$2$1</span>');
  s = s.replace(/(\*)(.*?)\1/g,      '<span class="hl-italic">$1$2$1</span>');
  s = s.replace(/(~~)(.*?)\1/g,      '<span class="hl-strike">$1$2$1</span>');
  s = s.replace(/!\[([^\]]*)\]\(([^)]+)\)/g,
    '<span class="hl-image"><span class="hl-punct">![</span>$1<span class="hl-punct">](</span><span class="hl-url">$2</span><span class="hl-punct">)</span></span>');
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g,
    '<span class="hl-link"><span class="hl-punct">[</span>$1<span class="hl-punct">](</span><span class="hl-url">$2</span><span class="hl-punct">)</span></span>');
  codes.forEach((c, i) => { s = s.replace(`\x00IC${i}\x00`, c); });
  return s;
}

function highlightMarkdown(text: string): string {
  const lines = text.split("\n");
  let inCodeBlock = false;
  let codeLang = "";

  return lines.map((line) => {
    const esc = (s: string) =>
      s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    const fenceMatch = line.match(/^```([\w]*)$/);
    if (fenceMatch) {
      if (!inCodeBlock) {
        inCodeBlock = true;
        codeLang = fenceMatch[1];
        return `<span class="hl-fence">\`\`\`${esc(codeLang)}</span>`;
      } else {
        inCodeBlock = false;
        codeLang = "";
        return `<span class="hl-fence">\`\`\`</span>`;
      }
    }
    if (inCodeBlock) return `<span class="hl-code-line">${esc(line)}</span>`;

    const e = esc(line);

    // Headings
    const hMatch = line.match(/^(#{1,6}) (.+)$/);
    if (hMatch) {
      const lvl = hMatch[1].length;
      return `<span class="hl-h hl-h${lvl}"><span class="hl-hpunct">${hMatch[1]} </span>${applyInline(esc(hMatch[2]))}</span>`;
    }
    if (/^(?:---|\*\*\*|___)\s*$/.test(line))
      return `<span class="hl-hr">${e}</span>`;
    if (/^> /.test(line))
      return `<span class="hl-blockquote"><span class="hl-bq-punct">&gt; </span>${applyInline(esc(line.slice(2)))}</span>`;
    if (/^[-*+] /.test(line))
      return `<span class="hl-li"><span class="hl-li-punct">${e[0]} </span>${applyInline(esc(line.slice(2)))}</span>`;
    const olMatch = line.match(/^(\d+\.) (.+)$/);
    if (olMatch)
      return `<span class="hl-li"><span class="hl-li-punct">${esc(olMatch[1])} </span>${applyInline(esc(olMatch[2]))}</span>`;
    if (/^\|[-| :]+\|$/.test(line.trim()))
      return `<span class="hl-table-sep">${e}</span>`;
    if (line.includes("|") && (line.trim().startsWith("|") || line.includes(" | ")))
      return `<span class="hl-table">${applyInline(e)}</span>`;

    return applyInline(e) || "&ZeroWidthSpace;";
  }).join("\n");
}

// ── Syntax-highlighted Editor component ───────────────────────
function MarkdownEditor({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const textareaRef  = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const highlighted  = useMemo(() => highlightMarkdown(value), [value]);

  const syncScroll = () => {
    if (textareaRef.current && highlightRef.current) {
      highlightRef.current.scrollTop  = textareaRef.current.scrollTop;
      highlightRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const ta    = e.currentTarget;
      const start = ta.selectionStart;
      const end   = ta.selectionEnd;
      const next  = value.substring(0, start) + "  " + value.substring(end);
      onChange(next);
      requestAnimationFrame(() => { ta.selectionStart = ta.selectionEnd = start + 2; });
    }
  };

  return (
    <div className="md-editor-wrap">
      <div
        ref={highlightRef}
        className="md-highlight-layer"
        aria-hidden="true"
        dangerouslySetInnerHTML={{ __html: highlighted + "\n" }}
      />
      <textarea
        ref={textareaRef}
        className="md-editor-textarea"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onScroll={syncScroll}
        onKeyDown={handleKeyDown}
        spellCheck={false}
        autoCorrect="off"
        autoCapitalize="off"
        placeholder={"# Hello\n\nStart typing **Markdown** here…"}
        aria-label="Markdown input"
      />
    </div>
  );
}

// ── Example content ────────────────────────────────────────────
const EXAMPLE_MD = `# Hello, Markdown!

This is a **Markdown → HTML** converter with *live preview* and syntax highlighting.

## Features

- **Bold**, *italic*, ~~strikethrough~~
- \`inline code\` and fenced code blocks
- Links, images, tables, and more

## Code example

\`\`\`typescript
function greet(name: string): string {
  return \`Hello, \${name}!\`;
}
\`\`\`

## Table

| Name     | Type   | Description       |
|----------|--------|-------------------|
| input    | string | Markdown source   |
| output   | string | HTML result       |

> Blockquotes work too. Try editing this!

---

Visit [Anthropic](https://anthropic.com) for more.
`;

// ── Main component ─────────────────────────────────────────────
export default function MarkdownToHtml() {
  const [input, setInput]         = useState(EXAMPLE_MD);
  const [outputTab, setOutputTab] = useState<OutputTab>("preview");
  const [copied, setCopied]       = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [livePulse, setLivePulse] = useState(false);

  const html = useMemo(() => parseMarkdown(input), [input]);

  useEffect(() => {
    setLivePulse(true);
    const t = setTimeout(() => setLivePulse(false), 500);
    return () => clearTimeout(t);
  }, [html]);

  const copyHtml = () => {
    navigator.clipboard.writeText(html);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadHtml = () => {
    const full = `<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="UTF-8">\n<title>Document</title>\n</head>\n<body>\n${html}\n</body>\n</html>`;
    const blob = new Blob([full], { type: "text/html;charset=utf-8;" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = "output.html"; a.click();
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
          Markdown <em>→</em> HTML
          <br />Converter & Preview
        </h1>
        <p>
          Live Markdown editor with syntax highlighting and instant HTML preview.
          Supports headings, tables, code blocks, links, images, and more.
          Runs 100% in your browser.
        </p>
      </section>

      <section aria-label="Converter">
        <div className="converter">

          {/* ── Left: Syntax-highlighted editor ── */}
          <div className="panel">
            <div className="panel-header">
              <div className="panel-title">
                <div className="dot json" aria-hidden="true" />
                Markdown Editor
              </div>
              <div className="panel-actions">
                <span className="live-badge">
                  <Zap size={9} style={{ display: "inline", verticalAlign: "middle", marginRight: "3px" }} />
                  Live
                </span>
                <button className="btn-ghost" onClick={() => setInput(EXAMPLE_MD)}>Example</button>
                <button className="btn-ghost" onClick={() => setInput("")}>Clear</button>
              </div>
            </div>
            <MarkdownEditor value={input} onChange={setInput} />
          </div>

          {/* ── Right: Preview / HTML source ── */}
          <div className={`panel${html ? " has-output" : ""}`}>
            <div className="panel-header">
              <div className="panel-title" style={{ gap: 0 }}>
                <div className="output-tabs" role="tablist">
                  <button
                    role="tab" aria-selected={outputTab === "preview"}
                    className={`output-tab${outputTab === "preview" ? " active" : ""}`}
                    onClick={() => setOutputTab("preview")}
                  >
                    <Eye size={11} style={{ display: "inline", marginRight: "5px", verticalAlign: "middle" }} />
                    Preview
                  </button>
                  <button
                    role="tab" aria-selected={outputTab === "html"}
                    className={`output-tab${outputTab === "html" ? " active" : ""}`}
                    onClick={() => setOutputTab("html")}
                  >
                    <Code size={11} style={{ display: "inline", marginRight: "5px", verticalAlign: "middle" }} />
                    HTML
                  </button>
                </div>
                {html && (
                  <span className={`success-tag${livePulse ? " live-pulse" : ""}`} style={{ marginLeft: "10px" }}>
                    ✓ rendered
                  </span>
                )}
              </div>
              <div className="panel-actions">
                {html && (
                  <>
                    <button className="btn-ghost" onClick={copyHtml}>{copied ? "✓ Copied!" : "Copy HTML"}</button>
                    <button className="btn-ghost" onClick={downloadHtml}>↓ Download</button>
                  </>
                )}
                <button className="btn-ghost" onClick={() => setFullscreen(true)} title="Fullscreen" aria-label="Fullscreen preview">
                  <Maximize2 size={11} style={{ display: "inline", verticalAlign: "middle" }} />
                </button>
              </div>
            </div>

            {outputTab === "preview" ? (
              <div
                className="md-preview"
                aria-label="Rendered HTML preview"
                aria-live="polite"
                dangerouslySetInnerHTML={{
                  __html: html || "<p class='md-placeholder'>// Start typing to see preview…</p>",
                }}
              />
            ) : (
              <pre className={`output-pre${!html ? " empty" : ""}`} aria-label="HTML source" aria-live="polite">
                {html || "// HTML source will appear here…"}
              </pre>
            )}
          </div>
        </div>

        <div className="actions">
          <button className="btn-secondary" onClick={() => setInput(EXAMPLE_MD)}>Load Example</button>
          <button className="btn-secondary" onClick={() => setInput("")}>Clear All</button>
          <button className="btn-convert" onClick={downloadHtml} disabled={!html}>
            <FileText size={15} aria-hidden="true" style={{ marginRight: "6px" }} />
            Download HTML
          </button>
        </div>
      </section>

      {/* Fullscreen overlay */}
      {fullscreen && (
        <div className="fullscreen-overlay" role="dialog" aria-modal="true" aria-label="Fullscreen preview">
          <div className="fullscreen-header">
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--color-text-muted)" }}>
              Preview
            </span>
            <button className="btn-ghost" onClick={() => setFullscreen(false)}>✕ Close</button>
          </div>
          <div className="md-preview fullscreen-content" dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      )}

      <section className="features" aria-label="Features">
        {[
          {
            icon: <Zap size={24} />,
            title: "Real-time rendering",
            desc: "Preview updates instantly as you type — no button needed. The HTML output is always in sync with your Markdown.",
          },
          {
            icon: <Code size={24} />,
            title: "Syntax highlighting",
            desc: "Headings, bold, italic, code blocks, links, and more are color-highlighted in the editor for easy reading while writing.",
          },
          {
            icon: <FileText size={24} />,
            title: "Export clean HTML",
            desc: "Copy the generated HTML or download a full HTML file with proper DOCTYPE, ready to drop into any project.",
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