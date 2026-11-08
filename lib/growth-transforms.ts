import { calculateDaily } from './daily-calculations';
import { transformPopular } from './popular-transforms';
import { transformNewConversion } from './conversion-transforms';
import { transformWorkflow } from './workflow-transforms';
import { requestedTools } from './requested-tools';
import { transformRequested } from './requested-tool-transforms';

export type ToolValues = Record<string, string>;
export type GrowthResult = { text: string; summary?: {label:string;value:string}[]; timer?: {mode:'countdown'|'stopwatch';duration:number}; pomodoro?: {focus:number; breakTime:number}; qrPayload?: string; dataTable?: {headers:string[];rows:string[][]}; notice?: string; mediaQuery?: string; palette?: string[]; animation?: { effect: string; duration: number; distance: number; timing: string }; triangle?: { direction: string; width: number; height: number; color: string }; grid?: { template: string; gap: number; items: number }; curve?: { x1: number; y1: number; x2: number; y2: number; timing: string }; flex?: { direction: string; wrap: string; justify: string; align: string; gap: number; items: number }; preview?: { border?: string; outline?: string; outlineOffset?: string; filter?: string; background?: string; boxShadow?: string; borderRadius?: string; textShadow?: string; clipPath?: string } };
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
  if (slug === 'pomodoro-timer') { const focus=number(values,'focus',1,180),breakTime=number(values,'break',1,60); return { text:`Focus: ${focus} minutes\nBreak: ${breakTime} minutes\nCompleted sessions are counted in this browser session.`, pomodoro:{focus:focus*60,breakTime:breakTime*60}, notice:'Keep this tab open. Browser sleep or tab closure can pause the timer.' }; }
  if (slug === 'countdown-timer') { const target=new Date(`${values.date}T${values.time||'00:00'}:00`); if(Number.isNaN(+target)||target.getTime()<=Date.now())throw new Error('Choose a future date and time.');const duration=Math.ceil((target.getTime()-Date.now())/1000);return {text:`Countdown to ${values.event||'your event'}\nTarget (local time): ${target.toLocaleString()}\nShareable setup: ${location.origin}/tools/countdown-timer?date=${encodeURIComponent(values.date)}&time=${encodeURIComponent(values.time||'00:00')}&event=${encodeURIComponent(values.event||'')}`,timer:{mode:'countdown',duration},notice:'Start the countdown below. Keep this tab open; it does not create a background notification.'}; }
  if (slug === 'qr-code-vcard-generator') { const [name,phone,email,org]=text.split(/\r?\n/).map(x=>x.trim());const payload=['BEGIN:VCARD','VERSION:3.0',`FN:${name||''}`,`ORG:${org||''}`,`TEL;TYPE=CELL:${phone||''}`,`EMAIL:${email||''}`,'END:VCARD'].join('\r\n');return {text:payload,qrPayload:payload}; }
  if (requestedTools.some(tool => tool.slug === slug)) return { text: transformRequested(slug, text, values, second) };
  if ([
    'random-number-generator','password-strength-checker','whatsapp-link-generator','mailto-link-generator',
    'email-signature-generator','svg-to-data-uri','csv-to-tsv','markdown-to-plain-text','vtt-to-srt','ean13-barcode-generator',
  ].includes(slug)) return { text: transformPopular(slug, text, values) };
  if ([
    'csv-to-json-schema','markdown-table-to-csv','json-to-markdown-table','csv-to-xml','xml-to-csv','xml-to-html-table',
    'html-table-to-json','ndjson-to-csv','ics-to-csv','vcard-to-csv','geojson-to-csv','json-schema-to-typescript',
    'json-to-php-array','json-to-sql-server','json-to-java-class','json-to-swift-struct','json-to-dart-class','json-to-ruby-hash',
  ].includes(slug)) return { text: transformNewConversion(slug, text) };
  if ([
    'json-to-json-lines','json-lines-to-array','csv-to-yaml','yaml-to-csv','toml-to-yaml','yaml-to-toml',
    'json-to-mongodb-insert','json-to-elasticsearch-bulk','json-to-graphql-types','json-to-prisma-seed','json-to-dynamodb-batch',
    'json-to-bigquery-schema','json-schema-to-pydantic','json-schema-to-sql','openapi-to-postman','openapi-to-markdown',
    'postman-to-curl','har-to-csv','rss-to-csv','opml-to-csv',
  ].includes(slug)) return { text: transformWorkflow(slug, text, values) };
  if ([
    'paint-calculator','flooring-calculator','tile-calculator','concrete-calculator','mulch-calculator',
    'garden-soil-calculator','wallpaper-calculator','fence-post-calculator','gravel-calculator','deck-board-calculator',
    'fuel-cost-calculator','electricity-cost-calculator','sales-tax-calculator','bill-split-calculator',
    'salary-to-hourly-calculator','overtime-pay-calculator','pay-raise-calculator','savings-goal-calculator',
    'grade-needed-calculator','bmi-calculator','cooking-measurement-converter','oven-temperature-converter','fuel-economy-converter',
    'running-pace-calculator','work-hours-calculator','date-add-subtract-calculator','hourly-to-salary-calculator','profit-margin-calculator',
    'break-even-calculator','commission-calculator','vat-calculator','unit-price-calculator','recipe-cost-calculator',
    'average-statistics-calculator','standard-deviation-calculator','percentage-point-calculator','paper-size-converter',
    'payday-calendar-generator','sleep-cycle-calculator','calorie-needs-calculator',
    'mortgage-payment-calculator','mortgage-affordability-calculator','car-loan-payment-calculator','credit-card-payoff-calculator','debt-to-income-calculator',
    'rent-affordability-calculator','emergency-fund-calculator','savings-with-contributions-calculator','simple-interest-calculator','apr-to-apy-calculator',
    'average-speed-calculator','fuel-range-calculator','trip-fuel-cost-calculator','freelance-hourly-rate-calculator','prorated-rent-calculator',
    'test-score-calculator','attendance-percentage-calculator','percentage-error-calculator','inflation-adjusted-value-calculator','loan-amortization-calculator',
    'conversion-rate-calculator','cost-per-acquisition-calculator','return-on-ad-spend-calculator','click-through-rate-calculator','email-campaign-metrics-calculator',
    'net-worth-calculator','monthly-budget-calculator','wedding-budget-calculator','moving-cost-calculator','trip-budget-calculator',
  ].includes(slug)) return { text: calculateDaily(slug, values, text) };
  switch (slug) {
    case 'stopwatch-timer': { const mode=choice(values,'mode',['countdown','stopwatch']) as 'countdown'|'stopwatch',duration=batchInteger(values,'minutes',0,1440)*60+batchInteger(values,'seconds',0,59);if(mode==='countdown'&&(duration<1||duration>86400))throw new Error('Choose a countdown from 1 second to 24 hours.');return {text:mode==='countdown'?'Countdown duration: '+duration+' seconds':'Stopwatch ready. Use the live controls to start, pause and record laps.',timer:{mode,duration},notice:'Keep this page open. The browser timer is not a guaranteed background alarm.'}; }
    case 'age-calculator': return ageCalculation(values);
    case 'discount-calculator': return discountCalculation(values);
    case 'tip-calculator': return tipCalculation(values);
    case 'loan-calculator': return loanCalculation(values);
    case 'compound-interest-calculator': return compoundCalculation(values);
    case 'final-grade-calculator': return finalGradeCalculation(values);
    case 'gpa-calculator': return gpaCalculation(text,values);
    case 'recipe-scaler': return recipeCalculation(text,values);
    case 'openapi-operation-extractor': return {text:openapiOperations(text)};
    case 'har-analyzer': return {text:analyzeHar(text)};
    case 'cache-control-parser': return {text:cacheControl(text)};
    case 'email-header-parser': return {text:emailHeaders(text)};
    case 'curl-command-builder': return {text:curlCommand(text,values)};
    case 'sql-placeholder-converter': return {text:sqlPlaceholders(text,values)};
    case 'json-key-case-converter': return {text:jsonKeyCase(text,values)};
    case 'json-array-sorter': return {text:sortJsonArray(text,values)};
    case 'csv-to-json-lines': return {text:csvJsonLines(text,values)};
    case 'ascii-table-generator': return {text:asciiTable(text,values)};
    case 'fraction-calculator': return {text:fractionMath(values)};
    case 'prime-factorization': return {text:primeFactors(values)};
    case 'matrix-calculator': return {text:matrixMath(text,second,values)};
    case 'quadratic-equation-solver': return {text:quadratic(values)};
    case 'binomial-probability-calculator': return {text:binomial(values)};
    case 'css-pattern-generator': return patternCss(values);
    case 'css-border-generator': return edgeCss(values);
    case 'css-outline-generator': return edgeCss(values,true);
    case 'unix-timestamp-batch-converter': return {text:timestampsBatch(text,values)};
    case 'text-frequency-analyzer': return {text:frequencyAnalysis(text,values)};
    case 'env-diff': return { text: compareEnvFiles(text,second,values) };
    case 'shell-argument-escaper': return { text: shellArguments(text) };
    case 'sms-segment-calculator': return { text: smsSegments(text) };
    case 'css-media-query-generator': return mediaQueryCss(values);
    case 'color-harmony-generator': return harmonyPalette(values);
    case 'date-difference-calculator': return { text: dateDifference(values) };
    case 'business-days-calculator': return { text: businessDays(values) };
    case 'iso-week-calculator': return { text: isoWeek(values) };
    case 'time-zone-converter': return { text: convertTimeZone(values) };
    case 'unit-converter': return { text: unitConversion(values) };
    case 'weighted-average-calculator': return { text: weightedAverage(text,values) };
    case 'gcd-lcm-calculator': return { text: gcdLcm(text) };
    case 'scientific-notation-converter': return { text: scientificNotation(text) };
    case 'roman-numeral-converter': return { text: romanNumerals(text,values) };
    case 'number-to-words': return { text: numberWords(text) };
    case 'random-name-picker': return { text: pickRandom(text,values) };
    case 'random-team-generator': return { text: randomTeams(text,values) };
    case 'csv-merge': return { text: mergeCsvTables(text,second,values) };
    case 'csv-unpivot': return { text: unpivotCsv(text,values) };
    case 'json-array-to-object': return { text: indexJsonArray(text,values) };
    case 'html-image-alt-checker': return { text: imageAltReport(text) };
    case 'html-form-inspector': return { text: inspectHtmlForms(text) };
    case 'css-keyframes-generator': return animationCss(values);
    case 'css-triangle-generator': return triangleCss(values);
    case 'css-filter-generator': return filterCss(values);
    case 'text-find-replace': return replaceLiteral(text, values);
    case 'unicode-normalizer': return { text: text.normalize(choice(values, 'form', ['NFC','NFD','NFKC','NFKD']) as 'NFC' | 'NFD' | 'NFKC' | 'NFKD') };
    case 'invisible-character-detector': return { text: inspectInvisible(text) };
    case 'uuid-validator': return { text: inspectUuids(text) };
    case 'cookie-parser': return { text: parseCookies(text, values) };
    case 'csp-parser': return { text: parseCsp(text) };
    case 'ini-to-json': return { text: iniJson(text) };
    case 'csv-join': return { text: joinCsv(text, second, values) };
    case 'csv-compare': return { text: compareCsv(text, second, values) };
    case 'json-group-by': return { text: groupJson(text, values) };
    case 'json-array-chunker': return { text: chunkJson(text, values) };
    case 'css-selector-tester': return { text: selectorMatches(text, values) };
    case 'xpath-tester': return { text: xpathMatches(text, values) };
    case 'regex-escape': return { text: (RegExp as unknown as { escape?: (value: string) => string }).escape?.(text) ?? escapeRegexLiteral(text) };
    case 'json-array-deduplicator': return { text: deduplicateJson(text, values) };
    case 'ipv6-compressor': return { text: inspectIpv6(text) };
    case 'semver-compare': return { text: semverCompare(text, second) };
    case 'csv-pivot-table': return { text: pivotCsv(text, values) };
    case 'html-heading-extractor': return { text: headingOutline(text) };
    case 'relative-url-resolver': return { text: resolveRelative(text, values) };
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

// Small, local inspection tasks share the existing workbench and input limits.
function discoveryArray(text: string): unknown[] {
  const value: unknown = JSON.parse(text); validateSamples(value);
  if (!Array.isArray(value) || value.length > 10000) throw new Error('Use a JSON array with at most 10,000 items.');
  return value;
}
function inspectInvisible(text: string): string {
  const matches: { codePoint: string; utf16Offset: number; codePointPosition: number; escaped: string }[] = [];
  let offset = 0, position = 0;
  for (const c of text) {
    if (/[\p{Cf}\p{Zl}\p{Zp}\p{Zs}\p{Cc}\u034f\u115f\u1160\u17b4\u17b5\u2800\u3164\ufe00-\ufe0f\uffa0\u{e0100}-\u{e01ef}]/u.test(c) && c !== ' ') {
      if (matches.length >= 10000) throw new Error('More than 10,000 matches. Inspect a smaller text sample.');
      const cp = c.codePointAt(0)!;
      matches.push({codePoint: 'U+' + cp.toString(16).toUpperCase().padStart(4, '0'), utf16Offset: offset, codePointPosition: position, escaped: '\\u{' + cp.toString(16) + '}'});
    }
    offset += c.length; position++;
  }
  return json({ count: matches.length, matches });
}
function inspectUuids(text: string): string {
  const rows = text.trim().split(/\r?\n/); if (rows.length > 10000) throw new Error('Use at most 10,000 UUIDs.');
  return json(rows.map(raw => {
    const input = raw.trim(), validSyntax = /^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i.test(input);
    if (!validSyntax) return { input, validSyntax: false };
    const normalized = input.toLowerCase(), hex = normalized.replace(/-/g, '');
    if (/^0+$/.test(hex) || /^f+$/.test(hex)) return {input, validSyntax, normalized, special: hex[0] === '0' ? 'nil' : 'max'};
    const bits = parseInt(hex[16],16), version = parseInt(hex[12],16);
    const variant = bits < 8 ? 'NCS' : bits < 12 ? 'RFC 9562' : bits < 14 ? 'Microsoft' : 'Reserved';
    const timestamp = version === 7 && variant === 'RFC 9562' ? new Date(parseInt(hex.slice(0,12),16)).toISOString() : undefined;
    return {input, validSyntax, normalized, version, variant, recognizedVersion: variant === 'RFC 9562' && version >= 1 && version <= 8, ...(timestamp ? {timestamp} : {})};
  }));
}
function parseCookies(text: string, values: ToolValues): string {
  const response = choice(values,'mode',['request','response']) === 'response';
  const lines = text.trim().split(/\r?\n/); if (!text.trim() || lines.length > 1000) throw new Error('Paste between 1 and 1,000 cookie lines.');
  const pair = (part: string) => {
    const index = part.indexOf('='); if (index <= 0) throw new Error('Cookie pairs need a non-empty name and an equals sign.');
    const name = part.slice(0,index).trim(), value = part.slice(index+1).trim();
    if (!/^[!#$%&'*+\-.^_`|~\da-z]+$/i.test(name)) throw new Error('Invalid cookie name: ' + name);
    return {name,value};
  };
  if (!response) return json(lines.flatMap(line => line.replace(/^Cookie:\s*/i,'').split(';').filter(x=>x.trim()).map(x=>pair(x.trim()))));
  return json(lines.map(line => {
    const [first,...rest] = line.replace(/^Set-Cookie:\s*/i,'').split(';');
    const attributes = rest.filter(x=>x.trim()).map(raw=>{const i=raw.indexOf('=');return {name:(i<0?raw:raw.slice(0,i)).trim().toLowerCase(),value:i<0?true:raw.slice(i+1).trim()};});
    return {...pair(first.trim()),attributes};
  }));
}
function parseCsp(text: string): string {
  const source=text.trim().replace(/^Content-Security-Policy(?:-Report-Only)?:\s*/i,'');
  if (!source || /[\r\n,]/.test(source)) throw new Error('Paste one CSP policy on a single line.');
  const seen=new Set<string>(); const duplicates: string[] = [], notes: string[] = [];
  const directives: {name:string;sources:string[]}[] = [];
  for (const chunk of source.split(';').filter(c=>c.trim())) {
    const [name,...sources]=chunk.trim().split(/\s+/);const key=name.toLowerCase();
    if (!/^[a-z][a-z\d-]*$/.test(key)) throw new Error('Invalid directive name: '+name);
    if (seen.has(key)) {duplicates.push(key);continue;} seen.add(key);directives.push({name:key,sources});
    if (sources.includes("'none'") && sources.length>1) notes.push(key+": 'none' appears alongside other sources; review its intended behavior.");
    for (const token of ["'unsafe-inline'","'unsafe-eval'",'*']) if (sources.includes(token)) notes.push(key+' contains '+token+'. Review this expression in the complete policy context.');
  }
  if (!directives.length) throw new Error('No directives found.');
  return json({directives,duplicateDirectives:duplicates,notes,scope:'Structural inspection only. First directive occurrences are retained; enforcement and fallback rules are not simulated.'});
}
function iniJson(text: string): string {
  const root: Record<string,unknown> = Object.create(null); let target=root;
  for (const [index,raw] of text.split(/\r?\n/).entries()) {
    const line=raw.trim(); if (!line || /^[;#]/.test(line)) continue;
    const section=/^\[([^\[\]]+)\]$/.exec(line);
    if (section) {const name=section[1].trim(); if(!name || Object.hasOwn(root,name)) throw new Error('Repeated or conflicting INI section at line '+(index+1)); target=Object.create(null) as Record<string,unknown>;root[name]=target;continue;}
    const eq=line.indexOf('='); const key=line.slice(0,eq).trim();
    if(eq<=0 || !key || /^[\[\]]/.test(key)) throw new Error('Expected key=value at line '+(index+1));
    if(Object.hasOwn(target,key)) throw new Error('Duplicate INI key at line '+(index+1)); target[key]=line.slice(eq+1).trim();
  }
  return json(root);
}
function keyedCsv(text: string, key: string) {
  const [headers,...rows]=csvTable(text,',');const column=headers.indexOf(key);if(column<0)throw new Error('Unknown key column: '+key);
  const records=new Map<string,string[]>();
  for(const row of rows){const id=row[column];if(!id.trim()||records.has(id))throw new Error('Keys must be non-empty and unique: '+id);records.set(id,row);}
  return {headers,records};
}
function joinCsv(text: string, second: string, values: ToolValues): string {
  const left=keyedCsv(text,values.leftKey),right=keyedCsv(second,values.rightKey),mode=choice(values,'mode',['inner','left','full']);
  const headers=[...left.headers];for(const h of right.headers){let name=h,n=2;while(headers.includes(name)) name=h+'_'+n++;headers.push(name);}
  const output=[headers],emptyLeft=left.headers.map(()=>''),emptyRight=right.headers.map(()=>'');
  for(const [key,row] of left.records){const match=right.records.get(key);if(match||mode!=='inner')output.push([...row,...(match??emptyRight)]);}
  if(mode==='full')for(const [key,row] of right.records)if(!left.records.has(key))output.push([...emptyLeft,...row]);
  if(output.length*headers.length>100000)throw new Error('Joined output exceeds 100,000 cells.');
  return encodeCsv(output);
}
function compareCsv(text: string, second: string, values: ToolValues): string {
  const a=keyedCsv(text,values.key),b=keyedCsv(second,values.key);
  if(a.headers.length!==b.headers.length||a.headers.some(h=>!b.headers.includes(h)))throw new Error('Tables must contain the same header names.');
  const record=(headers:string[],row:string[])=>Object.fromEntries(headers.map((h,i)=>[h,row[i]]));
  const removed: unknown[]=[],added: unknown[]=[],changed: unknown[]=[]; let unchanged=0;
  for(const [key,row]of a.records){const next=b.records.get(key);if(!next){removed.push(record(a.headers,row));continue;}
    const cells=a.headers.flatMap((column,i)=>{const after=next[b.headers.indexOf(column)];return row[i]===after?[]:[{column,before:row[i],after}];});
    if(cells.length)changed.push({key,changes:cells});else unchanged++;
  }
  for(const [key,row]of b.records)if(!a.records.has(key))added.push(record(b.headers,row));
  return json({unchanged,added,removed,changed});
}
function groupJson(text: string, values: ToolValues): string {
  const groups=new Map<string,{key:unknown;count:number;records:unknown[]}>();
  for(const record of discoveryArray(text)) {const key=extractPointer(record,values.pointer??'');if(key!==null&&typeof key==='object')throw new Error('Group keys must be scalar JSON values.');
    const token=json(key);let group=groups.get(token);if(!group){group={key,count:0,records:[]};groups.set(token,group);}group.count++;group.records.push(record);
  }
  return json([...groups.values()]);
}
function chunkJson(text: string, values: ToolValues): string {
  const rows=discoveryArray(text),size=number(values,'size',1,10000);if(!Number.isInteger(size))throw new Error('Chunk size must be an integer.');
  const chunks:unknown[][]=[];for(let i=0;i<rows.length;i+=size)chunks.push(rows.slice(i,i+size));return json(chunks);
}
function inertFragment(text: string): Element {
  if(typeof document==='undefined')throw new Error('This HTML tool runs in a browser.');
  const template=document.createElement('template');template.innerHTML=text;
  // Keep parsing and all queried nodes inside the template's inert owner document.
  const root=template.content.ownerDocument.createElement('div');root.append(template.content);return root;
}
function describeNode(node: Node) {
  return node.nodeType===1?{type:'element',tag:(node as Element).tagName.toLowerCase(),attributes:Object.fromEntries(Array.from((node as Element).attributes,a=>[a.name,a.value])),text:node.textContent??''}:{type:node.nodeType===2?'attribute':node.nodeType===3?'text':'node',name:node.nodeName,value:node.nodeValue??node.textContent??''};
}
function selectorMatches(text: string, values: ToolValues): string {
  const root=inertFragment(text);
  if(!values.selector?.trim())throw new Error('Enter a CSS selector.');
  const matches=Array.from(root.querySelectorAll(values.selector));
  if(matches.length>1000)throw new Error('More than 1,000 matches. Narrow the selector.');
  return json({count:matches.length,matches:matches.map(describeNode)});
}
function xpathMatches(text: string, values: ToolValues): string {
  const root=inertFragment(text);const context=root;
  if(!values.expression?.trim())throw new Error('Enter a relative XPath expression.');
  const result=new XPathEvaluator().evaluate(values.expression,context,null,XPathResult.ANY_TYPE,null);
  if(result.resultType===XPathResult.STRING_TYPE)return json({type:'string',value:result.stringValue});
  if(result.resultType===XPathResult.NUMBER_TYPE)return json({type:'number',value:Number.isFinite(result.numberValue)?result.numberValue:String(result.numberValue)});
  if(result.resultType===XPathResult.BOOLEAN_TYPE)return json({type:'boolean',value:result.booleanValue});
  const nodes:unknown[]=[];let node:Node|null;while((node=result.iterateNext())){if(nodes.length>=1000)throw new Error('More than 1,000 matches. Narrow the expression.');nodes.push(describeNode(node));}
  return json({type:'nodes',count:nodes.length,matches:nodes});
}
function replaceLiteral(text: string, values: ToolValues): GrowthResult {
  const find=values.find,replacement=values.replacement??'',mode=choice(values,'mode',['first','all']);if(!find)throw new Error('Find text cannot be empty.');
  let count=0,offset=0,index:number;const pieces:string[]=[];let length=0;
  while((index=text.indexOf(find,offset))>=0){const prefix=text.slice(offset,index);length+=prefix.length+replacement.length;if(length+text.length-index-find.length>8*1024*1024)throw new Error('Result would exceed 8 MiB. Use a smaller replacement.');pieces.push(prefix,replacement);count++;offset=index+find.length;if(mode==='first')break;}
  pieces.push(text.slice(offset));return {text:pieces.join(''),notice:`${count} replacement${count===1?'':'s'}.`};
}
export function escapeRegexLiteral(text: string): string {
  // Compatible with RegExp.escape even on browsers lacking the native method.
  let output='';
  for(let i=0;i<text.length;i++){
    const c=text[i],code=text.charCodeAt(i);
    if(i===0&&/[a-z\d]/i.test(c)){output+='\\x'+code.toString(16).padStart(2,'0');continue;}
    if(/[\^$\\.*+?()[\]{}|/]/.test(c)){output+='\\'+c;continue;}
    const controls:Record<string,string>={'\f':'\\f','\n':'\\n','\r':'\\r','\t':'\\t','\v':'\\v'};
    if(controls[c]){output+=controls[c];continue;}
    if(/[\s,\-=<>#&!%:;@~'`"]/.test(c)){output+=code<=255?'\\x'+code.toString(16).padStart(2,'0'):'\\u'+code.toString(16).padStart(4,'0');continue;}
    if(code>=0xd800&&code<=0xdbff&&i+1<text.length&&text.charCodeAt(i+1)>=0xdc00&&text.charCodeAt(i+1)<=0xdfff){output+=c+text[++i];continue;}
    output+=code>=0xd800&&code<=0xdfff?'\\u'+code.toString(16).padStart(4,'0'):c;
  }
  return output;
}
function deduplicateJson(text: string, values: ToolValues): string {
  const rows=discoveryArray(text), keep=choice(values,'keep',['first','last']); const seen=new Set<string>(), result:unknown[]=[];
  const indexes=Array.from({length:rows.length},(_,i)=>i);if(keep==='last')indexes.reverse();
  for(const index of indexes){const record=rows[index],key=extractPointer(record,values.pointer??'');if(key!==null&&typeof key==='object')throw new Error('Deduplication keys must be scalar JSON values.');const token=json(key);if(!seen.has(token)){seen.add(token);result.push(record);}}
  if(keep==='last')result.reverse();return json(result);
}
function inspectIpv6(text: string): string {
  const lines=text.trim().split(/\r?\n/);if(lines.length>1000)throw new Error('Use at most 1,000 addresses.');
  return json(lines.map(raw=>{
    const input=raw.trim();let source=input;
    if(!source||/[\s%/\[\]]/.test(source))throw new Error('Enter an IPv6 address without prefix, zone or brackets: '+input);
    if(source.includes('.')){const index=source.lastIndexOf(':'),tail=source.slice(index+1);const bytes=tail.split('.');
      if(bytes.length!==4||bytes.some(v=>! /^(0|[1-9]\d{0,2})$/.test(v)||Number(v)>255))throw new Error('Invalid embedded IPv4 address.');
      source=source.slice(0,index+1)+((+bytes[0]<<8)+ +bytes[1]).toString(16)+':'+((+bytes[2]<<8)+ +bytes[3]).toString(16);
    }
    const halves=source.split('::');if(halves.length>2)throw new Error('IPv6 can contain only one double colon.');
    const left=halves[0]?halves[0].split(':'):[],right=halves.length===2&&halves[1]?halves[1].split(':'):[];
    const groups=halves.length===2?[...left,...Array(Math.max(0,8-left.length-right.length)).fill('0'),...right]:left;
    if(groups.length!==8||(halves.length===2&&left.length+right.length>=8)||groups.some(g=>! /^[\da-f]{1,4}$/i.test(g)))throw new Error('Invalid IPv6 address: '+input);
    const words=groups.map(g=>parseInt(g,16)),expanded=words.map(n=>n.toString(16).padStart(4,'0')).join(':');
    let start=-1,best=0;for(let i=0;i<8;){if(words[i]!==0){i++;continue;}let end=i;while(end<8&&words[end]===0)end++;if(end-i>best&&end-i>=2){start=i;best=end-i;}i=end;}
    const hex=words.map(n=>n.toString(16)),compressed=start<0?hex.join(':'):hex.slice(0,start).join(':')+'::'+hex.slice(start+best).join(':');
    return {input,expanded,compressed,integer:BigInt('0x'+expanded.replace(/:/g,'')).toString()};
  }));
}
function semverCompare(text:string,second:string):string {
  const parse=(raw:string)=>{const input=raw.trim();if(input.length>10000)throw new Error('Version is too long.');
    const m=/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-([\da-z-]+(?:\.[\da-z-]+)*))?(?:\+([\da-z-]+(?:\.[\da-z-]+)*))?$/i.exec(input);
    if(!m)throw new Error('Enter a strict SemVer version: major.minor.patch with optional prerelease and build.');
    const prerelease=m[4]?.split('.')??[];if(prerelease.some(v=>/^\d+$/.test(v)&&v.length>1&&v[0]==='0'))throw new Error('Numeric prerelease identifiers cannot have leading zeroes.');
    return {input,major:m[1],minor:m[2],patch:m[3],prerelease,build:m[5]?.split('.')??[]};};
  const a=parse(text),b=parse(second);const compare=(x:string,y:string)=>x.length!==y.length?Math.sign(x.length-y.length):x===y?0:x<y?-1:1;
  let precedence=0;for(const k of ['major','minor','patch'] as const){precedence=compare(a[k],b[k]);if(precedence)break;}
  if(!precedence){if(!a.prerelease.length&&b.prerelease.length)precedence=1;else if(a.prerelease.length&&!b.prerelease.length)precedence=-1;
    else for(let i=0;i<Math.max(a.prerelease.length,b.prerelease.length);i++){const x=a.prerelease[i],y=b.prerelease[i];if(x===y)continue;if(x===undefined){precedence=-1;break;}if(y===undefined){precedence=1;break;}
      const nx=/^\d+$/.test(x),ny=/^\d+$/.test(y);precedence=nx&&ny?compare(x,y):nx!==ny?nx?-1:1:x<y?-1:1;break;}
  }
  return json({first:a,second:b,precedence,relationship:precedence<0?'first < second':precedence>0?'first > second':'equal precedence'});
}
function pivotCsv(text:string,values:ToolValues):string {
  const [headers,...rows]=csvTable(text,',');const row=headers.indexOf(values.row),column=headers.indexOf(values.column),value=headers.indexOf(values.value),mode=choice(values,'aggregation',['count','sum','average']);
  if(row<0||column<0||(mode!=='count'&&value<0))throw new Error('Select existing header names.');
  const columns=[...new Set(rows.map(r=>r[column]))];if(columns.length>500)throw new Error('Use at most 500 pivot columns.');
  const buckets=new Map<string,Map<string,{sum:number;count:number}>>();
  for(const record of rows){const numeric=mode==='count'?0:Number(record[value]);if(mode!=='count'&&(!record[value].trim()||!Number.isFinite(numeric)))throw new Error('Numeric aggregations require a finite value in every row.');
    let group=buckets.get(record[row]);if(!group){group=new Map();buckets.set(record[row],group);}const cell=group.get(record[column])??{sum:0,count:0};cell.sum+=numeric;cell.count++;if(!Number.isFinite(cell.sum))throw new Error('Numeric sum exceeds the supported range.');group.set(record[column],cell);
  }
  if((buckets.size+1)*(columns.length+1)>100000)throw new Error('Pivot output exceeds 100,000 cells.');
  let label=values.row;while(columns.includes(label))label+=' (row)';
  return encodeCsv([[label,...columns],...[...buckets].map(([key,group])=>[key,...columns.map(c=>{const cell=group.get(c);return cell?String(mode==='count'?cell.count:mode==='sum'?cell.sum:cell.sum/cell.count):'';})])]);
}
function headingOutline(text:string):string {
  const root=inertFragment(text);const elements=Array.from(root.querySelectorAll('h1,h2,h3,h4,h5,h6'));if(elements.length>1000)throw new Error('Use at most 1,000 headings.');
  const headings=elements.map(el=>({level:Number(el.tagName.slice(1)),text:el.textContent?.trim()??'',id:el.id}));const notes:string[]=[];const h1=headings.filter(h=>h.level===1).length;
  if(h1!==1)notes.push(h1?'Multiple H1 headings are present. Review the intended document structure.':'No H1 heading found in this sample.');
  headings.forEach((h,i)=>{if(!h.text)notes.push('Heading '+(i+1)+' has no text content.');if(i&&h.level>headings[i-1].level+1)notes.push('Skipped heading level before heading '+(i+1)+': H'+headings[i-1].level+' to H'+h.level+'.');});
  return json({headings,notes});
}
function resolveRelative(text:string,values:ToolValues):string {
  const safe=(input:string,base?:URL)=>{const url=new URL(input,base);if(!['http:','https:'].includes(url.protocol)||url.username||url.password)throw new Error('Use HTTP(S) URLs without embedded credentials.');return url;};
  const base=safe(values.base),lines=text.split(/\r?\n/).filter(l=>l.trim());if(lines.length>10000)throw new Error('Use at most 10,000 references.');
  return json(lines.map(raw=>{const reference=raw.trim(),url=safe(reference,base);return {reference,url:url.href,origin:url.origin,crossOrigin:url.origin!==base.origin};}));
}

const DAY_MS = 86400000;
function civilDate(input: string): Date {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input ?? '') || input.slice(0,4) === '0000') throw new Error('Enter a valid Gregorian date as YYYY-MM-DD, year 0001–9999.');
  const date = new Date(input + 'T00:00:00.000Z');
  if (!Number.isFinite(date.getTime()) || date.toISOString().split('T')[0] !== input) throw new Error('Invalid calendar date: ' + input);
  return date;
}
function dateDifference(values: ToolValues): string {
  const start = civilDate(values.start), end = civilDate(values.end), days = (end.getTime()-start.getTime())/DAY_MS;
  return json({start:values.start,end:values.end,signedDays:days,absoluteDays:Math.abs(days),fullWeeks:Math.floor(Math.abs(days)/7),remainingDays:Math.abs(days)%7,convention:'Elapsed calendar days; identical dates have zero difference.'});
}
function businessDays(values: ToolValues): string {
  const start=civilDate(values.start).getTime(),end=civilDate(values.end).getTime();
  const include=choice(values,'includeEnd',['true','false'])==='true', pattern=choice(values,'weekend',['sat-sun','fri-sat','none']);
  const span=(end-start)/DAY_MS+(include?1:0);if(end<start||span>36600)throw new Error('Use an ordered range of at most 36,600 days.');
  const holidays=new Set((values.holidays??'').split(/[,\s]+/).filter(Boolean).map(d=>civilDate(d).getTime()));
  const weekends=pattern==='none'?[]:pattern==='sat-sun'?[0,6]:[5,6];let working=0,weekend=0,holiday=0;
  for(let time=start;time<start+span*DAY_MS;time+=DAY_MS){if(weekends.includes(new Date(time).getUTCDay()))weekend++;else if(holidays.has(time))holiday++;else working++;}
  return json({start:values.start,end:values.end,endIncluded:include,calendarDays:span,workingDays:working,excludedWeekendDays:weekend,excludedWeekdayHolidays:holiday});
}
function isoWeek(values: ToolValues): string {
  const date=civilDate(values.date),weekday=date.getUTCDay()||7;
  const thursday=new Date(date.getTime()+(4-weekday)*DAY_MS),year=thursday.getUTCFullYear();
  const january4=new Date(0);january4.setUTCFullYear(year,0,4);january4.setUTCHours(0,0,0,0);
  const firstMonday=january4.getTime()-((january4.getUTCDay()||7)-1)*DAY_MS;
  const monday=date.getTime()-(weekday-1)*DAY_MS,week=Math.floor((monday-firstMonday)/DAY_MS/7)+1;
  return json({date:values.date,isoWeekYear:year,week,weekday,isoWeekDate:`${String(year).padStart(4,'0')}-W${String(week).padStart(2,'0')}-${weekday}`,monday:new Date(monday).toISOString().split('T')[0],sunday:new Date(monday+6*DAY_MS).toISOString().split('T')[0]});
}
function convertTimeZone(values: ToolValues): string {
  const input=values.instant?.trim()??'';
  const match=/^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,3}))?(Z|[+-]\d{2}:\d{2})$/.exec(input);
  if(!match)throw new Error('Use an ISO timestamp with seconds and Z or ±HH:MM offset.');civilDate(match[1]);
  if(+match[2]>23||+match[3]>59||+match[4]>59||(match[6]!=='Z'&&(+match[6].slice(1,3)>23||+match[6].slice(4)>59)))throw new Error('Invalid time or UTC offset.');
  const date=new Date(input);if(!Number.isFinite(date.getTime()))throw new Error('Invalid instant.');
  const formatter=new Intl.DateTimeFormat('en-GB',{timeZone:values.zone,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23',timeZoneName:'longOffset'});
  if(!values.zone?.trim())throw new Error('Enter a destination IANA time zone.');
  const parts=formatter.formatToParts(date),part=(type:Intl.DateTimeFormatPartTypes)=>parts.find(p=>p.type===type)?.value;
  return json({utc:date.toISOString(),timeZone:formatter.resolvedOptions().timeZone,local:formatter.format(date),localDate:`${part('year')}-${part('month')}-${part('day')}`,localTime:`${part('hour')}:${part('minute')}:${part('second')}`,utcOffset:part('timeZoneName'),milliseconds:date.getUTCMilliseconds(),dataSource:'Browser Intl time-zone data'});
}
function unitConversion(values: ToolValues): string {
  const units:Record<string,{dimension:string;factor:number}>={mm:{dimension:'length',factor:.001},cm:{dimension:'length',factor:.01},m:{dimension:'length',factor:1},km:{dimension:'length',factor:1000},in:{dimension:'length',factor:.0254},ft:{dimension:'length',factor:.3048},yd:{dimension:'length',factor:.9144},mi:{dimension:'length',factor:1609.344},g:{dimension:'mass',factor:.001},kg:{dimension:'mass',factor:1},oz:{dimension:'mass',factor:.028349523125},lb:{dimension:'mass',factor:.45359237},ml:{dimension:'volume',factor:.001},l:{dimension:'volume',factor:1},usgal:{dimension:'volume',factor:3.785411784},ukgal:{dimension:'volume',factor:4.54609},c:{dimension:'temperature',factor:1},f:{dimension:'temperature',factor:1},k:{dimension:'temperature',factor:1}};
  const from=Object.hasOwn(units,values.from)?units[values.from]:null,to=Object.hasOwn(units,values.to)?units[values.to]:null;
  if(!from||!to||from.dimension!==to.dimension)throw new Error('Choose two units of the same measurement type.');
  const value=number(values,'value',-1e12,1e12);let result:number;
  if(from.dimension==='temperature'){const kelvin=values.from==='c'?value+273.15:values.from==='f'?(value+459.67)*5/9:value;if(kelvin<0)throw new Error('Temperature cannot be below absolute zero.');const normalized=Math.max(0,kelvin);result=values.to==='c'?normalized-273.15:values.to==='f'?normalized*9/5-459.67:normalized;}
  else{if(value<0)throw new Error('Use nonnegative length, mass or volume.');result=value*from.factor/to.factor;}
  if(values.from===values.to)result=value;
  return json({input:value,from:values.from,to:values.to,dimension:from.dimension,result:Number(result.toPrecision(12)),precision:'Up to 12 significant digits; floating-point arithmetic.'});
}
function wholeInteger(input: string): bigint {
  if(!/^-?(0|[1-9]\d{0,99})$/.test(input??''))throw new Error('Use a whole decimal integer with at most 100 digits and no leading zeroes.');return BigInt(input);
}
function integerGcd(a: bigint,b: bigint):bigint {a=a<BigInt(0)?-a:a;b=b<BigInt(0)?-b:b;while(b){const next=a%b;a=b;b=next;}return a;}
function weightedAverage(text: string, values: ToolValues): string {
  const [headers,...rows]=csvTable(text,','); const valueIndex=headers.indexOf(values.valueField),weightIndex=headers.indexOf(values.weightField);
  if(valueIndex<0||weightIndex<0||!rows.length)throw new Error('Select existing value and weight columns and include at least one data row.');
  const numeric=(raw:string)=>{if(!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(raw.trim()))throw new Error('Use plain finite numeric cells without grouping separators.');const n=Number(raw);if(!Number.isFinite(n))throw new Error('Numeric values must be finite.');return n;};
  let weightSum=0,weightedSum=0,zeroWeightRows=0;
  for(const row of rows){const value=numeric(row[valueIndex]),weight=numeric(row[weightIndex]);if(weight<0)throw new Error('Weights must be nonnegative.');if(weight===0){zeroWeightRows++;continue;}weightSum+=weight;weightedSum+=value*weight;if(!Number.isFinite(weightSum)||!Number.isFinite(weightedSum))throw new Error('Weighted totals exceed the supported numeric range.');}
  if(weightSum===0)throw new Error('At least one weight must be positive.');
  const average=weightedSum/weightSum;if(!Number.isFinite(average))throw new Error('Weighted mean exceeds the supported range.');
  const display=(value:number)=>Number(value.toPrecision(12));
  return json({weightedAverage:display(average),totalWeight:display(weightSum),weightedSum:display(weightedSum),contributingRows:rows.length-zeroWeightRows,zeroWeightRows,precision:'Floating-point arithmetic, displayed to 12 significant digits.'});
}
function gcdLcm(text:string):string {
  const inputs=text.trim().split(/[,\s]+/);if(inputs.length<2||inputs.length>100)throw new Error('Enter between 2 and 100 integers.');
  const nums=inputs.map(wholeInteger).map(n=>n<BigInt(0)?-n:n);const gcd=nums.reduce(integerGcd),lcm=nums.reduce((a,b)=>a===BigInt(0)||b===BigInt(0)?BigInt(0):(a/integerGcd(a,b))*b);
  return json({gcd:gcd.toString(),lcm:lcm.toString(),count:nums.length});
}
function scientificNotation(text:string):string {
  const input=text.trim();if(input.length>20000)throw new Error('Use at most 20,000 characters.');
  const match=/^([+-]?)(?:(\d+)(?:\.(\d*))?|\.(\d+))(?:[eE]([+-]?\d{1,6}))?$/.exec(input);if(!match)throw new Error('Enter a decimal number or scientific notation without grouping separators.');
  const exponent=Number(match[5]??0);if(Math.abs(exponent)>10000)throw new Error('Exponent magnitude must not exceed 10,000.');
  const integer=match[2]??'',fraction=match[3]??match[4]??'',all=integer+fraction,first=all.search(/[1-9]/);
  if(first<0)return json({scientific:'0e+0',decimal:'0'});
  const digits=all.slice(first).replace(/0+$/,''),power=exponent+integer.length-first-1,sign=match[1]==='-'?'-':'';
  const position=power+1;let decimal=position<=0?'0.'+'0'.repeat(-position)+digits:position>=digits.length?digits+'0'.repeat(position-digits.length):digits.slice(0,position)+'.'+digits.slice(position);
  if(decimal.length+sign.length>20000)throw new Error('Expanded output exceeds 20,000 characters.');decimal=sign+decimal;
  return json({scientific:sign+digits[0]+(digits.length>1?'.'+digits.slice(1):'')+'e'+(power>=0?'+':'')+power,decimal});
}
const ROMAN_PAIRS:[number,string][]=[[1000,'M'],[900,'CM'],[500,'D'],[400,'CD'],[100,'C'],[90,'XC'],[50,'L'],[40,'XL'],[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']];
function romanEncode(input:number):string {let remaining=input,output='';for(const [value,symbol]of ROMAN_PAIRS)while(remaining>=value){remaining-=value;output+=symbol;}return output;}
function romanNumerals(text:string,values:ToolValues):string {
  const input=text.trim(),direction=choice(values,'direction',['roman','decimal']);let decimal:number,roman:string;
  if(direction==='roman'){if(!/^[1-9]\d{0,3}$/.test(input)||+input>3999)throw new Error('Use an integer from 1 to 3999.');decimal=+input;roman=romanEncode(decimal);}
  else{roman=input.toUpperCase();if(!/^[IVXLCDM]{1,15}$/.test(roman))throw new Error('Use a canonical Roman numeral from I to MMMCMXCIX.');decimal=0;let remaining=roman;for(const [value,symbol]of ROMAN_PAIRS)while(remaining.startsWith(symbol)){decimal+=value;remaining=remaining.slice(symbol.length);}if(remaining||decimal<1||decimal>3999||romanEncode(decimal)!==roman)throw new Error('Noncanonical Roman numeral.');}
  return json({decimal,roman});
}
function numberWords(text:string):string {
  const input=text.trim();if(!/^-?(0|[1-9]\d{0,17})$/.test(input))throw new Error('Use a signed whole number with at most 18 digits.');let n=BigInt(input);if(n===BigInt(0))return 'zero';const sign=n<BigInt(0)?'minus ':'';if(n<BigInt(0))n=-n;
  const small=['','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'],tens=['','','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'],scales=['','thousand','million','billion','trillion','quadrillion'];
  const group=(value:number)=>{const words:string[]=[];if(value>=100){words.push(small[Math.floor(value/100)]+' hundred');value%=100;}if(value>=20)words.push(tens[Math.floor(value/10)]+(value%10?'-'+small[value%10]:''));else if(value)words.push(small[value]);return words.join(' ');};
  const words:string[]=[];let index=0;while(n){const value=Number(n%BigInt(1000));if(value)words.unshift(group(value)+(scales[index]?' '+scales[index]:''));n/=BigInt(1000);index++;}return sign+words.join(' ');
}
function randomIndex(bound:number):number {
  const limit=Math.floor(4294967296/bound)*bound,buffer=new Uint32Array(1);let value:number;
  do{crypto.getRandomValues(buffer);value=buffer[0];}while(value>=limit);return value%bound;
}
function shuffledRoster(text:string,unique:boolean):string[] {
  let rows=text.split(/\r?\n/).map(s=>s.trim()).filter(Boolean);if(!rows.length||rows.length>10000)throw new Error('Use between 1 and 10,000 nonblank entries.');
  if(unique)rows=[...new Set(rows)];else if(new Set(rows).size!==rows.length)throw new Error('Participant labels must be unique. Add a distinguishing label for shared names.');
  for(let i=rows.length-1;i>0;i--){const j=randomIndex(i+1);[rows[i],rows[j]]=[rows[j],rows[i]];}return rows;
}
function pickRandom(text:string,values:ToolValues):string {
  const rows=shuffledRoster(text,true),count=number(values,'count',1,rows.length);if(!Number.isInteger(count))throw new Error('Draw count must be an integer.');return json({availableEntries:rows.length,selected:rows.slice(0,count)});
}
function randomTeams(text:string,values:ToolValues):string {
  const rows=shuffledRoster(text,false),count=number(values,'teams',1,rows.length);if(!Number.isInteger(count))throw new Error('Team count must be an integer.');const teams=Array.from({length:count},(_,i)=>({team:i+1,members:[] as string[]}));rows.forEach((name,i)=>teams[i%count].members.push(name));return json(teams);
}
function mergeCsvTables(text:string,second:string,values:ToolValues):string {
  const [a,...left]=csvTable(text,','),[b,...right]=csvTable(second,','),mode=choice(values,'schema',['strict','union']);
  if(mode==='strict'&&(a.length!==b.length||a.some(h=>!b.includes(h))))throw new Error('Strict mode requires the same set of headers.');
  const headers=[...a,...b.filter(h=>!a.includes(h))];if((left.length+right.length+1)*headers.length>100000)throw new Error('Merged output exceeds 100,000 cells.');
  const align=(row:string[],source:string[])=>headers.map(h=>{const i=source.indexOf(h);return i<0?'':row[i];});return encodeCsv([headers,...left.map(r=>align(r,a)),...right.map(r=>align(r,b))]);
}
function unpivotCsv(text:string,values:ToolValues):string {
  const [headers,...rows]=csvTable(text,','); const selected:unknown=JSON.parse(values.ids??'');
  const ids=Array.isArray(selected)&&selected.length===0?[]:selectedColumns(values.ids,headers),variables=headers.map((_,i)=>i).filter(i=>!ids.includes(i));
  if(!variables.length)throw new Error('Leave at least one value column to unpivot.');const names=[...ids.map(i=>headers[i]),values.variable,values.valueName];
  if(names.some(n=>!n?.trim())||new Set(names).size!==names.length)throw new Error('Output headers must be non-empty and unique.');
  if((rows.length*variables.length+1)*names.length>100000)throw new Error('Unpivot output exceeds 100,000 cells.');
  return encodeCsv([names,...rows.flatMap(row=>variables.map(i=>[...ids.map(id=>row[id]),headers[i],row[i]]))]);
}
function indexJsonArray(text:string,values:ToolValues):string {
  const records=discoveryArray(text),mode=choice(values,'duplicates',['error','first','last']),result:Record<string,unknown>=Object.create(null);
  for(const record of records){const raw=extractPointer(record,values.pointer??'');if(typeof raw!=='string'&&!(typeof raw==='number'&&Number.isSafeInteger(raw)))throw new Error('Index keys must be strings or safe integers.');const key=String(raw);
    if(Object.hasOwn(result,key)){if(mode==='error')throw new Error('Duplicate destination key: '+key);if(mode==='first')continue;}result[key]=record;
  }return json(result);
}
function imageAltReport(text:string):string {
  const elements=Array.from(inertFragment(text).querySelectorAll('img'));if(elements.length>1000)throw new Error('Use at most 1,000 images.');
  const images=elements.map((img,index)=>{const alt=img.getAttribute('alt');return {index,src:img.getAttribute('src'),srcset:img.getAttribute('srcset'),alt,status:alt===null?'missing':alt===''?'empty':!alt.trim()?'whitespace-only':'provided',loading:img.getAttribute('loading'),width:img.getAttribute('width'),height:img.getAttribute('height')};});
  return json({total:images.length,missing:images.filter(i=>i.status==='missing').length,empty:images.filter(i=>i.status==='empty').length,whitespaceOnly:images.filter(i=>i.status==='whitespace-only').length,images,scope:'Markup review only; empty alt may be appropriate for decorative images.'});
}
function inspectHtmlForms(text:string):string {
  const root=inertFragment(text),forms=Array.from(root.querySelectorAll('form'));const controls=Array.from(root.querySelectorAll<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement|HTMLButtonElement>('input,select,textarea,button'));
  if(forms.length>100||controls.length>2000)throw new Error('Use at most 100 forms and 2,000 controls.');
  const firstId=new Map<string,Element>();root.querySelectorAll('[id]').forEach(element=>{if(element.id&&!firstId.has(element.id))firstId.set(element.id,element);});
  // Native .form does not resolve external ownership in every detached inert tree.
  const owner=(control:typeof controls[number]):HTMLFormElement|null=>{
    if(control.hasAttribute('form')){const target=firstId.get(control.getAttribute('form')??'');return target?.tagName==='FORM'?target as HTMLFormElement:null;}
    return control.closest('form');
  };
  const labelable='button,input:not([type="hidden"]),meter,output,progress,select,textarea';
  const controlLabels=new Map<Element,HTMLLabelElement[]>();const labels=Array.from(root.querySelectorAll('label'));
  if(labels.length>2000)throw new Error('Use at most 2,000 labels.');
  for(const label of labels){const target=label.hasAttribute('for')?firstId.get(label.htmlFor):label.querySelector(labelable);if(target?.matches(labelable)){const associated=controlLabels.get(target)??[];associated.push(label);controlLabels.set(target,associated);}}
  const labelText=(label:HTMLLabelElement)=>{const copy=label.cloneNode(true) as HTMLElement;copy.querySelectorAll('input,select,textarea,button,script,style,template').forEach(node=>node.remove());return copy.textContent?.trim()??'';};
  const describe=(control:typeof controls[number])=>({tag:control.tagName.toLowerCase(),type:control.type,name:control.getAttribute('name'),id:control.id||null,required:'required' in control?control.required:false,disabled:control.matches(':disabled'),labels:(controlLabels.get(control)??[]).map(labelText),...(control.tagName==='SELECT'?{multiple:(control as HTMLSelectElement).multiple,options:Array.from((control as HTMLSelectElement).options,o=>({text:o.text,disabled:o.disabled,selected:o.selected}))}:{})});
  return json({forms:forms.map(form=>({id:form.id||null,method:form.method.toUpperCase(),action:form.getAttribute('action'),enctype:form.enctype,controls:controls.filter(c=>owner(c)===form).map(describe)})),unassociatedControls:controls.filter(c=>!owner(c)).map(describe),scope:'Static inventory. No field values are included and no submission is performed.'});
}
function animationCss(values:ToolValues):GrowthResult {
  const effect=choice(values,'effect',['fade','slide','pulse','spin']),duration=number(values,'duration',.1,30),distance=number(values,'distance',0,200),timing=choice(values,'timing',['linear','ease','ease-in','ease-out','ease-in-out']);
  const frames:Record<string,string>={fade:'from { opacity: 0.15; }\n  to { opacity: 1; }',slide:`from { transform: translateX(-${distance}px); }\n  to { transform: translateX(${distance}px); }`,pulse:'from { transform: scale(0.8); }\n  to { transform: scale(1.1); }',spin:'from { transform: rotate(0deg); }\n  to { transform: rotate(360deg); }'};
  return {text:`.animated-element {\n  animation: utilixio-${effect} ${duration}s ${timing} infinite alternate;\n}\n\n@keyframes utilixio-${effect} {\n  ${frames[effect]}\n}\n\n@media (prefers-reduced-motion: reduce) {\n  .animated-element { animation: none; }\n}`,animation:{effect,duration,distance,timing}};
}
function triangleCss(values:ToolValues):GrowthResult {
  const direction=choice(values,'direction',['up','down','left','right']),width=number(values,'width',1,300),height=number(values,'height',1,300),fill=color(values,'color');
  const borders=direction==='up'?`border-left: ${width/2}px solid transparent;\n  border-right: ${width/2}px solid transparent;\n  border-bottom: ${height}px solid ${fill};`:direction==='down'?`border-left: ${width/2}px solid transparent;\n  border-right: ${width/2}px solid transparent;\n  border-top: ${height}px solid ${fill};`:direction==='left'?`border-top: ${height/2}px solid transparent;\n  border-bottom: ${height/2}px solid transparent;\n  border-right: ${width}px solid ${fill};`:`border-top: ${height/2}px solid transparent;\n  border-bottom: ${height/2}px solid transparent;\n  border-left: ${width}px solid ${fill};`;
  return {text:'.triangle {\n  width: 0;\n  height: 0;\n  '+borders+'\n}',triangle:{direction,width,height,color:fill}};
}
function filterCss(values:ToolValues):GrowthResult {
  const blur=number(values,'blur',0,20),brightness=number(values,'brightness',0,200),contrast=number(values,'contrast',0,200),saturate=number(values,'saturate',0,300),gray=number(values,'grayscale',0,100),hue=number(values,'hue',0,360);
  const filter=`blur(${blur}px) brightness(${brightness}%) contrast(${contrast}%) saturate(${saturate}%) grayscale(${gray}%) hue-rotate(${hue}deg)`;
  return {text:`.filtered-element {\n  filter: ${filter};\n}`,preview:{filter,background:'linear-gradient(135deg, #ff5252, #ffca28 30%, #26c6da 65%, #7e57c2)'}};
}

function compareEnvFiles(text: string, second: string, values: ToolValues): string {
  const parse=(source:string)=>{const map=new Map<string,string>();for(const [index,raw]of source.split(/\r\n?|\n/).entries()){
    const line=raw.trim();if(!line||line.startsWith('#'))continue;const match=/^(?:export\s+)?([A-Za-z_]\w*)\s*=(.*)$/.exec(line);if(!match)throw new Error('Invalid assignment at line '+(index+1)+'.');const key=match[1],value=match[2].trim();if(map.has(key))throw new Error('Duplicate environment key: '+key);let parsed:string;
    if(value.startsWith('"')){let end=-1;for(let i=1;i<value.length;i++){if(value[i]==='\\'){i++;continue;}if(value[i]==='"'){end=i;break;}}if(end<0||value.slice(end+1).trim()&&!value.slice(end+1).trim().startsWith('#'))throw new Error('Malformed quoted value at line '+(index+1)+'.');try{parsed=JSON.parse(value.slice(0,end+1));}catch{throw new Error('Use valid JSON escapes inside double quotes at line '+(index+1)+'.');}}
    else if(value.startsWith("'")){const end=value.indexOf("'",1);if(end<0||value.slice(end+1).trim()&&!value.slice(end+1).trim().startsWith('#'))throw new Error('Malformed single-quoted value at line '+(index+1)+'.');parsed=value.slice(1,end);}
    else parsed=value.split('#')[0].trim();map.set(key,parsed);if(map.size>10000)throw new Error('Use at most 10,000 environment variables.');
  }return map;};
  const before=parse(text),after=parse(second),show=values.showValues==='true',display=(value:string)=>show?value:'<redacted>',added:unknown[]=[],removed:unknown[]=[],changed:unknown[]=[];let unchanged=0;
  for(const key of [...new Set([...before.keys(),...after.keys()])].sort()){if(!before.has(key))added.push({key,value:display(after.get(key)!)});else if(!after.has(key))removed.push({key,value:display(before.get(key)!)});else if(before.get(key)!==after.get(key))changed.push({key,before:display(before.get(key)!),after:display(after.get(key)!)});else unchanged++;}
  return json({unchanged,added,removed,changed,valuesRedacted:!show});
}
function shellArguments(text:string):string {
  const args:unknown=JSON.parse(text);if(!Array.isArray(args)||args.length>10000||args.some(v=>typeof v!=='string'||v.includes('\0')))throw new Error('Use a JSON array of at most 10,000 strings without NUL characters.');return args.map(arg=>"'"+arg.replace(/'/g,"'\"'\"'")+"'").join(' ');
}
function smsSegments(text:string):string {
  const basic=new Set(Array.from('@£$¥èéùìòÇ\nØø\rÅåΔ_ΦΓΛΩΠΨΣΘΞÆæßÉ !"#¤%&\'()*+,-./0123456789:;<=>?¡ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÑÜ§¿abcdefghijklmnopqrstuvwxyzäöñüà')),extended=new Set(Array.from('^{}\\[~]|€\f'));
  let gsm=true,gsmUnits=0,characters=0;const triggers=new Set<string>();for(const c of text){characters++;if(basic.has(c))gsmUnits++;else if(extended.has(c))gsmUnits+=2;else{gsm=false;if(triggers.size<10)triggers.add(c);}}
  const units=gsm?gsmUnits:text.length,single=gsm?160:70,concatenated=gsm?153:67;let segments=units?1:0,used=units;
  if(units>single){segments=1;used=0;for(const c of text){const width=gsm?(extended.has(c)?2:1):c.length;if(used+width>concatenated){segments++;used=0;}used+=width;}}
  return json({encoding:gsm?'GSM-7':'Unicode (UTF-16 units)',characters,units,segments,unitsPerSegment:units>single?concatenated:single,remainingInLastSegment:(units>single?concatenated:single)-used,unicodeTriggers:[...triggers],scope:'Typical SMS capacities; no messages are sent and carrier/sender limits can differ.'});
}
function mediaQueryCss(values:ToolValues):GrowthResult {
  const min=number(values,'minWidth',0,10000),max=number(values,'maxWidth',0,10000);if(!Number.isInteger(min)||!Number.isInteger(max)||max&&min>max)throw new Error('Use whole pixel widths with maximum at least the minimum.');
  const orientation=choice(values,'orientation',['any','portrait','landscape']),scheme=choice(values,'scheme',['any','light','dark']),motion=choice(values,'motion',['any','reduce']);const features=['screen'];if(min)features.push(`(min-width: ${min}px)`);if(max)features.push(`(max-width: ${max}px)`);if(orientation!=='any')features.push(`(orientation: ${orientation})`);if(scheme!=='any')features.push(`(prefers-color-scheme: ${scheme})`);if(motion==='reduce')features.push('(prefers-reduced-motion: reduce)');const query=features.join(' and ');
  return {text:`@media ${query} {\n  .responsive-element {\n    /* Add styles for this condition. */\n  }\n}`,mediaQuery:query};
}
function harmonyPalette(values:ToolValues):GrowthResult {
  const base=color(values,'base'),mode=choice(values,'harmony',['complementary','analogous','triadic','split','tetradic']),r=parseInt(base.slice(1,3),16)/255,g=parseInt(base.slice(3,5),16)/255,b=parseInt(base.slice(5,7),16)/255,max=Math.max(r,g,b),min=Math.min(r,g,b),delta=max-min,light=(max+min)/2,saturation=delta?delta/(1-Math.abs(2*light-1)):0;
  let hue=delta?max===r?((g-b)/delta)%6:max===g?(b-r)/delta+2:(r-g)/delta+4:0;hue=(hue*60+360)%360;
  const offsets:Record<string,number[]>={complementary:[0,180],analogous:[-30,0,30],triadic:[0,120,240],split:[0,150,210],tetradic:[0,90,180,270]};
  const palette=offsets[mode].map(offset=>{if(offset===0)return base.toLowerCase();const h=(hue+offset+360)%360,c=(1-Math.abs(2*light-1))*saturation,x=c*(1-Math.abs((h/60)%2-1)),m=light-c/2;const rgb=h<60?[c,x,0]:h<120?[x,c,0]:h<180?[0,c,x]:h<240?[0,x,c]:h<300?[x,0,c]:[c,0,x];return '#'+rgb.map(v=>Math.round((v+m)*255).toString(16).padStart(2,'0')).join('');});
  return {text:':root {\n'+palette.map((hex,index)=>`  --color-${index+1}: ${hex};`).join('\n')+'\n}',palette};
}

// Local analysis and calculation utilities; no network or command execution.
function batchInteger(values: ToolValues,key:string,min:number,max:number){const n=number(values,key,min,max);if(!Number.isInteger(n))throw new Error(`${key}: use a whole number.`);return n;}
function batchObject(text:string){const value:unknown=JSON.parse(text);if(!plainObject(value))throw new Error('Provide a JSON object.');return value;}
function openapiOperations(text:string){
  const spec=batchObject(text);if(!(typeof spec.openapi==='string'&&/^3\./.test(spec.openapi))&&spec.swagger!=='2.0')throw new Error('Provide an OpenAPI 3.x or Swagger 2.0 JSON document.');
  if(!plainObject(spec.paths))throw new Error('The document needs a paths object.');
  const operations:unknown[]=[],unresolved:string[]=[];
  for(const [path,item] of Object.entries(spec.paths)){if(path.startsWith('x-'))continue;if(!path.startsWith('/')||!plainObject(item))throw new Error('Invalid path item.');if(item.$ref)unresolved.push(path);for(const method of ['get','put','post','delete','options','head','patch','trace']){const op=item[method];if(op===undefined)continue;if(!plainObject(op))throw new Error('Invalid operation object.');operations.push({method:method.toUpperCase(),path,operationId:op.operationId??null,summary:op.summary??'',tags:op.tags??[],deprecated:op.deprecated===true});}}
  return json({operationCount:operations.length,operations,unresolvedPathReferences:unresolved,note:'References are not resolved; callbacks and webhooks are not included.'});
}
function analyzeHar(text:string){
  const root=batchObject(text);if(!plainObject(root.log)||!Array.isArray(root.log.entries)||root.log.entries.length>10000)throw new Error('Provide a HAR log with at most 10,000 entries.');
  const entries=root.log.entries.map((entry:unknown,index:number)=>{if(!plainObject(entry)||!plainObject(entry.request)||!plainObject(entry.response)||typeof entry.request.url!=='string')throw new Error(`Invalid HAR entry ${index+1}.`);let url:URL;try{url=new URL(entry.request.url);}catch{throw new Error(`Invalid URL in entry ${index+1}.`);}const time=typeof entry.time==='number'&&Number.isFinite(entry.time)&&entry.time>=0?entry.time:null;const bytes=typeof entry.response.bodySize==='number'&&Number.isFinite(entry.response.bodySize)&&entry.response.bodySize>=0?entry.response.bodySize:null;return {index:index+1,method:String(entry.request.method??''),url:url.origin==='null'?url.protocol:url.origin+url.pathname,host:url.host||url.protocol,status:entry.response.status??null,timeMs:time,bodyBytes:bytes};});
  const hosts:Record<string,number>=Object.create(null);for(const e of entries){const host=e.host;hosts[host]=(hosts[host]??0)+1;}
  return json({requestCount:entries.length,failedRequests:entries.filter(e=>typeof e.status==='number'&&(e.status===0||e.status>=400)).length,knownBodyBytes:entries.reduce((n,e)=>n+(e.bodyBytes??0),0),unknownBodySizes:entries.filter(e=>e.bodyBytes===null).length,hosts,slowest:entries.filter(e=>e.timeMs!==null).sort((a,b)=>b.timeMs!-a.timeMs!).slice(0,20),note:'URLs omit credentials, queries and fragments. Headers and bodies are not included. Times overlap and are not page-load time; bodySize is not total wire transfer.'});
}
function cacheControl(text:string){
  const source=text.trim().replace(/^cache-control\s*:\s*/i,'');if(!source||/[\r\n]/.test(source))throw new Error('Provide one Cache-Control field value.');
  const parts:string[]=[];let current='',quoted=false,escaped=false;for(const c of source){if(escaped){current+=c;escaped=false;continue;}if(quoted&&c==='\\'){current+=c;escaped=true;continue;}if(c==='"')quoted=!quoted;if(c===','&&!quoted){parts.push(current);current='';}else current+=c;}if(quoted||escaped)throw new Error('Unclosed quoted directive.');parts.push(current);
  const directives=parts.map(part=>{const m=/^\s*([!#$%&'*+.^_`|~\w-]+)(?:\s*=\s*("(?:[^"\\]|\\.)*"|[!#$%&'*+.^_`|~\w-]+))?\s*$/.exec(part);if(!m)throw new Error('Malformed cache directive.');return {name:m[1].toLowerCase(),value:m[2]?.startsWith('"')?m[2].slice(1,-1).replace(/\\(.)/g,'$1'):m[2]??null};});
  const warnings:string[]=[],seen=new Set<string>();for(const d of directives){if(seen.has(d.name))warnings.push('Duplicate directive: '+d.name);seen.add(d.name);if(['max-age','s-maxage','stale-while-revalidate','stale-if-error','min-fresh'].includes(d.name)&&!/^\d+$/.test(d.value??''))warnings.push('Expected nonnegative integer seconds: '+d.name);}
  if(seen.has('public')&&seen.has('private'))warnings.push('Both public and private are present.');
  return json({directives,warnings,interpretation:{storage:seen.has('no-store')?'Storage prohibited by this directive':'Storage eligibility depends on the response and other directives',revalidation:seen.has('no-cache')?'Validate before reuse; no-cache does not mean no-store':'Check freshness and other directives'},scope:'Syntax and directive hints, not a complete cache-policy evaluator.'});
}
function emailHeaders(text:string){
  const block=text.split(/\r?\n\r?\n/)[0],lines=block.split(/\r?\n/),headers:{name:string;value:string}[]=[];
  if(block.length>200000)throw new Error('Use at most 200,000 header characters.');
  for(const line of lines){if(!line)continue;if(/^[ \t]/.test(line)){if(!headers.length)throw new Error('A continuation needs a previous header.');headers[headers.length-1].value+=' '+line.trim();}else{const m=/^([!-9;-~]+):[ \t]*(.*)$/.exec(line);if(!m)throw new Error('Malformed email header line.');headers.push({name:m[1],value:m[2]});}}
  if(!headers.length)throw new Error('Provide raw email headers.');const received=headers.filter(h=>h.name.toLowerCase()==='received');
  return json({headerCount:headers.length,headers,receivedNewestFirst:received.map(h=>h.value),note:'Unfolded raw field values only. Encoded words are not decoded. Received and authentication claims are unverified; this is not a sender-authentication check.'});
}
function curlCommand(text:string,values:ToolValues){
  const method=choice(values,'method',['GET','POST','PUT','PATCH','DELETE','HEAD']),target=values.url??'';let url:URL;try{url=new URL(target);}catch{throw new Error('Provide an absolute HTTP(S) URL.');}if(!['http:','https:'].includes(url.protocol)||url.username||url.password||/[\x00-\x20\x7f]/.test(target))throw new Error('Use an HTTP(S) URL without credentials or controls.');
  const headers=batchObject(values.headers??'{}');const quote=(s:string)=>"'"+s.replace(/'/g,"'\"'\"'")+"'";const args=['curl','--globoff','--request',quote(method),'--url',quote(target)];
  for(const [name,value] of Object.entries(headers)){if(!/^[!#$%&'*+.^_`|~\w-]+$/.test(name)||typeof value!=='string'||/[\r\n\0]/.test(value))throw new Error('Headers need token names and single-line string values.');args.push('--header',quote(name+': '+value));}
  if(text){if(method==='HEAD')throw new Error('HEAD requests cannot include a body here.');if(text.includes('\0'))throw new Error('Shell arguments cannot contain NUL.');args.push('--data-raw',quote(text));}if(method==='HEAD')args.push('--head');return args.join(' ');
}
function sqlPlaceholders(text:string,values:ToolValues){
  const direction=choice(values,'direction',['to-postgres','to-question']);let result='',i=0,count=0;const order:number[]=[];
  while(i<text.length){const c=text[i];
    if(text.startsWith('--',i)){const end=text.indexOf('\n',i);if(end<0){result+=text.slice(i);break;}result+=text.slice(i,end);i=end;continue;}
    if(text.startsWith('/*',i)){let depth=1,j=i+2;while(j<text.length&&depth){if(text.startsWith('/*',j)){depth++;j+=2;}else if(text.startsWith('*/',j)){depth--;j+=2;}else j++;}if(depth)throw new Error('Unclosed block comment.');result+=text.slice(i,j);i=j;continue;}
    if(c==='\''||c==='"'||c==='`'){const start=i++,quote=c;let closed=false;const backslash=quote==='\''&&start>0&&/[eE]/.test(text[start-1])&&(start<2||!/[\w$]/.test(text[start-2]));while(i<text.length){if(backslash&&text[i]==='\\'){i+=2;continue;}if(text[i]===quote){if(text[i+1]===quote){i+=2;continue;}i++;closed=true;break;}i++;}if(!closed)throw new Error('Unclosed SQL quote.');result+=text.slice(start,i);continue;}
    if(c==='$'){const m=/^\$(?:[A-Za-z_][A-Za-z0-9_]*)?\$/.exec(text.slice(i));if(m){const end=text.indexOf(m[0],i+m[0].length);if(end<0)throw new Error('Unclosed dollar quote.');const j=end+m[0].length;result+=text.slice(i,j);i=j;continue;}const bind=/^\$([1-9]\d*)\b/.exec(text.slice(i));if(bind&&direction==='to-question'&&(i===0||!/[\w$]/.test(text[i-1]))){const n=Number(bind[1]);if(!Number.isSafeInteger(n))throw new Error('Parameter index is too large.');order.push(n);result+='?';i+=bind[0].length;count++;continue;}}
    if(c==='?'&&direction==='to-postgres'){if(text[i+1]==='|'||text[i+1]==='&')throw new Error('PostgreSQL JSON operators are not supported as source placeholders.');result+='$'+(++count);i++;continue;}result+=c;i++;
  }
  return json({sql:result,placeholderCount:count,...(direction==='to-question'?{parameterOrder:order}:{}),note:'Only lexical placeholders are rewritten. Review parameter order. Standalone ? JSON operators cannot be distinguished from placeholders; provide a prepared-statement template, not arbitrary SQL.'});
}
function jsonKeyCase(text:string,values:ToolValues){
  const style=choice(values,'style',['camel','snake','kebab','pascal']);let nodes=0;
  function visit(v:unknown,depth=0):unknown{if(depth>32||++nodes>50000)throw new Error('Use at most 32 levels and 50,000 values.');if(Array.isArray(v))return v.map(n=>visit(n,depth+1));if(!plainObject(v))return v;const result:Record<string,unknown>=Object.create(null);for(const [key,value] of Object.entries(v)){const words=key.replace(/([A-Z]+)([A-Z][a-z])/g,'$1 $2').replace(/([a-z0-9])([A-Z])/g,'$1 $2').split(/[^\p{L}\p{N}]+/u).filter(Boolean).map(s=>s.toLowerCase());if(!words.length)throw new Error('A key becomes empty after conversion.');const cap=(s:string)=>s[0].toUpperCase()+s.slice(1);const name=style==='snake'?words.join('_'):style==='kebab'?words.join('-'):style==='pascal'?words.map(cap).join(''):words[0]+words.slice(1).map(cap).join('');if(Object.hasOwn(result,name))throw new Error('Key collision after conversion: '+name);result[name]=visit(value,depth+1);}return result;}
  return json(visit(JSON.parse(text)));
}
function sortJsonArray(text:string,values:ToolValues){
  const list:unknown=JSON.parse(text);if(!Array.isArray(list)||list.length>10000||!list.every(plainObject))throw new Error('Use an array of at most 10,000 objects.');const key=values.key??'',type=choice(values,'type',['number','string']),direction=choice(values,'order',['asc','desc']);if(!key)throw new Error('Specify an exact top-level property name.');
  for(const row of list){const v=row[key];if(v!==undefined&&v!==null&&(typeof v!==type||(type==='number'&&!Number.isFinite(v))))throw new Error('Sort values must match the selected type; missing/null values sort last.');}
  return json(list.map((v,i)=>({v,i})).sort((a,b)=>{const x=a.v[key],y=b.v[key];if(x==null||y==null)return x==null&&y==null?a.i-b.i:x==null?1:-1;const order=x<y?-1:x>y?1:0;return order*(direction==='asc'?1:-1)||a.i-b.i;}).map(r=>r.v));
}
function csvJsonLines(text:string,values:ToolValues){const [headers,...rows]=parseDelimited(text,values.delimiter??',');if(!headers?.length||headers.some(h=>!h)||new Set(headers).size!==headers.length)throw new Error('Provide unique nonempty headers.');if(!rows.length||rows.length*headers.length>50000)throw new Error('Use 1–50,000 data cells.');return rows.map((r,i)=>{if(r.length!==headers.length)throw new Error(`Row ${i+2} has an inconsistent cell count.`);return JSON.stringify(Object.fromEntries(headers.map((h,j)=>[h,r[j]])));}).join('\n')+'\n';}
function asciiTable(text:string,values:ToolValues){const rows=parseDelimited(text,values.delimiter??',');if(!rows.length||rows.length>200||rows[0].length>20||rows.some(r=>r.length!==rows[0].length))throw new Error('Use a rectangular table within 200 rows and 20 columns.');const clean=rows.map(r=>r.map(c=>c.replace(/[\r\n\t]/g,' ').replace(/[\x00-\x1f\x7f]/g,'')));if(clean.some(r=>r.some(c=>c.length>80)))throw new Error('Limit each cell to 80 UTF-16 units.');const widths=clean[0].map((_,i)=>Math.max(...clean.map(r=>Array.from(r[i]).length)));const line='+'+widths.map(w=>'-'.repeat(w+2)).join('+')+'+';return [line,...clean.flatMap((r,i)=>['| '+r.map((c,j)=>c+' '.repeat(widths[j]-Array.from(c).length)).join(' | ')+' |',...(i===0||i===clean.length-1?[line]:[])] )].join('\n');}
function fractionMath(values:ToolValues){
  const parse=(raw:string)=>{if(!/^[+-]?\d{1,50}(?:\/[+-]?\d{1,50})?$/.test(raw?.trim()??''))throw new Error('Use integer fractions such as -3/4, with at most 50 digits per integer.');const [a,b='1']=raw.trim().split('/');let n=BigInt(a),d=BigInt(b);if(d===BigInt(0))throw new Error('Denominator cannot be zero.');if(d<BigInt(0)){n=-n;d=-d;}return [n,d];};const [a,b]=parse(values.left),[c,d]=parse(values.right),op=choice(values,'operation',['add','subtract','multiply','divide']);if(op==='divide'&&c===BigInt(0))throw new Error('Cannot divide by zero.');let n=op==='add'?a*d+c*b:op==='subtract'?a*d-c*b:op==='multiply'?a*c:a*d;let den=op==='multiply'?b*d:op==='divide'?b*c:b*d;if(den<BigInt(0)){n=-n;den=-den;}let x=n<BigInt(0)?-n:n,y=den;while(y){[x,y]=[y,x%y];}n/=x;den/=x;return json({numerator:String(n),denominator:String(den),fraction:den===BigInt(1)?String(n):n+'/'+den,approximateDecimal:Number(n)/Number(den)});
}
function primeFactors(values:ToolValues){let n=batchInteger(values,'integer',2,1000000000000);const original=n,factors:{prime:number;exponent:number}[]=[];for(let d=2;d*d<=n;d=d===2?3:d+2){if(n%d===0){let exponent=0;while(n%d===0){n/=d;exponent++;}factors.push({prime:d,exponent});}}if(n>1)factors.push({prime:n,exponent:1});return json({integer:original,isPrime:factors.length===1&&factors[0].exponent===1,factors,expression:factors.map(f=>f.prime+(f.exponent>1?'^'+f.exponent:'')).join(' × ')});}
function matrixMath(text:string,second:string,values:ToolValues){
  const parse=(source:string)=>{const a:unknown=JSON.parse(source);if(!Array.isArray(a)||!a.length||a.length>10||!a.every(r=>Array.isArray(r)&&r.length>0&&r.length<=10&&r.length===a[0].length&&r.every(n=>typeof n==='number'&&Number.isFinite(n)&&Math.abs(n)<=1e100)))throw new Error('Use a rectangular numeric matrix within 10 × 10; magnitudes at most 1e100.');return a as number[][];};const a=parse(text),op=choice(values,'operation',['transpose','multiply','determinant']);let result:unknown;
  if(op==='transpose')result=a[0].map((_,i)=>a.map(row=>row[i]));else if(op==='multiply'){const b=parse(second);if(a[0].length!==b.length)throw new Error('Columns in A must equal rows in B.');result=a.map(row=>b[0].map((_,j)=>row.reduce((n,v,k)=>n+v*b[k][j],0)));}else{if(a.length!==a[0].length)throw new Error('Determinant requires a square matrix.');const m=a.map(r=>[...r]);let det=1;for(let i=0;i<m.length;i++){let pivot=i;for(let j=i+1;j<m.length;j++)if(Math.abs(m[j][i])>Math.abs(m[pivot][i]))pivot=j;if(m[pivot][i]===0){det=0;break;}if(pivot!==i){[m[pivot],m[i]]=[m[i],m[pivot]];det=-det;}det*=m[i][i];for(let j=i+1;j<m.length;j++){const ratio=m[j][i]/m[i][i];for(let k=i+1;k<m.length;k++)m[j][k]-=ratio*m[i][k];}}result=det;}
  const finite=(v:unknown):boolean=>Array.isArray(v)?v.every(finite):typeof v==='number'&&Number.isFinite(v);if(!finite(result))throw new Error('Calculation overflowed; use smaller values.');return json({operation:op,result,note:'Floating-point arithmetic; near-singular matrices can lose precision.'});
}
function quadratic(values:ToolValues){const raw=['a','b','c'].map(k=>number(values,k,-1e150,1e150));const scale=Math.max(...raw.map(Math.abs));if(scale===0)return json({type:'identity',roots:'Every number satisfies 0 = 0.'});const [a,b,c]=raw.map(n=>n/scale);if(raw[0]!==0&&a===0)throw new Error('Coefficient scale is too extreme.');if(a===0)return b===0?json({type:'inconsistent',roots:[]}):json({type:'linear',roots:[-c/b]});const disc=b*b-4*a*c;if(disc<0)return json({type:'complex',real:-b/(2*a),imaginaryMagnitude:Math.sqrt(-disc)/(2*Math.abs(a)),note:'Roots are real ± imaginaryMagnitude × i.'});if(disc===0)return json({type:'repeated',roots:[-b/(2*a)]});const q=-0.5*(b+(b>=0?1:-1)*Math.sqrt(disc)),roots=[q/a,c/q].sort((x,y)=>x-y);if(!roots.every(Number.isFinite))throw new Error('Roots overflow; use less extreme coefficients.');return json({type:'real',roots,note:'Floating-point approximation using a cancellation-resistant formula.'});}
function binomial(values:ToolValues){const n=batchInteger(values,'trials',0,1000),k=batchInteger(values,'successes',0,n),p=number(values,'probability',0,1),mode=choice(values,'mode',['exactly','at-most','at-least']);let probability=0;for(let i=0;i<=n;i++){if(mode==='exactly'&&i!==k||mode==='at-most'&&i>k||mode==='at-least'&&i<k)continue;let term:number;if(p===0)term=i===0?1:0;else if(p===1)term=i===n?1:0;else{let log=0;for(let j=1;j<=Math.min(i,n-i);j++)log+=Math.log(n-j+1)-Math.log(j);log+=i*Math.log(p)+(n-i)*Math.log1p(-p);term=Math.exp(log);}probability+=term;}probability=Math.max(0,Math.min(1,probability));return json({trials:n,successes:k,mode,probability,percent:probability*100,expectedSuccesses:n*p,standardDeviation:Math.sqrt(n*p*(1-p)),assumption:'Independent trials with the same success probability; floating-point results.'});}
function patternCss(values:ToolValues):GrowthResult {const type=choice(values,'pattern',['dots','stripes','checker']),size=number(values,'size',4,200),base=color(values,'base'),ink=color(values,'ink');const image=type==='dots'?`radial-gradient(${ink} 1.5px, transparent 1.5px)`:type==='stripes'?`repeating-linear-gradient(45deg, ${ink} 0, ${ink} ${size/2}px, transparent ${size/2}px, transparent ${size}px)`:`conic-gradient(${ink} 25%, transparent 0 50%, ${ink} 0 75%, transparent 0)`;const background=`${image} 0 0 / ${size}px ${size}px ${base}`;return {text:'.pattern {\n  background: '+background+';\n}',preview:{background}};}
function edgeCss(values:ToolValues,outline=false):GrowthResult {const width=number(values,'width',0,40),style=choice(values,'style',['solid','dashed','dotted','double']),ink=color(values,'color'),radius=number(values,'radius',0,100),edge=`${width}px ${style} ${ink}`;if(outline){const offset=number(values,'offset',-20,40);return {text:`.outlined {\n  outline: ${edge};\n  outline-offset: ${offset}px;\n  border-radius: ${radius}px;\n}`,preview:{outline:edge,outlineOffset:offset+'px',borderRadius:radius+'px'}};}return {text:`.bordered {\n  border: ${edge};\n  border-radius: ${radius}px;\n}`,preview:{border:edge,borderRadius:radius+'px'}};}
function timestampsBatch(text:string,values:ToolValues){const unit=choice(values,'unit',['seconds','milliseconds']),lines=text.trim().split(/\r?\n/);if(!text.trim()||lines.length>1000)throw new Error('Provide 1–1,000 timestamps, one per line.');return json(lines.map((line,i)=>{if(!/^[+-]?\d+$/.test(line.trim()))throw new Error(`Line ${i+1}: expected an integer timestamp.`);const value=Number(line.trim()),ms=value*(unit==='seconds'?1000:1);if(!Number.isSafeInteger(value)||!Number.isSafeInteger(ms))throw new Error(`Line ${i+1}: timestamp exceeds exact integer precision.`);const date=new Date(ms);if(!Number.isFinite(date.getTime()))throw new Error(`Line ${i+1}: timestamp is outside the date range.`);return {input:line.trim(),unit,iso:date.toISOString()};}));}
function frequencyAnalysis(text:string,values:ToolValues){const mode=choice(values,'mode',['words','characters']),sensitive=choice(values,'caseSensitive',['true','false'])==='true',limit=batchInteger(values,'limit',1,500);const source=(sensitive?text:text.toLowerCase()).normalize('NFC');const tokens=mode==='words'?source.match(/[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)*/gu)??[]:Array.from(source).filter(s=>!/^\s$/u.test(s));const counts=new Map<string,number>();for(const t of tokens)counts.set(t,(counts.get(t)??0)+1);return json({total:tokens.length,unique:counts.size,frequencies:[...counts].sort((a,b)=>b[1]-a[1]||(a[0]<b[0]?-1:a[0]>b[0]?1:0)).slice(0,limit).map(([token,count])=>({token,count,percent:count/tokens.length*100})),note:mode==='words'?'Unicode letter/number tokens; languages without word spaces may need a specialist tokenizer.':'Counts Unicode code points, not visual grapheme clusters; whitespace omitted.'});}

function publicReport(summary:{label:string;value:string}[],headers?:string[],rows?:string[][],notice?:string):GrowthResult{
  const table=headers&&rows?{headers,rows}:undefined;const line=(r:string[])=>r.map(v=>/[",\n]/.test(v)?'"'+v.replace(/"/g,'""')+'"':v).join(',');
  return {summary,...(table?{dataTable:table}:{}),...(notice?{notice}:{}),text:summary.map(v=>v.label+': '+v.value).join('\n')+(notice?'\n\n'+notice:'')+(table?'\n\n'+[headers!,...rows!].map(line).join('\n'):'')};
}
function moneyInput(values:ToolValues,key:string,min=0,max=1e9){const n=number(values,key,min,max);if(Math.abs(n*100-Math.round(n*100))>0.001)throw new Error(key+': use at most two decimal places.');return Math.round(n*100);}
function currencyFormat(values:ToolValues){const code=choice(values,'currency',['USD','EUR','GBP','UAH']);return (n:number)=>new Intl.NumberFormat('en',{style:'currency',currency:code,maximumFractionDigits:2}).format(n);}
function ageCalculation(values:ToolValues):GrowthResult{
  const parse=(s:string)=>{if(!/^\d{4}-\d{2}-\d{2}$/.test(s??''))throw new Error('Use a complete calendar date.');const d=new Date(s+'T00:00:00Z');if(!Number.isFinite(d.getTime())||d.toISOString().slice(0,10)!==s||d.getUTCFullYear()<1900||d.getUTCFullYear()>2199)throw new Error('Use a valid date from 1900 through 2199.');return d;};
  const now=new Date(),today=[now.getFullYear(),String(now.getMonth()+1).padStart(2,'0'),String(now.getDate()).padStart(2,'0')].join('-'),birth=parse(values.birth),asOf=parse(values.asOf?.trim()||today);if(birth>asOf)throw new Error('Birth date must not be later than the reference date.');
  const anniversary=(year:number)=>new Date(Date.UTC(year,birth.getUTCMonth(),Math.min(birth.getUTCDate(),new Date(Date.UTC(year,birth.getUTCMonth()+1,0)).getUTCDate())));
  let years=asOf.getUTCFullYear()-birth.getUTCFullYear();if(anniversary(asOf.getUTCFullYear())>asOf)years--;
  let months=0,base=anniversary(birth.getUTCFullYear()+years);for(let m=1;m<=11;m++){const y=birth.getUTCFullYear()+years+Math.floor((birth.getUTCMonth()+m)/12),month=(birth.getUTCMonth()+m)%12,d=new Date(Date.UTC(y,month,Math.min(birth.getUTCDate(),new Date(Date.UTC(y,month+1,0)).getUTCDate())));if(d>asOf)break;months=m;base=d;}
  const days=Math.round((+asOf-+base)/86400000),next=anniversary(asOf.getUTCFullYear())>=asOf?anniversary(asOf.getUTCFullYear()):anniversary(asOf.getUTCFullYear()+1),until=Math.round((+next-+asOf)/86400000);
  return publicReport([{label:'Age',value:`${years} years, ${months} months, ${days} days`},{label:'Total days',value:String(Math.round((+asOf-+birth)/86400000))},{label:'Next birthday',value:next.toISOString().slice(0,10)},{label:'Days until birthday',value:String(until)}],undefined,undefined,'As of '+asOf.toISOString().slice(0,10)+'. Calendar dates only. February 29 birthdays are treated as February 28 in non-leap years; this is not a legal-age determination.');
}
function discountCalculation(values:ToolValues):GrowthResult{const cents=moneyInput(values,'price',0.01),rate=number(values,'discount',0,100),format=currencyFormat(values),saved=Math.round(cents*rate/100);return publicReport([{label:'Sale price',value:format((cents-saved)/100)},{label:'You save',value:format(saved/100)},{label:'Original price',value:format(cents/100)},{label:'Discount',value:rate+'%'}],undefined,undefined,'One percentage discount, rounded to the nearest minor currency unit. Tax, delivery and additional promotions are excluded.');}
function tipCalculation(values:ToolValues):GrowthResult{const bill=moneyInput(values,'bill',0.01),rate=number(values,'tip',0,100),people=batchInteger(values,'people',1,100),tip=Math.round(bill*rate/100),total=bill+tip,base=Math.floor(total/people),extra=total%people,format=currencyFormat(values),rows=Array.from({length:people},(_,i)=>[String(i+1),format((base+(i<extra?1:0))/100)]);return publicReport([{label:'Total with tip',value:format(total/100)},{label:'Tip amount',value:format(tip/100)},{label:'Average per person',value:format(total/100/people)},{label:'People',value:String(people)}],['Person','Share'],rows,'The split allocates remaining cents to the first people so all shares add up exactly to the total.');}
function loanCalculation(values:ToolValues):GrowthResult{
  const principal=moneyInput(values,'principal',0.01)/100,annual=number(values,'annualRate',0,100),months=batchInteger(values,'months',1,600),rate=annual/1200,format=currencyFormat(values),payment=rate===0?principal/months:principal*rate/-Math.expm1(-months*Math.log1p(rate));let balance=principal,total=0,interestTotal=0;const rows:string[][]=[];
  for(let m=1;m<=months;m++){const interest=balance*rate,paid=m===months?balance+interest:payment,repaid=paid-interest;balance=Math.max(0,balance-repaid);total+=paid;interestTotal+=interest;rows.push([String(m),format(paid),format(interest),format(repaid),format(balance)]);}
  return publicReport([{label:'Monthly payment',value:format(payment)},{label:'Total interest',value:format(interestTotal)},{label:'Total repaid',value:format(total)},{label:'Number of payments',value:String(months)}],['Month','Payment','Interest','Principal','Balance'],rows,'Fixed nominal annual interest divided by 12; monthly payments at period end. Estimates exclude fees, taxes, insurance, variable rates and lender-specific rounding.');
}
function compoundCalculation(values:ToolValues):GrowthResult{const initial=moneyInput(values,'initial')/100,monthly=moneyInput(values,'monthly')/100,rate=number(values,'annualRate',0,50)/1200,years=batchInteger(values,'years',1,50),format=currencyFormat(values);let balance=initial;const rows:string[][]=[];for(let m=1;m<=years*12;m++){balance=balance*(1+rate)+monthly;if(!Number.isFinite(balance)||balance>1e15)throw new Error('Projection exceeds the supported amount range.');if(m%12===0){const contributed=initial+monthly*m;rows.push([String(m/12),format(contributed),format(balance-contributed),format(balance)]);}}const contributed=initial+monthly*years*12;return publicReport([{label:'Projected balance',value:format(balance)},{label:'Total contributions',value:format(contributed)},{label:'Projected growth',value:format(balance-contributed)},{label:'Years',value:String(years)}],['Year','Contributions','Growth','Balance'],rows,'Constant nominal annual rate compounded monthly, with deposits at the end of each month. This illustration excludes taxes, fees, inflation and market changes; it is not a return forecast.');}
function finalGradeCalculation(values:ToolValues):GrowthResult{const current=number(values,'current',0,100),target=number(values,'target',0,100),weight=number(values,'weight',0.01,100)/100,required=(target-current*(1-weight))/weight,minimum=Math.max(0,Math.ceil((required-1e-9)*100)/100),status=required>100?'Above 100% would be required':required<=0?'Target met even with 0% on the final':'Target is achievable';return publicReport([{label:'Required final exam grade',value:minimum.toFixed(2)+'%'},{label:'Target overall grade',value:target+'%'},{label:'Final exam weight',value:(weight*100).toFixed(2)+'%'},{label:'Status',value:status}],undefined,undefined,'Current grade must cover only coursework outside the final exam. The required result is rounded upward to 0.01 percentage points; extra credit and school-specific rounding are not modeled.');}
function gpaCalculation(text:string,values:ToolValues):GrowthResult{
  const [header,...rows]=parseDelimited(text,',');if(!header||header.length!==3||header.map(s=>s.trim().toLowerCase()).join(',')!=='course,credits,grade'||!rows.length||rows.length>100)throw new Error('Use Course, Credits, Grade columns and 1–100 courses.');const plus=choice(values,'scale',['4','4.3']),grades:Record<string,number>={'A+':plus==='4.3'?4.3:4,A:4,'A-':3.7,'B+':3.3,B:3,'B-':2.7,'C+':2.3,C:2,'C-':1.7,'D+':1.3,D:1,'D-':.7,F:0};let credits=0,points=0;const table=rows.map((r,i)=>{if(r.length!==3||!r[0].trim())throw new Error(`Course ${i+1}: provide a name, credits and grade.`);const credit=Number(r[1]),label=r[2].trim().toUpperCase(),grade=Object.hasOwn(grades,label)?grades[label]:/^\d+(?:\.\d+)?$/.test(label)?Number(label):NaN;if(!r[1].trim()||!Number.isFinite(credit)||credit<=0||credit>100||!Number.isFinite(grade)||grade<0||grade>Number(plus))throw new Error(`Course ${i+1}: check positive credits and a supported letter or numeric grade.`);credits+=credit;points+=credit*grade;return [r[0],String(credit),label,grade.toFixed(2),(credit*grade).toFixed(3)];});return publicReport([{label:'Weighted GPA',value:(points/credits).toFixed(3)},{label:'Total credits',value:String(Number(credits.toFixed(3)))},{label:'Quality points',value:points.toFixed(3)},{label:'Courses',value:String(rows.length)}],['Course','Credits','Grade','Grade points','Quality points'],table,'Common letter mapping with A = 4.0; A+ follows the selected scale. Include only GPA-bearing courses. This does not apply institution-specific repeat, pass/fail or rounding policies.');
}
function recipeCalculation(text:string,values:ToolValues):GrowthResult{const original=number(values,'originalServings',.1,1000),target=number(values,'targetServings',.1,1000),factor=target/original,[header,...rows]=parseDelimited(text,',');if(!header||header.map(s=>s.trim().toLowerCase()).join(',')!=='amount,unit,ingredient'||!rows.length||rows.length>100)throw new Error('Use Amount, Unit, Ingredient columns with 1–100 ingredients.');const tidy=(n:number)=>String(Number(n.toFixed(4)));const table=rows.map((r,i)=>{if(r.length!==3||!r[2].trim())throw new Error(`Ingredient ${i+1}: provide three cells and an ingredient name.`);const amount=r[0].trim();if(!amount||/^to taste$/i.test(amount))return [amount,r[1],r[2]];let n:number;if(/^\d+(?:\.\d+)?$/.test(amount))n=Number(amount);else{const m=/^(?:(\d+)\s+)?(\d+)\/(\d+)$/.exec(amount);if(!m||Number(m[3])===0)throw new Error(`Ingredient ${i+1}: use a decimal, fraction, mixed number or "to taste".`);n=Number(m[1]??0)+Number(m[2])/Number(m[3]);}if(!Number.isFinite(n)||n>1e6||n*factor>1e9)throw new Error('Ingredient quantity is too large.');return [tidy(n*factor),r[1],r[2]];});return publicReport([{label:'Scale factor',value:tidy(factor)+'×'},{label:'Original servings',value:tidy(original)},{label:'New servings',value:tidy(target)},{label:'Ingredients',value:String(rows.length)}],['Amount','Unit','Ingredient'],table,'Units stay unchanged; quantities are rounded to four decimals. Adjust seasonings by taste. Cooking time, temperature, pan size and food-safety requirements are not scaled automatically.');}
