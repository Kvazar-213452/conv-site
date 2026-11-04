export const dynamic = "force-static";
import type { Metadata } from "next";
import Script from "next/script";
import HtmlFormatter from "./HtmlFormatter";
import { MAIN_DOMEN, NAME_MAKE } from "@/lib/config";

const PAGE_URL = `${MAIN_DOMEN}tools/html-formatter`;

export const metadata: Metadata = {
  title: "HTML Formatter – Pretty-Print HTML",
  description: "Pretty-print HTML with configurable indentation. Inline tags stay inline; block tags wrap. Preserves pre/textarea/script/style. 100% client-side.",
  keywords: ["html formatter", "html beautifier", "pretty print html", "html prettify", "html indent", "online tool", "client-side", "free developer tool"],
  authors: [{ name: NAME_MAKE }],
  alternates: { canonical: "/tools/html-formatter" },
  robots: { index: true, follow: true },
  openGraph: { title: "HTML Formatter Online", description: "Pretty-print HTML — client-side.", url: PAGE_URL, type: "website", images: [{ url: `${MAIN_DOMEN}og-image.png`, width: 1024, height: 1024, alt: "HTML Formatter" }] },
  twitter: { card: "summary_large_image", title: "HTML Formatter", description: "Readable HTML in your browser." },
};

const JSONLD = { "@context": "https://schema.org", "@graph": [
  { "@type": "SoftwareApplication", name: "HTML Formatter", url: PAGE_URL, applicationCategory: "DeveloperApplication", operatingSystem: "Any (browser)", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, description: "Pretty-print HTML with configurable indentation and preserved code blocks." },
  { "@type": "FAQPage", mainEntity: [
    { "@type": "Question", name: "Does it validate HTML?", acceptedAnswer: { "@type": "Answer", text: "No — only reformats. For validation use the W3C validator." } },
  ]},
]};

export default function HtmlFormatterPage() {
  return (<>
    <Script id="html-formatter-jsonld" type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSONLD) }} />
    <HtmlFormatter />
  </>);
}
