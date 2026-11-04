import fs from 'node:fs';
export function readRegistry(path) {
  const source = fs.readFileSync(path, 'utf8');
  const start = source.indexOf(' = ', source.indexOf('export const '));
  return JSON.parse(source.slice(start + 3).split(' as const;')[0].replace(/;\s*$/, ''));
}
