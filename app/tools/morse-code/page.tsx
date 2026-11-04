export const dynamic = "force-static";
import type { Metadata } from "next";
import Script from "next/script";
import MorseCode from "./MorseCode";
import { MAIN_DOMEN, NAME_MAKE } from "@/lib/config";

const PAGE_URL = `${MAIN_DOMEN}tools/morse-code`;

export const metadata: Metadata = {
  title: "Morse Code Translator – Text ↔ Morse Online",
  description: "Encode text as International Morse code and decode Morse back to text. Supports letters, digits, and punctuation. 100% client-side.",
  keywords: ["morse code translator", "text to morse", "morse to text", "morse encoder", "morse decoder", "international morse", "online tool", "client-side", "free developer tool"],
  authors: [{ name: NAME_MAKE }],
  alternates: { canonical: "/tools/morse-code" },
  robots: { index: true, follow: true },
  openGraph: { title: "Morse Code Translator Online", description: "Text ↔ Morse — client-side.", url: PAGE_URL, type: "website", images: [{ url: `${MAIN_DOMEN}og-image.png`, width: 1024, height: 1024, alt: "Morse Code Translator" }] },
  twitter: { card: "summary_large_image", title: "Morse Code Translator", description: "Encode and decode Morse in your browser." },
};

const JSONLD = { "@context": "https://schema.org", "@type": "SoftwareApplication", name: "Morse Code Translator", url: PAGE_URL, applicationCategory: "DeveloperApplication", operatingSystem: "Any (browser)", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, description: "Encode text as International Morse code and decode it back." };

export default function MorseCodePage() {
  return (<>
    <Script id="morse-code-jsonld" type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSONLD) }} />
    <MorseCode />
  </>);
}
