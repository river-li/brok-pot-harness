const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const http = require('node:http');
const root = fs.mkdtempSync(path.join(os.tmpdir(), 'gbh-models-'));
const saved = Object.fromEntries(['SAND_DATA_ROOT','GROKBOT_MODEL','GROKBOT_RESPONSES_BASE_URL'].map(k=>[k,process.env[k]]));
const models = require('../../dist/local/bot-models.js');
const {createLocalInference} = require('../../dist/local/responses.js');
(async()=>{
 const seen=[];
 const server=http.createServer(async(req,res)=>{
  if(req.url==='/models'){res.setHeader('Content-Type','application/json');res.end(JSON.stringify({data:[{id:'model-a'},{id:'model-b'}]}));return;}
  const chunks=[];for await(const c of req)chunks.push(c);const body=JSON.parse(Buffer.concat(chunks));seen.push(body.model);
  res.setHeader('Content-Type','text/event-stream');res.end('data: '+JSON.stringify({type:'response.completed',response:{id:'fixture',model:body.model,status:'completed',output:[],usage:{input_tokens:1,output_tokens:0}}})+'\n\n');
 });
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 try {
  process.env.SAND_DATA_ROOT=root;process.env.GROKBOT_MODEL='model-a';process.env.GROKBOT_RESPONSES_BASE_URL=`http://127.0.0.1:${server.address().port}`;
  await Promise.all([models.setBotModel('bot-a','model-a'),models.setBotModel('bot-b','model-b')]);
  const inference=createLocalInference();
  const a=inference.createSession(undefined,{agentId:'bot-a'}),b=inference.createSession(undefined,{agentId:'bot-b'});
  assert.equal(a.getModelId(),'model-a');assert.equal(b.getModelId(),'model-b');
  await Promise.all([a,b].map(async session=>{const ex=session.getExecutor();ex.appendMessages({role:'user',content:'test'});const run=ex.stream({},undefined,[]);for await(const e of run.fullStream){};await run.response;}));
  assert.deepEqual(seen.sort(),['model-a','model-b']);
  await models.setBotModel('bot-a','model-b');assert.equal(a.getModelId(),'model-a');assert.equal(inference.createSession(undefined,{agentId:'bot-a'}).getModelId(),'model-b');
  delete require.cache[require.resolve('../../dist/local/bot-models.js')];
  assert.equal(require('../../dist/local/bot-models.js').botModel('bot-b').effectiveModel,'model-b');
  await assert.rejects(models.setBotModel('bot-b','unknown'));
  await assert.rejects(models.setBotModel('../escape','model-a'));
  await models.setBotModel('bot-a',null);assert.equal(models.botModel('bot-a').effectiveModel,'model-a');assert.equal(models.botModel('bot-b').effectiveModel,'model-b');
  console.log('PASS: independent models, session snapshot, persistent override, default inheritance, validation');
 } finally {await new Promise(r=>server.close(r));fs.rmSync(root,{recursive:true,force:true});for(const [k,v] of Object.entries(saved)){if(v===undefined)delete process.env[k];else process.env[k]=v;}}
})().catch(e=>{console.error(e);process.exitCode=1;});
