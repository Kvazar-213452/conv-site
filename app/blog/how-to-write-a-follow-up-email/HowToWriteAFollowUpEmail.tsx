import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function HowToWriteAFollowUpEmail(){return <ArticleContent article={expansionArticles.find(a=>a.slug==="how-to-write-a-follow-up-email")!}/>;}
