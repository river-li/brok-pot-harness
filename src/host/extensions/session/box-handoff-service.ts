var SNAPSHOT_TIMEOUT_MS = 5e3;
var MAX_DOMAIN_LENGTH = 64;
var WEBAUTHN_ARM_UNTIL_PATH = "/tmp/sand-webauthn-armed-until";
var WEBAUTHN_HANDOFF_ARM_MS = 45 * 60 * 1e3;
var boxHelpRequest = createCounter("grok_bot.box_help.request");
function boxHelpFacts(request3) {
  const reason = request3.telemetry?.reason;
  const domain2 = request3.telemetry?.domain;
  const idpDomain = request3.telemetry?.idpDomain;
  const turnId = request3.telemetry?.turnId;
  const subagentAgentId = request3.telemetry?.subagentAgentId;
  let boundedReason;
  if (reason === "auth" || reason === "captcha" || reason === "payment") {
    boundedReason = reason;
  } else if (reason !== void 0) {
    boundedReason = "other";
  }
  return {
    ...boundedReason !== void 0 ? { reason: boundedReason } : {},
    ...domain2 !== void 0 ? { domain: domain2.slice(0, MAX_DOMAIN_LENGTH) } : {},
    ...idpDomain !== void 0 ? { idp_domain: idpDomain.slice(0, MAX_DOMAIN_LENGTH) } : {},
    ...turnId !== void 0 && turnId.length > 0 ? { turn_id: turnId } : {},
    ...subagentAgentId !== void 0 && subagentAgentId.length > 0 ? { subagent_agent_id: subagentAgentId } : {}
  };
}
var BoxHandoffService = class {
  constructor(deps) {
    this.deps = deps;
  }
  deps;
  pending = /* @__PURE__ */ new Map();
  get(agentId) {
    return this.pending.get(agentId)?.info ?? null;
  }
  forget(agentId) {
    this.pending.delete(agentId);
  }
  start(request3) {
    void this.armWebAuthnForHandoff(request3.agentId);
    const live = this.pending.get(request3.agentId);
    if (live != null) {
      boxHelpRequest.increment(this.deps.ctx, 1, { result: "already_pending" });
      return {
        kind: "already-pending",
        requestId: live.info.requestId,
        instruction: live.info.instruction
      };
    }
    const requestId2 = crypto.randomUUID();
    const facts = boxHelpFacts(request3);
    this.pending.set(request3.agentId, {
      info: { instruction: request3.instruction, requestId: requestId2 },
      facts,
      startedAtMs: Date.now()
    });
    boxHelpRequest.increment(this.deps.ctx, 1, {
      result: "started",
      reason: facts.reason ?? "unspecified",
      ...this.domainTags(facts)
    });
    this.deps.onStarted({
      agentId: request3.agentId,
      instruction: request3.instruction
    });
    this.deps.onStatusChanged(request3.agentId);
    void this.captureSnapshot(request3, requestId2, facts);
    return { kind: "started", requestId: requestId2 };
  }
  async armWebAuthnForHandoff(agentId) {
    const until = Date.now() + WEBAUTHN_HANDOFF_ARM_MS;
    try {
      await this.deps.box.uploadFile(
        this.deps.ctx,
        agentId,
        WEBAUTHN_ARM_UNTIL_PATH,
        new TextEncoder().encode(`${until}
`)
      );
    } catch (error41) {
      this.deps.ctx.get(loggerKey).log(this.deps.ctx, {
        level: "warn",
        message: `webauthn handoff arm failed: ${errorLogTag(error41)}`,
        timestamp: /* @__PURE__ */ new Date(),
        context: this.deps.ctx,
        error: error41
      });
    }
  }
  async end(agentId, trigger2) {
    const live = this.pending.get(agentId);
    const decision = decideBoxHandBack(live?.info, trigger2);
    if (decision.kind === "none") return;
    this.pending.delete(agentId);
    if (live !== void 0) this.reportBoxHelpResolved(agentId, live, decision);
    await this.deps.onEnded({
      agentId,
      requestId: decision.requestId,
      resolution: decision.resolution,
      trigger: decision.trigger
    });
    this.deps.onStatusChanged(agentId);
  }
  async captureSnapshot(request3, requestId2, facts) {
    const agentId = request3.agentId;
    let snapshotCaptured = false;
    try {
      const screenshot = await Promise.race([
        this.grabScreenshot(agentId),
        delay3(SNAPSHOT_TIMEOUT_MS).then(() => null)
      ]);
      if (screenshot != null && screenshot.length > 0) {
        const current = this.pending.get(agentId);
        if (current != null && current.info.requestId === requestId2) {
          this.pending.set(agentId, {
            ...current,
            info: {
              ...current.info,
              snapshotDataUrl: `data:image/webp;base64,${screenshot}`
            }
          });
          snapshotCaptured = true;
          this.deps.onStatusChanged(agentId);
        }
      }
    } catch {
    } finally {
      this.reportBoxHelp(request3, requestId2, facts, snapshotCaptured);
    }
  }
  reportBoxHelp(request3, requestId2, facts, snapshotCaptured) {
    this.deps.telemetry.reportBoxHelp({
      conversationId: request3.agentId,
      turnId: facts.turn_id,
      subagentId: facts.subagent_agent_id,
      snapshotCaptured,
      reason: request3.telemetry?.reason
    });
    this.deps.telemetry.trackEvent("sand.box_help", {
      agent_id: request3.agentId,
      request_id: requestId2,
      snapshot_captured: snapshotCaptured,
      ...facts
    });
  }
  domainTags(facts) {
    const privacyMode = this.deps.privacyMode.get();
    const domain2 = userFormDomainMetricTag(facts.domain, privacyMode);
    const idpDomain = userFormDomainMetricTag(facts.idp_domain, privacyMode);
    return {
      ...domain2 !== void 0 ? { domain: domain2 } : {},
      ...idpDomain !== void 0 ? { idp_domain: idpDomain } : {}
    };
  }
  reportBoxHelpResolved(agentId, live, decision) {
    this.deps.telemetry.trackEvent("sand.box_help.resolved", {
      agent_id: agentId,
      request_id: decision.requestId,
      outcome: decision.resolution,
      trigger: decision.trigger,
      time_to_resolve_ms: Math.max(0, Date.now() - live.startedAtMs),
      ...live.facts
    });
  }
  async grabScreenshot(agentId) {
    const connection = await this.deps.box.ensureReady(this.deps.ctx, agentId);
    const computerUse = connection.remoteAccessor.get(computerUseExecutorResource);
    const result = await computerUse.execute(
      this.deps.ctx,
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
};
