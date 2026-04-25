export const dynamic = "force-static";

import type { Metadata } from "next";
import JsonFormatter from "./JsonFormatter";
import { MAIN_DOMEN } from "@/lib/config";

export const metadata: Metadata = {
  title: "JSON Formatter for Large Files · Free Online JSON Beautifier",
  description: "Format and minify large JSON files (up to 100 MB) directly in your browser. Drag-and-drop upload, 2/4 spaces or tabs, full privacy.",
  keywords: [
    "json formatter",
    "large json formatter",
    "json beautifier large files",
    "format large json",
    "json formatter online",
    "json pretty print"
  ],
  alternates: { canonical: "/tools/json-formatter" },
  openGraph: {
    title: "JSON Formatter for Large Files",
    description: "Format and minify JSON files up to 100 MB locally in your browser. Drag-and-drop upload, configurable indentation.",
    url: `${MAIN_DOMEN}tools/json-formatter`,
    type: "website"
  },
  robots: { index: true, follow: true }
};

export default function JsonFormatterPage() {
  return (
    <JsonFormatter />
  );
}