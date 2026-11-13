import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function HowToPlanATripBudget(){return <ArticleContent article={expansionArticles.find(a=>a.slug==="how-to-plan-a-trip-budget")!}/>;}
