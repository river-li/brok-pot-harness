/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/forever-box/host-box.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_errors();
var SandBoxCapabilityError2 = class extends SandDomainError {
  name = "SandBoxCapabilityError";
};
var RUN_STATE_PROBE_AGENT_ID = "";
var HostBox = class {
  constructor(inner) {
    this.inner = inner;
  }
  inner;
  vncUrls = /* @__PURE__ */ new Map();
  forkVncUrls = /* @__PURE__ */ new Map();
  listeners = /* @__PURE__ */ new Set();
  lastReported = /* @__PURE__ */ new Map();
  connectionEpochs = /* @__PURE__ */ new Map();
  imageUpdateAvailable;
  subscribe(listener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }
  buildWindows(agentId) {
    const main = this.vncUrls.get(agentId);
    const forks = this.forkVncUrls.get(agentId);
    if (main == null && (forks == null || forks.size === 0)) return void 0;
    const windows = [];
    if (main != null) {
      windows.push({
        windowIndex: SAND_BOX_PRIMARY_WINDOW_INDEX,
        vncUrl: main
      });
    }
    if (forks != null) {
      for (const windowIndex of [...forks.keys()].sort((a, b2) => a - b2)) {
        const vncUrl = forks.get(windowIndex);
        if (vncUrl != null) windows.push({ windowIndex, vncUrl });
      }
    }
    return windows;
  }
  recordConnection(agentId, connection) {
    this.vncUrls.set(agentId, connection.vncUrl);
    this.connectionEpochs.set(agentId, (this.connectionEpochs.get(agentId) ?? 0) + 1);
    if (connection.imageUpdateAvailable !== void 0) {
      this.imageUpdateAvailable = connection.imageUpdateAvailable;
    }
  }
  recordImageUpdateAvailable(value) {
    if (value === void 0 || value === this.imageUpdateAvailable) return;
    this.imageUpdateAvailable = value;
    for (const agentId of [...this.lastReported.keys()]) {
      const vncUrl = this.vncUrls.get(agentId);
      if (vncUrl != null) {
        this.notify(this.runningStatus(agentId, vncUrl));
        continue;
      }
      const last = this.lastReported.get(agentId);
      if (last != null) this.notify({ ...last, imageUpdateAvailable: value });
    }
  }
  runningStatus(agentId, vncUrl) {
    return {
      agentId,
      state: "running",
      vncUrl,
      windows: this.buildWindows(agentId),
      imageUpdateAvailable: this.imageUpdateAvailable
    };
  }
  async ensureReady(ctx, agentId) {
    const connection = await this.inner.ensureReady(ctx, agentId);
    this.recordConnection(agentId, connection);
    this.notify(this.runningStatus(agentId, connection.vncUrl));
    return connection;
  }
  async hibernate(_ctx, _agentId) {
  }
  async runState(ctx, agentId) {
    return await this.inner.runState(ctx, agentId);
  }
  describe() {
    return boxDescription(this.inner);
  }
  async isAvailable() {
    return await boxIsAvailable(this.inner);
  }
  isPreparing(agentId) {
    return boxIsPreparing(this.inner, agentId);
  }
  getAgentWindowIndex(agentId) {
    return boxAgentWindowIndex(this.inner, agentId);
  }
  getAssignedWindowIndexes() {
    return boxAssignedWindowIndexes(this.inner);
  }
  getTerminalsFolder() {
    return boxTerminalsFolder(this.inner);
  }
  listBoxes() {
    return this.inner.listBoxes();
  }
  maxWindows() {
    return boxMaxWindows(this.inner);
  }
  async ensureWindow(ctx, agentId, windowIndex, opts) {
    if (this.inner.ensureWindow == null) {
      throw new SandBoxCapabilityError2("This box does not support multiple desktop windows.");
    }
    if (!this.vncUrls.has(agentId)) {
      await this.ensureReady(ctx, agentId);
    }
    const window2 = await this.inner.ensureWindow(ctx, agentId, windowIndex, opts);
    if (isPrimaryWindowIndex(window2.windowIndex)) {
      this.vncUrls.set(agentId, window2.vncUrl);
    } else {
      let forks = this.forkVncUrls.get(agentId);
      if (forks == null) {
        forks = /* @__PURE__ */ new Map();
        this.forkVncUrls.set(agentId, forks);
      }
      forks.set(window2.windowIndex, window2.vncUrl);
    }
    this.notify(this.runningStatus(agentId, this.vncUrls.get(agentId) ?? window2.vncUrl));
    return window2;
  }
  async releaseWindow(ctx, agentId) {
    const epoch = this.connectionEpochs.get(agentId) ?? 0;
    try {
      await this.inner.releaseWindow?.(ctx, agentId);
    } catch {
    }
    if ((this.connectionEpochs.get(agentId) ?? 0) !== epoch) return;
    this.vncUrls.delete(agentId);
    this.forkVncUrls.delete(agentId);
    this.connectionEpochs.delete(agentId);
    this.notify({ agentId, state: "absent", vncUrl: null });
    this.lastReported.delete(agentId);
  }
  async applyEnvironment(ctx, update) {
    await boxApplyEnvironment(this.inner, ctx, update);
  }
  async loadMcpServers(ctx, configJson) {
    return await boxLoadMcpServers(this.inner, ctx, configJson);
  }
  async mcpResourceAccessor(ctx) {
    return await boxMcpResourceAccessor(this.inner, ctx);
  }
  async agentMcpHost(ctx, agentId) {
    return await boxAgentMcpHost(this.inner, ctx, agentId);
  }
  async uploadFile(ctx, agentId, boxPath, data) {
    await this.inner.uploadFile(ctx, agentId, boxPath, data);
  }
  async downloadFile(ctx, agentId, boxPath, options2) {
    return await this.inner.downloadFile(ctx, agentId, boxPath, options2);
  }
  async getStatus(ctx, agentId) {
    const state = await this.inner.runState(ctx, agentId);
    if (state !== "running") {
      this.vncUrls.delete(agentId);
      this.forkVncUrls.delete(agentId);
      return this.report({
        agentId,
        state,
        vncUrl: null,
        imageUpdateAvailable: this.imageUpdateAvailable
      });
    }
    const cached2 = this.vncUrls.get(agentId);
    if (cached2 != null) {
      return this.report(this.runningStatus(agentId, cached2));
    }
    return this.report({
      agentId,
      state: "absent",
      vncUrl: null,
      imageUpdateAvailable: this.imageUpdateAvailable
    });
  }
  getImageUpdateAvailable() {
    return this.imageUpdateAvailable;
  }
  async isBoxRunning(ctx) {
    return await this.inner.runState(ctx, RUN_STATE_PROBE_AGENT_ID) === "running";
  }
  async ensure(ctx, agentId) {
    const connection = await this.ensureReady(ctx, agentId);
    return this.runningStatus(agentId, connection.vncUrl);
  }
  async recreateInBox(ctx, opts) {
    if (this.inner.recreateInBox == null) {
      throw new SandBoxCapabilityError2("This computer can't be recreated from inside the box.");
    }
    return await this.inner.recreateInBox(ctx, opts);
  }
  notify(status) {
    this.lastReported.set(status.agentId, status);
    for (const listener of this.listeners) listener(status);
  }
  report(status) {
    this.lastReported.set(status.agentId, status);
    return status;
  }
};

