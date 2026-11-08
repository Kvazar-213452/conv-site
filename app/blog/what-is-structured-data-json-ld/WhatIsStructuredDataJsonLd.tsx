import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function WhatIsStructuredDataJsonLd() { return <ArticleContent article={expansionArticles.find(a => a.slug === "what-is-structured-data-json-ld")!} />; }
