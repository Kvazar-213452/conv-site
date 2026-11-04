export const dynamic = "force-static";

import type { Metadata } from "next";
import YamlFormatter from "./YamlFormatter";
import { MAIN_DOMEN, NAME_MAKE } from "@/lib/config";

export const metadata: Metadata = {
  title: "YAML Formatter – Pretty-Print YAML Online",
  description: "Format and pretty-print YAML configuration files with configurable indentation. Minify YAML by stripping comments and whitespace. Free, client-side, and private.",
  keywords: [
    "yaml formatter",
    "yaml pretty print",
    "format yaml online",
    "yaml beautifier",
    "yaml minifier",
    "yaml indent",
    "yaml linter",
    "yaml tool",
    "online tool",
    "free tool"
  ],
  authors: [{ name: NAME_MAKE }],
  alternates: {
    canonical: "/tools/yaml-formatter",
  },
  robots: { index: true, follow: true },
  openGraph: {
    title: "YAML Formatter Online",
    description: "Pretty-print or minify YAML configuration files with configurable indentation. Runs entirely in your browser.",
    url: `${MAIN_DOMEN}tools/yaml-formatter`,
    type: "website",
    images: [
      {
        url: `${MAIN_DOMEN}og-image.png`,
        width: 1024,
        height: 1024,
        alt: "YAML Formatter Online Tool"
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "YAML Formatter Online",
    description: "Format, beautify, and minify YAML files with configurable options. Fully private and client-side."
  },
};

export default function YamlFormatterPage() {
  return (
    <YamlFormatter />
  );
}
