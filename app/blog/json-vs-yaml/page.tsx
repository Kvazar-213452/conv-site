export const dynamic = "force-static";

import type { Metadata } from "next";
import JsonVsYaml from "./JsonVsYaml";
import { MAIN_DOMEN, NAME_MAKE } from "@/lib/config";

export const metadata: Metadata = {
  title: "JSON vs YAML – When to Use Each Format",
  description: "A practical comparison of JSON and YAML: syntax, readability, use cases, pitfalls, and when each format wins. 100% actionable guide for developers.",
  keywords: [
    "json vs yaml",
    "json or yaml",
    "configuration files",
    "data serialization",
    "yaml syntax",
    "json syntax",
    "devops",
    "kubernetes config"
  ],
  authors: [{ name: NAME_MAKE }],
  alternates: { canonical: "/blog/json-vs-yaml" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "JSON vs YAML: Practical Comparison",
    description: "Which format should you reach for? A field guide to JSON and YAML with real examples.",
    url: `${MAIN_DOMEN}blog/json-vs-yaml`,
    type: "article",
    images: [{ url: `${MAIN_DOMEN}og-image.png`, width: 1024, height: 1024, alt: "JSON vs YAML" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "JSON vs YAML: Practical Comparison",
    description: "Field guide with syntax, pitfalls, and decision rules.",
  },
};

export default function JsonVsYamlPage() {
  return <JsonVsYaml />;
}
