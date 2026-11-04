export const dynamic = "force-static";
import type { Metadata } from "next";
import Script from "next/script";
import JwtGenerator from "./JwtGenerator";
import { MAIN_DOMEN, NAME_MAKE } from "@/lib/config";

const PAGE_URL = `${MAIN_DOMEN}tools/jwt-generator`;

export const metadata: Metadata = {
  title: "JWT Generator – Sign HS256 / HS384 / HS512 Tokens",
  description: "Sign JSON Web Tokens with HS256, HS384, or HS512 using the Web Crypto API. Private, free, 100% client-side.",
  keywords: ["jwt generator", "sign jwt", "hs256 jwt", "jwt signer", "create jwt", "web crypto jwt", "online tool", "client-side", "no sign-up", "free developer tool"],
  authors: [{ name: NAME_MAKE }],
  alternates: { canonical: "/tools/jwt-generator" },
  robots: { index: true, follow: true },
  openGraph: { title: "JWT Generator Online", description: "Sign JWTs with HS256/384/512 in your browser.", url: PAGE_URL, type: "website", images: [{ url: `${MAIN_DOMEN}og-image.png`, width: 1024, height: 1024, alt: "JWT Generator" }] },
  twitter: { card: "summary_large_image", title: "JWT Generator Online", description: "Signer with HS256/384/512." },
};

const JSONLD = { "@context": "https://schema.org", "@graph": [
  { "@type": "SoftwareApplication", name: "JWT Generator", url: PAGE_URL, applicationCategory: "DeveloperApplication", operatingSystem: "Any (browser)", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, description: "Sign JSON Web Tokens with HS256, HS384, HS512 using the Web Crypto API." },
  { "@type": "FAQPage", mainEntity: [
    { "@type": "Question", name: "Does it support RS256 or ES256?", acceptedAnswer: { "@type": "Answer", text: "No — asymmetric algorithms need a real private key import. Use HS256/384/512 with a text secret here." } },
    { "@type": "Question", name: "Is my secret sent to a server?", acceptedAnswer: { "@type": "Answer", text: "No. HMAC signing happens entirely in your browser via the Web Crypto API." } },
  ]},
]};

export default function JwtGeneratorPage() {
  return (<>
    <Script id="jwt-generator-jsonld" type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSONLD) }} />
    <JwtGenerator />
  </>);
}
