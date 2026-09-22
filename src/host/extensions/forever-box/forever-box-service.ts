/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/forever-box/forever-box-service.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_dist4();
init_scheduling();
init_computer_use_tool_pb();
init_bounded();
init_errors();
var SandForeverBoxError = class extends SandDomainError {
  name = "SandForeverBoxError";
};
var RECREATE_UNAVAILABLE_MESSAGE = "Couldn't reach the service that updates this computer. It is unchanged. Try again in a moment; if it keeps failing, the backend may need to be updated.";
var FOREVER_BOX_MIGRATION_TTL_MS = 5 * 6e4;
var FOREVER_BOX_SCREENSHOT_TIMEOUT_MS = 5e3;
var FOREVER_BOX_RECREATE_FLUSH_WAIT_MS = 1e4;
var FOREVER_BOX_IMAGE_WATCH_INTERVAL_MS = 24 * 60 * 6e4;
var FOREVER_BOX_IMAGE_CHECK_TIMEOUT_MS = 3e4;
var ForeverBoxService = class {
  constructor(options2) {
    this.options = options2;
    this.box = options2.box;
    this.ctx = options2.ctx ?? createContext().withName("foreverBox");
    this.now = options2.now ?? (() => performance.now());
    this.isAutoUpdateEnabled = options2.autoUpdateEnabled;
    this.unsubscribeBox = this.box.subscribe((status) => {
      this.emit(this.decorateStatus(status));
    });
  }
  options;
  box;
  isAutoUpdateEnabled;
  ctx;
  listeners = /* @__PURE__ */ new Set();
  abort = new AbortController();
  unsubscribeBox;
  imagePolling;
  imagePollingStartDelay;
  migrationExpiry;
  isBusy = false;
  updateInFlight = false;
  updateFailureNotified = false;
  imageRefreshInFlight = false;
  migrating = false;
  stopped = false;
  now;
  start() {
    void this.seedImageUpdateAvailable();
    void this.startImagePolling();
  }
  subscribe(listener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }
  setBusy(isBusy) {
    this.isBusy = isBusy;
  }
  async getStatus(input) {
    return this.decorateStatus(await this.box.getStatus(this.ctx, input.id));
  }
  async ensure(input) {
    const ctx = this.ctx.with(sandBoxPullProgressKey, (progress) => {
      this.emitPullProgress(input.id, progress);
    });
    const status = await this.box.ensure(ctx, input.id);
    void this.maybeAutoUpdate(input.id, status.imageUpdateAvailable);
    return this.decorateStatus(status);
  }
  update(input) {
    return this.recreate(input.id);
  }
  async autoUpdateNow() {
    if (!this.options.isInBox()) {
      return { started: false, reason: "not-in-box" };
    }
    if (!this.options.autoUpdateEnabled) {
      return { started: false, reason: "auto-update-disabled" };
    }
    if (this.isBusy) return { started: false, reason: "busy" };
    if (this.updateInFlight) {
      return { started: false, reason: "update-in-flight" };
    }
    this.updateInFlight = true;
    try {
      const imageCheck = await this.refreshImageUpdateAvailable("pre_hibernation", {
        coalesce: false
      });
      if (imageCheck.outcome === "failed" || imageCheck.outcome === "timeout") {
        return { started: false, reason: "staleness-check-failed" };
      }
      if (imageCheck.available !== true) {
        return { started: false, reason: "no-update-required" };
      }
      this.options.telemetry.reportBoxRecreateDecided({
        trigger: "hibernation_auto_update",
        mode: "pod_recreate",
        preserved: "true"
      });
      try {
        const result = await this.requestRecreate();
        if (result.started) this.updateFailureNotified = false;
        return result;
      } catch (error42) {
        this.options.log(
          `pre-hibernation update failed; computer unchanged: ${errorLogTag(error42)}`
        );
        return { started: false, reason: "recreate-unavailable" };
      }
    } finally {
      this.updateInFlight = false;
    }
  }
  setMigrating(input) {
    this.migrating = input.migrating;
    this.migrationExpiry?.dispose();
    this.migrationExpiry = input.migrating ? this.options.migrationExpiry.arm("migration", () => {
      this.migrating = false;
      this.migrationExpiry = void 0;
    }) : void 0;
  }
  async releaseAgent(agentId) {
    await this.box.releaseWindow(this.ctx, agentId);
  }
  async captureScreenshot(agentId) {
    try {
      return await this.options.screenshotDeadline.run(async () => {
        const connection = await this.box.ensureReady(this.ctx, agentId);
        return await captureScreenshot(
          connection.remoteAccessor.get(computerUseExecutorResource),
          this.ctx
        );
      }, this.abort.signal);
    } catch (error42) {
      reportFallback("forever_box_service", error42);
      return null;
    }
  }
  dispose() {
    if (this.stopped) return;
    this.stopped = true;
    this.abort.abort();
    this.imagePollingStartDelay?.dispose();
    this.imagePolling?.dispose();
    this.migrationExpiry?.dispose();
    this.unsubscribeBox();
    this.listeners.clear();
  }
  decorateStatus(status) {
    return this.migrating ? { ...status, vncUrl: null, pull: { percent: 0 } } : status;
  }
  emit(status) {
    for (const listener of this.listeners) listener(status);
  }
  emitPullProgress(agentId, progress) {
    if (progress.done) return;
    this.emit(
      this.decorateStatus({
        agentId,
        state: "absent",
        vncUrl: null,
        pull: { percent: progress.percent }
      })
    );
  }
  async recreate(agentId) {
    let result;
    try {
      result = await this.requestRecreate();
    } catch (error42) {
      throw new SandForeverBoxError(RECREATE_UNAVAILABLE_MESSAGE, { cause: error42 });
    }
    if (!result.started) {
      const reason = result.reason.length > 0 ? result.reason : "the service declined the recreate";
      throw new SandForeverBoxError(`Couldn't update the computer (${reason}). It is unchanged.`);
    }
    this.updateFailureNotified = false;
    return this.decorateStatus({
      agentId,
      state: "running",
      vncUrl: null,
      pull: { percent: 0 }
    });
  }
  async requestRecreate() {
    try {
      await this.options.recreateFlushWaitDeadline.run(
        () => this.options.flushPendingUploads(),
        this.abort.signal
      );
    } catch (error42) {
      if (this.abort.signal.aborted) {
        throw error42;
      }
      this.options.log(`snapshot upload flush failed before box recreate: ${errorLogTag(error42)}`);
    }
    this.abort.signal.throwIfAborted();
    return await this.options.lifecycleClient.recreateInBox({ preserveData: true });
  }
  async maybeAutoUpdate(agentId, imageUpdateAvailable) {
    if (!this.options.autoUpdateEnabled) return;
    if (this.options.hostBundleAutoUpdateEnabled) return;
    if (imageUpdateAvailable !== true) return;
    if (this.isBusy || this.updateInFlight) return;
    this.updateInFlight = true;
    this.options.telemetry.reportBoxRecreateDecided({
      trigger: "auto_update",
      mode: "pod_recreate",
      preserved: "true"
    });
    try {
      await this.recreate(agentId ?? "");
      this.updateFailureNotified = false;
    } catch (error42) {
      this.options.log(
        `image update failed; computer stays on its current image: ${errorLogTag(error42)}`
      );
      if (!this.updateFailureNotified && agentId !== void 0) {
        this.updateFailureNotified = true;
        this.options.trays.pushError({
          agentId,
          ...hostTrayTitle({ kind: "computer_update_failed" }),
          errorKind: "computer_update_failed"
        });
      }
    } finally {
      this.updateInFlight = false;
    }
  }
  async refreshImageUpdateAvailable(trigger2, options2 = { coalesce: true }) {
    const startedAt = this.now();
    if (!this.options.isInBox()) {
      this.reportImageCheck({
        trigger: trigger2,
        outcome: "skipped",
        durationMs: this.elapsedSince(startedAt),
        skipReason: "outside_box"
      });
      return { outcome: "skipped" };
    }
    if (options2.coalesce && this.imageRefreshInFlight) {
      this.reportImageCheck({
        trigger: trigger2,
        outcome: "skipped",
        durationMs: this.elapsedSince(startedAt),
        skipReason: "in_flight"
      });
      return { outcome: "skipped" };
    }
    if (options2.coalesce) this.imageRefreshInFlight = true;
    try {
      const available = await this.options.imageCheckDeadline.run(
        (signal) => this.options.lifecycleClient.fetchImageUpdateAvailable(signal),
        this.abort.signal
      );
      this.box.recordImageUpdateAvailable(available);
      const outcome = available === void 0 ? "unanswered" : "answered";
      this.reportImageCheck({
        trigger: trigger2,
        outcome,
        durationMs: this.elapsedSince(startedAt)
      });
      return { outcome, available };
    } catch (error42) {
      if (this.abort.signal.aborted) {
        this.reportImageCheck({
          trigger: trigger2,
          outcome: "skipped",
          durationMs: this.elapsedSince(startedAt),
          skipReason: "cancelled"
        });
        return { outcome: "skipped" };
      }
      if (error42 instanceof DeadlineExceededError) {
        this.reportImageCheck({
          trigger: trigger2,
          outcome: "timeout",
          durationMs: this.elapsedSince(startedAt),
          error: SandError.boxImageCheckTimedOut()
        });
        return { outcome: "timeout" };
      }
      this.reportImageCheck({
        trigger: trigger2,
        outcome: "failed",
        durationMs: this.elapsedSince(startedAt),
        error: SandError.boxImageCheckFailed({
          errorClass: brandedErrorClass(errorClassOf(error42))
        })
      });
      return { outcome: "failed" };
    } finally {
      if (options2.coalesce) this.imageRefreshInFlight = false;
    }
  }
  async seedImageUpdateAvailable() {
    if (!this.options.isInBox()) return;
    try {
      await this.options.imageSeedRetry.runWithRetry(async () => {
        if ((await this.refreshImageUpdateAvailable("seed")).outcome !== "answered") {
          throw new SandForeverBoxError("image state unavailable");
        }
      }, this.abort.signal);
    } catch {
      return;
    }
  }
  async startImagePolling() {
    this.imagePollingStartDelay = this.options.imagePollingStartDelay.schedule(
      1,
      this.abort.signal
    );
    try {
      await this.imagePollingStartDelay.elapsed;
    } catch {
      return;
    } finally {
      this.imagePollingStartDelay?.dispose();
      this.imagePollingStartDelay = void 0;
    }
    if (this.stopped) return;
    this.imagePolling = this.options.imagePolling.start(
      () => this.watchForImageUpdate(),
      this.abort.signal
    );
  }
  async watchForImageUpdate() {
    await this.refreshImageUpdateAvailable("poll");
    if (this.options.hostBundleAutoUpdateEnabled || !this.options.autoUpdateEnabled || this.isBusy || this.updateInFlight) {
      return;
    }
    try {
      if (!await this.box.isBoxRunning(this.ctx)) return;
      const agentId = (await this.box.listBoxes()).find((box) => box.running)?.agentId;
      await this.maybeAutoUpdate(agentId, this.box.getImageUpdateAvailable());
    } catch (error42) {
      this.options.log(`image update watch failed: ${errorLogTag(error42)}`);
    }
  }
  reportImageCheck(report) {
    this.options.telemetry.reportBoxImageCheck(report);
  }
  elapsedSince(startedAt) {
    return Math.max(0, Math.round(this.now() - startedAt));
  }
};
async function captureScreenshot(executor, ctx) {
  const result = await executor.execute(
    ctx,
    new ComputerUseArgs({
      actions: [
        new ComputerUseAction({
          action: { case: "screenshot", value: new ScreenshotAction({}) }
        })
      ]
    })
  );
  if (result.result.case !== "success") return null;
  return result.result.value.screenshot ?? null;
}

