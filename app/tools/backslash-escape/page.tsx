export const dynamic = "force-static";

import type { Metadata } from "next";
import BackslashEscape from "./BackslashEscape";
import { MAIN_DOMEN, NAME_MAKE } from "@/lib/config";

export const metadata: Metadata = {
  title: "Backslash Escape/Unescape – Online String Escaper",
  description: "Escape and unescape strings for JSON, JavaScript, Python, HTML, and URLs. Handle special characters, newlines, quotes, and backslashes safely. Free and private.",
  keywords: [
    "escape string online",
    "unescape string",
    "backslash escape",
    "json escape",
    "javascript escape",
    "python escape",
    "html escape",
    "url encode",
    "string escaper",
    "free tool"
  ],
  authors: [{ name: NAME_MAKE }],
  alternates: {
    canonical: "/tools/backslash-escape",
  },
  robots: { index: true, follow: true },
  openGraph: {
    title: "String Escape/Unescape Online",
    description: "Escape and unescape strings for JSON, JavaScript, Python, HTML, and URLs. Runs entirely in your browser.",
    url: `${MAIN_DOMEN}tools/backslash-escape`,
    type: "website",
    images: [
      {
        url: `${MAIN_DOMEN}og-image.png`,
        width: 1024,
        height: 1024,
        alt: "Backslash Escape Online Tool"
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "String Escape/Unescape Online",
    description: "Escape and unescape strings for JSON, JavaScript, Python, HTML, and URLs. Fully private and client-side."
  },
};

export default function BackslashEscapePage() {
  return (
    <BackslashEscape />
  );
}
