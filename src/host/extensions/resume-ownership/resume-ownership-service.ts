init_errors();
var ResumeOwnershipRecoveryPendingError = class extends Error {
  name = "ResumeOwnershipRecoveryPendingError";
};
var ResumeOwnershipService = class {
  constructor(deps) {
    this.deps = deps;
  }
  deps;
  lane = Promise.resolve();
  lifetime = new AbortController();
  recovery;
  recreateReleaseReceipt;
  recreateRecoveryPending = false;
  recreatePendingWakesHandled = false;
  recreatePendingWakesParked = false;
  handledRecreateAgentIds = /* @__PURE__ */ new Set();
  recoveryRequestedGeneration = 0;
  recoveryCompletedGeneration = 0;
  disposed = false;
  async resumeAtStartup() {
    this.deps.setLocalWorkAllowed(false);
    const attemptGeneration = this.recoveryRequestedGeneration;
    const recovered = await this.serialize(async () => {
      const startedAt = this.deps.now();
      const preparedMigration = await this.deps.migrationBarrier.prepare();
      const ownership = await this.reconcileWithMigration({
        preparedMigration,
        reconcile: this.deps.reconcileAtStartup,
        canRunMigration: () => this.deps.getPauseOwner() === null,
        reportTrigger: "host_startup",
        startedAt,
        signal: this.lifetimeSignal()
      });
      if (ownership === "blocked" || ownership === "migration_pending") return false;
      if (ownership === "identity_failed") {
        this.deps.park([]);
        await this.deps.suspendAutomationWakes();
        this.reportFailure("host_startup", startedAt);
        return false;
      }
      const confirmation = await this.resumeConfirmedOwnership();
      this.reportResult("host_startup", startedAt, confirmation.result);
      if (attemptGeneration !== this.recoveryRequestedGeneration) return false;
      this.resumeAutomationWakesWhenReleased();
      return confirmation.complete;
    });
    if (recovered) {
      this.recoveryCompletedGeneration = Math.max(
        this.recoveryCompletedGeneration,
        attemptGeneration
      );
      await this.cancelRecovery();
    } else {
      this.scheduleRecovery();
    }
  }
  prepareForRecreate() {
    return this.serialize(async () => {
      if (this.deps.getPauseOwner() === null) {
        this.recreateReleaseReceipt = void 0;
        this.recreateRecoveryPending = false;
        this.recreatePendingWakesHandled = false;
        this.handledRecreateAgentIds.clear();
      }
      await this.deps.suspendAutomationWakes();
      return await this.deps.pauseForRecreate();
    });
  }
  async resumeAfterRecreate(args) {
    const attemptGeneration = this.recoveryRequestedGeneration;
    const decision = await this.serialize(async () => {
      if (this.recreateReleaseReceipt !== void 0 && attemptGeneration <= this.recoveryCompletedGeneration) {
        return { result: this.recreateReleaseReceipt, settled: true };
      }
      const startedAt = this.deps.now();
      const identity = await this.deps.reconcile(this.lifetimeSignal());
      if (!identity.reconciled) {
        return this.parkFailedRecreate(args, startedAt);
      }
      const upgradeOwned = this.deps.getPauseOwner() === "upgrade";
      const unhandledAgentIds = args.agentIds.filter(
        (agentId) => !this.handledRecreateAgentIds.has(agentId)
      );
      const pendingWakes = this.recreatePendingWakesHandled || this.recreatePendingWakesParked ? void 0 : args.pendingWakes;
      const resumed = await this.deps.resumeAfterRecreate(unhandledAgentIds, pendingWakes);
      this.recreatePendingWakesHandled = true;
      if ((pendingWakes?.length ?? 0) > 0) {
        this.recreatePendingWakesParked = true;
      }
      for (const agentId of unhandledAgentIds) this.handledRecreateAgentIds.add(agentId);
      let wakesComplete = true;
      if (this.recreatePendingWakesParked && !upgradeOwned) {
        wakesComplete = await this.deps.rearmPendingWakes();
        if (wakesComplete) this.recreatePendingWakesParked = false;
      }
      this.reportResult("recreate_release", startedAt, resumed);
      const result = { ...resumed, identityReconciled: true };
      if (attemptGeneration === this.recoveryRequestedGeneration) {
        this.resumeAutomationWakesWhenReleased();
      }
      if (upgradeOwned || !wakesComplete || this.deps.listPendingResumeAgentIds().length > 0 || attemptGeneration !== this.recoveryRequestedGeneration) {
        this.recreateRecoveryPending = true;
        return { result, settled: false };
      }
      return this.recordRecreateRelease(result);
    });
    if (decision.settled) {
      this.recoveryCompletedGeneration = Math.max(
        this.recoveryCompletedGeneration,
        attemptGeneration
      );
      if (this.recoveryCompletedGeneration >= this.recoveryRequestedGeneration) {
        await this.cancelRecovery();
      } else {
        this.startRecovery();
      }
    } else {
      this.scheduleRecovery();
    }
    return decision.result;
  }
  async dispose() {
    this.disposed = true;
    this.lifetime.abort();
    await this.cancelRecovery();
    await this.lane;
  }
  requestRecovery() {
    if (this.disposed) return;
    this.deps.setLocalWorkAllowed(false);
    this.scheduleRecovery();
  }
  getSettledHostWindow() {
    return this.deps.migrationBarrier.getWindow();
  }
  scheduleRecovery() {
    this.recoveryRequestedGeneration += 1;
    this.startRecovery();
  }
  startRecovery() {
    if (this.disposed || this.recovery !== void 0) return;
    const controller = new AbortController();
    const completed = this.recoverUntilSuccessful(controller.signal).catch((error42) => {
      if (!controller.signal.aborted) {
        this.deps.log(`[sand:resume-ownership] recovery stopped (${errorLogTag(error42)})`);
      }
    }).finally(() => {
      if (this.recovery?.controller === controller) this.recovery = void 0;
      if (!this.disposed && this.recoveryCompletedGeneration < this.recoveryRequestedGeneration) {
        this.startRecovery();
      }
    });
    this.recovery = { controller, completed };
  }
  async recoverUntilSuccessful(signal) {
    await this.deps.retry.schedule(1, signal).elapsed;
    await this.deps.retry.runWithRetry(async () => {
      const attemptGeneration = this.recoveryRequestedGeneration;
      const recovered = await this.serialize(async () => {
        signal.throwIfAborted();
        const startedAt = this.deps.now();
        const preparedMigration = await this.deps.migrationBarrier.prepare();
        const ownership = await this.reconcileWithMigration({
          preparedMigration,
          reconcile: this.deps.reconcile,
          canRunMigration: () => this.deps.getPauseOwner() === null,
          reportTrigger: "background_recovery",
          startedAt,
          signal
        });
        if (ownership !== "ready") return false;
        const confirmation = await this.resumeConfirmedOwnership();
        this.reportResult("background_recovery", startedAt, confirmation.result);
        if (attemptGeneration !== this.recoveryRequestedGeneration) return false;
        this.resumeAutomationWakesWhenReleased();
        if (!confirmation.complete) return false;
        if (this.recreateRecoveryPending) {
          this.recordRecreateRelease({
            ...confirmation.result,
            identityReconciled: true
          });
        }
        this.recoveryCompletedGeneration = Math.max(
          this.recoveryCompletedGeneration,
          attemptGeneration
        );
        return true;
      });
      if (!recovered) throw new ResumeOwnershipRecoveryPendingError();
    }, signal);
  }
  async resumeConfirmedOwnership() {
    const agentIds = this.deps.listPendingResumeAgentIds();
    const result = await this.deps.resumeInterrupted();
    const remainingAgentIds = new Set(this.deps.listPendingResumeAgentIds());
    for (const agentId of agentIds) {
      if (!remainingAgentIds.has(agentId)) this.handledRecreateAgentIds.add(agentId);
    }
    const wakesComplete = await this.deps.rearmPendingWakes();
    if (wakesComplete) this.recreatePendingWakesParked = false;
    return { result, complete: remainingAgentIds.size === 0 && wakesComplete };
  }
  resumeAutomationWakesWhenReleased() {
    if (!this.disposed && this.deps.getPauseOwner() === null) {
      this.deps.setLocalWorkAllowed(true);
      this.deps.resumeAutomationWakes();
      this.deps.resumeDeferredLocalWork();
    }
  }
  async reconcileWithMigration(args) {
    const identity = await args.reconcile(args.signal);
    if (!identity.reconciled) return "identity_failed";
    if (!args.canRunMigration()) return "blocked";
    const migration = await this.deps.migrationBarrier.run(args.preparedMigration, args.signal);
    if (migration === "deferred") return "migration_pending";
    if (migration === "abandoned" && args.preparedMigration.kind === "ready") {
      this.deps.report({
        trigger: args.reportTrigger,
        outcome: "migration_abandoned",
        operationId: args.preparedMigration.operation.operationId,
        durationMs: Math.max(0, this.deps.now() - args.startedAt)
      });
    }
    if (migration === "terminal" || migration === "abandoned") {
      const postMigrationIdentity = await this.deps.reconcile(args.signal);
      if (!postMigrationIdentity.reconciled) return "identity_failed";
    }
    return "ready";
  }
  parkFailedRecreate(args, startedAt) {
    this.deps.setLocalWorkAllowed(false);
    this.deps.park(args.agentIds, args.pendingWakes);
    this.recreateRecoveryPending = true;
    this.recreatePendingWakesParked ||= (args.pendingWakes?.length ?? 0) > 0;
    this.reportFailure("recreate_release", startedAt);
    return {
      result: {
        resumed: 0,
        suppressedTemporal: 0,
        identityReconciled: false
      },
      settled: false
    };
  }
  recordRecreateRelease(result) {
    this.recreateRecoveryPending = false;
    this.recreateReleaseReceipt = result;
    return { result, settled: true };
  }
  reportFailure(trigger2, startedAt) {
    this.deps.report({
      trigger: trigger2,
      outcome: "identity_refresh_failed",
      durationMs: Math.max(0, this.deps.now() - startedAt)
    });
  }
  reportResult(trigger2, startedAt, result) {
    const durationMs = Math.max(0, this.deps.now() - startedAt);
    if (result.resumed > 0) {
      this.deps.report({
        trigger: trigger2,
        outcome: "resumed_box",
        count: result.resumed,
        durationMs
      });
    }
    if (result.suppressedTemporal > 0) {
      this.deps.report({
        trigger: trigger2,
        outcome: "suppressed_temporal",
        count: result.suppressedTemporal,
        durationMs
      });
    }
  }
  lifetimeSignal() {
    return this.lifetime.signal;
  }
  async cancelRecovery() {
    const recovery = this.recovery;
    if (recovery === void 0) return;
    recovery.controller.abort();
    await recovery.completed;
  }
  serialize(operation) {
    const current = this.lane.then(operation, operation);
    this.lane = current.then(
      () => void 0,
      (error42) => {
        this.deps.log(`[sand:resume-ownership] operation failed (${errorLogTag(error42)})`);
      }
    );
    return current;
  }
};
