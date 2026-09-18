var CURSOR_PLAYWRIGHT_PROVIDER_ID = "cursor-browser-extension";
var CURSOR_IDE_BROWSER_PROVIDER_ID = "cursor-ide-browser";
var CURSOR_SELF_CONTROL_PROVIDER_ID = "cursor-dev-control";
var CUSTOM_USER_TOOLS_PROVIDER_ID = "custom-user-tools";
var NON_AUTHENTICATABLE_MCP_PROVIDER_IDS = /* @__PURE__ */ new Set([
  "cursor-app-control",
  "cursor-backend-control",
  CURSOR_PLAYWRIGHT_PROVIDER_ID,
  CURSOR_IDE_BROWSER_PROVIDER_ID,
  CURSOR_SELF_CONTROL_PROVIDER_ID,
  CUSTOM_USER_TOOLS_PROVIDER_ID,
  // Backend-local leases dispatched in-process on the backend. They
  // authenticate with the run's own credentials and have no OAuth client, so
  // an interactive `mcp_auth` flow can never succeed against them. This
  // package cannot depend on the packages that own these identifiers
  // (@anysphere/agent, backend/server), so they are string literals here like
  // "fsd"; each names its owning constant.
  "fsd",
  // FSD_MCP_SERVER_ID (backend/server/src/full-self-driving/mcp/fsdMcpConstants.ts)
  "cursor-subscriptions",
  // CURSOR_SUBSCRIPTIONS_MCP_SERVER_NAME (@anysphere/agent constants)
  "cursor-cloud",
  // CURSOR_CLOUD_MCP_SERVER_ID (backend/server/src/cloud-agent/cursorcloud-mcp/cursorCloudMcp.ts)
  "suggestions",
  // SUGGESTIONS_PLATFORM_MCP_SERVER_ID (backend/server/src/full-self-driving/mcp/suggestionsPlatformCloudMcp.ts)
  "Cursor Slack Tools",
  // SLACK_AGENT_TOOLS_MCP_SERVER_ID (@anysphere/agent constants)
  "Cursor Automation Tools"
  // AUTOMATION_TOOLS_MCP_SERVER_ID (@anysphere/agent constants)
]);
function supportsInteractiveMcpAuth(serverIdentifier) {
  return !NON_AUTHENTICATABLE_MCP_PROVIDER_IDS.has(serverIdentifier);
}
var CURSOR_DYNAMIC_TOOLS_NAMESPACE = "cursor";
var BROWSER_MCP_PROVIDER_IDS = /* @__PURE__ */ new Set([
  CURSOR_SELF_CONTROL_PROVIDER_ID,
  CURSOR_IDE_BROWSER_PROVIDER_ID
]);
function buildMcpToolFileContent(tool) {
  return {
    name: tool.toolName,
    description: tool.description,
    arguments: tool.inputSchema,
    outputSchema: tool.outputSchema,
    plugin: tool.plugin,
    marketplace: tool.marketplace,
    pluginId: tool.pluginId,
    marketplaceId: tool.marketplaceId
  };
}
function parseMcpInputSchemaJson(inputSchemaJson) {
  if (inputSchemaJson === void 0) {
    return void 0;
  }
  try {
    return JSON.parse(inputSchemaJson);
  } catch (_a20) {
    return void 0;
  }
}
function mcpInputSchemaToJson(tool) {
  var _a20;
  var _b2;
  return (_b2 = parseMcpInputSchemaJson(tool.inputSchemaJson)) !== null && _b2 !== void 0 ? _b2 : (_a20 = tool.inputSchema) === null || _a20 === void 0 ? void 0 : _a20.toJson();
}
var McpLeaseChangeReason;
(function(McpLeaseChangeReason2) {
  McpLeaseChangeReason2["Snapshots"] = "cursor_mcp_lease_snapshot_store";
  McpLeaseChangeReason2["Status"] = "cursor_mcp_lease_server_status";
  McpLeaseChangeReason2["Settings"] = "cursor_mcp_lease_settings";
  McpLeaseChangeReason2["Providers"] = "cursor_mcp_lease_providers";
  McpLeaseChangeReason2["Unknown"] = "cursor_mcp_lease_unknown";
})(McpLeaseChangeReason || (McpLeaseChangeReason = {}));
function isFullMcpLeaseInvalidation(e) {
  return e === void 0 || e.serverIdentifiers === void 0;
}
function mergeMcpLeaseEvents(...events) {
  var _a20, _b2, _c2, _d, _e2;
  const [a, b2] = events;
  if (events.length < 2) {
    return a;
  }
  if (isFullMcpLeaseInvalidation(b2)) {
    return {
      serverIdentifiers: void 0,
      reason: (_a20 = a === null || a === void 0 ? void 0 : a.reason) !== null && _a20 !== void 0 ? _a20 : b2 === null || b2 === void 0 ? void 0 : b2.reason
    };
  }
  if (a === void 0) {
    return b2;
  }
  if (isFullMcpLeaseInvalidation(a)) {
    return {
      serverIdentifiers: void 0,
      reason: (_b2 = a.reason) !== null && _b2 !== void 0 ? _b2 : b2 === null || b2 === void 0 ? void 0 : b2.reason
    };
  }
  return {
    serverIdentifiers: [
      .../* @__PURE__ */ new Set([
        ...(_c2 = a.serverIdentifiers) !== null && _c2 !== void 0 ? _c2 : [],
        ...(_d = b2 === null || b2 === void 0 ? void 0 : b2.serverIdentifiers) !== null && _d !== void 0 ? _d : []
      ])
    ],
    reason: (_e2 = a.reason) !== null && _e2 !== void 0 ? _e2 : b2 === null || b2 === void 0 ? void 0 : b2.reason
  };
}
function mcpServerUnavailableReason(status) {
  switch (status) {
    case "needsAuth":
      return "This MCP server requires authentication before its tools can be used.";
    case "error":
      return "This MCP server failed during live tool discovery. Its tools are unavailable until the connection is fixed.";
    case "loading":
      return "This MCP server is still loading; tools may not be available yet.";
    default:
      return void 0;
  }
}
function mcpClientStateToServerStatus(state) {
  switch (state.kind) {
    case "ready":
      return "connected";
    case "requires_authentication":
      return "needsAuth";
    case "error":
      return "error";
    default:
      return "loading";
  }
}
var mcpExecutorResource = createResource((execManager) => new ExecutorResource(execManager, createServerSerializer("mcpArgs"), createClientDeserializer("mcpResult")), (implementation, controlledExecManager) => {
  controlledExecManager.register(new SimpleControlledExecHandler(implementation, createServerDeserializer("mcpArgs"), createClientSerializer("mcpResult")));
});
var listMcpResourcesExecutorResource = createResource((execManager) => new ExecutorResource(execManager, createServerSerializer("listMcpResourcesExecArgs"), createClientDeserializer("listMcpResourcesExecResult")), (implementation, controlledExecManager) => {
  controlledExecManager.register(new SimpleControlledExecHandler(implementation, createServerDeserializer("listMcpResourcesExecArgs"), createClientSerializer("listMcpResourcesExecResult")));
});
var readMcpResourceExecutorResource = createResource((execManager) => new ExecutorResource(execManager, createServerSerializer("readMcpResourceExecArgs"), createClientDeserializer("readMcpResourceExecResult")), (implementation, controlledExecManager) => {
  controlledExecManager.register(new SimpleControlledExecHandler(implementation, createServerDeserializer("readMcpResourceExecArgs"), createClientSerializer("readMcpResourceExecResult")));
});
var mcpStateExecutorResource = createResource((execManager) => new ExecutorResource(execManager, createServerSerializer("mcpStateExecArgs"), createClientDeserializer("mcpStateExecResult")), (implementation, controlledExecManager) => {
  controlledExecManager.register(new SimpleControlledExecHandler(implementation, createServerDeserializer("mcpStateExecArgs"), createClientSerializer("mcpStateExecResult")));
});
