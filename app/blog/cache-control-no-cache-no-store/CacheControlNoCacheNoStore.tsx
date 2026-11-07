import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function CacheControlNoCacheNoStore() { return <ArticleContent article={expansionArticles.find(a => a.slug === "cache-control-no-cache-no-store")!} />; }
