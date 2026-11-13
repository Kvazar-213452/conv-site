import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function HowToRotatePdfPages(){return <ArticleContent article={expansionArticles.find(a=>a.slug==="how-to-rotate-pdf-pages")!}/>;}
