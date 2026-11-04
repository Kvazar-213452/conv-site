export const dynamic = "force-static";

import type { Metadata } from "next";
import ByteConverter from "./ByteConverter";
import { MAIN_DOMEN, NAME_MAKE } from "@/lib/config";

export const metadata: Metadata = {
  title: "Byte Converter – Convert MB to GB, KB to MB Online",
  description: "Convert between bytes, kilobytes, megabytes, gigabytes, terabytes, and petabytes. Supports both binary (1024) and decimal (1000) standards. Free and client-side.",
  keywords: [
    "byte converter",
    "mb to gb",
    "kb to mb",
    "gb to tb",
    "data size converter",
    "bytes to megabytes",
    "file size converter",
    "storage converter",
    "binary decimal converter",
    "free byte converter"
  ],
  authors: [{ name: NAME_MAKE }],
  alternates: { canonical: "/tools/byte-converter" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Byte Converter Online",
    description: "Convert between bytes, KB, MB, GB, TB, and PB with binary and decimal standards.",
    url: `${MAIN_DOMEN}tools/byte-converter`,
    type: "website",
    images: [{ url: `${MAIN_DOMEN}og-image.png`, width: 1024, height: 1024, alt: "Byte Converter Online Tool" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Byte Converter Online",
    description: "Convert between bytes, KB, MB, GB, TB. Binary and decimal standards. Free and private."
  },
};

export default function ByteConverterPage() {
  return <ByteConverter />;
}
