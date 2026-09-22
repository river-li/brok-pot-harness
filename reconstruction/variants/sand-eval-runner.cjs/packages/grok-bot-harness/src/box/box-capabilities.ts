/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/box/box-capabilities.ts
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function boxMaxWindows(box) {
  return box.maxWindows?.() ?? 1;
}
function boxSupportsMultiWindow(box) {
  return boxMaxWindows(box) > 1;
}
function boxAgentWindowIndex(box, agentId) {
  return box.getAgentWindowIndex?.(agentId);
}
function boxTerminalsFolder(box) {
  return box.getTerminalsFolder?.();
}
function boxIsPreparing(box, agentId) {
  return box.isPreparing?.(agentId) ?? false;
}
async function boxLoadMcpServers(box, ctx, configJson, options2) {
  if (box.loadMcpServers == null) {
    throw new BoxMcpUnsupportedError();
  }
  return await box.loadMcpServers(ctx, configJson, options2);
}
async function boxMcpResourceAccessor(box, ctx) {
  if (box.mcpResourceAccessor == null) {
    throw new BoxMcpUnsupportedError();
  }
  return await box.mcpResourceAccessor(ctx);
}
async function boxAgentMcpHost(box, ctx, agentId) {
  return await box.agentMcpHost?.(ctx, agentId);
}

