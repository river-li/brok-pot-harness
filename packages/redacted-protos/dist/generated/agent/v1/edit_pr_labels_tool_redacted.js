init_edit_pr_labels_tool_pb();
function toRedactedEditPrLabelsArgs(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    toolCallId: msg.toolCallId,
    prUrl: msg.prUrl,
    addLabels: msg.addLabels.map((v2) => createRedactedString(v2, DataClassification.PATH, "add_labels", privacyMode)),
    removeLabels: msg.removeLabels.map((v2) => createRedactedString(v2, DataClassification.PATH, "remove_labels", privacyMode))
  };
}
function fromRedactedEditPrLabelsArgs(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new EditPrLabelsArgs({
    toolCallId: msg.toolCallId,
    prUrl: msg.prUrl,
    addLabels: msg.addLabels.map((v2) => v2.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })),
    removeLabels: msg.removeLabels.map((v2) => v2.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }))
  });
}
function toRedactedEditPrLabelsResult(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    result: toRedactedEditPrLabelsResult_result(msg.result, privacyMode)
  };
}
function toRedactedEditPrLabelsResult_result(oneof, privacyMode) {
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "success":
      return { case: "success", value: toRedactedEditPrLabelsSuccess(oneof.value, privacyMode) };
    case "error":
      return { case: "error", value: toRedactedEditPrLabelsError(oneof.value, privacyMode) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function fromRedactedEditPrLabelsResult(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new EditPrLabelsResult({
    result: fromRedactedEditPrLabelsResult_result(msg.result, purpose, opts)
  });
}
function fromRedactedEditPrLabelsResult_result(oneof, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "success":
      return { case: "success", value: fromRedactedEditPrLabelsSuccess(oneof.value, purpose, opts) };
    case "error":
      return { case: "error", value: fromRedactedEditPrLabelsError(oneof.value, purpose, opts) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function toRedactedEditPrLabelsSuccess(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    prUrl: msg.prUrl,
    prNumber: msg.prNumber,
    message: createRedactedString(msg.message, DataClassification.CODE, "message", privacyMode)
  };
}
function fromRedactedEditPrLabelsSuccess(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new EditPrLabelsSuccess({
    prUrl: msg.prUrl,
    prNumber: msg.prNumber,
    message: msg.message.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedEditPrLabelsError(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    error: createRedactedString(msg.error, DataClassification.CODE, "error", privacyMode)
  };
}
function fromRedactedEditPrLabelsError(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new EditPrLabelsError({
    error: msg.error.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedEditPrLabelsToolCall(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    args: msg.args !== void 0 ? toRedactedEditPrLabelsArgs(msg.args, privacyMode) : void 0,
    result: msg.result !== void 0 ? toRedactedEditPrLabelsResult(msg.result, privacyMode) : void 0
  };
}
function fromRedactedEditPrLabelsToolCall(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new EditPrLabelsToolCall({
    args: msg.args !== void 0 ? fromRedactedEditPrLabelsArgs(msg.args, purpose, opts) : void 0,
    result: msg.result !== void 0 ? fromRedactedEditPrLabelsResult(msg.result, purpose, opts) : void 0
  });
}
