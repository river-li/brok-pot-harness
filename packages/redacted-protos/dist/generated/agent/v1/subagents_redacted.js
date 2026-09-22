/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/redacted-protos/dist/generated/agent/v1/subagents_redacted.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_subagents_pb();
function toRedactedSubagentType(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    type: toRedactedSubagentType_type(msg.type, privacyMode)
  };
}
function toRedactedSubagentType_type(oneof, privacyMode) {
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "unspecified":
      return { case: "unspecified", value: toRedactedSubagentTypeUnspecified(oneof.value, privacyMode) };
    case "computerUse":
      return { case: "computerUse", value: toRedactedSubagentTypeComputerUse(oneof.value, privacyMode) };
    case "custom":
      return { case: "custom", value: toRedactedSubagentTypeCustom(oneof.value, privacyMode) };
    case "explore":
      return { case: "explore", value: toRedactedSubagentTypeExplore(oneof.value, privacyMode) };
    case "mediaReview":
      return { case: "mediaReview", value: toRedactedSubagentTypeMediaReview(oneof.value, privacyMode) };
    case "bash":
      return { case: "bash", value: toRedactedSubagentTypeBash(oneof.value, privacyMode) };
    case "browserUse":
      return { case: "browserUse", value: toRedactedSubagentTypeBrowserUse(oneof.value, privacyMode) };
    case "shell":
      return { case: "shell", value: toRedactedSubagentTypeShell(oneof.value, privacyMode) };
    case "vmSetupHelper":
      return { case: "vmSetupHelper", value: toRedactedSubagentTypeVmSetupHelper(oneof.value, privacyMode) };
    case "debug":
      return { case: "debug", value: toRedactedSubagentTypeDebug(oneof.value, privacyMode) };
    case "cursorGuide":
      return { case: "cursorGuide", value: toRedactedSubagentTypeCursorGuide(oneof.value, privacyMode) };
    case "watchVideo":
      return { case: "watchVideo", value: toRedactedSubagentTypeWatchVideo(oneof.value, privacyMode) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function fromRedactedSubagentType(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new SubagentType({
    type: fromRedactedSubagentType_type(msg.type, purpose, opts)
  });
}
function fromRedactedSubagentType_type(oneof, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "unspecified":
      return { case: "unspecified", value: fromRedactedSubagentTypeUnspecified(oneof.value, purpose, opts) };
    case "computerUse":
      return { case: "computerUse", value: fromRedactedSubagentTypeComputerUse(oneof.value, purpose, opts) };
    case "custom":
      return { case: "custom", value: fromRedactedSubagentTypeCustom(oneof.value, purpose, opts) };
    case "explore":
      return { case: "explore", value: fromRedactedSubagentTypeExplore(oneof.value, purpose, opts) };
    case "mediaReview":
      return { case: "mediaReview", value: fromRedactedSubagentTypeMediaReview(oneof.value, purpose, opts) };
    case "bash":
      return { case: "bash", value: fromRedactedSubagentTypeBash(oneof.value, purpose, opts) };
    case "browserUse":
      return { case: "browserUse", value: fromRedactedSubagentTypeBrowserUse(oneof.value, purpose, opts) };
    case "shell":
      return { case: "shell", value: fromRedactedSubagentTypeShell(oneof.value, purpose, opts) };
    case "vmSetupHelper":
      return { case: "vmSetupHelper", value: fromRedactedSubagentTypeVmSetupHelper(oneof.value, purpose, opts) };
    case "debug":
      return { case: "debug", value: fromRedactedSubagentTypeDebug(oneof.value, purpose, opts) };
    case "cursorGuide":
      return { case: "cursorGuide", value: fromRedactedSubagentTypeCursorGuide(oneof.value, purpose, opts) };
    case "watchVideo":
      return { case: "watchVideo", value: fromRedactedSubagentTypeWatchVideo(oneof.value, purpose, opts) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function toRedactedSubagentTypeUnspecified(msg, privacyMode) {
  return {
    _privacyMode: privacyMode
  };
}
function fromRedactedSubagentTypeUnspecified(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new SubagentTypeUnspecified({});
}
function toRedactedSubagentTypeComputerUse(msg, privacyMode) {
  return {
    _privacyMode: privacyMode
  };
}
function fromRedactedSubagentTypeComputerUse(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new SubagentTypeComputerUse({});
}
function toRedactedSubagentTypeExplore(msg, privacyMode) {
  return {
    _privacyMode: privacyMode
  };
}
function fromRedactedSubagentTypeExplore(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new SubagentTypeExplore({});
}
function toRedactedSubagentTypeMediaReview(msg, privacyMode) {
  return {
    _privacyMode: privacyMode
  };
}
function fromRedactedSubagentTypeMediaReview(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new SubagentTypeMediaReview({});
}
function toRedactedSubagentTypeBash(msg, privacyMode) {
  return {
    _privacyMode: privacyMode
  };
}
function fromRedactedSubagentTypeBash(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new SubagentTypeBash({});
}
function toRedactedSubagentTypeShell(msg, privacyMode) {
  return {
    _privacyMode: privacyMode
  };
}
function fromRedactedSubagentTypeShell(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new SubagentTypeShell({});
}
function toRedactedSubagentTypeBrowserUse(msg, privacyMode) {
  return {
    _privacyMode: privacyMode
  };
}
function fromRedactedSubagentTypeBrowserUse(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new SubagentTypeBrowserUse({});
}
function toRedactedSubagentTypeVmSetupHelper(msg, privacyMode) {
  return {
    _privacyMode: privacyMode
  };
}
function fromRedactedSubagentTypeVmSetupHelper(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new SubagentTypeVmSetupHelper({});
}
function toRedactedSubagentTypeDebug(msg, privacyMode) {
  return {
    _privacyMode: privacyMode
  };
}
function fromRedactedSubagentTypeDebug(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new SubagentTypeDebug({});
}
function toRedactedSubagentTypeCursorGuide(msg, privacyMode) {
  return {
    _privacyMode: privacyMode
  };
}
function fromRedactedSubagentTypeCursorGuide(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new SubagentTypeCursorGuide({});
}
function toRedactedSubagentTypeWatchVideo(msg, privacyMode) {
  return {
    _privacyMode: privacyMode
  };
}
function fromRedactedSubagentTypeWatchVideo(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new SubagentTypeWatchVideo({});
}
function toRedactedSubagentTypeCustom(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    name: msg.name
  };
}
function fromRedactedSubagentTypeCustom(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new SubagentTypeCustom({
    name: msg.name
  });
}
function toRedactedCustomSubagent(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    fullPath: createRedactedString(msg.fullPath, DataClassification.PATH, "full_path", privacyMode),
    name: msg.name,
    description: createRedactedString(msg.description, DataClassification.CODE, "description", privacyMode),
    tools: msg.tools,
    model: msg.model,
    prompt: createRedactedString(msg.prompt, DataClassification.CODE, "prompt", privacyMode),
    permissionMode: msg.permissionMode,
    isBackground: msg.isBackground,
    plugin: msg.plugin,
    marketplace: msg.marketplace,
    pluginId: msg.pluginId,
    marketplaceId: msg.marketplaceId,
    forceDefaultModel: msg.forceDefaultModel,
    source: msg.source
  };
}
function fromRedactedCustomSubagent(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new CustomSubagent({
    fullPath: msg.fullPath.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    name: msg.name,
    description: msg.description.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    tools: msg.tools,
    model: msg.model,
    prompt: msg.prompt.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    permissionMode: msg.permissionMode,
    isBackground: msg.isBackground,
    plugin: msg.plugin,
    marketplace: msg.marketplace,
    pluginId: msg.pluginId,
    marketplaceId: msg.marketplaceId,
    forceDefaultModel: msg.forceDefaultModel,
    source: msg.source
  });
}

