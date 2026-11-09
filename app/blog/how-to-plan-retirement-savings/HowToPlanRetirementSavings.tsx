import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function HowToPlanRetirementSavings(){return <ArticleContent article={expansionArticles.find(a=>a.slug==="how-to-plan-retirement-savings")!}/>;}
