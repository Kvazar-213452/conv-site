export const dynamic = "force-static";

import type { Metadata } from "next";
import HmacGenerator from "./HmacGenerator";
import { MAIN_DOMEN, NAME_MAKE } from "@/lib/config";

export const metadata: Metadata = {
  title: "HMAC Generator – SHA-256/SHA-512 HMAC Online",
  description: "Generate HMAC signatures with SHA-256, SHA-384, SHA-512, and SHA-1 using the Web Crypto API. Output in hex and Base64. Free, client-side, and private.",
  keywords: [
    "hmac generator",
    "hmac sha256 online",
    "hmac calculator",
    "hmac sha512",
    "hmac signature",
    "generate hmac",
    "hmac hash",
    "hmac online tool",
    "message authentication code",
    "free hmac generator"
  ],
  authors: [{ name: NAME_MAKE }],
  alternates: { canonical: "/tools/hmac-generator" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "HMAC Generator Online",
    description: "Generate HMAC-SHA256/SHA512 signatures with the Web Crypto API. Hex and Base64 output.",
    url: `${MAIN_DOMEN}tools/hmac-generator`,
    type: "website",
    images: [{ url: `${MAIN_DOMEN}og-image.png`, width: 1024, height: 1024, alt: "HMAC Generator Online Tool" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "HMAC Generator Online",
    description: "Generate HMAC signatures with SHA-256, SHA-384, SHA-512. Fully private and client-side."
  },
};

export default function HmacGeneratorPage() {
  return <HmacGenerator />;
}
