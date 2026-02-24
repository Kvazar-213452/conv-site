export const dynamic = "force-static";

import type { Metadata } from "next";
import PrivacyPolicy from "./PrivacyPolicy";
import { MAIN_DOMEN, NAME_MAKE } from "@/lib/config";

export const metadata: Metadata = {
  title: "Privacy Policy – JSON Converter Toolkit",
  description: "100% client-side data processing. Zero data collection. All JSON, YAML, CSV, XML conversions happen in your browser. No servers, no tracking, complete privacy guaranteed.",
  keywords: [
    "privacy policy",
    "data privacy",
    "client-side processing",
    "zero data collection",
    "GDPR compliant",
    "CCPA compliant",
    "no tracking",
    "secure converter",
    "private JSON converter",
    "offline converter",
    "browser-only processing",
    "no cookies",
    "data security",
    "privacy-first"
  ],
  authors: [{ name: `${NAME_MAKE}` }],
  robots: { index: true, follow: true },
  openGraph: {
    title: "Privacy Policy – JSON Converter Toolkit",
    description: "Your data never leaves your browser. 100% client-side processing with zero data collection. No tracking, no servers, no accounts. Complete privacy guaranteed.",
    url: `${MAIN_DOMEN}privacy-policy`,
    type: "website",
    images: [
      {
        url: `${MAIN_DOMEN}/icon.png`,
        width: 1200,
        height: 630,
        alt: "JSON Converter Toolkit Privacy Policy"
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy – JSON Converter Toolkit",
    description: "100% client-side data processing. Zero collection. All JSON, YAML, CSV, XML conversions in your browser. No servers, no tracking, complete privacy."
  },
};

export default function PrivacyPolicyPage() {
  return (
    <PrivacyPolicy />
  );
}