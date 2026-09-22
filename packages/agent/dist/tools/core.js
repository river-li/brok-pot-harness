/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/tools/core.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
init_dist4();

// @recovered-fragment 2/2
var __addDisposableResource3 = function(env, value, async) {
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
var __disposeResources3 = /* @__PURE__ */ (function(SuppressedError2) {
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
})(typeof SuppressedError === "function" ? SuppressedError : function(error42, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error42, e.suppressed = suppressed, e;
});
function getRequiredToolName(allTools, toolId) {
  const tool = allTools[toolId];
  if (!tool) {
    throw new Error(`Required tool ${toolId} not found in allTools`);
  }
  return tool.name;
}
function isPromptVisibleDescription(options2) {
  return options2?.promptVisible !== false;
}
function isForcedStaticContext(contextType) {
  return contextType?.type === "static";
}
function getConciseStaticContext(contextType) {
  if (contextType?.type !== "dynamic") {
    return void 0;
  }
  const text2 = contextType.conciseStaticContext?.trim();
  if (!text2) {
    return void 0;
  }
  return text2;
}
function resolveToolCallIdentity({ tool, args, isDirectDynamicTool = false }) {
  const identity = tool.resolveToolCallTelemetry?.(args) ?? {
    toolIdentifier: tool.toolIdentifier,
    isDynamic: false
  };
  return {
    ...identity,
    isDynamic: identity.isDynamic || isDirectDynamicTool
  };
}
function getExecutableTools(toolSet) {
  if (toolSet.additionalExecutableTools.length === 0) {
    return toolSet.modelVisibleTools;
  }
  return [...toolSet.modelVisibleTools, ...toolSet.additionalExecutableTools];
}
function getDirectDynamicToolNames(toolSet) {
  return new Set(toolSet.additionalExecutableTools.map((tool) => tool.name));
}
function stabilizeMcpToolOrder(tools) {
  const nonMcp = [];
  const mcp = [];
  for (const tool of tools) {
    if (tool.toolIdentifier === "MCP") {
      mcp.push(tool);
    } else {
      nonMcp.push(tool);
    }
  }
  if (mcp.length === 0) {
    return tools;
  }
  mcp.sort((a, b2) => a.name.localeCompare(b2.name));
  return [...nonMcp, ...mcp];
}
var ToolSetHandle = class _ToolSetHandle {
  constructor(allToolsByIdentifier, staticTools, dynamicTools = [], dynamicToolRegistry, descriptionProps = { allTools: {} }) {
    this.allToolsByIdentifier = allToolsByIdentifier;
    this.staticTools = staticTools;
    this.dynamicTools = dynamicTools;
    this.dynamicToolRegistry = dynamicToolRegistry;
    this.descriptionProps = descriptionProps;
  }
  hasTool(identifier) {
    return this.getTool(identifier) !== void 0;
  }
  getTool(identifier) {
    return this.allToolsByIdentifier.get(identifier)?.at(0);
  }
  /**
   * Resolves the model-visible call envelope to its semantic tool identity.
   * Invocation meta tools may map their outer call to an underlying dynamic
   * first-party tool.
   */
  resolveToolCallIdentity({ toolName, args }) {
    const staticTool = this.staticTools.find((tool) => tool.name === toolName);
    if (staticTool !== void 0) {
      return resolveToolCallIdentity({ tool: staticTool, args });
    }
    const dynamicTool = this.dynamicTools.find((tool) => tool.name === toolName);
    if (dynamicTool !== void 0) {
      return resolveToolCallIdentity({
        tool: dynamicTool,
        args,
        isDirectDynamicTool: true
      });
    }
    return void 0;
  }
  getTools(identifier) {
    return this.allToolsByIdentifier.get(identifier);
  }
  hasStaticTool(identifier) {
    return this.getStaticTool(identifier) !== void 0;
  }
  getStaticTool(identifier) {
    return this.staticTools.find((tool) => tool.toolIdentifier === identifier);
  }
  /**
   * Static/prompt-visible tools only. Dynamic first-party tools (surfaced via the
   * MCP meta tools) are not included; use getDynamicTools() for those.
   */
  getStaticTools() {
    return this.staticTools;
  }
  /**
   * All executable first-party tools, including dynamically exposed tools.
   * Use this for capability/name lookups and prompt metadata. Do not pass this
   * list to the model as tool schemas; use getStaticTools() for that.
   */
  getAllTools() {
    return [...this.staticTools, ...this.dynamicTools];
  }
  /**
   * First-party tools removed from the static model tool list and exposed
   * on demand through discovery/invocation meta tools.
   */
  getDynamicTools() {
    return this.dynamicTools;
  }
  /**
   * Builds the model/execution split for a stream. Dynamic tools are accepted
   * directly only when the invocation meta tool is present in the model's
   * scoped tool list, preserving tool filtering and permission boundaries.
   */
  getToolExecutionSet(modelVisibleTools = this.staticTools) {
    if (this.dynamicTools.length === 0) {
      return {
        modelVisibleTools,
        additionalExecutableTools: []
      };
    }
    const canInvokeDynamicTools = modelVisibleTools.some((tool) => tool.dynamicToolMetaRole === "invocation");
    if (!canInvokeDynamicTools) {
      return {
        modelVisibleTools,
        additionalExecutableTools: []
      };
    }
    const modelToolNames = new Set(modelVisibleTools.map((tool) => tool.name));
    const directDynamicTools = this.dynamicTools.filter((tool) => !modelToolNames.has(tool.name));
    return {
      modelVisibleTools,
      additionalExecutableTools: directDynamicTools
    };
  }
  getDynamicToolRegistry() {
    return this.dynamicToolRegistry;
  }
  /**
   * Static and dynamic tool metadata, used by provider-facing description
   * generation so static tools can reference dynamic siblings.
   */
  getDescriptionProps() {
    return this.descriptionProps;
  }
  /**
   * Applies an identity-preserving transformation to static and dynamic tools
   * and updates this handle plus the registry captured by meta-tool closures.
   * Retained dynamic tools must be returned as the same objects.
   */
  transformToolsInPlace(transform2) {
    const transformed = transform2(this.getAllTools());
    const dynamicToolSet = new Set(this.dynamicTools);
    const dynamicTools = transformed.filter((tool) => dynamicToolSet.has(tool));
    const staticTools = transformed.filter((tool) => !dynamicToolSet.has(tool));
    const transformedHandle = this.dynamicToolRegistry === void 0 ? _ToolSetHandle.fromTools(staticTools) : _ToolSetHandle.fromTools({
      staticTools,
      dynamicTools,
      dynamicToolRegistry: this.dynamicToolRegistry
    });
    this.allToolsByIdentifier = transformedHandle.allToolsByIdentifier;
    this.staticTools = transformedHandle.staticTools;
    this.dynamicTools = transformedHandle.dynamicTools;
    this.descriptionProps = transformedHandle.descriptionProps;
    return this;
  }
  static fromTools(input) {
    const { staticTools: tools, dynamicTools = [], dynamicToolRegistry } = Array.isArray(input) ? { staticTools: input } : input;
    const hasDynamicMetaTools = tools.some((tool) => tool.dynamicToolMetaRole === "discovery") && tools.some((tool) => tool.dynamicToolMetaRole === "invocation");
    const canExposeDynamicTools = dynamicToolRegistry !== void 0 && hasDynamicMetaTools;
    const effectiveDynamicTools = canExposeDynamicTools ? dynamicTools : [];
    const effectiveStaticTools = canExposeDynamicTools ? tools : [...tools, ...dynamicTools];
    const descriptionProps = buildDescriptionGeneratorProps([
      ...effectiveStaticTools,
      ...effectiveDynamicTools
    ]);
    dynamicToolRegistry?.replaceTools({
      dynamicTools: effectiveDynamicTools,
      allTools: [...effectiveStaticTools, ...effectiveDynamicTools]
    });
    const allToolsByIdentifier = /* @__PURE__ */ new Map();
    const sortedStaticTools = stabilizeMcpToolOrder(effectiveStaticTools);
    for (const tool of [...sortedStaticTools, ...effectiveDynamicTools]) {
      const existing = allToolsByIdentifier.get(tool.toolIdentifier);
      if (existing) {
        existing.push(tool);
      } else {
        allToolsByIdentifier.set(tool.toolIdentifier, [tool]);
      }
    }
    return new _ToolSetHandle(allToolsByIdentifier, sortedStaticTools, effectiveDynamicTools, dynamicToolRegistry, descriptionProps);
  }
  /**
   * Merges into whichever handle owns the dynamic registry and returns that
   * mutated handle. Callers must discard both input references after merging.
   */
  merge(other) {
    const otherRegistry = other.getDynamicToolRegistry();
    if (this.dynamicToolRegistry !== void 0 && otherRegistry !== void 0 && this.dynamicToolRegistry !== otherRegistry) {
      throw new Error("Cannot merge toolsets with distinct dynamic registries");
    }
    if (this.dynamicToolRegistry !== void 0 && this.dynamicToolRegistry === otherRegistry) {
      throw new Error("Cannot merge toolsets sharing a dynamic registry");
    }
    if (this.dynamicToolRegistry !== void 0) {
      return this.transformToolsInPlace((tools) => [...tools, ...other.getAllTools()]);
    }
    if (otherRegistry !== void 0) {
      return other.transformToolsInPlace((tools) => [...this.getAllTools(), ...tools]);
    }
    return _ToolSetHandle.fromTools([...this.getAllTools(), ...other.getAllTools()]);
  }
};
var ToolErrorClassification;
(function(ToolErrorClassification2) {
  ToolErrorClassification2["NOOP"] = "noop";
  ToolErrorClassification2["INVALID_ARGS"] = "invalid_args";
  ToolErrorClassification2["UNEXPECTED_ENVIRONMENT"] = "unexpected_environment";
  ToolErrorClassification2["USER_REJECTED"] = "user_rejected";
  ToolErrorClassification2["TIMEOUT"] = "timeout";
  ToolErrorClassification2["PROVIDER_ERROR"] = "provider_error";
  ToolErrorClassification2["BAD_USER_DEVICE_STATE"] = "bad_user_device_state";
  ToolErrorClassification2["ABORTED"] = "aborted";
  ToolErrorClassification2["EXEC_BACKEND_UNAVAILABLE"] = "exec_backend_unavailable";
  ToolErrorClassification2["HOOK_DENIED"] = "hook_denied";
  ToolErrorClassification2["MCP_AUTH_ERROR"] = "mcp_auth_error";
  ToolErrorClassification2["INVALID_OUTPUT_NOTIFICATION"] = "invalid_output_notification";
  ToolErrorClassification2["OTHER_ERROR"] = "error";
})(ToolErrorClassification || (ToolErrorClassification = {}));
async function executeToolResultOrError(tool, parentCtx, interactionHandler, argsStream, meta) {
  const env_1 = { stack: [], error: void 0, hasError: false };
  try {
    const spanCtxt = __addDisposableResource3(env_1, createSpan(parentCtx.withName("executeToolResultOrError")), false);
    const ctx = withLogAttributes(spanCtxt.ctx, {
      toolName: tool.toolIdentifier,
      toolId: meta.toolCallId
    });
    spanCtxt.span.setAttribute("toolName", tool.toolIdentifier);
    spanCtxt.span.setAttribute("toolId", meta.toolCallId);
    if (meta.enableToolArgPreservation === true && "customToolFormat" in tool && tool.customToolFormat !== void 0) {
      interactionHandler.markToolCallForArgPreservation(meta.toolCallId);
    }
    try {
      return {
        result: await tool.execute(ctx, interactionHandler, argsStream, meta)
      };
    } catch (error42) {
      if (error42 instanceof DeferredInteractionResponseError) {
        throw error42;
      }
      const shouldBubbleRetryableTaskErrors = getShouldBubbleRetryableTaskErrorsFromContext(ctx);
      if (error42 instanceof RetryableToolOrchestrationError && shouldBubbleRetryableTaskErrors) {
        throw error42;
      }
      const streamStartTimeoutTurnError = maybeCreateAgentStreamStartTimeoutTurnError(error42);
      if (streamStartTimeoutTurnError !== void 0) {
        throw streamStartTimeoutTurnError;
      }
      const interactionAbortSignal = interactionHandler.getAbortSignal?.(ctx);
      const normalized = maybeRewriteFusedStepGuardAbort(maybeNormalizeExecBoundaryError(error42), interactionAbortSignal !== void 0 ? [interactionAbortSignal, ctx.signal] : [ctx.signal], tool.name);
      if (normalized instanceof DeferredInteractionResponseError) {
        throw normalized;
      }
      if (normalized instanceof RetryableToolOrchestrationError && shouldBubbleRetryableTaskErrors) {
        throw normalized;
      }
      const errorClassification = classifyError(normalized);
      const output = tool.serializeError(normalized);
      if (!shouldHideToolCallErrorFromClient(normalized)) {
        await interactionHandler.emitToolCallError(ctx, meta.toolCallId, output);
      }
      return {
        result: output.tool.value?.result,
        error: normalized,
        errorClassification
      };
    }
  } catch (e_1) {
    env_1.error = e_1;
    env_1.hasError = true;
  } finally {
    __disposeResources3(env_1);
  }
}
function shouldHideToolCallErrorFromClient(error42) {
  return error42 instanceof CustomToolCallError && "hideFromClientToolCall" in error42 && error42.hideFromClientToolCall === true;
}
function isAbortLikeError(error42) {
  return error42 instanceof ToolCallAbortedError || error42 instanceof Error && error42.name === "AbortError";
}
function maybeRewriteFusedStepGuardAbort(error42, abortSignals, toolName) {
  if (!isAbortLikeError(error42)) {
    return error42;
  }
  const reason = findFusedStepGuardTimeoutReason(abortSignals, error42);
  if (reason === void 0) {
    return error42;
  }
  const timeoutError = createToolCallExecutionTimeoutError({
    toolName,
    executionTimeoutMs: reason.fuseGuardMs
  });
  timeoutError.cause = error42;
  return timeoutError;
}
function findFusedStepGuardTimeoutReason(abortSignals, error42) {
  for (const signal of abortSignals) {
    if (signal.aborted && isFusedStepGuardTimeoutReason(signal.reason)) {
      return signal.reason;
    }
  }
  if (isFusedStepGuardTimeoutReason(error42)) {
    return error42;
  }
  if (error42 instanceof Error && isFusedStepGuardTimeoutReason(error42.cause)) {
    return error42.cause;
  }
  return void 0;
}
function classifyError(error42) {
  if (error42 instanceof RetryableToolOrchestrationError) {
    return error42.classification ?? ToolErrorClassification.OTHER_ERROR;
  }
  if (error42 instanceof CustomToolCallError) {
    return error42.classification;
  }
  if (error42 instanceof ToolCallArgParseError) {
    return error42.classification ?? ToolErrorClassification.INVALID_ARGS;
  }
  if (isAbortLikeError(error42)) {
    return ToolErrorClassification.ABORTED;
  }
  if (error42 instanceof ToolCallRejectedError) {
    if (error42.message.includes(HOOK_DENIAL_AGENT_NOTE)) {
      return ToolErrorClassification.HOOK_DENIED;
    }
    return ToolErrorClassification.USER_REJECTED;
  }
  if (error42 instanceof ToolCallUnexpectedEnvironmentError) {
    return ToolErrorClassification.UNEXPECTED_ENVIRONMENT;
  }
  if (error42 instanceof ToolTimeoutError || error42 instanceof Error && error42.name === "TimeoutError" || isAxiosTimeoutError(error42)) {
    return ToolErrorClassification.TIMEOUT;
  }
  if (isBadUserDeviceStateError(error42)) {
    return ToolErrorClassification.BAD_USER_DEVICE_STATE;
  }
  if (isUnexpectedEnvironmentErrno(error42)) {
    return ToolErrorClassification.UNEXPECTED_ENVIRONMENT;
  }
  if (error42 instanceof RemoteHookBlockedError) {
    return ToolErrorClassification.HOOK_DENIED;
  }
  if (error42 instanceof Error && error42.message.includes(HOOK_DENIAL_AGENT_NOTE)) {
    return ToolErrorClassification.HOOK_DENIED;
  }
  return ToolErrorClassification.OTHER_ERROR;
}
function isAxiosTimeoutError(error42) {
  if (!(error42 instanceof Error)) {
    return false;
  }
  const code = error42.code;
  if (code === "ETIMEDOUT") {
    return true;
  }
  if (code === "ECONNABORTED" && error42.message.toLowerCase().includes("timeout")) {
    return true;
  }
  return false;
}
function isBadUserDeviceStateError(error42) {
  if (!(error42 instanceof Error)) {
    return false;
  }
  const errnoCode = error42.code;
  if (errnoCode === "ENOSPC" || errnoCode === "ENOMEM" || errnoCode === "EMFILE" || errnoCode === "ENFILE" || errnoCode === "EAGAIN" || errnoCode === "EBADF") {
    return true;
  }
  const message = error42.message.toLowerCase();
  return message.includes("no space left on device") || message.includes("out of memory") || message.includes("cannot allocate memory") || message.includes("too many open files") || message.includes("bad file descriptor");
}
function isUnexpectedEnvironmentErrno(error42) {
  if (!(error42 instanceof Error)) {
    return false;
  }
  const errnoCode = error42.code;
  if (errnoCode === "ENOENT" || errnoCode === "ENOTDIR") {
    return true;
  }
  const message = error42.message.toLowerCase();
  return message.includes("no such file or directory") || message.includes("not a directory");
}
async function renderToolResultOrError(ctx, tool, output, props) {
  const renderedOutput = await tool.render(ctx, output.result, props);
  if ("error" in output) {
    return {
      ...renderedOutput,
      isError: true
    };
  }
  return renderedOutput;
}
function extractToolMetadataMap(tools) {
  const record2 = {};
  for (const tool of tools) {
    record2[tool.toolIdentifier] = {
      name: tool.name,
      toolIdentifier: tool.toolIdentifier,
      parameters: tool.parameters
    };
  }
  return record2;
}
function buildDescriptionGeneratorProps(tools) {
  const allToolMetadata = {};
  for (const tool of tools) {
    allToolMetadata[tool.toolIdentifier] = {
      name: tool.name,
      toolIdentifier: tool.toolIdentifier,
      parameters: tool.parameters
    };
  }
  return { allTools: allToolMetadata };
}
function toAgentTools(tools, props) {
  const descProps = props ?? buildDescriptionGeneratorProps(tools);
  return tools.map((tool) => {
    if ("descriptionGenerator" in tool) {
      return {
        name: tool.name,
        description: tool.descriptionGenerator(descProps),
        parameters: tool.parameters,
        customToolFormat: tool.customToolFormat,
        render: tool.render
      };
    }
    return {
      name: tool.name,
      description: tool.description,
      parameters: tool.parameters,
      render: tool.render
    };
  });
}

