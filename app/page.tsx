export const dynamic = "force-static";

import Home from "./Home";
import { pageMetadata } from "@/component/ContentSeo";
import { toolCatalog } from "@/lib/tool-catalog";
export const metadata = pageMetadata(
  "Free Developer Tools – JSON, CSS, Images & More",
  `${toolCatalog.length} free online tools for JSON, SQL, CSS, images, encoding, text and calculations. Search by task or browse categories. No sign-up required.`,
  "/"
);
export default function HomePage() { return <Home />; }
