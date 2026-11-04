export const dynamic = "force-static";
import type { Metadata } from "next";
import Script from "next/script";
import JsFormatter from "./JsFormatter";
import { MAIN_DOMEN, NAME_MAKE } from "@/lib/config";

const PAGE_URL = `${MAIN_DOMEN}tools/js-formatter`;

export const metadata: Metadata = {
  title: "JavaScript Formatter – Re-Indent JS Code",
  description: "Re-indent minified or one-line JavaScript with configurable indentation. Preserves literals and comments. 100% client-side.",
  keywords: ["javascript formatter", "js formatter", "js beautifier", "pretty print js", "online tool", "client-side", "free developer tool"],
  authors: [{ name: NAME_MAKE }],
  alternates: { canonical: "/tools/js-formatter" },
  robots: { index: true, follow: true },
  openGraph: { title: "JavaScript Formatter Online", description: "Re-indent JS — client-side.", url: PAGE_URL, type: "website", images: [{ url: `${MAIN_DOMEN}og-image.png`, width: 1024, height: 1024, alt: "JS Formatter" }] },
  twitter: { card: "summary_large_image", title: "JavaScript Formatter", description: "Readable JS in your browser." },
};

const JSONLD = { "@context": "https://schema.org", "@type": "SoftwareApplication", name: "JavaScript Formatter", url: PAGE_URL, applicationCategory: "DeveloperApplication", operatingSystem: "Any (browser)", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, description: "Re-indent JavaScript with configurable indentation and preserved literals." };

export default function JsFormatterPage() {
  return (<>
    <Script id="js-formatter-jsonld" type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSONLD) }} />
    <JsFormatter />
  </>);
}
