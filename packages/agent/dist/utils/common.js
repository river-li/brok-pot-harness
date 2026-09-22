/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/utils/common.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function getFilenameWithoutExtension(filePath) {
  const lastSeparator = Math.max(filePath.lastIndexOf("/"), filePath.lastIndexOf("\\"));
  const filename = lastSeparator >= 0 ? filePath.substring(lastSeparator + 1) : filePath;
  if (filename.toLowerCase().endsWith(".mdc")) {
    return filename.substring(0, filename.length - 4);
  }
  return filename;
}
function getFirstNonEmptyLine(content) {
  const lines2 = content.split("\n");
  return lines2.find((line) => line.trim().length > 0) ?? "";
}
function getContextUsageInfo(tokenDetails) {
  const contextWindowSize = tokenDetails.maxTokens;
  const contextTokens = tokenDetails.usedTokens;
  const contextUsagePercent = contextWindowSize > 0 ? contextTokens / contextWindowSize * 100 : 0;
  return { contextWindowSize, contextTokens, contextUsagePercent };
}
function getSkillSourceFromPath(fullPath) {
  const normalizedPath = fullPath.replace(/\\/g, "/");
  if (normalizedPath.includes("/.cursor/skills-cursor/")) {
    return "builtin";
  }
  if (normalizedPath.includes("/.cursor/plugins/") || normalizedPath.includes("/.claude/plugins/")) {
    return "plugin";
  }
  if (normalizedPath.includes("/.claude/skills/")) {
    return "claude";
  }
  if (normalizedPath.includes("/.cursor/skills/") || normalizedPath.includes("/.agents/skills/")) {
    return "workspace";
  }
  return "unknown";
}
function isHookStepConfigured(configuredSteps, step) {
  if (configuredSteps === void 0) {
    return false;
  }
  return configuredSteps.includes(step);
}

