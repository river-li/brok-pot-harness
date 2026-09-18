init_await_tool_pb();
function toRedactedAwaitArgs(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    taskId: msg.taskId,
    blockUntilMs: msg.blockUntilMs,
    regex: msg.regex !== void 0 ? createRedactedString(msg.regex, DataClassification.CODE, "regex", privacyMode) : void 0
  };
}
function fromRedactedAwaitArgs(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new AwaitArgs({
    taskId: msg.taskId,
    blockUntilMs: msg.blockUntilMs,
    regex: msg.regex?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedAwaitTaskComplete(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    taskId: msg.taskId,
    runtimeMs: msg.runtimeMs,
    outputFilePath: createRedactedString(msg.outputFilePath, DataClassification.PATH, "output_file_path", privacyMode),
    outputLength: msg.outputLength,
    regexRequested: msg.regexRequested,
    regexMatch: msg.regexMatch !== void 0 ? createRedactedString(msg.regexMatch, DataClassification.CODE, "regex_match", privacyMode) : void 0,
    exitCode: msg.exitCode,
    wakeReason: msg.wakeReason
  };
}
function fromRedactedAwaitTaskComplete(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new AwaitTaskComplete({
    taskId: msg.taskId,
    runtimeMs: msg.runtimeMs,
    outputFilePath: msg.outputFilePath.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    outputLength: msg.outputLength,
    regexRequested: msg.regexRequested,
    regexMatch: msg.regexMatch?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    exitCode: msg.exitCode,
    wakeReason: msg.wakeReason
  });
}
function toRedactedAwaitTaskStillRunning(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    taskId: msg.taskId,
    runtimeMs: msg.runtimeMs,
    outputFilePath: createRedactedString(msg.outputFilePath, DataClassification.PATH, "output_file_path", privacyMode),
    outputLength: msg.outputLength,
    regexRequested: msg.regexRequested,
    regexMatch: msg.regexMatch !== void 0 ? createRedactedString(msg.regexMatch, DataClassification.CODE, "regex_match", privacyMode) : void 0,
    wakeReason: msg.wakeReason
  };
}
function fromRedactedAwaitTaskStillRunning(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new AwaitTaskStillRunning({
    taskId: msg.taskId,
    runtimeMs: msg.runtimeMs,
    outputFilePath: msg.outputFilePath.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    outputLength: msg.outputLength,
    regexRequested: msg.regexRequested,
    regexMatch: msg.regexMatch?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    wakeReason: msg.wakeReason
  });
}
function toRedactedAwaitError(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    error: createRedactedString(msg.error, DataClassification.CODE, "error", privacyMode)
  };
}
function fromRedactedAwaitError(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new AwaitError({
    error: msg.error.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedAwaitSuccess(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    awaitResult: toRedactedAwaitSuccess_await_result(msg.awaitResult, privacyMode)
  };
}
function toRedactedAwaitSuccess_await_result(oneof, privacyMode) {
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "complete":
      return { case: "complete", value: toRedactedAwaitTaskComplete(oneof.value, privacyMode) };
    case "stillRunning":
      return { case: "stillRunning", value: toRedactedAwaitTaskStillRunning(oneof.value, privacyMode) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function fromRedactedAwaitSuccess(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new AwaitSuccess({
    awaitResult: fromRedactedAwaitSuccess_await_result(msg.awaitResult, purpose, opts)
  });
}
function fromRedactedAwaitSuccess_await_result(oneof, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "complete":
      return { case: "complete", value: fromRedactedAwaitTaskComplete(oneof.value, purpose, opts) };
    case "stillRunning":
      return { case: "stillRunning", value: fromRedactedAwaitTaskStillRunning(oneof.value, purpose, opts) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function toRedactedAwaitResult(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    result: toRedactedAwaitResult_result(msg.result, privacyMode)
  };
}
function toRedactedAwaitResult_result(oneof, privacyMode) {
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "complete":
      return { case: "complete", value: toRedactedAwaitTaskComplete(oneof.value, privacyMode) };
    case "stillRunning":
      return { case: "stillRunning", value: toRedactedAwaitTaskStillRunning(oneof.value, privacyMode) };
    case "error":
      return { case: "error", value: toRedactedAwaitError(oneof.value, privacyMode) };
    case "success":
      return { case: "success", value: toRedactedAwaitSuccess(oneof.value, privacyMode) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function fromRedactedAwaitResult(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new AwaitResult({
    result: fromRedactedAwaitResult_result(msg.result, purpose, opts)
  });
}
function fromRedactedAwaitResult_result(oneof, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "complete":
      return { case: "complete", value: fromRedactedAwaitTaskComplete(oneof.value, purpose, opts) };
    case "stillRunning":
      return { case: "stillRunning", value: fromRedactedAwaitTaskStillRunning(oneof.value, purpose, opts) };
    case "error":
      return { case: "error", value: fromRedactedAwaitError(oneof.value, purpose, opts) };
    case "success":
      return { case: "success", value: fromRedactedAwaitSuccess(oneof.value, purpose, opts) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function toRedactedAwaitToolCall(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    args: msg.args !== void 0 ? toRedactedAwaitArgs(msg.args, privacyMode) : void 0,
    result: msg.result !== void 0 ? toRedactedAwaitResult(msg.result, privacyMode) : void 0
  };
}
function fromRedactedAwaitToolCall(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new AwaitToolCall({
    args: msg.args !== void 0 ? fromRedactedAwaitArgs(msg.args, purpose, opts) : void 0,
    result: msg.result !== void 0 ? fromRedactedAwaitResult(msg.result, purpose, opts) : void 0
  });
}
