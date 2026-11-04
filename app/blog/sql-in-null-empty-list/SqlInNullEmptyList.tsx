import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function SqlInNullEmptyList() { return <ArticleContent article={expansionArticles.find(a => a.slug === "sql-in-null-empty-list")!} />; }
