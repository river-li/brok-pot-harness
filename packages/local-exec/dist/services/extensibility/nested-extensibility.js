function escapeRegExp2(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
var SKILLS_DIR_PATTERNS = SKILL_CONFIG_DIRS.map(({ configDir, subdir, thirdParty }) => ({
  pattern: new RegExp(`[/\\\\]${escapeRegExp2(configDir)}[/\\\\]${escapeRegExp2(subdir)}[/\\\\]`, "i"),
  requiresThirdParty: thirdParty
}));
