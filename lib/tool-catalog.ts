import { legacyTools } from './legacy-tools';
import { expansionTools } from './expansion-tools';
import { growthTools } from './growth-tools';
import { type ToolCategory } from './tool-categories';
export { toolCategories } from './tool-categories';
export type CatalogTool = { slug: string; title: string; description: string; category: ToolCategory; recent: boolean; href: string };
const groups: Record<Exclude<ToolCategory, 'data'>, string[]> = {
  code: ['json-to-postgresql','json-to-prisma-schema','json-to-typescript-interface','json-to-go-struct','json-to-python-dataclass','json-schema-generator','sql-formatter','csv-to-sql','json-to-rust','json-to-zod','sql-in-clause-generator','json-to-csharp','json-to-kotlin'],
  text: ['word-counter','remove-duplicate-lines','case-converter','lorem-ipsum','text-diff','text-reverser','line-sorter','text-to-slug-list','list-compare','email-extractor','url-extractor','whitespace-remover','nato-phonetic-alphabet','text-line-wrapper'],
  encoding: ['uuid-to-base64','url-encode','url-decode','string-to-base64','html-entity-encoder','binary-to-text','morse-code','rot13','backslash-escape','text-to-hex','base64-to-hex','unicode-escape'],
  security: ['hash-generator','jwt-decoder','password-generator','uuid-generator','ulid-generator','jwt-generator','hmac-generator','sri-generator','basic-auth-generator','bcrypt-generator'],
  web: ['markdown-to-html','curl-to-fetch','unix-permissions','slug-generator','meta-tag-generator','html-to-jsx','url-parser','utm-builder','html-to-text','html-table-to-csv','http-headers-to-json','json-to-query-string','regex-tester','robots-txt-generator','url-cleaner','qr-code-generator','vcard-generator','html-formatter','html-minifier','html-link-extractor','http-status-lookup','mime-type-lookup'],
  css: ['color-converter','css-minifier','css-formatter','aspect-ratio-calculator','px-to-rem','color-contrast-checker','css-gradient-generator','css-box-shadow-generator','css-border-radius-generator','css-clamp-calculator','css-grid-generator','css-text-shadow-generator','css-clip-path-generator','cubic-bezier-generator','css-flexbox-generator'],
  files: ['svg-optimizer','file-to-base64','file-checksum','image-resizer','image-compressor','image-format-converter','image-cropper','image-rotate-flip','favicon-generator','svg-to-png','srt-to-vtt','subtitle-time-shifter','subtitles-to-text','image-color-picker','image-grayscale','image-watermark','image-to-pdf'],
  numbers: ['date-to-unix-timestamp','number-base-converter','cron-parser','cidr-calculator','byte-converter','time-duration-converter','percentage-calculator','icalendar-generator','cron-expression-generator','ipv4-to-decimal','download-time-calculator'],
};
const recent = new Set(["srt-to-vtt", "subtitle-time-shifter", "subtitles-to-text", "csv-row-filter", "csv-column-statistics", "json-array-filter", "json-pointer-extractor", "json-key-renamer", "http-status-lookup", "mime-type-lookup", "css-text-shadow-generator", "css-clip-path-generator", "cubic-bezier-generator", "css-flexbox-generator", "image-color-picker", "image-grayscale", "image-watermark", "image-to-pdf", "text-line-wrapper", "download-time-calculator"]);
function categoryFor(slug: string): ToolCategory {
  for (const [category, slugs] of Object.entries(groups)) if (slugs.includes(slug)) return category as ToolCategory;
  return 'data';
}
export const toolCatalog: CatalogTool[] = [...legacyTools, ...expansionTools, ...growthTools].map(tool => ({
  slug: tool.slug, title: tool.title, description: tool.description, category: categoryFor(tool.slug), recent: recent.has(tool.slug), href: '/tools/' + tool.slug,
}));
export const quickPickSlugs = ['json-formatter','text-diff','image-compressor','csv-to-json','uuid-generator','password-generator'];
