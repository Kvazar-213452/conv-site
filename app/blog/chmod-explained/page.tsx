export const dynamic = "force-static";

import type { Metadata } from "next";
import ChmodExplained from "./ChmodExplained";
import { MAIN_DOMEN, NAME_MAKE } from "@/lib/config";

export const metadata: Metadata = {
  title: "chmod Explained – Unix File Permissions in Depth",
  description: "Everything you need to know about chmod, chown, Unix file permissions, octal notation, setuid, setgid, and the sticky bit. Written for developers and sysadmins.",
  keywords: [
    "chmod explained",
    "unix permissions",
    "linux file permissions",
    "chmod 755",
    "chmod 644",
    "setuid",
    "setgid",
    "sticky bit",
    "umask",
    "chown"
  ],
  authors: [{ name: NAME_MAKE }],
  alternates: { canonical: "/blog/chmod-explained" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "chmod Explained",
    description: "Unix file permissions, octal math, and special bits — the full picture.",
    url: `${MAIN_DOMEN}blog/chmod-explained`,
    type: "article",
    images: [{ url: `${MAIN_DOMEN}icon.png`, width: 1200, height: 630, alt: "chmod Explained" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "chmod Explained",
    description: "Octal math, special bits, umask, and chown.",
  },
};

export default function ChmodExplainedPage() {
  return <ChmodExplained />;
}
