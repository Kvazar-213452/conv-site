import { blogVisual } from "@/lib/blog-catalog";
import BlogArticleFrame from "@/component/BlogArticleFrame";
export const dynamic = "force-static";

import type { Metadata } from "next";
import UnderstandingJwt from "./UnderstandingJwt";
import { MAIN_DOMEN, NAME_MAKE } from "@/lib/config";

export const metadata: Metadata = {
  title: "Understanding JWT – A Developer's Guide",
  description: "What JSON Web Tokens really are, how signing works, and the mistakes to avoid when using them for authentication.",
  keywords: [
    "jwt",
    "json web token",
    "oauth",
    "openid connect",
    "jwt security",
    "token authentication",
    "developer guide"
  ],
  authors: [{ name: NAME_MAKE }],
  alternates: { canonical: "/blog/understanding-jwt" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Understanding JWT",
    description: "A developer's guide to JSON Web Tokens — anatomy, signing, pitfalls.",
    url: `${MAIN_DOMEN}blog/understanding-jwt`,
    type: "article",
    modifiedTime: "2026-11-06T00:00:00Z",
    images: [{ url: blogVisual("understanding-jwt").image, width: 1440, height: 900, alt: blogVisual("understanding-jwt").alt }],
  },
  twitter: {
    card: "summary_large_image",
    images: [blogVisual("understanding-jwt").image],
    title: "Understanding JWT",
    description: "Anatomy, signing, and the usual mistakes.",
  },
};

export default function UnderstandingJwtPage() {
  return <BlogArticleFrame slug="understanding-jwt"><UnderstandingJwt /></BlogArticleFrame>;
}
