export const dynamic = "force-static";

import type { Metadata } from "next";
import Script from "next/script";
import JsonDiff from "./JsonDiff";
import { MAIN_DOMEN, NAME_MAKE } from "@/lib/config";

const PAGE_URL = `${MAIN_DOMEN}tools/json-diff`;

export const metadata: Metadata = {
  title: "JSON Diff – Semantic Structural Comparison",
  description: "Compare two JSON documents structurally, ignoring whitespace and key order. Every change shown as a dotted path with before/after values. 100% client-side.",
  keywords: [
    "json diff",
    "json compare",
    "structural json diff",
    "semantic json diff",
    "compare json",
    "json comparison",
    "api diff",
    "config diff",
    "online tool",
    "client-side",
    "private tool",
    "no sign-up",
    "free developer tool"
  ],
  authors: [{ name: NAME_MAKE }],
  alternates: { canonical: "/tools/json-diff" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "JSON Diff Online",
    description: "Semantic JSON diff with dotted paths and before/after values.",
    url: PAGE_URL,
    type: "website",
    images: [{ url: `${MAIN_DOMEN}icon.png`, width: 1200, height: 630, alt: "JSON Diff" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "JSON Diff Online",
    description: "Compare JSON structurally — key order and whitespace ignored.",
  },
};

const JSONLD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "JSON Diff",
      url: PAGE_URL,
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Any (browser)",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      description: "Semantic JSON diff that ignores whitespace and key order; reports changes as dotted paths.",
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "How is this different from a line-based diff?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "A line-based diff treats reordered keys and whitespace changes as modifications. This tool walks the JSON tree and reports only genuine data differences.",
          },
        },
        {
          "@type": "Question",
          name: "How are arrays compared?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Arrays are compared by index. For ordered logs where inserts shift every index, a line diff is often more useful.",
          },
        },
        {
          "@type": "Question",
          name: "Does my JSON leave the browser?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. Both inputs stay in your browser — safe for API payloads with tokens or personal data.",
          },
        },
      ],
    },
  ],
};

export default function JsonDiffPage() {
  return (
    <>
      <Script
        id="json-diff-jsonld"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSONLD) }}
      />
      <JsonDiff />
    </>
  );
}
