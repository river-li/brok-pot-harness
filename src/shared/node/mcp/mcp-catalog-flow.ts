init_invariant();
init_cursor_marketplace_client();
init_mcp_diagnostics();
init_mcp_plugin_variables();
var SandMcpCatalogFlow = class {
  constructor(core2) {
    this.core = core2;
  }
  core;
  catalogCache = /* @__PURE__ */ new Map();
  catalogViewsCache = null;
  peekMemberPublishMarketplaces() {
    return this.catalogViewsCache?.memberPublishMarketplaces;
  }
  async getCatalog(getAccessToken, options2) {
    const { bestEffortToken: bestEffortToken2, fetchMarketplaceMcpPlugins: fetchMarketplaceMcpPlugins2, marketplacePluginToView: marketplacePluginToView2 } = this.core.marketplace ?? await Promise.resolve().then(() => (init_mcp_marketplace(), mcp_marketplace_exports));
    const isAuthenticated = await bestEffortToken2(getAccessToken) != null;
    const cached2 = this.catalogViewsCache;
    const isCacheUsable = cached2 != null && cached2.includesPrivateMarketplaces === isAuthenticated;
    if (options2?.forceRefresh !== true && isCacheUsable && Date.now() - cached2.atMs < CATALOG_CACHE_TTL_MS) {
      return cached2.views;
    }
    const fetchPlugins = this.core.fetchMarketplacePlugins ?? this.marketplaceFetcherForBackend(fetchMarketplaceMcpPlugins2);
    let listing;
    try {
      listing = await fetchPlugins(getAccessToken, this.core.getMachineId);
    } catch (error41) {
      if (!isCacheUsable) throw error41;
      return cached2.views;
    }
    this.catalogCache.clear();
    const views = [];
    for (const plugin of listing.plugins) {
      this.catalogCache.set(plugin.pluginId, plugin);
      views.push(marketplacePluginToView2(plugin));
    }
    const sorted = views.sort((a, b2) => a.displayName.localeCompare(b2.displayName));
    this.catalogViewsCache = {
      views: sorted,
      atMs: Date.now(),
      includesPrivateMarketplaces: listing.includesPrivateMarketplaces,
      memberPublishMarketplaces: listing.memberPublishMarketplaces
    };
    return sorted;
  }
  async resolvePluginLogo(url2) {
    const { resolvePluginLogo: resolvePluginLogo2 } = this.core.marketplace ?? await Promise.resolve().then(() => (init_mcp_marketplace(), mcp_marketplace_exports));
    return await resolvePluginLogo2(url2);
  }
  marketplaceFetcherForBackend(fetchPlugins) {
    const backend = this.core.backend;
    invariant(
      backend != null,
      "SandMcpCatalogFlow: listing the marketplace needs a backend identity or a fetchMarketplacePlugins override"
    );
    const createClient2 = marketplaceDashboardClientFor(backend);
    return (getAccessToken, getMachineId) => fetchPlugins(getAccessToken, getMachineId, createClient2);
  }
  async installEntry(request3, getAccessToken) {
    const plugin = await this.requireCachedPlugin(request3.entryId, getAccessToken);
    const writer = this.core.requireAccountWriter();
    const teamVariablesKnown = request3.hasTeamConfiguredVariables === true || await this.pluginHasTeamConfiguredVariables(plugin.pluginId);
    if (!teamVariablesKnown) {
      this.assertPluginRequiredFieldsProvided(plugin, request3.values ?? {});
    }
    await writer.installPlugin({
      pluginId: BigInt(plugin.pluginId),
      ...request3.values != null ? { variables: request3.values } : {}
    });
    return await this.core.reloadServers();
  }
  async requireCachedPlugin(pluginId, getAccessToken) {
    let cached2 = this.catalogCache.get(pluginId);
    if (cached2 == null) {
      await this.getCatalog(getAccessToken, { forceRefresh: true });
      cached2 = this.catalogCache.get(pluginId);
    }
    if (cached2 == null) {
      throw new SandMcpConfigError(
        `Unknown marketplace plugin "${pluginId}". Reopen settings and try again.`,
        { kind: "unknown_plugin", pluginId }
      );
    }
    return cached2;
  }
  async updatePluginInstall(request3, getAccessToken) {
    const plugin = await this.requireCachedPlugin(request3.pluginId, getAccessToken);
    this.assertPluginRequiredFieldsProvided(plugin, request3.values);
    const writer = this.core.requireAccountWriter();
    await writer.updatePluginInstall({
      pluginId: BigInt(plugin.pluginId),
      variables: request3.values
    });
    return await this.core.reloadServers();
  }
  assertPluginRequiredFieldsProvided(plugin, values) {
    const missing = findMissingRequiredCatalogFields(plugin.variableFields, values);
    if (missing.length === 0) return;
    const labels = missing.map((field) => field.label).join(", ");
    const keys = missing.map((field) => field.key).join(", ");
    throw new SandMcpConfigError(
      `"${plugin.displayName}" needs a value for ${labels} before it can be installed. Ask the user for it and pass it in "values" (key${missing.length > 1 ? "s" : ""}: ${keys}), then try again.`,
      {
        kind: "missing_required_fields",
        pluginName: plugin.displayName,
        fields: missing.map((field) => ({ label: field.label, key: field.key }))
      }
    );
  }
  async pluginHasTeamConfiguredVariables(pluginId) {
    const list = this.core.listEffectivePlugins;
    if (list == null) return false;
    try {
      const plugins = await list();
      return plugins.some(
        (plugin) => plugin.pluginId === pluginId && plugin.hasTeamConfiguredVariables === true
      );
    } catch (error41) {
      reportMcpHostEdgeFailure("plugin-list", error41);
      return false;
    }
  }
};
