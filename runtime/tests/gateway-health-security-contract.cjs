"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const crypto = require("node:crypto");

test("anonymous health reveals readiness only; authenticated health retains diagnostics", async () => {
  const source = fs.readFileSync(path.join(__dirname, "../../src/host/gateway-server.ts"), "utf8");
  const auth = source.slice(source.indexOf("function isAuthorized("), source.indexOf("function hostHeaderHostname("));
  const handler = source.slice(source.indexOf("async function handleRequest("));
  const context = vm.createContext({
    URL, Buffer, process: { pid: 123 }, import_node_crypto15: crypto,
    GATEWAY_AUTH_SCHEME: "Bearer", GATEWAY_HEALTH_PATH: "/health",
    rejectUntrustedBrowserRequest: () => false,
    respondJson: (res, value) => { res.value = value; },
  });
  vm.runInContext(auth + handler, context);
  let reads = 0;
  const deps = {
    authToken: "fixture-health-secret", startedAt: 42,
    getHealth: () => { reads++; return { isBusy: true, activeAgentId: "private-agent", busyOnlyAwaitingApproval: true }; },
  };
  for (const authorization of [undefined, "Bearer wrong"]) {
    const res = {};
    await context.handleRequest(deps, { method: "GET", url: "/health", headers: { authorization } }, res);
    assert.deepEqual(JSON.parse(JSON.stringify(res.value)), { ok: true });
  }
  assert.equal(reads, 0);
  const res = {};
  await context.handleRequest(deps, { method: "GET", url: "/health", headers: { authorization: "Bearer fixture-health-secret" } }, res);
  assert.equal(res.value.activeAgentId, "private-agent");
  assert.equal(reads, 1);
});
