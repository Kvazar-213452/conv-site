import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function HowToMakeAPlantWateringSchedule(){return <ArticleContent article={expansionArticles.find(a=>a.slug==="how-to-make-a-plant-watering-schedule")!}/>;}
