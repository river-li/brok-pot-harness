/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/subagent-run-completion.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_subagents_pb();
function normalizeNonEmptyString(value) {
  const normalized = value?.trim();
  return normalized !== void 0 && normalized.length > 0 ? normalized : void 0;
}
function subagentRunStatusFromCompletionStatus(status) {
  switch (status) {
    case BackgroundTaskStatus.SUCCESS:
      return SubagentRunStatus.SUCCESS;
    case BackgroundTaskStatus.ERROR:
      return SubagentRunStatus.ERROR;
    case BackgroundTaskStatus.ABORTED:
      return SubagentRunStatus.ABORTED;
    case BackgroundTaskStatus.UNSPECIFIED:
      return SubagentRunStatus.UNSPECIFIED;
    default: {
      const _exhaustive = status;
      return _exhaustive;
    }
  }
}
function isTerminalSubagentRunStatus(status) {
  switch (status) {
    case SubagentRunStatus.SUCCESS:
    case SubagentRunStatus.ERROR:
    case SubagentRunStatus.ABORTED:
      return true;
    case SubagentRunStatus.UNSPECIFIED:
    case SubagentRunStatus.RUNNING:
    case SubagentRunStatus.BACKGROUNDED:
      return false;
    default: {
      const _exhaustive = status;
      return _exhaustive;
    }
  }
}
function subagentRunParentToolCallId(completion) {
  if (completion.kind !== BackgroundTaskKind.SUBAGENT || completion.reason === BackgroundTaskCompletionReason.TASK_PROGRESS || // A worker's mid-turn message to its coordinator reuses the completion
  // shape for transport but is not a run completion: the worker's turn may
  // still be running.
  completion.reason === BackgroundTaskCompletionReason.WORKER_MESSAGE) {
    return void 0;
  }
  return normalizeNonEmptyString(completion.toolCallId);
}
function subagentRunStateFromCompletion(args) {
  const { completion, existingRun, persistedSubagentState } = args;
  const parentToolCallId = subagentRunParentToolCallId(completion);
  if (parentToolCallId === void 0) {
    return void 0;
  }
  if (existingRun !== void 0 && isTerminalSubagentRunStatus(existingRun.status) && completion.completedAtMs !== void 0 && existingRun.completedTimestampMs !== void 0 && completion.completedAtMs < existingRun.completedTimestampMs) {
    return void 0;
  }
  const subagentId = normalizeNonEmptyString(completion.subagentId) ?? normalizeNonEmptyString(completion.taskId);
  const persistedEnvironment = persistedSubagentState?.environment !== void 0 && persistedSubagentState.environment !== SubagentExecutionEnvironment.UNSPECIFIED ? persistedSubagentState.environment : void 0;
  const existingEnvironment = existingRun?.environment !== void 0 && existingRun.environment !== SubagentExecutionEnvironment.UNSPECIFIED ? existingRun.environment : void 0;
  const completionReason = completion.reason !== BackgroundTaskCompletionReason.UNSPECIFIED ? completion.reason : existingRun?.completionReason;
  const status = completion.status !== BackgroundTaskStatus.UNSPECIFIED ? subagentRunStatusFromCompletionStatus(completion.status) : existingRun?.status ?? SubagentRunStatus.UNSPECIFIED;
  return new SubagentRunState({
    parentToolCallId,
    subagentId,
    environment: persistedEnvironment ?? existingEnvironment ?? SubagentExecutionEnvironment.UNSPECIFIED,
    status,
    title: normalizeNonEmptyString(completion.title) ?? existingRun?.title,
    detail: normalizeNonEmptyString(completion.detail) ?? existingRun?.detail,
    transcriptPath: normalizeNonEmptyString(persistedSubagentState?.cloudSubagent?.transcriptPath) ?? existingRun?.transcriptPath,
    outputPath: normalizeNonEmptyString(completion.outputPath) ?? existingRun?.outputPath,
    completedTimestampMs: completion.completedAtMs ?? existingRun?.completedTimestampMs ?? BigInt(Date.now()),
    completionReason
  });
}

