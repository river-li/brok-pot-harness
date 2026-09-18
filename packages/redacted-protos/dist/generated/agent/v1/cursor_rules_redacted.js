init_cursor_rules_pb();
function toRedactedCursorRuleTypeGlobal(msg, privacyMode) {
  return {
    _privacyMode: privacyMode
  };
}
function fromRedactedCursorRuleTypeGlobal(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new CursorRuleTypeGlobal({});
}
function toRedactedCursorRuleTypeFileGlobs(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    globs: msg.globs.map((v2) => createRedactedString(v2, DataClassification.PATH, "globs", privacyMode))
  };
}
function fromRedactedCursorRuleTypeFileGlobs(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new CursorRuleTypeFileGlobs({
    globs: msg.globs.map((v2) => v2.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }))
  });
}
function toRedactedCursorRuleTypeAgentFetched(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    description: createRedactedString(msg.description, DataClassification.CODE, "description", privacyMode)
  };
}
function fromRedactedCursorRuleTypeAgentFetched(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new CursorRuleTypeAgentFetched({
    description: msg.description.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedCursorRuleTypeManuallyAttached(msg, privacyMode) {
  return {
    _privacyMode: privacyMode
  };
}
function fromRedactedCursorRuleTypeManuallyAttached(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new CursorRuleTypeManuallyAttached({});
}
function toRedactedCursorRuleType(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    type: toRedactedCursorRuleType_type(msg.type, privacyMode)
  };
}
function toRedactedCursorRuleType_type(oneof, privacyMode) {
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "global":
      return { case: "global", value: toRedactedCursorRuleTypeGlobal(oneof.value, privacyMode) };
    case "fileGlobbed":
      return { case: "fileGlobbed", value: toRedactedCursorRuleTypeFileGlobs(oneof.value, privacyMode) };
    case "agentFetched":
      return { case: "agentFetched", value: toRedactedCursorRuleTypeAgentFetched(oneof.value, privacyMode) };
    case "manuallyAttached":
      return { case: "manuallyAttached", value: toRedactedCursorRuleTypeManuallyAttached(oneof.value, privacyMode) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function fromRedactedCursorRuleType(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new CursorRuleType({
    type: fromRedactedCursorRuleType_type(msg.type, purpose, opts)
  });
}
function fromRedactedCursorRuleType_type(oneof, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "global":
      return { case: "global", value: fromRedactedCursorRuleTypeGlobal(oneof.value, purpose, opts) };
    case "fileGlobbed":
      return { case: "fileGlobbed", value: fromRedactedCursorRuleTypeFileGlobs(oneof.value, purpose, opts) };
    case "agentFetched":
      return { case: "agentFetched", value: fromRedactedCursorRuleTypeAgentFetched(oneof.value, purpose, opts) };
    case "manuallyAttached":
      return { case: "manuallyAttached", value: fromRedactedCursorRuleTypeManuallyAttached(oneof.value, purpose, opts) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function toRedactedCursorRule(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    fullPath: createRedactedString(msg.fullPath, DataClassification.PATH, "full_path", privacyMode),
    content: createRedactedString(msg.content, DataClassification.CODE, "content", privacyMode),
    type: msg.type !== void 0 ? toRedactedCursorRuleType(msg.type, privacyMode) : void 0,
    source: msg.source,
    gitRemoteOrigin: msg.gitRemoteOrigin !== void 0 ? createRedactedString(msg.gitRemoteOrigin, DataClassification.PATH, "git_remote_origin", privacyMode) : void 0,
    parseError: msg.parseError !== void 0 ? createRedactedString(msg.parseError, DataClassification.CODE, "parse_error", privacyMode) : void 0,
    environments: msg.environments,
    disabledEnvironments: msg.disabledEnvironments,
    plugin: msg.plugin,
    marketplace: msg.marketplace,
    pluginId: msg.pluginId,
    marketplaceId: msg.marketplaceId,
    scopedTo: msg.scopedTo,
    frontmatter: createRedactedString(msg.frontmatter, DataClassification.CODE, "frontmatter", privacyMode),
    isRequired: msg.isRequired
  };
}
function fromRedactedCursorRule(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new CursorRule2({
    fullPath: msg.fullPath.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    content: msg.content.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    type: msg.type !== void 0 ? fromRedactedCursorRuleType(msg.type, purpose, opts) : void 0,
    source: msg.source,
    gitRemoteOrigin: msg.gitRemoteOrigin?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    parseError: msg.parseError?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    environments: msg.environments,
    disabledEnvironments: msg.disabledEnvironments,
    plugin: msg.plugin,
    marketplace: msg.marketplace,
    pluginId: msg.pluginId,
    marketplaceId: msg.marketplaceId,
    scopedTo: msg.scopedTo,
    frontmatter: msg.frontmatter.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    isRequired: msg.isRequired
  });
}
