import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function HowToCreateAWeeklyMealPlan(){return <ArticleContent article={expansionArticles.find(a=>a.slug==="how-to-create-a-weekly-meal-plan")!}/>;}
