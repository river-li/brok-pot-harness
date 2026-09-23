var import_node_path60 = require("node:path");
var BUILTIN_SKILL_CONFIG_DIR = {
  configDir: ".cursor",
  subdir: "skills-cursor",
  thirdParty: false,
  builtin: true
};
var SKILL_CONFIG_DIRS = [
  { configDir: ".cursor", subdir: "skills", thirdParty: false, builtin: false },
  { configDir: ".claude", subdir: "skills", thirdParty: true, builtin: false },
  { configDir: ".codex", subdir: "skills", thirdParty: true, builtin: false },
  { configDir: ".grok", subdir: "skills", thirdParty: true, builtin: false },
  { configDir: ".agents", subdir: "skills", thirdParty: false, builtin: false },
  BUILTIN_SKILL_CONFIG_DIR
];
var EXTENSIBILITY_MARKER_DIRS = new Set(SKILL_CONFIG_DIRS.map((dir) => dir.configDir));
function getBuiltinExtensibilitySkillRoot(userHomeDirectory) {
  return {
    dirPath: (0, import_node_path60.join)(userHomeDirectory, BUILTIN_SKILL_CONFIG_DIR.configDir, BUILTIN_SKILL_CONFIG_DIR.subdir),
    scope: "builtin",
    source: "builtin"
  };
}
function getDiscoverableSkillConfigDirs(thirdPartyExtensibilityEnabled) {
  return SKILL_CONFIG_DIRS.filter((dir) => !dir.builtin && (thirdPartyExtensibilityEnabled || !dir.thirdParty));
}
function getProjectExtensibilitySkillRoots(projectRoot, thirdPartyExtensibilityEnabled) {
  return getDiscoverableSkillConfigDirs(thirdPartyExtensibilityEnabled).map((dir) => ({
    dirPath: (0, import_node_path60.join)(projectRoot, dir.configDir, dir.subdir),
    scope: "project",
    source: "workspace"
  }));
}
function getUserExtensibilitySkillRoots(userHomeDirectory, thirdPartyExtensibilityEnabled) {
  return getDiscoverableSkillConfigDirs(thirdPartyExtensibilityEnabled).map((dir) => ({
    dirPath: (0, import_node_path60.join)(userHomeDirectory, dir.configDir, dir.subdir),
    scope: "user",
    source: "user"
  }));
}
