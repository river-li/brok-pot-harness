/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/node/mcp/tools-discovery.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/3
var import_node_crypto52 = require("node:crypto");
init_dist4();
init_scheduling();
init_esm();
init_errors();
init_proto();

// @recovered-fragment 2/3
init_mcp_diagnostics();

// @recovered-fragment 3/3
var MCP_TOOLS_CACHE_TTL_MS = 24 * 60 * 60 * 1e3;
var TOOLS_DISCOVERY_DEADLINE_MS = 12e4;
var TOOLS_DISCOVERY_DEADLINE = createDeadlinePolicy({
  name: "mcp-tools-discovery",
  timeoutMs: TOOLS_DISCOVERY_DEADLINE_MS
});
function applyCustomInstructionsToMcpResult(result, serverName, rawInstructions) {
  const instructions = rawInstructions.trim();
  if (instructions.length === 0) return result;
  if (result.result.case !== "success") return result;
  const success2 = result.result.value;
  const note = new McpToolResultContentItem({
    content: {
      case: "text",
      value: new McpTextContent({
        text: formatMcpCustomInstructionToolNote(serverName, instructions)
      })
    }
  });
  return new McpResult({
    result: {
      case: "success",
      value: new McpSuccess({
        content: [note, ...success2.content],
        isError: success2.isError,
        structuredContent: success2.structuredContent
      })
    }
  });
}
function createMcpToolsDiscovery(core2, deps = {}) {
  let boxMcpExecSlot = deps.boxMcpExec;
  let lastPushedBoxConfigJson = null;
  let hasEverPushedBoxConfig = false;
  let boxPushChain = Promise.resolve();
  let toolsCacheEntry = null;
  let toolsCacheEpoch = 0;
  let toolsColdWarmScheduled = false;
  const firstCallReported = /* @__PURE__ */ new Map();
  function _isBackendDisplayServer(server) {
    return server.config == null || "url" in server.config;
  }
  function _reportFirstCall(providerIdentifier, ok) {
    if (deps.onConnectorAuth == null) return;
    const entry = firstCallReported.get(providerIdentifier) ?? { ok: false, failed: false };
    if (ok ? entry.ok : entry.failed) return;
    if (ok) entry.ok = true;
    else entry.failed = true;
    firstCallReported.set(providerIdentifier, entry);
    const row = _displayRowForIdentifier(providerIdentifier);
    const serverUrl = row?.config != null && "url" in row.config && typeof row.config.url === "string" ? row.config.url : void 0;
    deps.onConnectorAuth({
      phase: "first_call_ok",
      outcome: ok ? "ok" : "failed",
      serverName: row?.name,
      serverId: row?.id,
      ...serverUrl == null || serverUrl.length === 0 ? {} : { serverUrl }
    });
  }
  async function _getTools(ctx, mcpConfigJson) {
    return _filterDisabledTools(await _getToolsRaw(ctx, mcpConfigJson));
  }
  async function _getToolsRaw(_ctx, mcpConfigJson) {
    return (await _getDiscovered(mcpConfigJson)).tools;
  }
  async function _getServerStatuses(mcpConfigJson) {
    return (await _getDiscovered(mcpConfigJson)).statuses;
  }
  async function _getDiscovered(mcpConfigJson) {
    const entry = toolsCacheEntry;
    const serverNames = _peekDiscoveryServerNames();
    if (entry !== null && entry.fulfilled === void 0) {
      const inFlightRequestedKey = serverNames === void 0 ? void 0 : _toolServerSetKey(serverNames, mcpConfigJson);
      if (inFlightRequestedKey === entry.requestedKey) {
        if (entry.stale !== void 0) {
          return entry.stale;
        }
        return await entry.promise;
      }
      if (inFlightRequestedKey !== void 0) {
        return await _startToolsResolution(inFlightRequestedKey, false, mcpConfigJson).promise;
      }
      return await _resolveColdThenAdopt(mcpConfigJson);
    }
    if (entry?.fulfilled !== void 0 && serverNames !== void 0) {
      const key = _toolServerSetKey(serverNames, mcpConfigJson);
      if (entry.fulfilled.resolvedKey === key) {
        if (Date.now() - entry.fulfilled.atMs >= MCP_TOOLS_CACHE_TTL_MS) {
          _startToolsResolution(key, true, mcpConfigJson);
        }
        return entry.fulfilled;
      }
    }
    if (serverNames !== void 0) {
      const key = _toolServerSetKey(serverNames, mcpConfigJson);
      return await _startToolsResolution(key, false, mcpConfigJson).promise;
    }
    return await _resolveColdThenAdopt(mcpConfigJson);
  }
  async function _resolveColdThenAdopt(mcpConfigJson) {
    const epoch = toolsCacheEpoch;
    const discovered = await _getToolsViaBackend(mcpConfigJson);
    if (mcpConfigJson === void 0 && epoch === toolsCacheEpoch && toolsCacheEntry === null && discovered.resolvedKey !== "") {
      toolsCacheEntry = {
        requestedKey: discovered.resolvedKey,
        promise: Promise.resolve(discovered),
        fulfilled: { ...discovered, atMs: Date.now() },
        stale: void 0
      };
    }
    return discovered;
  }
  async function _getToolsForTurnStart(ctx, mcpConfigJson) {
    if (mcpConfigJson !== void 0) {
      return _getTools(ctx, mcpConfigJson);
    }
    const serverNames = _peekDiscoveryServerNames();
    if (serverNames === void 0) {
      _scheduleColdStartWarm();
      return [];
    }
    const key = _toolServerSetKey(serverNames, mcpConfigJson);
    if (key === "") {
      _dropSettledCacheForEmptyServerSet();
      return [];
    }
    if (!_toolsEntryUsable(key)) {
      _startToolsResolution(key, true, mcpConfigJson);
    }
    return _filterDisabledTools(_currentDiscoveredForKey(key)?.tools ?? []);
  }
  function _displayRowForIdentifier(identifier) {
    return core2.lastAccountDisplayConfig()?.servers.find(
      (server) => server.serverIdentifier != null && displayRowOwnsIdentifier(identifier, server.serverIdentifier, server.accounts)
    );
  }
  function _filterDisabledTools(tools) {
    const disabledByServerId = core2.settingsStore().getMcpDisabledToolsByServerId();
    if (Object.keys(disabledByServerId).length === 0) {
      return tools;
    }
    return tools.filter((tool) => {
      const row = _displayRowForIdentifier(tool.providerIdentifier);
      if (row == null) return true;
      return !(disabledByServerId[row.id]?.includes(tool.toolName) ?? false);
    });
  }
  function _countEnabledTools(serverId, tools) {
    const disabled = core2.settingsStore().getMcpDisabledToolsByServerId()[serverId];
    if (disabled == null || disabled.length === 0) {
      return tools.length;
    }
    return tools.filter((tool) => !disabled.includes(tool.toolName)).length;
  }
  function _toolServerSetKey(serverNames, mcpConfigJson) {
    const base = [...serverNames].sort().join("\0");
    return mcpConfigJson === void 0 ? base : `${base}${mcpConfigJson}`;
  }
  function _peekDiscoveryServerNames() {
    const httpServerNames = core2.definitionSource.peekHttpServerNames();
    if (httpServerNames === void 0) {
      return void 0;
    }
    const names3 = [.../* @__PURE__ */ new Set([...httpServerNames, ..._grokNativeIdentifiers()])];
    if (boxMcpExecSlot == null) {
      return names3;
    }
    return [...names3, ...core2.definitionSource.peekStdioServerNames() ?? []];
  }
  function _grokNativeIdentifiers() {
    return core2.lastAccountDisplayConfig()?.servers.flatMap(
      (server) => server.config == null && server.serverIdentifier != null ? [server.serverIdentifier] : []
    ) ?? [];
  }
  async function _listBoxServers(serverIdentifiers, options2) {
    const boxMcpExec = boxMcpExecSlot;
    if (boxMcpExec == null) {
      throw new SandMcpConfigError("This surface has no box MCP execution port.");
    }
    const { accountConfigAdopted = false, ...listOptions } = options2 ?? {};
    if (accountConfigAdopted) {
      core2.definitionSource.reloadBoxServers();
    } else {
      await core2.definitionSource.ensureConfigLoaded();
    }
    await _ensureBoxServersPushed();
    const servers = await boxMcpExec.listTools(serverIdentifiers, listOptions);
    return servers.map((server) => {
      const row = _displayRowForIdentifier(server.serverIdentifier);
      if (row == null || server.tools.length === 0) return server;
      return {
        ...server,
        toolCount: _countEnabledTools(row.id, server.tools)
      };
    });
  }
  async function _stdioServerNamesForBox() {
    if (boxMcpExecSlot == null) {
      return [];
    }
    return Object.keys(await core2.definitionSource.getStdioServerConfigs());
  }
  async function _ensureBoxServersPushed() {
    const boxMcpExec = boxMcpExecSlot;
    if (boxMcpExec == null) {
      return;
    }
    let stdioConfigs;
    try {
      stdioConfigs = await core2.definitionSource.getPushedServerConfigs();
    } catch (error42) {
      reportMcpHostEdgeFailure("box-config-push", error42);
      return;
    }
    const configJson = JSON.stringify({ mcpServers: stdioConfigs });
    if (configJson === lastPushedBoxConfigJson) {
      return;
    }
    if (Object.keys(stdioConfigs).length === 0 && !hasEverPushedBoxConfig) {
      return;
    }
    const push = boxPushChain.then(async () => {
      if (configJson === lastPushedBoxConfigJson) {
        return;
      }
      await boxMcpExec.loadServers(configJson);
      lastPushedBoxConfigJson = configJson;
      hasEverPushedBoxConfig = true;
    });
    boxPushChain = push.catch((error42) => {
      reportMcpHostEdgeFailure("box-config-push", error42);
    });
    await push;
  }
  function _currentDiscoveredForKey(key) {
    const entry = toolsCacheEntry;
    if (entry === null) {
      return void 0;
    }
    if (entry.fulfilled?.resolvedKey === key) {
      return entry.fulfilled;
    }
    if (entry.requestedKey === key) {
      return entry.stale;
    }
    return void 0;
  }
  function _toolsEntryUsable(key) {
    const entry = toolsCacheEntry;
    if (entry === null) {
      return false;
    }
    if (entry.fulfilled === void 0) {
      return entry.requestedKey === key;
    }
    return entry.fulfilled.resolvedKey === key && Date.now() - entry.fulfilled.atMs < MCP_TOOLS_CACHE_TTL_MS;
  }
  function _dropSettledCacheForEmptyServerSet() {
    if (toolsCacheEntry?.fulfilled !== void 0) {
      toolsCacheEntry = null;
    }
  }
  function _scheduleColdStartWarm() {
    if (toolsColdWarmScheduled) {
      return;
    }
    toolsColdWarmScheduled = true;
    const epoch = toolsCacheEpoch;
    void _warmToolsCache(epoch).finally(() => {
      toolsColdWarmScheduled = false;
    });
  }
  function _startToolsResolution(requestedKey, carryStale, mcpConfigJson) {
    const stale = carryStale ? _currentDiscoveredForKey(requestedKey) : void 0;
    const startedAtMs = Date.now();
    const entry = {
      requestedKey,
      promise: _getToolsViaBackend(mcpConfigJson),
      fulfilled: void 0,
      stale
    };
    toolsCacheEntry = entry;
    void entry.promise.then(
      ({ tools, statuses, resolvedKey }) => {
        if (toolsCacheEntry === entry) {
          entry.fulfilled = { tools, statuses, resolvedKey, atMs: Date.now() };
        }
      },
      (error42) => {
        if (toolsCacheEntry === entry) {
          if (entry.stale === void 0) {
            toolsCacheEntry = null;
          } else {
            entry.fulfilled = {
              tools: entry.stale.tools,
              statuses: entry.stale.statuses,
              resolvedKey: entry.requestedKey,
              atMs: 0
            };
          }
        }
        const errorClass = errorClassOf(error42);
        deps.onDiscoveryFailed?.({
          errorClass,
          elapsedMs: Date.now() - startedAtMs,
          servedStale: stale !== void 0
        });
      }
    );
    return entry;
  }
  function _invalidateToolsCache() {
    const epoch = ++toolsCacheEpoch;
    toolsCacheEntry = null;
    firstCallReported.clear();
    void _warmToolsCache(epoch).catch(() => {
    });
  }
  async function _warmToolsCache(epoch) {
    const [httpServerNames, stdioServerNames] = await Promise.all([
      _httpServerNamesForBackend(),
      _stdioServerNamesForBox()
    ]);
    if (epoch !== toolsCacheEpoch) {
      return;
    }
    const key = _toolServerSetKey([...httpServerNames, ...stdioServerNames]);
    if (key === "") {
      _dropSettledCacheForEmptyServerSet();
      return;
    }
    if (!_toolsEntryUsable(key)) {
      _startToolsResolution(key, false);
    }
  }
  async function _executeTool(ctx, args, auditIdentity, mcpConfigJson) {
    const displayServer = _displayRowForIdentifier(args.providerIdentifier);
    const displayName2 = displayServer?.name ?? args.providerIdentifier;
    if (displayServer != null && (core2.settingsStore().getMcpDisabledToolsByServerId()[displayServer.id]?.includes(args.toolName) ?? false)) {
      return new McpResult({
        result: {
          case: "error",
          value: new McpError({
            error: `Tool "${args.toolName}" is disabled for "${displayName2}".`
          })
        }
      });
    }
    const mcpResult = await _executeToolRaw(ctx, args, auditIdentity, mcpConfigJson);
    const withInstructions = applyCustomInstructionsToMcpResult(
      mcpResult,
      displayName2,
      resolveMcpCustomInstruction(
        displayName2,
        core2.settingsStore().getRawMcpCustomInstructionByServerId(displayServer?.id ?? "") ?? core2.settingsStore().getRawMcpCustomInstruction(displayName2)
      )
    );
    return withInstructions;
  }
  async function _resolveProviderTransport(providerIdentifier) {
    if (await _isHttpProvider(providerIdentifier)) return "http";
    if (await _isBoxStdioProvider(providerIdentifier)) return "stdio";
    return "unknown";
  }
  async function _executeToolRaw(ctx, args, auditIdentity, mcpConfigJson) {
    if (await _isHttpProvider(args.providerIdentifier, mcpConfigJson)) {
      const result = await core2.backendMcpExec.executeTool(ctx, {
        serverIdentifier: args.providerIdentifier,
        toolName: args.name,
        args: toJsonArgs(args.args),
        toolCallId: args.toolCallId,
        agentId: auditIdentity?.agentId,
        mcpConfigJson
      });
      _reportFirstCall(args.providerIdentifier, result.result.case !== "error");
      return result;
    }
    const boxMcpExec = boxMcpExecSlot;
    const boxProviderKind = await _boxStdioProviderKind(args.providerIdentifier, mcpConfigJson);
    if (boxMcpExec != null && boxProviderKind !== void 0) {
      try {
        await _ensureBoxServersPushed();
      } catch (error42) {
        return new McpResult({
          result: {
            case: "error",
            value: new McpError({
              error: `Could not load MCP servers onto Grok Bot's computer: ${errorMessage(error42)}`
            })
          }
        });
      }
      return await boxMcpExec.executeTool(ctx, args, {
        agentId: boxProviderKind === "account" ? auditIdentity?.agentId : void 0
      });
    }
    return new McpResult({
      result: {
        case: "error",
        value: new McpError({
          error: `MCP server "${args.providerIdentifier}" is not available here. HTTP/SSE servers execute on the backend and stdio servers run on Grok Bot's computer; this server is neither reachable nor supported in this context.`
        })
      }
    });
  }
  function _getToolsViaBackend(mcpConfigJson) {
    return TOOLS_DISCOVERY_DEADLINE.run(() => _fetchToolsViaBackend(mcpConfigJson));
  }
  async function _fetchToolsViaBackend(mcpConfigJson) {
    const [httpServerNames, stdioServerNames] = await Promise.all([
      _httpServerNamesForBackend(),
      _stdioServerNamesForBox()
    ]);
    const resolvedKey = _toolServerSetKey([...httpServerNames, ...stdioServerNames], mcpConfigJson);
    const boxStdioServerNamesExcludingInlineScope = mcpConfigJson === void 0 ? stdioServerNames : [];
    const [httpResult, boxResult] = await Promise.allSettled([
      _discoverHttpTools(httpServerNames, mcpConfigJson),
      _discoverBoxTools(boxStdioServerNamesExcludingInlineScope)
    ]);
    if (httpResult.status === "rejected") {
      throw httpResult.reason;
    }
    if (boxResult.status === "rejected") {
      if (httpServerNames.length === 0) {
        throw boxResult.reason;
      }
      reportMcpHostEdgeFailure("box-list-tools", boxResult.reason);
      return { ...httpResult.value, resolvedKey };
    }
    return {
      tools: [...httpResult.value.tools, ...boxResult.value.tools],
      statuses: new Map([...httpResult.value.statuses, ...boxResult.value.statuses]),
      resolvedKey
    };
  }
  function _noDiscoveredServers() {
    return { tools: [], statuses: /* @__PURE__ */ new Map() };
  }
  async function _discoverHttpTools(serverIdentifiers, mcpConfigJson) {
    const requested = mcpConfigJson === void 0 ? serverIdentifiers : [];
    if (requested.length === 0 && mcpConfigJson === void 0) {
      return _noDiscoveredServers();
    }
    const servers = await core2.backendMcpExec.listTools(requested, mcpConfigJson);
    if (servers.length === 0) {
      reportMcpHostEdgeDegraded("backend-list-tools", "none_resolved");
      return _noDiscoveredServers();
    }
    const tools = [];
    const statuses = /* @__PURE__ */ new Map();
    for (const server of servers) {
      tools.push(...server.tools);
      const ownerRow = _displayRowForIdentifier(server.serverIdentifier);
      const slot = ownerRow?.accounts?.find(
        (candidate) => candidate.serverIdentifier === server.serverIdentifier
      );
      statuses.set(server.serverIdentifier, statusForBackendSlot(ownerRow, server, slot).status);
    }
    return { tools, statuses };
  }
  async function _discoverBoxTools(stdioServerNames) {
    const boxMcpExec = boxMcpExecSlot;
    if (boxMcpExec == null) {
      return _noDiscoveredServers();
    }
    if (stdioServerNames.length === 0) {
      try {
        await _ensureBoxServersPushed();
      } catch (error42) {
        reportMcpHostEdgeFailure("box-config-reconcile", error42);
      }
      return _noDiscoveredServers();
    }
    await _ensureBoxServersPushed();
    const servers = await boxMcpExec.listTools(stdioServerNames);
    const tools = [];
    const statuses = /* @__PURE__ */ new Map();
    for (const server of servers) {
      if (server.status === "error") {
        reportBoxStdioErrorStatus(server.serverIdentifier, server.statusDetail);
      }
      tools.push(...server.tools);
      statuses.set(
        server.serverIdentifier,
        statusFromBoxListStatus(server.status, false, server.statusDetail).status
      );
    }
    return { tools, statuses };
  }
  async function _httpServerNamesForBackend() {
    const userServers = await core2.definitionSource.getUserServerConfigs();
    const configured2 = Object.entries(userServers).filter(([, config2]) => "url" in config2).map(([name17]) => name17);
    return [.../* @__PURE__ */ new Set([...configured2, ..._grokNativeIdentifiers()])];
  }
  function _inlineHttpServerNames(mcpConfigJson) {
    const config2 = parseAccountMcpConfigJson(mcpConfigJson);
    const names3 = /* @__PURE__ */ new Set();
    for (const [name17, server] of Object.entries(config2?.mcpServers ?? {})) {
      if ("url" in server) {
        names3.add(name17);
      }
    }
    return names3;
  }
  async function _isHttpProvider(providerIdentifier, mcpConfigJson) {
    if (mcpConfigJson !== void 0) {
      return _inlineHttpServerNames(mcpConfigJson).has(providerIdentifier);
    }
    try {
      const echoedRow = _displayRowForIdentifier(providerIdentifier);
      if (echoedRow != null) {
        return _isBackendDisplayServer(echoedRow);
      }
      if (await core2.definitionSource.getServerUrlForIdentifier(providerIdentifier) !== void 0) {
        return true;
      }
      const rowPublishedByAwaitedConfigLoad = _displayRowForIdentifier(providerIdentifier);
      return rowPublishedByAwaitedConfigLoad != null ? _isBackendDisplayServer(rowPublishedByAwaitedConfigLoad) : false;
    } catch (error42) {
      reportMcpHostEdgeFailure("definition-read", error42);
      return false;
    }
  }
  async function _boxStdioProviderKind(providerIdentifier, mcpConfigJson) {
    if (mcpConfigJson !== void 0) {
      return void 0;
    }
    try {
      if (providerIdentifier in await core2.definitionSource.getStdioServerConfigs()) {
        return "account";
      }
      return providerIdentifier in await core2.definitionSource.getPushedServerConfigs() ? "pushed" : void 0;
    } catch (error42) {
      reportMcpHostEdgeFailure("definition-read", error42);
      return void 0;
    }
  }
  async function _isBoxStdioProvider(providerIdentifier, mcpConfigJson) {
    return await _boxStdioProviderKind(providerIdentifier, mcpConfigJson) !== void 0;
  }
  function _setBoxMcpExec(next) {
    boxMcpExecSlot = next;
    lastPushedBoxConfigJson = null;
    _invalidateToolsCache();
  }
  function _executeToolCall(call) {
    return _executeTool(
      createContext(),
      new McpArgs({
        name: `${call.serverIdentifier}-${call.toolName}`,
        toolName: call.toolName,
        providerIdentifier: call.serverIdentifier,
        toolCallId: (0, import_node_crypto52.randomUUID)(),
        args: Object.fromEntries(
          Object.entries(call.args).map(([key, value]) => [key, Value.fromJson(value)])
        )
      })
    );
  }
  return {
    getTools: _getTools,
    getToolsRaw: () => _getToolsRaw(createContext()),
    getToolsForTurnStart: _getToolsForTurnStart,
    getServerStatuses: _getServerStatuses,
    listBoxServers: _listBoxServers,
    resolveProviderTransport: _resolveProviderTransport,
    executeTool: _executeTool,
    executeToolCall: _executeToolCall,
    setBoxMcpExec: _setBoxMcpExec,
    invalidateToolsCache: _invalidateToolsCache,
    resetPushState: () => {
      lastPushedBoxConfigJson = null;
    },
    isBoxExecWired: () => boxMcpExecSlot != null,
    reconcileBoxServers: () => {
      hasEverPushedBoxConfig = true;
      return _ensureBoxServersPushed();
    }
  };
}
var SandMcpExecutor = class {
  constructor(discovery, persistImage, spillLargeText, auditIdentity, mcpConfigJson) {
    this.discovery = discovery;
    this.persistImage = persistImage;
    this.spillLargeText = spillLargeText;
    this.auditIdentity = auditIdentity;
    this.mcpConfigJson = mcpConfigJson;
  }
  discovery;
  persistImage;
  spillLargeText;
  auditIdentity;
  mcpConfigJson;
  async execute(ctx, args) {
    const result = await this.discovery.executeTool(
      ctx,
      args,
      this.auditIdentity,
      this.mcpConfigJson
    );
    const spilled = this.spillLargeText != null ? await this.spillLargeText(ctx, result) : result;
    if (this.persistImage == null) return spilled;
    return await augmentMcpResultWithSavedImages(spilled, this.persistImage);
  }
};

