import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function WhatAreOpenGraphMetaTags() { return <ArticleContent article={expansionArticles.find(a => a.slug === "what-are-open-graph-meta-tags")!} />; }
