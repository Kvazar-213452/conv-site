export const dynamic = "force-static";

import type { Metadata } from "next";
import JSON_TO_PRISMA from "./JSON_TO_PRISMA";

export const metadata: Metadata = {
  title: "JSON to Prisma Schema Converter & Prisma to JSON (Free Online)",
  description:
    "Convert JSON to Prisma schemas and back to JSON instantly. Free online tool. Infers types, relations, and decorators. 100% client-side and private.",
  keywords: [
    "json to prisma",
    "prisma schema generator",
    "json to prisma schema",
    "prisma to json",
    "prisma schema converter",
    "json to schema online",
  ],
  alternates: {
    canonical: "https://yoursite.com/json-to-prisma"
  },
  openGraph: {
    title: "JSON ⇄ Prisma Schema Converter",
    description:
      "Generate Prisma schema from JSON objects or convert Prisma models back to JSON instantly.",
    url: "https://yoursite.com/json-to-prisma",
    type: "website"
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function JSON_TO_PRISMAPage() {
  return (
    <JSON_TO_PRISMA />
  );
}