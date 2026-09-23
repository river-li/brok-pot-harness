function skillActivationTrigger(options2) {
  return options2.entrypoint === "agent_read" && options2.userMessageMentionsSkill === true ? "skill_name_in_prompt" : options2.entrypoint;
}
function catalogSource(skill) {
  switch (skill.source) {
    case "managed":
      return "builtin";
    case "plugin":
      return "plugin";
    case "workflow":
    case "automation":
      return "user";
    default: {
      const _exhaustive = skill.source;
      return _exhaustive;
    }
  }
}
function collapsedModelVisiblePath(path31) {
  return toModelVisibleText(import_node_path166.posix.normalize(path31));
}
var MANAGED_SKILLS_TREE = `${SAND_BOX_MODEL_VISIBLE_DATA_ROOT}/managed-skills/skills/`;
var PLUGIN_SKILLS_TREE = `${SAND_BOX_MODEL_VISIBLE_DATA_ROOT}/${PLUGIN_SKILLS_DIRNAME2}/`;
function sourceFromDataRootTree(collapsedPath) {
  if (collapsedPath.startsWith(MANAGED_SKILLS_TREE)) return "builtin";
  if (collapsedPath.startsWith(PLUGIN_SKILLS_TREE)) return "plugin";
  return void 0;
}
function skillActivationSource(options2, catalog) {
  const path31 = options2.skillPath;
  if (path31 !== void 0 && import_node_path166.posix.isAbsolute(path31)) {
    const read = collapsedModelVisiblePath(path31);
    const catalogued = catalog.find(
      (candidate) => candidate.filePath.length > 0 && collapsedModelVisiblePath(candidate.filePath) === read
    );
    if (catalogued !== void 0) return catalogSource(catalogued);
    const fromTree = sourceFromDataRootTree(read);
    if (fromTree !== void 0) return fromTree;
  }
  return options2.skillSource;
}
function skillActivatedAction(options2, catalog) {
  const skillName2 = options2.skillId.trim();
  if (skillName2.length === 0) return void 0;
  return {
    kind: "skillActivated",
    skillName: skillName2,
    trigger: skillActivationTrigger(options2),
    source: skillActivationSource(options2, catalog)
  };
}
