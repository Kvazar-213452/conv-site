import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function HowToCalculateDiscountPercentage(){return <ArticleContent article={expansionArticles.find(a=>a.slug==="how-to-calculate-discount-percentage")!}/>;}
