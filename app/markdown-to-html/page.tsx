export const dynamic = "force-static";

import type { Metadata } from "next";
import MarkdownToHtml from "./MarkdownToHtml";
import { MAIN_DOMEN } from "@/lib/config";

export const metadata: Metadata = {
  title: "Markdown to HTML Converter & Live Preview",
  description: "Online Markdown editor with real-time preview, syntax highlighting, and HTML export. Fully client-side, no signup required.",
  keywords: ["markdown editor", "markdown to html", "live preview", "syntax highlighting", "online tool"],
  openGraph: {
    title: "Markdown → HTML Converter",
    description: "Instantly convert Markdown to HTML with live preview and syntax highlighting.",
    url: `${MAIN_DOMEN}markdown-to-html`,
    type: "website",
  },
  robots: { index: true, follow: true }
};

export default function MarkdownToHtmlPage() {
  return (
    <MarkdownToHtml />
  );
}