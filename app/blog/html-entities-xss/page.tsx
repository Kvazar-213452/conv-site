export const dynamic = "force-static";

import type { Metadata } from "next";
import HtmlEntitiesXss from "./HtmlEntitiesXss";
import { MAIN_DOMEN, NAME_MAKE } from "@/lib/config";

export const metadata: Metadata = {
  title: "HTML Entities & XSS – A Practical Guide",
  description: "How HTML entity encoding prevents XSS, when it isn't enough, and how to escape by context: HTML, attribute, URL, JavaScript, and CSS.",
  keywords: [
    "html entities xss",
    "xss prevention",
    "html escaping",
    "context aware escaping",
    "owasp xss",
    "html encode",
    "javascript security",
    "web security"
  ],
  authors: [{ name: NAME_MAKE }],
  alternates: { canonical: "/blog/html-entities-xss" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "HTML Entities and XSS",
    description: "Context-aware escaping done right — HTML, attributes, URLs, JavaScript, CSS.",
    url: `${MAIN_DOMEN}blog/html-entities-xss`,
    type: "article",
    images: [{ url: `${MAIN_DOMEN}og-image.png`, width: 1024, height: 1024, alt: "HTML Entities and XSS" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "HTML Entities and XSS",
    description: "Context-aware escaping done right.",
  },
};

export default function HtmlEntitiesXssPage() {
  return <HtmlEntitiesXss />;
}
