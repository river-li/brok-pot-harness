init_adopt_tool_pb();
function toRedactedAdoptArgs(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    sourceAgentId: msg.sourceAgentId
  };
}
function fromRedactedAdoptArgs(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new AdoptArgs({
    sourceAgentId: msg.sourceAgentId
  });
}
function toRedactedAdoptResult(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    sourceAgentId: msg.sourceAgentId,
    targetAgentId: msg.targetAgentId,
    projectRootId: msg.projectRootId,
    result: toRedactedAdoptResult_result(msg.result, privacyMode)
  };
}
function toRedactedAdoptResult_result(oneof, privacyMode) {
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "success":
      return { case: "success", value: oneof.value };
    case "error":
      return { case: "error", value: createRedactedString(oneof.value, DataClassification.CODE, "error", privacyMode) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function fromRedactedAdoptResult(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new AdoptResult({
    sourceAgentId: msg.sourceAgentId,
    targetAgentId: msg.targetAgentId,
    projectRootId: msg.projectRootId,
    result: fromRedactedAdoptResult_result(msg.result, purpose, opts)
  });
}
function fromRedactedAdoptResult_result(oneof, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "success":
      return { case: "success", value: oneof.value };
    case "error":
      return { case: "error", value: oneof.value.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function toRedactedAdoptToolCall(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    args: msg.args !== void 0 ? toRedactedAdoptArgs(msg.args, privacyMode) : void 0,
    result: msg.result !== void 0 ? toRedactedAdoptResult(msg.result, privacyMode) : void 0
  };
}
function fromRedactedAdoptToolCall(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new AdoptToolCall({
    args: msg.args !== void 0 ? fromRedactedAdoptArgs(msg.args, purpose, opts) : void 0,
    result: msg.result !== void 0 ? fromRedactedAdoptResult(msg.result, purpose, opts) : void 0
  });
}
