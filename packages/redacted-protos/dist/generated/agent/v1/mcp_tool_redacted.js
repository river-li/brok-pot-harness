init_mcp_tool_pb();
function toRedactedMcpToolError(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    error: createRedactedString(msg.error, DataClassification.CODE, "error", privacyMode),
    readToolDefReminder: createRedactedString(msg.readToolDefReminder, DataClassification.CODE, "read_tool_def_reminder", privacyMode)
  };
}
function fromRedactedMcpToolError(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new McpToolError({
    error: msg.error.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    readToolDefReminder: msg.readToolDefReminder.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedMcpToolResult(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    result: toRedactedMcpToolResult_result(msg.result, privacyMode)
  };
}
function toRedactedMcpToolResult_result(oneof, privacyMode) {
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "success":
      return { case: "success", value: toRedactedMcpSuccess(oneof.value, privacyMode) };
    case "error":
      return { case: "error", value: toRedactedMcpToolError(oneof.value, privacyMode) };
    case "rejected":
      return { case: "rejected", value: toRedactedMcpRejected(oneof.value, privacyMode) };
    case "permissionDenied":
      return { case: "permissionDenied", value: toRedactedMcpPermissionDenied(oneof.value, privacyMode) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function fromRedactedMcpToolResult(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new McpToolResult({
    result: fromRedactedMcpToolResult_result(msg.result, purpose, opts)
  });
}
function fromRedactedMcpToolResult_result(oneof, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "success":
      return { case: "success", value: fromRedactedMcpSuccess(oneof.value, purpose, opts) };
    case "error":
      return { case: "error", value: fromRedactedMcpToolError(oneof.value, purpose, opts) };
    case "rejected":
      return { case: "rejected", value: fromRedactedMcpRejected(oneof.value, purpose, opts) };
    case "permissionDenied":
      return { case: "permissionDenied", value: fromRedactedMcpPermissionDenied(oneof.value, purpose, opts) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function toRedactedMcpToolCall(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    args: msg.args !== void 0 ? toRedactedMcpArgs(msg.args, privacyMode) : void 0,
    result: msg.result !== void 0 ? toRedactedMcpToolResult(msg.result, privacyMode) : void 0,
    description: msg.description
  };
}
function fromRedactedMcpToolCall(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new McpToolCall({
    args: msg.args !== void 0 ? fromRedactedMcpArgs(msg.args, purpose, opts) : void 0,
    result: msg.result !== void 0 ? fromRedactedMcpToolResult(msg.result, purpose, opts) : void 0,
    description: msg.description
  });
}
