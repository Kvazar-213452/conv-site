export type Json = null | boolean | number | string | Json[] | { [key: string]: Json };
const pretty = (value: unknown) => JSON.stringify(value, null, 2);
function flatten(value: Json, path = '', out: Record<string, Json> = {}): Record<string, Json> {
  if (value !== null && typeof value === 'object' && Object.keys(value).length) {
    for (const [key, child] of Object.entries(value)) flatten(child, path + '/' + key.replace(/~/g, '~0').replace(/\//g, '~1'), out);
    // Record container types so numeric object keys cannot become arrays.
    out[path] = Array.isArray(value) ? [] : {};
  } else out[path] = value;
  return out;
}
function unflatten(input: unknown): Json {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('Expected an object of JSON Pointer paths.');
  const entries = Object.entries(input);
  if (!Object.hasOwn(input, '')) throw new Error('Missing root pointer "". Use output from Flatten.');
  let root: Json = null;
  const known = new Map<string, Json>();
  for (const [path, value] of entries.sort(([a], [b]) => a.split('/').length - b.split('/').length)) {
    if (path !== '' && (!path.startsWith('/') || /~(?![01])/u.test(path))) throw new Error('Invalid JSON Pointer: ' + path);
    const node: Json = value as Json;
    if (node !== null && typeof node === 'object' && Object.keys(node).length) throw new Error('Container markers must be empty objects or arrays.');
    if (path === '') root = node;
    else {
      const split = path.lastIndexOf('/');
      const parent = known.get(path.slice(0, split));
      const key = path.slice(split + 1).replace(/~1/g, '/').replace(/~0/g, '~');
      if (parent === null || typeof parent !== 'object') throw new Error('Missing container for ' + path);
      if (Array.isArray(parent)) {
        if (!/^(0|[1-9]\d*)$/.test(key) || Number(key) !== parent.length) throw new Error('Array indexes must be contiguous: ' + path);
        parent.push(node);
      } else Object.defineProperty(parent, key, { value: node, enumerable: true, writable: true, configurable: true });
    }
    known.set(path, node);
  }
  return root;
}
function parseTsv(text: string): string[][] {
  const rows: string[][] = []; let row: string[] = [], cell = '', quoted = false, closed = false;
  text = text.replace(/^\uFEFF/, '');
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (c === '"') { quoted = false; closed = true; }
      else cell += c;
    } else if (c === '"' && !cell && !closed) quoted = true;
    else if (c === '\t') { row.push(cell); cell = ''; closed = false; }
    else if (c === '\n' || c === '\r') { if (c === '\r' && text[i + 1] === '\n') i++; row.push(cell); rows.push(row); row = []; cell = ''; closed = false; }
    else { if (closed || c === '"') throw new Error('Invalid quote in TSV cell.'); cell += c; }
  }
  if (quoted) throw new Error('Unclosed quoted TSV field.');
  if (cell || row.length || closed) { row.push(cell); rows.push(row); }
  return rows;
}
function hexLuminance(hex: string) {
  if (!/^#?(?:[\da-f]{3}|[\da-f]{6})$/i.test(hex)) throw new Error('Use opaque 3-digit or 6-digit HEX colors.');
  let h = hex.replace('#', ''); if (h.length === 3) h = [...h].map(c => c + c).join('');
  const rgb = [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16) / 255).map(c => c <= .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4);
  return rgb[0] * .2126 + rgb[1] * .7152 + rgb[2] * .0722;
}
export async function transformTool(slug: string, text: string, reverse = false, base = 16, fileBytes?: ArrayBuffer): Promise<string> {
  switch (slug) {
    case 'json-flattener': return pretty(reverse ? unflatten(JSON.parse(text)) : flatten(JSON.parse(text)));
    case 'json-to-ndjson': {
      if (reverse) return pretty(text.split(/\r?\n/).flatMap((line, i) => { if (!line.trim()) return []; try { return [JSON.parse(line)]; } catch { throw new Error(`Invalid JSON on line ${i + 1}.`); } }));
      const value = JSON.parse(text); if (!Array.isArray(value)) throw new Error('Expected a JSON array.');
      return value.length ? value.map(v => JSON.stringify(v)).join('\n') + '\n' : '';
    }
    case 'tsv-to-json': {
      if (!reverse) {
        const [headers, ...rows] = parseTsv(text);
        if (!headers?.length || headers.some(h => !h.trim()) || new Set(headers).size !== headers.length) throw new Error('Provide unique, non-empty column headers.');
        return pretty(rows.map((row, i) => { if (row.length !== headers.length) throw new Error(`Row ${i + 2} has ${row.length} cells; expected ${headers.length}.`); return Object.fromEntries(headers.map((h, j) => [h, row[j]])); }));
      }
      const rows = JSON.parse(text);
      if (!Array.isArray(rows) || rows.some(r => !r || typeof r !== 'object' || Array.isArray(r))) throw new Error('Expected an array of objects.');
      const headers = [...new Set<string>(rows.flatMap(r => Object.keys(r)))];
      const escape = (v: unknown) => { const s = v == null ? '' : typeof v === 'object' ? JSON.stringify(v) : String(v); return /[\t\r\n"]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; };
      return [headers, ...rows.map(r => headers.map(h => r[h]))].map(r => r.map(escape).join('\t')).join('\n');
    }
    case 'px-to-rem': {
      if (!text.trim() || !Number.isFinite(Number(text)) || !Number.isFinite(base) || base <= 0) throw new Error('Enter a finite number and a root font size greater than zero.');
      const n = reverse ? Number(text) * base : Number(text) / base;
      if (!Number.isFinite(n)) throw new Error('Result exceeds supported numeric range.');
      return `${Number(n.toPrecision(12))}${reverse ? 'px' : 'rem'}`;
    }
    case 'color-contrast-checker': {
      const colors = text.trim().split(/\s+/); if (colors.length !== 2) throw new Error('Enter foreground and background HEX colors.');
      const [a, b] = colors.map(hexLuminance); const ratio = (Math.max(a, b) + .05) / (Math.min(a, b) + .05);
      return `Contrast ratio: ${ratio.toFixed(2)}:1\nAA normal text (4.5:1): ${ratio >= 4.5 ? 'Pass' : 'Fail'}\nAA large text (3:1): ${ratio >= 3 ? 'Pass' : 'Fail'}\nAAA normal text (7:1): ${ratio >= 7 ? 'Pass' : 'Fail'}\nAAA large text (4.5:1): ${ratio >= 4.5 ? 'Pass' : 'Fail'}\n\nLarge text: at least 18pt regular or 14pt bold. Results use the unrounded ratio.`;
    }
    case 'html-to-text': {
      // Template contents stay inert: supplied images/frames are not attached to a browsing document.
      const template = document.createElement('template');
      template.innerHTML = text;
      const doc = template.content;
      doc.querySelectorAll('script,style,template,noscript').forEach(n => n.remove());
      doc.querySelectorAll('br').forEach(n => n.replaceWith('\n'));
      doc.querySelectorAll('p,div,h1,h2,h3,h4,h5,h6,li,tr,section,article,blockquote,pre').forEach(n => n.append('\n'));
      doc.querySelectorAll('td,th').forEach(n => n.append('\t'));
      return (doc.textContent ?? '').replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
    }
    case 'unicode-escape': {
      if (!reverse) return text.split('').map(c => '\\u' + c.charCodeAt(0).toString(16).padStart(4, '0')).join('');
      let out = '';
      for (let i = 0; i < text.length;) {
        if (text.slice(i, i + 2) !== '\\u') { out += text[i++]; continue; }
        const match = /^(?:\\u\{([\da-f]{1,6})\}|\\u([\da-f]{4}))/i.exec(text.slice(i));
        if (!match) throw new Error('Malformed Unicode escape at position ' + i);
        const code = parseInt(match[1] ?? match[2], 16); if (code > 0x10ffff) throw new Error('Code point exceeds U+10FFFF.');
        out += match[1] ? String.fromCodePoint(code) : String.fromCharCode(code); i += match[0].length;
      }
      return out;
    }
    case 'sri-generator': {
      const bytes = fileBytes ?? new TextEncoder().encode(text);
      const results = await Promise.all(['SHA-256', 'SHA-384', 'SHA-512'].map(async algorithm => {
        const digest = new Uint8Array(await crypto.subtle.digest(algorithm, bytes));
        return algorithm.toLowerCase().replace('-', '') + '-' + btoa(String.fromCharCode(...digest));
      }));
      return results.join('\n');
    }
    case 'basic-auth-generator': {
      if (reverse) {
        const encoded = text.trim().replace(/^Basic\s+/i, '');
        const decoded = new TextDecoder('utf-8', { fatal: true }).decode(Uint8Array.from(atob(encoded), c => c.charCodeAt(0)));
        const colon = decoded.indexOf(':'); if (colon < 0) throw new Error('Decoded credentials must contain a colon.');
        return `Username: ${decoded.slice(0, colon)}\nPassword: ${decoded.slice(colon + 1)}`;
      }
      const split = text.indexOf('\n'); if (split < 0) throw new Error('Enter username on line one and password on line two.');
      const user = text.slice(0, split).replace(/\r$/, ''); const password = text.slice(split + 1);
      if (user.includes(':') || /[\u0000-\u001f\u007f]/.test(user + password)) throw new Error('Username cannot contain a colon; credentials cannot contain control characters.');
      const bytes = new TextEncoder().encode(user + ':' + password);
      let binary = ''; for (const byte of bytes) binary += String.fromCharCode(byte);
      return 'Basic ' + btoa(binary);
    }
    case 'text-to-slug-list': {
      const seen = new Set<string>(); const duplicates: number[] = [];
      const result = text.split(/\r?\n/).map((line, i) => {
        const slug = line.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        if (!slug) throw new Error(`Line ${i + 1} has no supported letters or digits.`);
        if (seen.has(slug)) duplicates.push(i + 1); seen.add(slug); return slug;
      });
      if (duplicates.length) throw new Error(`Duplicate slugs on lines ${duplicates.join(', ')}. Make source titles unique before exporting.`);
      return result.join('\n');
    }
    default: throw new Error('Unknown tool.');
  }
}
