/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/managed-setup/cursor-skills-marketplace.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_dashboard_pb();
init_errors();
init_cursor_marketplace_client();
init_cursor_marketplace_logo_registry();
async function fetchSandManagedSkills(options2) {
  const client = createDashboardClient(
    options2.backend,
    options2.getAccessToken,
    options2.getMachineId
  );
  const response = await client.getManagedSkills(new GetManagedSkillsRequest(), {
    timeoutMs: CURSOR_MARKETPLACE_REQUEST_TIMEOUT_MS
  });
  return response.skills.map((skill) => ({
    id: skill.id,
    description: skill.description,
    content: skill.content,
    enabled: skill.enabled ?? true
  }));
}
async function fetchSkillCatalog(backend, getAccessToken, getMachineId, report) {
  const client = createDashboardClient(backend, getAccessToken, getMachineId);
  const entries = [];
  const seen = /* @__PURE__ */ new Set();
  try {
    const response = await client.listMarketplacePlugins(
      { excludeCloudAgentPlugins: true },
      { timeoutMs: CURSOR_MARKETPLACE_REQUEST_TIMEOUT_MS }
    );
    for (const plugin of response.plugins) {
      const logoUrl = plugin.publisher?.logoUrl || plugin.logoUrl || void 0;
      for (const skill of plugin.skills) {
        const url2 = skill.sourceUrl;
        if (url2 == null || url2.length === 0) continue;
        const key = skill.name.toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);
        if (logoUrl != null) rememberPluginLogoUrl(logoUrl);
        entries.push({
          id: `plugin:${plugin.id.toString()}:${skill.name}`,
          name: skill.name,
          description: skill.description ?? "",
          source: "marketplace",
          publisher: plugin.displayName.length > 0 ? plugin.displayName : plugin.name,
          iconUrl: logoUrl,
          install: { kind: "url", url: url2 }
        });
      }
    }
  } catch (error42) {
    report?.({
      extension: "managed_setup",
      kind: "skills_catalog",
      errorClass: errorLogTag(error42)
    });
  }
  entries.sort((a, b2) => a.name.localeCompare(b2.name));
  return entries;
}

