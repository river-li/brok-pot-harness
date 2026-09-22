/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/mcp/mcp-service.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_errors();
init_cursor_marketplace_client();
init_mcp_marketplace();
var McpHostService = class {
  constructor(deps) {
    this.deps = deps;
    const marketplaceClient = marketplaceDashboardClientFor(deps.backend);
    const accountMcpDeps = {
      backend: deps.backend,
      getAccessToken: deps.auth.getAccessToken,
      getTeamId: deps.auth.getTeamId,
      getMachineId: deps.auth.getMachineId
    };
    this.hostMcp = (deps.createHostMcp ?? createHostMcp)({
      log: deps.log,
      onServerAuthenticated: (completion) => this.emitAuthCompletion(completion),
      onServersMutated: () => this.emitServersUpdated({ servers: [] }),
      ...deps.isCatalogServerStatusDisabled === void 0 ? {} : { isCatalogServerStatusDisabled: deps.isCatalogServerStatusDisabled },
      ...deps.pluginSkills != null ? { pluginSkills: deps.pluginSkills } : {},
      getAccessToken: async () => {
        try {
          const token = await deps.auth.getAccessToken({
            backendUrl: deps.backend.backendUrl
          });
          return token.length > 0 ? token : null;
        } catch (error42) {
          reportFallback("mcp_service", error42);
          return null;
        }
      },
      getMachineId: deps.auth.getMachineId,
      fetchMarketplacePlugins: (getAccessToken, getMachineId) => fetchMarketplaceMcpPlugins(getAccessToken, getMachineId, marketplaceClient),
      accountServersProvider: () => fetchAccountMcpServers(accountMcpDeps),
      accountMcpWriter: createAccountMcpWriter(accountMcpDeps),
      effectivePluginsProvider: () => fetchEffectiveUserPlugins(accountMcpDeps),
      backendMcpExec: createDashboardSandBackendMcpExec(accountMcpDeps),
      boxMcpExec: createBoxSandMcpExec(deps.foreverBox.box),
      boxServers: async () => {
        const turn = this.boxServersTurn;
        return turn === void 0 || !turn.gates.browserUsePlaywright() ? {} : playwrightBoxMcpServersForBox(deps.foreverBox.box, turn.ctx, turn.agentId, {
          kind: "image_only"
        });
      },
      settingsStore: deps.settings,
      onDiscoveryFailed: deps.onDiscoveryFailed,
      onConnectorAuth: deps.onConnectorAuth
    });
    const kickInstallBackfillOnce = () => {
      this.installBackfill ??= backfillUserPluginInstalls(accountMcpDeps).then(
        () => void 0,
        (error42) => {
          if (this.disposed) return;
          deps.log(`[sand:mcp] plugin install backfill failed: ${errorLogTag(error42)}`);
        }
      );
    };
    this.api = {
      mcp: this.hostMcp.mcp,
      mcpForAgent: (agentId, gates) => ({
        ...this.hostMcp.mcp,
        getTools: (ctx, mcpConfigJson) => {
          this.boxServersTurn = { ctx, agentId, gates };
          this.hostMcp.reconcileBoxServers().catch((error42) => {
            reportFallback("mcp_service", error42);
          });
          return this.hostMcp.mcp.getTools(ctx, mcpConfigJson);
        }
      }),
      management: this.hostMcp.management,
      plugins: {
        ...this.hostMcp.plugins,
        listServers: () => {
          kickInstallBackfillOnce();
          return this.hostMcp.plugins.listServers();
        }
      },
      listBoxServers: (serverIdentifiers) => this.listBoxServers(serverIdentifiers),
      subscribeToAuthCompletion: (listener) => {
        this.authCompletionListeners.add(listener);
        return () => {
          this.authCompletionListeners.delete(listener);
        };
      },
      noteAuthCompletedElsewhere: (serverId, accountKey) => this.hostMcp.noteAuthCompletedElsewhere(serverId, accountKey),
      subscribeToServersUpdated: (listener) => {
        this.serversUpdatedListeners.add(listener);
        return () => {
          this.serversUpdatedListeners.delete(listener);
        };
      },
      syncPluginSkills: async () => await deps.pluginSkills?.sync("desktop") ?? [],
      pluginSyncStatus: () => deps.pluginSkills?.status() ?? { authBlocked: [] }
    };
  }
  deps;
  hostMcp;
  boxServersTurn;
  authCompletionListeners = /* @__PURE__ */ new Set();
  serversUpdatedListeners = /* @__PURE__ */ new Set();
  statusFollowUps = /* @__PURE__ */ new Map();
  installBackfill = null;
  disposed = false;
  api;
  async readMemberPublishMarketplaces() {
    return await this.hostMcp.readMemberPublishMarketplaces();
  }
  async dispose() {
    if (this.disposed) return;
    this.disposed = true;
    this.authCompletionListeners.clear();
    this.serversUpdatedListeners.clear();
    this.statusFollowUps.clear();
    await this.hostMcp.dispose();
  }
  async listBoxServers(serverIdentifiers) {
    const servers = await this.hostMcp.listBoxServers(serverIdentifiers, {
      kickOnly: true
    });
    this.scheduleStatusFollowUps(servers);
    return servers.map(({ serverIdentifier, status, statusDetail, toolCount }) => ({
      serverIdentifier,
      status,
      ...statusDetail != null ? { statusDetail } : {},
      toolCount
    }));
  }
  scheduleStatusFollowUps(servers) {
    if (this.disposed) return;
    for (const server of servers) {
      if (server.status !== "loading" && server.status !== "error") continue;
      const id = server.serverIdentifier;
      if (this.statusFollowUps.has(id)) continue;
      const followUp = (async () => {
        try {
          const settled = await this.hostMcp.listBoxServers([id]);
          if (this.disposed) return;
          const updated = settled[0];
          if (updated == null) return;
          this.emitServersUpdated({
            servers: [
              {
                serverIdentifier: updated.serverIdentifier,
                status: updated.status,
                ...updated.statusDetail != null ? { statusDetail: updated.statusDetail } : {},
                toolCount: updated.toolCount
              }
            ]
          });
        } catch (error42) {
          if (this.disposed) return;
          this.deps.log(
            `[sand:mcp] box MCP status follow-up failed for ${id}: ${errorLogTag(error42)}`
          );
        } finally {
          this.statusFollowUps.delete(id);
        }
      })();
      this.statusFollowUps.set(id, followUp);
    }
  }
  emitAuthCompletion(completion) {
    if (this.disposed) return;
    for (const listener of this.authCompletionListeners) listener(completion);
  }
  emitServersUpdated(event) {
    if (this.disposed) return;
    for (const listener of this.serversUpdatedListeners) listener(event);
  }
};
function createMcpService(deps) {
  return new McpHostService(deps);
}

