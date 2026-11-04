export const dynamic = "force-static";

import type { Metadata } from "next";
import UrlParser from "./UrlParser";
import { MAIN_DOMEN, NAME_MAKE } from "@/lib/config";

export const metadata: Metadata = {
  title: "URL Parser – Break Down URLs into Components Online",
  description: "Parse any URL into protocol, hostname, port, path, query parameters, and hash fragment. Decode query strings and inspect URL structure. Free, client-side, and private.",
  keywords: [
    "url parser",
    "parse url online",
    "url decoder",
    "url components",
    "query string parser",
    "url breakdown",
    "url analyzer",
    "url inspector",
    "url parts",
    "free url parser"
  ],
  authors: [{ name: NAME_MAKE }],
  alternates: { canonical: "/tools/url-parser" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "URL Parser Online",
    description: "Break down any URL into protocol, host, path, query parameters, and hash. Runs in your browser.",
    url: `${MAIN_DOMEN}tools/url-parser`,
    type: "website",
    images: [{ url: `${MAIN_DOMEN}og-image.png`, width: 1024, height: 1024, alt: "URL Parser Online Tool" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "URL Parser Online",
    description: "Parse URLs into components — protocol, host, path, query params, hash. Fully private and client-side."
  },
};

export default function UrlParserPage() {
  return <UrlParser />;
}
