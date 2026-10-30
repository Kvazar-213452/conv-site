export const dynamic = "force-static";

import type { Metadata } from "next";
import HashGenerator from "./HashGenerator";
import { MAIN_DOMEN, NAME_MAKE } from "@/lib/config";

export const metadata: Metadata = {
  title: "Hash Generator – MD5, SHA-1, SHA-256, SHA-512",
  description: "Generate MD5, SHA-1, SHA-256, SHA-384, and SHA-512 hashes from any text instantly. 100% client-side, private, and free.",
  keywords: [
    "hash generator",
    "md5",
    "sha1",
    "sha256",
    "sha384",
    "sha512",
    "checksum",
    "crypto hash",
    "online tool",
    "client-side",
    "private tool",
    "no sign-up"
  ],
  authors: [{ name: NAME_MAKE }],
  alternates: {
    canonical: "/tools/hash-generator",
  },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Hash Generator Online",
    description: "Instantly compute MD5, SHA-1, SHA-256, SHA-384, and SHA-512 hashes in your browser. Private and free.",
    url: `${MAIN_DOMEN}tools/hash-generator`,
    type: "website",
    images: [
      {
        url: `${MAIN_DOMEN}icon.png`,
        width: 1200,
        height: 630,
        alt: "Hash Generator Online"
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hash Generator Online",
    description: "MD5, SHA-1, SHA-256, SHA-384, SHA-512 — all computed locally in your browser."
  },
};

export default function HashGeneratorPage() {
  return <HashGenerator />;
}
