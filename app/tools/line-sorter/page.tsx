export const dynamic = "force-static";
import type { Metadata } from "next";
import Script from "next/script";
import LineSorter from "./LineSorter";
import { MAIN_DOMEN, NAME_MAKE } from "@/lib/config";

const PAGE_URL = `${MAIN_DOMEN}tools/line-sorter`;

export const metadata: Metadata = {
  title: "Line Sorter – Sort Lines Alphabetically, Naturally, by Length",
  description: "Sort text lines with natural, alphabetical, length, or numeric comparison. Reverse, shuffle, dedupe, and case-insensitive options. 100% client-side.",
  keywords: ["line sorter", "sort lines", "alphabetical sort", "natural sort", "sort text", "dedupe lines", "online tool", "client-side", "free developer tool"],
  authors: [{ name: NAME_MAKE }],
  alternates: { canonical: "/tools/line-sorter" },
  robots: { index: true, follow: true },
  openGraph: { title: "Line Sorter Online", description: "Sort lines 4 ways — client-side.", url: PAGE_URL, type: "website", images: [{ url: `${MAIN_DOMEN}icon.png`, width: 1200, height: 630, alt: "Line Sorter" }] },
  twitter: { card: "summary_large_image", title: "Line Sorter", description: "Sort text lines in your browser." },
};

const JSONLD = { "@context": "https://schema.org", "@type": "SoftwareApplication", name: "Line Sorter", url: PAGE_URL, applicationCategory: "DeveloperApplication", operatingSystem: "Any (browser)", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, description: "Sort text lines with natural, alphabetical, length, or numeric comparison." };

export default function LineSorterPage() {
  return (<>
    <Script id="line-sorter-jsonld" type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSONLD) }} />
    <LineSorter />
  </>);
}
