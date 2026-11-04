import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function JsonVsNdjson() { return <ArticleContent article={expansionArticles.find(a => a.slug === "json-vs-ndjson")!} />; }
