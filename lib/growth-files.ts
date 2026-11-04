import type { ToolValues } from './growth-transforms';
export const MAX_BINARY_BYTES = 20 * 1024 * 1024;
export const MAX_IMAGE_PIXELS = 40_000_000;
export function encodeBase64(bytes: Uint8Array): string {
  // Encode chunks divisible by three so Base64 chunks have no internal padding.
  const chunk = 3 * 8192; let output = '';
  for (let i = 0; i < bytes.length; i += chunk) output += btoa(String.fromCharCode(...bytes.subarray(i, i + chunk)));
  return output;
}
export function decodeBase64(input: string): Uint8Array<ArrayBuffer> {
  if (input.length > 30 * 1024 * 1024) throw new Error('Encoded input is too large. Use a file of at most 20 MiB.');
  let text = input.trim();
  if (/^data:/i.test(text)) {
    const comma = text.indexOf(',');
    if (comma < 0 || !/;base64$/i.test(text.slice(0, comma))) throw new Error('Provide a Base64 data URL, not percent-encoded data.');
    text = text.slice(comma + 1);
  }
  text = text.replace(/\s+/gu, '');
  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(text) || (text.includes('=') && text.length % 4 !== 0)) throw new Error('Invalid standard Base64 alphabet or padding.');
  const raw = text.replace(/=+$/, '');
  if (raw.length % 4 === 1) throw new Error('Invalid Base64 length.');
  if (Math.floor(raw.length * 3 / 4) > MAX_BINARY_BYTES) throw new Error('Decoded data must not exceed 20 MiB.');
  const binary = atob(raw.padEnd(Math.ceil(raw.length / 4) * 4, '='));
  const bytes = Uint8Array.from(binary, c => c.charCodeAt(0));
  if (encodeBase64(bytes).replace(/=+$/, '') !== raw) throw new Error('Non-canonical Base64: unused bits must be zero.');
  return bytes;
}
export async function checksumBytes(bytes: ArrayBuffer, expected = ''): Promise<string> {
  expected = expected.trim().toLowerCase();
  if (expected && !/^(?:[\da-f]{64}|[\da-f]{96}|[\da-f]{128})$/.test(expected)) throw new Error('Expected checksum must be a plain SHA-256, SHA-384 or SHA-512 hexadecimal digest.');
  const hashes = await Promise.all(['SHA-256', 'SHA-384', 'SHA-512'].map(async algorithm => {
    const digest = new Uint8Array(await crypto.subtle.digest(algorithm, bytes));
    return { algorithm, hex: [...digest].map(b => b.toString(16).padStart(2, '0')).join('') };
  }));
  const match = hashes.find(h => h.hex === expected);
  return hashes.map(h => h.algorithm + ': ' + h.hex).join('\n') + (expected ? '\n\nVerification: ' + (match ? `MATCH (${match.algorithm})` : 'MISMATCH — the expected digest does not match this file.') : '');
}
export function resizeDimensions(width: number, height: number, targetWidth: number, targetHeight: number, lock: boolean) {
  if (![width, height, targetWidth, targetHeight].every(n => Number.isFinite(n) && Number.isInteger(n) && n > 0)) throw new Error('Image dimensions must be positive whole numbers.');
  const w = targetWidth, h = lock ? Math.max(1, Math.round(height * w / width)) : targetHeight;
  if (w > 8192 || h > 8192 || w * h > MAX_IMAGE_PIXELS) throw new Error('Output must be at most 8192 pixels per side and 40 million pixels total.');
  return { width: w, height: h };
}
export type ImageResult = { blob: Blob; width: number; height: number; originalWidth: number; originalHeight: number };
export async function processImage(file: File, slug: string, values: ToolValues): Promise<ImageResult> {
  if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) throw new Error('Select a PNG, JPEG or WebP file.');
  if (file.size > MAX_BINARY_BYTES) throw new Error('Image files must be at most 20 MiB.');
  if (!['image-resizer', 'image-compressor', 'image-format-converter', 'image-cropper', 'image-rotate-flip', 'image-grayscale', 'image-watermark'].includes(slug)) throw new Error('Unknown image operation.');
  const bitmap = await createImageBitmap(file);
  try {
    if (bitmap.width * bitmap.height > MAX_IMAGE_PIXELS) throw new Error('Decoded image exceeds the 40-million-pixel limit.');
    if (slug === 'image-grayscale' && bitmap.width * bitmap.height > 20_000_000) throw new Error('Grayscale conversion is limited to 20 million pixels.');
    const crop = slug === 'image-cropper' ? cropRectangle(bitmap.width, bitmap.height, values) : null;
    const rotation = slug === 'image-rotate-flip' ? rotationSettings(bitmap.width, bitmap.height, values) : null;
    const dimensions = crop ? { width: crop.width, height: crop.height } : rotation ? { width: rotation.width, height: rotation.height } : slug === 'image-resizer' ? resizeDimensions(bitmap.width, bitmap.height, Number(values.width), Number(values.height), values.lock === 'true') : { width: bitmap.width, height: bitmap.height };
    const format = ['image-resizer', 'image-cropper', 'image-rotate-flip', 'image-grayscale', 'image-watermark'].includes(slug) ? 'image/png' : values.format;
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(format)) throw new Error('Select PNG, JPEG or WebP as the output format.');
    const quality = slug === 'image-compressor' ? Number(values.quality) / 100 : .92;
    if (!Number.isFinite(quality) || quality < .01 || quality > 1) throw new Error('Choose a quality between 1 and 100.');
    const canvas = document.createElement('canvas'); canvas.width = dimensions.width; canvas.height = dimensions.height;
    const ctx = canvas.getContext('2d'); if (!ctx) throw new Error('Canvas rendering is unavailable in this browser.');
    try {
      ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
      if (format === 'image/jpeg') { ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, canvas.width, canvas.height); }
      if (crop) ctx.drawImage(bitmap, crop.x, crop.y, crop.width, crop.height, 0, 0, canvas.width, canvas.height);
      else if (rotation) {
        ctx.translate(canvas.width / 2, canvas.height / 2); ctx.rotate(rotation.radians); ctx.scale(rotation.flipX, rotation.flipY);
        ctx.drawImage(bitmap, -bitmap.width / 2, -bitmap.height / 2);
      } else ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      if (slug === 'image-grayscale') {
        const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < pixels.data.length; i += 4) { const gray = Math.round(.2126 * pixels.data[i] + .7152 * pixels.data[i + 1] + .0722 * pixels.data[i + 2]); pixels.data[i] = gray; pixels.data[i + 1] = gray; pixels.data[i + 2] = gray; }
        ctx.putImageData(pixels, 0, 0);
      }
      if (slug === 'image-watermark') {
        const text = values.text?.trim() ?? '', size = Number(values.fontSize), opacity = Number(values.opacity);
        if (!values.fontSize?.trim() || !values.opacity?.trim() || !text || [...text].length > 200 || /[\r\n]/.test(text) || !Number.isFinite(size) || size < 1 || size > 256 || !Number.isFinite(opacity) || opacity < 0 || opacity > 100 || !/^#[\da-f]{6}$/i.test(values.color ?? '') || !['top-left','top-right','center','bottom-left','bottom-right'].includes(values.position)) throw new Error('Choose one text line of at most 200 characters, a valid color, position, font size and opacity.');
        const margin = Math.min(canvas.width, canvas.height) * .03;
        ctx.font = `${size}px sans-serif`; const measured = ctx.measureText(text).width;
        const fitted = Math.min(size, size * (canvas.width - 2 * margin) / Math.max(measured, .01), canvas.height - 2 * margin);
        ctx.font = `${fitted}px sans-serif`; ctx.fillStyle = values.color; ctx.globalAlpha = opacity / 100;
        const position = values.position; ctx.textAlign = position === 'center' ? 'center' : position.endsWith('right') ? 'right' : 'left';
        ctx.textBaseline = position === 'center' ? 'middle' : position.startsWith('top') ? 'top' : 'bottom';
        const x = position === 'center' ? canvas.width / 2 : position.endsWith('right') ? canvas.width - margin : margin;
        const y = position === 'center' ? canvas.height / 2 : position.startsWith('top') ? margin : canvas.height - margin;
        ctx.fillText(text, x, y); ctx.globalAlpha = 1;
      }
      const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob(result => result ? resolve(result) : reject(new Error('Browser could not encode the image.')), format, quality));
      if (blob.type !== format) throw new Error('Your browser does not support encoding the selected format. Choose another format.');
      return { blob, ...dimensions, originalWidth: bitmap.width, originalHeight: bitmap.height };
    } finally { canvas.width = 0; canvas.height = 0; }
  } finally { bitmap.close(); }
}
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob); const a = document.createElement('a');
  a.href = url; a.download = filename; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function cropRectangle(width: number, height: number, values: ToolValues) {
  const [left, top, w, h] = ['x', 'y', 'cropWidth', 'cropHeight'].map(k => {
    if (!values[k]?.trim() || !Number.isFinite(Number(values[k]))) throw new Error('Crop coordinates must be finite percentages.'); return Number(values[k]);
  });
  if (left < 0 || top < 0 || w <= 0 || h <= 0 || left + w > 100 + 1e-8 || top + h > 100 + 1e-8) throw new Error('The crop rectangle must fit inside the source image.');
  const x = Math.floor(width * left / 100), y = Math.floor(height * top / 100);
  const right = Math.min(width, Math.round(width * (left + w) / 100)), bottom = Math.min(height, Math.round(height * (top + h) / 100));
  if (right <= x || bottom <= y) throw new Error('The selected crop must cover at least one pixel in each dimension.');
  return { x, y, width: right - x, height: bottom - y };
}
export function rotationSettings(width: number, height: number, values: ToolValues) {
  if (!['0', '90', '180', '270'].includes(values.rotation) || !['none', 'horizontal', 'vertical', 'both'].includes(values.flip)) throw new Error('Choose a right-angle rotation and a valid flip setting.');
  const swap = values.rotation === '90' || values.rotation === '270';
  return { width: swap ? height : width, height: swap ? width : height, radians: Number(values.rotation) * Math.PI / 180, flipX: ['horizontal', 'both'].includes(values.flip) ? -1 : 1, flipY: ['vertical', 'both'].includes(values.flip) ? -1 : 1 };
}
export function icoFromPngLayers(layers: { size: number; bytes: Uint8Array }[]): Uint8Array<ArrayBuffer> {
  if (!layers.length || layers.length > 20) throw new Error('ICO needs between 1 and 20 PNG layers.');
  const headerSize = 6 + layers.length * 16;
  const output = new Uint8Array(headerSize + layers.reduce((n, layer) => n + layer.bytes.length, 0)), view = new DataView(output.buffer);
  view.setUint16(2, 1, true); view.setUint16(4, layers.length, true); let offset = headerSize;
  layers.forEach((layer, i) => {
    if (!Number.isInteger(layer.size) || layer.size < 1 || layer.size > 256 || layer.bytes.length < 24 || layer.bytes[0] !== 137 || layer.bytes[1] !== 80 || layer.bytes[2] !== 78 || layer.bytes[3] !== 71) throw new Error('ICO layers must be PNG images from 1 to 256 pixels square.');
    const pngView = new DataView(layer.bytes.buffer, layer.bytes.byteOffset, layer.bytes.byteLength);
    if (pngView.getUint32(16) !== layer.size || pngView.getUint32(20) !== layer.size) throw new Error('PNG dimensions must match the ICO layer size.');
    const p = 6 + i * 16; output[p] = layer.size === 256 ? 0 : layer.size; output[p + 1] = output[p];
    view.setUint16(p + 4, 1, true); view.setUint16(p + 6, 32, true); view.setUint32(p + 8, layer.bytes.length, true); view.setUint32(p + 12, offset, true);
    output.set(layer.bytes, offset); offset += layer.bytes.length;
  });
  return output;
}
export function storedZip(files: { name: string; bytes: Uint8Array }[]): Uint8Array<ArrayBuffer> {
  const encoder = new TextEncoder(); const locals: Uint8Array[] = [], central: Uint8Array[] = []; let offset = 0;
  if (files.length > 100) throw new Error('Too many ZIP members.');
  for (const file of files) {
    if (!file.name || /[\\/\u0000]/.test(file.name) || file.name === '..') throw new Error('ZIP names must be plain filenames.');
    const name = encoder.encode(file.name); if (name.length > 65535) throw new Error('ZIP filename too long.');
    let crc = 0xffffffff;
    for (const byte of file.bytes) { crc ^= byte; for (let i = 0; i < 8; i++) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0); }
    crc = (crc ^ 0xffffffff) >>> 0;
    const local = new Uint8Array(30 + name.length + file.bytes.length), l = new DataView(local.buffer);
    l.setUint32(0, 0x04034b50, true); l.setUint16(4, 20, true); l.setUint16(6, 0x800, true); l.setUint16(12, 33, true);
    l.setUint32(14, crc, true); l.setUint32(18, file.bytes.length, true); l.setUint32(22, file.bytes.length, true); l.setUint16(26, name.length, true);
    local.set(name, 30); local.set(file.bytes, 30 + name.length); locals.push(local);
    const entry = new Uint8Array(46 + name.length), c = new DataView(entry.buffer);
    c.setUint32(0, 0x02014b50, true); c.setUint16(4, 20, true); c.setUint16(6, 20, true); c.setUint16(8, 0x800, true); c.setUint16(14, 33, true);
    c.setUint32(16, crc, true); c.setUint32(20, file.bytes.length, true); c.setUint32(24, file.bytes.length, true); c.setUint16(28, name.length, true); c.setUint32(42, offset, true);
    entry.set(name, 46); central.push(entry); offset += local.length;
  }
  const size = central.reduce((n, v) => n + v.length, 0), end = new Uint8Array(22), e = new DataView(end.buffer);
  e.setUint32(0, 0x06054b50, true); e.setUint16(8, files.length, true); e.setUint16(10, files.length, true); e.setUint32(12, size, true); e.setUint32(16, offset, true);
  const out = new Uint8Array(offset + size + end.length); let at = 0;
  for (const chunk of [...locals, ...central, end]) { out.set(chunk, at); at += chunk.length; }
  return out;
}
export async function faviconFiles(file: File, values: ToolValues): Promise<{ name: string; blob: Blob }[]> {
  if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type) || file.size > MAX_BINARY_BYTES) throw new Error('Select a PNG, JPEG or WebP file of at most 20 MiB.');
  const padding = Number(values.padding); if (!values.padding?.trim() || !Number.isFinite(padding) || padding < 0 || padding > 40 || !['contain', 'cover'].includes(values.fit)) throw new Error('Choose contain or cover fitting and padding between 0% and 40%.');
  const bitmap = await createImageBitmap(file);
  try {
    if (bitmap.width * bitmap.height > MAX_IMAGE_PIXELS) throw new Error('The source image exceeds the decoded pixel limit.');
    const rendered: { size: number; blob: Blob }[] = [];
    for (const size of [16, 32, 48, 180, 192, 512]) {
      const canvas = document.createElement('canvas'); canvas.width = size; canvas.height = size; const ctx = canvas.getContext('2d'); if (!ctx) throw new Error('Canvas rendering unavailable.');
      const inset = size * padding / 100, inner = size - 2 * inset;
      ctx.save(); ctx.beginPath(); ctx.rect(inset, inset, inner, inner); ctx.clip(); ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
      const scale = (values.fit === 'contain' ? Math.min : Math.max)(inner / bitmap.width, inner / bitmap.height), w = bitmap.width * scale, h = bitmap.height * scale;
      ctx.drawImage(bitmap, (size - w) / 2, (size - h) / 2, w, h); ctx.restore();
      const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob(b => b ? resolve(b) : reject(new Error('PNG encoding failed.')), 'image/png'));
      rendered.push({ size, blob }); canvas.width = 0; canvas.height = 0;
    }
    const ico = icoFromPngLayers(await Promise.all(rendered.filter(r => r.size <= 48).map(async r => ({ size: r.size, bytes: new Uint8Array(await r.blob.arrayBuffer()) }))));
    const manifest = { name: 'Your app name', short_name: 'Your app', icons: [{ src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' }, { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' }], start_url: '/', display: 'standalone' };
    const html = '<link rel="icon" href="/favicon.ico" sizes="16x16 32x32 48x48">\n<link rel="icon" type="image/png" sizes="32x32" href="/icon-32.png">\n<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">\n<link rel="manifest" href="/site.webmanifest">\n';
    return [...rendered.filter(r => r.size !== 48).map(r => ({ name: r.size === 180 ? 'apple-touch-icon.png' : `icon-${r.size}.png`, blob: r.blob })), { name: 'favicon.ico', blob: new Blob([ico], { type: 'image/x-icon' }) }, { name: 'site.webmanifest', blob: new Blob([JSON.stringify(manifest, null, 2)], { type: 'application/manifest+json' }) }, { name: 'head-snippet.html', blob: new Blob([html], { type: 'text/plain;charset=utf-8' }) }];
  } finally { bitmap.close(); }
}

