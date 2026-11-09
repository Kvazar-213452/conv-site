import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

function loadRegistryModule(path, exportName) {
  const js = ts.transpileModule(fs.readFileSync(path, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const module = { exports: {} };
  vm.runInNewContext(js, { module, exports: module.exports, require() { throw new Error('Unexpected runtime import in a data registry.'); } });
  return module.exports[exportName];
}

export function readRegistry(path) {
  const source = fs.readFileSync(path, 'utf8');
  if (path === 'lib/expansion-articles.ts') {
    const start = source.indexOf(' = ', source.indexOf('export const expansionArticles'));
    const spread = source.indexOf('...growthArticlesForBlog');
    const growth2Spread = source.indexOf('...growthArticles2');
    if (start < 0 || spread < 0) throw new Error('Expansion article registry is missing its generated entries.');
    const base = JSON.parse(source.slice(start + 3, spread).trimEnd().replace(/,\s*$/, '') + '\n]');
    return [
      ...base,
      ...loadRegistryModule('lib/expansion-articles-growth.ts', 'growthArticlesForBlog'),
      ...(growth2Spread >= 0 ? loadRegistryModule('lib/expansion-articles-growth-2.ts', 'growthArticles2') : []),
    ];
  }
  if (path.endsWith('/growth-tools.ts') || path === 'lib/growth-tools.ts') {
    const start = source.indexOf(' = ', source.indexOf('export const growthTools'));
    const body = source.slice(start + 3);
    const spread = body.indexOf('...dailyTools');
    if (spread < 0) throw new Error('Growth registry additions are missing.');
    const base = JSON.parse(body.slice(0, spread).trimEnd().replace(/,$/, '') + '\n]');
    return [
      ...base,
      ...loadRegistryModule('lib/daily-tools.ts', 'dailyTools'),
      ...loadRegistryModule('lib/popular-tools.ts', 'popularTools'),
      ...loadRegistryModule('lib/conversion-tools.ts', 'conversionTools'),
      ...loadRegistryModule('lib/workflow-tools.ts', 'workflowTools'),
      ...loadRegistryModule('lib/api-tools.ts', 'apiTools'),
      ...loadRegistryModule('lib/deepseek-tools.ts', 'aiTools'),
      ...loadRegistryModule('lib/requested-tools.ts', 'requestedTools'),
    ];
  }
  const start = source.indexOf(' = ', source.indexOf('export const '));
  return JSON.parse(source.slice(start + 3).split(' as const;')[0].replace(/;\s*$/, ''));
}
