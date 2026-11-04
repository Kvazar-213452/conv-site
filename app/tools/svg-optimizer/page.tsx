export const dynamic = "force-static";

import type { Metadata } from "next";
import Script from "next/script";
import SvgOptimizer from "./SvgOptimizer";
import { MAIN_DOMEN, NAME_MAKE } from "@/lib/config";

const PAGE_URL = `${MAIN_DOMEN}tools/svg-optimizer`;

export const metadata: Metadata = {
  title: "SVG Optimizer – Minify SVG for the Web",
  description: "Strip editor metadata, shorten hex colors, round decimals, and collapse whitespace in SVG files. Live preview and size readout. 100% client-side.",
  keywords: [
    "svg optimizer",
    "svg minify",
    "svg compressor",
    "inkscape clean",
    "illustrator svg",
    "figma svg",
    "web optimization",
    "online tool",
    "client-side",
    "private tool",
    "no sign-up",
    "free developer tool"
  ],
  authors: [{ name: NAME_MAKE }],
  alternates: { canonical: "/tools/svg-optimizer" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "SVG Optimizer Online",
    description: "Shrink SVG files 30–70% without server uploads.",
    url: PAGE_URL,
    type: "website",
    images: [{ url: `${MAIN_DOMEN}og-image.png`, width: 1024, height: 1024, alt: "SVG Optimizer" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "SVG Optimizer Online",
    description: "Minify SVG in your browser with a live preview.",
  },
};

const JSONLD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "SVG Optimizer",
      url: PAGE_URL,
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Any (browser)",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      description: "Minify SVG files by stripping editor metadata, shortening colors, rounding decimals, and collapsing whitespace.",
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "How much smaller will my SVGs get?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Exports from Inkscape, Illustrator, and Figma typically shrink 30–70%. Hand-written SVGs see 5–15% savings.",
          },
        },
        {
          "@type": "Question",
          name: "Does rounding decimals break my icon?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Two decimal places are safe for icons from 16px to 2048px. Lower the decimal count for bigger savings on simple shapes.",
          },
        },
        {
          "@type": "Question",
          name: "Is my SVG uploaded anywhere?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. Parsing, rewriting, and preview happen in your browser — safe for brand assets and unreleased designs.",
          },
        },
      ],
    },
  ],
};

export default function SvgOptimizerPage() {
  return (
    <>
      <Script
        id="svg-optimizer-jsonld"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSONLD) }}
      />
      <SvgOptimizer />
    </>
  );
}
