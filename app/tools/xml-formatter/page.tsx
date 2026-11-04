export const dynamic = "force-static";
import type { Metadata } from "next";
import Script from "next/script";
import XmlFormatter from "./XmlFormatter";
import { MAIN_DOMEN, NAME_MAKE } from "@/lib/config";

const PAGE_URL = `${MAIN_DOMEN}tools/xml-formatter`;

export const metadata: Metadata = {
  title: "XML Formatter – Pretty-Print SOAP, RSS, SVG, OpenXML",
  description: "Pretty-print minified XML with configurable indentation. SOAP responses, RSS feeds, SVG, OpenXML, Android manifests. 100% client-side.",
  keywords: ["xml formatter", "xml beautifier", "pretty print xml", "soap formatter", "rss formatter", "svg formatter", "online tool", "client-side", "free developer tool"],
  authors: [{ name: NAME_MAKE }],
  alternates: { canonical: "/tools/xml-formatter" },
  robots: { index: true, follow: true },
  openGraph: { title: "XML Formatter Online", description: "Pretty-print XML — client-side.", url: PAGE_URL, type: "website", images: [{ url: `${MAIN_DOMEN}og-image.png`, width: 1024, height: 1024, alt: "XML Formatter" }] },
  twitter: { card: "summary_large_image", title: "XML Formatter", description: "Readable XML in your browser." },
};

const JSONLD = { "@context": "https://schema.org", "@type": "SoftwareApplication", name: "XML Formatter", url: PAGE_URL, applicationCategory: "DeveloperApplication", operatingSystem: "Any (browser)", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, description: "Pretty-print XML with configurable indentation and depth-aware tag handling." };

export default function XmlFormatterPage() {
  return (<>
    <Script id="xml-formatter-jsonld" type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSONLD) }} />
    <XmlFormatter />
  </>);
}
