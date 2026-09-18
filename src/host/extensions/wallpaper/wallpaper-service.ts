init_errors();
var UNRESOLVED_PLAN_RETRY_MS = 6e4;
var WallpaperToneScheduler = class {
  constructor(deps) {
    this.deps = deps;
  }
  deps;
  pendingWake;
  unsubscribe;
  generation = 0;
  syncing = false;
  disposed = false;
  start() {
    this.unsubscribe = this.deps.subscribeToTimeZoneChange(() => this.beginSync());
    this.beginSync();
  }
  dispose() {
    this.disposed = true;
    this.cancelPendingWake();
    this.unsubscribe?.();
    this.unsubscribe = void 0;
  }
  beginSync() {
    if (this.disposed) return;
    this.cancelPendingWake();
    this.generation += 1;
    if (this.syncing) return;
    void this.drainSyncs();
  }
  async drainSyncs() {
    this.syncing = true;
    try {
      let synced = 0;
      while (!this.disposed && synced !== this.generation) {
        synced = this.generation;
        await this.sync(synced);
      }
    } catch (error41) {
      this.deps.log(`wallpaper tone sync failed (${errorLogTag(error41)}); retrying`);
      if (!this.disposed) this.armWake(UNRESOLVED_PLAN_RETRY_MS, this.generation);
    } finally {
      this.syncing = false;
    }
  }
  cancelPendingWake() {
    this.pendingWake?.dispose();
    this.pendingWake = void 0;
  }
  async sync(generation) {
    const plan = await this.deps.resolvePlan();
    if (this.isStale(generation)) return;
    if (plan === void 0) {
      this.armWake(UNRESOLVED_PLAN_RETRY_MS, generation);
      return;
    }
    const paintStartedAt = this.deps.clock.monotonicNow();
    await this.deps.paint();
    if (this.isStale(generation)) return;
    const remainingMs = Math.max(
      0,
      plan.msUntilNextBoundary - (this.deps.clock.monotonicNow() - paintStartedAt)
    );
    this.deps.log(
      `wallpaper: painted tone ${plan.tone}; next boundary in ${Math.round(remainingMs / 1e3)}s`
    );
    this.armWake(remainingMs, generation);
  }
  isStale(generation) {
    return this.disposed || generation !== this.generation;
  }
  armWake(delayMs, generation) {
    this.cancelPendingWake();
    this.pendingWake = this.deps.clock.schedule(delayMs, () => {
      this.pendingWake = void 0;
      if (this.isStale(generation)) return;
      this.beginSync();
    });
  }
};
