export const dynamic = "force-static";

import type { Metadata } from "next";
import CaseConverter from "./CaseConverter";

export const metadata: Metadata = {
  title: "Case Converter Online",
  description:
    "Convert text between UPPER, lower, camelCase, snake_case and more. Free online case converter.",
};

export default function CaseConverterPage() {
  return (
    <CaseConverter />
  );
}