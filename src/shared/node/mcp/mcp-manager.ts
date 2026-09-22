/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/node/mcp/mcp-manager.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/3
init_scheduling();

// @recovered-fragment 2/3
init_mcp_diagnostics();

// @recovered-fragment 3/3
var EMPTY_MCP_SETTINGS = {
  getActiveAccountScope: () => void 0,
  migrateMcpCustomInstructionToServerId: () => {
  },
  getMcpCustomInstructions: () => ({}),
  getMcpCustomInstructionsByServerId: () => ({}),
  getMcpDisabledToolsByServerId: () => ({}),
  setMcpDisabledToolsByServerId: () => {
  },
  getRawMcpCustomInstruction: () => void 0,
  getRawMcpCustomInstructionByServerId: () => void 0,
  setMcpCustomInstructionByServerId: () => {
  },
  deleteMcpCustomInstructionByServerId: () => {
  }
};
function findDisplayServerByAddress(servers, address) {
  return servers.find((server) => server.id === address) ?? servers.find((server) => server.serverIdentifier === address);
}
var SandMcpManager = class {
  definitionSource;
  settingsStore;
  boxRuntime;
  accountMcpWriter;
  effectivePluginsProvider;
  backendMcpExec;
  accountDisplayConfigProvider;
  accountServersProvider;
  grokBotAgentServersProvider;
  accountServersPromise;
  accountServersGeneration = 0;
  lastAccountCacheScope;
  lastAccountCredentialFingerprint;
  catalogFlow;
  authWatches;
  summaries;
  instructionsAndToggles;
  accountSlots;
  onDiscoveryFailed;
  onAccountScopeApplied;
  constructor(options2) {
    this.settingsStore = options2.settingsStore ?? EMPTY_MCP_SETTINGS;
    this.onDiscoveryFailed = options2.onDiscoveryFailed;
    this.onAccountScopeApplied = options2.onAccountScopeApplied;
    this.accountMcpWriter = options2.accountMcpWriter;
    this.effectivePluginsProvider = options2.effectivePluginsProvider;
    this.backendMcpExec = options2.backendMcpExec;
    this.boxRuntime = options2.boxRuntime;
    this.authWatches = new SandMcpAuthWatchLifecycle({
      backendMcpExec: options2.backendMcpExec,
      authWatchPollIntervalMs: options2.authWatchPollIntervalMs ?? AUTH_WATCH_POLL_INTERVAL_MS,
      authWatchTimeoutMs: options2.authWatchTimeoutMs ?? AUTH_WATCH_TIMEOUT_MS,
      authWatchPollTimeoutMs: options2.authWatchPollTimeoutMs ?? AUTH_WATCH_POLL_TIMEOUT_MS,
      clock: options2.clock ?? realClock,
      resolveDisplayServer: (rawServerId, resolveOptions2) => this.resolveDisplayServer(rawServerId, resolveOptions2),
      reload: () => this.reload(),
      ...options2.onConnectorAuth == null ? {} : { onConnectorAuth: options2.onConnectorAuth }
    });
    this.summaries = new SandMcpListingSummaries({
      settingsStore: () => this.settingsStore,
      isBoxExecWired: () => this.boxRuntime?.isBoxExecWired() === true
    });
    this.instructionsAndToggles = new SandMcpInstructionsAndToggles({
      settingsStore: () => this.settingsStore,
      resolveListedDisplayServer: (rawServerId) => this.resolveListedDisplayServer(rawServerId),
      listServers: () => this.listServers(),
      lastAccountDisplayConfig: () => this.lastAccountDisplayConfigView(),
      getToolsRaw: async () => await this.boxRuntime?.getToolsRaw() ?? []
    });
    this.catalogFlow = new SandMcpCatalogFlow({
      backend: options2.backend,
      getMachineId: options2.getMachineId,
      marketplace: options2.marketplace,
      listEffectivePlugins: () => this.listEffectivePlugins(),
      fetchMarketplacePlugins: options2.fetchMarketplacePlugins,
      requireAccountWriter: () => this.requireAccountWriter(),
      reloadServers: () => this.reloadServers()
    });
    this.accountServersProvider = options2.accountServersProvider;
    this.grokBotAgentServersProvider = options2.grokBotAgentServersProvider;
    this.accountDisplayConfigProvider = options2.accountServersProvider == null ? options2.accountDisplayConfigProvider : () => this.loadAccountServers();
    this.definitionSource = new SandMcpDefinitionSource(
      options2.includeBuiltins === false ? void 0 : options2.builtins,
      options2.accountServersProvider == null ? options2.accountConfigProvider : async () => runtimeConfigFromDisplay(await this.loadAccountServers()),
      options2.boxServers
    );
    this.accountSlots = new SandMcpAccountSlotLifecycle({
      backendMcpExec: options2.backendMcpExec,
      definitionSource: this.definitionSource,
      resolveDisplayServer: (rawServerId) => this.resolveDisplayServer(rawServerId),
      reloadServers: () => this.reloadServers(),
      clearPendingAuthWatch: (serverId, accountKey) => this.authWatches.clearPendingAuthWatchCancelled(serverId, accountKey),
      notifyWatchCancelled: (watch4) => this.authWatches.notifyWatchCancelled(watch4),
      invalidateToolsCache: () => this.boxRuntime?.invalidateToolsCache(),
      resetPushState: () => this.boxRuntime?.resetPushState()
    });
  }
  loadAccountServers() {
    if (this.accountServersPromise != null) {
      return this.accountServersPromise;
    }
    const generation = ++this.accountServersGeneration;
    const promise2 = (this.accountServersProvider?.() ?? Promise.resolve(null)).then((display) => {
      const cachedForScope = display?.cacheScope !== void 0 && display.cacheScope === this.lastAccountCacheScope ? this.lastAccountDisplayConfigView() : null;
      if (generation !== this.accountServersGeneration) return cachedForScope;
      if (display == null) {
        this.definitionSource.clearLastKnownAccountConfig();
        return null;
      }
      if (display.cacheScope !== void 0 && display.cacheScope !== this.lastAccountCacheScope) {
        const activeAccountScope = this.settingsStore.getActiveAccountScope();
        const isForeignConfig = activeAccountScope !== void 0 && activeAccountScope !== display.cacheScope;
        if (isForeignConfig) {
          reportMcpHostEdgeDegraded("account-scope-mismatch", "scope_mismatch");
          return this.lastAccountCacheScope === activeAccountScope ? this.lastAccountDisplayConfigView() : null;
        }
        if (this.lastAccountCacheScope !== void 0) {
          this.accountSlots.clearAccountDisplayState();
          this.authWatches.clearAllPendingAuthWatchesCancelled();
          this.lastAccountCredentialFingerprint = void 0;
          this.boxRuntime?.invalidateToolsCache();
        }
        this.lastAccountCacheScope = display.cacheScope;
        if (activeAccountScope !== void 0) {
          this.onAccountScopeApplied?.();
        }
        this.definitionSource.clearLastKnownAccountConfig();
        this.definitionSource.clearCache();
      }
      if (display.unavailable === true) {
        if (cachedForScope == null) this.accountServersPromise = void 0;
        return cachedForScope;
      }
      const resolvedDisplay = mergeUnresolvedAccountServers(display, cachedForScope);
      this.accountSlots.noteAccountDisplayConfig(resolvedDisplay);
      this.definitionSource.adoptAccountConfig(runtimeConfigFromDisplay(resolvedDisplay));
      const fingerprint = accountCredentialFingerprint(resolvedDisplay);
      if (this.lastAccountCredentialFingerprint !== void 0 && this.lastAccountCredentialFingerprint !== fingerprint) {
        this.boxRuntime?.invalidateToolsCache();
      }
      this.lastAccountCredentialFingerprint = fingerprint;
      this.instructionsAndToggles.migrateCustomInstructions(resolvedDisplay.servers);
      return resolvedDisplay;
    });
    this.accountServersPromise = promise2;
    const clearSettledPromise = () => {
      if (this.accountServersPromise === promise2) {
        this.accountServersPromise = void 0;
      }
    };
    void promise2.then(clearSettledPromise, clearSettledPromise);
    return promise2;
  }
  invalidateAccountServersPromise() {
    this.accountServersGeneration++;
    this.accountServersPromise = void 0;
  }
  setBoxRuntime(runtime) {
    this.boxRuntime = runtime;
  }
  definitionSourceView() {
    return this.definitionSource;
  }
  lastAccountDisplayConfigView() {
    return this.accountSlots.lastAccountDisplayConfigView();
  }
  settingsStoreView() {
    return this.settingsStore;
  }
  backendMcpExecView() {
    return this.backendMcpExec;
  }
  onDiscoveryFailedView() {
    return this.onDiscoveryFailed;
  }
  setSettingsStore(settings) {
    this.settingsStore = settings;
  }
  setAuthCompletionObserver(observer) {
    this.authWatches.setAuthCompletionObserver(observer);
  }
  async listServers() {
    const displayConfig = await this.accountDisplayConfigProvider?.();
    if (displayConfig != null) {
      this.accountSlots.noteAccountDisplayConfig(displayConfig);
    }
    const effectiveDisplayConfig = displayConfig ?? (this.accountServersProvider == null ? this.lastAccountDisplayConfigView() : null);
    const runtimeServers = await this.definitionSource.getUserServerConfigs();
    const displayServers = effectiveDisplayConfig?.servers ?? (this.accountServersProvider == null ? Object.entries(runtimeServers).map(
      ([serverIdentifier, config2]) => ({
        id: "0",
        name: serverIdentifier,
        serverIdentifier,
        config: config2,
        isTeamServer: false,
        disabledByTeamAdminPolicy: false
      })
    ) : []);
    const visibleServers = displayServers.filter(
      (server) => server.serverIdentifier == null || !BUILTIN_MCP_SERVER_NAMES.has(server.serverIdentifier)
    );
    this.instructionsAndToggles.migrateCustomInstructions(visibleServers);
    const httpServers = visibleServers.filter(
      (server) => server.serverIdentifier != null && !server.disabledByTeamAdminPolicy && (server.config == null || "url" in server.config)
    );
    const stdioServers = visibleServers.filter(
      (server) => server.serverIdentifier != null && !server.disabledByTeamAdminPolicy && server.config != null && "command" in server.config
    );
    let backendEntries = [];
    if (httpServers.length > 0) {
      backendEntries = await this.backendMcpExec.listTools(
        httpServers.map((server) => server.serverIdentifier)
      );
    }
    const boxByName = /* @__PURE__ */ new Map();
    let boxDiscoveryUnavailable = false;
    if (this.boxRuntime != null && this.boxRuntime.isBoxExecWired()) {
      try {
        const boxServers = await this.boxRuntime.listBoxServers(
          stdioServers.map((server) => server.serverIdentifier),
          { accountConfigAdopted: this.accountServersProvider != null && displayConfig != null }
        );
        for (const server of boxServers) {
          boxByName.set(server.serverIdentifier, server);
          if (server.status === "error") {
            reportBoxStdioErrorStatus(server.serverIdentifier, server.statusDetail);
          }
        }
        if (stdioServers.length > 0) {
          boxDiscoveryUnavailable = boxByName.size === 0;
        }
      } catch (error42) {
        reportMcpHostEdgeFailure("box-settings-list", error42);
        boxDiscoveryUnavailable = true;
      }
    }
    const servers = [];
    for (const server of visibleServers) {
      if (server.disabledByTeamAdminPolicy) {
        servers.push(this.summaries.createAdminDisabledServerSummary(server));
        continue;
      }
      if (server.config != null && !("url" in server.config)) {
        servers.push(
          this.summaries.createBoxServerSummary(
            server,
            server.serverIdentifier == null ? void 0 : boxByName.get(server.serverIdentifier),
            boxDiscoveryUnavailable
          )
        );
        continue;
      }
      const rowIdentifier = server.serverIdentifier;
      servers.push(
        ...this.summaries.createBackendServerSummaries(
          server,
          rowIdentifier == null ? [] : backendEntries.filter((entry) => backendEntryBelongsToRow(entry, rowIdentifier))
        )
      );
    }
    const state = { servers };
    this.accountSlots.noteListedState(state);
    return state;
  }
  async listGrokBotAgentServers(agentId) {
    const display = await this.loadGrokBotAgentServers(agentId);
    const servers = [];
    for (const server of display.servers) {
      if (server.disabledByTeamAdminPolicy) {
        servers.push(this.summaries.createAdminDisabledServerSummary(server));
        continue;
      }
      servers.push(...this.summaries.createCredentialPresenceSummaries(server));
    }
    return { servers };
  }
  async loadGrokBotAgentServers(agentId) {
    if (this.grokBotAgentServersProvider == null) {
      throw new SandMcpConfigError("no Grok Bot agent MCP servers provider");
    }
    const display = await this.grokBotAgentServersProvider(agentId);
    if (display == null || display.unavailable === true) {
      throw new SandMcpConfigError("Grok Bot agent MCP servers unavailable");
    }
    return display;
  }
  async addServer(request5) {
    const name17 = this.validateInstallableName(request5.name);
    const serverConfig = parseServerConfig(request5.configJson);
    await this.addServersToAccount({ [name17]: serverConfig });
    return await this.reloadServers();
  }
  async getCatalog(getAccessToken, options2) {
    return await this.catalogFlow.getCatalog(getAccessToken, options2);
  }
  peekMemberPublishMarketplaces() {
    return this.catalogFlow.peekMemberPublishMarketplaces();
  }
  async resolvePluginLogo(url2) {
    return await this.catalogFlow.resolvePluginLogo(url2);
  }
  async installEntry(request5, getAccessToken) {
    return await this.catalogFlow.installEntry(request5, getAccessToken);
  }
  async updatePluginInstall(request5, getAccessToken) {
    return await this.catalogFlow.updatePluginInstall(request5, getAccessToken);
  }
  validateInstallableName(name17) {
    const validated = validateServerName(name17);
    if (BUILTIN_MCP_SERVER_NAMES.has(validated)) {
      throw new SandMcpConfigError(
        `MCP server name "${validated}" is reserved for a built-in Grok Bot server.`
      );
    }
    return validated;
  }
  requireAccountWriter() {
    if (this.accountMcpWriter == null) {
      throw new SandMcpConfigError("Managing MCP servers requires a signed-in Cursor account.", {
        kind: "account_required"
      });
    }
    return this.accountMcpWriter;
  }
  async addServersToAccount(servers) {
    const writer = this.requireAccountWriter();
    if (process.env.GROKBOT_LOCAL_MODE === "1" && writer.addServers != null) return await writer.addServers(servers);
    const { config: config2, serverIdsByName } = await writer.getConfigForEdit();
    await writer.setConfig({ mcpServers: { ...config2.mcpServers, ...servers } }, serverIdsByName);
  }
  async removeServer(rawServerId) {
    const serverId = validateMcpServerId(rawServerId);
    const displayServer = await this.resolveDisplayServer(serverId);
    const displayName2 = displayServer?.name;
    if (displayServer?.pluginId != null && !displayServer.isTeamServer && displayServer.managedByTeamPluginPolicy !== true && displayServer.isRequired !== true) {
      return await this.uninstallPluginRows(displayServer.pluginId, serverId);
    }
    const writer = this.requireAccountWriter();
    const { config: config2, serverIdsByName } = await writer.getConfigForEdit();
    const name17 = Object.entries(serverIdsByName).find(([, id]) => id.toString() === serverId)?.[0];
    if (name17 == null) {
      return this.classifyRemoveOutcome(serverId, await this.listServers());
    }
    if (!(name17 in config2.mcpServers)) {
      return this.classifyRemoveOutcome(serverId, await this.listServers());
    }
    const nextServers = {};
    const nextIds = {};
    for (const [serverName, serverConfig] of Object.entries(config2.mcpServers)) {
      if (serverName !== name17) {
        nextServers[serverName] = serverConfig;
        const id = serverIdsByName[serverName];
        if (id !== void 0) nextIds[serverName] = id;
      }
    }
    if (process.env.GROKBOT_LOCAL_MODE === "1" && writer.removeServer != null) await writer.removeServer(serverId);
    else await writer.setConfig({ mcpServers: nextServers }, nextIds);
    this.authWatches.clearPendingAuthWatchesForServer(serverId);
    const sameNameRows = this.lastAccountDisplayConfigView()?.servers.filter((server) => server.name === displayName2).length ?? 1;
    this.settingsStore.deleteMcpCustomInstructionByServerId({
      serverId,
      displayName: displayName2 ?? name17,
      deleteLegacyName: displayName2 != null && sameNameRows <= 1
    });
    this.instructionsAndToggles.deleteDisabledToolsForServer(serverId);
    return this.classifyRemoveOutcome(serverId, await this.reloadServers(serverId));
  }
  classifyRemoveOutcome(serverId, state) {
    const remaining = state.servers.find((server) => server.id === serverId);
    if (remaining == null) {
      return { state, removed: true };
    }
    return {
      state,
      removed: false,
      reason: remaining.isTeamServer ? "team-server" : "still-present"
    };
  }
  async listEffectivePlugins() {
    return this.effectivePluginsProvider == null ? [] : await this.effectivePluginsProvider();
  }
  async uninstallPlugin(rawPluginId) {
    const pluginId = validateMarketplacePluginId(rawPluginId);
    const state = await this.performPluginUninstall(pluginId);
    let installRecordGone;
    if (this.effectivePluginsProvider == null) {
      installRecordGone = true;
    } else {
      try {
        const effective = await this.effectivePluginsProvider();
        installRecordGone = !effective.some(
          (plugin) => plugin.pluginId === pluginId && isEffectivePluginInstalled(plugin)
        );
      } catch (error42) {
        reportMcpHostEdgeFailure("plugin-list", error42);
        installRecordGone = false;
      }
    }
    const remainingRows = state.servers.filter((server) => server.pluginId === pluginId);
    const userRowRemains = remainingRows.some((server) => !server.isTeamServer);
    if (installRecordGone && remainingRows.length === 0) {
      return { state, removed: true };
    }
    return {
      state,
      removed: false,
      reason: !installRecordGone || userRowRemains ? "still-present" : "team-server"
    };
  }
  async performPluginUninstall(pluginId) {
    const writer = this.requireAccountWriter();
    let display = this.accountDisplayConfigProvider == null ? this.lastAccountDisplayConfigView() : null;
    if (display == null && this.accountDisplayConfigProvider != null) {
      try {
        display = await this.accountDisplayConfigProvider();
        if (display != null) this.accountSlots.noteAccountDisplayConfig(display);
      } catch {
        display = this.lastAccountDisplayConfigView();
      }
    }
    let effective = null;
    if (this.effectivePluginsProvider != null) {
      try {
        effective = await this.effectivePluginsProvider();
      } catch (error42) {
        reportMcpHostEdgeFailure("plugin-list", error42);
        effective = null;
      }
    }
    if (display == null && effective == null) {
      throw new SandMcpConfigError("team_policy_unavailable", {
        kind: "team_policy_unavailable"
      });
    }
    const pluginRows = (display?.servers ?? []).filter((server) => server.pluginId === pluginId);
    const isTeamRequired = pluginRows.some((server) => server.isRequired === true) || (effective ?? []).some(
      (plugin) => plugin.pluginId === pluginId && plugin.installMode === "team-required"
    );
    if (isTeamRequired) {
      throw new SandMcpConfigError(
        "This plugin is required by the user's team and can't be uninstalled.",
        { kind: "team_required" }
      );
    }
    const attributedRows = pluginRows.filter((server) => !server.isTeamServer);
    await writer.uninstallPlugin({ pluginId: BigInt(pluginId) });
    for (const row of attributedRows) {
      this.authWatches.clearPendingAuthWatchesForServer(row.id);
      const sameNameRows = display?.servers.filter((server) => server.name === row.name).length ?? 1;
      this.settingsStore.deleteMcpCustomInstructionByServerId({
        serverId: row.id,
        displayName: row.name,
        deleteLegacyName: sameNameRows <= 1
      });
      this.instructionsAndToggles.deleteDisabledToolsForServer(row.id);
    }
    return await this.reloadServers();
  }
  async uninstallPluginRows(pluginId, serverId) {
    const state = await this.performPluginUninstall(pluginId);
    return this.classifyRemoveOutcome(serverId, state);
  }
  async logoutAccount(rawServerId, rawAccountKey) {
    return await this.accountSlots.logoutAccount(rawServerId, rawAccountKey);
  }
  async renameAccount(rawServerId, rawAccountKey, rawNewAccountKey) {
    return await this.accountSlots.renameAccount(rawServerId, rawAccountKey, rawNewAccountKey);
  }
  async removeAccount(rawServerId, rawAccountKey) {
    return await this.accountSlots.removeAccount(rawServerId, rawAccountKey);
  }
  async setServerCustomInstructions(args) {
    return await this.instructionsAndToggles.setServerCustomInstructions(args);
  }
  async listServerTools(rawServerId) {
    return await this.instructionsAndToggles.listServerTools(rawServerId);
  }
  async toggleMcpToolDisabled(args) {
    return await this.instructionsAndToggles.toggleMcpToolDisabled(args);
  }
  getMcpCustomInstructions() {
    return this.instructionsAndToggles.getMcpCustomInstructions();
  }
  async reloadServers(removedServerId) {
    await this.reload();
    if (removedServerId != null) {
      this.accountSlots.dropServerFromDisplay(removedServerId);
    }
    return await this.listServers();
  }
  refreshAccountConfigInBackground() {
    this.invalidateAccountServersPromise();
    this.definitionSource.refreshInBackground();
  }
  async authenticateServer(rawServerId, rawAccountKey, options2) {
    return await this.authWatches.authenticateServer(
      rawServerId,
      rawAccountKey,
      options2?.requestingAgentId ?? null,
      options2?.forceReauth === true,
      options2?.trigger ?? null,
      options2?.grokBotAgentId ?? null,
      options2?.oauthRedirectUri == null ? {} : { oauthRedirectUri: options2.oauthRedirectUri }
    );
  }
  async resolveListedDisplayServer(rawServerId) {
    const serverId = rawServerId.trim();
    const view = this.lastAccountDisplayConfigView();
    const viewIsCurrent = this.accountServersPromise == null && view?.cacheScope !== void 0 && view.cacheScope === this.settingsStore.getActiveAccountScope();
    const listed = viewIsCurrent ? findDisplayServerByAddress(view.servers, serverId) : void 0;
    if (listed != null && (!isGrokDisplayServerId(serverId) || listed.servedBy === "grok")) {
      return listed;
    }
    return await this.resolveDisplayServer(rawServerId);
  }
  async resolveDisplayServer(rawServerId, options2) {
    const serverId = rawServerId.trim();
    if (serverId.length === 0) return void 0;
    const isGrokDisplayId = isGrokDisplayServerId(serverId);
    const accountServer = await this.resolveAccountDisplayServer(
      serverId,
      options2?.requireFreshRead === true
    );
    if (accountServer != null || options2?.grokBotAgentId == null) {
      return isGrokDisplayId && accountServer?.servedBy !== "grok" ? void 0 : accountServer;
    }
    const display = await this.loadGrokBotAgentServers(options2.grokBotAgentId);
    const server = findDisplayServerByAddress(display.servers, serverId);
    return isGrokDisplayId && server?.servedBy !== "grok" ? void 0 : server;
  }
  async resolveAccountDisplayServer(serverId, requireFreshRead) {
    if (requireFreshRead && this.accountServersProvider != null) {
      const display2 = await this.accountServersProvider();
      if (display2 == null || display2.unavailable === true) {
        throw new SandMcpConfigError("account display config unavailable");
      }
      return findDisplayServerByAddress(display2.servers, serverId);
    }
    if (this.accountDisplayConfigProvider == null) {
      if (requireFreshRead) {
        throw new SandMcpConfigError("no account display config provider");
      }
      return void 0;
    }
    let display = null;
    try {
      display = await this.accountDisplayConfigProvider();
    } catch (error42) {
      if (requireFreshRead) throw error42;
      display = null;
    }
    if (display != null) {
      this.accountSlots.noteAccountDisplayConfig(display);
    } else if (requireFreshRead) {
      throw new SandMcpConfigError("account display config unavailable");
    }
    if (requireFreshRead && display?.unavailable === true) {
      throw new SandMcpConfigError("account display config unavailable");
    }
    const servers = (display ?? (this.accountServersProvider == null ? this.lastAccountDisplayConfigView() : null))?.servers ?? [];
    return findDisplayServerByAddress(servers, serverId);
  }
  noteAuthCompletedElsewhere(rawServerId, rawAccountKey) {
    return this.authWatches.noteAuthCompletedElsewhere(rawServerId, rawAccountKey);
  }
  async noteAuthCallbackReceived(hint) {
    return await this.authWatches.noteAuthCallbackReceived(hint);
  }
  noteAuthCallbackRejected(rejection) {
    this.authWatches.noteAuthCallbackRejected(rejection);
  }
  async dispose() {
    this.authWatches.clearAllPendingAuthWatches();
  }
  async reload() {
    this.invalidateAccountServersPromise();
    this.definitionSource.clearCache();
    this.boxRuntime?.invalidateToolsCache();
    this.boxRuntime?.resetPushState();
  }
};
