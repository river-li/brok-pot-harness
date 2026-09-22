/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/node/mcp/mcp-marketplace.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var mcp_marketplace_exports = {};
__export(mcp_marketplace_exports, {
  bestEffortToken: () => bestEffortToken,
  fetchMarketplaceMcpPlugins: () => fetchMarketplaceMcpPlugins,
  marketplacePluginToView: () => marketplacePluginToView,
  resolvePluginLogo: () => resolvePluginLogo
});
function marketplacePluginToView(plugin) {
  return {
    id: plugin.pluginId,
    name: plugin.name,
    pluginName: plugin.pluginName,
    displayName: plugin.displayName,
    description: plugin.description,
    category: plugin.category,
    repositoryUrl: plugin.repositoryUrl,
    websiteUrl: plugin.websiteUrl,
    iconUrl: plugin.logoUrl,
    connectors: plugin.connectors,
    skills: plugin.skills,
    ...plugin.categoryKey != null ? { categoryKey: plugin.categoryKey } : {},
    ...plugin.categoryKeys != null && plugin.categoryKeys.length > 0 ? { categoryKeys: plugin.categoryKeys } : {},
    ...plugin.variableFields.length > 0 ? { fields: plugin.variableFields } : {},
    ...plugin.unsupportedVariableFieldKeys.length > 0 ? { unsupportedFieldKeys: plugin.unsupportedVariableFieldKeys } : {},
    ...plugin.marketplace != null ? { marketplace: plugin.marketplace } : {},
    ...plugin.isPublicListed === true ? { isPublicListed: true } : {},
    ...plugin.publisher != null ? { publisher: plugin.publisher } : {}
  };
}
function toCategoryLabel(key) {
  if (key == null) return "MCP";
  const locale = i18n.locale || DEFAULT_LOCALE;
  return key.toLowerCase().split("_").map((word) => word.length > 0 ? word[0].toLocaleUpperCase(locale) + word.slice(1) : word).join(" ");
}
function nonEmpty3(value) {
  return value != null && value.length > 0 ? value : void 0;
}
function isPrivateMarketplace(marketplace) {
  return marketplace.teamId != null || marketplace.userId != null;
}
function shouldListPlugin(plugin, skillCount) {
  const grokBotUsable = plugin.mcpServers.length + skillCount;
  const cursorOnly = plugin.rules.length + plugin.hooks.length + plugin.commands.length + plugin.subagents.length;
  return grokBotUsable > 0 || cursorOnly === 0;
}
function privateMarketplaceSummary(marketplace) {
  const displayName2 = marketplace.displayName != null && marketplace.displayName.length > 0 ? marketplace.displayName : marketplace.name;
  return {
    name: marketplace.name,
    displayName: displayName2,
    ownership: marketplace.teamId != null ? "team" : "user"
  };
}
function publisherSummary(publisher) {
  return {
    name: publisher.name,
    displayName: publisher.displayName.length > 0 ? publisher.displayName : publisher.name,
    isUserOwned: publisher.isUserOwned
  };
}
function toSandMarketplacePlugin(plugin) {
  const skills = plugin.skills.flatMap((skill) => {
    const sourceUrl = skill.sourceUrl;
    return [
      {
        name: skill.name,
        description: skill.description ?? "",
        ...sourceUrl != null && sourceUrl.length > 0 ? { sourceUrl } : {}
      }
    ];
  });
  if (!shouldListPlugin(plugin, skills.length)) return null;
  const primaryName = plugin.mcpServers[0]?.name ?? plugin.name;
  const publisher = plugin.publisher;
  const logoUrl = publisher?.logoUrl || plugin.logoUrl || void 0;
  if (logoUrl != null) rememberPluginLogoUrl(logoUrl);
  const marketplace = plugin.marketplace;
  const isPublicListed = (marketplace == null || !isPrivateMarketplace(marketplace)) && plugin.status === PluginStatus.APPROVED && plugin.isPublished;
  const categoryKey = plugin.curatedCategoryKeys.find((value) => value.length > 0);
  const variables = pluginVariablesSchemaToFields(plugin.variables?.toJson());
  return {
    pluginId: plugin.id.toString(),
    name: primaryName,
    pluginName: plugin.name,
    displayName: plugin.displayName.length > 0 ? plugin.displayName : plugin.name,
    description: plugin.description ?? "",
    category: toCategoryLabel(categoryKey),
    categoryKeys: plugin.curatedCategoryKeys,
    logoUrl,
    repositoryUrl: nonEmpty3(plugin.repositoryUrl),
    websiteUrl: nonEmpty3(publisher?.websiteUrl),
    sourceUrls: plugin.mcpServers.flatMap((server) => {
      const url2 = server.sourceUrl ?? "";
      return url2.length > 0 ? [url2] : [];
    }),
    connectors: plugin.mcpServers.map((server) => ({
      name: server.name,
      description: server.description ?? ""
    })),
    skills,
    variableFields: variables.fields,
    unsupportedVariableFieldKeys: variables.unsupportedFieldKeys,
    ...categoryKey != null ? { categoryKey } : {},
    ...marketplace != null && isPrivateMarketplace(marketplace) ? { marketplace: privateMarketplaceSummary(marketplace) } : {},
    ...isPublicListed ? { isPublicListed: true } : {},
    ...publisher != null ? { publisher: publisherSummary(publisher) } : {}
  };
}
function memberPublishMarketplacesFrom(marketplaces) {
  return marketplaces.flatMap((marketplace) => {
    const teamId = marketplace.teamId;
    if (teamId == null || teamId <= 0) return [];
    return [
      {
        teamId,
        isDefault: marketplace.isDefault || marketplace.name === DEFAULT_TEAM_MARKETPLACE_NAME,
        allowUserPublish: marketplace.allowUserPublish
      }
    ];
  });
}
async function fetchPrivateMarketplaceSide(client) {
  let marketplaces;
  try {
    const response = await client.listMarketplaces(
      {},
      { timeoutMs: CURSOR_MARKETPLACE_REQUEST_TIMEOUT_MS }
    );
    marketplaces = response.marketplaces.filter(isPrivateMarketplace);
  } catch (error42) {
    reportMcpHostEdgeFailure("marketplace-fetch", error42);
    return { plugins: [], memberPublishMarketplaces: void 0 };
  }
  const lists = await Promise.all(
    marketplaces.map(async (marketplace) => {
      try {
        const response = await client.listMarketplacePlugins(
          { marketplaceId: marketplace.id, excludeCloudAgentPlugins: true },
          { timeoutMs: CURSOR_MARKETPLACE_REQUEST_TIMEOUT_MS }
        );
        return response.plugins;
      } catch (error42) {
        reportMcpHostEdgeFailure("marketplace-fetch", error42);
        return [];
      }
    })
  );
  return {
    plugins: lists.flat(),
    memberPublishMarketplaces: memberPublishMarketplacesFrom(marketplaces)
  };
}
async function fetchMarketplaceMcpPlugins(getAccessToken, getMachineId, createClient2) {
  const client = createClient2(getAccessToken, getMachineId);
  const response = await client.listMarketplacePlugins(
    { excludeCloudAgentPlugins: true },
    { timeoutMs: CURSOR_MARKETPLACE_REQUEST_TIMEOUT_MS }
  );
  const byPluginId = /* @__PURE__ */ new Map();
  const add2 = (plugin) => {
    const converted = toSandMarketplacePlugin(plugin);
    if (converted != null) byPluginId.set(converted.pluginId, converted);
  };
  for (const plugin of response.plugins) add2(plugin);
  const includesPrivateMarketplaces = await bestEffortToken(getAccessToken) != null;
  let memberPublishMarketplaces;
  if (includesPrivateMarketplaces) {
    const privateSide = await fetchPrivateMarketplaceSide(client);
    for (const plugin of privateSide.plugins) add2(plugin);
    memberPublishMarketplaces = privateSide.memberPublishMarketplaces;
  }
  const plugins = [...byPluginId.values()];
  plugins.sort((a, b2) => a.displayName.localeCompare(b2.displayName));
  return {
    plugins,
    includesPrivateMarketplaces,
    ...memberPublishMarketplaces != null ? { memberPublishMarketplaces } : {}
  };
}
var DEFAULT_TEAM_MARKETPLACE_NAME;
var init_mcp_marketplace = __esm({
  "src/shared/node/mcp/mcp-marketplace.ts"() {
    "use strict";
    init_dist5();
    init_locale();
    init_proto();
    init_cursor_marketplace_client();
    init_cursor_marketplace_logo_registry();
    init_mcp_plugin_variables();
    init_cursor_marketplace_client();
    init_mcp_diagnostics();
    init_mcp_marketplace_logo();
    DEFAULT_TEAM_MARKETPLACE_NAME = "__DEFAULT__";
  }
});

