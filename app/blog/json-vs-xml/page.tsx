export const dynamic = "force-static";

import type { Metadata } from "next";
import JsonVsXml from "./JsonVsXml";
import { MAIN_DOMEN, NAME_MAKE } from "@/lib/config";

export const metadata: Metadata = {
  title: "URL Encoder & Decoder – Free Online Tool",
  description: "Encode or decode URLs, query parameters, and form data instantly. Supports encodeURIComponent, encodeURI, and form-urlencoded. Handles full Unicode including Cyrillic, emoji, and special characters. Client-side and private.",
  keywords: [
    "url encode or decode",
    "URL encoder",
    "URL decoder",
    "percent-encode",
    "decode URL",
    "encodeURIComponent",
    "encodeURI",
    "form-urlencoded",
    "Unicode",
    "Cyrillic",
    "emoji",
    "online converter",
    "client-side"
  ],
  authors: [{ name: NAME_MAKE }],
  alternates: {
    canonical: "/tools/url-encode-or-decode",
  },
  robots: { index: true, follow: true },
  openGraph: {
    title: "URL Encoder & Decoder Online",
    description: "Convert plain URLs, query strings, or form data to percent-encoded format and decode them back instantly. Supports full Unicode and batch processing. Runs entirely in your browser.",
    url: `${MAIN_DOMEN}tools/url-encode-or-decode`,
    type: "website",
    images: [
      {
        url: `${MAIN_DOMEN}icon.png`,
        width: 1200,
        height: 630,
        alt: "URL Encoder & Decoder"
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "URL Encoder & Decoder Online",
    description: "Instantly encode URLs and decode percent-encoded strings with full Unicode support. Choose between encodeURIComponent, encodeURI, or form-urlencoded."
  },
};

export default function JsonVsXmlPage() {
  return (
    <JsonVsXml />
  );
}