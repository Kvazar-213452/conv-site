export const dynamic = "force-static";
import type { Metadata } from "next";
import Script from "next/script";
import TextReverser from "./TextReverser";
import { MAIN_DOMEN, NAME_MAKE } from "@/lib/config";

const PAGE_URL = `${MAIN_DOMEN}tools/text-reverser`;

export const metadata: Metadata = {
  title: "Text Reverser – Reverse Characters, Words, or Lines",
  description: "Reverse strings by characters, words, lines, or reverse chars within each line. Unicode-safe. 100% client-side.",
  keywords: ["text reverser", "reverse string", "reverse text", "backwards text", "mirror text", "unicode reverse", "online tool", "client-side", "free developer tool"],
  authors: [{ name: NAME_MAKE }],
  alternates: { canonical: "/tools/text-reverser" },
  robots: { index: true, follow: true },
  openGraph: { title: "Text Reverser Online", description: "Reverse text 4 ways — client-side.", url: PAGE_URL, type: "website", images: [{ url: `${MAIN_DOMEN}og-image.png`, width: 1024, height: 1024, alt: "Text Reverser" }] },
  twitter: { card: "summary_large_image", title: "Text Reverser", description: "Reverse characters, words, or lines." },
};

const JSONLD = { "@context": "https://schema.org", "@type": "SoftwareApplication", name: "Text Reverser", url: PAGE_URL, applicationCategory: "DeveloperApplication", operatingSystem: "Any (browser)", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, description: "Reverse text by characters, words, lines, or chars within lines." };

export default function TextReverserPage() {
  return (<>
    <Script id="text-reverser-jsonld" type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSONLD) }} />
    <TextReverser />
  </>);
}
