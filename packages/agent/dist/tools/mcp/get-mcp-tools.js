init_dist3();
init_agent_pb();
init_get_mcp_tools_tool_pb();
init_mcp_exec_pb();
init_mcp_pb();
init_esm();
init_zod();
var __addDisposableResource37 = function(env, value, async) {
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
var __disposeResources37 = /* @__PURE__ */ (function(SuppressedError2) {
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
})(typeof SuppressedError === "function" ? SuppressedError : function(error41, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error41, e.suppressed = suppressed, e;
});
var DEFAULT_GET_MCP_TOOLS_NAME = "GetMcpTools";
var MCP_AUTH_TOOL_NAME2 = "mcp_auth";
var MAX_DESCRIPTION_LENGTH2 = 200;
var CONTROL_CHARACTERS_REGEX = /[\u0000-\u001F\u007F]/g;
var FILE_OUTPUT_THRESHOLD_BYTES = 12e3;
var MAX_REGEX_PATTERN_LENGTH = 256;
var MCP_AUTH_INPUT_SCHEMA = {
  type: "object",
  properties: {},
  additionalProperties: false
};
function toModelFacingServerPayload(payload, useDynamicToolNamespaces) {
  if (!useDynamicToolNamespaces) {
    return payload;
  }
  return {
    namespace: payload.server,
    namespaceStatus: payload.serverStatus,
    namespaceError: payload.serverError,
    namespaceDescription: payload.serverDescription,
    tools: payload.tools
  };
}
function toModelFacingSearchResult(payload, useDynamicToolNamespaces) {
  if (!useDynamicToolNamespaces) {
    return payload;
  }
  return {
    namespace: payload.server,
    tool: payload.tool,
    description: payload.description,
    namespaceStatus: payload.serverStatus,
    namespaceError: payload.serverError
  };
}
function toModelFacingSingleToolPayload(serverPayload, tool, useDynamicToolNamespaces) {
  return useDynamicToolNamespaces ? tool : {
    mode: "single_tool",
    server: serverPayload.server,
    serverStatus: serverPayload.serverStatus,
    serverDescription: serverPayload.serverDescription,
    tool
  };
}
function resolvedServerFromSnapshot(descriptor2, allowInteractiveMcpAuth) {
  const serverSupportsInteractiveMcpAuth = supportsInteractiveMcpAuth(descriptor2.serverIdentifier);
  if (allowInteractiveMcpAuth && serverSupportsInteractiveMcpAuth) {
    return { descriptor: descriptor2 };
  }
  const filtered = descriptor2.tools.filter((t) => t.toolName !== MCP_AUTH_TOOL_NAME2);
  if (filtered.length === descriptor2.tools.length) {
    return { descriptor: descriptor2 };
  }
  return {
    descriptor: new McpDescriptor({
      ...descriptor2,
      tools: filtered
    }),
    status: serverSupportsInteractiveMcpAuth && filtered.length === 0 ? "needsAuth" : void 0
  };
}
function getSnapshotMcpAuthTool(snapshotDescriptors, serverIdentifier) {
  const snapshotTool = snapshotDescriptors.find((descriptor2) => descriptor2.serverIdentifier === serverIdentifier)?.tools.find((tool) => tool.toolName === MCP_AUTH_TOOL_NAME2);
  if (snapshotTool !== void 0 && snapshotTool.description === void 0 && snapshotTool.inputSchema === void 0 && snapshotTool.inputSchemaJson === void 0) {
    return void 0;
  }
  return snapshotTool;
}
function sanitizeDescription(raw) {
  if (raw === void 0) {
    return void 0;
  }
  const sanitized = raw.replace(CONTROL_CHARACTERS_REGEX, " ").replace(/\s+/g, " ").trim();
  if (sanitized.length === 0) {
    return void 0;
  }
  return sanitized;
}
function sanitizeAndTruncateDescription(raw) {
  const sanitized = sanitizeDescription(raw);
  if (sanitized === void 0 || sanitized.length <= MAX_DESCRIPTION_LENGTH2) {
    return sanitized;
  }
  return `${sanitized.slice(0, MAX_DESCRIPTION_LENGTH2 - TRUNCATED_DESCRIPTION_SUFFIX.length)}${TRUNCATED_DESCRIPTION_SUFFIX}`;
}
function descriptorToToolPayload(tool, options2) {
  const schema2 = options2?.includeSchema === true ? mcpInputSchemaToJson(tool) : void 0;
  const detail = options2?.descriptionDetail ?? "short";
  const description10 = detail === "fullVerbatim" ? tool.description?.trim() || void 0 : detail === "full" ? sanitizeDescription(tool.description) : sanitizeAndTruncateDescription(tool.description);
  return {
    tool: tool.toolName,
    description: description10,
    ...options2?.includeSchema && schema2 !== void 0 ? { inputSchema: schema2 } : {}
  };
}
function descriptorsToToolPayloads(tools, options2) {
  return [...tools].map((tool) => descriptorToToolPayload(tool, options2)).sort((a, b2) => a.tool.localeCompare(b2.tool));
}
function statusFromDescriptor(descriptor2) {
  const toolNames = new Set(descriptor2.tools.map((tool) => tool.toolName));
  return toolNames.has(MCP_AUTH_TOOL_NAME2) && toolNames.size === 1 ? "needsAuth" : "ready";
}
function normalizeServerStatus(server) {
  if (isReservedDynamicToolsNamespace(server.descriptor.serverIdentifier)) {
    return void 0;
  }
  if (server.status === "connected") {
    return "ready";
  }
  if (server.status === void 0 || server.status === "") {
    if (server.hadMcpAuthBeforeFilter) {
      return "needsAuth";
    }
    return statusFromDescriptor(server.descriptor);
  }
  return server.status;
}
function serverErrorFromStatus(status) {
  return status === void 0 ? void 0 : mcpServerUnavailableReason(status);
}
function descriptorToServerMetadata(server, options2) {
  const serverStatus = normalizeServerStatus(server);
  const detail = options2?.descriptionDetail ?? "short";
  const rawInstructions = server.descriptor.serverUseInstructions;
  const serverDescription = detail === "fullVerbatim" ? rawInstructions?.trim() || void 0 : detail === "full" ? sanitizeDescription(rawInstructions) : sanitizeAndTruncateDescription(rawInstructions);
  return {
    server: server.descriptor.serverIdentifier,
    serverStatus,
    serverError: serverErrorFromStatus(serverStatus),
    serverDescription
  };
}
function descriptorToServerPayload(server, options2) {
  const { descriptor: descriptor2 } = server;
  const isDetailLookup = options2?.includeSchema === true;
  const descriptionDetail = isDetailLookup ? options2.trustedFirstParty === true ? "fullVerbatim" : "full" : "short";
  return {
    ...descriptorToServerMetadata(server, {
      descriptionDetail
    }),
    tools: descriptorsToToolPayloads(options2?.toolName === void 0 ? descriptor2.tools : descriptor2.tools.filter((tool) => tool.toolName === options2.toolName), {
      includeSchema: options2?.includeSchema,
      descriptionDetail
    })
  };
}
function mergeBuiltinToolsServer(servers, registry2) {
  if (registry2 === void 0) {
    return servers;
  }
  const withoutReserved = servers.filter((server) => !isReservedDynamicToolsNamespace(server.descriptor.serverIdentifier));
  const descriptor2 = registry2.getMcpDescriptor();
  if (descriptor2 === void 0) {
    return withoutReserved;
  }
  return [...withoutReserved, { descriptor: descriptor2 }];
}
function createToolCallProto2(args, result) {
  return new ToolCall({
    tool: {
      case: "getMcpToolsToolCall",
      value: new GetMcpToolsToolCall({
        args,
        result
      })
    }
  });
}
function createCallArgs(toolCallId, args) {
  return new GetMcpToolsArgs({
    server: args.server,
    toolName: args.toolName,
    pattern: args.pattern,
    toolCallId
  });
}
function createSuccessResult2(content, outputFilePath) {
  return new GetMcpToolsAgentResult({
    result: {
      case: "success",
      value: new GetMcpToolsSuccess({
        content,
        outputFilePath
      })
    }
  });
}
function createErrorResult(error41) {
  return new GetMcpToolsAgentResult({
    result: {
      case: "error",
      value: new GetMcpToolsError({ error: error41 })
    }
  });
}
async function renderResult(_ctx, result, _props) {
  if (result.result.case === "success") {
    return createStringResult(result.result.value.content);
  }
  if (result.result.case === "error") {
    return createStringResult(`Error: ${result.result.value.error}`);
  }
  return createStringResult("Unknown error");
}
async function resolveMcpServersForExecution(ctx, resourceAccessor, snapshotDescriptors, allowInteractiveMcpAuth, serverIdentifiers) {
  if (resourceAccessor === void 0) {
    return snapshotDescriptors.map((descriptor2) => resolvedServerFromSnapshot(descriptor2, allowInteractiveMcpAuth));
  }
  try {
    const mcpStateExecutor = resourceAccessor.get(mcpStateExecutorResource);
    const result = await mcpStateExecutor.execute(ctx, new McpStateExecArgs({
      serverIdentifiers
    }));
    if (result.result.case === "success") {
      return result.result.value.servers.map((server) => {
        const serverSupportsInteractiveMcpAuth = supportsInteractiveMcpAuth(server.serverIdentifier);
        const serverAllowsInteractiveMcpAuth = allowInteractiveMcpAuth && serverSupportsInteractiveMcpAuth;
        const snapshotMcpAuthTool = serverAllowsInteractiveMcpAuth ? getSnapshotMcpAuthTool(snapshotDescriptors, server.serverIdentifier) : void 0;
        const instructions = server.instructions.map((instruction) => instruction.instructions).filter(Boolean).join("\n");
        let tools = server.tools.map((tool) => new McpToolDescriptor({
          toolName: tool.toolName,
          description: tool.description,
          inputSchema: tool.inputSchema,
          inputSchemaJson: tool.inputSchemaJson
        }));
        const hadMcpAuth = tools.some((t) => t.toolName === MCP_AUTH_TOOL_NAME2);
        const hadOnlyMcpAuth = hadMcpAuth && tools.length === 1;
        if (!serverAllowsInteractiveMcpAuth) {
          tools = tools.filter((t) => t.toolName !== MCP_AUTH_TOOL_NAME2);
        }
        if (serverAllowsInteractiveMcpAuth && !tools.some((tool) => tool.toolName === MCP_AUTH_TOOL_NAME2)) {
          tools.push(snapshotMcpAuthTool ?? new McpToolDescriptor({
            toolName: MCP_AUTH_TOOL_NAME2,
            description: "Authenticate this MCP server so its tools can be used.",
            inputSchema: Value.fromJson(MCP_AUTH_INPUT_SCHEMA)
          }));
        }
        return {
          descriptor: new McpDescriptor({
            serverIdentifier: server.serverIdentifier,
            serverName: server.serverName,
            plugin: server.plugin,
            marketplace: server.marketplace,
            serverUseInstructions: instructions || void 0,
            tools
          }),
          status: server.status,
          hadMcpAuthBeforeFilter: !allowInteractiveMcpAuth && serverSupportsInteractiveMcpAuth && hadOnlyMcpAuth ? true : void 0
        };
      });
    }
  } catch {
  }
  return snapshotDescriptors.map((descriptor2) => resolvedServerFromSnapshot(descriptor2, allowInteractiveMcpAuth));
}
function validateArgs(args, useDynamicToolNamespaces) {
  if (args.toolName !== void 0 && args.server === void 0) {
    const containerName = useDynamicToolNamespaces ? "namespace" : "server";
    const message = `toolName requires ${containerName} to be set.`;
    throw new CustomToolCallError(ToolErrorClassification.INVALID_ARGS, {
      error: message,
      clientVisibleErrorMessage: message,
      modelVisibleErrorMessage: message
    });
  }
  if (args.pattern !== void 0 && args.pattern.length > MAX_REGEX_PATTERN_LENGTH) {
    const message = `pattern cannot exceed ${MAX_REGEX_PATTERN_LENGTH} characters.`;
    throw new CustomToolCallError(ToolErrorClassification.INVALID_ARGS, {
      error: message,
      clientVisibleErrorMessage: message,
      modelVisibleErrorMessage: message
    });
  }
}
function compileSearchRegex(pattern) {
  try {
    const compiled = RE2JS.compile(pattern);
    return {
      test(input) {
        return compiled.matcher(input).find();
      }
    };
  } catch (error41) {
    const message = error41 instanceof Error ? error41.message : String(error41);
    throw new CustomToolCallError(ToolErrorClassification.INVALID_ARGS, {
      error: `Invalid regex pattern: ${message}`,
      clientVisibleErrorMessage: `Invalid regex pattern: ${message}`,
      modelVisibleErrorMessage: `Invalid regex pattern: ${message}`
    });
  }
}
function serverNotFoundError(server, availableServers, useDynamicToolNamespaces) {
  const containerName = useDynamicToolNamespaces ? "namespace" : "MCP server";
  const availableName = useDynamicToolNamespaces ? "namespaces" : "servers";
  const msg = availableServers.length === 0 ? `${containerName} "${server}" not found.` : `${containerName} "${server}" not found. Available ${availableName}: ${availableServers.join(", ")}`;
  return new CustomToolCallError(ToolErrorClassification.UNEXPECTED_ENVIRONMENT, {
    error: msg,
    clientVisibleErrorMessage: msg,
    modelVisibleErrorMessage: msg
  });
}
async function maybeWriteToFile(ctx, writeExecutor, projectDir, toolCallId, payload) {
  const text2 = JSON.stringify(payload, null, 2);
  const contentBytes = Buffer.byteLength(text2, "utf8");
  if (writeExecutor && projectDir && contentBytes > FILE_OUTPUT_THRESHOLD_BYTES) {
    const outputLocation = await writeToAgentToolsFile(ctx, writeExecutor, {
      content: text2,
      projectDir,
      osPlatform: process.platform,
      toolCallId
    });
    if (outputLocation) {
      const lineCount = Number(outputLocation.lineCount);
      const sizeStr = contentBytes >= 1024 ? `${(contentBytes / 1024).toFixed(1)} KB` : `${contentBytes} bytes`;
      return {
        result: createSuccessResult2(JSON.stringify({
          note: `Large output has been written to: ${outputLocation.filePath} (${sizeStr}, ${lineCount} lines)`,
          filePath: outputLocation.filePath
        }, null, 2), outputLocation.filePath),
        payloadBytes: contentBytes,
        wroteToFile: true
      };
    }
  }
  return {
    result: createSuccessResult2(text2),
    payloadBytes: contentBytes,
    wroteToFile: false
  };
}
var createGetMcpToolsTool = (mcpMetaToolOptions, options2) => {
  const writeExecutor = options2?.resourceAccessor?.get(writeExecutorResource);
  const projectDir = options2?.projectDir;
  const useDynamicToolNamespaces = options2?.dynamicToolRegistry !== void 0;
  const getMcpToolsToolName = options2?.toolName ?? DEFAULT_GET_MCP_TOOLS_NAME;
  const snapshotDescriptors = mcpMetaToolOptions.mcpDescriptors;
  const allowInteractiveMcpAuth = options2?.allowInteractiveMcpAuth === true;
  const dynamicToolRegistry = options2?.dynamicToolRegistry;
  const omitBuiltinToolNamesFromDescription = options2?.omitBuiltinToolNamesFromDescription === true;
  const isMcpToolBlocked = options2?.isMcpToolBlocked;
  const dropBlockedTools = (servers, isBlocked) => {
    return servers.map((server) => {
      const filteredTools = server.descriptor.tools.filter((tool) => !isBlocked({
        serverIdentifier: server.descriptor.serverIdentifier,
        toolName: tool.toolName
      }));
      if (filteredTools.length === server.descriptor.tools.length) {
        return server;
      }
      return {
        ...server,
        descriptor: new McpDescriptor({
          ...server.descriptor,
          tools: filteredTools
        })
      };
    });
  };
  const serverField = external_exports.string().optional().describe("MCP server identifier to inspect.");
  const namespaceField = external_exports.string().optional().describe("Dynamic namespace to inspect, e.g. an MCP server.");
  const serverToolNameField = external_exports.string().optional().describe("Tool name within the server. Requires server to be set.");
  const namespaceToolNameField = external_exports.string().optional().describe("Tool name within the namespace. Requires namespace to be set.");
  const serverPatternField = external_exports.string().optional().describe(`RE2 regex pattern to search server and tool names (max ${MAX_REGEX_PATTERN_LENGTH} chars). Optionally combine with server to scope the search.`);
  const namespacePatternField = external_exports.string().optional().describe(`RE2 regex pattern to search namespace and tool names (max ${MAX_REGEX_PATTERN_LENGTH} chars). Optionally combine with namespace to scope the search.`);
  const serverParametersSchema = external_exports.object({
    server: serverField,
    toolName: serverToolNameField,
    pattern: serverPatternField
  });
  const namespaceParametersSchema = external_exports.object({
    namespace: namespaceField,
    toolName: namespaceToolNameField,
    pattern: namespacePatternField
  });
  const execute = async (parentCtx, interactionHandler, args, meta) => {
    const env_1 = { stack: [], error: void 0, hasError: false };
    try {
      const spanCtxt = __addDisposableResource37(env_1, createSpan(parentCtx.withName("getMcpToolsExecute")), false);
      const startTime = Date.now();
      const mode = getGetMcpToolsMode(args);
      const emitSuccessMetrics = (ctx, result, dims) => {
        const durationMs = Date.now() - startTime;
        const responseBytes = result.result.case === "success" ? Buffer.byteLength(result.result.value.content, "utf8") : 0;
        emitGetMcpToolsMetrics(ctx, {
          mode,
          durationMs,
          success: true,
          resultCount: dims.resultCount,
          responseBytes,
          payloadBytes: dims.payloadBytes,
          wroteToFile: dims.wroteToFile
        });
      };
      const emitErrorMetrics = (ctx, failureReason, error41) => {
        const durationMs = Date.now() - startTime;
        emitGetMcpToolsMetrics(ctx, {
          mode,
          durationMs,
          success: false,
          failureReason
        });
        if (error41 !== void 0) {
          reportMcpMetaToolFailure(ctx, error41, {
            tool: getMcpToolsToolName,
            failureReason,
            retryable: false,
            mode,
            durationMs
          });
        }
      };
      try {
        validateArgs(args, useDynamicToolNamespaces);
      } catch (error41) {
        emitErrorMetrics(spanCtxt.ctx, GET_MCP_TOOLS_FAILURE_REASONS.INVALID_ARGS, error41);
        throw error41;
      }
      const baseArgs = createCallArgs(meta.toolCallId, args);
      const baseToolCall = createToolCallProto2(baseArgs);
      return await interactionHandler.executeToolCall(spanCtxt.ctx, baseToolCall, meta.toolCallId, async (ctx) => {
        const restrictProjectWorkspace = await isProjectWorkspaceConversation(ctx, meta.stateHandler);
        const isBlocked = (tool2) => isMcpToolBlocked?.(tool2) === true || restrictProjectWorkspace && isProjectWorkspaceMutationMcpTool(tool2);
        const requestsBuiltinNamespace = args.server !== void 0 && dynamicToolRegistry !== void 0 && isReservedDynamicToolsNamespace(args.server);
        const resolvedServers = requestsBuiltinNamespace ? [] : dropBlockedTools(await resolveMcpServersForExecution(ctx, options2?.resourceAccessor, snapshotDescriptors, allowInteractiveMcpAuth, args.server !== void 0 ? [args.server] : []), isBlocked);
        const servers = mergeBuiltinToolsServer(resolvedServers, dynamicToolRegistry);
        if (args.pattern !== void 0 && args.toolName === void 0) {
          let regex;
          try {
            regex = compileSearchRegex(args.pattern);
          } catch (error41) {
            emitErrorMetrics(ctx, GET_MCP_TOOLS_FAILURE_REASONS.INVALID_REGEX, error41);
            throw error41;
          }
          let serversToSearch = servers;
          if (args.server !== void 0) {
            const resolvedServer2 = servers.find((server) => server.descriptor.serverIdentifier === args.server);
            if (resolvedServer2 === void 0) {
              const availableServers = servers.map((server) => server.descriptor.serverIdentifier).sort();
              const error41 = serverNotFoundError(args.server, availableServers, useDynamicToolNamespaces);
              emitErrorMetrics(ctx, GET_MCP_TOOLS_FAILURE_REASONS.SERVER_NOT_FOUND, error41);
              throw error41;
            }
            serversToSearch = [resolvedServer2];
          }
          const matches = [];
          for (const server of serversToSearch) {
            const descriptor2 = server.descriptor;
            const serverMetadata = descriptorToServerMetadata(server);
            const serverMatches = regex.test(descriptor2.serverIdentifier);
            const matchingTools = descriptor2.tools.filter((tool2) => serverMatches || regex.test(tool2.toolName));
            if (serverMatches) {
              matches.push({
                server: serverMetadata.server,
                description: serverMetadata.serverDescription,
                serverStatus: serverMetadata.serverStatus,
                serverError: serverMetadata.serverError
              });
            }
            for (const tool2 of matchingTools) {
              const row = {
                server: descriptor2.serverIdentifier,
                tool: tool2.toolName,
                description: sanitizeAndTruncateDescription(tool2.description)
              };
              if (serverMetadata.serverStatus !== void 0 && serverMetadata.serverStatus !== "ready" && !serverMatches) {
                row.serverStatus = serverMetadata.serverStatus;
                row.serverError = serverMetadata.serverError;
              }
              matches.push(row);
            }
          }
          matches.sort((a, b2) => a.server === b2.server ? (a.tool ?? "").localeCompare(b2.tool ?? "") : a.server.localeCompare(b2.server));
          const preparedResult = await maybeWriteToFile(ctx, writeExecutor, projectDir, meta.toolCallId, {
            mode: "search",
            pattern: args.pattern,
            matches: matches.map((match2) => toModelFacingSearchResult(match2, useDynamicToolNamespaces))
          });
          emitSuccessMetrics(ctx, preparedResult.result, {
            resultCount: matches.length,
            payloadBytes: preparedResult.payloadBytes,
            wroteToFile: preparedResult.wroteToFile
          });
          return preparedResult.result;
        }
        if (args.server === void 0) {
          const serverPayloads = [...servers].sort((a, b2) => a.descriptor.serverIdentifier.localeCompare(b2.descriptor.serverIdentifier)).map((server) => descriptorToServerPayload(server));
          const totalTools = serverPayloads.reduce((sum, s3) => sum + s3.tools.length, 0);
          const preparedResult = await maybeWriteToFile(ctx, writeExecutor, projectDir, meta.toolCallId, useDynamicToolNamespaces ? {
            mode: "catalog",
            namespaces: serverPayloads.map((payload) => toModelFacingServerPayload(payload, true))
          } : { mode: "catalog", servers: serverPayloads });
          emitSuccessMetrics(ctx, preparedResult.result, {
            resultCount: totalTools,
            payloadBytes: preparedResult.payloadBytes,
            wroteToFile: preparedResult.wroteToFile
          });
          return preparedResult.result;
        }
        const resolvedServer = servers.find((server) => server.descriptor.serverIdentifier === args.server);
        if (resolvedServer === void 0) {
          const availableServers = servers.map((server) => server.descriptor.serverIdentifier).sort();
          const error41 = serverNotFoundError(args.server, availableServers, useDynamicToolNamespaces);
          emitErrorMetrics(ctx, GET_MCP_TOOLS_FAILURE_REASONS.SERVER_NOT_FOUND, error41);
          throw error41;
        }
        const serverPayload = descriptorToServerPayload(resolvedServer, {
          includeSchema: true,
          trustedFirstParty: dynamicToolRegistry !== void 0 && isReservedDynamicToolsNamespace(args.server),
          toolName: args.toolName
        });
        if (args.toolName === void 0) {
          const preparedResult = await maybeWriteToFile(ctx, writeExecutor, projectDir, meta.toolCallId, useDynamicToolNamespaces ? {
            mode: "namespace",
            ...toModelFacingServerPayload(serverPayload, true)
          } : { mode: "server", ...serverPayload });
          emitSuccessMetrics(ctx, preparedResult.result, {
            resultCount: serverPayload.tools.length,
            payloadBytes: preparedResult.payloadBytes,
            wroteToFile: preparedResult.wroteToFile
          });
          return preparedResult.result;
        }
        const tool = serverPayload.tools.find((t) => t.tool === args.toolName);
        if (tool === void 0) {
          if (serverPayload.serverStatus !== void 0 && serverPayload.serverStatus !== "ready") {
            const serverError = serverPayload.serverError ?? `${useDynamicToolNamespaces ? "Namespace" : "MCP server"} "${args.server}" is ${serverPayload.serverStatus}.`;
            const error42 = new CustomToolCallError(ToolErrorClassification.UNEXPECTED_ENVIRONMENT, {
              error: serverError,
              clientVisibleErrorMessage: serverError,
              modelVisibleErrorMessage: `${serverError} Available tools: ${resolvedServer.descriptor.tools.map((t) => t.toolName).join(", ")}`
            });
            emitErrorMetrics(ctx, GET_MCP_TOOLS_FAILURE_REASONS.TOOL_NOT_FOUND, error42);
            throw error42;
          }
          if (useDynamicToolNamespaces && isReservedDynamicToolsNamespace(args.server) && dynamicToolRegistry?.usesDirectToolRecovery() === true && dynamicToolRegistry?.isStaticTool(args.toolName) === true) {
            const directToolMessage = `Tool "${args.toolName}" is already available directly and is not part of dynamic namespace "${args.server}". Invoke "${args.toolName}" directly instead of using dynamic tool discovery or invocation.`;
            const error42 = new CustomToolCallError(ToolErrorClassification.UNEXPECTED_ENVIRONMENT, {
              error: directToolMessage,
              clientVisibleErrorMessage: directToolMessage,
              modelVisibleErrorMessage: directToolMessage
            });
            emitErrorMetrics(ctx, GET_MCP_TOOLS_FAILURE_REASONS.TOOL_NOT_FOUND, error42);
            throw error42;
          }
          const notFoundMessage = useDynamicToolNamespaces ? `Tool "${args.toolName}" not found in namespace "${args.server}".` : `MCP tool "${args.toolName}" not found on server "${args.server}".`;
          const error41 = new CustomToolCallError(ToolErrorClassification.UNEXPECTED_ENVIRONMENT, {
            error: notFoundMessage,
            clientVisibleErrorMessage: notFoundMessage,
            modelVisibleErrorMessage: `${notFoundMessage} Available tools: ${resolvedServer.descriptor.tools.map((t) => t.toolName).join(", ")}`
          });
          emitErrorMetrics(ctx, GET_MCP_TOOLS_FAILURE_REASONS.TOOL_NOT_FOUND, error41);
          throw error41;
        }
        const content = JSON.stringify(toModelFacingSingleToolPayload(serverPayload, tool, useDynamicToolNamespaces), null, 2);
        const result = createSuccessResult2(content);
        emitSuccessMetrics(ctx, result, {
          resultCount: 1,
          payloadBytes: Buffer.byteLength(content, "utf8"),
          wroteToFile: false
        });
        return result;
      }, (result) => createToolCallProto2(baseArgs, result));
    } catch (e_1) {
      env_1.error = e_1;
      env_1.hasError = true;
    } finally {
      __disposeResources37(env_1);
    }
  };
  const modelParametersSchema = useDynamicToolNamespaces ? namespaceParametersSchema : serverParametersSchema;
  const parsingParametersSchema = external_exports.preprocess((raw) => {
    if (!useDynamicToolNamespaces || raw === null || typeof raw !== "object" || Array.isArray(raw)) {
      return raw;
    }
    const input = raw;
    return {
      ...input,
      server: input.namespace
    };
  }, external_exports.object({
    server: external_exports.string().optional(),
    toolName: external_exports.string().optional(),
    pattern: external_exports.string().optional()
  }));
  return createZodAgentTool("GET_MCP_TOOLS", {
    name: getMcpToolsToolName,
    dynamicToolMetaRole: "discovery",
    mcpSnapshotDescriptors: mcpMetaToolOptions.mcpDescriptors,
    descriptionGenerator: (props) => {
      const callMcpToolName = options2?.callMcpToolName ?? getRequiredToolName(props.allTools, "MCP");
      const authLines = allowInteractiveMcpAuth ? [
        "",
        useDynamicToolNamespaces ? `MCP authentication: If an MCP-backed namespace has namespaceStatus "needsAuth", or its tool call fails with an authentication/authorization error, authenticate it by calling ${MCP_AUTH_TOOL_NAME2} through ${callMcpToolName} with empty arguments. Then inspect that namespace again and retry if appropriate.` : `MCP authentication: If a relevant server has serverStatus "needsAuth", or if an MCP tool call fails with an authentication/authorization error, authenticate it by calling ${MCP_AUTH_TOOL_NAME2} (via ${callMcpToolName}, with empty arguments), then inspect that server again and retry the original request if appropriate. Do not call ${MCP_AUTH_TOOL_NAME2} just because it is listed, and do not repeatedly call it if authentication did not fix the failure.`
      ] : [
        "",
        useDynamicToolNamespaces ? 'MCP authentication: If an MCP-backed namespace has namespaceStatus "needsAuth", its tools are unavailable until that MCP integration is authenticated in the Cursor desktop IDE.' : 'MCP authentication: If a server has serverStatus "needsAuth", its tools are not usable in this environment. Ask the user to authenticate that MCP server in the Cursor desktop IDE, then retry.'
      ];
      const builtinToolsListing = omitBuiltinToolNamesFromDescription ? "their names are listed with that namespace in <user_info>, or in the most recent <user_info_catalog_update> block on a later user turn" : dynamicToolRegistry?.getToolNames().join(", ");
      const builtinLines = dynamicToolRegistry !== void 0 && !dynamicToolRegistry.isEmpty() ? [
        "",
        `First-party Cursor tools: the reserved namespace "${CURSOR_DYNAMIC_TOOLS_NAMESPACE}" lists built-in Cursor tools available on demand (${builtinToolsListing}). Discover their schemas here, then invoke them via ${callMcpToolName}; they run natively with their own approvals and rendering.`
      ] : [];
      if (useDynamicToolNamespaces) {
        return [
          "Discover and inspect tools available through dynamic namespaces, e.g. MCP servers.",
          "",
          '1. {"namespace":"<id>"}: returns full input schemas and full descriptions for every tool in that namespace.',
          '2. {"namespace":"<id>","toolName":"<name>"}: returns the full schema and full description for one tool.',
          '3. {"pattern":"<regex>"}: searches namespace and tool names across all namespaces using RE2 syntax.',
          '4. {"namespace":"<id>","pattern":"<regex>"}: searches tool names within that namespace.',
          "5. No arguments: returns the full catalog. Prefer a namespace or pattern when possible.",
          "",
          `Pattern-search and catalog results shorten long descriptions to 200 characters, ending with "${TRUNCATED_DESCRIPTION_SUFFIX}". Namespace and single-tool lookups always return the complete description, so fetch the tool directly when you need the full text.`,
          'The response includes namespaceStatus for MCP-backed namespaces; do not treat namespaces in "needsAuth", "error", or "loading" states as usable.',
          `Always call this tool to discover a tool's schema before calling it with ${callMcpToolName}.`,
          ...builtinLines,
          ...authLines
        ].join("\n");
      }
      return [
        "Discover and inspect MCP tools. There are 5 ways to call this tool. Prefer fetching by server or pattern over listing the full catalog.",
        "",
        '1. {"server":"<id>"}: returns full input schemas and full descriptions for every tool on that server. Preferred when you know the server.',
        '2. {"server":"<id>","toolName":"<name>"}: returns the full schema and full description for one tool.',
        '3. {"pattern":"<regex>"}: searches tool and server names across all servers using RE2 syntax.',
        '4. {"server":"<id>","pattern":"<regex>"}: searches tool names on that server using RE2 syntax.',
        "5. No arguments: returns a catalog of all servers with tool names and short descriptions. Use only as a last resort.",
        "",
        `Pattern-search and catalog results shorten long descriptions to 200 characters, ending with "${TRUNCATED_DESCRIPTION_SUFFIX}". Server and single-tool lookups always return the complete description, so fetch the tool directly when you need the full text.`,
        `The response includes each server's serverStatus; do not treat servers in "needsAuth", "error", or "loading" states as usable.`,
        `Always call this tool to discover a tool's schema before calling it with ${callMcpToolName}.`,
        ...builtinLines,
        ...authLines
      ].join("\n");
    },
    parameters: modelParametersSchema,
    render: renderResult,
    execute: withSafeParsedArgs(parsingParametersSchema, execute, createToolCallProto2(createCallArgs("unknown-tool-call-id", {}), createErrorResult("Invalid arguments"))),
    serializeError: (error41) => {
      const errorMessage6 = error41 instanceof Error ? error41.message : String(error41);
      return createToolCallProto2(createCallArgs("unknown-tool-call-id", {}), createErrorResult(errorMessage6));
    }
  });
};
