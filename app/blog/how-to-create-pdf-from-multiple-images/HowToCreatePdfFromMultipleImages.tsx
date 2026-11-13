import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function HowToCreatePdfFromMultipleImages(){return <ArticleContent article={expansionArticles.find(a=>a.slug==="how-to-create-pdf-from-multiple-images")!}/>;}
