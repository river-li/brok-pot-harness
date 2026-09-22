/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/redacted-protos/dist/generated/agent/v1/record_screen_exec_redacted.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_record_screen_exec_pb();
function toRedactedRecordScreenArgs(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    mode: msg.mode,
    toolCallId: msg.toolCallId,
    saveAsFilename: msg.saveAsFilename !== void 0 ? createRedactedString(msg.saveAsFilename, DataClassification.PATH, "save_as_filename", privacyMode) : void 0
  };
}
function fromRedactedRecordScreenArgs(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new RecordScreenArgs({
    mode: msg.mode,
    toolCallId: msg.toolCallId,
    saveAsFilename: msg.saveAsFilename?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedRecordScreenResult(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    result: toRedactedRecordScreenResult_result(msg.result, privacyMode)
  };
}
function toRedactedRecordScreenResult_result(oneof, privacyMode) {
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "startSuccess":
      return { case: "startSuccess", value: toRedactedRecordScreenStartSuccess(oneof.value, privacyMode) };
    case "saveSuccess":
      return { case: "saveSuccess", value: toRedactedRecordScreenSaveSuccess(oneof.value, privacyMode) };
    case "discardSuccess":
      return { case: "discardSuccess", value: toRedactedRecordScreenDiscardSuccess(oneof.value, privacyMode) };
    case "failure":
      return { case: "failure", value: toRedactedRecordScreenFailure(oneof.value, privacyMode) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function fromRedactedRecordScreenResult(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new RecordScreenResult({
    result: fromRedactedRecordScreenResult_result(msg.result, purpose, opts)
  });
}
function fromRedactedRecordScreenResult_result(oneof, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "startSuccess":
      return { case: "startSuccess", value: fromRedactedRecordScreenStartSuccess(oneof.value, purpose, opts) };
    case "saveSuccess":
      return { case: "saveSuccess", value: fromRedactedRecordScreenSaveSuccess(oneof.value, purpose, opts) };
    case "discardSuccess":
      return { case: "discardSuccess", value: fromRedactedRecordScreenDiscardSuccess(oneof.value, purpose, opts) };
    case "failure":
      return { case: "failure", value: fromRedactedRecordScreenFailure(oneof.value, purpose, opts) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function toRedactedRecordScreenStartSuccess(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    wasPriorRecordingCancelled: msg.wasPriorRecordingCancelled,
    wasSaveAsFilenameIgnored: msg.wasSaveAsFilenameIgnored
  };
}
function fromRedactedRecordScreenStartSuccess(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new RecordScreenStartSuccess({
    wasPriorRecordingCancelled: msg.wasPriorRecordingCancelled,
    wasSaveAsFilenameIgnored: msg.wasSaveAsFilenameIgnored
  });
}
function toRedactedRecordScreenSaveSuccess(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    path: createRedactedString(msg.path, DataClassification.PATH, "path", privacyMode),
    recordingDurationMs: msg.recordingDurationMs,
    requestedFilePathRejectedReason: msg.requestedFilePathRejectedReason
  };
}
function fromRedactedRecordScreenSaveSuccess(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new RecordScreenSaveSuccess({
    path: msg.path.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    recordingDurationMs: msg.recordingDurationMs,
    requestedFilePathRejectedReason: msg.requestedFilePathRejectedReason
  });
}
function toRedactedRecordScreenDiscardSuccess(msg, privacyMode) {
  return {
    _privacyMode: privacyMode
  };
}
function fromRedactedRecordScreenDiscardSuccess(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new RecordScreenDiscardSuccess({});
}
function toRedactedRecordScreenFailure(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    error: createRedactedString(msg.error, DataClassification.CODE, "error", privacyMode)
  };
}
function fromRedactedRecordScreenFailure(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new RecordScreenFailure({
    error: msg.error.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}

