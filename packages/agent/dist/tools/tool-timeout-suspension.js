/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/tools/tool-timeout-suspension.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_dist4();
var toolExecutionTimeoutSuspensionKey = createKey(/* @__PURE__ */ Symbol("toolExecutionTimeoutSuspension"), void 0);
async function withToolExecutionTimeoutSuspended(ctx, fn) {
  const suspension = ctx.get(toolExecutionTimeoutSuspensionKey);
  if (suspension === void 0) {
    return await fn();
  }
  const resume = suspension.suspend();
  try {
    return await fn();
  } finally {
    resume();
  }
}

