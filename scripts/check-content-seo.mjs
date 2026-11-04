import assert from 'node:assert/strict';
import fs from 'node:fs';
const read = path => fs.readFileSync(path, 'utf8');
import { readRegistry } from './content-registry.mjs';
const registry = name => readRegistry(`lib/expansion-${name}.ts`);
const growth = readRegistry('lib/growth-tools.ts');
assert.equal(growth.length, 65);
const tools = registry('tools'), articles = registry('articles');
assert.equal(tools.length, 10); assert.equal(articles.length, 30);
const sitemap = read('app/sitemap.ts');
const listed = [...sitemap.matchAll(/"(\/(?:tools|blog)\/[^"]+)"/g)].map(m => m[1]);
listed.push(...growth.map(t => '/tools/' + t.slug), ...tools.map(t => '/tools/' + t.slug), ...articles.map(a => '/blog/' + a.slug));
assert.equal(new Set(listed).size, listed.length, 'Duplicate sitemap URLs');
const actual = ['tools', 'blog'].flatMap(kind => fs.readdirSync('app/' + kind, { withFileTypes: true }).filter(d => d.isDirectory() && fs.existsSync(`app/${kind}/${d.name}/page.tsx`)).map(d => `/${kind}/${d.name}`));
assert.deepEqual([...listed].sort(), actual.sort(), 'Sitemap must cover exactly the real content routes');
for (const [kind, rows] of [['tools', tools], ['blog', articles]]) {
  assert.equal(new Set(rows.map(r => r.title)).size, rows.length, 'Titles must be unique');
  for (const row of rows) {
    const page = read(`app/${kind}/${row.slug}/page.tsx`);
    assert.match(page, /pageMetadata/); assert.match(page, /PageSchema/); assert.match(page, /force-static/);
    if (kind === 'tools') for (const slug of row.articles) assert.ok(articles.some(a => a.slug === slug && a.tool === row.slug));
    else {
      assert.ok([...tools, ...growth].some(t => t.slug === row.tool));
      assert.equal(row.sections.length, 3);
      assert.ok(row.sections.reduce((n, s) => n + s.body.split(/\s+/).length, 0) > 150, row.slug + ' needs substantive guidance');
    }
  }
}
for (const tool of growth) {
  assert.ok(tool.steps.length >= 3 && tool.sections.length >= 2);
  assert.ok(tool.sections.reduce((n, section) => n + section.body.split(/\s+/).length, 0) >= 90, tool.slug + ': substantive instructions');
  const page = read(`app/tools/${tool.slug}/page.tsx`);
  for (const helper of ['pageMetadata', 'PageSchema', 'GrowthGuide', 'force-static']) assert.ok(page.includes(helper));
  for (const path of tool.related) assert.ok(fs.existsSync(`app${path}/page.tsx`), `${tool.slug}: broken related link ${path}`);
}
assert.equal(new Set([...tools, ...growth].map(t => t.title)).size, tools.length + growth.length);
assert.ok(!sitemap.includes('new Date()'), 'Do not fabricate lastmod dates');
console.log(`SEO checks passed: ${actual.length} content routes, unique sitemap URLs, ${tools.length + growth.length} added tools and ${articles.length} linked articles.`);
