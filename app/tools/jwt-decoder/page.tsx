export const dynamic = "force-static";

import type { Metadata } from "next";
import JwtDecoder from "./JwtDecoder";
import { MAIN_DOMEN, NAME_MAKE } from "@/lib/config";

export const metadata: Metadata = {
  title: "JWT Decoder – Inspect JSON Web Tokens",
  description: "Decode JWT tokens instantly. Inspect header, payload, and signature with human-readable timestamps. 100% client-side and private.",
  keywords: [
    "jwt decoder",
    "jwt parser",
    "json web token",
    "decode jwt",
    "inspect jwt",
    "oauth",
    "openid",
    "client-side",
    "private tool",
    "no sign-up"
  ],
  authors: [{ name: NAME_MAKE }],
  alternates: {
    canonical: "/tools/jwt-decoder",
  },
  robots: { index: true, follow: true },
  openGraph: {
    title: "JWT Decoder Online",
    description: "Paste any JSON Web Token and inspect its header, payload, and signature instantly. Private and free.",
    url: `${MAIN_DOMEN}tools/jwt-decoder`,
    type: "website",
    images: [
      {
        url: `${MAIN_DOMEN}og-image.png`,
        width: 1024,
        height: 1024,
        alt: "JWT Decoder Online"
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "JWT Decoder Online",
    description: "Decode header, payload, and signature from any JWT in your browser."
  },
};

export default function JwtDecoderPage() {
  return <JwtDecoder />;
}
