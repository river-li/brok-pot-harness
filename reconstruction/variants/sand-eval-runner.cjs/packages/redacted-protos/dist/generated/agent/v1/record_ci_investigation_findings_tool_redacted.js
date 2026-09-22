/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/redacted-protos/dist/generated/agent/v1/record_ci_investigation_findings_tool_redacted.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function toRedactedRecordCiInvestigationFinding(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    checkName: msg.checkName,
    detailsUrl: msg.detailsUrl !== void 0 ? createRedactedString(msg.detailsUrl, DataClassification.PATH, "details_url", privacyMode) : void 0,
    tldr: createRedactedString(msg.tldr, DataClassification.CODE, "tldr", privacyMode),
    rootCause: msg.rootCause !== void 0 ? createRedactedString(msg.rootCause, DataClassification.CODE, "root_cause", privacyMode) : void 0,
    failingSignal: msg.failingSignal !== void 0 ? createRedactedString(msg.failingSignal, DataClassification.CODE, "failing_signal", privacyMode) : void 0,
    suggestedNextStep: msg.suggestedNextStep !== void 0 ? createRedactedString(msg.suggestedNextStep, DataClassification.CODE, "suggested_next_step", privacyMode) : void 0,
    diffRelation: msg.diffRelation,
    diffRelationEvidence: msg.diffRelationEvidence !== void 0 ? createRedactedString(msg.diffRelationEvidence, DataClassification.CODE, "diff_relation_evidence", privacyMode) : void 0,
    flakeAssessment: msg.flakeAssessment,
    flakeEvidence: msg.flakeEvidence !== void 0 ? createRedactedString(msg.flakeEvidence, DataClassification.CODE, "flake_evidence", privacyMode) : void 0,
    rerunAvailable: msg.rerunAvailable,
    rerunEvidence: msg.rerunEvidence !== void 0 ? createRedactedString(msg.rerunEvidence, DataClassification.CODE, "rerun_evidence", privacyMode) : void 0,
    recommendedAction: msg.recommendedAction,
    recommendedActionEvidence: msg.recommendedActionEvidence !== void 0 ? createRedactedString(msg.recommendedActionEvidence, DataClassification.CODE, "recommended_action_evidence", privacyMode) : void 0,
    confidence: msg.confidence
  };
}
function fromRedactedRecordCiInvestigationFinding(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new RecordCiInvestigationFinding({
    checkName: msg.checkName,
    detailsUrl: msg.detailsUrl?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    tldr: msg.tldr.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    rootCause: msg.rootCause?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    failingSignal: msg.failingSignal?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    suggestedNextStep: msg.suggestedNextStep?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    diffRelation: msg.diffRelation,
    diffRelationEvidence: msg.diffRelationEvidence?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    flakeAssessment: msg.flakeAssessment,
    flakeEvidence: msg.flakeEvidence?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    rerunAvailable: msg.rerunAvailable,
    rerunEvidence: msg.rerunEvidence?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    recommendedAction: msg.recommendedAction,
    recommendedActionEvidence: msg.recommendedActionEvidence?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    confidence: msg.confidence
  });
}
function toRedactedRecordCiInvestigationOverall(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    summary: createRedactedString(msg.summary, DataClassification.CODE, "summary", privacyMode),
    themes: msg.themes.map((v2) => createRedactedString(v2, DataClassification.CODE, "themes", privacyMode)),
    recommendedAction: msg.recommendedAction,
    recommendedActionEvidence: msg.recommendedActionEvidence !== void 0 ? createRedactedString(msg.recommendedActionEvidence, DataClassification.CODE, "recommended_action_evidence", privacyMode) : void 0,
    checkKeys: msg.checkKeys
  };
}
function fromRedactedRecordCiInvestigationOverall(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new RecordCiInvestigationOverall({
    summary: msg.summary.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    themes: msg.themes.map((v2) => v2.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })),
    recommendedAction: msg.recommendedAction,
    recommendedActionEvidence: msg.recommendedActionEvidence?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    checkKeys: msg.checkKeys
  });
}
function toRedactedRecordCiInvestigationFindingsArgs(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    findings: msg.findings.map((v2) => toRedactedRecordCiInvestigationFinding(v2, privacyMode)),
    overall: msg.overall !== void 0 ? toRedactedRecordCiInvestigationOverall(msg.overall, privacyMode) : void 0,
    toolCallId: msg.toolCallId
  };
}
function fromRedactedRecordCiInvestigationFindingsArgs(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new RecordCiInvestigationFindingsArgs({
    findings: msg.findings.map((v2) => fromRedactedRecordCiInvestigationFinding(v2, purpose, opts)),
    overall: msg.overall !== void 0 ? fromRedactedRecordCiInvestigationOverall(msg.overall, purpose, opts) : void 0,
    toolCallId: msg.toolCallId
  });
}
function toRedactedRecordCiInvestigationFindingsSuccess(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    message: createRedactedString(msg.message, DataClassification.CODE, "message", privacyMode)
  };
}
function fromRedactedRecordCiInvestigationFindingsSuccess(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new RecordCiInvestigationFindingsSuccess({
    message: msg.message.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedRecordCiInvestigationFindingsError(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    error: createRedactedString(msg.error, DataClassification.CODE, "error", privacyMode)
  };
}
function fromRedactedRecordCiInvestigationFindingsError(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new RecordCiInvestigationFindingsError({
    error: msg.error.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedRecordCiInvestigationFindingsResult(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    result: toRedactedRecordCiInvestigationFindingsResult_result(msg.result, privacyMode)
  };
}
function toRedactedRecordCiInvestigationFindingsResult_result(oneof, privacyMode) {
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "success":
      return { case: "success", value: toRedactedRecordCiInvestigationFindingsSuccess(oneof.value, privacyMode) };
    case "error":
      return { case: "error", value: toRedactedRecordCiInvestigationFindingsError(oneof.value, privacyMode) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function fromRedactedRecordCiInvestigationFindingsResult(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new RecordCiInvestigationFindingsResult({
    result: fromRedactedRecordCiInvestigationFindingsResult_result(msg.result, purpose, opts)
  });
}
function fromRedactedRecordCiInvestigationFindingsResult_result(oneof, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "success":
      return { case: "success", value: fromRedactedRecordCiInvestigationFindingsSuccess(oneof.value, purpose, opts) };
    case "error":
      return { case: "error", value: fromRedactedRecordCiInvestigationFindingsError(oneof.value, purpose, opts) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function toRedactedRecordCiInvestigationFindingsToolCall(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    args: msg.args !== void 0 ? toRedactedRecordCiInvestigationFindingsArgs(msg.args, privacyMode) : void 0,
    result: msg.result !== void 0 ? toRedactedRecordCiInvestigationFindingsResult(msg.result, privacyMode) : void 0
  };
}
function fromRedactedRecordCiInvestigationFindingsToolCall(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new RecordCiInvestigationFindingsToolCall({
    args: msg.args !== void 0 ? fromRedactedRecordCiInvestigationFindingsArgs(msg.args, purpose, opts) : void 0,
    result: msg.result !== void 0 ? fromRedactedRecordCiInvestigationFindingsResult(msg.result, purpose, opts) : void 0
  });
}

