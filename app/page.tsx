export const dynamic = "force-static";

import Home from "./Home";
import { pageMetadata } from "@/component/ContentSeo";
import { toolCatalog } from "@/lib/tool-catalog";
export const metadata = pageMetadata(
  `Utilixio – ${toolCatalog.length} Free Online Tools`,
  `${toolCatalog.length} free tools: PDF merge & compress, calculators, SEO helpers, AI writing, image converters, JSON formatters and more. No sign-up, works in your browser.`,
  "/"
);
export default function HomePage() { return <Home />; }
