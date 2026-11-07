// Exercise only files from Next.js output tracing, with no fallback to checkout assets.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { readRegistry } from './content-registry.mjs';
import { example } from '../server/conversions.mjs';
const filename = '.next/server/app/api/convert/[slug]/route.js.nft.json';
const root = process.cwd(), directory = fs.mkdtempSync(path.join(os.tmpdir(), 'vercel-runtime-'));
const child = `import {Worker} from 'node:worker_threads';let input='';for await(const part of process.stdin)input+=part;const job=JSON.parse(input);job.files=job.files.map(f=>({...f,bytes:Buffer.from(f.bytes,'base64')}));const worker=new Worker(new URL('./server/conversion-worker.mjs',import.meta.url),{workerData:job,execArgv:[]});const timer=setTimeout(()=>{worker.terminate();console.error('Worker exceeded 25 seconds');process.exitCode=1},25000);worker.on('message',async m=>{clearTimeout(timer);await worker.terminate();if(!m.ok||!m.result.bytes.length){console.error(m.error||'Empty result');process.exitCode=1}else console.log(job.slug+': '+m.result.bytes.length+' bytes')});worker.on('error',e=>{clearTimeout(timer);console.error(e);process.exitCode=1});`;
const registry = readRegistry('lib/growth-tools.ts');
function directoryPermissions(dir, mode) {
  fs.chmodSync(dir, mode);
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const target = path.join(dir, entry.name);
    if (entry.isDirectory()) directoryPermissions(target, mode);
    else if (mode === 0o555) fs.chmodSync(target, 0o444);
  }
}
try {
  const files = JSON.parse(fs.readFileSync(filename, 'utf8')).files.map(file => path.resolve(path.dirname(filename), file));
  files.push(path.join(root, 'package.json'));
  for (const file of new Set(files)) {
    const relative = path.relative(root, file);
    assert.ok(!relative.startsWith('..'), 'Trace escapes project: ' + file);
    if (!fs.statSync(file).isFile()) continue;
    const target = path.join(directory, relative);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.copyFileSync(file, target);
  }
  fs.writeFileSync(path.join(directory, 'runtime-check.mjs'), child);
  directoryPermissions(directory, 0o555);
  for (const slug of ['json-to-xlsx', 'pdf-to-image', 'heic-to-jpg', 'image-to-text', 'text-to-pdf']) {
    const tool = registry.find(t => t.slug === slug);
    const fixture = tool.server.input === 'files' ? await example(slug) : null;
    const job = { action: 'convert', slug, text: tool.example, values: Object.fromEntries(tool.fields.map(f => [f.key, f.default])), files: fixture ? [{ name: fixture.name, bytes: Buffer.from(fixture.bytes).toString('base64') }] : [] };
    const output = await new Promise((resolve, reject) => {
      const proc = spawn(process.execPath, ['runtime-check.mjs'], { cwd: directory, env: { ...process.env, NODE_PATH: '' }, stdio: ['pipe', 'pipe', 'pipe'] });
      let stdout = '', stderr = '';
      proc.stdout.on('data', chunk => { stdout += chunk; });
      proc.stderr.on('data', chunk => { stderr += chunk; });
      proc.on('error', reject);
      proc.on('close', code => code === 0 ? resolve(stdout.trim()) : reject(new Error(slug + ': ' + stderr)));
      proc.stdin.end(JSON.stringify(job));
    });
    console.log(output);
  }
  console.log('Read-only isolated traced-runtime checks passed for Excel, PDF rendering, HEIC, OCR and font assets.');
} finally { directoryPermissions(directory, 0o700); fs.rmSync(directory, { recursive: true, force: true }); }
