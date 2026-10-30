export const dynamic = "force-static";

import type { Metadata } from "next";
import Script from "next/script";
import SqlFormatter from "./SqlFormatter";
import { MAIN_DOMEN, NAME_MAKE } from "@/lib/config";

const PAGE_URL = `${MAIN_DOMEN}tools/sql-formatter`;

export const metadata: Metadata = {
  title: "SQL Formatter – Pretty-Print SQL Queries Online",
  description: "Pretty-print any SQL query — SELECT, INSERT, UPDATE, DELETE, DDL — with configurable indentation and uppercase keywords. Works for Postgres, MySQL, SQLite, MSSQL. 100% client-side.",
  keywords: [
    "sql formatter",
    "sql beautifier",
    "pretty print sql",
    "postgres formatter",
    "mysql formatter",
    "sqlite formatter",
    "mssql formatter",
    "query formatter",
    "sql prettier",
    "online tool",
    "client-side",
    "private tool",
    "no sign-up",
    "free developer tool"
  ],
  authors: [{ name: NAME_MAKE }],
  alternates: { canonical: "/tools/sql-formatter" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "SQL Formatter Online",
    description: "Pretty-print SQL queries with configurable indentation and uppercase keywords.",
    url: PAGE_URL,
    type: "website",
    images: [{ url: `${MAIN_DOMEN}icon.png`, width: 1200, height: 630, alt: "SQL Formatter" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "SQL Formatter Online",
    description: "Readable SQL in your browser — no uploads.",
  },
};

const JSONLD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "SQL Formatter",
      url: PAGE_URL,
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Any (browser)",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      description: "Pretty-print SQL queries client-side with configurable indentation and uppercase keywords.",
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Which SQL dialects are supported?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Postgres, MySQL/MariaDB, SQLite, and MSSQL. The formatter is clause-aware rather than a full dialect parser, so uncommon vendor extensions pass through as-is.",
          },
        },
        {
          "@type": "Question",
          name: "Does the formatter validate my SQL?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. Formatting is syntax-agnostic — a query that will not execute still formats. Validate against your actual database.",
          },
        },
        {
          "@type": "Question",
          name: "Is my SQL sent anywhere?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. Parsing and formatting happen entirely in your browser — safe for queries referencing internal tables and sensitive columns.",
          },
        },
      ],
    },
  ],
};

export default function SqlFormatterPage() {
  return (
    <>
      <Script
        id="sql-formatter-jsonld"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSONLD) }}
      />
      <SqlFormatter />
    </>
  );
}
