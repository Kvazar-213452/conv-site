export const dynamic = "force-static";

import type { Metadata } from "next";
import Script from "next/script";
import BlogIndex from "./BlogIndex";
import { MAIN_DOMEN, NAME_MAKE } from "@/lib/config";

const PAGE_URL = `${MAIN_DOMEN}blog`;

export const metadata: Metadata = {
  title: "Developer Blog – Guides, Comparisons, Cheatsheets",
  description: "Practical guides for developers: data format comparisons (JSON vs YAML, JSON vs XML), security explainers (XSS, JWT, Base64), reference cheatsheets, and style guides.",
  keywords: [
    "developer blog",
    "programming guides",
    "data formats",
    "web security",
    "sql formatting",
    "regex cheatsheet",
    "jwt",
    "base64",
    "chmod",
    "unix permissions",
    "markdown guide",
    "json vs yaml",
    "json vs xml",
    "css color",
    "html entities",
    "url encoding"
  ],
  authors: [{ name: NAME_MAKE }],
  alternates: { canonical: "/blog" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Developer Blog – Guides and Cheatsheets",
    description: "Hands-on guides, format comparisons, and practical references for developers.",
    url: PAGE_URL,
    type: "website",
    images: [{ url: `${MAIN_DOMEN}og-image.png`, width: 1024, height: 1024, alt: "Developer Blog" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Developer Blog – Guides and Cheatsheets",
    description: "Practical guides for working developers.",
  },
};

const JSONLD = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "DevTools Converter Blog",
  url: PAGE_URL,
  description: "Guides, format comparisons, and cheatsheets for working developers.",
  publisher: { "@type": "Organization", name: NAME_MAKE, url: MAIN_DOMEN },
};

export default function BlogIndexPage() {
  return (
    <>
      <Script
        id="blog-index-jsonld"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSONLD) }}
      />
      <BlogIndex />
    </>
  );
}
