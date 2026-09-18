init_switch_mode_tool_pb();
function toRedactedSwitchModeArgs(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    targetModeId: msg.targetModeId,
    explanation: msg.explanation !== void 0 ? createRedactedString(msg.explanation, DataClassification.CODE, "explanation", privacyMode) : void 0,
    toolCallId: msg.toolCallId
  };
}
function fromRedactedSwitchModeArgs(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new SwitchModeArgs({
    targetModeId: msg.targetModeId,
    explanation: msg.explanation?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    toolCallId: msg.toolCallId
  });
}
function toRedactedSwitchModeResult(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    result: toRedactedSwitchModeResult_result(msg.result, privacyMode)
  };
}
function toRedactedSwitchModeResult_result(oneof, privacyMode) {
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "success":
      return { case: "success", value: toRedactedSwitchModeSuccess(oneof.value, privacyMode) };
    case "error":
      return { case: "error", value: toRedactedSwitchModeError(oneof.value, privacyMode) };
    case "rejected":
      return { case: "rejected", value: toRedactedSwitchModeRejected(oneof.value, privacyMode) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function fromRedactedSwitchModeResult(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new SwitchModeResult({
    result: fromRedactedSwitchModeResult_result(msg.result, purpose, opts)
  });
}
function fromRedactedSwitchModeResult_result(oneof, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "success":
      return { case: "success", value: fromRedactedSwitchModeSuccess(oneof.value, purpose, opts) };
    case "error":
      return { case: "error", value: fromRedactedSwitchModeError(oneof.value, purpose, opts) };
    case "rejected":
      return { case: "rejected", value: fromRedactedSwitchModeRejected(oneof.value, purpose, opts) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function toRedactedSwitchModeSuccess(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    fromModeId: msg.fromModeId,
    toModeId: msg.toModeId
  };
}
function fromRedactedSwitchModeSuccess(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new SwitchModeSuccess({
    fromModeId: msg.fromModeId,
    toModeId: msg.toModeId
  });
}
function toRedactedSwitchModeError(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    error: createRedactedString(msg.error, DataClassification.CODE, "error", privacyMode)
  };
}
function fromRedactedSwitchModeError(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new SwitchModeError({
    error: msg.error.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedSwitchModeRejected(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    reason: createRedactedString(msg.reason, DataClassification.CODE, "reason", privacyMode)
  };
}
function fromRedactedSwitchModeRejected(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new SwitchModeRejected({
    reason: msg.reason.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedSwitchModeToolCall(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    args: msg.args !== void 0 ? toRedactedSwitchModeArgs(msg.args, privacyMode) : void 0,
    result: msg.result !== void 0 ? toRedactedSwitchModeResult(msg.result, privacyMode) : void 0
  };
}
function fromRedactedSwitchModeToolCall(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new SwitchModeToolCall({
    args: msg.args !== void 0 ? fromRedactedSwitchModeArgs(msg.args, purpose, opts) : void 0,
    result: msg.result !== void 0 ? fromRedactedSwitchModeResult(msg.result, purpose, opts) : void 0
  });
}
function toRedactedSwitchModeRequestQuery(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    args: msg.args !== void 0 ? toRedactedSwitchModeArgs(msg.args, privacyMode) : void 0
  };
}
function fromRedactedSwitchModeRequestQuery(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new SwitchModeRequestQuery({
    args: msg.args !== void 0 ? fromRedactedSwitchModeArgs(msg.args, purpose, opts) : void 0
  });
}
function toRedactedSwitchModeRequestResponse(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    result: toRedactedSwitchModeRequestResponse_result(msg.result, privacyMode)
  };
}
function toRedactedSwitchModeRequestResponse_result(oneof, privacyMode) {
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "approved":
      return { case: "approved", value: toRedactedSwitchModeRequestResponse_Approved(oneof.value, privacyMode) };
    case "rejected":
      return { case: "rejected", value: toRedactedSwitchModeRequestResponse_Rejected(oneof.value, privacyMode) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function fromRedactedSwitchModeRequestResponse(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new SwitchModeRequestResponse({
    result: fromRedactedSwitchModeRequestResponse_result(msg.result, purpose, opts)
  });
}
function fromRedactedSwitchModeRequestResponse_result(oneof, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "approved":
      return { case: "approved", value: fromRedactedSwitchModeRequestResponse_Approved(oneof.value, purpose, opts) };
    case "rejected":
      return { case: "rejected", value: fromRedactedSwitchModeRequestResponse_Rejected(oneof.value, purpose, opts) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function toRedactedSwitchModeRequestResponse_Approved(msg, privacyMode) {
  return {
    _privacyMode: privacyMode
  };
}
function fromRedactedSwitchModeRequestResponse_Approved(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new SwitchModeRequestResponse_Approved({});
}
function toRedactedSwitchModeRequestResponse_Rejected(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    reason: createRedactedString(msg.reason, DataClassification.CODE, "reason", privacyMode)
  };
}
function fromRedactedSwitchModeRequestResponse_Rejected(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new SwitchModeRequestResponse_Rejected({
    reason: msg.reason.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
