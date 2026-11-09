import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function HowToConvertSqlToJson(){return <ArticleContent article={expansionArticles.find(a=>a.slug==="how-to-convert-sql-to-json")!}/>;}
