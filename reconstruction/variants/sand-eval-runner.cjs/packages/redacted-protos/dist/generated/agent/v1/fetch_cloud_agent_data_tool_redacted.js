/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/redacted-protos/dist/generated/agent/v1/fetch_cloud_agent_data_tool_redacted.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function toRedactedFetchCloudAgentDataArgs(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    bcIds: msg.bcIds,
    sources: msg.sources,
    statuses: msg.statuses,
    includeTeamWide: msg.includeTeamWide,
    includeArchived: msg.includeArchived,
    limit: msg.limit,
    includeTranscript: msg.includeTranscript,
    activeSince: msg.activeSince
  };
}
function fromRedactedFetchCloudAgentDataArgs(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new FetchCloudAgentDataArgs({
    bcIds: msg.bcIds,
    sources: msg.sources,
    statuses: msg.statuses,
    includeTeamWide: msg.includeTeamWide,
    includeArchived: msg.includeArchived,
    limit: msg.limit,
    includeTranscript: msg.includeTranscript,
    activeSince: msg.activeSince
  });
}
function toRedactedFetchCloudAgentDataResult(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    result: toRedactedFetchCloudAgentDataResult_result(msg.result, privacyMode)
  };
}
function toRedactedFetchCloudAgentDataResult_result(oneof, privacyMode) {
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "success":
      return { case: "success", value: toRedactedFetchCloudAgentDataSuccess(oneof.value, privacyMode) };
    case "error":
      return { case: "error", value: toRedactedFetchCloudAgentDataError(oneof.value, privacyMode) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function fromRedactedFetchCloudAgentDataResult(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new FetchCloudAgentDataResult({
    result: fromRedactedFetchCloudAgentDataResult_result(msg.result, purpose, opts)
  });
}
function fromRedactedFetchCloudAgentDataResult_result(oneof, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "success":
      return { case: "success", value: fromRedactedFetchCloudAgentDataSuccess(oneof.value, purpose, opts) };
    case "error":
      return { case: "error", value: fromRedactedFetchCloudAgentDataError(oneof.value, purpose, opts) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function toRedactedFetchCloudAgentDataSuccess(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    summary: createRedactedString(msg.summary, DataClassification.CODE, "summary", privacyMode),
    agentCount: msg.agentCount,
    writtenPaths: msg.writtenPaths.map((v2) => createRedactedString(v2, DataClassification.PATH, "written_paths", privacyMode)),
    unavailableBcIds: msg.unavailableBcIds
  };
}
function fromRedactedFetchCloudAgentDataSuccess(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new FetchCloudAgentDataSuccess({
    summary: msg.summary.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    agentCount: msg.agentCount,
    writtenPaths: msg.writtenPaths.map((v2) => v2.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })),
    unavailableBcIds: msg.unavailableBcIds
  });
}
function toRedactedFetchCloudAgentDataError(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    error: createRedactedString(msg.error, DataClassification.CODE, "error", privacyMode)
  };
}
function fromRedactedFetchCloudAgentDataError(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new FetchCloudAgentDataError({
    error: msg.error.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedFetchCloudAgentDataToolCall(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    args: msg.args !== void 0 ? toRedactedFetchCloudAgentDataArgs(msg.args, privacyMode) : void 0,
    result: msg.result !== void 0 ? toRedactedFetchCloudAgentDataResult(msg.result, privacyMode) : void 0
  };
}
function fromRedactedFetchCloudAgentDataToolCall(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new FetchCloudAgentDataToolCall({
    args: msg.args !== void 0 ? fromRedactedFetchCloudAgentDataArgs(msg.args, purpose, opts) : void 0,
    result: msg.result !== void 0 ? fromRedactedFetchCloudAgentDataResult(msg.result, purpose, opts) : void 0
  });
}

