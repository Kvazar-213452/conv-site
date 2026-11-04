export const dynamic = "force-static";

import type { Metadata } from "next";
import Md5VsSha256 from "./Md5VsSha256";
import { MAIN_DOMEN, NAME_MAKE } from "@/lib/config";

export const metadata: Metadata = {
  title: "MD5 vs SHA-256 – Which Hash Should You Use?",
  description: "Comparison of MD5, SHA-1, SHA-256, and SHA-512. Collision resistance, performance, legitimate uses, and when each one is actually safe.",
  keywords: [
    "md5 vs sha256",
    "hash comparison",
    "sha1 vs sha256",
    "cryptographic hash",
    "checksum",
    "hash collision",
    "security"
  ],
  authors: [{ name: NAME_MAKE }],
  alternates: { canonical: "/blog/md5-vs-sha256" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "MD5 vs SHA-256",
    description: "Which hash algorithm belongs in your pipeline?",
    url: `${MAIN_DOMEN}blog/md5-vs-sha256`,
    type: "article",
    images: [{ url: `${MAIN_DOMEN}og-image.png`, width: 1024, height: 1024, alt: "MD5 vs SHA-256" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "MD5 vs SHA-256",
    description: "Collision resistance, performance, legitimate uses.",
  },
};

export default function Md5VsSha256Page() {
  return <Md5VsSha256 />;
}
