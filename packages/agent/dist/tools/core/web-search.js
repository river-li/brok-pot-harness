init_dist4();
init_agent_pb();
init_web_search_tool_pb();
init_dist3();
init_zod();
var __addDisposableResource36 = function(env, value, async) {
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
var __disposeResources36 = /* @__PURE__ */ (function(SuppressedError2) {
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
function createWebSearchToolCall(webSearchTool) {
  return new ToolCall({
    tool: {
      case: "webSearchToolCall",
      value: webSearchTool
    }
  });
}
function normalizeArgs(args) {
  return {
    searchTerm: args.search_term,
    explanation: args.explanation
  };
}
var API_REQUEST_FAILED_STATUS_REGEX = /\bAPI request failed:\s*(\d{3})\b/i;
function getErrorMessage3(error42) {
  if (error42 instanceof Error) {
    return error42.message;
  }
  if (typeof error42 === "object" && error42 !== null && "message" in error42 && typeof error42.message === "string") {
    return error42.message;
  }
  return void 0;
}
function parseProviderStatusFromMessage(message) {
  const match2 = API_REQUEST_FAILED_STATUS_REGEX.exec(message);
  if (!match2) {
    return void 0;
  }
  const parsed2 = Number(match2[1]);
  return Number.isFinite(parsed2) ? parsed2 : void 0;
}
function classifyWebSearchProviderError(error42) {
  const candidateMessages = [];
  const directMessage = getErrorMessage3(error42);
  if (directMessage !== void 0) {
    candidateMessages.push(directMessage);
  }
  const cause = typeof error42 === "object" && error42 !== null && "cause" in error42 ? error42.cause : void 0;
  const causeMessage = getErrorMessage3(cause);
  if (causeMessage !== void 0) {
    candidateMessages.push(causeMessage);
  }
  for (const message of candidateMessages) {
    const status = parseProviderStatusFromMessage(message);
    if (status === void 0) {
      continue;
    }
    if (status !== 429 && status < 500) {
      continue;
    }
    return new CustomToolCallError(ToolErrorClassification.PROVIDER_ERROR, {
      clientVisibleErrorMessage: "The web search provider returned an error; this may be temporary. Please try again.",
      modelVisibleErrorMessage: "The web search provider returned an error; this may be temporary. Please try again.",
      error: `${message}. provider_status=${status}`
    });
  }
  return void 0;
}
var exaParametersSchema = external_exports.preprocess((raw) => {
  if (raw === null || typeof raw !== "object" || Array.isArray(raw)) {
    return raw;
  }
  const input = raw;
  if (input.search_term === void 0) {
    const alias = typeof input.query === "string" ? input.query : typeof input.searchTerm === "string" ? input.searchTerm : void 0;
    if (alias !== void 0) {
      const { query, searchTerm, ...rest } = input;
      return { ...rest, search_term: alias };
    }
  }
  return input;
}, external_exports.object({
  search_term: external_exports.string().describe("The search term to look up on the web. Be specific and include relevant keywords for better results. For technical queries, include version numbers or dates if relevant."),
  explanation: external_exports.string().optional().describe("One sentence explanation as to why this tool is being used, and how it contributes to the goal.")
}).transform((data) => ({
  variant: "exa",
  search_term: data.search_term,
  explanation: data.explanation
})));
function getParametersSchema3(variant) {
  switch (variant) {
    case "exa":
      return exaParametersSchema;
    default: {
      const _exhaustive = variant;
      throw new Error(`Unhandled web search tool variant: ${_exhaustive}`);
    }
  }
}
function createHookInput(args) {
  return {
    search_term: args.search_term,
    explanation: args.explanation
  };
}
function applyUpdatedHookInput(args, input) {
  if (typeof input.search_term === "string") {
    args.search_term = input.search_term;
  }
  if (typeof input.explanation === "string") {
    args.explanation = input.explanation;
  }
}
function resultToString3(result) {
  switch (result.result.case) {
    case "success":
      return result.result.value.references.map((ref) => {
        const maybeUrl = ref.url !== void 0 && ref.url !== "" ? `
URL: ${ref.url}` : "";
        return `Title: ${ref.title}${maybeUrl}
Content: ${ref.chunk}
---
`;
      }).join("\n");
    case "error":
      return `Error: ${result.result.value.error}`;
    case "rejected":
      return result.result.value.reason ? `Web search rejected: ${result.result.value.reason}` : "The web search was rejected by the user.";
    case void 0:
      return "Unknown error";
    default: {
      const _exhaustive = result.result;
      throw new Error(`Unhandled result case: ${_exhaustive}`);
    }
  }
}
var NO_DISK_INLINE_CAP_CHARS = 3e4;
var WEB_SEARCH_MAX_FILE_SIZE = 1024 * 1024 * 5;
async function buildReferencesFromServiceResult(ctx, serviceResult, toolCallId, diskWriteCtx) {
  const references = [];
  const answer = serviceResult.answer !== void 0 && serviceResult.answer !== "" ? serviceResult.answer : void 0;
  if (answer !== void 0) {
    references.push({
      title: "Web search results",
      url: "",
      chunk: answer
    });
  }
  for (const doc of serviceResult.documents) {
    let chunk;
    if (diskWriteCtx !== void 0) {
      const docBytes = Buffer.byteLength(doc.text, "utf8");
      if (docBytes > AGENT_TOOLS_FILE_WRITE_THRESHOLD_BYTES) {
        const outputLocation = await writeToAgentToolsFile(ctx, diskWriteCtx.resourceAccessor.get(writeExecutorResource), {
          content: doc.text,
          projectDir: diskWriteCtx.projectFolder,
          osPlatform: diskWriteCtx.osPlatform,
          toolCallId,
          maxSize: WEB_SEARCH_MAX_FILE_SIZE
        });
        if (outputLocation) {
          chunk = describeOutputLocation(outputLocation, {
            leadText: "Full page text"
          }) + `
Use shell / grep / read_file on this path to inspect the page; no follow-up fetch is needed.`;
        }
      }
    }
    if (chunk === void 0) {
      if (answer !== void 0) {
        continue;
      }
      chunk = doc.text.slice(0, NO_DISK_INLINE_CAP_CHARS);
    }
    references.push({
      title: doc.title,
      url: doc.url,
      chunk
    });
  }
  return references;
}
function getToolName4(version3) {
  switch (version3) {
    case "dsv3-1018":
      return "web_search";
    case "cursor-0226":
    case "dsv3-1205":
    case "latest":
    case "gpt5-codex":
    case "codex-cloud":
    case "haiku":
      return "WebSearch";
    default: {
      const _exhaustive = version3;
      throw new Error(`Unhandled version: ${_exhaustive}`);
    }
  }
}
function getRequiredConversationStartedDate(conversationStartedDate) {
  if (conversationStartedDate === void 0) {
    throw new Error("conversationStartedDate is required for WebSearch prompts with year guidance");
  }
  return conversationStartedDate;
}
function getBaseDescription(version3, useMinimalHarness, conversationStartedDate) {
  if (useMinimalHarness) {
    return "Search the web for up-to-date information and return snippets and URLs. Prefer this over shell for web searches because shell egress is more restricted.";
  }
  switch (version3) {
    case "gpt5-codex":
    case "codex-cloud":
      return "Search web for real-time info on any topic; use for up-to-date facts not in training data, like current events or tech updates. Results include snippets and URLs.";
    case "cursor-0226":
      return "Search web for real-time info on any topic; use for up-to-date facts not in training data, like current events or tech updates. Results include snippets and URLs.";
    case "dsv3-1205":
    case "dsv3-1018":
      return "Search the web for real-time information about any topic. Use this tool when you need up-to-date information that might not be available in your training data, or when you need to verify current facts. The search results will include relevant snippets and URLs from web pages. This is particularly useful for questions about current events, technology updates, or any topic that requires recent information.";
    case "latest":
    case "haiku": {
      const yearGuidance = buildWebSearchYearGuidance(getRequiredConversationStartedDate(conversationStartedDate));
      return `Search the web for real-time information about any topic. Returns summarized information from search results and relevant URLs.

Use this tool when you need up-to-date information that might not be available or correct in your training data, or when you need to verify current facts.
This includes queries about:
- Libraries, frameworks, and tools whose APIs, best practices, or usage instructions are frequently updated. ("How do I run Postgres in a container?")
- Current events or technology news. ("Which AI model is best for coding?")
- Informational queries similar to what you might Google ("kubernetes operator for mysql")

${yearGuidance}`;
    }
    default: {
      const _exhaustive = version3;
      throw new Error(`Unhandled version: ${_exhaustive}`);
    }
  }
}
var createWebSearchTool = (webSearchService, promptVersion, options2) => {
  promptVersion = promptVersion ?? "latest";
  const variant = options2?.variant ?? "exa";
  const parametersSchema29 = getParametersSchema3(variant);
  const diskWriteCtx = options2?.projectFolder !== void 0 && options2?.resourceAccessor !== void 0 ? {
    projectFolder: options2.projectFolder,
    osPlatform: options2.osPlatform,
    resourceAccessor: options2.resourceAccessor
  } : void 0;
  const execute = async (parentCtx, interactionHandler, rawArgs, meta) => {
    const env_1 = { stack: [], error: void 0, hasError: false };
    try {
      const spanCtxt = __addDisposableResource36(env_1, createSpan(parentCtx.withName("webSearchExecute")), false);
      const executeCore = async (ctx, args) => {
        const normalized = normalizeArgs(args);
        const searchArgs = new WebSearchArgs({
          searchTerm: normalized.searchTerm,
          toolCallId: meta.toolCallId
        });
        const response = await queryWebSearch(interactionHandler.listener, ctx, searchArgs);
        if (response.result.case === "rejected") {
          throw new ToolCallRejectedError(response.result.value.reason || "User rejected the web search");
        }
        const baseToolCall = new WebSearchToolCall({
          args: searchArgs,
          result: void 0
        });
        return await interactionHandler.executeToolCall(ctx, createWebSearchToolCall(baseToolCall), meta.toolCallId, async (innerCtx) => {
          let serviceResult;
          try {
            serviceResult = await webSearchService(innerCtx, normalized);
          } catch (error42) {
            throw classifyWebSearchProviderError(error42) ?? error42;
          }
          const references = await buildReferencesFromServiceResult(innerCtx, serviceResult, meta.toolCallId, diskWriteCtx);
          return new WebSearchResult({
            result: {
              case: "success",
              value: new WebSearchSuccess({
                references
              })
            }
          });
        }, (result) => createWebSearchToolCall(new WebSearchToolCall({ ...baseToolCall, result })), meta.hookContextCollector);
      };
      const enableHookExec = Boolean(options2?.enableExecuteHookExec);
      if (options2?.resourceAccessor && enableHookExec) {
        const remoteHookOptions = {
          resourceAccessor: options2.resourceAccessor,
          enableExecuteHookExec: options2.enableExecuteHookExec,
          configuredSteps: options2.configuredSteps,
          model: options2.model,
          hookContextCollector: meta.hookContextCollector
        };
        const wrappedExecute = withRemoteHooks({
          executeFn: executeCore,
          config: {
            toolName: "WebSearch",
            createToolInput: createHookInput,
            applyUpdatedInput: applyUpdatedHookInput,
            createRejectedResult: (_args, reason) => new WebSearchResult({
              result: {
                case: "rejected",
                value: new WebSearchRejected({ reason })
              }
            }),
            createSuccessOutput: (_args, result) => {
              const references = result.result.case === "success" ? result.result.value.references.map((ref) => ({
                title: ref.title,
                url: ref.url,
                chunk: ref.chunk
              })) : [];
              return {
                status: "success",
                references_count: references.length,
                content: references
              };
            },
            getFailureInfo: (result) => {
              switch (result.result.case) {
                case "error":
                  return {
                    errorMessage: result.result.value.error,
                    failureType: "error"
                  };
                case "rejected":
                  return {
                    errorMessage: result.result.value.reason ?? "Web search rejected",
                    failureType: "permission_denied"
                  };
                case "success":
                case void 0:
                  return void 0;
                default: {
                  const _exhaustive = result.result;
                  throw new Error(`Unhandled result case: ${_exhaustive}`);
                }
              }
            }
          },
          requestContext: { toolCallId: meta.toolCallId },
          options: remoteHookOptions
        });
        return wrappedExecute(spanCtxt.ctx, rawArgs);
      }
      return executeCore(spanCtxt.ctx, rawArgs);
    } catch (e_1) {
      env_1.error = e_1;
      env_1.hasError = true;
    } finally {
      __disposeResources36(env_1);
    }
  };
  const render2 = async (_ctx, result, _props) => {
    return createStringResult(resultToString3(result));
  };
  const name17 = getToolName4(promptVersion);
  return createZodAgentTool("WEB_SEARCH", {
    name: name17,
    descriptionGenerator: () => {
      const base = getBaseDescription(promptVersion, options2?.useMinimalHarness ?? false, options2?.conversationStartedDate);
      return options2?.descriptionSuffix !== void 0 ? `${base}

${options2.descriptionSuffix}` : base;
    },
    parameters: parametersSchema29,
    execute: withSafeParsedArgs(parametersSchema29, execute, createWebSearchToolCall(new WebSearchToolCall())),
    render: render2,
    serializeError: (error42) => {
      if (error42 instanceof ToolCallRejectedError) {
        return createWebSearchToolCall(new WebSearchToolCall({
          result: new WebSearchResult({
            result: {
              case: "rejected",
              value: new WebSearchRejected({ reason: error42.message })
            }
          })
        }));
      }
      const errorMessage7 = error42 instanceof ToolCallError ? error42.clientVisibleErrorMessage : "An error occurred while searching the web";
      return createWebSearchToolCall(new WebSearchToolCall({
        result: new WebSearchResult({
          result: {
            case: "error",
            value: new WebSearchError({ error: errorMessage7 })
          }
        })
      }));
    }
  });
};
