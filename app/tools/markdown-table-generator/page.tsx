export const dynamic = "force-static";

import type { Metadata } from "next";
import MarkdownTableGenerator from "./MarkdownTableGenerator";
import { MAIN_DOMEN, NAME_MAKE } from "@/lib/config";

export const metadata: Metadata = {
  title: "Markdown Table Generator – Create Markdown Tables Online",
  description: "Generate GitHub-flavored Markdown tables with an interactive editor. Set column alignment, add rows, and copy the result. Free, client-side, and private.",
  keywords: [
    "markdown table generator",
    "markdown table creator",
    "create markdown table",
    "markdown table online",
    "github markdown table",
    "gfm table generator",
    "markdown table builder",
    "markdown table editor",
    "online tool",
    "free tool"
  ],
  authors: [{ name: NAME_MAKE }],
  alternates: { canonical: "/tools/markdown-table-generator" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Markdown Table Generator Online",
    description: "Create GitHub-flavored Markdown tables with an interactive editor. Copy-paste ready output.",
    url: `${MAIN_DOMEN}tools/markdown-table-generator`,
    type: "website",
    images: [{ url: `${MAIN_DOMEN}og-image.png`, width: 1024, height: 1024, alt: "Markdown Table Generator Online Tool" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Markdown Table Generator Online",
    description: "Interactive Markdown table builder with alignment controls. Fully private and client-side."
  },
};

export default function MarkdownTableGeneratorPage() {
  return <MarkdownTableGenerator />;
}
