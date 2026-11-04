export const dynamic = "force-static";

import type { Metadata } from "next";
import JsonToHtmlTable from "./JsonToHtmlTable";
import { MAIN_DOMEN, NAME_MAKE } from "@/lib/config";

export const metadata: Metadata = {
  title: "JSON to HTML Table – Convert JSON Array to Table Online",
  description: "Convert JSON arrays to clean HTML tables with automatic header detection. Optional row indexing and pretty-printed output. Free, client-side, and private.",
  keywords: [
    "json to table",
    "json to html table",
    "json array to table",
    "convert json to table",
    "json table generator",
    "json to html",
    "json display table",
    "json viewer table",
    "online tool",
    "free tool"
  ],
  authors: [{ name: NAME_MAKE }],
  alternates: { canonical: "/tools/json-to-html-table" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "JSON to HTML Table Converter Online",
    description: "Convert JSON arrays into clean HTML tables with automatic headers. Runs entirely in your browser.",
    url: `${MAIN_DOMEN}tools/json-to-html-table`,
    type: "website",
    images: [{ url: `${MAIN_DOMEN}og-image.png`, width: 1024, height: 1024, alt: "JSON to HTML Table Online Tool" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "JSON to HTML Table Online",
    description: "Convert JSON arrays to HTML tables with automatic header detection. Fully private and client-side."
  },
};

export default function JsonToHtmlTablePage() {
  return <JsonToHtmlTable />;
}
