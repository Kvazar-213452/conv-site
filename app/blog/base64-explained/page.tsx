import { blogVisual } from "@/lib/blog-catalog";
import BlogArticleFrame from "@/component/BlogArticleFrame";
export const dynamic = "force-static";

import type { Metadata } from "next";
import Base64Explained from "./Base64Explained";
import { MAIN_DOMEN, NAME_MAKE } from "@/lib/config";

export const metadata: Metadata = {
  title: "Base64 Explained – What It Is and When to Use It",
  description: "A practical guide to Base64 encoding: how it works, standard vs URL-safe, common use cases, and when NOT to use it. Written for developers.",
  keywords: [
    "base64 explained",
    "what is base64",
    "base64 encoding",
    "url-safe base64",
    "data uri",
    "jwt",
    "api encoding"
  ],
  authors: [{ name: NAME_MAKE }],
  alternates: { canonical: "/blog/base64-explained" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Base64 Explained",
    description: "What Base64 really is, when to use it, and when to avoid it.",
    url: `${MAIN_DOMEN}blog/base64-explained`,
    type: "article",
    modifiedTime: "2026-11-06T00:00:00Z",
    images: [{ url: blogVisual("base64-explained").image, width: 1440, height: 900, alt: blogVisual("base64-explained").alt }],
  },
  twitter: {
    card: "summary_large_image",
    images: [blogVisual("base64-explained").image],
    title: "Base64 Explained",
    description: "What Base64 really is and when it belongs in your code.",
  },
};

export default function Base64ExplainedPage() {
  return <BlogArticleFrame slug="base64-explained"><Base64Explained /></BlogArticleFrame>;
}
