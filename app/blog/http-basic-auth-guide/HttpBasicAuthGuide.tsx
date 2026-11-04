import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function HttpBasicAuthGuide() { return <ArticleContent article={expansionArticles.find(a => a.slug === "http-basic-auth-guide")!} />; }
