/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/redacted-protos/dist/generated/agent/v1/goal_tool_redacted.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function toRedactedCreateGoalArgs(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    objective: createRedactedString(msg.objective, DataClassification.CODE, "objective", privacyMode)
  };
}
function fromRedactedCreateGoalArgs(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new CreateGoalArgs({
    objective: msg.objective.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedCreateGoalSuccess(msg, privacyMode) {
  return {
    _privacyMode: privacyMode
  };
}
function fromRedactedCreateGoalSuccess(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new CreateGoalSuccess({});
}
function toRedactedGoalError(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    error: createRedactedString(msg.error, DataClassification.CODE, "error", privacyMode)
  };
}
function fromRedactedGoalError(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new GoalError({
    error: msg.error.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedCreateGoalResult(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    result: toRedactedCreateGoalResult_result(msg.result, privacyMode)
  };
}
function toRedactedCreateGoalResult_result(oneof, privacyMode) {
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "success":
      return { case: "success", value: toRedactedCreateGoalSuccess(oneof.value, privacyMode) };
    case "error":
      return { case: "error", value: toRedactedGoalError(oneof.value, privacyMode) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function fromRedactedCreateGoalResult(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new CreateGoalResult({
    result: fromRedactedCreateGoalResult_result(msg.result, purpose, opts)
  });
}
function fromRedactedCreateGoalResult_result(oneof, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "success":
      return { case: "success", value: fromRedactedCreateGoalSuccess(oneof.value, purpose, opts) };
    case "error":
      return { case: "error", value: fromRedactedGoalError(oneof.value, purpose, opts) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function toRedactedCreateGoalToolCall(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    args: msg.args !== void 0 ? toRedactedCreateGoalArgs(msg.args, privacyMode) : void 0,
    result: msg.result !== void 0 ? toRedactedCreateGoalResult(msg.result, privacyMode) : void 0
  };
}
function fromRedactedCreateGoalToolCall(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new CreateGoalToolCall({
    args: msg.args !== void 0 ? fromRedactedCreateGoalArgs(msg.args, purpose, opts) : void 0,
    result: msg.result !== void 0 ? fromRedactedCreateGoalResult(msg.result, purpose, opts) : void 0
  });
}
function toRedactedUpdateGoalArgs(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    status: msg.status
  };
}
function fromRedactedUpdateGoalArgs(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new UpdateGoalArgs({
    status: msg.status
  });
}
function toRedactedUpdateGoalSuccess(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    status: msg.status
  };
}
function fromRedactedUpdateGoalSuccess(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new UpdateGoalSuccess({
    status: msg.status
  });
}
function toRedactedUpdateGoalResult(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    result: toRedactedUpdateGoalResult_result(msg.result, privacyMode)
  };
}
function toRedactedUpdateGoalResult_result(oneof, privacyMode) {
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "success":
      return { case: "success", value: toRedactedUpdateGoalSuccess(oneof.value, privacyMode) };
    case "error":
      return { case: "error", value: toRedactedGoalError(oneof.value, privacyMode) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function fromRedactedUpdateGoalResult(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new UpdateGoalResult({
    result: fromRedactedUpdateGoalResult_result(msg.result, purpose, opts)
  });
}
function fromRedactedUpdateGoalResult_result(oneof, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "success":
      return { case: "success", value: fromRedactedUpdateGoalSuccess(oneof.value, purpose, opts) };
    case "error":
      return { case: "error", value: fromRedactedGoalError(oneof.value, purpose, opts) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function toRedactedUpdateGoalToolCall(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    args: msg.args !== void 0 ? toRedactedUpdateGoalArgs(msg.args, privacyMode) : void 0,
    result: msg.result !== void 0 ? toRedactedUpdateGoalResult(msg.result, privacyMode) : void 0
  };
}
function fromRedactedUpdateGoalToolCall(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new UpdateGoalToolCall({
    args: msg.args !== void 0 ? fromRedactedUpdateGoalArgs(msg.args, purpose, opts) : void 0,
    result: msg.result !== void 0 ? fromRedactedUpdateGoalResult(msg.result, purpose, opts) : void 0
  });
}

