import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function HowToProtectPdfWithPassword(){return <ArticleContent article={expansionArticles.find(a=>a.slug==="how-to-protect-pdf-with-password")!}/>;}
