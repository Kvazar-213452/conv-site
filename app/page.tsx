export const dynamic = "force-static";

import Home from "./Home";
import { pageMetadata } from "@/component/ContentSeo";
import { toolCatalog } from "@/lib/tool-catalog";
export const metadata = pageMetadata(
  "Free Online Tools – PDF, Photos, Audio & More",
  `${toolCatalog.length} free tools for PDF compression, photo conversion, image OCR, documents, audio and developer tasks. Search by task or browse categories. No sign-up required.`,
  "/"
);
export default function HomePage() { return <Home />; }
