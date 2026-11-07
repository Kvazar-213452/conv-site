import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function UnixSecondsVsMilliseconds() { return <ArticleContent article={expansionArticles.find(a => a.slug === "unix-seconds-vs-milliseconds")!} />; }
