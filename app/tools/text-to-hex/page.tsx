export const dynamic = "force-static";

import type { Metadata } from "next";
import TextToHex from "./TextToHex";
import { MAIN_DOMEN, NAME_MAKE } from "@/lib/config";

export const metadata: Metadata = {
  title: "Text to Hex Converter – Online Hex Encoder/Decoder",
  description: "Convert text to hexadecimal and hex back to text. Supports UTF-8, multiple separators (space, colon, 0x prefix), and upper/lowercase output. Free and client-side.",
  keywords: [
    "text to hex",
    "hex to text",
    "hex converter",
    "hexadecimal encoder",
    "hex decoder",
    "utf-8 to hex",
    "string to hex",
    "hex dump",
    "online tool",
    "free tool"
  ],
  authors: [{ name: NAME_MAKE }],
  alternates: {
    canonical: "/tools/text-to-hex",
  },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Text to Hex Converter Online",
    description: "Convert text to hexadecimal and hex back to text with full UTF-8 support. Runs entirely in your browser.",
    url: `${MAIN_DOMEN}tools/text-to-hex`,
    type: "website",
    images: [
      {
        url: `${MAIN_DOMEN}icon.png`,
        width: 1200,
        height: 630,
        alt: "Text to Hex Converter Online Tool"
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Text to Hex Converter Online",
    description: "Convert between text and hexadecimal with UTF-8 support. Fully private and client-side."
  },
};

export default function TextToHexPage() {
  return (
    <TextToHex />
  );
}
