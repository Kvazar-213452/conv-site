import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function HowToCompressPdfUnder1mb() { return <ArticleContent article={expansionArticles.find(a => a.slug === "how-to-compress-pdf-under-1mb")!} />; }
