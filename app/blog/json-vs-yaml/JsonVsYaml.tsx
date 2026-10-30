"use client";

import { FileCode2, FileJson, Settings2 } from "lucide-react";
import Link from "next/link";

import "@/style/main.css";

const JSON_SAMPLE = `{
  "name": "my-service",
  "replicas": 3,
  "ports": [80, 443],
  "env": {
    "LOG_LEVEL": "info",
    "FEATURE_FLAG": true
  }
}`;

const YAML_SAMPLE = `name: my-service
replicas: 3
ports:
  - 80
  - 443
env:
  LOG_LEVEL: info
  FEATURE_FLAG: true`;

export default function JsonVsYaml() {
  return (
    <>
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-eyebrow">
          <div className="hero-dot" aria-hidden="true" />
          Comparison · Formats · Guide
        </div>
        <h1 id="hero-heading">
          JSON <em>vs</em><br />YAML
        </h1>
        <p>
          Both describe the same data; they only differ in syntax and tooling.
          Here is a practical field guide for choosing between them.
        </p>
      </section>

      <section aria-label="Side-by-side example">
        <div className="converter">
          <div className="panel">
            <div className="panel-header">
              <div className="panel-title">
                <div className="dot json" aria-hidden="true" />
                JSON
              </div>
            </div>
            <pre className="output-pre">{JSON_SAMPLE}</pre>
          </div>
          <div className="panel">
            <div className="panel-header">
              <div className="panel-title">
                <div className="dot yaml" aria-hidden="true" />
                YAML
              </div>
            </div>
            <pre className="output-pre">{YAML_SAMPLE}</pre>
          </div>
        </div>
      </section>

      <section className="seo-content" aria-labelledby="about-heading">
        <h2 id="about-heading">JSON vs YAML: Which Should You Use?</h2>
        <p>
          JSON and YAML are two popular text formats for structured data. JSON is strict,
          minimal, and ships with every programming language. YAML is more human-readable but
          has corner cases that trip up newcomers. Choosing between them comes down to
          <em> who writes the file</em> and <em>what reads it</em>.
        </p>

        <h3>When JSON Wins</h3>
        <p>
          JSON is the right call for machine-produced data: REST and GraphQL payloads, log
          exports, analytics events, inter-service messages, and any format a server
          generates and a server consumes. It parses in a single line of code everywhere,
          there is no indentation to break, and the specification fits on a postcard.
        </p>

        <h3>When YAML Wins</h3>
        <p>
          YAML shines when humans write the file: Kubernetes manifests, GitHub Actions
          workflows, CI/CD pipelines, Ansible playbooks, docker-compose, dotfiles, and
          configuration you expect people to review and edit. Comments, anchors, and
          multi-line strings make YAML genuinely nicer for config.
        </p>

        <h3>Common Pitfalls</h3>
        <ul>
          <li><strong>YAML's Norway problem:</strong> <code>country: NO</code> parses as boolean <code>false</code> in YAML 1.1 — quote the string</li>
          <li><strong>Tabs:</strong> YAML disallows tabs for indentation; use spaces</li>
          <li><strong>JSON duplicate keys:</strong> parsers may silently drop them; linters help</li>
          <li><strong>YAML version differences:</strong> 1.1 vs 1.2 handle booleans differently</li>
          <li><strong>Floating-point surprises:</strong> both formats inherit JavaScript/Python number quirks</li>
        </ul>

        <h3>Interoperability</h3>
        <p>
          Every JSON document is also valid YAML. Converting YAML back to JSON is lossless
          as long as you avoid YAML-only features (anchors, non-string keys, complex tags).
          Use our <Link href="/tools/json-to-yaml">JSON ↔ YAML converter</Link> to flip
          between the two instantly in your browser.
        </p>

        <h3>Decision Rule</h3>
        <p>
          If a machine writes it, pick JSON. If a human writes it and will review it in a
          pull request, pick YAML. For anything in between — mixed authorship, strict
          schemas, large files — JSON with a formatter is usually the safer bet.
        </p>
      </section>

      <section className="features" aria-label="Takeaways">
        {[
          { icon: <FileJson size={24} />, title: "JSON for machines", desc: "APIs, logs, exports — fast, strict, universal." },
          { icon: <FileCode2 size={24} />, title: "YAML for humans",   desc: "Config files reviewed in PRs — comments and anchors help." },
          { icon: <Settings2 size={24} />, title: "Convert either way", desc: "Any JSON is valid YAML; use a converter when systems disagree." },
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
