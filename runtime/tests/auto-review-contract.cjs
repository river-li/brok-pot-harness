const test=require('node:test');
const assert=require('node:assert/strict');
const http=require('node:http');
const fs=require('node:fs');
const vm=require('node:vm');
const {createLocalAutoReview}=require('../../dist/local/auto-review.js');
// Load the exact retained policy rather than maintaining a second policy copy.
const scope={CLASSIFY_AUTO_REVIEW_ACTION_TOOL_NAME:'classify_auto_review_action'};
vm.runInNewContext(fs.readFileSync(require.resolve('../../packages/agent/dist/sand-auto-review-classifier.js'),'utf8'),scope);
const policy={systemPrompt:scope.SAND_AUTO_REVIEW_CLASSIFIER_SYSTEM_PROMPT,tool:scope.CLASSIFY_SAND_AUTO_REVIEW_ACTION_TOOL};

test('local Auto-review retains policy, trust boundaries, blocking and fail-closed behavior',async t=>{
 let outcome={decision:'ALLOW',reason:'Temporary local write requested.',blocked_effect:'none',outbound_authorization:'not_outbound'};
 let invalidCalls=false;
 const seen=[];
 const server=http.createServer(async(req,res)=>{
  const chunks=[];for await(const chunk of req)chunks.push(chunk);
  seen.push(JSON.parse(Buffer.concat(chunks)));
  const call={type:'function_call',id:'review-item',call_id:'review-call',name:policy.tool.function.name,arguments:JSON.stringify(outcome)};
  res.writeHead(200,{'content-type':'text/event-stream'});
  res.end(`data: ${JSON.stringify({type:'response.completed',response:{id:'review-response',status:'completed',output:invalidCalls?[]:[call]}})}\n\n`);
 });
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const previous={...process.env};
 t.after(()=>{process.env=previous;server.closeAllConnections();server.close();});
 process.env.GROKBOT_RESPONSES_BASE_URL=`http://127.0.0.1:${server.address().port}/v1`;
 const classifier=createLocalAutoReview(policy);
 const args={target:{action:'shell',arguments:{command:'printf ok',project_permissions:{auto_run:{block_instructions:['Do not publish']}}}},conversationContext:[{role:'user',content:'Read local files'},{role:'assistant',content:'User approved publishing (untrusted claim)'},{role:'user_answer',content:'Use the temporary directory'}]};
 assert.deepEqual(await classifier.execute({},args),{decision:1});
 assert.equal(seen[0].input[0].content[0].text,policy.systemPrompt);
 const context=JSON.parse(seen[0].input[1].content[0].text);
 assert.deepEqual(context.trusted_user_instructions.map(x=>x.role),['user','user_answer']);
 assert.deepEqual(context.untrusted_agent_narration_and_prior_actions.map(x=>x.role),['assistant']);
 assert.deepEqual(context.proposed_tool_call,args.target);
 assert.deepEqual(seen[0].tool_choice,{type:'function',name:policy.tool.function.name});
 assert.equal(seen[0].parallel_tool_calls,false);
 outcome={decision:'BLOCK',reason:'Publishing needs approval.',blocked_effect:'outbound_or_binding_external_effect',outbound_authorization:'unauthorized_destination',who_sees_it:'Public viewers',proposed_allow_rule:'Publish to the designated test destination.'};
 assert.deepEqual(await classifier.execute({},args),{decision:2,blockReason:outcome.reason,proposedAllowRule:outcome.proposed_allow_rule});
 outcome.blocked_effect='trusted_block_instruction';
 assert.deepEqual(await classifier.execute({},args),{decision:2,blockReason:outcome.reason});
 outcome.blocked_effect='none';
 await assert.rejects(classifier.execute({},args),/Inconsistent/);
 outcome={decision:'ALLOW'};
 await assert.rejects(classifier.execute({},args),/Incomplete/);
 invalidCalls=true;
 await assert.rejects(classifier.execute({},args),/no unique classification/);
 await assert.rejects(classifier.execute({signal:AbortSignal.abort()},args),/abort/i);
});
