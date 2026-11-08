import type { MetadataRoute } from "next";
import { growthTools } from "@/lib/growth-tools";
import { expansionTools } from "@/lib/expansion-tools";
import { expansionArticles } from "@/lib/expansion-articles";
import { blogVisual } from "@/lib/blog-catalog";
import { toolCategories } from "@/lib/tool-categories";
import { MAIN_DOMEN_NO } from "@/lib/config";

type Entry = { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] };

// Tools — one line per real page under app/tools/*. Any path listed here MUST
// have a matching directory, or Google will see a 404 and drop it from the index.
const TOOLS: string[] = [
  ...growthTools.map(tool => "/tools/" + tool.slug),
  ...expansionTools.map(tool => "/tools/" + tool.slug),
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
  "/tools/json-validator",
  "/tools/html-to-jsx",
  "/tools/url-parser",
  "/tools/json-to-html-table",
  "/tools/markdown-table-generator",
  "/tools/utm-builder",
  "/tools/hmac-generator",
  "/tools/byte-converter",
  "/tools/aspect-ratio-calculator",
  "/tools/json-to-go-struct",
];

const BLOG: string[] = [
  ...expansionArticles.map(article => "/blog/" + article.slug),
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

const CATEGORIES: string[] = toolCategories.map(c => `/tools/category/${c.id}`);

const ENTRIES: Entry[] = [
  { path: "/",     priority: 1.0, changeFrequency: "weekly"  },
  { path: "/blog", priority: 0.9, changeFrequency: "weekly"  },
  ...CATEGORIES.map((path): Entry => ({ path, priority: 0.9, changeFrequency: "weekly" })),
  ...TOOLS.map((path): Entry => ({ path, priority: 0.8, changeFrequency: "monthly" })),
  ...BLOG.map((path): Entry  => ({ path, priority: 0.7, changeFrequency: "monthly" })),
  ...STATIC.map((path): Entry => ({ path, priority: 0.3, changeFrequency: "yearly"  })),
];

export default function sitemap(): MetadataRoute.Sitemap {
  return ENTRIES.map(({ path, priority, changeFrequency }) => ({
    url: `${MAIN_DOMEN_NO}${path}`,
    ...(path.startsWith("/blog/") ? { images: [MAIN_DOMEN_NO + blogVisual(path.split("/").pop()!).image] } : {}),
    // Use explicit content dates; do not claim an update on every generation.
    ...(growthTools.some(t => path === "/tools/" + t.slug)
      ? { lastModified: growthTools.find(t => path === "/tools/" + t.slug)?.modified ?? "2026-11-03" }
      : path.startsWith("/tools/category/") ? { lastModified: "2026-11-08" }
      : path === "/" ? { lastModified: "2026-11-07" }
      : ["/privacy-policy", "/terms-of-service"].includes(path) ? { lastModified: "2026-11-07" }
      : path === "/blog" ? { lastModified: "2026-11-06" }
      : expansionArticles.some(a => path === "/blog/" + a.slug)
        ? { lastModified: "2026-11-06" }
      : path.startsWith("/blog/") ? { lastModified: "2026-11-06" }
      : expansionTools.some(t => path === "/tools/" + t.slug) ? { lastModified: "2026-11-03" } : {}),
    priority,
    changeFrequency,
  }));
}
