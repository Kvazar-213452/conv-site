export const dynamic = "force-static";
import type { Metadata } from "next";
import Script from "next/script";
import MetaTagGenerator from "./MetaTagGenerator";
import { MAIN_DOMEN, NAME_MAKE } from "@/lib/config";

const PAGE_URL = `${MAIN_DOMEN}tools/meta-tag-generator`;

export const metadata: Metadata = {
  title: "Meta Tag Generator – SEO, Open Graph, Twitter Card",
  description: "Generate HTML meta tags for SEO, Open Graph, and Twitter Card from a form. Copy into your <head> for Google and social platform compatibility. 100% client-side.",
  keywords: ["meta tag generator", "seo meta tags", "open graph generator", "og tag generator", "twitter card generator", "html head", "online tool", "client-side", "free developer tool"],
  authors: [{ name: NAME_MAKE }],
  alternates: { canonical: "/tools/meta-tag-generator" },
  robots: { index: true, follow: true },
  openGraph: { title: "Meta Tag Generator Online", description: "SEO + Open Graph + Twitter Card from a form.", url: PAGE_URL, type: "website", images: [{ url: `${MAIN_DOMEN}icon.png`, width: 1200, height: 630, alt: "Meta Tag Generator" }] },
  twitter: { card: "summary_large_image", title: "Meta Tag Generator", description: "Generate SEO + OG + Twitter tags." },
};

const JSONLD = { "@context": "https://schema.org", "@graph": [
  { "@type": "SoftwareApplication", name: "Meta Tag Generator", url: PAGE_URL, applicationCategory: "DeveloperApplication", operatingSystem: "Any (browser)", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, description: "Generate SEO, Open Graph, and Twitter Card meta tags from a form." },
  { "@type": "FAQPage", mainEntity: [
    { "@type": "Question", name: "What length should my meta description be?", acceptedAnswer: { "@type": "Answer", text: "150–160 characters. Google truncates longer descriptions in the search snippet." } },
    { "@type": "Question", name: "What size should my OG image be?", acceptedAnswer: { "@type": "Answer", text: "1200×630 pixels is the recommended aspect ratio for Facebook, LinkedIn, Discord, and Slack previews. Keep under 8 MB." } },
  ]},
]};

export default function MetaTagGeneratorPage() {
  return (<>
    <Script id="meta-tag-generator-jsonld" type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSONLD) }} />
    <MetaTagGenerator />
  </>);
}
