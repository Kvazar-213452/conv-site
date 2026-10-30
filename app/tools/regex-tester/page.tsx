export const dynamic = "force-static";

import type { Metadata } from "next";
import RegexTester from "./RegexTester";
import { MAIN_DOMEN, NAME_MAKE } from "@/lib/config";

export const metadata: Metadata = {
  title: "Regex Tester – Live JavaScript Regex Playground",
  description: "Build and debug JavaScript regular expressions with live highlighting, capture groups, and match counts. 100% client-side and private.",
  keywords: [
    "regex tester",
    "regexp",
    "regular expression",
    "javascript regex",
    "pattern matching",
    "capture groups",
    "online tool",
    "client-side",
    "private tool",
    "no sign-up"
  ],
  authors: [{ name: NAME_MAKE }],
  alternates: {
    canonical: "/tools/regex-tester",
  },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Regex Tester Online",
    description: "JavaScript-flavored regex playground with live highlighting and capture groups.",
    url: `${MAIN_DOMEN}tools/regex-tester`,
    type: "website",
    images: [
      {
        url: `${MAIN_DOMEN}icon.png`,
        width: 1200,
        height: 630,
        alt: "Regex Tester Online"
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Regex Tester Online",
    description: "Live-highlighting JavaScript regex tester with capture groups."
  },
};

export default function RegexTesterPage() {
  return <RegexTester />;
}
