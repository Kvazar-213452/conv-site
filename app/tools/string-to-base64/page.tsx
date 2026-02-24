export const dynamic = "force-static";

import type { Metadata } from "next";
import StringToBase64 from "./StringToBase64";
import { MAIN_DOMEN, NAME_MAKE } from "@/lib/config";

export const metadata: Metadata = {
  title: "Base64 Encoder & Decoder – Free Online Tool",
  description: "Convert strings to Base64 and decode Base64 back to strings instantly. Supports UTF-8, JSON, tokens, Unicode, and URL-safe Base64. Fully client-side and private.",
  keywords: [
    "string to base64",
    "Base64 encoder",
    "Base64 decoder",
    "string to base64",
    "decode base64",
    "UTF-8",
    "JSON tokens",
    "URL-safe Base64",
    "client-side",
    "private tool",
    "online converter"
  ],
  authors: [{ name: NAME_MAKE }],
  alternates: {
    canonical: "/tools/string-to-base64",
  },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Base64 Encoder & Decoder Online",
    description: "Encode strings to Base64 or decode Base64 back to UTF-8 text. Supports URL-safe encoding, tokens, JSON, and full Unicode. Runs entirely in your browser.",
    url: `${MAIN_DOMEN}tools/string-to-base64`,
    type: "website",
    images: [
      {
        url: `${MAIN_DOMEN}icon.png`,
        width: 1200,
        height: 630,
        alt: "Base64 Encoder & Decoder"
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Base64 Encoder & Decoder Online",
    description: "Instantly convert strings to Base64 and decode Base64 to strings with full Unicode and JSON support. Client-side and private."
  },
};

export default function StringToBase64Page() {
  return (
    <StringToBase64 />
  );
}