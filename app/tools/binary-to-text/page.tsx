export const dynamic = "force-static";
import type { Metadata } from "next";
import Script from "next/script";
import BinaryToText from "./BinaryToText";
import { MAIN_DOMEN, NAME_MAKE } from "@/lib/config";

const PAGE_URL = `${MAIN_DOMEN}tools/binary-to-text`;

export const metadata: Metadata = {
  title: "Binary to Text Converter – Bidirectional, UTF-8 Safe",
  description: "Convert text to binary and binary to text with UTF-8 support. Each byte becomes 8 bits. Handles emoji and non-ASCII. 100% client-side.",
  keywords: ["binary to text", "text to binary", "binary converter", "utf-8 binary", "ascii binary", "online tool", "client-side", "free developer tool"],
  authors: [{ name: NAME_MAKE }],
  alternates: { canonical: "/tools/binary-to-text" },
  robots: { index: true, follow: true },
  openGraph: { title: "Binary to Text Converter", description: "Text ↔ binary with UTF-8 support.", url: PAGE_URL, type: "website", images: [{ url: `${MAIN_DOMEN}og-image.png`, width: 1024, height: 1024, alt: "Binary to Text" }] },
  twitter: { card: "summary_large_image", title: "Binary to Text Converter", description: "Bidirectional binary ↔ text." },
};

const JSONLD = { "@context": "https://schema.org", "@type": "SoftwareApplication", name: "Binary to Text Converter", url: PAGE_URL, applicationCategory: "DeveloperApplication", operatingSystem: "Any (browser)", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, description: "Convert between UTF-8 text and binary byte representation." };

export default function BinaryToTextPage() {
  return (<>
    <Script id="binary-to-text-jsonld" type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSONLD) }} />
    <BinaryToText />
  </>);
}
