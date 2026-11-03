export const dynamic = "force-static";

import type { Metadata } from "next";
import Script from "next/script";
import UlidGenerator from "./UlidGenerator";
import { MAIN_DOMEN, NAME_MAKE } from "@/lib/config";

const PAGE_URL = `${MAIN_DOMEN}tools/ulid-generator`;

export const metadata: Metadata = {
  title: "ULID Generator – Time-Sortable IDs, 100% Client-Side",
  description: "Generate ULID identifiers — 26-character Base32 IDs sorted by creation time. 128 bits of entropy, up to 1000 per batch. Private and free.",
  keywords: ["ulid generator", "generate ulid", "time-sortable id", "ulid vs uuid", "sortable unique id", "base32 id", "online tool", "client-side", "no sign-up", "free developer tool"],
  authors: [{ name: NAME_MAKE }],
  alternates: { canonical: "/tools/ulid-generator" },
  robots: { index: true, follow: true },
  openGraph: { title: "ULID Generator Online", description: "Time-sortable 26-char IDs — client-side.", url: PAGE_URL, type: "website", images: [{ url: `${MAIN_DOMEN}icon.png`, width: 1200, height: 630, alt: "ULID Generator" }] },
  twitter: { card: "summary_large_image", title: "ULID Generator", description: "Sortable 128-bit IDs in your browser." },
};

const JSONLD = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "SoftwareApplication", name: "ULID Generator", url: PAGE_URL, applicationCategory: "DeveloperApplication", operatingSystem: "Any (browser)", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, description: "Generate time-sortable 128-bit ULID identifiers in your browser." },
    { "@type": "FAQPage", mainEntity: [
      { "@type": "Question", name: "Is the ULID random part cryptographically secure?", acceptedAnswer: { "@type": "Answer", text: "Yes. The 80 random bits come from crypto.getRandomValues, the browser's CSPRNG." } },
      { "@type": "Question", name: "Can ULIDs from the same millisecond collide?", acceptedAnswer: { "@type": "Answer", text: "With 80 random bits per millisecond, a collision needs ~2^40 IDs in one ms — practically impossible." } },
    ]},
  ],
};

export default function UlidGeneratorPage() {
  return (
    <>
      <Script id="ulid-generator-jsonld" type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSONLD) }} />
      <UlidGenerator />
    </>
  );
}
