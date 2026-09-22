/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/utils/mcp-file-system.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_agent_pb();
function getDsv3McpFileSystemToolNames(modelInfo) {
  if (modelInfo?.isComposerMatterhorn === true && modelInfo.isRawTrainingSlug !== true) {
    return {
      callMcpTool: "CallMcpTool",
      listMcpResources: "ListMcpResources",
      fetchMcpResource: "FetchMcpResource"
    };
  }
  return {
    callMcpTool: "call_mcp_tool",
    listMcpResources: "list_mcp_resources",
    fetchMcpResource: "fetch_mcp_resource"
  };
}
function getDsv3McpFileSystemInstructions(params) {
  const isAskMode = params.mode === AgentMode.ASK;
  const shouldFilterEditToolsInAskMode = isAskMode && (params.enableFilterEditToolsInAskMode ?? true);
  if (shouldFilterEditToolsInAskMode) {
    return "";
  }
  if (params.mcpMetaToolOptions?.enabled === true) {
    return "";
  }
  const mcpFileSystemOptions = params.mcpFileSystemOptions;
  const mcpDescriptorsCount = mcpFileSystemOptions?.mcpDescriptors.length ?? 0;
  const hasMcpDescriptors = mcpDescriptorsCount > 0;
  const isMcpFileSystemEnabled = mcpFileSystemOptions?.enabled ?? false;
  const isMcpFileSystemCompatible = params.featureFlags?.enableMCPFileSystem === true;
  if (!isMcpFileSystemEnabled || !isMcpFileSystemCompatible || !hasMcpDescriptors || !mcpFileSystemOptions) {
    return "";
  }
  const instructions = McpFileSystemInstructions(mcpFileSystemOptions, {
    ...getDsv3McpFileSystemToolNames(params.modelInfo),
    mcpAuthInstruction: MCP_AUTH_INSTRUCTION
  });
  return `${instructions}

If the available MCP tools do not fully support what the user asked you to do, complete the work you can with the current tool set. In your work summary, include what you were unable to do with MCP and why. Do not use browser automation to work around missing or unavailable MCP tools unless the user explicitly asks you to use the browser.`;
}

