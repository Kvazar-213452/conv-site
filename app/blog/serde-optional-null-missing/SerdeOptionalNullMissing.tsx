import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function SerdeOptionalNullMissing() { return <ArticleContent article={expansionArticles.find(a => a.slug === "serde-optional-null-missing")!} />; }
