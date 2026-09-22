init_agent_pb();
init_communicate_update_tool_pb();
init_bounded();
init_errors();
init_zod();
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
            return buildErrorResult(errorMessage(error42));
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
      const message = errorMessage(error42);
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
