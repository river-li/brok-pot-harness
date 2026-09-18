init_cursor_rules_pb();
function fingerprintTeamRules(rules) {
  const entries = rules.filter((rule) => rule.source === CursorRuleSource.TEAM).map((rule) => {
    const type2 = rule.type?.type;
    const globs = type2?.case === "fileGlobbed" ? type2.value.globs.join("") : "";
    return `${rule.fullPath}\0${rule.isRequired}\0${rule.content}\0${globs}`;
  }).sort();
  return entries.length === 0 ? void 0 : fingerprintString(entries.join(""));
}
function fingerprintBotSkillsCatalog(skills) {
  const paths = skills.map((skill) => skill.fullPath).filter((fullPath) => fullPath !== void 0 && fullPath.length > 0 && BOT_SKILLS_PLUGIN_PATH.test(fullPath)).sort();
  return paths.length === 0 ? void 0 : fingerprintString(paths.join(""));
}
var USER_INFO_CATALOG_KINDS = [
  "subagent_models",
  "subagent_types",
  "dynamic_tool_snapshot"
];
var CATALOG_RERENDER_REASON = {
  subagent_models: "subagent_models_change",
  subagent_types: "subagent_types_change",
  dynamic_tool_snapshot: "dynamic_tool_snapshot_change"
};
function statementMatchesUserInfoCatalog(statement, kind, inputs) {
  switch (kind) {
    case "subagent_models":
      return userInfoMatchesAvailableSubagentModels(statement, inputs.availableSubagentModelsDescription);
    case "subagent_types":
      return userInfoMatchesAvailableSubagentTypes(statement, inputs.availableSubagentTypesDescription);
    case "dynamic_tool_snapshot":
      return inputs.skipDynamicToolSnapshotCheck === true || userInfoMatchesDynamicToolSnapshot(statement, inputs.mcpMetaToolOptions);
    default: {
      const _exhaustive = kind;
      return _exhaustive;
    }
  }
}
function getStaleUserInfoCatalogs(userInfoContent, inputs) {
  return USER_INFO_CATALOG_KINDS.filter((kind) => !statementMatchesUserInfoCatalog(userInfoContent, kind, inputs));
}
function getUserInfoRerenderReason(params) {
  const firstMsg = params.priorMessages[0];
  if (firstMsg === void 0 || firstMsg.role !== "user") {
    return void 0;
  }
  const contentStr = userMessagePlainText(fromRedactedCoreMessage(firstMsg, PrivacyCapability.UNSAFE_ALWAYS_ALLOWED));
  if (contentStr === void 0 || !contentStr.includes("<user_info>")) {
    return void 0;
  }
  if (params.agentTypeChanged) {
    return "agent_type_change";
  }
  if (params.deferCatalogRerender !== true) {
    const staleCatalog = getStaleUserInfoCatalogs(contentStr, params)[0];
    if (staleCatalog !== void 0) {
      return CATALOG_RERENDER_REASON[staleCatalog];
    }
  }
  if (params.teamRules !== void 0 && params.teamRules.currentFingerprint !== params.teamRules.previousFingerprint) {
    return "team_rules_change";
  }
  if (params.agentSkills !== void 0 && params.agentSkills.currentFingerprint !== void 0 && params.agentSkills.currentFingerprint !== params.agentSkills.previousFingerprint) {
    return "agent_skills_change";
  }
  const customUserRules = params.customUserRules;
  if (customUserRules === void 0) {
    return void 0;
  }
  if (customUserRules.expectedRules.length > 0) {
    return userInfoHasExpectedCustomUserRules(contentStr, customUserRules.modelInfo, customUserRules.featureFlags, customUserRules.toolNames) ? void 0 : "custom_user_rules_missing";
  }
  return userInfoHasAnyGeneratedCustomUserRules(contentStr) ? "custom_user_rules_stale" : void 0;
}
