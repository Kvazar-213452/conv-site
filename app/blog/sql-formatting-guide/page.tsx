export const dynamic = "force-static";

import type { Metadata } from "next";
import SqlFormattingGuide from "./SqlFormattingGuide";
import { MAIN_DOMEN, NAME_MAKE } from "@/lib/config";

export const metadata: Metadata = {
  title: "SQL Formatting Guide – Writing Readable Queries",
  description: "A practical style guide for writing SQL that reads well in code review. Clause placement, aliases, comments, and dialect quirks.",
  keywords: [
    "sql formatting",
    "sql style guide",
    "readable sql",
    "sql code review",
    "sql best practices",
    "postgres style",
    "mysql style"
  ],
  authors: [{ name: NAME_MAKE }],
  alternates: { canonical: "/blog/sql-formatting-guide" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "SQL Formatting Guide",
    description: "Make SQL readable — clause layout, aliases, comments, and dialect pitfalls.",
    url: `${MAIN_DOMEN}blog/sql-formatting-guide`,
    type: "article",
    images: [{ url: `${MAIN_DOMEN}og-image.png`, width: 1024, height: 1024, alt: "SQL Formatting Guide" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "SQL Formatting Guide",
    description: "Readable SQL conventions for code review.",
  },
};

export default function SqlFormattingGuidePage() {
  return <SqlFormattingGuide />;
}
