import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function HowToRemoveDuplicateLines(){return <ArticleContent article={expansionArticles.find(a=>a.slug==="how-to-remove-duplicate-lines")!}/>;}
