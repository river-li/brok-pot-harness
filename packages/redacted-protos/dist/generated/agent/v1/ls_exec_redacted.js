init_ls_exec_pb();
function toRedactedLsArgs(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    path: createRedactedString(msg.path, DataClassification.PATH, "path", privacyMode),
    ignore: msg.ignore.map((v2) => createRedactedString(v2, DataClassification.PATH, "ignore", privacyMode)),
    toolCallId: msg.toolCallId,
    sandboxPolicy: msg.sandboxPolicy !== void 0 ? toRedactedSandboxPolicy(msg.sandboxPolicy, privacyMode) : void 0,
    timeoutMs: msg.timeoutMs
  };
}
function fromRedactedLsArgs(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new LsArgs({
    path: msg.path.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    ignore: msg.ignore.map((v2) => v2.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })),
    toolCallId: msg.toolCallId,
    sandboxPolicy: msg.sandboxPolicy !== void 0 ? fromRedactedSandboxPolicy(msg.sandboxPolicy, purpose, opts) : void 0,
    timeoutMs: msg.timeoutMs
  });
}
function toRedactedLsResult(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    result: toRedactedLsResult_result(msg.result, privacyMode)
  };
}
function toRedactedLsResult_result(oneof, privacyMode) {
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "success":
      return { case: "success", value: toRedactedLsSuccess(oneof.value, privacyMode) };
    case "error":
      return { case: "error", value: toRedactedLsError(oneof.value, privacyMode) };
    case "rejected":
      return { case: "rejected", value: toRedactedLsRejected(oneof.value, privacyMode) };
    case "timeout":
      return { case: "timeout", value: toRedactedLsTimeout(oneof.value, privacyMode) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function fromRedactedLsResult(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new LsResult({
    result: fromRedactedLsResult_result(msg.result, purpose, opts)
  });
}
function fromRedactedLsResult_result(oneof, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "success":
      return { case: "success", value: fromRedactedLsSuccess(oneof.value, purpose, opts) };
    case "error":
      return { case: "error", value: fromRedactedLsError(oneof.value, purpose, opts) };
    case "rejected":
      return { case: "rejected", value: fromRedactedLsRejected(oneof.value, purpose, opts) };
    case "timeout":
      return { case: "timeout", value: fromRedactedLsTimeout(oneof.value, purpose, opts) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function toRedactedLsSuccess(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    directoryTreeRoot: msg.directoryTreeRoot !== void 0 ? toRedactedLsDirectoryTreeNode(msg.directoryTreeRoot, privacyMode) : void 0
  };
}
function fromRedactedLsSuccess(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new LsSuccess({
    directoryTreeRoot: msg.directoryTreeRoot !== void 0 ? fromRedactedLsDirectoryTreeNode(msg.directoryTreeRoot, purpose, opts) : void 0
  });
}
function toRedactedLsDirectoryTreeNode(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    absPath: createRedactedString(msg.absPath, DataClassification.PATH, "abs_path", privacyMode),
    childrenDirs: msg.childrenDirs.map((v2) => toRedactedLsDirectoryTreeNode(v2, privacyMode)),
    childrenFiles: msg.childrenFiles.map((v2) => toRedactedLsDirectoryTreeNode_File(v2, privacyMode)),
    childrenWereProcessed: msg.childrenWereProcessed,
    fullSubtreeExtensionCounts: new Map(Object.entries(msg.fullSubtreeExtensionCounts)),
    numFiles: msg.numFiles
  };
}
function fromRedactedLsDirectoryTreeNode(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new LsDirectoryTreeNode({
    absPath: msg.absPath.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    childrenDirs: msg.childrenDirs.map((v2) => fromRedactedLsDirectoryTreeNode(v2, purpose, opts)),
    childrenFiles: msg.childrenFiles.map((v2) => fromRedactedLsDirectoryTreeNode_File(v2, purpose, opts)),
    childrenWereProcessed: msg.childrenWereProcessed,
    fullSubtreeExtensionCounts: Object.fromEntries(msg.fullSubtreeExtensionCounts.entries()),
    numFiles: msg.numFiles
  });
}
function toRedactedLsDirectoryTreeNode_File(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    name: createRedactedString(msg.name, DataClassification.PATH, "name", privacyMode),
    terminalMetadata: msg.terminalMetadata !== void 0 ? toRedactedTerminalMetadata(msg.terminalMetadata, privacyMode) : void 0
  };
}
function fromRedactedLsDirectoryTreeNode_File(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new LsDirectoryTreeNode_File({
    name: msg.name.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    terminalMetadata: msg.terminalMetadata !== void 0 ? fromRedactedTerminalMetadata(msg.terminalMetadata, purpose, opts) : void 0
  });
}
function toRedactedLsError(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    path: createRedactedString(msg.path, DataClassification.PATH, "path", privacyMode),
    error: createRedactedString(msg.error, DataClassification.CODE, "error", privacyMode)
  };
}
function fromRedactedLsError(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new LsError({
    path: msg.path.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    error: msg.error.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedLsRejected(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    path: createRedactedString(msg.path, DataClassification.PATH, "path", privacyMode),
    reason: createRedactedString(msg.reason, DataClassification.CODE, "reason", privacyMode)
  };
}
function fromRedactedLsRejected(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new LsRejected({
    path: msg.path.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    reason: msg.reason.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedLsTimeout(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    directoryTreeRoot: msg.directoryTreeRoot !== void 0 ? toRedactedLsDirectoryTreeNode(msg.directoryTreeRoot, privacyMode) : void 0
  };
}
function fromRedactedLsTimeout(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new LsTimeout({
    directoryTreeRoot: msg.directoryTreeRoot !== void 0 ? fromRedactedLsDirectoryTreeNode(msg.directoryTreeRoot, purpose, opts) : void 0
  });
}
function toRedactedTerminalMetadata(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    cwd: msg.cwd !== void 0 ? createRedactedString(msg.cwd, DataClassification.PATH, "cwd", privacyMode) : void 0,
    lastCommands: msg.lastCommands.map((v2) => toRedactedTerminalMetadata_Command(v2, privacyMode)),
    lastModifiedMs: msg.lastModifiedMs,
    currentCommand: msg.currentCommand !== void 0 ? toRedactedTerminalMetadata_Command(msg.currentCommand, privacyMode) : void 0
  };
}
function fromRedactedTerminalMetadata(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new TerminalMetadata({
    cwd: msg.cwd?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    lastCommands: msg.lastCommands.map((v2) => fromRedactedTerminalMetadata_Command(v2, purpose, opts)),
    lastModifiedMs: msg.lastModifiedMs,
    currentCommand: msg.currentCommand !== void 0 ? fromRedactedTerminalMetadata_Command(msg.currentCommand, purpose, opts) : void 0
  });
}
function toRedactedTerminalMetadata_Command(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    command: createRedactedString(msg.command, DataClassification.CODE, "command", privacyMode),
    exitCode: msg.exitCode,
    timestampMs: msg.timestampMs,
    durationMs: msg.durationMs
  };
}
function fromRedactedTerminalMetadata_Command(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new TerminalMetadata_Command({
    command: msg.command.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    exitCode: msg.exitCode,
    timestampMs: msg.timestampMs,
    durationMs: msg.durationMs
  });
}