export function prepareStaticSvg(text: string, width: number, height: number): string {
  if (text.length > 1024 * 1024) throw new Error('Use an SVG document of at most 1 MiB.');
  if (![width, height].every(n => Number.isInteger(n) && n > 0 && n <= 4096)) throw new Error('PNG dimensions must be whole numbers from 1 to 4096.');
  if (/<!DOCTYPE|<!ENTITY/i.test(text)) throw new Error('SVG document types and entity declarations are not supported.');
  const doc = new DOMParser().parseFromString(text, 'image/svg+xml'); const root = doc.documentElement;
  if (doc.querySelector('parsererror') || root.localName !== 'svg' || root.namespaceURI !== 'http://www.w3.org/2000/svg') throw new Error('Paste valid SVG with the SVG namespace.');
  if ([...doc.childNodes].some(n => n.nodeType === 7)) throw new Error('SVG processing instructions are not supported.');
  const forbidden = new Set(['script', 'foreignobject', 'animate', 'animatemotion', 'animatetransform', 'set', 'mpath', 'discard', 'a', 'style', 'image', 'feimage']);
  for (const element of [root, ...root.querySelectorAll('*')]) {
    if (element.namespaceURI !== 'http://www.w3.org/2000/svg' || forbidden.has(element.localName.toLowerCase())) throw new Error('Use static SVG without scripts, animation, style elements, embedded images or links.');
    for (const attribute of [...element.attributes]) {
      if (/^on/i.test(attribute.localName)) throw new Error('SVG event handlers are not allowed.');
      if (attribute.namespaceURI === 'http://www.w3.org/XML/1998/namespace' && attribute.localName === 'base') throw new Error('SVG external base URLs are not supported.');
      if (attribute.localName === 'href' && !/^#[^\s]+$/.test(attribute.value)) throw new Error('SVG references must point to a local #fragment.');
      const rest = attribute.value.replace(/url\(\s*(['"]?)#[^\s'"()]+\1\s*\)/gi, '');
      if (/url\s*\(|@import|\\|expression\s*\(/i.test(rest)) throw new Error('External or escaped CSS URL references are not supported.');
    }
  }
  const viewBox = root.getAttribute('viewBox');
  if (viewBox) {
    const parts = viewBox.trim().split(/[\s,]+/).map(Number);
    if (parts.length !== 4 || parts.some(n => !Number.isFinite(n)) || parts[2] <= 0 || parts[3] <= 0) throw new Error('SVG viewBox must contain four finite numbers and positive width/height.');
  } else {
    const dimension = (value: string | null) => value && /^\d+(?:\.\d+)?(?:px)?$/.test(value.trim()) ? parseFloat(value) : NaN;
    const w = dimension(root.getAttribute('width')), h = dimension(root.getAttribute('height'));
    if (!(w > 0 && h > 0 && Number.isFinite(w) && Number.isFinite(h))) throw new Error('Supply a valid viewBox or numeric SVG width and height.');
    root.setAttribute('viewBox', `0 0 ${w} ${h}`);
  }
  root.setAttribute('width', String(width)); root.setAttribute('height', String(height)); root.setAttribute('preserveAspectRatio', 'xMidYMid meet');
  return new XMLSerializer().serializeToString(root);
}
export async function svgPng(text: string, width: number, height: number, background: string): Promise<Blob> {
  if (!['transparent', 'white'].includes(background)) throw new Error('Choose transparent or white background.');
  const safe = prepareStaticSvg(text, width, height), url = URL.createObjectURL(new Blob([safe], { type: 'image/svg+xml' }));
  const canvas = document.createElement('canvas');
  try {
    const image = new Image();
    await new Promise<void>((resolve, reject) => { image.onload = () => resolve(); image.onerror = () => reject(new Error('Browser could not render this SVG.')); image.src = url; });
    canvas.width = width; canvas.height = height; const ctx = canvas.getContext('2d'); if (!ctx) throw new Error('Canvas rendering unavailable.');
    if (background === 'white') { ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, width, height); }
    ctx.drawImage(image, 0, 0, width, height);
    return await new Promise<Blob>((resolve, reject) => canvas.toBlob(b => b ? resolve(b) : reject(new Error('PNG encoding failed.')), 'image/png'));
  } finally { URL.revokeObjectURL(url); canvas.width = 0; canvas.height = 0; }
}

export function makeImagePdf(jpeg: Uint8Array, width: number, height: number, paper: string, orientation: string, margin: number): Uint8Array<ArrayBuffer> {
  if (jpeg.length < 4 || jpeg[0] !== 255 || jpeg[1] !== 216 || ![width, height].every(v => Number.isInteger(v) && v > 0) || !['a4', 'letter'].includes(paper) || !['portrait', 'landscape'].includes(orientation) || !Number.isFinite(margin) || margin < 0 || margin > 144) throw new Error('Invalid JPEG, dimensions, paper, orientation or page margin.');
  let [pw, ph] = paper === 'a4' ? [595.28, 841.89] : [612, 792]; if (orientation === 'landscape') [pw, ph] = [ph, pw];
  const scale = Math.min((pw - 2 * margin) / width, (ph - 2 * margin) / height), dw = width * scale, dh = height * scale;
  const encoder = new TextEncoder(), chunks: Uint8Array[] = [], offsets = [0]; let length = 0;
  const put = (value: string | Uint8Array) => { const bytes = typeof value === 'string' ? encoder.encode(value) : value; chunks.push(bytes); length += bytes.length; };
  const fmt = (n: number) => String(Number(n.toFixed(4)));
  const object = (n: number, body: string) => { offsets[n] = length; put(`${n} 0 obj\n${body}\nendobj\n`); };
  put('%PDF-1.4\n'); put(new Uint8Array([37, 226, 227, 207, 211, 10]));
  object(1, '<< /Type /Catalog /Pages 2 0 R >>'); object(2, '<< /Type /Pages /Kids [3 0 R] /Count 1 >>');
  object(3, `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pw} ${ph}] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>`);
  offsets[4] = length; put(`4 0 obj\n<< /Type /XObject /Subtype /Image /Width ${width} /Height ${height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpeg.length} >>\nstream\n`); put(jpeg); put('\nendstream\nendobj\n');
  const content = `q\n${fmt(dw)} 0 0 ${fmt(dh)} ${fmt((pw - dw) / 2)} ${fmt((ph - dh) / 2)} cm\n/Im0 Do\nQ\n`;
  object(5, `<< /Length ${encoder.encode(content).length} >>\nstream\n${content}endstream`);
  const xref = length; put('xref\n0 6\n0000000000 65535 f \n'); for (const offset of offsets.slice(1)) put(String(offset).padStart(10, '0') + ' 00000 n \n');
  put(`trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`);
  const result = new Uint8Array(length); let at = 0; for (const chunk of chunks) { result.set(chunk, at); at += chunk.length; } return result;
}
export async function imagePdf(file: File, values: ToolValues): Promise<Blob> {
  if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type) || file.size > MAX_BINARY_BYTES) throw new Error('Choose PNG, JPEG or WebP of at most 20 MiB.');
  const bitmap = await createImageBitmap(file), canvas = document.createElement('canvas');
  try {
    if (bitmap.width * bitmap.height > MAX_IMAGE_PIXELS) throw new Error('Decoded image exceeds the pixel limit.');
    canvas.width = bitmap.width; canvas.height = bitmap.height; const ctx = canvas.getContext('2d'); if (!ctx) throw new Error('Canvas rendering unavailable.');
    ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, canvas.width, canvas.height); ctx.drawImage(bitmap, 0, 0);
    const jpeg = await new Promise<Blob>((resolve, reject) => canvas.toBlob(b => b ? resolve(b) : reject(new Error('JPEG encoding failed.')), 'image/jpeg', .92));
    return new Blob([makeImagePdf(new Uint8Array(await jpeg.arrayBuffer()), bitmap.width, bitmap.height, values.paper, values.orientation, Number(values.margin))], { type: 'application/pdf' });
  } finally { bitmap.close(); canvas.width = 0; canvas.height = 0; }
}
export function sampledPixel(rgba: Uint8ClampedArray | number[], x: number, y: number): { x: number; y: number; rgba: number[]; css: string; hex: string } {
  const [r, g, b, a] = rgba; if (![r, g, b, a].every(v => Number.isInteger(v) && v >= 0 && v <= 255)) throw new Error('Pixel must contain four byte channels.');
  return { x, y, rgba: [r, g, b, a], css: `rgba(${r}, ${g}, ${b}, ${Number((a / 255).toFixed(6))})`, hex: '#' + [r, g, b, ...(a === 255 ? [] : [a])].map(n => n.toString(16).padStart(2, '0')).join('') };
}

export function pixelCoordinates(clientX: number, clientY: number, rect: { left: number; top: number; width: number; height: number }, width: number, height: number): { x: number; y: number } {
  if (![clientX, clientY, rect.left, rect.top, rect.width, rect.height].every(Number.isFinite) || rect.width <= 0 || rect.height <= 0 || ![width, height].every(n => Number.isInteger(n) && n > 0)) throw new Error('The canvas must be visible and contain a decoded image.');
  return { x: Math.max(0, Math.min(width - 1, Math.floor((clientX - rect.left) * width / rect.width))), y: Math.max(0, Math.min(height - 1, Math.floor((clientY - rect.top) * height / rect.height))) };
}
