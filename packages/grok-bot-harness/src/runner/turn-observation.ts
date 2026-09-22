var MCP_EXEC_STALL_THRESHOLD_MS = 15 * 60 * 1e3;
function createTurnObservation(host, timing) {
  const mcpExecStallExpiry = timing?.mcpExecStallExpiry ?? createExpiryPolicy({
    name: "sand-mcp-exec-stall",
    ttlMs: MCP_EXEC_STALL_THRESHOLD_MS
  });
  const clock = timing?.clock ?? realClock;
  let onToolCallDiagnostic = void 0;
  function setToolCallDiagnosticHandler(handler) {
    onToolCallDiagnostic = handler;
  }
  function beginMcpExecObservation(call) {
    const startedPerfMs = clock.monotonicNow();
    const requestIdPart = call.requestId != null ? { requestId: call.requestId } : {};
    const windowIndexPart = call.windowIndex === void 0 ? {} : { windowIndex: call.windowIndex };
    const transport = call.resolveTransport === void 0 ? Promise.resolve("unknown") : call.resolveTransport().catch(() => "unknown");
    const stallArm = mcpExecStallExpiry.arm(call.toolCallId, () => {
      onToolCallDiagnostic?.({
        kind: "stalled",
        toolCallId: call.toolCallId,
        toolName: MCP_TOOL_CALL_OUTLINE_NAME,
        connector: call.connector,
        elapsedMs: Math.round(clock.monotonicNow() - startedPerfMs),
        ...requestIdPart
      });
    });
    let settled = false;
    return (settlement) => {
      if (settled) return;
      settled = true;
      stallArm.dispose();
      const durationMs = Math.round(clock.monotonicNow() - startedPerfMs);
      const errorClassPart = settlement.kind === "error" ? { errorClass: settlement.errorClass } : {};
      void transport.then((resolvedTransport) => {
        onToolCallDiagnostic?.({
          kind: "completed",
          toolCallId: call.toolCallId,
          toolName: MCP_TOOL_CALL_OUTLINE_NAME,
          connector: call.connector,
          mcpTool: call.mcpTool ?? OTHER_MCP_TOOL,
          transport: resolvedTransport,
          outcome: settlement.kind,
          ...errorClassPart,
          durationMs,
          ...requestIdPart,
          ...windowIndexPart
        });
      });
      switch (settlement.kind) {
        case "ok":
        case "tool_error":
          return;
        case "error":
          onToolCallDiagnostic?.({
            kind: "error",
            toolCallId: call.toolCallId,
            toolName: MCP_TOOL_CALL_OUTLINE_NAME,
            connector: call.connector,
            errorClass: settlement.errorClass,
            durationMs,
            ...requestIdPart
          });
          return;
        default: {
          const _exhaustive = settlement;
          return _exhaustive;
        }
      }
    };
  }
  let awaitObservationCount = 0;
  const pendingAwaits = /* @__PURE__ */ new Map();
  function observeAwaitToolCall(event, callId, toolCall, awaitingUserSelection) {
    if (onTurnAwait == null) return;
    if (toolCall.tool.case !== "awaitToolCall") return;
    const awaitCall = toolCall.tool.value;
    if (event === "toolCallStarted") {
      const index = ++awaitObservationCount;
      pendingAwaits.set(callId, {
        index,
        blockUntilMs: awaitBlockUntilMs(awaitCall)
      });
      return;
    }
    if (event === "toolCallCompleted") {
      const pending = pendingAwaits.get(callId);
      pendingAwaits.delete(callId);
      onTurnAwait({
        awaitIndex: pending?.index ?? ++awaitObservationCount,
        blockUntilMs: pending?.blockUntilMs ?? awaitBlockUntilMs(awaitCall),
        outcome: host.isActiveRunCanceled() || awaitingUserSelection ? cancelledAwaitOutcome() : classifyCompletedAwaitOutcome(awaitCall)
      });
    }
  }
  function cancelledAwaitOutcome() {
    return host.isActiveRunInterrupted() ? "aborted" : "clean_stop";
  }
  function flushPendingAwaitsOnUnwind() {
    if (onTurnAwait != null && pendingAwaits.size > 0) {
      const outcome = cancelledAwaitOutcome();
      for (const pending of pendingAwaits.values()) {
        onTurnAwait({
          awaitIndex: pending.index,
          blockUntilMs: pending.blockUntilMs,
          outcome
        });
      }
    }
    pendingAwaits.clear();
    awaitObservationCount = 0;
  }
  const recentActivity = [];
  let observedToolCallCount = 0;
  function recordToolActivity(update) {
    if (update.status === "done" || update.status === "failed") {
      observedToolCallCount++;
    }
    const summary = update.summary != null && update.summary.length > 0 ? `: ${update.summary}` : "";
    const line = `[${update.status}] ${update.name}${summary}`;
    if (recentActivity[recentActivity.length - 1] === line) return;
    recentActivity.push(line);
    const maxEntries = 24;
    if (recentActivity.length > maxEntries) {
      recentActivity.splice(0, recentActivity.length - maxEntries);
    }
  }
  function getActivitySnapshot() {
    return [...recentActivity];
  }
  function getObservedToolCallCount() {
    return observedToolCallCount;
  }
  function setTurnAwaitHandler(handler) {
    onTurnAwait = handler;
  }
  function setTurnRetryHandler(handler) {
    onTurnRetry = handler;
  }
  function reportTurnRetry(observation) {
    onTurnRetry?.(observation);
  }
  function setFirstTokenHandler(handler) {
    onFirstToken = handler;
  }
  function setSendDispatchHandler(handler) {
    onSendDispatch = handler;
  }
  function setAsyncTasksEventHandler(handler) {
    onAsyncTasksChanged = handler;
  }
  function emitAsyncTasksChanged() {
    onAsyncTasksChanged?.({
      parentAgentId: host.getConversationId(),
      tasks: listAsyncTasks()
    });
  }
  function listAsyncTasks() {
    const tasks = [];
    for (const [subagentId, record2] of host.subagentRegistryEntries()) {
      if (record2.status !== "running") continue;
      if (host.isSubagentAborting(subagentId)) continue;
      tasks.push({
        kind: "subagent",
        id: subagentId,
        label: record2.title,
        ...record2.labelKind != null && record2.labelParams != null ? { labelKind: record2.labelKind, labelParams: record2.labelParams } : {},
        status: "running",
        startedAtMs: record2.startedAtMs,
        detail: record2.subagentType,
        subagentType: record2.subagentType
      });
    }
    const registeredShellIds = /* @__PURE__ */ new Set();
    for (const work of host.listBackgroundShellWork({
      kind: "shell"
    }) ?? []) {
      if (work.state !== "running") continue;
      registeredShellIds.add(work.id);
      const metadata = decodeBackgroundWorkMetadata(work.metadata);
      const fallback2 = asyncTaskFallbackLabel("shell", work.id);
      tasks.push({
        kind: "shell",
        id: work.id,
        label: metadata.title ?? fallback2.text,
        ...metadata.title == null ? { labelKind: fallback2.labelKind, labelParams: fallback2.labelParams } : {},
        status: "running",
        startedAtMs: metadata.startTimeMs ?? 0
      });
    }
    for (const [shellId, rewatch] of host.shellRewatchEntries()) {
      if (registeredShellIds.has(shellId)) continue;
      tasks.push({
        kind: "shell",
        id: shellId,
        label: rewatch.title,
        ...rewatch.labelKind != null && rewatch.labelParams != null ? { labelKind: rewatch.labelKind, labelParams: rewatch.labelParams } : {},
        status: "running",
        startedAtMs: rewatch.startedAtMs,
        detail: ASYNC_TASK_REATTACHED_DETAIL,
        detailKind: "reattached_after_host_restart"
      });
    }
    for (const [bcId, watch4] of host.cloudAgentWatchEntries()) {
      tasks.push({
        kind: "cloud-agent",
        id: bcId,
        label: watch4.title,
        labelKind: watch4.labelKind,
        labelParams: watch4.labelParams,
        status: "running",
        startedAtMs: watch4.startedAtMs
      });
    }
    return tasks.sort((a, b2) => a.startedAtMs - b2.startedAtMs || a.id.localeCompare(b2.id));
  }
  let onAsyncTasksChanged = void 0;
  let onTurnAwait = void 0;
  let onTurnRetry = void 0;
  let onFirstToken = void 0;
  let onSendDispatch = void 0;
  function armDispatchObservation(deps) {
    let pendingFirstToken = void 0;
    let runResolvedModelId = void 0;
    const dispatchPerfMs = clock.monotonicNow();
    const dispatchEpochMs = Date.now();
    if (deps.enterEpochMs !== void 0 && Number.isFinite(deps.enterEpochMs)) {
      try {
        const hostDispatchMs = Math.max(0, Math.round(dispatchPerfMs - deps.hostReceiptPerfMs));
        const rawDeltaMs = dispatchEpochMs - deps.enterEpochMs;
        const sanitized = sanitizeCrossClockDurationMs(rawDeltaMs, SEND_DISPATCH_MAX_PLAUSIBLE_MS);
        const skew = sanitized.skewReason !== void 0;
        if (sanitized.ms !== void 0) {
          recordCompletedSpanIfParented(
            deps.runCtx.withName("send-dispatch"),
            {
              startTime: new Date(dispatchEpochMs - sanitized.ms),
              attributes: {
                "sand.send_dispatch_ms": sanitized.ms,
                "sand.conversation_id": deps.conversationId
              }
            },
            new Date(dispatchEpochMs)
          );
          deps.setRunAttribute("sand.send_dispatch_ms", sanitized.ms);
        } else {
          deps.setRunAttribute("sand.send_dispatch_skew_reason", sanitized.skewReason);
        }
        deps.setRunAttribute("sand.send_dispatch_host_ms", hostDispatchMs);
        onSendDispatch?.({
          dispatchMs: sanitized.ms,
          hostDispatchMs,
          skew,
          skewReason: sanitized.skewReason,
          skewBucket: skew ? bucketClockSkewDeltaMs(rawDeltaMs) : void 0,
          isFork: deps.isFork,
          modelId: deps.resolveModelId(),
          traceId: deps.traceId,
          spanId: deps.spanId
        });
      } catch (error42) {
        process.stderr.write(
          `sand.turn.send_dispatch_observation_failed error_class=${errorLogTag(error42)}
`
        );
      }
    }
    let firstTokenObserved = false;
    const observeFirstToken = (chunkType) => {
      if (firstTokenObserved) return;
      firstTokenObserved = true;
      try {
        const rawTtftMs = clock.monotonicNow() - dispatchPerfMs;
        const sanitized = sanitizeCrossClockDurationMs(rawTtftMs, TTFT_MAX_PLAUSIBLE_MS);
        const skew = sanitized.skewReason !== void 0;
        if (sanitized.ms !== void 0) {
          recordCompletedSpanIfParented(
            deps.runCtx.withName("time-to-first-token"),
            {
              startTime: new Date(dispatchEpochMs),
              attributes: {
                "sand.ttft_ms": sanitized.ms,
                "sand.ttft_chunk_type": chunkType,
                "sand.conversation_id": deps.conversationId
              }
            },
            new Date(dispatchEpochMs + sanitized.ms)
          );
          deps.setRunAttribute("sand.ttft_ms", sanitized.ms);
        } else {
          deps.setRunAttribute("sand.ttft_skew_reason", sanitized.skewReason);
        }
        deps.addRunEvent("first_token", { chunk_type: chunkType });
        const emitObservation = (modelId) => {
          onFirstToken?.({
            ttftMs: sanitized.ms,
            skew,
            skewReason: sanitized.skewReason,
            chunkType,
            isFork: deps.isFork,
            modelId: modelId ?? deps.resolveModelId(),
            traceId: deps.traceId,
            spanId: deps.spanId
          });
        };
        if (runResolvedModelId !== void 0) {
          emitObservation(runResolvedModelId);
        } else {
          pendingFirstToken = emitObservation;
        }
      } catch (error42) {
        process.stderr.write(
          `sand.turn.first_token_observation_failed error_class=${errorLogTag(error42)}
`
        );
      }
    };
    return {
      observeFirstToken,
      noteModelResolved: (modelId) => {
        runResolvedModelId = modelId;
        const pending = pendingFirstToken;
        pendingFirstToken = void 0;
        pending?.(modelId);
      },
      settle: () => {
        const pending = pendingFirstToken;
        pendingFirstToken = void 0;
        pending?.(void 0);
      }
    };
  }
  return {
    setTurnAwaitHandler,
    setTurnRetryHandler,
    setFirstTokenHandler,
    setSendDispatchHandler,
    setAsyncTasksEventHandler,
    setToolCallDiagnosticHandler,
    reportToolCallDiagnostic: (observation) => {
      onToolCallDiagnostic?.(observation);
    },
    beginMcpExecObservation,
    reportTurnRetry,
    emitFirstToken: (observation) => {
      onFirstToken?.(observation);
    },
    emitSendDispatch: (observation) => {
      onSendDispatch?.(observation);
    },
    armDispatchObservation,
    observeAwaitToolCall,
    cancelledAwaitOutcome,
    flushPendingAwaitsOnUnwind,
    recordToolActivity,
    getActivitySnapshot,
    getObservedToolCallCount,
    emitAsyncTasksChanged,
    listAsyncTasks
  };
}
