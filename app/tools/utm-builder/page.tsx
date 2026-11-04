export const dynamic = "force-static";

import type { Metadata } from "next";
import UtmBuilder from "./UtmBuilder";
import { MAIN_DOMEN, NAME_MAKE } from "@/lib/config";

export const metadata: Metadata = {
  title: "UTM Link Builder – Free Campaign URL Generator Online",
  description: "Build UTM campaign URLs with source, medium, campaign, term, and content parameters. Track marketing campaigns in Google Analytics. Free, client-side, and private.",
  keywords: [
    "utm builder",
    "utm generator",
    "utm link builder",
    "campaign url builder",
    "google analytics utm",
    "utm parameters",
    "utm creator",
    "campaign tracking url",
    "utm tag generator",
    "free utm builder"
  ],
  authors: [{ name: NAME_MAKE }],
  alternates: { canonical: "/tools/utm-builder" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "UTM Link Builder Online",
    description: "Build campaign tracking URLs with UTM parameters for Google Analytics. Free and private.",
    url: `${MAIN_DOMEN}tools/utm-builder`,
    type: "website",
    images: [{ url: `${MAIN_DOMEN}og-image.png`, width: 1024, height: 1024, alt: "UTM Link Builder Online Tool" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "UTM Link Builder Online",
    description: "Generate UTM campaign URLs for marketing analytics tracking. Fully private and client-side."
  },
};

export default function UtmBuilderPage() {
  return <UtmBuilder />;
}
