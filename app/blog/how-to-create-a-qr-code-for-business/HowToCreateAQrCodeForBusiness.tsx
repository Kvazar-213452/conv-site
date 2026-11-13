import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function HowToCreateAQrCodeForBusiness(){return <ArticleContent article={expansionArticles.find(a=>a.slug==="how-to-create-a-qr-code-for-business")!}/>;}
