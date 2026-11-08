import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function WhatIsBase64Encoding() { return <ArticleContent article={expansionArticles.find(a => a.slug === "what-is-base64-encoding")!} />; }
