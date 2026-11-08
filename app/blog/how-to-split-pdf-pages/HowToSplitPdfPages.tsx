import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function HowToSplitPdfPages() { return <ArticleContent article={expansionArticles.find(a => a.slug === "how-to-split-pdf-pages")!} />; }
