var import_node_fs70 = require("node:fs");
var import_node_path117 = require("node:path");
init_dashboard_connect();
init_dashboard_pb();
init_errors();
init_cursor_inference();
function skillRecordsIdentity(records2) {
  return records2.map((record2) => `${record2.id}@${record2.pluginVersion}`).sort().join("\n");
}
function toPluginSkillInfo(record2) {
  return {
    pluginId: record2.pluginId,
    pluginName: record2.pluginName,
    name: record2.name,
    description: record2.description
  };
}
function skillNameFromPath(relativePath) {
  const segments = relativePath.split("/").filter((segment) => segment.length > 0);
  const fileIndex = segments.length - 1;
  return segments[fileIndex - 1] ?? segments[fileIndex] ?? "";
}
function pluginVersionOf(identifier) {
  const version3 = "version" in identifier.sourceInfo ? identifier.sourceInfo.version : void 0;
  return typeof version3 === "string" ? version3 : "";
}
function pluginContentsToSkillRecords(plugins, publisherFacts = /* @__PURE__ */ new Map()) {
  const records2 = [];
  const usedIds = /* @__PURE__ */ new Set();
  for (const plugin of plugins) {
    if (plugin.loadError != null || plugin.installPath.length === 0) continue;
    const pluginId = getPluginDbId(plugin.identifier);
    if (pluginId == null || pluginId.length === 0) continue;
    const pluginName = plugin.displayName != null && plugin.displayName.length > 0 ? plugin.displayName : plugin.identifier.sourceInfo.name;
    for (const skill of plugin.skills) {
      const name17 = clampSkillName(
        skill.name != null && skill.name.length > 0 ? skill.name : skillNameFromPath(skill.path)
      );
      if (name17.length === 0) continue;
      const slug = slugifySkillName(name17);
      let id = `plugin-${pluginId}-${slug}`;
      for (let suffix = 2; usedIds.has(id); suffix++) {
        id = `plugin-${pluginId}-${slug}-${suffix}`;
      }
      usedIds.add(id);
      records2.push({
        id,
        pluginId,
        pluginName,
        name: name17,
        description: clampSkillDescription(skill.description ?? ""),
        filePath: (0, import_node_path117.resolve)(plugin.installPath, skill.path),
        pluginVersion: pluginVersionOf(plugin.identifier),
        installPath: plugin.installPath,
        skillRelativePath: skill.path,
        publisherUserId: publisherFacts.get(pluginId)?.publisherUserId ?? null,
        marketplaceTeamId: publisherFacts.get(pluginId)?.marketplaceTeamId ?? null
      });
    }
  }
  return records2;
}
function pluginAuthBlocksFromFailures(failures) {
  const blocks = [];
  const seen = /* @__PURE__ */ new Set();
  for (const failure2 of failures) {
    if (classifyCloneError(failure2.errorMessage) !== "user_git_access") continue;
    const pluginId = failure2.pluginDbId ?? failure2.pluginId ?? "";
    const key = pluginId.length > 0 ? pluginId : `name:${failure2.pluginName}`;
    if (seen.has(key)) continue;
    seen.add(key);
    blocks.push({
      pluginId,
      pluginName: failure2.pluginName,
      ...failure2.marketplaceName != null ? { marketplaceName: failure2.marketplaceName } : {}
    });
  }
  return blocks;
}
var EFFECTIVE_PLUGINS_RPC_TIMEOUT_MS = 15e3;
var CURRENT_USER_RPC_TIMEOUT_MS = 1e4;
function publisherFactsFromListing(response) {
  const byPluginId = /* @__PURE__ */ new Map();
  for (const effective of response.plugins) {
    const plugin = effective.plugin;
    if (plugin == null) continue;
    const ownerUserId = plugin.publisher?.ownerUserId;
    const teamId = plugin.marketplace?.teamId;
    byPluginId.set(plugin.id.toString(), {
      publisherUserId: ownerUserId != null && ownerUserId > 0 ? ownerUserId : null,
      marketplaceTeamId: teamId != null && teamId > 0 ? teamId : null
    });
  }
  return byPluginId;
}
function selectedTeamGetMeRequest(teamId) {
  return new GetMeRequest(teamId === void 0 ? {} : { teamId });
}
function createSharedInstalledPluginsLoader(deps) {
  const pluginsRoot = getPluginsRootDir(deps.sandRootDir);
  const dashboardClient = createSandCursorBackendClient(DashboardService, {
    backend: deps.backend,
    getAccessToken: deps.auth.getAccessToken,
    getTeamId: deps.auth.getTeamId,
    getMachineId: deps.auth.getMachineId
  });
  let currentUserId = null;
  const resolveCurrentUserId = async () => {
    if (currentUserId != null) return currentUserId;
    try {
      const response = await dashboardClient.getMe(
        selectedTeamGetMeRequest(await deps.auth.getTeamId()),
        { timeoutMs: CURRENT_USER_RPC_TIMEOUT_MS }
      );
      currentUserId = response.userId > 0 ? response.userId : null;
    } catch (error41) {
      deps.log(`[sand:plugin-skills] could not resolve the signed-in user: ${errorLogTag(error41)}`);
    }
    return currentUserId;
  };
  return async () => {
    const listedCacheKeys = [];
    const listedPluginIds = /* @__PURE__ */ new Set();
    let publisherFacts = /* @__PURE__ */ new Map();
    let currentUserIdForPass = null;
    const client = createBackendMarketplaceClient(
      async () => {
        const response = await dashboardClient.getEffectiveUserPlugins(
          new GetEffectiveUserPluginsRequest(),
          { timeoutMs: EFFECTIVE_PLUGINS_RPC_TIMEOUT_MS }
        );
        publisherFacts = publisherFactsFromListing(response);
        currentUserIdForPass = await resolveCurrentUserId();
        return normalizeEffectiveUserPluginsResponse(response);
      },
      {
        marketplaceCacheRoot: (0, import_node_path117.join)(pluginsRoot, "marketplaces"),
        listOptions: { enableInlinePlugins: true },
        sparsePluginClones: deps.isSparsePluginClonesEnabled(),
        extraGitConfig: () => buildOriginTokenGitConfig(deps.auth.peekAccessToken() ?? void 0)
      }
    );
    const result = await loadFromMarketplaceSource({
      client,
      userId: "sand",
      cacheManager: new DefaultPluginCacheManager(void 0, {
        cacheRoot: (0, import_node_path117.join)(pluginsRoot, "cache")
      }),
      pruneOldVersions: true,
      onPluginsListed: async (entries) => {
        for (const entry of entries) {
          if (entry.pluginDbId != null && entry.pluginDbId.length > 0) {
            listedPluginIds.add(entry.pluginDbId);
          }
          const slug = entry.marketplace?.name;
          if (slug != null && slug.length > 0) {
            listedCacheKeys.push({
              marketplaceSlug: slug,
              pluginId: entry.pluginId
            });
          }
        }
      }
    });
    for (const failure2 of result.failures) {
      deps.log(
        `[sand:plugin-skills] plugin ${failure2.pluginName} failed to load: ${failure2.errorMessage}`
      );
    }
    for (const plugin of result.plugins) {
      const pluginId = getPluginDbId(plugin.identifier);
      if (pluginId != null && pluginId.length > 0) {
        listedPluginIds.add(pluginId);
      }
    }
    return {
      plugins: result.plugins,
      authBlocked: pluginAuthBlocksFromFailures(result.failures),
      listedPluginIds: [...listedPluginIds],
      listedCacheKeys,
      publisherFacts,
      currentUserId: currentUserIdForPass
    };
  };
}
function pruneUninstalledPluginDirs(cacheRoot, listedCacheKeys, indexedFilePaths) {
  const keep = new Set(listedCacheKeys.map((key) => getPluginInstallCachePath(cacheRoot, key)));
  let slugEntries;
  try {
    slugEntries = (0, import_node_fs70.readdirSync)(cacheRoot, { withFileTypes: true });
  } catch {
    return;
  }
  for (const slugEntry of slugEntries) {
    if (!slugEntry.isDirectory()) continue;
    const slugDir = (0, import_node_path117.join)(cacheRoot, slugEntry.name);
    let pluginEntries;
    try {
      pluginEntries = (0, import_node_fs70.readdirSync)(slugDir, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const pluginEntry of pluginEntries) {
      if (!pluginEntry.isDirectory()) continue;
      const pluginDir = (0, import_node_path117.join)(slugDir, pluginEntry.name);
      if (keep.has(pluginDir)) continue;
      const pluginDirPrefix = pluginDir + import_node_path117.sep;
      if (indexedFilePaths.some((path31) => path31.startsWith(pluginDirPrefix))) {
        continue;
      }
      try {
        (0, import_node_fs70.rmSync)(pluginDir, { recursive: true, force: true });
      } catch {
      }
    }
  }
}
var PLUGIN_SKILLS_REFRESH_INTERVAL_MS = 24 * 60 * 6e4;
var SandPluginSkillsService = class {
  constructor(options2) {
    this.options = options2;
  }
  options;
  isDisposed = false;
  inFlight = null;
  pending = null;
  start() {
    this.syncInBackground("startup");
  }
  handleAuthChange() {
    this.syncInBackground("auth_change");
  }
  syncInBackground(trigger2) {
    void (async () => {
      try {
        await this.sync(trigger2);
      } catch {
      }
    })();
  }
  dispose() {
    this.isDisposed = true;
  }
  current() {
    return this.currentIndex()?.skills ?? [];
  }
  currentIndex() {
    return readPluginSkillsCache(getPluginSkillsDir(this.options.sandRootDir));
  }
  currentAuthBlocked() {
    return readPluginSkillsCache(getPluginSkillsDir(this.options.sandRootDir))?.authBlocked ?? [];
  }
  async sync(trigger2) {
    if (this.isDisposed) return this.current();
    if (this.inFlight == null) return this.startPass(trigger2);
    if (this.pending == null) {
      const running = this.inFlight;
      const promise2 = (async () => {
        try {
          await running;
        } catch {
        }
        const nextTrigger = this.pending?.trigger ?? trigger2;
        this.pending = null;
        if (this.isDisposed) return this.current();
        return this.startPass(nextTrigger);
      })();
      this.pending = { trigger: trigger2, promise: promise2 };
    } else {
      this.pending.trigger = trigger2;
    }
    return this.pending.promise;
  }
  startPass(trigger2) {
    const pass = this.runPass(trigger2);
    this.inFlight = pass;
    const clear = () => {
      if (this.inFlight === pass) this.inFlight = null;
    };
    pass.then(clear, clear);
    return pass;
  }
  async runPass(trigger2) {
    const startedAtMs = Date.now();
    try {
      const loaded = await this.options.load();
      if (this.isDisposed) return this.current();
      const previous = this.currentIndex();
      let records2 = pluginContentsToSkillRecords(loaded.plugins, loaded.publisherFacts);
      const listedPluginIds = new Set(loaded.listedPluginIds);
      const loadedPluginIds = new Set(
        loaded.plugins.flatMap((plugin) => {
          if (plugin.loadError != null || plugin.installPath.length === 0) {
            return [];
          }
          const pluginId = getPluginDbId(plugin.identifier);
          return pluginId != null ? [pluginId] : [];
        })
      );
      records2 = [
        ...records2,
        ...(previous?.skills ?? []).filter(
          (record2) => listedPluginIds.has(record2.pluginId) && !loadedPluginIds.has(record2.pluginId)
        )
      ];
      writePluginSkillsCache(getPluginSkillsDir(this.options.sandRootDir), {
        currentUserId: loaded.currentUserId ?? previous?.currentUserId ?? null,
        skills: records2,
        authBlocked: loaded.authBlocked
      });
      pruneUninstalledPluginDirs(
        (0, import_node_path117.join)(getPluginsRootDir(this.options.sandRootDir), "cache"),
        loaded.listedCacheKeys,
        records2.map((record2) => record2.filePath)
      );
      this.options.reportSync?.({
        trigger: trigger2,
        outcome: "ok",
        changed: previous == null ? records2.length > 0 : skillRecordsIdentity(previous.skills) !== skillRecordsIdentity(records2),
        skillCount: records2.length,
        durationMs: Date.now() - startedAtMs
      });
      return records2;
    } catch (error41) {
      this.options.log?.(`[sand:plugin-skills] sync (${trigger2}) failed: ${errorLogTag(error41)}`);
      this.options.reportSync?.({
        trigger: trigger2,
        outcome: "failed",
        errorClass: errorLogTag(error41),
        durationMs: Date.now() - startedAtMs
      });
      throw error41;
    }
  }
};
