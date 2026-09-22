/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/runner/subagent-runtime.ts
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var SUBAGENT_STALL_THRESHOLD_MS = MCP_EXEC_STALL_THRESHOLD_MS;
function subagentSteerRunOptions(meta) {
  const parentToolCallPart = meta.toolCallId.length > 0 ? { parentAgentToolCallId: meta.toolCallId } : {};
  return {
    inferenceRequestId: meta.subagentRequestId,
    ...meta.lineage != null ? { lineage: { ...meta.lineage, ...parentToolCallPart } } : {}
  };
}
function createSubagentRuntime(host, timing) {
  const subagentStallExpiry = timing?.subagentStallExpiry ?? createExpiryPolicy({
    name: "sand-subagent-stall",
    ttlMs: SUBAGENT_STALL_THRESHOLD_MS
  });
  const subagentSessions = /* @__PURE__ */ new Map();
  const backgroundSubagentRuns = /* @__PURE__ */ new Map();
  const subagentMeta = /* @__PURE__ */ new Map();
  const subagentRegistry = /* @__PURE__ */ new Map();
  const subagentOutlines = /* @__PURE__ */ new Map();
  const subagentStallArms = /* @__PURE__ */ new Map();
  const pendingSubagentSteers = /* @__PURE__ */ new Map();
  const abortingSubagents = /* @__PURE__ */ new Set();
  const abortReasons = /* @__PURE__ */ new Map();
  const abortCleanups = /* @__PURE__ */ new Map();
  let onBackgroundSubagentDispatched = void 0;
  let onBackgroundSubagentSettled = void 0;
  let onSubagentsChanged = void 0;
  function dispatchBackgroundSubagent(params) {
    host.subagentOwnership?.assertOpen();
    const existing = backgroundSubagentRuns.get(params.subagentAgentId);
    if (existing !== void 0) return existing;
    const titleFields = deriveBackgroundSubagentTitleFields(params.prompt, params.subagentAgentId);
    const startedAtMs = Date.now();
    const parentAgentId = host.getConversationId();
    const subagentRequestId = params.subagentRequestId ?? computeSubagentRequestId(params.toolCallId);
    const decision = host.getCombinedComputerUseDecision?.();
    subagentMeta.set(params.subagentAgentId, {
      ...params.resume === true ? { resume: true } : {},
      ...decision === void 0 ? {} : { combinedComputerUseDecision: decision },
      parentAgentId,
      subagentType: params.subagentType,
      toolCallId: params.toolCallId,
      subagentRequestId,
      ...titleFields,
      startedAtMs,
      ...params.lineage != null ? { lineage: params.lineage } : {},
      ...params.eventSequence === void 0 ? {} : { eventSequence: params.eventSequence },
      ...params.quietOrigin != null ? { quietOrigin: params.quietOrigin } : {},
      ...params.automationRunUuid != null ? { automationRunUuid: params.automationRunUuid } : {}
    });
    subagentRegistry.set(params.subagentAgentId, {
      subagentType: params.subagentType,
      ...titleFields,
      startedAtMs,
      status: "running"
    });
    logSubagentLifecycle("dispatched", params.subagentAgentId);
    onBackgroundSubagentDispatched?.({
      ...params.resume === true ? { resume: true } : {},
      parentAgentId,
      subagentAgentId: params.subagentAgentId,
      subagentType: params.subagentType,
      toolCallId: params.toolCallId,
      subagentRequestId,
      ...params.lineage != null ? { parentRequestId: params.lineage.parentRequestId } : {}
    });
    host.onPendingWakeArmed?.({
      parentAgentId,
      kind: "subagent",
      workId: params.subagentAgentId,
      ...titleFields,
      subagentType: params.subagentType,
      ...params.automationRunUuid != null ? { automationRunUuid: params.automationRunUuid } : {},
      ...params.quietOrigin != null ? { quietOrigin: params.quietOrigin } : {}
    });
    emitSubagentsChanged();
    host.emitAsyncTasksChanged();
    return startBackgroundSubagentTurn(params.subagentAgentId, params.run);
  }
  function startBackgroundSubagentTurn(subagentAgentId, runTurn) {
    armSubagentStallWatchdog(subagentAgentId);
    let turn;
    try {
      turn = runTurn();
    } catch (error3) {
      turn = Promise.reject(error3);
    }
    const promise = turn.then(
      (result) => {
        const parentWake = result.automationParentWake?.trim();
        let text2 = result.finalAssistantText?.trim() ?? "";
        let parentWakeRequested = false;
        if (parentWake !== void 0 && parentWake.length > 0) {
          text2 = parentWake;
          parentWakeRequested = true;
        }
        let outcome;
        if (result.aborted) {
          outcome = { status: "aborted" };
        } else if (parentWakeRequested) {
          outcome = {
            status: "completed",
            text: text2,
            sentMessageCount: result.sentMessageCount,
            parentWakeRequested: true
          };
        } else {
          outcome = {
            status: "completed",
            text: text2,
            sentMessageCount: result.sentMessageCount
          };
        }
        return settleBackgroundSubagentTurn(subagentAgentId, outcome);
      },
      (error3) => settleBackgroundSubagentTurn(subagentAgentId, {
        status: "error",
        error: errorMessage(error3),
        cause: error3
      })
    );
    backgroundSubagentRuns.set(subagentAgentId, promise);
    void promise.then(
      () => {
        if (backgroundSubagentRuns.get(subagentAgentId) === promise) {
          backgroundSubagentRuns.delete(subagentAgentId);
        }
      },
      () => {
        if (backgroundSubagentRuns.get(subagentAgentId) === promise) {
          backgroundSubagentRuns.delete(subagentAgentId);
        }
      }
    );
    host.subagentOwnership?.join(owner);
    return promise;
  }
  function armSubagentStallWatchdog(subagentAgentId) {
    const armedPerfMs = performance.now();
    subagentStallArms.get(subagentAgentId)?.dispose();
    subagentStallArms.set(
      subagentAgentId,
      subagentStallExpiry.arm(subagentAgentId, () => {
        subagentStallArms.delete(subagentAgentId);
        const meta = subagentMeta.get(subagentAgentId);
        host.onSubagentStalled?.({
          parentAgentId: meta?.parentAgentId ?? host.getConversationId(),
          subagentAgentId,
          subagentType: meta?.subagentType ?? "unknown",
          elapsedMs: Math.round(performance.now() - armedPerfMs)
        });
      })
    );
  }
  async function settleBackgroundSubagentTurn(subagentAgentId, outcome) {
    subagentStallArms.get(subagentAgentId)?.dispose();
    subagentStallArms.delete(subagentAgentId);
    const pendingSteer = pendingSubagentSteers.get(subagentAgentId);
    const runner = subagentSessions.get(subagentAgentId);
    const meta = subagentMeta.get(subagentAgentId);
    if (pendingSteer != null && runner != null && !abortingSubagents.has(subagentAgentId)) {
      pendingSubagentSteers.delete(subagentAgentId);
      return startBackgroundSubagentTurn(subagentAgentId, () => {
        const prompt = formatSteerPrompt(pendingSteer);
        return meta == null ? runner.run(prompt) : runner.run(prompt, subagentSteerRunOptions(meta));
      });
    }
    pendingSubagentSteers.delete(subagentAgentId);
    const cleanup = abortCleanups.get(subagentAgentId);
    if (cleanup !== void 0) {
      await cleanup;
      abortCleanups.delete(subagentAgentId);
    }
    const aborted2 = abortingSubagents.delete(subagentAgentId);
    const abortReason2 = abortReasons.get(subagentAgentId);
    abortReasons.delete(subagentAgentId);
    const record2 = subagentRegistry.get(subagentAgentId);
    if (record2 != null) {
      record2.status = (() => {
        if (aborted2 || outcome.status === "aborted") return "aborted";
        if (outcome.status === "completed") return "done";
        return "error";
      })();
      logSubagentLifecycle("settled", subagentAgentId, record2.status);
      emitSubagentsChanged();
    }
    host.emitAsyncTasksChanged();
    if (runner != null) {
      try {
        subagentOutlines.set(subagentAgentId, await runner.getResolvedOutline());
      } catch (error3) {
        process.stderr.write(
          `sand.subagent.outline_resolve_failed error_class=${errorLogTag(error3)}
`
        );
      }
    }
    host.computerUse.freeWindow(subagentAgentId);
    subagentSessions.delete(subagentAgentId);
    subagentMeta.delete(subagentAgentId);
    if (meta != null && (isComputerUseSubagentType(meta.subagentType) || meta.subagentType === "browserUse")) {
      const usage = runner?.getComputerUseUsageSnapshot();
      const reportBase = {
        ...meta.resume === true ? { resume: true } : {},
        ...meta.combinedComputerUseDecision === void 0 ? {} : { combinedComputerUseDecision: meta.combinedComputerUseDecision },
        ...meta.lineage === void 0 ? {} : { parentRequestId: meta.lineage.parentRequestId },
        toolCallId: meta.toolCallId,
        abortReason: abortReason2 ?? "unknown",
        parentAgentId: meta.parentAgentId,
        subagentAgentId,
        subagentType: meta.subagentType,
        subagentRequestId: meta.subagentRequestId,
        modelId: usage?.modelId,
        durationMs: Math.max(0, Date.now() - meta.startedAtMs),
        toolCallCount: runner?.getObservedToolCallCount() ?? 0,
        turnEndedCount: usage?.turnEndedCount ?? 0,
        usage: usage?.usage
      };
      if (aborted2 || outcome.status === "aborted") {
        host.onComputerUseUsage?.({ ...reportBase, outcome: "aborted" });
      } else if (outcome.status === "error") {
        host.onComputerUseUsage?.({ ...reportBase, outcome: "error", error: outcome.cause });
      } else {
        host.onComputerUseUsage?.({ ...reportBase, outcome: "completed" });
      }
      if (isComputerUseSubagentType(meta.subagentType) && host.actionAuditor != null && runner != null) {
        host.actionAuditor.record({
          ...computerUseSessionAuditRecord({
            agentId: host.getConversationId(),
            boxId: host.resolveBoxId(),
            lineage: meta.lineage,
            subagentId: subagentAgentId,
            toolCallId: meta.toolCallId,
            actionCounts: runner.getComputerUseAuditActionCounts(),
            startedAtMs: meta.startedAtMs
          }),
          sequence: meta.eventSequence
        });
      }
    }
    if (aborted2) {
      return;
    }
    if (meta == null) {
      console.warn(
        `[sand][subagent] cannot notify parent of completion: missing dispatch meta for ${subagentAgentId} (status=${outcome.status})`
      );
      return;
    }
    const settled = onBackgroundSubagentSettled;
    if (settled == null) {
      console.warn(
        `[sand][subagent] no background-subagent settle handler wired; parent ${meta.parentAgentId} will not be notified that ${subagentAgentId} finished (status=${outcome.status})`
      );
      return;
    }
    await settled({
      parentAgentId: meta.parentAgentId,
      subagentAgentId,
      subagentType: meta.subagentType,
      toolCallId: meta.toolCallId,
      title: meta.title,
      status: outcome.status === "completed" ? "completed" : "error",
      result: (() => {
        if (outcome.status === "completed") {
          return outcome.text.trim();
        }
        if (outcome.status === "aborted") {
          return "The background task was interrupted before it finished.";
        }
        return outcome.error;
      })(),
      ...meta.quietOrigin != null ? { quietOrigin: meta.quietOrigin } : {},
      ...meta.automationRunUuid != null ? { automationRunUuid: meta.automationRunUuid } : {},
      ...outcome.status === "completed" && outcome.parentWakeRequested === true ? { parentWakeRequested: true } : {}
    });
  }
  function buildRunningSubagentInfo(subagentAgentId) {
    if (!backgroundSubagentRuns.has(subagentAgentId) || subagentRegistry.get(subagentAgentId)?.status !== "running") {
      return null;
    }
    const meta = subagentMeta.get(subagentAgentId);
    if (meta == null) return null;
    const runner = subagentSessions.get(subagentAgentId);
    return {
      subagentId: subagentAgentId,
      subagentType: meta.subagentType,
      title: meta.title,
      elapsedMs: Math.max(0, Date.now() - meta.startedAtMs),
      toolCallCount: runner?.getObservedToolCallCount() ?? 0,
      recentActivity: runner?.getActivitySnapshot() ?? [],
      transcriptPath: runner?.getTranscriptPath() ?? null
    };
  }
  function emitSubagentsChanged() {
    onSubagentsChanged?.({
      parentAgentId: host.getConversationId(),
      subagents: listSubagents()
    });
  }
  function logSubagentLifecycle(phase, subagentAgentId, status) {
    const record2 = subagentRegistry.get(subagentAgentId);
    const label = record2 != null ? ` [${record2.subagentType}] "${record2.title}"` : "";
    const suffix = status != null ? ` status=${status}` : "";
    console.log(`[sand][subagent] ${phase} ${subagentAgentId}${label}${suffix}`);
  }
  function listRunningSubagents() {
    const infos = [];
    for (const subagentAgentId of backgroundSubagentRuns.keys()) {
      const info2 = buildRunningSubagentInfo(subagentAgentId);
      if (info2 != null) infos.push(info2);
    }
    return infos;
  }
  function getRunningSubagent(subagentAgentId) {
    return buildRunningSubagentInfo(subagentAgentId);
  }
  function steerSubagent(subagentAgentId, message) {
    const runner = subagentSessions.get(subagentAgentId);
    if (runner == null || !backgroundSubagentRuns.has(subagentAgentId) || subagentRegistry.get(subagentAgentId)?.status !== "running") {
      return "not-running";
    }
    if (abortingSubagents.has(subagentAgentId)) return "not-running";
    pendingSubagentSteers.set(subagentAgentId, message);
    runner.interrupt("Steering message from the parent agent.");
    return "ok";
  }
  function abortSubagent(params) {
    const { subagentAgentId, reason = "Stopped by the parent agent." } = params;
    const runner = subagentSessions.get(subagentAgentId);
    if (runner == null || !backgroundSubagentRuns.has(subagentAgentId) || subagentRegistry.get(subagentAgentId)?.status !== "running") {
      return "not-running";
    }
    if (abortingSubagents.has(subagentAgentId)) return "ok";
    abortingSubagents.add(subagentAgentId);
    abortReasons.set(subagentAgentId, params.reason === void 0 ? "parent_stop" : "owner_abort");
    pendingSubagentSteers.delete(subagentAgentId);
    const meta = subagentMeta.get(subagentAgentId);
    if (meta != null) {
      host.onPendingWakeDisarmed?.({
        parentAgentId: meta.parentAgentId,
        kind: "subagent",
        workId: subagentAgentId
      });
    }
    host.emitAsyncTasksChanged();
    const cleanup = (async () => {
      try {
        if (runner.abortBackgroundWork !== void 0) {
          await runner.abortBackgroundWork(reason);
        } else {
          runner.interrupt(reason);
        }
      } catch (error3) {
        process.stderr.write(
          `sand.subagent.abort_cleanup_failed subagent_agent_id=${subagentAgentId} error_class=${errorLogTag(error3)}
`
        );
      }
    })();
    abortCleanups.set(subagentAgentId, cleanup);
    return "ok";
  }
  function listSubagents() {
    return [...subagentRegistry.entries()].map(([subagentId, record2]) => ({
      subagentId,
      subagentType: record2.subagentType,
      title: record2.title,
      status: record2.status,
      startedAtMs: record2.startedAtMs
    })).sort((a, b2) => a.startedAtMs - b2.startedAtMs);
  }
  function hasSubagent(subagentAgentId) {
    return subagentRegistry.has(subagentAgentId);
  }
  function hasRunningSubagents() {
    for (const record2 of subagentRegistry.values()) {
      if (record2.status === "running") return true;
    }
    return false;
  }
  async function getSubagentOutline(subagentAgentId) {
    const live = subagentSessions.get(subagentAgentId);
    if (live != null) return live.getResolvedOutline();
    return subagentOutlines.get(subagentAgentId) ?? [];
  }
  async function drainBackgroundSubagents() {
    while (backgroundSubagentRuns.size > 0) {
      await Promise.allSettled([...backgroundSubagentRuns.values()]);
    }
  }
  function setBackgroundSubagentHandler(handler) {
    onBackgroundSubagentSettled = handler;
  }
  function setBackgroundSubagentDispatchHandler(handler) {
    onBackgroundSubagentDispatched = (dispatch) => {
      const decision = host.getCombinedComputerUseDecision?.();
      handler({
        ...dispatch,
        ...decision === void 0 ? {} : { combinedComputerUseDecision: decision }
      });
    };
  }
  function setSubagentEventHandler(handler) {
    onSubagentsChanged = handler;
  }
  const owner = {
    listRunningSubagents,
    getRunningSubagent,
    steerSubagent,
    abortSubagent: (subagentAgentId) => abortSubagent({ subagentAgentId }),
    isRunning: (subagentAgentId) => backgroundSubagentRuns.has(subagentAgentId),
    hasPendingWork: () => backgroundSubagentRuns.size > 0,
    abortAll: (reason) => {
      for (const subagentAgentId of backgroundSubagentRuns.keys()) {
        abortSubagent({ subagentAgentId, reason });
      }
    },
    drain: drainBackgroundSubagents
  };
  return {
    getCombinedComputerUseDecision: () => host.getCombinedComputerUseDecision?.(),
    sessions: subagentSessions,
    registryEntries: () => subagentRegistry.entries(),
    notifyBackgroundWorkSettled: (completion) => {
      void onBackgroundSubagentSettled?.(completion);
    },
    reset: () => {
      subagentSessions.clear();
      subagentRegistry.clear();
      subagentOutlines.clear();
      emitSubagentsChanged();
    },
    isAborting: (subagentAgentId) => abortingSubagents.has(subagentAgentId),
    wasAborted: (subagentAgentId) => abortingSubagents.has(subagentAgentId) || subagentRegistry.get(subagentAgentId)?.status === "aborted",
    isRunning: (subagentAgentId) => backgroundSubagentRuns.has(subagentAgentId),
    dispatchBackgroundSubagent,
    startBackgroundSubagentTurn,
    listRunningSubagents,
    getRunningSubagent,
    steerSubagent,
    abortSubagent,
    listSubagents,
    hasSubagent,
    hasRunningSubagents,
    getSubagentOutline,
    drainBackgroundSubagents,
    setBackgroundSubagentHandler,
    setBackgroundSubagentDispatchHandler,
    setSubagentEventHandler
  };
}

