import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function HowToReadBloodPressureChart(){return <ArticleContent article={expansionArticles.find(a=>a.slug==="how-to-read-blood-pressure-chart")!}/>;}
