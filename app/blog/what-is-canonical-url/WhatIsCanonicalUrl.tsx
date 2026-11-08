import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function WhatIsCanonicalUrl() { return <ArticleContent article={expansionArticles.find(a => a.slug === "what-is-canonical-url")!} />; }
