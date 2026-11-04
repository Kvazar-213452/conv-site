export const dynamic = "force-static";
import type { Metadata } from "next";
import Script from "next/script";
import Rot13 from "./Rot13";
import { MAIN_DOMEN, NAME_MAKE } from "@/lib/config";

const PAGE_URL = `${MAIN_DOMEN}tools/rot13`;

export const metadata: Metadata = {
  title: "ROT13 / ROT47 / Caesar Cipher – Online Encoder",
  description: "Encode and decode ROT13, ROT47, and generic Caesar cipher text in your browser. Classic shift ciphers for puzzles and spoilers. 100% client-side.",
  keywords: ["rot13", "rot47", "caesar cipher", "shift cipher", "rot13 online", "decode rot13", "online tool", "client-side", "free developer tool"],
  authors: [{ name: NAME_MAKE }],
  alternates: { canonical: "/tools/rot13" },
  robots: { index: true, follow: true },
  openGraph: { title: "ROT13 / ROT47 / Caesar Online", description: "Shift-cipher encoder/decoder — client-side.", url: PAGE_URL, type: "website", images: [{ url: `${MAIN_DOMEN}og-image.png`, width: 1024, height: 1024, alt: "ROT13 ROT47 Caesar" }] },
  twitter: { card: "summary_large_image", title: "ROT13 / ROT47 / Caesar", description: "Classic shift ciphers in your browser." },
};

const JSONLD = { "@context": "https://schema.org", "@type": "SoftwareApplication", name: "ROT13 / ROT47 / Caesar Cipher", url: PAGE_URL, applicationCategory: "DeveloperApplication", operatingSystem: "Any (browser)", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, description: "Classic shift ciphers (ROT13, ROT47, Caesar) with configurable shift." };

export default function Rot13Page() {
  return (<>
    <Script id="rot13-jsonld" type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSONLD) }} />
    <Rot13 />
  </>);
}
