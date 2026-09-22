var PLAYWRIGHT_BOX_MCP_SERVER_NAME = /^playwright-w(0|[1-9]\d*)$/;
var PLAYWRIGHT_ACTION_TIMEOUT_MS = 1e4;
function playwrightBoxMcpServerName(windowIndex) {
  return `playwright-w${windowIndex}`;
}
function playwrightBoxMcpWindowIndex(serverName) {
  const digits = PLAYWRIGHT_BOX_MCP_SERVER_NAME.exec(serverName)?.[1];
  return digits === void 0 ? void 0 : Number(digits);
}
function playwrightBoxMcpServers(windowIndexes) {
  return Object.fromEntries(
    windowIndexes.map((windowIndex) => [
      playwrightBoxMcpServerName(windowIndex),
      {
        type: "stdio",
        command: "playwright-mcp",
        args: [
          "--cdp-endpoint",
          `http://127.0.0.1:${SAND_BOX_CDP_PORT_BASE + windowIndex}`,
          "--timeout-action",
          String(PLAYWRIGHT_ACTION_TIMEOUT_MS)
        ]
      }
    ])
  );
}
async function playwrightBoxMcpServersForBox(box, ctx, agentId, source) {
  const connection = await box.ensureReady(ctx, agentId);
  await ensurePlaywrightMcpInstalled({ box, connection, ctx, agentId, source });
  await boxRefreshAssignedWindows(box, ctx);
  return playwrightBoxMcpServers(boxAssignedWindowIndexes(box));
}
