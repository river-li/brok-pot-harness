init_mcp_diagnostics();
function httpUrlOfMcpConfig(config2) {
  if (config2 == null || !("url" in config2)) return void 0;
  return typeof config2.url === "string" ? config2.url : void 0;
}
var CONNECTOR_AUTH_START_REFUSAL_REASONS = [
  "not_configured",
  "admin_blocked",
  "stdio_unsupported",
  "invalid_auth_url",
  "no_auth_link",
  "unreachable"
];
var startRefusalReason = brandedEnumOf(CONNECTOR_AUTH_START_REFUSAL_REASONS, "no_auth_link");
var CONNECTOR_AUTH_START_FAILURE_REASONS = ["probe_failed", "rpc_timeout"];
var startFailureReason = brandedEnumOf(CONNECTOR_AUTH_START_FAILURE_REASONS, "probe_failed");
function oauthStateIdFromAuthorizationUrl(authorizationUrl) {
  if (!URL.canParse(authorizationUrl)) return void 0;
  const state = new URL(authorizationUrl).searchParams.get("state")?.trim();
  return state != null && state.length > 0 ? state : void 0;
}
var SandMcpAuthWatchLifecycle = class {
  constructor(deps) {
    this.deps = deps;
    this.authWatchPollDeadline = createDeadlinePolicy({
      name: "mcp-auth-watch-poll",
      timeoutMs: deps.authWatchPollTimeoutMs,
      clock: deps.clock
    });
    this.authWatchPolling = createPollingPolicy3({
      name: "mcp-auth-watch",
      intervalMs: deps.authWatchPollIntervalMs,
      clock: deps.clock
    });
  }
  deps;
  pendingAuthWatches = /* @__PURE__ */ new Map();
  authCompletionObserver = null;
  authWatchPollDeadline;
  authWatchPolling;
  setAuthCompletionObserver(observer) {
    this.authCompletionObserver = observer;
  }
  reportFlowStartRefused(refusal) {
    this.deps.onConnectorAuth?.({
      phase: "flow_started",
      outcome: "failed",
      serverName: refusal.serverName,
      serverId: refusal.serverId,
      ...refusal.serverUrl === void 0 ? {} : { serverUrl: refusal.serverUrl },
      error: SandError.connectorAuthStartRefused({ reason: startRefusalReason(refusal.reason) })
    });
  }
  clearPendingAuthWatchCancelled(serverId, accountKey) {
    const watch4 = this.clearPendingAuthWatch(serverId, accountKey);
    if (watch4 != null) {
      this.deps.onConnectorAuth?.({
        phase: "token_stored",
        outcome: "cancelled",
        serverName: watch4.serverName,
        serverId: watch4.serverId,
        serverUrl: watch4.serverUrl
      });
    }
    return watch4;
  }
  async authenticateServer(rawServerId, rawAccountKey, requestingAgentId = null, forceReauth = false, trigger2 = null, grokBotAgentId = null, options2 = {}) {
    const requestedServerId = rawServerId.trim();
    const rowScope = grokBotAgentId == null ? {} : { grokBotAgentId };
    const server = await this.deps.resolveDisplayServer(requestedServerId, rowScope);
    const serverId = server?.id ?? requestedServerId;
    const accountKey = server?.servedBy === "grok" ? DEFAULT_MCP_ACCOUNT_KEY : normalizeAccountKey(rawAccountKey);
    if (trigger2 === "connector_card") {
      this.deps.onConnectorAuth?.({
        phase: "card_clicked",
        outcome: "ok",
        serverName: server?.name,
        serverId,
        ...httpUrlOfMcpConfig(server?.config) === void 0 ? {} : { serverUrl: httpUrlOfMcpConfig(server?.config) }
      });
    }
    if (server == null) {
      this.reportFlowStartRefused({ reason: "not_configured", serverId });
      return { status: "not-configured", serverName: serverId };
    }
    if (server.disabledByTeamAdminPolicy) {
      let confirmedBlocked = false;
      try {
        const fresh = await this.deps.resolveDisplayServer(serverId, {
          requireFreshRead: true,
          ...rowScope
        });
        confirmedBlocked = fresh == null || fresh.disabledByTeamAdminPolicy === true;
      } catch (error42) {
        reportMcpHostEdgeFailure("auth-policy-recheck", error42);
        confirmedBlocked = false;
      }
      if (confirmedBlocked) {
        const clearedWatches = this.clearPendingAuthWatchesForServer(serverId);
        try {
          await this.deps.reload();
        } catch {
        }
        for (const watch4 of clearedWatches) {
          this.notifyWatchCancelled(watch4);
        }
        this.reportFlowStartRefused({
          reason: "admin_blocked",
          serverId,
          serverName: server.name,
          serverUrl: httpUrlOfMcpConfig(server.config)
        });
        return {
          status: "not-supported",
          serverName: server.name,
          reason: { kind: "admin_blocked" }
        };
      }
    }
    const { name: name17, config: config2 } = server;
    const serverUrl = config2 != null && "url" in config2 ? config2.url : void 0;
    if (config2 != null && "command" in config2) {
      this.reportFlowStartRefused({ reason: "stdio_unsupported", serverId, serverName: name17 });
      return {
        status: "not-supported",
        serverName: name17,
        reason: { kind: "stdio_unsupported" }
      };
    }
    const grokIdentifier = server.servedBy === "grok" && server.serverIdentifier != null && server.serverIdentifier.length > 0 ? server.serverIdentifier : void 0;
    if (server.servedBy === "grok" ? grokIdentifier == null : serverUrl == null) {
      this.reportFlowStartRefused({ reason: "not_configured", serverId, serverName: name17 });
      return { status: "not-configured", serverName: name17 };
    }
    let status;
    try {
      status = await this.deps.backendMcpExec.checkAuthStatus(
        grokIdentifier != null ? {
          serverId: 0,
          serverIdentifier: grokIdentifier,
          accountKey,
          oauthRedirectUri: "",
          forceReauth
        } : {
          serverId: parseInt32McpServerId(serverId),
          accountKey,
          oauthRedirectUri: options2.oauthRedirectUri ?? await resolveMcpOAuthLoopbackRedirectUrl({ serverUrl: serverUrl ?? "" }),
          forceReauth
        }
      );
    } catch (error42) {
      this.deps.onConnectorAuth?.({
        phase: "flow_started",
        outcome: "failed",
        serverName: name17,
        serverId,
        serverUrl,
        error: SandError.connectorAuthStartFailed({
          reason: startFailureReason(
            isDeadlineExceededConnectError(error42) ? "rpc_timeout" : "probe_failed"
          )
        })
      });
      throw error42;
    }
    const probeReachedServerWithoutAuth = status.isAvailable && !status.requiresAuth;
    if (!forceReauth && probeReachedServerWithoutAuth) {
      await this.deps.reload();
      return { status: "already-authenticated", serverName: name17 };
    }
    const failWithoutLink = async (result) => {
      if (forceReauth) {
        this.clearPendingAuthWatchCancelled(serverId, accountKey);
        await this.deps.reload();
      }
      return result;
    };
    if (status.authUrl != null && status.authUrl.length > 0) {
      const authorizationUrl = validateAuthorizationUrl(status.authUrl, serverUrl);
      if (authorizationUrl == null) {
        this.reportFlowStartRefused({
          reason: "invalid_auth_url",
          serverId,
          serverName: name17,
          serverUrl
        });
        return await failWithoutLink({
          status: "not-supported",
          serverName: name17,
          reason: { kind: "invalid_auth_url" }
        });
      }
      const slotIdentifier = grokIdentifier ?? server.accounts?.find((slot) => slot.accountKey === accountKey)?.serverIdentifier ?? (server.serverIdentifier == null ? void 0 : provisionalMcpAccountServerIdentifier(server.serverIdentifier, accountKey));
      const oauthStateId = oauthStateIdFromAuthorizationUrl(authorizationUrl);
      const validityCannotObserveCompletion = forceReauth && status.hasValidToken === true;
      if (validityCannotObserveCompletion) {
        this.clearPendingAuthWatchCancelled(serverId, accountKey);
      } else {
        this.beginPendingAuthWatch({
          serverId,
          accountKey,
          serverName: name17,
          ...slotIdentifier == null ? {} : { serverIdentifier: slotIdentifier },
          ...grokIdentifier == null ? {} : { validateByIdentifier: true },
          serverUrl: serverUrl ?? "",
          ...oauthStateId == null ? {} : { oauthStateId },
          ...rowScope,
          requestingAgentId,
          forceReauth
        });
      }
      this.deps.onConnectorAuth?.({
        phase: "flow_started",
        outcome: "ok",
        serverName: name17,
        serverId,
        reauth: forceReauth,
        serverUrl
      });
      return {
        status: "started",
        authorizationUrl,
        serverName: name17,
        ...validityCannotObserveCompletion ? { completionUnconfirmed: true } : {}
      };
    }
    const reportedError = stripMarkupAndBoundConnectorError(status.error ?? "");
    const probeReachedTheServer = status.isAvailable;
    const probeLearnedServerWantsOAuth = status.requiresAuth;
    if (!probeReachedTheServer && !probeLearnedServerWantsOAuth) {
      this.reportFlowStartRefused({
        reason: "unreachable",
        serverId,
        serverName: name17,
        serverUrl
      });
      return await failWithoutLink({
        status: "unreachable",
        serverName: name17,
        reason: {
          kind: "unreachable",
          ...reportedError.length > 0 ? { technicalDetail: reportedError } : {}
        }
      });
    }
    this.reportFlowStartRefused({
      reason: "no_auth_link",
      serverId,
      serverName: name17,
      serverUrl
    });
    return await failWithoutLink({
      status: "not-supported",
      serverName: name17,
      reason: {
        kind: "no_auth_link",
        ...reportedError.length > 0 ? { technicalDetail: reportedError } : {}
      }
    });
  }
  beginPendingAuthWatch(args) {
    const watchKey2 = authWatchKey(args.serverId, args.accountKey);
    const existing = this.pendingAuthWatches.get(watchKey2);
    const requestingAgentId = args.requestingAgentId ?? existing?.requestingAgentId ?? null;
    this.clearPendingAuthWatchCancelled(args.serverId, args.accountKey);
    this.pendingAuthWatches.set(watchKey2, {
      serverId: args.serverId,
      accountKey: args.accountKey,
      serverName: args.serverName,
      ...args.serverIdentifier == null ? {} : { serverIdentifier: args.serverIdentifier },
      ...args.validateByIdentifier == null ? {} : { validateByIdentifier: true },
      serverUrl: args.serverUrl,
      ...args.oauthStateId == null ? {} : { oauthStateId: args.oauthStateId },
      ...args.grokBotAgentId == null ? {} : { grokBotAgentId: args.grokBotAgentId },
      requestingAgentId,
      poll: { dispose: () => {
      } },
      suppressFirstPoll: args.forceReauth,
      expiresAtMs: this.deps.clock.now() + this.deps.authWatchTimeoutMs,
      isPolling: false
    });
    const registered = this.pendingAuthWatches.get(watchKey2);
    if (registered != null) {
      registered.poll = this.authWatchPolling.start(async () => {
        try {
          await this.pollPendingAuthWatch(watchKey2);
        } catch (error42) {
          reportMcpHostEdgeFailure("auth-watch-poll", error42);
        }
      });
    }
  }
  clearPendingAuthWatch(serverId, accountKey) {
    const watchKey2 = authWatchKey(serverId, accountKey);
    const watch4 = this.pendingAuthWatches.get(watchKey2);
    if (watch4 == null) return null;
    watch4.poll.dispose();
    this.pendingAuthWatches.delete(watchKey2);
    return watch4;
  }
  notifyWatchCancelled(watch4, failureDetail) {
    this.notifyAuthCompleted({
      serverId: watch4.serverId,
      accountKey: watch4.accountKey,
      serverName: watch4.serverName,
      ...watch4.serverIdentifier == null ? {} : { serverIdentifier: watch4.serverIdentifier },
      serverUrl: watch4.serverUrl,
      requestingAgentId: watch4.requestingAgentId,
      outcome: "cancelled",
      ...failureDetail == null ? {} : { failureDetail }
    });
  }
  noteAuthCallbackRejected(rejection) {
    for (const watch4 of this.pendingAuthWatches.values()) {
      if (watch4.oauthStateId !== rejection.stateId) continue;
      this.clearPendingAuthWatch(watch4.serverId, watch4.accountKey);
      this.notifyWatchCancelled(watch4, rejection.failureDetail);
      return;
    }
  }
  noteAuthCompletedElsewhere(rawServerId, rawAccountKey) {
    let serverId;
    let accountKey;
    try {
      serverId = validateMcpDisplayServerId(rawServerId);
      accountKey = isGrokDisplayServerId(serverId) ? DEFAULT_MCP_ACCOUNT_KEY : normalizeAccountKey(rawAccountKey);
    } catch {
      return null;
    }
    const watch4 = this.pendingAuthWatches.get(authWatchKey(serverId, accountKey));
    if (watch4 == null) return null;
    this.clearPendingAuthWatch(serverId, accountKey);
    return watch4.requestingAgentId;
  }
  async noteAuthCallbackReceived(hint) {
    const matches = this.matchWatchesForCallback(hint);
    if (matches.length === 0) return false;
    await Promise.all(
      matches.map(({ watch: watch4, watchKey: watchKey2 }) => this.finishPendingAuthWatch(watch4, watchKey2))
    );
    return true;
  }
  clearPendingAuthWatchesForServer(serverId) {
    const cleared = [];
    for (const watch4 of [...this.pendingAuthWatches.values()]) {
      if (watch4.serverId !== serverId) continue;
      this.clearPendingAuthWatchCancelled(watch4.serverId, watch4.accountKey);
      cleared.push(watch4);
    }
    return cleared;
  }
  clearAllPendingAuthWatches() {
    for (const watch4 of [...this.pendingAuthWatches.values()]) {
      this.clearPendingAuthWatch(watch4.serverId, watch4.accountKey);
    }
  }
  clearAllPendingAuthWatchesCancelled() {
    for (const watch4 of [...this.pendingAuthWatches.values()]) {
      this.clearPendingAuthWatchCancelled(watch4.serverId, watch4.accountKey);
    }
  }
  async pollPendingAuthWatch(watchKey2) {
    const watch4 = this.pendingAuthWatches.get(watchKey2);
    if (watch4 == null || watch4.isPolling) return;
    if (watch4.suppressFirstPoll) {
      watch4.suppressFirstPoll = false;
      return;
    }
    if (this.deps.clock.now() >= watch4.expiresAtMs) {
      this.clearPendingAuthWatch(watch4.serverId, watch4.accountKey);
      this.deps.onConnectorAuth?.({
        phase: "token_stored",
        outcome: "timeout",
        serverName: watch4.serverName,
        serverId: watch4.serverId,
        serverUrl: watch4.serverUrl,
        error: SandError.connectorAuthAbandoned()
      });
      return;
    }
    watch4.isPolling = true;
    try {
      const landed = await this.authWatchPollDeadline.run(async () => {
        const serverUrl = watch4.validateByIdentifier === true ? "" : watch4.serverUrl.trim();
        const serverIdentifier = watch4.serverIdentifier?.trim() ?? "";
        if (serverUrl.length === 0 && serverIdentifier.length === 0) return false;
        const results = await this.deps.backendMcpExec.validateTokens([
          { serverUrl, accountKey: watch4.accountKey, serverIdentifier }
        ]);
        if (serverUrl.length > 0) {
          return results.some(
            (result) => result.serverUrl === serverUrl && result.accountKey === watch4.accountKey && result.hasValidToken
          );
        }
        const matched = results.find((result) => result.serverIdentifier === serverIdentifier) ?? (results.length === 1 ? results[0] : void 0);
        return matched?.hasValidToken === true;
      });
      if (!landed) return;
      if (this.pendingAuthWatches.get(watchKey2) !== watch4) return;
      let current;
      let resolveFailed = false;
      try {
        current = await this.authWatchPollDeadline.run(
          () => this.deps.resolveDisplayServer(watch4.serverId, {
            requireFreshRead: true,
            ...watch4.grokBotAgentId == null ? {} : { grokBotAgentId: watch4.grokBotAgentId }
          })
        );
      } catch (error42) {
        reportMcpHostEdgeFailure("auth-watch-poll", error42);
        resolveFailed = true;
      }
      if (this.pendingAuthWatches.get(watchKey2) !== watch4) return;
      if (!resolveFailed && (current == null || current.disabledByTeamAdminPolicy === true)) {
        this.clearPendingAuthWatchCancelled(watch4.serverId, watch4.accountKey);
        try {
          await this.deps.reload();
        } catch {
        }
        this.notifyAuthCompleted({
          serverId: watch4.serverId,
          accountKey: watch4.accountKey,
          serverName: watch4.serverName,
          ...watch4.serverIdentifier == null ? {} : { serverIdentifier: watch4.serverIdentifier },
          serverUrl: watch4.serverUrl,
          requestingAgentId: watch4.requestingAgentId,
          outcome: "cancelled"
        });
        return;
      }
      await this.finishPendingAuthWatch(watch4, watchKey2);
    } catch {
    } finally {
      watch4.isPolling = false;
    }
  }
  matchWatchesForCallback(hint) {
    const trimmedKey = hint.accountKey != null ? normalizeMcpAccountLabel(hint.accountKey) : "";
    const accountKey = trimmedKey.length > 0 ? trimmedKey : void 0;
    const serverName = hint.serverName != null && hint.serverName.length > 0 ? hint.serverName : void 0;
    const stateId = hint.stateId != null ? hint.stateId.trim() : "";
    if (stateId.length > 0) {
      const matched2 = [];
      for (const [watchKey2, watch4] of this.pendingAuthWatches) {
        if (watch4.oauthStateId !== stateId) continue;
        if (accountKey != null && watch4.validateByIdentifier !== true && watch4.accountKey !== accountKey) {
          continue;
        }
        if (serverName != null && watch4.serverName !== serverName) continue;
        matched2.push({ watch: watch4, watchKey: watchKey2 });
      }
      return matched2.length === 1 ? matched2 : [];
    }
    if (serverName == null) return [];
    const matched = [];
    for (const [watchKey2, watch4] of this.pendingAuthWatches) {
      if (accountKey != null && watch4.validateByIdentifier !== true && watch4.accountKey !== accountKey) {
        continue;
      }
      if (watch4.serverName !== serverName) continue;
      matched.push({ watch: watch4, watchKey: watchKey2 });
    }
    return matched.length === 1 ? matched : [];
  }
  async finishPendingAuthWatch(watch4, watchKey2) {
    if (this.pendingAuthWatches.get(watchKey2) !== watch4) return;
    this.clearPendingAuthWatch(watch4.serverId, watch4.accountKey);
    this.notifyAuthCompleted({
      serverId: watch4.serverId,
      accountKey: watch4.accountKey,
      serverName: watch4.serverName,
      ...watch4.serverIdentifier == null ? {} : { serverIdentifier: watch4.serverIdentifier },
      serverUrl: watch4.serverUrl,
      requestingAgentId: watch4.requestingAgentId
    });
    try {
      await this.deps.reload();
    } catch {
    }
  }
  notifyAuthCompleted(completion) {
    if (completion.outcome !== "cancelled") {
      this.deps.onConnectorAuth?.({
        phase: "token_stored",
        outcome: "ok",
        serverName: completion.serverName,
        serverId: completion.serverId,
        ...completion.serverUrl == null || completion.serverUrl.length === 0 ? {} : { serverUrl: completion.serverUrl }
      });
    }
    if (this.authCompletionObserver == null) return;
    try {
      this.authCompletionObserver(completion);
    } catch {
    }
  }
};
