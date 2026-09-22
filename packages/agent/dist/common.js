/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/common.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var isEqual = (a, b2) => {
  if (a.length !== b2.length)
    return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b2[i])
      return false;
  }
  return true;
};
function getBrowserToolNames(mcpTools) {
  return mcpTools.filter((tool) => BROWSER_MCP_PROVIDER_IDS.has(tool.providerIdentifier)).map((tool) => tool.name);
}
function getBrowserMcpProviderName(browserTools) {
  if (!browserTools?.length)
    return void 0;
  const prefixedTool = browserTools.find((t) => t.includes("-browser_"));
  if (!prefixedTool)
    return void 0;
  const idx = prefixedTool.indexOf("-browser_");
  return idx > 0 ? prefixedTool.substring(0, idx) : void 0;
}

