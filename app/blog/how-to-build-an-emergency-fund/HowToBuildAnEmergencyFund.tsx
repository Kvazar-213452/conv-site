import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function HowToBuildAnEmergencyFund(){return <ArticleContent article={expansionArticles.find(a=>a.slug==="how-to-build-an-emergency-fund")!}/>;}
