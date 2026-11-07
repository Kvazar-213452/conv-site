import { blogVisual } from "@/lib/blog-catalog";
import BlogArticleFrame from "@/component/BlogArticleFrame";
export const dynamic = "force-static";

import type { Metadata } from "next";
import UuidVsNanoid from "./UuidVsNanoid";
import { MAIN_DOMEN, NAME_MAKE } from "@/lib/config";

export const metadata: Metadata = {
  title: "UUID vs NanoID vs ULID – Choosing a Unique ID",
  description: "Compare UUID v4, UUID v7, NanoID, and ULID for primary keys and public identifiers. Collision probability, size, and sortability.",
  keywords: [
    "uuid vs nanoid",
    "ulid",
    "uuid v4",
    "uuid v7",
    "primary key",
    "unique id",
    "database id"
  ],
  authors: [{ name: NAME_MAKE }],
  alternates: { canonical: "/blog/uuid-vs-nanoid" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "UUID vs NanoID vs ULID",
    description: "Which identifier belongs in your schema?",
    url: `${MAIN_DOMEN}blog/uuid-vs-nanoid`,
    type: "article",
    modifiedTime: "2026-11-06T00:00:00Z",
    images: [{ url: blogVisual("uuid-vs-nanoid").image, width: 1440, height: 900, alt: blogVisual("uuid-vs-nanoid").alt }],
  },
  twitter: {
    card: "summary_large_image",
    images: [blogVisual("uuid-vs-nanoid").image],
    title: "UUID vs NanoID vs ULID",
    description: "Collision odds, size, sortability.",
  },
};

export default function UuidVsNanoidPage() {
  return <BlogArticleFrame slug="uuid-vs-nanoid"><UuidVsNanoid /></BlogArticleFrame>;
}
