import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function HowToUseCssGridLayoutForBeginners() { return <ArticleContent article={expansionArticles.find(a => a.slug === "how-to-use-css-grid-layout-for-beginners")!} />; }
