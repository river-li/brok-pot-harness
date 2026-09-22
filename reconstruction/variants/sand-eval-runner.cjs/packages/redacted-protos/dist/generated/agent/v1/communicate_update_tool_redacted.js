/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/redacted-protos/dist/generated/agent/v1/communicate_update_tool_redacted.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function toRedactedCommunicateUpdateArgs(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    currentStep: msg.currentStep !== void 0 ? createRedactedString(msg.currentStep, DataClassification.CODE, "current_step", privacyMode) : void 0,
    finalSummary: msg.finalSummary !== void 0 ? createRedactedString(msg.finalSummary, DataClassification.CODE, "final_summary", privacyMode) : void 0,
    completedSubtitle: msg.completedSubtitle !== void 0 ? createRedactedString(msg.completedSubtitle, DataClassification.CODE, "completed_subtitle", privacyMode) : void 0
  };
}
function fromRedactedCommunicateUpdateArgs(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new CommunicateUpdateArgs({
    currentStep: msg.currentStep?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    finalSummary: msg.finalSummary?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    completedSubtitle: msg.completedSubtitle?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedCommunicateUpdateSuccess(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    currentStep: createRedactedString(msg.currentStep, DataClassification.CODE, "current_step", privacyMode),
    messageIndex: msg.messageIndex
  };
}
function fromRedactedCommunicateUpdateSuccess(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new CommunicateUpdateSuccess({
    currentStep: msg.currentStep.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    messageIndex: msg.messageIndex
  });
}
function toRedactedCommunicateUpdateError(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    error: createRedactedString(msg.error, DataClassification.CODE, "error", privacyMode)
  };
}
function fromRedactedCommunicateUpdateError(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new CommunicateUpdateError({
    error: msg.error.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedCommunicateUpdateResult(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    result: toRedactedCommunicateUpdateResult_result(msg.result, privacyMode)
  };
}
function toRedactedCommunicateUpdateResult_result(oneof, privacyMode) {
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "success":
      return { case: "success", value: toRedactedCommunicateUpdateSuccess(oneof.value, privacyMode) };
    case "error":
      return { case: "error", value: toRedactedCommunicateUpdateError(oneof.value, privacyMode) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function fromRedactedCommunicateUpdateResult(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new CommunicateUpdateResult({
    result: fromRedactedCommunicateUpdateResult_result(msg.result, purpose, opts)
  });
}
function fromRedactedCommunicateUpdateResult_result(oneof, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "success":
      return { case: "success", value: fromRedactedCommunicateUpdateSuccess(oneof.value, purpose, opts) };
    case "error":
      return { case: "error", value: fromRedactedCommunicateUpdateError(oneof.value, purpose, opts) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function toRedactedCommunicateUpdateToolCall(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    args: msg.args !== void 0 ? toRedactedCommunicateUpdateArgs(msg.args, privacyMode) : void 0,
    result: msg.result !== void 0 ? toRedactedCommunicateUpdateResult(msg.result, privacyMode) : void 0
  };
}
function fromRedactedCommunicateUpdateToolCall(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new CommunicateUpdateToolCall({
    args: msg.args !== void 0 ? fromRedactedCommunicateUpdateArgs(msg.args, purpose, opts) : void 0,
    result: msg.result !== void 0 ? fromRedactedCommunicateUpdateResult(msg.result, purpose, opts) : void 0
  });
}

