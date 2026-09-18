init_get_pr_code_tour_tool_pb();
function toRedactedGetPrCodeTourArgs(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    toolCallId: msg.toolCallId,
    revisionId: msg.revisionId
  };
}
function fromRedactedGetPrCodeTourArgs(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new GetPrCodeTourArgs({
    toolCallId: msg.toolCallId,
    revisionId: msg.revisionId
  });
}
function toRedactedPrCodeTourRevisionSnapshot(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    revisionId: msg.revisionId,
    status: msg.status,
    headSha: msg.headSha,
    feedback: createRedactedString(msg.feedback, DataClassification.CODE, "feedback", privacyMode),
    updatedAtMs: msg.updatedAtMs,
    isCurrent: msg.isCurrent,
    markdown: createRedactedString(msg.markdown, DataClassification.CODE, "markdown", privacyMode)
  };
}
function fromRedactedPrCodeTourRevisionSnapshot(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new PrCodeTourRevisionSnapshot({
    revisionId: msg.revisionId,
    status: msg.status,
    headSha: msg.headSha,
    feedback: msg.feedback.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    updatedAtMs: msg.updatedAtMs,
    isCurrent: msg.isCurrent,
    markdown: msg.markdown.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedGetPrCodeTourSuccess(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    revisions: msg.revisions.map((v2) => toRedactedPrCodeTourRevisionSnapshot(v2, privacyMode))
  };
}
function fromRedactedGetPrCodeTourSuccess(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new GetPrCodeTourSuccess({
    revisions: msg.revisions.map((v2) => fromRedactedPrCodeTourRevisionSnapshot(v2, purpose, opts))
  });
}
function toRedactedGetPrCodeTourError(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    error: createRedactedString(msg.error, DataClassification.CODE, "error", privacyMode)
  };
}
function fromRedactedGetPrCodeTourError(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new GetPrCodeTourError({
    error: msg.error.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedGetPrCodeTourResult(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    result: toRedactedGetPrCodeTourResult_result(msg.result, privacyMode)
  };
}
function toRedactedGetPrCodeTourResult_result(oneof, privacyMode) {
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "success":
      return { case: "success", value: toRedactedGetPrCodeTourSuccess(oneof.value, privacyMode) };
    case "error":
      return { case: "error", value: toRedactedGetPrCodeTourError(oneof.value, privacyMode) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function fromRedactedGetPrCodeTourResult(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new GetPrCodeTourResult({
    result: fromRedactedGetPrCodeTourResult_result(msg.result, purpose, opts)
  });
}
function fromRedactedGetPrCodeTourResult_result(oneof, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "success":
      return { case: "success", value: fromRedactedGetPrCodeTourSuccess(oneof.value, purpose, opts) };
    case "error":
      return { case: "error", value: fromRedactedGetPrCodeTourError(oneof.value, purpose, opts) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function toRedactedGetPrCodeTourToolCall(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    args: msg.args !== void 0 ? toRedactedGetPrCodeTourArgs(msg.args, privacyMode) : void 0,
    result: msg.result !== void 0 ? toRedactedGetPrCodeTourResult(msg.result, privacyMode) : void 0
  };
}
function fromRedactedGetPrCodeTourToolCall(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new GetPrCodeTourToolCall({
    args: msg.args !== void 0 ? fromRedactedGetPrCodeTourArgs(msg.args, purpose, opts) : void 0,
    result: msg.result !== void 0 ? fromRedactedGetPrCodeTourResult(msg.result, purpose, opts) : void 0
  });
}
