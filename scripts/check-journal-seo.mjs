import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import {readRegistry} from './content-registry.mjs';
const articles=readRegistry('lib/expansion-articles.ts'),tools=readRegistry('lib/growth-tools.ts');
const names=fs.readdirSync('app/blog',{withFileTypes:true}).filter(d=>d.isDirectory()&&fs.existsSync(`app/blog/${d.name}/page.tsx`)).map(d=>d.name);
let checks=0;
assert.ok(names.length>=articles.length);for(const article of articles)assert.ok(names.includes(article.slug),article.slug+': article route exists');checks++;
const index=fs.readFileSync('.next/server/app/blog.html','utf8');
for(const slug of names){
 const file=fs.readFileSync(`.next/server/app/blog/${slug}.html`,'utf8');
 assert.ok(index.includes('href="/blog/'+slug+'"'),slug+': index link before JavaScript');
 assert.equal((file.match(/<h1(?:\s|>)/g)??[]).length,1,slug+': one H1');
 assert.ok(file.includes('class="journal-cover"'),slug+': article photography');
 const expectedOg=articles.some(article=>article.slug===slug)?'https://utilixio.com/blog/'+slug+'/opengraph-image':'https://utilixio.com/images/blog/';
 assert.ok(file.includes('property="og:image" content="'+expectedOg),slug+': share image');
 assert.ok(file.includes('rel="canonical" href="https://utilixio.com/blog/'+slug+'"'),slug+': canonical');
 checks++;
}
for(const article of articles){
 const file=fs.readFileSync(`.next/server/app/blog/${article.slug}.html`,'utf8');
 const schemas=[...file.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap(m=>JSON.parse(m[1])['@graph']??[]);
 const post=schemas.find(s=>s['@type']==='BlogPosting');
 assert.equal(post.datePublished,article.date);assert.equal(post.dateModified,article.date);
 assert.ok(post.image.startsWith('https://utilixio.com/images/blog/'));assert.ok(file.toLowerCase().includes('datetime="'+article.date+'"'));checks++;
}
for(const article of articles.slice(-50)){
 assert.ok(article.sections.reduce((n,s)=>n+s.body.split(/\s+/).length,0)>200,article.slug+': substantive guide sections');
 assert.ok(article.intro.split(/\s+/).length>45,article.slug+': substantive introduction');
 assert.ok(fs.existsSync(`app/tools/${article.tool}/page.tsx`));
 assert.ok(fs.readFileSync(`app/blog/${article.slug}/page.tsx`,'utf8').includes(`"${article.slug}"`));checks++;
}
for(const file of fs.readdirSync('public/images/blog').filter(f=>f.endsWith('.webp'))){const m=await sharp(path.join('public/images/blog',file)).metadata();assert.equal(m.width,1440);assert.equal(m.height,900);checks++;}
const sitemap=fs.readFileSync('.next/server/app/sitemap.xml.body','utf8');
const sitemapUrls=[...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]);
assert.equal(new Set(sitemapUrls).size,sitemapUrls.length,'Sitemap URLs must be unique');
for(const article of articles)assert.ok(sitemapUrls.includes('https://utilixio.com/blog/'+article.slug));
assert.equal(sitemapUrls.filter(url=>url.includes('/compare/')).length,20);
assert.ok((sitemap.match(/<image:image>/g)??[]).length>=articles.length);
checks++;
assert.ok(index.includes('id="blog-search"'));checks++;
console.log(`${checks} journal SEO/content checks passed: ${articles.length} article routes, individual cover assets, original publication dates, metadata, 50 new guides and linked tools.`);
