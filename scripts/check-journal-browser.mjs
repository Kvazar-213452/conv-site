import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
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

  await call('Fetch.enable',{patterns:[{urlPattern:'*'}]});
  await call('Emulation.setDeviceMetricsOverride',{width:1360,height:1000,deviceScaleFactor:1,mobile:false});
  await call('Page.navigate',{url:origin+'/blog'});
  await waitFor(`document.querySelector('#blog-search') && Object.keys(document.querySelector('#blog-search')).some(k=>k.startsWith('__reactProps'))`);
  await waitFor(`document.querySelector('.journal-feature-image img')?.naturalWidth>0`);
  assert.equal(await evaluate(`document.querySelectorAll('.journal-grid>.journal-card').length`),52);checks++;
  assert.equal(await evaluate(`document.querySelectorAll('h1').length`),1);checks++;
  assert.ok(await evaluate(`Array.from(document.querySelectorAll('.journal-grid a')).some(a=>a.href.endsWith('/blog/json-vs-yaml'))`));checks++;
  const setSearch=async value=>{await evaluate(`(()=>{const input=document.querySelector('#blog-search');Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(input,${JSON.stringify(value)});input.dispatchEvent(new Event('input',{bubbles:true}));})()`);};
  await setSearch('Cache-Control');await waitFor(`document.querySelectorAll('.journal-grid>.journal-card').length===1`);assert.ok((await evaluate(`document.querySelector('.journal-grid h3').textContent`)).includes('Cache-Control'));checks++;
  await setSearch('');await waitFor(`document.querySelectorAll('.journal-grid>.journal-card').length===52`);
  await evaluate(`Array.from(document.querySelectorAll('.journal-topics button')).find(b=>b.textContent==='Math & time').click()`);
  await waitFor(`document.querySelectorAll('.journal-grid>.journal-card').length===3`);checks++;
  await setSearch('zzzz-not-a-guide');await waitFor(`!!document.querySelector('.journal-empty button')`);checks++;
  await evaluate(`document.querySelector('.journal-empty button').click()`);await waitFor(`document.querySelectorAll('.journal-grid>.journal-card').length===52`);checks++;
  await evaluate(`document.querySelector('#blog-search').focus()`);assert.equal(await evaluate(`document.activeElement.id`),'blog-search');checks++;
  await call('Page.captureScreenshot',{format:'png'}).then(r=>fs.writeFileSync('/tmp/utilixio-blog-desktop.png',Buffer.from(r.data,'base64')));
  for(const slug of ['read-har-network-requests','json-pointer-explained','json-vs-yaml']){
    await call('Page.navigate',{url:origin+'/blog/'+slug});await waitFor(`document.querySelector('.journal-cover img')?.naturalWidth>0`);
    assert.equal(await evaluate(`document.querySelectorAll('h1').length`),1);checks++;
    assert.ok(await evaluate(`document.querySelector('.journal-cover img').currentSrc.includes('/_next/image')`));checks++;
    if(slug==='read-har-network-requests'){
      assert.equal(await evaluate(`document.querySelector('.journal-byline time').textContent`),'November 6, 2026');checks++;
      assert.ok(await evaluate(`document.querySelector('.journal-toc a').href.endsWith('#section-0')`));checks++;
      await call('Page.captureScreenshot',{format:'png'}).then(r=>fs.writeFileSync('/tmp/utilixio-blog-article.png',Buffer.from(r.data,'base64')));
      await evaluate(`document.documentElement.dataset.theme='light'`);await evaluate(`new Promise(resolve=>setTimeout(resolve,450))`);
      await call('Page.captureScreenshot',{format:'png'}).then(r=>fs.writeFileSync('/tmp/utilixio-blog-article-light.png',Buffer.from(r.data,'base64')));
      await evaluate(`document.documentElement.dataset.theme='dark'`);
    }
  }
  await call('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
  for(const path of ['/blog','/blog/read-har-network-requests','/blog/json-pointer-explained','/blog/json-vs-yaml','/blog/binomial-at-least-probability']){
    await call('Page.navigate',{url:origin+path});await waitFor(`document.querySelector('h1') && document.querySelector('img')?.naturalWidth>0`);
    assert.ok(await evaluate(`document.documentElement.scrollWidth<=window.innerWidth+1`),path+': mobile overflow');checks++;
    if(path==='/blog')await evaluate(`new Promise(resolve=>setTimeout(resolve,450))`);
    if(path==='/blog')await call('Page.captureScreenshot',{format:'png'}).then(r=>fs.writeFileSync('/tmp/utilixio-blog-mobile.png',Buffer.from(r.data,'base64')));
  }
  assert.deepEqual(errors,[],'Browser runtime exceptions');checks++;
  assert.equal(conversionRequests.length,0,'Blog does not invoke conversions');checks++;
  console.log(`${checks} journal browser checks passed: search, topic filters, empty state, real photos, legacy/new articles, light/dark screenshots and mobile layout.`);
} finally {
  for(const item of pending.values())clearTimeout(item.timer);
  browser.kill('SIGTERM');
}
