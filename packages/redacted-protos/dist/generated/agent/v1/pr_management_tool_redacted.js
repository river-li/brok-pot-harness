/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/redacted-protos/dist/generated/agent/v1/pr_management_tool_redacted.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_pr_management_tool_pb();
function toRedactedPrManagementArgs(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    toolCallId: msg.toolCallId,
    action: toRedactedPrManagementArgs_action(msg.action, privacyMode)
  };
}
function toRedactedPrManagementArgs_action(oneof, privacyMode) {
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "createPr":
      return { case: "createPr", value: toRedactedCreatePrAction(oneof.value, privacyMode) };
    case "updatePr":
      return { case: "updatePr", value: toRedactedUpdatePrAction(oneof.value, privacyMode) };
    case "postComment":
      return { case: "postComment", value: toRedactedPostCommentAction(oneof.value, privacyMode) };
    case "resolveComment":
      return { case: "resolveComment", value: toRedactedResolveCommentAction(oneof.value, privacyMode) };
    case "getCiStatus":
      return { case: "getCiStatus", value: toRedactedGetCiStatusAction(oneof.value, privacyMode) };
    case "setPrStatus":
      return { case: "setPrStatus", value: toRedactedSetPrStatusAction(oneof.value, privacyMode) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function fromRedactedPrManagementArgs(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new PrManagementArgs({
    toolCallId: msg.toolCallId,
    action: fromRedactedPrManagementArgs_action(msg.action, purpose, opts)
  });
}
function fromRedactedPrManagementArgs_action(oneof, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "createPr":
      return { case: "createPr", value: fromRedactedCreatePrAction(oneof.value, purpose, opts) };
    case "updatePr":
      return { case: "updatePr", value: fromRedactedUpdatePrAction(oneof.value, purpose, opts) };
    case "postComment":
      return { case: "postComment", value: fromRedactedPostCommentAction(oneof.value, purpose, opts) };
    case "resolveComment":
      return { case: "resolveComment", value: fromRedactedResolveCommentAction(oneof.value, purpose, opts) };
    case "getCiStatus":
      return { case: "getCiStatus", value: fromRedactedGetCiStatusAction(oneof.value, purpose, opts) };
    case "setPrStatus":
      return { case: "setPrStatus", value: fromRedactedSetPrStatusAction(oneof.value, purpose, opts) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function toRedactedCreatePrAction(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    title: createRedactedString(msg.title, DataClassification.CODE, "title", privacyMode),
    body: createRedactedString(msg.body, DataClassification.CODE, "body", privacyMode),
    baseBranch: msg.baseBranch !== void 0 ? createRedactedString(msg.baseBranch, DataClassification.PATH, "base_branch", privacyMode) : void 0,
    draft: msg.draft,
    branchName: createRedactedString(msg.branchName, DataClassification.PATH, "branch_name", privacyMode),
    addLabels: msg.addLabels.map((v2) => createRedactedString(v2, DataClassification.PATH, "add_labels", privacyMode)),
    repoUrl: msg.repoUrl !== void 0 ? createRedactedString(msg.repoUrl, DataClassification.PATH, "repo_url", privacyMode) : void 0,
    skipBranchPrefixCheck: msg.skipBranchPrefixCheck,
    stackOnPrNumber: msg.stackOnPrNumber
  };
}
function fromRedactedCreatePrAction(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new CreatePrAction({
    title: msg.title.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    body: msg.body.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    baseBranch: msg.baseBranch?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    draft: msg.draft,
    branchName: msg.branchName.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    addLabels: msg.addLabels.map((v2) => v2.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })),
    repoUrl: msg.repoUrl?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    skipBranchPrefixCheck: msg.skipBranchPrefixCheck,
    stackOnPrNumber: msg.stackOnPrNumber
  });
}
function toRedactedUpdatePrAction(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    prUrl: msg.prUrl,
    title: msg.title !== void 0 ? createRedactedString(msg.title, DataClassification.CODE, "title", privacyMode) : void 0,
    body: msg.body !== void 0 ? createRedactedString(msg.body, DataClassification.CODE, "body", privacyMode) : void 0,
    baseBranch: msg.baseBranch !== void 0 ? createRedactedString(msg.baseBranch, DataClassification.PATH, "base_branch", privacyMode) : void 0,
    branchName: msg.branchName !== void 0 ? createRedactedString(msg.branchName, DataClassification.PATH, "branch_name", privacyMode) : void 0,
    addLabels: msg.addLabels.map((v2) => createRedactedString(v2, DataClassification.PATH, "add_labels", privacyMode)),
    removeLabels: msg.removeLabels.map((v2) => createRedactedString(v2, DataClassification.PATH, "remove_labels", privacyMode)),
    repoUrl: msg.repoUrl !== void 0 ? createRedactedString(msg.repoUrl, DataClassification.PATH, "repo_url", privacyMode) : void 0,
    stackOnPrNumber: msg.stackOnPrNumber,
    clearStack: msg.clearStack,
    draft: msg.draft
  };
}
function fromRedactedUpdatePrAction(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new UpdatePrAction({
    prUrl: msg.prUrl,
    title: msg.title?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    body: msg.body?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    baseBranch: msg.baseBranch?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    branchName: msg.branchName?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    addLabels: msg.addLabels.map((v2) => v2.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })),
    removeLabels: msg.removeLabels.map((v2) => v2.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })),
    repoUrl: msg.repoUrl?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    stackOnPrNumber: msg.stackOnPrNumber,
    clearStack: msg.clearStack,
    draft: msg.draft
  });
}
function toRedactedPostCommentAction(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    prUrl: msg.prUrl,
    branchName: msg.branchName !== void 0 ? createRedactedString(msg.branchName, DataClassification.PATH, "branch_name", privacyMode) : void 0,
    body: createRedactedString(msg.body, DataClassification.CODE, "body", privacyMode),
    repoUrl: msg.repoUrl !== void 0 ? createRedactedString(msg.repoUrl, DataClassification.PATH, "repo_url", privacyMode) : void 0,
    inReplyTo: msg.inReplyTo,
    path: msg.path !== void 0 ? createRedactedString(msg.path, DataClassification.PATH, "path", privacyMode) : void 0,
    line: msg.line,
    startLine: msg.startLine,
    side: msg.side,
    replyToReference: msg.replyToReference
  };
}
function fromRedactedPostCommentAction(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new PostCommentAction({
    prUrl: msg.prUrl,
    branchName: msg.branchName?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    body: msg.body.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    repoUrl: msg.repoUrl?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    inReplyTo: msg.inReplyTo,
    path: msg.path?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    line: msg.line,
    startLine: msg.startLine,
    side: msg.side,
    replyToReference: msg.replyToReference
  });
}
function toRedactedResolveCommentAction(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    prUrl: msg.prUrl,
    branchName: msg.branchName !== void 0 ? createRedactedString(msg.branchName, DataClassification.PATH, "branch_name", privacyMode) : void 0,
    commentId: msg.commentId,
    repoUrl: msg.repoUrl !== void 0 ? createRedactedString(msg.repoUrl, DataClassification.PATH, "repo_url", privacyMode) : void 0,
    commentReference: msg.commentReference
  };
}
function fromRedactedResolveCommentAction(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ResolveCommentAction({
    prUrl: msg.prUrl,
    branchName: msg.branchName?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    commentId: msg.commentId,
    repoUrl: msg.repoUrl?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    commentReference: msg.commentReference
  });
}
function toRedactedGetCiStatusAction(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    prUrl: msg.prUrl,
    branchName: msg.branchName !== void 0 ? createRedactedString(msg.branchName, DataClassification.PATH, "branch_name", privacyMode) : void 0,
    repoUrl: msg.repoUrl !== void 0 ? createRedactedString(msg.repoUrl, DataClassification.PATH, "repo_url", privacyMode) : void 0
  };
}
function fromRedactedGetCiStatusAction(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new GetCiStatusAction({
    prUrl: msg.prUrl,
    branchName: msg.branchName?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    repoUrl: msg.repoUrl?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedSetPrStatusAction(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    prUrl: msg.prUrl,
    branchName: msg.branchName !== void 0 ? createRedactedString(msg.branchName, DataClassification.PATH, "branch_name", privacyMode) : void 0,
    repoUrl: msg.repoUrl !== void 0 ? createRedactedString(msg.repoUrl, DataClassification.PATH, "repo_url", privacyMode) : void 0,
    status: msg.status
  };
}
function fromRedactedSetPrStatusAction(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new SetPrStatusAction({
    prUrl: msg.prUrl,
    branchName: msg.branchName?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    repoUrl: msg.repoUrl?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    status: msg.status
  });
}
function toRedactedPrManagementResult(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    result: toRedactedPrManagementResult_result(msg.result, privacyMode)
  };
}
function toRedactedPrManagementResult_result(oneof, privacyMode) {
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "success":
      return { case: "success", value: toRedactedPrManagementSuccess(oneof.value, privacyMode) };
    case "error":
      return { case: "error", value: toRedactedPrManagementError(oneof.value, privacyMode) };
    case "rejected":
      return { case: "rejected", value: toRedactedPrManagementRejected(oneof.value, privacyMode) };
    case "registered":
      return { case: "registered", value: toRedactedPrManagementRegistered(oneof.value, privacyMode) };
    case "needsConfirmation":
      return { case: "needsConfirmation", value: toRedactedPrManagementNeedsConfirmation(oneof.value, privacyMode) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function fromRedactedPrManagementResult(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new PrManagementResult({
    result: fromRedactedPrManagementResult_result(msg.result, purpose, opts)
  });
}
function fromRedactedPrManagementResult_result(oneof, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "success":
      return { case: "success", value: fromRedactedPrManagementSuccess(oneof.value, purpose, opts) };
    case "error":
      return { case: "error", value: fromRedactedPrManagementError(oneof.value, purpose, opts) };
    case "rejected":
      return { case: "rejected", value: fromRedactedPrManagementRejected(oneof.value, purpose, opts) };
    case "registered":
      return { case: "registered", value: fromRedactedPrManagementRegistered(oneof.value, purpose, opts) };
    case "needsConfirmation":
      return { case: "needsConfirmation", value: fromRedactedPrManagementNeedsConfirmation(oneof.value, purpose, opts) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function toRedactedPrManagementSuccess(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    prUrl: msg.prUrl,
    prNumber: msg.prNumber,
    message: createRedactedString(msg.message, DataClassification.CODE, "message", privacyMode)
  };
}
function fromRedactedPrManagementSuccess(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new PrManagementSuccess({
    prUrl: msg.prUrl,
    prNumber: msg.prNumber,
    message: msg.message.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedPrManagementError(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    error: createRedactedString(msg.error, DataClassification.CODE, "error", privacyMode)
  };
}
function fromRedactedPrManagementError(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new PrManagementError({
    error: msg.error.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedPrManagementRejected(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    reason: createRedactedString(msg.reason, DataClassification.CODE, "reason", privacyMode)
  };
}
function fromRedactedPrManagementRejected(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new PrManagementRejected({
    reason: msg.reason.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedPrManagementRegistered(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    message: createRedactedString(msg.message, DataClassification.CODE, "message", privacyMode),
    title: createRedactedString(msg.title, DataClassification.CODE, "title", privacyMode),
    body: createRedactedString(msg.body, DataClassification.CODE, "body", privacyMode),
    baseBranch: msg.baseBranch !== void 0 ? createRedactedString(msg.baseBranch, DataClassification.PATH, "base_branch", privacyMode) : void 0,
    draft: msg.draft,
    branchName: createRedactedString(msg.branchName, DataClassification.PATH, "branch_name", privacyMode)
  };
}
function fromRedactedPrManagementRegistered(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new PrManagementRegistered({
    message: msg.message.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    title: msg.title.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    body: msg.body.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    baseBranch: msg.baseBranch?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    draft: msg.draft,
    branchName: msg.branchName.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedPrManagementNeedsConfirmation(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    message: createRedactedString(msg.message, DataClassification.CODE, "message", privacyMode),
    discoveredPrUrl: msg.discoveredPrUrl,
    discoveredPrNumber: msg.discoveredPrNumber,
    discoveredPrTitle: createRedactedString(msg.discoveredPrTitle, DataClassification.CODE, "discovered_pr_title", privacyMode),
    branchName: createRedactedString(msg.branchName, DataClassification.PATH, "branch_name", privacyMode)
  };
}
function fromRedactedPrManagementNeedsConfirmation(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new PrManagementNeedsConfirmation({
    message: msg.message.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    discoveredPrUrl: msg.discoveredPrUrl,
    discoveredPrNumber: msg.discoveredPrNumber,
    discoveredPrTitle: msg.discoveredPrTitle.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    branchName: msg.branchName.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedPrManagementToolCall(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    args: msg.args !== void 0 ? toRedactedPrManagementArgs(msg.args, privacyMode) : void 0,
    result: msg.result !== void 0 ? toRedactedPrManagementResult(msg.result, privacyMode) : void 0
  };
}
function fromRedactedPrManagementToolCall(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new PrManagementToolCall({
    args: msg.args !== void 0 ? fromRedactedPrManagementArgs(msg.args, purpose, opts) : void 0,
    result: msg.result !== void 0 ? fromRedactedPrManagementResult(msg.result, purpose, opts) : void 0
  });
}
function toRedactedPrManagementRequestQuery(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    args: msg.args !== void 0 ? toRedactedPrManagementArgs(msg.args, privacyMode) : void 0
  };
}
function fromRedactedPrManagementRequestQuery(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new PrManagementRequestQuery({
    args: msg.args !== void 0 ? fromRedactedPrManagementArgs(msg.args, purpose, opts) : void 0
  });
}

