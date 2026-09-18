init_generate_image_tool_pb();
function toRedactedGenerateImageArgs(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    description: createRedactedString(msg.description, DataClassification.CODE, "description", privacyMode),
    filePath: msg.filePath !== void 0 ? createRedactedString(msg.filePath, DataClassification.PATH, "file_path", privacyMode) : void 0,
    referenceImagePaths: msg.referenceImagePaths.map((v2) => createRedactedString(v2, DataClassification.PATH, "reference_image_paths", privacyMode)),
    aspectRatio: msg.aspectRatio
  };
}
function fromRedactedGenerateImageArgs(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new GenerateImageArgs({
    description: msg.description.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    filePath: msg.filePath?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    referenceImagePaths: msg.referenceImagePaths.map((v2) => v2.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })),
    aspectRatio: msg.aspectRatio
  });
}
function toRedactedGenerateImageResult(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    result: toRedactedGenerateImageResult_result(msg.result, privacyMode)
  };
}
function toRedactedGenerateImageResult_result(oneof, privacyMode) {
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "success":
      return { case: "success", value: toRedactedGenerateImageSuccess(oneof.value, privacyMode) };
    case "error":
      return { case: "error", value: toRedactedGenerateImageError(oneof.value, privacyMode) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function fromRedactedGenerateImageResult(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new GenerateImageResult({
    result: fromRedactedGenerateImageResult_result(msg.result, purpose, opts)
  });
}
function fromRedactedGenerateImageResult_result(oneof, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "success":
      return { case: "success", value: fromRedactedGenerateImageSuccess(oneof.value, purpose, opts) };
    case "error":
      return { case: "error", value: fromRedactedGenerateImageError(oneof.value, purpose, opts) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function toRedactedGenerateImageSuccess(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    filePath: createRedactedString(msg.filePath, DataClassification.PATH, "file_path", privacyMode),
    imageData: createRedactedString(msg.imageData, DataClassification.CODE, "image_data", privacyMode)
  };
}
function fromRedactedGenerateImageSuccess(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new GenerateImageSuccess({
    filePath: msg.filePath.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    imageData: msg.imageData.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedGenerateImageError(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    error: createRedactedString(msg.error, DataClassification.CODE, "error", privacyMode)
  };
}
function fromRedactedGenerateImageError(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new GenerateImageError({
    error: msg.error.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedGenerateImageToolCall(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    args: msg.args !== void 0 ? toRedactedGenerateImageArgs(msg.args, privacyMode) : void 0,
    result: msg.result !== void 0 ? toRedactedGenerateImageResult(msg.result, privacyMode) : void 0
  };
}
function fromRedactedGenerateImageToolCall(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new GenerateImageToolCall({
    args: msg.args !== void 0 ? fromRedactedGenerateImageArgs(msg.args, purpose, opts) : void 0,
    result: msg.result !== void 0 ? fromRedactedGenerateImageResult(msg.result, purpose, opts) : void 0
  });
}
function toRedactedGenerateImageRequestQuery(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    args: msg.args !== void 0 ? toRedactedGenerateImageArgs(msg.args, privacyMode) : void 0,
    toolCallId: msg.toolCallId
  };
}
function fromRedactedGenerateImageRequestQuery(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new GenerateImageRequestQuery({
    args: msg.args !== void 0 ? fromRedactedGenerateImageArgs(msg.args, purpose, opts) : void 0,
    toolCallId: msg.toolCallId
  });
}
function toRedactedGenerateImageRequestResponse(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    result: toRedactedGenerateImageRequestResponse_result(msg.result, privacyMode)
  };
}
function toRedactedGenerateImageRequestResponse_result(oneof, privacyMode) {
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "approved":
      return { case: "approved", value: toRedactedGenerateImageRequestResponse_Approved(oneof.value, privacyMode) };
    case "rejected":
      return { case: "rejected", value: toRedactedGenerateImageRequestResponse_Rejected(oneof.value, privacyMode) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function fromRedactedGenerateImageRequestResponse(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new GenerateImageRequestResponse({
    result: fromRedactedGenerateImageRequestResponse_result(msg.result, purpose, opts)
  });
}
function fromRedactedGenerateImageRequestResponse_result(oneof, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "approved":
      return { case: "approved", value: fromRedactedGenerateImageRequestResponse_Approved(oneof.value, purpose, opts) };
    case "rejected":
      return { case: "rejected", value: fromRedactedGenerateImageRequestResponse_Rejected(oneof.value, purpose, opts) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function toRedactedGenerateImageRequestResponse_Approved(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    description: createRedactedString(msg.description, DataClassification.CODE, "description", privacyMode)
  };
}
function fromRedactedGenerateImageRequestResponse_Approved(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new GenerateImageRequestResponse_Approved({
    description: msg.description.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedGenerateImageRequestResponse_Rejected(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    reason: createRedactedString(msg.reason, DataClassification.CODE, "reason", privacyMode)
  };
}
function fromRedactedGenerateImageRequestResponse_Rejected(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new GenerateImageRequestResponse_Rejected({
    reason: msg.reason.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
