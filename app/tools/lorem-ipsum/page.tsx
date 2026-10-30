export const dynamic = "force-static";

import type { Metadata } from "next";
import LoremIpsum from "./LoremIpsum";
import { MAIN_DOMEN, NAME_MAKE } from "@/lib/config";

export const metadata: Metadata = {
  title: "Lorem Ipsum Generator – Placeholder Text",
  description: "Generate Lorem Ipsum placeholder text by paragraphs, sentences, or words. Fully configurable, client-side, and free.",
  keywords: [
    "lorem ipsum",
    "placeholder text",
    "dummy text",
    "mockup text",
    "lipsum",
    "online tool",
    "client-side",
    "private tool",
    "no sign-up"
  ],
  authors: [{ name: NAME_MAKE }],
  alternates: {
    canonical: "/tools/lorem-ipsum",
  },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Lorem Ipsum Generator",
    description: "Generate placeholder text by paragraphs, sentences, or words.",
    url: `${MAIN_DOMEN}tools/lorem-ipsum`,
    type: "website",
    images: [
      {
        url: `${MAIN_DOMEN}icon.png`,
        width: 1200,
        height: 630,
        alt: "Lorem Ipsum Generator"
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lorem Ipsum Generator",
    description: "Placeholder text in paragraphs, sentences, or words."
  },
};

export default function LoremIpsumPage() {
  return <LoremIpsum />;
}
