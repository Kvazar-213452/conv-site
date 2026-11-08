import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function Sha256VsMd5WhichHashToUse() { return <ArticleContent article={expansionArticles.find(a => a.slug === "sha256-vs-md5-which-hash-to-use")!} />; }
