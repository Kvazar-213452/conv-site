export const dynamic = "force-static";

import type { Metadata } from "next";
import Base64ToHex from "./Base64ToHex";
import { MAIN_DOMEN, NAME_MAKE } from "@/lib/config";

export const metadata: Metadata = {
  title: "Base64 to Hex Converter – Online Base64 Hex Tool",
  description: "Convert Base64 encoded strings to hexadecimal and hex back to Base64. Configurable separator and case options. Free, client-side, and private.",
  keywords: [
    "base64 to hex",
    "hex to base64",
    "base64 hex converter",
    "base64 decoder",
    "hex encoder",
    "base64 hexadecimal",
    "encoding converter",
    "data format",
    "online tool",
    "free tool"
  ],
  authors: [{ name: NAME_MAKE }],
  alternates: {
    canonical: "/tools/base64-to-hex",
  },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Base64 to Hex Converter Online",
    description: "Convert between Base64 and hexadecimal encoding formats with configurable output options. Runs entirely in your browser.",
    url: `${MAIN_DOMEN}tools/base64-to-hex`,
    type: "website",
    images: [
      {
        url: `${MAIN_DOMEN}icon.png`,
        width: 1200,
        height: 630,
        alt: "Base64 to Hex Converter Online Tool"
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Base64 to Hex Converter Online",
    description: "Convert between Base64 and hexadecimal encoding formats. Fully private and client-side."
  },
};

export default function Base64ToHexPage() {
  return (
    <Base64ToHex />
  );
}
