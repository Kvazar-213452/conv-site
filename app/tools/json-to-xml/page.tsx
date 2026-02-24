export const dynamic = "force-static";

import type { Metadata } from "next";
import JsonToXml from "./JsonToXml";
import { MAIN_DOMEN } from "@/lib/config";

export const metadata: Metadata = {
  title: "JSON to XML Converter & XML to JSON Online Tool",
  description:
    "Instantly convert JSON to XML or XML to JSON. Free online, client-side, handles nested objects, arrays, attributes, and text nodes.",
  keywords: [
    "json to xml",
    "xml to json",
    "json to xml online",
    "xml converter",
    "json converter",
    "xml parser"
  ],
  alternates: { canonical: "/tools/json-to-xml" },
  openGraph: {
    title: "JSON ⇄ XML Converter",
    description: "Convert JSON objects to XML or XML to JSON instantly, with proper indentation and attributes.",
    url: `${MAIN_DOMEN}tools/json-to-xml`,
    type: "website"
  },
  robots: { index: true, follow: true }
};

export default function JsonToXmlPage() {
  return (
    <JsonToXml />
  );
}