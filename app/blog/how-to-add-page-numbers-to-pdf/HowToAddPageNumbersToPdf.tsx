import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function HowToAddPageNumbersToPdf(){return <ArticleContent article={expansionArticles.find(a=>a.slug==="how-to-add-page-numbers-to-pdf")!}/>;}
