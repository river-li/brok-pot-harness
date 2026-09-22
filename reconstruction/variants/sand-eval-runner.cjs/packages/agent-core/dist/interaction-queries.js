/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent-core/dist/interaction-queries.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_generate_image_tool_pb();
var __awaiter16 = function(thisArg, _arguments, P2, generator) {
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
var DeferredInteractionResponseError = class extends Error {
  constructor(query) {
    var _a20;
    super(`Deferred interaction response requested for query ${query.id} (${(_a20 = query.query.case) !== null && _a20 !== void 0 ? _a20 : "unknown"})`);
    this.query = query;
    this.name = "DeferredInteractionResponseError";
    Object.setPrototypeOf(this, new.target.prototype);
  }
};
function queryWebSearch(listener, ctx, args) {
  return __awaiter16(this, void 0, void 0, function* () {
    const resp = yield listener.query(ctx, new InteractionQuery({
      query: {
        case: "webSearchRequestQuery",
        value: new WebSearchRequestQuery({ args })
      }
    }));
    if (resp.result.case !== "webSearchRequestResponse" || !resp.result.value) {
      throw new Error(`Unexpected response for web search query: ${resp.result.case}`);
    }
    return resp.result.value;
  });
}
function queryWebFetch(listener, ctx, args, options2) {
  return __awaiter16(this, void 0, void 0, function* () {
    var _a20;
    const queryOptions = typeof options2 === "boolean" ? { skipApproval: options2 } : options2 !== null && options2 !== void 0 ? options2 : {};
    const resp = yield listener.query(ctx, new InteractionQuery({
      query: {
        case: "webFetchRequestQuery",
        value: new WebFetchRequestQuery({
          args,
          skipApproval: (_a20 = queryOptions.skipApproval) !== null && _a20 !== void 0 ? _a20 : false,
          smartModeApproval: queryOptions.smartModeApproval
        })
      }
    }));
    if (resp.result.case !== "webFetchRequestResponse" || !resp.result.value) {
      throw new Error(`Unexpected response for web fetch query: ${resp.result.case}`);
    }
    return resp.result.value;
  });
}
function queryMcpAuth(listener, ctx, args) {
  return __awaiter16(this, void 0, void 0, function* () {
    const resp = yield listener.query(ctx, new InteractionQuery({
      query: {
        case: "mcpAuthRequestQuery",
        value: new McpAuthRequestQuery({ args })
      }
    }));
    if (resp.result.case !== "mcpAuthRequestResponse" || !resp.result.value) {
      throw new Error(`Unexpected response for MCP auth query: ${resp.result.case}`);
    }
    return resp.result.value;
  });
}
var Responses = {
  // -- Web Search --
  webSearchApproved(queryId) {
    return new InteractionResponse({
      id: queryId,
      result: {
        case: "webSearchRequestResponse",
        value: new WebSearchRequestResponse({
          result: {
            case: "approved",
            value: new WebSearchRequestResponse_Approved()
          }
        })
      }
    });
  },
  webSearchRejected(queryId, reason) {
    return new InteractionResponse({
      id: queryId,
      result: {
        case: "webSearchRequestResponse",
        value: new WebSearchRequestResponse({
          result: {
            case: "rejected",
            value: new WebSearchRequestResponse_Rejected({
              reason: reason !== null && reason !== void 0 ? reason : ""
            })
          }
        })
      }
    });
  },
  // -- Web Fetch --
  webFetchApproved(queryId) {
    return new InteractionResponse({
      id: queryId,
      result: {
        case: "webFetchRequestResponse",
        value: new WebFetchRequestResponse({
          result: {
            case: "approved",
            value: new WebFetchRequestResponse_Approved()
          }
        })
      }
    });
  },
  webFetchRejected(queryId, reason) {
    return new InteractionResponse({
      id: queryId,
      result: {
        case: "webFetchRequestResponse",
        value: new WebFetchRequestResponse({
          result: {
            case: "rejected",
            value: new WebFetchRequestResponse_Rejected({
              reason: reason !== null && reason !== void 0 ? reason : ""
            })
          }
        })
      }
    });
  },
  // -- Ask Question --
  askQuestion(queryId, result) {
    return new InteractionResponse({
      id: queryId,
      result: {
        case: "askQuestionInteractionResponse",
        value: new AskQuestionInteractionResponse({ result })
      }
    });
  },
  // -- Switch Mode --
  switchModeApproved(queryId) {
    return new InteractionResponse({
      id: queryId,
      result: {
        case: "switchModeRequestResponse",
        value: new SwitchModeRequestResponse({
          result: {
            case: "approved",
            value: new SwitchModeRequestResponse_Approved()
          }
        })
      }
    });
  },
  switchModeRejected(queryId, reason) {
    return new InteractionResponse({
      id: queryId,
      result: {
        case: "switchModeRequestResponse",
        value: new SwitchModeRequestResponse({
          result: {
            case: "rejected",
            value: new SwitchModeRequestResponse_Rejected({
              reason: reason !== null && reason !== void 0 ? reason : ""
            })
          }
        })
      }
    });
  },
  // -- Create Plan --
  createPlan(queryId, result) {
    return new InteractionResponse({
      id: queryId,
      result: {
        case: "createPlanRequestResponse",
        value: new CreatePlanRequestResponse({ result })
      }
    });
  },
  // -- Setup VM Environment --
  setupVmEnvironment(queryId, result) {
    return new InteractionResponse({
      id: queryId,
      result: {
        case: "setupVmEnvironmentResult",
        value: result
      }
    });
  },
  replaceEnv(queryId, result) {
    return new InteractionResponse({
      id: queryId,
      result: {
        case: "replaceEnvResult",
        value: result
      }
    });
  },
  // -- PR Management --
  prManagement(queryId, result) {
    return new InteractionResponse({
      id: queryId,
      result: {
        case: "prManagementResult",
        value: result
      }
    });
  },
  // -- MCP Auth --
  mcpAuthApproved(queryId) {
    return new InteractionResponse({
      id: queryId,
      result: {
        case: "mcpAuthRequestResponse",
        value: new McpAuthRequestResponse({
          result: {
            case: "approved",
            value: new McpAuthRequestResponse_Approved()
          }
        })
      }
    });
  },
  mcpAuthRejected(queryId, reason) {
    return new InteractionResponse({
      id: queryId,
      result: {
        case: "mcpAuthRequestResponse",
        value: new McpAuthRequestResponse({
          result: {
            case: "rejected",
            value: new McpAuthRequestResponse_Rejected({
              reason: reason !== null && reason !== void 0 ? reason : "Authentication was rejected"
            })
          }
        })
      }
    });
  },
  // -- Connect SCM --
  connectScmApproved(queryId) {
    return new InteractionResponse({
      id: queryId,
      result: {
        case: "connectScmRequestResponse",
        value: new ConnectScmRequestResponse({
          result: {
            case: "approved",
            value: new ConnectScmRequestResponse_Approved()
          }
        })
      }
    });
  },
  connectScmRejected(queryId, reason) {
    return new InteractionResponse({
      id: queryId,
      result: {
        case: "connectScmRequestResponse",
        value: new ConnectScmRequestResponse({
          result: {
            case: "rejected",
            value: new ConnectScmRequestResponse_Rejected({
              reason: reason !== null && reason !== void 0 ? reason : "Connecting GitHub was skipped"
            })
          }
        })
      }
    });
  },
  connectScmFailed(queryId, error3) {
    return new InteractionResponse({
      id: queryId,
      result: {
        case: "connectScmRequestResponse",
        value: new ConnectScmRequestResponse({
          result: {
            case: "failed",
            value: new ConnectScmRequestResponse_Failed({
              error: error3 !== null && error3 !== void 0 ? error3 : "Failed to connect GitHub"
            })
          }
        })
      }
    });
  },
  // -- Generate Image --
  generateImageApproved(queryId, description9) {
    return new InteractionResponse({
      id: queryId,
      result: {
        case: "generateImageRequestResponse",
        value: new GenerateImageRequestResponse({
          result: {
            case: "approved",
            value: new GenerateImageRequestResponse_Approved({
              description: description9 !== null && description9 !== void 0 ? description9 : ""
            })
          }
        })
      }
    });
  },
  generateImageRejected(queryId, reason) {
    return new InteractionResponse({
      id: queryId,
      result: {
        case: "generateImageRequestResponse",
        value: new GenerateImageRequestResponse({
          result: {
            case: "rejected",
            value: new GenerateImageRequestResponse_Rejected({
              reason: reason !== null && reason !== void 0 ? reason : ""
            })
          }
        })
      }
    });
  }
};

