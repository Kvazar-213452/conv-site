import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function HowToCreateAnEmailSignature(){return <ArticleContent article={expansionArticles.find(a=>a.slug==="how-to-create-an-email-signature")!}/>;}
