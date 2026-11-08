import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function HowToDecodeJwtToken() { return <ArticleContent article={expansionArticles.find(a => a.slug === "how-to-decode-jwt-token")!} />; }
