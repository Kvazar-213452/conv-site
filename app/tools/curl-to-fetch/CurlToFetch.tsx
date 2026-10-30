"use client";

import { useState, useMemo } from "react";
import { Terminal, Zap, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";
import {
  parseCurl,
  emitFetch,
  emitAxios,
  emitXhr,
  type Target,
} from "./utils";

import "@/style/main.css";

const EXAMPLE_CURL = `curl -X POST https://api.example.com/users \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer eyJhbGciOi..." \\
  -d '{"name":"Alice","role":"admin"}'`;

const TARGETS: { value: Target; label: string }[] = [
  { value: "fetch", label: "fetch" },
  { value: "axios", label: "axios" },
  { value: "xhr",   label: "XHR" },
];

export default function CurlToFetch() {
  const [input, setInput] = useState(EXAMPLE_CURL);
  const [target, setTarget] = useState<Target>("fetch");
  const [copied, setCopied] = useState(false);

  const { output, error } = useMemo(() => {
    if (!input.trim()) return { output: "", error: "" };
    try {
      const parsed = parseCurl(input);
      const code =
        target === "fetch" ? emitFetch(parsed) :
        target === "axios" ? emitAxios(parsed) :
                             emitXhr(parsed);
      return { output: code, error: "" };
    } catch (e) {
      return { output: "", error: (e as Error).message };
    }
  }, [input, target]);

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const loadExample = () => setInput(EXAMPLE_CURL);
  const clearAll   = () => setInput("");

  return (
    <>
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-eyebrow">
          <div className="hero-dot" aria-hidden="true" />
          Free · No sign-up · Runs in browser
        </div>
        <h1 id="hero-heading">
          cURL <em>→</em> fetch
        </h1>
        <p>
          Paste any cURL command and get idiomatic JavaScript — fetch, axios, or raw
          XMLHttpRequest. Handles headers, methods, JSON and form bodies, Basic auth,
          and multi-line commands. 100% client-side.
        </p>

        <div className="mode-toggle" role="group" aria-label="Output target">
          {TARGETS.map(({ value, label }) => (
            <button
              key={value}
              className={`mode-btn${target === value ? " active" : ""}`}
              onClick={() => setTarget(value)}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      {error && (
        <div className="error-bar" role="alert" aria-live="assertive">
          <span aria-hidden="true">✕</span>
          <span>Parse Error: {error}</span>
        </div>
      )}

      <section aria-label="cURL to Fetch">
        <div className="converter">

          <div className={`panel${error ? " has-error" : ""}`}>
            <div className="panel-header">
              <div className="panel-title">
                <div className="dot json" aria-hidden="true" />
                cURL Command
              </div>
              <div className="panel-actions">
                <button className="btn-ghost" onClick={loadExample}>Example</button>
                <button className="btn-ghost" onClick={clearAll}>Clear</button>
              </div>
            </div>
            <textarea
              aria-label="cURL command"
              placeholder="curl -X POST https://api.example.com/..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              spellCheck={false} autoCorrect="off" autoCapitalize="off"
            />
          </div>

          <div className={`panel${output ? " has-output" : ""}`}>
            <div className="panel-header">
              <div className="panel-title">
                <div className="dot yaml" aria-hidden="true" />
                {target === "fetch" ? "fetch()" : target === "axios" ? "axios" : "XMLHttpRequest"}
                {output && <span className="success-tag">✓ converted</span>}
              </div>
              {output && (
                <div className="panel-actions">
                  <button className="btn-ghost" onClick={copyOutput}>
                    {copied ? "✓ Copied!" : "Copy"}
                  </button>
                </div>
              )}
            </div>
            <pre className={`output-pre${output ? "" : " empty"}`} aria-live="polite">
              {output || "// Converted code will appear here…"}
            </pre>
          </div>

        </div>

        <div className="actions">
          <button className="btn-secondary" onClick={loadExample}>Load Example</button>
          <button
            className="btn-convert"
            onClick={() => setInput(input + "")}
            disabled={!input.trim()}
          >
            <ArrowRight size={16} aria-hidden="true" className="mr-1" /> Convert
          </button>
          <button className="btn-secondary" onClick={clearAll}>Clear All</button>
        </div>
      </section>

      <section className="seo-content" aria-labelledby="about-heading">
        <h2 id="about-heading">About the cURL to Fetch Converter</h2>
        <p>
          This free online converter translates any <code>curl</code> command into
          idiomatic JavaScript — <code>fetch()</code>, <code>axios</code>, or raw
          <code>XMLHttpRequest</code>. Perfect when you grab a request from
          Chrome DevTools' "Copy as cURL" or from a vendor's API docs and need to
          paste it into frontend code. Everything runs in your browser; your
          commands never leave the page.
        </p>

        <h3>Supported cURL Flags</h3>
        <ul>
          <li><code>-X, --request</code> — HTTP method</li>
          <li><code>-H, --header</code> — request headers (repeatable)</li>
          <li><code>-d, --data, --data-raw, --data-binary, --data-urlencode</code> — request body</li>
          <li><code>-u, --user</code> — HTTP Basic auth (encoded to <code>Authorization</code>)</li>
          <li><code>-A, --user-agent</code>, <code>-e, --referer</code>, <code>-b, --cookie</code></li>
          <li>Multi-line commands with trailing <code>\\</code> are supported</li>
          <li>Common no-op flags like <code>--compressed</code>, <code>-L</code>, <code>-k</code>, <code>-s</code>, <code>-v</code> are ignored</li>
        </ul>

        <h3>Smart JSON Detection</h3>
        <p>
          When the request body looks like JSON — either because the
          <code>Content-Type</code> says so, or because the body starts with
          <code>{"{"}</code> or <code>[</code> — the output uses
          <code>JSON.stringify(...)</code> with a pretty-printed literal, which is
          both more readable and avoids escaping issues with embedded quotes.
        </p>

        <h3>Common Use Cases</h3>
        <ul>
          <li>Chrome DevTools → "Copy as cURL" → paste into your React/Vue component</li>
          <li>Stripe, Twilio, OpenAI docs → turn a quickstart into working code</li>
          <li>Postman export → inline <code>fetch</code> for a one-off script</li>
          <li>Shell script → migrate HTTP calls to a Node.js worker</li>
        </ul>

        <h3>Frequently Asked Questions</h3>

        <h3>Does it support cURL from Windows cmd / PowerShell?</h3>
        <p>
          Yes, as long as you keep the <code>curl</code> prefix and quote arguments.
          Windows cmd uses double quotes with <code>^</code> escapes — strip those
          escapes before pasting. PowerShell cURL output usually just works.
        </p>

        <h3>Does it convert cURL cookies to <code>credentials: "include"</code>?</h3>
        <p>
          Not automatically. The <code>-b</code> flag is translated to a
          <code>Cookie</code> header, which fetch will send only when
          <code>credentials: "include"</code> is set on the same-origin or CORS-allowed
          request. Add that option yourself if needed.
        </p>

        <h3>What about file uploads (<code>-F</code>)?</h3>
        <p>
          Multipart form uploads are not currently emitted — you need
          <code>FormData</code> in JavaScript and runtime file handles. Convert the
          other flags with this tool and add the <code>FormData</code> part by hand.
        </p>

        <h3>Related Tools</h3>
        <p>
          Decode <code>Authorization: Bearer</code> tokens with the{" "}
          <Link href="/tools/jwt-decoder">JWT Decoder</Link>. Encode request body
          strings for query parameters with the{" "}
          <Link href="/tools/url-encode">URL Encoder</Link>.
        </p>
      </section>

      <section className="features" aria-label="Features">
        {[
          { icon: <Terminal size={24} />, title: "Three targets",   desc: "fetch, axios, or XMLHttpRequest — pick whichever your codebase uses." },
          { icon: <Zap size={24} />,      title: "Smart JSON",      desc: "Detects JSON bodies and emits JSON.stringify(...) with a pretty literal." },
          { icon: <Lock size={24} />,     title: "Fully private",   desc: "Commands with Authorization headers and secrets never leave the browser." },
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
