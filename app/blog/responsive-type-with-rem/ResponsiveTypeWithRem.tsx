import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function ResponsiveTypeWithRem() { return <ArticleContent article={expansionArticles.find(a => a.slug === "responsive-type-with-rem")!} />; }
