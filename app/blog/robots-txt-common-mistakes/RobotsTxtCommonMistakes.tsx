import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function RobotsTxtCommonMistakes() { return <ArticleContent article={expansionArticles.find(a => a.slug === "robots-txt-common-mistakes")!} />; }
