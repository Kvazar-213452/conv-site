import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function HowToCountSentencesInText(){return <ArticleContent article={expansionArticles.find(a=>a.slug==="how-to-count-sentences-in-text")!}/>;}
