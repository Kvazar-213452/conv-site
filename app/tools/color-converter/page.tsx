export const dynamic = "force-static";

import type { Metadata } from "next";
import ColorConverter from "./ColorConverter";
import { MAIN_DOMEN, NAME_MAKE } from "@/lib/config";

export const metadata: Metadata = {
  title: "Color Converter – HEX, RGB, HSL",
  description: "Convert colors between HEX, RGB, and HSL instantly with a live preview swatch. 100% client-side, private, and free.",
  keywords: [
    "color converter",
    "hex to rgb",
    "rgb to hsl",
    "hex to hsl",
    "color picker",
    "css color",
    "online tool",
    "client-side",
    "private tool",
    "no sign-up"
  ],
  authors: [{ name: NAME_MAKE }],
  alternates: {
    canonical: "/tools/color-converter",
  },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Color Converter Online",
    description: "Convert between HEX, RGB, and HSL with a live preview. Private and free.",
    url: `${MAIN_DOMEN}tools/color-converter`,
    type: "website",
    images: [
      {
        url: `${MAIN_DOMEN}og-image.png`,
        width: 1024,
        height: 1024,
        alt: "Color Converter Online"
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Color Converter Online",
    description: "HEX ↔ RGB ↔ HSL with a live swatch."
  },
};

export default function ColorConverterPage() {
  return <ColorConverter />;
}
