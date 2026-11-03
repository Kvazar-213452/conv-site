export const dynamic = "force-static";
import type { Metadata } from "next";
import Script from "next/script";
import CssMinifier from "./CssMinifier";
import { MAIN_DOMEN, NAME_MAKE } from "@/lib/config";

const PAGE_URL = `${MAIN_DOMEN}tools/css-minifier`;

export const metadata: Metadata = {
  title: "CSS Minifier – Strip Whitespace, Shorten Colors",
  description: "Minify CSS by stripping comments and whitespace, shortening hex colors (#ffffff → #fff), and removing zero units. 100% client-side.",
  keywords: ["css minifier", "minify css", "css compressor", "css optimization", "shorten hex", "online tool", "client-side", "free developer tool"],
  authors: [{ name: NAME_MAKE }],
  alternates: { canonical: "/tools/css-minifier" },
  robots: { index: true, follow: true },
  openGraph: { title: "CSS Minifier Online", description: "Shrink CSS 20–40% — client-side.", url: PAGE_URL, type: "website", images: [{ url: `${MAIN_DOMEN}icon.png`, width: 1200, height: 630, alt: "CSS Minifier" }] },
  twitter: { card: "summary_large_image", title: "CSS Minifier", description: "Shrink CSS in your browser." },
};

const JSONLD = { "@context": "https://schema.org", "@graph": [
  { "@type": "SoftwareApplication", name: "CSS Minifier", url: PAGE_URL, applicationCategory: "DeveloperApplication", operatingSystem: "Any (browser)", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, description: "Minify CSS by stripping comments, whitespace, and shortening hex colors." },
  { "@type": "FAQPage", mainEntity: [
    { "@type": "Question", name: "Does it break pseudo-class selectors?", acceptedAnswer: { "@type": "Answer", text: "No. Colons inside selectors like a:hover are preserved." } },
  ]},
]};

export default function CssMinifierPage() {
  return (<>
    <Script id="css-minifier-jsonld" type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSONLD) }} />
    <CssMinifier />
  </>);
}
