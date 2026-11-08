import { expansionArticles } from './expansion-articles';
export { blogTopics, blogDate, type BlogTopic } from './blog-presentation';
import type { BlogTopic } from './blog-presentation';
const legacy = [
  ['json-vs-yaml','JSON vs YAML: When to Use Each Format','Compare syntax, readability and practical format choices.'],
  ['json-vs-xml','JSON vs XML: A Practical Comparison','Choose a structured data format for your next integration.'],
  ['base64-explained','Base64 Explained','Understand encoding, variants and binary transport.'],
  ['understanding-jwt','Understanding JSON Web Tokens','Read token structure and learn the limits of decoding.'],
  ['regex-cheatsheet','JavaScript Regex Cheatsheet','A practical reference for patterns, groups and lookarounds.'],
  ['md5-vs-sha256','MD5 vs SHA-256: Which Hash?','Compare hash properties and appropriate use cases.'],
  ['uuid-vs-nanoid','UUID vs NanoID vs ULID','Compare identifier formats and their tradeoffs.'],
  ['markdown-guide','The Practical Markdown Guide','Write clear documents with CommonMark and GFM.'],
  ['url-encoding-explained','URL Encoding Explained','Keep URL components and escaping rules straight.'],
  ['chmod-explained','Unix File Permissions Explained','Understand permission bits, modes and common commands.'],
  ['sql-formatting-guide','A Practical SQL Formatting Guide','Make queries easier to read, review and maintain.'],
  ['html-entities-xss','HTML Entities and XSS','Understand context-sensitive escaping in web interfaces.'],
];
export function blogVisual(slug:string):{topic:BlogTopic;image:string;alt:string}{
  let topic:BlogTopic='Data & APIs';
  if(/merge-pdf|compress-pdf|convert-pdf|split-pdf|pdf-|image-to|heic|webp|resize-image/.test(slug)) topic='Files & media';
  else if(/budget|salary|tax|loan|mortgage|invest|savings|compound|interest|inflation|roi|percentage|tip-|gpa|hourly/.test(slug)) topic='Money & finance';
  else if(/seo|keyword|meta-description|sitemap|schema|serp|backlink|rank|index|crawl|canonical|hreflang|structured-data|open-graph|utm-links|robots-txt/.test(slug)) topic='SEO & marketing';
  else if(/calorie|bmi|workout|macro|body-fat|water-intake|sleep|pregnancy/.test(slug)) topic='Health & fitness';
  else if(/recipe|cooking|meal|ingredient|kitchen/.test(slug)) topic='Home & cooking';
  else if(/resume|cover-letter|interview|job|linkedin|career|resignation/.test(slug)) topic='Career & jobs';
  else if(/email|writing|grammar|tone|readability|headline|blog-post|meeting-agenda/.test(slug)) topic='Writing & content';
  else if(/qr-code|barcode|wifi|vcard|uuid|password|gradient/.test(slug)) topic='Generators';
  else if(/fraction|binomial|unix-seconds/.test(slug)) topic='Math & time';
  else if(/har-network|cache-control|robots|url-encoding|html-textcontent|html-to-plain/.test(slug)) topic='Web & performance';
  else if(/jwt|hash|md5|sha256|xss|auth|sri|integrity|checksum|email-received/.test(slug)) topic='Security';
  else if(/css|color|contrast|px-|responsive-type|png-jpeg/.test(slug)) topic='CSS & design';
  else if(/markdown|chmod|regex|sql-|bulk-slug|duplicate-url/.test(slug)) topic='Developer workflow';
  const label=slug.split('-').map(part=>part[0]?.toUpperCase()+part.slice(1)).join(' ');
  return {topic,image:'/images/blog/'+slug+'-photo.webp',alt:`Photorealistic editorial photo for ${label}`};
}
export function articleMinutes(article:{intro:string;sections:readonly {body:string}[];example:string;answer:string}){return Math.max(2,Math.ceil([article.intro,...article.sections.map(s=>s.body),article.example,article.answer].join(' ').split(/\s+/).length/200));}
export const blogPosts = [
  ...[...expansionArticles].reverse().sort((a,b)=>b.date.localeCompare(a.date)).map(a=>({slug:a.slug,title:a.title,description:a.description,date:a.date as string|null,minutes:articleMinutes(a),...blogVisual(a.slug)})),
  ...legacy.map(([slug,title,description])=>({slug,title,description,date:null as string|null,minutes:null as number|null,...blogVisual(slug)})),
];
export type BlogPost = (typeof blogPosts)[number];
