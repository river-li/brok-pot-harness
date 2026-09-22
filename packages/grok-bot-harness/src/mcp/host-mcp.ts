init_cursor_token();
function syncPluginSkillsInBackground(pluginSkills, trigger2) {
  void (async () => {
    try {
      await pluginSkills?.sync(trigger2);
    } catch (error42) {
      reportMcpHostEdgeFailure("plugin-skill-sync", error42);
    }
  })();
}
function installedStatusDetail(detail) {
  if (detail == null) return void 0;
  if (detail.kind === "failed_to_load" && detail.technicalDetail != null) {
    return `${detail.kind}: ${detail.technicalDetail}`;
  }
  return detail.kind;
}
function toInstalledServer(summary) {
  return {
    id: summary.id,
    name: summary.name,
    serverIdentifier: summary.serverIdentifier,
    accountKey: summary.accountKey,
    ...summary.pluginId != null ? { pluginId: summary.pluginId } : {},
    isTeamServer: summary.isTeamServer,
    status: summary.status,
    statusDetail: installedStatusDetail(summary.statusDetail),
    transport: summary.transport,
    toolCount: summary.toolCount,
    ...summary.disabledToolCount != null ? { disabledToolCount: summary.disabledToolCount } : {},
    customInstructions: summary.customInstructions
  };
}
function toInstalledServers(state) {
  return state.servers.map(toInstalledServer);
}
function toCatalogFields(fields2) {
  return (fields2 ?? []).map((field) => ({
    key: field.key,
    label: field.label,
    hint: field.hint,
    isRequired: field.isRequired === true,
    isSecret: field.isSecret === true
  }));
}
function authReasonDetail(reason) {
  return "technicalDetail" in reason && reason.technicalDetail != null ? reason.technicalDetail : reason.kind;
}
function toAuthResult(result) {
  switch (result.status) {
    case "started":
      return {
        kind: "started",
        authorizationUrl: result.authorizationUrl,
        serverName: result.serverName,
        ...result.completionUnconfirmed === true ? { completionUnconfirmed: true } : {}
      };
    case "already-authenticated":
      return {
        kind: "already-authenticated",
        serverName: result.serverName
      };
    case "not-configured":
      return { kind: "not-configured", serverName: result.serverName };
    case "not-supported":
      return {
        kind: "not-supported",
        message: authReasonDetail(result.reason),
        serverName: result.serverName
      };
    case "unreachable":
      return {
        kind: "unreachable",
        message: authReasonDetail(result.reason),
        serverName: result.serverName
      };
    default: {
      const _exhaustive = result;
      return _exhaustive;
    }
  }
}
function toPluginSummary(view, effectivePlugins, servers) {
  const base = {
    pluginId: view.id,
    name: view.name,
    displayName: view.displayName,
    description: view.description,
    category: view.category
  };
  const record2 = effectivePlugins?.find((plugin) => plugin.pluginId === view.id);
  const effective = record2 != null && isEffectivePluginInstalled(record2) ? record2 : void 0;
  const attributedRow = servers.find((server) => server.pluginId === view.id);
  const isInstalled = effective != null || record2 == null && attributedRow != null;
  const marketplaceOwnership = view.marketplace?.ownership;
  return {
    ...base,
    isInstalled,
    ...isInstalled ? { installMode: effective?.installMode ?? "unknown" } : {},
    connectorCount: view.connectors?.length ?? 1,
    skills: (view.skills ?? []).map((skill) => ({
      name: skill.name,
      description: skill.description
    })),
    ...marketplaceOwnership === void 0 ? {} : { marketplaceOwnership }
  };
}
function createHostMcp(deps) {
  const log4 = deps.log ?? ((message) => console.log(`[sand:mcp] ${message}`));
  const manager = new SandMcpManager({
    includeBuiltins: false,
    getMachineId: deps.getMachineId,
    accountConfigProvider: deps.accountConfigProvider,
    boxServers: deps.boxServers,
    accountDisplayConfigProvider: deps.accountDisplayConfigProvider,
    accountServersProvider: deps.accountServersProvider,
    accountMcpWriter: deps.accountMcpWriter,
    backendMcpExec: deps.backendMcpExec,
    settingsStore: deps.settingsStore,
    effectivePluginsProvider: deps.effectivePluginsProvider,
    onConnectorAuth: deps.onConnectorAuth,
    fetchMarketplacePlugins: deps.fetchMarketplacePlugins,
    marketplace: deps.marketplace
  });
  const discovery = createMcpToolsDiscovery(
    {
      definitionSource: manager.definitionSourceView(),
      lastAccountDisplayConfig: () => manager.lastAccountDisplayConfigView(),
      settingsStore: () => manager.settingsStoreView(),
      backendMcpExec: deps.backendMcpExec
    },
    {
      boxMcpExec: deps.boxMcpExec,
      onDiscoveryFailed: deps.onDiscoveryFailed,
      onConnectorAuth: deps.onConnectorAuth
    }
  );
  manager.setBoxRuntime(discovery);
  if (deps.onServerAuthenticated != null) {
    manager.setAuthCompletionObserver(deps.onServerAuthenticated);
  }
  const getAccessToken = deps.getAccessToken ?? (async () => null);
  const pluginSkillSourceUrls = async (pluginId) => {
    try {
      const views = await manager.getCatalog(getAccessToken);
      const view = views.find((candidate) => candidate.id === pluginId);
      return (view?.skills ?? []).flatMap(
        (skill) => skill.sourceUrl != null ? [skill.sourceUrl] : []
      );
    } catch (error42) {
      reportMcpHostEdgeFailure("plugin-skill-catalog-fetch", error42);
      return null;
    }
  };
  const dropLiveSkillReferences = (sourceUrls) => {
    const pluginSkills = deps.pluginSkills;
    if (pluginSkills == null) return;
    if (sourceUrls == null) {
      reportMcpHostEdgeDegraded("plugin-skill-reference-drop", "catalog_unavailable");
      return;
    }
    try {
      pluginSkills.removeLiveReferences(sourceUrls);
    } catch (error42) {
      reportMcpHostEdgeFailure("plugin-skill-reference-drop", error42);
    }
  };
  const catalogServerStatuses = () => deps.isCatalogServerStatusDisabled?.() === true ? Promise.resolve(/* @__PURE__ */ new Map()) : discovery.getServerStatuses();
  const serversMutated = () => {
    deps.onServersMutated?.();
  };
  const mutations = {
    async installEntry(request5) {
      const state = await manager.installEntry(request5, getAccessToken);
      serversMutated();
      dropLiveSkillReferences(await pluginSkillSourceUrls(request5.entryId));
      syncPluginSkillsInBackground(deps.pluginSkills, "install");
      return state;
    },
    async updatePluginInstall(request5) {
      const state = await manager.updatePluginInstall(request5, getAccessToken);
      serversMutated();
      return state;
    },
    async removeServer(serverId) {
      const result = await manager.removeServer(serverId);
      serversMutated();
      return result;
    },
    async uninstallPlugin(pluginId) {
      const skillSourceUrls = await pluginSkillSourceUrls(pluginId);
      const result = await manager.uninstallPlugin(pluginId);
      serversMutated();
      if (uninstallClearedInstallRecord(result)) {
        dropLiveSkillReferences(skillSourceUrls);
        syncPluginSkillsInBackground(deps.pluginSkills, "uninstall");
      }
      return result;
    },
    async authenticateServer(request5) {
      const result = await manager.authenticateServer(
        request5.serverId,
        request5.accountKey ?? DEFAULT_MCP_ACCOUNT_KEY,
        {
          forceReauth: request5.forceReauth === true,
          ...request5.trigger == null ? {} : { trigger: request5.trigger },
          ...request5.requestingAgentId == null ? {} : { requestingAgentId: request5.requestingAgentId },
          ...request5.oauthRedirectUri == null ? {} : { oauthRedirectUri: request5.oauthRedirectUri }
        }
      );
      if (result.status === "started") {
        serversMutated();
      }
      return result;
    },
    async renameAccount(request5) {
      const state = await manager.renameAccount(
        request5.serverId,
        request5.accountKey,
        request5.newAccountKey
      );
      serversMutated();
      return state;
    },
    async removeAccount(request5) {
      const state = await manager.removeAccount(request5.serverId, request5.accountKey);
      serversMutated();
      return state;
    },
    async setCustomInstructions(request5) {
      const state = await manager.setServerCustomInstructions(request5);
      serversMutated();
      return state;
    }
  };
  const mcp = {
    getTools: (ctx, mcpConfigJson) => deps.resolveToolsAtTurnStart === true ? discovery.getTools(ctx, mcpConfigJson) : discovery.getToolsForTurnStart(ctx, mcpConfigJson),
    createExecutor: (persistImage, spillLargeText, auditIdentity, mcpConfigJson) => new SandMcpExecutor(discovery, persistImage, spillLargeText, auditIdentity, mcpConfigJson),
    refreshAccountConfig: () => {
      manager.refreshAccountConfigInBackground();
    },
    getServerStatuses: catalogServerStatuses,
    createStateExecutor: (mcpConfigJson) => createSandMcpStateExecutor({
      getTools: (ctx) => discovery.getTools(ctx, mcpConfigJson),
      // Inline (per-turn) configs are not in the manager's listing; their
      // servers keep the tools-imply-connected reading.
      ...mcpConfigJson === void 0 ? { getServerStatuses: catalogServerStatuses } : {}
    }),
    getCustomInstructions: async () => manager.getMcpCustomInstructions(),
    resolveToolTransport: (providerIdentifier) => discovery.resolveProviderTransport(providerIdentifier),
    resolveNeedsAuthSlot: async (providerIdentifier) => {
      const state = await manager.listServers();
      const summary = state.servers.find(
        (server) => server.serverIdentifier === providerIdentifier && server.status === "needsAuth"
      );
      return summary != null ? { serverId: summary.id, serverName: summary.name } : null;
    }
  };
  const management = {
    async listInstalled() {
      return toInstalledServers(await manager.listServers());
    },
    async listPlugins() {
      const [views, state, effectivePlugins] = await Promise.all([
        manager.getCatalog(getAccessToken),
        manager.listServers(),
        manager.listEffectivePlugins().catch((error42) => {
          log4(`effective-plugins read degraded to attributed rows: ${errorLogTag(error42)}`);
          return null;
        })
      ]);
      return views.map((view) => toPluginSummary(view, effectivePlugins, state.servers));
    },
    async getPlugin(pluginId) {
      let views = await manager.getCatalog(getAccessToken);
      let view = views.find((candidate) => candidate.id === pluginId);
      if (view == null) {
        views = await manager.getCatalog(getAccessToken, {
          forceRefresh: true
        });
        view = views.find((candidate) => candidate.id === pluginId);
      }
      if (view == null) return null;
      const [state, effectivePlugins] = await Promise.all([
        manager.listServers(),
        manager.listEffectivePlugins().catch((error42) => {
          log4(`effective-plugins read degraded to attributed rows: ${errorLogTag(error42)}`);
          return null;
        })
      ]);
      const summary = toPluginSummary(view, effectivePlugins, state.servers);
      return {
        ...summary,
        fields: toCatalogFields(view.fields),
        servers: state.servers.filter((server) => server.pluginId === view.id).map(toInstalledServer)
      };
    },
    async uninstallPlugin(pluginId) {
      const result = await mutations.uninstallPlugin(pluginId);
      return {
        removed: result.removed,
        ...result.reason != null ? { reason: result.reason } : {}
      };
    },
    async setInstructions({ serverId, instructions }) {
      return toInstalledServers(await mutations.setCustomInstructions({ serverId, instructions }));
    },
    async install(args) {
      return toInstalledServers(
        await mutations.installEntry({ entryId: args.id, values: args.values })
      );
    },
    async add(args) {
      const servers = toInstalledServers(
        await manager.addServer({ name: args.name, configJson: args.configJson })
      );
      serversMutated();
      return servers;
    },
    async removeServer(serverId) {
      const result = await mutations.removeServer(serverId);
      return {
        removed: result.removed,
        ...result.reason != null ? { reason: result.reason } : {},
        servers: toInstalledServers(result.state)
      };
    },
    async restart() {
      const servers = toInstalledServers(await manager.reloadServers());
      serversMutated();
      return servers;
    },
    async authenticate(serverId, accountKey, options2) {
      return toAuthResult(
        await mutations.authenticateServer({
          serverId,
          accountKey,
          forceReauth: options2?.forceReauth === true,
          ...options2?.requestingAgentId == null ? {} : { requestingAgentId: options2.requestingAgentId },
          ...options2?.oauthRedirectUri == null ? {} : { oauthRedirectUri: options2.oauthRedirectUri }
        })
      );
    },
    async logoutAccount({ serverId, accountKey }) {
      const servers = toInstalledServers(await manager.logoutAccount(serverId, accountKey));
      serversMutated();
      return servers;
    },
    async renameAccount({ serverId, accountKey, newAccountKey }) {
      return toInstalledServers(
        await mutations.renameAccount({ serverId, accountKey, newAccountKey })
      );
    },
    async removeAccount({ serverId, accountKey }) {
      return toInstalledServers(await mutations.removeAccount({ serverId, accountKey }));
    }
  };
  const plugins = {
    ...mutations,
    listServers: () => manager.listServers(),
    listEffectivePlugins: () => manager.listEffectivePlugins(),
    getCatalog: () => manager.getCatalog(getAccessToken),
    resolvePluginLogo: (url2) => manager.resolvePluginLogo(url2),
    listServerTools: (serverId) => manager.listServerTools(serverId),
    toggleToolDisabled: (request5) => manager.toggleMcpToolDisabled(request5),
    completeOAuth: async (args) => {
      const result = await deps.backendMcpExec.completeOAuth(args);
      const accountKey = accountKeyFromOAuthCompletion(result);
      await manager.noteAuthCallbackReceived({
        stateId: args.stateId,
        ...accountKey == null ? {} : { accountKey }
      });
    }
  };
  return {
    mcp,
    management,
    plugins,
    setSettingsStore: (settings) => manager.setSettingsStore(settings),
    listBoxServers: (serverIdentifiers, options2) => discovery.listBoxServers(serverIdentifiers, options2),
    noteAuthCompletedElsewhere: (serverId, accountKey) => manager.noteAuthCompletedElsewhere(serverId, accountKey),
    setBoxMcpExec: (boxMcpExec) => discovery.setBoxMcpExec(boxMcpExec),
    reconcileBoxServers: (options2) => {
      manager.definitionSourceView().reloadBoxServers();
      if (options2?.force === true) discovery.resetPushState();
      return discovery.reconcileBoxServers();
    },
    readMemberPublishMarketplaces: async () => {
      try {
        await manager.getCatalog(getAccessToken);
      } catch (error42) {
        log4(`member-publish settings unavailable, publish gate stays open: ${errorLogTag(error42)}`);
      }
      return manager.peekMemberPublishMarketplaces();
    },
    dispose: () => manager.dispose()
  };
}
