export const dynamic = "force-static";

import type { Metadata } from "next";
import CaseConverter from "./CaseConverter";
import { MAIN_DOMEN, NAME_MAKE } from "@/lib/config";

export const metadata: Metadata = {
  title: "Case Converter – Free Online Text Formatter",
  description: "Instantly convert text to UPPER, lower, Title, Sentence, camelCase, snake_case, kebab-case, CONSTANT_CASE, alternating, and inverse. Fully client-side and private.",
  keywords: [
    "case converter",
    "text formatter",
    "upper case",
    "lower case",
    "title case",
    "sentence case",
    "camelCase",
    "snake_case",
    "kebab-case",
    "CONSTANT_CASE",
    "alternating case",
    "inverse case",
    "online tool",
    "text transformation",
    "client-side",
    "free tool"
  ],
  authors: [{ name: `${NAME_MAKE}` }],
  robots: { index: true, follow: true },
  openGraph: {
    title: "Case Converter Online",
    description: "Convert text between 11 case formats instantly in your browser. Preserve newlines, trim lines, and keep your text private — no data leaves your device.",
    url: `${MAIN_DOMEN}case-converter`,
    type: "website",
    images: [
      {
        url: `${MAIN_DOMEN}/icon.png`,
        width: 1200,
        height: 630,
        alt: "Case Converter Online Tool"
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Case Converter Online",
    description: "Instantly convert text between multiple case formats: UPPER, lower, Title, Sentence, camelCase, snake_case, kebab-case, CONSTANT_CASE, alternating, inverse. Fully private and client-side."
  },
};

export default function CaseConverterPage() {
  return (
    <CaseConverter />
  );
}