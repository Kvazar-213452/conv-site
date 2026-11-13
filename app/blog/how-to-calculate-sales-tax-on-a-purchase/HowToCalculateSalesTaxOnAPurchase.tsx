import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function HowToCalculateSalesTaxOnAPurchase(){return <ArticleContent article={expansionArticles.find(a=>a.slug==="how-to-calculate-sales-tax-on-a-purchase")!}/>;}
