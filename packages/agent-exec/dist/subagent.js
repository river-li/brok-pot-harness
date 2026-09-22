init_dist4();
init_subagent_exec_pb();
init_subagent_exec_pb();
init_subagents_pb();
var __awaiter34 = function(thisArg, _arguments, P2, generator) {
  function adopt(value) {
    return value instanceof P2 ? value : new P2(function(resolve29) {
      resolve29(value);
    });
  }
  return new (P2 || (P2 = Promise))(function(resolve29, reject2) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject2(e);
      }
    }
    function rejected3(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject2(e);
      }
    }
    function step(result) {
      result.done ? resolve29(result.value) : adopt(result.value).then(fulfilled, rejected3);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var RUNNING_SUBAGENT_FOLLOWUP_ERROR = "Sub-agent is currently running. You may send the follow-up message when it has completed.";
var pendingSubagentReplayKey = createKey(/* @__PURE__ */ Symbol("pendingSubagentReplay"), void 0);
var RUNNING_SUBAGENT_INTERRUPT_RETRY_HINT = "If you intended to interrupt this agent, you may retry with `interrupt` set to true";
var SubagentHostError = class extends Error {
  constructor(message, options2) {
    super(message);
    this.name = "SubagentHostError";
    this.agentId = options2 === null || options2 === void 0 ? void 0 : options2.agentId;
    this.cause = options2 === null || options2 === void 0 ? void 0 : options2.cause;
  }
};
function extractAgentIdFromError(error42) {
  if (error42 instanceof SubagentHostError && error42.agentId) {
    return error42.agentId;
  }
  if (!error42 || typeof error42 !== "object") {
    return void 0;
  }
  const record2 = error42;
  if (typeof record2.agentId === "string") {
    return record2.agentId;
  }
  return void 0;
}
function getInFlightKey(args) {
  var _a19, _b2;
  if (!args.toolCallId || !args.parentConversationId) {
    return void 0;
  }
  return [
    args.parentConversationId,
    args.toolCallId,
    (_a19 = args.resumeAgentId) !== null && _a19 !== void 0 ? _a19 : "",
    (_b2 = args.forkAgentId) !== null && _b2 !== void 0 ? _b2 : ""
  ].join("\0");
}
var MAX_COMPLETED_TOOL_CALL_RESULTS = 1e3;
function createSubagentExecutor(adapter) {
  const inFlightByToolCall = /* @__PURE__ */ new Map();
  const completedByToolCall = /* @__PURE__ */ new Map();
  function runExecute(ctx, args, options2) {
    return __awaiter34(this, void 0, void 0, function* () {
      var _a19, _b2, _c2, _d;
      let agentId;
      try {
        agentId = yield adapter.createOrResumeSession(ctx, args);
        const outcome = yield adapter.runSession(ctx, agentId, args, {
          execId: options2 === null || options2 === void 0 ? void 0 : options2.execId
        });
        if (outcome.status === "error") {
          return new SubagentResult({
            result: {
              case: "error",
              value: new SubagentError({
                agentId,
                error: outcome.error
              })
            }
          });
        }
        if (outcome.status === "aborted") {
          return new SubagentResult({
            result: {
              case: "error",
              value: new SubagentError({
                agentId,
                error: (_a19 = outcome.error) !== null && _a19 !== void 0 ? _a19 : "Subagent was aborted by the user"
              })
            }
          });
        }
        if (outcome.status === "background") {
          return new SubagentResult({
            result: {
              case: "success",
              value: new SubagentSuccess({
                agentId,
                finalMessage: outcome.finalMessage,
                toolCallCount: (_b2 = outcome.toolCallCount) !== null && _b2 !== void 0 ? _b2 : 0,
                backgroundReason: outcome.backgroundReason,
                transcriptPath: outcome.transcriptPath
              })
            }
          });
        }
        return new SubagentResult({
          result: {
            case: "success",
            value: new SubagentSuccess({
              agentId,
              finalMessage: outcome.finalMessage,
              toolCallCount: (_c2 = outcome.toolCallCount) !== null && _c2 !== void 0 ? _c2 : 0
            })
          }
        });
      } catch (error42) {
        if (agentId && adapter.releaseSession) {
          adapter.releaseSession(agentId);
        }
        if (error42 instanceof DeferredInteractionResponseError) {
          throw error42;
        }
        const errorMessage6 = error42 instanceof Error ? error42.message : String(error42);
        const errorAgentId = (_d = agentId !== null && agentId !== void 0 ? agentId : extractAgentIdFromError(error42)) !== null && _d !== void 0 ? _d : args.resumeAgentId;
        return new SubagentResult({
          result: {
            case: "error",
            value: new SubagentError(Object.assign(Object.assign({}, errorAgentId ? { agentId: errorAgentId } : {}), { error: errorMessage6 }))
          }
        });
      }
    });
  }
  return {
    execute(ctx, args, options2) {
      const key = getInFlightKey(args);
      if (key === void 0) {
        return runExecute(ctx, args, options2);
      }
      const completed = completedByToolCall.get(key);
      if (completed !== void 0) {
        return Promise.resolve(completed);
      }
      const existing = inFlightByToolCall.get(key);
      if (existing !== void 0) {
        return existing;
      }
      const promise2 = runExecute(ctx, args, options2).then((result) => {
        if (result.result.case === "success") {
          completedByToolCall.set(key, result);
          if (completedByToolCall.size > MAX_COMPLETED_TOOL_CALL_RESULTS) {
            completedByToolCall.delete(completedByToolCall.keys().next().value);
          }
        }
        return result;
      }).finally(() => {
        inFlightByToolCall.delete(key);
      });
      inFlightByToolCall.set(key, promise2);
      return promise2;
    }
  };
}
var subagentExecutorResource = createResource((execManager) => new ExecutorResource(execManager, createServerSerializer("subagentArgs"), createClientDeserializer("subagentResult")), (implementation, controlledExecManager) => {
  controlledExecManager.register(new SimpleControlledExecHandler(implementation, createServerDeserializer("subagentArgs"), createClientSerializer("subagentResult")));
});
