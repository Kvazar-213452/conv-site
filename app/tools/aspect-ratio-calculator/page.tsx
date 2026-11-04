export const dynamic = "force-static";

import type { Metadata } from "next";
import AspectRatioCalculator from "./AspectRatioCalculator";
import { MAIN_DOMEN, NAME_MAKE } from "@/lib/config";

export const metadata: Metadata = {
  title: "Aspect Ratio Calculator – Calculate & Scale Dimensions Online",
  description: "Calculate aspect ratios from width and height, scale dimensions proportionally, and find equivalent resolutions. Supports common presets (16:9, 4:3, 1:1). Free and client-side.",
  keywords: [
    "aspect ratio calculator",
    "aspect ratio converter",
    "image ratio calculator",
    "screen ratio calculator",
    "resize calculator",
    "proportion calculator",
    "16:9 calculator",
    "4:3 ratio",
    "scale dimensions",
    "free aspect ratio tool"
  ],
  authors: [{ name: NAME_MAKE }],
  alternates: { canonical: "/tools/aspect-ratio-calculator" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Aspect Ratio Calculator Online",
    description: "Calculate aspect ratios and scale dimensions proportionally. Common presets included.",
    url: `${MAIN_DOMEN}tools/aspect-ratio-calculator`,
    type: "website",
    images: [{ url: `${MAIN_DOMEN}og-image.png`, width: 1024, height: 1024, alt: "Aspect Ratio Calculator Online Tool" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aspect Ratio Calculator Online",
    description: "Calculate and convert aspect ratios with proportional scaling. Free and client-side."
  },
};

export default function AspectRatioCalculatorPage() {
  return <AspectRatioCalculator />;
}
