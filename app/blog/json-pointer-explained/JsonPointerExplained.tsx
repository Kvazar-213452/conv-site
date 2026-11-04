import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function JsonPointerExplained() { return <ArticleContent article={expansionArticles.find(a => a.slug === "json-pointer-explained")!} />; }
