/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/tools/common.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
var import_node_crypto15 = require("node:crypto");
init_dist();
init_dist3();
init_zod();

// @recovered-fragment 2/2
var __addDisposableResource24 = function(env, value, async) {
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
var __disposeResources24 = /* @__PURE__ */ (function(SuppressedError2) {
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
})(typeof SuppressedError === "function" ? SuppressedError : function(error3, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error3, e.suppressed = suppressed, e;
});
var logger36 = createLogger("tools/common");
function generateSeededUuid(seed) {
  const hash = (0, import_node_crypto15.createHash)("sha256").update(seed).digest();
  hash[6] = hash[6] & 15 | 64;
  hash[8] = hash[8] & 63 | 128;
  const hex = hash.toString("hex");
  return [
    hex.substring(0, 8),
    hex.substring(8, 12),
    hex.substring(12, 16),
    hex.substring(16, 20),
    hex.substring(20, 32)
  ].join("-");
}
var SUBAGENT_REQUEST_ID_SEED_PREFIX = "subagent-request-";
function computeSubagentRequestId(toolCallId) {
  return generateSeededUuid(`${SUBAGENT_REQUEST_ID_SEED_PREFIX}${toolCallId}`);
}
var CHAR_HARD_LIMIT = 1e5;
var ASK_MODE_MODEL_ERROR = "You are in ask mode and cannot run non read-only tools. Ask the user to switch to agent mode if edits are required.";
var toolArgsParseSuccessRate = createHistogram("agent.tools.args_parse_success", {
  description: "Tool argument parsing success rate (1 for success, 0 for failure)",
  labelNames: ["tool_name"]
});
function isDsv3FromMeta(meta) {
  const sh = meta?.stateHandler;
  if (sh == null || typeof sh !== "object")
    return false;
  const fn = sh.isDsv3;
  return typeof fn === "function" && fn.call(sh) === true;
}
function containsGlmToolCallMarkup(args) {
  return args.includes("<arg_key>") || args.includes("<arg_value>");
}
var GLM_TOOL_CALL_TEMPLATE_VENDOR = "zai";
var GLM_TOOL_CALL_MARKUP_HINT = ' Your arguments contain literal <arg_key>/<arg_value> tags; write nested objects as plain JSON, e.g. {"query": "x"}.';
function stripDsv3TokensFromArgs(opts) {
  if (!opts.isDsv3Model) {
    return opts.args;
  }
  let result = opts.args;
  for (const token of DSV3_TOOL_TOKENS_TO_STRIP) {
    if (result.includes(token)) {
      logger36.warn(opts.ctx, "nal.tool_args.dsv3_token_leaked", {
        tool_name: opts.toolName,
        token
      });
      result = result.replaceAll(token, "");
    }
  }
  return result;
}
var agentToolExecutionMetaKey = createKey(/* @__PURE__ */ Symbol("agentToolExecutionMeta"), void 0);
function truncateOutput(output, maxLength = CHAR_HARD_LIMIT, frontAndBack = false) {
  if (output.length <= maxLength) {
    return {
      output,
      truncated: false
    };
  }
  if (frontAndBack) {
    const halfLength = Math.floor(maxLength / 2);
    const frontPart = output.substring(0, halfLength);
    const backPart = output.substring(output.length - halfLength);
    const ellipsis2 = "\n\n... (output truncated) ...\n\n";
    return {
      output: frontPart + ellipsis2 + backPart,
      truncated: true
    };
  }
  const truncated = output.substring(0, maxLength);
  const ellipsis = "\n\n... (output truncated)";
  return {
    output: truncated + ellipsis,
    truncated: true
  };
}
function stripSchemaArtifacts(obj) {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(stripSchemaArtifacts);
  }
  const record2 = obj;
  const { $schema: _$schema, default: _defaultVal, definitions: _definitions, markdownDescription: _markdownDescription, additionalProperties: _additionalProperties, ...rest } = record2;
  const result = {};
  for (const [key, value] of Object.entries(rest)) {
    result[key] = stripSchemaArtifacts(value);
  }
  return result;
}
function convertTupleSchemaToDraft2020_12(obj) {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(convertTupleSchemaToDraft2020_12);
  }
  const record2 = obj;
  const result = {};
  const isTupleSchema = Array.isArray(record2["items"]);
  for (const [key, value] of Object.entries(record2)) {
    if (key === "items" && Array.isArray(value)) {
      result["prefixItems"] = value.map(convertTupleSchemaToDraft2020_12);
      if (record2["additionalItems"] === false) {
        result["items"] = false;
      }
    } else if (key === "additionalItems") {
      if (isTupleSchema && value !== false) {
        result["items"] = convertTupleSchemaToDraft2020_12(value);
      }
    } else {
      result[key] = convertTupleSchemaToDraft2020_12(value);
    }
  }
  return result;
}
function createZodAgentTool(toolIdentifier, tool) {
  const fullSchema = esm_default(tool.parameters);
  const schema2 = stripSchemaArtifacts(fullSchema);
  return {
    toolIdentifier,
    name: tool.name,
    executionAliases: tool.executionAliases,
    contextType: tool.contextType,
    dynamicToolMetaRole: tool.dynamicToolMetaRole,
    mcpSnapshotDescriptors: tool.mcpSnapshotDescriptors,
    mcpToolSource: tool.mcpToolSource,
    resolveToolCallTelemetry: tool.resolveToolCallTelemetry,
    descriptionGenerator: tool.descriptionGenerator,
    descriptionTokenPartsGenerator: tool.descriptionTokenPartsGenerator,
    parameters: jsonSchema(schema2),
    customToolFormat: tool.customToolFormat,
    previewStreamingArgs: tool.previewStreamingArgs,
    prepareSubagent: tool.prepareSubagent,
    render: (ctx, output, props) => tool.render(ctx, output, props),
    execute: async (parentCtx, interactionHandler, argsStream, meta) => {
      const env_1 = { stack: [], error: void 0, hasError: false };
      try {
        const spanCtxt = __addDisposableResource24(env_1, createSpan(parentCtx.withName("execute")), false);
        spanCtxt.span.setAttribute("tool.name", toolIdentifier);
        const ctx = spanCtxt.ctx;
        return await tool.execute(ctx, interactionHandler, argsStream, meta);
      } catch (e_1) {
        env_1.error = e_1;
        env_1.hasError = true;
      } finally {
        __disposeResources24(env_1);
      }
    },
    serializeError: (error3) => tool.serializeError(error3)
  };
}
var ToolCallError = class extends Error {
  constructor({ clientVisibleErrorMessage, modelVisibleErrorMessage, error: error3 }) {
    super(error3);
    this.clientVisibleErrorMessage = clientVisibleErrorMessage;
    this.modelVisibleErrorMessage = modelVisibleErrorMessage;
  }
};
var ToolTimeoutError = class extends ToolCallError {
};
var CustomToolCallError = class extends ToolCallError {
  constructor(classification, { clientVisibleErrorMessage, modelVisibleErrorMessage, error: error3 }) {
    super({
      clientVisibleErrorMessage,
      modelVisibleErrorMessage,
      error: error3
    });
    this.classification = classification;
  }
};
var ToolCallArgParseError = class extends ToolCallError {
  constructor(formattedError, classification, issues) {
    super({
      clientVisibleErrorMessage: formattedError,
      modelVisibleErrorMessage: formattedError,
      error: formattedError
    });
    this.classification = classification;
    this.issues = issues;
  }
};
var ToolCallRejectedError = class extends ToolCallError {
  constructor(reason) {
    super({
      clientVisibleErrorMessage: reason,
      modelVisibleErrorMessage: reason,
      error: reason
    });
  }
};
var ToolCallUnexpectedEnvironmentError = class extends ToolCallError {
  constructor(reason) {
    super({
      clientVisibleErrorMessage: reason,
      modelVisibleErrorMessage: reason,
      error: reason
    });
  }
};
var ToolCallAbortedError = class extends ToolCallError {
  constructor() {
    super({
      clientVisibleErrorMessage: "Aborted",
      modelVisibleErrorMessage: "Aborted",
      error: "Aborted"
    });
  }
};
var RetryableToolOrchestrationError = class extends Error {
  constructor(message, options2) {
    super(message);
    this.isRetryable = true;
    this.name = "RetryableToolOrchestrationError";
    this.classification = options2?.classification;
    if (options2?.cause) {
      this.cause = options2.cause;
    }
  }
};
var RetryableToolEnvironmentOrchestrationError = class extends RetryableToolOrchestrationError {
  constructor(reason, options2) {
    super(reason, {
      ...options2,
      classification: ToolErrorClassification.UNEXPECTED_ENVIRONMENT
    });
    this.name = "RetryableToolEnvironmentOrchestrationError";
    this.code = options2?.code ?? "ENVIRONMENT_UNREACHABLE";
  }
};
function parseJsonArgsWithZodSchema(args, schema2, options2) {
  let parsedJson;
  try {
    parsedJson = JSON.parse(args);
  } catch (error3) {
    const parseErrorMessage = error3 instanceof Error ? error3.message : "Invalid arguments";
    const markupHint = options2?.modelVendor === GLM_TOOL_CALL_TEMPLATE_VENDOR && containsGlmToolCallMarkup(args) ? GLM_TOOL_CALL_MARKUP_HINT : "";
    throw new ToolCallArgParseError(`Tool call arguments were not valid JSON (${parseErrorMessage}). Re-issue the call with arguments as a single well-formed JSON object.${markupHint}`);
  }
  const parsedArgs = schema2.safeParse(parsedJson);
  if (!parsedArgs.success) {
    const errorMessages = parsedArgs.error.errors.map((err) => {
      const path30 = err.path.length > 0 ? err.path.join(".") : "argument";
      return `${path30}: ${err.message}`;
    });
    throw new ToolCallArgParseError(`Invalid arguments:
${errorMessages.join("\n")}`, options2?.classifyParseFailure?.(parsedArgs.error.errors), parsedArgs.error.errors);
  }
  return parsedArgs.data;
}
var withSafeParsedArgs = (parametersSchema29, execute, initialToolCall, options2) => {
  return async (ctx, interactionHandler, argsStream, meta) => {
    const env_2 = { stack: [], error: void 0, hasError: false };
    try {
      const initialPartialEmit = options2?.emitInitialPartialToolCall === false ? void 0 : interactionHandler.emitPartialToolCall(ctx, meta.toolCallId, initialToolCall);
      let args = "";
      let parsedArgs;
      try {
        for await (const chunk of argsStream) {
          args += chunk;
        }
        const toolName2 = initialToolCall.tool?.case ?? "unknown";
        args = stripDsv3TokensFromArgs({
          ctx,
          args,
          toolName: toolName2,
          isDsv3Model: isDsv3FromMeta(meta)
        });
        const resolvedSchema = typeof parametersSchema29 === "function" ? parametersSchema29(meta) : parametersSchema29;
        parsedArgs = parseJsonArgsWithZodSchema(args, resolvedSchema, {
          classifyParseFailure: options2?.classifyParseFailure,
          modelVendor: meta.modelVendor
        });
      } catch (error3) {
        const toolName2 = initialToolCall.tool?.case ?? "unknown";
        toolArgsParseSuccessRate.histogram(ctx, 0, { tool_name: toolName2 });
        if (error3 instanceof ToolCallArgParseError) {
          throw error3;
        }
        const errorMessage4 = error3 instanceof Error ? error3.message : "Invalid arguments";
        throw new ToolCallArgParseError(errorMessage4);
      }
      const rawArgs = parsedArgs;
      const toolName = initialToolCall.tool?.case ?? "unknown";
      toolArgsParseSuccessRate.histogram(ctx, 1, { tool_name: toolName });
      const coreExecuteSpan = __addDisposableResource24(env_2, createSpan(ctx.withName("coreExecute")), false);
      const coreExecuteCtx = coreExecuteSpan.ctx;
      if (initialPartialEmit !== void 0) {
        await initialPartialEmit;
      }
      const result = await execute(coreExecuteCtx, interactionHandler, rawArgs, meta);
      return result;
    } catch (e_2) {
      env_2.error = e_2;
      env_2.hasError = true;
    } finally {
      __disposeResources24(env_2);
    }
  };
};
function resolveTerminalsFolder({ terminalsFolder, machineId }) {
  return typeof terminalsFolder === "function" ? terminalsFolder(machineId) : terminalsFolder;
}
var MACHINE_ID_DESCRIPTION = "Registered machine identifier.";
function machineIdSchema(machineIds, parameterSchema) {
  if (parameterSchema === "open") {
    return external_exports.string().describe(MACHINE_ID_DESCRIPTION);
  }
  const uniqueMachineIds = [...new Set(machineIds)];
  if (uniqueMachineIds.length === 0)
    return void 0;
  return external_exports.enum(uniqueMachineIds).describe(MACHINE_ID_DESCRIPTION);
}
function extendWithMachineId(schema2, machineId, required2) {
  if (machineId === void 0)
    return schema2;
  if (!(schema2 instanceof external_exports.ZodObject)) {
    throw new Error("Machine-aware tool parameters must use a Zod object");
  }
  return schema2.extend({
    machineId: required2 ? machineId : machineId.optional()
  });
}
function extendMachineIdParameter(schema2, machineIds, parameterSchema = "enumerated") {
  if (machineIds === void 0)
    return schema2;
  return extendWithMachineId(schema2, machineIdSchema(machineIds, parameterSchema), false);
}
function extendRequiredMachineIdParameter(schema2, machineIds, parameterSchema = "enumerated") {
  if (machineIds === void 0)
    return schema2;
  return extendWithMachineId(schema2, machineIdSchema(machineIds, parameterSchema), true);
}
function resolveMachineIdArgument(machineIds, args) {
  if (machineIds === void 0)
    return void 0;
  const uniqueMachineIds = [...new Set(machineIds)];
  if (uniqueMachineIds.length === 0) {
    throw new ToolCallUnexpectedEnvironmentError("No registered machines were available when this turn started. A connected machine can be used on the next turn.");
  }
  const machineId = args.machineId;
  return machineId;
}
var CODEX_PROMPT_VERSIONS = ["gpt5-codex", "codex-cloud"];
function isCodexPromptVersion(version3) {
  return CODEX_PROMPT_VERSIONS.includes(version3);
}
function createToolCallExecutionTimeoutError({ toolName, executionTimeoutMs }) {
  const message = buildToolCallExecutionTimedOutMessage({
    toolName,
    executionTimeoutMs
  });
  return new ToolTimeoutError({
    clientVisibleErrorMessage: message,
    modelVisibleErrorMessage: message,
    error: message
  });
}
var TOOL_CANCELLATION_WINDDOWN_MS = 5e3;
function wrapToolWithTimeout(tool, options2) {
  const timeoutMs = options2.timeoutMs;
  const onTimeout = options2.onTimeout;
  const createTimeoutError = options2.createTimeoutError ?? ((event) => new Error(`Tool ${event.tool.name} timed out after ${event.timeoutMs} ms`));
  const cancellationWinddownMs = options2.cancellationWinddownMs ?? TOOL_CANCELLATION_WINDDOWN_MS;
  return {
    ...tool,
    execute: async (parentCtx, interactionHandler, argsStream, meta) => {
      const parentSuspension = parentCtx.get(toolExecutionTimeoutSuspensionKey);
      const [execCtx, cancelExec] = parentCtx.withCancel();
      let finished = false;
      let remainingMs = timeoutMs;
      let armedAtMs;
      let timer2;
      let suspendCount = 0;
      const arm = () => {
        if (finished || suspendCount > 0 || timer2 !== void 0) {
          return;
        }
        armedAtMs = Date.now();
        timer2 = setTimeout(() => {
          timer2 = void 0;
          armedAtMs = void 0;
          cancelExec(new Error("context deadline exceeded"));
        }, remainingMs);
      };
      const disarm = () => {
        if (timer2 !== void 0) {
          clearTimeout(timer2);
          timer2 = void 0;
        }
        if (armedAtMs !== void 0) {
          remainingMs = Math.max(0, remainingMs - (Date.now() - armedAtMs));
          armedAtMs = void 0;
        }
      };
      const suspension = {
        suspend: () => {
          const resumeParent = parentSuspension?.suspend();
          suspendCount += 1;
          disarm();
          let resumed = false;
          return () => {
            if (resumed) {
              return;
            }
            resumed = true;
            suspendCount -= 1;
            arm();
            resumeParent?.();
          };
        }
      };
      const timeoutCtx = execCtx.with(toolExecutionTimeoutSuspensionKey, suspension);
      let winddownTimer;
      const timeoutPromise = new Promise((_2, reject2) => {
        execCtx.signal.addEventListener("abort", () => {
          if (finished) {
            return;
          }
          const rejectAsTimeout = () => {
            if (finished) {
              return;
            }
            const event = {
              ctx: parentCtx,
              tool,
              meta,
              timeoutMs
            };
            if (onTimeout !== void 0) {
              void Promise.resolve(onTimeout(event)).catch(() => {
              });
            }
            reject2(createTimeoutError(event));
          };
          if (!parentCtx.signal.aborted || cancellationWinddownMs === 0) {
            rejectAsTimeout();
            return;
          }
          winddownTimer = setTimeout(rejectAsTimeout, cancellationWinddownMs);
        }, { once: true });
      });
      arm();
      try {
        return await Promise.race([
          tool.execute(timeoutCtx, interactionHandler, argsStream, meta),
          timeoutPromise
        ]);
      } finally {
        finished = true;
        disarm();
        if (winddownTimer !== void 0) {
          clearTimeout(winddownTimer);
        }
        cancelExec();
      }
    }
  };
}

