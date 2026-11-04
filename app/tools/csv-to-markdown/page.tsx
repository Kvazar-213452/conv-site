export const dynamic = "force-static";

import type { Metadata } from "next";
import Script from "next/script";
import CsvToMarkdown from "./CsvToMarkdown";
import { MAIN_DOMEN, NAME_MAKE } from "@/lib/config";

const PAGE_URL = `${MAIN_DOMEN}tools/csv-to-markdown`;

export const metadata: Metadata = {
  title: "CSV to Markdown Table – GitHub-Ready Output",
  description: "Convert CSV, TSV, or semicolon-separated data into a GitHub-flavored Markdown table with aligned columns. Handles quoted fields, embedded commas, and newlines. 100% client-side.",
  keywords: [
    "csv to markdown",
    "csv to markdown table",
    "tsv to markdown",
    "gfm table generator",
    "excel to markdown",
    "spreadsheet to markdown",
    "github markdown table",
    "online tool",
    "client-side",
    "private tool",
    "no sign-up",
    "free developer tool"
  ],
  authors: [{ name: NAME_MAKE }],
  alternates: { canonical: "/tools/csv-to-markdown" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "CSV to Markdown Table Online",
    description: "GitHub-flavored Markdown tables from CSV in your browser.",
    url: PAGE_URL,
    type: "website",
    images: [{ url: `${MAIN_DOMEN}og-image.png`, width: 1024, height: 1024, alt: "CSV to Markdown" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "CSV to Markdown Table",
    description: "Aligned, GFM-compliant Markdown tables from CSV.",
  },
};

const JSONLD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "CSV to Markdown Table",
      url: PAGE_URL,
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Any (browser)",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      description: "Convert CSV, TSV, or semicolon-separated data to a GitHub-flavored Markdown table with aligned columns.",
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Does it handle quoted fields with commas and newlines?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Standard CSV quoting is parsed correctly: embedded commas, newlines, and double-quote escapes all survive.",
          },
        },
        {
          "@type": "Question",
          name: "Can I use a semicolon delimiter?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Choose semicolon or tab from the Delimiter dropdown. European Excel exports typically use semicolons.",
          },
        },
        {
          "@type": "Question",
          name: "Is my data uploaded anywhere?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. Parsing and emission happen in your browser — safe for internal data and confidential exports.",
          },
        },
      ],
    },
  ],
};

export default function CsvToMarkdownPage() {
  return (
    <>
      <Script
        id="csv-to-markdown-jsonld"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSONLD) }}
      />
      <CsvToMarkdown />
    </>
  );
}
