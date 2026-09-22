/* Record only our packaged app, using a private Box/profile and a real model. */
const fs = require('node:fs');
const path = require('node:path');
const {pathToFileURL} = require('node:url');
const {spawn, execFileSync} = require('node:child_process');
const {randomUUID} = require('node:crypto');
const {setTimeout: delay} = require('node:timers/promises');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '../..');
require('../config.cjs')(root);
const run = randomUUID().slice(0,8), container = `gbh-showcase-${run}`;
const temp = path.join(root,'.runtime/showcase',run);
const media = path.join(root,'docs/media');
for(const d of ['data','workspace','profile','frames']) fs.mkdirSync(path.join(temp,d),{recursive:true});
const token = randomUUID();
const docker = (...args) => execFileSync('docker',args,{encoding:'utf8',stdio:['ignore','pipe','pipe']}).trim();
let child,socket,started=false,command;
async function until(fn, timeout=30000){const end=Date.now()+timeout;while(Date.now()<end){if(await fn())return;await delay(300)}throw Error('Showcase state timed out');}
(async()=>{
 assert.ok(process.env.LITELLM_API_KEY,'Provide LITELLM_API_KEY');
 const image=docker('inspect','--format','{{.Config.Image}}','gbh-local-app-1');
 const env={...process.env,SAND_PACKAGED:'1',SAND_HOST_IN_BOX:'1',SAND_DATA_ROOT:'/home/box/sand-data',SAND_GATEWAY_BIND_HOST:'0.0.0.0',SAND_HOST_PORT:'1340',SAND_GATEWAY_TOKEN:token,GROKBOT_MODEL:process.env.GROKBOT_MODEL||'gpt-5.6-sol',GROKBOT_RESPONSES_BASE_URL:process.env.GROKBOT_RESPONSES_BASE_URL||'http://litellm.home/v1',GROKBOT_REASONING_EFFORT:'low'};
 const args=['run','-d','--name',container,'--platform','linux/amd64','--init','--shm-size','1gb','-p','127.0.0.1::1340','--add-host','host.docker.internal:host-gateway','--entrypoint','/bin/bash'];
 for(const key of ['SAND_PACKAGED','SAND_HOST_IN_BOX','SAND_DATA_ROOT','SAND_GATEWAY_BIND_HOST','SAND_HOST_PORT','SAND_GATEWAY_TOKEN','GROKBOT_MODEL','GROKBOT_RESPONSES_BASE_URL','GROKBOT_REASONING_EFFORT','LITELLM_API_KEY'])args.push('-e',key);
 for(const [from,to] of [['.runtime/build/sand-host','/home/box/sand-host:ro'],['.runtime/build/deps','/home/box/deps:ro'],[path.join(temp,'data'),'/home/box/sand-data'],[path.join(temp,'workspace'),'/workspace'],['runtime/box-entrypoint.sh','/opt/grokbot/box-entrypoint.sh:ro']])args.push('-v',`${path.resolve(root,from)}:${to}`);
 args.push(image,'/opt/grokbot/box-entrypoint.sh');
 execFileSync('docker',args,{env,stdio:'pipe'});started=true;
 const base='http://'+docker('port',container,'1340/tcp');
 await until(()=>fetch(base+'/health').then(r=>r.ok).catch(()=>false),90000);
 const call=(method,body={})=>fetch(base+'/api/'+method,{method:'POST',headers:{authorization:'Bearer '+token,'content-type':'application/json'},body:JSON.stringify(body)}).then(async r=>{assert.equal(r.status,200,method);return r.json()});
 await call('createAgent',{name:'Sandbox workspace',description:'Private documentation workspace',isIntroductionSuppressed:true,isKickstartRequested:false});
 console.log('Private Host ready; starting packaged desktop.');
 const app=path.join(root,'.runtime/packages/Grokbot Harness.app');
 const log=fs.openSync(path.join(temp,'desktop.log'),'a',0o600);
 const desktopEnv={...process.env,SAND_DEV_CONTROL_PORT:'0',SAND_USER_DATA_DIR:path.join(temp,'profile'),SAND_HOST_GATEWAY_URL:base,SAND_HOST_GATEWAY_TOKEN:token};delete desktopEnv.LITELLM_API_KEY;delete desktopEnv.ELECTRON_RUN_AS_NODE;
 child=spawn(path.join(app,'Contents/MacOS/Electron'),['--remote-debugging-address=127.0.0.1','--remote-debugging-port=19224',`--user-data-dir=${path.join(temp,'profile')}`],{env:desktopEnv,stdio:['ignore',log,log]});
 let page;
 const expected=pathToFileURL(path.join(app,'Contents/Resources/app/dist/renderer/index.html')).href;
 await until(async()=>{try{page=(await fetch('http://127.0.0.1:19224/json/list').then(r=>r.json())).find(p=>p.url===expected);return !!page}catch{return false}},60000);
 socket=new WebSocket(page.webSocketDebuggerUrl);await new Promise((yes,no)=>{socket.onopen=yes;socket.onerror=no});
 let seq=0;const pending=new Map();socket.onmessage=e=>{const r=JSON.parse(e.data),p=pending.get(r.id);if(p){pending.delete(r.id);clearTimeout(p.timer);r.error?p.no(Error(r.error.message)):p.yes(r.result)}};
 command=(method,params={})=>new Promise((yes,no)=>{const id=++seq;const timer=setTimeout(()=>{pending.delete(id);no(Error(method+' timeout'))},15000);pending.set(id,{yes,no,timer});socket.send(JSON.stringify({id,method,params}))});
 const evaluate=async expression=>{const r=await command('Runtime.evaluate',{expression,returnByValue:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value};
 await command('Emulation.setDeviceMetricsOverride',{width:1440,height:960,deviceScaleFactor:1,mobile:false});
 const shot=async file=>{const r=await command('Page.captureScreenshot',{format:'png'});fs.writeFileSync(file,Buffer.from(r.data,'base64'))};
 await until(()=>evaluate(`!!document.querySelector('button[aria-label="New chat"]')`));
 await until(()=>evaluate(`document.body.innerText.includes('Sandbox workspace')`));
 await shot(path.join(media,'workspace.png'));
 console.log('Desktop ready; composing a real task.');
 await evaluate(`document.querySelector('button[aria-label="New chat"]').click()`);
 await until(()=>evaluate(`!!document.querySelector('input[aria-label="Search or create Bots"]')`));
 const prompt='Create a concise launch checklist for a local-first agent project. Use the Linux sandbox to save it as /workspace/launch-checklist.md, then read the file to verify it. Reply with a short summary and the checklist. Only use that file; do not use my Mac or external websites.';
 await evaluate(`document.querySelector('[contenteditable="true"][aria-label="Prompt"]').focus()`);
 await command('Input.insertText',{text:prompt});
 await evaluate(`document.querySelector('input[aria-label="Search or create Bots"]').focus()`);
 await command('Input.insertText',{text:'Launch companion'});
 await until(()=>evaluate(`[...document.querySelectorAll('button[role="option"]')].some(b=>b.innerText.includes('Launch companion'))`));
 await evaluate(`[...document.querySelectorAll('button[role="option"]')].find(b=>b.innerText.includes('Launch companion')).click()`);
 await until(()=>evaluate(`!!document.querySelector('button[aria-label="Send message"]:not(:disabled)')`));
 await shot(path.join(media,'compose.png'));
 await evaluate(`document.querySelector('button[aria-label="Send message"]').click()`);
 console.log('Prompt sent; capturing actual Agent execution.');
 let index=0,finished=false;
 const deadline=Date.now()+240000;
 while(Date.now()<deadline){
  await shot(path.join(temp,'frames',String(index++).padStart(4,'0')+'.png'));
  const agents=(await call('listAgents')).filter(a=>a.name==='Launch companion');
  if(agents.length){const transcript=await call('getAgentTranscript',{id:agents[0].id});const health=await fetch(base+'/health').then(r=>r.json());if(!health.isBusy&&transcript.some(m=>m.kind==='send-message'&&m.message?.type==='text')){finished=true;break}}
  await delay(1000);
 }
 assert.ok(finished,'Real Agent must finish');
 const artifact=fs.readFileSync(path.join(temp,'workspace','launch-checklist.md'),'utf8');assert.ok(artifact.length>80,'Actual sandbox artifact required');
 await delay(1500);await shot(path.join(media,'agent-result.png'));
 for(let i=0;i<8;i++)await shot(path.join(temp,'frames',String(index++).padStart(4,'0')+'.png'));
 fs.writeFileSync(path.join(temp,'verified-artifact.md'),artifact);
 fs.writeFileSync(path.join(media,'capture.json'),JSON.stringify({capturedAt:new Date().toISOString(),hostVersion:'bfe1879',desktopVersion:'0.44.0',model:env.GROKBOT_MODEL,source:'Live packaged app, real Responses API and isolated Linux sandbox',prompt,frames:index,frameInterval:'approximately 1 second, plus end hold frames',artifactVerified:true,videoPlayback:'4 source frames per second (time-compressed)'},null,2)+'\n');
 execFileSync('ffmpeg',['-y','-framerate','4','-i',path.join(temp,'frames','%04d.png'),'-c:v','libx264','-pix_fmt','yuv420p','-movflags','+faststart',path.join(media,'agent-demo.mp4')],{stdio:'pipe'});
 execFileSync('ffmpeg',['-y','-i',path.join(media,'agent-demo.mp4'),'-filter_complex','fps=4,scale=900:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=128[p];[b][p]paletteuse',path.join(media,'agent-demo.gif')],{stdio:'pipe'});
 console.log('PASS packaged icon app → real Agent → sandbox file. Screenshots, MP4 and GIF saved to docs/media.');
 console.log('Private capture directory:',temp);
})().catch(e=>{console.error(e.message);process.exitCode=1}).finally(async()=>{
 if(command&&process.exitCode){try{const r=await command('Runtime.evaluate',{expression:'document.body.innerText',returnByValue:true});fs.writeFileSync(path.join(temp,'failure-ui.txt'),r.result.value||'')}catch{}}
 if(command)await command('Browser.close').catch(()=>{});socket?.close();
 if(child&&child.exitCode===null)child.kill('SIGTERM');
 const daemonFile=path.join(temp,'profile/sand-data/local-exec-daemon.json');
 try{const pid=JSON.parse(fs.readFileSync(daemonFile)).pid;const cmd=execFileSync('ps',['-p',String(pid),'-o','command='],{encoding:'utf8'});if(cmd.includes('.runtime/packages/Grokbot Harness.app/Contents/Resources/app/dist/local-exec-daemon/main.cjs'))process.kill(pid,'SIGTERM')}catch{}
 if(started)docker('rm','-f',container);
});
