export const dynamic = "force-static";

import type { Metadata } from "next";
import JsonValidator from "./JsonValidator";
import { MAIN_DOMEN, NAME_MAKE } from "@/lib/config";

export const metadata: Metadata = {
  title: "JSON Validator – Validate JSON Online with Error Details",
  description: "Validate JSON syntax instantly with detailed error messages, line numbers, and structure statistics. Check if your JSON is valid, count keys, arrays, objects, and nesting depth. Free, client-side, and private.",
  keywords: [
    "json validator",
    "validate json online",
    "json checker",
    "json syntax check",
    "json lint",
    "json verify",
    "json parser",
    "is json valid",
    "json error finder",
    "free json validator"
  ],
  authors: [{ name: NAME_MAKE }],
  alternates: { canonical: "/tools/json-validator" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "JSON Validator Online",
    description: "Validate JSON syntax with detailed error messages and structure statistics. Runs entirely in your browser.",
    url: `${MAIN_DOMEN}tools/json-validator`,
    type: "website",
    images: [{ url: `${MAIN_DOMEN}og-image.png`, width: 1024, height: 1024, alt: "JSON Validator Online Tool" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "JSON Validator Online",
    description: "Validate JSON syntax instantly with error details and statistics. Fully private and client-side."
  },
};

export default function JsonValidatorPage() {
  return <JsonValidator />;
}
