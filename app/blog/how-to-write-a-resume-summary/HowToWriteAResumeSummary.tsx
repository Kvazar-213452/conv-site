import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function HowToWriteAResumeSummary(){return <ArticleContent article={expansionArticles.find(a=>a.slug==="how-to-write-a-resume-summary")!}/>;}
