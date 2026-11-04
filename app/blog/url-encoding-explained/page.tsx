export const dynamic = "force-static";

import type { Metadata } from "next";
import UrlEncodingExplained from "./UrlEncodingExplained";
import { MAIN_DOMEN, NAME_MAKE } from "@/lib/config";

export const metadata: Metadata = {
  title: "URL Encoding Explained – Percent-Encoding Deep Dive",
  description: "How URL encoding works, when to use encodeURIComponent vs encodeURI, and the subtle rules that break production URLs.",
  keywords: [
    "url encoding",
    "percent encoding",
    "encodeuricomponent",
    "encodeuri",
    "query string",
    "form urlencoded",
    "rfc 3986"
  ],
  authors: [{ name: NAME_MAKE }],
  alternates: { canonical: "/blog/url-encoding-explained" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "URL Encoding Explained",
    description: "The rules, the three encode modes, and the subtleties that break URLs.",
    url: `${MAIN_DOMEN}blog/url-encoding-explained`,
    type: "article",
    images: [{ url: `${MAIN_DOMEN}og-image.png`, width: 1024, height: 1024, alt: "URL Encoding Explained" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "URL Encoding Explained",
    description: "encodeURIComponent vs encodeURI vs form-urlencoded.",
  },
};

export default function UrlEncodingExplainedPage() {
  return <UrlEncodingExplained />;
}
