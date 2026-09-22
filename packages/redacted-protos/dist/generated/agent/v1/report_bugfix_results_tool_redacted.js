/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/redacted-protos/dist/generated/agent/v1/report_bugfix_results_tool_redacted.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_report_bugfix_results_tool_pb();
function toRedactedBugfixResultItem(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    bugId: msg.bugId,
    bugTitle: createRedactedString(msg.bugTitle, DataClassification.CODE, "bug_title", privacyMode),
    verdict: msg.verdict,
    explanation: createRedactedString(msg.explanation, DataClassification.CODE, "explanation", privacyMode),
    severity: msg.severity
  };
}
function fromRedactedBugfixResultItem(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new BugfixResultItem({
    bugId: msg.bugId,
    bugTitle: msg.bugTitle.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    verdict: msg.verdict,
    explanation: msg.explanation.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    severity: msg.severity
  });
}
function toRedactedReportBugfixResultsArgs(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    summary: createRedactedString(msg.summary, DataClassification.CODE, "summary", privacyMode),
    results: msg.results.map((v2) => toRedactedBugfixResultItem(v2, privacyMode))
  };
}
function fromRedactedReportBugfixResultsArgs(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ReportBugfixResultsArgs({
    summary: msg.summary.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    results: msg.results.map((v2) => fromRedactedBugfixResultItem(v2, purpose, opts))
  });
}
function toRedactedReportBugfixResultsSuccess(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    results: msg.results.map((v2) => toRedactedBugfixResultItem(v2, privacyMode))
  };
}
function fromRedactedReportBugfixResultsSuccess(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ReportBugfixResultsSuccess({
    results: msg.results.map((v2) => fromRedactedBugfixResultItem(v2, purpose, opts))
  });
}
function toRedactedReportBugfixResultsError(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    error: createRedactedString(msg.error, DataClassification.CODE, "error", privacyMode)
  };
}
function fromRedactedReportBugfixResultsError(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ReportBugfixResultsError({
    error: msg.error.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedReportBugfixResultsResult(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    result: toRedactedReportBugfixResultsResult_result(msg.result, privacyMode)
  };
}
function toRedactedReportBugfixResultsResult_result(oneof, privacyMode) {
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "success":
      return { case: "success", value: toRedactedReportBugfixResultsSuccess(oneof.value, privacyMode) };
    case "error":
      return { case: "error", value: toRedactedReportBugfixResultsError(oneof.value, privacyMode) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function fromRedactedReportBugfixResultsResult(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ReportBugfixResultsResult({
    result: fromRedactedReportBugfixResultsResult_result(msg.result, purpose, opts)
  });
}
function fromRedactedReportBugfixResultsResult_result(oneof, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "success":
      return { case: "success", value: fromRedactedReportBugfixResultsSuccess(oneof.value, purpose, opts) };
    case "error":
      return { case: "error", value: fromRedactedReportBugfixResultsError(oneof.value, purpose, opts) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function toRedactedReportBugfixResultsToolCall(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    args: msg.args !== void 0 ? toRedactedReportBugfixResultsArgs(msg.args, privacyMode) : void 0,
    result: msg.result !== void 0 ? toRedactedReportBugfixResultsResult(msg.result, privacyMode) : void 0
  };
}
function fromRedactedReportBugfixResultsToolCall(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ReportBugfixResultsToolCall({
    args: msg.args !== void 0 ? fromRedactedReportBugfixResultsArgs(msg.args, purpose, opts) : void 0,
    result: msg.result !== void 0 ? fromRedactedReportBugfixResultsResult(msg.result, purpose, opts) : void 0
  });
}

