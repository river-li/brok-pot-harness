/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/local-exec/dist/services/extensibility/agent-skills-prompt-order.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var import_node_path37 = require("node:path");
function normalizeFsPath(p2) {
  return p2.replace(/\\/g, "/");
}
function isUnderAnyDir(pathNorm, dirs) {
  for (const d of dirs) {
    const dir = normalizeFsPath(d);
    if (pathNorm === dir || pathNorm.startsWith(`${dir}/`)) {
      return true;
    }
  }
  return false;
}
function isPluginSkill(skill) {
  return Boolean(skill.plugin?.trim() || skill.pluginId?.trim() || skill.marketplaceId?.trim());
}
var SkillPromptTier;
(function(SkillPromptTier2) {
  SkillPromptTier2[SkillPromptTier2["Builtin"] = 0] = "Builtin";
  SkillPromptTier2[SkillPromptTier2["UserStore"] = 1] = "UserStore";
  SkillPromptTier2[SkillPromptTier2["UserHome"] = 2] = "UserHome";
  SkillPromptTier2[SkillPromptTier2["Workspace"] = 3] = "Workspace";
  SkillPromptTier2[SkillPromptTier2["Plugin"] = 4] = "Plugin";
})(SkillPromptTier || (SkillPromptTier = {}));
function buildPromptSortPrefixes(ctx) {
  const builtinDirs = [getBuiltinExtensibilitySkillRoot(ctx.userHomeDirectory).dirPath];
  const userDirs = getUserExtensibilitySkillRoots(ctx.userHomeDirectory, true).map((r) => r.dirPath);
  const workspaceDirs = [];
  for (const ws2 of ctx.workspacePaths) {
    workspaceDirs.push((0, import_node_path37.join)(ws2, ".cursor", "rules"));
    for (const root of getProjectExtensibilitySkillRoots(ws2, true)) {
      workspaceDirs.push(root.dirPath);
    }
  }
  return { builtinDirs, userDirs, workspaceDirs };
}
function tierForSkill(skill, ctx, prefixes) {
  if (isPluginSkill(skill)) {
    return SkillPromptTier.Plugin;
  }
  const pathNorm = normalizeFsPath(skill.fullPath);
  if (isUnderAnyDir(pathNorm, prefixes.builtinDirs)) {
    return SkillPromptTier.Builtin;
  }
  if (classifySkillPath(skill.fullPath, ctx).inAgentStore) {
    return SkillPromptTier.UserStore;
  }
  if (isUnderAnyDir(pathNorm, prefixes.userDirs)) {
    return SkillPromptTier.UserHome;
  }
  if (isUnderAnyDir(pathNorm, prefixes.workspaceDirs)) {
    return SkillPromptTier.Workspace;
  }
  return SkillPromptTier.Workspace;
}
function sortAgentSkillsForPromptOrder(skills, ctx) {
  if (skills.length <= 1) {
    return skills;
  }
  const prefixes = buildPromptSortPrefixes(ctx);
  const decorated = skills.map((skill, index) => ({
    skill,
    index,
    tier: tierForSkill(skill, ctx, prefixes)
  }));
  decorated.sort((a, b2) => a.tier - b2.tier || a.index - b2.index);
  return decorated.map((d) => d.skill);
}

