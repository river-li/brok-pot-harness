function boxMaxWindows(box) {
  return box.maxWindows?.() ?? 1;
}
function boxSupportsMultiWindow(box) {
  return boxMaxWindows(box) > 1;
}
function boxAgentWindowIndex(box, agentId) {
  return box.getAgentWindowIndex?.(agentId);
}
function boxAssignedWindowIndexes(box) {
  return box.getAssignedWindowIndexes?.() ?? [];
}
async function boxRefreshAssignedWindows(box, ctx) {
  await box.refreshAssignedWindows?.(ctx);
}
function boxTerminalsFolder(box) {
  return box.getTerminalsFolder?.();
}
async function boxIsAvailable(box) {
  return box.isAvailable == null ? true : box.isAvailable();
}
function boxIsPreparing(box, agentId) {
  return box.isPreparing?.(agentId) ?? false;
}
function boxDescription(box) {
  return box.describe?.();
}
async function boxApplyEnvironment(box, ctx, update) {
  if (box.applyEnvironment == null) {
    throw new BoxEnvironmentSyncUnsupportedError();
  }
  await box.applyEnvironment(ctx, update);
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
