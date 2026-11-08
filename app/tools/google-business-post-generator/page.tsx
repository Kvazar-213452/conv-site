import type { Metadata } from "next";
import GeneratedGrowthPage, { generatedGrowthMetadata } from "@/component/GeneratedGrowthPage";
const slug = "google-business-post-generator";
export function generateMetadata(): Metadata { return generatedGrowthMetadata(slug); }
export default function Page() { return <GeneratedGrowthPage slug={slug} />; }
