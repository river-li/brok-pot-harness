init_read_tool_pb();
function toRedactedReadToolCall(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    args: msg.args !== void 0 ? toRedactedReadToolArgs(msg.args, privacyMode) : void 0,
    result: msg.result !== void 0 ? toRedactedReadToolResult(msg.result, privacyMode) : void 0
  };
}
function fromRedactedReadToolCall(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ReadToolCall({
    args: msg.args !== void 0 ? fromRedactedReadToolArgs(msg.args, purpose, opts) : void 0,
    result: msg.result !== void 0 ? fromRedactedReadToolResult(msg.result, purpose, opts) : void 0
  });
}
function toRedactedReadToolArgs(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    path: createRedactedString(msg.path, DataClassification.PATH, "path", privacyMode),
    offset: msg.offset,
    limit: msg.limit,
    includeLineNumbers: msg.includeLineNumbers
  };
}
function fromRedactedReadToolArgs(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ReadToolArgs({
    path: msg.path.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    offset: msg.offset,
    limit: msg.limit,
    includeLineNumbers: msg.includeLineNumbers
  });
}
function toRedactedReadToolResult(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    result: toRedactedReadToolResult_result(msg.result, privacyMode)
  };
}
function toRedactedReadToolResult_result(oneof, privacyMode) {
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "success":
      return { case: "success", value: toRedactedReadToolSuccess(oneof.value, privacyMode) };
    case "error":
      return { case: "error", value: toRedactedReadToolError(oneof.value, privacyMode) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function fromRedactedReadToolResult(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ReadToolResult({
    result: fromRedactedReadToolResult_result(msg.result, purpose, opts)
  });
}
function fromRedactedReadToolResult_result(oneof, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "success":
      return { case: "success", value: fromRedactedReadToolSuccess(oneof.value, purpose, opts) };
    case "error":
      return { case: "error", value: fromRedactedReadToolError(oneof.value, purpose, opts) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function toRedactedReadRange(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    startLine: msg.startLine,
    endLine: msg.endLine
  };
}
function fromRedactedReadRange(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ReadRange({
    startLine: msg.startLine,
    endLine: msg.endLine
  });
}
function toRedactedReadToolSuccess(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    isEmpty: msg.isEmpty,
    exceededLimit: msg.exceededLimit,
    totalLines: msg.totalLines,
    fileSize: msg.fileSize,
    path: createRedactedString(msg.path, DataClassification.PATH, "path", privacyMode),
    readRange: msg.readRange !== void 0 ? toRedactedReadRange(msg.readRange, privacyMode) : void 0,
    includeLineNumbers: msg.includeLineNumbers,
    relatedCursorRulePaths: msg.relatedCursorRulePaths.map((v2) => createRedactedString(v2, DataClassification.PATH, "related_cursor_rule_paths", privacyMode)),
    relatedCursorRules: msg.relatedCursorRules.map((v2) => toRedactedCursorRule(v2, privacyMode)),
    output: toRedactedReadToolSuccess_output(msg.output, privacyMode)
  };
}
function toRedactedReadToolSuccess_output(oneof, privacyMode) {
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "content":
      return { case: "content", value: createRedactedString(oneof.value, DataClassification.CODE, "content", privacyMode) };
    case "data":
      return { case: "data", value: createRedactedBytes(oneof.value, DataClassification.CODE, "data", privacyMode) };
    case "dataBlobId":
      return { case: "dataBlobId", value: oneof.value };
    case "contentBlobId":
      return { case: "contentBlobId", value: oneof.value };
    default:
      return { case: void 0, value: void 0 };
  }
}
function fromRedactedReadToolSuccess(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ReadToolSuccess({
    isEmpty: msg.isEmpty,
    exceededLimit: msg.exceededLimit,
    totalLines: msg.totalLines,
    fileSize: msg.fileSize,
    path: msg.path.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    readRange: msg.readRange !== void 0 ? fromRedactedReadRange(msg.readRange, purpose, opts) : void 0,
    includeLineNumbers: msg.includeLineNumbers,
    relatedCursorRulePaths: msg.relatedCursorRulePaths.map((v2) => v2.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })),
    relatedCursorRules: msg.relatedCursorRules.map((v2) => fromRedactedCursorRule(v2, purpose, opts)),
    output: fromRedactedReadToolSuccess_output(msg.output, purpose, opts)
  });
}
function fromRedactedReadToolSuccess_output(oneof, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "content":
      return { case: "content", value: oneof.value.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }) };
    case "data":
      return { case: "data", value: oneof.value.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }) };
    case "dataBlobId":
      return { case: "dataBlobId", value: oneof.value };
    case "contentBlobId":
      return { case: "contentBlobId", value: oneof.value };
    default:
      return { case: void 0, value: void 0 };
  }
}
function toRedactedReadToolError(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    errorMessage: createRedactedString(msg.errorMessage, DataClassification.CODE, "error_message", privacyMode)
  };
}
function fromRedactedReadToolError(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ReadToolError({
    errorMessage: msg.errorMessage.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
