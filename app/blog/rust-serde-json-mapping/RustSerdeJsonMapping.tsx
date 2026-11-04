import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function RustSerdeJsonMapping() { return <ArticleContent article={expansionArticles.find(a => a.slug === "rust-serde-json-mapping")!} />; }
