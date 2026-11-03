export const dynamic = "force-static";

import type { Metadata } from "next";
import Script from "next/script";
import UuidGenerator from "./UuidGenerator";
import { MAIN_DOMEN, NAME_MAKE } from "@/lib/config";

const PAGE_URL = `${MAIN_DOMEN}tools/uuid-generator`;

export const metadata: Metadata = {
  title: "UUID Generator – v4, v7, Nil — 100% Client-Side",
  description: "Generate UUID v4 (random), UUID v7 (time-ordered, RFC 9562), or nil UUIDs — up to 1000 at a time. Uses crypto.getRandomValues. Private, free, no sign-up.",
  keywords: [
    "uuid generator",
    "uuid v4",
    "uuid v7",
    "generate uuid",
    "random uuid",
    "guid generator",
    "nil uuid",
    "unique identifier",
    "primary key generator",
    "bulk uuid",
    "online uuid",
    "client-side",
    "no sign-up",
    "free developer tool"
  ],
  authors: [{ name: NAME_MAKE }],
  alternates: { canonical: "/tools/uuid-generator" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "UUID Generator Online",
    description: "Generate UUID v4 or v7 — up to 1000 at a time, fully client-side.",
    url: PAGE_URL,
    type: "website",
    images: [{ url: `${MAIN_DOMEN}icon.png`, width: 1200, height: 630, alt: "UUID Generator" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "UUID Generator Online",
    description: "v4, v7, nil — in your browser.",
  },
};

const JSONLD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "UUID Generator",
      url: PAGE_URL,
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Any (browser)",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      description: "Generate UUID v4, v7, and nil identifiers — up to 1000 at a time — in the browser using crypto.getRandomValues.",
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Is this UUID generator cryptographically secure?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. v4 uses the browser's crypto.getRandomValues CSPRNG. Collision probability in a 122-bit v4 UUID is effectively zero even after billions of generations.",
          },
        },
        {
          "@type": "Question",
          name: "Should I use UUID v4 or v7?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "v7 is monotonic (time-ordered) and kinder to database indexes, so use it for new primary keys. v4 remains the ubiquitous choice for legacy compatibility.",
          },
        },
        {
          "@type": "Question",
          name: "Are generated UUIDs sent to a server?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. All UUIDs are generated locally in your browser and never logged or stored.",
          },
        },
      ],
    },
  ],
};

export default function UuidGeneratorPage() {
  return (
    <>
      <Script id="uuid-generator-jsonld" type="application/ld+json" strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSONLD) }} />
      <UuidGenerator />
    </>
  );
}
