export const dynamic = "force-static";

import type { Metadata } from "next";
import JsonVsXml from "./JsonVsXml";
import { MAIN_DOMEN, NAME_MAKE } from "@/lib/config";

export const metadata: Metadata = {
  title: "JSON vs XML – Which Data Format Should You Use?",
  description: "A complete comparison of JSON and XML: file size, parsing speed, data types, readability, use cases, and when to choose each format. Written for developers.",
  keywords: [
    "json vs xml",
    "json or xml",
    "data serialization",
    "api format",
    "rest api",
    "soap",
    "data interchange",
    "developer guide"
  ],
  authors: [{ name: NAME_MAKE }],
  alternates: {
    canonical: "/blog/json-vs-xml",
  },
  robots: { index: true, follow: true },
  openGraph: {
    title: "JSON vs XML: Complete Comparison",
    description: "File size, parsing speed, data types, readability, and use cases — the full comparison with examples.",
    url: `${MAIN_DOMEN}blog/json-vs-xml`,
    type: "article",
    images: [
      {
        url: `${MAIN_DOMEN}icon.png`,
        width: 1200,
        height: 630,
        alt: "JSON vs XML"
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "JSON vs XML: Complete Comparison",
    description: "File size, parsing speed, data types, readability, and use cases."
  },
};

export default function JsonVsXmlPage() {
  return (
    <JsonVsXml />
  );
}