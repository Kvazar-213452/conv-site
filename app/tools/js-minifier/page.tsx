export const dynamic = "force-static";
import type { Metadata } from "next";
import Script from "next/script";
import JsMinifier from "./JsMinifier";
import { MAIN_DOMEN, NAME_MAKE } from "@/lib/config";

const PAGE_URL = `${MAIN_DOMEN}tools/js-minifier`;

export const metadata: Metadata = {
  title: "JavaScript Minifier – Strip Comments & Whitespace",
  description: "Minify JavaScript by stripping comments and whitespace. Preserves strings, templates, and regex literals. No build step. 100% client-side.",
  keywords: ["javascript minifier", "js minifier", "minify javascript", "js compressor", "online minifier", "client-side", "free developer tool"],
  authors: [{ name: NAME_MAKE }],
  alternates: { canonical: "/tools/js-minifier" },
  robots: { index: true, follow: true },
  openGraph: { title: "JavaScript Minifier Online", description: "Strip JS comments and whitespace — client-side.", url: PAGE_URL, type: "website", images: [{ url: `${MAIN_DOMEN}icon.png`, width: 1200, height: 630, alt: "JS Minifier" }] },
  twitter: { card: "summary_large_image", title: "JavaScript Minifier", description: "Shrink JS in your browser." },
};

const JSONLD = { "@context": "https://schema.org", "@type": "SoftwareApplication", name: "JavaScript Minifier", url: PAGE_URL, applicationCategory: "DeveloperApplication", operatingSystem: "Any (browser)", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, description: "Strip comments and whitespace from JavaScript while preserving literal content." };

export default function JsMinifierPage() {
  return (<>
    <Script id="js-minifier-jsonld" type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSONLD) }} />
    <JsMinifier />
  </>);
}
