"use strict";
const { test } = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const net = require('node:net');
const crypto = require('node:crypto');
const { createGateway } = require('../firecracker/remote-gateway.cjs');
const token = 'test-operator-credential-'.repeat(3);
const origin = 'https://gateway.example';
async function listen(server) { await new Promise(r => server.listen(0, '127.0.0.1', r)); return server.address().port; }
async function request(port, path, headers = {}, method = 'GET') {
 return new Promise((resolve,reject) => { const req=http.request({hostname:'127.0.0.1',port,path,headers,method},res=>{let body='';res.on('data',c=>body+=c);res.on('end',()=>resolve({status:res.statusCode,body,headers:res.headers}));});req.on('error',reject);req.end(); });
}
test('shared ingress preserves Host channels, display paths and WebSocket routing while separating credentials', async t => {
 let observed;
 const upstream=http.createServer((req,res)=>{observed={url:req.url,headers:req.headers};res.end('upstream');});
 upstream.on('upgrade',(req,socket)=>{
  observed={url:req.url,headers:req.headers};
  const accept=crypto.createHash('sha1').update(req.headers['sec-websocket-key']+'258EAFA5-E914-47DA-95CA-C5AB0DC85B11').digest('base64');
  socket.end(`HTTP/1.1 101 Switching Protocols\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Accept: ${accept}\r\n\r\nRFB-test`);
 });
 const upstreamPort=await listen(upstream);
 let time=Date.now();
 const gateway=createGateway({origin,token,ports:{host:upstreamPort,primary:upstreamPort,fork:upstreamPort},now:()=>time});
 const port=await listen(gateway);
 t.after(()=>{gateway.closeAllConnections();gateway.close();upstream.closeAllConnections();upstream.close();});
 const auth={Authorization:`Bearer ${token}`};
 for (const path of ['/api/getHostStatus','/connection','/display/primary/vnc.html','/events','/local-exec/requests']) assert.equal((await request(port,path)).status,401);
 for (const path of ['/events','/local-exec/requests','/webauthn/requests','/cookie-origin-approval/requests','/avatars/test']) assert.equal((await request(port,path,auth)).status,200);
 for (const path of ['/api/getHostStatus','/events/echo','/local-exec/responses','/webauthn/responses','/cookie-origin-approval/responses']) assert.equal((await request(port,path,auth,'POST')).status,200);
 assert.equal((await request(port,'/api/getHostStatus',{...auth,Origin:'https://evil.example'},'POST')).status,401);
 for(const path of ['/prepare-upgrade','//evil.example','/api/../connection','/display/%2e%2e/api/test']) assert.equal((await request(port,path,auth,'POST')).status,401);
 const descriptor=JSON.parse((await request(port,'/connection',auth,'POST')).body);
 const url=new URL(descriptor.vncProxy.primaryUrl);
 assert.ok(!url.href.includes(token));
 assert.equal(new URL(url.searchParams.get('path'),url).pathname,url.pathname.replace('vnc.html','websockify'));
 assert.equal((await request(port,url.pathname+url.search)).status,200);
 assert.equal(observed.headers.authorization,undefined);
 assert.equal((await request(port,url.pathname.replace('vnc.html','app/ui.js'))).status,200);
 assert.equal((await request(port,'/api/getHostStatus',{Authorization:`Bearer ${descriptor.vncProxy.networkToken}`},'POST')).status,401);
 const wsPath=new URL(descriptor.vncProxy.forkBaseUrl).pathname+'/websockify?token=fork-display';
 async function upgrade(path,requestOrigin) {
  return new Promise((resolve,reject)=>{const socket=net.connect(port,'127.0.0.1',()=>socket.write(`GET ${path} HTTP/1.1\r\nHost: gateway.example\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Version: 13\r\nSec-WebSocket-Key: MTIzNDU2Nzg5MDEyMzQ1Ng==\r\nOrigin: ${requestOrigin}\r\n\r\n`));let data='';socket.on('data',c=>data+=c);socket.on('end',()=>resolve(data));socket.on('error',reject);socket.setTimeout(3000,()=>{socket.destroy();reject(Error('timeout'));});});
 }
 assert.match(await upgrade(wsPath,'https://evil.example'),/401/);
 assert.match(await upgrade(wsPath,origin),/101 Switching Protocols[\s\S]*RFB-test/);
 assert.equal(observed.url,'/websockify?token=fork-display');
 assert.equal(observed.headers.origin,`http://127.0.0.1:${upstreamPort}`);
 assert.equal(observed.headers.authorization,undefined);
 time+=13*60*60*1000;
 assert.equal((await request(port,url.pathname)).status,401);
 assert.match(await upgrade(wsPath,origin),/401/);
});
