import type { Metadata } from "next";
import { MAIN_DOMEN, NAME_MAKE } from "@/lib/config";
import Header from "@/component/Header";
import Footer from "@/component/Footer";
import { toolCatalog } from "@/lib/tool-catalog";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Script from "next/script";

import "@/style/global.css";
import "@/style/tool-polish.css";
import "@/style/ux-polish.css";

export const metadata: Metadata = {
  metadataBase: new URL(MAIN_DOMEN),

  title: {
    default: "Utilixio – Free Online Tools for Everyday Tasks",
    template: "%s | Utilixio",
  },

  description:
    "Free online tools: PDF merge & compress, calculators, SEO helpers, AI writing, image converters, JSON formatters and 550+ more. No sign-up, works in your browser.",

  authors: [{ name: NAME_MAKE }],
  creator: NAME_MAKE,

  alternates: { canonical: "/" },

  robots: {
    index: true,
    follow: true,
    "max-snippet": -1,
    "max-image-preview": "large",
    "max-video-preview": -1,
  },

  openGraph: {
    title: "Utilixio – Free Online Tools for Everyday Tasks",
    description:
      "550+ free online tools: PDF, calculators, SEO, AI writing, image converters, JSON formatters and more. No sign-up required.",
    url: MAIN_DOMEN,
    siteName: NAME_MAKE,
    type: "website",
    images: [
      {
        url: `${MAIN_DOMEN}og-image.png`,
        width: 1024,
        height: 1024,
        alt: "Utilixio - Free Online Tools",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Utilixio – Free Online Tools for Everyday Tasks",
    description:
      "550+ free online tools: PDF, calculators, SEO, AI writing, image converters, JSON formatters and more. No sign-up required."
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body>
        {/* Google AdSense */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5292843538766538"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            { "@type": "Organization", "@id": MAIN_DOMEN + "#organization", name: NAME_MAKE, url: MAIN_DOMEN, logo: MAIN_DOMEN + "icon-512.png" },
            { "@type": "WebSite", "@id": MAIN_DOMEN + "#website", name: NAME_MAKE, url: MAIN_DOMEN, inLanguage: "en", publisher: { "@id": MAIN_DOMEN + "#organization" } }
          ]
        }).replace(/</g, "\\u003c") }} />
        <Header tools={toolCatalog.map(t => ({ slug: t.slug, title: t.title, description: t.description, href: t.href }))} />
        <div className="page-wrapper">
          <main>{children}</main>
        </div>
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
