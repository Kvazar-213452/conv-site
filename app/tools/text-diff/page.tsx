export const dynamic = "force-static";

import type { Metadata } from "next";
import TextDiff from "./TextDiff";
import { MAIN_DOMEN, NAME_MAKE } from "@/lib/config";

export const metadata: Metadata = {
  title: "Text Diff – Compare Two Texts Online",
  description: "Compare two blocks of text line by line with added/removed/unchanged highlighting. 100% client-side, private, and free.",
  keywords: [
    "text diff",
    "compare text",
    "line diff",
    "lcs diff",
    "code diff",
    "online tool",
    "client-side",
    "private tool",
    "no sign-up"
  ],
  authors: [{ name: NAME_MAKE }],
  alternates: { canonical: "/tools/text-diff" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Text Diff Online",
    description: "Compare two blocks of text line by line, see added, removed, and unchanged lines.",
    url: `${MAIN_DOMEN}tools/text-diff`,
    type: "website",
    images: [
      {
        url: `${MAIN_DOMEN}og-image.png`,
        width: 1024,
        height: 1024,
        alt: "Text Diff Online"
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Text Diff Online",
    description: "Side-by-side line diff in your browser."
  },
};

export default function TextDiffPage() {
  return <TextDiff />;
}
