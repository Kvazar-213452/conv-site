export const dynamic = "force-static";

import type { Metadata } from "next";
import JSON_CSV_CONVERTER from "./JSON_CSV_CONVERTER";
import { MAIN_DOMEN, NAME_MAKE } from "@/lib/config";

export const metadata: Metadata = {
  title: "JSON to CSV Converter & CSV to JSON (Free Online Tool)",
  description:
    "Free online JSON to CSV converter and CSV to JSON tool. Convert arrays of objects to CSV, auto-detect headers, and infer data types. 100% client-side and private.",
  keywords: [
    "json to csv",
    "csv to json",
    "json csv converter",
    "convert json to csv online",
    "convert csv to json online",
    "csv parser",
    "json formatter",
    "data conversion tool"
  ],
  metadataBase: new URL(MAIN_DOMEN),
  alternates: {
    canonical: "/json-to-csv",
  },
  openGraph: {
    title: "JSON ⇄ CSV Converter (Instant & Private)",
    description:
      "Convert JSON to CSV and CSV back to JSON instantly. No uploads, no server processing, fully private.",
    url: `${MAIN_DOMEN}json-to-csv`,
    siteName: NAME_MAKE,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "JSON ⇄ CSV Converter",
    description:
      "Free online JSON ↔ CSV converter. Fast, private, and runs in your browser.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function JSON_CSV_CONVERTERPage() {
  return (
    <JSON_CSV_CONVERTER />
  );
}