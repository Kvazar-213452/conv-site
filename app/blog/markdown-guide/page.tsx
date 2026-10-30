export const dynamic = "force-static";

import type { Metadata } from "next";
import MarkdownGuide from "./MarkdownGuide";
import { MAIN_DOMEN, NAME_MAKE } from "@/lib/config";

export const metadata: Metadata = {
  title: "Markdown Guide – Complete Syntax Reference",
  description: "A practical Markdown reference covering CommonMark syntax, GitHub flavored extras, and common pitfalls. Headings, lists, tables, code, images, and links.",
  keywords: [
    "markdown guide",
    "markdown syntax",
    "commonmark",
    "github flavored markdown",
    "gfm",
    "markdown tables",
    "markdown reference"
  ],
  authors: [{ name: NAME_MAKE }],
  alternates: { canonical: "/blog/markdown-guide" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Markdown Guide",
    description: "Complete syntax reference with CommonMark and GFM extras.",
    url: `${MAIN_DOMEN}blog/markdown-guide`,
    type: "article",
    images: [{ url: `${MAIN_DOMEN}icon.png`, width: 1200, height: 630, alt: "Markdown Guide" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Markdown Guide",
    description: "Everything you need for writing Markdown.",
  },
};

export default function MarkdownGuidePage() {
  return <MarkdownGuide />;
}
