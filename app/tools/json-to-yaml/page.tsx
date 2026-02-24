export const dynamic = "force-static";

import type { Metadata } from "next";
import JsonToYaml from "./JsonToYaml";
import { MAIN_DOMEN } from "@/lib/config";

export const metadata: Metadata = {
  title: "JSON to YAML Converter & YAML to JSON Online Tool",
  description: "Instantly convert JSON to YAML or YAML to JSON. Free online, client-side, handles nested objects, arrays, nulls, and booleans.",
  keywords: ["json to yaml", "yaml to json", "yaml converter", "json converter", "online yaml"],
  alternates: { canonical: "/tools/json-to-yaml" },
  openGraph: {
    title: "JSON ⇄ YAML Converter",
    description: "Convert JSON objects to YAML or YAML to JSON instantly, with proper indentation and nested structures.",
    url: `${MAIN_DOMEN}tools/json-to-yaml`,
    type: "website"
  },
  robots: { index: true, follow: true }
};

export default function JsonToYamlPage() {
  return (
    <JsonToYaml />
  );
}