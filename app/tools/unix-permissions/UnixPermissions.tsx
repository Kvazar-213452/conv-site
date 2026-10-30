"use client";

import { useState, useMemo } from "react";
import { Terminal, Lock, Shield } from "lucide-react";
import Link from "next/link";
import {
  numericToPerms,
  permsToNumeric,
  permsToSymbolic,
  describePerms,
  EMPTY_PERMS,
  type Perms,
  type Who,
} from "./utils";

import "@/style/main.css";
import "./main.css";

const WHO: Who[] = ["owner", "group", "other"];
const PERMS: ("r" | "w" | "x")[] = ["r", "w", "x"];

export default function UnixPermissions() {
  const [perms, setPerms] = useState<Perms>(() => numericToPerms("755"));
  const [numericInput, setNumericInput] = useState("755");

  const numeric = permsToNumeric(perms);
  const symbolic = permsToSymbolic(perms);
  const description = useMemo(() => describePerms(perms), [perms]);

  const toggleBit = (who: Who, bit: "r" | "w" | "x") => {
    setPerms((p) => ({ ...p, [who]: { ...p[who], [bit]: !p[who][bit] } }));
  };

  const toggleSpecial = (key: "setuid" | "setgid" | "sticky") => {
    setPerms((p) => ({ ...p, [key]: !p[key] }));
  };

  const applyNumeric = () => {
    try {
      const p = numericToPerms(numericInput);
      setPerms(p);
    } catch {
      // ignore invalid input until the user fixes it
    }
  };

  const clearAll = () => { setPerms(EMPTY_PERMS); setNumericInput("000"); };

  return (
    <>
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-eyebrow">
          <div className="hero-dot" aria-hidden="true" />
          Free · No sign-up · Runs in browser
        </div>
        <h1 id="hero-heading">
          Unix <em>Permissions</em>
        </h1>
        <p>
          Translate between <code>chmod</code> numeric notation (755) and symbolic
          notation (<code>rwxr-xr-x</code>), tick checkboxes for each permission,
          and understand setuid, setgid, and the sticky bit at a glance.
        </p>
      </section>

      <section aria-label="Unix Permissions">
        <div className="converter">

          <div className="panel">
            <div className="panel-header">
              <div className="panel-title">
                <div className="dot json" aria-hidden="true" />
                Numeric (chmod)
              </div>
            </div>
            <textarea
              aria-label="Numeric chmod"
              placeholder="e.g. 755 or 0755"
              value={numericInput}
              onChange={(e) => setNumericInput(e.target.value)}
              onBlur={applyNumeric}
              onKeyDown={(e) => { if (e.key === "Enter") applyNumeric(); }}
              spellCheck={false} autoCorrect="off" autoCapitalize="off"
              style={{ minHeight: "80px" }}
            />
            <div className="up-numeric">
              <span><strong>Current:</strong><code>{numeric}</code></span>
              <span><strong>Symbolic:</strong><code>{symbolic}</code></span>
            </div>
            <div className="up-special">
              <label>
                <input
                  type="checkbox"
                  checked={perms.setuid}
                  onChange={() => toggleSpecial("setuid")}
                />
                setuid (4000)
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={perms.setgid}
                  onChange={() => toggleSpecial("setgid")}
                />
                setgid (2000)
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={perms.sticky}
                  onChange={() => toggleSpecial("sticky")}
                />
                sticky (1000)
              </label>
            </div>
          </div>

          <div className="panel has-output">
            <div className="panel-header">
              <div className="panel-title">
                <div className="dot yaml" aria-hidden="true" />
                Permission Matrix
                <span className="success-tag">✓ {numeric}</span>
              </div>
            </div>

            <div className="up-grid">
              <span className="up-head left">Who</span>
              <span className="up-head">Read</span>
              <span className="up-head">Write</span>
              <span className="up-head">Execute</span>

              {WHO.map((w) => (
                <div style={{ display: "contents" }} key={w}>
                  <span className="up-row-label">{w[0].toUpperCase() + w.slice(1)}</span>
                  {PERMS.map((b) => (
                    <div className="up-cell" key={b}>
                      <input
                        className="up-check"
                        type="checkbox"
                        aria-label={`${w} ${b}`}
                        checked={perms[w][b]}
                        onChange={() => toggleBit(w, b)}
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="up-summary" aria-live="polite">
              {description.map((line) => <span key={line}>{line}</span>)}
            </div>
          </div>

        </div>

        <div className="actions">
          <button className="btn-secondary" onClick={() => { setPerms(numericToPerms("755")); setNumericInput("755"); }}>
            755 (dir)
          </button>
          <button className="btn-secondary" onClick={() => { setPerms(numericToPerms("644")); setNumericInput("644"); }}>
            644 (file)
          </button>
          <button className="btn-secondary" onClick={() => { setPerms(numericToPerms("600")); setNumericInput("600"); }}>
            600 (key)
          </button>
          <button className="btn-secondary" onClick={() => { setPerms(numericToPerms("777")); setNumericInput("777"); }}>
            777 (open)
          </button>
          <button className="btn-secondary" onClick={clearAll}>Clear</button>
        </div>
      </section>

      <section className="seo-content" aria-labelledby="about-heading">
        <h2 id="about-heading">About the Unix Permissions Calculator</h2>
        <p>
          Every file and directory on a Unix-like system (Linux, macOS, BSD) carries
          three sets of permissions — for its owner, its group, and everyone else —
          plus three special bits (setuid, setgid, sticky). This free online
          calculator lets you flip between the numeric form used by
          <code> chmod 755 file.sh</code> and the symbolic form shown by
          <code> ls -l</code> (<code>rwxr-xr-x</code>), with a live permission matrix.
        </p>

        <h3>How Octal Notation Works</h3>
        <p>
          Each permission triad is encoded as an octal digit (0–7) where
          <code> r = 4</code>, <code>w = 2</code>, <code>x = 1</code>. Add them up:
          <code> rw- = 6</code>, <code>r-x = 5</code>, <code>rwx = 7</code>. The three
          triads combine to make a three-digit number such as <code>755</code>. A
          leading fourth digit encodes the special bits (<code>4000</code> setuid,
          <code> 2000</code> setgid, <code>1000</code> sticky).
        </p>

        <h3>Common Values</h3>
        <ul>
          <li><code>755</code> — directories, scripts, binaries (owner can edit; others can read + execute)</li>
          <li><code>644</code> — regular files (owner can edit; others read-only)</li>
          <li><code>600</code> — SSH private keys, sensitive configs (owner only)</li>
          <li><code>700</code> — private directories (owner only)</li>
          <li><code>775</code> — group-writable directories (collaborative projects)</li>
          <li><code>777</code> — fully open (almost never correct in production)</li>
        </ul>

        <h3>Special Bits</h3>
        <ul>
          <li><strong>setuid</strong> on an executable runs it with the owner's identity. Classic use: <code>passwd</code>.</li>
          <li><strong>setgid</strong> on a directory causes new files to inherit the directory's group — great for shared folders.</li>
          <li><strong>Sticky bit</strong> on a directory means only the file's owner can delete or rename it. Set on <code>/tmp</code>.</li>
        </ul>

        <h3>Frequently Asked Questions</h3>

        <h3>Why does <code>ls -l</code> sometimes show <code>s</code> or <code>t</code>?</h3>
        <p>
          Capital or lowercase <code>s</code> / <code>t</code> in the symbolic
          output indicate the special bits. Lowercase means the underlying execute
          bit is also set; uppercase means the special bit is set but execute is
          not. See <Link href="/blog/chmod-explained">chmod explained</Link>.
        </p>

        <h3>Can I just use <code>chmod +x</code> instead?</h3>
        <p>
          Yes — <code>chmod +x</code> is a convenience for "add execute for everyone
          who can read". Numeric chmod is more explicit, which is why scripts and
          Dockerfiles usually prefer it.
        </p>

        <h3>Is the calculator aware of my files?</h3>
        <p>
          No. It operates on text only. Nothing is probed, read, or sent to a server.
        </p>

        <h3>Related Tools and Guides</h3>
        <p>
          Read the deep-dive in{" "}
          <Link href="/blog/chmod-explained">chmod explained</Link>, or
          generate secure passwords with the{" "}
          <Link href="/tools/password-generator">Password Generator</Link>.
        </p>
      </section>

      <section className="features" aria-label="Features">
        {[
          { icon: <Terminal size={24} />, title: "Both notations", desc: "Switch between 755 and rwxr-xr-x without doing the math by hand." },
          { icon: <Shield size={24} />,   title: "Special bits",   desc: "setuid, setgid, and sticky bit toggles with inline explanations." },
          { icon: <Lock size={24} />,     title: "Fully private",  desc: "Everything is calculated locally — nothing touches a server." },
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
