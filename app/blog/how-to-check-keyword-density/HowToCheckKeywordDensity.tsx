import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function HowToCheckKeywordDensity() { return <ArticleContent article={expansionArticles.find(a => a.slug === "how-to-check-keyword-density")!} />; }
