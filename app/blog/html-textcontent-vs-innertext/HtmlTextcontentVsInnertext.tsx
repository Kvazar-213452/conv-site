import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function HtmlTextcontentVsInnertext() { return <ArticleContent article={expansionArticles.find(a => a.slug === "html-textcontent-vs-innertext")!} />; }
