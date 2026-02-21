export const dynamic = "force-static";

import type { Metadata } from "next";
import JsonToTypescript from "./JsonToTypescript";

export const metadata: Metadata = {
  title: "JSON to TypeScript Interfaces Converter & TS to JSON (Free Online)",
  description:
    "Convert JSON to TypeScript interfaces and back to JSON skeletons instantly. Free online tool. Infers types, optional fields, nested structures. 100% client-side.",
  keywords: [
    "json to typescript",
    "typescript interface generator",
    "json to ts interface",
    "ts interface to json",
    "json to ts online",
    "typescript converter"
  ],
  alternates: {
    canonical: "https://yoursite.com/json-to-ts"
  },
  openGraph: {
    title: "JSON ⇄ TypeScript Interface Converter",
    description:
      "Generate TypeScript interfaces from JSON objects or convert interfaces back to JSON skeleton instantly.",
    url: "https://yoursite.com/json-to-ts",
    type: "website"
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function JsonToTypescriptPage() {
  return (
    <JsonToTypescript />
  );
}