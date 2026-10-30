export const dynamic = "force-static";

import type { Metadata } from "next";
import Script from "next/script";
import HtmlEntityEncoder from "./HtmlEntityEncoder";
import { MAIN_DOMEN, NAME_MAKE } from "@/lib/config";

const PAGE_URL = `${MAIN_DOMEN}tools/html-entity-encoder`;

export const metadata: Metadata = {
  title: "HTML Entity Encoder & Decoder – XSS-Safe Output",
  description: "Encode HTML entities (named, numeric, hex) and decode entity-encoded strings. Essential for XSS prevention and safe HTML rendering. 100% client-side.",
  keywords: [
    "html entity encoder",
    "html entity decoder",
    "html escape",
    "html unescape",
    "xss prevention",
    "html entities",
    "named entities",
    "numeric entities",
    "online tool",
    "client-side",
    "private tool",
    "no sign-up",
    "free developer tool"
  ],
  authors: [{ name: NAME_MAKE }],
  alternates: { canonical: "/tools/html-entity-encoder" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "HTML Entity Encoder & Decoder",
    description: "Named, numeric, and hex HTML entities — plus a minimal XSS-safe mode.",
    url: PAGE_URL,
    type: "website",
    images: [{ url: `${MAIN_DOMEN}icon.png`, width: 1200, height: 630, alt: "HTML Entity Encoder" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "HTML Entity Encoder & Decoder",
    description: "Safe HTML output in your browser.",
  },
};

const JSONLD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "HTML Entity Encoder & Decoder",
      url: PAGE_URL,
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Any (browser)",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      description: "Encode and decode HTML entities (named, numeric, hex) for safe HTML rendering and XSS prevention.",
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Is HTML entity encoding enough to prevent XSS?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "For HTML text content and most attribute values, yes. Inside <script>, URL attributes, and inline CSS you need context-specific escaping or a safe templating library.",
          },
        },
        {
          "@type": "Question",
          name: "What is the difference between named and numeric entities?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Named entities like &copy; are human-readable but limited to a known set. Numeric entities like &#169; and &#xA9; work for every Unicode code point.",
          },
        },
        {
          "@type": "Question",
          name: "Does my text leave the browser?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. Encoding and decoding happen locally — safe for user-generated content and secrets.",
          },
        },
      ],
    },
  ],
};

export default function HtmlEntityEncoderPage() {
  return (
    <>
      <Script
        id="html-entity-encoder-jsonld"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSONLD) }}
      />
      <HtmlEntityEncoder />
    </>
  );
}
