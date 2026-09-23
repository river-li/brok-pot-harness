var __addDisposableResource14 = function(env, value, async) {
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
var __disposeResources14 = /* @__PURE__ */ (function(SuppressedError2) {
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
var logger14 = createLogger("local-exec:mcp");
async function writeMcpTextOutputToFile(textContent2, projectDir) {
  const agentToolsDir = import_node_path30.default.join(projectDir, AGENT_TOOLS_DIR);
  const filePath = import_node_path30.default.join(agentToolsDir, `${(0, import_node_crypto12.randomUUID)()}.txt`);
  await (0, import_promises18.mkdir)(import_node_path30.default.dirname(filePath), { recursive: true });
  const contentToWrite = textContent2.slice(0, MAX_OUTPUT_FILE_SIZE);
  const lineCount = contentToWrite.split("\n").length;
  const actualSize = Buffer.byteLength(contentToWrite, "utf8");
  await (0, import_promises18.writeFile)(filePath, contentToWrite, "utf8");
  return new OutputLocation({
    filePath,
    sizeBytes: BigInt(actualSize),
    lineCount: BigInt(lineCount)
  });
}
function createInlineTextContentItem(textContent2) {
  return new McpToolResultContentItem({
    content: {
      case: "text",
      value: new McpTextContent({ text: textContent2 })
    }
  });
}
function sanitizeServerName(name17) {
  const sanitized = name17.replace(/\s/g, "_").replace(/[^a-zA-Z0-9_.-]/g, "");
  const normalizedDots = sanitized.replace(/\.+/g, ".");
  if (normalizedDots === "." || normalizedDots === "..") {
    return normalizedDots.replace(/\./g, "_");
  }
  return normalizedDots.length === 0 ? "_" : normalizedDots;
}
async function runMcpPermissionGate(ctx, args, deps) {
  const blockReason = args.skipApproval ? false : await deps.permissionsService.shouldBlockMcp(ctx, args, deps.toolDef?.annotations);
  if (!blockReason) {
    return void 0;
  }
  const blockResult = await handleBlockReason(blockReason, {
    onNeedsApproval: async (_approvalReason, approvalDetails) => {
      if (approvalDetails.type !== "mcp") {
        return new McpResult({
          result: {
            case: "error",
            value: new McpError({
              error: `Invalid approval details type for MCP execution`
            })
          }
        });
      }
      const result = await deps.pendingDecisionProvider.requestApproval({
        type: OperationType.Mcp,
        details: {
          name: approvalDetails.name,
          toolName: approvalDetails.toolName,
          providerIdentifier: approvalDetails.providerIdentifier,
          source: deps.toolDef?.source,
          args: approvalDetails.args,
          reason: approvalDetails.reason ?? _approvalReason,
          canAllowlist: approvalDetails.canAllowlist,
          smartModeApprovalReason: approvalDetails.smartModeApprovalReason,
          smartModeApprovalRequestId: approvalDetails.smartModeApprovalRequestId
        },
        toolCallId: args.toolCallId
      });
      if (!result.approved) {
        return new McpResult({
          result: {
            case: "rejected",
            value: new McpRejected({
              reason: `User rejected MCP: ${args.name}${result.reason ? ` - ${result.reason}` : ""}`
            })
          }
        });
      }
      if (args.smartModeApprovalOnly) {
        return new McpResult({
          result: {
            case: "approved",
            value: new McpApproved()
          }
        });
      }
      return null;
    },
    onUserRejected: (reason) => {
      return new McpResult({
        result: {
          case: "error",
          value: new McpError({
            error: `User rejected MCP: ${args.name}${reason ? ` - ${reason}` : ""}`
          })
        }
      });
    },
    onPermissionDenied: (errorMessage5, metadata) => {
      const formattedError = `MCP tool execution blocked: ${args.name} - ${errorMessage5}`;
      return new McpResult({
        result: {
          case: "permissionDenied",
          value: new McpPermissionDenied({
            error: formattedError,
            isReadonly: metadata?.isReadonly ?? false
          })
        }
      });
    }
  });
  return blockResult ?? void 0;
}
var LocalMcpToolExecutor = class {
  constructor(toolSet, permissionsService, pendingDecisionProvider, projectDir, fileOutputThresholdBytes = MCP_TEXT_FILE_THRESHOLD_BYTES, elicitationFactory, ensureMcpServersLoaded) {
    this.toolSet = toolSet;
    this.permissionsService = permissionsService;
    this.pendingDecisionProvider = pendingDecisionProvider;
    this.projectDir = projectDir;
    this.fileOutputThresholdBytes = fileOutputThresholdBytes;
    this.elicitationFactory = elicitationFactory;
    this.ensureMcpServersLoaded = ensureMcpServersLoaded;
  }
  /**
   * Describes why a known MCP server currently exposes no tools, or undefined
   * when no client matches any of `identifiers`.
   */
  async describeDisconnectedServer(ctx, identifiers) {
    const wanted = new Set(identifiers.filter((identifier) => identifier !== ""));
    if (wanted.size === 0) {
      return void 0;
    }
    let clients;
    try {
      clients = await this.toolSet.getClients(ctx);
    } catch {
      return void 0;
    }
    const match2 = Object.entries(clients).find(([clientKey2, client2]) => wanted.has(clientKey2) || wanted.has(client2.serverName));
    if (match2 === void 0) {
      return void 0;
    }
    const [clientKey, client] = match2;
    let state;
    try {
      state = await client.getState(ctx);
    } catch {
      return void 0;
    }
    if (state.kind === "ready") {
      return void 0;
    }
    const reason = mcpServerUnavailableReason(mcpClientStateToServerStatus(state));
    if (reason === void 0) {
      return void 0;
    }
    const detail = state.kind === "error" && state.message ? ` (${state.message})` : "";
    return `MCP server "${clientKey}" has no callable tools right now. ${reason}${detail}`;
  }
  async execute(parentCtx, args) {
    const env_1 = { stack: [], error: void 0, hasError: false };
    try {
      const span = __addDisposableResource14(env_1, createSpan(parentCtx.withName("LocalMcpToolExecutor.execute")), false);
      const ctx = span.ctx;
      const serverIdentifier = args.serverIdentifier || args.providerIdentifier;
      await this.ensureMcpServersLoaded?.(ctx, [serverIdentifier]);
      const tools = await this.toolSet.getTools(ctx);
      const availableServers = Array.from(new Set(tools.map((tool) => tool.clientKey))).sort();
      const toolDef = tools.find((t) => t.clientKey === serverIdentifier && t.toolName === args.toolName);
      const gateResult = await runMcpPermissionGate(ctx, args, {
        permissionsService: this.permissionsService,
        pendingDecisionProvider: this.pendingDecisionProvider,
        toolDef
      });
      if (gateResult !== void 0) {
        return gateResult;
      }
      const toolSet = await this.toolSet.getToolSet(ctx);
      let result;
      try {
        result = await toolSet.execute(args.name, Object.fromEntries(Object.entries(args.args).map(([key, value]) => [key, value.toJson()])), args.toolCallId, this.elicitationFactory);
      } catch (error3) {
        let mappedError = error3;
        if (isMcpToolNotFoundError(mappedError) && args.providerIdentifier.length > 0 && !tools.some((tool) => tool.clientKey === args.providerIdentifier || tool.providerIdentifier === args.providerIdentifier)) {
          mappedError = new McpServerNotFoundError(args.providerIdentifier, availableServers);
        }
        if (mappedError instanceof McpServerNotFoundError) {
          const disconnected = await this.describeDisconnectedServer(ctx, [
            serverIdentifier,
            args.providerIdentifier
          ]);
          if (disconnected !== void 0) {
            return new McpResult({
              result: {
                case: "error",
                value: new McpError({ error: disconnected })
              }
            });
          }
          return new McpResult({
            result: {
              case: "serverNotFound",
              value: new McpServerNotFound({
                name: mappedError.serverName,
                availableServers: mappedError.availableServers
              })
            }
          });
        }
        if (isMcpToolNotFoundError(mappedError)) {
          return new McpResult({
            result: {
              case: "toolNotFound",
              value: new McpToolNotFound({
                name: mappedError.toolName,
                availableTools: mappedError.availableTools
              })
            }
          });
        }
        throw mappedError;
      }
      const contentItems = [];
      for (const item of result.content) {
        const itemType = item.type;
        if (itemType === "text") {
          const textItem = item;
          contentItems.push(createInlineTextContentItem(textItem.text));
        } else if (itemType === "resource") {
          const resourceItem = item;
          if (resourceItem.resource?.text) {
            contentItems.push(createInlineTextContentItem(resourceItem.resource.text));
          }
        } else if (itemType === "image") {
          const imageItem = item;
          const dataBytes = Buffer.from(imageItem.data, "base64");
          const resizedImage = await resizeImageBufferIfNeeded(dataBytes);
          contentItems.push(new McpToolResultContentItem({
            content: {
              case: "image",
              value: new McpImageContent({
                data: resizedImage.data,
                mimeType: resizedImage.mimeType
              })
            }
          }));
        } else if (itemType !== "image") {
          const textContent2 = extractTextFromNonTextContent(item);
          contentItems.push(createInlineTextContentItem(textContent2));
        }
      }
      const materializedContentItems = await materializeMcpTextOutput({
        contentItems,
        thresholdBytes: this.fileOutputThresholdBytes,
        write: (text2) => writeMcpTextOutputToFile(text2, this.projectDir)
      });
      if (materializedContentItems === void 0) {
        throw new Error("Failed to materialize MCP text output");
      }
      const structuredContentForProto = result.structuredContent && typeof result.structuredContent === "object" && !Array.isArray(result.structuredContent) ? Struct.fromJson(result.structuredContent) : void 0;
      const successValue = new McpSuccess({
        content: materializedContentItems,
        isError: result.isError,
        structuredContent: structuredContentForProto
      });
      return new McpResult({
        result: {
          case: "success",
          value: successValue
        }
      });
    } catch (e_1) {
      env_1.error = e_1;
      env_1.hasError = true;
    } finally {
      __disposeResources14(env_1);
    }
  }
};
