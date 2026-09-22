var SAND_AUTO_REVIEW_APPROVAL_TTL_MS = 10 * 60 * 1e3;
var SAND_AUTO_REVIEW_MAX_PENDING_PER_AGENT = 4;
var SAND_AUTO_REVIEW_HOST_GENERATION = (0, import_node_crypto40.randomUUID)();
function sandAutoReviewApprovalExpiryPolicy(source) {
  return source === "turn" || source === "handoff-resume" ? "park" : "ttl";
}
var SAND_AUTO_REVIEW_MODES_OFF = {
  hostShell: "off",
  boxShell: "off",
  mcp: "off",
  computer: "off",
  automationWrite: "off",
  cloudAgent: "off",
  subagentLaunch: "off"
};
var SAND_AUTO_REVIEW_MODES_SHADOW = {
  hostShell: "shadow",
  boxShell: "shadow",
  mcp: "shadow",
  computer: "shadow",
  automationWrite: "shadow",
  cloudAgent: "shadow",
  subagentLaunch: "shadow"
};
var SAND_AUTO_REVIEW_MODES_ENFORCE = {
  hostShell: "enforce",
  boxShell: "enforce",
  mcp: "enforce",
  computer: "enforce",
  automationWrite: "enforce",
  cloudAgent: "enforce",
  subagentLaunch: "enforce"
};
function resolveSandAutoReviewModes(args) {
  if (!args.settingsEnabled) return SAND_AUTO_REVIEW_MODES_OFF;
  if (args.localOverride !== void 0) {
    return {
      hostShell: args.localOverride,
      boxShell: args.localOverride,
      mcp: args.localOverride,
      computer: args.localOverride,
      automationWrite: args.localOverride,
      cloudAgent: args.localOverride,
      subagentLaunch: args.localOverride
    };
  }
  return args.enforceEnabled ? SAND_AUTO_REVIEW_MODES_ENFORCE : SAND_AUTO_REVIEW_MODES_SHADOW;
}
var SAND_AUTO_REVIEW_UNAVAILABLE_REASON = "This action needs Auto-review approval, which isn't available in this conversation. Run it from a direct chat with the assistant.";
function formatSandAutoReviewDeniedReason(classifierReason) {
  return `Auto-review blocked this action: ${classifierReason}. Do not retry the same action, and do not switch to another anonymous public file host, pastebin, disposable transfer link, or similar courier \u2014 that is the same unauthorized data-exposure crossing. Ask the user what they want next. Use a safer alternative only when it is a genuinely authorized path.`;
}
function formatSandAutoReviewInterruptedForUpdateReason(classifierReason) {
  return `A host update interrupted this approval request before the user could answer \u2014 the user did NOT deny it. After you resume, re-run the action; if it is blocked again, use the tool's approval-retry parameter to raise a fresh approval card. The pending review reason was: ${classifierReason}`;
}
var SAND_AUTO_REVIEW_REASON_MAX_CHARS = 500;
function sanitizeReason(reason) {
  const trimmed = reason.trim();
  if (trimmed.length === 0) return "This action requires your approval.";
  return trimmed.slice(0, SAND_AUTO_REVIEW_REASON_MAX_CHARS);
}
function sanitizeSummary(summary) {
  const trimmed = summary.trim();
  if (trimmed.length === 0) return "Sensitive action";
  return trimmed.slice(0, 500);
}
function sanitizeSummaryCopy(summary, summaryCopy) {
  return summary.trim().length === 0 ? { kind: "sensitive_action" } : summaryCopy;
}
var SAND_AUTO_REVIEW_COMMAND_MAX_CHARS = 4e3;
function sanitizeCommand(command) {
  if (command === void 0) return void 0;
  const trimmed = command.trim();
  if (trimmed.length === 0) return void 0;
  return trimmed.slice(0, SAND_AUTO_REVIEW_COMMAND_MAX_CHARS);
}
function sanitizeProposedRule(proposedRule) {
  if (proposedRule === void 0) return void 0;
  const trimmed = proposedRule.replace(/\s+/g, " ").trim();
  if (trimmed.length === 0) return void 0;
  return trimmed.slice(0, 500);
}
function buildSandAutoReviewPendingApproval(args) {
  const { request: request5 } = args;
  const command = sanitizeCommand(request5.command);
  const expiryPolicy = request5.expiryPolicy ?? "ttl";
  const proposedRule = sanitizeProposedRule(request5.proposedRule);
  const reason = sanitizeReason(request5.reason);
  const reasonCopy = request5.reason.trim().length === 0 ? { kind: "approval_required" } : void 0;
  const summary = sanitizeSummary(request5.summary);
  const summaryCopy = sanitizeSummaryCopy(request5.summary, request5.summaryCopy);
  return {
    id: (0, import_node_crypto40.randomUUID)(),
    agentId: args.agentId,
    surface: request5.surface,
    fingerprint: request5.fingerprint,
    reason,
    ...reasonCopy === void 0 ? {} : { reasonCopy },
    summary,
    ...summaryCopy === void 0 ? {} : { summaryCopy },
    ...command !== void 0 ? { command } : {},
    ...proposedRule !== void 0 ? { proposedRule } : {},
    userMessageEpoch: args.userMessageEpoch,
    hostGeneration: args.hostGeneration,
    createdAtMs: args.createdAtMs,
    ...expiryPolicy === "ttl" ? { expiresAtMs: args.createdAtMs + args.approvalTtlMs } : {},
    status: "pending"
  };
}
function decideResolvedSandAutoReviewApproval(args) {
  if (args.resolution === "denied") {
    return {
      approved: false,
      reason: formatSandAutoReviewDeniedReason(args.approval.reason)
    };
  }
  const command = args.approvedCommand?.trim();
  return {
    approved: true,
    ...args.approvalPlatform === void 0 ? {} : { approvalPlatform: args.approvalPlatform },
    ...command == null || command.length === 0 ? {} : { command }
  };
}
var SandAutoReviewController = class {
  constructor(options2) {
    this.options = options2;
    this.approvalTtlMs = options2.approvalTtlMs ?? SAND_AUTO_REVIEW_APPROVAL_TTL_MS;
    this.maxPendingPerAgent = options2.maxPendingPerAgent ?? SAND_AUTO_REVIEW_MAX_PENDING_PER_AGENT;
    this.approvalsResolvable = options2.approvalsResolvable ?? true;
    this.approvalsUnavailableReason = options2.approvalsUnavailableReason ?? SAND_AUTO_REVIEW_UNAVAILABLE_REASON;
    this.now = options2.now ?? Date.now;
  }
  options;
  pending = /* @__PURE__ */ new Map();
  approvalTtlMs;
  maxPendingPerAgent;
  approvalsResolvable;
  approvalsUnavailableReason;
  now;
  userMessageEpoch = 0;
  pausingForHostWindDown = false;
  listeners = /* @__PURE__ */ new Set();
  get epoch() {
    return this.userMessageEpoch;
  }
  get agentId() {
    return this.options.agentId;
  }
  get hostGeneration() {
    return this.options.hostGeneration;
  }
  get canResolveApprovals() {
    return this.approvalsResolvable;
  }
  reportDisplayRecheckFailed(agentId) {
    try {
      this.options.onDisplayRecheckFailed?.({
        agentId: agentId ?? this.options.agentId
      });
    } catch (error42) {
      process.stderr.write(
        `sand.auto_review.display_recheck_observer_failed error_class=${errorLogTag(error42)}
`
      );
    }
  }
  async requestApproval(request5) {
    const agentId = request5.agentId ?? this.options.agentId;
    if (request5.signal?.aborted === true) {
      return { approved: false, reason: "The action was cancelled." };
    }
    if (this.pausingForHostWindDown) {
      return {
        approved: false,
        reason: formatSandAutoReviewInterruptedForUpdateReason(request5.reason)
      };
    }
    if (!this.approvalsResolvable) {
      return { approved: false, reason: this.approvalsUnavailableReason };
    }
    const pendingForAgent = [...this.pending.values()].filter(
      (record2) => record2.approval.agentId === agentId
    );
    if (pendingForAgent.length >= this.maxPendingPerAgent) {
      return {
        approved: false,
        reason: "Too many actions are already waiting for Auto-review approval; resolve those first."
      };
    }
    const expiryPolicy = request5.expiryPolicy ?? "ttl";
    const approval = buildSandAutoReviewPendingApproval({
      request: request5,
      agentId,
      userMessageEpoch: this.userMessageEpoch,
      hostGeneration: this.options.hostGeneration,
      createdAtMs: this.now(),
      approvalTtlMs: this.approvalTtlMs
    });
    return await new Promise((resolve29) => {
      const expiryAbort = new AbortController();
      if (expiryPolicy === "ttl") {
        void delay3(this.approvalTtlMs, expiryAbort.signal).then(() => {
          if (expiryAbort.signal.aborted) return;
          this.retire(approval.id, "ttl", {
            approved: false,
            reason: formatSandAutoReviewDeniedReason(approval.reason)
          });
        });
      }
      const record2 = {
        approval,
        resolve: resolve29,
        expiryAbort,
        signal: request5.signal
      };
      if (request5.signal !== void 0) {
        const abortListener = () => {
          this.retire(approval.id, "cancelled", {
            approved: false,
            reason: "The action was cancelled."
          });
        };
        record2.abortListener = abortListener;
        request5.signal.addEventListener("abort", abortListener, {
          once: true
        });
      }
      this.pending.set(approval.id, record2);
      this.emit({ type: "created", approval });
    });
  }
  resolveApproval(approvalId, resolution, options2) {
    const record2 = this.pending.get(approvalId);
    if (record2 === void 0 || record2.approval.hostGeneration !== this.options.hostGeneration || record2.approval.userMessageEpoch !== this.userMessageEpoch || record2.approval.expiresAtMs !== void 0 && record2.approval.expiresAtMs <= this.now()) {
      return void 0;
    }
    const resolved = { ...record2.approval, status: resolution };
    this.deletePending(approvalId, record2);
    this.emit({ type: "resolved", approval: resolved });
    record2.resolve(
      decideResolvedSandAutoReviewApproval({
        approval: record2.approval,
        resolution,
        ...options2?.approvalPlatform === void 0 ? {} : { approvalPlatform: options2.approvalPlatform },
        ...options2?.approvedCommand === void 0 ? {} : { approvedCommand: options2.approvedCommand }
      })
    );
    return resolved;
  }
  getPendingApprovals() {
    return [...this.pending.values()].map((record2) => record2.approval);
  }
  getPendingApprovalForAgent(agentId) {
    return [...this.pending.values()].find((record2) => record2.approval.agentId === agentId)?.approval;
  }
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
  beginUserMessageEpoch() {
    this.userMessageEpoch += 1;
    this.expire("user_redirect");
  }
  beginTurn() {
  }
  async endTurn() {
  }
  expireSurfaces(surfaces) {
    for (const [id, record2] of [...this.pending]) {
      if (surfaces.has(record2.approval.surface)) {
        this.retire(id, "settings_change", {
          approved: false,
          reason: "Auto-review settings changed; retry the action."
        });
      }
    }
  }
  expire(cause) {
    for (const [id, record2] of [...this.pending]) {
      this.retire(id, cause, {
        approved: false,
        reason: formatSandAutoReviewDeniedReason(record2.approval.reason)
      });
    }
  }
  expireForHostPause() {
    this.pausingForHostWindDown = true;
    for (const [id, record2] of [...this.pending]) {
      this.retire(id, "quiesce", {
        approved: false,
        reason: formatSandAutoReviewInterruptedForUpdateReason(record2.approval.reason)
      });
    }
  }
  cancelHostPause() {
    this.pausingForHostWindDown = false;
  }
  retire(approvalId, cause, decision) {
    const record2 = this.pending.get(approvalId);
    if (record2 === void 0) return;
    const expired = { ...record2.approval, status: "expired" };
    this.deletePending(approvalId, record2);
    this.emit({ type: "expired", approval: expired, cause });
    record2.resolve(decision);
  }
  deletePending(approvalId, record2) {
    record2.expiryAbort.abort();
    if (record2.signal !== void 0 && record2.abortListener !== void 0) {
      record2.signal.removeEventListener("abort", record2.abortListener);
    }
    this.pending.delete(approvalId);
  }
  emit(event) {
    for (const listener of this.listeners) listener(event);
  }
};
function fingerprintSandAutoReviewTarget(target) {
  return (0, import_node_crypto40.createHash)("sha256").update(JSON.stringify(target)).digest("hex");
}
