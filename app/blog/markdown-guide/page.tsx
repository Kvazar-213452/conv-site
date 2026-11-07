import { blogVisual } from "@/lib/blog-catalog";
import BlogArticleFrame from "@/component/BlogArticleFrame";
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
    modifiedTime: "2026-11-06T00:00:00Z",
    images: [{ url: blogVisual("markdown-guide").image, width: 1440, height: 900, alt: blogVisual("markdown-guide").alt }],
  },
  twitter: {
    card: "summary_large_image",
    images: [blogVisual("markdown-guide").image],
    title: "Markdown Guide",
    description: "Everything you need for writing Markdown.",
  },
};

export default function MarkdownGuidePage() {
  return <BlogArticleFrame slug="markdown-guide"><MarkdownGuide /></BlogArticleFrame>;
}
