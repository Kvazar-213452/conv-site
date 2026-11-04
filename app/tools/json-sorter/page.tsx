export const dynamic = "force-static";

import type { Metadata } from "next";
import JsonSorter from "./JsonSorter";
import { MAIN_DOMEN, NAME_MAKE } from "@/lib/config";

export const metadata: Metadata = {
  title: "JSON Key Sorter – Sort JSON Keys Alphabetically Online",
  description: "Sort JSON object keys alphabetically or in reverse order. Recursive sorting for nested objects with configurable indentation. Free, client-side, and private.",
  keywords: [
    "json sorter",
    "sort json keys",
    "alphabetize json",
    "json key order",
    "sort json online",
    "json organizer",
    "recursive json sort",
    "json formatter",
    "json tool",
    "free tool"
  ],
  authors: [{ name: NAME_MAKE }],
  alternates: {
    canonical: "/tools/json-sorter",
  },
  robots: { index: true, follow: true },
  openGraph: {
    title: "JSON Key Sorter Online",
    description: "Sort JSON object keys alphabetically with recursive nested sorting. Runs entirely in your browser — nothing leaves your device.",
    url: `${MAIN_DOMEN}tools/json-sorter`,
    type: "website",
    images: [
      {
        url: `${MAIN_DOMEN}og-image.png`,
        width: 1024,
        height: 1024,
        alt: "JSON Key Sorter Online Tool"
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "JSON Key Sorter Online",
    description: "Sort JSON keys alphabetically or reverse. Recursive deep sorting with configurable options. Fully private and client-side."
  },
};

export default function JsonSorterPage() {
  return (
    <JsonSorter />
  );
}
