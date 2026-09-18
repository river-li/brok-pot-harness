init_agent_pb();
function toRedactedTaskArgs(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    description: createRedactedString(msg.description, DataClassification.CODE, "description", privacyMode),
    prompt: createRedactedString(msg.prompt, DataClassification.CODE, "prompt", privacyMode),
    subagentType: msg.subagentType !== void 0 ? toRedactedSubagentType(msg.subagentType, privacyMode) : void 0,
    model: msg.model,
    resume: msg.resume,
    agentId: msg.agentId,
    attachments: msg.attachments.map((v2) => createRedactedString(v2, DataClassification.PATH, "attachments", privacyMode)),
    mode: msg.mode,
    respondingToMessageIds: msg.respondingToMessageIds,
    environment: msg.environment,
    machine: msg.machine !== void 0 ? toRedactedTargetMachine(msg.machine, privacyMode) : void 0
  };
}
function fromRedactedTaskArgs(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new TaskArgs({
    description: msg.description.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    prompt: msg.prompt.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    subagentType: msg.subagentType !== void 0 ? fromRedactedSubagentType(msg.subagentType, purpose, opts) : void 0,
    model: msg.model,
    resume: msg.resume,
    agentId: msg.agentId,
    attachments: msg.attachments.map((v2) => v2.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })),
    mode: msg.mode,
    respondingToMessageIds: msg.respondingToMessageIds,
    environment: msg.environment,
    machine: msg.machine !== void 0 ? fromRedactedTargetMachine(msg.machine, purpose, opts) : void 0
  });
}
function toRedactedTargetMachine(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    machine: toRedactedTargetMachine_machine(msg.machine, privacyMode)
  };
}
function toRedactedTargetMachine_machine(oneof, privacyMode) {
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "sameMachine":
      return { case: "sameMachine", value: toRedactedSameMachineTarget(oneof.value, privacyMode) };
    case "newCloudVm":
      return { case: "newCloudVm", value: toRedactedNewCloudVmTarget(oneof.value, privacyMode) };
    case "selfHostedWorker":
      return { case: "selfHostedWorker", value: toRedactedSelfHostedWorkerTarget(oneof.value, privacyMode) };
    case "selfHostedPool":
      return { case: "selfHostedPool", value: toRedactedSelfHostedPoolTarget(oneof.value, privacyMode) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function fromRedactedTargetMachine(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new TargetMachine({
    machine: fromRedactedTargetMachine_machine(msg.machine, purpose, opts)
  });
}
function fromRedactedTargetMachine_machine(oneof, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "sameMachine":
      return { case: "sameMachine", value: fromRedactedSameMachineTarget(oneof.value, purpose, opts) };
    case "newCloudVm":
      return { case: "newCloudVm", value: fromRedactedNewCloudVmTarget(oneof.value, purpose, opts) };
    case "selfHostedWorker":
      return { case: "selfHostedWorker", value: fromRedactedSelfHostedWorkerTarget(oneof.value, purpose, opts) };
    case "selfHostedPool":
      return { case: "selfHostedPool", value: fromRedactedSelfHostedPoolTarget(oneof.value, purpose, opts) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function toRedactedSameMachineTarget(msg, privacyMode) {
  return {
    _privacyMode: privacyMode
  };
}
function fromRedactedSameMachineTarget(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new SameMachineTarget({});
}
function toRedactedNewCloudVmTarget(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    environmentBuildId: msg.environmentBuildId,
    baseBranch: msg.baseBranch
  };
}
function fromRedactedNewCloudVmTarget(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new NewCloudVmTarget({
    environmentBuildId: msg.environmentBuildId,
    baseBranch: msg.baseBranch
  });
}
function toRedactedSelfHostedWorkerTarget(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    workerId: msg.workerId
  };
}
function fromRedactedSelfHostedWorkerTarget(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new SelfHostedWorkerTarget({
    workerId: msg.workerId
  });
}
function toRedactedSelfHostedPoolTarget(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    pool: msg.pool,
    labels: msg.labels.map((v2) => toRedactedSelfHostedWorkerLabel(v2, privacyMode))
  };
}
function fromRedactedSelfHostedPoolTarget(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new SelfHostedPoolTarget({
    pool: msg.pool,
    labels: msg.labels.map((v2) => fromRedactedSelfHostedWorkerLabel(v2, purpose, opts))
  });
}
function toRedactedSelfHostedWorkerLabel(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    key: msg.key,
    value: msg.value
  };
}
function fromRedactedSelfHostedWorkerLabel(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new SelfHostedWorkerLabel({
    key: msg.key,
    value: msg.value
  });
}
function toRedactedTaskSuccess(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    conversationSteps: msg.conversationSteps.map((v2) => toRedactedConversationStep(v2, privacyMode)),
    agentId: msg.agentId,
    isBackground: msg.isBackground,
    durationMs: msg.durationMs,
    resultSuffix: msg.resultSuffix !== void 0 ? createRedactedString(msg.resultSuffix, DataClassification.CODE, "result_suffix", privacyMode) : void 0,
    backgroundReason: msg.backgroundReason,
    transcriptPath: msg.transcriptPath !== void 0 ? createRedactedString(msg.transcriptPath, DataClassification.PATH, "transcript_path", privacyMode) : void 0
  };
}
function fromRedactedTaskSuccess(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new TaskSuccess({
    conversationSteps: msg.conversationSteps.map((v2) => fromRedactedConversationStep(v2, purpose, opts)),
    agentId: msg.agentId,
    isBackground: msg.isBackground,
    durationMs: msg.durationMs,
    resultSuffix: msg.resultSuffix?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    backgroundReason: msg.backgroundReason,
    transcriptPath: msg.transcriptPath?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedTaskError(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    error: createRedactedString(msg.error, DataClassification.CODE, "error", privacyMode)
  };
}
function fromRedactedTaskError(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new TaskError({
    error: msg.error.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedTaskResult(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    result: toRedactedTaskResult_result(msg.result, privacyMode)
  };
}
function toRedactedTaskResult_result(oneof, privacyMode) {
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "success":
      return { case: "success", value: toRedactedTaskSuccess(oneof.value, privacyMode) };
    case "error":
      return { case: "error", value: toRedactedTaskError(oneof.value, privacyMode) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function fromRedactedTaskResult(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new TaskResult({
    result: fromRedactedTaskResult_result(msg.result, purpose, opts)
  });
}
function fromRedactedTaskResult_result(oneof, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "success":
      return { case: "success", value: fromRedactedTaskSuccess(oneof.value, purpose, opts) };
    case "error":
      return { case: "error", value: fromRedactedTaskError(oneof.value, purpose, opts) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function toRedactedTaskToolCall(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    args: msg.args !== void 0 ? toRedactedTaskArgs(msg.args, privacyMode) : void 0,
    result: msg.result !== void 0 ? toRedactedTaskResult(msg.result, privacyMode) : void 0,
    cloudAgentBcId: msg.cloudAgentBcId
  };
}
function fromRedactedTaskToolCall(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new TaskToolCall({
    args: msg.args !== void 0 ? fromRedactedTaskArgs(msg.args, purpose, opts) : void 0,
    result: msg.result !== void 0 ? fromRedactedTaskResult(msg.result, purpose, opts) : void 0,
    cloudAgentBcId: msg.cloudAgentBcId
  });
}
function toRedactedTaskToolCallDelta(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    interactionUpdate: msg.interactionUpdate !== void 0 ? toRedactedInteractionUpdate(msg.interactionUpdate, privacyMode) : void 0
  };
}
function fromRedactedTaskToolCallDelta(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new TaskToolCallDelta({
    interactionUpdate: msg.interactionUpdate !== void 0 ? fromRedactedInteractionUpdate(msg.interactionUpdate, purpose, opts) : void 0
  });
}
function toRedactedSetActiveBranchArgs(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    path: createRedactedString(msg.path, DataClassification.PATH, "path", privacyMode),
    branchName: msg.branchName
  };
}
function fromRedactedSetActiveBranchArgs(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new SetActiveBranchArgs({
    path: msg.path.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    branchName: msg.branchName
  });
}
function toRedactedSetActiveBranchSuccess(msg, privacyMode) {
  return {
    _privacyMode: privacyMode
  };
}
function fromRedactedSetActiveBranchSuccess(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new SetActiveBranchSuccess({});
}
function toRedactedSetActiveBranchError(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    error: createRedactedString(msg.error, DataClassification.CODE, "error", privacyMode)
  };
}
function fromRedactedSetActiveBranchError(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new SetActiveBranchError({
    error: msg.error.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedSetActiveBranchResult(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    result: toRedactedSetActiveBranchResult_result(msg.result, privacyMode)
  };
}
function toRedactedSetActiveBranchResult_result(oneof, privacyMode) {
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "success":
      return { case: "success", value: toRedactedSetActiveBranchSuccess(oneof.value, privacyMode) };
    case "error":
      return { case: "error", value: toRedactedSetActiveBranchError(oneof.value, privacyMode) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function fromRedactedSetActiveBranchResult(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new SetActiveBranchResult({
    result: fromRedactedSetActiveBranchResult_result(msg.result, purpose, opts)
  });
}
function fromRedactedSetActiveBranchResult_result(oneof, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "success":
      return { case: "success", value: fromRedactedSetActiveBranchSuccess(oneof.value, purpose, opts) };
    case "error":
      return { case: "error", value: fromRedactedSetActiveBranchError(oneof.value, purpose, opts) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function toRedactedSetActiveBranchToolCall(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    args: msg.args !== void 0 ? toRedactedSetActiveBranchArgs(msg.args, privacyMode) : void 0,
    result: msg.result !== void 0 ? toRedactedSetActiveBranchResult(msg.result, privacyMode) : void 0
  };
}
function fromRedactedSetActiveBranchToolCall(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new SetActiveBranchToolCall({
    args: msg.args !== void 0 ? fromRedactedSetActiveBranchArgs(msg.args, purpose, opts) : void 0,
    result: msg.result !== void 0 ? fromRedactedSetActiveBranchResult(msg.result, purpose, opts) : void 0
  });
}
function toRedactedToolCall(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    hookAdditionalContexts: msg.hookAdditionalContexts.map((v2) => toRedactedHookAdditionalContext(v2, privacyMode)),
    toolCallId: msg.toolCallId,
    startedAtMs: msg.startedAtMs,
    completedAtMs: msg.completedAtMs,
    tool: toRedactedToolCall_tool(msg.tool, privacyMode)
  };
}
function toRedactedToolCall_tool(oneof, privacyMode) {
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "shellToolCall":
      return { case: "shellToolCall", value: toRedactedShellToolCall(oneof.value, privacyMode) };
    case "deleteToolCall":
      return { case: "deleteToolCall", value: toRedactedDeleteToolCall(oneof.value, privacyMode) };
    case "globToolCall":
      return { case: "globToolCall", value: toRedactedGlobToolCall(oneof.value, privacyMode) };
    case "grepToolCall":
      return { case: "grepToolCall", value: toRedactedGrepToolCall(oneof.value, privacyMode) };
    case "readToolCall":
      return { case: "readToolCall", value: toRedactedReadToolCall(oneof.value, privacyMode) };
    case "updateTodosToolCall":
      return { case: "updateTodosToolCall", value: toRedactedUpdateTodosToolCall(oneof.value, privacyMode) };
    case "readTodosToolCall":
      return { case: "readTodosToolCall", value: toRedactedReadTodosToolCall(oneof.value, privacyMode) };
    case "editToolCall":
      return { case: "editToolCall", value: toRedactedEditToolCall(oneof.value, privacyMode) };
    case "lsToolCall":
      return { case: "lsToolCall", value: toRedactedLsToolCall(oneof.value, privacyMode) };
    case "readLintsToolCall":
      return { case: "readLintsToolCall", value: toRedactedReadLintsToolCall(oneof.value, privacyMode) };
    case "mcpToolCall":
      return { case: "mcpToolCall", value: toRedactedMcpToolCall(oneof.value, privacyMode) };
    case "semSearchToolCall":
      return { case: "semSearchToolCall", value: toRedactedSemSearchToolCall(oneof.value, privacyMode) };
    case "createPlanToolCall":
      return { case: "createPlanToolCall", value: toRedactedCreatePlanToolCall(oneof.value, privacyMode) };
    case "webSearchToolCall":
      return { case: "webSearchToolCall", value: toRedactedWebSearchToolCall(oneof.value, privacyMode) };
    case "taskToolCall":
      return { case: "taskToolCall", value: toRedactedTaskToolCall(oneof.value, privacyMode) };
    case "listMcpResourcesToolCall":
      return { case: "listMcpResourcesToolCall", value: toRedactedListMcpResourcesToolCall(oneof.value, privacyMode) };
    case "readMcpResourceToolCall":
      return { case: "readMcpResourceToolCall", value: toRedactedReadMcpResourceToolCall(oneof.value, privacyMode) };
    case "applyAgentDiffToolCall":
      return { case: "applyAgentDiffToolCall", value: toRedactedApplyAgentDiffToolCall(oneof.value, privacyMode) };
    case "askQuestionToolCall":
      return { case: "askQuestionToolCall", value: toRedactedAskQuestionToolCall(oneof.value, privacyMode) };
    case "fetchToolCall":
      return { case: "fetchToolCall", value: toRedactedFetchToolCall(oneof.value, privacyMode) };
    case "switchModeToolCall":
      return { case: "switchModeToolCall", value: toRedactedSwitchModeToolCall(oneof.value, privacyMode) };
    case "generateImageToolCall":
      return { case: "generateImageToolCall", value: toRedactedGenerateImageToolCall(oneof.value, privacyMode) };
    case "recordScreenToolCall":
      return { case: "recordScreenToolCall", value: toRedactedRecordScreenToolCall(oneof.value, privacyMode) };
    case "computerUseToolCall":
      return { case: "computerUseToolCall", value: toRedactedComputerUseToolCall(oneof.value, privacyMode) };
    case "writeShellStdinToolCall":
      return { case: "writeShellStdinToolCall", value: toRedactedWriteShellStdinToolCall(oneof.value, privacyMode) };
    case "reflectToolCall":
      return { case: "reflectToolCall", value: toRedactedReflectToolCall(oneof.value, privacyMode) };
    case "setupVmEnvironmentToolCall":
      return { case: "setupVmEnvironmentToolCall", value: toRedactedSetupVmEnvironmentToolCall(oneof.value, privacyMode) };
    case "truncatedToolCall":
      return { case: "truncatedToolCall", value: toRedactedTruncatedToolCall(oneof.value, privacyMode) };
    case "startGrindExecutionToolCall":
      return { case: "startGrindExecutionToolCall", value: toRedactedStartGrindExecutionToolCall(oneof.value, privacyMode) };
    case "startGrindPlanningToolCall":
      return { case: "startGrindPlanningToolCall", value: toRedactedStartGrindPlanningToolCall(oneof.value, privacyMode) };
    case "webFetchToolCall":
      return { case: "webFetchToolCall", value: toRedactedWebFetchToolCall(oneof.value, privacyMode) };
    case "reportBugfixResultsToolCall":
      return { case: "reportBugfixResultsToolCall", value: toRedactedReportBugfixResultsToolCall(oneof.value, privacyMode) };
    case "aiAttributionToolCall":
      return { case: "aiAttributionToolCall", value: toRedactedAiAttributionToolCall(oneof.value, privacyMode) };
    case "prManagementToolCall":
      return { case: "prManagementToolCall", value: toRedactedPrManagementToolCall(oneof.value, privacyMode) };
    case "mcpAuthToolCall":
      return { case: "mcpAuthToolCall", value: toRedactedMcpAuthToolCall(oneof.value, privacyMode) };
    case "awaitToolCall":
      return { case: "awaitToolCall", value: toRedactedAwaitToolCall(oneof.value, privacyMode) };
    case "blameByFilePathToolCall":
      return { case: "blameByFilePathToolCall", value: toRedactedBlameByFilePathToolCall(oneof.value, privacyMode) };
    case "getMcpToolsToolCall":
      return { case: "getMcpToolsToolCall", value: toRedactedGetMcpToolsToolCall(oneof.value, privacyMode) };
    case "reportBugToolCall":
      return { case: "reportBugToolCall", value: toRedactedReportBugToolCall(oneof.value, privacyMode) };
    case "setActiveBranchToolCall":
      return { case: "setActiveBranchToolCall", value: toRedactedSetActiveBranchToolCall(oneof.value, privacyMode) };
    case "communicateUpdateToolCall":
      return { case: "communicateUpdateToolCall", value: toRedactedCommunicateUpdateToolCall(oneof.value, privacyMode) };
    case "sendFinalSummaryToolCall":
      return { case: "sendFinalSummaryToolCall", value: toRedactedSendFinalSummaryToolCall(oneof.value, privacyMode) };
    case "updatePrCodeTourToolCall":
      return { case: "updatePrCodeTourToolCall", value: toRedactedUpdatePrCodeTourToolCall(oneof.value, privacyMode) };
    case "replaceEnvToolCall":
      return { case: "replaceEnvToolCall", value: toRedactedReplaceEnvToolCall(oneof.value, privacyMode) };
    case "editPrLabelsToolCall":
      return { case: "editPrLabelsToolCall", value: toRedactedEditPrLabelsToolCall(oneof.value, privacyMode) };
    case "recordCiInvestigationFindingsToolCall":
      return { case: "recordCiInvestigationFindingsToolCall", value: toRedactedRecordCiInvestigationFindingsToolCall(oneof.value, privacyMode) };
    case "sendMessageToolCall":
      return { case: "sendMessageToolCall", value: toRedactedSendMessageToolCall(oneof.value, privacyMode) };
    case "fetchCloudAgentDataToolCall":
      return { case: "fetchCloudAgentDataToolCall", value: toRedactedFetchCloudAgentDataToolCall(oneof.value, privacyMode) };
    case "sendToUserToolCall":
      return { case: "sendToUserToolCall", value: toRedactedSendToUserToolCall(oneof.value, privacyMode) };
    case "piReadToolCall":
      return { case: "piReadToolCall", value: toRedactedPiReadToolCall(oneof.value, privacyMode) };
    case "piBashToolCall":
      return { case: "piBashToolCall", value: toRedactedPiBashToolCall(oneof.value, privacyMode) };
    case "piEditToolCall":
      return { case: "piEditToolCall", value: toRedactedPiEditToolCall(oneof.value, privacyMode) };
    case "piWriteToolCall":
      return { case: "piWriteToolCall", value: toRedactedPiWriteToolCall(oneof.value, privacyMode) };
    case "piGrepToolCall":
      return { case: "piGrepToolCall", value: toRedactedPiGrepToolCall(oneof.value, privacyMode) };
    case "piFindToolCall":
      return { case: "piFindToolCall", value: toRedactedPiFindToolCall(oneof.value, privacyMode) };
    case "piLsToolCall":
      return { case: "piLsToolCall", value: toRedactedPiLsToolCall(oneof.value, privacyMode) };
    case "connectScmToolCall":
      return { case: "connectScmToolCall", value: toRedactedConnectScmToolCall(oneof.value, privacyMode) };
    case "searchConversationsToolCall":
      return { case: "searchConversationsToolCall", value: toRedactedSearchConversationsToolCall(oneof.value, privacyMode) };
    case "createGoalToolCall":
      return { case: "createGoalToolCall", value: toRedactedCreateGoalToolCall(oneof.value, privacyMode) };
    case "updateGoalToolCall":
      return { case: "updateGoalToolCall", value: toRedactedUpdateGoalToolCall(oneof.value, privacyMode) };
    case "adoptToolCall":
      return { case: "adoptToolCall", value: toRedactedAdoptToolCall(oneof.value, privacyMode) };
    case "getAgentStatusToolCall":
      return { case: "getAgentStatusToolCall", value: toRedactedGetAgentStatusToolCall(oneof.value, privacyMode) };
    case "sendToAgentToolCall":
      return { case: "sendToAgentToolCall", value: toRedactedSendToAgentToolCall(oneof.value, privacyMode) };
    case "readAgentTranscriptToolCall":
      return { case: "readAgentTranscriptToolCall", value: toRedactedReadAgentTranscriptToolCall(oneof.value, privacyMode) };
    case "createAgentToolCall":
      return { case: "createAgentToolCall", value: toRedactedCreateAgentToolCall(oneof.value, privacyMode) };
    case "stopAgentToolCall":
      return { case: "stopAgentToolCall", value: toRedactedStopAgentToolCall(oneof.value, privacyMode) };
    case "getPrCodeTourToolCall":
      return { case: "getPrCodeTourToolCall", value: toRedactedGetPrCodeTourToolCall(oneof.value, privacyMode) };
    case "writeCanvasToolCall":
      return { case: "writeCanvasToolCall", value: toRedactedWriteCanvasToolCall(oneof.value, privacyMode) };
    case "readCanvasToolCall":
      return { case: "readCanvasToolCall", value: toRedactedReadCanvasToolCall(oneof.value, privacyMode) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function fromRedactedToolCall(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ToolCall({
    hookAdditionalContexts: msg.hookAdditionalContexts.map((v2) => fromRedactedHookAdditionalContext(v2, purpose, opts)),
    toolCallId: msg.toolCallId,
    startedAtMs: msg.startedAtMs,
    completedAtMs: msg.completedAtMs,
    tool: fromRedactedToolCall_tool(msg.tool, purpose, opts)
  });
}
function fromRedactedToolCall_tool(oneof, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "shellToolCall":
      return { case: "shellToolCall", value: fromRedactedShellToolCall(oneof.value, purpose, opts) };
    case "deleteToolCall":
      return { case: "deleteToolCall", value: fromRedactedDeleteToolCall(oneof.value, purpose, opts) };
    case "globToolCall":
      return { case: "globToolCall", value: fromRedactedGlobToolCall(oneof.value, purpose, opts) };
    case "grepToolCall":
      return { case: "grepToolCall", value: fromRedactedGrepToolCall(oneof.value, purpose, opts) };
    case "readToolCall":
      return { case: "readToolCall", value: fromRedactedReadToolCall(oneof.value, purpose, opts) };
    case "updateTodosToolCall":
      return { case: "updateTodosToolCall", value: fromRedactedUpdateTodosToolCall(oneof.value, purpose, opts) };
    case "readTodosToolCall":
      return { case: "readTodosToolCall", value: fromRedactedReadTodosToolCall(oneof.value, purpose, opts) };
    case "editToolCall":
      return { case: "editToolCall", value: fromRedactedEditToolCall(oneof.value, purpose, opts) };
    case "lsToolCall":
      return { case: "lsToolCall", value: fromRedactedLsToolCall(oneof.value, purpose, opts) };
    case "readLintsToolCall":
      return { case: "readLintsToolCall", value: fromRedactedReadLintsToolCall(oneof.value, purpose, opts) };
    case "mcpToolCall":
      return { case: "mcpToolCall", value: fromRedactedMcpToolCall(oneof.value, purpose, opts) };
    case "semSearchToolCall":
      return { case: "semSearchToolCall", value: fromRedactedSemSearchToolCall(oneof.value, purpose, opts) };
    case "createPlanToolCall":
      return { case: "createPlanToolCall", value: fromRedactedCreatePlanToolCall(oneof.value, purpose, opts) };
    case "webSearchToolCall":
      return { case: "webSearchToolCall", value: fromRedactedWebSearchToolCall(oneof.value, purpose, opts) };
    case "taskToolCall":
      return { case: "taskToolCall", value: fromRedactedTaskToolCall(oneof.value, purpose, opts) };
    case "listMcpResourcesToolCall":
      return { case: "listMcpResourcesToolCall", value: fromRedactedListMcpResourcesToolCall(oneof.value, purpose, opts) };
    case "readMcpResourceToolCall":
      return { case: "readMcpResourceToolCall", value: fromRedactedReadMcpResourceToolCall(oneof.value, purpose, opts) };
    case "applyAgentDiffToolCall":
      return { case: "applyAgentDiffToolCall", value: fromRedactedApplyAgentDiffToolCall(oneof.value, purpose, opts) };
    case "askQuestionToolCall":
      return { case: "askQuestionToolCall", value: fromRedactedAskQuestionToolCall(oneof.value, purpose, opts) };
    case "fetchToolCall":
      return { case: "fetchToolCall", value: fromRedactedFetchToolCall(oneof.value, purpose, opts) };
    case "switchModeToolCall":
      return { case: "switchModeToolCall", value: fromRedactedSwitchModeToolCall(oneof.value, purpose, opts) };
    case "generateImageToolCall":
      return { case: "generateImageToolCall", value: fromRedactedGenerateImageToolCall(oneof.value, purpose, opts) };
    case "recordScreenToolCall":
      return { case: "recordScreenToolCall", value: fromRedactedRecordScreenToolCall(oneof.value, purpose, opts) };
    case "computerUseToolCall":
      return { case: "computerUseToolCall", value: fromRedactedComputerUseToolCall(oneof.value, purpose, opts) };
    case "writeShellStdinToolCall":
      return { case: "writeShellStdinToolCall", value: fromRedactedWriteShellStdinToolCall(oneof.value, purpose, opts) };
    case "reflectToolCall":
      return { case: "reflectToolCall", value: fromRedactedReflectToolCall(oneof.value, purpose, opts) };
    case "setupVmEnvironmentToolCall":
      return { case: "setupVmEnvironmentToolCall", value: fromRedactedSetupVmEnvironmentToolCall(oneof.value, purpose, opts) };
    case "truncatedToolCall":
      return { case: "truncatedToolCall", value: fromRedactedTruncatedToolCall(oneof.value, purpose, opts) };
    case "startGrindExecutionToolCall":
      return { case: "startGrindExecutionToolCall", value: fromRedactedStartGrindExecutionToolCall(oneof.value, purpose, opts) };
    case "startGrindPlanningToolCall":
      return { case: "startGrindPlanningToolCall", value: fromRedactedStartGrindPlanningToolCall(oneof.value, purpose, opts) };
    case "webFetchToolCall":
      return { case: "webFetchToolCall", value: fromRedactedWebFetchToolCall(oneof.value, purpose, opts) };
    case "reportBugfixResultsToolCall":
      return { case: "reportBugfixResultsToolCall", value: fromRedactedReportBugfixResultsToolCall(oneof.value, purpose, opts) };
    case "aiAttributionToolCall":
      return { case: "aiAttributionToolCall", value: fromRedactedAiAttributionToolCall(oneof.value, purpose, opts) };
    case "prManagementToolCall":
      return { case: "prManagementToolCall", value: fromRedactedPrManagementToolCall(oneof.value, purpose, opts) };
    case "mcpAuthToolCall":
      return { case: "mcpAuthToolCall", value: fromRedactedMcpAuthToolCall(oneof.value, purpose, opts) };
    case "awaitToolCall":
      return { case: "awaitToolCall", value: fromRedactedAwaitToolCall(oneof.value, purpose, opts) };
    case "blameByFilePathToolCall":
      return { case: "blameByFilePathToolCall", value: fromRedactedBlameByFilePathToolCall(oneof.value, purpose, opts) };
    case "getMcpToolsToolCall":
      return { case: "getMcpToolsToolCall", value: fromRedactedGetMcpToolsToolCall(oneof.value, purpose, opts) };
    case "reportBugToolCall":
      return { case: "reportBugToolCall", value: fromRedactedReportBugToolCall(oneof.value, purpose, opts) };
    case "setActiveBranchToolCall":
      return { case: "setActiveBranchToolCall", value: fromRedactedSetActiveBranchToolCall(oneof.value, purpose, opts) };
    case "communicateUpdateToolCall":
      return { case: "communicateUpdateToolCall", value: fromRedactedCommunicateUpdateToolCall(oneof.value, purpose, opts) };
    case "sendFinalSummaryToolCall":
      return { case: "sendFinalSummaryToolCall", value: fromRedactedSendFinalSummaryToolCall(oneof.value, purpose, opts) };
    case "updatePrCodeTourToolCall":
      return { case: "updatePrCodeTourToolCall", value: fromRedactedUpdatePrCodeTourToolCall(oneof.value, purpose, opts) };
    case "replaceEnvToolCall":
      return { case: "replaceEnvToolCall", value: fromRedactedReplaceEnvToolCall(oneof.value, purpose, opts) };
    case "editPrLabelsToolCall":
      return { case: "editPrLabelsToolCall", value: fromRedactedEditPrLabelsToolCall(oneof.value, purpose, opts) };
    case "recordCiInvestigationFindingsToolCall":
      return { case: "recordCiInvestigationFindingsToolCall", value: fromRedactedRecordCiInvestigationFindingsToolCall(oneof.value, purpose, opts) };
    case "sendMessageToolCall":
      return { case: "sendMessageToolCall", value: fromRedactedSendMessageToolCall(oneof.value, purpose, opts) };
    case "fetchCloudAgentDataToolCall":
      return { case: "fetchCloudAgentDataToolCall", value: fromRedactedFetchCloudAgentDataToolCall(oneof.value, purpose, opts) };
    case "sendToUserToolCall":
      return { case: "sendToUserToolCall", value: fromRedactedSendToUserToolCall(oneof.value, purpose, opts) };
    case "piReadToolCall":
      return { case: "piReadToolCall", value: fromRedactedPiReadToolCall(oneof.value, purpose, opts) };
    case "piBashToolCall":
      return { case: "piBashToolCall", value: fromRedactedPiBashToolCall(oneof.value, purpose, opts) };
    case "piEditToolCall":
      return { case: "piEditToolCall", value: fromRedactedPiEditToolCall(oneof.value, purpose, opts) };
    case "piWriteToolCall":
      return { case: "piWriteToolCall", value: fromRedactedPiWriteToolCall(oneof.value, purpose, opts) };
    case "piGrepToolCall":
      return { case: "piGrepToolCall", value: fromRedactedPiGrepToolCall(oneof.value, purpose, opts) };
    case "piFindToolCall":
      return { case: "piFindToolCall", value: fromRedactedPiFindToolCall(oneof.value, purpose, opts) };
    case "piLsToolCall":
      return { case: "piLsToolCall", value: fromRedactedPiLsToolCall(oneof.value, purpose, opts) };
    case "connectScmToolCall":
      return { case: "connectScmToolCall", value: fromRedactedConnectScmToolCall(oneof.value, purpose, opts) };
    case "searchConversationsToolCall":
      return { case: "searchConversationsToolCall", value: fromRedactedSearchConversationsToolCall(oneof.value, purpose, opts) };
    case "createGoalToolCall":
      return { case: "createGoalToolCall", value: fromRedactedCreateGoalToolCall(oneof.value, purpose, opts) };
    case "updateGoalToolCall":
      return { case: "updateGoalToolCall", value: fromRedactedUpdateGoalToolCall(oneof.value, purpose, opts) };
    case "adoptToolCall":
      return { case: "adoptToolCall", value: fromRedactedAdoptToolCall(oneof.value, purpose, opts) };
    case "getAgentStatusToolCall":
      return { case: "getAgentStatusToolCall", value: fromRedactedGetAgentStatusToolCall(oneof.value, purpose, opts) };
    case "sendToAgentToolCall":
      return { case: "sendToAgentToolCall", value: fromRedactedSendToAgentToolCall(oneof.value, purpose, opts) };
    case "readAgentTranscriptToolCall":
      return { case: "readAgentTranscriptToolCall", value: fromRedactedReadAgentTranscriptToolCall(oneof.value, purpose, opts) };
    case "createAgentToolCall":
      return { case: "createAgentToolCall", value: fromRedactedCreateAgentToolCall(oneof.value, purpose, opts) };
    case "stopAgentToolCall":
      return { case: "stopAgentToolCall", value: fromRedactedStopAgentToolCall(oneof.value, purpose, opts) };
    case "getPrCodeTourToolCall":
      return { case: "getPrCodeTourToolCall", value: fromRedactedGetPrCodeTourToolCall(oneof.value, purpose, opts) };
    case "writeCanvasToolCall":
      return { case: "writeCanvasToolCall", value: fromRedactedWriteCanvasToolCall(oneof.value, purpose, opts) };
    case "readCanvasToolCall":
      return { case: "readCanvasToolCall", value: fromRedactedReadCanvasToolCall(oneof.value, purpose, opts) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function createRedactedToolCall(privacyMode, partial2) {
  return {
    hookAdditionalContexts: [],
    toolCallId: void 0,
    startedAtMs: void 0,
    completedAtMs: void 0,
    tool: { case: void 0, value: void 0 },
    ...partial2,
    _privacyMode: privacyMode
  };
}
function toRedactedTruncatedToolCallArgs(msg, privacyMode) {
  return {
    _privacyMode: privacyMode
  };
}
function fromRedactedTruncatedToolCallArgs(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new TruncatedToolCallArgs({});
}
function toRedactedTruncatedToolCallSuccess(msg, privacyMode) {
  return {
    _privacyMode: privacyMode
  };
}
function fromRedactedTruncatedToolCallSuccess(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new TruncatedToolCallSuccess({});
}
function toRedactedTruncatedToolCallError(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    error: createRedactedString(msg.error, DataClassification.CODE, "error", privacyMode)
  };
}
function fromRedactedTruncatedToolCallError(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new TruncatedToolCallError({
    error: msg.error.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedTruncatedToolCallResult(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    result: toRedactedTruncatedToolCallResult_result(msg.result, privacyMode)
  };
}
function toRedactedTruncatedToolCallResult_result(oneof, privacyMode) {
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "success":
      return { case: "success", value: toRedactedTruncatedToolCallSuccess(oneof.value, privacyMode) };
    case "error":
      return { case: "error", value: toRedactedTruncatedToolCallError(oneof.value, privacyMode) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function fromRedactedTruncatedToolCallResult(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new TruncatedToolCallResult({
    result: fromRedactedTruncatedToolCallResult_result(msg.result, purpose, opts)
  });
}
function fromRedactedTruncatedToolCallResult_result(oneof, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "success":
      return { case: "success", value: fromRedactedTruncatedToolCallSuccess(oneof.value, purpose, opts) };
    case "error":
      return { case: "error", value: fromRedactedTruncatedToolCallError(oneof.value, purpose, opts) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function toRedactedTruncatedToolCall(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    originalStepBlobId: msg.originalStepBlobId,
    args: msg.args !== void 0 ? toRedactedTruncatedToolCallArgs(msg.args, privacyMode) : void 0,
    result: msg.result !== void 0 ? toRedactedTruncatedToolCallResult(msg.result, privacyMode) : void 0
  };
}
function fromRedactedTruncatedToolCall(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new TruncatedToolCall({
    originalStepBlobId: msg.originalStepBlobId,
    args: msg.args !== void 0 ? fromRedactedTruncatedToolCallArgs(msg.args, purpose, opts) : void 0,
    result: msg.result !== void 0 ? fromRedactedTruncatedToolCallResult(msg.result, purpose, opts) : void 0
  });
}
function toRedactedToolCallDelta(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    delta: toRedactedToolCallDelta_delta(msg.delta, privacyMode)
  };
}
function toRedactedToolCallDelta_delta(oneof, privacyMode) {
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "shellToolCallDelta":
      return { case: "shellToolCallDelta", value: toRedactedShellToolCallDelta(oneof.value, privacyMode) };
    case "taskToolCallDelta":
      return { case: "taskToolCallDelta", value: toRedactedTaskToolCallDelta(oneof.value, privacyMode) };
    case "editToolCallDelta":
      return { case: "editToolCallDelta", value: toRedactedEditToolCallDelta(oneof.value, privacyMode) };
    case "replaceEnvToolCallDelta":
      return { case: "replaceEnvToolCallDelta", value: toRedactedReplaceEnvToolCallDelta(oneof.value, privacyMode) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function fromRedactedToolCallDelta(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ToolCallDelta({
    delta: fromRedactedToolCallDelta_delta(msg.delta, purpose, opts)
  });
}
function fromRedactedToolCallDelta_delta(oneof, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "shellToolCallDelta":
      return { case: "shellToolCallDelta", value: fromRedactedShellToolCallDelta(oneof.value, purpose, opts) };
    case "taskToolCallDelta":
      return { case: "taskToolCallDelta", value: fromRedactedTaskToolCallDelta(oneof.value, purpose, opts) };
    case "editToolCallDelta":
      return { case: "editToolCallDelta", value: fromRedactedEditToolCallDelta(oneof.value, purpose, opts) };
    case "replaceEnvToolCallDelta":
      return { case: "replaceEnvToolCallDelta", value: fromRedactedReplaceEnvToolCallDelta(oneof.value, purpose, opts) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function toRedactedConversationStep(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    message: toRedactedConversationStep_message(msg.message, privacyMode)
  };
}
function toRedactedConversationStep_message(oneof, privacyMode) {
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "assistantMessage":
      return { case: "assistantMessage", value: toRedactedAssistantMessage2(oneof.value, privacyMode) };
    case "toolCall":
      return { case: "toolCall", value: toRedactedToolCall(oneof.value, privacyMode) };
    case "thinkingMessage":
      return { case: "thinkingMessage", value: toRedactedThinkingMessage(oneof.value, privacyMode) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function fromRedactedConversationStep(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ConversationStep({
    message: fromRedactedConversationStep_message(msg.message, purpose, opts)
  });
}
function fromRedactedConversationStep_message(oneof, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "assistantMessage":
      return { case: "assistantMessage", value: fromRedactedAssistantMessage2(oneof.value, purpose, opts) };
    case "toolCall":
      return { case: "toolCall", value: fromRedactedToolCall(oneof.value, purpose, opts) };
    case "thinkingMessage":
      return { case: "thinkingMessage", value: fromRedactedThinkingMessage(oneof.value, purpose, opts) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function toRedactedConversationAction(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    triggeringAuthId: msg.triggeringAuthId,
    triggeringUserInfo: msg.triggeringUserInfo !== void 0 ? toRedactedTriggeringUserInfo(msg.triggeringUserInfo, privacyMode) : void 0,
    requestContextParts: msg.requestContextParts !== void 0 ? toRedactedRequestContextPartReferences(msg.requestContextParts, privacyMode) : void 0,
    action: toRedactedConversationAction_action(msg.action, privacyMode)
  };
}
function toRedactedConversationAction_action(oneof, privacyMode) {
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "userMessageAction":
      return { case: "userMessageAction", value: toRedactedUserMessageAction(oneof.value, privacyMode) };
    case "resumeAction":
      return { case: "resumeAction", value: toRedactedResumeAction(oneof.value, privacyMode) };
    case "cancelAction":
      return { case: "cancelAction", value: toRedactedCancelAction(oneof.value, privacyMode) };
    case "summarizeAction":
      return { case: "summarizeAction", value: toRedactedSummarizeAction(oneof.value, privacyMode) };
    case "shellCommandAction":
      return { case: "shellCommandAction", value: toRedactedShellCommandAction(oneof.value, privacyMode) };
    case "startPlanAction":
      return { case: "startPlanAction", value: toRedactedStartPlanAction(oneof.value, privacyMode) };
    case "executePlanAction":
      return { case: "executePlanAction", value: toRedactedExecutePlanAction(oneof.value, privacyMode) };
    case "asyncAskQuestionCompletionAction":
      return { case: "asyncAskQuestionCompletionAction", value: toRedactedAsyncAskQuestionCompletionAction(oneof.value, privacyMode) };
    case "cancelSubagentAction":
      return { case: "cancelSubagentAction", value: toRedactedCancelSubagentAction(oneof.value, privacyMode) };
    case "backgroundTaskCompletionAction":
      return { case: "backgroundTaskCompletionAction", value: toRedactedBackgroundTaskCompletionAction(oneof.value, privacyMode) };
    case "backgroundShellAction":
      return { case: "backgroundShellAction", value: toRedactedBackgroundShellAction(oneof.value, privacyMode) };
    case "backgroundSubagentAction":
      return { case: "backgroundSubagentAction", value: toRedactedBackgroundSubagentAction(oneof.value, privacyMode) };
    case "subscriptionNotificationAction":
      return { case: "subscriptionNotificationAction", value: toRedactedSubscriptionNotificationAction(oneof.value, privacyMode) };
    case "goalContinuationAction":
      return { case: "goalContinuationAction", value: toRedactedGoalContinuationAction(oneof.value, privacyMode) };
    case "injectContextAction":
      return { case: "injectContextAction", value: toRedactedInjectContextAction(oneof.value, privacyMode) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function toRedactedTriggeringUserInfo(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    authId: msg.authId,
    userId: msg.userId
  };
}
function fromRedactedTriggeringUserInfo(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new TriggeringUserInfo({
    authId: msg.authId,
    userId: msg.userId
  });
}
function toRedactedBackgroundTaskCompletionAction(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    completions: msg.completions.map((v2) => toRedactedBackgroundTaskCompletion(v2, privacyMode)),
    systemReminder: msg.systemReminder !== void 0 ? createRedactedString(msg.systemReminder, DataClassification.CODE, "system_reminder", privacyMode) : void 0
  };
}
function fromRedactedBackgroundTaskCompletionAction(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new BackgroundTaskCompletionAction({
    completions: msg.completions.map((v2) => fromRedactedBackgroundTaskCompletion(v2, purpose, opts)),
    systemReminder: msg.systemReminder?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedBackgroundTaskCompletion(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    taskId: msg.taskId,
    kind: msg.kind,
    status: msg.status,
    title: createRedactedString(msg.title, DataClassification.CODE, "title", privacyMode),
    detail: msg.detail !== void 0 ? createRedactedString(msg.detail, DataClassification.CODE, "detail", privacyMode) : void 0,
    outputPath: msg.outputPath !== void 0 ? createRedactedString(msg.outputPath, DataClassification.PATH, "output_path", privacyMode) : void 0,
    threadId: msg.threadId,
    reason: msg.reason,
    subagentId: msg.subagentId,
    toolCallId: msg.toolCallId,
    notificationContext: msg.notificationContext,
    completedAtMs: msg.completedAtMs,
    recordOnly: msg.recordOnly
  };
}
function fromRedactedBackgroundTaskCompletion(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new BackgroundTaskCompletion({
    taskId: msg.taskId,
    kind: msg.kind,
    status: msg.status,
    title: msg.title.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    detail: msg.detail?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    outputPath: msg.outputPath?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    threadId: msg.threadId,
    reason: msg.reason,
    subagentId: msg.subagentId,
    toolCallId: msg.toolCallId,
    notificationContext: msg.notificationContext,
    completedAtMs: msg.completedAtMs,
    recordOnly: msg.recordOnly
  });
}
function toRedactedSubagentRunState(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    parentToolCallId: msg.parentToolCallId,
    subagentId: msg.subagentId,
    environment: msg.environment,
    status: msg.status,
    title: msg.title !== void 0 ? createRedactedString(msg.title, DataClassification.CODE, "title", privacyMode) : void 0,
    detail: msg.detail !== void 0 ? createRedactedString(msg.detail, DataClassification.CODE, "detail", privacyMode) : void 0,
    transcriptPath: msg.transcriptPath !== void 0 ? createRedactedString(msg.transcriptPath, DataClassification.PATH, "transcript_path", privacyMode) : void 0,
    outputPath: msg.outputPath !== void 0 ? createRedactedString(msg.outputPath, DataClassification.PATH, "output_path", privacyMode) : void 0,
    completedTimestampMs: msg.completedTimestampMs,
    completionReason: msg.completionReason
  };
}
function fromRedactedSubagentRunState(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new SubagentRunState({
    parentToolCallId: msg.parentToolCallId,
    subagentId: msg.subagentId,
    environment: msg.environment,
    status: msg.status,
    title: msg.title?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    detail: msg.detail?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    transcriptPath: msg.transcriptPath?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    outputPath: msg.outputPath?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    completedTimestampMs: msg.completedTimestampMs,
    completionReason: msg.completionReason
  });
}
function toRedactedCancelSubagentAction(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    subagentId: msg.subagentId
  };
}
function toRedactedBackgroundShellAction(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    toolCallId: msg.toolCallId
  };
}
function toRedactedBackgroundSubagentAction(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    toolCallId: msg.toolCallId
  };
}
function toRedactedInterruptedPendingToolCallResolution(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    toolCallId: msg.toolCallId,
    resolution: toRedactedInterruptedPendingToolCallResolution_resolution(msg.resolution, privacyMode)
  };
}
function toRedactedInterruptedPendingToolCallResolution_resolution(oneof, privacyMode) {
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "shellResult":
      return { case: "shellResult", value: toRedactedShellResult(oneof.value, privacyMode) };
    case "taskResult":
      return { case: "taskResult", value: toRedactedTaskResult(oneof.value, privacyMode) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function fromRedactedInterruptedPendingToolCallResolution(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new InterruptedPendingToolCallResolution({
    toolCallId: msg.toolCallId,
    resolution: fromRedactedInterruptedPendingToolCallResolution_resolution(msg.resolution, purpose, opts)
  });
}
function fromRedactedInterruptedPendingToolCallResolution_resolution(oneof, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "shellResult":
      return { case: "shellResult", value: fromRedactedShellResult(oneof.value, purpose, opts) };
    case "taskResult":
      return { case: "taskResult", value: fromRedactedTaskResult(oneof.value, purpose, opts) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function toRedactedInterruptedPendingToolCallResolutions(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    resolutions: msg.resolutions.map((v2) => toRedactedInterruptedPendingToolCallResolution(v2, privacyMode))
  };
}
function toRedactedConversationHistory(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    messages: msg.messages.map((v2) => toRedactedConversationHistoryMessage(v2, privacyMode)),
    replaceUserInfo: msg.replaceUserInfo
  };
}
function fromRedactedConversationHistory(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ConversationHistory({
    messages: msg.messages.map((v2) => fromRedactedConversationHistoryMessage(v2, purpose, opts)),
    replaceUserInfo: msg.replaceUserInfo
  });
}
function toRedactedConversationHistoryMessage(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    message: toRedactedConversationHistoryMessage_message(msg.message, privacyMode)
  };
}
function toRedactedConversationHistoryMessage_message(oneof, privacyMode) {
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "user":
      return { case: "user", value: toRedactedConversationHistoryUserMessage(oneof.value, privacyMode) };
    case "assistant":
      return { case: "assistant", value: toRedactedConversationHistoryAssistantMessage(oneof.value, privacyMode) };
    case "tool":
      return { case: "tool", value: toRedactedConversationHistoryToolMessage(oneof.value, privacyMode) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function fromRedactedConversationHistoryMessage(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ConversationHistoryMessage({
    message: fromRedactedConversationHistoryMessage_message(msg.message, purpose, opts)
  });
}
function fromRedactedConversationHistoryMessage_message(oneof, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "user":
      return { case: "user", value: fromRedactedConversationHistoryUserMessage(oneof.value, purpose, opts) };
    case "assistant":
      return { case: "assistant", value: fromRedactedConversationHistoryAssistantMessage(oneof.value, purpose, opts) };
    case "tool":
      return { case: "tool", value: fromRedactedConversationHistoryToolMessage(oneof.value, purpose, opts) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function toRedactedConversationHistoryUserMessage(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    content: msg.content.map((v2) => toRedactedConversationHistoryUserContent(v2, privacyMode))
  };
}
function fromRedactedConversationHistoryUserMessage(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ConversationHistoryUserMessage({
    content: msg.content.map((v2) => fromRedactedConversationHistoryUserContent(v2, purpose, opts))
  });
}
function toRedactedConversationHistoryUserContent(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    content: toRedactedConversationHistoryUserContent_content(msg.content, privacyMode)
  };
}
function toRedactedConversationHistoryUserContent_content(oneof, privacyMode) {
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "text":
      return { case: "text", value: toRedactedConversationHistoryTextContent(oneof.value, privacyMode) };
    case "image":
      return { case: "image", value: toRedactedConversationHistoryImageContent(oneof.value, privacyMode) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function fromRedactedConversationHistoryUserContent(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ConversationHistoryUserContent({
    content: fromRedactedConversationHistoryUserContent_content(msg.content, purpose, opts)
  });
}
function fromRedactedConversationHistoryUserContent_content(oneof, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "text":
      return { case: "text", value: fromRedactedConversationHistoryTextContent(oneof.value, purpose, opts) };
    case "image":
      return { case: "image", value: fromRedactedConversationHistoryImageContent(oneof.value, purpose, opts) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function toRedactedConversationHistoryTextContent(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    text: createRedactedString(msg.text, DataClassification.CODE, "text", privacyMode)
  };
}
function fromRedactedConversationHistoryTextContent(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ConversationHistoryTextContent({
    text: msg.text.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedConversationHistoryImageContent(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    data: createRedactedString(msg.data, DataClassification.CODE, "data", privacyMode),
    mimeType: msg.mimeType
  };
}
function fromRedactedConversationHistoryImageContent(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ConversationHistoryImageContent({
    data: msg.data.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    mimeType: msg.mimeType
  });
}
function toRedactedConversationHistoryAssistantMessage(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    content: msg.content.map((v2) => toRedactedConversationHistoryAssistantContent(v2, privacyMode))
  };
}
function fromRedactedConversationHistoryAssistantMessage(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ConversationHistoryAssistantMessage({
    content: msg.content.map((v2) => fromRedactedConversationHistoryAssistantContent(v2, purpose, opts))
  });
}
function toRedactedConversationHistoryAssistantContent(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    content: toRedactedConversationHistoryAssistantContent_content(msg.content, privacyMode)
  };
}
function toRedactedConversationHistoryAssistantContent_content(oneof, privacyMode) {
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "text":
      return { case: "text", value: toRedactedConversationHistoryTextContent(oneof.value, privacyMode) };
    case "reasoning":
      return { case: "reasoning", value: toRedactedConversationHistoryReasoningContent(oneof.value, privacyMode) };
    case "redactedReasoning":
      return { case: "redactedReasoning", value: toRedactedConversationHistoryRedactedReasoningContent(oneof.value, privacyMode) };
    case "toolCall":
      return { case: "toolCall", value: toRedactedConversationHistoryToolCall(oneof.value, privacyMode) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function fromRedactedConversationHistoryAssistantContent(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ConversationHistoryAssistantContent({
    content: fromRedactedConversationHistoryAssistantContent_content(msg.content, purpose, opts)
  });
}
function fromRedactedConversationHistoryAssistantContent_content(oneof, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "text":
      return { case: "text", value: fromRedactedConversationHistoryTextContent(oneof.value, purpose, opts) };
    case "reasoning":
      return { case: "reasoning", value: fromRedactedConversationHistoryReasoningContent(oneof.value, purpose, opts) };
    case "redactedReasoning":
      return { case: "redactedReasoning", value: fromRedactedConversationHistoryRedactedReasoningContent(oneof.value, purpose, opts) };
    case "toolCall":
      return { case: "toolCall", value: fromRedactedConversationHistoryToolCall(oneof.value, purpose, opts) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function toRedactedConversationHistoryReasoningContent(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    text: createRedactedString(msg.text, DataClassification.CODE, "text", privacyMode),
    signature: msg.signature !== void 0 ? createRedactedString(msg.signature, DataClassification.CODE, "signature", privacyMode) : void 0
  };
}
function fromRedactedConversationHistoryReasoningContent(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ConversationHistoryReasoningContent({
    text: msg.text.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    signature: msg.signature?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedConversationHistoryRedactedReasoningContent(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    data: createRedactedString(msg.data, DataClassification.CODE, "data", privacyMode)
  };
}
function fromRedactedConversationHistoryRedactedReasoningContent(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ConversationHistoryRedactedReasoningContent({
    data: msg.data.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedConversationHistoryToolCall(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    toolCallId: msg.toolCallId,
    toolName: msg.toolName,
    argsJson: createRedactedString(msg.argsJson, DataClassification.CODE, "args_json", privacyMode)
  };
}
function fromRedactedConversationHistoryToolCall(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ConversationHistoryToolCall({
    toolCallId: msg.toolCallId,
    toolName: msg.toolName,
    argsJson: msg.argsJson.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedConversationHistoryToolMessage(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    toolCallId: msg.toolCallId,
    toolName: msg.toolName,
    content: msg.content.map((v2) => toRedactedConversationHistoryToolResultContent(v2, privacyMode)),
    isError: msg.isError,
    hookAdditionalContexts: msg.hookAdditionalContexts.map((v2) => toRedactedHookAdditionalContext(v2, privacyMode))
  };
}
function fromRedactedConversationHistoryToolMessage(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ConversationHistoryToolMessage({
    toolCallId: msg.toolCallId,
    toolName: msg.toolName,
    content: msg.content.map((v2) => fromRedactedConversationHistoryToolResultContent(v2, purpose, opts)),
    isError: msg.isError,
    hookAdditionalContexts: msg.hookAdditionalContexts.map((v2) => fromRedactedHookAdditionalContext(v2, purpose, opts))
  });
}
function toRedactedConversationHistoryToolResultContent(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    content: toRedactedConversationHistoryToolResultContent_content(msg.content, privacyMode)
  };
}
function toRedactedConversationHistoryToolResultContent_content(oneof, privacyMode) {
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "text":
      return { case: "text", value: toRedactedConversationHistoryTextContent(oneof.value, privacyMode) };
    case "image":
      return { case: "image", value: toRedactedConversationHistoryImageContent(oneof.value, privacyMode) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function fromRedactedConversationHistoryToolResultContent(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ConversationHistoryToolResultContent({
    content: fromRedactedConversationHistoryToolResultContent_content(msg.content, purpose, opts)
  });
}
function fromRedactedConversationHistoryToolResultContent_content(oneof, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "text":
      return { case: "text", value: fromRedactedConversationHistoryTextContent(oneof.value, purpose, opts) };
    case "image":
      return { case: "image", value: fromRedactedConversationHistoryImageContent(oneof.value, purpose, opts) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function toRedactedUserMessageAction(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    userMessage: msg.userMessage !== void 0 ? toRedactedUserMessage2(msg.userMessage, privacyMode) : void 0,
    requestContext: msg.requestContext !== void 0 ? toRedactedRequestContext(msg.requestContext, privacyMode) : void 0,
    sendToInteractionListener: msg.sendToInteractionListener,
    prependUserMessages: msg.prependUserMessages.map((v2) => toRedactedUserMessage2(v2, privacyMode)),
    interruptedPendingToolCallResolutions: msg.interruptedPendingToolCallResolutions !== void 0 ? toRedactedInterruptedPendingToolCallResolutions(msg.interruptedPendingToolCallResolutions, privacyMode) : void 0,
    conversationHistory: msg.conversationHistory !== void 0 ? toRedactedConversationHistory(msg.conversationHistory, privacyMode) : void 0
  };
}
function createRedactedUserMessageAction(privacyMode, partial2) {
  return {
    userMessage: void 0,
    requestContext: void 0,
    sendToInteractionListener: void 0,
    prependUserMessages: [],
    interruptedPendingToolCallResolutions: void 0,
    conversationHistory: void 0,
    ...partial2,
    _privacyMode: privacyMode
  };
}
function toRedactedSubscriptionNotificationAction(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    notifications: msg.notifications.map((v2) => toRedactedUserMessage2(v2, privacyMode)),
    requestContext: msg.requestContext !== void 0 ? toRedactedRequestContext(msg.requestContext, privacyMode) : void 0,
    sendToInteractionListener: msg.sendToInteractionListener
  };
}
function toRedactedGoalContinuationAction(msg, privacyMode) {
  return {
    _privacyMode: privacyMode
  };
}
function toRedactedInjectContextAction(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    injectionId: msg.injectionId,
    expectedRunId: msg.expectedRunId,
    payload: toRedactedInjectContextAction_payload(msg.payload, privacyMode)
  };
}
function toRedactedInjectContextAction_payload(oneof, privacyMode) {
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "userContext":
      return { case: "userContext", value: toRedactedUserContextInjection(oneof.value, privacyMode) };
    case "systemContext":
      return { case: "systemContext", value: toRedactedSystemContextInjection(oneof.value, privacyMode) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function toRedactedUserContextInjection(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    userMessage: msg.userMessage !== void 0 ? toRedactedUserMessage2(msg.userMessage, privacyMode) : void 0,
    requestContext: msg.requestContext !== void 0 ? toRedactedRequestContext(msg.requestContext, privacyMode) : void 0
  };
}
function toRedactedSystemContextInjection(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    producer: msg.producer,
    content: createRedactedString(msg.content, DataClassification.CODE, "content", privacyMode)
  };
}
function toRedactedContextInjectionState(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    state: toRedactedContextInjectionState_state(msg.state, privacyMode)
  };
}
function toRedactedContextInjectionState_state(oneof, privacyMode) {
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "queued":
      return { case: "queued", value: toRedactedContextInjectionQueued(oneof.value, privacyMode) };
    case "delivered":
      return { case: "delivered", value: toRedactedContextInjectionDelivered(oneof.value, privacyMode) };
    case "queuedForNextTurn":
      return { case: "queuedForNextTurn", value: toRedactedContextInjectionQueuedForNextTurn(oneof.value, privacyMode) };
    case "cancelled":
      return { case: "cancelled", value: toRedactedContextInjectionCancelled(oneof.value, privacyMode) };
    case "rejected":
      return { case: "rejected", value: toRedactedContextInjectionRejected(oneof.value, privacyMode) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function fromRedactedContextInjectionState(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ContextInjectionState({
    state: fromRedactedContextInjectionState_state(msg.state, purpose, opts)
  });
}
function fromRedactedContextInjectionState_state(oneof, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "queued":
      return { case: "queued", value: fromRedactedContextInjectionQueued(oneof.value, purpose, opts) };
    case "delivered":
      return { case: "delivered", value: fromRedactedContextInjectionDelivered(oneof.value, purpose, opts) };
    case "queuedForNextTurn":
      return { case: "queuedForNextTurn", value: fromRedactedContextInjectionQueuedForNextTurn(oneof.value, purpose, opts) };
    case "cancelled":
      return { case: "cancelled", value: fromRedactedContextInjectionCancelled(oneof.value, purpose, opts) };
    case "rejected":
      return { case: "rejected", value: fromRedactedContextInjectionRejected(oneof.value, purpose, opts) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function toRedactedContextInjectionQueued(msg, privacyMode) {
  return {
    _privacyMode: privacyMode
  };
}
function fromRedactedContextInjectionQueued(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ContextInjectionQueued({});
}
function toRedactedContextInjectionDelivered(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    step: msg.step,
    deliveryBatchId: msg.deliveryBatchId,
    deliveredAtMs: msg.deliveredAtMs
  };
}
function fromRedactedContextInjectionDelivered(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ContextInjectionDelivered({
    step: msg.step,
    deliveryBatchId: msg.deliveryBatchId,
    deliveredAtMs: msg.deliveredAtMs
  });
}
function toRedactedContextInjectionQueuedForNextTurn(msg, privacyMode) {
  return {
    _privacyMode: privacyMode
  };
}
function fromRedactedContextInjectionQueuedForNextTurn(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ContextInjectionQueuedForNextTurn({});
}
function toRedactedContextInjectionCancelled(msg, privacyMode) {
  return {
    _privacyMode: privacyMode
  };
}
function fromRedactedContextInjectionCancelled(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ContextInjectionCancelled({});
}
function toRedactedContextInjectionRejected(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    reason: msg.reason
  };
}
function fromRedactedContextInjectionRejected(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ContextInjectionRejected({
    reason: msg.reason
  });
}
function toRedactedSubmittedCustomMode(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    id: createRedactedString(msg.id, DataClassification.PATH, "id", privacyMode),
    label: msg.label,
    source: msg.source,
    sourcePath: msg.sourcePath !== void 0 ? createRedactedString(msg.sourcePath, DataClassification.PATH, "source_path", privacyMode) : void 0,
    sourceHash: msg.sourceHash,
    managedSkillId: msg.managedSkillId,
    pluginId: msg.pluginId,
    pluginSnapshotToken: msg.pluginSnapshotToken !== void 0 ? createRedactedString(msg.pluginSnapshotToken, DataClassification.CREDENTIALS, "plugin_snapshot_token", privacyMode) : void 0
  };
}
function fromRedactedSubmittedCustomMode(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new SubmittedCustomMode({
    id: msg.id.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    label: msg.label,
    source: msg.source,
    sourcePath: msg.sourcePath?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    sourceHash: msg.sourceHash,
    managedSkillId: msg.managedSkillId,
    pluginId: msg.pluginId,
    pluginSnapshotToken: msg.pluginSnapshotToken?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedSubmittedExitedCustomMode(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    id: createRedactedString(msg.id, DataClassification.PATH, "id", privacyMode),
    label: msg.label
  };
}
function fromRedactedSubmittedExitedCustomMode(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new SubmittedExitedCustomMode({
    id: msg.id.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    label: msg.label
  });
}
function toRedactedCustomModeExitIntent(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    nextMode: msg.nextMode,
    exitedMode: msg.exitedMode !== void 0 ? toRedactedSubmittedExitedCustomMode(msg.exitedMode, privacyMode) : void 0
  };
}
function fromRedactedCustomModeExitIntent(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new CustomModeExitIntent({
    nextMode: msg.nextMode,
    exitedMode: msg.exitedMode !== void 0 ? fromRedactedSubmittedExitedCustomMode(msg.exitedMode, purpose, opts) : void 0
  });
}
function toRedactedCustomModeIntent(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    intent: toRedactedCustomModeIntent_intent(msg.intent, privacyMode)
  };
}
function toRedactedCustomModeIntent_intent(oneof, privacyMode) {
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "enter":
      return { case: "enter", value: toRedactedSubmittedCustomMode(oneof.value, privacyMode) };
    case "exit":
      return { case: "exit", value: toRedactedCustomModeExitIntent(oneof.value, privacyMode) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function fromRedactedCustomModeIntent(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new CustomModeIntent({
    intent: fromRedactedCustomModeIntent_intent(msg.intent, purpose, opts)
  });
}
function fromRedactedCustomModeIntent_intent(oneof, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "enter":
      return { case: "enter", value: fromRedactedSubmittedCustomMode(oneof.value, purpose, opts) };
    case "exit":
      return { case: "exit", value: fromRedactedCustomModeExitIntent(oneof.value, purpose, opts) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function toRedactedCancelAction(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    reason: createRedactedString(msg.reason, DataClassification.CODE, "reason", privacyMode),
    interruptedPendingToolCallResolutions: msg.interruptedPendingToolCallResolutions !== void 0 ? toRedactedInterruptedPendingToolCallResolutions(msg.interruptedPendingToolCallResolutions, privacyMode) : void 0
  };
}
function toRedactedResumeAction(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    requestContext: msg.requestContext !== void 0 ? toRedactedRequestContext(msg.requestContext, privacyMode) : void 0
  };
}
function toRedactedAsyncAskQuestionCompletionAction(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    originalToolCallId: msg.originalToolCallId,
    originalArgs: msg.originalArgs !== void 0 ? toRedactedAskQuestionArgs(msg.originalArgs, privacyMode) : void 0,
    result: msg.result !== void 0 ? toRedactedAskQuestionResult(msg.result, privacyMode) : void 0
  };
}
function toRedactedSummarizeAction(msg, privacyMode) {
  return {
    _privacyMode: privacyMode
  };
}
function toRedactedShellCommandAction(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    shellCommand: msg.shellCommand !== void 0 ? toRedactedShellCommand(msg.shellCommand, privacyMode) : void 0,
    execId: msg.execId
  };
}
function toRedactedStartPlanAction(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    userMessage: msg.userMessage !== void 0 ? toRedactedUserMessage2(msg.userMessage, privacyMode) : void 0,
    requestContext: msg.requestContext !== void 0 ? toRedactedRequestContext(msg.requestContext, privacyMode) : void 0,
    isSpec: msg.isSpec
  };
}
function toRedactedExecutePlanAction(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    requestContext: msg.requestContext !== void 0 ? toRedactedRequestContext(msg.requestContext, privacyMode) : void 0,
    plan: msg.plan !== void 0 ? toRedactedConversationPlan(msg.plan, privacyMode) : void 0,
    planFileUri: msg.planFileUri !== void 0 ? createRedactedString(msg.planFileUri, DataClassification.PATH, "plan_file_uri", privacyMode) : void 0,
    planFileContent: msg.planFileContent !== void 0 ? createRedactedString(msg.planFileContent, DataClassification.CODE, "plan_file_content", privacyMode) : void 0,
    executionMode: msg.executionMode,
    kickoffMessageId: msg.kickoffMessageId,
    planId: msg.planId,
    planFilePath: msg.planFilePath !== void 0 ? createRedactedString(msg.planFilePath, DataClassification.PATH, "plan_file_path", privacyMode) : void 0
  };
}
function toRedactedSubscriptionEventDisplay(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    displayLabel: msg.displayLabel !== void 0 ? createRedactedString(msg.displayLabel, DataClassification.CODE, "display_label", privacyMode) : void 0,
    resourceUrl: msg.resourceUrl !== void 0 ? createRedactedString(msg.resourceUrl, DataClassification.CODE, "resource_url", privacyMode) : void 0,
    subscriptionId: msg.subscriptionId
  };
}
function fromRedactedSubscriptionEventDisplay(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new SubscriptionEventDisplay({
    displayLabel: msg.displayLabel?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    resourceUrl: msg.resourceUrl?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    subscriptionId: msg.subscriptionId
  });
}
function toRedactedExecutePlanInfo(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    planId: msg.planId,
    planTitle: msg.planTitle
  };
}
function fromRedactedExecutePlanInfo(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ExecutePlanInfo({
    planId: msg.planId,
    planTitle: msg.planTitle
  });
}
function toRedactedProjectDetails(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    name: msg.name !== void 0 ? createRedactedString(msg.name, DataClassification.CODE, "name", privacyMode) : void 0,
    subagent: msg.subagent !== void 0 ? toRedactedProjectSubagentDetails(msg.subagent, privacyMode) : void 0,
    sideChat: msg.sideChat !== void 0 ? toRedactedProjectSideChatDetails(msg.sideChat, privacyMode) : void 0
  };
}
function fromRedactedProjectDetails(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ProjectDetails({
    name: msg.name?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    subagent: msg.subagent !== void 0 ? fromRedactedProjectSubagentDetails(msg.subagent, purpose, opts) : void 0,
    sideChat: msg.sideChat !== void 0 ? fromRedactedProjectSideChatDetails(msg.sideChat, purpose, opts) : void 0
  });
}
function toRedactedProjectSubagentDetails(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    storeDir: msg.storeDir !== void 0 ? createRedactedString(msg.storeDir, DataClassification.CODE, "store_dir", privacyMode) : void 0
  };
}
function fromRedactedProjectSubagentDetails(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ProjectSubagentDetails({
    storeDir: msg.storeDir?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedProjectSideChatDetails(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    storeDir: createRedactedString(msg.storeDir, DataClassification.CODE, "store_dir", privacyMode)
  };
}
function fromRedactedProjectSideChatDetails(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ProjectSideChatDetails({
    storeDir: msg.storeDir.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedUserMessage2(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    text: createRedactedString(msg.text, DataClassification.CODE, "text", privacyMode),
    messageId: msg.messageId,
    selectedContext: msg.selectedContext !== void 0 ? toRedactedSelectedContext(msg.selectedContext, privacyMode) : void 0,
    mode: msg.mode,
    isSimulatedMsg: msg.isSimulatedMsg,
    bestOfNGroupId: msg.bestOfNGroupId,
    tryUseBestOfNPromotion: msg.tryUseBestOfNPromotion,
    richText: msg.richText !== void 0 ? createRedactedString(msg.richText, DataClassification.CODE, "rich_text", privacyMode) : void 0,
    simulatedMsgReason: msg.simulatedMsgReason,
    conversationStateBlobId: msg.conversationStateBlobId,
    subagentSystemReminder: msg.subagentSystemReminder !== void 0 ? createRedactedString(msg.subagentSystemReminder, DataClassification.CODE, "subagent_system_reminder", privacyMode) : void 0,
    triggeringUserInfo: msg.triggeringUserInfo !== void 0 ? toRedactedTriggeringUserInfo(msg.triggeringUserInfo, privacyMode) : void 0,
    executePlanInfo: msg.executePlanInfo !== void 0 ? toRedactedExecutePlanInfo(msg.executePlanInfo, privacyMode) : void 0,
    simulatedMessageMetadata: msg.simulatedMessageMetadata !== void 0 ? toRedactedUserMessage_SimulatedMessageMetadata(msg.simulatedMessageMetadata, privacyMode) : void 0,
    promptReferenceId: msg.promptReferenceId,
    threadId: msg.threadId,
    textBlobId: msg.textBlobId,
    richTextBlobId: msg.richTextBlobId,
    hookAdditionalContexts: msg.hookAdditionalContexts.map((v2) => toRedactedHookAdditionalContext(v2, privacyMode)),
    customModeIntent: msg.customModeIntent !== void 0 ? toRedactedCustomModeIntent(msg.customModeIntent, privacyMode) : void 0,
    projectDetails: msg.projectDetails !== void 0 ? toRedactedProjectDetails(msg.projectDetails, privacyMode) : void 0,
    turnSteer: msg.turnSteer,
    startedAtMs: msg.startedAtMs,
    completedAtMs: msg.completedAtMs,
    sentByAgentId: msg.sentByAgentId
  };
}
function fromRedactedUserMessage2(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new UserMessage({
    text: msg.text.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    messageId: msg.messageId,
    selectedContext: msg.selectedContext !== void 0 ? fromRedactedSelectedContext(msg.selectedContext, purpose, opts) : void 0,
    mode: msg.mode,
    isSimulatedMsg: msg.isSimulatedMsg,
    bestOfNGroupId: msg.bestOfNGroupId,
    tryUseBestOfNPromotion: msg.tryUseBestOfNPromotion,
    richText: msg.richText?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    simulatedMsgReason: msg.simulatedMsgReason,
    conversationStateBlobId: msg.conversationStateBlobId,
    subagentSystemReminder: msg.subagentSystemReminder?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    triggeringUserInfo: msg.triggeringUserInfo !== void 0 ? fromRedactedTriggeringUserInfo(msg.triggeringUserInfo, purpose, opts) : void 0,
    executePlanInfo: msg.executePlanInfo !== void 0 ? fromRedactedExecutePlanInfo(msg.executePlanInfo, purpose, opts) : void 0,
    simulatedMessageMetadata: msg.simulatedMessageMetadata !== void 0 ? fromRedactedUserMessage_SimulatedMessageMetadata(msg.simulatedMessageMetadata, purpose, opts) : void 0,
    promptReferenceId: msg.promptReferenceId,
    threadId: msg.threadId,
    textBlobId: msg.textBlobId !== void 0 ? msg.textBlobId : void 0,
    richTextBlobId: msg.richTextBlobId !== void 0 ? msg.richTextBlobId : void 0,
    hookAdditionalContexts: msg.hookAdditionalContexts.map((v2) => fromRedactedHookAdditionalContext(v2, purpose, opts)),
    customModeIntent: msg.customModeIntent !== void 0 ? fromRedactedCustomModeIntent(msg.customModeIntent, purpose, opts) : void 0,
    projectDetails: msg.projectDetails !== void 0 ? fromRedactedProjectDetails(msg.projectDetails, purpose, opts) : void 0,
    turnSteer: msg.turnSteer,
    startedAtMs: msg.startedAtMs,
    completedAtMs: msg.completedAtMs,
    sentByAgentId: msg.sentByAgentId
  });
}
function toRedactedUserMessage_SimulatedMessageMetadata(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    title: msg.title !== void 0 ? createRedactedString(msg.title, DataClassification.CODE, "title", privacyMode) : void 0,
    taskId: msg.taskId,
    fsdFindingAction: msg.fsdFindingAction,
    url: msg.url !== void 0 ? createRedactedString(msg.url, DataClassification.CODE, "url", privacyMode) : void 0,
    subscriptionSource: msg.subscriptionSource,
    subscriptionEventDisplay: msg.subscriptionEventDisplay !== void 0 ? toRedactedSubscriptionEventDisplay(msg.subscriptionEventDisplay, privacyMode) : void 0
  };
}
function fromRedactedUserMessage_SimulatedMessageMetadata(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new UserMessage_SimulatedMessageMetadata({
    title: msg.title?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    taskId: msg.taskId,
    fsdFindingAction: msg.fsdFindingAction,
    url: msg.url?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    subscriptionSource: msg.subscriptionSource,
    subscriptionEventDisplay: msg.subscriptionEventDisplay !== void 0 ? fromRedactedSubscriptionEventDisplay(msg.subscriptionEventDisplay, purpose, opts) : void 0
  });
}
function toRedactedAssistantMessage2(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    text: createRedactedString(msg.text, DataClassification.CODE, "text", privacyMode),
    startedAtMs: msg.startedAtMs,
    completedAtMs: msg.completedAtMs
  };
}
function fromRedactedAssistantMessage2(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new AssistantMessage({
    text: msg.text.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    startedAtMs: msg.startedAtMs,
    completedAtMs: msg.completedAtMs
  });
}
function toRedactedThinkingMessage(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    text: createRedactedString(msg.text, DataClassification.CODE, "text", privacyMode),
    durationMs: msg.durationMs,
    startedAtMs: msg.startedAtMs,
    completedAtMs: msg.completedAtMs
  };
}
function fromRedactedThinkingMessage(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ThinkingMessage({
    text: msg.text.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    durationMs: msg.durationMs,
    startedAtMs: msg.startedAtMs,
    completedAtMs: msg.completedAtMs
  });
}
function toRedactedShellCommand(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    command: createRedactedString(msg.command, DataClassification.CODE, "command", privacyMode)
  };
}
function fromRedactedShellCommand(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ShellCommand({
    command: msg.command.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedShellOutput(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    stdout: createRedactedString(msg.stdout, DataClassification.CODE, "stdout", privacyMode),
    stderr: createRedactedString(msg.stderr, DataClassification.CODE, "stderr", privacyMode),
    exitCode: msg.exitCode
  };
}
function fromRedactedShellOutput(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ShellOutput({
    stdout: msg.stdout.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    stderr: msg.stderr.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    exitCode: msg.exitCode
  });
}
function createRedactedShellOutput(privacyMode, partial2) {
  return {
    stdout: createRedactedString("", DataClassification.CODE, "stdout", privacyMode),
    stderr: createRedactedString("", DataClassification.CODE, "stderr", privacyMode),
    exitCode: 0,
    ...partial2,
    _privacyMode: privacyMode
  };
}
function toRedactedConversationPlan(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    plan: createRedactedString(msg.plan, DataClassification.CODE, "plan", privacyMode)
  };
}
function fromRedactedConversationPlan(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ConversationPlan({
    plan: msg.plan.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedPlanRegistryEntry(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    id: msg.id,
    path: createRedactedString(msg.path, DataClassification.PATH, "path", privacyMode)
  };
}
function fromRedactedPlanRegistryEntry(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new PlanRegistryEntry({
    id: msg.id,
    path: msg.path.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedGoalState(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    conversationId: msg.conversationId,
    goalId: msg.goalId,
    objective: createRedactedString(msg.objective, DataClassification.CODE, "objective", privacyMode),
    status: msg.status,
    idleContinuationsWithoutToolCalls: msg.idleContinuationsWithoutToolCalls,
    activeDurationMs: msg.activeDurationMs,
    lastAccruedAtMs: msg.lastAccruedAtMs,
    continuationCount: msg.continuationCount,
    agentSessionId: msg.agentSessionId
  };
}
function fromRedactedGoalState(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new GoalState({
    conversationId: msg.conversationId,
    goalId: msg.goalId,
    objective: msg.objective.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    status: msg.status,
    idleContinuationsWithoutToolCalls: msg.idleContinuationsWithoutToolCalls,
    activeDurationMs: msg.activeDurationMs,
    lastAccruedAtMs: msg.lastAccruedAtMs,
    continuationCount: msg.continuationCount,
    agentSessionId: msg.agentSessionId
  });
}
function toRedactedConversationSummary(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    summary: createRedactedString(msg.summary, DataClassification.CODE, "summary", privacyMode)
  };
}
function fromRedactedConversationSummary(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ConversationSummary({
    summary: msg.summary.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function createRedactedConversationSummary(privacyMode, partial2) {
  return {
    summary: createRedactedString("", DataClassification.CODE, "summary", privacyMode),
    ...partial2,
    _privacyMode: privacyMode
  };
}
function toRedactedConversationSummaryArchive(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    summarizedMessages: msg.summarizedMessages,
    summary: createRedactedString(msg.summary, DataClassification.CODE, "summary", privacyMode),
    windowTail: msg.windowTail,
    summaryMessage: msg.summaryMessage
  };
}
function fromRedactedConversationSummaryArchive(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ConversationSummaryArchive({
    summarizedMessages: msg.summarizedMessages.map((v2) => v2),
    summary: msg.summary.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    windowTail: msg.windowTail,
    summaryMessage: msg.summaryMessage
  });
}
function createRedactedConversationSummaryArchive(privacyMode, partial2) {
  return {
    summarizedMessages: [],
    summary: createRedactedString("", DataClassification.CODE, "summary", privacyMode),
    windowTail: 0,
    summaryMessage: new Uint8Array(),
    ...partial2,
    _privacyMode: privacyMode
  };
}
function toRedactedPromptTokenBreakdownCategory(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    id: msg.id,
    label: msg.label,
    estimatedTokens: msg.estimatedTokens,
    characterCount: msg.characterCount
  };
}
function fromRedactedPromptTokenBreakdownCategory(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new PromptTokenBreakdownCategory({
    id: msg.id,
    label: msg.label,
    estimatedTokens: msg.estimatedTokens,
    characterCount: msg.characterCount
  });
}
function toRedactedPromptTokenBreakdownSnapshot(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    totalUsedTokens: msg.totalUsedTokens,
    maxTokens: msg.maxTokens,
    categories: msg.categories.map((v2) => toRedactedPromptTokenBreakdownCategory(v2, privacyMode))
  };
}
function fromRedactedPromptTokenBreakdownSnapshot(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new PromptTokenBreakdownSnapshot({
    totalUsedTokens: msg.totalUsedTokens,
    maxTokens: msg.maxTokens,
    categories: msg.categories.map((v2) => fromRedactedPromptTokenBreakdownCategory(v2, purpose, opts))
  });
}
function toRedactedPromptContextSourceRef(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    sourceType: msg.sourceType,
    messageIndex: msg.messageIndex,
    contentPath: msg.contentPath,
    startOffset: msg.startOffset,
    endOffset: msg.endOffset
  };
}
function fromRedactedPromptContextSourceRef(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new PromptContextSourceRef({
    sourceType: msg.sourceType,
    messageIndex: msg.messageIndex,
    contentPath: msg.contentPath,
    startOffset: msg.startOffset,
    endOffset: msg.endOffset
  });
}
function toRedactedPromptContextNode(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    id: msg.id,
    parentId: msg.parentId,
    kind: msg.kind,
    label: createRedactedString(msg.label, DataClassification.CODE, "label", privacyMode),
    categoryId: msg.categoryId,
    estimatedTokens: msg.estimatedTokens,
    characterCount: msg.characterCount,
    contentAvailable: msg.contentAvailable,
    source: msg.source !== void 0 ? toRedactedPromptContextSourceRef(msg.source, privacyMode) : void 0,
    inlineContent: msg.inlineContent !== void 0 ? createRedactedString(msg.inlineContent, DataClassification.CODE, "inline_content", privacyMode) : void 0
  };
}
function fromRedactedPromptContextNode(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new PromptContextNode({
    id: msg.id,
    parentId: msg.parentId,
    kind: msg.kind,
    label: msg.label.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    categoryId: msg.categoryId,
    estimatedTokens: msg.estimatedTokens,
    characterCount: msg.characterCount,
    contentAvailable: msg.contentAvailable,
    source: msg.source !== void 0 ? fromRedactedPromptContextSourceRef(msg.source, purpose, opts) : void 0,
    inlineContent: msg.inlineContent?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedPromptContextUsageTree(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    schemaVersion: msg.schemaVersion,
    nodes: msg.nodes.map((v2) => toRedactedPromptContextNode(v2, privacyMode))
  };
}
function fromRedactedPromptContextUsageTree(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new PromptContextUsageTree({
    schemaVersion: msg.schemaVersion,
    nodes: msg.nodes.map((v2) => fromRedactedPromptContextNode(v2, purpose, opts))
  });
}
function toRedactedConversationTokenDetails(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    usedTokens: msg.usedTokens,
    maxTokens: msg.maxTokens,
    breakdown: msg.breakdown !== void 0 ? toRedactedPromptTokenBreakdownSnapshot(msg.breakdown, privacyMode) : void 0,
    promptContextUsageTree: msg.promptContextUsageTree !== void 0 ? toRedactedPromptContextUsageTree(msg.promptContextUsageTree, privacyMode) : void 0,
    promptContextUsageSnapshotBlobId: msg.promptContextUsageSnapshotBlobId
  };
}
function fromRedactedConversationTokenDetails(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ConversationTokenDetails({
    usedTokens: msg.usedTokens,
    maxTokens: msg.maxTokens,
    breakdown: msg.breakdown !== void 0 ? fromRedactedPromptTokenBreakdownSnapshot(msg.breakdown, purpose, opts) : void 0,
    promptContextUsageTree: msg.promptContextUsageTree !== void 0 ? fromRedactedPromptContextUsageTree(msg.promptContextUsageTree, purpose, opts) : void 0,
    promptContextUsageSnapshotBlobId: msg.promptContextUsageSnapshotBlobId !== void 0 ? msg.promptContextUsageSnapshotBlobId : void 0
  });
}
function createRedactedConversationTokenDetails(privacyMode, partial2) {
  return {
    usedTokens: 0,
    maxTokens: 0,
    breakdown: void 0,
    promptContextUsageTree: void 0,
    promptContextUsageSnapshotBlobId: void 0,
    ...partial2,
    _privacyMode: privacyMode
  };
}
function toRedactedFileStateStructure(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    content: msg.content !== void 0 ? createRedactedBytes(msg.content, DataClassification.CODE, "content", privacyMode) : void 0,
    initialContent: msg.initialContent !== void 0 ? createRedactedBytes(msg.initialContent, DataClassification.CODE, "initial_content", privacyMode) : void 0
  };
}
function fromRedactedFileStateStructure(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new FileStateStructure({
    content: msg.content?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    initialContent: msg.initialContent?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedStepTiming(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    durationMs: msg.durationMs,
    timestampMs: msg.timestampMs
  };
}
function fromRedactedStepTiming(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new StepTiming({
    durationMs: msg.durationMs,
    timestampMs: msg.timestampMs
  });
}
function toRedactedCommunicateUpdateHistoryEntry(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    step: createRedactedString(msg.step, DataClassification.CODE, "step", privacyMode),
    messageIndex: msg.messageIndex
  };
}
function fromRedactedCommunicateUpdateHistoryEntry(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new CommunicateUpdateHistoryEntry({
    step: msg.step.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    messageIndex: msg.messageIndex
  });
}
function toRedactedCommunicateUpdateTurnState(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    history: msg.history.map((v2) => toRedactedCommunicateUpdateHistoryEntry(v2, privacyMode)),
    finalSummary: msg.finalSummary !== void 0 ? createRedactedString(msg.finalSummary, DataClassification.CODE, "final_summary", privacyMode) : void 0,
    completedSubtitle: msg.completedSubtitle !== void 0 ? createRedactedString(msg.completedSubtitle, DataClassification.CODE, "completed_subtitle", privacyMode) : void 0
  };
}
function fromRedactedCommunicateUpdateTurnState(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new CommunicateUpdateTurnState({
    history: msg.history.map((v2) => fromRedactedCommunicateUpdateHistoryEntry(v2, purpose, opts)),
    finalSummary: msg.finalSummary?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    completedSubtitle: msg.completedSubtitle?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedSubagentPersistedState(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    conversationState: msg.conversationState !== void 0 ? toRedactedConversationStateStructure(msg.conversationState, privacyMode) : void 0,
    createdTimestampMs: msg.createdTimestampMs,
    lastUsedTimestampMs: msg.lastUsedTimestampMs,
    subagentType: msg.subagentType !== void 0 ? toRedactedSubagentType(msg.subagentType, privacyMode) : void 0,
    modelId: msg.modelId,
    environment: msg.environment,
    cloudSubagent: msg.cloudSubagent !== void 0 ? toRedactedCloudSubagentReference(msg.cloudSubagent, privacyMode) : void 0,
    firstClassBcId: msg.firstClassBcId,
    cloudRequestedEnvironmentBuildId: msg.cloudRequestedEnvironmentBuildId,
    machine: msg.machine !== void 0 ? toRedactedTargetMachine(msg.machine, privacyMode) : void 0
  };
}
function fromRedactedSubagentPersistedState(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new SubagentPersistedState({
    conversationState: msg.conversationState !== void 0 ? fromRedactedConversationStateStructure(msg.conversationState, purpose, opts) : void 0,
    createdTimestampMs: msg.createdTimestampMs,
    lastUsedTimestampMs: msg.lastUsedTimestampMs,
    subagentType: msg.subagentType !== void 0 ? fromRedactedSubagentType(msg.subagentType, purpose, opts) : void 0,
    modelId: msg.modelId,
    environment: msg.environment,
    cloudSubagent: msg.cloudSubagent !== void 0 ? fromRedactedCloudSubagentReference(msg.cloudSubagent, purpose, opts) : void 0,
    firstClassBcId: msg.firstClassBcId,
    cloudRequestedEnvironmentBuildId: msg.cloudRequestedEnvironmentBuildId,
    machine: msg.machine !== void 0 ? fromRedactedTargetMachine(msg.machine, purpose, opts) : void 0
  });
}
function toRedactedCloudSubagentReference(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    bcId: msg.bcId,
    transcriptPath: msg.transcriptPath !== void 0 ? createRedactedString(msg.transcriptPath, DataClassification.PATH, "transcript_path", privacyMode) : void 0
  };
}
function fromRedactedCloudSubagentReference(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new CloudSubagentReference({
    bcId: msg.bcId,
    transcriptPath: msg.transcriptPath?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedTrackedGitRepo(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    repoPath: createRedactedString(msg.repoPath, DataClassification.PATH, "repo_path", privacyMode),
    branchName: msg.branchName
  };
}
function fromRedactedTrackedGitRepo(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new TrackedGitRepo({
    repoPath: msg.repoPath.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    branchName: msg.branchName
  });
}
function toRedactedConversationStateStructure(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    rootPromptMessagesJson: msg.rootPromptMessagesJson,
    turns: msg.turns,
    todos: msg.todos,
    pendingToolCalls: msg.pendingToolCalls.map((v2) => createRedactedString(v2, DataClassification.CODE, "pending_tool_calls", privacyMode)),
    tokenDetails: msg.tokenDetails !== void 0 ? toRedactedConversationTokenDetails(msg.tokenDetails, privacyMode) : void 0,
    summary: msg.summary,
    plan: msg.plan,
    previousWorkspaceUris: msg.previousWorkspaceUris.map((v2) => createRedactedString(v2, DataClassification.PATH, "previous_workspace_uris", privacyMode)),
    mode: msg.mode,
    summaryArchive: msg.summaryArchive,
    fileStates: new Map(Object.entries(msg.fileStates).map(([k2, v2]) => [createRedactedString(k2, DataClassification.PATH, "file_states", privacyMode), v2])),
    fileStatesV2: new Map(Object.entries(msg.fileStatesV2).map(([k2, v2]) => [createRedactedString(k2, DataClassification.PATH, "file_states_v2", privacyMode), toRedactedFileStateStructure(v2, privacyMode)])),
    summaryArchives: msg.summaryArchives,
    turnTimings: msg.turnTimings.map((v2) => toRedactedStepTiming(v2, privacyMode)),
    subagentStates: new Map(Object.entries(msg.subagentStates).map(([k2, v2]) => [k2, toRedactedSubagentPersistedState(v2, privacyMode)])),
    selfSummaryCount: msg.selfSummaryCount,
    readPaths: msg.readPaths.map((v2) => createRedactedString(v2, DataClassification.PATH, "read_paths", privacyMode)),
    activeBranchName: msg.activeBranchName,
    plans: new Map(Object.entries(msg.plans).map(([k2, v2]) => [k2, toRedactedPlanRegistryEntry(v2, privacyMode)])),
    trackedGitRepoBranches: msg.trackedGitRepoBranches.map((v2) => toRedactedTrackedGitRepo(v2, privacyMode)),
    agentType: msg.agentType,
    communicateUpdateHistory: msg.communicateUpdateHistory.map((v2) => toRedactedCommunicateUpdateHistoryEntry(v2, privacyMode)),
    subagentThreads: new Map(Object.entries(msg.subagentThreads)),
    communicateUpdateFinalSummary: msg.communicateUpdateFinalSummary !== void 0 ? createRedactedString(msg.communicateUpdateFinalSummary, DataClassification.CODE, "communicate_update_final_summary", privacyMode) : void 0,
    communicateUpdateCompletedSubtitle: msg.communicateUpdateCompletedSubtitle !== void 0 ? createRedactedString(msg.communicateUpdateCompletedSubtitle, DataClassification.CODE, "communicate_update_completed_subtitle", privacyMode) : void 0,
    communicateUpdateStatesByParentToolCallId: new Map(Object.entries(msg.communicateUpdateStatesByParentToolCallId).map(([k2, v2]) => [k2, toRedactedCommunicateUpdateTurnState(v2, privacyMode)])),
    subagentRunsByParentToolCallId: new Map(Object.entries(msg.subagentRunsByParentToolCallId).map(([k2, v2]) => [k2, toRedactedSubagentRunState(v2, privacyMode)])),
    conversationStartedTimestampMs: msg.conversationStartedTimestampMs,
    conversationStartedTimeZone: msg.conversationStartedTimeZone,
    subagentStateRefs: new Map(Object.entries(msg.subagentStateRefs)),
    goalState: msg.goalState !== void 0 ? toRedactedGoalState(msg.goalState, privacyMode) : void 0,
    isRootProjectConversation: msg.isRootProjectConversation,
    completedAskQuestionToolCallIds: msg.completedAskQuestionToolCallIds,
    durableSkillBlocks: msg.durableSkillBlocks.map((v2) => createRedactedString(v2, DataClassification.CODE, "durable_skill_blocks", privacyMode)),
    durableCustomModeId: msg.durableCustomModeId !== void 0 ? createRedactedString(msg.durableCustomModeId, DataClassification.PATH, "durable_custom_mode_id", privacyMode) : void 0,
    messageCountAtLastCompaction: msg.messageCountAtLastCompaction,
    recentUserMessageIds: msg.recentUserMessageIds,
    recentUserMessageIdsOlderTurnCount: msg.recentUserMessageIdsOlderTurnCount
  };
}
function fromRedactedConversationStateStructure(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ConversationStateStructure({
    rootPromptMessagesJson: msg.rootPromptMessagesJson.map((v2) => v2),
    turns: msg.turns.map((v2) => v2),
    todos: msg.todos.map((v2) => v2),
    pendingToolCalls: msg.pendingToolCalls.map((v2) => v2.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })),
    tokenDetails: msg.tokenDetails !== void 0 ? fromRedactedConversationTokenDetails(msg.tokenDetails, purpose, opts) : void 0,
    summary: msg.summary !== void 0 ? msg.summary : void 0,
    plan: msg.plan !== void 0 ? msg.plan : void 0,
    previousWorkspaceUris: msg.previousWorkspaceUris.map((v2) => v2.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })),
    mode: msg.mode,
    summaryArchive: msg.summaryArchive !== void 0 ? msg.summaryArchive : void 0,
    fileStates: Object.fromEntries(Array.from(msg.fileStates.entries()).map(([k2, v2]) => [k2.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }), v2])),
    fileStatesV2: Object.fromEntries(Array.from(msg.fileStatesV2.entries()).map(([k2, v2]) => [k2.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }), fromRedactedFileStateStructure(v2, purpose, opts)])),
    summaryArchives: msg.summaryArchives.map((v2) => v2),
    turnTimings: msg.turnTimings.map((v2) => fromRedactedStepTiming(v2, purpose, opts)),
    subagentStates: Object.fromEntries(Array.from(msg.subagentStates.entries()).map(([k2, v2]) => [k2, fromRedactedSubagentPersistedState(v2, purpose, opts)])),
    selfSummaryCount: msg.selfSummaryCount,
    readPaths: msg.readPaths.map((v2) => v2.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })),
    activeBranchName: msg.activeBranchName,
    plans: Object.fromEntries(Array.from(msg.plans.entries()).map(([k2, v2]) => [k2, fromRedactedPlanRegistryEntry(v2, purpose, opts)])),
    trackedGitRepoBranches: msg.trackedGitRepoBranches.map((v2) => fromRedactedTrackedGitRepo(v2, purpose, opts)),
    agentType: msg.agentType,
    communicateUpdateHistory: msg.communicateUpdateHistory.map((v2) => fromRedactedCommunicateUpdateHistoryEntry(v2, purpose, opts)),
    subagentThreads: Object.fromEntries(msg.subagentThreads.entries()),
    communicateUpdateFinalSummary: msg.communicateUpdateFinalSummary?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    communicateUpdateCompletedSubtitle: msg.communicateUpdateCompletedSubtitle?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    communicateUpdateStatesByParentToolCallId: Object.fromEntries(Array.from(msg.communicateUpdateStatesByParentToolCallId.entries()).map(([k2, v2]) => [k2, fromRedactedCommunicateUpdateTurnState(v2, purpose, opts)])),
    subagentRunsByParentToolCallId: Object.fromEntries(Array.from(msg.subagentRunsByParentToolCallId.entries()).map(([k2, v2]) => [k2, fromRedactedSubagentRunState(v2, purpose, opts)])),
    conversationStartedTimestampMs: msg.conversationStartedTimestampMs,
    conversationStartedTimeZone: msg.conversationStartedTimeZone,
    subagentStateRefs: Object.fromEntries(Array.from(msg.subagentStateRefs.entries()).map(([k2, v2]) => [k2, v2])),
    goalState: msg.goalState !== void 0 ? fromRedactedGoalState(msg.goalState, purpose, opts) : void 0,
    isRootProjectConversation: msg.isRootProjectConversation,
    completedAskQuestionToolCallIds: msg.completedAskQuestionToolCallIds,
    durableSkillBlocks: msg.durableSkillBlocks.map((v2) => v2.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })),
    durableCustomModeId: msg.durableCustomModeId?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    messageCountAtLastCompaction: msg.messageCountAtLastCompaction,
    recentUserMessageIds: msg.recentUserMessageIds,
    recentUserMessageIdsOlderTurnCount: msg.recentUserMessageIdsOlderTurnCount
  });
}
function toRedactedTextDeltaUpdate(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    text: createRedactedString(msg.text, DataClassification.CODE, "text", privacyMode),
    isServerNotice: msg.isServerNotice
  };
}
function fromRedactedTextDeltaUpdate(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new TextDeltaUpdate({
    text: msg.text.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    isServerNotice: msg.isServerNotice
  });
}
function toRedactedRoutedModelUpdate(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    displayName: msg.displayName
  };
}
function fromRedactedRoutedModelUpdate(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new RoutedModelUpdate({
    displayName: msg.displayName
  });
}
function toRedactedToolCallStartedUpdate(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    callId: msg.callId,
    toolCall: msg.toolCall !== void 0 ? toRedactedToolCall(msg.toolCall, privacyMode) : void 0,
    modelCallId: msg.modelCallId
  };
}
function fromRedactedToolCallStartedUpdate(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ToolCallStartedUpdate({
    callId: msg.callId,
    toolCall: msg.toolCall !== void 0 ? fromRedactedToolCall(msg.toolCall, purpose, opts) : void 0,
    modelCallId: msg.modelCallId
  });
}
function toRedactedToolCallCompletedUpdate(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    callId: msg.callId,
    toolCall: msg.toolCall !== void 0 ? toRedactedToolCall(msg.toolCall, privacyMode) : void 0,
    modelCallId: msg.modelCallId
  };
}
function fromRedactedToolCallCompletedUpdate(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ToolCallCompletedUpdate({
    callId: msg.callId,
    toolCall: msg.toolCall !== void 0 ? fromRedactedToolCall(msg.toolCall, purpose, opts) : void 0,
    modelCallId: msg.modelCallId
  });
}
function toRedactedToolCallDeltaUpdate(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    callId: msg.callId,
    toolCallDelta: msg.toolCallDelta !== void 0 ? toRedactedToolCallDelta(msg.toolCallDelta, privacyMode) : void 0,
    modelCallId: msg.modelCallId
  };
}
function fromRedactedToolCallDeltaUpdate(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ToolCallDeltaUpdate({
    callId: msg.callId,
    toolCallDelta: msg.toolCallDelta !== void 0 ? fromRedactedToolCallDelta(msg.toolCallDelta, purpose, opts) : void 0,
    modelCallId: msg.modelCallId
  });
}
function toRedactedPartialToolCallUpdate(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    callId: msg.callId,
    toolCall: msg.toolCall !== void 0 ? toRedactedToolCall(msg.toolCall, privacyMode) : void 0,
    argsTextDelta: createRedactedString(msg.argsTextDelta, DataClassification.CODE, "args_text_delta", privacyMode),
    modelCallId: msg.modelCallId
  };
}
function fromRedactedPartialToolCallUpdate(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new PartialToolCallUpdate({
    callId: msg.callId,
    toolCall: msg.toolCall !== void 0 ? fromRedactedToolCall(msg.toolCall, purpose, opts) : void 0,
    argsTextDelta: msg.argsTextDelta.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    modelCallId: msg.modelCallId
  });
}
function toRedactedThinkingDeltaUpdate(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    text: createRedactedString(msg.text, DataClassification.CODE, "text", privacyMode),
    thinkingStyle: msg.thinkingStyle
  };
}
function fromRedactedThinkingDeltaUpdate(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ThinkingDeltaUpdate({
    text: msg.text.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    thinkingStyle: msg.thinkingStyle
  });
}
function toRedactedThinkingCompletedUpdate(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    thinkingDurationMs: msg.thinkingDurationMs
  };
}
function fromRedactedThinkingCompletedUpdate(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ThinkingCompletedUpdate({
    thinkingDurationMs: msg.thinkingDurationMs
  });
}
function toRedactedTokenDeltaUpdate(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    tokens: msg.tokens
  };
}
function fromRedactedTokenDeltaUpdate(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new TokenDeltaUpdate({
    tokens: msg.tokens
  });
}
function toRedactedSummaryUpdate(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    summary: createRedactedString(msg.summary, DataClassification.CODE, "summary", privacyMode)
  };
}
function fromRedactedSummaryUpdate(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new SummaryUpdate({
    summary: msg.summary.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedSummaryStartedUpdate(msg, privacyMode) {
  return {
    _privacyMode: privacyMode
  };
}
function fromRedactedSummaryStartedUpdate(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new SummaryStartedUpdate({});
}
function toRedactedHeartbeatUpdate(msg, privacyMode) {
  return {
    _privacyMode: privacyMode
  };
}
function fromRedactedHeartbeatUpdate(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new HeartbeatUpdate({});
}
function toRedactedSummaryCompletedUpdate(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    hookMessage: msg.hookMessage !== void 0 ? createRedactedString(msg.hookMessage, DataClassification.CODE, "hook_message", privacyMode) : void 0,
    failed: msg.failed
  };
}
function fromRedactedSummaryCompletedUpdate(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new SummaryCompletedUpdate({
    hookMessage: msg.hookMessage?.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    failed: msg.failed
  });
}
function toRedactedShellOutputDeltaUpdate(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    event: toRedactedShellOutputDeltaUpdate_event(msg.event, privacyMode)
  };
}
function toRedactedShellOutputDeltaUpdate_event(oneof, privacyMode) {
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "stdout":
      return { case: "stdout", value: toRedactedShellStreamStdout(oneof.value, privacyMode) };
    case "stderr":
      return { case: "stderr", value: toRedactedShellStreamStderr(oneof.value, privacyMode) };
    case "exit":
      return { case: "exit", value: toRedactedShellStreamExit(oneof.value, privacyMode) };
    case "start":
      return { case: "start", value: toRedactedShellStreamStart(oneof.value, privacyMode) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function fromRedactedShellOutputDeltaUpdate(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ShellOutputDeltaUpdate({
    event: fromRedactedShellOutputDeltaUpdate_event(msg.event, purpose, opts)
  });
}
function fromRedactedShellOutputDeltaUpdate_event(oneof, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "stdout":
      return { case: "stdout", value: fromRedactedShellStreamStdout(oneof.value, purpose, opts) };
    case "stderr":
      return { case: "stderr", value: fromRedactedShellStreamStderr(oneof.value, purpose, opts) };
    case "exit":
      return { case: "exit", value: fromRedactedShellStreamExit(oneof.value, purpose, opts) };
    case "start":
      return { case: "start", value: fromRedactedShellStreamStart(oneof.value, purpose, opts) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function toRedactedTurnEndedUpdate(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    inputTokens: msg.inputTokens,
    outputTokens: msg.outputTokens,
    cacheReadTokens: msg.cacheReadTokens,
    cacheWriteTokens: msg.cacheWriteTokens,
    reasoningTokens: msg.reasoningTokens
  };
}
function fromRedactedTurnEndedUpdate(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new TurnEndedUpdate({
    inputTokens: msg.inputTokens,
    outputTokens: msg.outputTokens,
    cacheReadTokens: msg.cacheReadTokens,
    cacheWriteTokens: msg.cacheWriteTokens,
    reasoningTokens: msg.reasoningTokens
  });
}
function toRedactedUserMessageAppendedUpdate(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    userMessage: msg.userMessage !== void 0 ? toRedactedUserMessage2(msg.userMessage, privacyMode) : void 0
  };
}
function fromRedactedUserMessageAppendedUpdate(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new UserMessageAppendedUpdate({
    userMessage: msg.userMessage !== void 0 ? fromRedactedUserMessage2(msg.userMessage, purpose, opts) : void 0
  });
}
function toRedactedStepStartedUpdate(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    stepId: msg.stepId
  };
}
function fromRedactedStepStartedUpdate(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new StepStartedUpdate({
    stepId: msg.stepId
  });
}
function toRedactedStepCompletedUpdate(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    stepId: msg.stepId,
    stepDurationMs: msg.stepDurationMs
  };
}
function fromRedactedStepCompletedUpdate(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new StepCompletedUpdate({
    stepId: msg.stepId,
    stepDurationMs: msg.stepDurationMs
  });
}
function toRedactedPromptSuggestionUpdate(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    suggestion: createRedactedString(msg.suggestion, DataClassification.CODE, "suggestion", privacyMode)
  };
}
function fromRedactedPromptSuggestionUpdate(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new PromptSuggestionUpdate({
    suggestion: msg.suggestion.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedActiveBranchChange(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    path: createRedactedString(msg.path, DataClassification.PATH, "path", privacyMode),
    branchName: msg.branchName
  };
}
function fromRedactedActiveBranchChange(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ActiveBranchChange({
    path: msg.path.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    branchName: msg.branchName
  });
}
function toRedactedFeedbackRequestCategory(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    id: msg.id,
    label: msg.label
  };
}
function fromRedactedFeedbackRequestCategory(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new FeedbackRequestCategory({
    id: msg.id,
    label: msg.label
  });
}
function toRedactedFeedbackRequestCategoryGroup(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    id: msg.id,
    prompt: msg.prompt,
    categories: msg.categories.map((v2) => toRedactedFeedbackRequestCategory(v2, privacyMode))
  };
}
function fromRedactedFeedbackRequestCategoryGroup(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new FeedbackRequestCategoryGroup({
    id: msg.id,
    prompt: msg.prompt,
    categories: msg.categories.map((v2) => fromRedactedFeedbackRequestCategory(v2, purpose, opts))
  });
}
function toRedactedFeedbackRequestUpdate(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    requestId: msg.requestId,
    canonicalModelName: msg.canonicalModelName,
    categories: msg.categories.map((v2) => toRedactedFeedbackRequestCategory(v2, privacyMode)),
    categoryGroups: msg.categoryGroups.map((v2) => toRedactedFeedbackRequestCategoryGroup(v2, privacyMode)),
    showFormImmediately: msg.showFormImmediately,
    title: msg.title,
    negativeTitle: msg.negativeTitle,
    commentPlaceholder: msg.commentPlaceholder
  };
}
function fromRedactedFeedbackRequestUpdate(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new FeedbackRequestUpdate({
    requestId: msg.requestId,
    canonicalModelName: msg.canonicalModelName,
    categories: msg.categories.map((v2) => fromRedactedFeedbackRequestCategory(v2, purpose, opts)),
    categoryGroups: msg.categoryGroups.map((v2) => fromRedactedFeedbackRequestCategoryGroup(v2, purpose, opts)),
    showFormImmediately: msg.showFormImmediately,
    title: msg.title,
    negativeTitle: msg.negativeTitle,
    commentPlaceholder: msg.commentPlaceholder
  });
}
function toRedactedResponseComparisonStarted(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    displayOrder: msg.displayOrder,
    parentInvocationId: msg.parentInvocationId,
    alternateInvocationId: msg.alternateInvocationId,
    parentResponse: createRedactedString(msg.parentResponse, DataClassification.CODE, "parent_response", privacyMode),
    comparisonConfigId: msg.comparisonConfigId,
    alternateModelId: msg.alternateModelId
  };
}
function fromRedactedResponseComparisonStarted(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ResponseComparisonStarted({
    displayOrder: msg.displayOrder,
    parentInvocationId: msg.parentInvocationId,
    alternateInvocationId: msg.alternateInvocationId,
    parentResponse: msg.parentResponse.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing }),
    comparisonConfigId: msg.comparisonConfigId,
    alternateModelId: msg.alternateModelId
  });
}
function toRedactedResponseComparisonTextDelta(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    text: createRedactedString(msg.text, DataClassification.CODE, "text", privacyMode)
  };
}
function fromRedactedResponseComparisonTextDelta(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ResponseComparisonTextDelta({
    text: msg.text.unwrap(purpose, { redactUnallowedFieldsInsteadOfThrowing, enforcing })
  });
}
function toRedactedResponseComparisonCompleted(msg, privacyMode) {
  return {
    _privacyMode: privacyMode
  };
}
function fromRedactedResponseComparisonCompleted(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ResponseComparisonCompleted({});
}
function toRedactedResponseComparisonSkipped(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    reason: msg.reason
  };
}
function fromRedactedResponseComparisonSkipped(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ResponseComparisonSkipped({
    reason: msg.reason
  });
}
function toRedactedResponseComparisonUpdate(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    comparisonId: msg.comparisonId,
    event: toRedactedResponseComparisonUpdate_event(msg.event, privacyMode)
  };
}
function toRedactedResponseComparisonUpdate_event(oneof, privacyMode) {
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "started":
      return { case: "started", value: toRedactedResponseComparisonStarted(oneof.value, privacyMode) };
    case "textDelta":
      return { case: "textDelta", value: toRedactedResponseComparisonTextDelta(oneof.value, privacyMode) };
    case "completed":
      return { case: "completed", value: toRedactedResponseComparisonCompleted(oneof.value, privacyMode) };
    case "skipped":
      return { case: "skipped", value: toRedactedResponseComparisonSkipped(oneof.value, privacyMode) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function fromRedactedResponseComparisonUpdate(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ResponseComparisonUpdate({
    comparisonId: msg.comparisonId,
    event: fromRedactedResponseComparisonUpdate_event(msg.event, purpose, opts)
  });
}
function fromRedactedResponseComparisonUpdate_event(oneof, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "started":
      return { case: "started", value: fromRedactedResponseComparisonStarted(oneof.value, purpose, opts) };
    case "textDelta":
      return { case: "textDelta", value: fromRedactedResponseComparisonTextDelta(oneof.value, purpose, opts) };
    case "completed":
      return { case: "completed", value: fromRedactedResponseComparisonCompleted(oneof.value, purpose, opts) };
    case "skipped":
      return { case: "skipped", value: fromRedactedResponseComparisonSkipped(oneof.value, purpose, opts) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function toRedactedInteractionUpdate(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    messageStartedAtMs: msg.messageStartedAtMs,
    message: toRedactedInteractionUpdate_message(msg.message, privacyMode)
  };
}
function toRedactedInteractionUpdate_message(oneof, privacyMode) {
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "textDelta":
      return { case: "textDelta", value: toRedactedTextDeltaUpdate(oneof.value, privacyMode) };
    case "partialToolCall":
      return { case: "partialToolCall", value: toRedactedPartialToolCallUpdate(oneof.value, privacyMode) };
    case "toolCallDelta":
      return { case: "toolCallDelta", value: toRedactedToolCallDeltaUpdate(oneof.value, privacyMode) };
    case "toolCallStarted":
      return { case: "toolCallStarted", value: toRedactedToolCallStartedUpdate(oneof.value, privacyMode) };
    case "toolCallCompleted":
      return { case: "toolCallCompleted", value: toRedactedToolCallCompletedUpdate(oneof.value, privacyMode) };
    case "thinkingDelta":
      return { case: "thinkingDelta", value: toRedactedThinkingDeltaUpdate(oneof.value, privacyMode) };
    case "thinkingCompleted":
      return { case: "thinkingCompleted", value: toRedactedThinkingCompletedUpdate(oneof.value, privacyMode) };
    case "userMessageAppended":
      return { case: "userMessageAppended", value: toRedactedUserMessageAppendedUpdate(oneof.value, privacyMode) };
    case "tokenDelta":
      return { case: "tokenDelta", value: toRedactedTokenDeltaUpdate(oneof.value, privacyMode) };
    case "summary":
      return { case: "summary", value: toRedactedSummaryUpdate(oneof.value, privacyMode) };
    case "summaryStarted":
      return { case: "summaryStarted", value: toRedactedSummaryStartedUpdate(oneof.value, privacyMode) };
    case "summaryCompleted":
      return { case: "summaryCompleted", value: toRedactedSummaryCompletedUpdate(oneof.value, privacyMode) };
    case "shellOutputDelta":
      return { case: "shellOutputDelta", value: toRedactedShellOutputDeltaUpdate(oneof.value, privacyMode) };
    case "heartbeat":
      return { case: "heartbeat", value: toRedactedHeartbeatUpdate(oneof.value, privacyMode) };
    case "turnEnded":
      return { case: "turnEnded", value: toRedactedTurnEndedUpdate(oneof.value, privacyMode) };
    case "stepStarted":
      return { case: "stepStarted", value: toRedactedStepStartedUpdate(oneof.value, privacyMode) };
    case "stepCompleted":
      return { case: "stepCompleted", value: toRedactedStepCompletedUpdate(oneof.value, privacyMode) };
    case "promptSuggestion":
      return { case: "promptSuggestion", value: toRedactedPromptSuggestionUpdate(oneof.value, privacyMode) };
    case "postRequestPrompt":
      return { case: "postRequestPrompt", value: toRedactedPostRequestPromptUpdate(oneof.value, privacyMode) };
    case "activeBranchChange":
      return { case: "activeBranchChange", value: toRedactedActiveBranchChange(oneof.value, privacyMode) };
    case "feedbackRequest":
      return { case: "feedbackRequest", value: toRedactedFeedbackRequestUpdate(oneof.value, privacyMode) };
    case "responseComparison":
      return { case: "responseComparison", value: toRedactedResponseComparisonUpdate(oneof.value, privacyMode) };
    case "contextInjectionState":
      return { case: "contextInjectionState", value: toRedactedContextInjectionStateUpdate(oneof.value, privacyMode) };
    case "routedModel":
      return { case: "routedModel", value: toRedactedRoutedModelUpdate(oneof.value, privacyMode) };
    case "grokBotNudge":
      return { case: "grokBotNudge", value: toRedactedGrokBotNudgeUpdate(oneof.value, privacyMode) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function fromRedactedInteractionUpdate(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new InteractionUpdate({
    messageStartedAtMs: msg.messageStartedAtMs,
    message: fromRedactedInteractionUpdate_message(msg.message, purpose, opts)
  });
}
function fromRedactedInteractionUpdate_message(oneof, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "textDelta":
      return { case: "textDelta", value: fromRedactedTextDeltaUpdate(oneof.value, purpose, opts) };
    case "partialToolCall":
      return { case: "partialToolCall", value: fromRedactedPartialToolCallUpdate(oneof.value, purpose, opts) };
    case "toolCallDelta":
      return { case: "toolCallDelta", value: fromRedactedToolCallDeltaUpdate(oneof.value, purpose, opts) };
    case "toolCallStarted":
      return { case: "toolCallStarted", value: fromRedactedToolCallStartedUpdate(oneof.value, purpose, opts) };
    case "toolCallCompleted":
      return { case: "toolCallCompleted", value: fromRedactedToolCallCompletedUpdate(oneof.value, purpose, opts) };
    case "thinkingDelta":
      return { case: "thinkingDelta", value: fromRedactedThinkingDeltaUpdate(oneof.value, purpose, opts) };
    case "thinkingCompleted":
      return { case: "thinkingCompleted", value: fromRedactedThinkingCompletedUpdate(oneof.value, purpose, opts) };
    case "userMessageAppended":
      return { case: "userMessageAppended", value: fromRedactedUserMessageAppendedUpdate(oneof.value, purpose, opts) };
    case "tokenDelta":
      return { case: "tokenDelta", value: fromRedactedTokenDeltaUpdate(oneof.value, purpose, opts) };
    case "summary":
      return { case: "summary", value: fromRedactedSummaryUpdate(oneof.value, purpose, opts) };
    case "summaryStarted":
      return { case: "summaryStarted", value: fromRedactedSummaryStartedUpdate(oneof.value, purpose, opts) };
    case "summaryCompleted":
      return { case: "summaryCompleted", value: fromRedactedSummaryCompletedUpdate(oneof.value, purpose, opts) };
    case "shellOutputDelta":
      return { case: "shellOutputDelta", value: fromRedactedShellOutputDeltaUpdate(oneof.value, purpose, opts) };
    case "heartbeat":
      return { case: "heartbeat", value: fromRedactedHeartbeatUpdate(oneof.value, purpose, opts) };
    case "turnEnded":
      return { case: "turnEnded", value: fromRedactedTurnEndedUpdate(oneof.value, purpose, opts) };
    case "stepStarted":
      return { case: "stepStarted", value: fromRedactedStepStartedUpdate(oneof.value, purpose, opts) };
    case "stepCompleted":
      return { case: "stepCompleted", value: fromRedactedStepCompletedUpdate(oneof.value, purpose, opts) };
    case "promptSuggestion":
      return { case: "promptSuggestion", value: fromRedactedPromptSuggestionUpdate(oneof.value, purpose, opts) };
    case "postRequestPrompt":
      return { case: "postRequestPrompt", value: fromRedactedPostRequestPromptUpdate(oneof.value, purpose, opts) };
    case "activeBranchChange":
      return { case: "activeBranchChange", value: fromRedactedActiveBranchChange(oneof.value, purpose, opts) };
    case "feedbackRequest":
      return { case: "feedbackRequest", value: fromRedactedFeedbackRequestUpdate(oneof.value, purpose, opts) };
    case "responseComparison":
      return { case: "responseComparison", value: fromRedactedResponseComparisonUpdate(oneof.value, purpose, opts) };
    case "contextInjectionState":
      return { case: "contextInjectionState", value: fromRedactedContextInjectionStateUpdate(oneof.value, purpose, opts) };
    case "routedModel":
      return { case: "routedModel", value: fromRedactedRoutedModelUpdate(oneof.value, purpose, opts) };
    case "grokBotNudge":
      return { case: "grokBotNudge", value: fromRedactedGrokBotNudgeUpdate(oneof.value, purpose, opts) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function toRedactedContextInjectionStateUpdate(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    injectionId: msg.injectionId,
    state: msg.state !== void 0 ? toRedactedContextInjectionState(msg.state, privacyMode) : void 0
  };
}
function fromRedactedContextInjectionStateUpdate(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new ContextInjectionStateUpdate({
    injectionId: msg.injectionId,
    state: msg.state !== void 0 ? fromRedactedContextInjectionState(msg.state, purpose, opts) : void 0
  });
}
function toRedactedPostRequestPromptUpdate(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    title: msg.title,
    message: msg.message,
    buttonLabel: msg.buttonLabel,
    buttonUrl: msg.buttonUrl
  };
}
function fromRedactedPostRequestPromptUpdate(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new PostRequestPromptUpdate({
    title: msg.title,
    message: msg.message,
    buttonLabel: msg.buttonLabel,
    buttonUrl: msg.buttonUrl
  });
}
function toRedactedGrokBotNudgeUpdate(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    job: msg.job,
    description: msg.description,
    showNumber: msg.showNumber
  };
}
function fromRedactedGrokBotNudgeUpdate(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new GrokBotNudgeUpdate({
    job: msg.job,
    description: msg.description,
    showNumber: msg.showNumber
  });
}
function toRedactedInteractionQuery(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    id: msg.id,
    query: toRedactedInteractionQuery_query(msg.query, privacyMode)
  };
}
function toRedactedInteractionQuery_query(oneof, privacyMode) {
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "webSearchRequestQuery":
      return { case: "webSearchRequestQuery", value: toRedactedWebSearchRequestQuery(oneof.value, privacyMode) };
    case "askQuestionInteractionQuery":
      return { case: "askQuestionInteractionQuery", value: toRedactedAskQuestionInteractionQuery(oneof.value, privacyMode) };
    case "switchModeRequestQuery":
      return { case: "switchModeRequestQuery", value: toRedactedSwitchModeRequestQuery(oneof.value, privacyMode) };
    case "createPlanRequestQuery":
      return { case: "createPlanRequestQuery", value: toRedactedCreatePlanRequestQuery(oneof.value, privacyMode) };
    case "setupVmEnvironmentArgs":
      return { case: "setupVmEnvironmentArgs", value: toRedactedSetupVmEnvironmentArgs(oneof.value, privacyMode) };
    case "webFetchRequestQuery":
      return { case: "webFetchRequestQuery", value: toRedactedWebFetchRequestQuery(oneof.value, privacyMode) };
    case "prManagementRequestQuery":
      return { case: "prManagementRequestQuery", value: toRedactedPrManagementRequestQuery(oneof.value, privacyMode) };
    case "mcpAuthRequestQuery":
      return { case: "mcpAuthRequestQuery", value: toRedactedMcpAuthRequestQuery(oneof.value, privacyMode) };
    case "generateImageRequestQuery":
      return { case: "generateImageRequestQuery", value: toRedactedGenerateImageRequestQuery(oneof.value, privacyMode) };
    case "replaceEnvArgs":
      return { case: "replaceEnvArgs", value: toRedactedReplaceEnvArgs(oneof.value, privacyMode) };
    case "connectScmRequestQuery":
      return { case: "connectScmRequestQuery", value: toRedactedConnectScmRequestQuery(oneof.value, privacyMode) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function fromRedactedInteractionQuery(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new InteractionQuery({
    id: msg.id,
    query: fromRedactedInteractionQuery_query(msg.query, purpose, opts)
  });
}
function fromRedactedInteractionQuery_query(oneof, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "webSearchRequestQuery":
      return { case: "webSearchRequestQuery", value: fromRedactedWebSearchRequestQuery(oneof.value, purpose, opts) };
    case "askQuestionInteractionQuery":
      return { case: "askQuestionInteractionQuery", value: fromRedactedAskQuestionInteractionQuery(oneof.value, purpose, opts) };
    case "switchModeRequestQuery":
      return { case: "switchModeRequestQuery", value: fromRedactedSwitchModeRequestQuery(oneof.value, purpose, opts) };
    case "createPlanRequestQuery":
      return { case: "createPlanRequestQuery", value: fromRedactedCreatePlanRequestQuery(oneof.value, purpose, opts) };
    case "setupVmEnvironmentArgs":
      return { case: "setupVmEnvironmentArgs", value: fromRedactedSetupVmEnvironmentArgs(oneof.value, purpose, opts) };
    case "webFetchRequestQuery":
      return { case: "webFetchRequestQuery", value: fromRedactedWebFetchRequestQuery(oneof.value, purpose, opts) };
    case "prManagementRequestQuery":
      return { case: "prManagementRequestQuery", value: fromRedactedPrManagementRequestQuery(oneof.value, purpose, opts) };
    case "mcpAuthRequestQuery":
      return { case: "mcpAuthRequestQuery", value: fromRedactedMcpAuthRequestQuery(oneof.value, purpose, opts) };
    case "generateImageRequestQuery":
      return { case: "generateImageRequestQuery", value: fromRedactedGenerateImageRequestQuery(oneof.value, purpose, opts) };
    case "replaceEnvArgs":
      return { case: "replaceEnvArgs", value: fromRedactedReplaceEnvArgs(oneof.value, purpose, opts) };
    case "connectScmRequestQuery":
      return { case: "connectScmRequestQuery", value: fromRedactedConnectScmRequestQuery(oneof.value, purpose, opts) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function toRedactedInteractionResponse(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    id: msg.id,
    result: toRedactedInteractionResponse_result(msg.result, privacyMode)
  };
}
function toRedactedInteractionResponse_result(oneof, privacyMode) {
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "webSearchRequestResponse":
      return { case: "webSearchRequestResponse", value: toRedactedWebSearchRequestResponse(oneof.value, privacyMode) };
    case "askQuestionInteractionResponse":
      return { case: "askQuestionInteractionResponse", value: toRedactedAskQuestionInteractionResponse(oneof.value, privacyMode) };
    case "switchModeRequestResponse":
      return { case: "switchModeRequestResponse", value: toRedactedSwitchModeRequestResponse(oneof.value, privacyMode) };
    case "createPlanRequestResponse":
      return { case: "createPlanRequestResponse", value: toRedactedCreatePlanRequestResponse(oneof.value, privacyMode) };
    case "setupVmEnvironmentResult":
      return { case: "setupVmEnvironmentResult", value: toRedactedSetupVmEnvironmentResult(oneof.value, privacyMode) };
    case "webFetchRequestResponse":
      return { case: "webFetchRequestResponse", value: toRedactedWebFetchRequestResponse(oneof.value, privacyMode) };
    case "prManagementResult":
      return { case: "prManagementResult", value: toRedactedPrManagementResult(oneof.value, privacyMode) };
    case "mcpAuthRequestResponse":
      return { case: "mcpAuthRequestResponse", value: toRedactedMcpAuthRequestResponse(oneof.value, privacyMode) };
    case "generateImageRequestResponse":
      return { case: "generateImageRequestResponse", value: toRedactedGenerateImageRequestResponse(oneof.value, privacyMode) };
    case "replaceEnvResult":
      return { case: "replaceEnvResult", value: toRedactedReplaceEnvResult(oneof.value, privacyMode) };
    case "connectScmRequestResponse":
      return { case: "connectScmRequestResponse", value: toRedactedConnectScmRequestResponse(oneof.value, privacyMode) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function fromRedactedInteractionResponse(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new InteractionResponse({
    id: msg.id,
    result: fromRedactedInteractionResponse_result(msg.result, purpose, opts)
  });
}
function fromRedactedInteractionResponse_result(oneof, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  if (!oneof || oneof.case === void 0) {
    return { case: void 0, value: void 0 };
  }
  switch (oneof.case) {
    case "webSearchRequestResponse":
      return { case: "webSearchRequestResponse", value: fromRedactedWebSearchRequestResponse(oneof.value, purpose, opts) };
    case "askQuestionInteractionResponse":
      return { case: "askQuestionInteractionResponse", value: fromRedactedAskQuestionInteractionResponse(oneof.value, purpose, opts) };
    case "switchModeRequestResponse":
      return { case: "switchModeRequestResponse", value: fromRedactedSwitchModeRequestResponse(oneof.value, purpose, opts) };
    case "createPlanRequestResponse":
      return { case: "createPlanRequestResponse", value: fromRedactedCreatePlanRequestResponse(oneof.value, purpose, opts) };
    case "setupVmEnvironmentResult":
      return { case: "setupVmEnvironmentResult", value: fromRedactedSetupVmEnvironmentResult(oneof.value, purpose, opts) };
    case "webFetchRequestResponse":
      return { case: "webFetchRequestResponse", value: fromRedactedWebFetchRequestResponse(oneof.value, purpose, opts) };
    case "prManagementResult":
      return { case: "prManagementResult", value: fromRedactedPrManagementResult(oneof.value, purpose, opts) };
    case "mcpAuthRequestResponse":
      return { case: "mcpAuthRequestResponse", value: fromRedactedMcpAuthRequestResponse(oneof.value, purpose, opts) };
    case "generateImageRequestResponse":
      return { case: "generateImageRequestResponse", value: fromRedactedGenerateImageRequestResponse(oneof.value, purpose, opts) };
    case "replaceEnvResult":
      return { case: "replaceEnvResult", value: fromRedactedReplaceEnvResult(oneof.value, purpose, opts) };
    case "connectScmRequestResponse":
      return { case: "connectScmRequestResponse", value: fromRedactedConnectScmRequestResponse(oneof.value, purpose, opts) };
    default:
      return { case: void 0, value: void 0 };
  }
}
function toRedactedAskQuestionInteractionQuery(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    args: msg.args !== void 0 ? toRedactedAskQuestionArgs(msg.args, privacyMode) : void 0,
    toolCallId: msg.toolCallId
  };
}
function fromRedactedAskQuestionInteractionQuery(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new AskQuestionInteractionQuery({
    args: msg.args !== void 0 ? fromRedactedAskQuestionArgs(msg.args, purpose, opts) : void 0,
    toolCallId: msg.toolCallId
  });
}
function toRedactedAskQuestionInteractionResponse(msg, privacyMode) {
  return {
    _privacyMode: privacyMode,
    result: msg.result !== void 0 ? toRedactedAskQuestionResult(msg.result, privacyMode) : void 0
  };
}
function fromRedactedAskQuestionInteractionResponse(msg, purpose, opts) {
  const redactUnallowedFieldsInsteadOfThrowing = opts?.redactUnallowedFieldsInsteadOfThrowing ?? false;
  const enforcing = opts?.enforcing;
  return new AskQuestionInteractionResponse({
    result: msg.result !== void 0 ? fromRedactedAskQuestionResult(msg.result, purpose, opts) : void 0
  });
}
