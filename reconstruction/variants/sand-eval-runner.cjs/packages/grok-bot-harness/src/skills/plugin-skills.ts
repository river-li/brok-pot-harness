/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/skills/plugin-skills.ts
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var PLUGIN_SKILLS_DIRNAME = "plugins";
function isBotSkillsPluginSkill(skill) {
  return skill.source === "plugin" && BOT_SKILLS_PLUGIN_PATH.test(skill.filePath);
}

