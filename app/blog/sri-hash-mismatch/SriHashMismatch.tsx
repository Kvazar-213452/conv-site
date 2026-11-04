import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function SriHashMismatch() { return <ArticleContent article={expansionArticles.find(a => a.slug === "sri-hash-mismatch")!} />; }
