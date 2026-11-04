import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function HtmlToPlainText() { return <ArticleContent article={expansionArticles.find(a => a.slug === "html-to-plain-text")!} />; }
