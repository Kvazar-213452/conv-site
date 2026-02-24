export const dynamic = "force-static";

import type { Metadata } from "next";
import UuidToBase64 from "./UuidToBase64";
import { MAIN_DOMEN, NAME_MAKE } from "@/lib/config";

export const metadata: Metadata = {
  title: "UUID ↔ Base64 Converter – Free Online Tool",
  description: "Convert UUIDs to compact Base64 strings and back instantly. Supports standard and URL-safe Base64. Batch processing, fully client-side, and private. Ideal for databases, APIs, and URLs.",
  keywords: [
    "UUID to Base64",
    "Base64 to UUID",
    "UUID encoder",
    "UUID decoder",
    "URL-safe Base64",
    "standard Base64",
    "online converter",
    "client-side conversion",
    "batch conversion",
    "UUID tool"
  ],
  authors: [{ name: NAME_MAKE }],
  alternates: {
    canonical: "/tools/uuid-to-base64",
  },
  robots: { index: true, follow: true },
  openGraph: {
    title: "UUID ↔ Base64 Converter Online",
    description: "Instantly encode UUIDs to Base64 or decode Base64 back to UUID. Supports URL-safe Base64 and batch processing. Runs entirely in your browser.",
    url: `${MAIN_DOMEN}tools/uuid-to-base64`,
    type: "website",
    images: [
      {
        url: `${MAIN_DOMEN}icon.png`,
        width: 1200,
        height: 630,
        alt: "UUID to Base64 Converter"
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "UUID ↔ Base64 Converter Online",
    description: "Encode UUIDs to Base64 and decode them back with full privacy. Supports URL-safe Base64 and batch conversion."
  },
};

export default function UuidToBase64Page() {
  return (
    <UuidToBase64 />
  );
}