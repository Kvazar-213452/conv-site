import type { MetadataRoute } from "next";
import { MAIN_DOMEN_NO } from "@/lib/config";

type Entry = { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] };

// Tools — one line per real page under app/tools/*. Any path listed here MUST
// have a matching directory, or Google will see a 404 and drop it from the index.
const TOOLS: string[] = [
  "/tools/json-to-yaml",
  "/tools/json-to-csv",
  "/tools/json-to-xml",
  "/tools/json-to-postgresql",
  "/tools/json-to-prisma-schema",
  "/tools/json-to-typescript-interface",
  "/tools/json-formatter",
  "/tools/minify-json",
  "/tools/json-diff",
  "/tools/word-counter",
  "/tools/uuid-to-base64",
  "/tools/url-encode",
  "/tools/url-decode",
  "/tools/string-to-base64",
  "/tools/remove-duplicate-lines",
  "/tools/markdown-to-html",
  "/tools/case-converter",
  "/tools/date-to-unix-timestamp",
  "/tools/hash-generator",
  "/tools/jwt-decoder",
  "/tools/color-converter",
  "/tools/regex-tester",
  "/tools/lorem-ipsum",
  "/tools/password-generator",
  "/tools/text-diff",
  "/tools/number-base-converter",
  "/tools/cron-parser",
  "/tools/curl-to-fetch",
  "/tools/toml-to-json",
  "/tools/cidr-calculator",
  "/tools/sql-formatter",
  "/tools/unix-permissions",
  "/tools/csv-to-markdown",
  "/tools/html-entity-encoder",
  "/tools/svg-optimizer",
  "/tools/slug-generator",
  "/tools/env-parser",
  "/tools/uuid-generator",
  "/tools/ulid-generator",
  "/tools/csv-to-json",
  "/tools/yaml-to-json",
  "/tools/xml-to-json",
  "/tools/html-minifier",
  "/tools/html-formatter",
  "/tools/css-minifier",
  "/tools/css-formatter",
  "/tools/js-minifier",
  "/tools/js-formatter",
  "/tools/xml-formatter",
  "/tools/jwt-generator",
  "/tools/json-schema-generator",
  "/tools/text-reverser",
  "/tools/binary-to-text",
  "/tools/morse-code",
  "/tools/rot13",
  "/tools/line-sorter",
  "/tools/meta-tag-generator",
  "/tools/json-sorter",
  "/tools/backslash-escape",
  "/tools/text-to-hex",
  "/tools/base64-to-hex",
  "/tools/yaml-formatter",
];

const BLOG: string[] = [
  "/blog/json-vs-xml",
  "/blog/json-vs-yaml",
  "/blog/base64-explained",
  "/blog/understanding-jwt",
  "/blog/regex-cheatsheet",
  "/blog/md5-vs-sha256",
  "/blog/uuid-vs-nanoid",
  "/blog/markdown-guide",
  "/blog/url-encoding-explained",
  "/blog/chmod-explained",
  "/blog/sql-formatting-guide",
  "/blog/html-entities-xss",
];

const STATIC: string[] = [
  "/contacts",
  "/privacy-policy",
  "/terms-of-service",
];

const ENTRIES: Entry[] = [
  { path: "/",     priority: 1.0, changeFrequency: "weekly"  },
  { path: "/blog", priority: 0.9, changeFrequency: "weekly"  },
  ...TOOLS.map((path): Entry => ({ path, priority: 0.8, changeFrequency: "monthly" })),
  ...BLOG.map((path): Entry  => ({ path, priority: 0.7, changeFrequency: "monthly" })),
  ...STATIC.map((path): Entry => ({ path, priority: 0.3, changeFrequency: "yearly"  })),
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return ENTRIES.map(({ path, priority, changeFrequency }) => ({
    url: `${MAIN_DOMEN_NO}${path}`,
    lastModified,
    priority,
    changeFrequency,
  }));
}
