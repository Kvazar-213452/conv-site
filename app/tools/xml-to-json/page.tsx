export const dynamic = "force-static";
import type { Metadata } from "next";
import Script from "next/script";
import XmlToJson from "./XmlToJson";
import { MAIN_DOMEN, NAME_MAKE } from "@/lib/config";

const PAGE_URL = `${MAIN_DOMEN}tools/xml-to-json`;

export const metadata: Metadata = {
  title: "XML to JSON Converter – SOAP, RSS, SVG, OpenXML",
  description: "Convert XML to JSON with configurable attribute prefix and text-node key. Handles SOAP responses, RSS feeds, SVG data, OpenXML. 100% client-side.",
  keywords: ["xml to json", "xml parser", "soap to json", "rss to json", "svg to json", "convert xml", "online tool", "client-side", "no sign-up", "free developer tool"],
  authors: [{ name: NAME_MAKE }],
  alternates: { canonical: "/tools/xml-to-json" },
  robots: { index: true, follow: true },
  openGraph: { title: "XML to JSON Converter", description: "Convert XML to JSON — SOAP, RSS, SVG — client-side.", url: PAGE_URL, type: "website", images: [{ url: `${MAIN_DOMEN}icon.png`, width: 1200, height: 630, alt: "XML to JSON" }] },
  twitter: { card: "summary_large_image", title: "XML to JSON Converter", description: "XML → JSON with configurable attributes." },
};

const JSONLD = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "SoftwareApplication", name: "XML to JSON Converter", url: PAGE_URL, applicationCategory: "DeveloperApplication", operatingSystem: "Any (browser)", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, description: "Convert XML documents to JSON using the browser's native DOMParser." },
    { "@type": "FAQPage", mainEntity: [
      { "@type": "Question", name: "Does it validate XML schema?", acceptedAnswer: { "@type": "Answer", text: "Only well-formedness. Use XSD/DTD tooling for schema validation." } },
      { "@type": "Question", name: "Is my XML sent to a server?", acceptedAnswer: { "@type": "Answer", text: "No. The browser's DOMParser runs locally — safe for SOAP payloads with tokens." } },
    ]},
  ],
};

export default function XmlToJsonPage() {
  return (<>
    <Script id="xml-to-json-jsonld" type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSONLD) }} />
    <XmlToJson />
  </>);
}
