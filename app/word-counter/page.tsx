export const dynamic = "force-static";

import type { Metadata } from "next";
import WordCounter from "./WordCounter";

export const metadata: Metadata = {
  title: "Word Counter – Free Online Text Analyzer",
  description: "Instantly count words, characters, sentences, paragraphs, and reading time. See unique words and top word frequency. Fully client-side and private.",
  keywords: [
    "word counter",
    "character count",
    "text analyzer",
    "reading time",
    "top words",
    "unique words",
    "online tool",
    "client-side",
    "free tool",
    "text statistics"
  ],
  authors: [{ name: "Your Name" }],
  robots: { index: true, follow: true },
  openGraph: {
    title: "Word Counter Online",
    description: "Paste any text and get detailed statistics: words, characters, sentences, paragraphs, reading time, unique words, and top frequency. Runs entirely in your browser.",
    url: "https://yoursite.com/word-counter",
    type: "website",
    images: [
      {
        url: "https://yoursite.com/og-image-wordcounter.png",
        width: 1200,
        height: 630,
        alt: "Word Counter Online Tool"
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Word Counter Online",
    description: "Instantly analyze text with detailed word and character counts, reading time, and top word frequency. Fully private and client-side.",
    images: ["https://yoursite.com/og-image-wordcounter.png"],
    creator: "@YourTwitterHandle"
  },
};

export default function WordCounterPage() {
  return (
    <WordCounter />
  );
}