/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/local-tool-permission/local-tool-permission-controller.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var import_node_crypto51 = require("node:crypto");
var SAND_LOCAL_TOOL_SETTLED_ID_MEMORY = 64;
var SETTLED_STATUS_OF_RESOLUTION = {
  "allow-once": "allowed",
  deny: "denied",
  always: "always",
  never: "never"
};
function movedStandingSetting(resolution, standing) {
  if (standing !== "global") return void 0;
  return resolution === "always" || resolution === "never" ? resolution : void 0;
}
var SAND_LOCAL_TOOL_REFUSAL_DIRECTION_WINDOW = 64;
var SAND_LOCAL_TOOL_REFUSED_ACTION_MEMORY_PER_AGENT = 512;
var SAND_LOCAL_TOOL_FORGOTTEN_AGENT_MEMORY = 256;
var SAND_LOCAL_TOOL_TARGET_MAX_CHARS = 1e4;
function askKey(agentId, toolCallId, machineId, action, target) {
  return `${agentId}\0${toolCallId}\0${machineId ?? ""}\0${action}\0${target}`;
}
function refusalKey(agentId, machineId, action, target) {
  const digest = (0, import_node_crypto51.createHash)("sha256").update(target, "utf8").digest("hex");
  return `${agentId}\0${machineId ?? ""}\0${action}\0${digest}`;
}
var SandLocalToolPermissionController = class {
  constructor(options2) {
    this.options = options2;
    this.askTtlMs = options2.askTtlMs ?? SAND_LOCAL_TOOL_ASK_TTL_MS;
    this.now = options2.now ?? Date.now;
  }
  options;
  pendingByKey = /* @__PURE__ */ new Map();
  pendingById = /* @__PURE__ */ new Map();
  approvalsById = /* @__PURE__ */ new Map();
  directionEpochs = /* @__PURE__ */ new Map();
  refusedActions = /* @__PURE__ */ new Map();
  saturatedDirections = /* @__PURE__ */ new Map();
  alwaysGrantedAtEpochByMachine = /* @__PURE__ */ new Map();
  forgottenAgents = /* @__PURE__ */ new Set();
  notedPermissions = /* @__PURE__ */ new Map();
  settledStatuses = /* @__PURE__ */ new Map();
  listeners = /* @__PURE__ */ new Set();
  askTtlMs;
  now;
  permission(machineId) {
    return this.options.getPermission(machineId);
  }
  blockedReason(machineId) {
    return this.permission(machineId) === "never" ? SAND_LOCAL_TOOLS_DISABLED_MESSAGE : void 0;
  }
  requiresApproval(machineId) {
    return this.permission(machineId) === "ask";
  }
  async awaitDesktopStandingDecision(args) {
    const permission = this.permission(args.machineId);
    if (permission === "never") {
      return { allowed: false, reason: SAND_LOCAL_TOOLS_DISABLED_MESSAGE };
    }
    if (permission === "always") {
      return { allowed: true };
    }
    return await this.authorize(
      {
        agentId: args.agentId,
        toolCallId: args.toolCallId,
        action: "run-command",
        directionEpoch: this.directionEpoch(args.agentId)
      },
      {
        action: "run-command",
        target: args.command ?? "",
        ...args.description !== void 0 && args.description.length > 0 ? { description: args.description } : {},
        ...args.machineId !== void 0 ? { machineId: args.machineId } : {},
        signal: args.signal
      }
    );
  }
  async authorize(scope, request5) {
    const permission = this.permission(request5.machineId);
    if (permission === "never") {
      return { allowed: false, reason: SAND_LOCAL_TOOLS_DISABLED_MESSAGE };
    }
    if (scope !== void 0) {
      const refusal = this.refusalFor(scope, request5);
      if (refusal !== void 0) return { allowed: false, reason: refusal };
    }
    if (localToolActionStanding(request5.action) === "setting") {
      return this.options.getMessagesEnabled() ? { allowed: true } : { allowed: false, reason: SAND_MESSAGES_DISABLED_MESSAGE };
    }
    if (permission === "always" && localToolActionStanding(request5.action) === "global" && !this.predatesStandingGrant(scope, request5.machineId)) {
      return { allowed: true };
    }
    if (scope === void 0) {
      return { allowed: false, reason: SAND_LOCAL_TOOLS_UNAPPROVED_MESSAGE };
    }
    if (scope.toolCallId === void 0) {
      const attached = this.findApprovalForResource(
        scope.agentId,
        request5.machineId,
        request5.attachToResourcePath
      );
      return attached !== void 0 ? { allowed: true, approvalId: attached.id } : { allowed: false, reason: SAND_LOCAL_TOOLS_UNAPPROVED_MESSAGE };
    }
    return await this.ask({ ...scope, toolCallId: scope.toolCallId }, request5);
  }
  completeScope(scope) {
    const toolCallId = scope?.toolCallId;
    if (scope === void 0 || toolCallId === void 0) return;
    for (const approval of [...this.approvalsById.values()]) {
      if (approval.agentId === scope.agentId && approval.toolCallId === toolCallId && !approval.outlivesScope) {
        this.retireApproval(approval.id);
      }
    }
  }
  beginTurn(agentId) {
    this.forgottenAgents.delete(agentId);
    this.directionEpochs.set(agentId, this.directionEpoch(agentId) + 1);
    for (const approval of [...this.approvalsById.values()]) {
      if (approval.agentId === agentId) this.retireApproval(approval.id);
    }
    for (const pending of [...this.pendingByKey.values()]) {
      if (pending.request.agentId !== agentId) continue;
      this.settle(pending, "expired", {
        allowed: false,
        reason: SAND_LOCAL_TOOLS_ASK_EXPIRED_MESSAGE
      });
    }
  }
  directionEpoch(agentId) {
    return this.directionEpochs.get(agentId) ?? 0;
  }
  forgetAgent(agentId) {
    this.beginTurn(agentId);
    for (const approval of [...this.approvalsById.values()]) {
      if (approval.agentId === agentId) this.retireApproval(approval.id);
    }
    this.directionEpochs.delete(agentId);
    this.saturatedDirections.delete(agentId);
    for (const grantedAtEpoch of this.alwaysGrantedAtEpochByMachine.values()) {
      grantedAtEpoch.delete(agentId);
    }
    for (const [key, refused2] of this.refusedActions) {
      if (refused2.agentId === agentId) this.refusedActions.delete(key);
    }
    this.forgottenAgents.add(agentId);
    if (this.forgottenAgents.size > SAND_LOCAL_TOOL_FORGOTTEN_AGENT_MEMORY) {
      const oldest = this.forgottenAgents.values().next();
      if (!oldest.done) this.forgottenAgents.delete(oldest.value);
    }
  }
  rememberedRefusalCount() {
    return this.refusedActions.size;
  }
  retainedAgentIds() {
    const ids = /* @__PURE__ */ new Set([
      ...this.directionEpochs.keys(),
      ...this.saturatedDirections.keys(),
      ...[...this.alwaysGrantedAtEpochByMachine.values()].flatMap((epochs) => [...epochs.keys()]),
      ...[...this.refusedActions.values()].map((refused2) => refused2.agentId),
      ...[...this.approvalsById.values()].map((approval) => approval.agentId),
      ...[...this.pendingByKey.values()].map((pending) => pending.request.agentId)
    ]);
    return [...ids];
  }
  notePermissionChanged(machineId) {
    const permission = this.permission(machineId);
    const previous = this.notedPermissions.get(machineId);
    this.noteStandingPermission(permission, machineId);
    if (permission === "ask") {
      if (previous === "never") {
        for (const [key, refused2] of this.refusedActions) {
          if (refused2.machineId === machineId) this.refusedActions.delete(key);
        }
      }
      return;
    }
    const allowed = permission === "always";
    if (!allowed) {
      for (const approval of [...this.approvalsById.values()]) {
        if (approval.machineId === machineId) this.retireApproval(approval.id);
      }
    }
    for (const pending of [...this.pendingByKey.values()]) {
      if (pending.request.machineId !== machineId) continue;
      if (allowed && this.isStalePending(pending)) {
        this.settle(pending, "expired", {
          allowed: false,
          reason: SAND_LOCAL_TOOLS_ABANDONED_MESSAGE
        });
        continue;
      }
      this.settle(
        pending,
        allowed ? "always" : "never",
        allowed ? { allowed: true } : { allowed: false, reason: SAND_LOCAL_TOOLS_DISABLED_MESSAGE },
        allowed ? void 0 : { rememberRefusal: false }
      );
    }
  }
  resolveRequest(requestId2, resolution) {
    const key = this.pendingById.get(requestId2);
    const pending = key === void 0 ? void 0 : this.pendingByKey.get(key);
    if (pending === void 0 || pending.request.id !== requestId2) {
      return void 0;
    }
    const standing = localToolActionStanding(pending.request.action);
    if (resolution === "always" && standing === "subject") resolution = "allow-once";
    if (resolution === "never" && standing !== "global") resolution = "deny";
    const settingMove = movedStandingSetting(resolution, standing);
    if (settingMove !== void 0) {
      try {
        this.options.setPermission(settingMove, pending.request.machineId);
      } catch {
      }
      if (settingMove === "always" && this.permission(pending.request.machineId) !== "always") {
        resolution = "allow-once";
      }
    }
    const allowed = resolution === "allow-once" || resolution === "always";
    if (allowed) {
      this.approvalsById.set(requestId2, {
        id: requestId2,
        agentId: pending.request.agentId,
        toolCallId: pending.toolCallId,
        outlivesScope: pending.outlivesScope,
        action: pending.request.action,
        target: pending.request.target,
        ...pending.request.machineId !== void 0 ? { machineId: pending.request.machineId } : {},
        ...pending.resourcePath !== void 0 ? { resourcePath: pending.resourcePath } : {}
      });
    }
    const deniedReason = resolution === "never" ? SAND_LOCAL_TOOLS_DISABLED_MESSAGE : SAND_LOCAL_TOOLS_DENIED_MESSAGE;
    const settled = this.settle(
      pending,
      SETTLED_STATUS_OF_RESOLUTION[resolution],
      allowed ? { allowed: true, approvalId: requestId2 } : { allowed: false, reason: deniedReason }
    );
    if (settingMove !== void 0) {
      this.notePermissionChanged(pending.request.machineId);
    }
    return settled;
  }
  getPendingRequestForAgent(agentId) {
    return [...this.pendingByKey.values()].find((pending) => pending.request.agentId === agentId)?.request;
  }
  getPendingRequestById(requestId2) {
    const key = this.pendingById.get(requestId2);
    return key === void 0 ? void 0 : this.pendingByKey.get(key)?.request;
  }
  wasSettled(requestId2) {
    return this.settledStatuses.has(requestId2);
  }
  settledStatus(requestId2) {
    return this.settledStatuses.get(requestId2);
  }
  liveApprovalIds() {
    return [...this.approvalsById.keys()];
  }
  withdrawActions(actions) {
    const retiring = new Set(actions);
    for (const approval of [...this.approvalsById.values()]) {
      if (retiring.has(approval.action)) this.retireApproval(approval.id);
    }
    for (const pending of [...this.pendingByKey.values()]) {
      if (!retiring.has(pending.request.action)) continue;
      this.settle(
        pending,
        "denied",
        { allowed: false, reason: SAND_LOCAL_TOOLS_DENIED_MESSAGE },
        { rememberRefusal: false }
      );
    }
  }
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
  findApprovalForResource(agentId, machineId, resourcePath) {
    const normalized = normalizeResourcePath(resourcePath);
    if (normalized === void 0) return void 0;
    return [...this.approvalsById.values()].find(
      (approval) => approval.agentId === agentId && approval.machineId === machineId && normalizeResourcePath(approval.resourcePath) === normalized
    );
  }
  retireApproval(approvalId) {
    if (!this.approvalsById.delete(approvalId)) return;
    this.options.onApprovalRetired?.(approvalId);
  }
  scopeEpoch(scope) {
    return scope.directionEpoch ?? this.directionEpoch(scope.agentId);
  }
  refusalFor(scope, request5) {
    if (this.forgottenAgents.has(scope.agentId)) {
      return SAND_LOCAL_TOOLS_STALE_TASK_MESSAGE;
    }
    const epoch = this.scopeEpoch(scope);
    const saturatedAt = this.saturatedDirections.get(scope.agentId);
    if (saturatedAt !== void 0 && epoch <= saturatedAt) {
      return SAND_LOCAL_TOOLS_STALE_TASK_MESSAGE;
    }
    const refused2 = this.refusedActions.get(
      refusalKey(scope.agentId, request5.machineId, request5.action, request5.target)
    );
    return refused2 !== void 0 && refused2.directionEpoch >= epoch ? SAND_LOCAL_TOOLS_ABANDONED_MESSAGE : void 0;
  }
  predatesStandingGrant(scope, machineId) {
    if (scope === void 0) return false;
    const grantedAt = this.alwaysGrantedAtEpochByMachine.get(machineId)?.get(scope.agentId);
    return grantedAt !== void 0 && this.scopeEpoch(scope) < grantedAt;
  }
  isStalePending(pending) {
    return pending.directionEpoch < this.directionEpoch(pending.request.agentId);
  }
  noteStandingPermission(permission, machineId) {
    const widened = permission === "always" && this.notedPermissions.get(machineId) !== "always";
    this.notedPermissions.set(machineId, permission);
    if (!widened) return;
    const grantedAtEpoch = /* @__PURE__ */ new Map();
    for (const [agentId, epoch] of this.directionEpochs) {
      grantedAtEpoch.set(agentId, epoch);
    }
    this.alwaysGrantedAtEpochByMachine.set(machineId, grantedAtEpoch);
  }
  noteRefusalForgotten(refused2) {
    const marker17 = this.saturatedDirections.get(refused2.agentId);
    if (marker17 === void 0 || refused2.directionEpoch > marker17) {
      this.saturatedDirections.set(refused2.agentId, refused2.directionEpoch);
    }
  }
  rememberRefusedAction(pending) {
    const agentId = pending.request.agentId;
    const key = refusalKey(
      agentId,
      pending.request.machineId,
      pending.request.action,
      pending.request.target
    );
    const remembered = this.refusedActions.get(key);
    this.refusedActions.set(key, {
      agentId,
      machineId: pending.request.machineId,
      directionEpoch: remembered === void 0 ? pending.directionEpoch : Math.max(remembered.directionEpoch, pending.directionEpoch)
    });
    this.reclaimRefusedActions(agentId);
  }
  reclaimRefusedActions(agentId) {
    const mine = [...this.refusedActions].filter(([, refused2]) => refused2.agentId === agentId);
    let held = mine.length;
    if (held <= SAND_LOCAL_TOOL_REFUSED_ACTION_MEMORY_PER_AGENT) return;
    const current = this.directionEpoch(agentId);
    const forget = (key, refused2) => {
      this.refusedActions.delete(key);
      this.noteRefusalForgotten(refused2);
      held -= 1;
    };
    for (const [key, refused2] of mine) {
      if (held <= SAND_LOCAL_TOOL_REFUSED_ACTION_MEMORY_PER_AGENT) break;
      if (current - refused2.directionEpoch > SAND_LOCAL_TOOL_REFUSAL_DIRECTION_WINDOW) {
        forget(key, refused2);
      }
    }
    for (const [key, refused2] of mine) {
      if (held <= SAND_LOCAL_TOOL_REFUSED_ACTION_MEMORY_PER_AGENT) break;
      if (!this.refusedActions.has(key)) continue;
      forget(key, refused2);
    }
  }
  async ask(scope, request5) {
    const covered = [...this.approvalsById.values()].find(
      (approval) => approval.agentId === scope.agentId && (approval.toolCallId === scope.toolCallId || approval.resourcePath !== void 0) && localToolApprovalCovers(approval, request5)
    );
    if (covered !== void 0) {
      if (request5.outlivesScope === true && !covered.outlivesScope) {
        this.approvalsById.set(covered.id, { ...covered, outlivesScope: true });
      }
      return { allowed: true, approvalId: covered.id };
    }
    if (!this.options.canAsk(scope.agentId)) {
      return { allowed: false, reason: SAND_LOCAL_TOOLS_ASK_UNAVAILABLE_MESSAGE };
    }
    if (!this.options.hasLiveComputer(scope.agentId)) {
      return { allowed: false, reason: SAND_NO_LOCAL_MACHINE_MESSAGE };
    }
    const scopeApproved = scope.action !== void 0 && [...this.approvalsById.values()].some(
      (approval) => approval.agentId === scope.agentId && approval.toolCallId === scope.toolCallId && approval.machineId === request5.machineId && approval.action === scope.action
    );
    if (scope.action !== void 0 && scope.action !== request5.action && !scopeApproved) {
      return { allowed: false, reason: SAND_LOCAL_TOOLS_PREPARATORY_MESSAGE };
    }
    if (request5.signal?.aborted === true) {
      return { allowed: false, reason: SAND_LOCAL_TOOLS_ASK_CANCELLED_MESSAGE };
    }
    const target = request5.target;
    if (target.length > SAND_LOCAL_TOOL_TARGET_MAX_CHARS) {
      return { allowed: false, reason: SAND_LOCAL_TOOLS_TARGET_TOO_LARGE_MESSAGE };
    }
    const key = askKey(scope.agentId, scope.toolCallId, request5.machineId, request5.action, target);
    const existing = this.pendingByKey.get(key);
    if (existing !== void 0) return await this.join(existing, request5.signal);
    const createdAtMs2 = this.now();
    const description9 = request5.description?.trim();
    const recipientName = request5.recipientName?.trim();
    const pending = {
      request: {
        id: (0, import_node_crypto51.randomBytes)(32).toString("hex"),
        agentId: scope.agentId,
        action: request5.action,
        target,
        ...request5.machineId !== void 0 ? { machineId: request5.machineId } : {},
        ...request5.targetKind !== void 0 ? { targetKind: request5.targetKind } : {},
        status: "pending",
        createdAtMs: createdAtMs2,
        expiresAtMs: createdAtMs2 + this.askTtlMs,
        ...description9 !== void 0 && description9.length > 0 ? { description: description9 } : {},
        ...recipientName !== void 0 && recipientName.length > 0 ? { recipientName } : {}
      },
      waiters: /* @__PURE__ */ new Set(),
      expiryAbort: new AbortController(),
      toolCallId: scope.toolCallId,
      resourcePath: normalizeResourcePath(request5.resourcePath),
      outlivesScope: request5.outlivesScope === true,
      directionEpoch: this.scopeEpoch(scope)
    };
    this.pendingByKey.set(key, pending);
    this.pendingById.set(pending.request.id, key);
    void delay3(this.askTtlMs, pending.expiryAbort.signal).then(() => {
      if (pending.expiryAbort.signal.aborted) return;
      this.settle(pending, "expired", {
        allowed: false,
        reason: SAND_LOCAL_TOOLS_ASK_EXPIRED_MESSAGE
      });
    });
    this.emit({ type: "created", request: pending.request });
    return await this.join(pending, request5.signal);
  }
  async join(pending, signal) {
    return await new Promise((resolve29) => {
      const settleWaiter = (decision) => {
        pending.waiters.delete(settleWaiter);
        if (signal !== void 0) signal.removeEventListener("abort", onAbort);
        resolve29(decision);
        if (pending.waiters.size === 0 && this.pendingById.has(pending.request.id)) {
          this.settle(pending, "expired", {
            allowed: false,
            reason: SAND_LOCAL_TOOLS_ASK_CANCELLED_MESSAGE
          });
        }
      };
      const onAbort = () => settleWaiter({
        allowed: false,
        reason: SAND_LOCAL_TOOLS_ASK_CANCELLED_MESSAGE
      });
      pending.waiters.add(settleWaiter);
      if (signal !== void 0) {
        if (signal.aborted) {
          onAbort();
          return;
        }
        signal.addEventListener("abort", onAbort, { once: true });
      }
    });
  }
  settle(pending, status, decision, options2) {
    pending.expiryAbort.abort();
    const key = this.pendingById.get(pending.request.id);
    if (key !== void 0 && this.pendingByKey.get(key) === pending) {
      this.pendingByKey.delete(key);
    }
    this.pendingById.delete(pending.request.id);
    const settled = { ...pending.request, status };
    pending.request = settled;
    const rememberRefusal = options2?.rememberRefusal ?? (status !== "allowed" && status !== "always");
    if (rememberRefusal) {
      this.rememberRefusedAction(pending);
    }
    this.settledStatuses.set(pending.request.id, status);
    if (this.settledStatuses.size > SAND_LOCAL_TOOL_SETTLED_ID_MEMORY) {
      const oldest = this.settledStatuses.keys().next();
      if (!oldest.done) this.settledStatuses.delete(oldest.value);
    }
    for (const waiter of [...pending.waiters]) waiter(decision);
    pending.waiters.clear();
    this.emit({ type: "settled", request: settled });
    return settled;
  }
  emit(event) {
    for (const listener of this.listeners) listener(event);
  }
};

