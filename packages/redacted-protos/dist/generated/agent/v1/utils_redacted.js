/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/redacted-protos/dist/generated/agent/v1/utils_redacted.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_utils_pb2();
function toRedactedRange(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    start: msg.start !== void 0 ? toRedactedPosition(msg.start, privacyMode) : void 0,
    end: msg.end !== void 0 ? toRedactedPosition(msg.end, privacyMode) : void 0
  };
}
function fromRedactedRange(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new Range2({
    start: msg.start !== void 0 ? fromRedactedPosition(msg.start, purpose, opts) : void 0,
    end: msg.end !== void 0 ? fromRedactedPosition(msg.end, purpose, opts) : void 0
  });
}
function toRedactedPosition(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    line: msg.line,
    column: msg.column
  };
}
function fromRedactedPosition(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new Position({
    line: msg.line,
    column: msg.column
  });
}
function toRedactedOutputLocation(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    filePath: createRedactedString(msg.filePath, DataClassification.PATH, "file_path", privacyMode),
    sizeBytes: msg.sizeBytes,
    lineCount: msg.lineCount
  };
}
function fromRedactedOutputLocation(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new OutputLocation({
    filePath: msg.filePath.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    sizeBytes: msg.sizeBytes,
    lineCount: msg.lineCount
  });
}
function toRedactedSmartModeApproval(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    requestId: msg.requestId,
    reason: createRedactedString(msg.reason, DataClassification.CODE, "reason", privacyMode)
  };
}
function fromRedactedSmartModeApproval(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new SmartModeApproval({
    requestId: msg.requestId,
    reason: msg.reason.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}

