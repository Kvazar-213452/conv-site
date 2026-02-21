export const dynamic = "force-static";

import type { Metadata } from "next";
import RemoveDuplicateLines from "./RemoveDuplicateLines";

export const metadata: Metadata = {
  title: "Remove Duplicate Lines Online – Free & Private",
  description: "Instantly remove duplicate lines from any text. Supports case sensitivity, trimming, empty line removal, and sorting. Runs 100% in your browser — your data stays private.",
  keywords: [
    "remove duplicates",
    "deduplicate text",
    "online tool",
    "text cleaner",
    "case-sensitive",
    "trim lines",
    "sort lines",
    "unique lines",
    "private tool",
    "no sign-up"
  ],
  authors: [{ name: "Your Name" }],
  robots: { index: true, follow: true },
  openGraph: {
    title: "Remove Duplicate Lines Online",
    description: "Paste any text and instantly remove duplicate lines with configurable options. Fully client-side and private.",
    url: "https://yoursite.com/remove-duplicate-lines",
    type: "website",
    images: [
      {
        url: "https://yoursite.com/og-image-remove-duplicates.png",
        width: 1200,
        height: 630,
        alt: "Remove Duplicate Lines Online"
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Remove Duplicate Lines Online",
    description: "Remove duplicate lines instantly with flexible options. Runs entirely in your browser — private and free.",
    images: ["https://yoursite.com/og-image-remove-duplicates.png"],
    creator: "@YourTwitterHandle"
  },
};

export default function RemoveDuplicateLinesPage() {
  return (
    <RemoveDuplicateLines />
  );
}