import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import {readRegistry} from './content-registry.mjs';
const articles=readRegistry('lib/expansion-articles.ts'),tools=readRegistry('lib/growth-tools.ts');
const names=fs.readdirSync('app/blog',{withFileTypes:true}).filter(d=>d.isDirectory()&&fs.existsSync(`app/blog/${d.name}/page.tsx`)).map(d=>d.name);
let checks=0;
assert.equal(names.length,52);checks++;
const index=fs.readFileSync('.next/server/app/blog.html','utf8');
for(const slug of names){
 const file=fs.readFileSync(`.next/server/app/blog/${slug}.html`,'utf8');
 assert.ok(index.includes('href="/blog/'+slug+'"'),slug+': index link before JavaScript');
 assert.equal((file.match(/<h1(?:\s|>)/g)??[]).length,1,slug+': one H1');
 assert.ok(file.includes('class="journal-cover"'),slug+': article photography');
 assert.ok(file.includes('property="og:image" content="https://utilixio.com/images/blog/'),slug+': photographic share image');
 assert.ok(file.includes('rel="canonical" href="https://utilixio.com/blog/'+slug+'"'),slug+': canonical');
 checks++;
}
for(const article of articles){
 const file=fs.readFileSync(`.next/server/app/blog/${article.slug}.html`,'utf8');
 const schemas=[...file.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap(m=>JSON.parse(m[1])['@graph']??[]);
 const post=schemas.find(s=>s['@type']==='BlogPosting');
 assert.equal(post.datePublished,article.date);assert.equal(post.dateModified,'2026-11-06');
 assert.ok(post.image.startsWith('https://utilixio.com/images/blog/'));assert.ok(file.toLowerCase().includes('datetime="'+article.date+'"'));checks++;
}
for(const article of articles.slice(-10)){
 assert.ok(article.sections.reduce((n,s)=>n+s.body.split(/\s+/).length,0)>200);
 assert.ok(article.intro.split(/\s+/).length>45);
 assert.ok(tools.some(t=>t.slug===article.tool));
 assert.ok(tools.find(t=>t.slug===article.tool).related.includes('/blog/'+article.slug));checks++;
}
for(const file of fs.readdirSync('public/images/blog').filter(f=>f.endsWith('.webp'))){const m=await sharp(path.join('public/images/blog',file)).metadata();assert.equal(m.width,1440);assert.equal(m.height,900);checks++;}
const sitemap=fs.readFileSync('.next/server/app/sitemap.xml.body','utf8');assert.equal((sitemap.match(/<loc>/g)??[]).length,385);assert.equal((sitemap.match(/<image:image>/g)??[]).length,52);checks++;
assert.ok(index.includes('id="blog-search"'));checks++;
console.log(`${checks} journal SEO/content checks passed: all 52 photographic articles, original publication dates, metadata, 10 substantive new guides, linked tools and local WebP covers.`);
