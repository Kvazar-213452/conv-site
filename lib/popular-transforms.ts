import type { ToolValues } from './growth-transforms';

function required(value: string | undefined, label: string): string {
  const result = value?.trim();
  if (!result) throw new Error(`Enter ${label}.`);
  return result;
}

function parseCsv(source: string): string[][] {
  const rows: string[][] = []; let row: string[] = [], cell = '', quoted = false, closed = false;
  for (let i = 0; i < source.length; i++) {
    const c = source[i];
    if (quoted) {
      if (c === '"' && source[i + 1] === '"') { cell += '"'; i++; }
      else if (c === '"') { quoted = false; closed = true; }
      else cell += c;
    } else if (c === '"' && !cell && !closed) quoted = true;
    else if (c === ',') { row.push(cell); cell = ''; closed = false; }
    else if (c === '\n' || c === '\r') { if (c === '\r' && source[i + 1] === '\n') i++; row.push(cell); rows.push(row); row = []; cell = ''; closed = false; }
    else { if (closed || c === '"') throw new Error(`Invalid CSV quote near character ${i + 1}.`); cell += c; }
  }
  if (quoted) throw new Error('A quoted CSV field is not closed.');
  if (cell || row.length || closed) { row.push(cell); rows.push(row); }
  return rows;
}

function ean13(source: string): string {
  const raw = source.trim();
  if (!/^\d{12,13}$/.test(raw)) throw new Error('Enter 12 digits to calculate a check digit, or 13 digits to verify and generate the barcode.');
  const digits = raw.slice(0, 12).split('').map(Number);
  const check = (10 - digits.reduce((sum, digit, i) => sum + digit * (i % 2 === 0 ? 1 : 3), 0) % 10) % 10;
  if (raw.length === 13 && Number(raw[12]) !== check) throw new Error(`Invalid EAN-13 check digit. The correct final digit is ${check}.`);
  const code = raw.slice(0, 12) + check;
  const left = ['0001101','0011001','0010011','0111101','0100011','0110001','0101111','0111011','0110111','0001011'];
  const leftG = ['0100111','0110011','0011011','0100001','0011101','0111001','0000101','0010001','0001001','0010111'];
  const right = ['1110010','1100110','1101100','1000010','1011100','1001110','1010000','1000100','1001000','1110100'];
  const parity = ['LLLLLL','LLGLGG','LLGGLG','LLGGGL','LGLLGG','LGGLLG','LGGGLL','LGLGLG','LGLGGL','LGGLGL'][Number(code[0])];
  let bits = '101';
  for (let i = 1; i <= 6; i++) bits += (parity[i-1] === 'L' ? left : leftG)[Number(code[i])];
  bits += '01010';
  for (let i = 7; i <= 12; i++) bits += right[Number(code[i])];
  bits += '101';
  const bars = [...bits].map((bit, i) => bit === '1' ? `<rect x="${i+10}" y="0" width="1" height="${i<3||(i>=45&&i<50)||i>=92?80:70}"/>` : '').join('');
  return `<!-- EAN-13 ${code}; verify assignment rights before using commercially -->\n<svg xmlns="http://www.w3.org/2000/svg" width="300" height="110" viewBox="0 0 115 110" role="img" aria-label="EAN-13 ${code}"><rect width="115" height="110" fill="white"/><g fill="black">${bars}</g><text x="57.5" y="91" text-anchor="middle" font-family="Arial,sans-serif" font-size="10">${code}</text></svg>`;
}

