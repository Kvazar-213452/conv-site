"use client";

import { useState, useCallback } from "react";
import { buildUtmUrl, DEFAULT_UTM, type UtmParams } from "./utils";
import { Link2, Lock, Copy } from "lucide-react";

import "@/style/main.css";

export default function UtmBuilder() {
  const [params, setParams] = useState<UtmParams>(DEFAULT_UTM);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const build = useCallback(() => {
    setError("");
    try {
      setOutput(buildUtmUrl(params));
    } catch (e) {
      setError((e as Error).message);
    }
  }, [params]);

  const clearAll = () => { setParams({ url: "", source: "", medium: "", campaign: "", term: "", content: "" }); setOutput(""); setError(""); };
  const loadExample = () => { setParams(DEFAULT_UTM); setOutput(""); setError(""); };
  const copyOutput = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const setField = (key: keyof UtmParams, val: string) => {
    setParams((prev) => ({ ...prev, [key]: val }));
    setOutput("");
  };

  const fields: { key: keyof UtmParams; label: string; required: boolean; placeholder: string; help: string }[] = [
    { key: "url", label: "Website URL", required: true, placeholder: "https://example.com/page", help: "The destination URL" },
    { key: "source", label: "Campaign Source", required: true, placeholder: "google, facebook, newsletter", help: "utm_source — where traffic comes from" },
    { key: "medium", label: "Campaign Medium", required: true, placeholder: "cpc, email, social, banner", help: "utm_medium — marketing medium" },
    { key: "campaign", label: "Campaign Name", required: true, placeholder: "spring_sale, product_launch", help: "utm_campaign — campaign identifier" },
    { key: "term", label: "Campaign Term", required: false, placeholder: "running+shoes", help: "utm_term — paid search keywords (optional)" },
    { key: "content", label: "Campaign Content", required: false, placeholder: "hero_banner, sidebar_link", help: "utm_content — differentiate ads/links (optional)" },
  ];

  return (
    <>
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-eyebrow">
          <div className="hero-dot" aria-hidden="true" />
          Free · No sign-up · Runs in browser
        </div>
        <h1 id="hero-heading">
          UTM Link <em>Builder</em>
        </h1>
        <p>
          Build campaign tracking URLs with UTM parameters for Google Analytics.
          Fill in the form and get a ready-to-share link.
        </p>
      </section>

      {error && (
        <div className="error-bar" role="alert" aria-live="assertive">
          <span aria-hidden="true">✕</span>
          <span>Error: {error}</span>
        </div>
      )}

      <section aria-label="UTM Link Builder">
        <div style={{ border: "1px solid var(--color-border)", borderRadius: 12, background: "var(--color-surface)", padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
          {fields.map(({ key, label, required, placeholder, help }) => (
            <div key={key}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--color-text-muted)", marginBottom: 6 }}>
                {label} {required && <span style={{ color: "var(--color-error)" }}>*</span>}
              </label>
              <input
                type="text"
                value={params[key]}
                onChange={(e) => setField(key, e.target.value)}
                placeholder={placeholder}
                style={{ width: "100%", padding: "10px 14px", fontSize: 14, fontFamily: "'Geist Mono', monospace", background: "var(--color-accent-soft)", border: "1px solid var(--color-border-bright)", borderRadius: 8, color: "var(--color-text)", boxSizing: "border-box" }}
              />
              <span style={{ fontSize: 11, color: "var(--color-text-dim)", marginTop: 4, display: "block" }}>{help}</span>
            </div>
          ))}
        </div>

        <div className="actions">
          <button className="btn-secondary" onClick={loadExample}>Load Example</button>
          <button className="btn-convert" onClick={build} disabled={!params.url.trim()}>
            <Link2 size={16} aria-hidden="true" className="mr-1" /> Build URL
          </button>
          <button className="btn-secondary" onClick={clearAll}>Clear All</button>
        </div>

        {output && (
          <div className="panel panel--full has-output" style={{ marginTop: 16 }}>
            <div className="panel-header">
              <div className="panel-title">
                <div className="dot yaml" aria-hidden="true" />
                Generated URL
                <span className="success-tag">✓ ready</span>
              </div>
              <div className="panel-actions">
                <button className="btn-ghost" onClick={copyOutput}>{copied ? "Copied!" : "Copy"}</button>
              </div>
            </div>
            <pre className="output-pre" aria-live="polite" style={{ wordBreak: "break-all", whiteSpace: "pre-wrap" }}>{output}</pre>
          </div>
        )}
      </section>

      <section className="seo-content" aria-labelledby="about-heading">
        <h2 id="about-heading">About UTM Link Builder Tool</h2>
        <p>
          This free online UTM link builder generates campaign tracking URLs with UTM parameters recognized by Google
          Analytics, Adobe Analytics, and all major marketing analytics platforms. Fill in the source, medium, campaign
          name, and optional term and content fields to create a tagged URL that tracks where your traffic comes from.
          Everything runs locally in your browser — no data is sent to any server.
        </p>

        <h3>Why Use UTM Parameters?</h3>
        <p>
          UTM parameters are the industry standard for tracking marketing campaign performance. Without them, Google
          Analytics groups all traffic as "direct" or "referral," making it impossible to measure which campaigns,
          ads, emails, or social posts drive conversions. UTM-tagged links let you see exactly which source, medium,
          and campaign brought each visitor, enabling data-driven marketing decisions and accurate ROI calculations.
        </p>

        <h3>Understanding UTM Parameters</h3>
        <p>
          utm_source identifies where traffic comes from (google, facebook, newsletter). utm_medium identifies the
          marketing channel (cpc, email, social, banner). utm_campaign names the specific campaign (spring_sale,
          product_launch). utm_term captures paid search keywords (optional). utm_content differentiates ads or links
          pointing to the same URL (optional — hero_banner vs sidebar_link). All parameters are case-sensitive.
        </p>

        <h3>Key Benefits</h3>
        <ul>
          <li><strong>Standards-compliant:</strong> Generates UTM parameters recognized by Google Analytics and all major platforms</li>
          <li><strong>URL validation:</strong> Verifies your base URL is valid before appending parameters</li>
          <li><strong>Proper encoding:</strong> Special characters in parameters are correctly percent-encoded</li>
          <li><strong>One-click copy:</strong> Copy the complete tagged URL instantly</li>
          <li><strong>Form-based input:</strong> No need to manually construct query strings</li>
          <li><strong>Completely private:</strong> Your marketing URLs and campaign data never leave your device</li>
        </ul>

        <h3>Common Use Cases</h3>
        <p>
          Marketing managers tag links in email campaigns, social media posts, and paid ads. SEO specialists track
          backlink sources and content promotion. Growth engineers instrument product links for attribution. Social
          media managers differentiate traffic from different platforms and posts. Affiliate managers create tracked
          links for partners. Content marketers measure which distribution channels drive the most engagement.
        </p>

        <h3>Privacy and Security</h3>
        <p>
          All URL building happens locally in your browser. Your campaign URLs, marketing strategies, and parameter
          data never leave your computer. No cookies, no tracking, no server communication. Safe for confidential
          campaign planning and competitive marketing data.
        </p>
      </section>

      <section className="features" aria-label="Features">
        {[
          { icon: <Link2 size={24} />, title: "Campaign tracking", desc: "Generate UTM-tagged URLs for Google Analytics, Adobe Analytics, and all major platforms." },
          { icon: <Lock size={24} />, title: "Fully private", desc: "Your marketing URLs and campaign data never leave the browser." },
          { icon: <Copy size={24} />, title: "One-click copy", desc: "Copy the complete tagged URL instantly. Ready to paste in emails, ads, and social posts." },
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
