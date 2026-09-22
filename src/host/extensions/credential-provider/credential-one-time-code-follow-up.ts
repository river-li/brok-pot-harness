/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/credential-provider/credential-one-time-code-follow-up.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var ONE_TIME_CODE_FOLLOW_UP_WINDOW_MS = 5 * 6e4;
var MAX_ONE_TIME_CODE_ATTEMPTS = 3;
function challengeSignature(target, state) {
  return [
    target.url,
    state.documentTimeOriginMs ?? "unknown-document",
    ...(state.audit?.elements ?? []).map(
      (element) => [element.tag, element.type ?? "", element.name ?? "", element.id ?? ""].join(":")
    )
  ].join("\0");
}
var CredentialOneTimeCodeFollowUp = class {
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
      lastSignature: void 0,
      inFlight: false
    });
    if (this.run === null) {
      this.run = this.options.polling.start(() => this.scan());
    }
  }
  sessionFor(targetWebSocketDebuggerUrl, item, targetSite) {
    this.pruneExpired();
    const session = this.sessions.get(targetWebSocketDebuggerUrl);
    return session !== void 0 && session.item.credentialId === item.credentialId && session.item.connectionId === item.connectionId && trustedBrowserOrigin(targetSite) === session.loginOrigin ? session : void 0;
  }
  retryAfterLeaseRefusal(targetWebSocketDebuggerUrl) {
    const session = this.sessions.get(targetWebSocketDebuggerUrl);
    if (session === void 0) return;
    session.attempts = Math.max(0, session.attempts - 1);
    session.lastSignature = void 0;
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
      this.options.reportFailure("one-time-code-list-pages", error42);
      return;
    }
    for (const session of [...this.sessions.values()]) {
      if (this.disposed) return;
      const target = discovery.targets.find(
        (candidate) => candidate.webSocketDebuggerUrl === session.targetWebSocketDebuggerUrl
      );
      if (target === void 0) {
        if (discovery.complete) this.sessions.delete(session.targetWebSocketDebuggerUrl);
        continue;
      }
      if (session.inFlight || session.attempts >= MAX_ONE_TIME_CODE_ATTEMPTS) continue;
      if (trustedBrowserOrigin(target.url) !== session.loginOrigin || matchCredentialItemToSite(session.item, target.url) == null) {
        continue;
      }
      let state;
      try {
        state = await this.options.filler.inspect(target);
      } catch (error42) {
        this.options.reportFailure("one-time-code-inspect", error42);
        continue;
      }
      if (state === null || state.formKind !== "one-time-code" || !state.hasFocus) continue;
      const liveUrl = state.audit?.targetUrl ?? target.url;
      if (trustedBrowserOrigin(liveUrl) !== session.loginOrigin || matchCredentialItemToSite(session.item, liveUrl) == null) {
        continue;
      }
      const liveTarget = liveUrl === target.url ? target : { ...target, url: liveUrl };
      const signature = challengeSignature(liveTarget, state);
      if (session.lastSignature === signature) continue;
      await this.requestOneTimeCode(session, liveTarget, signature);
    }
    if (this.sessions.size === 0) this.stopPolling();
  }
  async requestOneTimeCode(session, target, signature) {
    session.inFlight = true;
    session.attempts += 1;
    session.lastSignature = signature;
    try {
      const result = await this.options.resolveOneTimeCode(session, target);
      this.auditRequest(session, target, {
        outcome: result.filled ? "success" : "refused",
        reason: result.filled ? "filled" : "fill-refused"
      });
      if (!result.filled) {
        this.options.reportFailure(
          "one-time-code-fill",
          new Error("One-time code autofill was refused.")
        );
      }
    } catch (error42) {
      this.auditRequest(session, target, { outcome: "failed", reason: "resolve-login-failed" });
      this.options.reportFailure("one-time-code-resolve", error42);
    } finally {
      session.inFlight = false;
    }
  }
  auditRequest(session, target, result) {
    this.options.audit?.({
      event: session.approvalMode === "always-allow" ? "auto-fill" : "allow-once",
      operation: "one-time-code-request",
      outcome: result.outcome,
      reason: result.reason,
      targetUrl: target.url,
      credentialId: session.item.credentialId,
      approvalMode: session.approvalMode
    });
  }
  pruneExpired() {
    const now = this.now();
    for (const [key, session] of this.sessions) {
      if (now - session.startedAtMs >= ONE_TIME_CODE_FOLLOW_UP_WINDOW_MS) {
        this.sessions.delete(key);
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

