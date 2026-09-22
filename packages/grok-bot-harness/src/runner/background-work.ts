init_errors();
var RevivingBackgroundWorkRegistry = class extends InMemoryBackgroundWorkRegistry {
  constructor(onShellCompletion, onShellWorkRegistered, onWorkSetChanged) {
    super();
    this.onShellCompletion = onShellCompletion;
    this.onShellWorkRegistered = onShellWorkRegistered;
    this.onWorkSetChanged = onWorkSetChanged;
  }
  onShellCompletion;
  onShellWorkRegistered;
  onWorkSetChanged;
  quietOrigins = /* @__PURE__ */ new Map();
  upsertWork(record2) {
    super.upsertWork(record2);
    this.onWorkSetChanged?.();
  }
  clearWork(id) {
    const cleared = super.clearWork(id);
    this.onWorkSetChanged?.();
    return cleared;
  }
  abortWork(id) {
    const aborted2 = super.abortWork(id);
    this.onWorkSetChanged?.();
    return aborted2;
  }
  abortAllWork(filter3) {
    const aborted2 = super.abortAllWork(filter3);
    this.onWorkSetChanged?.();
    return aborted2;
  }
  recordWorkOrigin(id, origin) {
    if (origin != null) this.quietOrigins.set(id, origin);
    else this.quietOrigins.delete(id);
  }
  enqueue(wakeup) {
    const item = wakeup.payload;
    if (item.kind === "shell" && item.reason !== "task_progress") {
      const quietOrigin = this.quietOrigins.get(item.taskId);
      this.quietOrigins.delete(item.taskId);
      this.onShellCompletion(item, quietOrigin);
      return;
    }
    super.enqueue(wakeup);
  }
  forTurn(origin) {
    const inner = this;
    return {
      upsertWork: (record2) => {
        inner.recordWorkOrigin(record2.id, origin);
        inner.upsertWork(record2);
        if (record2.kind === "shell" && record2.state === "running") {
          inner.onShellWorkRegistered?.(record2, origin);
        }
      },
      clearWork: (id) => inner.clearWork(id),
      abortWork: (id) => inner.abortWork(id),
      hasRunningWork: (filter3) => inner.hasRunningWork(filter3),
      abortAllWork: (filter3) => inner.abortAllWork(filter3),
      listWork: (filter3) => inner.listWork(filter3),
      enqueue: (wakeup) => inner.enqueue(wakeup),
      pull: (conversationId) => inner.pull(conversationId),
      ack: (ids) => inner.ack(ids),
      nack: (ids, opts) => inner.nack(ids, opts),
      suppress: (conversationId, id) => inner.suppress(conversationId, id),
      enqueueCompletion: (item) => inner.enqueueCompletion(item),
      drainCompletions: () => inner.drainCompletions(),
      hasPendingCompletions: (conversationId) => inner.hasPendingCompletions(conversationId),
      markAwaitedCompletion: (taskId) => inner.markAwaitedCompletion(taskId)
    };
  }
};
var SHELL_REWATCH_POLL_DEFAULT_MS = 1e4;
var SHELL_REWATCH_MAX_WAIT_MS = 5 * 60 * 60 * 1e3;
var SHELL_REWATCH_MISSING_FILE_GIVE_UP = 5;
function shellRewatchPollMs() {
  const raw = process.env.SAND_SHELL_REWATCH_POLL_MS;
  if (raw == null || raw.trim().length === 0) {
    return SHELL_REWATCH_POLL_DEFAULT_MS;
  }
  const parsed2 = Number.parseInt(raw, 10);
  return Number.isFinite(parsed2) && parsed2 > 0 ? parsed2 : SHELL_REWATCH_POLL_DEFAULT_MS;
}
function parseShellTerminalFooter(content) {
  const footerMatch = content.match(/\n---\n([\s\S]*?)\n---\s*$/);
  if (footerMatch == null) return { kind: "running" };
  const footer = footerMatch[1] ?? "";
  const exitCodeLine = footer.match(/(?:^|\n)exit_code:\s*([^\n]*)/);
  if (exitCodeLine != null) {
    const raw = (exitCodeLine[1] ?? "").trim();
    const parsed2 = Number(raw);
    return {
      kind: "exited",
      exitCode: raw.length > 0 && Number.isInteger(parsed2) ? parsed2 : null
    };
  }
  const errorLine = footer.match(/(?:^|\n)error:\s*([^\n]*)/);
  if (errorLine != null && /(?:^|\n)ended_at:\s*\S/.test(footer)) {
    return { kind: "stream-failure" };
  }
  return { kind: "running" };
}
function deriveBackgroundSubagentTitleFields(prompt, id) {
  const oneLine = prompt.replace(/\s+/g, " ").trim();
  if (oneLine.length === 0) {
    const fallback2 = asyncTaskFallbackLabel("subagent", id);
    return {
      title: fallback2.text,
      labelKind: fallback2.labelKind,
      labelParams: fallback2.labelParams
    };
  }
  const maxLength = 80;
  return {
    title: oneLine.length <= maxLength ? oneLine : `${oneLine.slice(0, maxLength - 1)}\u2026`
  };
}
function formatSteerPrompt(message) {
  return [
    "[Steering message from the parent agent that dispatched you]",
    message.trim(),
    "Take this into account and continue your task from where you are \u2014 do not start over."
  ].join("\n\n");
}
function createBackgroundWatches(host) {
  const watchedCloudAgentBcIds = /* @__PURE__ */ new Map();
  const cloudAgentSettlements = /* @__PURE__ */ new Map();
  const shellRewatches = /* @__PURE__ */ new Map();
  let shellRegistry;
  const shellWorkChangedWaiters = /* @__PURE__ */ new Set();
  const notifyShellWorkChanged = () => {
    for (const resolve29 of shellWorkChangedWaiters) resolve29();
    shellWorkChangedWaiters.clear();
  };
  const handleShellWorkRegistered = (record2, quietOrigin) => {
    cancelShellRewatch(record2.id);
    const metadata = decodeBackgroundWorkMetadata(record2.metadata);
    const fallback2 = asyncTaskFallbackLabel("shell", record2.id);
    const usesFallback = metadata.title == null;
    host.pendingWakeArmedHandler()?.({
      parentAgentId: host.getConversationId(),
      kind: "shell",
      workId: record2.id,
      title: metadata.title ?? fallback2.text,
      ...usesFallback ? { labelKind: fallback2.labelKind, labelParams: fallback2.labelParams } : {},
      ...quietOrigin != null ? { quietOrigin } : {}
    });
  };
  const handleShellCompletionItem = (item, quietOrigin) => {
    const handler = host.backgroundShellSettledHandler();
    if (handler === void 0) {
      notifyShellWorkChanged();
      return;
    }
    handler({
      agentId: host.getConversationId(),
      shellId: item.taskId,
      title: item.title,
      status: item.status,
      detail: item.detail,
      outputPath: item.outputPath,
      ...quietOrigin != null ? { quietOrigin } : {}
    });
    notifyShellWorkChanged();
  };
  const registry2 = () => {
    if (shellRegistry === void 0) {
      shellRegistry = new RevivingBackgroundWorkRegistry(
        handleShellCompletionItem,
        handleShellWorkRegistered,
        () => host.emitAsyncTasksChanged()
      );
    }
    return shellRegistry;
  };
  const watchCloudAgent = (bcId, options2) => {
    const id = bcId.trim();
    const watcher = host.cloudAgentWatcher();
    if (id.length === 0 || watcher == null) return;
    if (watchedCloudAgentBcIds.has(id)) return;
    const fallback2 = asyncTaskFallbackLabel("cloud-agent", id);
    const watch4 = {
      title: fallback2.text,
      labelKind: fallback2.labelKind,
      labelParams: fallback2.labelParams,
      startedAtMs: Date.now()
    };
    watchedCloudAgentBcIds.set(id, watch4);
    const quietOrigin = options2?.quietOrigin;
    const hiddenCard = options2?.hiddenCard === true ? { hiddenCard: true } : {};
    const base = {
      parentAgentId: host.getConversationId(),
      subagentAgentId: id,
      subagentType: "cursor-agent",
      toolCallId: "",
      title: fallback2.text,
      ...quietOrigin != null ? { quietOrigin } : {}
    };
    host.pendingWakeArmedHandler()?.({
      parentAgentId: base.parentAgentId,
      kind: "cloud-agent",
      workId: id,
      title: base.title,
      labelKind: fallback2.labelKind,
      labelParams: fallback2.labelParams,
      ...quietOrigin != null ? { quietOrigin } : {},
      ...hiddenCard
    });
    host.emitAsyncTasksChanged();
    const settle = (completion) => {
      if (watchedCloudAgentBcIds.get(id) !== watch4) return;
      watchedCloudAgentBcIds.delete(id);
      host.emitAsyncTasksChanged();
      host.notifyBackgroundWorkSettled(completion);
    };
    const settlement = watcher.awaitCompletion(id, { waitForRestart: options2?.afterFollowup ?? false, ...hiddenCard }).then(
      (result) => settle({
        ...base,
        status: result.status === "error" ? "error" : "completed",
        result: result.text.trim().length > 0 ? result.text : "(the cloud agent finished without producing any output)"
      })
    ).catch(
      (error42) => settle({
        ...base,
        status: "error",
        result: errorMessage(error42)
      })
    ).finally(() => cloudAgentSettlements.delete(id));
    cloudAgentSettlements.set(id, settlement);
    void settlement;
  };
  const watchBackgroundShell = (shellId, options2) => {
    const id = shellId.trim();
    if (id.length === 0) return;
    const fallback2 = asyncTaskFallbackLabel("shell", id);
    const title = options2?.title ?? fallback2.text;
    let labelDescriptor = null;
    if (options2?.labelKind != null && options2.labelParams != null) {
      labelDescriptor = { labelKind: options2.labelKind, labelParams: options2.labelParams };
    } else if (options2?.title == null) {
      labelDescriptor = { labelKind: fallback2.labelKind, labelParams: fallback2.labelParams };
    }
    const quietOrigin = options2?.quietOrigin;
    host.pendingWakeArmedHandler()?.({
      parentAgentId: host.getConversationId(),
      kind: "shell",
      workId: id,
      title,
      ...labelDescriptor ?? {},
      ...quietOrigin != null ? { quietOrigin } : {}
    });
    if (shellRewatches.has(id)) return;
    if (registry2().listWork({ kind: "shell" }).some((work) => work.id === id)) {
      return;
    }
    let cancelled = false;
    shellRewatches.set(id, {
      cancel: () => {
        cancelled = true;
        shellRewatches.delete(id);
        host.emitAsyncTasksChanged();
        notifyShellWorkChanged();
      },
      title,
      ...labelDescriptor ?? {},
      startedAtMs: Date.now()
    });
    host.emitAsyncTasksChanged();
    const settle = (status, detail, outputPath) => {
      if (cancelled) return;
      shellRewatches.delete(id);
      host.emitAsyncTasksChanged();
      host.backgroundShellSettledHandler()?.({
        agentId: host.getConversationId(),
        shellId: id,
        title,
        status,
        detail,
        outputPath,
        ...quietOrigin != null ? { quietOrigin } : {}
      });
      notifyShellWorkChanged();
    };
    host.pollShellTerminalFile(id, () => cancelled, settle);
  };
  const cancelShellRewatch = (shellId) => {
    shellRewatches.get(shellId)?.cancel();
  };
  const hasRunningBackgroundShellWork = () => shellRewatches.size > 0 || (shellRegistry?.hasRunningWork({ kind: "shell" }) ?? false);
  return {
    registry: registry2,
    listRegisteredShellWork: (filter3) => shellRegistry?.listWork(filter3),
    watchCloudAgent,
    watchBackgroundShell,
    pendingCloudAgentWatchBcIds: () => [...watchedCloudAgentBcIds.keys()],
    pendingShellRewatchIds: () => [...shellRewatches.keys()],
    hasRunningBackgroundShellWork,
    drainCloudAgentWatches: async () => {
      while (cloudAgentSettlements.size > 0) {
        await Promise.all([...cloudAgentSettlements.values()]);
      }
    },
    drainBackgroundShellWork: async () => {
      while (hasRunningBackgroundShellWork()) {
        await new Promise((resolve29) => {
          shellWorkChangedWaiters.add(resolve29);
          if (!hasRunningBackgroundShellWork()) {
            shellWorkChangedWaiters.delete(resolve29);
            resolve29();
          }
        });
      }
    },
    cancelBackgroundShellRewatches: () => {
      for (const rewatch of [...shellRewatches.values()]) {
        rewatch.cancel();
      }
      shellRewatches.clear();
    },
    abortBackgroundShellWork: () => {
      shellRegistry?.abortAllWork({ kind: "shell" });
      for (const rewatch of [...shellRewatches.values()]) {
        rewatch.cancel();
      }
      shellRewatches.clear();
      notifyShellWorkChanged();
    },
    cancelCloudAgentWatches: () => {
      if (watchedCloudAgentBcIds.size === 0 && cloudAgentSettlements.size === 0) return;
      watchedCloudAgentBcIds.clear();
      cloudAgentSettlements.clear();
      host.emitAsyncTasksChanged();
    },
    shellRewatchEntries: () => shellRewatches.entries(),
    cloudAgentWatchEntries: () => watchedCloudAgentBcIds.entries()
  };
}
