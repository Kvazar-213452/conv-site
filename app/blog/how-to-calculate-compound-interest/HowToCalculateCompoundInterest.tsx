import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function HowToCalculateCompoundInterest() { return <ArticleContent article={expansionArticles.find(a => a.slug === "how-to-calculate-compound-interest")!} />; }
