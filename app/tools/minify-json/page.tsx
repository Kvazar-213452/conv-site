export const dynamic = "force-static";

import type { Metadata } from "next";
import MinifyJson from "./MinifyJson";
import { MAIN_DOMEN } from "@/lib/config";

export const metadata: Metadata = {
  title: "Minify JSON Online · Free JSON Minifier & Beautifier Tool",
  description: "Instantly minify or beautify JSON online. Free, client-side, validates syntax, shows size savings. Perfect for APIs, configs, and JSON-LD.",
  keywords: ["minify json", "json minifier", "json beautifier", "compress json", "format json", "json formatter online"],
  alternates: { canonical: "/tools/minify-json" },
  openGraph: {
    title: "Minify JSON Online — Free JSON Minifier & Beautifier",
    description: "Compress JSON to a single line or beautify it with proper indentation. Runs 100% in your browser with size statistics.",
    url: `${MAIN_DOMEN}tools/minify-json`,
    type: "website"
  },
  robots: { index: true, follow: true }
};

export default function MinifyJsonPage() {
  return (
    <MinifyJson />
  );
}