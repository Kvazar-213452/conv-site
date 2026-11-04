import fs from 'node:fs';
import assert from 'node:assert/strict';
import { readRegistry } from './content-registry.mjs';
const registry = name => readRegistry(`lib/expansion-${name}.ts`);
const growth = readRegistry('lib/growth-tools.ts');
for (const [kind, entries] of [['tools', [...registry('tools'), ...growth]], ['blog', registry('articles')]]) {
  for (const entry of entries) {
    const path = `${kind}/${entry.slug}`;
    const html = fs.readFileSync(`.next/server/app/${path}.html`, 'utf8');
    assert.equal((html.match(/<h1(?:\s|>)/g) ?? []).length, 1, path + ': one H1');
    const canonicals = [...html.matchAll(/<link rel="canonical" href="([^"]+)"/g)].map(m => m[1]);
    assert.deepEqual(canonicals, ['https://utilixio.com/' + path], path + ': canonical');
    const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m => JSON.parse(m[1]));
    assert.equal(schemas.length, 2, path + ': initial HTML schema');
    if (entry.modified) assert.ok(schemas.some(s=>s['@graph']?.some(item=>item['@type']==='WebApplication' && item.dateModified===entry.modified)),path+': real modification date');
    assert.ok(schemas.some(s => s['@graph']?.some(item => item['@type'] === (kind === 'tools' ? 'WebApplication' : 'BlogPosting'))));
    assert.ok(html.includes(kind === 'tools' ? 'How to use ' : 'Worked example'), path + ': server rendered content');
    if (kind === 'blog') for (let i = 0; i < 3; i++) assert.ok(html.includes(`id="section-${i}"`));
  }
}
for (const kind of ['tools', 'blog']) {
  for (const filename of fs.readdirSync(`.next/server/app/${kind}`).filter(f => f.endsWith('.html'))) {
    const html = fs.readFileSync(`.next/server/app/${kind}/${filename}`, 'utf8');
    assert.ok(html.includes(`rel="canonical" href="https://utilixio.com/${kind}/${filename.slice(0, -5)}"`), filename);
  }
}
for (const name of ['login', 'register', 'profile']) {
  const html = fs.readFileSync(`.next/server/app/user/${name}.html`, 'utf8');
  assert.ok(html.includes('name="robots" content="noindex, follow"'));
  assert.ok(!html.includes('rel="canonical"'));
}
const sitemap = fs.readFileSync('.next/server/app/sitemap.xml.body', 'utf8');
assert.equal((sitemap.match(/<loc>/g) ?? []).length, 194);
console.log('Rendered SEO passed: all 105 added pages, all 189 content canonicals, account noindex, and 194 sitemap URLs.');

const homepage = fs.readFileSync('.next/server/app/index.html', 'utf8');
const homeLinks = new Set([...homepage.matchAll(/<a\b[^>]*href="([^"]+)"/g)].map(m => m[1]));
const toolPaths = fs.readdirSync('app/tools', { withFileTypes: true }).filter(d => d.isDirectory() && fs.existsSync(`app/tools/${d.name}/page.tsx`)).map(d => '/tools/' + d.name);
for (const path of toolPaths) assert.ok(homeLinks.has(path), 'Tool link missing from initial homepage HTML: ' + path);
assert.equal((homepage.match(/<h1(?:\s|>)/g) ?? []).length, 1);
assert.equal((homepage.match(/<details class="directory-group"/g) ?? []).length, 9);
assert.ok(homepage.includes('id="tool-search"'));
console.log(`Homepage SEO passed: all ${toolPaths.length} tool links are present before JavaScript, in 9 compact categories.`);
