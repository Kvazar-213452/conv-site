export const dynamic = "force-static";

import type { Metadata } from "next";
import PasswordGenerator from "./PasswordGenerator";
import { MAIN_DOMEN, NAME_MAKE } from "@/lib/config";

export const metadata: Metadata = {
  title: "Password Generator – Secure, Private, Free",
  description: "Generate strong, cryptographically secure passwords in your browser. Length 4–256, four character classes, ambiguity filter, entropy readout. 100% client-side.",
  keywords: [
    "password generator",
    "strong password",
    "random password",
    "secure password",
    "crypto random",
    "entropy",
    "online tool",
    "client-side",
    "private tool",
    "no sign-up"
  ],
  authors: [{ name: NAME_MAKE }],
  alternates: { canonical: "/tools/password-generator" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Password Generator Online",
    description: "Cryptographically secure passwords generated locally in your browser with an entropy readout.",
    url: `${MAIN_DOMEN}tools/password-generator`,
    type: "website",
    images: [
      {
        url: `${MAIN_DOMEN}og-image.png`,
        width: 1024,
        height: 1024,
        alt: "Password Generator Online"
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Password Generator Online",
    description: "Strong passwords generated locally with crypto.getRandomValues."
  },
};

export default function PasswordGeneratorPage() {
  return <PasswordGenerator />;
}
