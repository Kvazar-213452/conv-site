export const dynamic = "force-static";

import type { Metadata } from "next";
import HtmlToJsx from "./HtmlToJsx";
import { MAIN_DOMEN, NAME_MAKE } from "@/lib/config";

export const metadata: Metadata = {
  title: "HTML to JSX Converter – Convert HTML to React JSX Online",
  description: "Convert HTML to React JSX instantly. Transforms class to className, for to htmlFor, style strings to objects, self-closing tags, and HTML comments to JSX. Free and private.",
  keywords: [
    "html to jsx",
    "html to jsx converter",
    "html to react",
    "convert html to jsx",
    "class to classname",
    "html jsx online",
    "react converter",
    "jsx converter",
    "html to react component",
    "free tool"
  ],
  authors: [{ name: NAME_MAKE }],
  alternates: { canonical: "/tools/html-to-jsx" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "HTML to JSX Converter Online",
    description: "Convert HTML to React JSX — class to className, style strings to objects, self-closing tags. Runs in your browser.",
    url: `${MAIN_DOMEN}tools/html-to-jsx`,
    type: "website",
    images: [{ url: `${MAIN_DOMEN}og-image.png`, width: 1024, height: 1024, alt: "HTML to JSX Converter Online" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "HTML to JSX Converter Online",
    description: "Convert HTML to React JSX instantly. Handles className, htmlFor, style objects, and self-closing tags."
  },
};

export default function HtmlToJsxPage() {
  return <HtmlToJsx />;
}
