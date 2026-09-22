/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/runner/tools/mcp-meta-tools.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_mcp_tool_annotations();
init_mcp_pb();
init_esm();
init_errors();
function sandToolCallExecutionTimeoutMs(toolName, isComputerUseSubagent) {
  return toolCallExecutionGuardMs(isComputerUseSubagent ? "subagent" : toolName);
}
function createMcpPauseCancelledError(toolName) {
  const message = `The ${toolName} call was cancelled because this agent's computer is restarting for a system update. The request may or may not have reached the connector, so verify its effect before assuming it happened; retry it after you resume if the work still matters.`;
  return new ToolTimeoutError({
    clientVisibleErrorMessage: message,
    modelVisibleErrorMessage: message,
    error: message
  });
}
function dynamicToolCallErrorClass(error42) {
  if (error42 instanceof CustomToolCallError) return error42.classification;
  if (error42 instanceof ToolTimeoutError) return "timeout";
  return errorLogTag(error42);
}
var MCP_INVOCATION_TOOL_NAMES = /* @__PURE__ */ new Set(["callmcptool", "mcp", "calldynamictool"]);
function invokedToolNameOf(value) {
  if (typeof value !== "object" || value === null || !("toolName" in value)) return void 0;
  return typeof value.toolName === "string" ? value.toolName : void 0;
}
function invokesDesignatedDangerousMcpTool(rawArgs) {
  let parsed2;
  try {
    parsed2 = JSON.parse(rawArgs);
  } catch {
    return false;
  }
  let invoked = invokedToolNameOf(parsed2);
  if (invoked !== void 0 && MCP_INVOCATION_TOOL_NAMES.has(invoked.trim().toLowerCase().replaceAll("_", ""))) {
    const nested = typeof parsed2 === "object" && parsed2 !== null && "arguments" in parsed2 ? parsed2.arguments : void 0;
    invoked = invokedToolNameOf(nested);
  }
  return invoked !== void 0 && DESIGNATED_DANGEROUS_MCP_TOOL_NAMES.has(invoked);
}
function wrapDynamicInvocationToolWithTimeout({
  tool,
  dynamicToolRegistry,
  isComputerUseSubagent,
  registerPauseCancel,
  observeDynamicToolCall
}) {
  return {
    ...tool,
    execute: async (ctx, interactionHandler, argsStream, meta) => {
      let rawArgs = "";
      for await (const chunk of argsStream) {
        rawArgs += chunk;
      }
      const dispatch = dynamicToolRegistry !== void 0 ? resolveDynamicDispatch(rawArgs, dynamicToolRegistry) : void 0;
      const args = (async function* () {
        yield rawArgs;
      })();
      const inProcessFirstPartyToolName = dispatch?.kind === "dynamic" ? dispatch.registeredToolName : void 0;
      const isConnectorCall = inProcessFirstPartyToolName === void 0;
      const effectiveToolName = inProcessFirstPartyToolName ?? tool.name;
      const executionTimeoutMs = isConnectorCall && invokesDesignatedDangerousMcpTool(rawArgs) ? DANGEROUS_MCP_TOOL_EXECUTE_TIMEOUT_MS : sandToolCallExecutionTimeoutMs(effectiveToolName, isComputerUseSubagent);
      let paused = false;
      const [callCtx, cancelCall] = ctx.withCancel();
      const unregisterPauseCancel = isConnectorCall ? registerPauseCancel?.(() => {
        paused = true;
        cancelCall(new Error("quiescing for forced host upgrade"));
      }) : void 0;
      if (paused) {
        unregisterPauseCancel?.();
        throw createMcpPauseCancelledError(effectiveToolName);
      }
      const guarded = wrapToolWithTimeout(tool, {
        timeoutMs: executionTimeoutMs,
        cancellationWinddownMs: 0,
        createTimeoutError: () => paused ? createMcpPauseCancelledError(effectiveToolName) : createToolCallExecutionTimeoutError({
          toolName: effectiveToolName,
          executionTimeoutMs
        })
      });
      const startedPerfMs = performance.now();
      const reportDynamicOutcome = (outcome, error42) => {
        if (dispatch?.kind !== "dynamic") return;
        observeDynamicToolCall?.({
          kind: "dynamic",
          toolCallId: meta.toolCallId,
          toolName: inProcessFirstPartyToolName ?? "unknown",
          outcome,
          ...outcome === "error" ? { errorClass: dynamicToolCallErrorClass(error42) } : {},
          durationMs: Math.round(performance.now() - startedPerfMs)
        });
      };
      try {
        const result = await guarded.execute(callCtx, interactionHandler, args, meta);
        reportDynamicOutcome("ok");
        return result;
      } catch (error42) {
        if (!(callCtx.canceled && isIntentionalAbortReason(callCtx.reason))) {
          reportDynamicOutcome("error", error42);
        }
        throw error42;
      } finally {
        unregisterPauseCancel?.();
      }
    }
  };
}
function createSandMcpMetaToolOptions(mcpTools) {
  const descriptors = /* @__PURE__ */ new Map();
  for (const tool of mcpTools) {
    const serverIdentifier = tool.providerIdentifier;
    let descriptor2 = descriptors.get(serverIdentifier);
    if (descriptor2 == null) {
      descriptor2 = {
        serverName: tool.providerIdentifier,
        plugin: tool.plugin,
        marketplace: tool.marketplace,
        pluginDbId: tool.pluginId,
        marketplaceId: tool.marketplaceId,
        tools: []
      };
      descriptors.set(serverIdentifier, descriptor2);
    }
    descriptor2.tools.push(
      new McpToolDescriptor({
        toolName: tool.toolName,
        description: tool.description,
        inputSchema: tool.inputSchema !== void 0 ? Value.fromJson(tool.inputSchema) : void 0,
        ...toolAnnotationsJsonField(tool.annotations)
      })
    );
  }
  return new McpMetaToolOptions({
    enabled: true,
    mcpDescriptors: [...descriptors.entries()].map(
      ([serverIdentifier, descriptor2]) => new McpDescriptor({
        serverIdentifier,
        serverName: descriptor2.serverName,
        plugin: descriptor2.plugin,
        marketplace: descriptor2.marketplace,
        pluginDbId: descriptor2.pluginDbId,
        marketplaceId: descriptor2.marketplaceId,
        tools: descriptor2.tools.sort((a, b2) => a.toolName.localeCompare(b2.toolName))
      })
    )
  });
}

