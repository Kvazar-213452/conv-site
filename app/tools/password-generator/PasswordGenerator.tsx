"use client";

import { useState, useCallback, useEffect } from "react";
import { KeyRound, Lock, Shuffle, ArrowRight } from "lucide-react";
import {
  generatePassword,
  estimateStrength,
  DEFAULT_PASSWORD_OPTIONS,
  type PasswordOptions,
  type StrengthLevel,
} from "./utils";

import "@/style/main.css";
import "@/style/bar.css";
import "./main.css";

const LEVEL_WIDTH: Record<StrengthLevel, string> = {
  weak: "25%",
  fair: "55%",
  strong: "80%",
  excellent: "100%",
};

export default function PasswordGenerator() {
  const [opts, setOpts] = useState<PasswordOptions>(DEFAULT_PASSWORD_OPTIONS);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);

  const generate = useCallback(() => {
    setError("");
    setGenerating(true);
    setTimeout(() => {
      try {
        setPassword(generatePassword(opts));
      } catch (e) {
        setError((e as Error).message);
        setPassword("");
      }
      setGenerating(false);
    }, 220);
  }, [opts]);

  useEffect(() => { generate(); /* initial */ /* eslint-disable-next-line */ }, []);

  const copyPassword = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const setOpt = <K extends keyof PasswordOptions>(key: K, val: PasswordOptions[K]) => {
    setOpts((prev) => ({ ...prev, [key]: val }));
  };

  const strength = password ? estimateStrength(password) : null;

  return (
    <>
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-eyebrow">
          <div className="hero-dot" aria-hidden="true" />
          Free · No sign-up · Runs in browser
        </div>
        <h1 id="hero-heading">
          Password <em>Generator</em>
        </h1>
        <p>
          Generate strong, cryptographically secure passwords right in your browser.
          Powered by <code>crypto.getRandomValues</code> — no network calls, no logging.
        </p>
      </section>

      {error && (
        <div className="error-bar" role="alert" aria-live="assertive">
          <span aria-hidden="true">✕</span>
          <span>Error: {error}</span>
        </div>
      )}

      <section aria-label="Password Generator">
        <div className="converter">

          <div className="panel">
            <div className="panel-header">
              <div className="panel-title">
                <div className="dot json" aria-hidden="true" />
                Options
              </div>
            </div>
            <pre className="output-pre empty" aria-hidden="true">
              {`// Configure length and character sets below.
// Click Generate for a fresh password.`}
            </pre>
          </div>

          <div className={`panel${password ? " has-output" : ""}`}>
            <div className="panel-header">
              <div className="panel-title">
                <div className="dot yaml" aria-hidden="true" />
                Password
                {password && !generating && <span className="success-tag">✓ generated</span>}
              </div>
              {password && !generating && (
                <div className="panel-actions">
                  <button className="btn-ghost" onClick={copyPassword}>
                    {copied ? "✓ Copied!" : "Copy"}
                  </button>
                  <button className="btn-ghost" onClick={generate} title="Regenerate">
                    <Shuffle size={13} aria-hidden="true" /> Shuffle
                  </button>
                </div>
              )}
            </div>

            <div
              className={`pg-output${password && !generating ? "" : " empty"}`}
              aria-live="polite"
            >
              {generating
                ? "// Generating…"
                : password || "// Your password will appear here…"}
            </div>

            {strength && !generating && (
              <div className="pg-meter" aria-label="Password strength">
                <div className="pg-meter-head">
                  <span>Strength</span>
                  <span>
                    <span className="pg-level">{strength.level}</span>{" "}
                    · {strength.entropyBits} bits
                  </span>
                </div>
                <div className="pg-meter-bar">
                  <div
                    className={`pg-meter-fill ${strength.level}`}
                    style={{ width: LEVEL_WIDTH[strength.level] }}
                  />
                </div>
              </div>
            )}
          </div>

        </div>

        <div className="options-bar">
          <label>
            Length:
            <input
              type="number"
              min={4}
              max={256}
              value={opts.length}
              onChange={(e) => setOpt("length", Math.max(4, parseInt(e.target.value) || 4))}
            />
          </label>
          <label>
            <input
              type="checkbox"
              checked={opts.lowercase}
              onChange={(e) => setOpt("lowercase", e.target.checked)}
            />
            a-z
          </label>
          <label>
            <input
              type="checkbox"
              checked={opts.uppercase}
              onChange={(e) => setOpt("uppercase", e.target.checked)}
            />
            A-Z
          </label>
          <label>
            <input
              type="checkbox"
              checked={opts.digits}
              onChange={(e) => setOpt("digits", e.target.checked)}
            />
            0-9
          </label>
          <label>
            <input
              type="checkbox"
              checked={opts.symbols}
              onChange={(e) => setOpt("symbols", e.target.checked)}
            />
            Symbols
          </label>
          <label>
            <input
              type="checkbox"
              checked={opts.excludeAmbiguous}
              onChange={(e) => setOpt("excludeAmbiguous", e.target.checked)}
            />
            Exclude ambiguous (0 O 1 l I)
          </label>
        </div>

        <div className="actions">
          <button
            className="btn-convert"
            onClick={generate}
            disabled={generating}
            aria-busy={generating}
          >
            {generating
              ? <><div className="btn-spinner" aria-hidden="true" /> Generating…</>
              : <><ArrowRight size={16} aria-hidden="true" className="mr-1" /> Generate Password</>
            }
          </button>
        </div>
      </section>

      <section className="seo-content" aria-labelledby="about-heading">
        <h2 id="about-heading">About Password Generator</h2>
        <p>
          This free online password generator produces strong, cryptographically secure passwords
          directly in your browser. Random bytes come from the Web Crypto API
          (<code>crypto.getRandomValues</code>), the same primitive used by browsers to generate
          TLS keys. No server call is made, no password is logged, and nothing is stored.
        </p>

        <h3>How Secure Is It?</h3>
        <p>
          The generator uses the browser's CSPRNG rather than <code>Math.random</code>, which is
          predictable and unsuitable for cryptographic purposes. The included strength meter
          estimates entropy from the character pool and length — above 80 bits is considered
          strong, 128 bits is excellent and well beyond brute-force reach with current hardware.
        </p>

        <h3>Key Benefits</h3>
        <ul>
          <li><strong>Cryptographically secure:</strong> Uses the Web Crypto API, not Math.random</li>
          <li><strong>Fully private:</strong> Passwords are generated locally — nothing is sent to any server</li>
          <li><strong>Configurable:</strong> Length 4–256 and four optional character classes</li>
          <li><strong>Ambiguity filter:</strong> Hide look-alike characters like 0/O and 1/l/I</li>
          <li><strong>Entropy readout:</strong> See the strength and bit-count before you use the password</li>
        </ul>
      </section>

      <section className="features" aria-label="Features">
        {[
          {
            icon: <KeyRound size={24} />,
            title: "Cryptographically secure",
            desc: "Powered by crypto.getRandomValues — the same primitive used for TLS key generation.",
          },
          {
            icon: <Lock size={24} />,
            title: "Fully private",
            desc: "Everything runs locally. Passwords are never sent, logged, or stored anywhere.",
          },
          {
            icon: <Shuffle size={24} />,
            title: "Configurable",
            desc: "Choose length and character classes, exclude look-alike characters, see entropy.",
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
