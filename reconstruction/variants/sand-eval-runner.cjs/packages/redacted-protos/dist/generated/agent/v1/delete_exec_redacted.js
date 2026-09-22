/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/redacted-protos/dist/generated/agent/v1/delete_exec_redacted.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function toRedactedDeleteArgs(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    path: createRedactedString(msg.path, DataClassification.PATH, "path", privacyMode),
    toolCallId: msg.toolCallId
  };
}
function fromRedactedDeleteArgs(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new DeleteArgs({
    path: msg.path.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    toolCallId: msg.toolCallId
  });
}
function toRedactedDeleteResult(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    result: toRedactedDeleteResult_result(msg.result, privacyMode)
  };
}
function toRedactedDeleteResult_result(oneof, privacyMode) {
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "success":
      return { case: "success", value: toRedactedDeleteSuccess(oneof.value, privacyMode) };
    case "fileNotFound":
      return { case: "fileNotFound", value: toRedactedDeleteFileNotFound(oneof.value, privacyMode) };
    case "notFile":
      return { case: "notFile", value: toRedactedDeleteNotFile(oneof.value, privacyMode) };
    case "permissionDenied":
      return { case: "permissionDenied", value: toRedactedDeletePermissionDenied(oneof.value, privacyMode) };
    case "fileBusy":
      return { case: "fileBusy", value: toRedactedDeleteFileBusy(oneof.value, privacyMode) };
    case "rejected":
      return { case: "rejected", value: toRedactedDeleteRejected(oneof.value, privacyMode) };
    case "error":
      return { case: "error", value: toRedactedDeleteError(oneof.value, privacyMode) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function fromRedactedDeleteResult(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new DeleteResult({
    result: fromRedactedDeleteResult_result(msg.result, purpose, opts)
  });
}
function fromRedactedDeleteResult_result(oneof, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "success":
      return { case: "success", value: fromRedactedDeleteSuccess(oneof.value, purpose, opts) };
    case "fileNotFound":
      return { case: "fileNotFound", value: fromRedactedDeleteFileNotFound(oneof.value, purpose, opts) };
    case "notFile":
      return { case: "notFile", value: fromRedactedDeleteNotFile(oneof.value, purpose, opts) };
    case "permissionDenied":
      return { case: "permissionDenied", value: fromRedactedDeletePermissionDenied(oneof.value, purpose, opts) };
    case "fileBusy":
      return { case: "fileBusy", value: fromRedactedDeleteFileBusy(oneof.value, purpose, opts) };
    case "rejected":
      return { case: "rejected", value: fromRedactedDeleteRejected(oneof.value, purpose, opts) };
    case "error":
      return { case: "error", value: fromRedactedDeleteError(oneof.value, purpose, opts) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function toRedactedDeleteSuccess(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    path: createRedactedString(msg.path, DataClassification.PATH, "path", privacyMode),
    deletedFile: createRedactedString(msg.deletedFile, DataClassification.PATH, "deleted_file", privacyMode),
    fileSize: msg.fileSize,
    prevContent: createRedactedString(msg.prevContent, DataClassification.CODE, "prev_content", privacyMode)
  };
}
function fromRedactedDeleteSuccess(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new DeleteSuccess({
    path: msg.path.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    deletedFile: msg.deletedFile.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    fileSize: msg.fileSize,
    prevContent: msg.prevContent.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedDeleteFileNotFound(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    path: createRedactedString(msg.path, DataClassification.PATH, "path", privacyMode)
  };
}
function fromRedactedDeleteFileNotFound(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new DeleteFileNotFound({
    path: msg.path.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedDeleteNotFile(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    path: createRedactedString(msg.path, DataClassification.PATH, "path", privacyMode),
    actualType: msg.actualType
  };
}
function fromRedactedDeleteNotFile(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new DeleteNotFile({
    path: msg.path.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    actualType: msg.actualType
  });
}
function toRedactedDeletePermissionDenied(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    path: createRedactedString(msg.path, DataClassification.PATH, "path", privacyMode),
    clientVisibleError: createRedactedString(msg.clientVisibleError, DataClassification.CODE, "client_visible_error", privacyMode),
    isReadonly: msg.isReadonly
  };
}
function fromRedactedDeletePermissionDenied(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new DeletePermissionDenied({
    path: msg.path.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    clientVisibleError: msg.clientVisibleError.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    isReadonly: msg.isReadonly
  });
}
function toRedactedDeleteFileBusy(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    path: createRedactedString(msg.path, DataClassification.PATH, "path", privacyMode)
  };
}
function fromRedactedDeleteFileBusy(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new DeleteFileBusy({
    path: msg.path.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedDeleteRejected(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    path: createRedactedString(msg.path, DataClassification.PATH, "path", privacyMode),
    reason: createRedactedString(msg.reason, DataClassification.CODE, "reason", privacyMode)
  };
}
function fromRedactedDeleteRejected(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new DeleteRejected({
    path: msg.path.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    reason: msg.reason.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedDeleteError(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    path: createRedactedString(msg.path, DataClassification.PATH, "path", privacyMode),
    error: createRedactedString(msg.error, DataClassification.CODE, "error", privacyMode)
  };
}
function fromRedactedDeleteError(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new DeleteError({
    path: msg.path.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    error: msg.error.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}

