import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function HowToTestEmailDeliverability(){return <ArticleContent article={expansionArticles.find(a=>a.slug==="how-to-test-email-deliverability")!}/>;}
