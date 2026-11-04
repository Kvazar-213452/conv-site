import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function RobotsTxtVsNoindex() { return <ArticleContent article={expansionArticles.find(a => a.slug === "robots-txt-vs-noindex")!} />; }
