/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/local-exec/dist/mcp-file-system-writer.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var import_node_crypto11 = require("node:crypto");
var import_promises17 = require("node:fs/promises");
var import_node_os10 = require("node:os");
var import_node_path29 = require("node:path");
init_dist();
init_mcp_tool_annotations();
var __addDisposableResource13 = function(env, value, async) {
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
var __disposeResources13 = /* @__PURE__ */ (function(SuppressedError2) {
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
function configuredServersBucket(count) {
  if (count === 0)
    return "0";
  if (count <= 3)
    return "1-3";
  if (count <= 6)
    return "4-6";
  if (count <= 10)
    return "7-10";
  return "11+";
}
var mcpFilesystemDivergence = createCounter("mcp.filesystem.divergence", {
  description: "Divergence detected between MCP lease state and filesystem state",
  labelNames: ["divergence_type", "mcp_source", "configured_servers", "mcp_version"]
});
var mcpFilesystemSyncCheck = createCounter("mcp.filesystem.sync_check", {
  description: "MCP filesystem sync check executed",
  labelNames: ["synced", "mcp_source", "configured_servers", "mcp_version"]
});
var mcpFilesystemSyncExpectedServers = createGauge("mcp.filesystem.sync_check.expected_servers", {
  description: "Number of expected MCP servers at last sync check",
  labelNames: ["mcp_source", "mcp_version"]
});
var mcpFilesystemSyncActualServers = createGauge("mcp.filesystem.sync_check.actual_servers", {
  description: "Number of actual MCP servers on disk at last sync check",
  labelNames: ["mcp_source", "mcp_version"]
});
var mcpFilesystemSyncServersMissing = createGauge("mcp.filesystem.sync_check.servers_missing", {
  description: "Number of expected MCP servers missing from disk at last sync check",
  labelNames: ["mcp_source", "mcp_version"]
});
var mcpFilesystemSyncToolMismatches = createGauge("mcp.filesystem.sync_check.tool_mismatches", {
  description: "Number of MCP servers with tool count mismatches at last sync check",
  labelNames: ["mcp_source", "mcp_version"]
});
var baseLogger = createLogger("McpFileSystemWriter");
var MCP_FS_STRUCTURED_LOG_OPT_IN_METADATA_KEY = "mcpFsStructuredLogOptIn";
function withStructuredLogOptIn(metadata, options2) {
  if (!options2?.includeStructuredLogs) {
    return metadata;
  }
  return {
    ...metadata ?? {},
    [MCP_FS_STRUCTURED_LOG_OPT_IN_METADATA_KEY]: true
  };
}
var logger13 = {
  debug(ctx, message, metadata, options2) {
    baseLogger.debug(ctx, message, withStructuredLogOptIn(metadata, options2));
  },
  info(ctx, message, metadata, options2) {
    baseLogger.info(ctx, message, withStructuredLogOptIn(metadata, options2));
  },
  warn(ctx, message, metadata, options2) {
    baseLogger.warn(ctx, message, withStructuredLogOptIn(metadata, options2));
  },
  error(ctx, message, error3, metadata, options2) {
    baseLogger.error(ctx, message, error3, withStructuredLogOptIn(metadata, options2));
  }
};
var MCPS_SUBDIR = "mcps";
var MCP_TOOLS_SUBDIR = "tools";
var SERVER_METADATA_FILENAME = "SERVER_METADATA.json";
var MCP_RESOURCES_SUBDIR = "resources";
var MCP_PROMPTS_SUBDIR = "prompts";
var STAGING_SUFFIX = "~staging";
var PREV_SUFFIX = "~prev";
var INSTRUCTIONS_FILENAME = "INSTRUCTIONS.md";
var STATUS_FILENAME = "STATUS.md";
var MCP_AUTH_TOOL_NAME = "mcp_auth";
var DEFAULT_MCP_AUTH_TOOL_DESCRIPTION = "Authenticate this MCP server so its tools can be used. Call this tool through your MCP tool-calling interface when STATUS.md indicates this server needs authentication.";
var DEFAULT_MCP_ERROR_STATUS_MESSAGE = "The MCP server errored. If this server is important for completing the task, concisely inform the user and ask them to check the MCP status in Cursor's Customize page > MCPs; otherwise continue with a different approach.";
var DEFAULT_MCP_NEEDS_AUTH_STATUS_MESSAGE = 'The MCP server needs authentication. Authenticate it by calling the `{authToolName}` tool for server "{serverIdentifier}" through your MCP tool-calling interface using an empty arguments object. If this server is important for completing the task, authenticate it first; otherwise continue with a different approach.';
var DEFAULT_MCP_NEEDS_AUTH_STATUS_MESSAGE_NO_VIRTUAL_TOOL = "This MCP server requires authentication before its tools can be used. Open Cursor's Customize page > MCPs, select this server, and use Authenticate/Reopen, or refresh credentials in your MCP configuration (for example mcp.json), then restart this environment. If this server is not required for the task, continue without it.";
var CURSOR_DIR_GITIGNORE_MANAGED_START = "# >>> CURSOR MANAGED BLOCK >>>";
var CURSOR_DIR_GITIGNORE_MANAGED_END = "# <<< CURSOR MANAGED BLOCK <<<";
var CURSOR_DIR_GITIGNORE_CONTENT = [
  "# Ignore everything in .cursor",
  "*",
  "# Un-ignore projects so we can descend to allowlisted subdirs",
  "!projects/",
  "projects/*",
  "!projects/*/",
  "projects/*/*",
  "# MCP tool descriptors, resources, prompts",
  "!projects/*/mcps/",
  "!projects/*/mcps/**",
  "# Agent transcripts for citation",
  "!projects/*/agent-transcripts/",
  "!projects/*/agent-transcripts/**",
  "# Terminal output files",
  "!projects/*/terminals/",
  "!projects/*/terminals/**",
  "# Conversation notes (shared scratchpad)",
  "!projects/*/agent-notes/",
  "!projects/*/agent-notes/**",
  "# Large tool output files",
  "!projects/*/agent-tools/",
  "!projects/*/agent-tools/**",
  "# Plugin cache (rules, skills, agents)",
  "!plugins/",
  "!plugins/**",
  "# Built-in Cursor skills",
  "!skills-cursor/",
  "!skills-cursor/**",
  "# User's personal skills",
  "!skills/",
  "!skills/**",
  "# User's personal slash commands",
  "!commands/",
  "!commands/**",
  "# User's plan files",
  "!plans/",
  "!plans/**",
  "# Subagent state/transcripts",
  "!subagents/",
  "!subagents/**",
  "# User-level cursor rules",
  "!rules/",
  "!rules/**"
].join("\n");
async function ensureCursorDirGitignore(cursorDir) {
  const gitignorePath = (0, import_node_path29.join)(cursorDir, ".gitignore");
  const managedBlock = `${CURSOR_DIR_GITIGNORE_MANAGED_START}
${CURSOR_DIR_GITIGNORE_CONTENT}
${CURSOR_DIR_GITIGNORE_MANAGED_END}
`;
  await (0, import_promises17.mkdir)(cursorDir, { recursive: true });
  let existingContent;
  try {
    existingContent = await (0, import_promises17.readFile)(gitignorePath, "utf-8");
  } catch (error3) {
    if (error3?.code !== "ENOENT") {
      throw error3;
    }
  }
  if (existingContent === void 0) {
    await (0, import_promises17.writeFile)(gitignorePath, managedBlock);
    return;
  }
  const startIdx = existingContent.indexOf(CURSOR_DIR_GITIGNORE_MANAGED_START);
  const endIdx = existingContent.indexOf(CURSOR_DIR_GITIGNORE_MANAGED_END, startIdx + CURSOR_DIR_GITIGNORE_MANAGED_START.length);
  if (startIdx !== -1 && endIdx !== -1) {
    const before = existingContent.slice(0, startIdx);
    const after = existingContent.slice(endIdx + CURSOR_DIR_GITIGNORE_MANAGED_END.length).replace(/^\n/, "");
    const updatedContent = `${before}${managedBlock}${after}`;
    if (updatedContent !== existingContent) {
      await (0, import_promises17.writeFile)(gitignorePath, updatedContent);
    }
    return;
  }
  await (0, import_promises17.writeFile)(gitignorePath, managedBlock);
}
var DEFAULT_DEBOUNCE_MS = 100;
var CLIENT_FETCH_TIMEOUT_MS = 15e3;
function withTimeout2(promise, fallback2, timeoutMs = CLIENT_FETCH_TIMEOUT_MS) {
  let timer2;
  return Promise.race([
    promise.catch(() => fallback2),
    new Promise((resolve14) => {
      timer2 = setTimeout(() => resolve14(fallback2), timeoutMs);
    })
  ]).finally(() => clearTimeout(timer2));
}
function sanitizeFileName(name17) {
  return name17.replace(/[^a-zA-Z0-9_-]/g, "_");
}
function getValidCopyOverride(value) {
  if (value === void 0) {
    return void 0;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : void 0;
}
function interpolateMcpAuthTemplate(template, params) {
  return template.replace(/\{serverIdentifier\}/g, params.serverIdentifier).replace(/\{authToolName\}/g, params.authToolName);
}
function createVirtualMcpAuthToolDefinition(params) {
  return {
    clientKey: params.serverIdentifier,
    providerIdentifier: params.serverName,
    plugin: params.plugin,
    marketplace: params.marketplace,
    pluginId: params.pluginId,
    marketplaceId: params.marketplaceId,
    toolName: MCP_AUTH_TOOL_NAME,
    name: MCP_AUTH_TOOL_NAME,
    description: params.authToolDescription,
    inputSchema: {
      type: "object",
      properties: {},
      additionalProperties: false
    }
  };
}
function clientStateToServerStatus(state) {
  switch (state.kind) {
    case "loading":
      return "initializing";
    case "requires_authentication":
      return "needsAuth";
    case "ready":
      return "connected";
    case "error":
      return "error";
    default: {
      return "disconnected";
    }
  }
}
function canonicalizeJsonValue(value) {
  if (Array.isArray(value)) {
    return value.map((item) => canonicalizeJsonValue(item));
  }
  if (value !== null && typeof value === "object") {
    const entries = Object.entries(value).filter(([, entryValue]) => entryValue !== void 0).sort(([a], [b2]) => a < b2 ? -1 : a > b2 ? 1 : 0).map(([key, entryValue]) => [key, canonicalizeJsonValue(entryValue)]);
    return Object.fromEntries(entries);
  }
  return value;
}
function canonicalJsonString(value) {
  return JSON.stringify(canonicalizeJsonValue(value));
}
function sortByCanonicalJson(values) {
  const keyedValues = values.map((value) => ({
    value,
    key: canonicalJsonString(value)
  }));
  keyedValues.sort((a, b2) => a.key < b2.key ? -1 : a.key > b2.key ? 1 : 0);
  return keyedValues.map((entry) => entry.value);
}
function serverFingerprint(server) {
  const tools = sortByCanonicalJson(server.tools.map((t) => ({
    name: t.toolName,
    description: t.description,
    inputSchema: t.inputSchema,
    outputSchema: t.outputSchema
  })));
  const resources = sortByCanonicalJson(server.resources.map((r) => ({
    uri: r.uri,
    name: r.name,
    description: r.description,
    mimeType: r.mimeType
  })));
  const prompts = sortByCanonicalJson(server.prompts.map((p2) => ({
    name: p2.name,
    description: p2.description,
    arguments: p2.arguments
  })));
  return canonicalJsonString({
    id: server.serverIdentifier,
    name: server.serverName,
    plugin: server.plugin,
    marketplace: server.marketplace,
    pluginId: server.pluginId,
    marketplaceId: server.marketplaceId,
    tools,
    resources,
    prompts,
    instructions: server.instructions,
    status: server.status
  });
}
var McpFileSystemWriter = class _McpFileSystemWriter {
  constructor(mcpLease, projectDir, options2) {
    this.cachedFingerprints = /* @__PURE__ */ new Map();
    this.disposed = false;
    this.hasPendingLeaseChangeEvent = false;
    this.lastDivergenceCheckMs = 0;
    this.mcpLease = mcpLease;
    this.projectDir = projectDir;
    this.debounceMs = options2?.debounceMs ?? DEFAULT_DEBOUNCE_MS;
    this.mcpAuthCopyOverrides = options2?.mcpAuthCopyOverrides;
    this.useDirectClientTools = options2?.useDirectClientTools ?? false;
    this.enabledToolsByServerProvider = options2?.getEnabledToolsByServer;
    this.exposeVirtualMcpAuthTool = options2?.exposeVirtualMcpAuthTool ?? true;
    this.alwaysExposeVirtualMcpAuthTool = options2?.alwaysExposeVirtualMcpAuthTool ?? false;
    this.snapshotProvider = options2?.snapshotProvider;
    this.mcpVersion = options2?.mcpVersion ?? (this.snapshotProvider ? "snapshots" : "v1");
    this.onDidWrite = options2?.onDidWrite;
    this.ctx = this.getContext(options2?.loggerBackend);
    this.startupCleanupPromise = this.cleanupStaleStagingDirs(this.ctx);
    this.leaseChangeDisposable = this.mcpLease.onDidChange((event) => {
      logger13.info(this.ctx, "Lease change event received", {
        serverIdentifiers: event?.serverIdentifiers,
        reason: event?.reason
      });
      this.onLeaseChanged(this.ctx, event);
    });
    logger13.info(this.ctx, "Constructor: scheduling initial write");
    this.scheduleWrite(this.ctx);
    this.ensureCursorDirGitignore();
  }
  /**
   * Fire-and-forget: ensure ~/.cursor/.gitignore exists with allowlist rules.
   * Enables LS tool to list MCP config when user has * in ~/.gitignore.
   */
  ensureCursorDirGitignore() {
    void ensureCursorDirGitignore((0, import_node_path29.join)((0, import_node_os10.homedir)(), ".cursor")).catch((err) => {
      logger13.warn(this.ctx, "Failed to ensure ~/.cursor/.gitignore", err);
    });
  }
  async cleanupStaleStagingDirs(ctx) {
    const logCtx = this.getLogContext(ctx);
    const mcpsPath = (0, import_node_path29.join)(this.projectDir, MCPS_SUBDIR);
    try {
      const entries = await (0, import_promises17.readdir)(mcpsPath);
      await Promise.allSettled(entries.filter((entry) => entry.endsWith(STAGING_SUFFIX)).map((entry) => (0, import_promises17.rm)((0, import_node_path29.join)(mcpsPath, entry), {
        recursive: true,
        force: true
      })));
    } catch (err) {
      if (err?.code !== "ENOENT") {
        logger13.error(logCtx, "Error clearing stale mcps staging dirs", err);
      }
    }
  }
  onLeaseChanged(ctx, event) {
    if (this.disposed) {
      return;
    }
    const normalizedEvent = event ?? { serverIdentifiers: void 0 };
    if (this.hasPendingLeaseChangeEvent) {
      this.pendingLeaseChangeEvent = mergeMcpLeaseEvents(this.pendingLeaseChangeEvent ?? { serverIdentifiers: void 0 }, normalizedEvent);
    } else {
      this.pendingLeaseChangeEvent = normalizedEvent;
      this.hasPendingLeaseChangeEvent = true;
    }
    if (this.debounceTimer !== void 0) {
      clearTimeout(this.debounceTimer);
    }
    this.debounceTimer = setTimeout(() => {
      this.debounceTimer = void 0;
      const pendingEvent = this.takePendingLeaseChangeEvent();
      this.scheduleWrite(ctx, pendingEvent);
    }, this.debounceMs);
  }
  takePendingLeaseChangeEvent() {
    if (!this.hasPendingLeaseChangeEvent) {
      return void 0;
    }
    const pendingEvent = this.pendingLeaseChangeEvent ?? {
      serverIdentifiers: void 0
    };
    this.pendingLeaseChangeEvent = void 0;
    this.hasPendingLeaseChangeEvent = false;
    return pendingEvent;
  }
  scheduleWrite(ctx, leaseChangeEvent) {
    const logCtx = this.getLogContext(ctx);
    if (this.disposed) {
      return;
    }
    const previousPromise = this.writePromise;
    this.writePromise = (async () => {
      if (previousPromise) {
        try {
          await previousPromise;
        } catch (error3) {
          logger13.error(logCtx, "Error waiting for previous write", error3);
        }
      }
      if (this.disposed) {
        return;
      }
      await this.startupCleanupPromise;
      if (this.disposed) {
        return;
      }
      await this.fetchAndWrite(ctx, leaseChangeEvent);
    })();
  }
  getContext(loggerBackend) {
    let ctx = createContext();
    if (loggerBackend) {
      ctx = ctx.with(loggerKey, loggerBackend);
    }
    return ctx;
  }
  getLogContext(ctx) {
    return ctx.with(loggerKey, this.ctx.get(loggerKey));
  }
  getMetricTags(labels) {
    return {
      ...labels,
      mcp_version: this.mcpVersion
    };
  }
  getMcpAuthToolDescription() {
    return getValidCopyOverride(this.mcpAuthCopyOverrides?.authToolDescription) ?? DEFAULT_MCP_AUTH_TOOL_DESCRIPTION;
  }
  shouldExposeVirtualMcpAuthToolForStatus(serverIdentifier, status) {
    return this.exposeVirtualMcpAuthTool && supportsInteractiveMcpAuth(serverIdentifier) && (this.alwaysExposeVirtualMcpAuthTool || status === "needsAuth");
  }
  getErrorStatusMessage() {
    return getValidCopyOverride(this.mcpAuthCopyOverrides?.errorStatusMessage) ?? DEFAULT_MCP_ERROR_STATUS_MESSAGE;
  }
  getNeedsAuthStatusMessage(serverIdentifier) {
    const template = getValidCopyOverride(this.mcpAuthCopyOverrides?.needsAuthStatusMessageWithAuthTool) ?? DEFAULT_MCP_NEEDS_AUTH_STATUS_MESSAGE;
    return interpolateMcpAuthTemplate(template, {
      serverIdentifier,
      authToolName: MCP_AUTH_TOOL_NAME
    });
  }
  getNeedsAuthStatusMessageForWrite(serverIdentifier) {
    if (!this.exposeVirtualMcpAuthTool || !supportsInteractiveMcpAuth(serverIdentifier)) {
      return getValidCopyOverride(this.mcpAuthCopyOverrides?.needsAuthStatusMessageWithoutVirtualTool) ?? DEFAULT_MCP_NEEDS_AUTH_STATUS_MESSAGE_NO_VIRTUAL_TOOL;
    }
    return this.getNeedsAuthStatusMessage(serverIdentifier);
  }
  async getToolsForServers(ctx, serverIdentifiers) {
    if (serverIdentifiers.length === 0) {
      return [];
    }
    const logCtx = this.getLogContext(ctx);
    try {
      return await this.mcpLease.getToolsForServers(ctx, serverIdentifiers);
    } catch (err) {
      logger13.warn(logCtx, `getToolsForServers() threw, falling back to filtered getTools(): ${err}`);
      const allTools = await this.mcpLease.getTools(ctx).catch((e) => {
        logger13.warn(logCtx, `getTools() threw during scoped-tool fallback, defaulting to []: ${e}`);
        return [];
      });
      const requestedServerIds = new Set(serverIdentifiers);
      return allTools.filter((tool) => requestedServerIds.has(tool.clientKey));
    }
  }
  async getEnabledToolsByServer(ctx) {
    if (!this.useDirectClientTools || this.enabledToolsByServerProvider === void 0) {
      return void 0;
    }
    try {
      return await this.enabledToolsByServerProvider(ctx);
    } catch (err) {
      logger13.warn(this.getLogContext(ctx), `getEnabledToolsByServer() threw, falling back to raw direct client tool lists: ${err}`);
      return void 0;
    }
  }
  async fetchClientDataForServer(ctx, clientKey, client, options2) {
    const logCtx = this.getLogContext(ctx);
    const state = await withTimeout2(client.getState(ctx), {
      kind: "error"
    }).then((s3) => {
      if (s3.kind === "error" && !("message" in s3)) {
        logger13.warn(ctx, `getState() timed out for "${clientKey}", defaulting to error`);
      }
      return s3;
    });
    const isReachable = state.kind === "ready" || state.kind === "requires_authentication";
    const [clientTools, resources, prompts, instructions] = await Promise.all([
      isReachable && this.useDirectClientTools ? withTimeout2(client.getTools(ctx), []).then((tools) => {
        if (tools.length === 0) {
          logger13.info(logCtx, `Direct client getTools() returned 0 tools for "${clientKey}" (state=${state.kind})`);
        }
        return tools;
      }) : Promise.resolve([]),
      isReachable ? withTimeout2(client.listResources(ctx), { resources: [] }) : Promise.resolve({ resources: [] }),
      isReachable ? withTimeout2(client.listPrompts(ctx), []) : Promise.resolve([]),
      isReachable && options2?.fetchInstructions ? withTimeout2(client.getInstructions(ctx), void 0) : Promise.resolve(void 0)
    ]);
    return {
      clientKey,
      serverName: client.serverName,
      plugin: client.plugin,
      marketplace: client.marketplace,
      pluginId: client.pluginId,
      marketplaceId: client.marketplaceId,
      clientTools: clientTools.map((t) => ({
        ...t,
        clientKey,
        providerIdentifier: client.serverName,
        plugin: client.plugin,
        marketplace: client.marketplace,
        pluginId: client.pluginId,
        marketplaceId: client.marketplaceId,
        toolName: t.name
      })),
      resources: resources.resources.map((r) => ({
        ...r,
        serverIdentifier: clientKey,
        serverName: client.serverName
      })),
      prompts: prompts.map((p2) => ({
        ...p2,
        serverIdentifier: clientKey,
        serverName: client.serverName
      })),
      instructions,
      status: clientStateToServerStatus(state)
    };
  }
  buildServerDataMap(ctx, tools, clientData, enabledToolsByServer, instructions) {
    const clientToolsByKey = new Map(clientData.map((data) => [data.clientKey, data.clientTools]));
    const serverDataMap = /* @__PURE__ */ new Map();
    for (const data of clientData) {
      const sanitizedId = sanitizeServerName(data.clientKey);
      serverDataMap.set(data.clientKey, {
        serverIdentifier: data.clientKey,
        serverName: data.serverName,
        plugin: data.plugin,
        marketplace: data.marketplace,
        pluginId: data.pluginId,
        marketplaceId: data.marketplaceId,
        sanitizedId,
        folderPath: (0, import_node_path29.join)(this.projectDir, MCPS_SUBDIR, sanitizedId),
        tools: [],
        resources: data.resources,
        prompts: data.prompts,
        instructions: data.instructions,
        status: data.status
      });
    }
    for (const tool of tools) {
      let serverData = serverDataMap.get(tool.clientKey);
      if (!serverData) {
        const sanitizedId = sanitizeServerName(tool.clientKey);
        serverData = {
          serverIdentifier: tool.clientKey,
          serverName: tool.providerIdentifier,
          plugin: tool.plugin,
          marketplace: tool.marketplace,
          pluginId: tool.pluginId,
          marketplaceId: tool.marketplaceId,
          sanitizedId,
          folderPath: (0, import_node_path29.join)(this.projectDir, MCPS_SUBDIR, sanitizedId),
          tools: [],
          resources: [],
          prompts: [],
          instructions: void 0,
          status: void 0
        };
        serverDataMap.set(tool.clientKey, serverData);
      }
      serverData.tools.push(tool);
    }
    for (const [key, serverData] of serverDataMap) {
      if (serverData.tools.length === 0) {
        const fallbackTools = clientToolsByKey.get(key);
        if (fallbackTools && fallbackTools.length > 0) {
          const enabledToolNames = enabledToolsByServer?.[key];
          const filteredFallbackTools = enabledToolNames !== void 0 ? fallbackTools.filter((tool) => enabledToolNames.includes(tool.toolName)) : fallbackTools;
          if (enabledToolNames !== void 0 && filteredFallbackTools.length === 0) {
            logger13.info(ctx, `Skipping direct client tool fallback for "${key}": settings report 0 enabled tools`);
            continue;
          }
          logger13.info(ctx, `Using direct client tool fallback for "${key}": lease had 0 tools, client has ${fallbackTools.length}, writing ${filteredFallbackTools.length}`);
          serverData.tools = filteredFallbackTools;
        }
      }
    }
    if (instructions !== void 0) {
      for (const instruction of instructions) {
        const instructionIdentifier = instruction.serverIdentifier?.trim();
        let serverData = instructionIdentifier ? Array.from(serverDataMap.values()).find((s3) => s3.serverIdentifier === instructionIdentifier) : void 0;
        if (!serverData) {
          const instructionServerName = instruction.serverName?.trim();
          serverData = instructionServerName ? Array.from(serverDataMap.values()).find((s3) => s3.serverName === instructionServerName) : void 0;
        }
        if (!serverData) {
          continue;
        }
        if (instruction.instructions) {
          serverData.instructions = instruction.instructions;
        }
      }
    }
    if (this.exposeVirtualMcpAuthTool) {
      for (const server of serverDataMap.values()) {
        if (!this.shouldExposeVirtualMcpAuthToolForStatus(server.serverIdentifier, server.status)) {
          continue;
        }
        const hasAuthTool = server.tools.some((tool) => tool.toolName === MCP_AUTH_TOOL_NAME);
        if (!hasAuthTool) {
          server.tools.push(createVirtualMcpAuthToolDefinition({
            serverIdentifier: server.serverIdentifier,
            serverName: server.serverName,
            plugin: server.plugin,
            marketplace: server.marketplace,
            pluginId: server.pluginId,
            marketplaceId: server.marketplaceId,
            authToolDescription: this.getMcpAuthToolDescription()
          }));
        }
      }
    }
    return serverDataMap;
  }
  buildServersToWrite(ctx, serverDataMap) {
    const serversToWrite = [];
    const seenSanitizedIds = /* @__PURE__ */ new Set();
    for (const server of serverDataMap.values()) {
      const hasContent = server.tools.length > 0 || server.resources.length > 0 || server.prompts.length > 0 || server.instructions;
      const shouldWriteEmptyState = server.status === "error" || server.status === "needsAuth" || server.status === "initializing";
      if (!hasContent && !shouldWriteEmptyState) {
        logger13.info(ctx, `Server "${server.serverIdentifier}" excluded from write: tools=${server.tools.length}, resources=${server.resources.length}, prompts=${server.prompts.length}, hasInstructions=${!!server.instructions}, status=${server.status}`);
        continue;
      }
      if (seenSanitizedIds.has(server.sanitizedId)) {
        logger13.warn(ctx, `Skipping server "${server.serverIdentifier}" \u2014 sanitizedId "${server.sanitizedId}" collides with another server`);
        continue;
      }
      seenSanitizedIds.add(server.sanitizedId);
      serversToWrite.push(server);
    }
    return serversToWrite;
  }
  mergeScopedRefreshWithCachedServerData(cachedServerData, refreshedServerData) {
    const tools = [...refreshedServerData.tools];
    if (this.shouldExposeVirtualMcpAuthToolForStatus(cachedServerData.serverIdentifier, cachedServerData.status) && !tools.some((tool) => tool.toolName === MCP_AUTH_TOOL_NAME)) {
      const cachedAuthTool = cachedServerData.tools.find((tool) => tool.toolName === MCP_AUTH_TOOL_NAME);
      if (cachedAuthTool !== void 0) {
        tools.push(cachedAuthTool);
      }
    }
    return {
      ...cachedServerData,
      ...refreshedServerData,
      tools,
      resources: cachedServerData.resources,
      prompts: cachedServerData.prompts,
      instructions: cachedServerData.instructions,
      status: cachedServerData.status,
      plugin: refreshedServerData.plugin ?? cachedServerData.plugin,
      marketplace: refreshedServerData.marketplace ?? cachedServerData.marketplace,
      pluginId: refreshedServerData.pluginId ?? cachedServerData.pluginId,
      marketplaceId: refreshedServerData.marketplaceId ?? cachedServerData.marketplaceId
    };
  }
  async refreshServersFromLease(ctx, leaseChangeEvent) {
    const logCtx = this.getLogContext(ctx);
    const uniqueServerIdentifiers = [...new Set(leaseChangeEvent.serverIdentifiers ?? [])];
    logger13.info(logCtx, `fetchAndWrite: refreshing ${uniqueServerIdentifiers.length} targeted servers`, {
      serverIdentifiers: uniqueServerIdentifiers
    });
    const tools = await this.getToolsForServers(ctx, uniqueServerIdentifiers);
    const instructions = await this.mcpLease.getInstructions(ctx).catch((err) => {
      logger13.warn(logCtx, `getInstructions() threw during scoped refresh, defaulting to []: ${err}`);
      return [];
    });
    const clientLookups = await Promise.all(uniqueServerIdentifiers.map(async (serverIdentifier) => {
      try {
        const client = await this.mcpLease.getClient(ctx, serverIdentifier);
        if (client === void 0) {
          return {
            serverIdentifier,
            kind: "missing"
          };
        }
        return {
          serverIdentifier,
          kind: "client",
          client
        };
      } catch (error3) {
        logger13.warn(logCtx, `getClient("${serverIdentifier}") threw during scoped refresh, preserving cached data: ${error3}`);
        return {
          serverIdentifier,
          kind: "error",
          error: error3
        };
      }
    }));
    const missingServerIdentifiers = clientLookups.filter((lookup3) => lookup3.kind === "missing").map((lookup3) => lookup3.serverIdentifier);
    let confirmedMissingServerIdentifiers = /* @__PURE__ */ new Set();
    if (missingServerIdentifiers.length > 0) {
      const allClients = await this.mcpLease.getClients(ctx).catch((err) => {
        logger13.warn(logCtx, `getClients() threw while confirming targeted server removal, preserving cached data: ${err}`);
        return void 0;
      });
      if (allClients !== void 0) {
        confirmedMissingServerIdentifiers = new Set(missingServerIdentifiers.filter((serverIdentifier) => allClients[serverIdentifier] === void 0));
      }
    }
    const [clientData, enabledToolsByServer] = await Promise.all([
      Promise.all(clientLookups.filter((lookup3) => lookup3.kind === "client").map(({ serverIdentifier, client }) => this.fetchClientDataForServer(ctx, serverIdentifier, client, {
        fetchInstructions: true
      }))),
      this.getEnabledToolsByServer(ctx)
    ]);
    const nextServerDataMap = new Map((this.cachedServerData ?? []).map((server) => [server.serverIdentifier, server]));
    const refreshedServerDataMap = this.buildServerDataMap(ctx, tools, clientData, enabledToolsByServer, instructions);
    const targetedSet = new Set(uniqueServerIdentifiers);
    const transientlyUnavailableServerIdentifiers = new Set(clientLookups.filter((lookup3) => {
      if (lookup3.kind === "error") {
        return true;
      }
      return lookup3.kind === "missing" && !confirmedMissingServerIdentifiers.has(lookup3.serverIdentifier);
    }).map((lookup3) => lookup3.serverIdentifier));
    for (const serverIdentifier of uniqueServerIdentifiers) {
      const cachedServerData = nextServerDataMap.get(serverIdentifier);
      const refreshedServerData = refreshedServerDataMap.get(serverIdentifier);
      if (refreshedServerData !== void 0) {
        if (transientlyUnavailableServerIdentifiers.has(serverIdentifier) && cachedServerData !== void 0) {
          nextServerDataMap.set(serverIdentifier, this.mergeScopedRefreshWithCachedServerData(cachedServerData, refreshedServerData));
          logger13.warn(logCtx, `refreshServersFromLease: preserving cached metadata for "${serverIdentifier}" because the client was unavailable during targeted refresh`);
          continue;
        }
        nextServerDataMap.set(serverIdentifier, refreshedServerData);
        continue;
      }
      if (confirmedMissingServerIdentifiers.has(serverIdentifier)) {
        nextServerDataMap.delete(serverIdentifier);
        continue;
      }
      logger13.warn(logCtx, `refreshServersFromLease: preserving cached data for "${serverIdentifier}" because targeted refresh returned no replacement`);
    }
    const leaseSanitizedIdMap = new Map(Array.from(nextServerDataMap.values()).map((server) => [server.sanitizedId, server.serverIdentifier]));
    for (const [id, fp] of this.cachedFingerprints) {
      if (!targetedSet.has(id) && !nextServerDataMap.has(id)) {
        const sanitizedId = sanitizeServerName(id);
        leaseSanitizedIdMap.set(sanitizedId, id);
      }
    }
    const serversToWrite = this.buildServersToWrite(ctx, nextServerDataMap);
    await this.writeServerData(ctx, serversToWrite, leaseSanitizedIdMap);
    this.cachedServerData = serversToWrite;
    this.fireOnDidWrite(serversToWrite);
  }
  /**
   * Fetches MCP state from the lease and writes to disk.
   * All data is fetched directly from the ObservableMcpLease.
   */
  async fetchAndWrite(ctx, leaseChangeEvent) {
    const env_1 = { stack: [], error: void 0, hasError: false };
    try {
      const _span = __addDisposableResource13(env_1, createSpan(ctx.withName("McpFileSystemWriter.fetchAndWrite")), false);
      const logCtx = this.getLogContext(ctx);
      try {
        if (this.cachedServerData !== void 0 && leaseChangeEvent !== void 0 && !isFullMcpLeaseInvalidation(leaseChangeEvent)) {
          const targetedServerIdentifiers = [...new Set(leaseChangeEvent.serverIdentifiers ?? [])];
          if (targetedServerIdentifiers.length > 0) {
            await this.refreshServersFromLease(ctx, leaseChangeEvent);
            return;
          }
        }
        const [tools, instructions, clients, enabledToolsByServer] = await Promise.all([
          this.mcpLease.getTools(ctx).catch((err) => {
            logger13.warn(logCtx, `getTools() threw, defaulting to []: ${err}`);
            return [];
          }),
          this.mcpLease.getInstructions(ctx).catch(() => []),
          this.mcpLease.getClients(ctx).catch((err) => {
            logger13.warn(logCtx, `getClients() threw, defaulting to {}: ${err}`);
            return {};
          }),
          this.getEnabledToolsByServer(ctx)
        ]);
        const clientKeys = Object.keys(clients);
        logger13.info(logCtx, `fetchAndWrite: lease returned ${tools.length} tools across ${clientKeys.length} clients`);
        const clientEntries = Object.entries(clients);
        const clientDataPromises = clientEntries.map(([clientKey, client]) => this.fetchClientDataForServer(ctx, clientKey, client));
        const clientData = await Promise.all(clientDataPromises);
        const serverDataMap = this.buildServerDataMap(ctx, tools, clientData, enabledToolsByServer, instructions);
        const serversToWrite = this.buildServersToWrite(ctx, serverDataMap);
        const leaseSanitizedIdMap = new Map(Array.from(serverDataMap.values()).map((s3) => [s3.sanitizedId, s3.serverIdentifier]));
        await this.writeServerData(ctx, serversToWrite, leaseSanitizedIdMap);
        this.cachedServerData = serversToWrite;
        this.fireOnDidWrite(serversToWrite);
      } catch (error3) {
        logger13.error(logCtx, "Error fetching/writing MCP state", error3);
      }
    } catch (e_1) {
      env_1.error = e_1;
      env_1.hasError = true;
    } finally {
      __disposeResources13(env_1);
    }
  }
  fireOnDidWrite(servers) {
    if (!this.onDidWrite) {
      return;
    }
    try {
      const descriptors = servers.map((server) => ({
        serverIdentifier: server.serverIdentifier,
        folderPath: server.folderPath,
        tools: server.tools.map((tool) => ({
          toolName: tool.toolName,
          definitionPath: (0, import_node_path29.join)(server.folderPath, MCP_TOOLS_SUBDIR, `${sanitizeFileName(tool.toolName)}.json`)
        }))
      }));
      this.onDidWrite(descriptors);
    } catch {
    }
  }
  async writeServerData(ctx, servers, leaseSanitizedIdMap) {
    const env_2 = { stack: [], error: void 0, hasError: false };
    try {
      const _span = __addDisposableResource13(env_2, createSpan(ctx.withName("McpFileSystemWriter.writeServerData")), false);
      const logCtx = this.getLogContext(ctx);
      const mcpsPath = (0, import_node_path29.join)(this.projectDir, MCPS_SUBDIR);
      await (0, import_promises17.mkdir)(mcpsPath, { recursive: true });
      const newFingerprints = /* @__PURE__ */ new Map();
      for (const server of servers) {
        try {
          newFingerprints.set(server.serverIdentifier, serverFingerprint(server));
        } catch (error3) {
          logger13.error(logCtx, "Error computing server fingerprint, will force write", error3, {
            serverIdentifier: server.serverIdentifier
          });
          newFingerprints.set(server.serverIdentifier, `__error_${Date.now()}_${Math.random()}`);
        }
      }
      const toWrite = [];
      for (const server of servers) {
        const oldFp = this.cachedFingerprints.get(server.serverIdentifier);
        const newFp = newFingerprints.get(server.serverIdentifier);
        if (oldFp !== newFp) {
          toWrite.push(server);
          if (oldFp !== void 0) {
            logger13.info(logCtx, `Server "${server.serverIdentifier}" fingerprint changed: tools=${server.tools.length}, status=${server.status}`);
          }
        }
      }
      for (const server of servers) {
        if (toWrite.includes(server)) {
          continue;
        }
        try {
          await (0, import_promises17.stat)((0, import_node_path29.join)(mcpsPath, server.sanitizedId));
        } catch {
          logger13.info(logCtx, `Server "${server.serverIdentifier}" directory missing on disk, forcing write`);
          toWrite.push(server);
        }
      }
      const toRemove = /* @__PURE__ */ new Set();
      for (const [id] of this.cachedFingerprints) {
        if (!newFingerprints.has(id)) {
          const old = this.cachedServerData?.find((s3) => s3.serverIdentifier === id);
          const sanitizedId = old?.sanitizedId ?? sanitizeServerName(id);
          if (!leaseSanitizedIdMap.has(sanitizedId)) {
            logger13.info(logCtx, `Server "${id}" (sanitized="${sanitizedId}") left the lease, scheduling directory removal`);
            toRemove.add(sanitizedId);
          } else {
            logger13.info(logCtx, `Server "${id}" (sanitized="${sanitizedId}") still in lease but excluded from write, preserving directory`);
            newFingerprints.set(id, this.cachedFingerprints.get(id));
          }
        }
      }
      const coldStartReconcile = this.cachedServerData === void 0;
      if (coldStartReconcile) {
        try {
          const existingEntries = await (0, import_promises17.readdir)(mcpsPath);
          const liveEntries = new Set(existingEntries.filter((e) => !e.endsWith(STAGING_SUFFIX) && !e.endsWith(PREV_SUFFIX)));
          for (const entry of existingEntries) {
            if (entry.endsWith(STAGING_SUFFIX)) {
              await (0, import_promises17.rm)((0, import_node_path29.join)(mcpsPath, entry), { recursive: true, force: true });
            } else if (entry.endsWith(PREV_SUFFIX)) {
              const liveName = entry.slice(0, -PREV_SUFFIX.length);
              if (!liveEntries.has(liveName)) {
                try {
                  await (0, import_promises17.rename)((0, import_node_path29.join)(mcpsPath, entry), (0, import_node_path29.join)(mcpsPath, liveName));
                  liveEntries.add(liveName);
                } catch {
                  await (0, import_promises17.rm)((0, import_node_path29.join)(mcpsPath, entry), {
                    recursive: true,
                    force: true
                  }).catch(() => {
                  });
                }
              } else {
                await (0, import_promises17.rm)((0, import_node_path29.join)(mcpsPath, entry), { recursive: true, force: true });
              }
            }
          }
          for (const liveEntry of liveEntries) {
            if (!leaseSanitizedIdMap.has(liveEntry)) {
              toRemove.add(liveEntry);
            } else {
              const serverIdentifier = leaseSanitizedIdMap.get(liveEntry);
              if (!newFingerprints.has(serverIdentifier)) {
                newFingerprints.set(serverIdentifier, `__preserved_${liveEntry}`);
              }
            }
          }
        } catch (error3) {
          logger13.error(logCtx, "Error clearing mcps directory", error3);
        }
      }
      const toRemoveIds = Array.from(toRemove);
      if (toWrite.length > 0 || toRemove.size > 0) {
        const changedServers = toWrite.map((server) => ({
          serverIdentifier: server.serverIdentifier,
          sanitizedId: server.sanitizedId,
          toolCount: server.tools.length
        }));
        logger13.info(logCtx, `Incremental write: ${toWrite.length} changed, ${toRemove.size} removed, ${servers.length - toWrite.length} unchanged`, {
          changedServerCount: toWrite.length,
          changedServers,
          removedServerCount: toRemove.size,
          removedServerSanitizedIds: toRemoveIds,
          unchangedServerCount: servers.length - toWrite.length,
          totalServerCount: servers.length,
          // Servers the lease knows about, before `buildServersToWrite` drops
          // the ones with nothing to write. Paired with `totalServerCount` on
          // the same row, this separates "the lease itself came up short" from
          // "the lease was fine and the write excluded them".
          leaseServerCount: leaseSanitizedIdMap.size,
          coldStartReconcile,
          // Digest of the first workspace folder's path, so every window open
          // on that folder writes this same tree. Two windows disagreeing about
          // the server set show up here as one digest with conflicting writes.
          // Hashed rather than logged raw: the path names the user's home and
          // the workspace they have open.
          projectDirHash: (0, import_node_crypto11.createHash)("sha256").update(this.projectDir).digest("hex")
        }, {
          includeStructuredLogs: true
        });
      }
      const writeResults = await Promise.allSettled(toWrite.map((server) => this.writeServerAtomic(ctx, server, mcpsPath)));
      for (let i = 0; i < toWrite.length; i++) {
        const result = writeResults[i];
        if (result.status === "rejected") {
          const server = toWrite[i];
          const oldFp = this.cachedFingerprints.get(server.serverIdentifier);
          if (oldFp !== void 0) {
            newFingerprints.set(server.serverIdentifier, oldFp);
          } else {
            newFingerprints.delete(server.serverIdentifier);
          }
          logger13.error(ctx, "Error writing server directory", result.reason, {
            serverIdentifier: server.serverIdentifier,
            sanitizedId: server.sanitizedId
          }, {
            includeStructuredLogs: true
          });
        }
      }
      const removalResults = await Promise.allSettled(toRemoveIds.map((sanitizedId) => (0, import_promises17.rm)((0, import_node_path29.join)(mcpsPath, sanitizedId), { recursive: true, force: true })));
      for (let i = 0; i < removalResults.length; i++) {
        const removalResult = removalResults[i];
        if (removalResult.status === "rejected") {
          const sanitizedId = toRemoveIds[i];
          logger13.error(ctx, "Error removing server directory", removalResult.reason, {
            sanitizedId,
            removalIndex: i,
            removalAttemptCount: removalResults.length,
            removedServerCount: toRemoveIds.length,
            removedServerSanitizedIds: toRemoveIds,
            changedServerCount: toWrite.length,
            unchangedServerCount: servers.length - toWrite.length,
            totalServerCount: servers.length
          }, { includeStructuredLogs: true });
        }
      }
      this.cachedFingerprints = newFingerprints;
    } catch (e_2) {
      env_2.error = e_2;
      env_2.hasError = true;
    } finally {
      __disposeResources13(env_2);
    }
  }
  async writeServerAtomic(ctx, server, mcpsPath) {
    const env_3 = { stack: [], error: void 0, hasError: false };
    try {
      const _span = __addDisposableResource13(env_3, createSpan(ctx.withName("McpFileSystemWriter.writeServerAtomic")), false);
      const stagingName = `${server.sanitizedId}${STAGING_SUFFIX}`;
      const prevName = `${server.sanitizedId}${PREV_SUFFIX}`;
      const stagingDir = (0, import_node_path29.join)(mcpsPath, stagingName);
      const prevDir = (0, import_node_path29.join)(mcpsPath, prevName);
      const liveDir = (0, import_node_path29.join)(mcpsPath, server.sanitizedId);
      await (0, import_promises17.rm)(stagingDir, { recursive: true, force: true });
      try {
        await (0, import_promises17.rename)(prevDir, liveDir);
      } catch {
        await (0, import_promises17.rm)(prevDir, { recursive: true, force: true });
      }
      await this.writeServerDirectory(ctx, server, {
        basePath: mcpsPath,
        dirName: stagingName
      });
      try {
        try {
          await (0, import_promises17.rename)(liveDir, prevDir);
        } catch {
        }
        await (0, import_promises17.rename)(stagingDir, liveDir);
      } catch (error3) {
        logger13.error(ctx, "Per-server swap failed", error3, {
          serverIdentifier: server.serverIdentifier,
          sanitizedId: server.sanitizedId
        }, {
          includeStructuredLogs: true
        });
        try {
          await (0, import_promises17.rename)(prevDir, liveDir);
        } catch {
        }
        await (0, import_promises17.rm)(stagingDir, { recursive: true, force: true });
        throw error3;
      }
      await (0, import_promises17.rm)(prevDir, { recursive: true, force: true }).catch(() => {
      });
    } catch (e_3) {
      env_3.error = e_3;
      env_3.hasError = true;
    } finally {
      __disposeResources13(env_3);
    }
  }
  async writeServerDirectory(ctx, server, opts) {
    const env_4 = { stack: [], error: void 0, hasError: false };
    try {
      const _span = __addDisposableResource13(env_4, createSpan(ctx.withName("McpFileSystemWriter.writeServerDirectory")), false);
      const serverDir = (0, import_node_path29.join)(opts.basePath, opts.dirName ?? server.sanitizedId);
      await (0, import_promises17.mkdir)(serverDir, { recursive: true });
      if (server.tools.length > 0) {
        const toolsDir = (0, import_node_path29.join)(serverDir, MCP_TOOLS_SUBDIR);
        await (0, import_promises17.mkdir)(toolsDir, { recursive: true });
        for (const tool of server.tools) {
          const safeToolName = sanitizeFileName(tool.toolName);
          const toolPath = (0, import_node_path29.join)(toolsDir, `${safeToolName}.json`);
          const content = buildMcpToolFileContent(tool);
          await (0, import_promises17.writeFile)(toolPath, JSON.stringify(content, null, 2));
        }
      }
      if (server.resources.length > 0) {
        const resourcesDir = (0, import_node_path29.join)(serverDir, MCP_RESOURCES_SUBDIR);
        await (0, import_promises17.mkdir)(resourcesDir, { recursive: true });
        for (const resource of server.resources) {
          const resourceName = resource.name || resource.uri.replace(/[^a-zA-Z0-9_-]/g, "_");
          const safeResourceName = sanitizeFileName(resourceName);
          const resourcePath = (0, import_node_path29.join)(resourcesDir, `${safeResourceName}.json`);
          const content = {
            uri: resource.uri,
            name: resource.name,
            description: resource.description,
            mimeType: resource.mimeType
          };
          await (0, import_promises17.writeFile)(resourcePath, JSON.stringify(content, null, 2));
        }
      }
      if (server.prompts.length > 0) {
        const promptsDir = (0, import_node_path29.join)(serverDir, MCP_PROMPTS_SUBDIR);
        await (0, import_promises17.mkdir)(promptsDir, { recursive: true });
        for (const prompt of server.prompts) {
          const safePromptName = sanitizeFileName(prompt.name);
          const promptPath = (0, import_node_path29.join)(promptsDir, `${safePromptName}.json`);
          const content = {
            name: prompt.name,
            description: prompt.description,
            arguments: prompt.arguments
          };
          await (0, import_promises17.writeFile)(promptPath, JSON.stringify(content, null, 2));
        }
      }
      if (server.instructions && server.instructions.trim().length > 0) {
        const instructionsPath = (0, import_node_path29.join)(serverDir, INSTRUCTIONS_FILENAME);
        await (0, import_promises17.writeFile)(instructionsPath, server.instructions.trim());
      }
      if (server.status === "error" || server.status === "needsAuth") {
        const statusPath = (0, import_node_path29.join)(serverDir, STATUS_FILENAME);
        const statusMessage = server.status === "error" ? this.getErrorStatusMessage() : this.getNeedsAuthStatusMessageForWrite(server.serverIdentifier);
        await (0, import_promises17.writeFile)(statusPath, statusMessage);
      }
      const metadataPath = (0, import_node_path29.join)(serverDir, SERVER_METADATA_FILENAME);
      const metadataContent = {
        serverIdentifier: server.serverIdentifier,
        serverName: server.serverName
      };
      await (0, import_promises17.writeFile)(metadataPath, JSON.stringify(metadataContent, null, 2));
    } catch (e_4) {
      env_4.error = e_4;
      env_4.hasError = true;
    } finally {
      __disposeResources13(env_4);
    }
  }
  /**
   * Returns McpFileSystemOptions built from the in-memory cached state.
   * This ensures the options match exactly what was written to disk.
   */
  async getMcpFileSystemOptions(ctx, options2) {
    const env_5 = { stack: [], error: void 0, hasError: false };
    try {
      if (this.disposed) {
        return void 0;
      }
      const _span = __addDisposableResource13(env_5, createSpan(ctx.withName("McpFileSystemWriter.getMcpFileSystemOptions")), false);
      const logCtx = this.getLogContext(ctx);
      const writeTimedOut = await this.ensureWritesSettled(ctx, options2?.timeoutMs);
      if (this.snapshotProvider && !writeTimedOut) {
        return this.buildOptionsFromSnapshots(ctx);
      }
      if (this.snapshotProvider && writeTimedOut) {
        logger13.warn(logCtx, "Snapshot mode write barrier timed out; falling back to cached descriptors", {
          timeoutMs: options2?.timeoutMs
        }, {
          includeStructuredLogs: true
        });
      }
      const servers = this.cachedServerData ?? [];
      const mcpDescriptors = servers.map((server) => {
        const tools = server.tools.map((tool) => {
          const safeToolName = sanitizeFileName(tool.toolName);
          const toolFilePath = (0, import_node_path29.join)(server.folderPath, MCP_TOOLS_SUBDIR, `${safeToolName}.json`);
          return new McpToolDescriptor({
            toolName: tool.toolName,
            definitionPath: toolFilePath,
            // Annotations are tiny and behavior-relevant (e.g. steer-aware
            // release gates on readOnlyHint), so they ride the descriptor
            // instead of only the definition file.
            ...toolAnnotationsJsonField(tool.annotations)
          });
        });
        return new McpDescriptor({
          serverIdentifier: server.serverIdentifier,
          serverName: server.serverName,
          plugin: server.plugin,
          marketplace: server.marketplace,
          pluginDbId: server.pluginId,
          marketplaceId: server.marketplaceId,
          folderPath: server.folderPath,
          serverUseInstructions: server.instructions,
          tools
        });
      });
      this.checkDescriptorsVsFilesystem(ctx, mcpDescriptors, "workbench_lease");
      return new McpFileSystemOptions({
        enabled: true,
        workspaceProjectDir: this.projectDir,
        mcpDescriptors
      });
    } catch (e_5) {
      env_5.error = e_5;
      env_5.hasError = true;
    } finally {
      __disposeResources13(env_5);
    }
  }
  async ensureWritesSettled(ctx, timeoutMs) {
    const logCtx = this.getLogContext(ctx);
    const hadPendingDebounce = this.debounceTimer !== void 0;
    if (this.debounceTimer !== void 0) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = void 0;
      this.scheduleWrite(ctx, this.takePendingLeaseChangeEvent());
    }
    if (hadPendingDebounce) {
      logger13.info(logCtx, "getMcpFileSystemOptions force-fired pending debounce");
    }
    if (!this.writePromise) {
      return false;
    }
    if (timeoutMs !== void 0) {
      let timedOut = false;
      let timer2;
      try {
        await Promise.race([
          this.writePromise,
          new Promise((resolve14) => {
            timer2 = setTimeout(() => {
              timedOut = true;
              resolve14();
            }, timeoutMs);
          })
        ]);
      } catch (error3) {
        logger13.error(logCtx, "Error waiting for pending write to complete", error3);
      } finally {
        clearTimeout(timer2);
      }
      if (timedOut) {
        logger13.warn(logCtx, `getMcpFileSystemOptions timed out after ${timeoutMs}ms waiting for write; returning stale cache`);
      }
      return timedOut;
    }
    try {
      await this.writePromise;
    } catch (error3) {
      logger13.error(logCtx, "Error waiting for pending write to complete", error3);
    }
    return false;
  }
  async buildOptionsFromSnapshots(ctx) {
    const env_6 = { stack: [], error: void 0, hasError: false };
    try {
      const _span = __addDisposableResource13(env_6, createSpan(ctx.withName("McpFileSystemWriter.buildOptionsFromSnapshots")), false);
      const logCtx = this.getLogContext(ctx);
      const startMs = Date.now();
      const snapshots = await this.snapshotProvider.getAllSnapshots(ctx);
      const mcpDir = (0, import_node_path29.join)(this.projectDir, MCPS_SUBDIR);
      const mcpDescriptors = snapshots.filter((s3) => s3.tools.length > 0 || s3.resources.length > 0 || s3.prompts.length > 0 || s3.instructions !== void 0 || this.shouldExposeVirtualMcpAuthToolForStatus(s3.serverIdentifier, s3.status) || s3.status === "needsAuth" || s3.status === "error").map((snapshot) => {
        const sanitizedId = sanitizeServerName(snapshot.serverIdentifier);
        const folderPath = (0, import_node_path29.join)(mcpDir, sanitizedId);
        const tools = snapshot.tools.map((tool) => {
          const safeToolName = sanitizeFileName(tool.name);
          return new McpToolDescriptor({
            toolName: tool.name,
            definitionPath: (0, import_node_path29.join)(folderPath, MCP_TOOLS_SUBDIR, `${safeToolName}.json`),
            // Annotations are tiny and behavior-relevant (e.g. steer-aware
            // release gates on readOnlyHint), so they ride the descriptor
            // instead of only the definition file.
            ...toolAnnotationsJsonField(tool.annotations)
          });
        });
        if (this.shouldExposeVirtualMcpAuthToolForStatus(snapshot.serverIdentifier, snapshot.status) && !snapshot.tools.some((t) => t.name === MCP_AUTH_TOOL_NAME)) {
          const safeToolName = sanitizeFileName(MCP_AUTH_TOOL_NAME);
          tools.push(new McpToolDescriptor({
            toolName: MCP_AUTH_TOOL_NAME,
            definitionPath: (0, import_node_path29.join)(folderPath, MCP_TOOLS_SUBDIR, `${safeToolName}.json`)
          }));
        }
        return new McpDescriptor({
          serverIdentifier: snapshot.serverIdentifier,
          serverName: snapshot.serverName,
          plugin: snapshot.plugin,
          marketplace: snapshot.marketplace,
          pluginDbId: snapshot.pluginId,
          marketplaceId: snapshot.marketplaceId,
          folderPath,
          serverUseInstructions: snapshot.instructions,
          tools
        });
      });
      const totalToolCount = mcpDescriptors.reduce((sum, d) => sum + d.tools.length, 0);
      logger13.info(logCtx, `buildOptionsFromSnapshots completed in ${Date.now() - startMs}ms: ${snapshots.length} snapshots, ${mcpDescriptors.length} descriptors, ${totalToolCount} tools`);
      this.checkDescriptorsVsFilesystem(ctx, mcpDescriptors, "snapshot");
      return new McpFileSystemOptions({
        enabled: true,
        workspaceProjectDir: this.projectDir,
        mcpDescriptors
      });
    } catch (e_6) {
      env_6.error = e_6;
      env_6.hasError = true;
    } finally {
      __disposeResources13(env_6);
    }
  }
  /**
   * Wait for any pending write operation to complete.
   * Useful for testing to ensure files are written before assertions.
   */
  async waitForPendingWrites() {
    if (this.debounceTimer !== void 0) {
      await new Promise((resolve14) => {
        const checkTimer = () => {
          if (this.debounceTimer === void 0) {
            resolve14();
          } else {
            setTimeout(checkTimer, 10);
          }
        };
        checkTimer();
      });
    }
    if (this.writePromise) {
      try {
        await this.writePromise;
      } catch {
      }
    }
  }
  /** For testing. */
  getCachedServerData() {
    return this.cachedServerData;
  }
  /**
   * Fire-and-forget divergence check between expected state (from lease/snapshot) and filesystem.
   * Rate-limited to once per DIVERGENCE_CHECK_COOLDOWN_MS to avoid thrash.
   *
   * This detects "silent failures" where the UI shows MCP as connected but
   * tools weren't written to disk (SEV-472, SEV-636 pattern).
   *
   * @param descriptors - The MCP descriptors representing expected state
   * @param source - Which system produced the descriptors (for metrics)
   */
  checkDescriptorsVsFilesystem(ctx, descriptors, source) {
    const logCtx = this.getLogContext(ctx);
    const now = Date.now();
    if (now - this.lastDivergenceCheckMs < _McpFileSystemWriter.DIVERGENCE_CHECK_COOLDOWN_MS) {
      return;
    }
    this.lastDivergenceCheckMs = now;
    void this._checkDescriptorsVsFilesystemAsync(ctx, descriptors, source).catch((err) => {
      logger13.warn(logCtx, "Divergence check failed", err);
    });
  }
  async _checkDescriptorsVsFilesystemAsync(ctx, descriptors, source) {
    const logCtx = this.getLogContext(ctx);
    const mcpsPath = (0, import_node_path29.join)(this.projectDir, MCPS_SUBDIR);
    const expectedServerIds = /* @__PURE__ */ new Set();
    const expectedToolCounts = /* @__PURE__ */ new Map();
    for (const descriptor2 of descriptors) {
      const sanitizedId = sanitizeServerName(descriptor2.serverIdentifier);
      expectedServerIds.add(sanitizedId);
      expectedToolCounts.set(sanitizedId, descriptor2.tools.length);
    }
    let actualDirs = [];
    try {
      actualDirs = await (0, import_promises17.readdir)(mcpsPath);
      actualDirs = actualDirs.filter((d) => !d.endsWith(STAGING_SUFFIX) && !d.endsWith(PREV_SUFFIX));
    } catch (err) {
      if (err?.code !== "ENOENT") {
        throw err;
      }
    }
    const actualServerIds = new Set(actualDirs);
    let synced = true;
    let serversMissing = 0;
    let serversStale = 0;
    let toolMismatches = 0;
    const serversBucket = configuredServersBucket(expectedServerIds.size);
    for (const expected of expectedServerIds) {
      if (!actualServerIds.has(expected)) {
        synced = false;
        serversMissing++;
        mcpFilesystemDivergence.increment(ctx, 1, this.getMetricTags({
          divergence_type: "server_missing",
          mcp_source: source,
          configured_servers: serversBucket
        }));
        logger13.warn(logCtx, "Divergence detected: server missing from filesystem", {
          mcpFileSystemMeta: {
            divergenceType: "server_missing",
            serverId: expected,
            source,
            configuredServers: expectedServerIds.size,
            configuredServersBucket: serversBucket
          }
        }, { includeStructuredLogs: true });
      }
    }
    for (const actual of actualServerIds) {
      if (!expectedServerIds.has(actual)) {
        synced = false;
        serversStale++;
        mcpFilesystemDivergence.increment(ctx, 1, this.getMetricTags({
          divergence_type: "server_stale",
          mcp_source: source,
          configured_servers: serversBucket
        }));
      }
    }
    for (const serverId of expectedServerIds) {
      if (!actualServerIds.has(serverId)) {
        continue;
      }
      const expectedCount = expectedToolCounts.get(serverId) ?? 0;
      const toolsPath = (0, import_node_path29.join)(mcpsPath, serverId, MCP_TOOLS_SUBDIR);
      let actualCount = 0;
      try {
        const files = await (0, import_promises17.readdir)(toolsPath);
        actualCount = files.filter((f2) => f2.endsWith(".json")).length;
      } catch {
      }
      if (actualCount !== expectedCount) {
        synced = false;
        toolMismatches++;
        mcpFilesystemDivergence.increment(ctx, 1, this.getMetricTags({
          divergence_type: "tool_count_mismatch",
          mcp_source: source,
          configured_servers: serversBucket
        }));
        logger13.warn(logCtx, "Divergence detected: tool count mismatch", {
          mcpFileSystemMeta: {
            divergenceType: "tool_count_mismatch",
            serverId,
            expected: expectedCount,
            actual: actualCount,
            source,
            configuredServers: expectedServerIds.size,
            configuredServersBucket: serversBucket
          }
        }, { includeStructuredLogs: true });
      }
    }
    mcpFilesystemSyncCheck.increment(ctx, 1, this.getMetricTags({
      synced: String(synced),
      mcp_source: source,
      configured_servers: serversBucket
    }));
    mcpFilesystemSyncExpectedServers.gauge(ctx, expectedServerIds.size, this.getMetricTags({
      mcp_source: source
    }));
    mcpFilesystemSyncActualServers.gauge(ctx, actualServerIds.size, this.getMetricTags({
      mcp_source: source
    }));
    mcpFilesystemSyncServersMissing.gauge(ctx, serversMissing, this.getMetricTags({
      mcp_source: source
    }));
    mcpFilesystemSyncToolMismatches.gauge(ctx, toolMismatches, this.getMetricTags({
      mcp_source: source
    }));
    logger13.info(logCtx, "MCP filesystem sync check", {
      mcpFileSystemMeta: {
        synced,
        expectedServers: expectedServerIds.size,
        actualServers: actualServerIds.size,
        serversMissing,
        serversStale,
        toolMismatches,
        source,
        configuredServers: expectedServerIds.size,
        configuredServersBucket: serversBucket
      }
    }, { includeStructuredLogs: true });
    if (!synced) {
      logger13.warn(logCtx, "MCP filesystem divergence summary", {
        mcpFileSystemMeta: {
          synced,
          expectedServers: expectedServerIds.size,
          actualServers: actualServerIds.size,
          serversMissing,
          serversStale,
          toolMismatches,
          source,
          configuredServers: expectedServerIds.size,
          configuredServersBucket: serversBucket
        }
      }, { includeStructuredLogs: true });
    }
  }
  dispose() {
    if (this.disposed) {
      return;
    }
    this.disposed = true;
    if (this.debounceTimer !== void 0) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = void 0;
    }
    if (this.leaseChangeDisposable) {
      this.leaseChangeDisposable.dispose();
      this.leaseChangeDisposable = void 0;
    }
    this.cachedServerData = void 0;
    this.cachedFingerprints.clear();
  }
};
McpFileSystemWriter.DIVERGENCE_CHECK_COOLDOWN_MS = 1e4;

