import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function HowToCalculateOvertimePay(){return <ArticleContent article={expansionArticles.find(a=>a.slug==="how-to-calculate-overtime-pay")!}/>;}
