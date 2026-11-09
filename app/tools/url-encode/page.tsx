export const dynamic = "force-static";

import type { Metadata } from "next";
import UrlEncode from "./UrlEncode";
import { MAIN_DOMEN, NAME_MAKE } from "@/lib/config";

export const metadata: Metadata = {
  title: "URL Encoder Online — Percent-Encode Text and Query Parameters",
  description: "Percent-encode text, URL components, and query parameter values with encodeURIComponent, encodeURI, or form encoding. Supports Unicode and batch input; processing stays in your browser.",
  keywords: [
    "url encoder",
    "encode url online",
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
    canonical: "/tools/url-encode",
  },
  robots: { index: true, follow: true },
  openGraph: {
    title: "URL Encoder Online — Percent-Encode Text and Query Parameters",
    description: "Encode URL components, query parameters, or form data using standard percent-encoding modes in your browser.",
    url: `${MAIN_DOMEN}tools/url-encode`,
    type: "website",
    images: [
      {
        url: `${MAIN_DOMEN}tools/url-encode/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "URL Encoder Online"
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "URL Encoder Online",
    description: "Percent-encode URL components and query parameter values with Unicode support."
  },
};

export default function UrlEncodePage() {
  return (
    <UrlEncode />
  );
}
