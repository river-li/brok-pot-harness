init_record_screen_tool_pb();
function toRedactedRecordScreenToolCall(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    args: msg.args !== void 0 ? toRedactedRecordScreenArgs(msg.args, privacyMode) : void 0,
    result: msg.result !== void 0 ? toRedactedRecordScreenResult(msg.result, privacyMode) : void 0
  };
}
function fromRedactedRecordScreenToolCall(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new RecordScreenToolCall({
    args: msg.args !== void 0 ? fromRedactedRecordScreenArgs(msg.args, purpose, opts) : void 0,
    result: msg.result !== void 0 ? fromRedactedRecordScreenResult(msg.result, purpose, opts) : void 0
  });
}
