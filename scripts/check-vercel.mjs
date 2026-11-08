import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { readRegistry } from './content-registry.mjs';
const filename = '.next/server/app/api/convert/[slug]/route.js.nft.json';
const entries = JSON.parse(fs.readFileSync(filename, 'utf8')).files;
const files = entries.map(file => path.resolve(path.dirname(filename), file));
const unique = new Map();
for (const file of files) {
  assert.ok(fs.existsSync(file), 'Missing traced file: ' + file);
  assert.ok(!/\/(?:onnxruntime-node|better-sqlite3)\//.test(file), 'Unsupported dependency in deployment: ' + file);
  assert.ok(!/\/(?:native-conversions\.mjs|native-runtime\.mjs|pdf-password\.py|u2netp\.onnx)$/.test(file), 'Removed engine still deployed: ' + file);
  if (fs.statSync(file).isFile()) unique.set(fs.realpathSync(file), fs.statSync(file).size);
}
const bytes = [...unique.values()].reduce((n, value) => n + value, 0);
assert.ok(bytes < 240 * 1024 * 1024, `Function dependencies exceed the deployment budget: ${(bytes / 1048576).toFixed(2)} MiB`);
for (const asset of ['server/conversion-worker.mjs', 'server/conversions.mjs', 'server/extended-conversions.mjs', 'server/protocol-conversions.mjs', 'server/popular-conversions.mjs', 'server/assets/example.heic', 'public/fonts/NotoSans-Regular.ttf', 'node_modules/tesseract.js/src/worker-script/node/index.js', 'node_modules/tesseract.js-core/tesseract-core-simd-lstm.wasm', 'node_modules/@tesseract.js-data/eng/4.0.0/eng.traineddata.gz']) {
  assert.ok(files.includes(path.resolve(asset)), 'Missing runtime asset: ' + asset);
}
const tools = readRegistry('lib/growth-tools.ts');
const pages = JSON.parse(fs.readFileSync('.next/server/app-paths-manifest.json', 'utf8'));
for (const slug of ['word-to-pdf', 'background-remover', 'mp4-to-mp3', 'pdf-unlock']) assert.ok(!pages[`/tools/${slug}/page`], 'Removed page still deployed: ' + slug);
assert.ok(!pages['/api/user/route'], 'SQLite account API still deployed');
assert.equal(tools.filter(t => t.server).length, 69);
console.log(`Vercel artifact checks passed: ${unique.size} traced files, ${(bytes / 1048576).toFixed(2)} MiB dependencies, 69 server tools; no system engines or SQLite API.`);
