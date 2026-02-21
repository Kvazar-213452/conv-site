export const dynamic = "force-static";

import type { Metadata } from "next";
import EnvParser from "./EnvParser";
import { MAIN_DOMEN, NAME_MAKE } from "@/lib/config";

export const metadata: Metadata = {
  title: ".env Parser & JSON Converter (Free Online Tool)",
  description:
    "Free online .env parser and converter. Parse, validate, and edit .env files visually. Convert .env to JSON and JSON to .env instantly. Works 100% in your browser.",
  keywords: [
    ".env parser",
    "dotenv parser",
    "env to json",
    "json to env",
    ".env to json converter",
    "dotenv validator",
    "environment variables tool",
    "env file editor"
  ],
  metadataBase: new URL(MAIN_DOMEN),
  alternates: {
    canonical: "/env-parser",
  },
  openGraph: {
    title: ".env Parser & JSON Converter",
    description:
      "Parse and convert .env files to JSON or edit them visually. Secure, fast, and runs entirely in your browser.",
    url: `${MAIN_DOMEN}env-parser`,
    siteName: NAME_MAKE,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: ".env Parser & JSON Converter",
    description:
      "Free online tool to parse, validate and convert .env files.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function EnvParserPage() {
  return (
    <EnvParser />
  );
}