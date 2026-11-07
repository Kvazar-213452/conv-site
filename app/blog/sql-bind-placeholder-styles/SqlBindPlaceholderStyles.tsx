import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function SqlBindPlaceholderStyles() { return <ArticleContent article={expansionArticles.find(a => a.slug === "sql-bind-placeholder-styles")!} />; }
