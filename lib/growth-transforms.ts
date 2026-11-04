export type ToolValues = Record<string, string>;
export type GrowthResult = { text: string; grid?: { template: string; gap: number; items: number }; curve?: { x1: number; y1: number; x2: number; y2: number; timing: string }; flex?: { direction: string; wrap: string; justify: string; align: string; gap: number; items: number }; preview?: { background?: string; boxShadow?: string; borderRadius?: string; textShadow?: string; clipPath?: string } };
const json = (value: unknown) => JSON.stringify(value, null, 2);
function number(values: ToolValues, key: string, min = -Number.MAX_VALUE, max = Number.MAX_VALUE) {
  const raw = values[key]; const n = Number(raw);
  if (raw === undefined || !raw.trim() || !Number.isFinite(n) || n < min || n > max) throw new Error(`${key}: enter a finite number from ${min} to ${max}.`);
  return n;
}
function color(values: ToolValues, key: string) {
  const c = values[key]; if (!/^#[\da-f]{6}$/i.test(c ?? '')) throw new Error(`${key}: choose a 6-digit HEX color.`); return c;
}
function choice(values: ToolValues, key: string, options: string[]) {
  if (!options.includes(values[key])) throw new Error(`Invalid ${key} selection.`); return values[key];
}
const plainObject = (v: unknown): v is Record<string, unknown> => v !== null && typeof v === 'object' && !Array.isArray(v);

export function parseDelimited(text: string, delimiter = ','): string[][] {
  if (![',', ';', '\t'].includes(delimiter)) throw new Error('Choose comma, semicolon or tab as the delimiter.');
  text = text.replace(/^\uFEFF/, '');
  const rows: string[][] = []; let row: string[] = [], cell = '', quoted = false, closed = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (c === '"') { quoted = false; closed = true; }
      else cell += c;
    } else if (c === '"' && !cell && !closed) quoted = true;
    else if (c === delimiter) { row.push(cell); cell = ''; closed = false; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(cell); rows.push(row); row = []; cell = ''; closed = false;
    } else {
      if (closed || c === '"') throw new Error(`Unexpected character after a quoted field near position ${i + 1}.`);
      cell += c;
    }
  }
  if (quoted) throw new Error('A quoted field is not closed.');
  if (cell || row.length || closed) { row.push(cell); rows.push(row); }
  return rows;
}
export function csvToSql(text: string, values: ToolValues): string {
  const [headers, ...rows] = parseDelimited(text, values.delimiter ?? ',');
  if (!headers?.length || headers.some(h => !h.trim()) || new Set(headers).size !== headers.length) throw new Error('The header row must contain unique, non-empty column names.');
  if (!rows.length) throw new Error('Provide at least one data row after the header.');
  const dialect = choice(values, 'dialect', ['postgres', 'sqlite', 'mysql']);
  const table = values.table?.trim(); if (!table || /[\u0000-\u001f\u007f]/.test(table + headers.join(''))) throw new Error('Use a non-empty table name and identifiers without control characters.');
  const quote = dialect === 'mysql' ? '`' : '"';
  const identifier = (s: string) => quote + s.split(quote).join(quote + quote) + quote;
  const literal = (s: string) => {
    if (s.includes('\0')) throw new Error('NUL characters cannot be emitted as SQL text values.');
    if (dialect === 'mysql') {
      const hex = [...new TextEncoder().encode(s)].map(b => b.toString(16).padStart(2, '0')).join('');
      return `CONVERT(X'${hex}' USING utf8mb4)`;
    }
    const escaped = s.replace(/'/g, "''");
    return dialect === 'postgres' ? "E'" + escaped.replace(/\\/g, '\\\\') + "'" : "'" + escaped + "'";
  };
  return rows.map((r, i) => {
    if (r.length !== headers.length) throw new Error(`Row ${i + 2} has ${r.length} cells; expected ${headers.length}.`);
    return `INSERT INTO ${identifier(table)} (${headers.map(identifier).join(', ')}) VALUES (${r.map(literal).join(', ')});`;
  }).join('\n');
}

const pythonKeywords = new Set('False None True and as assert async await break class continue def del elif else except finally for from global if import in is lambda nonlocal not or pass raise return try while with yield'.split(' '));
export function pythonDataclasses(text: string): string {
  const parsed: unknown = JSON.parse(text);
  const roots = Array.isArray(parsed) ? parsed : [parsed];
  if (!roots.length || !roots.every(plainObject)) throw new Error('Provide one JSON object or a non-empty array of JSON objects.');
  const classes: string[] = [];
  const classNames = new Set(['Any', 'str', 'int', 'float', 'bool', 'list', 'dict', 'dataclass', ...pythonKeywords]);
  function unique(base: string, used: Set<string>) { let name = base, n = 2; while (used.has(name)) name = base + n++; used.add(name); return name; }
  function className(hint: string) {
    let n = hint.replace(/([a-z0-9])([A-Z])/g, '$1_$2').split(/[^a-zA-Z0-9]+/).filter(Boolean).map(s => s[0].toUpperCase() + s.slice(1)).join('') || 'Model';
    if (/^\d/.test(n)) n = 'Model' + n;
    return unique(n, classNames);
  }
  function model(objects: Record<string, unknown>[], hint: string, depth: number): string {
    if (depth > 32) throw new Error('JSON is nested too deeply; use fewer than 32 model levels.');
    const name = className(hint), used = new Set<string>();
    const keys = [...new Set(objects.flatMap(o => Object.keys(o)))];
    const lines = keys.map((key, i) => {
      let base = key.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toLowerCase().replace(/[^a-z0-9_]+/g, '_').replace(/^_+|_+$/g, '') || `field_${i + 1}`;
      if (/^\d/.test(base)) base = 'field_' + base;
      if (pythonKeywords.has(base)) base += '_';
      const identifier = unique(base, used);
      const samples = objects.map(o => Object.hasOwn(o, key) ? o[key] : null);
      const type = infer(samples, name + '_' + key, depth + 1);
      const optional = samples.some(v => v === null);
      return (identifier !== key ? `    # JSON key: ${JSON.stringify(key)}\n` : '') + `    ${identifier}: ${type}${optional ? ' = None' : ''}`;
    });
    classes.push(`@dataclass(kw_only=True)\nclass ${name}:\n${lines.length ? lines.join('\n') : '    pass'}`);
    return name;
  }
  function infer(samples: unknown[], hint: string, depth: number): string {
    if (depth > 40) throw new Error('JSON is nested too deeply.');
    const types = new Set<string>();
    const objects = samples.filter(plainObject);
    if (objects.length) types.add(model(objects, hint, depth));
    const arrays = samples.filter((v): v is unknown[] => Array.isArray(v));
    if (arrays.length) { const items = arrays.flat(); types.add(`list[${items.length ? infer(items, hint + '_item', depth + 1) : 'Any'}]`); }
    for (const v of samples) {
      if (v === null) types.add('None');
      else if (typeof v === 'string') types.add('str');
      else if (typeof v === 'boolean') types.add('bool');
      else if (typeof v === 'number') { if (!Number.isFinite(v)) throw new Error('Numbers must be finite.'); types.add(Number.isInteger(v) ? 'int' : 'float'); }
    }
    if (types.has('float')) types.delete('int');
    const result = [...types];
    if (result.includes('None')) { result.splice(result.indexOf('None'), 1); result.push('None'); }
    return result.length ? result.join(' | ') : 'Any';
  }
  model(roots, 'Root', 0);
  return 'from __future__ import annotations\nfrom dataclasses import dataclass\nfrom typing import Any\n\n\n' + classes.join('\n\n\n') + '\n';
}

export function jsonQuery(text: string, decode: boolean): string {
  if (decode) {
    const raw = text.trim().replace(/^\?/, '');
    if (/^https?:\/\//i.test(raw)) throw new Error('Paste only the query string, not a complete URL.');
    for (const part of raw.split('&')) for (const segment of part.split('=')) {
      try { decodeURIComponent(segment.replace(/\+/g, ' ')); } catch { throw new Error('Malformed percent encoding or invalid UTF-8 in the query string.'); }
    }
    const result: Record<string, string[]> = Object.create(null);
    for (const [key, value] of new URLSearchParams(raw)) (result[key] ??= []).push(value);
    return json(Object.fromEntries(Object.entries(result).map(([k, v]) => [k, v.length === 1 ? v[0] : v])));
  }
  const parsed: unknown = JSON.parse(text); if (!plainObject(parsed)) throw new Error('Provide a JSON object of parameters.');
  const params = new URLSearchParams();
  for (const [key, v] of Object.entries(parsed)) for (const item of Array.isArray(v) ? v : [v]) {
    if (item !== null && typeof item === 'object') throw new Error('Nested objects and nested arrays do not have a universal query-string representation.');
    if (typeof item === 'number' && !Number.isFinite(item)) throw new Error('Parameter numbers must be finite.');
    params.append(key, item === null ? '' : String(item));
  }
  return params.toString();
}
export function compareLists(a: string, b: string, values: ToolValues): string {
  function index(text: string) {
    const map = new Map<string, { value: string; count: number }>(); let total = 0;
    for (const raw of text.split(/\r\n|\r|\n/)) {
      const value = values.trim === 'true' ? raw.trim() : raw; if (!value.trim()) continue;
      const key = values.ignoreCase === 'true' ? value.toLowerCase() : value; total++;
      const item = map.get(key); if (item) item.count++; else map.set(key, { value, count: 1 });
    }
    return { map, total };
  }
  const A = index(a), B = index(b);
  const onlyA = [...A.map].filter(([k]) => !B.map.has(k)).map(([, v]) => v.value);
  const onlyB = [...B.map].filter(([k]) => !A.map.has(k)).map(([, v]) => v.value);
  const shared = [...A.map].filter(([k]) => B.map.has(k)).map(([, v]) => v.value);
  const duplicates = (m: typeof A.map) => [...m.values()].filter(v => v.count > 1);
  return json({ counts: { inputA: A.total, inputB: B.total, distinctA: A.map.size, distinctB: B.map.size }, onlyInA: onlyA, onlyInB: onlyB, inBoth: shared, union: [...A.map.values()].map(v => v.value).concat(onlyB), duplicatesInA: duplicates(A.map), duplicatesInB: duplicates(B.map) });
}
export function extractUrls(text: string, unique: boolean): string[] {
  const found: string[] = [];
  for (let candidate of text.match(/https?:\/\/[^\s<>"'`]+/gi) ?? []) {
    candidate = candidate.replace(/[.,;:!?]+$/, '');
    for (const [open, close] of [['(', ')'], ['[', ']'], ['{', '}']]) {
      while (candidate.endsWith(close) && candidate.split(close).length > candidate.split(open).length) candidate = candidate.slice(0, -1).replace(/[.,;:!?]+$/, '');
    }
    try { const u = new URL(candidate); if (u.hostname && ['http:', 'https:'].includes(u.protocol)) found.push(candidate); } catch { /* Ignore malformed candidates. */ }
  }
  return unique ? [...new Set(found)] : found;
}
export function extractEmails(text: string, unique: boolean): string[] {
  const matches = text.match(/[a-z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-z0-9-]+(?:\.[a-z0-9-]+)+/gi) ?? [];
  const found = matches.filter(s => {
    const [local, domain] = s.split('@');
    return local.length <= 64 && !local.startsWith('.') && !local.endsWith('.') && !local.includes('..') && domain.length <= 253 && domain.split('.').every(l => l.length <= 63 && !l.startsWith('-') && !l.endsWith('-'));
  });
  return unique ? [...new Set(found)] : found;
}
export function parseHeaders(text: string): string {
  const lines = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
  let startLine: string | null = null; const headers: Record<string, string[]> = Object.create(null);
  if (/^(?:HTTP\/1\.[01] \d{3}(?: .*)?|[!#$%&'*+.^_`|~\da-z-]+ \S+ HTTP\/1\.[01])$/i.test(lines[0])) startLine = lines.shift()!;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]; if (line === '') break;
    const colon = line.indexOf(':');
    if (colon < 1 || !/^[!#$%&'*+.^_`|~\da-z-]+$/i.test(line.slice(0, colon))) throw new Error(`Invalid header name or folded line at line ${i + (startLine ? 2 : 1)}.`);
    const value = line.slice(colon + 1).replace(/^[ \t]+|[ \t]+$/g, '');
    if (/[\u0000-\u0008\u000a-\u001f\u007f]/.test(value)) throw new Error('Header value contains an invalid control character.');
    (headers[line.slice(0, colon).toLowerCase()] ??= []).push(value);
  }
  if (!Object.keys(headers).length) throw new Error('No header fields found. Paste a single header block.');
  return json({ startLine, headers });
}
export function tableToCsv(text: string): string {
  const template = document.createElement('template'); template.innerHTML = text;
  const table = template.content.querySelector('table'); if (!table) throw new Error('No HTML table found.');
  const rows = [...table.querySelectorAll('tr')].filter(r => r.closest('table') === table);
  const data = rows.map(row => [...row.children].filter(c => ['TD', 'TH'].includes(c.tagName)).map(cell => {
    for (const attr of ['rowspan', 'colspan']) if (cell.hasAttribute(attr) && cell.getAttribute(attr)?.trim() !== '1') throw new Error('Merged cells are not supported. Remove rowspan and colspan before conversion.');
    const clone = cell.cloneNode(true) as Element;
    clone.querySelectorAll('script,style,template,noscript,table').forEach(n => n.remove());
    clone.querySelectorAll('br').forEach(n => n.replaceWith('\n'));
    clone.querySelectorAll('p,div').forEach(n => n.append('\n'));
    return (clone.textContent ?? '').trim();
  })).filter(r => r.length);
  if (!data.length) throw new Error('The table contains no cells.');
  if (data.some(r => r.length !== data[0].length)) throw new Error('Table rows have different numbers of cells.');
  return data.map(row => row.map(s => /[",\r\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s).join(',')).join('\r\n');
}
export function calculateGrowth(slug: string, text: string, values: ToolValues, second = ''): GrowthResult {
  switch (slug) {
    case 'srt-to-vtt': return { text: convertSubtitles(text, values) };
    case 'subtitle-time-shifter': return { text: shiftSubtitles(text, values) };
    case 'subtitles-to-text': return { text: subtitleTranscript(text, values) };
    case 'csv-row-filter': return { text: filterCsvRows(text, values) };
    case 'csv-column-statistics': return { text: csvStatistics(text, values) };
    case 'json-array-filter': return { text: filterJsonArray(text, values) };
    case 'json-pointer-extractor': return { text: json(extractPointer(JSON.parse(text), values.pointer ?? '')) };
    case 'json-key-renamer': return { text: renameJsonKeys(text, values) };
    case 'http-status-lookup': return { text: httpStatus(values) };
    case 'mime-type-lookup': return { text: mimeLookup(text) };
    case 'css-text-shadow-generator': return textShadow(values);
    case 'css-clip-path-generator': return polygonClip(text, values);
    case 'cubic-bezier-generator': return bezierCss(values);
    case 'css-flexbox-generator': return flexCss(values);
    case 'text-line-wrapper': return { text: wrapText(text, values) };
    case 'download-time-calculator': return { text: downloadTime(values) };
    case 'json-to-csharp': return { text: typedModels(text, 'csharp') };
    case 'json-to-kotlin': return { text: typedModels(text, 'kotlin') };
    case 'csv-column-extractor': return { text: selectCsvColumns(text, values) };
    case 'csv-transpose': return { text: transposeCsv(text, values) };
    case 'csv-deduplicate': return { text: deduplicateCsv(text, values) };
    case 'cron-expression-generator': return { text: generateCron(values) };
    case 'html-link-extractor': return { text: extractHtmlLinks(text, values) };
    case 'ipv4-to-decimal': return { text: ipv4Decimal(text, values) };
    case 'css-grid-generator': return gridCss(values);
    case 'json-patch-tester': return { text: json(applyJsonPatch(JSON.parse(text), JSON.parse(second))) };
    case 'json-merge-patch': return { text: json(mergePatch(JSON.parse(text), JSON.parse(second))) };
    case 'vcard-generator': return { text: vcardText(values) };
    case 'icalendar-generator': return { text: calendarText(text, values) };
    case 'url-cleaner': return { text: cleanUrls(text, values) };
    case 'json-to-rust': return { text: rustStructs(text) };
    case 'json-to-zod': return { text: zodSchema(text, values.strict === 'true') };
    case 'css-clamp-calculator': return { text: fluidClamp(values) };
    case 'robots-txt-generator': return { text: robotsText(text, values) };
    case 'sql-in-clause-generator': return { text: sqlInClause(text, values) };
    case 'json-to-python-dataclass': return { text: pythonDataclasses(text) };
    case 'csv-to-sql': return { text: csvToSql(text, values) };
    case 'json-to-query-string': return { text: jsonQuery(text, choice(values, 'direction', ['encode', 'decode']) === 'decode') };
    case 'html-table-to-csv': return { text: tableToCsv(text) };
    case 'url-extractor': return { text: extractUrls(text, values.unique === 'true').join('\n') };
    case 'email-extractor': return { text: extractEmails(text, values.unique === 'true').join('\n') };
    case 'list-compare': return { text: compareLists(text, second, values) };
    case 'whitespace-remover': {
      const mode = choice(values, 'mode', ['trim', 'collapse', 'blank', 'all']);
      const result = mode === 'all' ? text.replace(/\s+/gu, '') : mode === 'collapse' ? text.replace(/[^\S\r\n]+/gu, ' ') : mode === 'blank' ? text.split(/\r\n|\r|\n/).filter(line => line.trim()).join('\n') : text.split(/\r\n|\r|\n/).map(line => line.trim()).join('\n');
      return { text: result };
    }
    case 'nato-phonetic-alphabet': {
      const words = 'Alfa Bravo Charlie Delta Echo Foxtrot Golf Hotel India Juliett Kilo Lima Mike November Oscar Papa Quebec Romeo Sierra Tango Uniform Victor Whiskey X-ray Yankee Zulu'.split(' ');
      const digits = 'Zero One Two Three Four Five Six Seven Eight Nine'.split(' ');
      return { text: text.trim().split(/\s+/u).map(word => [...word].map(c => /^[a-z]$/i.test(c) ? words[c.toUpperCase().charCodeAt(0) - 65] : /^\d$/.test(c) ? digits[Number(c)] : c).join(' ')).join(' / ') };
    }
    case 'http-headers-to-json': return { text: parseHeaders(text) };
    case 'time-duration-converter': {
      const multipliers: Record<string, number> = { milliseconds: .001, seconds: 1, minutes: 60, hours: 3600, days: 86400, weeks: 604800 };
      const unit = choice(values, 'unit', Object.keys(multipliers));
      if (!text.trim() || !Number.isFinite(Number(text)) || Number(text) < 0) throw new Error('Enter a finite nonnegative duration.');
      const seconds = Number(text) * multipliers[unit];
      const millis = Math.round(seconds * 1000); if (!Number.isSafeInteger(millis)) throw new Error('Duration is too large for safe millisecond precision.');
      let remaining = millis;
      const days = Math.floor(remaining / 86400000); remaining %= 86400000;
      const hours = Math.floor(remaining / 3600000); remaining %= 3600000;
      const minutes = Math.floor(remaining / 60000); remaining %= 60000;
      const result = Object.entries(multipliers).map(([name, factor]) => `${name}: ${Number((seconds / factor).toPrecision(12))}`).join('\n');
      return { text: `${result}\n\nBreakdown (nearest millisecond): ${days}d ${hours}h ${minutes}m ${Math.floor(remaining / 1000)}s ${remaining % 1000}ms` };
    }
    case 'percentage-calculator': {
      const a = number(values, 'a'), b = number(values, 'b'), mode = choice(values, 'mode', ['of', 'ratio', 'change']);
      if ((mode === 'ratio' && b === 0) || (mode === 'change' && a === 0)) throw new Error('A percentage with a zero baseline is undefined.');
      const result = mode === 'of' ? (a / 100) * b : mode === 'ratio' ? (a / b) * 100 : ((b - a) / Math.abs(a)) * 100;
      if (!Number.isFinite(result)) throw new Error('Result exceeds supported numeric range.');
      const formula = mode === 'of' ? `(${a} / 100) × ${b}` : mode === 'ratio' ? `(${a} / ${b}) × 100` : `((${b} − ${a}) / |${a}|) × 100`;
      return { text: `${mode === 'of' ? 'Value' : 'Percentage'}: ${Number(result.toPrecision(12))}${mode === 'of' ? '' : '%'}\nFormula: ${formula}` };
    }
    case 'css-gradient-generator': {
      const kind = choice(values, 'type', ['linear', 'radial', 'conic']); const a = color(values, 'color1'), b = color(values, 'color2');
      const stop1 = number(values, 'stop1', 0, 100), stop2 = number(values, 'stop2', 0, 100), angle = number(values, 'angle', 0, 360);
      if (stop1 > stop2) throw new Error('First color stop must not exceed the second stop.');
      const prefix = kind === 'linear' ? `${angle}deg` : kind === 'radial' ? 'circle at center' : `from ${angle}deg at center`;
      const background = `${kind}-gradient(${prefix}, ${a} ${stop1}%, ${b} ${stop2}%)`;
      return { text: `background: ${background};`, preview: { background } };
    }
    case 'css-box-shadow-generator': {
      const x = number(values, 'x', -200, 200), y = number(values, 'y', -200, 200), blur = number(values, 'blur', 0, 200), spread = number(values, 'spread', -100, 100), opacity = number(values, 'opacity', 0, 100) / 100;
      const c = color(values, 'color'); const rgb = [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16)).join(', ');
      const boxShadow = `${values.inset === 'true' ? 'inset ' : ''}${x}px ${y}px ${blur}px ${spread}px rgba(${rgb}, ${opacity})`;
      return { text: `box-shadow: ${boxShadow};`, preview: { boxShadow } };
    }
    case 'css-border-radius-generator': {
      const r = ['tlx', 'trx', 'brx', 'blx', 'tly', 'try', 'bry', 'bly'].map(k => number(values, k, 0, 100) + '%');
      const borderRadius = r.slice(0, 4).join(' ') + ' / ' + r.slice(4).join(' ');
      return { text: `border-radius: ${borderRadius};`, preview: { borderRadius } };
    }
    default: throw new Error('Unknown text or design tool.');
  }
}

function validateSamples(value: unknown, depth = 0): void {
  if (depth > 32) throw new Error('Use a JSON sample with at most 32 nested levels.');
  if (typeof value === 'number' && (!Number.isFinite(value) || (Number.isInteger(value) && !Number.isSafeInteger(value)))) throw new Error('Numbers must be finite and integer samples must stay within JavaScript’s safe range. Represent larger identifiers as strings.');
  if (value && typeof value === 'object') for (const item of Object.values(value)) validateSamples(item, depth + 1);
}
export function rustStructs(text: string): string {
  const input: unknown = JSON.parse(text); validateSamples(input);
  const roots = Array.isArray(input) ? input : [input];
  if (!roots.length || !roots.every(plainObject)) throw new Error('Provide one JSON object or a non-empty array of sample objects.');
  const keywords = new Set('as break const continue crate else enum extern false fn for if impl in let loop match mod move mut pub ref return self Self static struct super trait true type unsafe use where while async await dyn abstract become box do final macro override priv typeof unsized virtual yield try gen union'.split(' '));
  const usedTypes = new Set(['String', 'Option', 'Vec', 'Value', 'Serialize', 'Deserialize']); const definitions: string[] = [];
  function unique(base: string, used: Set<string>): string { let candidate = base, i = 2; while (used.has(candidate)) candidate = base + i++; used.add(candidate); return candidate; }
  function rustString(value: string) {
    let result = '"';
    for (const c of value) {
      const point = c.codePointAt(0)!;
      if (point >= 0xd800 && point <= 0xdfff) throw new Error('JSON keys cannot contain unpaired UTF-16 surrogates in Rust identifiers.');
      result += c === '"' ? '\\"' : c === '\\' ? '\\\\' : point < 32 || point > 126 ? `\\u{${point.toString(16)}}` : c;
    }
    return result + '"';
  }
  function model(objects: Record<string, unknown>[], hint: string, depth: number): string {
    if (depth > 32) throw new Error('Too many nested Rust models.');
    let base = hint.replace(/([a-z0-9])([A-Z])/g, '$1_$2').split(/[^a-zA-Z0-9]+/).filter(Boolean).map(v => v[0].toUpperCase() + v.slice(1)).join('') || 'Model';
    if (/^\d/.test(base)) base = 'Model' + base;
    const name = unique(base, usedTypes), usedFields = new Set<string>();
    const keys = [...new Set(objects.flatMap(o => Object.keys(o)))];
    const fields = keys.map((key, i) => {
      let field = key.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toLowerCase().replace(/[^a-z0-9_]+/g, '_').replace(/^_+|_+$/g, '') || `field_${i + 1}`;
      if (/^\d/.test(field)) field = 'field_' + field;
      if (keywords.has(field)) field += '_field'; field = unique(field, usedFields);
      const samples = objects.map(o => Object.hasOwn(o, key) ? o[key] : null);
      const optional = samples.includes(null);
      const type = infer(samples, name + '_' + key, depth + 1);
      return (field !== key ? `    #[serde(rename = ${rustString(key)})]\n` : '') + (optional ? '    #[serde(default, skip_serializing_if = "Option::is_none")]\n' : '') + `    pub ${field}: ${type},`;
    });
    definitions.push(`#[derive(Debug, Clone, Serialize, Deserialize)]\npub struct ${name} {\n${fields.join('\n')}\n}`);
    return name;
  }
  function infer(samples: unknown[], hint: string, depth: number): string {
    if (depth > 32) throw new Error('JSON is too deeply nested.');
    const nullable = samples.includes(null), present = samples.filter(v => v !== null);
    let type = 'serde_json::Value';
    if (present.length && present.every(plainObject)) type = model(present, hint, depth);
    else if (present.length && present.every(Array.isArray)) { const items = present.flat(); type = `Vec<${items.length ? infer(items, hint + '_item', depth + 1) : 'serde_json::Value'}>`; }
    else if (present.length && present.every(v => typeof v === 'string')) type = 'String';
    else if (present.length && present.every(v => typeof v === 'boolean')) type = 'bool';
    else if (present.length && present.every(v => typeof v === 'number')) type = present.every(v => Number.isInteger(v)) ? 'i64' : 'f64';
    return nullable ? `Option<${type}>` : type;
  }
  model(roots, 'Root', 0);
  return 'use serde::{Deserialize, Serialize};\n\n// Cargo.toml: serde = { version = "1", features = ["derive"] }\n// Cargo.toml: serde_json = "1"\n\n' + definitions.join('\n\n') + '\n';
}
export function zodSchema(text: string, strict: boolean): string {
  const input: unknown = JSON.parse(text); validateSamples(input);
  function infer(samples: unknown[], depth: number): string {
    if (depth > 32) throw new Error('JSON is too deeply nested.');
    const indent = '  '.repeat(depth), variants: string[] = [];
    const objects = samples.filter(plainObject), arrays = samples.filter(Array.isArray);
    if (objects.length) {
      const keys = [...new Set(objects.flatMap(o => Object.keys(o)))];
      const fields = keys.map(key => {
        const present = objects.filter(o => Object.hasOwn(o, key));
        // Computed keys preserve even the special __proto__ property in JavaScript object syntax.
        const keyCode = key === '__proto__' ? '[' + JSON.stringify(key) + ']' : JSON.stringify(key);
        return `${indent}  ${keyCode}: ${infer(present.map(o => o[key]), depth + 1)}${present.length < objects.length ? '.optional()' : ''},`;
      });
      variants.push(`z.object({${fields.length ? '\n' + fields.join('\n') + '\n' + indent : ''}})${strict ? '.strict()' : ''}`);
    }
    if (arrays.length) { const items = arrays.flat(); variants.push(`z.array(${items.length ? infer(items, depth + 1) : 'z.unknown()'})`); }
    if (samples.some(v => typeof v === 'string')) variants.push('z.string()');
    if (samples.some(v => typeof v === 'number')) variants.push('z.number()');
    if (samples.some(v => typeof v === 'boolean')) variants.push('z.boolean()');
    if (samples.some(v => v === null)) variants.push('z.null()');
    return variants.length === 1 ? variants[0] : variants.length ? `z.union([${variants.join(', ')}])` : 'z.unknown()';
  }
  return 'import { z } from "zod";\n\nexport const rootSchema = ' + infer([input], 0) + ';\n\nexport type Root = z.infer<typeof rootSchema>;\n';
}
export function fluidClamp(values: ToolValues): string {
  const min = number(values, 'minSize', 1, 256), max = number(values, 'maxSize', 1, 256), low = number(values, 'minViewport', 1, 10000), high = number(values, 'maxViewport', 1, 10000), root = number(values, 'rootSize', 1, 128);
  if (high <= low) throw new Error('Maximum viewport must be greater than minimum viewport.');
  if (max < min) throw new Error('Maximum font size must be at least the minimum size.');
  const slope = (max - min) / (high - low), intercept = min - slope * low;
  const fmt = (v: number) => String(Number(v.toFixed(8)));
  const middle = (low + high) / 2;
  return `font-size: clamp(${fmt(min / root)}rem, calc(${fmt(intercept / root)}rem + ${fmt(slope * 100)}vw), ${fmt(max / root)}rem);\n\n/* At a ${fmt(root)}px root:\n   ${fmt(low)}px viewport → ${fmt(min)}px\n   ${fmt(middle)}px viewport → ${fmt((min + max) / 2)}px\n   ${fmt(high)}px viewport → ${fmt(max)}px\n   slope = (${fmt(max)} − ${fmt(min)}) / (${fmt(high)} − ${fmt(low)})\n*/`;
}
export function robotsText(text: string, values: ToolValues): string {
  const agent = values.agent?.trim(); if (!agent || !/^(?:\*|[a-zA-Z_-]+)$/.test(agent)) throw new Error('Use * or a crawler product token containing letters, hyphens or underscores.');
  const mode = choice(values, 'mode', ['custom', 'allow', 'block']);
  let paths: string[] = [];
  if (mode === 'custom') {
    paths = [...new Set(text.split(/\r\n|\r|\n/).map(p => p.trim()).filter(Boolean))];
    if (paths.some(p => !p.startsWith('/') || /[\s#\u0000-\u001f\u007f]/u.test(p))) throw new Error('Enter one root-relative path per line. Encode spaces and # characters in paths.');
  }
  let sitemap = values.sitemap?.trim() ?? '';
  if (sitemap) {
    let parsed: URL; try { parsed = new URL(sitemap); } catch { throw new Error('Sitemap must be an absolute HTTP or HTTPS URL.'); }
    if (!['http:', 'https:'].includes(parsed.protocol) || parsed.username || parsed.password || parsed.hash || /\s/u.test(sitemap)) throw new Error('Sitemap must be an HTTP(S) URL without credentials, spaces or a fragment.');
    sitemap = parsed.href;
  }
  const rules = mode === 'block' ? ['Disallow: /'] : mode === 'allow' || !paths.length ? ['Disallow:'] : paths.map(p => 'Disallow: ' + p);
  return `User-agent: ${agent}\n${rules.join('\n')}\n${sitemap ? '\nSitemap: ' + sitemap + '\n' : ''}`;
}
export function sqlInClause(text: string, values: ToolValues): string {
  const column = values.column?.trim(); if (!column || /[\u0000-\u001f\u007f]/.test(column)) throw new Error('Enter one column identifier without control characters.');
  const mode = choice(values, 'mode', ['strings', 'integers', 'parameters']);
  let entries = text.split(/\r\n|\r|\n/).map(s => s.trim()).filter(Boolean);
  if (values.deduplicate === 'true') entries = [...new Set(entries)];
  if (!entries.length) return 'FALSE -- Empty value list matches no rows.\n';
  if (entries.length > 10000) throw new Error('Use at most 10,000 values. For larger datasets, use a temporary table or a driver-supported array parameter.');
  const identifier = '"' + column.replace(/"/g, '""') + '"';
  const items = entries.map((v, i) => {
    if (mode === 'parameters') return '$' + (i + 1);
    if (mode === 'integers') { if (!/^[+-]?\d+$/.test(v)) throw new Error(`Line value ${i + 1} is not an integer literal.`); return BigInt(v).toString(); }
    if (v.includes('\0')) throw new Error('SQL text values cannot contain NUL characters.');
    return "E'" + v.replace(/\\/g, '\\\\').replace(/'/g, "''") + "'";
  });
  const predicate = `${identifier} IN (${items.join(', ')})`;
  return mode === 'parameters' ? `${predicate}\n\n-- Bind these string values in the same order:\n${json(entries)}` : predicate;
}

function equalJson(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (Array.isArray(a) && Array.isArray(b)) return a.length === b.length && a.every((v, i) => equalJson(v, b[i]));
  if (plainObject(a) && plainObject(b)) { const keys = Object.keys(a); return keys.length === Object.keys(b).length && keys.every(k => Object.hasOwn(b, k) && equalJson(a[k], b[k])); }
  return false;
}
function pointerTokens(pointer: unknown): string[] {
  if (typeof pointer !== 'string' || (pointer !== '' && !pointer.startsWith('/')) || /~(?![01])/.test(pointer)) throw new Error('Use a valid JSON Pointer with ~0 and ~1 escapes.');
  return pointer === '' ? [] : pointer.slice(1).split('/').map(v => v.replace(/~1/g, '/').replace(/~0/g, '~'));
}
function arrayIndex(token: string, length: number, insert = false): number {
  if (insert && token === '-') return length;
  if (!/^(?:0|[1-9]\d*)$/.test(token)) throw new Error('Array indexes must be nonnegative integers without leading zeros.');
  const i = Number(token); if (!Number.isSafeInteger(i) || i >= length + (insert ? 1 : 0)) throw new Error('Array index is outside the allowed range.'); return i;
}
export function applyJsonPatch(source: unknown, operations: unknown): unknown {
  validateSamples(source);
  if (!Array.isArray(operations) || operations.length > 1000) throw new Error('Provide a JSON Patch array with at most 1000 operations.');
  let root: unknown = structuredClone(source);
  function read(tokens: string[]): unknown {
    let node = root;
    if (node === undefined) throw new Error('The root document no longer exists.');
    for (const token of tokens) {
      if (Array.isArray(node)) node = node[arrayIndex(token, node.length)];
      else if (plainObject(node) && Object.hasOwn(node, token)) node = node[token];
      else throw new Error('The pointer does not resolve to an existing value.');
    }
    return node;
  }
  function write(tokens: string[], kind: 'add' | 'replace' | 'remove', value?: unknown) {
    if (!tokens.length) {
      if (kind !== 'add' && root === undefined) throw new Error('The root document does not exist.');
      root = kind === 'remove' ? undefined : structuredClone(value); return;
    }
    const parent = read(tokens.slice(0, -1)), key = tokens[tokens.length - 1];
    if (Array.isArray(parent)) {
      const i = arrayIndex(key, parent.length, kind === 'add');
      if (kind === 'add') parent.splice(i, 0, structuredClone(value));
      else if (kind === 'remove') parent.splice(i, 1);
      else parent[i] = structuredClone(value);
    } else if (plainObject(parent)) {
      if (kind !== 'add' && !Object.hasOwn(parent, key)) throw new Error('The target property does not exist.');
      if (kind === 'remove') delete parent[key];
      else Object.defineProperty(parent, key, { value: structuredClone(value), enumerable: true, configurable: true, writable: true });
    } else throw new Error('The parent must be an existing object or array.');
  }
  for (let i = 0; i < operations.length; i++) {
    try {
      const op: unknown = operations[i];
      if (!plainObject(op) || typeof op.op !== 'string') throw new Error('Each operation must be an object with an op name.');
      const path = pointerTokens(op.path);
      if (['add', 'replace', 'test'].includes(op.op)) {
        if (!Object.hasOwn(op, 'value')) throw new Error('This operation requires a value member.'); validateSamples(op.value);
      }
      switch (op.op) {
        case 'add': write(path, 'add', op.value); break;
        case 'replace': write(path, 'replace', op.value); break;
        case 'remove': write(path, 'remove'); break;
        case 'test': if (!equalJson(read(path), op.value)) throw new Error('Test operation failed.'); break;
        case 'copy': case 'move': {
          const from = pointerTokens(op.from), value = structuredClone(read(from));
          if (op.op === 'move') {
            if (path.length > from.length && from.every((v, j) => path[j] === v)) throw new Error('Cannot move a value into its own descendant.');
            if (path.length === from.length && from.every((v, j) => path[j] === v)) break;
            write(from, 'remove');
          }
          write(path, 'add', value); break;
        }
        default: throw new Error('Unsupported operation; choose add, remove, replace, move, copy or test.');
      }
      validateSamples(root);
      if ((JSON.stringify(root)?.length ?? 0) > 4 * 1024 * 1024) throw new Error('Patched output exceeds the 4 MiB size limit.');
    } catch (e) { throw new Error(`Operation ${i + 1}: ${e instanceof Error ? e.message : 'invalid operation'}`); }
  }
  if (root === undefined) throw new Error('The patch removed the root document. No JSON value remains to export; add a root value if you need a JSON result.');
  return root;
}
export function mergePatch(source: unknown, patch: unknown, depth = 0): unknown {
  if (depth === 0) { validateSamples(source); validateSamples(patch); }
  if (depth > 32) throw new Error('Merge patch is too deeply nested.');
  if (!plainObject(patch)) return structuredClone(patch);
  const target: Record<string, unknown> = plainObject(source) ? structuredClone(source) : {};
  for (const [key, value] of Object.entries(patch)) {
    if (value === null) delete target[key];
    else Object.defineProperty(target, key, { value: mergePatch(Object.hasOwn(target, key) ? target[key] : undefined, value, depth + 1), enumerable: true, configurable: true, writable: true });
  }
  return target;
}
export function foldContentLine(line: string): string {
  const encoder = new TextEncoder(); let count = 0, output = '';
  for (const point of line) {
    const length = encoder.encode(point).length;
    if (count + length > 75) { output += '\r\n '; count = 1; }
    output += point; count += length;
  }
  return output;
}
const escapeCardText = (s: string) => s.replace(/\\/g, '\\\\').replace(/\r\n|\r|\n/g, '\\n').replace(/;/g, '\\;').replace(/,/g, '\\,');
function cleanField(value: string | undefined, label: string): string {
  const s = value?.trim() ?? ''; if (/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(s)) throw new Error(`${label} contains an invalid control character.`); return s;
}
export function vcardText(values: ToolValues): string {
  const first = cleanField(values.first, 'Given name'), last = cleanField(values.last, 'Family name');
  if (!first && !last) throw new Error('Provide at least a given name or family name.');
  const lines = ['BEGIN:VCARD', 'VERSION:4.0', 'FN:' + escapeCardText([first, last].filter(Boolean).join(' ')), 'N:' + escapeCardText(last) + ';' + escapeCardText(first) + ';;;'];
  for (const [key, property] of [['company', 'ORG'], ['title', 'TITLE'], ['email', 'EMAIL'], ['phone', 'TEL;VALUE=text']]) {
    const value = cleanField(values[key], key); if (!value) continue;
    if (key === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) throw new Error('Provide one ordinary email address without whitespace.');
    lines.push(property + ':' + escapeCardText(value));
  }
  const url = values.url?.trim();
  if (url) {
    let parsed: URL; try { parsed = new URL(url); } catch { throw new Error('Website must be an absolute HTTP(S) URL.'); }
    if (!['http:', 'https:'].includes(parsed.protocol) || /[\r\n]/.test(url)) throw new Error('Website must be an HTTP(S) URL without line breaks.');
    lines.push('URL:' + parsed.href);
  }
  return [...lines, 'END:VCARD'].map(foldContentLine).join('\r\n') + '\r\n';
}
export function explicitInstant(input: string): Date {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?(Z|[+-]\d{2}:\d{2})$/i.exec(input.trim());
  if (!match) throw new Error('Times must use YYYY-MM-DDTHH:mm[:ss]Z or an explicit ±HH:mm offset.');
  const [, year, month, day, hour, minute, second = '0', offset] = match;
  const date = new Date(0); date.setUTCFullYear(Number(year), Number(month) - 1, Number(day)); date.setUTCHours(Number(hour), Number(minute), Number(second), 0);
  if (date.getUTCFullYear() !== Number(year) || date.getUTCMonth() !== Number(month) - 1 || date.getUTCDate() !== Number(day) || date.getUTCHours() !== Number(hour) || date.getUTCMinutes() !== Number(minute) || date.getUTCSeconds() !== Number(second)) throw new Error('The supplied calendar date or clock time is invalid.');
  if (offset.toUpperCase() !== 'Z') {
    const hours = Number(offset.slice(1, 3)), minutes = Number(offset.slice(4));
    if (hours > 23 || minutes > 59) throw new Error('Invalid timezone offset.');
    date.setUTCMinutes(date.getUTCMinutes() - (offset[0] === '+' ? 1 : -1) * (hours * 60 + minutes));
  }
  if (date.getUTCFullYear() < 1 || date.getUTCFullYear() > 9999) throw new Error('UTC dates must be within years 0001–9999.');
  return date;
}
export function calendarText(description: string, values: ToolValues, now = new Date()): string {
  const title = cleanField(values.title, 'Event title'); if (!title) throw new Error('Provide an event title.');
  const start = explicitInstant(values.start ?? ''), end = explicitInstant(values.end ?? ''); if (end <= start) throw new Error('The event end must be later than its start.');
  const timestamp = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
  const uid = cleanField(values.uid, 'UID') || crypto.randomUUID() + '@utilixio.com';
  if (/[\r\n\s]/u.test(uid)) throw new Error('Event UID must not contain whitespace or line breaks.');
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Utilixio//Local Calendar Generator//EN', 'CALSCALE:GREGORIAN', 'BEGIN:VEVENT', 'UID:' + escapeCardText(uid), 'DTSTAMP:' + timestamp(now), 'DTSTART:' + timestamp(start), 'DTEND:' + timestamp(end), 'SUMMARY:' + escapeCardText(title)];
  const location = cleanField(values.location, 'Location'); if (location) lines.push('LOCATION:' + escapeCardText(location));
  if (description) lines.push('DESCRIPTION:' + escapeCardText(cleanField(description, 'Description')));
  return [...lines, 'END:VEVENT', 'END:VCALENDAR'].map(foldContentLine).join('\r\n') + '\r\n';
}
export function cleanUrls(text: string, values: ToolValues): string {
  const known = new Set(['fbclid', 'gclid', 'dclid', 'msclkid', 'igshid', 'mc_cid', 'mc_eid', '_ga', '_gl', 'yclid']);
  for (const name of (values.extra ?? '').split(',').map(n => n.trim().toLowerCase()).filter(Boolean)) known.add(name);
  const lines = text.split(/\r\n|\r|\n/).map(s => s.trim()).filter(Boolean); if (!lines.length) throw new Error('Paste at least one absolute HTTP(S) URL.');
  return lines.map((line, i) => {
    let url: URL; try { url = new URL(line); } catch { throw new Error(`Line ${i + 1}: invalid absolute URL.`); }
    if (!['http:', 'https:'].includes(url.protocol)) throw new Error(`Line ${i + 1}: use an HTTP(S) URL.`);
    let changed = false;
    for (const key of [...url.searchParams.keys()]) if (key.toLowerCase().startsWith('utm_') || known.has(key.toLowerCase())) { url.searchParams.delete(key); changed = true; }
    if (values.fragment === 'true' && url.hash) { url.hash = ''; changed = true; }
    return changed ? url.href : line;
  }).join('\n');
}

export function typedModels(text: string, language: 'csharp' | 'kotlin'): string {
  const input: unknown = JSON.parse(text); validateSamples(input);
  const roots = Array.isArray(input) ? input : [input];
  if (!roots.length || !roots.every(plainObject)) throw new Error('Provide one JSON object or a non-empty array of example objects.');
  const kotlin = language === 'kotlin', definitions: string[] = [];
  const types = new Set(['String', 'Int', 'Long', 'Double', 'Boolean', 'List', 'JsonElement', 'Serializable', 'SerialName', 'JsonPropertyName']);
  const keywords = new Set('as break class continue do else false for fun if in interface is null object package return super this throw true try typealias typeof val var when while by catch constructor delegate dynamic field file finally get import init param property receiver set setparam where actual abstract annotation companion const crossinline data enum expect external final infix inline inner internal lateinit noinline open operator out override private protected public reified sealed suspend tailrec vararg value context'.split(' '));
  const unique = (base: string, used: Set<string>) => { let next = base, i = 2; while (used.has(next)) next = base + i++; used.add(next); return next; };
  function words(value: string) { return value.replace(/([a-z0-9])([A-Z])/g, '$1_$2').split(/[^a-zA-Z0-9]+/).filter(Boolean); }
  function pascal(value: string) { return words(value).map(v => v[0].toUpperCase() + v.slice(1)).join(''); }
  function literal(value: string) {
    let out = '"';
    for (let i = 0; i < value.length; i++) {
      const c = value[i], n = value.charCodeAt(i);
      out += c === '"' ? '\\"' : c === '\\' ? '\\\\' : kotlin && c === '$' ? '\\$' : n < 32 || n > 126 ? '\\u' + n.toString(16).padStart(4, '0') : c;
    }
    return out + '"';
  }
  function model(records: Record<string, unknown>[], hint: string, depth: number): string {
    if (depth > 32) throw new Error('Too many nested model levels.');
    let base = pascal(hint) || 'Model'; if (/^\d/.test(base)) base = 'Model' + base;
    const name = unique(base, types), used = new Set<string>([name]);
    const keys = [...new Set(records.flatMap(r => Object.keys(r)))];
    const fields = keys.map((key, i) => {
      let property = pascal(key) || `Field${i + 1}`;
      if (kotlin) property = property[0].toLowerCase() + property.slice(1);
      if (/^\d/.test(property)) property = (kotlin ? 'field' : 'Field') + property;
      if (kotlin && keywords.has(property)) property += 'Field'; property = unique(property, used);
      const missing = records.some(r => !Object.hasOwn(r, key));
      const samples = records.map(r => Object.hasOwn(r, key) ? r[key] : null);
      const type = infer(samples, name + '_' + key, depth + 1);
      return kotlin ? `    @SerialName(${literal(key)})\n    val ${property}: ${type}${missing ? ' = null' : ''}` : `    [JsonPropertyName(${literal(key)})]\n    public ${missing ? '' : 'required '}${type} ${property} { get; set; }`;
    });
    definitions.push(kotlin ? fields.length ? `@Serializable\ndata class ${name}(\n${fields.join(',\n')}\n)` : `@Serializable\nclass ${name}` : `public sealed class ${name}\n{\n${fields.join('\n\n')}\n}`);
    return name;
  }
  function infer(samples: unknown[], hint: string, depth: number): string {
    if (depth > 32) throw new Error('JSON is too deeply nested.');
    const nullable = samples.includes(null), present = samples.filter(v => v !== null); let type = 'JsonElement';
    if (present.length && present.every(plainObject)) type = model(present, hint, depth);
    else if (present.length && present.every(Array.isArray)) { const items = present.flat(); type = `List<${items.length ? infer(items, hint + 'Item', depth + 1) : 'JsonElement'}>`; }
    else if (present.length && present.every(v => typeof v === 'string')) type = kotlin ? 'String' : 'string';
    else if (present.length && present.every(v => typeof v === 'boolean')) type = kotlin ? 'Boolean' : 'bool';
    else if (present.length && present.every(v => typeof v === 'number')) {
      const numeric = present as number[];
      type = numeric.every(Number.isInteger) ? numeric.every(n => n >= -2147483648 && n <= 2147483647) ? (kotlin ? 'Int' : 'int') : (kotlin ? 'Long' : 'long') : (kotlin ? 'Double' : 'double');
    }
    return type + (nullable ? '?' : '');
  }
  model(roots, 'Root', 0);
  return (kotlin ? 'import kotlinx.serialization.Serializable\nimport kotlinx.serialization.SerialName\nimport kotlinx.serialization.json.JsonElement\n\n// Requires the Kotlin serialization plugin and kotlinx-serialization-json.\n\n' : '#nullable enable\nusing System.Collections.Generic;\nusing System.Text.Json;\nusing System.Text.Json.Serialization;\n\n// C# 11 / .NET 7+; an array response deserializes as List<Root>.\n\n') + definitions.join('\n\n') + '\n';
}
export function encodeCsv(rows: string[][]): string {
  return rows.map(row => row.map(v => /[",\r\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v).join(',')).join('\r\n');
}
function csvTable(text: string, delimiter: string, hasHeader = true) {
  const rows = parseDelimited(text, delimiter);
  if (!rows.length || !rows[0].length) throw new Error('Paste a non-empty CSV table.');
  const width = rows[0].length;
  if (rows.some(r => r.length !== width)) throw new Error('CSV rows must contain the same number of cells.');
  if (rows.length * width > 50000) throw new Error('Use at most 50,000 cells per operation.');
  if (hasHeader && (rows[0].some(h => !h.trim()) || new Set(rows[0]).size !== width)) throw new Error('Headers must be unique and non-empty.');
  return rows;
}
function selectedColumns(input: string | undefined, headers: string[], allWhenEmpty = false): number[] {
  let names: unknown; try { names = JSON.parse(input ?? ''); } catch { throw new Error('Column selection must be a JSON array of exact header names.'); }
  if (!Array.isArray(names) || names.some(v => typeof v !== 'string') || new Set(names).size !== names.length || (!allWhenEmpty && !names.length)) throw new Error('Choose unique column names in a JSON array.');
  if (!names.length) return headers.map((_, i) => i);
  return names.map(name => { const index = headers.indexOf(name); if (index < 0) throw new Error('Unknown column: ' + name); return index; });
}
export function selectCsvColumns(text: string, values: ToolValues): string {
  const rows = csvTable(text, values.delimiter ?? ','); const indexes = selectedColumns(values.columns, rows[0]);
  return encodeCsv(rows.map(row => indexes.map(i => row[i])));
}
export function transposeCsv(text: string, values: ToolValues): string {
  const rows = csvTable(text, values.delimiter ?? ',', false);
  return encodeCsv(rows[0].map((_, i) => rows.map(row => row[i])));
}
export function deduplicateCsv(text: string, values: ToolValues): string {
  const [header, ...body] = csvTable(text, values.delimiter ?? ',');
  const indexes = selectedColumns(values.keys, header, true), keep = choice(values, 'keep', ['first', 'last']);
  const seen = new Set<string>(), kept: string[][] = [];
  for (const row of keep === 'last' ? [...body].reverse() : body) {
    const key = JSON.stringify(indexes.map(i => { let value = values.trim === 'true' ? row[i].trim() : row[i]; if (values.ignoreCase === 'true') value = value.toLowerCase(); return value; }));
    if (!seen.has(key)) { seen.add(key); kept.push(row); }
  }
  return encodeCsv([header, ...(keep === 'last' ? kept.reverse() : kept)]);
}
function cronField(input: string | undefined, min: number, max: number): string {
  const field = input?.trim() ?? ''; if (!field || field.length > 100) throw new Error('Each custom cron field must be a short non-empty expression.');
  for (const part of field.split(',')) {
    const match = /^(\*|\d+(?:-\d+)?)(?:\/(\d+))?$/.exec(part); if (!match) throw new Error('Use numeric cron values, ranges, lists, * and /steps only.');
    if (match[1] !== '*') {
      const range = match[1].split('-').map(Number);
      if (range.some(n => !Number.isInteger(n) || n < min || n > max) || (range.length === 2 && range[0] > range[1])) throw new Error(`Cron values must be within ${min}–${max} with ascending ranges.`);
    }
    if (match[2] && (Number(match[2]) < 1 || Number(match[2]) > max - min + 1)) throw new Error('Cron step must be positive and within the field span.');
  }
  return field;
}
export function generateCron(values: ToolValues): string {
  const mode = choice(values, 'preset', ['interval', 'daily', 'weekdays', 'weekly', 'monthly', 'custom']);
  if (mode === 'custom') return [['customMinute', 0, 59], ['customHour', 0, 23], ['customDay', 1, 31], ['customMonth', 1, 12], ['customWeekday', 0, 7]].map(([key, min, max]) => cronField(values[String(key)], Number(min), Number(max))).join(' ');
  const integer = (key: string, min: number, max: number) => { const n = number(values, key, min, max); if (!Number.isInteger(n)) throw new Error('Cron clock and interval values must be integers.'); return n; };
  if (mode === 'interval') return `*/${integer('interval', 1, 59)} * * * *`;
  const minute = integer('minute', 0, 59), hour = integer('hour', 0, 23);
  if (mode === 'daily') return `${minute} ${hour} * * *`;
  if (mode === 'weekdays') return `${minute} ${hour} * * 1-5`;
  if (mode === 'weekly') return `${minute} ${hour} * * ${integer('weekday', 0, 6)}`;
  return `${minute} ${hour} ${integer('monthday', 1, 31)} * *`;
}
export function extractHtmlLinks(text: string, values: ToolValues): string {
  let base: URL; try { base = new URL(values.base); } catch { throw new Error('Provide an absolute HTTP(S) base page URL.'); }
  if (!['http:', 'https:'].includes(base.protocol)) throw new Error('Base page URL must use HTTP or HTTPS.');
  const template = document.createElement('template'); template.innerHTML = text;
  const seen = new Set<string>(), links: { text: string; url: string; rel: string[]; target: string; nofollow: boolean; sameOrigin: boolean }[] = [];
  for (const element of template.content.querySelectorAll('a[href],area[href]')) {
    if (element.namespaceURI !== 'http://www.w3.org/1999/xhtml') continue;
    const href = element.getAttribute('href')!; let url: URL;
    try { url = new URL(href, base); } catch { continue; }
    if (!['http:', 'https:'].includes(url.protocol) || (values.unique === 'true' && seen.has(url.href))) continue;
    const clone = element.cloneNode(true) as Element; clone.querySelectorAll('script,style,template,noscript').forEach(n => n.remove());
    const label = element.tagName === 'AREA' ? element.getAttribute('alt') ?? '' : clone.textContent ?? '';
    const rel = [...new Set((element.getAttribute('rel') ?? '').trim().toLowerCase().split(/\s+/).filter(Boolean))];
    links.push({ text: label.replace(/\s+/g, ' ').trim(), url: url.href, rel, target: element.getAttribute('target') ?? '', nofollow: rel.includes('nofollow'), sameOrigin: url.origin === base.origin });
    seen.add(url.href);
  }
  return json(links);
}
export function ipv4Decimal(text: string, values: ToolValues): string {
  const raw = text.trim(), direction = choice(values, 'direction', ['ip', 'decimal']); let result: number;
  if (direction === 'ip') {
    const parts = raw.split('.'); if (parts.length !== 4 || parts.some(p => !/^(?:0|[1-9]\d{0,2})$/.test(p) || Number(p) > 255)) throw new Error('Enter exactly four decimal octets from 0 to 255, without leading zeros.');
    result = parts.reduce((n, p) => n * 256 + Number(p), 0);
  } else {
    if (!/^\d+$/.test(raw) || !Number.isSafeInteger(Number(raw)) || Number(raw) > 4294967295) throw new Error('Enter an unsigned decimal integer from 0 to 4294967295.');
    result = Number(raw);
  }
  const octets = [24, 16, 8, 0].map(shift => Math.floor(result / 2 ** shift) % 256);
  return json({ ipv4: octets.join('.'), decimal: result, hex: '0x' + result.toString(16).padStart(8, '0'), binary: octets.map(n => n.toString(2).padStart(8, '0')).join('.') });
}
export function gridCss(values: ToolValues): GrowthResult {
  const cols = number(values, 'columns', 1, 8), min = number(values, 'minWidth', 60, 600), gap = number(values, 'gap', 0, 80), items = number(values, 'items', 1, 24);
  if (![cols, items].every(Number.isInteger)) throw new Error('Column and preview-item counts must be whole numbers.');
  const template = values.responsive === 'true' ? `repeat(auto-fit, minmax(min(100%, ${min}px), 1fr))` : `repeat(${cols}, minmax(0, 1fr))`;
  return { text: `.grid {\n  display: grid;\n  grid-template-columns: ${template};\n  gap: ${gap}px;\n}\n\n.grid > * {\n  min-width: 0;\n}`, grid: { template, gap, items } };
}

type SubtitleCue = { start: number; end: number; text: string };
function cueTime(raw: string, format: string): number {
  const pattern = format === 'srt' ? /^(\d{2,}):(\d{2}):(\d{2}),(\d{3})$/ : /^(?:(\d{2,}):)?(\d{2}):(\d{2})\.(\d{3})$/;
  const m = pattern.exec(raw); if (!m) throw new Error('Invalid subtitle timestamp for the selected format.');
  const hours = Number(m[1] ?? 0), minutes = Number(m[2]), seconds = Number(m[3]), millis = Number(m[4]);
  const result = ((hours * 60 + minutes) * 60 + seconds) * 1000 + millis;
  if (minutes > 59 || seconds > 59 || !Number.isSafeInteger(result)) throw new Error('Subtitle time is out of range.');
  return result;
}
export function parseSubtitles(input: string, format: string): SubtitleCue[] {
  if (!['srt', 'vtt'].includes(format)) throw new Error('Choose SRT or WebVTT.');
  const normalized = input.replace(/^\uFEFF/, '').replace(/\r\n|\r/g, '\n').replace(/^(?:[ \t]*\n)+|(?:\n[ \t]*)+$/g, '');
  const blocks = normalized.split(/\n[ \t]*\n+/);
  if (format === 'vtt' && blocks.shift() !== 'WEBVTT') throw new Error('Plain WebVTT must begin with WEBVTT and a blank line, without header metadata.');
  if (!normalized || !blocks.length || !blocks[0]) throw new Error('No subtitle cues found.');
  return blocks.map((block, i) => {
    const lines = block.split('\n'), at = lines.findIndex(line => line.includes('-->'));
    if (at < 0 || at > 1 || (format === 'srt' && at === 1 && !/^\d+$/.test(lines[0].trim()))) throw new Error(`Cue ${i + 1}: expected plain timed cues, without STYLE, REGION or NOTE blocks.`);
    const match = /^(\S+)\s+-->\s+(\S+)(.*)$/.exec(lines[at].trim());
    if (!match || match[3].trim()) throw new Error(`Cue ${i + 1}: timing settings or malformed arrows are not supported.`);
    const start = cueTime(match[1], format), end = cueTime(match[2], format), text = lines.slice(at + 1).join('\n');
    if (end <= start || !text.trim()) throw new Error(`Cue ${i + 1}: end must follow start and caption text must be present.`);
    return { start, end, text };
  });
}
function serializeSubtitles(cues: SubtitleCue[], format: string): string {
  const time = (millis: number) => {
    const hours = Math.floor(millis / 3600000), minutes = Math.floor(millis / 60000) % 60, seconds = Math.floor(millis / 1000) % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}${format === 'srt' ? ',' : '.'}${String(millis % 1000).padStart(3, '0')}`;
  };
  if (format === 'vtt' && cues.some(c => c.text.includes('-->'))) throw new Error('WebVTT cue text cannot contain a literal --> sequence.');
  return (format === 'vtt' ? 'WEBVTT\n\n' : '') + cues.map((cue, i) => `${format === 'srt' ? i + 1 + '\n' : ''}${time(cue.start)} --> ${time(cue.end)}\n${cue.text}`).join('\n\n') + '\n';
}
export function convertSubtitles(text: string, values: ToolValues): string {
  const direction = choice(values, 'direction', ['srt-vtt', 'vtt-srt']);
  return serializeSubtitles(parseSubtitles(text, direction === 'srt-vtt' ? 'srt' : 'vtt'), direction === 'srt-vtt' ? 'vtt' : 'srt');
}
export function shiftSubtitles(text: string, values: ToolValues): string {
  const format = choice(values, 'format', ['srt', 'vtt']), offset = number(values, 'offset', -86400000, 86400000);
  if (!Number.isInteger(offset)) throw new Error('Offset must be a whole number of milliseconds.');
  const cues = parseSubtitles(text, format).map(c => ({ ...c, start: c.start + offset, end: c.end + offset }));
  if (cues.some(c => c.start < 0 || !Number.isSafeInteger(c.end))) throw new Error('The offset moves a cue before zero or outside the supported time range.');
  return serializeSubtitles(cues, format);
}
export function subtitleTranscript(text: string, values: ToolValues): string {
  const cues = parseSubtitles(text, choice(values, 'format', ['srt', 'vtt']));
  const texts = cues.map(c => {
    const template = document.createElement('template'); template.innerHTML = c.text.replace(/<(?:\d{2,}:)?\d{2}:\d{2}\.\d{3}>/g, '');
    template.content.querySelectorAll('script,style,template,noscript').forEach(n => n.remove());
    template.content.querySelectorAll('br').forEach(n => n.replaceWith('\n'));
    return (template.content.textContent ?? '').trim();
  });
  return texts.filter((value, i) => values.dedupe !== 'true' || i === 0 || value !== texts[i - 1]).join('\n\n');
}
function decimalCell(text: string): number | null {
  const raw = text.trim(); if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/.test(raw)) return null;
  const n = Number(raw); return Number.isFinite(n) ? n : null;
}
export function filterCsvRows(text: string, values: ToolValues): string {
  const [header, ...rows] = csvTable(text, values.delimiter ?? ','); const index = header.indexOf(values.column); if (index < 0) throw new Error('Choose an exact header name.');
  const op = choice(values, 'operator', ['eq', 'contains', 'gt', 'gte', 'lt', 'lte']); const value = values.value ?? '';
  const numeric = decimalCell(value); if (!['eq', 'contains'].includes(op) && numeric === null) throw new Error('The numeric comparison value must be a finite decimal number.');
  const selected = rows.filter(row => {
    let cell = values.trim === 'true' ? row[index].trim() : row[index]; let criterion = values.trim === 'true' ? value.trim() : value;
    if (op === 'eq' || op === 'contains') { if (values.ignoreCase === 'true') { cell = cell.toLowerCase(); criterion = criterion.toLowerCase(); } return op === 'eq' ? cell === criterion : cell.includes(criterion); }
    const n = decimalCell(cell); return n !== null && (op === 'gt' ? n > numeric! : op === 'gte' ? n >= numeric! : op === 'lt' ? n < numeric! : n <= numeric!);
  });
  return encodeCsv([header, ...selected]);
}
export function csvStatistics(text: string, values: ToolValues): string {
  const [header, ...rows] = csvTable(text, values.delimiter ?? ','); const index = header.indexOf(values.column); if (index < 0) throw new Error('Choose an exact header name.');
  const cells = rows.map(row => row[index]), numeric: number[] = [], rejected: string[] = []; let empty = 0;
  for (const cell of cells) { if (!cell.trim()) empty++; else { const n = decimalCell(cell); if (n === null) rejected.push(cell); else numeric.push(n); } }
  numeric.sort((a, b) => a - b); let sum = 0, correction = 0;
  for (const n of numeric) { const y = n - correction, next = sum + y; correction = next - sum - y; sum = next; }
  const mid = Math.floor(numeric.length / 2); const median = numeric.length ? numeric.length % 2 ? numeric[mid] : numeric[mid - 1] / 2 + numeric[mid] / 2 : null;
  if (!Number.isFinite(sum)) throw new Error('Numeric total exceeds supported floating-point range.');
  return json({ column: values.column, rows: rows.length, empty, distinctStrings: new Set(cells).size, numericCount: numeric.length, nonnumericCount: rejected.length, nonnumericExamples: [...new Set(rejected)].slice(0, 5), sum: numeric.length ? sum : null, mean: numeric.length ? sum / numeric.length : null, median, minimum: numeric[0] ?? null, maximum: numeric.at(-1) ?? null });
}
function pointerValue(source: unknown, tokens: string[]): { found: boolean; value: unknown } {
  let value = source;
  for (const token of tokens) {
    if (Array.isArray(value)) {
      if (!/^(?:0|[1-9]\d*)$/.test(token) || Number(token) >= value.length) return { found: false, value: undefined };
      value = value[Number(token)];
    } else if (plainObject(value) && Object.hasOwn(value, token)) value = value[token];
    else return { found: false, value: undefined };
  }
  return { found: true, value };
}
export function extractPointer(source: unknown, pointer: string): unknown {
  validateSamples(source); const tokens = pointerTokens(pointer), result = pointerValue(source, tokens);
  if (!result.found) throw new Error('The pointer does not resolve to an existing value.'); return result.value;
}
export function filterJsonArray(text: string, values: ToolValues): string {
  const source: unknown = JSON.parse(text); validateSamples(source); if (!Array.isArray(source)) throw new Error('Provide a JSON array.');
  const tokens = pointerTokens(values.pointer ?? ''), op = choice(values, 'operator', ['eq', 'ne', 'contains', 'gt', 'gte', 'lt', 'lte', 'exists', 'missing']);
  let criterion: unknown; if (!['exists', 'missing'].includes(op)) { try { criterion = JSON.parse(values.value ?? ''); } catch { throw new Error('The comparison must be a JSON value, including quotes around strings.'); } validateSamples(criterion); }
  if (op === 'contains' && typeof criterion !== 'string') throw new Error('Substring criteria must be JSON strings.');
  if (['gt', 'gte', 'lt', 'lte'].includes(op) && typeof criterion !== 'number') throw new Error('Numeric criteria must be JSON numbers.');
  return json(source.filter(item => {
    const result = pointerValue(item, tokens); if (op === 'exists') return result.found; if (op === 'missing') return !result.found; if (!result.found) return false;
    const value = result.value;
    if (op === 'eq' || op === 'ne') return op === 'eq' ? equalJson(value, criterion) : !equalJson(value, criterion);
    if (op === 'contains') return typeof value === 'string' && (values.ignoreCase === 'true' ? value.toLowerCase().includes((criterion as string).toLowerCase()) : value.includes(criterion as string));
    return typeof value === 'number' && (op === 'gt' ? value > (criterion as number) : op === 'gte' ? value >= (criterion as number) : op === 'lt' ? value < (criterion as number) : value <= (criterion as number));
  }));
}
export function renameJsonKeys(text: string, values: ToolValues): string {
  const source: unknown = JSON.parse(text), mapping: unknown = JSON.parse(values.mapping ?? ''); validateSamples(source);
  if ((!plainObject(source) && !Array.isArray(source)) || !plainObject(mapping) || Object.values(mapping).some(v => typeof v !== 'string')) throw new Error('Use an object or array source and a JSON object mapping old keys to string names.');
  const rename = (record: Record<string, unknown>): Record<string, unknown> => {
    const target: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(record)) {
      const next = Object.hasOwn(mapping, key) ? mapping[key] as string : key;
      if (Object.hasOwn(target, next)) throw new Error('Renaming would create a duplicate destination key: ' + next);
      Object.defineProperty(target, next, { value: values.recursive === 'true' ? walk(value) : structuredClone(value), enumerable: true, configurable: true, writable: true });
    }
    return target;
  };
  function walk(value: unknown): unknown { return Array.isArray(value) ? value.map(walk) : plainObject(value) ? rename(value) : value; }
  return json(Array.isArray(source) && values.recursive !== 'true' ? source.map(v => plainObject(v) ? rename(v) : structuredClone(v)) : walk(source));
}
const commonHttp: Record<number, string> = { 100: 'Continue', 101: 'Switching Protocols', 103: 'Early Hints', 200: 'OK', 201: 'Created', 202: 'Accepted', 204: 'No Content', 206: 'Partial Content', 300: 'Multiple Choices', 301: 'Moved Permanently', 302: 'Found', 303: 'See Other', 304: 'Not Modified', 307: 'Temporary Redirect', 308: 'Permanent Redirect', 400: 'Bad Request', 401: 'Unauthorized', 403: 'Forbidden', 404: 'Not Found', 405: 'Method Not Allowed', 406: 'Not Acceptable', 408: 'Request Timeout', 409: 'Conflict', 410: 'Gone', 411: 'Length Required', 412: 'Precondition Failed', 413: 'Content Too Large', 414: 'URI Too Long', 415: 'Unsupported Media Type', 416: 'Range Not Satisfiable', 417: 'Expectation Failed', 421: 'Misdirected Request', 422: 'Unprocessable Content', 423: 'Locked', 424: 'Failed Dependency', 425: 'Too Early', 426: 'Upgrade Required', 428: 'Precondition Required', 429: 'Too Many Requests', 431: 'Request Header Fields Too Large', 451: 'Unavailable For Legal Reasons', 500: 'Internal Server Error', 501: 'Not Implemented', 502: 'Bad Gateway', 503: 'Service Unavailable', 504: 'Gateway Timeout', 505: 'HTTP Version Not Supported', 507: 'Insufficient Storage', 508: 'Loop Detected', 511: 'Network Authentication Required' };
export function httpStatus(values: ToolValues): string {
  const code = number(values, 'code', 100, 599); if (!Number.isInteger(code)) throw new Error('A status code must be a whole three-digit number.');
  return json({ code, label: commonHttp[code] ?? null, class: ['Informational', 'Success', 'Redirection', 'Client error', 'Server error'][Math.floor(code / 100) - 1], includedInReference: Object.hasOwn(commonHttp, code), note: commonHttp[code] ? 'Common stable status label; inspect the actual response and protocol rules separately.' : 'Not included in this common-code reference. This does not establish whether the code is assigned.', source: 'https://www.iana.org/assignments/http-status-codes/' });
}
const mediaExtensions: Record<string, string> = { txt: 'text/plain', html: 'text/html', htm: 'text/html', css: 'text/css', js: 'text/javascript', mjs: 'text/javascript', json: 'application/json', xml: 'application/xml', csv: 'text/csv', md: 'text/markdown', pdf: 'application/pdf', zip: 'application/zip', gz: 'application/gzip', png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', webp: 'image/webp', gif: 'image/gif', svg: 'image/svg+xml', avif: 'image/avif', ico: 'image/vnd.microsoft.icon', mp3: 'audio/mpeg', wav: 'audio/wav', ogg: 'audio/ogg', mp4: 'video/mp4', webm: 'video/webm', woff: 'font/woff', woff2: 'font/woff2', ttf: 'font/ttf', vcf: 'text/vcard', ics: 'text/calendar', vtt: 'text/vtt', wasm: 'application/wasm' };
export function mimeLookup(text: string): string {
  const raw = text.trim(); if (!raw) throw new Error('Enter a filename, extension or MIME type.');
  const base = raw.split(';')[0].trim().toLowerCase();
  const isMime = /^[a-z0-9!#$&^_.+-]+\/[a-z0-9!#$&^_.+-]+$/.test(base);
  const name = raw.split(/[?#]/)[0].split(/[\\/]/).at(-1) ?? '', ext = name.replace(/^\./, '').split('.').at(-1)!.toLowerCase();
  const mime = isMime ? base : Object.hasOwn(mediaExtensions, ext) ? mediaExtensions[ext] : null;
  const extensions = Object.entries(mediaExtensions).filter(([, v]) => v === mime).map(([k]) => '.' + k);
  return json({ input: raw, known: extensions.length > 0, mime: extensions.length ? mime : null, extensions, fallback: extensions.length ? null : 'application/octet-stream', note: 'Filename lookup only; no file bytes or live registry are inspected.' });
}
export function textShadow(values: ToolValues): GrowthResult {
  const x = number(values, 'x', -100, 100), y = number(values, 'y', -100, 100), blur = number(values, 'blur', 0, 80), opacity = number(values, 'opacity', 0, 100) / 100, c = color(values, 'color');
  const rgb = [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16)).join(', '), textShadow = `${x}px ${y}px ${blur}px rgba(${rgb}, ${opacity})`;
  return { text: `text-shadow: ${textShadow};`, preview: { textShadow } };
}
export function polygonClip(text: string, values: ToolValues): GrowthResult {
  const points: unknown = JSON.parse(text);
  if (!Array.isArray(points) || points.length < 3 || points.length > 20 || points.some(p => !Array.isArray(p) || p.length !== 2 || p.some(v => typeof v !== 'number' || !Number.isFinite(v) || v < 0 || v > 100)) || new Set(points.map(p => JSON.stringify(p))).size < 3) throw new Error('Enter 3–20 percentage pairs with at least three distinct points, all within 0–100.');
  const clipPath = `polygon(${points.map(p => (p as number[]).map(v => `${v}%`).join(' ')).join(', ')})`, background = color(values, 'color');
  return { text: `.shape {\n  clip-path: ${clipPath};\n  background: ${background};\n}`, preview: { clipPath, background } };
}
export function bezierCss(values: ToolValues): GrowthResult {
  const x1 = number(values, 'x1', 0, 1), x2 = number(values, 'x2', 0, 1), y1 = number(values, 'y1', -3, 3), y2 = number(values, 'y2', -3, 3), timing = `cubic-bezier(${x1}, ${y1}, ${x2}, ${y2})`;
  return { text: `transition-timing-function: ${timing};\nanimation-timing-function: ${timing};`, curve: { x1, x2, y1, y2, timing } };
}
export function flexCss(values: ToolValues): GrowthResult {
  const direction = choice(values, 'direction', ['row', 'row-reverse', 'column', 'column-reverse']), wrap = choice(values, 'wrap', ['nowrap', 'wrap', 'wrap-reverse']), justify = choice(values, 'justify', ['flex-start', 'center', 'flex-end', 'space-between', 'space-around', 'space-evenly']), align = choice(values, 'align', ['stretch', 'flex-start', 'center', 'flex-end']), gap = number(values, 'gap', 0, 80), items = number(values, 'items', 1, 20);
  if (!Number.isInteger(items)) throw new Error('Preview item count must be a whole number.');
  return { text: `.flex {\n  display: flex;\n  flex-direction: ${direction};\n  flex-wrap: ${wrap};\n  justify-content: ${justify};\n  align-items: ${align};\n  gap: ${gap}px;\n}`, flex: { direction, wrap, justify, align, gap, items } };
}
export function wrapText(text: string, values: ToolValues): string {
  if (text.length > 200000) throw new Error('Use at most 200,000 input characters.');
  const width = number(values, 'width', 10, 200); if (!Number.isInteger(width)) throw new Error('Line width must be a whole number.');
  const segmenter = typeof Intl.Segmenter === 'function' ? new Intl.Segmenter(undefined, { granularity: 'grapheme' }) : null;
  const chars = (s: string) => segmenter ? [...segmenter.segment(s)].map(v => v.segment) : [...s];
  function line(source: string): string {
    const output: string[] = []; let current = '', count = 0;
    for (const word of source.split(/\s+/u).filter(Boolean)) {
      const letters = chars(word);
      const chunks = values.breakWords === 'true' ? Array.from({ length: Math.ceil(letters.length / width) }, (_, i) => letters.slice(i * width, (i + 1) * width).join('')) : [word];
      for (const chunk of chunks) {
        const size = chars(chunk).length;
        if (current && count + size + 1 > width) { output.push(current); current = ''; count = 0; }
        current += (current ? ' ' : '') + chunk; count += (count ? 1 : 0) + size;
      }
    }
    if (current) output.push(current); return output.join('\n');
  }
  const normalized = text.replace(/\r\n|\r/g, '\n');
  return values.preserve === 'true' ? normalized.split('\n').map(line).join('\n') : normalized.split(/\n[ \t]*\n+/).map(block => line(block.replace(/\n/g, ' '))).join('\n\n');
}
export function downloadTime(values: ToolValues): string {
  const sizes: Record<string, number> = { B: 1, KB: 1e3, MB: 1e6, GB: 1e9, TB: 1e12, KiB: 1024, MiB: 1024 ** 2, GiB: 1024 ** 3, TiB: 1024 ** 4 }, speeds: Record<string, number> = { bps: 1, Kbps: 1e3, Mbps: 1e6, Gbps: 1e9 };
  const size = number(values, 'size', 0, 1e6), speed = number(values, 'speed', .000001, 1e9), efficiency = number(values, 'efficiency', .01, 100), sizeUnit = choice(values, 'sizeUnit', Object.keys(sizes)), speedUnit = choice(values, 'speedUnit', Object.keys(speeds));
  const bytes = size * sizes[sizeUnit], rate = speed * speeds[speedUnit] * efficiency / 100, seconds = bytes * 8 / rate;
  if (![bytes, rate, seconds].every(Number.isFinite) || bytes > Number.MAX_SAFE_INTEGER) throw new Error('Size or duration exceeds the supported numeric range.');
  return json({ bytes, effectiveBitsPerSecond: rate, seconds, minutes: seconds / 60, hours: seconds / 3600, assumptions: 'Constant throughput at the selected efficiency; no network measurement is performed.' });
}
