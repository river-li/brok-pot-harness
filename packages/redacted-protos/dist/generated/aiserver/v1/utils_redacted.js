/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/redacted-protos/dist/generated/aiserver/v1/utils_redacted.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_utils_pb();
function toRedactedCursorPosition(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    line: msg.line,
    column: msg.column
  };
}
function fromRedactedCursorPosition(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new CursorPosition({
    line: msg.line,
    column: msg.column
  });
}
function toRedactedCursorRange(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    startPosition: msg.startPosition !== void 0 ? toRedactedCursorPosition(msg.startPosition, privacyMode) : void 0,
    endPosition: msg.endPosition !== void 0 ? toRedactedCursorPosition(msg.endPosition, privacyMode) : void 0
  };
}
function fromRedactedCursorRange(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new CursorRange({
    startPosition: msg.startPosition !== void 0 ? fromRedactedCursorPosition(msg.startPosition, purpose, opts) : void 0,
    endPosition: msg.endPosition !== void 0 ? fromRedactedCursorPosition(msg.endPosition, purpose, opts) : void 0
  });
}
function toRedactedDetailedLine(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    text: createRedactedString(msg.text, DataClassification.CODE, "text", privacyMode),
    lineNumber: msg.lineNumber,
    isSignature: msg.isSignature
  };
}
function fromRedactedDetailedLine(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new DetailedLine({
    text: msg.text.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    lineNumber: msg.lineNumber,
    isSignature: msg.isSignature
  });
}
function toRedactedCodeBlock(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    relativeWorkspacePath: createRedactedString(msg.relativeWorkspacePath, DataClassification.PATH, "relative_workspace_path", privacyMode),
    fileContents: msg.fileContents !== void 0 ? createRedactedString(msg.fileContents, DataClassification.CODE, "file_contents", privacyMode) : void 0,
    fileContentsLength: msg.fileContentsLength,
    range: msg.range !== void 0 ? toRedactedCursorRange(msg.range, privacyMode) : void 0,
    contents: createRedactedString(msg.contents, DataClassification.CODE, "contents", privacyMode),
    signatures: msg.signatures !== void 0 ? toRedactedCodeBlock_Signatures(msg.signatures, privacyMode) : void 0,
    overrideContents: msg.overrideContents !== void 0 ? createRedactedString(msg.overrideContents, DataClassification.CODE, "override_contents", privacyMode) : void 0,
    originalContents: msg.originalContents !== void 0 ? createRedactedString(msg.originalContents, DataClassification.CODE, "original_contents", privacyMode) : void 0,
    detailedLines: msg.detailedLines.map((v2) => toRedactedDetailedLine(v2, privacyMode)),
    fileGitContext: msg.fileGitContext !== void 0 ? toRedactedFileGit(msg.fileGitContext, privacyMode) : void 0
  };
}
function fromRedactedCodeBlock(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new CodeBlock({
    relativeWorkspacePath: msg.relativeWorkspacePath.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    fileContents: msg.fileContents?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    fileContentsLength: msg.fileContentsLength,
    range: msg.range !== void 0 ? fromRedactedCursorRange(msg.range, purpose, opts) : void 0,
    contents: msg.contents.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    signatures: msg.signatures !== void 0 ? fromRedactedCodeBlock_Signatures(msg.signatures, purpose, opts) : void 0,
    overrideContents: msg.overrideContents?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    originalContents: msg.originalContents?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    detailedLines: msg.detailedLines.map((v2) => fromRedactedDetailedLine(v2, purpose, opts)),
    fileGitContext: msg.fileGitContext !== void 0 ? fromRedactedFileGit(msg.fileGitContext, purpose, opts) : void 0
  });
}
function toRedactedCodeBlock_Signatures(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    ranges: msg.ranges.map((v2) => toRedactedCursorRange(v2, privacyMode))
  };
}
function fromRedactedCodeBlock_Signatures(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new CodeBlock_Signatures({
    ranges: msg.ranges.map((v2) => fromRedactedCursorRange(v2, purpose, opts))
  });
}
function toRedactedGitCommit(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    commit: msg.commit,
    author: msg.author,
    date: msg.date,
    message: createRedactedString(msg.message, DataClassification.CODE, "message", privacyMode)
  };
}
function fromRedactedGitCommit(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new GitCommit({
    commit: msg.commit,
    author: msg.author,
    date: msg.date,
    message: msg.message.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedFileGit(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    commits: msg.commits.map((v2) => toRedactedGitCommit(v2, privacyMode))
  };
}
function fromRedactedFileGit(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new FileGit({
    commits: msg.commits.map((v2) => fromRedactedGitCommit(v2, purpose, opts))
  });
}

