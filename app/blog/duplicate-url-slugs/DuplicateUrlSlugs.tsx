import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function DuplicateUrlSlugs() { return <ArticleContent article={expansionArticles.find(a => a.slug === "duplicate-url-slugs")!} />; }
