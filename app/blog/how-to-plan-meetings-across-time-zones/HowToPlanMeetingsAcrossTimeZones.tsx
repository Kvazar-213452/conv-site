import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function HowToPlanMeetingsAcrossTimeZones() { return <ArticleContent article={expansionArticles.find(a => a.slug === "how-to-plan-meetings-across-time-zones")!} />; }
