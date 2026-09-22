/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent-core/dist/interaction-listener.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var __awaiter17 = function(thisArg, _arguments, P2, generator) {
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
function createPrManagementNotAvailableResult() {
  return new PrManagementResult({
    result: {
      case: "error",
      value: new PrManagementError({
        error: "PR management is only available in cloud agents"
      })
    }
  });
}
function flushPostTurnEndedWork(ctx, listener) {
  return __awaiter17(this, void 0, void 0, function* () {
    var _a20;
    yield (_a20 = listener.flushPostTurnEndedWork) === null || _a20 === void 0 ? void 0 : _a20.call(listener, ctx);
  });
}
var InteractionListenerStreamClosedError = class extends Error {
  constructor(message, options2 = {}) {
    super(message);
    this.name = "InteractionListenerStreamClosedError";
    this.cause = options2.cause;
    Object.setPrototypeOf(this, new.target.prototype);
  }
};
var NoopInteractionListener = class {
  constructor() {
    this.postTurnEndedWorkQueue = [];
  }
  sendUpdate(_ctx, _update) {
    return __awaiter17(this, void 0, void 0, function* () {
    });
  }
  enqueuePostTurnEndedWork(work) {
    this.postTurnEndedWorkQueue.push(work);
  }
  flushPostTurnEndedWork(_ctx) {
    return __awaiter17(this, void 0, void 0, function* () {
      const work = this.postTurnEndedWorkQueue;
      this.postTurnEndedWorkQueue = [];
      yield Promise.all(work.map((fn) => __awaiter17(this, void 0, void 0, function* () {
        try {
          yield fn();
        } catch (_a20) {
        }
      })));
    });
  }
  query(_ctx, query) {
    return __awaiter17(this, void 0, void 0, function* () {
      var _a20;
      switch (query.query.case) {
        case "webSearchRequestQuery":
          return Responses.webSearchApproved(query.id);
        case "webFetchRequestQuery":
          return Responses.webFetchApproved(query.id);
        case "askQuestionInteractionQuery":
          return Responses.askQuestion(query.id, new AskQuestionResult({
            result: {
              case: "rejected",
              value: new AskQuestionRejected({
                reason: "Questions skipped by user (CLI fallback)"
              })
            }
          }));
        case "switchModeRequestQuery":
          return Responses.switchModeRejected(query.id, "Mode switching not supported in CLI");
        case "createPlanRequestQuery":
          return Responses.createPlan(query.id, new CreatePlanResult({
            result: {
              case: "success",
              value: new CreatePlanSuccess()
            }
          }));
        case "setupVmEnvironmentArgs":
          return Responses.setupVmEnvironment(query.id, new SetupVmEnvironmentResult({
            result: {
              case: "success",
              value: new SetupVmEnvironmentSuccess({})
            }
          }));
        case "replaceEnvArgs":
          return Responses.replaceEnv(query.id, new ReplaceEnvResult({
            result: {
              case: "failure",
              value: new ReplaceEnvFailure({
                errorMessage: "Environment replacement is not supported in this environment",
                setupLogs: ""
              })
            }
          }));
        case "prManagementRequestQuery":
          return Responses.prManagement(query.id, createPrManagementNotAvailableResult());
        case "mcpAuthRequestQuery":
          return Responses.mcpAuthRejected(query.id, "MCP authentication is not supported in this environment");
        case "connectScmRequestQuery":
          return Responses.connectScmRejected(query.id, "Connecting GitHub is not supported in this environment");
        case "generateImageRequestQuery":
          return Responses.generateImageApproved(query.id, (_a20 = query.query.value.args) === null || _a20 === void 0 ? void 0 : _a20.description);
        default: {
          if (query.query.case !== void 0) {
            const _exhaustiveCheck = query.query;
          }
          throw new Error(`Unhandled interaction query type`);
        }
      }
    });
  }
};

