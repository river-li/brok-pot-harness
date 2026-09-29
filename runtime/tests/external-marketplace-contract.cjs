const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const os=require('node:os');
const {createHash}=require('node:crypto');
const {createExternalMarketplace}=require('../../dist/local/external-marketplace.js');
const {publicHttpsUrl}=require('../../dist/local/marketplace-http.js');
const {pluginBundlePath,listLocalPluginPointers}=require('../../dist/local/plugin-files.js');
let serial=0;
function fixture(kind, fetcher) {
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'gbh-catalog-'));
 const url=kind==='github-skills'?'https://github.com/fixture/skills':kind==='github-topic'?`https://github.com/topics/fixture-${++serial}`:`https://catalog-${++serial}.example/api`;
 fs.writeFileSync(path.join(root,'marketplace-sources.json'),JSON.stringify({sources:[{id:'test',title:'Fixture',kind,url}]}));
 return {root,api:createExternalMarketplace(root,fetcher),close:()=>fs.rmSync(root,{recursive:true,force:true})};
}
const sha=s=>createHash('sha256').update(s).digest('hex');
const skill='---\nname: fixture\ndescription: fixture Skill\n---\nUse reference.txt.';
function clawFetcher(options={}) {
 return async input=> {
  const u=new URL(input);assert.equal(u.searchParams.get('owner'),'alice');
  if(u.pathname.endsWith('/versions/1.0.0'))return Response.json({version:{files:[{path:options.path??'SKILL.md',sha256:options.hash??sha(skill),size:skill.length},{path:'reference.txt',sha256:sha('reference'),size:9}],security:{status:options.status??'clean'}}});
  if(u.pathname.endsWith('/file')) {assert.equal(u.searchParams.get('version'),'1.0.0');return new Response(u.searchParams.get('path')==='SKILL.md'?skill:'reference');}
  return Response.json({owner:{handle:options.owner??'alice'},skill:{slug:'demo',displayName:'Demo',summary:'fixture'},latestVersion:{version:'1.0.0'}});
 };
}
test('public catalog transport refuses insecure, credentialed and private destinations',()=>{
 for(const url of ['http://example.com','https://user:password@example.com','https://127.0.0.1','https://169.254.169.254','https://[::1]','https://foo.localhost','https://example.com/#fragment']) assert.throws(()=>publicHttpsUrl(url));
 assert.equal(publicHttpsUrl('https://example.com/mcp').hostname,'example.com');
});
test('publisher-qualified ClawHub import pins content, resources, and provenance without installing',async()=>{
 const f=fixture('clawhub',clawFetcher());
 try {
  const detail=await f.api.detail({sourceId:'test',key:'alice/demo'});assert.equal(detail.installable,true);
  const result=await f.api.prepare({sourceId:'test',key:'alice/demo',version:'1.0.0'});
  const pointer=listLocalPluginPointers(f.root)[0];
  const dir=pluginBundlePath(f.root,pointer);
  assert.equal(fs.readFileSync(path.join(dir,'skills/imported/reference.txt'),'utf8'),'reference');
  assert.equal(JSON.parse(fs.readFileSync(path.join(dir,'.brokpot-source.json'),'utf8')).version,'1.0.0');
  assert.equal(fs.existsSync(path.join(f.root,'plugins/local-installs.json')),false);
  assert.ok(result.pluginId);
 }finally{f.close();}
});
test('imports fail closed on traversal, content mismatch, publisher changes, flagged content and stale versions',async()=>{
 for(const options of [{path:'../SKILL.md'},{hash:'f'.repeat(64)},{owner:'mallory'},{status:'malicious'}]){
  const f=fixture('clawhub',clawFetcher(options));
  try{await assert.rejects(f.api.prepare({sourceId:'test',key:'alice/demo',version:'1.0.0'}));assert.equal(fs.existsSync(path.join(f.root,'plugins/local-installs.json')),false);}finally{f.close();}
 }
 const f=fixture('clawhub',clawFetcher());try{await assert.rejects(f.api.prepare({sourceId:'test',key:'alice/demo',version:'2.0.0'}),/version changed/);}finally{f.close();}
});
test('MCP registry paging, required header forms and package compatibility',async()=>{
 const wrapper={server:{name:'io.example/demo',title:'Demo',version:'1',remotes:[{type:'streamable-http',url:'https://mcp.example.com/mcp',headers:[{name:'Authorization',value:'Bearer {key}',isRequired:true,isSecret:true}]}]},_meta:{'io.modelcontextprotocol.registry/official':{status:'active',isLatest:true}}};
 let calls=0;
 const f=fixture('mcp-registry',async u=>{calls++;return Response.json(new URL(u).pathname.endsWith('/servers')?{servers:[wrapper],metadata:{nextCursor:'page2'}}:wrapper);});
 try{
  const page=await f.api.search({sourceId:'test',q:'demo'});assert.equal(page.entries.length,1);assert.equal(page.nextCursor,'page2');
  await f.api.search({sourceId:'test',q:'demo'});assert.equal(calls,1,'cache prevents repeated catalog fetch');
  const detail=await f.api.detail({sourceId:'test',key:'io.example/demo'});assert.equal(detail.fields[0].isSecret,true);assert.equal(detail.fields[0].isRequired,true);
  await assert.rejects(f.api.install({sourceId:'test',key:'io.example/demo',version:'1',values:{}},()=>assert.fail('must not install')),/required/);
  await assert.rejects(f.api.install({sourceId:'test',key:'io.example/demo',version:'1',values:{HEADER_0:'bad\r\nheader'}},()=>assert.fail('must not install')),/Invalid/);
  let installed=0;await f.api.install({sourceId:'test',key:'io.example/demo',version:'1',values:{HEADER_0:'Bearer fixture'}},async()=>{installed++;});assert.equal(installed,1);
 }finally{f.close();}
 const packageOnly=fixture('mcp-registry',async()=>Response.json({server:{name:'io.example/demo',version:'1',packages:[{registryType:'npm',identifier:'untrusted'}]}}));
 try{assert.equal((await packageOnly.api.detail({sourceId:'test',key:'io.example/demo'})).installable,false);}finally{packageOnly.close();}
});
test('rate limiting backs off instead of hammering source, and invalid source config fails',async()=>{
 let calls=0;const f=fixture('mcp-registry',async()=>{calls++;return new Response('',{status:429,headers:{'retry-after':'60'}});});
 try{await assert.rejects(f.api.search({sourceId:'test'}));await assert.rejects(f.api.search({sourceId:'test'}),/rate limit/);assert.equal(calls,1);
 fs.writeFileSync(path.join(f.root,'marketplace-sources.json'),JSON.stringify({sources:[{id:'bad',kind:'mcp-registry',url:'https://localhost'}]}));assert.throws(()=>f.api.sources());}finally{f.close();}
});
test('GitHub topic discovery sorts by popularity, pages every skill, and imports pinned root and nested skills',async()=>{
 const rev='a'.repeat(40);let latest=rev;let eligible=true;const requests=[];
 const blob=content=>createHash('sha1').update(`blob ${Buffer.byteLength(content)}\0`).update(content).digest('hex');
 const files=[{path:'SKILL.md',type:'blob',mode:'100644',sha:blob(skill)},
  ...Array.from({length:31},(_,i)=>({path:`skills/demo${i}/SKILL.md`,type:'blob',mode:'100644',sha:blob(skill)})),
  {path:'LICENSE',type:'blob',mode:'100644',sha:blob('license')}];
 let f;
 f=fixture('github-topic',async input=>{
  const u=new URL(input);requests.push(u);
  if(u.pathname==='/search/repositories'){
   assert.equal(u.searchParams.get('sort'),'stars');assert.equal(u.searchParams.get('order'),'desc');
   assert.match(u.searchParams.get('q'),/^topic:fixture-\d+ archived:false fork:false /);
   assert.equal(u.searchParams.get('per_page'),'1');
   return Response.json({total_count:2,incomplete_results:false,items:[{full_name:u.searchParams.get('page')==='2'?'bob/empty':'alice/popular',stargazers_count:1234,description:'Popular fixture'}]});
  }
  if(u.pathname==='/repos/alice/popular'||u.pathname==='/repos/bob/empty')return Response.json({full_name:u.pathname.slice(7),private:false,topics:eligible?[f.api.sources()[0].url.split('/').pop()]:[],default_branch:'trunk'});
  if(u.pathname.endsWith('/commits/trunk'))return Response.json({sha:latest});
  if(u.pathname.includes('/git/trees/'))return Response.json({tree:u.pathname.includes('bob/empty')?[]:files});
  assert.equal(u.hostname,'raw.githubusercontent.com');assert.ok(u.pathname.includes('/'+rev+'/'));
  return new Response(u.pathname.endsWith('/LICENSE')?'license':skill);
 });
 try{
  const first=await f.api.search({sourceId:'test',q:'slides topic:evil OR fork:true'});
  assert.equal(first.entries.length,30);assert.match(first.entries[0].description,/1234 stars · Community/);
  assert.equal(first.entries[0].key,'alice/popular');
  const query=requests[0].searchParams.get('q');assert.ok(!query.includes('topic:evil'));assert.ok(!query.includes(' OR '));
  const second=await f.api.search({sourceId:'test',q:'slides topic:evil OR fork:true',cursor:first.nextCursor});
  assert.equal(second.entries.length,2);assert.equal(new Set([...first.entries,...second.entries].map(e=>e.key)).size,32);
  const last=await f.api.search({sourceId:'test',q:'slides topic:evil OR fork:true',cursor:second.nextCursor});
  assert.equal(last.entries.length,0);assert.equal(last.nextCursor,null);
  const key='alice/popular/skills/demo0';
  const detail=await f.api.detail({sourceId:'test',key});assert.equal(detail.fileCount,2);
  await f.api.prepare({sourceId:'test',key,version:rev});
  let pointer=listLocalPluginPointers(f.root)[0];let dir=pluginBundlePath(f.root,pointer);
  assert.equal(fs.readFileSync(path.join(dir,'skills/imported/SKILL.md'),'utf8'),skill);
  assert.equal(fs.readFileSync(path.join(dir,'skills/imported/upstream-license/LICENSE'),'utf8'),'license');
  await f.api.prepare({sourceId:'test',key:'alice/popular',version:rev});
  assert.equal(listLocalPluginPointers(f.root).length,2);
  latest='b'.repeat(40);
  await assert.rejects(f.api.prepare({sourceId:'test',key,version:rev}),/version changed/);
  eligible=false;
  await assert.rejects(f.api.prepare({sourceId:'test',key,version:rev}),/no longer eligible/);
  for(const cursor of ['{}','{"page":1001,"offset":0}','{"page":1,"offset":-1}'])await assert.rejects(f.api.search({sourceId:'test',cursor}),/cursor/);
  await assert.rejects(f.api.detail({sourceId:'test',key:'alice/popular/../secret'}),/Unsafe/);
 }finally{f.close();}
});
test('GitHub topic source rejects incomplete search and non-GitHub URLs',async()=>{
 const f=fixture('github-topic',async()=>Response.json({incomplete_results:true,items:[]}));
 try{
  await assert.rejects(f.api.search({sourceId:'test'}),/incomplete/);
  fs.writeFileSync(path.join(f.root,'marketplace-sources.json'),JSON.stringify({sources:[{id:'test',kind:'github-topic',url:'https://example.com/topics/agent-skills'}]}));
  assert.throws(()=>f.api.sources(),/topic URL/);
 }finally{f.close();}
});
test('oversized topic repositories remain non-importable without blocking later pages',async()=>{
 let f;f=fixture('github-topic',async input=>{
  const u=new URL(input);
  if(u.pathname==='/search/repositories')return Response.json({total_count:2,items:[{full_name:'alice/huge'}]});
  if(u.pathname==='/repos/alice/huge')return Response.json({full_name:'alice/huge',private:false,topics:[f.api.sources()[0].url.split('/').pop()],default_branch:'main'});
  if(u.pathname.includes('/commits/'))return Response.json({sha:'c'.repeat(40)});
  return Response.json({truncated:true,tree:[]});
 });
 try{
  const result=await f.api.search({sourceId:'test'});assert.deepEqual(result.entries,[]);assert.equal(JSON.parse(result.nextCursor).page,2);
  await assert.rejects(f.api.prepare({sourceId:'test',key:'alice/huge',version:'c'.repeat(40)}),/incomplete or too large/);
 }finally{f.close();}
});
test('GitHub 403 throttling backs off without repeated requests',async()=>{
 let calls=0;const f=fixture('github-topic',async()=>{calls++;return new Response('',{status:403,headers:{'retry-after':'60'}});});
 try{await assert.rejects(f.api.search({sourceId:'test'}),/rate limit/);await assert.rejects(f.api.search({sourceId:'test'}),/rate limit/);assert.equal(calls,1);}finally{f.close();}
});
