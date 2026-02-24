export const dynamic = "force-static";

import type { Metadata } from "next";
import TermsOfService from "./TermsOfService";
import { MAIN_DOMEN, NAME_MAKE } from "@/lib/config";

export const metadata: Metadata = {
  title: "Terms of Service – JSON Converter Toolkit",
  description: "Free forever, unlimited conversions, commercial use allowed. Simple terms for using JSON, YAML, CSV, XML converters. No hidden fees, no accounts required.",
  keywords: [
    "terms of service",
    "terms and conditions",
    "usage policy",
    "commercial use",
    "free converter",
    "unlimited usage",
    "no registration",
    "legal terms",
    "service agreement",
    "user rights",
    "data ownership",
    "acceptable use",
    "converter terms",
    "developer tools license"
  ],
  authors: [{ name: `${NAME_MAKE}` }],
  robots: { index: true, follow: true },
  openGraph: {
    title: "Terms of Service – JSON Converter Toolkit",
    description: "Free forever with unlimited conversions. Commercial use allowed. Simple, fair terms for JSON, YAML, CSV, XML converters. No hidden fees or accounts required.",
    url: `${MAIN_DOMEN}terms-of-service`,
    type: "website",
    images: [
      {
        url: `${MAIN_DOMEN}/icon.png`,
        width: 1200,
        height: 630,
        alt: "JSON Converter Toolkit Terms of Service"
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Service – JSON Converter Toolkit",
    description: "100% free, unlimited conversions, commercial use allowed. Simple terms for JSON, YAML, CSV, XML converters. No fees, no accounts."
  },
};

export default function TermsOfServicePagePage() {
  return (
    <TermsOfService />
  );
}