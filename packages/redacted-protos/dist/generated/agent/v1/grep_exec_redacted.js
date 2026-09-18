init_grep_exec_pb();
function toRedactedGrepArgs(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    pattern: createRedactedString(msg.pattern, DataClassification.CODE, "pattern", privacyMode),
    path: msg.path !== void 0 ? createRedactedString(msg.path, DataClassification.PATH, "path", privacyMode) : void 0,
    glob: msg.glob !== void 0 ? createRedactedString(msg.glob, DataClassification.PATH, "glob", privacyMode) : void 0,
    outputMode: msg.outputMode,
    contextBefore: msg.contextBefore,
    contextAfter: msg.contextAfter,
    context: msg.context,
    caseInsensitive: msg.caseInsensitive,
    type: msg.type,
    headLimit: msg.headLimit,
    multiline: msg.multiline,
    sort: msg.sort,
    sortAscending: msg.sortAscending,
    toolCallId: msg.toolCallId,
    sandboxPolicy: msg.sandboxPolicy !== void 0 ? toRedactedSandboxPolicy(msg.sandboxPolicy, privacyMode) : void 0,
    offset: msg.offset
  };
}
function fromRedactedGrepArgs(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new GrepArgs({
    pattern: msg.pattern.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    path: msg.path?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    glob: msg.glob?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    outputMode: msg.outputMode,
    contextBefore: msg.contextBefore,
    contextAfter: msg.contextAfter,
    context: msg.context,
    caseInsensitive: msg.caseInsensitive,
    type: msg.type,
    headLimit: msg.headLimit,
    multiline: msg.multiline,
    sort: msg.sort,
    sortAscending: msg.sortAscending,
    toolCallId: msg.toolCallId,
    sandboxPolicy: msg.sandboxPolicy !== void 0 ? fromRedactedSandboxPolicy(msg.sandboxPolicy, purpose, opts) : void 0,
    offset: msg.offset
  });
}
function toRedactedGrepResult(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    result: toRedactedGrepResult_result(msg.result, privacyMode)
  };
}
function toRedactedGrepResult_result(oneof, privacyMode) {
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "success":
      return { case: "success", value: toRedactedGrepSuccess(oneof.value, privacyMode) };
    case "error":
      return { case: "error", value: toRedactedGrepError(oneof.value, privacyMode) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function fromRedactedGrepResult(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new GrepResult({
    result: fromRedactedGrepResult_result(msg.result, purpose, opts)
  });
}
function fromRedactedGrepResult_result(oneof, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "success":
      return { case: "success", value: fromRedactedGrepSuccess(oneof.value, purpose, opts) };
    case "error":
      return { case: "error", value: fromRedactedGrepError(oneof.value, purpose, opts) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function toRedactedGrepError(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    error: createRedactedString(msg.error, DataClassification.CODE, "error", privacyMode)
  };
}
function fromRedactedGrepError(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new GrepError({
    error: msg.error.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedGrepSuccess(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    pattern: createRedactedString(msg.pattern, DataClassification.CODE, "pattern", privacyMode),
    path: createRedactedString(msg.path, DataClassification.PATH, "path", privacyMode),
    outputMode: msg.outputMode,
    workspaceResults: new Map(Object.entries(msg.workspaceResults).map(([k2, v2]) => [createRedactedString(k2, DataClassification.PATH, "workspace_results", privacyMode), toRedactedGrepUnionResult(v2, privacyMode)])),
    activeEditorResult: msg.activeEditorResult !== void 0 ? toRedactedGrepUnionResult(msg.activeEditorResult, privacyMode) : void 0
  };
}
function fromRedactedGrepSuccess(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new GrepSuccess({
    pattern: msg.pattern.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    path: msg.path.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    outputMode: msg.outputMode,
    workspaceResults: Object.fromEntries(Array.from(msg.workspaceResults.entries()).map(([k2, v2]) => [k2.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }), fromRedactedGrepUnionResult(v2, purpose, opts)])),
    activeEditorResult: msg.activeEditorResult !== void 0 ? fromRedactedGrepUnionResult(msg.activeEditorResult, purpose, opts) : void 0
  });
}
function toRedactedGrepUnionResult(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    result: toRedactedGrepUnionResult_result(msg.result, privacyMode)
  };
}
function toRedactedGrepUnionResult_result(oneof, privacyMode) {
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "count":
      return { case: "count", value: toRedactedGrepCountResult(oneof.value, privacyMode) };
    case "files":
      return { case: "files", value: toRedactedGrepFilesResult(oneof.value, privacyMode) };
    case "content":
      return { case: "content", value: toRedactedGrepContentResult(oneof.value, privacyMode) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function fromRedactedGrepUnionResult(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new GrepUnionResult({
    result: fromRedactedGrepUnionResult_result(msg.result, purpose, opts)
  });
}
function fromRedactedGrepUnionResult_result(oneof, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "count":
      return { case: "count", value: fromRedactedGrepCountResult(oneof.value, purpose, opts) };
    case "files":
      return { case: "files", value: fromRedactedGrepFilesResult(oneof.value, purpose, opts) };
    case "content":
      return { case: "content", value: fromRedactedGrepContentResult(oneof.value, purpose, opts) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function toRedactedGrepCountResult(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    counts: msg.counts.map((v2) => toRedactedGrepFileCount(v2, privacyMode)),
    totalFiles: msg.totalFiles,
    totalMatches: msg.totalMatches,
    clientTruncated: msg.clientTruncated,
    ripgrepTruncated: msg.ripgrepTruncated,
    headLimitApplied: msg.headLimitApplied,
    offsetApplied: msg.offsetApplied
  };
}
function fromRedactedGrepCountResult(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new GrepCountResult({
    counts: msg.counts.map((v2) => fromRedactedGrepFileCount(v2, purpose, opts)),
    totalFiles: msg.totalFiles,
    totalMatches: msg.totalMatches,
    clientTruncated: msg.clientTruncated,
    ripgrepTruncated: msg.ripgrepTruncated,
    headLimitApplied: msg.headLimitApplied,
    offsetApplied: msg.offsetApplied
  });
}
function toRedactedGrepFileCount(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    file: createRedactedString(msg.file, DataClassification.PATH, "file", privacyMode),
    count: msg.count
  };
}
function fromRedactedGrepFileCount(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new GrepFileCount({
    file: msg.file.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    count: msg.count
  });
}
function toRedactedGrepFilesResult(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    files: msg.files.map((v2) => createRedactedString(v2, DataClassification.PATH, "files", privacyMode)),
    totalFiles: msg.totalFiles,
    clientTruncated: msg.clientTruncated,
    ripgrepTruncated: msg.ripgrepTruncated,
    headLimitApplied: msg.headLimitApplied,
    offsetApplied: msg.offsetApplied
  };
}
function fromRedactedGrepFilesResult(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new GrepFilesResult({
    files: msg.files.map((v2) => v2.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })),
    totalFiles: msg.totalFiles,
    clientTruncated: msg.clientTruncated,
    ripgrepTruncated: msg.ripgrepTruncated,
    headLimitApplied: msg.headLimitApplied,
    offsetApplied: msg.offsetApplied
  });
}
function toRedactedGrepContentResult(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    matches: msg.matches.map((v2) => toRedactedGrepFileMatch(v2, privacyMode)),
    totalLines: msg.totalLines,
    totalMatchedLines: msg.totalMatchedLines,
    clientTruncated: msg.clientTruncated,
    ripgrepTruncated: msg.ripgrepTruncated,
    headLimitApplied: msg.headLimitApplied,
    offsetApplied: msg.offsetApplied
  };
}
function fromRedactedGrepContentResult(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new GrepContentResult({
    matches: msg.matches.map((v2) => fromRedactedGrepFileMatch(v2, purpose, opts)),
    totalLines: msg.totalLines,
    totalMatchedLines: msg.totalMatchedLines,
    clientTruncated: msg.clientTruncated,
    ripgrepTruncated: msg.ripgrepTruncated,
    headLimitApplied: msg.headLimitApplied,
    offsetApplied: msg.offsetApplied
  });
}
function toRedactedGrepFileMatch(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    file: createRedactedString(msg.file, DataClassification.PATH, "file", privacyMode),
    matches: msg.matches.map((v2) => toRedactedGrepContentMatch(v2, privacyMode))
  };
}
function fromRedactedGrepFileMatch(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new GrepFileMatch({
    file: msg.file.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    matches: msg.matches.map((v2) => fromRedactedGrepContentMatch(v2, purpose, opts))
  });
}
function toRedactedGrepContentMatch(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    lineNumber: msg.lineNumber,
    content: createRedactedString(msg.content, DataClassification.CODE, "content", privacyMode),
    contentTruncated: msg.contentTruncated,
    isContextLine: msg.isContextLine
  };
}
function fromRedactedGrepContentMatch(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new GrepContentMatch({
    lineNumber: msg.lineNumber,
    content: msg.content.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    contentTruncated: msg.contentTruncated,
    isContextLine: msg.isContextLine
  });
}
