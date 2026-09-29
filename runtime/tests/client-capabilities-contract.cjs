const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const {createHash} = require('node:crypto');
const {MARKETPLACE_SOURCES,stageMarketplaceSource} = require('../../dist/local/marketplace.js');

test('curated external Skills retain resources and licenses under loadable paths', async () => {
 for(const source of MARKETPLACE_SOURCES.filter(s=>s.skillPaths)) {
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'gbh-external-skill-'));
  const prefix=source.skillPaths[0];
  const files={[`${prefix}/SKILL.md`]:'---\nname: fixture\n---\nInstructions', [`${prefix}/LICENSE.txt`]:'fixture license', [`${prefix}/scripts/helper.py`]:'print("ok")', 'unrelated/secret.txt':'not selected'};
  const fetcher=async url=> url.includes('/git/trees/') ? new Response(JSON.stringify({tree:Object.entries(files).map(([p,s])=>({path:p,type:'blob',mode:'100644',size:Buffer.byteLength(s),sha:createHash('sha1').update(`blob ${Buffer.byteLength(s)}\0`).update(s).digest('hex')}))})) : new Response(files[url.split(source.revision+'/')[1]]);
  try {
   const result=await stageMarketplaceSource(source.entryId,root,fetcher);
   const directory=path.join(root,'skills',prefix.split('/').pop());
   assert.equal(fs.readFileSync(path.join(directory,'LICENSE.txt'),'utf8'),'fixture license');
   assert.ok(fs.existsSync(path.join(directory,'scripts/helper.py')));
   assert.ok(!fs.existsSync(path.join(root,'unrelated')));
   assert.equal(Object.keys(result.provenance.upstreamFiles).length,3);
  } finally {fs.rmSync(root,{recursive:true,force:true});}
 }
});

test('local connector setup validates destination and never returns credential/config', async () => {
 const source=fs.readFileSync(path.join(__dirname,'../../src/host/host-gateway-api.ts'),'utf8');
 const body=source.slice(source.indexOf('    addLocalMcpConnector: async ('),source.indexOf('    getMcpState: () =>'));
 let saved; let existing=[];
 const deps={extensions:{api:()=>({plugins:{listServers:async()=>({servers:existing})},management:{add:async arg=>{saved=arg;return {credential:'must not return'};}}})}};
 const process={env:{GROKBOT_LOCAL_MODE:'1'}};
 const fn=new Function('deps','process','return ({'+body+'}).addLocalMcpConnector')(deps,process);
 for(const url of ['http://example.com/mcp','https://user:pass@example.com','https://example.com/#fragment']) await assert.rejects(fn({name:'sample',url}));
 await assert.rejects(fn({name:'sample',url:'https://example.com/mcp',bearerToken:'bad\r\nheader'}));
 assert.deepEqual(await fn({name:'sample',url:'https://example.com/mcp',bearerToken:'test-only'}),{saved:true});
 assert.equal(JSON.parse(saved.configJson).headers.Authorization,'Bearer test-only');
 existing=[{name:'sample'}];await assert.rejects(fn({name:'sample',url:'https://example.com/mcp'}));
 process.env.GROKBOT_LOCAL_MODE='0';await assert.rejects(fn({name:'another',url:'https://example.com/mcp'}));
});
