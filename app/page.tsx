export const dynamic = "force-static";

import type { Metadata } from "next";
import Home from "./Home";
import { MAIN_DOMEN, NAME_MAKE } from "@/lib/config";

export const metadata: Metadata = {
  title: "JSON Converter Toolkit – Free Online Data Format Converters",
  description: "15+ free converters: JSON to YAML, CSV, XML, Prisma, TypeScript, PostgreSQL. Base64, URL encode, UUID, Markdown, case converter. 100% client-side, private, no sign-up.",
  keywords: [
    "JSON converter",
    "YAML converter",
    "CSV converter",
    "XML converter",
    "Prisma schema generator",
    "TypeScript interface generator",
    "PostgreSQL converter",
    "Base64 encoder",
    "URL encoder",
    "UUID converter",
    "Markdown to HTML",
    "case converter",
    "data format converter",
    "online converter",
    "free converter",
    "client-side converter",
    "private converter",
    "developer tools",
    "data transformation"
  ],
  authors: [{ name: `${NAME_MAKE}` }],
  robots: { index: true, follow: true },
  openGraph: {
    title: "JSON Converter Toolkit – Free Data Format Converters",
    description: "15+ free converters for developers. Transform JSON, YAML, CSV, XML, Prisma, TypeScript, SQL. 100% client-side processing. No uploads, no sign-up, completely private.",
    url: `${MAIN_DOMEN}`,
    type: "website",
    images: [
      {
        url: `${MAIN_DOMEN}/icon.png`,
        width: 1200,
        height: 630,
        alt: "JSON Converter Toolkit"
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "JSON Converter Toolkit – Free Data Format Converters",
    description: "15+ free converters: JSON↔YAML, CSV, XML, Prisma, TypeScript, PostgreSQL, Base64, URL, UUID, Markdown. Client-side only. No uploads, private, instant."
  },
};

export default function HomePagePage() {
  return (
    <Home />
  );
}