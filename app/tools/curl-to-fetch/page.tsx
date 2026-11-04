export const dynamic = "force-static";

import type { Metadata } from "next";
import Script from "next/script";
import CurlToFetch from "./CurlToFetch";
import { MAIN_DOMEN, NAME_MAKE } from "@/lib/config";

const PAGE_URL = `${MAIN_DOMEN}tools/curl-to-fetch`;

export const metadata: Metadata = {
  title: "cURL to Fetch – Convert cURL Commands to JavaScript",
  description: "Paste any cURL command and get idiomatic JavaScript — fetch, axios, or XMLHttpRequest. Handles headers, methods, JSON bodies, Basic auth, multi-line commands. 100% client-side.",
  keywords: [
    "curl to fetch",
    "curl to javascript",
    "curl to axios",
    "curl converter",
    "copy as curl",
    "chrome devtools",
    "api request",
    "http request javascript",
    "convert curl",
    "online tool",
    "client-side",
    "private tool",
    "no sign-up",
    "free developer tool"
  ],
  authors: [{ name: NAME_MAKE }],
  alternates: { canonical: "/tools/curl-to-fetch" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "cURL to Fetch Online",
    description: "Convert cURL commands to JavaScript fetch, axios, or XMLHttpRequest.",
    url: PAGE_URL,
    type: "website",
    images: [{ url: `${MAIN_DOMEN}og-image.png`, width: 1024, height: 1024, alt: "cURL to Fetch" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "cURL to Fetch Online",
    description: "cURL → fetch / axios / XHR, right in your browser.",
  },
};

const JSONLD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "cURL to Fetch Converter",
      url: PAGE_URL,
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Any (browser)",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      description: "Convert cURL commands to idiomatic JavaScript — fetch, axios, or XMLHttpRequest.",
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Does it support Chrome DevTools' Copy as cURL?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Multi-line commands with trailing backslash, repeated -H headers, and JSON bodies are all parsed correctly.",
          },
        },
        {
          "@type": "Question",
          name: "Does it convert file uploads (-F)?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Not yet. Multipart form uploads require runtime file handles — convert the other flags here and add FormData manually.",
          },
        },
        {
          "@type": "Question",
          name: "Are my cURL commands sent to a server?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. Everything is parsed and emitted locally in your browser — safe for commands containing API keys or tokens.",
          },
        },
      ],
    },
  ],
};

export default function CurlToFetchPage() {
  return (
    <>
      <Script
        id="curl-to-fetch-jsonld"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSONLD) }}
      />
      <CurlToFetch />
    </>
  );
}
