init_cloud_canvas_tool_pb();
function toRedactedCloudCanvasToolDiagnosticPosition(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    line: msg.line,
    character: msg.character
  };
}
function fromRedactedCloudCanvasToolDiagnosticPosition(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new CloudCanvasToolDiagnosticPosition({
    line: msg.line,
    character: msg.character
  });
}
function toRedactedCloudCanvasToolDiagnosticRange(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    start: msg.start !== void 0 ? toRedactedCloudCanvasToolDiagnosticPosition(msg.start, privacyMode) : void 0,
    end: msg.end !== void 0 ? toRedactedCloudCanvasToolDiagnosticPosition(msg.end, privacyMode) : void 0
  };
}
function fromRedactedCloudCanvasToolDiagnosticRange(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new CloudCanvasToolDiagnosticRange({
    start: msg.start !== void 0 ? fromRedactedCloudCanvasToolDiagnosticPosition(msg.start, purpose, opts) : void 0,
    end: msg.end !== void 0 ? fromRedactedCloudCanvasToolDiagnosticPosition(msg.end, purpose, opts) : void 0
  });
}
function toRedactedCloudCanvasToolDiagnostic(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    message: createRedactedString(msg.message, DataClassification.CODE, "message", privacyMode),
    code: msg.code,
    severity: msg.severity,
    range: msg.range !== void 0 ? toRedactedCloudCanvasToolDiagnosticRange(msg.range, privacyMode) : void 0
  };
}
function fromRedactedCloudCanvasToolDiagnostic(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new CloudCanvasToolDiagnostic({
    message: msg.message.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    code: msg.code,
    severity: msg.severity,
    range: msg.range !== void 0 ? fromRedactedCloudCanvasToolDiagnosticRange(msg.range, purpose, opts) : void 0
  });
}
function toRedactedWriteCanvasArgs(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    contents: createRedactedString(msg.contents, DataClassification.CODE, "contents", privacyMode),
    canvasId: msg.canvasId,
    title: msg.title !== void 0 ? createRedactedString(msg.title, DataClassification.CODE, "title", privacyMode) : void 0
  };
}
function fromRedactedWriteCanvasArgs(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new WriteCanvasArgs({
    contents: msg.contents.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    canvasId: msg.canvasId,
    title: msg.title?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedWriteCanvasSuccess(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    canvasId: msg.canvasId,
    title: msg.title !== void 0 ? createRedactedString(msg.title, DataClassification.CODE, "title", privacyMode) : void 0,
    url: createRedactedString(msg.url, DataClassification.PATH, "url", privacyMode)
  };
}
function fromRedactedWriteCanvasSuccess(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new WriteCanvasSuccess({
    canvasId: msg.canvasId,
    title: msg.title?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    url: msg.url.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedWriteCanvasFailure(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    reason: msg.reason,
    diagnostics: msg.diagnostics.map((v2) => toRedactedCloudCanvasToolDiagnostic(v2, privacyMode)),
    detail: msg.detail !== void 0 ? createRedactedString(msg.detail, DataClassification.CODE, "detail", privacyMode) : void 0
  };
}
function fromRedactedWriteCanvasFailure(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new WriteCanvasFailure({
    reason: msg.reason,
    diagnostics: msg.diagnostics.map((v2) => fromRedactedCloudCanvasToolDiagnostic(v2, purpose, opts)),
    detail: msg.detail?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedWriteCanvasResult(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    result: toRedactedWriteCanvasResult_result(msg.result, privacyMode)
  };
}
function toRedactedWriteCanvasResult_result(oneof, privacyMode) {
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "success":
      return { case: "success", value: toRedactedWriteCanvasSuccess(oneof.value, privacyMode) };
    case "failure":
      return { case: "failure", value: toRedactedWriteCanvasFailure(oneof.value, privacyMode) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function fromRedactedWriteCanvasResult(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new WriteCanvasResult({
    result: fromRedactedWriteCanvasResult_result(msg.result, purpose, opts)
  });
}
function fromRedactedWriteCanvasResult_result(oneof, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "success":
      return { case: "success", value: fromRedactedWriteCanvasSuccess(oneof.value, purpose, opts) };
    case "failure":
      return { case: "failure", value: fromRedactedWriteCanvasFailure(oneof.value, purpose, opts) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function toRedactedWriteCanvasToolCall(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    args: msg.args !== void 0 ? toRedactedWriteCanvasArgs(msg.args, privacyMode) : void 0,
    result: msg.result !== void 0 ? toRedactedWriteCanvasResult(msg.result, privacyMode) : void 0
  };
}
function fromRedactedWriteCanvasToolCall(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new WriteCanvasToolCall({
    args: msg.args !== void 0 ? fromRedactedWriteCanvasArgs(msg.args, purpose, opts) : void 0,
    result: msg.result !== void 0 ? fromRedactedWriteCanvasResult(msg.result, purpose, opts) : void 0
  });
}
function toRedactedReadCanvasArgs(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    canvasId: msg.canvasId,
    url: msg.url !== void 0 ? createRedactedString(msg.url, DataClassification.PATH, "url", privacyMode) : void 0
  };
}
function fromRedactedReadCanvasArgs(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ReadCanvasArgs({
    canvasId: msg.canvasId,
    url: msg.url?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedReadCanvasSuccess(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    canvasId: msg.canvasId,
    title: msg.title !== void 0 ? createRedactedString(msg.title, DataClassification.CODE, "title", privacyMode) : void 0,
    url: createRedactedString(msg.url, DataClassification.PATH, "url", privacyMode),
    source: createRedactedString(msg.source, DataClassification.CODE, "source", privacyMode)
  };
}
function fromRedactedReadCanvasSuccess(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ReadCanvasSuccess({
    canvasId: msg.canvasId,
    title: msg.title?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    url: msg.url.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    source: msg.source.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedReadCanvasFailure(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    reason: msg.reason,
    detail: msg.detail !== void 0 ? createRedactedString(msg.detail, DataClassification.CODE, "detail", privacyMode) : void 0
  };
}
function fromRedactedReadCanvasFailure(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ReadCanvasFailure({
    reason: msg.reason,
    detail: msg.detail?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedReadCanvasResult(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    result: toRedactedReadCanvasResult_result(msg.result, privacyMode)
  };
}
function toRedactedReadCanvasResult_result(oneof, privacyMode) {
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "success":
      return { case: "success", value: toRedactedReadCanvasSuccess(oneof.value, privacyMode) };
    case "failure":
      return { case: "failure", value: toRedactedReadCanvasFailure(oneof.value, privacyMode) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function fromRedactedReadCanvasResult(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ReadCanvasResult({
    result: fromRedactedReadCanvasResult_result(msg.result, purpose, opts)
  });
}
function fromRedactedReadCanvasResult_result(oneof, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "success":
      return { case: "success", value: fromRedactedReadCanvasSuccess(oneof.value, purpose, opts) };
    case "failure":
      return { case: "failure", value: fromRedactedReadCanvasFailure(oneof.value, purpose, opts) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function toRedactedReadCanvasToolCall(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    args: msg.args !== void 0 ? toRedactedReadCanvasArgs(msg.args, privacyMode) : void 0,
    result: msg.result !== void 0 ? toRedactedReadCanvasResult(msg.result, privacyMode) : void 0
  };
}
function fromRedactedReadCanvasToolCall(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ReadCanvasToolCall({
    args: msg.args !== void 0 ? fromRedactedReadCanvasArgs(msg.args, purpose, opts) : void 0,
    result: msg.result !== void 0 ? fromRedactedReadCanvasResult(msg.result, purpose, opts) : void 0
  });
}
