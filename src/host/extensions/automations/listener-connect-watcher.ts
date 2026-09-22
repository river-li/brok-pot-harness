init_errors();
var DEFAULT_WATCH_TIMEOUT_MS = 60 * 60 * 1e3;
var MAX_REMEMBERED_GRANTED_REPOS = 32;
var ListenerConnectWatcher = class {
  constructor(deps) {
    this.deps = deps;
  }
  deps;
  pending = /* @__PURE__ */ new Map();
  recentlyCompletedAtMs = /* @__PURE__ */ new Map();
  grantedRepoSlugs = /* @__PURE__ */ new Set();
  handoffsWhileSuspended = [];
  timer = null;
  isTicking = false;
  isSuspended = false;
  isDisposed = false;
  notifyHandoff(platform2, handoff = {}) {
    if (this.isDisposed) return;
    if (this.isSuspended) {
      this.handoffsWhileSuspended.push({ platform: platform2, handoff });
      return;
    }
    const connected2 = handoff.connected ?? true;
    const granted = handoff.grantedRepos?.map((repo) => repo.toLowerCase()) ?? [];
    for (const watch4 of this.watchesOn(platform2)) {
      if (handoff.agentIds != null && !handoff.agentIds.includes(watch4.agentId)) continue;
      if (watch4.repoSlug != null) {
        if (connected2 && granted.includes(watch4.repoSlug)) this.complete(watch4);
      } else if (connected2) {
        this.complete(watch4);
      }
    }
  }
  grantedRepos() {
    return [...this.grantedRepoSlugs];
  }
  completesOnGrant(platform2, agentId, repoSlug) {
    const key = watchKey(platform2, agentId);
    const watch4 = this.pending.get(key);
    if (watch4 == null) return this.completedRecently(key);
    return watch4.repoSlug == null || watch4.repoSlug === repoSlug?.toLowerCase();
  }
  completedRecently(key) {
    const completedAtMs = this.recentlyCompletedAtMs.get(key);
    if (completedAtMs == null) return false;
    if (Date.now() - completedAtMs > (this.deps.watchTimeoutMs ?? DEFAULT_WATCH_TIMEOUT_MS)) {
      this.recentlyCompletedAtMs.delete(key);
      return false;
    }
    return true;
  }
  watch(watch4) {
    if (this.isDisposed) return;
    const repoSlug = watch4.repoSlug == null || watch4.repoSlug.length === 0 ? void 0 : watch4.repoSlug.toLowerCase();
    this.recentlyCompletedAtMs.delete(watchKey(watch4.platform, watch4.agentId));
    this.pending.set(watchKey(watch4.platform, watch4.agentId), {
      agentId: watch4.agentId,
      platform: watch4.platform,
      expiresAtMs: Date.now() + (this.deps.watchTimeoutMs ?? DEFAULT_WATCH_TIMEOUT_MS),
      ...repoSlug == null ? {} : { repoSlug },
      isArmed: false,
      lastProbeFailure: void 0
    });
    if (this.isSuspended) return;
    this.ensureLoop();
    void this.tick();
  }
  suspend() {
    if (this.isDisposed || this.isSuspended) return;
    this.isSuspended = true;
    this.timer?.dispose();
    this.timer = null;
  }
  resume() {
    if (this.isDisposed || !this.isSuspended) return;
    this.isSuspended = false;
    const replay = this.handoffsWhileSuspended;
    this.handoffsWhileSuspended = [];
    for (const { platform: platform2, handoff } of replay) this.notifyHandoff(platform2, handoff);
    if (this.pending.size === 0) return;
    this.ensureLoop();
    void this.tick();
  }
  dispose() {
    this.isDisposed = true;
    this.isSuspended = true;
    this.pending.clear();
    this.recentlyCompletedAtMs.clear();
    this.grantedRepoSlugs.clear();
    this.handoffsWhileSuspended = [];
    this.stopLoopIfIdle();
  }
  watchesOn(platform2) {
    return [...this.pending.values()].filter((watch4) => watch4.platform === platform2);
  }
  complete(watch4) {
    if (watch4.repoSlug != null) this.rememberGranted(watch4.repoSlug);
    const key = watchKey(watch4.platform, watch4.agentId);
    this.pending.delete(key);
    const now = Date.now();
    this.recentlyCompletedAtMs.set(key, now);
    const ttlMs = this.deps.watchTimeoutMs ?? DEFAULT_WATCH_TIMEOUT_MS;
    for (const [completedKey, completedAtMs] of this.recentlyCompletedAtMs) {
      if (now - completedAtMs > ttlMs) this.recentlyCompletedAtMs.delete(completedKey);
    }
    this.deps.onConnected(watch4.agentId, watch4.platform, watch4.repoSlug);
    this.stopLoopIfIdle();
  }
  rememberGranted(repoSlug) {
    this.grantedRepoSlugs.delete(repoSlug);
    this.grantedRepoSlugs.add(repoSlug);
    while (this.grantedRepoSlugs.size > MAX_REMEMBERED_GRANTED_REPOS) {
      const oldest = this.grantedRepoSlugs.values().next().value;
      if (oldest == null) break;
      this.grantedRepoSlugs.delete(oldest);
    }
  }
  ensureLoop() {
    if (this.timer != null || this.isSuspended || this.isDisposed) return;
    this.timer = this.deps.polling.start(async () => {
      try {
        await this.tick();
      } catch {
      }
    });
  }
  stopLoopIfIdle() {
    if (this.pending.size > 0 && !this.isSuspended && !this.isDisposed) {
      return;
    }
    this.timer?.dispose();
    this.timer = null;
  }
  isPending(watch4) {
    return this.pending.get(watchKey(watch4.platform, watch4.agentId)) === watch4;
  }
  async tick() {
    if (this.isTicking || this.isSuspended || this.isDisposed) return;
    this.isTicking = true;
    try {
      const now = Date.now();
      const connectionByPlatform = /* @__PURE__ */ new Map();
      for (const watch4 of [...this.pending.values()]) {
        if (watch4.expiresAtMs <= now) {
          this.pending.delete(watchKey(watch4.platform, watch4.agentId));
          continue;
        }
        let isConnected = connectionByPlatform.get(watch4.platform);
        if (isConnected === void 0) {
          isConnected = await this.deps.isPlatformConnected(watch4.platform).then(
            (connected2) => connected2,
            (error42) => {
              watch4.lastProbeFailure = errorLogTag(error42);
              return null;
            }
          );
          connectionByPlatform.set(watch4.platform, isConnected);
        }
        if (this.isDisposed) return;
        if (isConnected == null || !this.isPending(watch4)) continue;
        if (!isConnected) {
          watch4.isArmed = true;
          continue;
        }
        if (watch4.repoSlug != null || !watch4.isArmed) continue;
        if (this.isSuspended || this.isDisposed) continue;
        this.complete(watch4);
      }
    } finally {
      this.isTicking = false;
      this.stopLoopIfIdle();
    }
  }
};
function watchKey(platform2, agentId) {
  return `${platform2}\0${agentId}`;
}
