import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function CurlPostJsonCommand() { return <ArticleContent article={expansionArticles.find(a => a.slug === "curl-post-json-command")!} />; }
