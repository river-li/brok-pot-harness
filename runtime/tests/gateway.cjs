const assert = require('node:assert/strict');
const fs = require('node:fs');
const base = process.env.GROKBOT_GATEWAY_URL || 'http://127.0.0.1:1540';
const token = process.env.SAND_GATEWAY_TOKEN || '';
async function call(method, args = {}) {
  const response = await fetch(`${base}/api/${method}`, {
    method: 'POST', headers: { 'content-type': 'application/json', ...(token ? {authorization: `Bearer ${token}`} : {}) },
    body: JSON.stringify(args), signal: AbortSignal.timeout(20000),
  });
  const data = await response.json();
  assert.equal(response.status, 200, `${method}: ${JSON.stringify(data)}`);
  return data;
}
(async () => {
  const health = await (await fetch(`${base}/health`)).json();
  assert.equal(health.ok, true); console.log('PASS gateway health');
  const status = await call('getHostStatus', {includeManagedCapabilities: false});
  assert.ok(status.capabilities); console.log('PASS host capabilities');
  await call('getHostSettings'); console.log('PASS persistent settings');
  await call('getPauseState'); console.log('PASS scheduler pause state');
  const result = await call('createAgent', {name: 'Runtime recovery verification', description: 'Local integration test',
    isIntroductionSuppressed: true, isKickstartRequested: false});
  const id = result.agent.id;
  assert.ok(id); console.log('PASS create agent');
  const agents = await call('listAgents');
  assert.ok(Array.isArray(agents) && agents.some(a => a.id === id));
  const transcript = await call('getAgentTranscript', {id});
  assert.ok(transcript); console.log('PASS transcript store and agent listing');
  // Keep the test agent to verify durability after restart, in the isolated test profile.
  fs.writeFileSync('/tmp/grokbot-verified-agent.json', JSON.stringify({id}));
})().catch(error => {console.error(error); process.exitCode = 1;});
