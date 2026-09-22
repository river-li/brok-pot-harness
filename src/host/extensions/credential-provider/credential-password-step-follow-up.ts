var PASSWORD_STEP_FOLLOW_UP_WINDOW_MS = 9e4;
var PASSWORD_STEP_RESOLVE_RETRY_DELAY_MS = 1e4;
var MAX_PASSWORD_STEP_ATTEMPTS = 3;
var CredentialPasswordStepFollowUp = class {
  constructor(options2) {
    this.options = options2;
  }
  options;
  sessions = /* @__PURE__ */ new Map();
  run = null;
  disposed = false;
  watch(session) {
    if (this.disposed) return;
    this.sessions.set(session.targetWebSocketDebuggerUrl, {
      ...session,
      startedAtMs: this.now(),
      attempts: 0,
      retryNotBeforeMs: 0,
      inFlight: false,
      filledByBox: false
    });
    this.audit(session, session.loginOrigin, { outcome: "success", reason: "follow-up-armed" });
    if (this.run === null) {
      this.run = this.options.polling.start(() => this.scan());
    }
  }
  sessionFor(targetWebSocketDebuggerUrl, item, targetSite) {
    this.pruneExpired();
    const session = this.sessions.get(targetWebSocketDebuggerUrl);
    return session !== void 0 && session.item.credentialId === item.credentialId && session.item.connectionId === item.connectionId && trustedBrowserOrigin(targetSite) === session.loginOrigin ? session : void 0;
  }
  markFilled(targetWebSocketDebuggerUrl) {
    const session = this.sessions.get(targetWebSocketDebuggerUrl);
    if (session === void 0) return;
    session.filledByBox = true;
    this.sessions.delete(targetWebSocketDebuggerUrl);
  }
  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    this.sessions.clear();
    this.stopPolling();
  }
  async scan() {
    this.pruneExpired();
    if (this.sessions.size === 0) {
      this.stopPolling();
      return;
    }
    let discovery;
    try {
      discovery = await this.options.filler.listPages();
    } catch (error42) {
      this.options.reportFailure("password-step-list-pages", error42);
      return;
    }
    for (const session of [...this.sessions.values()]) {
      if (this.disposed) return;
      const target = discovery.targets.find(
        (candidate) => candidate.webSocketDebuggerUrl === session.targetWebSocketDebuggerUrl
      );
      if (session.inFlight) continue;
      if (target === void 0) {
        if (discovery.complete) {
          this.end(session, session.loginOrigin, { outcome: "refused", reason: "target-closed" });
        }
        continue;
      }
      if (session.attempts >= MAX_PASSWORD_STEP_ATTEMPTS) continue;
      if (trustedBrowserOrigin(target.url) !== session.loginOrigin || matchCredentialItemToSite(session.item, target.url) == null) {
        continue;
      }
      let state;
      try {
        state = await this.options.filler.inspect(target);
      } catch (error42) {
        this.options.reportFailure("password-step-inspect", error42);
        continue;
      }
      if (state === null) continue;
      const liveUrl = state.audit?.targetUrl ?? target.url;
      if (trustedBrowserOrigin(liveUrl) !== session.loginOrigin || matchCredentialItemToSite(session.item, liveUrl) == null) {
        continue;
      }
      if (state.formKind === "one-time-code") {
        this.end(session, liveUrl, { outcome: "refused", reason: "one-time-code-form" });
        continue;
      }
      if (state.formKind === "signup-or-reset") {
        this.end(session, liveUrl, { outcome: "refused", reason: "signup-or-reset-page" });
        continue;
      }
      if (state.formKind !== "login" || !state.hasFocus) continue;
      if (this.now() < session.retryNotBeforeMs) continue;
      const liveTarget = liveUrl === target.url ? target : { ...target, url: liveUrl };
      if (this.options.canRequest?.(liveTarget) === false) continue;
      await this.requestPasswordStep(session, liveTarget);
    }
    if (this.sessions.size === 0) this.stopPolling();
  }
  async requestPasswordStep(session, target) {
    session.inFlight = true;
    session.attempts += 1;
    const keepsSession = session.attempts < MAX_PASSWORD_STEP_ATTEMPTS;
    try {
      const result = await this.options.resolvePasswordStep(session, target);
      if (result.filled || session.filledByBox) {
        this.end(session, target.url, { outcome: "success", reason: "filled" });
        return;
      }
      this.options.reportFailure(
        "password-step-fill",
        new Error("Password-step autofill was refused.")
      );
      const refusal = { outcome: "refused", reason: "fill-refused" };
      if (result.retryable === true && keepsSession) this.audit(session, target.url, refusal);
      else this.end(session, target.url, refusal);
    } catch (error42) {
      if (session.filledByBox) {
        this.audit(session, target.url, { outcome: "success", reason: "filled" });
        return;
      }
      this.audit(session, target.url, { outcome: "failed", reason: "resolve-login-failed" });
      this.options.reportFailure("password-step-resolve", error42);
      if (!keepsSession) this.sessions.delete(session.targetWebSocketDebuggerUrl);
      session.retryNotBeforeMs = this.now() + PASSWORD_STEP_RESOLVE_RETRY_DELAY_MS;
    } finally {
      session.inFlight = false;
    }
  }
  end(session, targetUrl, result) {
    this.sessions.delete(session.targetWebSocketDebuggerUrl);
    this.audit(session, targetUrl, result);
  }
  audit(session, targetUrl, result) {
    this.options.audit?.({
      event: session.approvalMode === "always-allow" ? "auto-fill" : "allow-once",
      operation: "password-step-request",
      outcome: result.outcome,
      reason: result.reason,
      targetUrl,
      credentialId: session.item.credentialId,
      approvalMode: session.approvalMode
    });
  }
  pruneExpired() {
    const now = this.now();
    for (const session of [...this.sessions.values()]) {
      if (!session.inFlight && now - session.startedAtMs >= PASSWORD_STEP_FOLLOW_UP_WINDOW_MS) {
        this.end(session, session.loginOrigin, {
          outcome: "refused",
          reason: "follow-up-expired"
        });
      }
    }
  }
  stopPolling() {
    this.run?.dispose();
    this.run = null;
  }
  now() {
    return (this.options.now ?? Date.now)();
  }
};
