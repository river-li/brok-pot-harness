var SAND_TOOL_MARKER2 = "__sand_tool__";
function encodeSandStep2(payload) {
  return JSON.stringify({ [SAND_TOOL_MARKER2]: true, ...payload });
}
function toolCallWrapper2(payload) {
  return new ToolCall({
    tool: {
      case: "communicateUpdateToolCall",
      value: new CommunicateUpdateToolCall({
        args: new CommunicateUpdateArgs({
          currentStep: encodeSandStep2(payload)
        })
      })
    }
  });
}
function makeRender() {
  return async (_ctx, output, _props) => {
    if (output.result.case === "error") {
      return createStringResult(`Error: ${output.result.value.error}`);
    }
    if (output.result.case !== "success") {
      return createStringResult("Tool completed.");
    }
    const raw = output.result.value.currentStep;
    if (raw.length === 0) {
      return createStringResult("Tool completed.");
    }
    return createStringResult(raw);
  };
}
function encodeError(activity, message) {
  return new CommunicateUpdateArgs({
    currentStep: encodeSandStep2({ ...activity, error: message })
  });
}
function encodeSuccess(activity, result) {
  return new CommunicateUpdateArgs({
    currentStep: encodeSandStep2({ ...activity, result })
  });
}
function buildSuccessResult(text2) {
  return new CommunicateUpdateResult({
    result: {
      case: "success",
      value: new CommunicateUpdateSuccess({ currentStep: text2 })
    }
  });
}
var DEFAULT_INFRASTRUCTURE_ERROR_MESSAGE = "Couldn't finish due to a temporary server issue.";
var INFRASTRUCTURE_ERROR_NAMES = /* @__PURE__ */ new Set([
  "PrismaClientKnownRequestError",
  "PrismaClientUnknownRequestError",
  "PrismaClientInitializationError",
  "PrismaClientRustPanicError",
  "DriverAdapterError",
  "DbUnavailableError"
]);
var VITESS_ERROR_MARKER = "vttablet: ";
var MAX_CAUSE_DEPTH = 4;
function isInfrastructureError(error42) {
  let current = error42;
  for (let depth = 0; depth <= MAX_CAUSE_DEPTH && current instanceof Error; depth += 1) {
    if (INFRASTRUCTURE_ERROR_NAMES.has(current.name) || INFRASTRUCTURE_ERROR_NAMES.has(current.constructor.name) || current.message.includes(VITESS_ERROR_MARKER)) {
      return true;
    }
    current = current.cause;
  }
  return false;
}
function classifyToolError(error42) {
  if (isInfrastructureError(error42)) return "infrastructure";
  if (error42 instanceof SandModelVisibleError || error42 instanceof ToolCallError) {
    return "model_visible";
  }
  return "unclassified";
}
var toolCallErrors = createCounter("grok_bot.tool_call.error", {
  description: "A Sand tool call threw, by tool, the thrown error's class, and whether the model sees its message: model_visible (a class written for the model), infrastructure (replaced with a fixed message), or unclassified (still shown today; the classes to convert before tool errors become allow-list only)",
  labelNames: ["tool", "visibility", "error_class"]
});
function errorClassLabel(error42) {
  if (!(error42 instanceof Error)) return typeof error42;
  const constructorName = error42.constructor.name;
  return constructorName.length > 0 && constructorName !== "Error" ? constructorName : error42.name;
}
function recordToolCallError(ctx, toolName, visibility, error42) {
  try {
    toolCallErrors.increment(ctx, 1, {
      tool: toolName,
      visibility,
      error_class: errorClassLabel(error42)
    });
  } catch (metricsError) {
    process.stderr.write(
      `sand.tool_call.error_metrics_failed error_class=${errorLogTag(metricsError)}
`
    );
  }
}
function modelVisibleErrorMessage(ctx, toolName, error42, infrastructureErrorMessage) {
  const visibility = classifyToolError(error42);
  if (ctx !== void 0) recordToolCallError(ctx, toolName, visibility, error42);
  return visibility === "infrastructure" ? infrastructureErrorMessage : errorMessage(error42);
}
function buildErrorResult(message) {
  return new CommunicateUpdateResult({
    result: {
      case: "error",
      value: new CommunicateUpdateError({ error: message })
    }
  });
}
var MAX_REPORTED_ARG_ISSUES = 8;
var ROOT_ISSUE_FIELD = "root";
var OTHER_ISSUE_TOKEN = "other";
var brandIssueCode = brandedEnumOf(Object.values(external_exports.ZodIssueCode), OTHER_ISSUE_TOKEN);
function topLevelArgKeysOf(schema2) {
  let current = schema2;
  while (current instanceof external_exports.ZodEffects) current = current.innerType();
  return current instanceof external_exports.ZodObject ? Object.keys(current.shape) : [];
}
function argIssueFolder(knownFields) {
  const brandField = brandedEnumOf([...knownFields, ROOT_ISSUE_FIELD], OTHER_ISSUE_TOKEN);
  const other = brandLiteralEnum(OTHER_ISSUE_TOKEN);
  return (issues) => issues.slice(0, MAX_REPORTED_ARG_ISSUES).map((issue2) => {
    const head = issue2.path[0];
    return {
      field: brandField(typeof head === "string" ? head : ROOT_ISSUE_FIELD) ?? other,
      code: brandIssueCode(issue2.code) ?? other,
      missing: issue2.code === external_exports.ZodIssueCode.invalid_type && issue2.received === "undefined"
    };
  });
}
function defineCommunicateTool(deps, spec) {
  const render2 = makeRender();
  const infrastructureErrorMessage = spec.infrastructureErrorMessage ?? DEFAULT_INFRASTRUCTURE_ERROR_MESSAGE;
  const parseAndExecute = withSafeParsedArgs(
    spec.parameters,
    async (ctx, interactionHandler, parsedArgs, meta) => {
      const activity = spec.describeActivity?.(parsedArgs);
      const toolActivity = {
        tool: spec.name,
        ...activity?.detail != null && activity.detail.length > 0 ? { detail: activity.detail } : {},
        ...activity?.target != null && activity.target.length > 0 ? { target: activity.target } : {}
      };
      const initial = toolCallWrapper2({
        phase: "executing",
        ...toolActivity
      });
      return await interactionHandler.executeToolCall(
        ctx,
        initial,
        meta.toolCallId,
        async () => {
          try {
            const text2 = await spec.execute(ctx, parsedArgs, {
              ...deps,
              toolCallId: meta.toolCallId
            });
            return buildSuccessResult(text2);
          } catch (error42) {
            if (error42 instanceof DeferredInteractionResponseError) {
              throw error42;
            }
            return buildErrorResult(
              modelVisibleErrorMessage(ctx, spec.name, error42, infrastructureErrorMessage)
            );
          }
        },
        (result) => {
          if (result.result.case === "error") {
            return new ToolCall({
              tool: {
                case: "communicateUpdateToolCall",
                value: new CommunicateUpdateToolCall({
                  args: encodeError(toolActivity, result.result.value.error || "Tool failed."),
                  result
                })
              }
            });
          }
          return new ToolCall({
            tool: {
              case: "communicateUpdateToolCall",
              value: new CommunicateUpdateToolCall({
                args: encodeSuccess(
                  toolActivity,
                  result.result.case === "success" ? result.result.value.currentStep : ""
                ),
                result
              })
            }
          });
        }
      );
    },
    toolCallWrapper2({ tool: spec.name }),
    { emitInitialPartialToolCall: false }
  );
  const execute = spec.onArgsRejected === void 0 ? parseAndExecute : observingArgsRejections(spec.onArgsRejected);
  function observingArgsRejections(onArgsRejected) {
    const schemaVariant = spec.schemaVariant ?? "default";
    const foldIssues = argIssueFolder([
      ...topLevelArgKeysOf(spec.parameters),
      ...spec.issueFields ?? []
    ]);
    return async (ctx, interactionHandler, argsStream, meta) => {
      try {
        return await parseAndExecute(ctx, interactionHandler, argsStream, meta);
      } catch (error42) {
        if (error42 instanceof ToolCallArgParseError) {
          const zodIssues = error42.issues ?? [];
          try {
            onArgsRejected({
              kind: "args_rejected",
              toolCallId: meta.toolCallId,
              toolName: spec.name,
              schemaVariant,
              rejection: error42.issues === void 0 ? "unparsed" : "schema",
              issueCount: zodIssues.length,
              issues: foldIssues(zodIssues),
              requestId: getRequestId(ctx)
            });
          } catch (observerError) {
            process.stderr.write(
              `sand.tool_call.args_rejected_observer_failed tool=${spec.name} error_class=${errorLogTag(observerError)}
`
            );
          }
        }
        throw error42;
      }
    };
  }
  return createZodAgentTool(spec.id, {
    name: spec.name,
    descriptionGenerator: () => typeof spec.description === "function" ? spec.description() : spec.description,
    parameters: spec.parameters,
    execute,
    render: render2,
    serializeError: (error42) => {
      const message = modelVisibleErrorMessage(
        void 0,
        spec.name,
        error42,
        infrastructureErrorMessage
      );
      return new ToolCall({
        tool: {
          case: "communicateUpdateToolCall",
          value: new CommunicateUpdateToolCall({
            args: encodeError({ tool: spec.name }, message),
            result: buildErrorResult(message)
          })
        }
      });
    }
  });
}
