/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/skills/plugin-skills-cache.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var import_node_fs66 = require("node:fs");
var import_node_path115 = require("node:path");
init_unknown_record();
var PLUGIN_SKILLS_DIRNAME = "plugin-skills";
var PLUGIN_SKILLS_CACHE_FILENAME = "cache.json";
function getPluginsRootDir(sandRoot) {
  return (0, import_node_path115.join)(sandRoot, "plugins");
}
function getPluginSkillsDir(sandRoot) {
  return (0, import_node_path115.join)(sandRoot, PLUGIN_SKILLS_DIRNAME);
}
function getPluginSkillsCachePath(cacheDir) {
  return (0, import_node_path115.join)(cacheDir, PLUGIN_SKILLS_CACHE_FILENAME);
}
function isSafePluginSkillId(id) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id);
}
function isPluginSkillRecord(value) {
  if (!isUnknownRecord(value)) return false;
  return typeof value.id === "string" && isSafePluginSkillId(value.id) && typeof value.pluginId === "string" && value.pluginId.length > 0 && typeof value.pluginName === "string" && typeof value.name === "string" && value.name.length > 0 && typeof value.description === "string" && typeof value.filePath === "string" && (0, import_node_path115.isAbsolute)(value.filePath);
}
function isPluginAuthBlock(value) {
  if (!isUnknownRecord(value)) return false;
  return typeof value.pluginId === "string" && typeof value.pluginName === "string" && (value.marketplaceName === void 0 || typeof value.marketplaceName === "string");
}
function positiveIdOrNull(value) {
  return Number.isInteger(value) && value > 0 ? value : null;
}
function withProvenanceDefaults(record2) {
  return {
    ...record2,
    pluginVersion: typeof record2.pluginVersion === "string" ? record2.pluginVersion : "",
    installPath: typeof record2.installPath === "string" && (0, import_node_path115.isAbsolute)(record2.installPath) ? record2.installPath : "",
    skillRelativePath: typeof record2.skillRelativePath === "string" ? record2.skillRelativePath : "",
    publisherUserId: positiveIdOrNull(record2.publisherUserId),
    marketplaceTeamId: positiveIdOrNull(record2.marketplaceTeamId)
  };
}
function readPluginSkillsCache(cacheDir) {
  try {
    const parsed2 = JSON.parse(
      (0, import_node_fs66.readFileSync)(getPluginSkillsCachePath(cacheDir), "utf8")
    );
    if (typeof parsed2.fetchedAt !== "number" || !Number.isFinite(parsed2.fetchedAt) || !Array.isArray(parsed2.skills) || !parsed2.skills.every(isPluginSkillRecord)) {
      return null;
    }
    return {
      fetchedAt: parsed2.fetchedAt,
      currentUserId: positiveIdOrNull(parsed2.currentUserId),
      skills: parsed2.skills.map(withProvenanceDefaults),
      authBlocked: Array.isArray(parsed2.authBlocked) && parsed2.authBlocked.every(isPluginAuthBlock) ? parsed2.authBlocked : []
    };
  } catch (error42) {
    reportFallbackUnlessAbsent("plugin_skills_cache", error42);
    return null;
  }
}
function writePluginSkillsCache(cacheDir, index) {
  const body = `${JSON.stringify(
    { fetchedAt: Date.now(), authBlocked: [], ...index },
    null,
    2
  )}
`;
  (0, import_node_fs66.mkdirSync)(cacheDir, { recursive: true, mode: AGENT_READABLE_SKILL_DIR_MODE });
  (0, import_node_fs66.chmodSync)(cacheDir, AGENT_READABLE_SKILL_DIR_MODE);
  writeFileAtomicSync(getPluginSkillsCachePath(cacheDir), body, {
    mode: AGENT_READABLE_SKILL_FILE_MODE
  });
}

