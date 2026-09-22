var import_node_crypto47 = require("node:crypto");
init_scheduling();
init_errors();
init_unknown_record();
var SandBoxCapabilityError = class extends SandDomainError {
  name = "SandBoxCapabilityError";
};
var ASSIGNMENTS_LOAD_MAX_ATTEMPTS = 30;
var ASSIGNMENTS_LOAD_RETRY_INTERVAL_MS = 1e3;
var AssignmentsNotReadyError = class extends Error {
  constructor(retryOutcome) {
    super("Shared desktop assignments file is not ready yet.");
    this.retryOutcome = retryOutcome;
  }
  retryOutcome;
};
var ASSIGNMENTS_LOAD_RETRY_POLICY = {
  name: "shared-desktop-assignments-load",
  maxAttempts: ASSIGNMENTS_LOAD_MAX_ATTEMPTS,
  initialDelayMs: ASSIGNMENTS_LOAD_RETRY_INTERVAL_MS,
  maxDelayMs: ASSIGNMENTS_LOAD_RETRY_INTERVAL_MS,
  shouldRetry: (error42) => error42 instanceof AssignmentsNotReadyError
};
var DEFAULT_SHARED_BOX_ID = "shared";
var SHARED_DESKTOP_ASSIGNMENTS_BOX_PATH = "/home/box/.sand-window-assignments.json";
function parseAssignments(bytes, maxWindowCount) {
  const assignments = /* @__PURE__ */ new Map();
  const tokens = /* @__PURE__ */ new Map();
  let parsed2;
  try {
    parsed2 = JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    return { assignments, tokens, isCorrupt: true };
  }
  if (!isUnknownRecord(parsed2)) return { assignments, tokens, isCorrupt: false };
  const raw = parsed2.assignments;
  if (raw === void 0 || !isUnknownRecord(raw)) {
    return { assignments, tokens, isCorrupt: false };
  }
  const rawTokens = isUnknownRecord(parsed2.tokens) ? parsed2.tokens : void 0;
  const usedForks = /* @__PURE__ */ new Set();
  for (const agentId of Object.keys(raw).sort()) {
    const windowIndex = raw[agentId];
    if (typeof windowIndex !== "number" || !Number.isInteger(windowIndex)) {
      continue;
    }
    if (windowIndex < 1 || windowIndex > maxWindowCount) continue;
    if (windowIndex >= SAND_BOX_FIRST_FORK_WINDOW_INDEX) {
      if (usedForks.has(windowIndex)) continue;
      usedForks.add(windowIndex);
    }
    assignments.set(agentId, windowIndex);
    const token = rawTokens?.[agentId];
    if (typeof token === "string" && token.length > 0) {
      tokens.set(agentId, token);
    }
  }
  return { assignments, tokens, isCorrupt: false };
}
function resolveSharedBoxId(explicit) {
  if (explicit !== void 0 && explicit.length > 0) return explicit;
  const env = process.env.SAND_SHARED_BOX_ID?.trim();
  return env !== void 0 && env.length > 0 ? env : DEFAULT_SHARED_BOX_ID;
}
var SharedDesktopSandBox = class {
  constructor(inner, options2 = {}) {
    this.inner = inner;
    this.sharedBoxId = resolveSharedBoxId(options2.sharedBoxId);
    this.maxWindowCount = Math.max(1, boxMaxWindows(inner));
    this.persistAssignments = options2.persistAssignments ?? false;
    this.assignmentsLoadRetry = options2.assignmentsLoadRetry ?? createRetryPolicy(ASSIGNMENTS_LOAD_RETRY_POLICY);
  }
  inner;
  sharedBoxId;
  maxWindowCount;
  persistAssignments;
  assignmentsLoadRetry;
  agentWindows = /* @__PURE__ */ new Map();
  agentWindowTokens = /* @__PURE__ */ new Map();
  establishedForks = /* @__PURE__ */ new Set();
  inheritedForks = /* @__PURE__ */ new Set();
  downForks = /* @__PURE__ */ new Set();
  windowsTearingDown = /* @__PURE__ */ new Set();
  assignmentsLoad;
  persistChain = Promise.resolve();
  async loadPersistedAssignments(ctx) {
    let loaded;
    try {
      const result = await this.assignmentsLoadRetry.runWithRetry(async () => {
        let bytes;
        try {
          bytes = await this.inner.downloadFile(
            ctx,
            this.sharedBoxId,
            SHARED_DESKTOP_ASSIGNMENTS_BOX_PATH
          );
        } catch (error42) {
          if (error42 instanceof BoxFileUnreadableError) return null;
          throw new AssignmentsNotReadyError({ kind: "download-failed", error: error42 });
        }
        const parsed2 = parseAssignments(bytes, this.maxWindowCount);
        if (parsed2.assignments.size === 0 && (bytes.length === 0 || parsed2.isCorrupt)) {
          throw new AssignmentsNotReadyError({ kind: "content-pending", parsed: parsed2 });
        }
        return parsed2;
      });
      if (result == null) return;
      loaded = result;
    } catch (error42) {
      const failure2 = error42 instanceof RetryExhaustedError ? error42.cause : error42;
      if (!(failure2 instanceof AssignmentsNotReadyError)) throw error42;
      if (failure2.retryOutcome.kind === "download-failed") throw failure2.retryOutcome.error;
      loaded = failure2.retryOutcome.parsed;
    }
    this.adoptUnseatedAssignments(loaded);
  }
  adoptUnseatedAssignments(loaded) {
    const usedWindows = new Set(this.agentWindows.values());
    for (const [agentId, windowIndex] of loaded.assignments) {
      if (this.agentWindows.has(agentId)) continue;
      if (usedWindows.has(windowIndex)) continue;
      this.agentWindows.set(agentId, windowIndex);
      usedWindows.add(windowIndex);
      const token = loaded.tokens.get(agentId);
      if (token !== void 0 && !this.agentWindowTokens.has(agentId)) {
        this.agentWindowTokens.set(agentId, token);
      }
      if (windowIndex >= SAND_BOX_FIRST_FORK_WINDOW_INDEX) {
        this.inheritedForks.add(agentId);
      }
    }
  }
  async readPersistedAssignments(ctx) {
    try {
      const bytes = await this.inner.downloadFile(
        ctx,
        this.sharedBoxId,
        SHARED_DESKTOP_ASSIGNMENTS_BOX_PATH
      );
      return parseAssignments(bytes, this.maxWindowCount);
    } catch (error42) {
      if (!(error42 instanceof BoxFileUnreadableError)) {
        reportHostDiagnosticOrStderr({
          kind: "box_window_assignment_refresh_failed",
          errorClass: errorLogTag(error42)
        });
      }
      return void 0;
    }
  }
  async ensureAssignmentsLoaded(ctx) {
    if (!this.persistAssignments) return;
    this.assignmentsLoad ??= this.loadPersistedAssignments(ctx);
    try {
      await this.assignmentsLoad;
    } catch (error42) {
      this.assignmentsLoad = void 0;
      throw error42;
    }
  }
  async adoptPersistedAssignment(ctx, agentId) {
    if (!this.persistAssignments) return void 0;
    const loaded = await this.readPersistedAssignments(ctx);
    const windowIndex = loaded?.assignments.get(agentId);
    if (loaded === void 0 || windowIndex === void 0) return void 0;
    const token = loaded.tokens.get(agentId);
    const currentWindow = this.agentWindows.get(agentId);
    if (currentWindow === windowIndex && this.agentWindowTokens.get(agentId) === token) {
      return void 0;
    }
    const heldByAnother = [...this.agentWindows].some(
      ([otherId, otherWindow]) => otherId !== agentId && otherWindow === windowIndex
    );
    if (heldByAnother && windowIndex >= SAND_BOX_FIRST_FORK_WINDOW_INDEX) return void 0;
    this.agentWindows.set(agentId, windowIndex);
    if (token === void 0) {
      this.agentWindowTokens.delete(agentId);
    } else {
      this.agentWindowTokens.set(agentId, token);
    }
    this.establishedForks.delete(agentId);
    this.downForks.delete(agentId);
    if (windowIndex >= SAND_BOX_FIRST_FORK_WINDOW_INDEX) {
      this.inheritedForks.add(agentId);
    } else {
      this.inheritedForks.delete(agentId);
    }
    return { windowIndex };
  }
  queuePersistAssignments(ctx) {
    if (!this.persistAssignments) return;
    const persistedEntries = [...this.agentWindows];
    const snapshot = Object.fromEntries(persistedEntries);
    const tokenSnapshot = Object.fromEntries(
      persistedEntries.flatMap(([key]) => {
        const token = this.agentWindowTokens.get(key);
        return token !== void 0 ? [[key, token]] : [];
      })
    );
    this.persistChain = this.persistChain.then(async () => {
      try {
        await this.inner.uploadFile(
          ctx,
          this.sharedBoxId,
          SHARED_DESKTOP_ASSIGNMENTS_BOX_PATH,
          new TextEncoder().encode(
            JSON.stringify({ assignments: snapshot, tokens: tokenSnapshot })
          )
        );
      } catch (error42) {
        reportHostDiagnostic({
          kind: "window_assignment_persist_failed",
          errorClass: errorLogTag(error42)
        });
      }
    });
  }
  takeFreeForkIndex(agentId) {
    const used = new Set(this.agentWindows.values());
    for (let windowIndex = SAND_BOX_FIRST_FORK_WINDOW_INDEX; windowIndex <= this.maxWindowCount; windowIndex++) {
      if (!used.has(windowIndex) && !this.windowsTearingDown.has(windowIndex)) {
        this.agentWindows.set(agentId, windowIndex);
        return windowIndex;
      }
    }
    return void 0;
  }
  assignWindow(agentId) {
    const existing = this.agentWindows.get(agentId);
    if (existing !== void 0) return existing;
    return this.takeFreeForkIndex(agentId);
  }
  migrateLegacyPrimarySeat(agentId, assigned) {
    if (!isPrimaryWindowIndex(assigned) || this.inner.ensureWindow == null) {
      return assigned;
    }
    const current = this.agentWindows.get(agentId) ?? assigned;
    if (!isPrimaryWindowIndex(current)) return current;
    return this.takeFreeForkIndex(agentId) ?? current;
  }
  async restorePrimarySeat(ctx, agentId, forkIndex) {
    await this.rollbackFailedBringup(ctx, agentId, {
      isNewAssignment: false,
      forkBringupAttempted: true
    });
    if (this.agentWindows.get(agentId) !== forkIndex) return;
    this.agentWindows.set(agentId, SAND_BOX_PRIMARY_WINDOW_INDEX);
    this.agentWindowTokens.delete(agentId);
    this.queuePersistAssignments(ctx);
  }
  async rollbackFailedBringup(ctx, agentId, opts) {
    const windowIndex = this.agentWindows.get(agentId);
    const isFork = windowIndex !== void 0 && windowIndex >= SAND_BOX_FIRST_FORK_WINDOW_INDEX;
    const shouldTearDownFork = opts.forkBringupAttempted && isFork && !this.establishedForks.has(agentId) && !this.inheritedForks.has(agentId);
    if (shouldTearDownFork && windowIndex !== void 0) {
      try {
        await this.inner.releaseWindow?.(ctx, this.sharedBoxId, windowIndex);
      } catch (error42) {
        reportHostDiagnosticOrStderr({
          kind: "box_fork_window_release_failed",
          errorClass: errorLogTag(error42)
        });
      }
    }
    if (opts.isNewAssignment) {
      this.agentWindows.delete(agentId);
      this.agentWindowTokens.delete(agentId);
      this.queuePersistAssignments(ctx);
    }
  }
  forgetForeignFork(ctx, agentId, windowIndex) {
    reportHostDiagnostic({ kind: "window_guard_refused", stage: "start-window" });
    if (this.agentWindows.get(agentId) !== windowIndex) return;
    this.agentWindows.delete(agentId);
    this.agentWindowTokens.delete(agentId);
    this.establishedForks.delete(agentId);
    this.inheritedForks.delete(agentId);
    this.downForks.delete(agentId);
    this.queuePersistAssignments(ctx);
  }
  gateComputerUse(primary) {
    return {
      ...primary,
      remoteAccessor: new CombinedResourceAccessor(primary.remoteAccessor, [
        resourceEntry(computerUseExecutorResource, noMonitorComputerUseExecutor)
      ])
    };
  }
  forkConnection(primary, window2) {
    return {
      remoteAccessor: window2.computerUse,
      vncUrl: window2.vncUrl,
      terminalsFolder: primary.terminalsFolder,
      windowIndex: window2.windowIndex
    };
  }
  async reattachAdoptedFork(ctx, agentId, primary) {
    const adopted = await this.adoptPersistedAssignment(ctx, agentId);
    if (adopted === void 0 || isPrimaryWindowIndex(adopted.windowIndex)) return void 0;
    this.queuePersistAssignments(ctx);
    if (this.inner.ensureWindow == null) return void 0;
    let window2;
    try {
      window2 = await this.inner.ensureWindow(ctx, this.sharedBoxId, adopted.windowIndex, {
        ownerToken: this.agentWindowTokens.get(agentId)
      });
    } catch (error42) {
      if (error42 instanceof SandBoxNoMonitorAvailableError) {
        this.forgetForeignFork(ctx, agentId, adopted.windowIndex);
      } else if (this.agentWindows.get(agentId) === adopted.windowIndex) {
        this.downForks.add(agentId);
      }
      return this.gateComputerUse(primary);
    }
    this.establishedForks.add(agentId);
    this.downForks.delete(agentId);
    return this.forkConnection(primary, window2);
  }
  async ensureReady(ctx, agentId) {
    const assignmentsLoadedEarlier = this.assignmentsLoad !== void 0;
    await this.ensureAssignmentsLoaded(ctx);
    if (assignmentsLoadedEarlier && !this.agentWindows.has(agentId)) {
      await this.adoptPersistedAssignment(ctx, agentId);
    }
    const isNewAssignment = !this.agentWindows.has(agentId);
    const assigned = this.assignWindow(agentId);
    const primary = await this.inner.ensureReady(ctx, this.sharedBoxId);
    if (assigned === void 0) {
      return this.gateComputerUse(primary);
    }
    const windowIndex = this.migrateLegacyPrimarySeat(agentId, assigned);
    const isMigration = windowIndex !== assigned;
    if (isPrimaryWindowIndex(windowIndex)) {
      return primary;
    }
    let tokenIsNew = false;
    if (!this.agentWindowTokens.has(agentId)) {
      this.agentWindowTokens.set(agentId, (0, import_node_crypto47.randomUUID)());
      tokenIsNew = true;
    }
    if (isNewAssignment || tokenIsNew || isMigration) {
      this.queuePersistAssignments(ctx);
    }
    if (this.inner.ensureWindow == null) {
      await this.rollbackFailedBringup(ctx, agentId, {
        isNewAssignment,
        forkBringupAttempted: false
      });
      return this.gateComputerUse(primary);
    }
    let window2;
    try {
      window2 = await this.inner.ensureWindow(ctx, this.sharedBoxId, windowIndex, {
        ownerToken: this.agentWindowTokens.get(agentId)
      });
    } catch (error42) {
      if (error42 instanceof SandBoxNoMonitorAvailableError) {
        const reattached = await this.reattachAdoptedFork(ctx, agentId, primary);
        if (reattached !== void 0) return reattached;
        this.forgetForeignFork(ctx, agentId, windowIndex);
        return this.gateComputerUse(primary);
      }
      if (isMigration && !this.establishedForks.has(agentId)) {
        await this.restorePrimarySeat(ctx, agentId, windowIndex);
        return primary;
      }
      await this.rollbackFailedBringup(ctx, agentId, {
        isNewAssignment,
        forkBringupAttempted: true
      });
      if (this.agentWindows.get(agentId) === windowIndex) this.downForks.add(agentId);
      return this.gateComputerUse(primary);
    }
    this.establishedForks.add(agentId);
    this.downForks.delete(agentId);
    return this.forkConnection(primary, window2);
  }
  async hibernate(_ctx, _agentId) {
  }
  async recreateInBox(ctx, opts) {
    if (this.inner.recreateInBox == null) {
      throw new SandBoxCapabilityError("This box backend does not support an in-box recreate.");
    }
    return await this.inner.recreateInBox(ctx, opts);
  }
  async applyEnvironment(ctx, update) {
    await boxApplyEnvironment(this.inner, ctx, update);
  }
  async loadMcpServers(ctx, configJson, options2) {
    return await boxLoadMcpServers(this.inner, ctx, configJson, options2);
  }
  async mcpResourceAccessor(ctx) {
    return await boxMcpResourceAccessor(this.inner, ctx);
  }
  async reattachPersistedForkSeat(ctx, agentId) {
    try {
      await this.ensureAssignmentsLoaded(ctx);
      if (!this.agentWindows.has(agentId)) {
        await this.adoptPersistedAssignment(ctx, agentId);
      }
      const windowIndex = this.agentWindows.get(agentId);
      if (windowIndex === void 0 || isPrimaryWindowIndex(windowIndex)) return;
      await this.ensureReady(ctx, agentId);
    } catch (error42) {
      reportHostDiagnostic({
        kind: "fallback_taken",
        stage: "window_mcp_host",
        errorClass: errorLogTag(error42)
      });
    }
  }
  async agentMcpHost(ctx, agentId) {
    if (this.inner.ensureWindow == null) return void 0;
    if (!this.establishedForks.has(agentId)) {
      await this.reattachPersistedForkSeat(ctx, agentId);
    }
    const windowIndex = this.getAgentWindowIndex(agentId);
    if (windowIndex === void 0 || isPrimaryWindowIndex(windowIndex) || !this.establishedForks.has(agentId)) {
      return void 0;
    }
    let window2;
    try {
      window2 = await this.inner.ensureWindow(ctx, this.sharedBoxId, windowIndex, {
        ownerToken: this.agentWindowTokens.get(agentId)
      });
    } catch (error42) {
      reportHostDiagnostic({
        kind: "fallback_taken",
        stage: "window_mcp_host",
        errorClass: errorLogTag(error42)
      });
      return void 0;
    }
    return window2.mcp;
  }
  async releaseWindow(ctx, agentId) {
    const windowIndex = this.agentWindows.get(agentId);
    this.agentWindows.delete(agentId);
    this.agentWindowTokens.delete(agentId);
    this.establishedForks.delete(agentId);
    this.inheritedForks.delete(agentId);
    this.downForks.delete(agentId);
    if (windowIndex !== void 0) {
      this.queuePersistAssignments(ctx);
    }
    if (windowIndex !== void 0 && windowIndex >= SAND_BOX_FIRST_FORK_WINDOW_INDEX) {
      this.windowsTearingDown.add(windowIndex);
      try {
        await this.inner.releaseWindow?.(ctx, this.sharedBoxId, windowIndex);
      } finally {
        this.windowsTearingDown.delete(windowIndex);
      }
    }
  }
  getAgentWindowIndex(agentId) {
    if (this.downForks.has(agentId)) return void 0;
    return this.agentWindows.get(agentId);
  }
  getAssignedWindowIndexes() {
    return [...this.agentWindows].filter(([agentId]) => !this.downForks.has(agentId)).map(([, windowIndex]) => windowIndex).sort((a, b2) => a - b2);
  }
  async refreshAssignedWindows(ctx) {
    if (!this.persistAssignments) return;
    const loaded = await this.readPersistedAssignments(ctx);
    if (loaded !== void 0) this.adoptUnseatedAssignments(loaded);
  }
  async awaitPersistedAssignments() {
    await this.persistChain;
  }
  getTerminalsFolder() {
    return boxTerminalsFolder(this.inner);
  }
  async runState(ctx, _agentId) {
    return await this.inner.runState(ctx, this.sharedBoxId);
  }
  async isAvailable() {
    return await boxIsAvailable(this.inner);
  }
  describe() {
    return boxDescription(this.inner);
  }
  isPreparing(_agentId) {
    return boxIsPreparing(this.inner, this.sharedBoxId);
  }
  async listBoxes() {
    const innerBoxes = await this.inner.listBoxes();
    const running = innerBoxes.some((box) => box.running);
    return [...this.agentWindows.keys()].map((agentId) => ({ agentId, running }));
  }
  async uploadFile(ctx, _agentId, boxPath, data) {
    await this.inner.uploadFile(ctx, this.sharedBoxId, boxPath, data);
  }
  async downloadFile(ctx, _agentId, boxPath) {
    return await this.inner.downloadFile(ctx, this.sharedBoxId, boxPath);
  }
};
