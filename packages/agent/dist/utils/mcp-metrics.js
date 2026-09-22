/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/utils/mcp-metrics.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_dist4();
var logger51 = createLogger("mcp.meta.failure");
var getMcpToolsDuration = createHistogram("mcp.meta.get_tools_duration_ms", {
  description: "Duration of GetMcpTools calls in milliseconds",
  labelNames: ["mode"]
});
var getMcpToolsSuccess = createCounter("mcp.meta.get_tools_success", {
  description: "Successful GetMcpTools calls",
  labelNames: ["mode"]
});
var getMcpToolsError = createCounter("mcp.meta.get_tools_error", {
  description: "Failed GetMcpTools calls",
  labelNames: ["mode", "failure_reason"]
});
var getMcpToolsResultCount = createHistogram("mcp.meta.get_tools_result_count", {
  description: "Number of results returned by GetMcpTools",
  labelNames: ["mode"]
});
var getMcpToolsResponseBytes = createHistogram("mcp.meta.get_tools_response_bytes", {
  description: "Size of GetMcpTools response in bytes (context window impact)",
  labelNames: ["mode"]
});
var getMcpToolsPayloadBytes = createHistogram("mcp.meta.get_tools_payload_bytes", {
  description: "Size of the full GetMcpTools JSON payload before any file-output truncation",
  labelNames: ["mode"]
});
var getMcpToolsFileOutput = createCounter("mcp.meta.get_tools_file_output", {
  description: "GetMcpTools calls that wrote output to file (large results)",
  labelNames: ["mode"]
});
var callMcpToolDuration = createHistogram("mcp.meta.call_tool_duration_ms", {
  description: "Duration of CallMcpTool calls in milliseconds",
  labelNames: ["mcp_mode"]
});
var callMcpToolSuccess = createCounter("mcp.meta.call_tool_success", {
  description: "Successful CallMcpTool calls",
  labelNames: ["mcp_mode"]
});
var callMcpToolError = createCounter("mcp.meta.call_tool_error", {
  description: "Failed CallMcpTool calls",
  labelNames: ["mcp_mode", "failure_reason", "retryable"]
});
var callMcpToolWithoutReadDef = createCounter("mcp.meta.call_tool_without_read_def", {
  description: "CallMcpTool called without reading tool definition first (model error)",
  labelNames: ["mcp_mode"]
});
var callMcpToolResponseBytes = createHistogram("mcp.meta.call_tool_response_bytes", {
  description: "Size of CallMcpTool response in bytes (context window impact)",
  labelNames: ["mcp_mode"]
});
var callMcpToolOutputSpill = createCounter("mcp.meta.output_spill", {
  description: "Outcome of spilling oversized MCP tool output to an agent-tools file",
  labelNames: ["outcome"]
});
var fetchMcpResourceDuration = createHistogram("mcp.meta.fetch_resource_duration_ms", {
  description: "Duration of FetchMcpResource calls in milliseconds",
  labelNames: ["mcp_mode"]
});
var fetchMcpResourceSuccess = createCounter("mcp.meta.fetch_resource_success", {
  description: "Successful FetchMcpResource calls",
  labelNames: ["mcp_mode"]
});
var fetchMcpResourceError = createCounter("mcp.meta.fetch_resource_error", {
  description: "Failed FetchMcpResource calls",
  labelNames: ["mcp_mode", "failure_reason"]
});
var fetchMcpResourceResponseBytes = createHistogram("mcp.meta.fetch_resource_response_bytes", {
  description: "Size of FetchMcpResource response in bytes (context window impact)",
  labelNames: ["mcp_mode"]
});
var mcpEligibleModelInvocation = createCounter("mcp.discovery.eligible_model_invocation", {
  description: "Model invocations where MCP discovery was available (tagged by discovery mode; use companion histogram for server counts)",
  labelNames: ["mcp_discovery_mode"]
});
var mcpDiscoveryEligibleCatalogServerCount = createHistogram("mcp.discovery.eligible_catalog_server_count", {
  description: "MCP server count in discovery context for eligible model invocations (histogram value is the raw count)",
  labelNames: ["mcp_discovery_mode"]
});
var mcpPromptToolTokens = createHistogram("mcp.discovery.prompt_tool_tokens", {
  description: "Prompt token count attributable to MCP tool definitions for a model invocation",
  labelNames: ["mcp_discovery_mode"]
});
var mcpPromptToolCount = createHistogram("mcp.discovery.prompt_tool_count", {
  description: "Prompt-visible MCP tool count for a model invocation (histogram value is the raw count)",
  labelNames: ["mcp_discovery_mode"]
});
var mcpSearchThenCallResult = createCounter("mcp.meta.search_then_call_result", {
  description: "Outcome of CallMcpTool executions that were preceded by GetMcpTools in search mode within the same turn",
  labelNames: ["outcome"]
});
function getGetMcpToolsMode(args) {
  if (args.toolName !== void 0) {
    return "tool_detail";
  }
  if (args.pattern !== void 0) {
    return "search";
  }
  if (args.server === void 0) {
    return "catalog";
  }
  return "server_detail";
}
function emitGetMcpToolsMetrics(ctx, input) {
  const { mode, durationMs, success: success2, failureReason, resultCount, responseBytes, payloadBytes, wroteToFile } = input;
  getMcpToolsDuration.histogram(ctx, durationMs, { mode });
  if (success2) {
    getMcpToolsSuccess.increment(ctx, 1, { mode });
  } else {
    getMcpToolsError.increment(ctx, 1, {
      mode,
      failure_reason: failureReason ?? "unknown"
    });
  }
  if (resultCount !== void 0) {
    getMcpToolsResultCount.histogram(ctx, resultCount, { mode });
  }
  if (responseBytes !== void 0) {
    getMcpToolsResponseBytes.histogram(ctx, responseBytes, { mode });
  }
  if (payloadBytes !== void 0) {
    getMcpToolsPayloadBytes.histogram(ctx, payloadBytes, { mode });
  }
  if (wroteToFile) {
    getMcpToolsFileOutput.increment(ctx, 1, { mode });
  }
}
function emitCallMcpToolMetrics(ctx, input) {
  const { mcpMode, durationMs, success: success2, failureReason, retryable, responseBytes, calledWithoutReadDef } = input;
  callMcpToolDuration.histogram(ctx, durationMs, { mcp_mode: mcpMode });
  if (success2) {
    callMcpToolSuccess.increment(ctx, 1, { mcp_mode: mcpMode });
  } else {
    callMcpToolError.increment(ctx, 1, {
      mcp_mode: mcpMode,
      failure_reason: failureReason ?? "unknown",
      retryable: String(retryable ?? false)
    });
  }
  if (responseBytes !== void 0) {
    callMcpToolResponseBytes.histogram(ctx, responseBytes, {
      mcp_mode: mcpMode
    });
  }
  if (calledWithoutReadDef) {
    callMcpToolWithoutReadDef.increment(ctx, 1, { mcp_mode: mcpMode });
  }
}
function emitMcpOutputSpillOutcome(ctx, outcome) {
  callMcpToolOutputSpill.increment(ctx, 1, { outcome });
}
function emitMcpEligibleModelInvocation(ctx, input) {
  if (input.discoveryMode === "disabled") {
    return;
  }
  mcpEligibleModelInvocation.increment(ctx, 1, {
    mcp_discovery_mode: input.discoveryMode
  });
  mcpDiscoveryEligibleCatalogServerCount.histogram(ctx, input.serverCount, {
    mcp_discovery_mode: input.discoveryMode
  });
}
function emitMcpPromptToolStats(ctx, input) {
  if (input.discoveryMode === "disabled") {
    return;
  }
  const tags = {
    mcp_discovery_mode: input.discoveryMode
  };
  mcpPromptToolTokens.histogram(ctx, input.toolTokens, tags);
  mcpPromptToolCount.histogram(ctx, input.toolCount, tags);
}
function emitMcpSearchThenCallResult(ctx, outcome) {
  mcpSearchThenCallResult.increment(ctx, 1, { outcome });
}
var GET_MCP_TOOLS_FAILURE_REASONS = {
  INVALID_REGEX: "invalid_regex",
  SERVER_NOT_FOUND: "server_not_found",
  TOOL_NOT_FOUND: "tool_not_found",
  INVALID_ARGS: "invalid_args",
  OTHER: "other"
};
var CALL_MCP_TOOL_FAILURE_REASONS = {
  SERVER_NOT_FOUND: "server_not_found",
  TOOL_NOT_FOUND: "tool_not_found",
  EXEC_NOT_FOUND: "exec_not_found",
  PERMISSION_DENIED: "permission_denied",
  TRANSPORT_ERROR: "transport_error",
  REJECTED: "rejected",
  WITHOUT_READ_DEF: "without_read_def",
  OTHER: "other"
};
function reportMcpMetaToolFailure(ctx, error42, data) {
  const errorMessage6 = error42 instanceof Error ? error42.message : typeof error42 === "string" ? error42 : String(error42);
  const logData = {
    tool: data.tool,
    failure_reason: data.failureReason,
    retryable: data.retryable,
    server: data.server,
    toolName: data.toolName,
    mode: data.mode,
    mcp_mode: data.mcpMode,
    duration_ms: data.durationMs,
    error_message: data.errorMessage ?? errorMessage6
  };
  logger51.warn(ctx, "MCP meta tool failure", logData);
}
var MCP_DIR_SEGMENT = "/mcps/";
var mcpDirectoryAccess = createCounter("agent.tools.mcp_directory_access", {
  description: "Number of times a tool accessed the MCP file system directory (tool descriptors, resources, etc.)",
  labelNames: ["tool"]
});
var mcpDirectoryResponseBytes = createHistogram("agent.tools.mcp_directory_response_bytes", {
  description: "Size of tool response in bytes when accessing the MCP file system directory (context window impact)",
  labelNames: ["tool"]
});
function isMcpDirectoryPath2(path31) {
  return path31?.includes(MCP_DIR_SEGMENT) ?? false;
}
function trackMcpDirectoryAccessIfApplicable(ctx, path31, tool) {
  if (isMcpDirectoryPath2(path31)) {
    mcpDirectoryAccess.increment(ctx, 1, { tool });
  }
}
function trackMcpDirectoryResponseBytes(ctx, responseBytes, tool) {
  mcpDirectoryResponseBytes.histogram(ctx, responseBytes, { tool });
}

