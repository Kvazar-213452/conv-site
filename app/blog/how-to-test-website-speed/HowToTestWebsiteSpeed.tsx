import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function HowToTestWebsiteSpeed(){return <ArticleContent article={expansionArticles.find(a=>a.slug==="how-to-test-website-speed")!}/>;}
