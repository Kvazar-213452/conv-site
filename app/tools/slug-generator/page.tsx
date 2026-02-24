export const dynamic = "force-static";

import type { Metadata } from "next";
import SlugGenerator from "./SlugGenerator";
import { MAIN_DOMEN, NAME_MAKE } from "@/lib/config";

export const metadata: Metadata = {
  title: "Slug Generator – Free & Private",
  description: "Turn any text into a clean, URL-friendly slug instantly. Supports Cyrillic transliteration, stop-word removal, custom separators, and length limits. Runs entirely in your browser — private and free.",
  keywords: [
    "slug generator",
    "generate slug",
    "URL friendly",
    "transliteration",
    "remove stop words",
    "custom separator",
    "client-side",
    "private tool",
    "no sign-up"
  ],
  authors: [{ name: NAME_MAKE }],
  alternates: {
    canonical: "/tools/slug-generator",
  },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Slug Generator Online",
    description: "Generate clean URL slugs from any text instantly with flexible options. Fully client-side and private.",
    url: `${MAIN_DOMEN}tools/slug-generator`,
    type: "website",
    images: [
      {
        url: `${MAIN_DOMEN}icon.png`,
        width: 1200,
        height: 630,
        alt: "Slug Generator Online"
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Slug Generator Online",
    description: "Generate URL-friendly slugs instantly with options for separators, transliteration, stop-word removal, and max length. Private and free."
  },
};

export default function SlugGeneratorPage() {
  return (
    <SlugGenerator />
  );
}