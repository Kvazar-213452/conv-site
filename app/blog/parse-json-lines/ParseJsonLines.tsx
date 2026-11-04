import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function ParseJsonLines() { return <ArticleContent article={expansionArticles.find(a => a.slug === "parse-json-lines")!} />; }
