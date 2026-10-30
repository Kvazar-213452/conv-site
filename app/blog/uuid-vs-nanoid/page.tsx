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
    images: [{ url: `${MAIN_DOMEN}icon.png`, width: 1200, height: 630, alt: "UUID vs NanoID" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "UUID vs NanoID vs ULID",
    description: "Collision odds, size, sortability.",
  },
};

export default function UuidVsNanoidPage() {
  return <UuidVsNanoid />;
}
