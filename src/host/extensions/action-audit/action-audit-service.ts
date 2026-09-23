var ACTION_AUDIT_FLUSH_INTERVAL_MS = 5e3;
var MAX_BATCH_SIZE = 50;
var MAX_PENDING_EVENTS = 2e3;
var FLUSH_FAILURE_BACKOFF_MS = 3e4;
function flushFailureBackoffMs(error42, nowMs2) {
  if (!isRateLimitConnectError(error42)) return FLUSH_FAILURE_BACKOFF_MS;
  return Math.max(getConnectRetryAfterMs(error42, nowMs2) ?? 0, FLUSH_FAILURE_BACKOFF_MS);
}
function outboxPath() {
  return (0, import_node_path82.join)(getSandAgentsRootDir(), "audit-outbox.json");
}
function auditJsonlPath(agentId) {
  return (0, import_node_path82.join)(resolveSandAgentDir(agentId), "audit.jsonl");
}
var MCP_TRANSPORT_FORWARDED_TO_BACKEND = {
  stdio: true,
  http: false,
  unknown: false
};
function isBackendForwardable(record2) {
  return record2.action.kind !== "mcpToolCall" || MCP_TRANSPORT_FORWARDED_TO_BACKEND[record2.action.transport];
}
function localJsonlLine(record2, eventId) {
  const action = record2.action;
  const base = {
    ts: new Date(record2.occurredAtMs).toISOString(),
    agentId: record2.agentId,
    eventId,
    ...record2.turnId != null && record2.turnId.length > 0 ? { turnId: record2.turnId } : {}
  };
  switch (action.kind) {
    case "mcpToolCall":
      return `${JSON.stringify({
        ...base,
        type: "mcp_tool_call",
        serverIdentifier: action.serverIdentifier,
        toolName: action.toolName,
        toolCallId: action.toolCallId,
        transport: action.transport,
        status: action.status,
        durationMs: action.durationMs
      })}
`;
    case "browserNavigation":
      return `${JSON.stringify({
        ...base,
        type: "browser_navigation",
        url: action.url,
        pageTitle: action.pageTitle
      })}
`;
    case "computerUseSession":
      return `${JSON.stringify({
        ...base,
        type: "computer_use_session",
        toolCallId: action.toolCallId ?? "",
        actionCount: action.actionCount,
        actionCounts: action.actionCounts,
        durationMs: action.durationMs,
        screenshotCount: action.screenshotCount
      })}
`;
    case "shellCommand":
      return `${JSON.stringify({
        ...base,
        type: "shell_command",
        command: action.command,
        shellKind: action.shellKind,
        target: action.target,
        machineId: action.machineId,
        exitCode: action.exitCode,
        durationMs: action.durationMs
      })}
`;
    case "toolResult":
      return `${JSON.stringify({
        ...base,
        type: "tool_result",
        toolCallId: record2.toolCallId ?? "",
        toolName: action.toolName,
        outcome: action.outcome,
        durationMs: action.durationMs,
        ...action.errorCategory === void 0 ? {} : { errorCategory: action.errorCategory },
        ...action.targetHost === void 0 ? {} : { targetHost: action.targetHost }
      })}
`;
    case "messageDelivery":
      return `${JSON.stringify({
        ...base,
        type: "message_delivery",
        toolCallId: record2.toolCallId ?? "",
        destinationType: action.destinationType,
        ...action.destinationId === void 0 ? {} : { destinationId: action.destinationId },
        result: action.result,
        ...action.failureCategory === void 0 ? {} : { failureCategory: action.failureCategory },
        ...action.messageId === void 0 ? {} : { messageId: action.messageId }
      })}
`;
    case "fileTransfer":
      return `${JSON.stringify({
        ...base,
        type: "file_transfer",
        toolCallId: record2.toolCallId ?? "",
        direction: action.direction,
        target: action.target,
        outcome: action.outcome,
        ...action.byteCount === void 0 ? {} : { byteCount: action.byteCount },
        ...action.errorCategory === void 0 ? {} : { errorCategory: action.errorCategory },
        ...action.machineId === void 0 ? {} : { machineId: action.machineId }
      })}
`;
    case "guardrail":
      return `${JSON.stringify({
        ...base,
        type: "guardrail",
        toolCallId: record2.toolCallId ?? "",
        kind: action.guardrailKind,
        detector: action.detector,
        action: action.action,
        source: action.source,
        ...action.count === void 0 ? {} : { count: action.count },
        ...action.targetHost === void 0 ? {} : { targetHost: action.targetHost },
        ...action.toolName === void 0 ? {} : { toolName: action.toolName },
        ...action.resolution === void 0 ? {} : { resolution: action.resolution },
        ...action.durationMs === void 0 ? {} : { durationMs: action.durationMs },
        ...action.decisionId === void 0 ? {} : { decisionId: action.decisionId }
      })}
`;
    case "automationRun":
      return `${JSON.stringify({
        ...base,
        type: "automation_run",
        automationId: action.automationId,
        runId: action.runId,
        trigger: action.trigger,
        outcome: action.outcome,
        durationMs: action.durationMs
      })}
`;
    case "skillActivated":
      return `${JSON.stringify({
        ...base,
        type: "skill_activated",
        toolCallId: record2.toolCallId ?? "",
        skillName: action.skillName,
        trigger: action.trigger,
        source: action.source
      })}
`;
    case "toolDecision":
      return `${JSON.stringify({
        ...base,
        type: "tool_decision",
        toolCallId: record2.toolCallId ?? "",
        decisionId: action.decisionId,
        toolName: action.toolName,
        source: action.source,
        approvalMode: action.approvalMode,
        outcome: action.outcome,
        ...action.ruleId === void 0 ? {} : { ruleId: action.ruleId }
      })}
`;
    case "delegation":
      return `${JSON.stringify({
        ...base,
        type: "delegation",
        toolCallId: record2.toolCallId ?? "",
        direction: action.direction,
        kind: action.delegationKind,
        target: delegationTargetOf(action.delegationKind),
        targetId: action.targetId,
        ...action.direction === "completed" ? { outcome: action.outcome } : {},
        ...action.direction === "completed" && action.durationMs !== void 0 ? { durationMs: action.durationMs } : {}
      })}
`;
    default: {
      const _exhaustive = action;
      return _exhaustive;
    }
  }
}
function createSandActionAuditor(deps) {
  const now = deps.now ?? Date.now;
  let pending = [];
  let outboxLoaded = false;
  let flushInFlight;
  let localWriteTail = Promise.resolve();
  let acceptingLocalWrites = true;
  let backoffUntilMs = 0;
  let acceptingRecords = true;
  const appendLocalLine = deps.appendLocalLine ?? (async (path31, line) => {
    await (0, import_promises43.mkdir)((0, import_node_path82.dirname)(path31), { recursive: true });
    await (0, import_promises43.appendFile)(path31, line, "utf8");
  });
  const loadOutbox = async () => {
    if (outboxLoaded) return;
    outboxLoaded = true;
    try {
      const raw = await (0, import_promises43.readFile)(outboxPath(), "utf8");
      const parsed2 = JSON.parse(raw);
      if (Array.isArray(parsed2)) {
        const loaded = parsed2.slice(0, MAX_PENDING_EVENTS);
        const remainingCapacity = Math.max(0, MAX_PENDING_EVENTS - loaded.length);
        const keptPending = remainingCapacity === 0 ? [] : pending.slice(-remainingCapacity);
        pending = [...loaded, ...keptPending];
      }
    } catch {
    }
  };
  const persistOutbox = async () => {
    try {
      const path31 = outboxPath();
      if (pending.length === 0) {
        await (0, import_promises43.rm)(path31, { force: true });
        return;
      }
      await writeFileAtomic(path31, JSON.stringify(pending));
    } catch {
    }
  };
  const removeDelivered = (batch) => {
    const delivered = new Set(batch.map((event) => event.eventId));
    pending = pending.filter((event) => !delivered.has(event.eventId));
  };
  const runFlush = async () => {
    if (now() < backoffUntilMs) return;
    try {
      await loadOutbox();
      if (pending.length === 0) {
        await persistOutbox();
        return;
      }
      if (!await deps.isBackendForwardingEnabled()) {
        await persistOutbox();
        return;
      }
      while (pending.length > 0) {
        const batch = pending.slice(0, MAX_BATCH_SIZE);
        await deps.sendBatch(batch);
        removeDelivered(batch);
      }
      await persistOutbox();
    } catch (error42) {
      backoffUntilMs = now() + flushFailureBackoffMs(error42, now());
      await persistOutbox();
    }
  };
  const flushOnce = () => {
    if (flushInFlight != null) return flushInFlight;
    const flush = runFlush().finally(() => {
      if (flushInFlight === flush) flushInFlight = void 0;
    });
    flushInFlight = flush;
    return flush;
  };
  let isInitialTick = true;
  const polling = deps.flushPolicy.start(async () => {
    if (isInitialTick) {
      isInitialTick = false;
      return;
    }
    await flushOnce();
  });
  const auditor = {
    record(record2) {
      try {
        const eventId = crypto.randomUUID();
        try {
          const line = localJsonlLine(record2, eventId);
          if (line.length > 0 && acceptingLocalWrites) {
            const path31 = auditJsonlPath(record2.agentId);
            localWriteTail = localWriteTail.then(() => appendLocalLine(path31, line)).catch((error42) => {
              deps.report?.({
                extension: "action_audit",
                errorClass: errorLogTag(error42)
              });
            });
          }
        } catch {
        }
        if (acceptingRecords && isBackendForwardable(record2)) {
          const forwarded = scopeDeliveryMessageId(record2, () => void 0);
          pending.push({
            eventId,
            occurredAtMs: record2.occurredAtMs,
            agentId: record2.agentId,
            turnId: record2.turnId ?? "",
            rootTurnId: record2.rootTurnId,
            subagentId: record2.subagentId,
            boxId: record2.boxId ?? "",
            ...record2.toolCallId === void 0 ? {} : { toolCallId: record2.toolCallId },
            ...record2.sequence === void 0 ? {} : { sequence: record2.sequence },
            ...record2.initiatedBy === void 0 ? {} : { initiatedBy: record2.initiatedBy },
            action: forwarded.action
          });
          if (pending.length > MAX_PENDING_EVENTS) {
            pending = pending.slice(pending.length - MAX_PENDING_EVENTS);
          }
        }
      } catch {
      }
    }
  };
  let disposePromise;
  const dispose = () => {
    if (disposePromise != null) return disposePromise;
    disposePromise = (async () => {
      acceptingRecords = false;
      polling.dispose();
      await flushInFlight;
      await flushOnce();
      await persistOutbox();
      while (acceptingLocalWrites) {
        const tail = localWriteTail;
        await tail;
        if (localWriteTail !== tail) continue;
        acceptingLocalWrites = false;
      }
    })();
    return disposePromise;
  };
  return {
    auditor,
    dispose
  };
}
