import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function HowToConvertXmlToJson() { return <ArticleContent article={expansionArticles.find(a => a.slug === "how-to-convert-xml-to-json")!} />; }
