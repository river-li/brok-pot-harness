const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const {ResponsesExecutor, readSSE, toResponsesInput} = require('../../dist/local/responses.js');

test('SSE handles split UTF-8, CRLF, comments and an open connection after DONE', async () => {
  const bytes = Buffer.from(':ping\r\n\r\ndata: {"type":"text","delta":"你好"}\r\n\r\ndata: [DONE]\n\n');
  let cancelled = false;
  const body = new ReadableStream({start(c) {for (const b of bytes) c.enqueue(Uint8Array.of(b));}, cancel() {cancelled = true;}});
  const events = []; for await (const e of readSSE(body)) events.push(e);
  assert.deepEqual(events, [{type:'text',delta:'你好'}]); assert.equal(cancelled,true);
});

for (const omitTerminalOutput of [false, true]) test(`Responses round-trip preserves call IDs, reasoning and tool outputs (terminal output omitted: ${omitTerminalOutput})`, async t => {
  const seen = [];
  const call = {type:'function_call',id:'item-1',call_id:'call-1',name:'local_echo',arguments:'{"text":"ok"}',status:'completed'};
  const reasoning = {type:'reasoning',id:'reason-1',summary:[],encrypted_content:'fixture-encrypted'};
  const message = {type:'message',id:'msg-1',role:'assistant',status:'completed',content:[{type:'output_text',text:'ok',annotations:[]}]};
  const server = http.createServer(async (req,res) => {
    const chunks=[]; for await(const c of req)chunks.push(c);
    const body=JSON.parse(Buffer.concat(chunks));seen.push(body);
    assert.equal(req.url,'/v1/responses'); assert.equal(req.headers.authorization,'Bearer fixture-key');
    assert.equal(body.model,'fixture-model'); assert.equal(body.store,false);
    assert.equal(body.tools[0].parameters.type,'object');
    assert.equal(body.tools[0].parameters.jsonSchema,undefined);
    res.writeHead(200,{'content-type':'text/event-stream'});
    const emit = x => res.write(`data: ${JSON.stringify(x)}\n\n`);
    const output = seen.length===1 ? [reasoning,call] : [message];
    emit({type:'response.created',response:{id:`res-${seen.length}`}});
    if(seen.length===1){
      emit({type:'response.output_item.done',output_index:0,item:reasoning});
      emit({type:'response.output_item.added',item:{...call,arguments:''}});
      emit({type:'response.function_call_arguments.delta',item_id:call.id,delta:call.arguments});
      emit({type:'response.output_item.done',output_index:1,item:call});
    }else {
      emit({type:'response.output_text.delta',delta:'ok'});
      emit({type:'response.output_item.done',output_index:0,item:message});
    }
    emit({type:'response.completed',response:{id:`res-${seen.length}`,model:'fixture-model',status:'completed',output:omitTerminalOutput?[]:output,usage:{input_tokens:20,output_tokens:3,total_tokens:23,input_tokens_details:{cached_tokens:4}}}});
    // Deliberately keep the HTTP response open: the terminal SSE event is sufficient.
  });
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const previous={...process.env};
  t.after(()=>{server.closeAllConnections();server.close();process.env=previous;});
  process.env.GROKBOT_RESPONSES_BASE_URL=`http://127.0.0.1:${server.address().port}/v1`;
  process.env.LITELLM_API_KEY='fixture-key';
  const executor=new ResponsesExecutor('fixture-model');
  executor.appendMessages({role:'user',content:'Echo ok'});
  const tools=[{name:'local_echo',description:'Echo',parameters:{jsonSchema:{type:'object',properties:{text:{type:'string'}}}}}];
  const first=executor.stream({},undefined,tools);const events=[];
  for await(const event of first.fullStream)events.push(event);
  assert.equal(events.filter(e=>e.type==='tool-call').length,1);
  assert.equal(events.find(e=>e.type==='tool-call-delta').toolCallId,'call-1');
  executor.appendMessages((await first.response).messages);
  executor.appendMessages({role:'tool',content:[{type:'tool-result',toolCallId:'call-1',toolName:'local_echo',result:'ok'}]});
  const second=executor.stream({},undefined,tools);let text='';
  for await(const event of second.fullStream)if(event.type==='text-delta')text+=event.textDelta;
  assert.equal(text,'ok');
  assert.deepEqual((await second.response).messages[0].content,[{type:'text',text:'ok'}]);
  assert.deepEqual(seen[1].input.slice(1),[reasoning,call,{type:'function_call_output',call_id:'call-1',output:'ok'}]);
  assert.equal((await second.extendedUsage).cacheReadTokens,4);
});

test('image tool results retain the image and its matching call ID', () => {
  const input=toResponsesInput([{role:'tool',content:[{type:'tool-result',toolCallId:'screenshot-1',result:'screenshot',experimental_content:[{type:'image',data:'AAAA',mimeType:'image/png'}]}]}]);
  assert.equal(input[0].call_id,'screenshot-1');
  assert.deepEqual(input[0].output,[{type:'input_image',image_url:'data:image/png;base64,AAAA',detail:'auto'}]);
});

test('failed HTTP requests reject both stream and response without exposing provider error bodies', async t => {
  const server=http.createServer((req,res)=>{res.writeHead(401,{'content-type':'application/json'});res.end(JSON.stringify({error:{code:'invalid_api_key',message:'secret should never be shown'}}));});
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const old=process.env.GROKBOT_RESPONSES_BASE_URL;
  t.after(()=>{server.closeAllConnections();server.close();if(old===undefined)delete process.env.GROKBOT_RESPONSES_BASE_URL;else process.env.GROKBOT_RESPONSES_BASE_URL=old;});
  process.env.GROKBOT_RESPONSES_BASE_URL=`http://127.0.0.1:${server.address().port}/v1`;
  const run=new ResponsesExecutor('fixture').stream({});
  await assert.rejects(async()=>{for await(const e of run.fullStream){}},/^Error: Responses API returned HTTP 401 \(invalid_api_key\)$/);
  await assert.rejects(run.response,/HTTP 401/);
});

test('plain proxy SSE errors fail immediately and redact provider messages', async t => {
  const server=http.createServer((req,res)=>{
    res.writeHead(200,{'content-type':'text/event-stream'});
    res.write(`data: ${JSON.stringify({error:{code:'upstream_timeout',message:'credential-value must not reach logs'}})}\n\n`);
  });
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const old=process.env.GROKBOT_RESPONSES_BASE_URL;
  t.after(()=>{server.closeAllConnections();server.close();if(old===undefined)delete process.env.GROKBOT_RESPONSES_BASE_URL;else process.env.GROKBOT_RESPONSES_BASE_URL=old;});
  process.env.GROKBOT_RESPONSES_BASE_URL=`http://127.0.0.1:${server.address().port}/v1`;
  const run=new ResponsesExecutor('fixture').stream({});
  await assert.rejects(async()=>{for await(const e of run.fullStream){}},/^Error: Responses stream failed \(upstream_timeout\)$/);
  await assert.rejects(run.response,/Responses stream failed/);
});
