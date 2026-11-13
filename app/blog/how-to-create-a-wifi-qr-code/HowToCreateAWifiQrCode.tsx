import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function HowToCreateAWifiQrCode(){return <ArticleContent article={expansionArticles.find(a=>a.slug==="how-to-create-a-wifi-qr-code")!}/>;}
