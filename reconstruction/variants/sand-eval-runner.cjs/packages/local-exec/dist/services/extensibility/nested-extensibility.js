/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/local-exec/dist/services/extensibility/nested-extensibility.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function escapeRegExp3(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
var SKILLS_DIR_PATTERNS = SKILL_CONFIG_DIRS.map(({ configDir, subdir, thirdParty }) => ({
  pattern: new RegExp(`[/\\\\]${escapeRegExp3(configDir)}[/\\\\]${escapeRegExp3(subdir)}[/\\\\]`, "i"),
  requiresThirdParty: thirdParty
}));

