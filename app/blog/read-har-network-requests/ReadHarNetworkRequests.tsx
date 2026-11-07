import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function ReadHarNetworkRequests() { return <ArticleContent article={expansionArticles.find(a => a.slug === "read-har-network-requests")!} />; }
