/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/redacted-protos/dist/generated/agent/v1/report_bug_tool_redacted.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_report_bug_tool_pb();
function toRedactedReportBugArgs(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    title: createRedactedString(msg.title, DataClassification.CODE, "title", privacyMode),
    file: createRedactedString(msg.file, DataClassification.PATH, "file", privacyMode),
    startLine: msg.startLine,
    endLine: msg.endLine,
    description: createRedactedString(msg.description, DataClassification.CODE, "description", privacyMode),
    severity: msg.severity,
    category: msg.category,
    rationale: createRedactedString(msg.rationale, DataClassification.CODE, "rationale", privacyMode)
  };
}
function fromRedactedReportBugArgs(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ReportBugArgs({
    title: msg.title.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    file: msg.file.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    startLine: msg.startLine,
    endLine: msg.endLine,
    description: msg.description.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    severity: msg.severity,
    category: msg.category,
    rationale: msg.rationale.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedReportBugSuccess(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    output: createRedactedString(msg.output, DataClassification.CODE, "output", privacyMode)
  };
}
function fromRedactedReportBugSuccess(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ReportBugSuccess({
    output: msg.output.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedReportBugError(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    errorMessage: createRedactedString(msg.errorMessage, DataClassification.CODE, "error_message", privacyMode)
  };
}
function fromRedactedReportBugError(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ReportBugError({
    errorMessage: msg.errorMessage.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedReportBugResult(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    result: toRedactedReportBugResult_result(msg.result, privacyMode)
  };
}
function toRedactedReportBugResult_result(oneof, privacyMode) {
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "success":
      return { case: "success", value: toRedactedReportBugSuccess(oneof.value, privacyMode) };
    case "error":
      return { case: "error", value: toRedactedReportBugError(oneof.value, privacyMode) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function fromRedactedReportBugResult(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ReportBugResult({
    result: fromRedactedReportBugResult_result(msg.result, purpose, opts)
  });
}
function fromRedactedReportBugResult_result(oneof, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "success":
      return { case: "success", value: fromRedactedReportBugSuccess(oneof.value, purpose, opts) };
    case "error":
      return { case: "error", value: fromRedactedReportBugError(oneof.value, purpose, opts) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function toRedactedReportBugToolCall(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    args: msg.args !== void 0 ? toRedactedReportBugArgs(msg.args, privacyMode) : void 0,
    result: msg.result !== void 0 ? toRedactedReportBugResult(msg.result, privacyMode) : void 0
  };
}
function fromRedactedReportBugToolCall(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ReportBugToolCall({
    args: msg.args !== void 0 ? fromRedactedReportBugArgs(msg.args, purpose, opts) : void 0,
    result: msg.result !== void 0 ? fromRedactedReportBugResult(msg.result, purpose, opts) : void 0
  });
}

