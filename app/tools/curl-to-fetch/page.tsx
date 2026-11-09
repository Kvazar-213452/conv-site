export const dynamic = "force-static";

import type { Metadata } from "next";
import Script from "next/script";
import CurlToFetch from "./CurlToFetch";
import { MAIN_DOMEN, NAME_MAKE } from "@/lib/config";

const PAGE_URL = `${MAIN_DOMEN}tools/curl-to-fetch`;

export const metadata: Metadata = {
  title: "Convert cURL to JavaScript — Fetch, Axios & XHR Online",
  description: "Convert a copied cURL HTTP request into JavaScript fetch, Axios, or XMLHttpRequest. Preserve supported methods, headers, query strings, and request bodies; parsing runs locally and never executes the command.",
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
    title: "Convert cURL to JavaScript — Fetch, Axios & XHR",
    description: "Turn a copied cURL request into browser JavaScript without executing or uploading the command.",
    url: PAGE_URL,
    type: "website",
    images: [{ url: `${PAGE_URL}/opengraph-image`, width: 1200, height: 630, alt: "cURL to JavaScript converter" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "cURL to JavaScript Converter",
    description: "Convert copied cURL commands to fetch, Axios, or XHR locally in your browser."
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
