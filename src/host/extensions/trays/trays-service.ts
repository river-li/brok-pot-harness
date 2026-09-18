var import_node_events3 = require("node:events");
var MAX_TRAYS = 20;
var MAX_TRAY_OCCURRENCES = 20;
function newId() {
  return crypto.randomUUID();
}
function contentDedupeKey({
  agentId,
  title,
  errorKind,
  actions
}) {
  const signature = (actions ?? []).map((action) => {
    switch (action.kind) {
      case "open-url":
        return [action.kind, action.label];
      case "upgrade":
      case "upgradeChoice":
        return [action.kind];
      case "switch-model":
        return [action.kind];
      case "dashboard-action":
        return [
          action.kind,
          action.action,
          action.label,
          JSON.stringify(
            Object.entries(action.args).sort(([first], [second]) => {
              if (first < second) return -1;
              return first > second ? 1 : 0;
            })
          )
        ];
    }
    const _exhaustive = action;
    return _exhaustive;
  });
  return `error:${JSON.stringify([agentId, errorKind ?? "", title, signature])}`;
}
function appendOccurrenceKeepingFirstAndLatest(occurrences, now) {
  const appended = [...occurrences, now];
  return appended.length <= MAX_TRAY_OCCURRENCES ? appended : appended.filter((_2, index) => index !== 1);
}
var TrayManager = class {
  emitter = new import_node_events3.EventEmitter();
  trays = [];
  activitySeq = 0;
  activitySeqByTrayId = /* @__PURE__ */ new Map();
  getTrays() {
    return this.trays;
  }
  pushError({
    agentId,
    title,
    titleKind,
    titleParams,
    detail,
    requestId: requestId2,
    errorKind,
    errorParams,
    rawDetail,
    actions,
    dedupeKey: dedupeKey2,
    count,
    severity
  }) {
    const now = Date.now();
    const key = dedupeKey2 ?? contentDedupeKey({ agentId, title, errorKind, actions });
    const index = this.trays.findIndex((tray2) => tray2.kind === "error" && tray2.dedupeKey === key);
    const existing = index === -1 ? null : this.trays[index];
    if (existing != null) {
      const existingCount = existing.count ?? 1;
      const isEpisodeRestart = count != null && count <= existingCount;
      const updated = {
        ...existing,
        title,
        ...titleKind != null ? { titleKind, titleParams } : { titleKind: void 0, titleParams: void 0 },
        detail: detail ?? existing.detail,
        requestId: requestId2 ?? existing.requestId,
        dedupeKey: key,
        count: count ?? existingCount + 1,
        occurrences: isEpisodeRestart ? [now] : appendOccurrenceKeepingFirstAndLatest(
          existing.occurrences ?? [existing.createdAt],
          now
        ),
        createdAt: now,
        ...errorKind != null ? { errorKind } : { errorKind: void 0 },
        ...errorParams != null ? { errorParams } : { errorParams: void 0 },
        ...rawDetail != null ? { rawDetail } : { rawDetail: void 0 },
        ...actions != null && actions.length > 0 ? { actions } : { actions: void 0 },
        ...severity != null ? { severity } : { severity: void 0 }
      };
      const next = [...this.trays];
      next[index] = updated;
      this.trays = next;
      this.activitySeqByTrayId.set(updated.id, ++this.activitySeq);
      this.emit({ type: "pushed", tray: updated });
      return updated;
    }
    const tray = {
      kind: "error",
      id: newId(),
      agentId,
      title,
      ...titleKind != null ? { titleKind } : {},
      ...titleKind != null && titleParams != null ? { titleParams } : {},
      detail,
      requestId: requestId2,
      createdAt: now,
      dedupeKey: key,
      count: count ?? 1,
      occurrences: [now],
      ...errorKind != null ? { errorKind } : {},
      ...errorParams != null ? { errorParams } : {},
      ...rawDetail != null ? { rawDetail } : {},
      ...actions != null && actions.length > 0 ? { actions } : {},
      ...severity != null ? { severity } : {}
    };
    this.trays = [...this.trays, tray];
    this.activitySeqByTrayId.set(tray.id, ++this.activitySeq);
    this.emit({ type: "pushed", tray });
    this.enforceCap();
    return tray;
  }
  clearAll() {
    if (this.trays.length === 0) return;
    this.trays = [];
    this.activitySeqByTrayId.clear();
    this.emit({ type: "cleared" });
  }
  dismiss(id) {
    const next = this.trays.filter((tray) => tray.id !== id);
    if (next.length === this.trays.length) return false;
    this.trays = next;
    this.activitySeqByTrayId.delete(id);
    this.emit({ type: "dismissed", id });
    return true;
  }
  clearForAgent(agentId) {
    const remaining = this.trays.filter((tray) => tray.agentId !== agentId);
    const removed = this.trays.filter((tray) => tray.agentId === agentId);
    if (removed.length === 0) return;
    this.trays = remaining;
    for (const tray of removed) {
      this.activitySeqByTrayId.delete(tray.id);
      this.emit({ type: "dismissed", id: tray.id });
    }
  }
  subscribe(listener) {
    this.emitter.on("event", listener);
    return () => {
      this.emitter.off("event", listener);
    };
  }
  enforceCap() {
    if (this.trays.length <= MAX_TRAYS) return;
    const overflow = this.trays.length - MAX_TRAYS;
    const activityOf2 = (tray) => this.activitySeqByTrayId.get(tray.id) ?? 0;
    const droppedIds = new Set(
      [...this.trays].sort((first, second) => activityOf2(first) - activityOf2(second)).slice(0, overflow).map((tray) => tray.id)
    );
    this.trays = this.trays.filter((tray) => !droppedIds.has(tray.id));
    for (const id of droppedIds) {
      this.activitySeqByTrayId.delete(id);
      this.emit({ type: "dismissed", id });
    }
  }
  emit(event) {
    this.emitter.emit("event", event);
  }
};
