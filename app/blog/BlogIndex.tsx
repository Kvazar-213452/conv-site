import Link from "next/link";
import {
  ArrowRight,
  FileCode2,
  Layers,
  KeyRound,
  Search,
  ShieldCheck,
  KeySquare,
  FileText,
  Link2,
  Terminal,
  Database,
  Shield,
} from "lucide-react";

import "@/style/main.css";
import "@/style/home.css";

import { expansionArticles } from "@/lib/expansion-articles";

const POSTS = [
  ...expansionArticles.map(article => ({ icon: <FileText size={22} />, label: article.title, desc: article.description, badge: "Guide", href: "/blog/" + article.slug })),
  {
    icon: <FileCode2 size={22} />,
    label: "JSON vs YAML – When to Use Each Format",
    desc: "Practical comparison with syntax examples, the Norway problem, and clear decision rules for picking between the two.",
    badge: "Comparison",
    href: "/blog/json-vs-yaml",
  },
  {
    icon: <FileCode2 size={22} />,
    label: "JSON vs XML – Complete Comparison",
    desc: "File size, parsing speed, data types, readability — a thorough comparison with real code examples and benchmarks.",
    badge: "Comparison",
    href: "/blog/json-vs-xml",
  },
  {
    icon: <Layers size={22} />,
    label: "Base64 Explained",
    desc: "What Base64 really is, when to use it, when to avoid it, and the difference between standard and URL-safe variants.",
    badge: "Explainer",
    href: "/blog/base64-explained",
  },
  {
    icon: <KeyRound size={22} />,
    label: "Understanding JWT",
    desc: "A developer's guide to JSON Web Tokens — anatomy, HS256 vs RS256 signing, and the usual mistakes to avoid.",
    badge: "Auth",
    href: "/blog/understanding-jwt",
  },
  {
    icon: <Search size={22} />,
    label: "JavaScript Regex Cheatsheet",
    desc: "Classes, quantifiers, anchors, groups, lookarounds, and the common recipes you reach for day to day.",
    badge: "Reference",
    href: "/blog/regex-cheatsheet",
  },
  {
    icon: <ShieldCheck size={22} />,
    label: "MD5 vs SHA-256 – Which Hash?",
    desc: "Collision resistance, legitimate uses, password hashing, and when each algorithm is actually safe.",
    badge: "Crypto",
    href: "/blog/md5-vs-sha256",
  },
  {
    icon: <KeySquare size={22} />,
    label: "UUID vs NanoID vs ULID",
    desc: "Four flavors of unique ID — v4, v7, NanoID, ULID — compared on collision odds, size, and database indexing.",
    badge: "IDs",
    href: "/blog/uuid-vs-nanoid",
  },
  {
    icon: <FileText size={22} />,
    label: "Markdown Guide",
    desc: "Complete CommonMark + GFM syntax reference with gotchas: tables, hard line breaks, nested lists, and more.",
    badge: "Reference",
    href: "/blog/markdown-guide",
  },
  {
    icon: <Link2 size={22} />,
    label: "URL Encoding Explained",
    desc: "The three JavaScript encode modes, RFC 3986 rules, and how double-encoding breaks production URLs.",
    badge: "Explainer",
    href: "/blog/url-encoding-explained",
  },
  {
    icon: <Terminal size={22} />,
    label: "chmod Explained",
    desc: "Octal notation, special bits, umask, chown — the full picture of Unix file permissions.",
    badge: "Unix",
    href: "/blog/chmod-explained",
  },
  {
    icon: <Database size={22} />,
    label: "SQL Formatting Guide",
    desc: "A pragmatic style guide for writing SQL that reads well in code review and 3 AM incident response.",
    badge: "SQL",
    href: "/blog/sql-formatting-guide",
  },
  {
    icon: <Shield size={22} />,
    label: "HTML Entities & XSS",
    desc: "How entity encoding prevents XSS, when it isn't enough, and how to escape by context: HTML, attribute, URL, JavaScript.",
    badge: "Security",
    href: "/blog/html-entities-xss",
  },
];

export default function BlogIndex() {
  return (
    <>
      <section className="hero home-hero" aria-labelledby="blog-heading">
        <div className="hero-eyebrow">
          <div className="hero-dot" aria-hidden="true" />
          Guides · Comparisons · Cheatsheets
        </div>

        <h1 id="blog-heading" className="home-title">
          Developer<br />
          <em>Blog</em>
        </h1>

        <p className="home-subtitle">
          Practical, no-fluff guides for working developers. Format comparisons,
          security deep-dives, reference cheatsheets, and style guides —
          cross-linked with our free in-browser tools.
        </p>
      </section>

      <section aria-labelledby="posts-heading">
        <div className="home-section-header">
          <h2 id="posts-heading" className="home-section-title">All posts</h2>
          <p className="home-section-sub">
            {POSTS.length} articles and still growing. Pick a topic — every post
            links to the matching tool.
          </p>
        </div>

        <div className="converter-grid">
          {POSTS.map(({ icon, label, desc, badge, href }, i) => (
            <Link
              key={href}
              href={href}
              className="converter-card"
              style={{ animationDelay: `${0.05 * i + 0.1}s` }}
              aria-label={`Read ${label}`}
            >
              <div className="converter-card-top">
                <div className="converter-card-icon" aria-hidden="true">
                  {icon}
                </div>
                {badge && <span className="converter-card-badge">{badge}</span>}
              </div>
              <h3 className="converter-card-title">{label}</h3>
              <p className="converter-card-desc">{desc}</p>
              <div className="converter-card-arrow" aria-hidden="true">
                <ArrowRight size={15} />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
