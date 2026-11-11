import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function HowToConvertHeicPhotosFromIphone() { return <ArticleContent article={expansionArticles.find(a => a.slug === "how-to-convert-heic-photos-from-iphone")!} />; }
