import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function HowToCheckBacklinks(){return <ArticleContent article={expansionArticles.find(a=>a.slug==="how-to-check-backlinks")!}/>;}
