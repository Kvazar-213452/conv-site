export const dynamic = "force-static";
import type { Metadata } from "next";
import Script from "next/script";
import HtmlMinifier from "./HtmlMinifier";
import { MAIN_DOMEN, NAME_MAKE } from "@/lib/config";

const PAGE_URL = `${MAIN_DOMEN}tools/html-minifier`;

export const metadata: Metadata = {
  title: "HTML Minifier – Strip Whitespace, Comments, Boolean Attrs",
  description: "Minify HTML by stripping whitespace, comments, and redundant attributes. Preserves pre/textarea/script/style content. 100% client-side.",
  keywords: ["html minifier", "minify html", "html compressor", "html optimization", "strip html whitespace", "online tool", "client-side", "no sign-up", "free developer tool"],
  authors: [{ name: NAME_MAKE }],
  alternates: { canonical: "/tools/html-minifier" },
  robots: { index: true, follow: true },
  openGraph: { title: "HTML Minifier Online", description: "Shrink HTML — client-side with preserved code blocks.", url: PAGE_URL, type: "website", images: [{ url: `${MAIN_DOMEN}og-image.png`, width: 1024, height: 1024, alt: "HTML Minifier" }] },
  twitter: { card: "summary_large_image", title: "HTML Minifier Online", description: "Strip whitespace + comments, preserve code." },
};

const JSONLD = { "@context": "https://schema.org", "@graph": [
  { "@type": "SoftwareApplication", name: "HTML Minifier", url: PAGE_URL, applicationCategory: "DeveloperApplication", operatingSystem: "Any (browser)", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, description: "Minify HTML — strip whitespace, comments, and redundant attributes." },
  { "@type": "FAQPage", mainEntity: [
    { "@type": "Question", name: "Will this break <pre> blocks?", acceptedAnswer: { "@type": "Answer", text: "No. Content inside pre, textarea, script, and style tags is preserved byte-for-byte." } },
    { "@type": "Question", name: "Is my HTML uploaded?", acceptedAnswer: { "@type": "Answer", text: "No. Minification is entirely client-side — safe for proprietary templates." } },
  ]},
]};

export default function HtmlMinifierPage() {
  return (<>
    <Script id="html-minifier-jsonld" type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSONLD) }} />
    <HtmlMinifier />
  </>);
}
