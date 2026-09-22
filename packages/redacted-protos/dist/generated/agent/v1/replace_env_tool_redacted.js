/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/redacted-protos/dist/generated/agent/v1/replace_env_tool_redacted.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_replace_env_tool_pb();
function toRedactedRepoCheckoutRefOverride(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    repoUrl: createRedactedString(msg.repoUrl, DataClassification.PATH, "repo_url", privacyMode),
    ref: createRedactedString(msg.ref, DataClassification.PATH, "ref", privacyMode)
  };
}
function fromRedactedRepoCheckoutRefOverride(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new RepoCheckoutRefOverride({
    repoUrl: msg.repoUrl.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    ref: msg.ref.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedReplaceEnvConfig(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    installScript: createRedactedString(msg.installScript, DataClassification.CODE, "install_script", privacyMode),
    dockerfileContents: createRedactedString(msg.dockerfileContents, DataClassification.CODE, "dockerfile_contents", privacyMode)
  };
}
function fromRedactedReplaceEnvConfig(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ReplaceEnvConfig({
    installScript: msg.installScript.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    dockerfileContents: msg.dockerfileContents.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedReplaceEnvArgs(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    config: msg.config !== void 0 ? toRedactedReplaceEnvConfig(msg.config, privacyMode) : void 0,
    mode: msg.mode,
    checkoutRefOverrides: msg.checkoutRefOverrides.map((v2) => toRedactedRepoCheckoutRefOverride(v2, privacyMode))
  };
}
function fromRedactedReplaceEnvArgs(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ReplaceEnvArgs({
    config: msg.config !== void 0 ? fromRedactedReplaceEnvConfig(msg.config, purpose, opts) : void 0,
    mode: msg.mode,
    checkoutRefOverrides: msg.checkoutRefOverrides.map((v2) => fromRedactedRepoCheckoutRefOverride(v2, purpose, opts))
  });
}
function toRedactedReplaceEnvSuccess(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    setupLogs: createRedactedString(msg.setupLogs, DataClassification.CODE, "setup_logs", privacyMode)
  };
}
function fromRedactedReplaceEnvSuccess(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ReplaceEnvSuccess({
    setupLogs: msg.setupLogs.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedReplaceEnvFailure(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    errorMessage: createRedactedString(msg.errorMessage, DataClassification.CODE, "error_message", privacyMode),
    setupLogs: createRedactedString(msg.setupLogs, DataClassification.CODE, "setup_logs", privacyMode)
  };
}
function fromRedactedReplaceEnvFailure(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ReplaceEnvFailure({
    errorMessage: msg.errorMessage.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    setupLogs: msg.setupLogs.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedReplaceEnvResult(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    result: toRedactedReplaceEnvResult_result(msg.result, privacyMode)
  };
}
function toRedactedReplaceEnvResult_result(oneof, privacyMode) {
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "success":
      return { case: "success", value: toRedactedReplaceEnvSuccess(oneof.value, privacyMode) };
    case "failure":
      return { case: "failure", value: toRedactedReplaceEnvFailure(oneof.value, privacyMode) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function fromRedactedReplaceEnvResult(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ReplaceEnvResult({
    result: fromRedactedReplaceEnvResult_result(msg.result, purpose, opts)
  });
}
function fromRedactedReplaceEnvResult_result(oneof, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "success":
      return { case: "success", value: fromRedactedReplaceEnvSuccess(oneof.value, purpose, opts) };
    case "failure":
      return { case: "failure", value: fromRedactedReplaceEnvFailure(oneof.value, purpose, opts) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function toRedactedReplaceEnvToolCall(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    args: msg.args !== void 0 ? toRedactedReplaceEnvArgs(msg.args, privacyMode) : void 0,
    result: msg.result !== void 0 ? toRedactedReplaceEnvResult(msg.result, privacyMode) : void 0,
    associatedPodKey: msg.associatedPodKey
  };
}
function fromRedactedReplaceEnvToolCall(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ReplaceEnvToolCall({
    args: msg.args !== void 0 ? fromRedactedReplaceEnvArgs(msg.args, purpose, opts) : void 0,
    result: msg.result !== void 0 ? fromRedactedReplaceEnvResult(msg.result, purpose, opts) : void 0,
    associatedPodKey: msg.associatedPodKey
  });
}
function toRedactedReplaceEnvToolCallDelta(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    associatedPodKey: msg.associatedPodKey
  };
}
function fromRedactedReplaceEnvToolCallDelta(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ReplaceEnvToolCallDelta({
    associatedPodKey: msg.associatedPodKey
  });
}

