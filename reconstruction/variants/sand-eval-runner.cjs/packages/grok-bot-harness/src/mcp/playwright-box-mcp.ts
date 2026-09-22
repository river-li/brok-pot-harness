/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/mcp/playwright-box-mcp.ts
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var PLAYWRIGHT_BOX_MCP_SERVER_NAME = /^playwright-w(0|[1-9]\d*)$/;
function playwrightBoxMcpServerName(windowIndex) {
  return `playwright-w${windowIndex}`;
}
function playwrightBoxMcpWindowIndex(serverName) {
  const digits = PLAYWRIGHT_BOX_MCP_SERVER_NAME.exec(serverName)?.[1];
  return digits === void 0 ? void 0 : Number(digits);
}

