init_ls_tool_pb();
function toRedactedLsToolCall(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    args: msg.args !== void 0 ? toRedactedLsArgs(msg.args, privacyMode) : void 0,
    result: msg.result !== void 0 ? toRedactedLsResult(msg.result, privacyMode) : void 0
  };
}
function fromRedactedLsToolCall(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new LsToolCall({
    args: msg.args !== void 0 ? fromRedactedLsArgs(msg.args, purpose, opts) : void 0,
    result: msg.result !== void 0 ? fromRedactedLsResult(msg.result, purpose, opts) : void 0
  });
}
