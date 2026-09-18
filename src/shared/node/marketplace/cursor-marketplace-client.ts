async function bestEffortToken(getAccessToken) {
  try {
    const token = await getAccessToken();
    return token != null && token.length > 0 ? token : void 0;
  } catch (error41) {
    reportMcpHostEdgeFailure("marketplace-token", error41);
    return void 0;
  }
}
async function bestEffortMachineId(getMachineId) {
  if (getMachineId == null) return "";
  try {
    return await getMachineId() ?? "";
  } catch (error41) {
    reportMcpHostEdgeFailure("marketplace-machine-id", error41);
    return "";
  }
}
async function ghostModePinnedForMetadataOnlyReads() {
  return "true";
}
function marketplaceBackendClientOptions(backend, getAccessToken, getMachineId) {
  return {
    backend,
    authMode: "best-effort",
    getAccessToken: () => bestEffortToken(getAccessToken),
    getMachineId: () => bestEffortMachineId(getMachineId),
    resolveGhostModeHeader: ghostModePinnedForMetadataOnlyReads
  };
}
function createDashboardClient(backend, getAccessToken, getMachineId) {
  return createSandCursorBackendClient(
    DashboardService2,
    marketplaceBackendClientOptions(backend, getAccessToken, getMachineId)
  );
}
function marketplaceDashboardClientFor(backend) {
  return (getAccessToken, getMachineId) => createDashboardClient(backend, getAccessToken, getMachineId);
}
var CURSOR_MARKETPLACE_REQUEST_TIMEOUT_MS;
var init_cursor_marketplace_client = __esm({
  "src/shared/node/marketplace/cursor-marketplace-client.ts"() {
    "use strict";
    init_proto();
    init_cursor_inference();
    init_mcp_diagnostics();
    CURSOR_MARKETPLACE_REQUEST_TIMEOUT_MS = 12e3;
  }
});
