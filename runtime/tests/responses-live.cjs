const assert = require('node:assert/strict');
require('../config.cjs')();
const {ResponsesExecutor} = require('../../dist/local/responses.js');
(async () => {
 process.env.GROKBOT_REASONING_EFFORT ||= 'low';
 const executor = new ResponsesExecutor(process.env.GROKBOT_MODEL || 'gpt-5.6-sol', [], () => console.log('Responses API started a response.'));
 executor.appendMessages({role:'user',content:'Call the local_echo tool with text="runtime-ok". After receiving its result, respond with only that result. This is a local integration test.'});
 const tools=[{name:'local_echo',description:'Echo the test text back to the caller.',parameters:{type:'object',properties:{text:{type:'string'}},required:['text'],additionalProperties:false}}];
 const first=executor.stream({}, undefined, tools,{maxTokens:4096});
 const events=[];for await(const e of first.fullStream) events.push(e);
 const call=events.find(e=>e.type==='tool-call');assert.ok(call,'API must actually call the test tool');assert.equal(call.args.text,'runtime-ok');
 const reply=await first.response;executor.appendMessages(reply.messages);
 executor.appendMessages({role:'tool',content:[{type:'tool-result',toolCallId:call.toolCallId,toolName:call.toolName,result:call.args.text}]});
 const second=executor.stream({},undefined,tools,{maxTokens:4096});let text='';for await(const e of second.fullStream)if(e.type==='text-delta')text+=e.textDelta;
 assert.match(text,/runtime-ok/);await second.response;
 console.log('PASS real Responses API: streaming, tool call, call ID correlation, tool result round-trip, final text.');
})().catch(e=>{console.error(e.message);process.exitCode=1;});
