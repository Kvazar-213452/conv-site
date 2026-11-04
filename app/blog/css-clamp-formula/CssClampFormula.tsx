import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function CssClampFormula() { return <ArticleContent article={expansionArticles.find(a => a.slug === "css-clamp-formula")!} />; }
