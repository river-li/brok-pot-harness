/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent-exec/dist/subagent.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_dist();
init_subagents_pb();
var __awaiter18 = function(thisArg, _arguments, P2, generator) {
  function adopt(value) {
    return value instanceof P2 ? value : new P2(function(resolve14) {
      resolve14(value);
    });
  }
  return new (P2 || (P2 = Promise))(function(resolve14, reject2) {
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
      result.done ? resolve14(result.value) : adopt(result.value).then(fulfilled, rejected3);
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
function extractAgentIdFromError(error3) {
  if (error3 instanceof SubagentHostError && error3.agentId) {
    return error3.agentId;
  }
  if (!error3 || typeof error3 !== "object") {
    return void 0;
  }
  const record2 = error3;
  if (typeof record2.agentId === "string") {
    return record2.agentId;
  }
  return void 0;
}
function getInFlightKey(args) {
  var _a20, _b2;
  if (!args.toolCallId || !args.parentConversationId) {
    return void 0;
  }
  return [
    args.parentConversationId,
    args.toolCallId,
    (_a20 = args.resumeAgentId) !== null && _a20 !== void 0 ? _a20 : "",
    (_b2 = args.forkAgentId) !== null && _b2 !== void 0 ? _b2 : ""
  ].join("\0");
}
var MAX_COMPLETED_TOOL_CALL_RESULTS = 1e3;
function createSubagentExecutor(adapter) {
  const inFlightByToolCall = /* @__PURE__ */ new Map();
  const completedByToolCall = /* @__PURE__ */ new Map();
  function runExecute(ctx, args, options2) {
    return __awaiter18(this, void 0, void 0, function* () {
      var _a20, _b2, _c2, _d;
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
                error: (_a20 = outcome.error) !== null && _a20 !== void 0 ? _a20 : "Subagent was aborted by the user"
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
      } catch (error3) {
        if (agentId && adapter.releaseSession) {
          adapter.releaseSession(agentId);
        }
        if (error3 instanceof DeferredInteractionResponseError) {
          throw error3;
        }
        const errorMessage4 = error3 instanceof Error ? error3.message : String(error3);
        const errorAgentId = (_d = agentId !== null && agentId !== void 0 ? agentId : extractAgentIdFromError(error3)) !== null && _d !== void 0 ? _d : args.resumeAgentId;
        return new SubagentResult({
          result: {
            case: "error",
            value: new SubagentError(Object.assign(Object.assign({}, errorAgentId ? { agentId: errorAgentId } : {}), { error: errorMessage4 }))
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
      const promise = runExecute(ctx, args, options2).then((result) => {
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
      inFlightByToolCall.set(key, promise);
      return promise;
    }
  };
}
var subagentExecutorResource = createResource((execManager) => new ExecutorResource(execManager, createServerSerializer("subagentArgs"), createClientDeserializer("subagentResult")), (implementation, controlledExecManager) => {
  controlledExecManager.register(new SimpleControlledExecHandler(implementation, createServerDeserializer("subagentArgs"), createClientSerializer("subagentResult")));
});

