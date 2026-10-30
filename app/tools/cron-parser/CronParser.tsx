"use client";

import { useState, useMemo } from "react";
import { Clock, Calendar, Zap } from "lucide-react";
import Link from "next/link";
import {
  parseCron,
  describeCron,
  nextRuns,
  COMMON_EXAMPLES,
  type ParsedCron,
} from "./utils";

import "@/style/main.css";
import "./main.css";

export default function CronParser() {
  const [expr, setExpr] = useState("*/5 * * * *");

  const { parsed, description, runs, error } = useMemo(() => {
    try {
      const parsed: ParsedCron = parseCron(expr);
      const description = describeCron(parsed);
      const runs = nextRuns(parsed, new Date(), 5);
      return { parsed, description, runs, error: "" };
    } catch (e) {
      return { parsed: null, description: "", runs: [], error: (e as Error).message };
    }
  }, [expr]);

  const loadPreset = (p: string) => setExpr(p);

  return (
    <>
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-eyebrow">
          <div className="hero-dot" aria-hidden="true" />
          Free · No sign-up · Runs in browser
        </div>
        <h1 id="hero-heading">
          Cron <em>Parser</em>
        </h1>
        <p>
          Translate any cron expression to plain English and preview the next five
          execution times. Supports standard 5-field and 6-field (seconds) cron syntax,
          month/day name aliases, ranges, lists, and steps. Everything runs locally.
        </p>
      </section>

      {error && (
        <div className="error-bar" role="alert" aria-live="assertive">
          <span aria-hidden="true">✕</span>
          <span>Parse Error: {error}</span>
        </div>
      )}

      <section aria-label="Cron Parser">
        <div className="converter">

          <div className={`panel${error ? " has-error" : ""}`}>
            <div className="panel-header">
              <div className="panel-title">
                <div className="dot json" aria-hidden="true" />
                Cron Expression
              </div>
            </div>
            <textarea
              aria-label="Cron expression"
              placeholder="e.g. */5 * * * *"
              value={expr}
              onChange={(e) => setExpr(e.target.value)}
              spellCheck={false} autoCorrect="off" autoCapitalize="off"
            />
            <div className="cp-presets">
              {COMMON_EXAMPLES.map(({ expr: ex, label }) => (
                <button
                  key={ex}
                  className="cp-preset"
                  title={label}
                  onClick={() => loadPreset(ex)}
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>

          <div className={`panel${parsed ? " has-output" : ""}`}>
            <div className="panel-header">
              <div className="panel-title">
                <div className="dot yaml" aria-hidden="true" />
                Human-Readable
                {parsed && <span className="success-tag">✓ parsed</span>}
              </div>
            </div>

            {!parsed && (
              <pre className="output-pre empty" aria-live="polite">
                {`// A valid cron expression will be explained here…`}
              </pre>
            )}
            {parsed && (
              <div className="cp-list" aria-live="polite">
                <div className="cp-describe">{description}.</div>

                <div className="cp-group-title">Next 5 runs (local time)</div>
                <div className="cp-runs">
                  {runs.length === 0 && <span>No upcoming runs found within the search window.</span>}
                  {runs.map((d, i) => (
                    <code key={i}>{d.toLocaleString()}</code>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      </section>

      <section className="seo-content" aria-labelledby="about-heading">
        <h2 id="about-heading">About the Cron Expression Parser</h2>
        <p>
          This free online cron parser decodes any Unix-style cron expression into plain
          English and shows the next five scheduled run times in your local timezone.
          Perfect for debugging crontab entries, Kubernetes CronJobs, GitHub Actions
          schedule triggers, GitLab CI/CD cron rules, AWS EventBridge expressions,
          Vercel Cron jobs, and any other scheduler that speaks cron.
        </p>

        <h3>Cron Field Reference</h3>
        <p>
          A standard cron expression has five fields:
          {" "}<code>minute (0–59) hour (0–23) day-of-month (1–31) month (1–12) day-of-week (0–6)</code>.
          The optional 6-field form prepends a seconds field (0–59). Both forms are
          supported here.
        </p>

        <h3>Supported Operators</h3>
        <ul>
          <li><code>*</code> — every value in the field</li>
          <li><code>,</code> — list, e.g. <code>1,15,30</code></li>
          <li><code>-</code> — range, e.g. <code>1-5</code> (Monday–Friday)</li>
          <li><code>/</code> — step, e.g. <code>*/5</code> every five units</li>
          <li>Month aliases: <code>JAN</code>…<code>DEC</code></li>
          <li>Day-of-week aliases: <code>SUN</code>…<code>SAT</code> (both 0 and 7 mean Sunday)</li>
        </ul>

        <h3>Common Cron Recipes</h3>
        <ul>
          <li><code>* * * * *</code> — every minute</li>
          <li><code>*/5 * * * *</code> — every five minutes</li>
          <li><code>0 * * * *</code> — hourly on the hour</li>
          <li><code>0 9 * * 1-5</code> — weekdays at 9:00 AM</li>
          <li><code>0 0 1 * *</code> — first day of every month at midnight</li>
          <li><code>30 2 * * 6</code> — Saturdays at 2:30 AM</li>
          <li><code>0 0 1 1 *</code> — once a year on January 1st at midnight</li>
        </ul>

        <h3>The Day-of-Month / Day-of-Week Quirk</h3>
        <p>
          When <em>both</em> day-of-month and day-of-week are restricted (not
          <code>*</code>), classic Vixie cron behaves as an <strong>OR</strong>: the job
          runs if either field matches. Our parser follows that convention, matching
          most server crons and Kubernetes CronJobs. If your scheduler differs, verify
          with its own docs.
        </p>

        <h3>Timezone Behavior</h3>
        <p>
          The next-run preview is computed in your browser's local timezone. Server
          crontabs usually run in UTC (or the system timezone). Kubernetes CronJobs
          default to UTC; Vercel Cron and GitHub Actions also use UTC. If your schedule
          looks "off by an hour", timezone is almost always the cause.
        </p>

        <h3>Frequently Asked Questions</h3>

        <h3>Does this tool support non-standard extensions?</h3>
        <p>
          Core syntax, ranges, lists, steps, and name aliases are supported. Quartz-only
          extensions (<code>L</code>, <code>W</code>, <code>#</code>) and the
          <code>?</code> wildcard are not — they are not part of the Vixie/POSIX cron
          grammar used by most Linux servers.
        </p>

        <h3>Can I schedule something every N seconds?</h3>
        <p>
          Yes — use the 6-field form. For example, <code>*/10 * * * * *</code> runs
          every ten seconds. Note that most POSIX cron implementations only support the
          5-field form; 6-field cron is common in Quartz, Spring, and Kubernetes
          CronJobs (via <code>schedulingPolicy</code> extensions).
        </p>

        <h3>What is the difference between <code>0 */2 * * *</code> and <code>*/2 * * * *</code>?</h3>
        <p>
          The first runs at minute 0 of every second hour (12:00, 2:00, 4:00…). The
          second runs every two minutes (12:00, 12:02, 12:04…). The <code>*/N</code>
          step applies to the field it appears in, not the whole expression.
        </p>

        <h3>Related Tools and Guides</h3>
        <p>
          Convert between Unix timestamps and human dates with our{" "}
          <Link href="/tools/date-to-unix-timestamp">Date ↔ Timestamp converter</Link>.
          Debugging a regex-driven scheduler? Try the{" "}
          <Link href="/tools/regex-tester">Regex Tester</Link>.
        </p>
      </section>

      <section className="features" aria-label="Features">
        {[
          { icon: <Clock size={24} />,    title: "Instant parsing",   desc: "Live validation and translation to plain English as you type." },
          { icon: <Calendar size={24} />, title: "Next 5 runs",       desc: "Preview the next five executions in your local timezone." },
          { icon: <Zap size={24} />,      title: "5 and 6 field forms", desc: "Standard POSIX cron plus the optional seconds field used by Quartz and K8s." },
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
