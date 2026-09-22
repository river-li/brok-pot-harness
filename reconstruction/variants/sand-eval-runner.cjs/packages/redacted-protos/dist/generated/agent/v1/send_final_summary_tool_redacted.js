/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/redacted-protos/dist/generated/agent/v1/send_final_summary_tool_redacted.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function toRedactedSendFinalSummaryArgs(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    finalSummary: msg.finalSummary !== void 0 ? createRedactedString(msg.finalSummary, DataClassification.CODE, "final_summary", privacyMode) : void 0
  };
}
function fromRedactedSendFinalSummaryArgs(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new SendFinalSummaryArgs({
    finalSummary: msg.finalSummary?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedSendFinalSummarySuccess(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    finalSummary: createRedactedString(msg.finalSummary, DataClassification.CODE, "final_summary", privacyMode)
  };
}
function fromRedactedSendFinalSummarySuccess(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new SendFinalSummarySuccess({
    finalSummary: msg.finalSummary.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedSendFinalSummaryError(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    error: createRedactedString(msg.error, DataClassification.CODE, "error", privacyMode)
  };
}
function fromRedactedSendFinalSummaryError(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new SendFinalSummaryError({
    error: msg.error.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedSendFinalSummaryResult(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    result: toRedactedSendFinalSummaryResult_result(msg.result, privacyMode)
  };
}
function toRedactedSendFinalSummaryResult_result(oneof, privacyMode) {
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "success":
      return { case: "success", value: toRedactedSendFinalSummarySuccess(oneof.value, privacyMode) };
    case "error":
      return { case: "error", value: toRedactedSendFinalSummaryError(oneof.value, privacyMode) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function fromRedactedSendFinalSummaryResult(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new SendFinalSummaryResult({
    result: fromRedactedSendFinalSummaryResult_result(msg.result, purpose, opts)
  });
}
function fromRedactedSendFinalSummaryResult_result(oneof, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "success":
      return { case: "success", value: fromRedactedSendFinalSummarySuccess(oneof.value, purpose, opts) };
    case "error":
      return { case: "error", value: fromRedactedSendFinalSummaryError(oneof.value, purpose, opts) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function toRedactedSendFinalSummaryToolCall(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    args: msg.args !== void 0 ? toRedactedSendFinalSummaryArgs(msg.args, privacyMode) : void 0,
    result: msg.result !== void 0 ? toRedactedSendFinalSummaryResult(msg.result, privacyMode) : void 0
  };
}
function fromRedactedSendFinalSummaryToolCall(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new SendFinalSummaryToolCall({
    args: msg.args !== void 0 ? fromRedactedSendFinalSummaryArgs(msg.args, purpose, opts) : void 0,
    result: msg.result !== void 0 ? fromRedactedSendFinalSummaryResult(msg.result, purpose, opts) : void 0
  });
}

