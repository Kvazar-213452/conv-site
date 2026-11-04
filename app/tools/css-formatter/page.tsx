export const dynamic = "force-static";
import type { Metadata } from "next";
import Script from "next/script";
import CssFormatter from "./CssFormatter";
import { MAIN_DOMEN, NAME_MAKE } from "@/lib/config";

const PAGE_URL = `${MAIN_DOMEN}tools/css-formatter`;

export const metadata: Metadata = {
  title: "CSS Formatter – Pretty-Print CSS",
  description: "Format minified or hand-written CSS with configurable indentation. Handles rules, media queries, and nested at-rules. 100% client-side.",
  keywords: ["css formatter", "css beautifier", "pretty print css", "css indent", "online tool", "client-side", "free developer tool"],
  authors: [{ name: NAME_MAKE }],
  alternates: { canonical: "/tools/css-formatter" },
  robots: { index: true, follow: true },
  openGraph: { title: "CSS Formatter Online", description: "Pretty-print CSS — client-side.", url: PAGE_URL, type: "website", images: [{ url: `${MAIN_DOMEN}og-image.png`, width: 1024, height: 1024, alt: "CSS Formatter" }] },
  twitter: { card: "summary_large_image", title: "CSS Formatter", description: "Readable CSS in your browser." },
};

const JSONLD = { "@context": "https://schema.org", "@type": "SoftwareApplication", name: "CSS Formatter", url: PAGE_URL, applicationCategory: "DeveloperApplication", operatingSystem: "Any (browser)", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, description: "Pretty-print CSS with configurable indentation." };

export default function CssFormatterPage() {
  return (<>
    <Script id="css-formatter-jsonld" type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSONLD) }} />
    <CssFormatter />
  </>);
}
