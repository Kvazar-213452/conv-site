export const dynamic = "force-static";

import type { Metadata } from "next";
import Contact from "./Contact";
import { MAIN_DOMEN, NAME_MAKE } from "@/lib/config";

export const metadata: Metadata = {
  title: "Contact Us – JSON Converter Toolkit Support",
  description: "Get help with JSON, YAML, CSV, XML converters. Report bugs, request features, or ask questions. Real developers respond within 24 hours. Email support available.",
  keywords: [
    "contact support",
    "JSON converter help",
    "bug report",
    "feature request",
    "technical support",
    "converter assistance",
    "email support",
    "developer support",
    "YAML help",
    "CSV support",
    "XML converter help",
    "data conversion support",
    "privacy questions",
    "security inquiries"
  ],
  authors: [{ name: `${NAME_MAKE}` }],
  robots: { index: true, follow: true },
  openGraph: {
    title: "Contact JSON Converter Toolkit Support",
    description: "Need help with data conversions? Report bugs, request features, or get technical assistance. Real developers respond within 24 hours to all inquiries.",
    url: `${MAIN_DOMEN}contact`,
    type: "website",
    images: [
      {
        url: `${MAIN_DOMEN}/icon.png`,
        width: 1200,
        height: 630,
        alt: "Contact JSON Converter Toolkit"
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact JSON Converter Toolkit",
    description: "Get help with JSON, YAML, CSV, XML converters. Bug reports, feature requests, and technical support from real developers. <24h response time."
  },
};

export default function ContactPage() {
  return (
    <Contact />
  );
}