import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function UnicodeCodePoints() { return <ArticleContent article={expansionArticles.find(a => a.slug === "unicode-code-points")!} />; }
