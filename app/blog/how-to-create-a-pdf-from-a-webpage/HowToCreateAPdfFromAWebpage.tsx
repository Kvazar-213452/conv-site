import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function HowToCreateAPdfFromAWebpage(){return <ArticleContent article={expansionArticles.find(a=>a.slug==="how-to-create-a-pdf-from-a-webpage")!}/>;}
