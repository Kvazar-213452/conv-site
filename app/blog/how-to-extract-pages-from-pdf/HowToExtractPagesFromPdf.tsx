import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function HowToExtractPagesFromPdf(){return <ArticleContent article={expansionArticles.find(a=>a.slug==="how-to-extract-pages-from-pdf")!}/>;}
