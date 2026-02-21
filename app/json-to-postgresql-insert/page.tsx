export const dynamic = "force-static";

import type { Metadata } from "next";
import JSON_TO_POSTGRES from "./JSON_TO_POSTGRES";
import { MAIN_DOMEN } from "@/lib/config";

export const metadata: Metadata = {
  title: "JSON to PostgreSQL INSERT Converter & SQL to JSON (Free Online)",
  description:
    "Convert JSON arrays to PostgreSQL INSERT statements and back to JSON. Free online tool. Generates multi-row INSERTs with proper quoting and type handling. 100% client-side and private.",
  keywords: [
    "json to postgres",
    "json to postgresql",
    "json to insert statement",
    "postgres insert generator",
    "sql to json",
    "postgresql insert to json",
    "json to sql online",
    "postgres json converter"
  ],
  alternates: {
    canonical: `${MAIN_DOMEN}json-to-postgresql-insert`
  },
  openGraph: {
    title: "JSON ⇄ PostgreSQL INSERT Converter",
    description:
      "Generate multi-row PostgreSQL INSERT statements from JSON or convert INSERT back to JSON instantly.",
    url: `${MAIN_DOMEN}json-to-postgresql-insert`,
    type: "website"
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function JSON_TO_POSTGRESPage() {
  return (
    <JSON_TO_POSTGRES />
  );
}