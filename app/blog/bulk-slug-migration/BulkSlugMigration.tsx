import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function BulkSlugMigration() { return <ArticleContent article={expansionArticles.find(a => a.slug === "bulk-slug-migration")!} />; }
