import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function HowToConvertWordToPdf(){return <ArticleContent article={expansionArticles.find(a=>a.slug==="how-to-convert-word-to-pdf")!}/>;}
