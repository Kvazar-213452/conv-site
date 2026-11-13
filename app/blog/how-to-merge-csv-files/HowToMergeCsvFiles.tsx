import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function HowToMergeCsvFiles(){return <ArticleContent article={expansionArticles.find(a=>a.slug==="how-to-merge-csv-files")!}/>;}
