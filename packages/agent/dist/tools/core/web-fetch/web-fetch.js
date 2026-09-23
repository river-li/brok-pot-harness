var __addDisposableResource35 = function(env, value, async) {
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
var __disposeResources35 = /* @__PURE__ */ (function(SuppressedError2) {
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
var MAX_CONTENT_SIZE = 1e5;
function shouldSkipApproval(parsed2) {
  return parsed2.hostname === "cursor.com" && (parsed2.pathname === "/docs" || parsed2.pathname === "/docs.md" || parsed2.pathname === "/llms.txt" || parsed2.pathname.startsWith("/docs/"));
}
function getLocalNetworkRejectionMessage(parsed2) {
  const hostname3 = parsed2.hostname.toLowerCase();
  const hostDisplay = parsed2.port ? `${hostname3}:${parsed2.port}` : hostname3;
  if (hostname3 === "localhost" || hostname3.endsWith(".localhost")) {
    return `Cannot fetch from localhost (${hostDisplay}) because this tool runs from an isolated server.`;
  }
  if (isLoopbackIpHost(hostname3)) {
    return `Cannot fetch from localhost (${hostDisplay}) because this tool runs from an isolated server.`;
  }
  if (isPrivateIpHost(hostname3)) {
    return `Cannot fetch from private IP (${hostDisplay}) because this tool runs from an isolated server.`;
  }
  return void 0;
}
function truncateContent(content, maxSize) {
  if (content.length <= maxSize)
    return content;
  const truncatedPart = content.substring(maxSize);
  const linesTruncated = (truncatedPart.match(/\n/g) || []).length + 1;
  return content.substring(0, maxSize) + `

...[${linesTruncated} line${linesTruncated === 1 ? "" : "s"} truncated]`;
}
function isWebFetchError(result) {
  return "error" in result;
}
function createWebFetchToolCall(webFetchTool) {
  return new ToolCall({
    tool: {
      case: "webFetchToolCall",
      value: webFetchTool
    }
  });
}
var baseParametersSchema = external_exports.object({
  url: external_exports.string().describe("The URL to fetch. The content will be converted to a readable markdown format.")
});
var smartModeApprovalParametersSchema = external_exports.object({
  requestSmartModeApproval: external_exports.boolean().optional().describe("Set to true when immediately retrying the exact same fetch after Auto-review blocks it and you decide the user should approve it through the native approval card."),
  smartModeBlockReason: external_exports.string().optional().describe("Provide the exact block reason returned by Auto-review in the prior rejection. Required when requestSmartModeApproval is true so the approval card shows the original classifier reason without re-running the classifier.")
});
var SMART_MODE_WEB_FETCH_BLOCK_REASON = "Blocked by Auto-review";
var SMART_MODE_WEB_FETCH_CLASSIFIER_ERROR_REASON = SMART_MODE_CLASSIFIER_MANUAL_REVIEW_ERROR_REASON;
var SMART_MODE_WEB_FETCH_PARENT_REQUESTED_APPROVAL_FALLBACK_REASON = SMART_MODE_WEB_FETCH_CLASSIFIER_ERROR_REASON;
var SMART_MODE_WEB_FETCH_BLOCKED_AUTONOMOUS_REASON_SUFFIX = "\n\n<system_reminder>\nAuto-review blocked this autonomous tool call. Decide now between two paths: if a safer non-autonomous path satisfies the request, use it; otherwise, if this blocked fetch is still necessary and the user should approve it, immediately retry the exact same WebFetch call with requestSmartModeApproval set to true AND smartModeBlockReason set to the exact block reason text above. That retry is what shows the native approval card; stopping here leaves the user with no approval UI. Do not change the URL or use an escalated variant when retrying for approval.\n</system_reminder>";
function stripUndefinedValues2(obj) {
  return JSON.parse(JSON.stringify(obj));
}
function buildSmartModeWebFetchRiskTarget({ url: url2, parsedUrl, projectPermissions }) {
  return new SmartModeRiskTarget({
    action: "web_fetch",
    arguments: Struct.fromJson(stripUndefinedValues2({
      url: url2,
      normalized_url: parsedUrl.href,
      protocol: parsedUrl.protocol,
      hostname: parsedUrl.hostname,
      pathname: parsedUrl.pathname,
      search: parsedUrl.search.length > 0 ? parsedUrl.search : void 0,
      hash: parsedUrl.hash.length > 0 ? parsedUrl.hash : void 0,
      origin: parsedUrl.origin,
      project_permissions: projectPermissions
    }))
  });
}
async function loadSmartModeWebFetchProjectPermissions(ctx, args) {
  return await loadSmartModeProjectPermissionsContext(ctx, args.workspacePaths, args.userAutoRunInstructions, args.projectAutoRunInstructions);
}
function createSmartModeWebFetchBlockedAutonomousReason(reason) {
  return `${reason}${SMART_MODE_WEB_FETCH_BLOCKED_AUTONOMOUS_REASON_SUFFIX}`;
}
function formatSmartModeWebFetchClassifierErrorReason() {
  return SMART_MODE_WEB_FETCH_CLASSIFIER_ERROR_REASON;
}
async function getSmartModeWebFetchPreflightDecision(ctx, args) {
  const devBlockConsumed = args.enabled && args.devSmartModeClassifierBlockState?.consume() === true;
  if (!args.enabled && !args.shadowEnabled) {
    return { kind: "allow" };
  }
  if (devBlockConsumed) {
    await delayDevSmartModeClassifierIfRequested(args.devSmartModeClassifierDelayState);
    return { kind: "block", reason: DEV_SMART_MODE_CLASSIFIER_BLOCK_REASON };
  }
  if (!args.enabled) {
    runShadowSmartModeWebFetchPreflight(ctx, args);
    return { kind: "allow" };
  }
  try {
    const executor = args.resourceAccessor.get(smartModeClassifierExecutorResource);
    const conversationContext = args.stateHandler === void 0 ? [] : await tryExtractSmartModeClassifierConversationContext(ctx, args.stateHandler);
    const projectPermissions = await loadSmartModeWebFetchProjectPermissions(ctx, args);
    await delayDevSmartModeClassifierIfRequested(args.devSmartModeClassifierDelayState);
    const result = await executeSmartModeClassifierWithMeasurement(ctx, executor, new SmartModeClassifierArgs({
      toolCallId: args.toolCallId,
      parentConversationId: getConversationId(ctx),
      target: buildSmartModeWebFetchRiskTarget({
        ...args,
        projectPermissions
      }),
      conversationContext
    }), "enforce", args.workspacePaths, { maxAttempts: args.classifierMaxAttempts });
    if (result.result.case === "success" && result.result.value.decision === SmartModeClassifierDecision.BLOCK) {
      return {
        kind: "block",
        reason: result.result.value.blockReason ?? SMART_MODE_WEB_FETCH_BLOCK_REASON
      };
    }
    if (result.result.case !== "success" || result.result.value.decision !== SmartModeClassifierDecision.ALLOW) {
      return {
        kind: "reject",
        reason: formatSmartModeWebFetchClassifierErrorReason()
      };
    }
  } catch (error42) {
    if (error42 instanceof Error && error42.name === "AbortError") {
      throw error42;
    }
    return {
      kind: "reject",
      reason: SMART_MODE_WEB_FETCH_CLASSIFIER_ERROR_REASON
    };
  }
  return { kind: "allow" };
}
function runShadowSmartModeWebFetchPreflight(ctx, args) {
  void (async () => {
    try {
      const executor = args.resourceAccessor.get(smartModeClassifierExecutorResource);
      const conversationContext = args.stateHandler === void 0 ? [] : await tryExtractSmartModeClassifierConversationContext(ctx, args.stateHandler);
      const projectPermissions = await loadSmartModeWebFetchProjectPermissions(ctx, args);
      await delayDevSmartModeClassifierIfRequested(args.devSmartModeClassifierDelayState);
      await executeSmartModeClassifierWithMeasurement(ctx, executor, new SmartModeClassifierArgs({
        toolCallId: args.toolCallId,
        parentConversationId: getConversationId(ctx),
        target: buildSmartModeWebFetchRiskTarget({
          ...args,
          projectPermissions
        }),
        conversationContext
      }), "shadow", args.workspacePaths);
    } catch {
    }
  })();
}
function getSmartModeBlockReasonFromArgs2(rawArgs) {
  const raw = rawArgs.smartModeBlockReason;
  if (typeof raw !== "string") {
    return void 0;
  }
  const trimmed = raw.trim();
  return trimmed.length > 0 ? trimmed : void 0;
}
function getToolName3(version3) {
  switch (version3) {
    case "cursor-0226":
    case "latest":
    case "gpt5-codex":
    case "codex-cloud":
    case "haiku":
      return "WebFetch";
    case "dsv3-1205":
    case "dsv3-1018":
      return "mcp_web_fetch";
    default: {
      const _exhaustive = version3;
      throw new Error(`Unhandled version: ${_exhaustive}`);
    }
  }
}
function buildFetchToolDescription(allTools) {
  const shellToolName = allTools["SHELL"]?.name;
  const shellLine = shellToolName ? `- For static assets and non-webpage URLs, use the \`${shellToolName}\` tool instead.` : "";
  return `Fetch content from a specified URL and return its contents in a readable markdown format. Use this tool when you need to retrieve and analyze webpage content.

- The URL must be a fully-formed, valid URL.
- This tool is read-only and will not work for requests intended to have side effects.
- This fetch tries to return live results but may return previously cached content.
- Authentication is not supported, and an error will be returned if the URL requires authentication.
- If the URL is returning a non-200 status code, e.g. 404, the tool will not return the content and will instead return an error message.
- This fetch runs from an isolated server. Hosts like localhost or private IPs will not work.
- This tool does not support fetching binary content, e.g. media or PDFs.${shellLine ? `
${shellLine}` : ""}
`;
}
function getDescription3(version3, allTools, useMinimalHarness = false) {
  if (useMinimalHarness) {
    return "Fetch content from a URL and return it as readable markdown. Prefer this over shell for web content because shell egress is more restricted.";
  }
  if (version3 === "cursor-0226") {
    return "Fetch content from a specified URL and return its contents in a readable markdown format. Use this tool when you need to retrieve and analyze web content.";
  }
  const desc = buildFetchToolDescription(allTools);
  if (version3 === "dsv3-1018" || version3 === "dsv3-1205") {
    return `${desc}

Prefer this tool over any mcp_cursor-* tools when fetching URL content.`;
  }
  return desc;
}
function stripCredentialsFromArgs(args, enabled) {
  if (enabled !== true) {
    return args;
  }
  try {
    const parsed2 = new URL(args.url);
    if (parsed2.username === "" && parsed2.password === "") {
      return args;
    }
    parsed2.username = "";
    parsed2.password = "";
    return { ...args, url: parsed2.toString() };
  } catch {
    return args;
  }
}
var createWebFetchTool = (webFetchService, promptVersion, options2) => {
  promptVersion = promptVersion ?? "latest";
  const projectFolder = options2?.projectFolder;
  const osPlatform = options2?.osPlatform;
  const resourceAccessor = options2?.resourceAccessor;
  const smartModeApprovalRequestParametersEnabled = options2?.agentType !== AgentType.BACKGROUND && options2?.smartModeClassifierMode === true;
  const parametersSchema29 = smartModeApprovalRequestParametersEnabled ? baseParametersSchema.extend(smartModeApprovalParametersSchema.shape) : baseParametersSchema;
  const execute = async (parentCtx, interactionHandler, rawArgs, meta) => {
    const env_1 = { stack: [], error: void 0, hasError: false };
    try {
      const spanCtxt = __addDisposableResource35(env_1, createSpan(parentCtx.withName("webFetchExecute")), false);
      const executeCore = async (ctx, args) => {
        let parsed2;
        try {
          parsed2 = new URL(args.url);
        } catch {
          throw new ToolCallArgParseError("Invalid URL: must include http:// or https://");
        }
        if (parsed2.protocol !== "http:" && parsed2.protocol !== "https:") {
          throw new ToolCallArgParseError(`Invalid URL protocol: ${parsed2.protocol} (must be http or https)`);
        }
        if (options2?.stripCredentialedUrls === true && (parsed2.username !== "" || parsed2.password !== "")) {
          parsed2.username = "";
          parsed2.password = "";
          args.url = parsed2.toString();
        }
        const localRejection = getLocalNetworkRejectionMessage(parsed2);
        if (localRejection) {
          throw new ToolCallArgParseError(localRejection);
        }
        const fetchArgs = new WebFetchArgs({
          url: args.url,
          toolCallId: meta.toolCallId
        });
        let smartModeClassifierAllowed = false;
        const enforceSmartModePreflight = async (preflightCtx) => {
          if (resourceAccessor === void 0) {
            return void 0;
          }
          const smartModeClassifierState = getSmartModeClassifierRuntimeState({
            agentType: options2?.agentType,
            requestContext: options2?.requestContext,
            smartModeClassifierMode: options2?.smartModeClassifierMode,
            smartModeClassifierShadowMode: options2?.smartModeClassifierShadowMode,
            devBlockState: options2?.devSmartModeClassifierBlockState,
            devDelayState: options2?.devSmartModeClassifierDelayState
          });
          const smartModeClassifierEnabled = smartModeClassifierState.enabled;
          const smartModeClassifierShadowEnabled = smartModeClassifierState.shadowEnabled;
          const devSmartModeClassifierBlockState = smartModeClassifierState.devBlockState;
          const devSmartModeClassifierDelayState = smartModeClassifierState.devDelayState;
          if (args.requestSmartModeApproval === true && smartModeClassifierEnabled) {
            const parentBlockReason = getSmartModeBlockReasonFromArgs2(args) ?? SMART_MODE_WEB_FETCH_PARENT_REQUESTED_APPROVAL_FALLBACK_REASON;
            return new SmartModeApproval({
              requestId: (0, import_node_crypto36.randomUUID)(),
              reason: parentBlockReason
            });
          }
          if (args.requestSmartModeApproval !== true && (smartModeClassifierEnabled || smartModeClassifierShadowEnabled)) {
            const precheckExecutor = resourceAccessor.get(webFetchAllowlistPrecheckExecutorResource);
            if (precheckExecutor !== void 0) {
              try {
                const precheck = await precheckExecutor.execute(preflightCtx, new WebFetchAllowlistPrecheckArgs({
                  url: args.url,
                  toolCallId: meta.toolCallId
                }));
                if (precheck.allowlisted) {
                  return void 0;
                }
              } catch (error42) {
                if (error42 instanceof Error && error42.name === "AbortError") {
                  throw error42;
                }
                if (isAgentStreamStartTimeoutError(error42)) {
                  throw error42;
                }
              }
            }
          }
          const decision = await getSmartModeWebFetchPreflightDecision(preflightCtx, {
            resourceAccessor,
            enabled: smartModeClassifierEnabled,
            shadowEnabled: smartModeClassifierShadowEnabled,
            url: args.url,
            parsedUrl: parsed2,
            toolCallId: meta.toolCallId,
            stateHandler: meta.stateHandler,
            devSmartModeClassifierBlockState,
            devSmartModeClassifierDelayState,
            classifierMaxAttempts: options2?.smartModeClassifierMaxAttempts,
            workspacePaths: meta.workspacePaths,
            userAutoRunInstructions: meta.userAutoRunInstructions,
            projectAutoRunInstructions: meta.projectAutoRunInstructions
          });
          if (decision.kind === "allow") {
            smartModeClassifierAllowed = smartModeClassifierEnabled;
            return void 0;
          }
          if (decision.kind === "reject") {
            throw new ToolCallRejectedError(decision.reason);
          }
          throw new ToolCallRejectedError(createSmartModeWebFetchBlockedAutonomousReason(decision.reason));
        };
        const runPreflightAndQuery = async (preflightCtx) => {
          const smartModeApproval = await enforceSmartModePreflight(preflightCtx);
          const skipApproval = smartModeApproval === void 0 && (smartModeClassifierAllowed || shouldSkipApproval(parsed2));
          const response = await queryWebFetch(interactionHandler.listener, preflightCtx, fetchArgs, {
            skipApproval,
            smartModeApproval
          });
          if (response.result.case === "rejected") {
            throw new ToolCallRejectedError(response.result.value.reason || "User rejected the web fetch");
          }
        };
        const baseToolCall = new WebFetchToolCall({
          args: fetchArgs,
          result: void 0
        });
        return await interactionHandler.executeToolCall(ctx, createWebFetchToolCall(baseToolCall), meta.toolCallId, async (innerCtx) => {
          await runPreflightAndQuery(innerCtx);
          const fetchResult = await webFetchService(innerCtx, args.url);
          if (isWebFetchError(fetchResult)) {
            if (fetchResult.isTimeout) {
              throw new ToolTimeoutError({
                clientVisibleErrorMessage: fetchResult.error,
                modelVisibleErrorMessage: fetchResult.error,
                error: fetchResult.error
              });
            }
            return new WebFetchResult({
              result: {
                case: "error",
                value: new WebFetchError({
                  url: args.url,
                  error: fetchResult.error
                })
              }
            });
          }
          const contentBytes = Buffer.byteLength(fetchResult.content, "utf8");
          if (projectFolder && resourceAccessor && contentBytes > AGENT_TOOLS_FILE_WRITE_THRESHOLD_BYTES) {
            const outputLocation = await writeToAgentToolsFile(ctx, resourceAccessor.get(writeExecutorResource), {
              content: fetchResult.content,
              projectDir: projectFolder,
              osPlatform,
              toolCallId: meta.toolCallId
            });
            if (outputLocation) {
              return new WebFetchResult({
                result: {
                  case: "success",
                  value: new WebFetchSuccess({
                    url: args.url,
                    // The content is still included so that e.g. hooks can still access.
                    // Assumes that we do NOT render this to the model when outputLocation is set.
                    markdown: fetchResult.content,
                    outputLocation
                  })
                }
              });
            }
          }
          const markdown = truncateContent(fetchResult.content, MAX_CONTENT_SIZE);
          return new WebFetchResult({
            result: {
              case: "success",
              value: new WebFetchSuccess({
                url: args.url,
                markdown
              })
            }
          });
        }, (result) => createWebFetchToolCall(new WebFetchToolCall({ ...baseToolCall, result })), meta.hookContextCollector);
      };
      const enableHookExec = Boolean(options2?.enableExecuteHookExec);
      if (options2?.resourceAccessor && enableHookExec) {
        const hookOptions = {
          resourceAccessor: options2.resourceAccessor,
          enableExecuteHookExec: options2.enableExecuteHookExec,
          configuredSteps: options2.configuredSteps,
          model: options2.model,
          hookContextCollector: meta.hookContextCollector
        };
        const wrappedExecute = withRemoteHooks({
          executeFn: executeCore,
          config: {
            toolName: "WebFetch",
            createToolInput: (args) => ({
              url: args.url
            }),
            applyUpdatedInput: (args, input) => {
              if (typeof input.url === "string") {
                args.url = input.url;
              }
            },
            createRejectedResult: (_args, reason) => new WebFetchResult({
              result: {
                case: "rejected",
                value: new WebFetchRejected({ reason })
              }
            }),
            createSuccessOutput: (args, result) => {
              const markdown = result.result.case === "success" ? result.result.value.markdown : "";
              const truncatedContent = truncateContent(markdown, MAX_CONTENT_SIZE);
              return {
                status: "success",
                url: args.url,
                content_length: markdown.length,
                content: truncatedContent
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
                    errorMessage: result.result.value.reason ?? "Web fetch rejected",
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
          options: hookOptions
        });
        return wrappedExecute(spanCtxt.ctx, stripCredentialsFromArgs(rawArgs, options2?.stripCredentialedUrls));
      }
      return executeCore(spanCtxt.ctx, stripCredentialsFromArgs(rawArgs, options2?.stripCredentialedUrls));
    } catch (e_1) {
      env_1.error = e_1;
      env_1.hasError = true;
    } finally {
      __disposeResources35(env_1);
    }
  };
  const render2 = async (_ctx, result, _props) => {
    switch (result.result.case) {
      case "success": {
        const successValue = result.result.value;
        if (successValue.outputLocation) {
          return createStringResult(`# Content from ${successValue.url}

` + describeOutputLocation(successValue.outputLocation));
        }
        const truncatedMarkdown = truncateContent(successValue.markdown, MAX_CONTENT_SIZE);
        return createStringResult(`# Content from ${successValue.url}

${truncatedMarkdown}`);
      }
      case "error": {
        const errorUrl = result.result.value.url;
        const errorMsg = result.result.value.error;
        if (errorUrl) {
          return createStringResult(`Error fetching URL ${errorUrl}: ${errorMsg}`);
        }
        return createStringResult(`Error: ${errorMsg}`);
      }
      case "rejected":
        return createStringResult(result.result.value.reason ? `Web fetch rejected: ${result.result.value.reason}` : "The web fetch was rejected by the user.");
      case void 0:
        return createStringResult("Unknown error");
      default: {
        const _exhaustive = result.result;
        throw new Error(`Unhandled result case: ${_exhaustive}`);
      }
    }
  };
  const name17 = getToolName3(promptVersion);
  return createZodAgentTool("WEB_FETCH", {
    name: name17,
    descriptionGenerator: (props) => {
      const base = getDescription3(promptVersion, props.allTools, options2?.useMinimalHarness ?? false);
      return options2?.descriptionSuffix !== void 0 ? `${base}

${options2.descriptionSuffix}` : base;
    },
    parameters: parametersSchema29,
    execute: withSafeParsedArgs(parametersSchema29, execute, createWebFetchToolCall(new WebFetchToolCall())),
    render: render2,
    serializeError: (error42) => {
      if (error42 instanceof ToolCallRejectedError) {
        return createWebFetchToolCall(new WebFetchToolCall({
          result: new WebFetchResult({
            result: {
              case: "rejected",
              value: new WebFetchRejected({ reason: error42.message })
            }
          })
        }));
      }
      const errorMessage7 = (() => {
        if (error42 instanceof ToolCallError) {
          return error42.clientVisibleErrorMessage;
        }
        if (error42 instanceof Error) {
          const msg = error42.message ?? "";
          const m2 = /http_(\d{3})/i.exec(msg) ?? /\bstatus(?:\s*code)?\s*[:=]?\s*(\d{3})\b/i.exec(msg) ?? /\bHTTP\/\d(?:\.\d)?\s+(\d{3})\b/i.exec(msg);
          if (m2?.[1]) {
            return `Error fetching URL, status code: ${Number(m2[1])}`;
          }
        }
        return "An error occurred while fetching the URL";
      })();
      return createWebFetchToolCall(new WebFetchToolCall({
        result: new WebFetchResult({
          result: {
            case: "error",
            value: new WebFetchError({
              error: errorMessage7
            })
          }
        })
      }));
    }
  });
};
