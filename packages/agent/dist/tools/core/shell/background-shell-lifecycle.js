init_dist3();
var logger55 = createLogger("tools/shell/background-shell-lifecycle");
var MAX_TRACKED_SHELLS = 4096;
var records = /* @__PURE__ */ new Map();
function recordKey(ctx, taskId) {
  const scope = getConversationId(ctx) ?? getConversationGroupId(ctx);
  if (scope === void 0) {
    return void 0;
  }
  return `${scope}:${taskId}`;
}
function evictOldest() {
  while (records.size > MAX_TRACKED_SHELLS) {
    const oldest = records.keys().next().value;
    if (oldest === void 0) {
      return;
    }
    records.delete(oldest);
  }
}
function recordBackgroundShellStarted(ctx, info2) {
  const key = recordKey(ctx, String(info2.shellId));
  if (key !== void 0) {
    records.set(key, {
      ...info2,
      exitReported: false
    });
    evictOldest();
  }
  logger55.info(ctx, "agent.background_shell_started", {
    event: "agent.background_shell_started",
    shell_id: info2.shellId,
    pid: info2.pid,
    conversation_id: info2.conversationId,
    tool_call_id: info2.toolCallId,
    has_output_notification: info2.hasOutputNotification,
    source: info2.source
  });
}
function recordBackgroundShellExited(ctx, taskId, outcome) {
  const id = taskId.trim();
  if (id.length === 0) {
    return;
  }
  const key = recordKey(ctx, id);
  let record2 = key === void 0 ? void 0 : records.get(key);
  if (record2?.exitReported === true) {
    return;
  }
  if (record2 === void 0) {
    const parsedShellId = Number(id);
    record2 = {
      shellId: Number.isFinite(parsedShellId) ? parsedShellId : void 0,
      pid: void 0,
      conversationId: void 0,
      toolCallId: void 0,
      hasOutputNotification: void 0,
      source: void 0,
      exitReported: false
    };
    if (key !== void 0) {
      records.set(key, record2);
      evictOldest();
    }
  }
  record2.exitReported = true;
  logger55.info(ctx, "agent.background_shell_exited", {
    event: "agent.background_shell_exited",
    shell_id: record2.shellId,
    pid: record2.pid,
    conversation_id: record2.conversationId,
    tool_call_id: record2.toolCallId,
    has_output_notification: record2.hasOutputNotification,
    source: record2.source,
    exit_code: outcome.exitCode,
    aborted: outcome.aborted,
    reason: outcome.aborted ? "aborted" : "exited"
  });
}
