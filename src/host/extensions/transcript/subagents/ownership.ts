/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/transcript/subagents/ownership.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_errors();
var ParentSessionClosingError = class extends SandDomainError {
  name = "ParentSessionClosingError";
};
var SubagentOwnershipRegistry = class {
  constructor(isClosing, onIdle) {
    this.isClosing = isClosing;
    this.onIdle = onIdle;
  }
  isClosing;
  onIdle;
  owners = /* @__PURE__ */ new Map();
  forSession(session) {
    const sources = () => this.owners.get(session)?.keys() ?? [];
    const ownerOf = (id) => {
      for (const owner of sources()) {
        if (owner.isRunning(id)) return owner;
      }
    };
    return {
      assertOpen: () => {
        if (this.isClosing(session))
          throw new ParentSessionClosingError("Parent session is closing.");
      },
      join: (owner) => this.join(session, owner),
      isRunning: (id) => ownerOf(id) !== void 0,
      listRunningSubagents: () => [...sources()].flatMap((owner) => owner.listRunningSubagents()),
      getRunningSubagent: (id) => ownerOf(id)?.getRunningSubagent(id) ?? null,
      steerSubagent: (id, message) => ownerOf(id)?.steerSubagent(id, message) ?? "not-running",
      abortSubagent: (id) => ownerOf(id)?.abortSubagent(id) ?? "not-running"
    };
  }
  hasPendingWork(session) {
    return this.owners.has(session);
  }
  join(session, owner) {
    if (!owner.hasPendingWork()) return;
    let sources = this.owners.get(session);
    if (sources === void 0) {
      sources = /* @__PURE__ */ new Map();
      this.owners.set(session, sources);
    }
    if (this.isClosing(session)) owner.abortAll("Parent session is closing.");
    if (!sources.has(owner)) sources.set(owner, this.monitor(session, owner, sources));
  }
  async monitor(session, owner, sources) {
    do {
      await owner.drain();
    } while (owner.hasPendingWork());
    sources.delete(owner);
    if (sources.size === 0) {
      this.owners.delete(session);
      if (!this.isClosing(session)) this.onIdle(session);
    }
  }
  async abortAndDrain(reason, agentId) {
    for (; ; ) {
      const drains = [];
      for (const [session, sources] of this.owners) {
        if (agentId !== void 0 && session.id !== agentId) continue;
        for (const [owner, drain] of sources) {
          owner.abortAll(reason);
          drains.push(drain);
        }
      }
      if (drains.length === 0) return;
      await Promise.all(drains);
    }
  }
};

