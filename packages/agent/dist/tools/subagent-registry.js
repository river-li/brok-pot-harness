/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/tools/subagent-registry.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var SubagentRegistry = class {
  constructor() {
    this.subagents = /* @__PURE__ */ new Map();
    this.toolCallIdToSubagentId = /* @__PURE__ */ new Map();
  }
  get lastAbortOptions() {
    return this._lastAbortOptions;
  }
  register(id, handle, toolCallId) {
    if (this.subagents.has(id)) {
      const prev = this.subagents.get(id);
      this.subagents.delete(id);
      for (const [tcId, subId] of this.toolCallIdToSubagentId) {
        if (subId === id) {
          this.toolCallIdToSubagentId.delete(tcId);
          break;
        }
      }
      prev.cancel();
    }
    this.subagents.set(id, handle);
    if (toolCallId !== void 0) {
      this.toolCallIdToSubagentId.set(toolCallId, id);
    }
  }
  cancel(id, options2) {
    this._lastAbortOptions = options2;
    let handle = this.subagents.get(id);
    let subagentIdToDelete = id;
    if (handle === void 0) {
      const subagentId = this.toolCallIdToSubagentId.get(id);
      if (subagentId !== void 0) {
        handle = this.subagents.get(subagentId);
        subagentIdToDelete = subagentId;
        this.toolCallIdToSubagentId.delete(id);
      }
    }
    if (handle !== void 0) {
      try {
        handle.cancel(options2);
      } finally {
        this.subagents.delete(subagentIdToDelete);
        for (const [tcId, subId] of this.toolCallIdToSubagentId) {
          if (subId === subagentIdToDelete) {
            this.toolCallIdToSubagentId.delete(tcId);
            break;
          }
        }
      }
    }
  }
  cleanup(id) {
    this.subagents.delete(id);
    for (const [tcId, subId] of this.toolCallIdToSubagentId) {
      if (subId === id) {
        this.toolCallIdToSubagentId.delete(tcId);
        break;
      }
    }
  }
  get(id) {
    return this.subagents.get(id);
  }
  has(id) {
    return this.subagents.has(id);
  }
  /**
   * Get the number of currently registered subagents.
   * Useful for detecting parallel subagent execution.
   */
  get size() {
    return this.subagents.size;
  }
  /**
   * Cancel all registered subagents. Called when the parent agent is cancelled.
   */
  cancelAll(options2) {
    this._lastAbortOptions = options2;
    const excludeToolCallIds = new Set(options2?.excludeToolCallIds ?? []);
    const excludedSubagentIds = /* @__PURE__ */ new Set();
    for (const toolCallId of excludeToolCallIds) {
      const subagentId = this.toolCallIdToSubagentId.get(toolCallId);
      if (subagentId !== void 0) {
        excludedSubagentIds.add(subagentId);
      }
    }
    const entries = Array.from(this.subagents.entries()).filter(([subagentId]) => !excludedSubagentIds.has(subagentId));
    for (const [subagentId] of entries) {
      this.subagents.delete(subagentId);
      for (const [tcId, mappedSubagentId] of this.toolCallIdToSubagentId) {
        if (mappedSubagentId === subagentId) {
          this.toolCallIdToSubagentId.delete(tcId);
          break;
        }
      }
    }
    for (const [, handle] of entries) {
      try {
        handle.cancel(options2);
      } catch {
      }
    }
  }
};
var subagentRegistryResource = createResource((_remoteExecManager) => {
  return new SubagentRegistry();
}, (_implementation, _controlledExecManager) => {
});

