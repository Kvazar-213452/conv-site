import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function InferZodSchemaFromJson() { return <ArticleContent article={expansionArticles.find(a => a.slug === "infer-zod-schema-from-json")!} />; }
