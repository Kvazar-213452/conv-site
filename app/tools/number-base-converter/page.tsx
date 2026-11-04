export const dynamic = "force-static";

import type { Metadata } from "next";
import NumberBaseConverter from "./NumberBaseConverter";
import { MAIN_DOMEN, NAME_MAKE } from "@/lib/config";

export const metadata: Metadata = {
  title: "Number Base Converter – Binary, Octal, Decimal, Hex",
  description: "Convert integers between binary, octal, decimal, and hexadecimal with BigInt precision. 100% client-side, private, and free.",
  keywords: [
    "number base converter",
    "binary to decimal",
    "hex to decimal",
    "decimal to hex",
    "octal converter",
    "bigint",
    "online tool",
    "client-side",
    "private tool",
    "no sign-up"
  ],
  authors: [{ name: NAME_MAKE }],
  alternates: { canonical: "/tools/number-base-converter" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Number Base Converter",
    description: "Binary ↔ octal ↔ decimal ↔ hex with arbitrary-precision BigInt arithmetic.",
    url: `${MAIN_DOMEN}tools/number-base-converter`,
    type: "website",
    images: [
      {
        url: `${MAIN_DOMEN}og-image.png`,
        width: 1024,
        height: 1024,
        alt: "Number Base Converter"
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Number Base Converter",
    description: "Four-way base converter with BigInt precision."
  },
};

export default function NumberBaseConverterPage() {
  return <NumberBaseConverter />;
}
