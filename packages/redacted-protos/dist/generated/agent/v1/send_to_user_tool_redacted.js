/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/redacted-protos/dist/generated/agent/v1/send_to_user_tool_redacted.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_send_to_user_tool_pb();
function toRedactedSendToUserArgs(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    message: createRedactedString(msg.message, DataClassification.CODE, "message", privacyMode)
  };
}
function fromRedactedSendToUserArgs(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new SendToUserArgs({
    message: msg.message.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedSendToUserSuccess(msg, privacyMode) {
  return {
    _privacyMode: privacyMode
  };
}
function fromRedactedSendToUserSuccess(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new SendToUserSuccess({});
}
function toRedactedSendToUserError(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    error: createRedactedString(msg.error, DataClassification.CODE, "error", privacyMode)
  };
}
function fromRedactedSendToUserError(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new SendToUserError({
    error: msg.error.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedSendToUserResult(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    result: toRedactedSendToUserResult_result(msg.result, privacyMode)
  };
}
function toRedactedSendToUserResult_result(oneof, privacyMode) {
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "success":
      return { case: "success", value: toRedactedSendToUserSuccess(oneof.value, privacyMode) };
    case "error":
      return { case: "error", value: toRedactedSendToUserError(oneof.value, privacyMode) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function fromRedactedSendToUserResult(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new SendToUserResult({
    result: fromRedactedSendToUserResult_result(msg.result, purpose, opts)
  });
}
function fromRedactedSendToUserResult_result(oneof, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "success":
      return { case: "success", value: fromRedactedSendToUserSuccess(oneof.value, purpose, opts) };
    case "error":
      return { case: "error", value: fromRedactedSendToUserError(oneof.value, purpose, opts) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function toRedactedSendToUserToolCall(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    args: msg.args !== void 0 ? toRedactedSendToUserArgs(msg.args, privacyMode) : void 0,
    result: msg.result !== void 0 ? toRedactedSendToUserResult(msg.result, privacyMode) : void 0
  };
}
function fromRedactedSendToUserToolCall(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new SendToUserToolCall({
    args: msg.args !== void 0 ? fromRedactedSendToUserArgs(msg.args, purpose, opts) : void 0,
    result: msg.result !== void 0 ? fromRedactedSendToUserResult(msg.result, purpose, opts) : void 0
  });
}

