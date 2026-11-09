import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function HowToConvertPptToPdf(){return <ArticleContent article={expansionArticles.find(a=>a.slug==="how-to-convert-ppt-to-pdf")!}/>;}
