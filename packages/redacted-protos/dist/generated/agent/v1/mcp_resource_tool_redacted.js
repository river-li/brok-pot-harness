init_mcp_resource_tool_pb();
function toRedactedListMcpResourcesToolCall(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    args: msg.args !== void 0 ? toRedactedListMcpResourcesExecArgs(msg.args, privacyMode) : void 0,
    result: msg.result !== void 0 ? toRedactedListMcpResourcesExecResult(msg.result, privacyMode) : void 0
  };
}
function fromRedactedListMcpResourcesToolCall(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ListMcpResourcesToolCall({
    args: msg.args !== void 0 ? fromRedactedListMcpResourcesExecArgs(msg.args, purpose, opts) : void 0,
    result: msg.result !== void 0 ? fromRedactedListMcpResourcesExecResult(msg.result, purpose, opts) : void 0
  });
}
function toRedactedReadMcpResourceToolCall(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    args: msg.args !== void 0 ? toRedactedReadMcpResourceExecArgs(msg.args, privacyMode) : void 0,
    result: msg.result !== void 0 ? toRedactedReadMcpResourceExecResult(msg.result, privacyMode) : void 0
  };
}
function fromRedactedReadMcpResourceToolCall(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ReadMcpResourceToolCall({
    args: msg.args !== void 0 ? fromRedactedReadMcpResourceExecArgs(msg.args, purpose, opts) : void 0,
    result: msg.result !== void 0 ? fromRedactedReadMcpResourceExecResult(msg.result, purpose, opts) : void 0
  });
}