export function transformPopular(slug: string, text: string, values: ToolValues): string {
  switch (slug) {
    case 'random-number-generator': {
      const min=Number(values.minimum), max=Number(values.maximum), count=Number(values.count);
      if (!Number.isSafeInteger(min) || !Number.isSafeInteger(max) || min > max || !Number.isSafeInteger(count) || count < 1 || count > 100) throw new Error('Enter whole-number bounds with minimum ≤ maximum, and a count from 1 to 100.');
      if (values.unique === 'true' && BigInt(max)-BigInt(min)+1n<BigInt(count)) throw new Error('The range is too small for that many unique numbers.');
      const one=BigInt(1),range=BigInt(max)-BigInt(min)+one,limit=(one<<BigInt(64))-((one<<BigInt(64))%range),bytes=new Uint8Array(8),output:number[]=[];
      while(output.length<count){crypto.getRandomValues(bytes);let n=0n;for(const b of bytes)n=(n<<8n)+BigInt(b);if(n>=limit)continue;const candidate=Number(BigInt(min)+n%range);if(values.unique==='true'&&output.includes(candidate))continue;output.push(candidate);}
      return output.join('\n');
    }
    case 'password-strength-checker': {
      const password=required(values.password,'a password to check'), chars=[/[a-z]/.test(password),/[A-Z]/.test(password),/\d/.test(password),/[^\p{L}\p{N}]/u.test(password)].filter(Boolean).length;
      const pool=(/[a-z]/.test(password)?26:0)+(/[A-Z]/.test(password)?26:0)+(/\d/.test(password)?10:0)+(/[^\p{L}\p{N}]/u.test(password)?33:0);
      const bits=password.length*Math.log2(Math.max(pool,1)), common=/password|qwerty|letmein|welcome|admin|12345/i.test(password), score=common?0:bits<28?1:bits<45?2:bits<75?3:4;
      return `Strength estimate: ${['Very weak','Weak','Fair','Strong','Very strong'][score]}\nLength: ${[...password].length} characters\nCharacter groups used: ${chars} of 4\nApproximate search space: ${Math.round(bits)} bits\n\nThis is a local heuristic. It does not check breached-password databases or detect every predictable pattern. Use a unique password generated by a password manager.`;
    }
    case 'whatsapp-link-generator': {
      const phone=required(values.phone,'a phone number with country code').replace(/[\s()+.-]/g,'');
      if(!/^\d{7,15}$/.test(phone))throw new Error('Use 7–15 digits including the country code, with no extensions.');
      return `https://wa.me/${phone}${values.message?.trim()?'?text='+encodeURIComponent(values.message.trim()):''}`;
    }
    case 'mailto-link-generator': {
      const email=required(values.email,'an email address');if(!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email))throw new Error('Enter a valid email address.');
      const query=new URLSearchParams();if(values.subject?.trim())query.set('subject',values.subject.trim());if(values.body?.trim())query.set('body',values.body.trim());
      return `mailto:${email}${query.size?'?'+query.toString():''}`;
    }
    case 'email-signature-generator': {
      const esc=(s:string)=>(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
      const name=esc(required(values.name,'your name')),role=esc(values.role??''),company=esc(values.company??''),email=required(values.email,'your email'),safeEmail=esc(email);
      if(!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email))throw new Error('Enter a valid email address.');
      let website='';if(values.website?.trim()){const raw=values.website.trim(),url=new URL(/^https?:\/\//i.test(raw)?raw:'https://'+raw);if(!['http:','https:'].includes(url.protocol))throw new Error('Use an HTTP or HTTPS website address.');website=`<a href="${esc(url.href)}">${esc(raw)}</a>`;}
      const companyLine=[role,company].filter(Boolean).join(' · ');
      return `<table role="presentation" cellpadding="0" cellspacing="0" style="font-family:Arial,sans-serif;color:#222"><tr><td><strong>${name}</strong></td></tr>${companyLine?`<tr><td>${companyLine}</td></tr>`:''}<tr><td><a href="mailto:${safeEmail}">${safeEmail}</a></td></tr>${website?`<tr><td>${website}</td></tr>`:''}</table>`;
    }
    case 'svg-to-data-uri': {
      const svg=required(text,'SVG markup');if(svg.length>1024*1024||!/<svg\b/i.test(svg)||/<script\b|<foreignObject\b|\bon\w+\s*=|(?:href|src)\s*=\s*["'](?:https?:|\/\/|javascript:)/i.test(svg))throw new Error('Provide a static SVG under 1 MiB without script, event handlers, foreignObject or external URLs.');
      return 'data:image/svg+xml,'+encodeURIComponent(svg).replace(/%20/g,' ').replace(/%3D/gi,'=').replace(/%3A/gi,':').replace(/%2F/gi,'/');
    }
    case 'csv-to-tsv': {
      const rows=parseCsv(text);if(!rows.length||rows.some(row=>row.length!==rows[0].length))throw new Error('Provide CSV rows with a consistent number of columns.');
      const esc=(s:string)=>/[\t\r\n"]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s;
      return rows.map(row=>row.map(esc).join('\t')).join('\r\n');
    }
    case 'markdown-to-plain-text': {
      return text.replace(/```[\w-]*\s*\n([\s\S]*?)```/g,'$1').replace(/`([^`]+)`/g,'$1').replace(/!\[([^\]]*)\]\([^)]*\)/g,'$1').replace(/\[([^\]]+)\]\(([^)]+)\)/g,'$1 ($2)').replace(/^\s{0,3}#{1,6}\s+/gm,'').replace(/^\s*>\s?/gm,'').replace(/^\s*[-*+]\s+/gm,'• ').replace(/^\s*\d+\.\s+/gm,'').replace(/[*_~]{1,3}([^*_~]+)[*_~]{1,3}/g,'$1').replace(/\\([\\`*_{}\[\]()#+\-.!>])/g,'$1').replace(/<[^>]+>/g,'').replace(/\n{3,}/g,'\n\n').trim();
    }
    case 'vtt-to-srt': {
      if(!/^\uFEFF?WEBVTT(?:\s|$)/.test(text))throw new Error('The input must begin with a WEBVTT header.');
      const blocks=text.replace(/^\uFEFF?WEBVTT[^\r\n]*(?:\r?\n)?/,'').split(/\r?\n\s*\r?\n/).map(s=>s.trim()).filter(Boolean),cues:string[]=[];
      for(const block of blocks){if(/^(NOTE|STYLE|REGION)(?:\s|$)/.test(block))continue;const lines=block.split(/\r?\n/),at=lines.findIndex(line=>line.includes('-->'));if(at<0)continue;const timing=lines[at].replace(/\s+align:[^\s]+|\s+position:[^\s]+|\s+line:[^\s]+|\s+size:[^\s]+/g,'').replace(/\.(\d{3})/g,',$1');if(!/^\d{2}:\d{2}:\d{2},\d{3}\s+-->\s+\d{2}:\d{2}:\d{2},\d{3}$/.test(timing))throw new Error('Invalid cue timestamp: '+lines[at]);cues.push(`${cues.length+1}\r\n${timing}\r\n${lines.slice(at+1).join('\r\n')}`);}
      if(!cues.length)throw new Error('No subtitle cues were found.');return cues.join('\r\n\r\n')+'\r\n';
    }
    case 'ean13-barcode-generator': return ean13(text);
    default: throw new Error('Unknown popular utility.');
  }
}
