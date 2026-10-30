"use client";

import { useState, useMemo } from "react";
import { Network, Zap, Lock } from "lucide-react";
import Link from "next/link";
import { parseCidr, classifyNetwork } from "./utils";

import "@/style/main.css";
import "./main.css";

const PRESETS = [
  "192.168.1.0/24",
  "10.0.0.0/8",
  "172.16.0.0/12",
  "10.0.0.0/16",
  "203.0.113.0/26",
];

export default function CidrCalculator() {
  const [input, setInput] = useState("192.168.1.0/24");

  const { info, kind, error } = useMemo(() => {
    try {
      const info = parseCidr(input);
      return { info, kind: classifyNetwork(info), error: "" };
    } catch (e) {
      return { info: null, kind: "", error: (e as Error).message };
    }
  }, [input]);

  const rows: [string, string][] = info ? [
    ["CIDR notation",  info.cidr],
    ["Netmask",        info.mask],
    ["Wildcard",       info.wildcard],
    ["Network",        info.network],
    ["Broadcast",      info.broadcast],
    ["First host",     info.firstHost],
    ["Last host",      info.lastHost],
    ["Total addresses", String(info.totalHosts)],
    ["Usable hosts",   String(info.usableHosts)],
  ] : [];

  return (
    <>
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-eyebrow">
          <div className="hero-dot" aria-hidden="true" />
          Free · No sign-up · Runs in browser
        </div>
        <h1 id="hero-heading">
          CIDR <em>Calculator</em>
        </h1>
        <p>
          Parse any IPv4 CIDR block and get the netmask, wildcard, network and
          broadcast addresses, first and last usable host, total host count, and
          classification (private, public, loopback, multicast). All computed locally.
        </p>
      </section>

      {error && (
        <div className="error-bar" role="alert" aria-live="assertive">
          <span aria-hidden="true">✕</span>
          <span>Parse Error: {error}</span>
        </div>
      )}

      <section aria-label="CIDR Calculator">
        <div className="converter">

          <div className={`panel${error ? " has-error" : ""}`}>
            <div className="panel-header">
              <div className="panel-title">
                <div className="dot json" aria-hidden="true" />
                CIDR Input
              </div>
              <div className="panel-actions">
                <button className="btn-ghost" onClick={() => setInput("")}>Clear</button>
              </div>
            </div>
            <textarea
              aria-label="CIDR"
              placeholder="e.g. 192.168.1.0/24"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              spellCheck={false} autoCorrect="off" autoCapitalize="off"
            />
            <div className="cp-presets" style={{ padding: "10px 14px", borderTop: "1px solid var(--color-border)", background: "var(--color-accent-soft)", display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {PRESETS.map((p) => (
                <button
                  key={p}
                  onClick={() => setInput(p)}
                  style={{
                    fontFamily: "'Geist Mono', monospace",
                    fontSize: "11px",
                    padding: "4px 10px",
                    borderRadius: "999px",
                    border: "1px solid var(--color-border-bright)",
                    background: "transparent",
                    color: "var(--color-text-muted)",
                    cursor: "pointer",
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className={`panel${info ? " has-output" : ""}`}>
            <div className="panel-header">
              <div className="panel-title">
                <div className="dot yaml" aria-hidden="true" />
                Subnet Info
                {info && <span className="success-tag">✓ parsed</span>}
              </div>
            </div>

            {!info && (
              <pre className="output-pre empty" aria-live="polite">
                {`// Subnet details will appear here…`}
              </pre>
            )}
            {info && (
              <>
                <div className="cidr-list" aria-live="polite">
                  <div className="cidr-row" style={{ gridTemplateColumns: "1fr auto" }}>
                    <span className="cidr-label">Classification</span>
                    <span className="cidr-badge">{kind}</span>
                  </div>
                  {rows.map(([label, value]) => (
                    <div className="cidr-row" key={label}>
                      <span className="cidr-label">{label}</span>
                      <code className="cidr-value">{value}</code>
                      <span />
                    </div>
                  ))}
                </div>
                <div className="cidr-binary">
                  <strong style={{ color: "var(--color-text)" }}>Range (binary):</strong>
                  <br />
                  {info.rangeBinary}
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="seo-content" aria-labelledby="about-heading">
        <h2 id="about-heading">About the CIDR Calculator</h2>
        <p>
          This free online CIDR (Classless Inter-Domain Routing) calculator takes any
          IPv4 CIDR block and returns the netmask, wildcard, network and broadcast
          addresses, first and last usable host, total host count, and RFC-1918
          classification. Perfect for subnetting homework, VPC design, firewall rule
          review, and network troubleshooting.
        </p>

        <h3>What CIDR Notation Means</h3>
        <p>
          CIDR writes an IPv4 subnet as <code>network/prefix</code>, where the prefix
          is the number of leading 1-bits in the netmask. For example,
          <code> 192.168.1.0/24</code> covers 256 addresses with mask
          <code>255.255.255.0</code>; the first and last are reserved for the network
          and broadcast, leaving 254 usable host addresses.
        </p>

        <h3>Common Prefixes</h3>
        <ul>
          <li><code>/8</code> — 16 777 216 addresses (whole Class A range)</li>
          <li><code>/16</code> — 65 536 addresses (whole Class B range)</li>
          <li><code>/24</code> — 256 addresses (typical LAN segment)</li>
          <li><code>/28</code> — 16 addresses (small VPC subnet)</li>
          <li><code>/30</code> — 4 addresses (point-to-point link)</li>
          <li><code>/31</code> — 2 addresses (RFC 3021 point-to-point, no broadcast)</li>
          <li><code>/32</code> — single host route</li>
        </ul>

        <h3>Private vs Public Ranges</h3>
        <ul>
          <li>RFC 1918 Class A: <code>10.0.0.0/8</code></li>
          <li>RFC 1918 Class B: <code>172.16.0.0/12</code></li>
          <li>RFC 1918 Class C: <code>192.168.0.0/16</code></li>
          <li>Loopback: <code>127.0.0.0/8</code></li>
          <li>Link-local (APIPA): <code>169.254.0.0/16</code></li>
          <li>Multicast: <code>224.0.0.0/4</code></li>
        </ul>

        <h3>Frequently Asked Questions</h3>

        <h3>Why do /31 and /32 report different host counts?</h3>
        <p>
          A <code>/32</code> is a single-host route — one address, no broadcast. A
          <code>/31</code> under RFC 3021 is used for point-to-point links and treats
          both addresses as usable (no broadcast reservation). Classic subnets of
          <code>/30</code> and larger lose two addresses to the network and broadcast
          reservations.
        </p>

        <h3>Is this calculator aware of my local timezone or network?</h3>
        <p>
          No. It operates on the input text only. Nothing is probed, resolved, or
          sent to a server.
        </p>

        <h3>Does it handle IPv6?</h3>
        <p>
          Not yet — this release covers IPv4 subnets. IPv6 planning typically uses
          <code>/64</code> or shorter prefixes with a different allocation model.
        </p>

        <h3>Related Tools</h3>
        <p>
          Convert IP addresses to binary and back with the{" "}
          <Link href="/tools/number-base-converter">Number Base Converter</Link>.
          Comparing config files with CIDR entries? The{" "}
          <Link href="/tools/json-diff">JSON Diff</Link> tool is handy.
        </p>
      </section>

      <section className="features" aria-label="Features">
        {[
          { icon: <Network size={24} />, title: "Full subnet info", desc: "Netmask, wildcard, network, broadcast, host range, and host count." },
          { icon: <Zap size={24} />,     title: "Live parsing",      desc: "Updates instantly as you type; one-click presets for common blocks." },
          { icon: <Lock size={24} />,    title: "Fully private",     desc: "Nothing is probed or sent — safe for internal VPC and firewall notes." },
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
