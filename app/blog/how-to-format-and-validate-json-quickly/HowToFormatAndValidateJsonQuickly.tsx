import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function HowToFormatAndValidateJsonQuickly() { return <ArticleContent article={expansionArticles.find(a => a.slug === "how-to-format-and-validate-json-quickly")!} />; }
