import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function HowToWriteLinkedinPost() { return <ArticleContent article={expansionArticles.find(a => a.slug === "how-to-write-linkedin-post")!} />; }
