"use client";

import { Database, Zap, Eye } from "lucide-react";
import Link from "next/link";

import "@/style/main.css";

const BEFORE = `select u.id,u.email,count(o.id) as total from users u left join orders o on o.user_id=u.id where u.active=true and u.created_at>'2024-01-01' group by u.id,u.email having count(o.id)>5 order by total desc limit 50;`;

const AFTER = `SELECT u.id,
       u.email,
       COUNT(o.id) AS total
FROM users AS u
  LEFT JOIN orders AS o
    ON o.user_id = u.id
WHERE u.active = TRUE
  AND u.created_at > '2024-01-01'
GROUP BY u.id,
         u.email
HAVING COUNT(o.id) > 5
ORDER BY total DESC
LIMIT 50;`;

export default function SqlFormattingGuide() {
  return (
    <>
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-eyebrow">
          <div className="hero-dot" aria-hidden="true" />
          SQL · Style · Code Review
        </div>
        <h1 id="hero-heading">
          SQL Formatting <em>Guide</em>
        </h1>
        <p>
          Readable SQL takes seconds to format and saves hours in code review and
          incident response. Here is a pragmatic style guide for the queries you
          write every day.
        </p>
      </section>

      <section aria-label="Example">
        <div className="converter">
          <div className="panel">
            <div className="panel-header">
              <div className="panel-title">
                <div className="dot json" aria-hidden="true" />
                Before
              </div>
            </div>
            <pre className="output-pre" style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
              {BEFORE}
            </pre>
          </div>
          <div className="panel">
            <div className="panel-header">
              <div className="panel-title">
                <div className="dot yaml" aria-hidden="true" />
                After
              </div>
            </div>
            <pre className="output-pre">{AFTER}</pre>
          </div>
        </div>
      </section>

      <section className="seo-content" aria-labelledby="about-heading">
        <h2 id="about-heading">Why Formatting Beats Cleverness</h2>
        <p>
          A production query lives longer than the ticket that produced it, and
          the person who has to debug it at 3 AM is almost never the person who
          wrote it. Formatting is the cheapest investment with the biggest return.
        </p>

        <h3>One Clause Per Line</h3>
        <p>
          Put each major clause (<code>SELECT</code>, <code>FROM</code>,
          <code> WHERE</code>, <code>GROUP BY</code>, <code>ORDER BY</code>,
          <code> LIMIT</code>) at the start of a line. The query's shape becomes
          scannable at a glance; missing joins and forgotten WHERE clauses jump out.
        </p>

        <h3>Uppercase Keywords</h3>
        <p>
          Keywords in uppercase, identifiers in lowercase. It is a 1980s habit, but
          it still works: your eye separates control flow from data on contrast
          alone. Most dialects are case-insensitive for keywords, so this is purely
          cosmetic — and that is the point.
        </p>

        <h3>Column Lists: Comma-First or Comma-Last</h3>
        <p>
          Pick one and stick to it. Comma-first (<code>, column</code>) makes it
          easier to add or remove the last column in a diff. Comma-last is more
          common and reads more naturally in English. The <strong>bad</strong>
          choice is both styles in the same codebase.
        </p>

        <h3>Alias Everything</h3>
        <p>
          Give every joined table a short alias (<code>users u</code>,
          <code> orders o</code>) and qualify every column with its alias. When a
          column later gets added to a joined table, you avoid "ambiguous column"
          errors and PR churn.
        </p>

        <h3>JOIN Readability</h3>
        <p>
          <code>LEFT JOIN</code> on its own line, <code>ON</code> indented beneath
          it. Multiple JOINs stack naturally and the join order becomes obvious.
          Prefer explicit <code>JOIN</code>s over comma-separated FROM lists —
          implicit cross joins are a classic foot-gun.
        </p>

        <h3>WHERE Conditions</h3>
        <p>
          One condition per line, with <code>AND</code> / <code>OR</code> at the
          <strong> start</strong> of each line (not the end). It makes commenting
          out a condition a one-line change instead of a two-line one and keeps
          the operator visible on the left margin where you expect it.
        </p>

        <h3>Comments</h3>
        <p>
          Use <code>-- …</code> for short notes above a clause, and <code>/* … */</code>
          for anything spanning more than a line. Explain <em>why</em> you added a
          window function or picked an index hint, not <em>what</em> the SQL does
          — well-formatted SQL already shows that.
        </p>

        <h3>Dialect Pitfalls</h3>
        <ul>
          <li><strong>Postgres</strong> is case-sensitive for quoted identifiers; <code>"User"</code> and <code>User</code> are different</li>
          <li><strong>MySQL</strong> treats <code>''</code> as a legitimate zero-length string, Postgres treats it as NULL in some contexts</li>
          <li><strong>SQLite</strong> stores dynamic types; a column declared INTEGER happily stores strings</li>
          <li><strong>MSSQL</strong> uses <code>TOP n</code>; everyone else uses <code>LIMIT</code></li>
          <li>String concatenation: <code>||</code> (Postgres, SQLite), <code>CONCAT()</code> (MySQL/MSSQL), <code>+</code> (MSSQL only)</li>
        </ul>

        <h3>Try It</h3>
        <p>
          Format any query instantly with our free{" "}
          <Link href="/tools/sql-formatter">SQL Formatter</Link>. If you are
          generating INSERT statements from JSON, see the{" "}
          <Link href="/tools/json-to-postgresql">JSON → PostgreSQL</Link> tool.
        </p>
      </section>

      <section className="features" aria-label="Takeaways">
        {[
          { icon: <Database size={24} />, title: "One clause per line", desc: "SELECT / FROM / WHERE / GROUP / ORDER each at column zero." },
          { icon: <Zap size={24} />,      title: "Alias everything",     desc: "Short table aliases save you from ambiguous-column churn later." },
          { icon: <Eye size={24} />,      title: "Operators on the left", desc: "AND/OR at the start of a line reads better and diffs cleaner." },
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
