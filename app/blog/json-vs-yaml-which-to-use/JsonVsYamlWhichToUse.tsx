import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function JsonVsYamlWhichToUse() { return <ArticleContent article={expansionArticles.find(a => a.slug === "json-vs-yaml-which-to-use")!} />; }
