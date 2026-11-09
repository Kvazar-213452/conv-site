import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function HowToCalculatePregnancyWeeks(){return <ArticleContent article={expansionArticles.find(a=>a.slug==="how-to-calculate-pregnancy-weeks")!}/>;}
