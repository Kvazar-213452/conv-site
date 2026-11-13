import type { Metadata } from "next";
import HowToCreateAWeeklyMealPlan from "./HowToCreateAWeeklyMealPlan";
import { expansionArticles } from "@/lib/expansion-articles";
import { pageMetadata, PageSchema } from "@/component/ContentSeo";
const article=expansionArticles.find(a=>a.slug==="how-to-create-a-weekly-meal-plan")!;
export const dynamic="force-static";
export const metadata:Metadata=pageMetadata(article.title,article.description,"/blog/how-to-create-a-weekly-meal-plan",true);
export default function Page(){return <><PageSchema title={article.title} description={article.description} path={"/blog/how-to-create-a-weekly-meal-plan"} kind="article" date={article.date}/><HowToCreateAWeeklyMealPlan/></>;}
