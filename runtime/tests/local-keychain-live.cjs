/* Assert that the real local desktop starts without calling Electron safeStorage. */
const fs=require('node:fs'), path=require('node:path');
const {spawn,execFileSync}=require('node:child_process');
const {pathToFileURL}=require('node:url');
const {setTimeout:delay}=require('node:timers/promises');
const assert=require('node:assert/strict');
(async()=>{
 const root=path.resolve(__dirname,'../..');
 const temp=fs.mkdtempSync(path.join(root,'.runtime/tests/keychain-live-'));
 const staged=path.join(temp,'desktop'),profile=path.join(temp,'profile'),audit=path.join(temp,'calls.txt');
 execFileSync('python3',[path.join(root,'runtime/tools/prepare-desktop.py'),'--profile','local','--output',staged],{stdio:'pipe'});
 fs.writeFileSync(audit,'');
 const entry=path.join(staged,'dist/electron-main/main.cjs');
 fs.writeFileSync(entry,`const auditFS=require('node:fs'), auditElectron=require('electron');
for(const name of ['isEncryptionAvailable','encryptString','decryptString']) {
 auditElectron.safeStorage[name]=()=>{auditFS.appendFileSync(process.env.GBH_KEYCHAIN_AUDIT,name+'\\n');throw Error('Unexpected Keychain access: '+name)};
}
`+fs.readFileSync(entry,'utf8'));
 const env={...process.env,GROKBOT_LOCAL_MODE:'1',GROKBOT_LOCAL_KEYCHAIN:'0',GBH_KEYCHAIN_AUDIT:audit,SAND_USER_DATA_DIR:profile,SAND_HOST_GATEWAY_URL:'http://127.0.0.1:1540',SAND_HOST_GATEWAY_TOKEN:fs.readFileSync(path.join(root,'.runtime/gateway-token'),'utf8').trim(),SAND_DEV_CONTROL_PORT:'0',SAND_BACKEND_URL:'http://127.0.0.1:9'};
 delete env.LITELLM_API_KEY;delete env.ELECTRON_RUN_AS_NODE;
 const log=fs.openSync(path.join(temp,'desktop.log'),'w',0o600);
 const child=spawn(require('electron'),[staged,'--remote-debugging-address=127.0.0.1','--remote-debugging-port=0'],{env,stdio:['ignore',log,log]});
 let socket;
 try {
  let page;
  const expected=pathToFileURL(path.join(staged,'dist/renderer/index.html')).href;
  for(let i=0;i<120;i++){
   try{const port=fs.readFileSync(path.join(profile,'DevToolsActivePort'),'utf8').split('\n')[0];page=(await fetch('http://127.0.0.1:'+port+'/json/list').then(r=>r.json())).find(p=>p.url===expected);if(page)break}catch{}
   await delay(250);
  }
  assert.ok(page,'Audited desktop renderer must load');
  socket=new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((yes,no)=>{socket.onopen=yes;socket.onerror=no});
  await delay(4000);
  const result=await new Promise((yes,no)=>{const timer=setTimeout(()=>no(Error('UI timeout')),10000);socket.onmessage=e=>{const r=JSON.parse(e.data);if(r.id===1){clearTimeout(timer);yes(r)}};socket.send(JSON.stringify({id:1,method:'Runtime.evaluate',params:{expression:'document.body.innerText',returnByValue:true}}))});
  assert.match(result.result.result.value,/Local workspace/);
  assert.equal(fs.readFileSync(audit,'utf8'),'','No safeStorage calls during local startup');
  assert.ok(fs.existsSync(path.join(profile,'local-machine-id')));
  console.log('PASS real desktop startup: local workspace, persistent machine ID, zero Electron safeStorage calls.');
 } finally {
  socket?.close();child.kill('SIGTERM');await delay(1500);
  try{const pid=JSON.parse(fs.readFileSync(path.join(profile,'sand-data/local-exec-daemon.json'))).pid;const command=execFileSync('ps',['-p',String(pid),'-o','command='],{encoding:'utf8'});if(command.includes(path.join(staged,'dist/local-exec-daemon/main.cjs')))process.kill(pid,'SIGTERM')}catch{}
  fs.closeSync(log);
 }
})().catch(error=>{console.error(error.message);process.exitCode=1});
