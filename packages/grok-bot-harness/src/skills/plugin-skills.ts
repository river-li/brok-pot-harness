var PLUGIN_SKILLS_DIRNAME2 = "plugins";
function isBotSkillsPluginSkill(skill) {
  return skill.source === "plugin" && BOT_SKILLS_PLUGIN_PATH.test(skill.filePath);
}
