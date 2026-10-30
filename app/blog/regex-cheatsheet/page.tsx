export const dynamic = "force-static";

import type { Metadata } from "next";
import RegexCheatsheet from "./RegexCheatsheet";
import { MAIN_DOMEN, NAME_MAKE } from "@/lib/config";

export const metadata: Metadata = {
  title: "JavaScript Regex Cheatsheet – Patterns, Flags, and Groups",
  description: "A quick reference for JavaScript regular expressions: character classes, quantifiers, anchors, flags, groups, lookarounds, and common recipes.",
  keywords: [
    "regex cheatsheet",
    "javascript regex",
    "regular expression reference",
    "regex flags",
    "lookahead",
    "lookbehind",
    "capture groups"
  ],
  authors: [{ name: NAME_MAKE }],
  alternates: { canonical: "/blog/regex-cheatsheet" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "JavaScript Regex Cheatsheet",
    description: "Quick reference for JavaScript regex syntax, flags, and recipes.",
    url: `${MAIN_DOMEN}blog/regex-cheatsheet`,
    type: "article",
    images: [{ url: `${MAIN_DOMEN}icon.png`, width: 1200, height: 630, alt: "Regex Cheatsheet" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "JavaScript Regex Cheatsheet",
    description: "The patterns you reach for most often.",
  },
};

export default function RegexCheatsheetPage() {
  return <RegexCheatsheet />;
}
