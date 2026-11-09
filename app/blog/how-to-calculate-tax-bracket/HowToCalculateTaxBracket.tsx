import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function HowToCalculateTaxBracket(){return <ArticleContent article={expansionArticles.find(a=>a.slug==="how-to-calculate-tax-bracket")!}/>;}
