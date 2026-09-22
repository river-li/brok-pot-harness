init_esm();
init_proto();
init_cursor_token();
init_mcp_diagnostics();
init_cursor_inference();
var ACCOUNT_MCP_RPC_TIMEOUT_MS = 3e4;
var defaultCreateBackendClient2 = (options2) => createSandCursorBackendClient(DashboardService2, options2);
function identityBackendClient(deps, getAccessToken) {
  return (deps.createBackendClient ?? defaultCreateBackendClient2)({
    backend: deps.backend,
    getAccessToken,
    getTeamId: deps.getTeamId,
    getMachineId: deps.getMachineId
  });
}
function accountMcpBackendClient(deps) {
  return deps.backend === void 0 ? deps.createBackendClient() : identityBackendClient(deps, deps.getAccessToken);
}
async function accountMcpAccessToken(deps) {
  return deps.backend === void 0 ? await deps.getAccessToken() : await deps.getAccessToken({ backendUrl: deps.backend.backendUrl });
}
function logAccountMcpFetchError(leg, error42) {
  reportMcpHostEdgeFailure(leg, error42);
}
function parseAccountMcpConfigJson(json3) {
  if (json3.trim().length === 0) return null;
  try {
    const parsed2 = mcpConfigSchema2.safeParse(JSON.parse(json3));
    return parsed2.success ? parsed2.data : null;
  } catch {
    return null;
  }
}
function teamServerTransport(type2) {
  return type2?.toLowerCase() === "sse" ? "sse" : "http";
}
function serverIdsByNameFromMetadata(metadataByName) {
  const serverIdsByName = {};
  for (const [name17, meta] of Object.entries(metadataByName)) {
    if (meta.serverId !== void 0 && meta.serverId !== BigInt(0)) {
      serverIdsByName[name17] = meta.serverId;
    }
  }
  return serverIdsByName;
}
function httpConfigFromAvailableServer(server) {
  if (server.type.toLowerCase() === "stdio" || server.url == null || server.url.length === 0) {
    return void 0;
  }
  return {
    url: server.url,
    type: teamServerTransport(server.type)
  };
}
function stdioConfigFromAvailableServer(server) {
  if (server.command == null || server.command.length === 0) {
    return void 0;
  }
  return {
    command: server.command,
    ...server.args.length > 0 ? { args: [...server.args] } : {}
  };
}
function isLeftoverListingId(id) {
  return id < 0;
}
function accountSlotsFromAvailableServer(server) {
  const accounts = server.accounts ?? [];
  if (accounts.length === 0) return void 0;
  const slots = [];
  for (const account of accounts) {
    const accountKey = normalizeMcpAccountLabel(account.accountKey);
    if (accountKey.length === 0) continue;
    slots.push({
      accountKey,
      ...account.serverIdentifier.length > 0 ? { serverIdentifier: account.serverIdentifier } : {},
      hasToken: account.userHasAccessToken
    });
  }
  return slots.length > 0 ? slots : void 0;
}
function pluginAttributionFromAvailableServer(server) {
  return {
    ...server.pluginId != null && server.pluginId !== BigInt(0) ? { pluginId: server.pluginId.toString() } : {},
    ...server.isRequired ? { isRequired: true } : {},
    ...server.managedByTeamPluginPolicy ? { managedByTeamPluginPolicy: true } : {}
  };
}
function displayServerId(server) {
  if (server.servedBy !== McpServedBy.GROK) return String(server.id);
  const serverIdentifier = server.serverIdentifier?.trim();
  return serverIdentifier == null || serverIdentifier.length === 0 ? void 0 : `grok:${serverIdentifier}`;
}
function displayServerFields(server, id) {
  const accounts = accountSlotsFromAvailableServer(server);
  return {
    id,
    name: server.name,
    serverIdentifier: server.serverIdentifier,
    isTeamServer: server.isTeamServer,
    disabledByTeamAdminPolicy: server.disabledByTeamAdminPolicy,
    ...pluginAttributionFromAvailableServer(server),
    ...accounts != null ? { accounts } : {},
    ...server.userHasAccessToken == null ? {} : { hasDefaultSlotToken: server.userHasAccessToken },
    ...server.hasStaticCredentialHeaders ? { hasStaticCredentialHeaders: true } : {},
    ...server.servedBy === McpServedBy.GROK ? { servedBy: "grok" } : {},
    ...server.cursorScmProvider != null && server.cursorScmProvider.length > 0 ? { cursorScmProvider: server.cursorScmProvider } : {}
  };
}
function displayServerFromAvailableServer(server, id, config2) {
  return {
    ...displayServerFields(server, id),
    config: config2
  };
}
function grokNativeDisplayServer(server, id) {
  return {
    ...displayServerFields(server, id),
    servedBy: "grok"
  };
}
function tokenScopedBackendClient(deps, accessToken) {
  return deps.backend === void 0 ? deps.createBackendClient() : identityBackendClient(deps, async () => accessToken);
}
function unavailableAccountMcpServers(cacheScope) {
  return cacheScope == null ? null : { servers: [], cacheScope, unavailable: true };
}
async function fetchAccountMcpServers(deps) {
  let cacheScope;
  try {
    const accessToken = await accountMcpAccessToken(deps);
    cacheScope = accountScopeOfToken({ accessToken });
    const client = tokenScopedBackendClient(deps, accessToken);
    const response = await client.getAvailableMcpServers(new GetAvailableMcpServersRequest(), {
      timeoutMs: ACCOUNT_MCP_RPC_TIMEOUT_MS
    });
    const hasUserStdioServer = response.servers.some(
      (server) => server.enabled && !server.isTeamServer && server.type.toLowerCase() === "stdio" && !isLeftoverListingId(server.id)
    );
    const teamStdioTeamIds = [
      ...new Set(
        response.servers.flatMap(
          (server) => server.isTeamServer && server.enabled && server.type.toLowerCase() === "stdio" && server.owningTeamId != null && !isLeftoverListingId(server.id) ? [server.owningTeamId] : []
        )
      )
    ];
    const fetchStdioRuntimeConfig = (request5) => client.getMcpConfig(request5, { timeoutMs: ACCOUNT_MCP_RPC_TIMEOUT_MS }).catch((error42) => {
      logAccountMcpFetchError("account-config-fetch", error42);
      return null;
    });
    const configResponses = await Promise.all([
      ...hasUserStdioServer ? [
        fetchStdioRuntimeConfig(
          new GetMcpConfigRequest({
            teamScope: false,
            redactSecrets: false
          })
        )
      ] : [],
      ...teamStdioTeamIds.map(
        (teamId) => fetchStdioRuntimeConfig(
          new GetMcpConfigRequest({
            teamScope: true,
            teamId,
            redactSecrets: false
          })
        )
      )
    ]);
    const stdioConfigById = /* @__PURE__ */ new Map();
    for (const configResponse of configResponses) {
      if (configResponse == null) continue;
      const parsedConfig = parseAccountMcpConfigJson(configResponse.configJson);
      if (parsedConfig == null) continue;
      const serverIdsByName = serverIdsByNameFromMetadata(configResponse.serverMetadataByName);
      for (const [name17, config2] of Object.entries(parsedConfig.mcpServers)) {
        const serverId = serverIdsByName[name17];
        if (serverId != null) {
          stdioConfigById.set(String(serverId), config2);
        }
      }
    }
    const servers = [];
    const unresolvedServerIds = [];
    for (const server of response.servers) {
      const id = displayServerId(server);
      if (id == null) continue;
      const isStdio = server.type.toLowerCase() === "stdio";
      if (!server.enabled && server.disabledByTeamAdminPolicy && !server.isTeamServer) {
        let config3 = void 0;
        if (isStdio) {
          config3 = stdioConfigFromAvailableServer(server);
        } else {
          config3 = httpConfigFromAvailableServer(server);
        }
        if (config3 != null) {
          servers.push({ ...displayServerFields(server, id), config: config3 });
        } else if (!isStdio && server.servedBy === McpServedBy.GROK) {
          servers.push(grokNativeDisplayServer(server, id));
        }
        continue;
      }
      if (!server.enabled) continue;
      let config2;
      if (isStdio) {
        if (isLeftoverListingId(server.id)) {
          config2 = stdioConfigFromAvailableServer(server);
        } else {
          config2 = stdioConfigById.get(id);
        }
      } else {
        config2 = httpConfigFromAvailableServer(server);
      }
      if (config2 == null && !isStdio && server.servedBy === McpServedBy.GROK) {
        servers.push(grokNativeDisplayServer(server, id));
        continue;
      }
      if (config2 == null || isStdio && !("command" in config2) || !isStdio && !("url" in config2)) {
        if (isStdio) {
          unresolvedServerIds.push(id);
        }
        continue;
      }
      servers.push(displayServerFromAvailableServer(server, id, config2));
    }
    const result = {
      servers,
      cacheScope,
      ...unresolvedServerIds.length > 0 ? { unresolvedServerIds } : {}
    };
    return result;
  } catch {
    return unavailableAccountMcpServers(cacheScope);
  }
}
function toEffectivePluginInstallMode(mode) {
  switch (mode) {
    case EffectivePluginInstallMode.USER:
      return "user";
    case EffectivePluginInstallMode.TEAM_DEFAULT:
      return "team-default";
    case EffectivePluginInstallMode.TEAM_REQUIRED:
      return "team-required";
    case EffectivePluginInstallMode.UNSPECIFIED:
      return "unknown";
    default: {
      const _exhaustive = mode;
      return "unknown";
    }
  }
}
async function fetchEffectiveUserPlugins(deps) {
  const client = accountMcpBackendClient(deps);
  const response = await client.getEffectiveUserPlugins(
    new GetEffectiveUserPluginsRequest({ excludeConfiguredVariables: true })
  );
  const plugins = [];
  for (const effective of response.plugins) {
    const plugin = effective.plugin;
    if (plugin == null || plugin.id === BigInt(0)) continue;
    if (effective.servedBy === McpServedBy.GROK) continue;
    const installMode = toEffectivePluginInstallMode(effective.installMode);
    plugins.push({
      pluginId: plugin.id.toString(),
      name: plugin.name,
      displayName: plugin.displayName.length > 0 ? plugin.displayName : plugin.name,
      installMode: installMode === "unknown" && effective.isTeamRequired ? "team-required" : installMode,
      isEnabled: effective.isEnabled,
      ...effective.hasTeamConfiguredVariables === true ? { hasTeamConfiguredVariables: true } : {},
      ...effective.configuredVariableKeys.length > 0 ? { configuredVariableKeys: [...effective.configuredVariableKeys] } : {}
    });
  }
  return plugins;
}
async function backfillUserPluginInstalls(deps) {
  const client = accountMcpBackendClient(deps);
  const [available, effective] = await Promise.all([
    client.getAvailableMcpServers(new GetAvailableMcpServersRequest()),
    fetchEffectiveUserPlugins(deps)
  ]);
  const knownPluginIds = new Set(effective.map((plugin) => plugin.pluginId));
  const missingPluginIds = /* @__PURE__ */ new Set();
  for (const server of available.servers) {
    if (server.isTeamServer || server.managedByTeamPluginPolicy) continue;
    if (server.servedBy === McpServedBy.GROK) continue;
    if (server.pluginId == null || server.pluginId === BigInt(0)) continue;
    const pluginId = server.pluginId.toString();
    if (!knownPluginIds.has(pluginId)) missingPluginIds.add(pluginId);
  }
  const backfilled = [];
  for (const pluginId of missingPluginIds) {
    try {
      await client.installUserPlugin(new InstallUserPluginRequest({ pluginId: BigInt(pluginId) }));
      backfilled.push(pluginId);
    } catch (error42) {
      logAccountMcpFetchError("account-install-backfill", error42);
    }
  }
  return backfilled;
}
function createAccountMcpWriter(deps) {
  const makeClient = () => accountMcpBackendClient(deps);
  return {
    async getConfigForEdit() {
      const response = await makeClient().getMcpConfig(
        new GetMcpConfigRequest({ teamScope: false, redactSecrets: true })
      );
      const config2 = parseAccountMcpConfigJson(response.configJson) ?? {
        mcpServers: {}
      };
      const serverIdsByName = serverIdsByNameFromMetadata(response.serverMetadataByName);
      return { config: config2, serverIdsByName };
    },
    async setConfig(config2, serverIdsByName) {
      await makeClient().setMcpConfig(
        new SetMcpConfigRequest({
          teamScope: false,
          configJson: JSON.stringify(config2),
          serverIdsByName: { ...serverIdsByName }
        })
      );
    },
    async installPlugin(args) {
      await makeClient().installUserPlugin(
        new InstallUserPluginRequest({
          pluginId: args.pluginId,
          ...args.variables != null && Object.keys(args.variables).length > 0 ? { variables: Struct.fromJson({ ...args.variables }) } : {}
        })
      );
    },
    async uninstallPlugin(args) {
      await makeClient().uninstallUserPlugin(
        new UninstallUserPluginRequest({ pluginId: args.pluginId })
      );
    },
    async updatePluginInstall(args) {
      await makeClient().updateUserPluginInstall(
        new UpdateUserPluginInstallRequest({
          pluginId: args.pluginId,
          variables: Struct.fromJson({ ...args.variables })
        })
      );
    }
  };
}
