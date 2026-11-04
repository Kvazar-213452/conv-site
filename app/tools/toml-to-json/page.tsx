export const dynamic = "force-static";

import type { Metadata } from "next";
import Script from "next/script";
import TomlToJson from "./TomlToJson";
import { MAIN_DOMEN, NAME_MAKE } from "@/lib/config";

const PAGE_URL = `${MAIN_DOMEN}tools/toml-to-json`;

export const metadata: Metadata = {
  title: "TOML to JSON Converter – Bidirectional",
  description: "Convert TOML to JSON and JSON to TOML with support for tables, dotted keys, inline tables, and arrays of tables. Perfect for Cargo.toml and pyproject.toml. 100% client-side.",
  keywords: [
    "toml to json",
    "json to toml",
    "toml converter",
    "cargo.toml",
    "pyproject.toml",
    "hugo config",
    "zola config",
    "rust config",
    "python config",
    "config converter",
    "online tool",
    "client-side",
    "private tool",
    "no sign-up",
    "free developer tool"
  ],
  authors: [{ name: NAME_MAKE }],
  alternates: { canonical: "/tools/toml-to-json" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "TOML to JSON Converter Online",
    description: "Bidirectional TOML ↔ JSON for Cargo.toml, pyproject.toml, Hugo, and Zola.",
    url: PAGE_URL,
    type: "website",
    images: [{ url: `${MAIN_DOMEN}og-image.png`, width: 1024, height: 1024, alt: "TOML to JSON" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "TOML to JSON Converter",
    description: "Bidirectional config converter — 100% client-side.",
  },
};

const JSONLD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "TOML to JSON Converter",
      url: PAGE_URL,
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Any (browser)",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      description: "Convert TOML to JSON and back with support for tables, dotted keys, inline tables, and arrays of tables.",
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Does it fully support TOML 1.0?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "It supports the common 95% of TOML 1.0: tables, dotted keys, inline tables, arrays of tables, underscores in numbers, and hex/octal/binary integers.",
          },
        },
        {
          "@type": "Question",
          name: "How are TOML datetimes handled?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "JSON has no datetime type, so TOML datetimes are preserved as ISO 8601 strings on both sides of the conversion.",
          },
        },
        {
          "@type": "Question",
          name: "Is my config sent to a server?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. Parsing and emitting happen in your browser — safe for configs with API keys and credentials.",
          },
        },
      ],
    },
  ],
};

export default function TomlToJsonPage() {
  return (
    <>
      <Script
        id="toml-to-json-jsonld"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSONLD) }}
      />
      <TomlToJson />
    </>
  );
}
