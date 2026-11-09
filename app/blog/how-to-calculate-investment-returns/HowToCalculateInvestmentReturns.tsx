import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function HowToCalculateInvestmentReturns(){return <ArticleContent article={expansionArticles.find(a=>a.slug==="how-to-calculate-investment-returns")!}/>;}
