import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function ReadEmailReceivedHeaders() { return <ArticleContent article={expansionArticles.find(a => a.slug === "read-email-received-headers")!} />; }
