"use client";

import { KeyRound, ShieldAlert, Clock } from "lucide-react";
import Link from "next/link";

import "@/style/main.css";

const HEADER = `{
  "alg": "HS256",
  "typ": "JWT"
}`;

const PAYLOAD = `{
  "sub": "1234567890",
  "name": "Alice",
  "iat": 1716239022,
  "exp": 1716242622
}`;

export default function UnderstandingJwt() {
  return (
    <>
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-eyebrow">
          <div className="hero-dot" aria-hidden="true" />
          Auth · Explainer · Guide
        </div>
        <h1 id="hero-heading">
          Understanding <em>JWT</em>
        </h1>
        <p>
          JSON Web Tokens look opaque but they are three plain pieces of text with a
          signature at the end. Here is the full picture — and the gotchas.
        </p>
      </section>

      <section aria-label="Example">
        <div className="converter">
          <div className="panel">
            <div className="panel-header">
              <div className="panel-title">
                <div className="dot json" aria-hidden="true" />
                Header
              </div>
            </div>
            <pre className="output-pre">{HEADER}</pre>
          </div>
          <div className="panel">
            <div className="panel-header">
              <div className="panel-title">
                <div className="dot yaml" aria-hidden="true" />
                Payload (claims)
              </div>
            </div>
            <pre className="output-pre">{PAYLOAD}</pre>
          </div>
        </div>
      </section>

      <section className="seo-content" aria-labelledby="about-heading">
        <h2 id="about-heading">Anatomy of a JWT</h2>
        <p>
          A JWT is a dot-separated string: <code>header.payload.signature</code>. The
          first two parts are Base64URL-encoded JSON. The third part is a signature
          computed over the first two using a key only the issuer knows.
        </p>

        <h3>Standard Claims</h3>
        <ul>
          <li><code>iss</code> — issuer</li>
          <li><code>sub</code> — subject (user id)</li>
          <li><code>aud</code> — audience</li>
          <li><code>iat</code> — issued-at (Unix seconds)</li>
          <li><code>exp</code> — expiry (Unix seconds)</li>
          <li><code>nbf</code> — not-before</li>
          <li><code>jti</code> — unique token id (for revocation lists)</li>
        </ul>

        <h3>Signing: HS256 vs RS256</h3>
        <p>
          <strong>HS256</strong> uses a shared secret with HMAC-SHA256. Both the issuer
          and the verifier need the same key. <strong>RS256</strong> uses an RSA key
          pair — the issuer signs with the private key, verifiers only need the public
          key. For multi-service architectures, RS256 is usually the right choice.
        </p>

        <h3>Common Mistakes</h3>
        <p>
          <strong>Trusting the payload without verifying.</strong> Decoding the JSON is
          not verification — anyone can rewrite the payload. Always run the signature
          check against the correct key.
        </p>
        <p>
          <strong>Accepting <code>alg: none</code>.</strong> Older libraries let a client
          switch the algorithm to <code>none</code>, bypassing verification entirely.
          Pin the expected algorithm server-side.
        </p>
        <p>
          <strong>Putting secrets in the payload.</strong> JWTs are signed, not
          encrypted. Anyone with the token can read every claim. Keep sensitive data
          out of it.
        </p>

        <h3>Try It</h3>
        <p>
          Inspect any token with our free{" "}
          <Link href="/tools/jwt-decoder">JWT Decoder</Link> — it formats timestamps
          and never sends your token anywhere.
        </p>
      </section>

      <section className="features" aria-label="Takeaways">
        {[
          { icon: <KeyRound size={24} />, title: "Signed, not encrypted", desc: "Payload is readable to anyone — don't put secrets in it." },
          { icon: <ShieldAlert size={24} />, title: "Pin the algorithm",   desc: "Reject tokens whose alg differs from what you expect." },
          { icon: <Clock size={24} />, title: "Short expiry wins",         desc: "Use short-lived access tokens plus refresh tokens." },
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
