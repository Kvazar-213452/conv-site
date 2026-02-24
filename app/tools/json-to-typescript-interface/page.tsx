export const dynamic = "force-static";

import type { Metadata } from "next";
import JsonToTypescript from "./JsonToTypescript";
import { MAIN_DOMEN } from "@/lib/config";

export const metadata: Metadata = {
  title: "JSON to TypeScript Interfaces Converter & TS to JSON (Free Online)",
  description:
    "Convert JSON to TypeScript interfaces and back to JSON skeletons instantly. Free online tool. Infers types, optional fields, nested structures. 100% client-side.",
  keywords: [
    "json to typescript interface",
    "json to typescript",
    "typescript interface generator",
    "json to ts interface",
    "ts interface to json",
    "json to ts online",
    "typescript converter"
  ],
  alternates: {
    canonical: "/tools/json-to-typescript-interface",
  },
  openGraph: {
    title: "JSON ⇄ TypeScript Interface Converter",
    description:
      "Generate TypeScript interfaces from JSON objects or convert interfaces back to JSON skeleton instantly.",
    url: `${MAIN_DOMEN}tools/json-to-typescript-interface`,
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