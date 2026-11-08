type Row = string[];
const fail = (message: string): never => { throw new Error(message); };

function parseCsv(source: string, delimiter = ','): Row[] {
  const rows: Row[] = []; let row: Row = [], cell = '', quoted = false, closed = false;
  source = source.replace(/^\uFEFF/, '');
  for (let i = 0; i < source.length; i++) {
    const c = source[i];
    if (quoted) {
      if (c === '"' && source[i + 1] === '"') { cell += '"'; i++; }
      else if (c === '"') { quoted = false; closed = true; }
      else cell += c;
    } else if (c === '"' && !cell && !closed) quoted = true;
    else if (c === delimiter) { row.push(cell); cell = ''; closed = false; }
    else if (c === '\n' || c === '\r') { if (c === '\r' && source[i + 1] === '\n') i++; row.push(cell); rows.push(row); row = []; cell = ''; closed = false; }
    else { if (closed || c === '"') fail(`Invalid CSV quoting near character ${i + 1}.`); cell += c; }
  }
  if (quoted) fail('A quoted CSV field is not closed.');
  if (cell || row.length || closed) { row.push(cell); rows.push(row); }
  while (rows.length && rows.at(-1)!.every(value => value === '')) rows.pop();
  return rows;
}
function rectangular(rows: Row[]): { headers: string[]; body: Row[] } {
  if (!rows.length || !rows[0].length) fail('Include a header row and at least one column.');
  const headers = rows[0];
  if (headers.some(header => !header.trim()) || new Set(headers).size !== headers.length) fail('Column headings must be unique and non-empty.');
  const body = rows.slice(1);
  body.forEach((row, i) => { if (row.length !== headers.length) fail(`Row ${i + 2} has ${row.length} cells; expected ${headers.length}.`); });
  if (!body.length) fail('Include at least one data row after the headings.');
  return { headers, body };
}
function csvEscape(value: unknown): string {
  const text = value == null ? '' : typeof value === 'object' ? JSON.stringify(value) : String(value);
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}
function toCsv(headers: string[], rows: unknown[][]): string { return [headers, ...rows].map(row => row.map(csvEscape).join(',')).join('\r\n'); }
function records(value: unknown): Record<string, unknown>[] {
  const rows = Array.isArray(value) ? value : [value];
  if (!rows.length || rows.some(item => !item || typeof item !== 'object' || Array.isArray(item))) fail('Provide a non-empty JSON object or an array of JSON objects.');
  return rows as Record<string, unknown>[];
}
function columns(rows: Record<string, unknown>[]): string[] {
  const headers = [...new Set(rows.flatMap(row => Object.keys(row)))];
  if (!headers.length) fail('The JSON records do not contain any fields.');
  return headers;
}
function markdownCell(value: unknown): string {
  const text = value == null ? '' : typeof value === 'object' ? JSON.stringify(value) : String(value);
  return text.replace(/\\/g, '\\\\').replace(/\|/g, '\\|').replace(/\r?\n/g, '<br>');
}
function markdownToCsv(text: string): string {
  const lines = text.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
  const tableLines = lines.filter(line => line.includes('|'));
  if (tableLines.length < 2) fail('Paste a Markdown pipe table with a header and separator row.');
  const split = (line: string) => {
    let value = line.trim(); if (value.startsWith('|')) value = value.slice(1); if (value.endsWith('|') && !value.endsWith('\\|')) value = value.slice(0, -1);
    const cells: string[] = []; let cell = '', escaped = false;
    for (const char of value) { if (escaped) { cell += char; escaped = false; } else if (char === '\\') escaped = true; else if (char === '|') { cells.push(cell.trim()); cell = ''; } else cell += char; }
    cells.push(cell.trim()); return cells;
  };
  const headers = split(tableLines[0]);
  if (headers.some(header => !header)) fail('Markdown headings must not be empty.');
  const separator = split(tableLines[1]);
  if (separator.length !== headers.length || separator.some(cell => !/^:?-{3,}:?$/.test(cell))) fail('The second table row must be a Markdown separator row.');
  const body = tableLines.slice(2).map((line, i) => { const cells = split(line); if (cells.length !== headers.length) fail(`Markdown row ${i + 3} has a different number of cells than the header.`); return cells; });
  if (!body.length) fail('Add at least one data row to the Markdown table.');
  return toCsv(headers, body);
}
function escapeXml(value: unknown): string { const text=String(value??'');if(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\ufffe\uffff]/.test(text))fail('XML cannot contain these control characters. Remove them from the CSV first.');return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;'); }
function xmlRows(text: string): { headers: string[]; rows: string[][] } {
  if (/<!DOCTYPE|<!ENTITY/i.test(text)) fail('DTD and entity declarations are not accepted.');
  const doc = new DOMParser().parseFromString(text, 'application/xml');
  if (doc.querySelector('parsererror') || !doc.documentElement) fail('Enter a well-formed XML document.');
  const root = doc.documentElement;
  const children = [...root.children];
  const repeated = children.length > 0 && children.every(child => child.localName === children[0].localName);
  const records = repeated ? children : [root];
  const cellsFor = (element: Element) => [...element.children].map(cell => ({ key: cell.localName, value: cell.textContent ?? '' }));
  const first = cellsFor(records[0]);
  if (!first.length) fail('No XML record fields were found. Use repeated record elements containing child fields.');
  const headers = [...new Set(first.map(cell => cell.key))];
  const rows = records.map(record => {
    const cells = cellsFor(record); const values = new Map<string, string>();
    for (const cell of cells) values.set(cell.key, cell.value);
    // Accept the reversible <field name="..."> format emitted by CSV to XML.
    if (cells.length && cells.every(cell => cell.key === 'field')) {
      const named = [...record.children].map(cell => [cell.getAttribute('name') ?? '', cell.textContent ?? ''] as const);
      const names = [...new Set(named.map(([name]) => name))];
      return { named, names };
    }
    return { values, names: headers };
  });
  const allHeaders = [...new Set(rows.flatMap(record => record.names))];
  return { headers: allHeaders, rows: rows.map(record => 'named' in record && record.named ? allHeaders.map(header => record.named!.find(([name]) => name === header)?.[1] ?? '') : allHeaders.map(header => record.values.get(header) ?? '')) };
}
function csvToXml(text: string): string {
  const { headers, body } = rectangular(parseCsv(text));
  return `<?xml version="1.0" encoding="UTF-8"?>\n<rows>\n${body.map(row => `  <row>\n${headers.map((header, i) => `    <field name="${escapeXml(header)}">${escapeXml(row[i])}</field>`).join('\n')}\n  </row>`).join('\n')}\n</rows>`;
}
function xmlTable(text: string): string {
  const { headers, rows } = xmlRows(text);
  const esc = (v: string) => v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  return `<table>\n  <thead><tr>${headers.map(h => `<th scope="col">${esc(h)}</th>`).join('')}</tr></thead>\n  <tbody>\n${rows.map(row => `    <tr>${row.map(value => `<td>${esc(value)}</td>`).join('')}</tr>`).join('\n')}\n  </tbody>\n</table>`;
}
function htmlTableJson(text: string): string {
  const template = document.createElement('template'); template.innerHTML = text;
  const table = template.content.querySelector('table'); if (!table) throw new Error('No HTML table found.');
  const rows = [...table.querySelectorAll('tr')].filter(row => row.closest('table') === table).map(row => [...row.children].filter(cell => ['TH', 'TD'].includes(cell.tagName)).map(cell => {
    if (['rowspan', 'colspan'].some(attr => cell.hasAttribute(attr) && cell.getAttribute(attr) !== '1')) fail('Merged cells are not supported. Remove rowspan and colspan first.');
    return (cell.textContent ?? '').trim();
  })).filter(row => row.length);
  if (rows.length < 2 || !rows[0].length) fail('The table needs a header row and at least one data row.');
  const headers = rows[0]; if (headers.some(h => !h) || new Set(headers).size !== headers.length) fail('Column headings must be unique and non-empty.');
  return JSON.stringify(rows.slice(1).map((row, i) => { if (row.length !== headers.length) fail(`Table row ${i + 2} has a different number of cells than the header.`); return Object.fromEntries(headers.map((header, j) => [header, row[j]])); }), null, 2);
}
function ndjsonCsv(text: string): string {
  const rows = text.split(/\r?\n/).map((line, i) => { if (!line.trim()) return null; let value: unknown; try { value = JSON.parse(line); } catch { fail(`Invalid JSON on line ${i + 1}.`); } if (!value || typeof value !== 'object' || Array.isArray(value)) fail(`Line ${i + 1} must contain a JSON object.`); return value as Record<string, unknown>; }).filter((v): v is Record<string, unknown> => v !== null);
  if (!rows.length) fail('Paste at least one JSON object, one per line.');
  const headers = columns(rows); return toCsv(headers, rows.map(row => headers.map(header => row[header] ?? '')));
}
function unfold(text: string): string[] { return text.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n').split('\n').reduce<string[]>((lines, line) => { if (/^[ \t]/.test(line) && lines.length) lines[lines.length - 1] += line.slice(1); else lines.push(line); return lines; }, []); }
function unescapeCalendar(value: string): string { return value.replace(/\\n/gi, '\n').replace(/\\,/g, ',').replace(/\\;/g, ';').replace(/\\\\/g, '\\'); }
function calendarCsv(text: string): string {
  if (!/BEGIN:VCALENDAR/i.test(text)) fail('Paste an iCalendar document beginning with BEGIN:VCALENDAR.');
  const headers = ['SUMMARY', 'DTSTART', 'DTEND', 'LOCATION', 'DESCRIPTION', 'UID']; const events: Record<string, string>[] = []; let event: Record<string, string> | null = null;
  for (const line of unfold(text)) { if (/^BEGIN:VEVENT(?:;|$)/i.test(line)) { if (event) fail('Nested calendar events are invalid.'); event = {}; continue; } if (/^END:VEVENT/i.test(line)) { if (event) events.push(event); event = null; continue; } if (!event) continue; const colon = line.indexOf(':'); if (colon < 1) continue; const key = line.slice(0, colon).split(';')[0].toUpperCase(); if (headers.includes(key) && event[key] === undefined) event[key] = unescapeCalendar(line.slice(colon + 1)); }
  if (!events.length) fail('No VEVENT calendar entries were found.');
  return toCsv(headers, events.map(event => headers.map(key => event[key] ?? '')));
}
function vcardCsv(text: string): string {
  const lines = unfold(text); if (!lines.some(line => /^BEGIN:VCARD(?:;|$)/i.test(line))) fail('Paste one or more BEGIN:VCARD contact records.');
  const keys = ['FN', 'N', 'ORG', 'TITLE', 'EMAIL', 'TEL', 'URL']; const cards: Record<string, string>[] = []; let card: Record<string, string> | null = null;
  for (const line of lines) { if (/^BEGIN:VCARD(?:;|$)/i.test(line)) { if (card) fail('Nested vCard records are invalid.'); card = {}; continue; } if (/^END:VCARD/i.test(line)) { if (card) cards.push(card); card = null; continue; } if (!card) continue; const colon = line.indexOf(':'); if (colon < 1) continue; const key = line.slice(0, colon).split(';')[0].split('.').at(-1)!.toUpperCase(); if (!keys.includes(key)) continue; const value = unescapeCalendar(line.slice(colon + 1)); card[key] = card[key] ? `${card[key]} | ${value}` : value; }
  if (!cards.length) fail('No complete vCard contacts were found.'); return toCsv(keys, cards.map(card => keys.map(key => card[key] ?? '')));
}
function geoJsonCsv(text: string): string {
  const input: any = JSON.parse(text); let features: any[] = [];
  if (input?.type === 'FeatureCollection' && Array.isArray(input.features)) features = input.features;
  else if (input?.type === 'Feature') features = [input];
  else if (input?.type && input.coordinates !== undefined) features = [{ type: 'Feature', properties: {}, geometry: input }];
  else return fail('Provide a GeoJSON FeatureCollection, Feature or geometry object.');
  if (!features.length || features.some(feature => feature?.type !== 'Feature' || !feature.geometry || typeof feature.geometry.type !== 'string' || feature.geometry.coordinates === undefined)) fail('Every GeoJSON feature must have a geometry type and coordinates.');
  const headers = [...new Set(features.flatMap(feature => Object.keys(feature.properties ?? {})))];
  if (!headers.length) headers.push('name');
  headers.push('geometry_type', 'coordinates');
  return toCsv(headers, features.map(feature => [...headers.slice(0, -2).map(key => feature.properties?.[key] ?? ''), feature.geometry.type, JSON.stringify(feature.geometry.coordinates)]));
}
function phpLiteral(value: unknown, depth = 0): string {
  if (depth > 32) fail('JSON nesting exceeds 32 levels.');
  if (value === null) return 'null'; if (value === true) return 'true'; if (value === false) return 'false';
  if (typeof value === 'number') { if (!Number.isFinite(value)) fail('JSON numbers must be finite.'); return String(value); }
  if (typeof value === 'string') return `'${value.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
  if (Array.isArray(value)) return `[${value.map(item => phpLiteral(item, depth + 1)).join(', ')}]`;
  if (typeof value === 'object') return `[${Object.entries(value as Record<string, unknown>).map(([key, item]) => `${phpLiteral(key, depth + 1)} => ${phpLiteral(item, depth + 1)}`).join(', ')}]`;
  return fail('Unsupported JSON value.');
}
function jsonRootObject(text: string): Record<string, unknown> { const parsed = JSON.parse(text); if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) fail('Provide one JSON object.'); return parsed as Record<string, unknown>; }
function jsonSchemaTypescript(text: string): string {
  const root: any = JSON.parse(text);
  if (!root || typeof root !== 'object' || Array.isArray(root)) fail('Paste one JSON Schema object.');
  const generated: string[] = [], names = new Set<string>(); const seen = new WeakMap<object, string>();
  const typeName = (hint: string) => {
    let base = hint.split(/[^A-Za-z0-9_$]+/).filter(Boolean).map(part => part[0].toUpperCase() + part.slice(1)).join('') || 'Model';
    if (/^\d/.test(base)) base = 'Model' + base;
    let name = base, suffix = 2; while (names.has(name)) name = base + suffix++;
    names.add(name); return name;
  };
  const propertyName = (key: string) => /^[A-Za-z_$][\w$]*$/.test(key) ? key : JSON.stringify(key);
  const namedObject = (schema: any, hint: string, depth: number): string => {
    if (depth > 32) fail('Schema nesting exceeds 32 levels.');
    if (seen.has(schema)) return seen.get(schema)!;
    const name = typeName(hint); seen.set(schema, name);
    const properties = schema.properties && typeof schema.properties === 'object' && !Array.isArray(schema.properties) ? Object.entries(schema.properties) : [];
    const required = new Set(Array.isArray(schema.required) ? schema.required.filter((key: unknown): key is string => typeof key === 'string') : []);
    const fields = properties.map(([key, child]: [string, any]) => `  ${propertyName(key)}${required.has(key) ? '' : '?'}: ${typeOf(child, `${name}${key}`, depth + 1)};`);
    if (schema.additionalProperties && typeof schema.additionalProperties === 'object') fields.push(`  [key: string]: ${typeOf(schema.additionalProperties, `${name}Value`, depth + 1)};`);
    else if (!properties.length && schema.additionalProperties !== false) fields.push('  [key: string]: unknown;');
    generated.push(`export interface ${name} {\n${fields.join('\n')}\n}`);
    return name;
  };
  const typeOf = (schema: any, hint: string, depth: number): string => {
    if (depth > 32) fail('Schema nesting exceeds 32 levels.');
    if (!schema || typeof schema !== 'object') return 'unknown';
    if (typeof schema.$ref === 'string') {
      if (!schema.$ref.startsWith('#/')) fail('Only local JSON Schema references are supported.');
      const target = schema.$ref.slice(2).split('/').map((part: string) => part.replace(/~1/g, '/').replace(/~0/g, '~')).reduce((value: any, part: string) => value?.[part], root);
      if (!target || typeof target !== 'object') fail(`Unresolved JSON Schema reference: ${schema.$ref}`);
      return typeOf(target, schema.$ref.split('/').at(-1) ?? hint, depth + 1);
    }
    if (Array.isArray(schema.enum)) return schema.enum.map((value: unknown) => JSON.stringify(value)).join(' | ') || 'never';
    if (Object.hasOwn(schema, 'const')) return JSON.stringify(schema.const);
    for (const key of ['oneOf', 'anyOf']) if (Array.isArray(schema[key])) return schema[key].map((child: any, i: number) => typeOf(child, `${hint}Variant${i + 1}`, depth + 1)).join(' | ') || 'never';
    if (Array.isArray(schema.allOf)) return schema.allOf.map((child: any, i: number) => typeOf(child, `${hint}Part${i + 1}`, depth + 1)).join(' & ') || 'unknown';
    const rawTypes: string[] = Array.isArray(schema.type) ? schema.type : schema.type ? [schema.type] : [];
    const nullable = rawTypes.includes('null'); const kinds = rawTypes.filter(type => type !== 'null');
    const kind = kinds.length === 1 ? kinds[0] : schema.type;
    let result: string;
    if (!kinds.length && nullable) result = 'null';
    else if (kinds.length > 1) result = kinds.map((member: string) => typeOf({ ...schema, type: member }, hint, depth + 1)).join(' | ');
    else if (kind === 'object' || schema.properties || schema.additionalProperties !== undefined) result = namedObject(schema, hint, depth + 1);
    else if (kind === 'array') result = `Array<${typeOf(schema.items ?? {}, `${hint}Item`, depth + 1)}>`;
    else if (kind === 'string') result = 'string';
    else if (kind === 'integer' || kind === 'number') result = 'number';
    else if (kind === 'boolean') result = 'boolean';
    else if (kind === 'null') result = 'null';
    else result = 'unknown';
    return nullable && !result.split(' | ').includes('null') ? `${result} | null` : result;
  };
  const result = typeOf(root, 'Root', 0);
  if (!generated.length) generated.push(`export type Root = ${result};`);
  return generated.join('\n\n') + '\n';
}
function safeIdentifier(key: string, index: number, style: 'java' | 'dart' | 'swift'): string {
  let name = key.replace(/([a-z0-9])([A-Z])/g, '$1_$2').split(/[^A-Za-z0-9]+/).filter(Boolean).map((part, i) => i ? part[0].toUpperCase() + part.slice(1) : part.toLowerCase()).join('');
  if (!name || /^\d/.test(name)) name = `field${index + 1}`;
  const keywords = style === 'java' ? 'abstract assert boolean break byte case catch char class const continue default do double else enum extends final finally float for goto if implements import instanceof int interface long native new package private protected public return short static strictfp super switch synchronized this throw throws transient try void volatile while record sealed permits var yield'.split(' ') : style === 'dart' ? 'abstract as assert async await break case catch class const continue covariant default deferred do dynamic else enum export extends extension external factory false final finally for Function get hide if implements import in interface is late library mixin native new null of on operator part required rethrow return set show static super switch sync this throw true try typedef var void while with yield'.split(' ') : 'associatedtype class deinit enum extension fileprivate func import init inout internal let open operator private protocol public static struct subscript typealias var break case continue default defer do else fallthrough for guard if repeat return switch where while as Any catch false is nil rethrows self Self super throw throws true try'.split(' ');
  if (keywords.includes(name)) name += style === 'java' ? 'Value' : 'Value';
  return name;
}
function jsonJava(text: string): string {
  const value = jsonRootObject(text); const used = new Set<string>();
  const fields = Object.entries(value).map(([key, item], i) => { let name = safeIdentifier(key, i, 'java'); const base = name; let suffix = 2; while (used.has(name)) name = base + suffix++; used.add(name); const type = item === null || typeof item === 'object' ? 'Object' : typeof item === 'string' ? 'String' : typeof item === 'boolean' ? 'Boolean' : Number.isInteger(item) ? 'Long' : 'Double'; return `    public ${type} ${name};${name !== key ? ` // JSON key: ${JSON.stringify(key)}` : ''}`; });
  return `// Generated from a JSON sample. Nested values use Object.\npublic class Root {\n${fields.join('\n')}\n}\n`;
}
function jsonDart(text: string): string {
  const value = jsonRootObject(text); const used = new Set<string>(); const fields = Object.entries(value).map(([key], i) => { let name = safeIdentifier(key, i, 'dart'); const base = name; let suffix = 2; while (used.has(name)) name = base + suffix++; used.add(name); return { key, name }; });
  const properties = fields.map(field => `  final dynamic ${field.name};`).join('\n');
  const args = fields.map(field => `this.${field.name}`).join(', ');
  const read = fields.map(field => `      ${field.name}: json[${JSON.stringify(field.key)}],`).join('\n');
  const write = fields.map(field => `      ${JSON.stringify(field.key)}: ${field.name},`).join('\n');
  return `class Root {\n${properties}\n\n  const Root({${args}});\n\n  factory Root.fromJson(Map<String, dynamic> json) => Root(\n${read}\n  );\n\n  Map<String, dynamic> toJson() => {\n${write}\n  };\n}\n`;
}
function jsonSwift(text: string): string {
  const value = jsonRootObject(text); const used = new Set<string>(); let needsJsonValue = false;
  const fields = Object.entries(value).map(([key, item], i) => {
    let name = safeIdentifier(key, i, 'swift'); const base = name; let suffix = 2; while (used.has(name)) name = base + suffix++; used.add(name);
    let type: string; if (typeof item === 'string') type = 'String'; else if (typeof item === 'boolean') type = 'Bool'; else if (typeof item === 'number') type = Number.isInteger(item) ? 'Int' : 'Double'; else { type = 'JSONValue'; needsJsonValue = true; }
    if (item === null) { type = 'JSONValue'; needsJsonValue = true; }
    if (item === null) type += '?';
    return { key, name, type };
  });
  const codingKeys = fields.filter(field => field.key !== field.name);
  const body = fields.map(field => `    let ${field.name}: ${field.type}`).join('\n');
  const keys = codingKeys.length ? `\n\n    enum CodingKeys: String, CodingKey {\n${codingKeys.map(field => `        case ${field.name} = ${JSON.stringify(field.key)}`).join('\n')}\n    }` : '';
  const jsonValue = needsJsonValue ? `\n\nindirect enum JSONValue: Codable {\n    case string(String), number(Double), bool(Bool), object([String: JSONValue]), array([JSONValue]), null\n\n    init(from decoder: Decoder) throws {\n        let value = try decoder.singleValueContainer()\n        if value.decodeNil() { self = .null }\n        else if let decoded = try? value.decode(Bool.self) { self = .bool(decoded) }\n        else if let decoded = try? value.decode(Double.self) { self = .number(decoded) }\n        else if let decoded = try? value.decode(String.self) { self = .string(decoded) }\n        else if let decoded = try? value.decode([JSONValue].self) { self = .array(decoded) }\n        else if let decoded = try? value.decode([String: JSONValue].self) { self = .object(decoded) }\n        else { throw DecodingError.dataCorruptedError(in: value, debugDescription: "Unsupported JSON value") }\n    }\n\n    func encode(to encoder: Encoder) throws {\n        var value = encoder.singleValueContainer()\n        switch self {\n        case .string(let item): try value.encode(item)\n        case .number(let item): try value.encode(item)\n        case .bool(let item): try value.encode(item)\n        case .object(let item): try value.encode(item)\n        case .array(let item): try value.encode(item)\n        case .null: try value.encodeNil()\n        }\n    }\n}` : '';
  return `import Foundation\n\nstruct Root: Codable {\n${body}${keys}\n}${jsonValue}\n`;
}
function jsonRuby(text: string): string {
  const literal = (value: unknown): string => value === null ? 'nil' : value === true ? 'true' : value === false ? 'false' : typeof value === 'string' ? JSON.stringify(value) : typeof value === 'number' ? String(value) : Array.isArray(value) ? `[${value.map(literal).join(', ')}]` : `{${Object.entries(value as Record<string, unknown>).map(([key, item]) => `${JSON.stringify(key)} => ${literal(item)}`).join(', ')}}`;
  return `# Generated Ruby literal from JSON.\n${literal(JSON.parse(text))}\n`;
}

export function transformNewConversion(slug: string, text: string): string {
  switch (slug) {
    case 'csv-to-json-schema': {
      const { headers, body } = rectangular(parseCsv(text));
      const properties = Object.fromEntries(headers.map((header, index) => {
        const values = body.map(row => row[index]).filter(value => value !== '');
        const numberValues = values.length > 0 && values.every(value => /^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?$/.test(value) && Number.isFinite(Number(value)));
        const booleanValues = values.length > 0 && values.every(value => /^(?:true|false)$/i.test(value));
        const inferred = booleanValues ? 'boolean' : numberValues && !/^-?0\d/.test(values[0]) ? 'number' : 'string';
        const type = body.some(row => row[index] === '') && inferred !== 'string' ? [inferred, 'string'] : inferred;
        return [header, { type, description: `Inferred from ${values.length} non-empty sample value${values.length === 1 ? '' : 's'}.` }];
      }));
      return JSON.stringify({ $schema: 'https://json-schema.org/draft/2020-12/schema', title: 'CSV record', type: 'object', additionalProperties: false, required: headers, properties }, null, 2);
    }
    case 'markdown-table-to-csv': return markdownToCsv(text);
    case 'json-to-markdown-table': { const rows = records(JSON.parse(text)); const headers = columns(rows); const row = (values: unknown[]) => `| ${values.map(markdownCell).join(' | ')} |`; return [row(headers), `| ${headers.map(() => '---').join(' | ')} |`, ...rows.map(item => row(headers.map(header => item[header] ?? '')))].join('\n'); }
    case 'csv-to-xml': return csvToXml(text);
    case 'xml-to-csv': { const {headers, rows} = xmlRows(text); return toCsv(headers, rows); }
    case 'xml-to-html-table': return xmlTable(text);
    case 'html-table-to-json': return htmlTableJson(text);
    case 'ndjson-to-csv': return ndjsonCsv(text);
    case 'ics-to-csv': return calendarCsv(text);
    case 'vcard-to-csv': return vcardCsv(text);
    case 'geojson-to-csv': return geoJsonCsv(text);
    case 'json-schema-to-typescript': return jsonSchemaTypescript(text);
    case 'json-to-php-array': return `<?php\n\nreturn ${phpLiteral(JSON.parse(text))};\n`;
    case 'json-to-sql-server': {
      const rows = records(JSON.parse(text)), headers = columns(rows);
      const identifier = (key: string) => `[${key.replace(/]/g, ']]')}]`;
      const literal = (value: unknown): string => {
        if (value === null) return 'NULL';
        if (typeof value === 'boolean') return value ? '1' : '0';
        if (typeof value === 'number') { if (!Number.isFinite(value) || Number.isInteger(value) && !Number.isSafeInteger(value)) fail('Use finite numbers and represent large integer IDs as strings.'); return String(value); }
        const textValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
        return `N'${textValue.replace(/'/g, "''")}'`;
      };
      return rows.map(row => `INSERT INTO [dbo].[records] (${headers.map(identifier).join(', ')}) VALUES (${headers.map(header => literal(row[header] ?? null)).join(', ')});`).join('\n');
    }
    case 'json-to-java-class': return jsonJava(text);
    case 'json-to-swift-struct': return jsonSwift(text);
    case 'json-to-dart-class': return jsonDart(text);
    case 'json-to-ruby-hash': return jsonRuby(text);
    default: return fail('Unknown conversion tool.');
  }
}
