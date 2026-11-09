export const dynamic = "force-static";

import type { Metadata } from "next";
import UrlEncodeDecode from "./UrlEncodeDecode";
import { MAIN_DOMEN, NAME_MAKE } from "@/lib/config";

export const metadata: Metadata = {
  title: "URL Decoder Online — Decode Percent-Encoding and Query Strings",
  description: "Decode percent-encoded URL text and query strings into readable Unicode. Handles standard %XX sequences and form-encoded plus signs; processing stays in your browser.",
  keywords: [
    "URL decoder",
    "decode URL online",
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
    canonical: "/tools/url-decode",
  },
  robots: { index: true, follow: true },
  openGraph: {
    title: "URL Decoder Online — Decode Percent-Encoding and Query Strings",
    description: "Decode encoded URL components and form query values, including Unicode and plus-as-space data, in your browser.",
    url: `${MAIN_DOMEN}tools/url-decode`,
    type: "website",
    images: [
      {
        url: `${MAIN_DOMEN}tools/url-decode/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "URL Decoder Online"
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "URL Decoder Online",
    description: "Decode percent-encoded strings and query values with Unicode support."
  },
};

export default function UrlEncodeDecodePage() {
  return (
    <UrlEncodeDecode />
  );
}
