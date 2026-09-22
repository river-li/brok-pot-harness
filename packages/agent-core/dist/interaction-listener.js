var __awaiter22 = function(thisArg, _arguments, P2, generator) {
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
  return __awaiter22(this, void 0, void 0, function* () {
    var _a19;
    yield (_a19 = listener.flushPostTurnEndedWork) === null || _a19 === void 0 ? void 0 : _a19.call(listener, ctx);
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
    return __awaiter22(this, void 0, void 0, function* () {
    });
  }
  enqueuePostTurnEndedWork(work) {
    this.postTurnEndedWorkQueue.push(work);
  }
  flushPostTurnEndedWork(_ctx) {
    return __awaiter22(this, void 0, void 0, function* () {
      const work = this.postTurnEndedWorkQueue;
      this.postTurnEndedWorkQueue = [];
      yield Promise.all(work.map((fn) => __awaiter22(this, void 0, void 0, function* () {
        try {
          yield fn();
        } catch (_a19) {
        }
      })));
    });
  }
  query(_ctx, query) {
    return __awaiter22(this, void 0, void 0, function* () {
      var _a19;
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
          return Responses.generateImageApproved(query.id, (_a19 = query.query.value.args) === null || _a19 === void 0 ? void 0 : _a19.description);
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
