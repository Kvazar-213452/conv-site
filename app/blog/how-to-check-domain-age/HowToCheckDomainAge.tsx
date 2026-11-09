import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function HowToCheckDomainAge(){return <ArticleContent article={expansionArticles.find(a=>a.slug==="how-to-check-domain-age")!}/>;}
