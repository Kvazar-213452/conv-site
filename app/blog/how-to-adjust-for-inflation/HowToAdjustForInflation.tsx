import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function HowToAdjustForInflation(){return <ArticleContent article={expansionArticles.find(a=>a.slug==="how-to-adjust-for-inflation")!}/>;}
