import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import ts from 'typescript';
import pngjs from 'pngjs';
import { readRegistry } from './content-registry.mjs';
const executable = process.env.CHROME_BIN || '/home/sonar/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome';
const origin = process.env.TEST_ORIGIN || 'http://127.0.0.1:3100';
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'utilixio-browser-'));
const browser = spawn(executable, ['--headless=new','--no-sandbox','--disable-dev-shm-usage','--no-first-run','--no-default-browser-check','--remote-debugging-pipe',`--user-data-dir=${profile}`], { stdio:['ignore','ignore','pipe','pipe','pipe'] });
let nextId = 0, buffer = '', stderr = '';
const pending = new Map(), listeners = [];
browser.stderr.on('data', d => { stderr = (stderr + d).slice(-5000); });
function failPending(error) {
  for (const item of pending.values()) { clearTimeout(item.timer); item.reject(error); }
  pending.clear();
}
browser.on('error', failPending);
browser.stdio[3].on('error', failPending);
browser.stdio[4].on('error', failPending);
browser.on('exit', () => { if (pending.size) failPending(new Error('Chromium exited before completing checks. ' + stderr)); });
browser.stdio[4].on('data', chunk => {
  buffer += chunk;
  while (buffer.includes('\0')) {
    const end = buffer.indexOf('\0'), raw = buffer.slice(0, end); buffer = buffer.slice(end + 1);
    if (!raw) continue;
    const message = JSON.parse(raw);
    if (message.id) { const item = pending.get(message.id); if (item) { clearTimeout(item.timer); pending.delete(message.id); if (message.error) item.reject(new Error(JSON.stringify(message.error))); else item.resolve(message.result); } }
    else for (const listener of listeners) listener(message);
  }
});
function send(method, params = {}, sessionId) {
  return new Promise((resolve, reject) => {
    const id = ++nextId, timer = setTimeout(() => { pending.delete(id); reject(new Error(`Timed out: ${method}\n${stderr}`)); }, 20000);
    pending.set(id,{resolve,reject,timer});
    browser.stdio[3].write(JSON.stringify({id,method,params,...(sessionId?{sessionId}:{})})+'\0');
  });
}
let checks = 0;
try {
  const { targetId } = await send('Target.createTarget',{url:'about:blank'});
  const { sessionId } = await send('Target.attachToTarget',{targetId,flatten:true});
  const call = (method, params) => send(method, params, sessionId);
  await call('Runtime.enable'); await call('Page.enable');
  const errors = [];
  const conversionRequests = [];
  const unexpectedDiscoveryRequests = [];
  await call('Network.enable');
  listeners.push(message => {
    if (message.sessionId !== sessionId) return;
    if (message.method === 'Network.requestWillBeSent' && message.params.request.url.startsWith(origin+'/api/convert/')) conversionRequests.push(message.params.request.url);
    if (message.method === 'Network.requestWillBeSent' && message.params.request.url.startsWith('https://example.invalid/')) unexpectedDiscoveryRequests.push(message.params.request.url);
    if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails.text + ': ' + (message.params.exceptionDetails.exception?.description ?? ''));
    if (message.method === 'Fetch.requestPaused') {
      const p=message.params, allowed = p.request.url.startsWith(origin + '/') || /^(?:data:|blob:)/.test(p.request.url);
      void call(allowed?'Fetch.continueRequest':'Fetch.failRequest',allowed?{requestId:p.requestId}:{requestId:p.requestId,errorReason:'BlockedByClient'}).catch(()=>{});
    }
  });
  async function evaluate(expression) {
    const r=await call('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description ?? r.exceptionDetails.text);
    return r.result.value;
  }
  async function waitFor(expression) {
    const start = Date.now();
    while (Date.now() - start < 12000) { if(await evaluate(expression)) return; await new Promise(r=>setTimeout(r,100)); }
    throw new Error('Browser condition not met: '+expression+' | '+await evaluate(`location.pathname + ': ' + (document.querySelector('[role=alert]')?.textContent ?? '')`));
  }
  // Exercise real DOM parsing and canvas APIs with the production transform source.
  const transpile = file => ts.transpile(fs.readFileSync(file,'utf8'),{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}).replace(/^export /gm,'');
  const discoveryFixture="\n    let discoveryChecks=0; const discoveryEqual=(a,b)=>{equal(a,b);discoveryChecks++;};\n    const discoveryJson=(slug,text,values={})=>JSON.parse(calculateGrowth(slug,text,values).text);\n    const css=discoveryJson('css-selector-tester','<ul><li class=\"active\" data-id=\"1\">Ada &amp; Linus</li><li>Grace</li></ul>',{selector:'li.active'});\n    discoveryEqual(css.count,1);discoveryEqual(css.matches[0].attributes['data-id'],'1');discoveryEqual(css.matches[0].text,'Ada & Linus');\n    discoveryEqual(discoveryJson('css-selector-tester','<p>A</p><p>B</p>',{selector:'p'}).count,2);\n    discoveryEqual(discoveryJson('css-selector-tester','<p>A</p>',{selector:'section'}).count,0);\n    discoveryEqual(discoveryJson('css-selector-tester','</div><p>A</p><p>B</p>',{selector:'p'}).count,2);\n    let badSelector=false;try{calculateGrowth('css-selector-tester','<p>A</p>',{selector:'['});}catch{badSelector=true;}discoveryEqual(badSelector,true);\n    const xpath=discoveryJson('xpath-tester','<ul><li data-id=\"1\">Ada</li><li data-id=\"2\">Grace</li></ul>',{expression:'.//li/@data-id'});\n    discoveryEqual(xpath.count,2);discoveryEqual(xpath.matches[1].type,'attribute');discoveryEqual(xpath.matches[1].value,'2');\n    discoveryEqual(discoveryJson('xpath-tester','<p>A</p><p>B</p>',{expression:'count(.//p)'}).value,2);\n    discoveryEqual(discoveryJson('xpath-tester','<p>A</p>',{expression:'string(.//p)'}).value,'A');\n    discoveryEqual(discoveryJson('xpath-tester','<p>A</p>',{expression:'boolean(.//h1)'}).value,false);\n    discoveryEqual(discoveryJson('xpath-tester','<p>A</p>',{expression:'.//p'}).matches[0].tag,'p');\n    discoveryEqual(discoveryJson('xpath-tester','<p>A</p>',{expression:'.//missing'}).count,0);\n    const outline=discoveryJson('html-heading-extractor','<h1 id=\"title\">A &amp; B</h1><h2>Next</h2><h4>Skipped</h4>');\n    discoveryEqual(outline.headings.length,3);discoveryEqual(outline.headings[0].text,'A & B');discoveryEqual(outline.headings[0].id,'title');discoveryEqual(outline.notes.length,1);\n    discoveryEqual(discoveryJson('html-heading-extractor','<h1>A</h1><h1>B</h1>').notes.length,1);\n    discoveryEqual(discoveryJson('html-heading-extractor','<h2></h2>').notes.length,2);\n    calculateGrowth('css-selector-tester','<script>window.__discoveryExecuted=true;</script><img src=\"https://example.invalid/untrusted.png\" onerror=\"window.__discoveryExecuted=true\"><iframe src=\"https://example.invalid/frame\"></iframe>',{selector:'img'});\n    discoveryEqual(window.__discoveryExecuted,undefined);discoveryEqual(document.querySelector('img[src=\"https://example.invalid/untrusted.png\"]'),null);\n    if(RegExp.escape)for(const input of ['abc','1a','a-b','\\n\\t x','\ud83d\ude00\u00e9\\u2028','\\ud800','@\"#&'])discoveryEqual(escapeRegexLiteral(input),RegExp.escape(input));\n\n    discoveryEqual(discoveryJson('xpath-tester','<p>A</p>',{expression:'1 div 0'}).value,'Infinity');\n";
  const everydayFixture="\n    let everydayChecks=0;const everydayEqual=(a,b)=>{equal(a,b);everydayChecks++;};\n    const everydayData=(slug,input,values={})=>JSON.parse(calculateGrowth(slug,input,values).text);\n    const alt=everydayData('html-image-alt-checker','<img src=\"https://example.invalid/alt-check.jpg\"><img alt=\"\"><img alt=\"  \"><img alt=\"A &amp; B\">');\n    everydayEqual(alt.total,4);everydayEqual(alt.missing,1);everydayEqual(alt.empty,1);everydayEqual(alt.whitespaceOnly,1);everydayEqual(alt.images[3].alt,'A & B');\n    const forms=everydayData('html-form-inspector','<input form=\"signup\" name=\"outside\"><form id=\"signup\" action=\"/join\" method=\"post\"><label for=\"email\">Email</label><input id=\"email\" name=\"email\" type=\"email\" required><input type=\"password\" name=\"password\" value=\"NEVER_REPORT_THIS_PASSWORD\"><label>Notes<textarea name=\"notes\">NEVER_REPORT_THIS_TEXT</textarea></label><fieldset disabled><input name=\"disabled\"></fieldset><select name=\"plan\"><option>Free</option><option selected>Pro</option></select><button>Join</button></form><input name=\"orphan\">');\n    everydayEqual(forms.forms.length,1);everydayEqual(forms.forms[0].method,'POST');everydayEqual(forms.forms[0].action,'/join');\n    const fields=forms.forms[0].controls;\n    everydayEqual(fields.some(f=>f.name==='outside'),true);\n    everydayEqual(fields.find(f=>f.name==='email').required,true);\n    everydayEqual(fields.find(f=>f.name==='email').labels[0],'Email');\n    everydayEqual(fields.find(f=>f.name==='disabled').disabled,true);\n    everydayEqual(fields.find(f=>f.name==='notes').labels[0],'Notes');\n    everydayEqual(fields.find(f=>f.name==='plan').options[1].selected,true);\n    everydayEqual(forms.unassociatedControls.length,1);\n    everydayEqual(JSON.stringify(forms).includes('NEVER_REPORT_THIS'),false);\n    everydayEqual(everydayData('html-form-inspector','<form><input name=\"x\"></form>').forms[0].method,'GET');\n    calculateGrowth('html-form-inspector','<script>window.__everydayExecuted=true;</script><form><img src=\"https://example.invalid/form.jpg\"><input name=\"safe\"></form>',{});\n    everydayEqual(window.__everydayExecuted,undefined);\n\n    everydayEqual(everydayData('html-form-inspector','<div id=\"f\"></div><form id=\"f\"><input form=\"f\" name=\"x\"></form>').unassociatedControls.length,1);\n    everydayEqual(everydayData('html-form-inspector','<form id=\"f\"><input form=\"missing\" name=\"x\"></form>').unassociatedControls.length,1);\n    everydayEqual(everydayData('html-form-inspector','<form><label>Wrapped<input name=\"x\"></label></form>').forms[0].controls[0].labels[0],'Wrapped');\n    everydayEqual(everydayData('html-form-inspector','<label for=\"h\">Hidden</label><form><input id=\"h\" type=\"hidden\"></form>').forms[0].controls[0].labels.length,0);\n";
  const transformSource=transpile('lib/growth-transforms.ts'), fileSource=transpile('lib/growth-files.ts');
  const fixture = await evaluate(`(async()=>{ ${transformSource}\n${fileSource}\n
    const equal=(a,b)=>{if(a!==b)throw new Error(JSON.stringify({actual:a,expected:b}));};
    ${discoveryFixture}
    ${everydayFixture}
    equal(tableToCsv('<table><tr><th>Name</th><th>Note</th></tr><tr><td>Ada &amp; Linus</td><td>a,b<br>c</td></tr></table>'),'Name,Note\\r\\nAda & Linus,"a,b\\nc"');
    let rejected=false;try{tableToCsv('<table><tr><td colspan="2">x</td></tr></table>')}catch{rejected=true}if(!rejected)throw new Error('Merged cells accepted');
    equal(tableToCsv('<table><tr><td>Safe<script>throw new Error("executed")<\\/script><style>bad</style></td></tr></table>'),'Safe');
    const canvas=document.createElement('canvas');canvas.width=4;canvas.height=2;const ctx=canvas.getContext('2d');ctx.fillStyle='#ff0000';ctx.fillRect(0,0,2,2);
    const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));
    const file=new File([blob],'source.png',{type:'image/png'});
    const resized=await processImage(file,'image-resizer',{width:'8',height:'3',lock:'true'});equal(resized.width,8);equal(resized.height,4);equal(resized.blob.type,'image/png');
    const exact=await processImage(file,'image-resizer',{width:'8',height:'3',lock:'false'});equal(exact.height,3);
    const jpeg=await processImage(file,'image-format-converter',{format:'image/jpeg'});equal(jpeg.blob.type,'image/jpeg');
    const bitmap=await createImageBitmap(jpeg.blob);const check=document.createElement('canvas');check.width=4;check.height=2;const c=check.getContext('2d');c.drawImage(bitmap,0,0);const pixel=c.getImageData(3,0,1,1).data;if(pixel[0]<200||pixel[1]<200||pixel[2]<200)throw new Error('JPEG transparency was not flattened to white');bitmap.close();
    const webp=await processImage(file,'image-compressor',{format:'image/webp',quality:'50'});equal(webp.blob.type,'image/webp');equal(webp.width,4);
    const cropped=await processImage(file,'image-cropper',{x:'50',y:'0',cropWidth:'50',cropHeight:'100'});equal(cropped.width,2);equal(cropped.height,2);
    const cropBitmap=await createImageBitmap(cropped.blob);c.clearRect(0,0,4,2);c.drawImage(cropBitmap,0,0);equal(c.getImageData(0,0,1,1).data[3],0);cropBitmap.close();
    const rotated=await processImage(file,'image-rotate-flip',{rotation:'90',flip:'none'});equal(rotated.width,2);equal(rotated.height,4);
    const reversed=await processImage(file,'image-rotate-flip',{rotation:'0',flip:'horizontal'});const reverseBitmap=await createImageBitmap(reversed.blob);c.clearRect(0,0,4,2);c.drawImage(reverseBitmap,0,0);equal(c.getImageData(0,0,1,1).data[3],0);if(c.getImageData(3,0,1,1).data[0]<250)throw new Error('Horizontal flip failed');reverseBitmap.close();
    const icons=await faviconFiles(file,{fit:'contain',padding:'10'});equal(icons.length,8);const ico=icons.find(f=>f.name==='favicon.ico');const icoBytes=new Uint8Array(await ico.blob.arrayBuffer());equal(new DataView(icoBytes.buffer).getUint16(4,true),3);
    const iconBitmap=await createImageBitmap(ico.blob);if(![16,32,48].includes(iconBitmap.width))throw new Error('Invalid decoded ICO dimensions');iconBitmap.close();
    const zipped=storedZip(await Promise.all(icons.map(async f=>({name:f.name,bytes:new Uint8Array(await f.blob.arrayBuffer())}))));
    const vector='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><rect width="5" height="10" fill="red"/></svg>';
    const rendered=await svgPng(vector,40,40,'transparent');equal(rendered.type,'image/png');const svgBitmap=await createImageBitmap(rendered);equal(svgBitmap.width,40);equal(svgBitmap.height,40);svgBitmap.close();
    for(const fragment of ['<script/>','<image href="https://example.com/image.png"/>','<rect style="fill:url(https://example.com/x)"/>','<rect onclick="alert(1)"/>','<g xml:base="https://example.com/"><use href="#x"/></g>']){let caught=false;try{prepareStaticSvg('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10">'+fragment+'</svg>',40,40)}catch{caught=true}if(!caught)throw new Error('Unsafe SVG accepted');}
    const links=JSON.parse(extractHtmlLinks('<base href="https://ignored.example/"><a href="../docs?q=1&amp;x=2"><span> Docs </span><script>bad<\\/script></a><a href="//other.example/path" rel="NOFOLLOW noopener">Partner</a><a href="javascript:alert(1)">Skip</a><a href="../docs?q=1&amp;x=2">Duplicate</a>',{base:'https://example.com/base/page',unique:'true'}));
    equal(links.length,2);equal(links[0].url,'https://example.com/docs?q=1&x=2');equal(links[0].text,'Docs');equal(links[0].sameOrigin,true);equal(links[1].nofollow,true);equal(links[1].sameOrigin,false);
    const area=JSON.parse(extractHtmlLinks('<map><area href="/map" alt="Map link"></map>',{base:'https://example.com/',unique:'false'}));equal(area[0].text,'Map link');
    const caption='1\\n00:00:01,000 --> 00:00:02,000\\n<b>Hello &amp; welcome</b>\\n\\n2\\n00:00:03,000 --> 00:00:04,000\\nHello &amp; welcome';
    equal(subtitleTranscript(caption,{format:'srt',dedupe:'true'}),'Hello & welcome');
    const gray=await processImage(file,'image-grayscale',{});const grayBitmap=await createImageBitmap(gray.blob);c.clearRect(0,0,4,2);c.drawImage(grayBitmap,0,0);const gp=c.getImageData(0,0,1,1).data;equal(gp[0],gp[1]);equal(gp[1],gp[2]);equal(gp[0],54);equal(c.getImageData(3,0,1,1).data[3],0);grayBitmap.close();
    const redSample=sampledPixel([255,0,0,255],0,0);equal(redSample.hex,'#ff0000');
    const large=document.createElement('canvas');large.width=120;large.height=60;const lc=large.getContext('2d');lc.fillStyle='black';lc.fillRect(0,0,120,60);const largeBlob=await new Promise(resolve=>large.toBlob(resolve,'image/png'));
    const watermark=await processImage(new File([largeBlob],'large.png',{type:'image/png'}),'image-watermark',{text:'Hi',fontSize:'24',opacity:'100',color:'#ffffff',position:'center'});
    const wm=await createImageBitmap(watermark.blob);lc.drawImage(wm,0,0);if(!Array.from(lc.getImageData(0,0,120,60).data).some((v,i)=>i%4===0&&v>200))throw new Error('Watermark text was not painted');wm.close();
    const pdf=await imagePdf(file,{paper:'a4',orientation:'portrait',margin:'24'});equal(pdf.type,'application/pdf');
    return {base64:encodeBase64(new Uint8Array(await blob.arrayBuffer())),zip:encodeBase64(zipped),pdf:encodeBase64(new Uint8Array(await pdf.arrayBuffer())),checks:26+discoveryChecks+everydayChecks};
  })()`);
  checks+=fixture.checks;
  const zipCheck=spawnSync('python3',['-c',`import sys,io,zipfile,base64,struct,json
z=zipfile.ZipFile(io.BytesIO(base64.b64decode(sys.stdin.read())))
assert z.testzip() is None
assert len(z.namelist())==8
for name,size in [('icon-16.png',16),('icon-32.png',32),('apple-touch-icon.png',180),('icon-192.png',192),('icon-512.png',512)]:
 assert struct.unpack('>II',z.read(name)[16:24])==(size,size)
ico=z.read('favicon.ico')
assert struct.unpack('<HHH',ico[:6])==(0,1,3)
for i in range(3):
 entry=ico[6+i*16:22+i*16]
 size,offset=struct.unpack('<II',entry[8:16])
 assert ico[offset:offset+4]==bytes([137,80,78,71]) and offset+size<=len(ico)
assert len(json.loads(z.read('site.webmanifest'))['icons'])==2
`],{input:fixture.zip,encoding:'utf8',timeout:15000});
  assert.equal(zipCheck.status,0,zipCheck.stderr||String(zipCheck.error));checks++;
  const pdfBytes=Buffer.from(fixture.pdf,'base64');
  const pdfCheck=spawnSync('pdfinfo',['-'],{input:pdfBytes,encoding:'utf8',timeout:15000});assert.equal(pdfCheck.status,0,pdfCheck.stderr);assert.match(pdfCheck.stdout,/Pages:\s+1/);assert.match(pdfCheck.stdout,/595\.28 x 841\.89/);checks++;
  const pdfPreview=path.join(profile,'pdf-preview');const renderedPdf=spawnSync('pdftoppm',['-singlefile','-scale-to','160','-png','-',pdfPreview],{input:pdfBytes,timeout:15000});assert.equal(renderedPdf.status,0,String(renderedPdf.stderr));
  const page=pngjs.PNG.sync.read(fs.readFileSync(pdfPreview+'.png'));let redPixels=0;for(let i=0;i<page.data.length;i+=4)if(page.data[i]>180&&page.data[i+1]<100&&page.data[i+2]<100)redPixels++;assert.ok(redPixels>10,'Rendered PDF must contain the source red image pixels');checks++;
  assert.deepEqual(unexpectedDiscoveryRequests, [], 'Inert pasted HTML must not load remote resources'); checks++;
  if (process.argv.includes('--fixtures-only')) { console.log(`${checks} browser fixture checks passed without a running site.`); } else {
  const fixturePath=path.join(profile,'fixture.png');fs.writeFileSync(fixturePath,Buffer.from(fixture.base64,'base64'));
  await call('Fetch.enable',{patterns:[{urlPattern:'*'}]});
  const tools=readRegistry('lib/growth-tools.ts');
  const total=72+readRegistry('lib/expansion-tools.ts').length+tools.length;
  const recentCount=1;
  for(const tool of tools){
    await call('Page.navigate',{url:origin+'/tools/'+tool.slug});
    await waitFor(`document.querySelector('h1')?.textContent === ${JSON.stringify(tool.title)}`);
    // Wait for hydration before interacting with the server-rendered controls.
    await waitFor(`document.querySelector('button') && Object.keys(document.querySelector('button')).some(k=>k.startsWith('__reactProps'))`);
    if(tool.server){
      if(tool.server.input==='files'){await evaluate(`Array.from(document.querySelectorAll('button')).find(b=>b.textContent==='Load example').click()`);await waitFor(`document.querySelector('.server-file-list li') && !document.querySelector('.btn-convert').disabled`);}
      assert.ok((await evaluate(`document.querySelector('.server-processing-note')?.textContent`)).includes('sent to this site'));checks++;
    }else if(tool.kind==='image'){
      const {root}=await call('DOM.getDocument',{});const {nodeId}=await call('DOM.querySelector',{nodeId:root.nodeId,selector:'#source-image'});await call('DOM.setFileInputFiles',{nodeId,files:[fixturePath]});
      await waitFor(`!document.querySelector('.btn-convert').disabled`);
    }else if(tool.kind==='file') await evaluate(`Array.from(document.querySelectorAll('button')).find(b=>b.textContent==='Load example').click()`);
    const requestCount=conversionRequests.length;
    await evaluate(`document.querySelector('.btn-convert').click()`);
    await waitFor(tool.kind==='image'?`!!document.querySelector('.growth-status')`:`!!document.querySelector('#${tool.kind==='file'?'file-result':'growth-result'}')`);
    const error=await evaluate(`document.querySelector('[role=alert]')?.textContent ?? ''`);assert.equal(error,'',tool.slug);
    const headingCount=await evaluate(`document.querySelectorAll('h1').length`);assert.equal(headingCount,1);
    if(['env-diff','shell-argument-escaper','sms-segment-calculator','css-media-query-generator','color-harmony-generator','openapi-operation-extractor','har-analyzer','cache-control-parser','email-header-parser','curl-command-builder','sql-placeholder-converter','json-key-case-converter','json-array-sorter','csv-to-json-lines','ascii-table-generator','fraction-calculator','prime-factorization','matrix-calculator','quadratic-equation-solver','binomial-probability-calculator','css-pattern-generator','css-border-generator','css-outline-generator','unix-timestamp-batch-converter','text-frequency-analyzer','age-calculator','discount-calculator','tip-calculator','loan-calculator','compound-interest-calculator','final-grade-calculator','gpa-calculator','recipe-scaler','stopwatch-timer'].includes(tool.slug)){assert.equal(conversionRequests.length,requestCount,tool.slug+': local processing must not call the conversion API');checks++;}
    if(['age-calculator','discount-calculator','tip-calculator','loan-calculator','compound-interest-calculator','final-grade-calculator','gpa-calculator','recipe-scaler'].includes(tool.slug)){assert.equal(await evaluate(`document.querySelectorAll('.public-result-summary>div').length`),4);checks++;}
    if(['heic-to-jpg','image-target-size','image-dpi-converter','passport-photo-maker'].includes(tool.slug)){await waitFor(`document.querySelector('.public-image-result img')?.naturalWidth>0`);checks++;}
    if(tool.server?.warning){assert.ok((await evaluate(`document.querySelector('.public-format-note')?.textContent`)).includes(tool.server.warning));checks++;}
    if(tool.slug==='gpa-calculator'){
      assert.equal(await evaluate(`document.querySelector('.public-result-summary dd').textContent`),'3.630');checks++;
      await evaluate(`(()=>{const el=document.querySelector('[aria-label="Grade, row 1"]');Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(el,'F');el.dispatchEvent(new Event('input',{bubbles:true}));})()`);
      await evaluate(`document.querySelector('.btn-convert').click()`);await waitFor(`document.querySelector('.public-result-summary dd')?.textContent==='2.430'`);checks++;
    }
    if(tool.slug==='recipe-scaler'){
      assert.equal(await evaluate(`document.querySelector('[aria-label="Amount, row 2"]').value`),'1/2');checks++;
      await evaluate(`Array.from(document.querySelectorAll('button')).find(b=>b.textContent==='+ Add row').click()`);await waitFor(`document.querySelectorAll('.public-input-table tbody tr').length===5`);checks++;
      await evaluate(`document.querySelector('[aria-label="Remove row 5"]').click()`);await waitFor(`document.querySelectorAll('.public-input-table tbody tr').length===4`);checks++;
      await evaluate(`document.querySelector('.btn-convert').click()`);await waitFor(`!!document.querySelector('#growth-result')`);
    }
    if(['mp4-to-mp3','audio-trimmer','audio-merger','audio-speed-changer'].includes(tool.slug)){assert.ok(await evaluate(`!!document.querySelector('.public-media-result audio')`));checks++;}
    if(['video-compressor','video-resizer','video-to-webm','mute-video'].includes(tool.slug)){assert.ok(await evaluate(`!!document.querySelector('.public-media-result video')`));checks++;}
    if(tool.slug==='pdf-password-protect'||tool.slug==='pdf-unlock'){assert.equal(await evaluate(`document.querySelector('#option-password').type`),'password');checks++;}
    if(tool.slug==='stopwatch-timer'){
      await evaluate(`(()=>{for(const [id,value] of [['option-minutes','0'],['option-seconds','1']]){const el=document.getElementById(id);Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(el,value);el.dispatchEvent(new Event('input',{bubbles:true}));}})()`);
      await evaluate(`document.querySelector('.btn-convert').click()`);await waitFor(`document.querySelector('.live-timer-clock')?.textContent==='00:00:01'`);
      await evaluate(`document.querySelector('.timer-toggle').click()`);await waitFor(`!!document.querySelector('.timer-finished')`);checks++;
      await evaluate(`(()=>{const el=document.querySelector('#option-mode');el.value='stopwatch';el.dispatchEvent(new Event('change',{bubbles:true}));})()`);await evaluate(`document.querySelector('.btn-convert').click()`);await waitFor(`document.querySelector('.live-timer h2')?.textContent==='Stopwatch'`);
      await evaluate(`document.querySelector('.timer-toggle').click()`);await waitFor(`document.querySelector('.live-timer-clock')?.textContent!=='00:00:00'`);await evaluate(`Array.from(document.querySelectorAll('button')).find(b=>b.textContent==='Lap').click()`);assert.equal(await evaluate(`document.querySelectorAll('.timer-laps li').length`),1);checks++;
      await evaluate(`document.querySelector('.timer-toggle').click()`);assert.equal(await evaluate(`document.querySelector('.timer-toggle').textContent`),'Resume');checks++;
    }
    if(tool.slug==='json-schema-validator'){assert.equal(await evaluate(`JSON.parse(document.querySelector('#growth-result').value).valid`),true);assert.ok(await evaluate(`!!document.querySelector('#server-second')`));checks++;}
    if(tool.slug==='env-diff'){assert.equal(await evaluate(`JSON.parse(document.querySelector('#growth-result').value).valuesRedacted`),true);checks++;}
    if(tool.slug==='color-harmony-generator'){assert.equal(await evaluate(`document.querySelectorAll('.palette-swatch').length`),3);checks++;}
    if(tool.slug==='css-media-query-generator'){
      await waitFor(`document.querySelector('[data-media-match]')?.dataset.mediaMatch==='true'`);checks++;
      await call('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});await waitFor(`document.querySelector('[data-media-match]')?.dataset.mediaMatch==='false'`);checks++;
      await call('Emulation.setDeviceMetricsOverride',{width:1024,height:768,deviceScaleFactor:1,mobile:false});
    }
    if(tool.slug==='image-color-picker'){
      await evaluate(`(()=>{const canvas=document.querySelector('.pixel-canvas-stage canvas'),rect=canvas.getBoundingClientRect();canvas.dispatchEvent(new MouseEvent('click',{bubbles:true,clientX:rect.right-.5,clientY:rect.top+.5}));})()`);
      await waitFor(`document.querySelector('#growth-result') && JSON.parse(document.querySelector('#growth-result').value).x===3`);
      assert.equal(await evaluate(`JSON.parse(document.querySelector('#growth-result').value).rgba[3]`),0);checks++;
    }
    if(tool.slug==='srt-to-vtt'){
      await evaluate(`(()=>{const original=HTMLAnchorElement.prototype.click;HTMLAnchorElement.prototype.click=function(){window.__downloadName=this.download};Array.from(document.querySelectorAll('button')).find(b=>b.textContent==='Download result').click();HTMLAnchorElement.prototype.click=original;})()`);
      assert.equal(await evaluate(`window.__downloadName`),'srt-to-vtt.vtt');checks++;
    }
    if(tool.slug==='css-keyframes-generator'){
      assert.equal(await evaluate(`getComputedStyle(document.querySelector('.animation-demo')).animationName`),'utilixio-slide');checks++;
      await call('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
      assert.equal(await evaluate(`getComputedStyle(document.querySelector('.animation-demo')).animationName`),'none');checks++;
      await call('Emulation.setEmulatedMedia',{features:[]});
    }
    if(tool.slug==='css-triangle-generator'){assert.equal(await evaluate(`getComputedStyle(document.querySelector('.triangle-demo')).borderBottomWidth`),'80px');checks++;}
    if(tool.slug==='css-filter-generator'){assert.ok((await evaluate(`getComputedStyle(document.querySelector('.growth-design-preview')).filter`)).includes('hue-rotate(20deg)'));checks++;}
    if(tool.slug==='css-flexbox-generator'){assert.equal(await evaluate(`document.querySelector('.flex-demo').children.length`),8);checks++;}
    if(tool.slug==='cubic-bezier-generator'){
      assert.equal(await evaluate(`!!document.querySelector('.bezier-preview svg')`),true);checks++;
      await call('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
      assert.equal(await evaluate(`getComputedStyle(document.querySelector('.bezier-ball')).animationName`),'none');checks++;
      await call('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'no-preference'}]});
    }
    if(tool.slug==='css-grid-generator'){
      assert.equal(await evaluate(`document.querySelector('.css-grid-preview').children.length`),9);
      assert.equal(await evaluate(`getComputedStyle(document.querySelector('.css-grid-preview')).display`),'grid');checks++;
    }
    if(tool.slug==='bcrypt-generator'){
      const hash=await evaluate(`document.querySelector('#growth-result').value`);assert.match(hash,/^\$2[aby]\$10\$/);
      await evaluate(`(()=>{const select=document.querySelector('#option-mode');select.value='verify';select.dispatchEvent(new Event('change',{bubbles:true}));})()`);
      await waitFor(`!!document.querySelector('#bcrypt-hash')`);
      await evaluate(`(()=>{const el=document.querySelector('#bcrypt-hash');Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value').set.call(el,${JSON.stringify(hash)});el.dispatchEvent(new Event('input',{bubbles:true}));})()`);
      await evaluate(`document.querySelector('.btn-convert').click()`);
      await waitFor(`document.querySelector('#growth-result')?.value.startsWith('MATCH')`);checks++;
    }
    checks++;
  }
  await call('Emulation.setDeviceMetricsOverride',{width:1360,height:1000,deviceScaleFactor:1,mobile:false});
  await call('Page.navigate',{url:origin+'/'});
  await waitFor(`!!document.querySelector('#tool-search') && Object.keys(document.querySelector('#tool-search')).some(k=>k.startsWith('__reactProps'))`);
  assert.equal(await evaluate(`document.querySelectorAll('.directory-card').length`),total); checks++;
  assert.equal(await evaluate(`document.querySelectorAll('.directory-group').length`),9); checks++;
  assert.equal(await evaluate(`document.querySelectorAll('.directory-group[open]').length`),0); checks++;
  await call('Input.dispatchKeyEvent',{type:'keyDown',key:'/',code:'Slash'});
  await call('Input.dispatchKeyEvent',{type:'keyUp',key:'/',code:'Slash'});
  assert.equal(await evaluate(`document.activeElement.id`),'tool-search'); checks++;
  async function search(value) {
    await evaluate(`(()=>{const el=document.querySelector('#tool-search');Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(el,${JSON.stringify(value)});el.dispatchEvent(new Event('input',{bubbles:true}));})()`);
  }
  await search('JSON to Rust');
  await waitFor(`document.querySelectorAll('.directory-card').length===1`);
  assert.ok((await evaluate(`document.querySelector('.directory-card').textContent`)).includes('Rust')); checks++;
  await search('no-such-task-zzzz');
  await waitFor(`!!document.querySelector('.directory-empty')`); checks++;
  await evaluate(`document.querySelector('.directory-empty button').click()`);
  await waitFor(`document.querySelectorAll('.directory-card').length===${total}`);
  await evaluate(`Array.from(document.querySelectorAll('.directory-categories button')).find(b=>b.textContent.startsWith('PDF, photos & media')).click()`);
  await waitFor(`document.querySelectorAll('.directory-card').length===64`);
  assert.equal(await evaluate(`document.querySelector('.directory-group').open`),true); checks++;
  await evaluate(`document.querySelector('.directory-categories button').click();document.querySelector('.directory-recent input').click()`);
  await waitFor(`document.querySelectorAll('.directory-card').length===${recentCount}`); checks++;
  await evaluate(`document.querySelector('.directory-recent input').click()`);
  await waitFor(`document.querySelectorAll('.directory-card').length===${total}`);
  await evaluate(`document.querySelector('.directory-group summary').click()`);
  assert.equal(await evaluate(`document.querySelector('.directory-group').open`),true); checks++;
  await evaluate(`document.querySelector('.directory-group summary').click()`);
  await evaluate(`new Promise(resolve=>setTimeout(resolve,450))`);
  const desktop=await call('Page.captureScreenshot',{format:'png'});fs.writeFileSync('/tmp/utilixio-home-desktop.png',Buffer.from(desktop.data,'base64'));
  // Responsive rendering: the generated controls, editors and image previews fit a phone viewport.
  await call('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
  for(const slug of ['image-resizer','css-border-radius-generator','list-compare','qr-code-generator','favicon-generator','json-patch-tester','css-grid-generator','html-link-extractor','bcrypt-generator','image-color-picker','image-to-pdf','css-flexbox-generator','cubic-bezier-generator','srt-to-vtt','csv-join','xpath-tester','text-find-replace','semver-compare','business-days-calculator','unit-converter','csv-unpivot','css-keyframes-generator','css-triangle-generator','css-filter-generator','pdf-merger','docx-converter','text-to-pdf','text-encoding-converter','pdf-form-filler','zip-extractor','wav-normalizer','markdown-to-docx','json-schema-validator','env-diff','color-harmony-generator','css-media-query-generator','matrix-calculator','css-pattern-generator','fraction-calculator','curl-command-builder','image-to-text','passport-photo-maker','gpa-calculator','recipe-scaler','loan-calculator','stopwatch-timer','home']){
    await call('Page.navigate',{url:slug==='home'?origin+'/':origin+'/tools/'+slug});
    await waitFor(`document.querySelector('h1') && document.querySelector('h1').textContent === ${JSON.stringify(slug==='home'?'Free online tools.Less busywork.':tools.find(t=>t.slug===slug).title)}`);
    const sizes=await evaluate(`({scroll:document.documentElement.scrollWidth,width:window.innerWidth})`);
    assert.ok(sizes.scroll<=sizes.width+1,slug+': mobile horizontal overflow '+JSON.stringify(sizes));checks++;
    if(slug==='home'){
      await evaluate(`new Promise(resolve=>setTimeout(resolve,450))`);
      const shot=await call('Page.captureScreenshot',{format:'png'});fs.writeFileSync('/tmp/utilixio-home-mobile.png',Buffer.from(shot.data,'base64'));
      await evaluate(`document.documentElement.dataset.theme='light'`);
      const light=await call('Page.captureScreenshot',{format:'png'});fs.writeFileSync('/tmp/utilixio-home-light.png',Buffer.from(light.data,'base64'));
    }
  }
  assert.deepEqual(errors,[],'Browser runtime exceptions');
  console.log(`${checks} browser checks passed: DOM table extraction, real canvas encoding, all ${tools.length} tool interfaces, mobile layouts, homepage search, category filters, recent tools and keyboard navigation.`);
  }
} finally {
  for(const item of pending.values())clearTimeout(item.timer);
  browser.kill('SIGTERM');
}
