var __addDisposableResource17 = function(env, value, async) {
  if (value !== null && value !== void 0) {
    if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
    var dispose, inner;
    if (async) {
      if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
      dispose = value[Symbol.asyncDispose];
    }
    if (dispose === void 0) {
      if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
      dispose = value[Symbol.dispose];
      if (async) inner = dispose;
    }
    if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
    if (inner) dispose = function() {
      try {
        inner.call(this);
      } catch (e) {
        return Promise.reject(e);
      }
    };
    env.stack.push({ value, dispose, async });
  } else if (async) {
    env.stack.push({ async: true });
  }
  return value;
};
var __disposeResources17 = /* @__PURE__ */ (function(SuppressedError2) {
  return function(env) {
    function fail(e) {
      env.error = env.hasError ? new SuppressedError2(e, env.error, "An error was suppressed during disposal.") : e;
      env.hasError = true;
    }
    var r, s3 = 0;
    function next() {
      while (r = env.stack.pop()) {
        try {
          if (!r.async && s3 === 1) return s3 = 0, env.stack.push(r), Promise.resolve().then(next);
          if (r.dispose) {
            var result = r.dispose.call(r.value);
            if (r.async) return s3 |= 2, Promise.resolve(result).then(next, function(e) {
              fail(e);
              return next();
            });
          } else s3 |= 1;
        } catch (e) {
          fail(e);
        }
      }
      if (s3 === 1) return env.hasError ? Promise.reject(env.error) : Promise.resolve();
      if (env.hasError) throw env.error;
    }
    return next();
  };
})(typeof SuppressedError === "function" ? SuppressedError : function(error41, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error41, e.suppressed = suppressed, e;
});
var logger53 = createLogger("tools/mcp");
var McpPermissionDeniedError = class extends CustomToolCallError {
  constructor(error41, isReadonly) {
    super(ToolErrorClassification.UNEXPECTED_ENVIRONMENT, {
      error: error41,
      clientVisibleErrorMessage: isReadonly ? ASK_MODE_MODEL_ERROR : `Permission denied: ${error41}`,
      modelVisibleErrorMessage: isReadonly ? ASK_MODE_MODEL_ERROR : `Permission denied: ${error41}`
    });
    this.error = error41;
    this.isReadonly = isReadonly;
  }
};
var DynamicToolExecutionError = class extends CustomToolCallError {
  constructor() {
    super(...arguments);
    this.hideFromClientToolCall = true;
  }
};
var McpServerDoesNotExistError = class extends CustomToolCallError {
  constructor(serverIdentifier, readServerDefReminder) {
    super(ToolErrorClassification.UNEXPECTED_ENVIRONMENT, {
      error: `MCP server does not exist: ${serverIdentifier}`,
      clientVisibleErrorMessage: `MCP server does not exist: ${serverIdentifier}`,
      modelVisibleErrorMessage: `MCP server does not exist: ${serverIdentifier}. ${readServerDefReminder}`
    });
    this.serverIdentifier = serverIdentifier;
    this.readServerDefReminder = readServerDefReminder;
  }
};
var McpToolDoesNotExistError = class extends CustomToolCallError {
  constructor(serverIdentifier, toolName, readToolDefReminder) {
    super(ToolErrorClassification.UNEXPECTED_ENVIRONMENT, {
      error: `MCP tool does not exist: server=${serverIdentifier}, tool=${toolName}`,
      clientVisibleErrorMessage: `MCP tool does not exist: ${toolName}`,
      modelVisibleErrorMessage: "unused"
      // model visible message defined in serializeError
    });
    this.serverIdentifier = serverIdentifier;
    this.toolName = toolName;
    this.readToolDefReminder = readToolDefReminder;
  }
};
var McpExecToolNotFoundError = class extends CustomToolCallError {
  constructor(errorMessage6) {
    super(ToolErrorClassification.UNEXPECTED_ENVIRONMENT, {
      error: errorMessage6,
      clientVisibleErrorMessage: errorMessage6,
      modelVisibleErrorMessage: errorMessage6
    });
  }
};
async function wasPrecededByGetMcpToolsSearch(ctx, stateHandler) {
  if (!stateHandler || !("turns" in stateHandler)) {
    return false;
  }
  try {
    const lastTurn = await stateHandler.turns.at(-1)?.get(ctx);
    if (!(lastTurn instanceof AgentConversationTurnHandle)) {
      return false;
    }
    for (let i = lastTurn.steps.length - 1; i >= 0; i--) {
      const step = await lastTurn.steps[i].get(ctx);
      if (step.message.case !== "toolCall") {
        continue;
      }
      if (step.message.value.tool.case === "getMcpToolsToolCall" && step.message.value.tool.value.args?.pattern !== void 0) {
        return true;
      }
    }
  } catch {
    return false;
  }
  return false;
}
var APP_OWNED_MCP_SERVER_IDENTIFIERS = /* @__PURE__ */ new Set([
  "cursor-app-control",
  "cursor-browser-extension",
  "cursor-dev-control",
  "cursor-ide-browser"
]);
function getMcpToolOrigin(serverIdentifier) {
  if (serverIdentifier !== void 0 && APP_OWNED_MCP_SERVER_IDENTIFIERS.has(serverIdentifier)) {
    return "built-in";
  }
  return "external";
}
var McpWithoutReadToolDefinitionError = class extends CustomToolCallError {
  constructor(error41, readToolDefReminder, classification = ToolErrorClassification.OTHER_ERROR) {
    const errorMessage6 = error41 instanceof Error ? error41.message : String(error41);
    super(classification, {
      error: `Error in call_mcp_tool: ${errorMessage6} without reading the tool definition`,
      clientVisibleErrorMessage: "Tool execution error",
      modelVisibleErrorMessage: `${errorMessage6}. ${readToolDefReminder}`
    });
    this.error = error41;
    this.readToolDefReminder = readToolDefReminder;
  }
};
var McpInvalidArgsToolDefinitionReminderError = class extends CustomToolCallError {
  constructor(error41, readToolDefReminder) {
    super(ToolErrorClassification.INVALID_ARGS, {
      error: error41.message,
      clientVisibleErrorMessage: "Tool execution error",
      modelVisibleErrorMessage: `${error41.message}. ${readToolDefReminder}`
    });
  }
};
function getWrappedMcpErrorClassification(error41) {
  if (error41 instanceof CustomToolCallError) {
    return error41.classification;
  }
  return ToolErrorClassification.OTHER_ERROR;
}
function isInvalidMcpArgumentsError(error41) {
  return getWrappedMcpErrorClassification(error41) === ToolErrorClassification.INVALID_ARGS;
}
function createMcpTransportError(errorMessage6, cause) {
  const classification = classifyMcpErrorMessage(errorMessage6);
  if (classification !== void 0 && classification !== ToolErrorClassification.OTHER_ERROR) {
    return new CustomToolCallError(classification, {
      error: errorMessage6,
      clientVisibleErrorMessage: errorMessage6,
      modelVisibleErrorMessage: errorMessage6
    });
  }
  return new Error(errorMessage6, { cause });
}
function createMcpToolCall(mcpToolCall) {
  return new ToolCall({
    tool: {
      case: "mcpToolCall",
      value: mcpToolCall
    }
  });
}
function createMcpAuthToolCall(mcpAuthToolCall) {
  return new ToolCall({
    tool: {
      case: "mcpAuthToolCall",
      value: mcpAuthToolCall
    }
  });
}
function normalizeMcpToolName(name17) {
  return name17.replace(/[^a-zA-Z0-9_-]/g, "_");
}
function isCustomUserMcpTool(tool) {
  return tool.providerIdentifier === CUSTOM_USER_TOOLS_PROVIDER_ID;
}
function buildCustomUserToolsServerUseInstructions(customTools, toolNames) {
  const toolLines = customTools.map((tool) => {
    const description10 = typeof tool.description === "string" && tool.description.length > 0 ? tool.description : "(no description provided)";
    return `- ${tool.toolName}: ${description10}`;
  }).join("\n");
  const discoveryInvocationLine = toolNames ? `Discover tool schemas with \`${toolNames.discoveryToolName}\`, then invoke via \`${toolNames.invocationToolName}\` with ${toolNames.useDynamicToolNamespaces ? "namespace" : "server"} "${CUSTOM_USER_TOOLS_PROVIDER_ID}".` : `Discover tool schemas via MCP meta-tool discovery for server "${CUSTOM_USER_TOOLS_PROVIDER_ID}", then invoke via the MCP invocation meta-tool with that server.`;
  return `User-defined tools for this session. ${discoveryInvocationLine}

Available tools:
${toolLines}`;
}
function buildCustomUserToolsMcpDescriptor(customTools, toolNames) {
  const toolDescriptors = customTools.map((tool) => new McpToolDescriptor({
    toolName: tool.toolName,
    description: tool.description,
    inputSchema: tool.inputSchema !== void 0 ? Value.fromJson(tool.inputSchema) : void 0
  }));
  return new McpDescriptor({
    serverIdentifier: CUSTOM_USER_TOOLS_PROVIDER_ID,
    serverName: CUSTOM_USER_TOOLS_PROVIDER_ID,
    serverUseInstructions: buildCustomUserToolsServerUseInstructions(customTools, toolNames),
    tools: toolDescriptors
  });
}
function patchCustomUserToolsDescriptorInstructions(descriptors, toolNames) {
  return descriptors.map((descriptor2) => {
    if (descriptor2.serverIdentifier !== CUSTOM_USER_TOOLS_PROVIDER_ID) {
      return descriptor2;
    }
    return new McpDescriptor({
      ...descriptor2,
      serverUseInstructions: buildCustomUserToolsServerUseInstructions(descriptor2.tools, toolNames)
    });
  });
}
function getMcpMetaToolOptionsWithCustomUserTools(mcpMetaToolOptions, mcpTools, instructionToolNames) {
  const hasCustomTools = mcpTools.some(isCustomUserMcpTool);
  if (!hasCustomTools) {
    return mcpMetaToolOptions;
  }
  const baseOptions = mcpMetaToolOptions?.enabled === true ? mcpMetaToolOptions : new McpMetaToolOptions({
    enabled: true,
    mcpDescriptors: mcpMetaToolOptions?.mcpDescriptors ?? []
  });
  return mergeCustomUserToolsIntoMcpMetaToolOptions(baseOptions, mcpTools, instructionToolNames);
}
function mergeCustomUserToolsIntoMcpMetaToolOptions(mcpMetaToolOptions, mcpTools, instructionToolNames) {
  const customTools = mcpTools.filter(isCustomUserMcpTool);
  if (customTools.length === 0 || mcpMetaToolOptions?.enabled !== true) {
    return mcpMetaToolOptions;
  }
  const existingDescriptors = mcpMetaToolOptions.mcpDescriptors ?? [];
  const customUserToolsDescriptor = buildCustomUserToolsMcpDescriptor(customTools, instructionToolNames);
  const otherDescriptors = existingDescriptors.filter((descriptor2) => descriptor2.serverIdentifier !== CUSTOM_USER_TOOLS_PROVIDER_ID);
  return new McpMetaToolOptions({
    enabled: true,
    mcpDescriptors: [...otherDescriptors, customUserToolsDescriptor]
  });
}
var MAX_TOOL_NAME_LENGTH = 64;
var HASH_SUFFIX_LENGTH = 7;
function truncateMcpToolName(name17) {
  if (name17.length <= MAX_TOOL_NAME_LENGTH) {
    return name17;
  }
  const hash = (0, import_node_crypto28.createHash)("sha256").update(name17).digest("hex").substring(0, HASH_SUFFIX_LENGTH);
  return name17.substring(0, MAX_TOOL_NAME_LENGTH - HASH_SUFFIX_LENGTH) + hash;
}
function normalizeMcpInputSchema(inputSchema, options2 = {}) {
  if (inputSchema === void 0 || inputSchema === null || typeof inputSchema !== "object" || Array.isArray(inputSchema)) {
    return { type: "object", properties: {} };
  }
  const schema2 = inputSchema;
  const hasNoParams = !schema2.properties || typeof schema2.properties === "object" && !Array.isArray(schema2.properties) && Object.keys(schema2.properties).length === 0;
  if (hasNoParams) {
    return { type: "object", properties: {} };
  }
  if (options2.convertTupleSchemaToDraft2020_12) {
    return convertTupleSchemaToDraft2020_12(schema2);
  }
  return schema2;
}
function convertExecSuccessToToolSuccess(execResult, readToolDefReminder, invalidArgsToolDefReminder, mcpFileSystemOptions, getMcpToolsToolName, requestedServer) {
  if (execResult.result.case !== "success") {
    switch (execResult.result.case) {
      case "error": {
        const classifiedError = createMcpTransportError(execResult.result.value.error);
        if (readToolDefReminder !== void 0) {
          throw new McpWithoutReadToolDefinitionError(classifiedError, readToolDefReminder, getWrappedMcpErrorClassification(classifiedError));
        }
        if (invalidArgsToolDefReminder !== void 0 && isInvalidMcpArgumentsError(classifiedError)) {
          throw new McpInvalidArgsToolDefinitionReminderError(classifiedError, invalidArgsToolDefReminder);
        }
        throw classifiedError;
      }
      case "rejected":
        throw new ToolCallRejectedError(execResult.result.value.reason || "Tool rejected");
      case "permissionDenied":
        throw new McpPermissionDeniedError(execResult.result.value.error, execResult.result.value.isReadonly);
      case "toolNotFound": {
        const { name: name17, availableTools } = execResult.result.value;
        if (requestedServer && availableTools.length > 0) {
          const serverPrefix = `${requestedServer}-`;
          const serverHasAnyTools = availableTools.some((t) => t.startsWith(serverPrefix));
          if (!serverHasAnyTools) {
            const guidance = mcpFileSystemOptions?.enabled ? "Read the MCP server descriptor files to discover available servers." : `Use ${getMcpToolsToolName ?? "GetMcpTools"} to discover available servers.`;
            throw new McpServerDoesNotExistError(requestedServer, guidance);
          }
        }
        if (mcpFileSystemOptions?.enabled) {
          const mcpsDir = `${mcpFileSystemOptions.workspaceProjectDir}/mcps`;
          throw new McpExecToolNotFoundError(`Tool ${name17} was not found. The list of all available MCP servers are included in ${mcpsDir}. Please list and read the relevant MCP servers carefully before using call_mcp_tool again.`);
        }
        throw new McpExecToolNotFoundError(`Tool ${name17} was not found. Use ${getMcpToolsToolName ?? "GetMcpTools"} to discover available servers and their tools.`);
      }
      case "serverNotFound": {
        const { name: name17, availableServers } = execResult.result.value;
        const readServerDefReminder = availableServers.length > 0 ? `Available servers: ${availableServers.join(", ")}` : mcpFileSystemOptions?.enabled ? "No MCP servers available. Read the MCP server descriptor files to discover available servers." : `No MCP servers available. Use ${getMcpToolsToolName ?? "GetMcpTools"} to discover available servers.`;
        throw new McpServerDoesNotExistError(name17, readServerDefReminder);
      }
      case "approved":
        throw new Error("Approval-only MCP result cannot be used as tool output");
      case void 0:
        throw new Error("Exec result has no case");
      default: {
        const _exhaustiveCheck = execResult.result;
        throw new Error(`Unexpected exec result case: ${_exhaustiveCheck}`);
      }
    }
  }
  const execSuccess = execResult.result.value;
  return new McpToolResult({
    result: {
      case: "success",
      value: execSuccess
    }
  });
}
function createVirtualMcpAuthSuccessResult(serverIdentifier) {
  return new McpToolResult({
    result: {
      case: "success",
      value: new McpSuccess({
        content: [
          new McpToolResultContentItem({
            content: {
              case: "text",
              value: new McpTextContent({
                text: `Successfully authenticated MCP server: ${serverIdentifier}. The server's tools should now be available.`
              })
            }
          })
        ],
        isError: false
      })
    }
  });
}
function createVirtualMcpAuthRejectedResult(reason) {
  return new McpToolResult({
    result: {
      case: "rejected",
      value: new McpRejected({ reason })
    }
  });
}
var MCP_STEER_RELEASE_DEFAULT_MIN_RUNTIME_MS = 5e3;
function formatSteerReleasedMcpText(args) {
  const seconds = Math.max(1, Math.round(args.runtimeMs / 1e3));
  return `Tool call released early after ${seconds}s: a new user message is arriving. The in-flight request to "${args.toolName}" on "${args.server}" was cancelled (any result it still produces will be discarded). This tool's server declares it read-only; that declaration is not verified, so if this call's effects or completion matter, re-run the tool or check state directly rather than assuming nothing changed. Handle the user's message first.`;
}
function createSteerReleasedMcpSuccess(args) {
  return new McpSuccess({
    content: [
      new McpToolResultContentItem({
        content: {
          case: "text",
          value: new McpTextContent({
            text: formatSteerReleasedMcpText(args)
          })
        }
      })
    ],
    isError: false
  });
}
function createSteerReleasedMcpResult(args) {
  return new McpToolResult({
    result: {
      case: "success",
      value: createSteerReleasedMcpSuccess(args)
    }
  });
}
var MCP_STEER_RELEASE_DRAIN_MS = 1500;
async function raceMcpExecAgainstSteerRelease(args) {
  const { toolCtx, steerSignal, minRuntimeMs, drainMs = MCP_STEER_RELEASE_DRAIN_MS, run } = args;
  const startMs = Date.now();
  const [execCtx, cancelExec] = toolCtx.withCancel();
  let releaseTimer;
  let drainTimer;
  let unsubscribeSteer;
  let released = false;
  let resolveDrainExpired;
  const drainExpired = new Promise((resolve29) => {
    resolveDrainExpired = resolve29;
  });
  const releaseNow = () => {
    if (released) {
      return;
    }
    released = true;
    cancelExec(new Error("MCP call released early: a user steer was admitted"));
    drainTimer = setTimeout(() => {
      resolveDrainExpired?.();
    }, drainMs);
  };
  const scheduleRelease = () => {
    if (released || releaseTimer !== void 0) {
      return;
    }
    const remainingMs = minRuntimeMs - (Date.now() - startMs);
    if (remainingMs <= 0) {
      releaseNow();
      return;
    }
    releaseTimer = setTimeout(releaseNow, remainingMs);
  };
  try {
    if (steerSignal.hasPendingUserInjections()) {
      scheduleRelease();
    } else {
      unsubscribeSteer = steerSignal.onUserInjectionAdmitted(() => {
        scheduleRelease();
      });
    }
    const execPromise = run(execCtx).then((execResult) => ({ kind: "settled", execResult }), (error41) => ({ kind: "errored", error: error41 }));
    const raced = await Promise.race([
      execPromise,
      drainExpired.then(() => ({ kind: "drain_expired" }))
    ]);
    if (raced.kind === "drain_expired") {
      void execPromise.catch(() => void 0);
      return { kind: "steer_released", runtimeMs: Date.now() - startMs };
    }
    if (raced.kind === "errored") {
      if (released && !toolCtx.signal.aborted) {
        return {
          kind: "steer_released",
          runtimeMs: Date.now() - startMs,
          execErrorAfterRelease: raced.error
        };
      }
      throw raced.error;
    }
    return { kind: "completed", execResult: raced.execResult };
  } finally {
    if (releaseTimer !== void 0) {
      clearTimeout(releaseTimer);
    }
    if (drainTimer !== void 0) {
      clearTimeout(drainTimer);
    }
    unsubscribeSteer?.();
  }
}
var SMART_MODE_MCP_BLOCK_REASON = "Blocked by Auto-review";
var SMART_MODE_MCP_BLOCKED_AUTONOMOUS_REASON_SUFFIX = "\n\n<system_reminder>\nAuto-review blocked this autonomous tool call. Decide now between two paths: (1) if a genuinely safer, lower-privilege, authorized path satisfies the request, use it; (2) if this blocked action is still necessary and the user should approve it, immediately retry the exact same call_mcp_tool call with requestSmartModeApproval set to true AND smartModeBlockReason set to the exact block reason text above. That retry is what shows the native approval card; stopping here leaves the user with no approval UI. Do not change the tool arguments or use an escalated variant when retrying for approval. Trying a different anonymous public file host, pastebin, disposable transfer link, or similar courier is NOT path (1) \u2014 that is the same unauthorized data-exposure crossing \u2014 so for that class prefer path (2) or ask the user, do not shop for another intermediary.\n</system_reminder>";
var SMART_MODE_DYNAMIC_MCP_BLOCKED_AUTONOMOUS_REASON_SUFFIX = "\n\n<system_reminder>\nAuto-review blocked this autonomous MCP tool call. Decide now between two paths: (1) if a genuinely safer, lower-privilege, authorized path satisfies the request, use it; (2) if this blocked action is still necessary and the user should approve it, immediately retry the exact same CallDynamicTool call with mcpDetails.requestSmartModeApproval set to true AND mcpDetails.smartModeBlockReason set to the exact block reason text above. Preserve mcpDetails.description from the blocked call. That retry is what shows the native approval card; stopping here leaves the user with no approval UI. Do not change the tool arguments or use an escalated variant when retrying for approval. Trying a different anonymous public file host, pastebin, disposable transfer link, or similar courier is NOT path (1) \u2014 that is the same unauthorized data-exposure crossing \u2014 so for that class prefer path (2) or ask the user, do not shop for another intermediary.\n</system_reminder>";
var SMART_MODE_MCP_PREFLIGHT_REJECTED_TELEMETRY_REASON = "Smart Mode preflight rejected the MCP call";
var SMART_MODE_MCP_CLASSIFIER_ERROR_REASON = SMART_MODE_CLASSIFIER_MANUAL_REVIEW_ERROR_REASON;
var SMART_MODE_MCP_PARENT_REQUESTED_APPROVAL_FALLBACK_REASON = SMART_MODE_MCP_CLASSIFIER_ERROR_REASON;
async function extractMcpPreflightConversationContext(ctx, args) {
  if (args.stateHandler === void 0) {
    return [];
  }
  if (args.extractSmartModeClassifierConversationContext !== void 0) {
    return await args.extractSmartModeClassifierConversationContext(ctx, args.stateHandler);
  }
  return await tryExtractSmartModeClassifierConversationContext(ctx, args.stateHandler);
}
function stripUndefinedMcpValues(obj) {
  return JSON.parse(JSON.stringify(obj));
}
function buildSmartModeMcpRiskTarget({ serverIdentifier, serverName, serverDisplayName, toolName, mcpMode, mcpArguments, toolDefinitionMetadata, projectPermissions }) {
  return new SmartModeRiskTarget({
    action: "mcp",
    arguments: Struct.fromJson(stripUndefinedMcpValues({
      server: {
        identifier: serverIdentifier,
        name: serverName,
        display_name: serverDisplayName
      },
      tool_name: toolName,
      mcp_mode: mcpMode,
      arguments: mcpArguments ?? {},
      tool_definition: toolDefinitionMetadata,
      project_permissions: projectPermissions
    }))
  });
}
async function loadSmartModeMcpProjectPermissions(ctx, args) {
  return await loadSmartModeProjectPermissionsContext(ctx, args.workspacePaths, args.userAutoRunInstructions, args.projectAutoRunInstructions);
}
function createSmartModeMcpBlockedAutonomousReason(reason, useNestedMcpDetails) {
  return `${reason}${useNestedMcpDetails ? SMART_MODE_DYNAMIC_MCP_BLOCKED_AUTONOMOUS_REASON_SUFFIX : SMART_MODE_MCP_BLOCKED_AUTONOMOUS_REASON_SUFFIX}`;
}
function formatSmartModeMcpClassifierErrorReason() {
  return SMART_MODE_MCP_CLASSIFIER_ERROR_REASON;
}
async function getSmartModeMcpPreflightDecision(ctx, args) {
  const devBlockConsumed = args.enabled && args.devSmartModeClassifierBlockState?.consume() === true;
  if (!args.enabled && !args.shadowEnabled) {
    return { kind: "allow" };
  }
  if (devBlockConsumed) {
    await delayDevSmartModeClassifierIfRequested(args.devSmartModeClassifierDelayState);
    return { kind: "block", reason: DEV_SMART_MODE_CLASSIFIER_BLOCK_REASON };
  }
  if (!args.enabled) {
    runShadowSmartModeMcpPreflight(ctx, args);
    return { kind: "allow" };
  }
  try {
    const executor = args.resourceAccessor.get(smartModeClassifierExecutorResource);
    const conversationContext = await extractMcpPreflightConversationContext(ctx, args);
    const projectPermissions = await loadSmartModeMcpProjectPermissions(ctx, args);
    await delayDevSmartModeClassifierIfRequested(args.devSmartModeClassifierDelayState);
    const result = await executeSmartModeClassifierWithMeasurement(ctx, executor, new SmartModeClassifierArgs({
      toolCallId: args.toolCallId,
      parentConversationId: getConversationId(ctx),
      target: buildSmartModeMcpRiskTarget({
        ...args,
        projectPermissions
      }),
      conversationContext
    }), "enforce", args.workspacePaths, {
      suppressToolCallIdLogging: args.suppressClassifierTelemetryIds === true,
      maxAttempts: args.classifierMaxAttempts
    });
    if (result.result.case === "success" && result.result.value.decision === SmartModeClassifierDecision.BLOCK) {
      return {
        kind: "block",
        reason: result.result.value.blockReason ?? SMART_MODE_MCP_BLOCK_REASON,
        ...result.result.value.proposedAllowRule !== void 0 ? { proposedAllowRule: result.result.value.proposedAllowRule } : {}
      };
    }
    if (result.result.case !== "success" || result.result.value.decision !== SmartModeClassifierDecision.ALLOW) {
      return {
        kind: "reject",
        reason: formatSmartModeMcpClassifierErrorReason()
      };
    }
  } catch (error41) {
    if (error41 instanceof Error && error41.name === "AbortError") {
      throw error41;
    }
    return { kind: "reject", reason: SMART_MODE_MCP_CLASSIFIER_ERROR_REASON };
  }
  return { kind: "allow" };
}
function runShadowSmartModeMcpPreflight(ctx, args) {
  void (async () => {
    try {
      const executor = args.resourceAccessor.get(smartModeClassifierExecutorResource);
      const conversationContext = await extractMcpPreflightConversationContext(ctx, args);
      const projectPermissions = await loadSmartModeMcpProjectPermissions(ctx, args);
      await delayDevSmartModeClassifierIfRequested(args.devSmartModeClassifierDelayState);
      await executeSmartModeClassifierWithMeasurement(ctx, executor, new SmartModeClassifierArgs({
        toolCallId: args.toolCallId,
        parentConversationId: getConversationId(ctx),
        target: buildSmartModeMcpRiskTarget({
          ...args,
          projectPermissions
        }),
        conversationContext
      }), "shadow", args.workspacePaths, {
        suppressToolCallIdLogging: args.suppressClassifierTelemetryIds === true,
        maxAttempts: args.classifierMaxAttempts
      });
    } catch {
    }
  })();
}
function buildSmartModeMcpApprovalTarget(args, blockReason, options2) {
  const description10 = args.description?.trim();
  return {
    serverIdentifier: args.target.serverIdentifier,
    serverName: args.target.serverName,
    serverDisplayName: args.target.serverDisplayName,
    toolName: args.target.toolName,
    mcpMode: args.target.mcpMode,
    mcpArguments: args.target.mcpArguments,
    toolDefinitionIdentity: args.toolDefinitionBinding?.identity,
    toolDefinitionHash: args.toolDefinitionBinding?.hash,
    blockReason,
    ...description10 !== void 0 && description10.length > 0 ? { description: description10 } : {},
    ...options2?.proposedAllowRule !== void 0 && options2.proposedAllowRule.length > 0 ? { proposedAllowRule: options2.proposedAllowRule } : {}
  };
}
async function createSmartModeMcpApprovalForParentRequest(ctx, args, blockReason) {
  const approvalStore = args.resourceAccessor.get(smartModeMcpApprovalStoreResource);
  const approvalRequest = await createSmartModeMcpApprovalRequest(ctx, approvalStore, buildSmartModeMcpApprovalTarget(args, blockReason));
  return new SmartModeApproval({
    requestId: approvalRequest.requestId,
    reason: approvalRequest.blockReason
  });
}
async function rejectSmartModeMcpPreflightBlock(ctx, args) {
  if (args.enabled && args.requestSmartModeApproval === true && args.approvalProvider === void 0) {
    const parentBlockReason = args.smartModeBlockReason !== void 0 && args.smartModeBlockReason.trim().length > 0 ? args.smartModeBlockReason.trim() : SMART_MODE_MCP_PARENT_REQUESTED_APPROVAL_FALLBACK_REASON;
    if (args.agentType === AgentType.BACKGROUND) {
      const error42 = new ToolCallRejectedError(parentBlockReason);
      await args.onRejectWithoutNativeApproval?.(error42);
      throw error42;
    }
    return createSmartModeMcpApprovalForParentRequest(ctx, args, parentBlockReason);
  }
  const decision = await getSmartModeMcpPreflightDecision(ctx, {
    resourceAccessor: args.resourceAccessor,
    enabled: args.enabled,
    shadowEnabled: args.shadowEnabled,
    toolCallId: args.toolCallId,
    stateHandler: args.stateHandler,
    devSmartModeClassifierBlockState: args.devSmartModeClassifierBlockState,
    devSmartModeClassifierDelayState: args.devSmartModeClassifierDelayState,
    workspacePaths: args.workspacePaths,
    userAutoRunInstructions: args.userAutoRunInstructions,
    projectAutoRunInstructions: args.projectAutoRunInstructions,
    extractSmartModeClassifierConversationContext: args.extractSmartModeClassifierConversationContext,
    suppressClassifierTelemetryIds: args.suppressClassifierTelemetryIds,
    classifierMaxAttempts: args.classifierMaxAttempts,
    ...args.target
  });
  if (decision.kind === "allow") {
    return void 0;
  }
  if (decision.kind === "reject") {
    const error42 = new ToolCallRejectedError(decision.reason);
    await args.onRejectWithoutNativeApproval?.(error42);
    throw error42;
  }
  if (args.approvalProvider !== void 0 && args.requestSmartModeApproval === true) {
    const target = buildSmartModeMcpApprovalTarget(args, decision.reason, {
      proposedAllowRule: decision.proposedAllowRule
    });
    const approvalProvider = args.approvalProvider;
    const approvalDecision = await withToolExecutionTimeoutSuspended(ctx, () => approvalProvider.requestApproval({
      kind: "mcp",
      target,
      fingerprint: computeSmartModeMcpApprovalTargetFingerprint(target),
      toolCallId: args.toolCallId,
      conversationId: getConversationId(ctx),
      signal: args.signal
    }));
    if (args.signal.aborted) {
      throw new ToolCallAbortedError();
    }
    if (approvalDecision.approved) {
      return void 0;
    }
    const error42 = new ToolCallRejectedError(approvalDecision.reason ?? decision.reason);
    await args.onRejectWithoutNativeApproval?.(error42);
    throw error42;
  }
  const error41 = new ToolCallRejectedError(createSmartModeMcpBlockedAutonomousReason(decision.reason, args.useNestedMcpDetails === true));
  await args.onRejectWithoutNativeApproval?.(error41);
  throw error41;
}
var createMcpTool = (resourceAccessor, mcpToolDefinition, options2 = {}) => {
  const executor = resourceAccessor.get(mcpExecutorResource);
  const execute = async (parentCtx, interactionHandler, rawArgs, meta) => {
    const env_1 = { stack: [], error: void 0, hasError: false };
    try {
      const spanCtxt = __addDisposableResource17(env_1, createSpan(parentCtx.withName("mcpExecute")), false);
      const args = rawArgs;
      const toolArgs = new McpArgs({
        name: mcpToolDefinition.name,
        args: Object.fromEntries(Object.entries(args).map(([key, value]) => [key, Value.fromJson(value)])),
        toolCallId: meta.toolCallId,
        providerIdentifier: mcpToolDefinition.providerIdentifier,
        toolName: mcpToolDefinition.toolName,
        serverIdentifier: mcpToolDefinition.clientKey
      });
      const baseToolCall = new McpToolCall({
        args: toolArgs,
        result: void 0
      });
      return await interactionHandler.executeToolCall(spanCtxt.ctx, createMcpToolCall(baseToolCall), meta.toolCallId, async (ctx) => {
        logger53.info(ctx, "MCP tool call", {
          mcpServer: mcpToolDefinition.providerIdentifier,
          mcpToolName: mcpToolDefinition.toolName
        });
        const tracker = getAgentEventTracker(ctx);
        tracker.trackMcpToolCall(ctx, {
          name: mcpToolDefinition.toolName,
          mcpServerName: mcpToolDefinition.providerIdentifier,
          origin: getMcpToolOrigin(mcpToolDefinition.clientKey),
          plugin: mcpToolDefinition.plugin,
          marketplace: mcpToolDefinition.marketplace,
          pluginId: mcpToolDefinition.pluginId,
          marketplaceId: mcpToolDefinition.marketplaceId
        });
        const paramsJson = JSON.stringify(args);
        try {
          const executeInner = (execCtx, mcpArgs) => executor.execute(execCtx.with(agentToolExecutionMetaKey, meta), mcpArgs, {
            execId: generateSeededUuid(meta.toolCallId),
            hookContextCollector: meta.hookContextCollector
          });
          const executeMaybeHooked = wrapBackendRoutedMcpExecute({
            executor,
            providerIdentifier: mcpToolDefinition.providerIdentifier,
            toolName: mcpToolDefinition.toolName,
            executeFn: executeInner,
            hookOptions: {
              resourceAccessor,
              enableExecuteHookExec: options2.enableExecuteHookExec,
              configuredSteps: options2.configuredSteps,
              model: options2.model,
              hookContextCollector: meta.hookContextCollector
            },
            requestContext: {
              toolCallId: meta.toolCallId,
              model: options2.model,
              conversationId: getConversationId(ctx)
            }
          });
          const execResult = await executeMaybeHooked(ctx, toolArgs);
          const result = convertExecSuccessToToolSuccess(execResult, void 0, void 0, void 0, void 0);
          tracker.trackMcpToolCallResult(ctx, {
            toolName: mcpToolDefinition.toolName,
            mcpServerName: mcpToolDefinition.providerIdentifier,
            paramsJson,
            success: true
          });
          return result;
        } catch (e) {
          const classifiedError = e instanceof ToolCallError ? e : createMcpTransportError(e instanceof Error ? e.message : String(e), e);
          tracker.trackMcpToolCallResult(ctx, {
            toolName: mcpToolDefinition.toolName,
            mcpServerName: mcpToolDefinition.providerIdentifier,
            paramsJson,
            success: false,
            errorMessage: classifiedError instanceof Error ? classifiedError.message : String(classifiedError),
            errorClassification: getWrappedMcpErrorClassification(classifiedError)
          });
          if (isInvalidMcpArgumentsError(classifiedError)) {
            throw new McpInvalidArgsToolDefinitionReminderError(classifiedError, `
<system_reminder>
The MCP server rejected these arguments as invalid. Before retrying, inspect this MCP tool's input schema/tool definition and rebuild the arguments from that schema.
</system_reminder>`);
          }
          throw classifiedError;
        }
      }, (result) => createMcpToolCall(new McpToolCall({ ...baseToolCall, result })), meta.hookContextCollector);
    } catch (e_1) {
      env_1.error = e_1;
      env_1.hasError = true;
    } finally {
      __disposeResources17(env_1);
    }
  };
  const toolDescription = mcpToolDefinition.description ?? "";
  return {
    toolIdentifier: "MCP",
    mcpToolSource: {
      serverIdentifier: mcpToolDefinition.clientKey,
      toolName: mcpToolDefinition.toolName
    },
    name: options2.name ?? truncateMcpToolName(normalizeMcpToolName(mcpToolDefinition.name)),
    descriptionGenerator: (_props) => toolDescription,
    parameters: jsonSchema(normalizeMcpInputSchema(mcpToolDefinition.inputSchema, {
      convertTupleSchemaToDraft2020_12: options2.convertTupleSchemaToDraft2020_12
    })),
    render: renderMcpTool,
    execute: withSafeParsedArgs(external_exports.unknown(), execute, createMcpToolCall(new McpToolCall())),
    serializeError: (error41) => {
      if (error41 instanceof McpPermissionDeniedError) {
        return createMcpToolCall(new McpToolCall({
          result: new McpToolResult({
            result: {
              case: "permissionDenied",
              value: new McpPermissionDenied({
                error: error41.error,
                isReadonly: error41.isReadonly
              })
            }
          })
        }));
      }
      if (error41 instanceof ToolCallRejectedError) {
        return createMcpToolCall(new McpToolCall({
          result: new McpToolResult({
            result: {
              case: "rejected",
              value: new McpRejected({ reason: error41.message })
            }
          })
        }));
      }
      if (error41 instanceof CustomToolCallError) {
        return createMcpToolCall(new McpToolCall({
          result: new McpToolResult({
            result: {
              case: "error",
              value: new McpToolError({
                error: error41.clientVisibleErrorMessage,
                readToolDefReminder: error41.modelVisibleErrorMessage
              })
            }
          })
        }));
      }
      const errorMessage6 = error41 instanceof Error ? error41.message : String(error41);
      return createMcpToolCall(new McpToolCall({
        result: new McpToolResult({
          result: {
            case: "error",
            value: new McpToolError({
              error: "Tool execution error",
              readToolDefReminder: errorMessage6
            })
          }
        })
      }));
    }
  };
};
var createCallMcpTool = (options2) => {
  const { resourceAccessor, name: name17 = "CallMcpTool", mcpFileSystemOptions, mcpMetaToolOptions, validateMcpToolDescriptors = false, getMcpToolsToolName, allowInteractiveMcpAuth = false, agentType, requestContext, smartModeClassifierMode = false, smartModeClassifierShadowMode = false, smartModeApprovalProvider, devSmartModeClassifierBlockState, devSmartModeClassifierDelayState, dynamicToolRegistry, isMcpToolBlocked, extractSmartModeClassifierConversationContext: extractSmartModeClassifierConversationContext2, userAutoRunInstructions, projectAutoRunInstructions, suppressSmartModeClassifierTelemetryIds, smartModeClassifierMaxAttempts, loadSmartModeWorkspacePermissionFiles = true, disableSmartModeAllowlistPrecheck = false, steerReleaseReadOnlyTools = false, steerReleaseMinRuntimeMs = MCP_STEER_RELEASE_DEFAULT_MIN_RUNTIME_MS, steerReleaseDrainMs = MCP_STEER_RELEASE_DRAIN_MS, enableExecuteHookExec, model } = options2;
  const useDynamicToolNamespaces = dynamicToolRegistry !== void 0;
  const executor = resourceAccessor.get(mcpExecutorResource);
  const mcpMetaToolEnabled = mcpMetaToolOptions?.enabled ?? false;
  const resolvedGetMcpToolsToolName = getMcpToolsToolName ?? "GetMcpTools";
  const serverDescriptors = /* @__PURE__ */ new Map();
  const toolDefinitionPaths = /* @__PURE__ */ new Map();
  const descriptorSource = mcpMetaToolEnabled ? mcpMetaToolOptions?.mcpDescriptors ?? [] : mcpFileSystemOptions?.mcpDescriptors ?? [];
  for (const descriptor2 of descriptorSource) {
    const rawTools = descriptor2.tools ?? [];
    const descriptorTools = allowInteractiveMcpAuth ? rawTools : rawTools.filter((t) => t.toolName !== MCP_AUTH_VIRTUAL_TOOL_NAME);
    const descriptorForRegistration = allowInteractiveMcpAuth || descriptorTools.length === rawTools.length ? descriptor2 : new McpDescriptor({
      serverIdentifier: descriptor2.serverIdentifier,
      serverName: descriptor2.serverName,
      plugin: descriptor2.plugin,
      marketplace: descriptor2.marketplace,
      serverUseInstructions: descriptor2.serverUseInstructions,
      folderPath: descriptor2.folderPath,
      pluginDbId: descriptor2.pluginDbId,
      marketplaceId: descriptor2.marketplaceId,
      tools: descriptorTools
    });
    serverDescriptors.set(descriptor2.serverIdentifier, descriptorForRegistration);
    for (const tool of descriptorTools) {
      if (tool.definitionPath) {
        const key = `${descriptor2.serverIdentifier}:${tool.toolName}`;
        toolDefinitionPaths.set(key, tool.definitionPath);
      }
    }
  }
  const jsonValueSchema2 = external_exports.lazy(() => external_exports.union([
    external_exports.null(),
    external_exports.boolean(),
    external_exports.number(),
    external_exports.string(),
    external_exports.record(jsonValueSchema2),
    external_exports.array(jsonValueSchema2)
  ]));
  const argumentsRecordSchema = external_exports.record(jsonValueSchema2);
  const argumentsParameterSchema = argumentsRecordSchema.optional().describe(useDynamicToolNamespaces ? "Arguments to pass to the tool, as described by the tool descriptor." : "Arguments to pass to the MCP tool, as described in the tool descriptor.");
  const baseParametersSchema3 = external_exports.object({
    server: external_exports.string().describe("Identifier of the MCP server hosting the tool."),
    toolName: external_exports.string().describe("Name of the MCP tool to invoke."),
    arguments: argumentsParameterSchema
  });
  const modelIdentityParametersSchema = useDynamicToolNamespaces ? external_exports.object({
    namespace: external_exports.string().describe("Dynamic namespace hosting the tool, e.g. an MCP server."),
    toolName: external_exports.string().describe("Name of the tool to invoke.")
  }) : baseParametersSchema3.omit({ arguments: true });
  const callDescriptionSchema = external_exports.string().describe("Short plain-language description of what this call will do. One sentence naming the outcome and where it applies (channel, page, file, or service) when known. Do not include tool names, argument keys, or JSON.");
  const descriptionParametersSchema = external_exports.object({
    description: callDescriptionSchema.optional()
  });
  const smartModeApprovalParametersSchema3 = external_exports.object({
    requestSmartModeApproval: external_exports.boolean().optional().describe("Set to true when immediately retrying the exact same MCP call after Auto-review blocks it and you decide the user should approve it through the native approval card."),
    smartModeBlockReason: external_exports.string().optional().describe("Provide the exact block reason returned by Auto-review in the prior rejection. Required when requestSmartModeApproval is true so the approval card shows the original classifier reason without re-running the classifier.")
  });
  const smartModeApprovalRequestParametersEnabled = smartModeClassifierMode;
  const mcpDetailsParametersSchema = external_exports.object({
    description: callDescriptionSchema,
    ...smartModeApprovalRequestParametersEnabled ? {
      requestSmartModeApproval: smartModeApprovalParametersSchema3.shape.requestSmartModeApproval.default(false),
      smartModeBlockReason: smartModeApprovalParametersSchema3.shape.smartModeBlockReason
    } : {}
  });
  const mcpDetailsInputSchema = external_exports.object({
    description: callDescriptionSchema.optional(),
    ...smartModeApprovalParametersSchema3.shape
  });
  const parametersSchema29 = useDynamicToolNamespaces ? modelIdentityParametersSchema.extend({
    mcpDetails: mcpDetailsParametersSchema.optional().describe("MCP-specific call metadata. Set this only when invoking a tool from an external MCP namespace; omit it for first-party tools in the cursor namespace."),
    arguments: argumentsParameterSchema
  }) : modelIdentityParametersSchema.extend({
    ...descriptionParametersSchema.shape,
    ...smartModeApprovalRequestParametersEnabled ? smartModeApprovalParametersSchema3.shape : {},
    arguments: argumentsParameterSchema
  });
  const normalizeCallMcpToolArgsInput = (raw) => {
    if (raw === null || typeof raw !== "object" || Array.isArray(raw)) {
      return raw;
    }
    const normalized = {
      ...raw
    };
    if (useDynamicToolNamespaces) {
      if (normalized.namespace !== void 0) {
        normalized.server = normalized.namespace;
        delete normalized.namespace;
      }
      const missingIdentity = [
        normalized.server === void 0 ? "namespace" : void 0,
        normalized.toolName === void 0 ? "toolName" : void 0
      ].filter((field) => field !== void 0);
      if (missingIdentity.length > 0) {
        throw new Error(`Missing required ${missingIdentity.length === 1 ? "field" : "fields"}: ${missingIdentity.join(", ")}. Re-issue the call with the tool's identity set; \`arguments\` alone does not identify the tool.`);
      }
    }
    if (normalized.descriptionForMcp !== void 0) {
      normalized.description ??= normalized.descriptionForMcp;
      delete normalized.descriptionForMcp;
    }
    const maybeArguments = normalized.arguments;
    if (typeof maybeArguments === "string") {
      const recovered = parseArgumentsLeniently(maybeArguments);
      if (recovered === void 0) {
        throw new Error("Failed to parse arguments string as JSON object. Re-issue the call with `arguments` as a JSON object literal rather than a quoted string.");
      }
      const args = recovered.args;
      if (recovered.repaired) {
        const foldedDetails = args.mcpDetails;
        if (foldedDetails !== void 0) {
          delete args.mcpDetails;
          normalized.mcpDetails ??= foldedDetails;
        }
        const foldedDescription = args.descriptionForMcp;
        if (foldedDescription !== void 0) {
          delete args.descriptionForMcp;
          normalized.description ??= foldedDescription;
        }
      }
      const leakedDescription = recovered.envelopeFields?.description;
      if (leakedDescription !== void 0 && normalized.description === void 0) {
        normalized.description = leakedDescription;
      }
      normalized.arguments = args;
    }
    const inner = normalized.arguments;
    if (smartModeApprovalRequestParametersEnabled && inner != null && typeof inner === "object" && !Array.isArray(inner)) {
      const innerRecord = inner;
      if ("requestSmartModeApproval" in innerRecord || "smartModeBlockReason" in innerRecord) {
        const stripped = { ...innerRecord };
        normalized.requestSmartModeApproval ??= stripped.requestSmartModeApproval;
        normalized.smartModeBlockReason ??= stripped.smartModeBlockReason;
        delete stripped.requestSmartModeApproval;
        delete stripped.smartModeBlockReason;
        normalized.arguments = stripped;
      }
    }
    return normalized;
  };
  const internalParametersSchema = useDynamicToolNamespaces ? baseParametersSchema3.extend({
    ...descriptionParametersSchema.shape,
    ...smartModeApprovalParametersSchema3.shape,
    mcpDetails: mcpDetailsInputSchema.optional()
  }).transform(({ mcpDetails, ...args }) => ({
    ...args,
    // Only the nested shape is offered; the flat fields are still
    // accepted so calls already in history keep parsing.
    description: mcpDetails?.description ?? args.description,
    requestSmartModeApproval: mcpDetails?.requestSmartModeApproval ?? args.requestSmartModeApproval,
    smartModeBlockReason: mcpDetails?.smartModeBlockReason ?? args.smartModeBlockReason
  })) : baseParametersSchema3.extend({
    ...descriptionParametersSchema.shape,
    ...smartModeApprovalRequestParametersEnabled ? smartModeApprovalParametersSchema3.shape : {}
  });
  const parsingParametersSchema = external_exports.preprocess(normalizeCallMcpToolArgsInput, internalParametersSchema);
  const validateToolOnMcpToolDescriptors = (serverIdentifier, toolName) => {
    const descriptor2 = serverDescriptors.get(serverIdentifier);
    if (descriptor2 === void 0) {
      throw new McpServerDoesNotExistError(serverIdentifier, `Use ${resolvedGetMcpToolsToolName} to discover available ${useDynamicToolNamespaces ? "namespaces" : "servers"}.`);
    }
    if (!(descriptor2.tools ?? []).some((tool) => tool.toolName === toolName)) {
      throw new McpExecToolNotFoundError(`Tool ${toolName} was not found. Use ${resolvedGetMcpToolsToolName} to discover available ${useDynamicToolNamespaces ? "namespaces" : "servers"} and their tools.`);
    }
  };
  const checkToolDefinitionRead = (serverIdentifier, toolName, stateHandler) => {
    if (!stateHandler) {
      return { kind: "read" };
    }
    const serverDescriptor = serverDescriptors.get(serverIdentifier);
    if (!serverDescriptor) {
      if (mcpMetaToolEnabled && serverDescriptors.size === 0) {
        return { kind: "read" };
      }
      return { kind: "noServer", serverIdentifier };
    }
    const toolKey = `${serverIdentifier}:${toolName}`;
    const definitionPath = toolDefinitionPaths.get(toolKey);
    if (!definitionPath) {
      if (mcpMetaToolEnabled) {
        return { kind: "read" };
      }
      return {
        kind: "noTool",
        toolName,
        serverPath: serverDescriptor.folderPath
      };
    }
    if (stateHandler.hasReadPath(safeString(definitionPath))) {
      return { kind: "read" };
    }
    return { kind: "unread", unreadPath: definitionPath };
  };
  const execute = async (parentCtx, interactionHandler, args, meta) => {
    const env_2 = { stack: [], error: void 0, hasError: false };
    try {
      const spanCtxt = __addDisposableResource17(env_2, createSpan(parentCtx.withName("callMcpToolExecute")), false);
      const startTime = Date.now();
      const mcpMode = mcpMetaToolEnabled ? "meta_tool" : "file_system";
      const precededByGetMcpToolsSearch = mcpMetaToolEnabled && await wasPrecededByGetMcpToolsSearch(spanCtxt.ctx, meta.stateHandler);
      const emitSuccessMetrics = (ctx, result, calledWithoutReadDef2) => {
        const durationMs = Date.now() - startTime;
        let responseBytes = 0;
        if (result.result.case === "success") {
          for (const item of result.result.value.content) {
            if (item.content.case === "text") {
              responseBytes += item.content.value.outputLocation === void 0 ? Buffer.byteLength(item.content.value.text, "utf8") : Number(item.content.value.outputLocation.sizeBytes);
            } else if (item.content.case === "image") {
              responseBytes += item.content.value.data.length;
            }
          }
        }
        emitCallMcpToolMetrics(ctx, {
          mcpMode,
          durationMs,
          success: true,
          responseBytes,
          calledWithoutReadDef: calledWithoutReadDef2
        });
        if (precededByGetMcpToolsSearch) {
          emitMcpSearchThenCallResult(ctx, "success");
        }
      };
      const emitErrorMetrics = (ctx, input) => {
        const { failureReason, retryable, calledWithoutReadDef: calledWithoutReadDef2, error: error41 } = input;
        const durationMs = Date.now() - startTime;
        emitCallMcpToolMetrics(ctx, {
          mcpMode,
          durationMs,
          success: false,
          failureReason,
          retryable,
          calledWithoutReadDef: calledWithoutReadDef2
        });
        if (error41 !== void 0) {
          reportMcpMetaToolFailure(ctx, error41, {
            tool: name17,
            failureReason,
            retryable,
            server: args.server,
            toolName: args.toolName,
            mcpMode,
            durationMs
          });
        }
        if (precededByGetMcpToolsSearch) {
          emitMcpSearchThenCallResult(ctx, failureReason === CALL_MCP_TOOL_FAILURE_REASONS.TOOL_NOT_FOUND ? "tool_not_found" : "error");
        }
      };
      if (!mcpFileSystemOptions && !mcpMetaToolEnabled) {
        throw new Error("MCP file system options are required for CallMcpTool");
      }
      if (!allowInteractiveMcpAuth && args.toolName === MCP_AUTH_VIRTUAL_TOOL_NAME) {
        throw new CustomToolCallError(ToolErrorClassification.UNEXPECTED_ENVIRONMENT, {
          error: "Interactive MCP authentication is only available in the Cursor desktop IDE.",
          clientVisibleErrorMessage: "Interactive MCP authentication is only available in the Cursor desktop IDE.",
          modelVisibleErrorMessage: "Interactive MCP authentication is not available in this agent environment. Ask the user to authenticate the MCP server in the Cursor desktop IDE, then retry."
        });
      }
      if (args.toolName === MCP_AUTH_VIRTUAL_TOOL_NAME && !supportsInteractiveMcpAuth(args.server.trim())) {
        const nonAuthenticatableMessage = `"${args.server}" is a built-in Cursor server that does not use interactive authentication.`;
        throw new CustomToolCallError(ToolErrorClassification.UNEXPECTED_ENVIRONMENT, {
          error: nonAuthenticatableMessage,
          clientVisibleErrorMessage: nonAuthenticatableMessage,
          modelVisibleErrorMessage: `${nonAuthenticatableMessage} If its tools are failing, the failure is not an authentication problem; read the tool error and address that instead.`
        });
      }
      if (isMcpToolBlocked?.({
        serverIdentifier: args.server,
        toolName: args.toolName
      }) === true) {
        const blockedMessage = `Tool "${args.toolName}" on "${args.server}" is not available in this agent context.`;
        emitErrorMetrics(spanCtxt.ctx, {
          failureReason: CALL_MCP_TOOL_FAILURE_REASONS.REJECTED,
          retryable: false,
          calledWithoutReadDef: false
        });
        throw new CustomToolCallError(ToolErrorClassification.UNEXPECTED_ENVIRONMENT, {
          error: blockedMessage,
          clientVisibleErrorMessage: blockedMessage,
          modelVisibleErrorMessage: `${blockedMessage} It speaks to the end user on the parent agent's behalf and is reserved for the parent agent. Include anything you want communicated in your final response instead.`
        });
      }
      if (dynamicToolRegistry !== void 0 && isReservedDynamicToolsNamespace(args.server)) {
        const innerTool = dynamicToolRegistry.getTool(args.toolName);
        logger53.info(spanCtxt.ctx, "Built-in tool dispatch via CallDynamicTool", {
          toolName: args.toolName,
          found: innerTool !== void 0
        });
        if (innerTool === void 0) {
          const availableTools = dynamicToolRegistry.getToolNames();
          const message = availableTools.length === 0 ? `No built-in tools are available ${useDynamicToolNamespaces ? "in namespace" : "on server"} "${args.server}".` : `Built-in tool "${args.toolName}" not found ${useDynamicToolNamespaces ? "in namespace" : "on server"} "${args.server}". Available tools: ${availableTools.join(", ")}. Use ${resolvedGetMcpToolsToolName} to discover their schemas.`;
          emitCallMcpToolMetrics(spanCtxt.ctx, {
            mcpMode: "meta_tool",
            durationMs: Date.now() - startTime,
            success: false,
            failureReason: CALL_MCP_TOOL_FAILURE_REASONS.TOOL_NOT_FOUND
          });
          if (precededByGetMcpToolsSearch) {
            emitMcpSearchThenCallResult(spanCtxt.ctx, "tool_not_found");
          }
          throw new CustomToolCallError(ToolErrorClassification.UNEXPECTED_ENVIRONMENT, {
            error: message,
            clientVisibleErrorMessage: message,
            modelVisibleErrorMessage: message
          });
        }
        const argsJson = JSON.stringify(args.arguments ?? {});
        const argsStream = (async function* () {
          yield argsJson;
        })();
        try {
          const output = await executeToolResultOrError(innerTool, spanCtxt.ctx, interactionHandler, argsStream, meta);
          const rendered = await renderToolResultOrError(spanCtxt.ctx, innerTool, output, {
            allTools: dynamicToolRegistry.getDescriptionProps().allTools,
            blobStore: meta.stateHandler?.getBlobStore?.()
          });
          if ("error" in output) {
            const message = rendered.content.filter((item) => item.type === "text").map((item) => item.text).join("\n") || "Dynamic tool execution failed";
            throw new DynamicToolExecutionError(output.errorClassification, {
              error: message,
              clientVisibleErrorMessage: message,
              modelVisibleErrorMessage: message
            });
          }
          const result = agentToolResultToMcpToolResult(rendered);
          emitCallMcpToolMetrics(spanCtxt.ctx, {
            mcpMode: "meta_tool",
            durationMs: Date.now() - startTime,
            success: true
          });
          if (precededByGetMcpToolsSearch) {
            emitMcpSearchThenCallResult(spanCtxt.ctx, "success");
          }
          return result;
        } catch (error41) {
          emitCallMcpToolMetrics(spanCtxt.ctx, {
            mcpMode: "meta_tool",
            durationMs: Date.now() - startTime,
            success: false,
            failureReason: CALL_MCP_TOOL_FAILURE_REASONS.OTHER
          });
          if (precededByGetMcpToolsSearch) {
            emitMcpSearchThenCallResult(spanCtxt.ctx, "error");
          }
          throw error41;
        }
      }
      if (validateMcpToolDescriptors) {
        validateToolOnMcpToolDescriptors(args.server, args.toolName);
      }
      const unreadToolCheck = checkToolDefinitionRead(args.server, args.toolName, meta.stateHandler);
      const calledWithoutReadDef = unreadToolCheck.kind === "unread";
      logger53.info(spanCtxt.ctx, "MCP tool call", {
        server: args.server,
        toolName: args.toolName,
        calledWithoutReadDef,
        ...calledWithoutReadDef && {
          unreadPath: unreadToolCheck.unreadPath
        }
      });
      let readToolDefReminder;
      if (unreadToolCheck.kind === "unread") {
        if (mcpMetaToolEnabled) {
          readToolDefReminder = `
<system_reminder>
You called this tool without first discovering its schema via ${resolvedGetMcpToolsToolName}. For future calls, call ${resolvedGetMcpToolsToolName} with {"${useDynamicToolNamespaces ? "namespace" : "server"}":"${args.server}","toolName":"${args.toolName}"} before calling ${name17}.
</system_reminder>`;
        } else {
          readToolDefReminder = `
<system_reminder>
You called this MCP tool without first reading its schema/descriptor file. For future calls to this tool, please read the tool definition at "${unreadToolCheck.unreadPath}" first to ensure you're using the correct parameters.
</system_reminder>`;
        }
      }
      const toolDefinitionPath = toolDefinitionPaths.get(`${args.server}:${args.toolName}`);
      const getInvalidArgsToolDefReminder = () => {
        if (readToolDefReminder !== void 0) {
          return readToolDefReminder;
        }
        if (mcpMetaToolEnabled) {
          return `
<system_reminder>
The ${useDynamicToolNamespaces ? "namespace" : "MCP server"} rejected these arguments as invalid. Before retrying, call ${resolvedGetMcpToolsToolName} with {"${useDynamicToolNamespaces ? "namespace" : "server"}":"${args.server}","toolName":"${args.toolName}"} and rebuild the arguments from the returned input schema.
</system_reminder>`;
        }
        if (toolDefinitionPath !== void 0) {
          return `
<system_reminder>
The MCP server rejected these arguments as invalid. Before retrying, read the tool definition at "${toolDefinitionPath}" and rebuild the arguments from that schema.
</system_reminder>`;
        }
        return `
<system_reminder>
The MCP server rejected these arguments as invalid. Before retrying, read the MCP server descriptor files for "${args.server}" and the tool definition for "${args.toolName}" so the arguments match the schema.
</system_reminder>`;
      };
      const invalidArgsToolDefReminder = getInvalidArgsToolDefReminder();
      const descriptor2 = serverDescriptors.get(args.server);
      const serverDisplayName = descriptor2?.serverName ?? args.server;
      const plugin = descriptor2?.plugin;
      const marketplace = descriptor2?.marketplace;
      const pluginId = descriptor2?.pluginDbId;
      const marketplaceId = descriptor2?.marketplaceId;
      if (allowInteractiveMcpAuth && args.toolName === MCP_AUTH_VIRTUAL_TOOL_NAME) {
        const serverIdentifier = args.server.trim();
        if (serverIdentifier.length === 0) {
          const message = "Missing serverIdentifier or toolCallId";
          throw new CustomToolCallError(ToolErrorClassification.INVALID_ARGS, {
            error: message,
            clientVisibleErrorMessage: message,
            modelVisibleErrorMessage: message
          });
        }
        const mcpAuthArgs = new McpAuthArgs({
          serverIdentifier,
          toolCallId: meta.toolCallId
        });
        const pendingAuthToolCall = createMcpAuthToolCall(new McpAuthToolCall({ args: mcpAuthArgs }));
        await interactionHandler.emitPartialToolCall(spanCtxt.ctx, meta.toolCallId, pendingAuthToolCall);
        await interactionHandler.recordPendingToolCall(spanCtxt.ctx, meta.toolCallId, pendingAuthToolCall);
        const tracker = getAgentEventTracker(spanCtxt.ctx);
        tracker.trackMcpToolCall(spanCtxt.ctx, {
          name: args.toolName,
          mcpServerName: serverDisplayName,
          origin: getMcpToolOrigin(args.server),
          plugin,
          marketplace,
          pluginId,
          marketplaceId
        });
        const paramsJson = JSON.stringify(args.arguments ?? {});
        try {
          const mcpAuthResponse = await queryMcpAuth(interactionHandler.listener, spanCtxt.ctx, mcpAuthArgs);
          const rejectedReason = mcpAuthResponse.result.case === "rejected" ? mcpAuthResponse.result.value.reason || "User rejected MCP authentication" : void 0;
          const authResult = rejectedReason === void 0 ? createVirtualMcpAuthSuccessResult(serverIdentifier) : createVirtualMcpAuthRejectedResult(rejectedReason);
          if (rejectedReason === void 0) {
            tracker.trackMcpToolCallResult(spanCtxt.ctx, {
              toolName: args.toolName,
              mcpServerName: serverDisplayName,
              paramsJson,
              success: true
            });
            emitSuccessMetrics(spanCtxt.ctx, authResult, calledWithoutReadDef);
          } else {
            const rejectedError = new ToolCallRejectedError(rejectedReason);
            tracker.trackMcpToolCallResult(spanCtxt.ctx, {
              toolName: args.toolName,
              mcpServerName: serverDisplayName,
              paramsJson,
              success: false,
              errorMessage: rejectedError.message,
              errorClassification: getWrappedMcpErrorClassification(rejectedError)
            });
            emitErrorMetrics(spanCtxt.ctx, {
              failureReason: CALL_MCP_TOOL_FAILURE_REASONS.REJECTED,
              retryable: false,
              calledWithoutReadDef,
              error: rejectedError
            });
          }
          await interactionHandler.executeToolCall(spanCtxt.ctx, pendingAuthToolCall, meta.toolCallId, async () => authResult, () => createMcpAuthToolCall(new McpAuthToolCall({
            args: mcpAuthArgs,
            result: new McpAuthResult({
              result: rejectedReason === void 0 ? {
                case: "success",
                value: new McpAuthSuccess({
                  serverIdentifier
                })
              } : {
                case: "rejected",
                value: new McpAuthRejected({
                  reason: rejectedReason
                })
              }
            })
          })), meta.hookContextCollector);
          return authResult;
        } catch (error41) {
          tracker.trackMcpToolCallResult(spanCtxt.ctx, {
            toolName: args.toolName,
            mcpServerName: serverDisplayName,
            paramsJson,
            success: false,
            errorMessage: error41 instanceof Error ? error41.message : String(error41),
            errorClassification: error41 instanceof Error ? getWrappedMcpErrorClassification(error41) : ToolErrorClassification.OTHER_ERROR
          });
          emitErrorMetrics(spanCtxt.ctx, {
            failureReason: error41 instanceof ToolCallRejectedError ? CALL_MCP_TOOL_FAILURE_REASONS.REJECTED : CALL_MCP_TOOL_FAILURE_REASONS.OTHER,
            retryable: false,
            calledWithoutReadDef,
            error: error41
          });
          throw error41;
        }
      }
      const toolArgs = new McpArgs({
        name: `${args.server}-${args.toolName}`,
        args: Object.fromEntries(Object.entries(args.arguments ?? {}).map(([key, value]) => [
          key,
          Value.fromJson(value)
        ])),
        toolCallId: meta.toolCallId,
        providerIdentifier: serverDisplayName,
        toolName: args.toolName,
        serverIdentifier: args.server
      });
      const baseToolCall = new McpToolCall({
        args: toolArgs,
        result: void 0,
        description: args.description
      });
      return await interactionHandler.executeToolCall(spanCtxt.ctx, createMcpToolCall(baseToolCall), meta.toolCallId, async (ctx) => {
        const tracker = getAgentEventTracker(ctx);
        tracker.trackMcpToolCall(ctx, {
          name: args.toolName,
          mcpServerName: serverDisplayName,
          origin: getMcpToolOrigin(args.server),
          plugin,
          marketplace,
          pluginId,
          marketplaceId
        });
        const paramsJson = JSON.stringify(args.arguments ?? {});
        const smartModeClassifierState = getSmartModeClassifierRuntimeState({
          agentType,
          requestContext,
          smartModeClassifierMode,
          smartModeClassifierShadowMode,
          devBlockState: devSmartModeClassifierBlockState,
          devDelayState: devSmartModeClassifierDelayState
        });
        const smartModeClassifierEnabled = smartModeClassifierState.enabled;
        const smartModeClassifierShadowEnabled = smartModeClassifierState.shadowEnabled;
        const runtimeDevSmartModeClassifierBlockState = smartModeClassifierState.devBlockState;
        const runtimeDevSmartModeClassifierDelayState = smartModeClassifierState.devDelayState;
        const toolDescriptor = descriptor2?.tools.find((tool) => tool.toolName === args.toolName);
        let allowlistedByPrecheck = false;
        if ((smartModeClassifierEnabled || smartModeClassifierShadowEnabled) && args.requestSmartModeApproval !== true && !disableSmartModeAllowlistPrecheck) {
          const precheckExecutor = resourceAccessor.get(mcpAllowlistPrecheckExecutorResource);
          if (precheckExecutor !== void 0) {
            try {
              const precheck = await precheckExecutor.execute(ctx, new McpAllowlistPrecheckArgs({
                providerIdentifier: serverDisplayName,
                toolName: args.toolName,
                toolCallId: meta.toolCallId,
                annotationsJson: toolDescriptor?.annotationsJson
              }));
              allowlistedByPrecheck = precheck.allowlisted;
            } catch (error41) {
              if (error41 instanceof Error && error41.name === "AbortError") {
                throw error41;
              }
              if (isAgentStreamStartTimeoutError(error41)) {
                throw error41;
              }
              logger53.warn(ctx, "MCP allowlist precheck failed", {
                error: error41 instanceof Error ? error41.message : String(error41)
              });
            }
          }
        }
        const abortSignal = interactionHandler.getAbortSignal?.(ctx) ?? ctx.signal;
        const toolDefinitionDescription = toolDescriptor?.description ?? "";
        const toolDefinitionInputSchemaText = JSON.stringify(toolDescriptor?.inputSchema?.toJson() ?? null);
        const toolDefinitionText = JSON.stringify({
          description: toolDefinitionDescription,
          inputSchema: toolDescriptor?.inputSchema?.toJson() ?? null
        });
        const toolDefinitionBinding = smartModeApprovalProvider === void 0 ? void 0 : {
          identity: toolDefinitionPath ?? `${args.server}:${args.toolName}`,
          hash: toolDescriptor === void 0 ? void 0 : (0, import_node_crypto28.createHash)("sha256").update(toolDefinitionText).digest("hex")
        };
        const toolDefinitionMetadata = smartModeApprovalProvider === void 0 ? void 0 : {
          description: toolDefinitionDescription.slice(0, 4e3),
          input_schema_json: toolDefinitionInputSchemaText.slice(0, 12e3),
          definition_hash: toolDefinitionBinding?.hash ?? "",
          truncated: toolDefinitionDescription.length > 4e3 || toolDefinitionInputSchemaText.length > 12e3
        };
        const loadWorkspacePermissionFiles = loadSmartModeWorkspacePermissionFiles;
        const smartModeApproval = allowlistedByPrecheck ? void 0 : await rejectSmartModeMcpPreflightBlock(ctx, {
          resourceAccessor,
          enabled: smartModeClassifierEnabled,
          shadowEnabled: smartModeClassifierShadowEnabled,
          toolCallId: meta.toolCallId,
          stateHandler: meta.stateHandler,
          devSmartModeClassifierBlockState: runtimeDevSmartModeClassifierBlockState,
          devSmartModeClassifierDelayState: runtimeDevSmartModeClassifierDelayState,
          workspacePaths: loadWorkspacePermissionFiles ? meta.workspacePaths : void 0,
          userAutoRunInstructions: loadWorkspacePermissionFiles ? meta.userAutoRunInstructions ?? userAutoRunInstructions : userAutoRunInstructions,
          projectAutoRunInstructions: loadWorkspacePermissionFiles ? meta.projectAutoRunInstructions ?? projectAutoRunInstructions : projectAutoRunInstructions,
          requestSmartModeApproval: args.requestSmartModeApproval,
          smartModeBlockReason: args.smartModeBlockReason,
          description: args.description,
          approvalProvider: smartModeApprovalProvider,
          signal: abortSignal,
          useNestedMcpDetails: useDynamicToolNamespaces,
          agentType,
          toolDefinitionBinding,
          extractSmartModeClassifierConversationContext: extractSmartModeClassifierConversationContext2,
          suppressClassifierTelemetryIds: suppressSmartModeClassifierTelemetryIds,
          classifierMaxAttempts: smartModeClassifierMaxAttempts,
          // The classifier target, the approval target/fingerprint, and
          // execution must all see the exact same arguments so nothing
          // unreviewed can execute. Nested `requestSmartModeApproval` /
          // `smartModeBlockReason` keys are lifted out of tool arguments
          // (when the retry params are in the schema) so they cannot
          // reach the classifier via mcpArguments. With a host provider,
          // an explicit approval retry still runs the classifier first,
          // then surfaces the Sand card on BLOCK.
          target: {
            serverIdentifier: args.server,
            serverName: descriptor2?.serverName,
            serverDisplayName,
            toolName: args.toolName,
            mcpMode,
            mcpArguments: args.arguments,
            toolDefinitionMetadata
          },
          onRejectWithoutNativeApproval: (error41) => {
            const telemetryError = new ToolCallRejectedError(SMART_MODE_MCP_PREFLIGHT_REJECTED_TELEMETRY_REASON);
            tracker.trackMcpToolCallResult(ctx, {
              toolName: args.toolName,
              mcpServerName: serverDisplayName,
              paramsJson,
              success: false,
              errorMessage: telemetryError.message,
              errorClassification: getWrappedMcpErrorClassification(telemetryError)
            });
            emitErrorMetrics(ctx, {
              failureReason: CALL_MCP_TOOL_FAILURE_REASONS.REJECTED,
              retryable: false,
              calledWithoutReadDef,
              error: telemetryError
            });
          }
        });
        if (smartModeApproval !== void 0) {
          toolArgs.smartModeApproval = smartModeApproval;
        } else if (smartModeClassifierEnabled && !allowlistedByPrecheck) {
          toolArgs.skipApproval = true;
        }
        let execResult;
        try {
          if (abortSignal.aborted) {
            throw new ToolCallAbortedError();
          }
          const executeInner = (execCtx, mcpArgs) => executor.execute(execCtx.with(agentToolExecutionMetaKey, meta), mcpArgs, {
            execId: generateSeededUuid(meta.toolCallId),
            hookContextCollector: meta.hookContextCollector
          });
          const steerReleaseSignal = steerReleaseReadOnlyTools && parseMcpToolAnnotations(toolDescriptor?.annotationsJson)?.readOnlyHint === true ? meta.contextInjectionSignal : void 0;
          let steerReleaseOutcome;
          const executeWithOptionalSteer = async (execCtx, mcpArgs) => {
            if (steerReleaseSignal === void 0) {
              return executeInner(execCtx, mcpArgs);
            }
            const outcome = await raceMcpExecAgainstSteerRelease({
              toolCtx: execCtx,
              steerSignal: steerReleaseSignal,
              minRuntimeMs: steerReleaseMinRuntimeMs,
              drainMs: steerReleaseDrainMs,
              run: (raceCtx) => executeInner(raceCtx, mcpArgs)
            });
            if (outcome.kind === "completed") {
              return outcome.execResult;
            }
            steerReleaseOutcome = outcome;
            return new McpResult({
              result: {
                case: "success",
                value: createSteerReleasedMcpSuccess({
                  server: args.server,
                  toolName: args.toolName,
                  runtimeMs: outcome.runtimeMs
                })
              }
            });
          };
          const executeMaybeHooked = wrapBackendRoutedMcpExecute({
            executor,
            providerIdentifier: serverDisplayName,
            toolName: args.toolName,
            executeFn: executeWithOptionalSteer,
            hookOptions: {
              resourceAccessor,
              enableExecuteHookExec,
              configuredSteps: requestContext?.hooksConfig?.configuredSteps,
              model,
              hookContextCollector: meta.hookContextCollector
            },
            requestContext: {
              toolCallId: meta.toolCallId,
              model,
              conversationId: getConversationId(ctx)
            }
          });
          execResult = await executeMaybeHooked(ctx, toolArgs);
          if (steerReleaseOutcome !== void 0) {
            logger53.info(ctx, "nal.steer_release.mcp", {
              server: args.server,
              toolName: args.toolName,
              runtimeMs: steerReleaseOutcome.runtimeMs,
              callId: meta.toolCallId,
              ...steerReleaseOutcome.execErrorAfterRelease !== void 0 ? {
                execErrorAfterRelease: steerReleaseOutcome.execErrorAfterRelease instanceof Error ? steerReleaseOutcome.execErrorAfterRelease.message : String(steerReleaseOutcome.execErrorAfterRelease)
              } : {}
            });
            if (smartModeApproval !== void 0) {
              try {
                await cancelSmartModeMcpApprovalRequest(ctx, resourceAccessor.get(smartModeMcpApprovalStoreResource), smartModeApproval.requestId);
              } catch (cancelError) {
                logger53.warn(spanCtxt.ctx, "Failed to cancel Smart Mode MCP approval request after steer release", {
                  error: cancelError,
                  requestId: smartModeApproval.requestId
                });
              }
            }
            const releasedResult = createSteerReleasedMcpResult({
              server: args.server,
              toolName: args.toolName,
              runtimeMs: steerReleaseOutcome.runtimeMs
            });
            tracker.trackMcpToolCallResult(ctx, {
              toolName: args.toolName,
              mcpServerName: serverDisplayName,
              paramsJson,
              success: true
            });
            emitSuccessMetrics(ctx, releasedResult, calledWithoutReadDef);
            return releasedResult;
          }
        } catch (error41) {
          if (smartModeApproval !== void 0) {
            try {
              await cancelSmartModeMcpApprovalRequest(ctx, resourceAccessor.get(smartModeMcpApprovalStoreResource), smartModeApproval.requestId);
            } catch (cancelError) {
              logger53.warn(spanCtxt.ctx, "Failed to cancel Smart Mode MCP approval request", {
                error: cancelError,
                requestId: smartModeApproval.requestId
              });
            }
          }
          const classifiedError = error41 instanceof ToolCallError ? error41 : createMcpTransportError(error41 instanceof Error ? error41.message : String(error41), error41);
          tracker.trackMcpToolCallResult(ctx, {
            toolName: args.toolName,
            mcpServerName: serverDisplayName,
            paramsJson,
            success: false,
            errorMessage: classifiedError instanceof Error ? classifiedError.message : String(classifiedError),
            errorClassification: getWrappedMcpErrorClassification(classifiedError)
          });
          emitErrorMetrics(ctx, {
            failureReason: CALL_MCP_TOOL_FAILURE_REASONS.TRANSPORT_ERROR,
            retryable: false,
            calledWithoutReadDef,
            error: classifiedError
          });
          if (readToolDefReminder !== void 0) {
            logger53.error(spanCtxt.ctx, "Error in call_mcp_tool", { error: error41 });
            throw new McpWithoutReadToolDefinitionError(classifiedError, readToolDefReminder, getWrappedMcpErrorClassification(classifiedError));
          }
          if (isInvalidMcpArgumentsError(classifiedError)) {
            throw new McpInvalidArgsToolDefinitionReminderError(classifiedError, invalidArgsToolDefReminder);
          }
          throw classifiedError;
        }
        execResult = await spillLargeMcpTextOutput({
          ctx,
          result: execResult,
          resourceAccessor,
          // Fall back to `env.projectFolder` (always populated by the
          // exec daemon) because `mcpFileSystemOptions` is absent when all
          // MCP servers are backend-side HTTP (the common cloud-agent
          // shape: automations, connectors, team plugins).
          projectDir: requestContext?.mcpFileSystemOptions?.workspaceProjectDir ?? mcpFileSystemOptions?.workspaceProjectDir ?? requestContext?.env?.projectFolder,
          osPlatform: requestContext?.env?.osVersion?.split(" ")[0],
          toolCallId: meta.toolCallId
        });
        try {
          const result = convertExecSuccessToToolSuccess(execResult, readToolDefReminder, invalidArgsToolDefReminder, mcpMetaToolEnabled ? void 0 : mcpFileSystemOptions, mcpMetaToolEnabled ? resolvedGetMcpToolsToolName : void 0, args.server);
          tracker.trackMcpToolCallResult(ctx, {
            toolName: args.toolName,
            mcpServerName: serverDisplayName,
            paramsJson,
            success: true
          });
          emitSuccessMetrics(ctx, result, calledWithoutReadDef);
          return result;
        } catch (e) {
          tracker.trackMcpToolCallResult(ctx, {
            toolName: args.toolName,
            mcpServerName: serverDisplayName,
            paramsJson,
            success: false,
            errorMessage: e instanceof Error ? e.message : String(e),
            errorClassification: e instanceof Error ? getWrappedMcpErrorClassification(e) : ToolErrorClassification.OTHER_ERROR
          });
          let failureReason = CALL_MCP_TOOL_FAILURE_REASONS.OTHER;
          if (e instanceof ToolCallRejectedError) {
            failureReason = CALL_MCP_TOOL_FAILURE_REASONS.REJECTED;
          } else if (e instanceof McpServerDoesNotExistError) {
            failureReason = CALL_MCP_TOOL_FAILURE_REASONS.SERVER_NOT_FOUND;
          } else if (e instanceof McpPermissionDeniedError) {
            failureReason = CALL_MCP_TOOL_FAILURE_REASONS.PERMISSION_DENIED;
          } else if (e instanceof McpExecToolNotFoundError) {
            failureReason = CALL_MCP_TOOL_FAILURE_REASONS.EXEC_NOT_FOUND;
          } else if (e instanceof McpWithoutReadToolDefinitionError) {
            failureReason = CALL_MCP_TOOL_FAILURE_REASONS.WITHOUT_READ_DEF;
          }
          emitErrorMetrics(ctx, {
            failureReason,
            retryable: false,
            calledWithoutReadDef,
            error: e
          });
          throw e;
        }
      }, (result) => createMcpToolCall(new McpToolCall({ ...baseToolCall, result })), meta.hookContextCollector);
    } catch (e_2) {
      env_2.error = e_2;
      env_2.hasError = true;
    } finally {
      __disposeResources17(env_2);
    }
  };
  const exampleDescriptionLine = `"description": "Search the public docs for the example API",
  `;
  return createZodAgentTool("MCP", {
    name: name17,
    dynamicToolMetaRole: mcpMetaToolEnabled ? "invocation" : void 0,
    resolveToolCallTelemetry: dynamicToolRegistry === void 0 ? void 0 : (rawArgs) => {
      if (rawArgs === null || typeof rawArgs !== "object" || Array.isArray(rawArgs)) {
        return { toolIdentifier: "MCP", isDynamic: true };
      }
      const requestedToolName = "toolName" in rawArgs && typeof rawArgs.toolName === "string" ? rawArgs.toolName : void 0;
      const namespace = "namespace" in rawArgs ? rawArgs.namespace : void 0;
      if (typeof namespace === "string" && isReservedDynamicToolsNamespace(namespace) && requestedToolName !== void 0) {
        return {
          toolIdentifier: dynamicToolRegistry.getTool(requestedToolName)?.toolIdentifier ?? "unknown",
          isDynamic: true
        };
      }
      return {
        toolIdentifier: "MCP",
        isDynamic: true
      };
    },
    descriptionGenerator: (props) => {
      if (mcpMetaToolEnabled) {
        const getMcpToolsToolName2 = getRequiredToolName(props.allTools, "GET_MCP_TOOLS");
        if (useDynamicToolNamespaces) {
          return `Invoke one tool from a dynamic namespace, e.g. an MCP server. IMPORTANT: Always call ${getMcpToolsToolName2} for this namespace/tool before calling to ensure correct parameters. Set mcpDetails only for tools from external MCP namespaces; omit it for first-party tools in the cursor namespace.

Example:
{
  "namespace": "my-namespace",
  "toolName": "search",
  "mcpDetails": { "description": "Search the public docs for the example API" },
  "arguments": { "query": "example", "limit": 10 }
}`;
        }
        return `Call an MCP tool by server identifier and tool name with arbitrary JSON arguments. IMPORTANT: Always call ${getMcpToolsToolName2} for this server/tool before calling to ensure correct parameters.

Example:
{
  "server": "my-mcp-server",
  "toolName": "search",
  ${exampleDescriptionLine}"arguments": { "query": "example", "limit": 10 }
}`;
      }
      return `Call an MCP tool by server identifier and tool name with arbitrary JSON arguments. IMPORTANT: Always read the tool's schema/descriptor BEFORE calling to ensure correct parameters.

Example:
{
  "server": "my-mcp-server",
  "toolName": "search",
  ${exampleDescriptionLine}"arguments": { "query": "example", "limit": 10 }
}`;
    },
    parameters: parametersSchema29,
    render: renderMcpTool,
    execute: withSafeParsedArgs(parsingParametersSchema, execute, createMcpToolCall(new McpToolCall())),
    serializeError: (error41) => {
      if (error41 instanceof McpWithoutReadToolDefinitionError) {
        return createMcpToolCall(new McpToolCall({
          result: new McpToolResult({
            result: {
              case: "error",
              value: new McpToolError({
                error: error41.clientVisibleErrorMessage,
                readToolDefReminder: error41.modelVisibleErrorMessage
              })
            }
          })
        }));
      }
      if (error41 instanceof McpServerDoesNotExistError) {
        return createMcpToolCall(new McpToolCall({
          result: new McpToolResult({
            result: {
              case: "error",
              value: new McpToolError({
                error: error41.clientVisibleErrorMessage,
                readToolDefReminder: error41.readServerDefReminder
              })
            }
          })
        }));
      }
      if (error41 instanceof McpToolDoesNotExistError) {
        return createMcpToolCall(new McpToolCall({
          result: new McpToolResult({
            result: {
              case: "error",
              value: new McpToolError({
                error: error41.clientVisibleErrorMessage,
                readToolDefReminder: error41.readToolDefReminder
              })
            }
          })
        }));
      }
      if (error41 instanceof McpPermissionDeniedError) {
        return createMcpToolCall(new McpToolCall({
          result: new McpToolResult({
            result: {
              case: "permissionDenied",
              value: new McpPermissionDenied({
                error: error41.error,
                isReadonly: error41.isReadonly
              })
            }
          })
        }));
      }
      if (error41 instanceof ToolCallRejectedError) {
        return createMcpToolCall(new McpToolCall({
          result: new McpToolResult({
            result: {
              case: "rejected",
              value: new McpRejected({ reason: error41.message })
            }
          })
        }));
      }
      if (error41 instanceof CustomToolCallError) {
        return createMcpToolCall(new McpToolCall({
          result: new McpToolResult({
            result: {
              case: "error",
              value: new McpToolError({
                error: error41.clientVisibleErrorMessage,
                readToolDefReminder: error41.modelVisibleErrorMessage
              })
            }
          })
        }));
      }
      const errorMessage6 = error41 instanceof Error ? error41.message : String(error41);
      return createMcpToolCall(new McpToolCall({
        result: new McpToolResult({
          result: {
            case: "error",
            value: new McpToolError({
              error: "Tool execution error",
              readToolDefReminder: errorMessage6
            })
          }
        })
      }));
    }
  });
};
async function renderMcpTool(_ctx, { result }, _props) {
  switch (result.case) {
    case "success":
      return {
        content: result.value.content.map((item) => {
          if (item.content.case === "text") {
            const textContent = item.content.value;
            if (textContent.outputLocation) {
              const totalSize = Number(textContent.outputLocation.sizeBytes);
              const lineCount = Number(textContent.outputLocation.lineCount);
              const sizeStr = totalSize >= 1024 ? `${(totalSize / 1024).toFixed(1)} KB` : `${totalSize} bytes`;
              return {
                type: "text",
                text: `Large output has been written to: ${textContent.outputLocation.filePath} (${sizeStr}, ${lineCount} lines)`
              };
            }
            return {
              type: "text",
              text: textContent.text
            };
          }
          if (item.content.case === "image") {
            return {
              type: "image",
              data: Buffer.from(item.content.value.data).toString("base64"),
              mimeType: item.content.value.mimeType
            };
          }
          throw new Error(`Unhandled content case: ${item.content.case}`);
        }),
        isError: result.value.isError
      };
    case "rejected":
      return createStringResult(result.value.reason ? `Tool rejected: ${result.value.reason}` : "Tool rejected");
    case "error":
      if (result.value.readToolDefReminder) {
        return createStringResult(`Error: ${result.value.error}. ${result.value.readToolDefReminder}`);
      }
      return createStringResult(`Error: ${result.value.error}`);
    case "permissionDenied":
      if (result.value.isReadonly) {
        return createStringResult(ASK_MODE_MODEL_ERROR);
      }
      return createStringResult(`Permission denied: ${result.value.error}`);
    case void 0:
      return createStringResult("Unknown error");
    default: {
      const _exhaustiveCheck = result;
      throw new Error(`Unhandled result case: ${_exhaustiveCheck}`);
    }
  }
}
