"use client";

import { useState, useMemo } from "react";
import { Globe, Zap, Lock } from "lucide-react";
import Link from "next/link";
import { generateMetaTags, DEFAULT_INPUT, type MetaInput } from "./utils";

import "@/style/main.css";
import "./main.css";

export default function MetaTagGenerator() {
  const [input, setInput] = useState<MetaInput>(DEFAULT_INPUT);
  const [copied, setCopied] = useState(false);
  const output = useMemo(() => generateMetaTags(input), [input]);
  const copy = () => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const setField = <K extends keyof MetaInput>(k: K, v: MetaInput[K]) => setInput((p) => ({ ...p, [k]: v }));

  return (
    <>
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-eyebrow"><div className="hero-dot" />Free · No sign-up · Runs in browser</div>
        <h1 id="hero-heading">Meta Tag <em>Generator</em></h1>
        <p>Generate SEO, Open Graph, and Twitter Card meta tags from a form. Copy the output into your <code>&lt;head&gt;</code> and you have the baseline tags Google and social platforms expect.</p>
      </section>

      <section aria-label="Meta Tag Generator">
        <div className="converter">
          <div className="panel">
            <div className="panel-header">
              <div className="panel-title"><div className="dot json" />Fields</div>
            </div>
            <div className="mtg-form">
              <label>Title</label>              <input value={input.title}         onChange={(e) => setField("title", e.target.value)} />
              <label>Description</label>        <input value={input.description}   onChange={(e) => setField("description", e.target.value)} />
              <label>Canonical URL</label>      <input value={input.url}           onChange={(e) => setField("url", e.target.value)} />
              <label>Site name</label>          <input value={input.siteName}      onChange={(e) => setField("siteName", e.target.value)} />
              <label>Author</label>             <input value={input.author}        onChange={(e) => setField("author", e.target.value)} />
              <label>Keywords</label>           <input value={input.keywords}      onChange={(e) => setField("keywords", e.target.value)} />
              <label>Image URL</label>          <input value={input.image}         onChange={(e) => setField("image", e.target.value)} />
              <label>Twitter handle</label>     <input value={input.twitterHandle} onChange={(e) => setField("twitterHandle", e.target.value)} />
              <label>Robots</label>
              <select value={input.robots} onChange={(e) => setField("robots", e.target.value)}>
                <option value="index, follow">index, follow</option>
                <option value="noindex, follow">noindex, follow</option>
                <option value="index, nofollow">index, nofollow</option>
                <option value="noindex, nofollow">noindex, nofollow</option>
              </select>
              <label>OG type</label>
              <select value={input.type} onChange={(e) => setField("type", e.target.value)}>
                <option value="website">website</option>
                <option value="article">article</option>
                <option value="profile">profile</option>
                <option value="book">book</option>
              </select>
              <label>Locale</label>
              <select value={input.locale} onChange={(e) => setField("locale", e.target.value)}>
                <option value="en_US">en_US</option>
                <option value="en_GB">en_GB</option>
                <option value="uk_UA">uk_UA</option>
                <option value="de_DE">de_DE</option>
                <option value="fr_FR">fr_FR</option>
                <option value="es_ES">es_ES</option>
                <option value="pl_PL">pl_PL</option>
              </select>
            </div>
          </div>

          <div className="panel has-output">
            <div className="panel-header">
              <div className="panel-title"><div className="dot yaml" />HTML Output<span className="success-tag">✓ live</span></div>
              <div className="panel-actions">
                <button className="btn-ghost" onClick={copy}>{copied ? "✓ Copied!" : "Copy All"}</button>
              </div>
            </div>
            <pre className="output-pre" aria-live="polite" style={{ whiteSpace: "pre-wrap" }}>{output}</pre>
          </div>
        </div>
      </section>

      <section className="seo-content" aria-labelledby="about-heading">
        <h2 id="about-heading">HTML Meta Tag Generator</h2>
        <p>Generate the baseline <code>&lt;head&gt;</code> meta tags Google and social platforms expect: title, description, keywords, canonical, Open Graph for Facebook/LinkedIn/Discord/Slack, and Twitter Card for X/Twitter. Live preview as you type.</p>

        <h3>What You Get</h3>
        <ul>
          <li><code>&lt;title&gt;</code>, <code>meta description</code>, <code>meta keywords</code>, <code>meta author</code></li>
          <li><code>link rel="canonical"</code> to consolidate duplicates</li>
          <li>Open Graph: <code>og:title</code>, <code>og:description</code>, <code>og:url</code>, <code>og:image</code>, <code>og:site_name</code>, <code>og:type</code>, <code>og:locale</code></li>
          <li>Twitter Card: <code>twitter:card</code>, <code>twitter:title</code>, <code>twitter:description</code>, <code>twitter:image</code>, <code>twitter:site</code></li>
          <li>Robots directive for indexing control</li>
        </ul>

        <h3>Length Guidelines</h3>
        <ul>
          <li><strong>Title</strong>: 50–60 characters</li>
          <li><strong>Description</strong>: 150–160 characters</li>
          <li><strong>OG image</strong>: 1200×630 pixels, under 8 MB, JPEG or PNG</li>
        </ul>

        <h3>Related</h3>
        <p>Encode URLs with the <Link href="/tools/url-encode">URL Encoder</Link>, or render the final HTML with the <Link href="/tools/markdown-to-html">Markdown to HTML</Link> tool.</p>
      </section>

      <section className="features" aria-label="Features">
        {[
          { icon: <Globe size={24} />, title: "SEO + OG + Twitter", desc: "All three sets of tags generated from one form." },
          { icon: <Zap size={24} />,   title: "Live preview",        desc: "Output updates as you type — no Submit button." },
          { icon: <Lock size={24} />,  title: "Fully private",       desc: "Everything stays in your browser." },
        ].map(({ icon, title, desc }) => (
          <div className="feature" key={title}><div className="feature-icon">{icon}</div><h3>{title}</h3><p>{desc}</p></div>
        ))}
      </section>
    </>
  );
}
