import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
const source = fs.readFileSync(new URL('../lib/expansion-transforms.ts', import.meta.url), 'utf8');
const code = ts.transpile(source, { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 });
const { transformTool: run } = await import('data:text/javascript;base64,' + Buffer.from(code).toString('base64'));
let checks = 0;
async function same(slug, input, expected, reverse = false, base = 16, bytes) {
  assert.equal(await run(slug, input, reverse, base, bytes), expected); checks++;
}
async function fails(slug, input, reverse = false, base = 16) {
  await assert.rejects(() => run(slug, input, reverse, base)); checks++;
}
for (const value of [null, 42, [], {}, { 'a/b': { '~key': [null, {}, [], false] }, 'user.name': 'x', user: { name: 'y' }, '0': 'zero' }, JSON.parse('{"__proto__":null,"constructor":"safe"}'), Array.from({length: 12}, (_, i) => ({i}))]) {
  const flat = await run('json-flattener', JSON.stringify(value));
  assert.deepEqual(JSON.parse(await run('json-flattener', flat, true)), value); checks++;
}
await fails('json-flattener', '{"/x":1}', true);
await fails('json-flattener', '{"":{},"/bad~2":1}', true);
await same('json-to-ndjson', '[{"id":1},null,[2]]', '{"id":1}\nnull\n[2]\n');
await same('json-to-ndjson', '{"id":1}\n\nnull\n[2]\n', JSON.stringify([{id:1},null,[2]],null,2), true);
await fails('json-to-ndjson', '{}');
await fails('json-to-ndjson', '{}\n{broken}', true);
await same('tsv-to-json', 'name\tcode\r\n"Ada\tA"\t00123\r\n', JSON.stringify([{name:'Ada\tA',code:'00123'}],null,2));
await same('tsv-to-json', 'a\tb\n"line\none"\t"a""b"', JSON.stringify([{a:'line\none',b:'a"b'}],null,2));
await fails('tsv-to-json', 'a\ta\n1\t2');
await fails('tsv-to-json', 'a\tb\n1');
await fails('tsv-to-json', 'a\n"unfinished');
await same('tsv-to-json', '[{"a":"x\\ty","b":"a\\nb"}]', 'a\tb\n"x\ty"\t"a\nb"', true);
await same('px-to-rem', '24', '1.5rem');
await same('px-to-rem', '1.5', '30px', true, 20);
await fails('px-to-rem', '12px');
await fails('px-to-rem', '1', false, 0);
assert.match(await run('color-contrast-checker', '#000\n#fff'), /21\.00:1/); checks++;
assert.match(await run('color-contrast-checker', '#fff\n#fff'), /AA normal text \(4.5:1\): Fail/); checks++;
await fails('color-contrast-checker', '#ffffff00 #000');
await same('unicode-escape', 'A👋', '\\u0041\\ud83d\\udc4b');
await same('unicode-escape', '\\u0041\\u{1f44b}', 'A👋', true);
await same('unicode-escape', '\\ud83d\\udc4b', '👋', true);
await fails('unicode-escape', '\\u{110000}', true);
await fails('unicode-escape', '\\uXYZ', true);
await same('basic-auth-generator', 'demo\npassword', 'Basic ZGVtbzpwYXNzd29yZA==');
const utf = await run('basic-auth-generator', 'ада\nпароль:123');
await same('basic-auth-generator', utf, 'Username: ада\nPassword: пароль:123', true);
await fails('basic-auth-generator', 'user:name\nsecret');
await fails('basic-auth-generator', 'user\nsecret\n');
await same('text-to-slug-list', 'Café Mug\nBlue Shoe', 'cafe-mug\nblue-shoe');
await fails('text-to-slug-list', 'Café\nCafe');
await fails('text-to-slug-list', '!!!');
const sri = await run('sri-generator', '');
assert.match(sri, /^sha256-47DEQpj8HBSa\+\/TImW\+5JCeuQeRkm5NMpJWZG3hSuFU=/); checks++;
const bytes = new TextEncoder().encode('abc').buffer;
assert.equal(await run('sri-generator', 'ignored', false, 16, bytes), await run('sri-generator', 'abc')); checks++;
console.log(`${checks} transformation checks passed. HTML extraction requires a browser DOM.`);
