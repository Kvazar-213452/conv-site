import { ArticleContent } from "@/component/ContentSeo";
import { expansionArticles } from "@/lib/expansion-articles";
export default function HowToCreateMeetingAgenda() { return <ArticleContent article={expansionArticles.find(a => a.slug === "how-to-create-meeting-agenda")!} />; }
