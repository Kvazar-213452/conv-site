import { MAIN_DOMEN_NO } from "@/lib/config";

const CONVERTERS = [
  "/json-to-yaml",
  "/json-to-csv",
  "/json-to-xml",
  "/json-to-prisma",
  "/json-to-postgresql-insert",
  "/word-counter",
  "/uuid-to-base64",
  "/url-encode-or-decode",
  "/string-to-base64",
  "/remove-duplicate-lines",
  "/markdown-to-html",
  "/case-converter",
  "/date-to-unix-timestamp",
  "/json-to-prisma-schema",
  "/json-to-typescript-interface",
  "/contacts",
  "/privacy-policy",
  "/terms-of-service",
];

export default function sitemap() {
  const urls = [{ url: MAIN_DOMEN_NO, priority: 1 }];
  
  CONVERTERS.forEach((path) => {
    urls.push({ url: `${MAIN_DOMEN_NO}${path}`, priority: 0.8 });
  });

  return urls;
}