"use client";

import { useState, useCallback } from "react";
import { KeyRound, Lock, Zap, ArrowRight } from "lucide-react";
import { decodeJwt, formatTimestampClaim, TIMESTAMP_CLAIMS, type JwtDecoded } from "./utils";
import { EXAMPLE_JWT } from "@/lib/const";

import "@/style/main.css";
import "./main.css";

type ClaimEntry = { key: string; value: string; tsHint: string | null };

function toEntries(obj: Record<string, unknown>): ClaimEntry[] {
  return Object.entries(obj).map(([key, value]) => {
    const isTs = TIMESTAMP_CLAIMS.includes(key as (typeof TIMESTAMP_CLAIMS)[number]);
    return {
      key,
      value: typeof value === "string" ? value : JSON.stringify(value),
      tsHint: isTs ? formatTimestampClaim(value) : null,
    };
  });
}

export default function JwtDecoder() {
  const [input, setInput] = useState(EXAMPLE_JWT);
  const [decoded, setDecoded] = useState<JwtDecoded | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [decoding, setDecoding] = useState(false);

  const decode = useCallback(() => {
    setError("");
    setDecoded(null);
    if (!input.trim()) return;
    setDecoding(true);
    setTimeout(() => {
      try {
        setDecoded(decodeJwt(input));
      } catch (e) {
        setError((e as Error).message);
      }
      setDecoding(false);
    }, 220);
  }, [input]);

  const copyPayload = () => {
    if (!decoded) return;
    navigator.clipboard.writeText(JSON.stringify(decoded.payload, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const loadExample = () => { setInput(EXAMPLE_JWT); setDecoded(null); setError(""); };
  const clearAll   = () => { setInput(""); setDecoded(null); setError(""); };

  return (
    <>
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-eyebrow">
          <div className="hero-dot" aria-hidden="true" />
          Free · No sign-up · Runs in browser
        </div>
        <h1 id="hero-heading">
          JWT <em>Decoder</em>
        </h1>
        <p>
          Paste any JSON Web Token and inspect its header, payload, and signature.
          Timestamp claims (iat, exp, nbf) are converted to human-readable dates.
          Runs 100% in your browser — nothing leaves your device.
        </p>
      </section>

      {error && (
        <div className="error-bar" role="alert" aria-live="assertive">
          <span aria-hidden="true">✕</span>
          <span>Decode Error: {error}</span>
        </div>
      )}

      <section aria-label="JWT Decoder">
        <div className="converter">

          <div className={`panel${error ? " has-error" : ""}`}>
            <div className="panel-header">
              <div className="panel-title">
                <div className="dot json" aria-hidden="true" />
                JWT Token
              </div>
              <div className="panel-actions">
                <button className="btn-ghost" onClick={loadExample}>Example</button>
                <button className="btn-ghost" onClick={() => { setInput(""); setError(""); }}>Clear</button>
              </div>
            </div>
            <textarea
              aria-label="JWT Token"
              placeholder="Paste a JWT token (header.payload.signature)…"
              value={input}
              onChange={(e) => { setInput(e.target.value); setError(""); }}
              spellCheck={false} autoCorrect="off" autoCapitalize="off"
            />
          </div>

          <div className={`panel${decoded ? " has-output" : ""}`}>
            <div className="panel-header">
              <div className="panel-title">
                <div className="dot yaml" aria-hidden="true" />
                Decoded Token
                {decoded && !decoding && <span className="success-tag">✓ decoded</span>}
              </div>
              {decoded && !decoding && (
                <div className="panel-actions">
                  <button className="btn-ghost" onClick={copyPayload}>
                    {copied ? "✓ Copied!" : "Copy Payload"}
                  </button>
                </div>
              )}
            </div>

            {decoding && (
              <pre className="output-pre loading" aria-live="polite">// Decoding…</pre>
            )}
            {!decoding && !decoded && (
              <pre className="output-pre empty" aria-live="polite">
                {`// Decoded token will appear here…`}
              </pre>
            )}
            {!decoding && decoded && (
              <div className="jwt-list" aria-live="polite">
                <div className="jwt-group">
                  <div className="jwt-group-title">Header</div>
                  {toEntries(decoded.header).map(({ key, value }) => (
                    <div className="jwt-row" key={key}>
                      <span className="jwt-key">{key}</span>
                      <code className="jwt-value">{value}</code>
                    </div>
                  ))}
                </div>

                <div className="jwt-group">
                  <div className="jwt-group-title">Payload</div>
                  {toEntries(decoded.payload).map(({ key, value, tsHint }) => (
                    <div className="jwt-row" key={key}>
                      <span className="jwt-key">{key}</span>
                      <code className="jwt-value">{value}</code>
                      {tsHint && <span className="jwt-ts-hint">→ {tsHint}</span>}
                    </div>
                  ))}
                </div>

                <div className="jwt-group">
                  <div className="jwt-group-title">Signature</div>
                  <code className="jwt-signature">{decoded.signature}</code>
                  <span className="jwt-note">
                    Signature is not verified — this tool does not check the signing key.
                  </span>
                </div>
              </div>
            )}
          </div>

        </div>

        <div className="actions">
          <button className="btn-secondary" onClick={loadExample}>Load Example</button>
          <button
            className="btn-convert"
            onClick={decode}
            disabled={decoding || !input.trim()}
            aria-busy={decoding}
          >
            {decoding
              ? <><div className="btn-spinner" aria-hidden="true" /> Decoding…</>
              : <><ArrowRight size={16} aria-hidden="true" className="mr-1" /> Decode JWT</>
            }
          </button>
          <button className="btn-secondary" onClick={clearAll}>Clear All</button>
        </div>
      </section>

      <section className="seo-content" aria-labelledby="about-heading">
        <h2 id="about-heading">About JWT Decoder Tool</h2>
        <p>
          This free online JWT decoder splits any JSON Web Token into its three parts — header,
          payload, and signature — and parses the Base64URL-encoded JSON client-side. Timestamp
          claims such as <code>iat</code>, <code>exp</code>, and <code>nbf</code> are converted to
          ISO-8601 for easy inspection. Perfect for debugging OAuth2, OpenID Connect, and custom
          auth flows.
        </p>

        <h3>What is a JWT?</h3>
        <p>
          A JSON Web Token is a compact, URL-safe credential consisting of three Base64URL-encoded
          parts: a header describing the signing algorithm, a payload carrying claims, and a
          signature protecting the integrity of the first two parts. JWTs are the backbone of modern
          stateless authentication and API authorization.
        </p>

        <h3>Key Benefits</h3>
        <ul>
          <li><strong>Fully private:</strong> Tokens are decoded locally — safe for production credentials</li>
          <li><strong>Timestamp formatting:</strong> iat, exp, and nbf are shown as human-readable ISO dates</li>
          <li><strong>Readable layout:</strong> Clear separation between header, payload, and signature</li>
          <li><strong>Copy payload:</strong> One-click copy of the full JSON payload</li>
          <li><strong>No installation:</strong> Works in any modern browser without extensions</li>
        </ul>

        <h3>Privacy and Security</h3>
        <p>
          Decoding happens entirely in your browser. Your token — potentially containing user IDs,
          email addresses, scopes, or custom claims — is never sent to a server. Note that this
          tool does not verify the signature; decoded content should be considered untrusted until
          verified by a backend using the correct signing key.
        </p>
      </section>

      <section className="features" aria-label="Features">
        {[
          {
            icon: <Zap size={24} />,
            title: "Instant decoding",
            desc: "Base64URL and JSON parsing happen in milliseconds, right in your browser.",
          },
          {
            icon: <Lock size={24} />,
            title: "Fully private",
            desc: "Tokens are decoded locally. Nothing is sent to any server — safe for production credentials.",
          },
          {
            icon: <KeyRound size={24} />,
            title: "Claim formatting",
            desc: "Timestamps like iat, exp, and nbf are converted to human-readable ISO dates.",
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
