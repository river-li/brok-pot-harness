/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/redacted-protos/dist/generated/agent/v1/edit_tool_redacted.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_edit_tool_pb();
function toRedactedEditArgs(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    path: createRedactedString(msg.path, DataClassification.PATH, "path", privacyMode),
    streamContent: msg.streamContent !== void 0 ? createRedactedString(msg.streamContent, DataClassification.CODE, "stream_content", privacyMode) : void 0
  };
}
function fromRedactedEditArgs(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new EditArgs({
    path: msg.path.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    streamContent: msg.streamContent?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedEditResult(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    result: toRedactedEditResult_result(msg.result, privacyMode)
  };
}
function toRedactedEditResult_result(oneof, privacyMode) {
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "success":
      return { case: "success", value: toRedactedEditSuccess(oneof.value, privacyMode) };
    case "fileNotFound":
      return { case: "fileNotFound", value: toRedactedEditFileNotFound(oneof.value, privacyMode) };
    case "readPermissionDenied":
      return { case: "readPermissionDenied", value: toRedactedEditReadPermissionDenied(oneof.value, privacyMode) };
    case "writePermissionDenied":
      return { case: "writePermissionDenied", value: toRedactedEditWritePermissionDenied(oneof.value, privacyMode) };
    case "rejected":
      return { case: "rejected", value: toRedactedEditRejected(oneof.value, privacyMode) };
    case "error":
      return { case: "error", value: toRedactedEditError(oneof.value, privacyMode) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function fromRedactedEditResult(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new EditResult({
    result: fromRedactedEditResult_result(msg.result, purpose, opts)
  });
}
function fromRedactedEditResult_result(oneof, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "success":
      return { case: "success", value: fromRedactedEditSuccess(oneof.value, purpose, opts) };
    case "fileNotFound":
      return { case: "fileNotFound", value: fromRedactedEditFileNotFound(oneof.value, purpose, opts) };
    case "readPermissionDenied":
      return { case: "readPermissionDenied", value: fromRedactedEditReadPermissionDenied(oneof.value, purpose, opts) };
    case "writePermissionDenied":
      return { case: "writePermissionDenied", value: fromRedactedEditWritePermissionDenied(oneof.value, purpose, opts) };
    case "rejected":
      return { case: "rejected", value: fromRedactedEditRejected(oneof.value, purpose, opts) };
    case "error":
      return { case: "error", value: fromRedactedEditError(oneof.value, purpose, opts) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function toRedactedEditSuccess(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    path: createRedactedString(msg.path, DataClassification.PATH, "path", privacyMode),
    linesAdded: msg.linesAdded,
    linesRemoved: msg.linesRemoved,
    diffString: msg.diffString !== void 0 ? createRedactedString(msg.diffString, DataClassification.CODE, "diff_string", privacyMode) : void 0,
    beforeFullFileContent: msg.beforeFullFileContent !== void 0 ? createRedactedString(msg.beforeFullFileContent, DataClassification.CODE, "before_full_file_content", privacyMode) : void 0,
    afterFullFileContent: createRedactedString(msg.afterFullFileContent, DataClassification.CODE, "after_full_file_content", privacyMode),
    message: msg.message !== void 0 ? createRedactedString(msg.message, DataClassification.CODE, "message", privacyMode) : void 0
  };
}
function fromRedactedEditSuccess(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new EditSuccess({
    path: msg.path.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    linesAdded: msg.linesAdded,
    linesRemoved: msg.linesRemoved,
    diffString: msg.diffString?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    beforeFullFileContent: msg.beforeFullFileContent?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    afterFullFileContent: msg.afterFullFileContent.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    message: msg.message?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedEditFileNotFound(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    path: createRedactedString(msg.path, DataClassification.PATH, "path", privacyMode)
  };
}
function fromRedactedEditFileNotFound(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new EditFileNotFound({
    path: msg.path.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedEditReadPermissionDenied(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    path: createRedactedString(msg.path, DataClassification.PATH, "path", privacyMode)
  };
}
function fromRedactedEditReadPermissionDenied(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new EditReadPermissionDenied({
    path: msg.path.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedEditWritePermissionDenied(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    path: createRedactedString(msg.path, DataClassification.PATH, "path", privacyMode),
    error: createRedactedString(msg.error, DataClassification.CODE, "error", privacyMode),
    isReadonly: msg.isReadonly
  };
}
function fromRedactedEditWritePermissionDenied(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new EditWritePermissionDenied({
    path: msg.path.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    error: msg.error.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    isReadonly: msg.isReadonly
  });
}
function toRedactedEditRejected(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    path: createRedactedString(msg.path, DataClassification.PATH, "path", privacyMode),
    reason: createRedactedString(msg.reason, DataClassification.CODE, "reason", privacyMode)
  };
}
function fromRedactedEditRejected(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new EditRejected({
    path: msg.path.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    reason: msg.reason.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedEditError(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    path: createRedactedString(msg.path, DataClassification.PATH, "path", privacyMode),
    error: createRedactedString(msg.error, DataClassification.CODE, "error", privacyMode),
    modelVisibleError: msg.modelVisibleError !== void 0 ? createRedactedString(msg.modelVisibleError, DataClassification.CODE, "model_visible_error", privacyMode) : void 0
  };
}
function fromRedactedEditError(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new EditError({
    path: msg.path.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    error: msg.error.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    modelVisibleError: msg.modelVisibleError?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedEditToolCall(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    args: msg.args !== void 0 ? toRedactedEditArgs(msg.args, privacyMode) : void 0,
    result: msg.result !== void 0 ? toRedactedEditResult(msg.result, privacyMode) : void 0
  };
}
function fromRedactedEditToolCall(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new EditToolCall({
    args: msg.args !== void 0 ? fromRedactedEditArgs(msg.args, purpose, opts) : void 0,
    result: msg.result !== void 0 ? fromRedactedEditResult(msg.result, purpose, opts) : void 0
  });
}
function toRedactedEditToolCallDelta(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    streamContentDelta: createRedactedString(msg.streamContentDelta, DataClassification.CODE, "stream_content_delta", privacyMode)
  };
}
function fromRedactedEditToolCallDelta(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new EditToolCallDelta({
    streamContentDelta: msg.streamContentDelta.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}

