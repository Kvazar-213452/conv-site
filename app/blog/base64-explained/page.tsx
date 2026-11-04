export const dynamic = "force-static";

import type { Metadata } from "next";
import Base64Explained from "./Base64Explained";
import { MAIN_DOMEN, NAME_MAKE } from "@/lib/config";

export const metadata: Metadata = {
  title: "Base64 Explained – What It Is and When to Use It",
  description: "A practical guide to Base64 encoding: how it works, standard vs URL-safe, common use cases, and when NOT to use it. Written for developers.",
  keywords: [
    "base64 explained",
    "what is base64",
    "base64 encoding",
    "url-safe base64",
    "data uri",
    "jwt",
    "api encoding"
  ],
  authors: [{ name: NAME_MAKE }],
  alternates: { canonical: "/blog/base64-explained" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Base64 Explained",
    description: "What Base64 really is, when to use it, and when to avoid it.",
    url: `${MAIN_DOMEN}blog/base64-explained`,
    type: "article",
    images: [{ url: `${MAIN_DOMEN}og-image.png`, width: 1024, height: 1024, alt: "Base64 Explained" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Base64 Explained",
    description: "What Base64 really is and when it belongs in your code.",
  },
};

export default function Base64ExplainedPage() {
  return <Base64Explained />;
}
