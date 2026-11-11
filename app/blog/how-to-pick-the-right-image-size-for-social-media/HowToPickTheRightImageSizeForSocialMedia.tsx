import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function HowToPickTheRightImageSizeForSocialMedia() { return <ArticleContent article={expansionArticles.find(a => a.slug === "how-to-pick-the-right-image-size-for-social-media")!} />; }
