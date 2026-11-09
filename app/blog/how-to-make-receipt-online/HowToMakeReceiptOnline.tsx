import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function HowToMakeReceiptOnline(){return <ArticleContent article={expansionArticles.find(a=>a.slug==="how-to-make-receipt-online")!}/>;}
