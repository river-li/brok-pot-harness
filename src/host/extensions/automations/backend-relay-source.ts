/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/automations/backend-relay-source.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
init_v4();
init_errors();
init_cursor_inference();
init_sand_client_metadata();
init_unknown_record();

// @recovered-fragment 2/2
var SandBackendRelayError = class extends SandDomainError {
  name = "SandBackendRelayError";
};
var DEFAULT_REGISTER_INTERVAL_MS = 5 * 60 * 1e3;
var DEGRADED_REGISTER_INTERVAL_MS = 6e4;
var ERROR_BACKOFF_MS = 3e4;
var SCM_CONNECT_WAIT_LEASE_MS = 60 * 60 * 1e3;
var SCM_CONNECT_DELIVERED_IDS_CAP = 64;
var relayWireEventSchema = external_exports2.object({
  id: external_exports2.string(),
  source: external_exports2.union([
    external_exports2.literal("slack"),
    external_exports2.literal("github"),
    external_exports2.literal("origin"),
    external_exports2.literal("scm-connect")
  ]),
  kind: external_exports2.string(),
  provider: external_exports2.string().optional(),
  channelId: external_exports2.string().optional(),
  channelName: external_exports2.string().optional(),
  text: external_exports2.string().optional(),
  senderSlackUserId: external_exports2.string().optional(),
  isMention: external_exports2.boolean().optional(),
  isSelf: external_exports2.boolean().optional(),
  reactionEmoji: external_exports2.string().optional(),
  ts: external_exports2.string().optional(),
  threadTs: external_exports2.string().optional(),
  repo: external_exports2.string().optional(),
  title: external_exports2.string().optional(),
  actor: external_exports2.string().optional(),
  actorIds: external_exports2.array(external_exports2.string()).max(3).readonly().optional(),
  agentIds: external_exports2.array(external_exports2.string()).max(10).readonly().optional(),
  url: external_exports2.string().optional(),
  detail: external_exports2.string().optional(),
  prNumber: external_exports2.number().int().positive().optional(),
  prOwner: external_exports2.string().optional(),
  prOwnerIds: external_exports2.array(external_exports2.string()).max(3).readonly().optional(),
  branch: external_exports2.string().optional(),
  timestampMs: external_exports2.number().optional()
});
function parseRelayWireEvent(value) {
  const result = relayWireEventSchema.safeParse(value);
  return result.success ? result.data : null;
}
function ackPoisonedRelayEvent(element, ackIds) {
  if (isUnknownRecord(element) && typeof element.id === "string") {
    ackIds.add(element.id);
  }
}
function isGithubEventKind2(value) {
  return GITHUB_EVENT_KINDS.includes(value);
}
function isOriginEventKind2(value) {
  return ORIGIN_EVENT_KINDS.some((kind) => kind === value);
}
function mapRelayWireEvent(event) {
  const timestampMs2 = event.timestampMs ?? Date.now();
  if (event.source === "slack") {
    const channelName = event.channelName ?? event.channelId ?? "";
    if (channelName.length === 0) return null;
    const channel = channelName === event.channelId || channelName.startsWith("#") ? channelName : `#${channelName}`;
    const sender = event.senderSlackUserId != null && event.senderSlackUserId.length > 0 ? `@${event.senderSlackUserId}` : "someone";
    if (event.kind === "reaction") {
      const emoji3 = event.reactionEmoji ?? "";
      if (emoji3.length === 0) return null;
      return {
        source: "slack",
        channel,
        sender,
        text: event.text ?? "",
        isMention: false,
        isSelf: event.isSelf === true,
        reactionEmoji: `:${emoji3.replaceAll(":", "")}:`,
        ...event.ts != null ? { ts: event.ts } : {},
        ...event.threadTs != null ? { threadTs: event.threadTs } : {},
        timestampMs: timestampMs2
      };
    }
    return {
      source: "slack",
      channel,
      sender,
      text: event.text ?? "",
      isMention: event.isMention === true,
      ...event.ts != null ? { ts: event.ts } : {},
      ...event.threadTs != null ? { threadTs: event.threadTs } : {},
      timestampMs: timestampMs2
    };
  }
  const repo = event.repo ?? "";
  if (repo.length === 0) return null;
  if (event.source === "origin") {
    if (!isOriginEventKind2(event.kind)) return null;
    return {
      source: "origin",
      repo,
      kind: event.kind,
      title: event.title ?? "",
      actor: event.actor ?? "someone",
      ...event.actorIds !== void 0 ? { actorIds: event.actorIds } : {},
      ...event.url != null ? { url: event.url } : {},
      ...event.detail != null ? { detail: event.detail } : {},
      ...event.prNumber != null ? { prNumber: event.prNumber } : {},
      ...event.prOwner != null && event.prOwner.length > 0 ? { prOwner: event.prOwner } : {},
      ...event.prOwnerIds !== void 0 ? { prOwnerIds: event.prOwnerIds } : {},
      timestampMs: timestampMs2
    };
  }
  if (event.source !== "github" || !isGithubEventKind2(event.kind)) return null;
  return {
    source: "github",
    repo,
    kind: event.kind,
    title: event.title ?? "",
    actor: event.actor ?? "someone",
    ...event.url != null ? { url: event.url } : {},
    ...event.detail != null ? { detail: event.detail } : {},
    ...event.prNumber != null ? { prNumber: event.prNumber } : {},
    ...event.prOwner != null && event.prOwner.length > 0 ? { prOwner: event.prOwner } : {},
    ...event.branch != null && event.branch.length > 0 ? { branch: event.branch } : {},
    timestampMs: timestampMs2
  };
}
function relaySubscriptionRequestOf({
  slackListeners,
  githubListeners,
  originListeners: originTriggerListeners
}) {
  const slackChannels = /* @__PURE__ */ new Set();
  for (const listener of slackListeners) {
    if (listener.type !== "slack") continue;
    slackChannels.add(
      listener.channel === TRIGGER_ANY_SCOPE ? TRIGGER_ANY_SCOPE : listener.channel
    );
  }
  const githubRepos = /* @__PURE__ */ new Set();
  const githubKinds = /* @__PURE__ */ new Set();
  for (const listener of githubListeners) {
    if (listener.type !== "github") continue;
    githubRepos.add(listener.repo.toLowerCase());
    for (const kind of listener.events) githubKinds.add(kind);
  }
  const originListeners = [];
  for (const listener of originTriggerListeners) {
    if (listener.type !== "origin") continue;
    originListeners.push({
      repo: listener.repo.toLowerCase(),
      kinds: [...listener.events].sort(),
      ...listener.pr !== void 0 ? { prNumber: listener.pr } : {}
    });
  }
  originListeners.sort((left, right) => JSON.stringify(left).localeCompare(JSON.stringify(right)));
  return {
    slackChannels: [...slackChannels].sort(),
    githubRepos: [...githubRepos].sort(),
    githubKinds: [...githubKinds].sort(),
    originListeners
  };
}
function createBackendRelaySources(deps) {
  const fetchImpl = deps.fetchImpl ?? fetch;
  const polling = deps.polling;
  const registerIntervalMs = deps.registerIntervalMs ?? DEFAULT_REGISTER_INTERVAL_MS;
  const degradedRegisterIntervalMs = Math.min(
    deps.degradedRegisterIntervalMs ?? DEGRADED_REGISTER_INTERVAL_MS,
    registerIntervalMs
  );
  let slackSink = null;
  let githubSink = null;
  let originSink = null;
  let scmConnectSink = null;
  let slackListeners = [];
  let githubListeners = [];
  let originListeners = [];
  let slackStatus = { state: "idle" };
  let githubStatus = { state: "idle" };
  let originStatus = { state: "idle" };
  let subscribedGithubRepos = /* @__PURE__ */ new Set();
  let timer = null;
  let isTicking = false;
  let lastRegisteredKey = "";
  let lastRegisteredAtMs = 0;
  let backoffUntilMs = 0;
  const notifyGate = createNotifyDrainGate({
    isConnected: deps.isNotifyConnected,
    isSafetyPollEnabled: deps.isNotifySafetyPollEnabled,
    now: Date.now
  });
  let pendingAckIds = /* @__PURE__ */ new Set();
  let scmConnectWaitLeaseUntilMs = 0;
  const deliveredScmConnectIds = /* @__PURE__ */ new Set();
  function hasLiveWork() {
    return slackSink != null || githubSink != null || originSink != null || Date.now() < scmConnectWaitLeaseUntilMs;
  }
  async function callRelay(path31, body) {
    const backendUrl = deps.backend.backendUrl;
    const accessToken = await deps.getAccessToken({ backendUrl });
    const auth2 = await resolveSandBackendAuthContext({
      accessToken,
      getTeamId: deps.getTeamId
    });
    const response = await fetchImpl(new URL(path31, backendUrl).toString(), {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${auth2.accessToken}`,
        ...auth2.teamId !== void 0 ? { "x-cursor-team-id": String(auth2.teamId) } : {},
        ...getSandBackendClientHeaders(deps.backend)
      },
      body: JSON.stringify(body)
    });
    if (!response.ok) {
      throw new SandBackendRelayError(`relay ${path31} returned ${response.status}`);
    }
    return await response.json();
  }
  function slackScopeIssuesOf(teams) {
    const OUTCOME_RANK = {
      "not-found": 0,
      "missing-bot": 1,
      healthy: 2
    };
    const bestByScope = /* @__PURE__ */ new Map();
    const observe = (scope, outcome) => {
      const current = bestByScope.get(scope);
      if (current == null || OUTCOME_RANK[outcome] > OUTCOME_RANK[current]) {
        bestByScope.set(scope, outcome);
      }
    };
    for (const team of teams) {
      for (const channel of team.channels ?? []) {
        observe(channel.input, channel.isBotMember === false ? "missing-bot" : "healthy");
      }
      for (const scope of team.unresolvedChannels) {
        observe(scope, "not-found");
      }
    }
    const issues = [];
    for (const [scope, outcome] of bestByScope) {
      if (outcome === "missing-bot") {
        issues.push({ scope, kind: "bot-not-in-channel" });
      } else if (outcome === "not-found") {
        issues.push({ scope, kind: "not-found" });
      }
    }
    return issues;
  }
  let isRegistrationDegraded = false;
  let degradedRegistrationStreak = 0;
  function applyRegistrationStatuses(result) {
    const nextSubscribedGithubRepos = new Set(subscribedGithubRepos);
    for (const repo of result.github.repos) {
      if (repo.isSubscribed) nextSubscribedGithubRepos.add(repo.repo.toLowerCase());
      else nextSubscribedGithubRepos.delete(repo.repo.toLowerCase());
    }
    subscribedGithubRepos = nextSubscribedGithubRepos;
    if (slackListeners.length > 0) {
      if (result.slack.status === "not-linked") {
        slackStatus = {
          state: "error",
          detail: "Slack isn't connected to your Cursor account. Connect it to start listening."
        };
      } else {
        const scopeIssues = slackScopeIssuesOf(result.slack.teams);
        slackStatus = scopeIssues.length > 0 ? {
          state: "listening",
          detail: describeScopeIssues(scopeIssues),
          scopeIssues
        } : { state: "listening" };
      }
    }
    if (githubListeners.length > 0) {
      if (result.github.status === "not-connected") {
        githubStatus = {
          state: "error",
          detail: "GitHub isn't connected to your Cursor account. Connect it to start listening."
        };
      } else {
        const failed2 = result.github.repos.filter((repo) => !repo.isSubscribed);
        const failedState = failed2.length === result.github.repos.length ? "error" : "listening";
        githubStatus = failed2.length > 0 ? {
          state: failedState,
          detail: failed2.map((entry) => entry.detail ?? `Can't watch ${entry.repo}.`).join(" ")
        } : { state: "listening" };
      }
    }
    if (originListeners.length > 0) {
      if (result.origin == null) {
        originStatus = {
          state: "error",
          detail: "This backend does not support Origin listeners yet."
        };
      } else {
        const failed2 = result.origin.repos.filter((repo) => !repo.isSubscribed);
        const failedState = failed2.length === result.origin.repos.length ? "error" : "listening";
        originStatus = result.origin.status === "unavailable" || failed2.length > 0 ? {
          state: failedState,
          detail: failed2.map((entry) => entry.detail ?? `Can't watch ${entry.repo}.`).join(" ")
        } : { state: "listening" };
      }
    }
    isRegistrationDegraded = slackStatus.state === "error" || (slackStatus.scopeIssues?.length ?? 0) > 0 || githubStatus.state === "error" || githubStatus.state === "listening" && githubStatus.detail != null || originStatus.state === "error" || originStatus.state === "listening" && originStatus.detail != null;
    degradedRegistrationStreak = isRegistrationDegraded ? degradedRegistrationStreak + 1 : 0;
  }
  function registrationRefreshIntervalMs() {
    if (!isRegistrationDegraded) return registerIntervalMs;
    const backoffFactor = 2 ** Math.min(degradedRegistrationStreak - 1, 10);
    return Math.min(registerIntervalMs, degradedRegisterIntervalMs * backoffFactor);
  }
  async function ensureRegistered() {
    const request5 = relaySubscriptionRequestOf({
      slackListeners,
      githubListeners,
      originListeners
    });
    const key = JSON.stringify(request5);
    const isStale = Date.now() - lastRegisteredAtMs > registrationRefreshIntervalMs();
    if (key === lastRegisteredKey && !isStale) return;
    const result = await callRelay(
      "/sand/listener-subscriptions",
      request5
    );
    lastRegisteredKey = key;
    lastRegisteredAtMs = Date.now();
    applyRegistrationStatuses(result);
  }
  async function tick() {
    if (isTicking) return;
    if (!hasLiveWork()) {
      stopLoopIfIdle();
      return;
    }
    if (Date.now() < backoffUntilMs) return;
    isTicking = true;
    try {
      await ensureRegistered();
      if (!notifyGate.takeDrainDecision({ hasOwedWork: pendingAckIds.size > 0 })) {
        return;
      }
      const reply2 = await callRelay("/sand/listener-events/poll", {
        ackIds: [...pendingAckIds]
      });
      if (!isUnknownRecord(reply2) || !Array.isArray(reply2.events)) {
        throw new SandBackendRelayError(
          "relay /sand/listener-events/poll replied with a malformed body"
        );
      }
      const events = reply2.events;
      const acked = pendingAckIds;
      const nextAckIds = /* @__PURE__ */ new Set();
      for (const element of events) {
        const wire = parseRelayWireEvent(element);
        if (wire == null) {
          ackPoisonedRelayEvent(element, nextAckIds);
          continue;
        }
        if (acked.has(wire.id) || nextAckIds.has(wire.id)) {
          nextAckIds.add(wire.id);
          continue;
        }
        if (wire.source === "scm-connect") {
          if (scmConnectSink != null && (wire.kind === "repo-granted" || wire.kind === "connected") && wire.provider != null && !deliveredScmConnectIds.has(wire.id)) {
            deliveredScmConnectIds.add(wire.id);
            while (deliveredScmConnectIds.size > SCM_CONNECT_DELIVERED_IDS_CAP) {
              const oldest = deliveredScmConnectIds.values().next().value;
              if (oldest === void 0) break;
              deliveredScmConnectIds.delete(oldest);
            }
            scmConnectSink({
              kind: wire.kind,
              provider: wire.provider,
              ...wire.repo == null ? {} : { repo: wire.repo },
              agentIds: wire.agentIds ?? []
            });
          }
          nextAckIds.add(wire.id);
          continue;
        }
        const mapped = mapRelayWireEvent(wire);
        if (mapped == null) {
          nextAckIds.add(wire.id);
          continue;
        }
        let sink = originSink;
        if (mapped.source === "slack") sink = slackSink;
        if (mapped.source === "github") sink = githubSink;
        if (sink == null) continue;
        const isAccepted = sink(mapped);
        if (isAccepted) nextAckIds.add(wire.id);
      }
      pendingAckIds = nextAckIds;
      notifyGate.recordPoll();
    } catch (error42) {
      lastRegisteredKey = "";
      backoffUntilMs = Date.now() + ERROR_BACKOFF_MS;
      const detail = error42 instanceof Error ? error42.message : "relay poll failed";
      if (slackListeners.length > 0 && slackSink != null) {
        slackStatus = { state: "error", detail };
      }
      if (githubListeners.length > 0 && githubSink != null) {
        githubStatus = { state: "error", detail };
      }
      if (originListeners.length > 0 && originSink != null) {
        originStatus = { state: "error", detail };
      }
    } finally {
      isTicking = false;
    }
  }
  function ensureLoop() {
    if (timer != null) return;
    notifyGate.reset();
    timer = polling.start(async () => {
      try {
        await tick();
      } catch {
      }
    });
  }
  function stopLoopIfIdle() {
    if (hasLiveWork()) return;
    timer?.dispose();
    timer = null;
    lastRegisteredKey = "";
    backoffUntilMs = 0;
  }
  const slack = {
    kind: "slack",
    async start(sink) {
      slackSink = sink;
      slackStatus = { state: "connecting" };
      ensureLoop();
    },
    setListeners(listeners2) {
      slackListeners = listeners2;
    },
    async stop() {
      slackSink = null;
      slackListeners = [];
      slackStatus = { state: "idle" };
      lastRegisteredKey = "";
      stopLoopIfIdle();
    },
    getStatus() {
      return slackStatus;
    }
  };
  const github = {
    kind: "github",
    async start(sink) {
      githubSink = sink;
      githubStatus = { state: "connecting" };
      ensureLoop();
    },
    setListeners(listeners2) {
      githubListeners = listeners2;
    },
    async stop() {
      githubSink = null;
      githubListeners = [];
      githubStatus = { state: "idle" };
      lastRegisteredKey = "";
      stopLoopIfIdle();
    },
    getStatus() {
      return githubStatus;
    }
  };
  const origin = {
    kind: "origin",
    async start(sink) {
      originSink = sink;
      originStatus = { state: "connecting" };
      ensureLoop();
    },
    setListeners(listeners2) {
      originListeners = listeners2;
    },
    async stop() {
      originSink = null;
      originListeners = [];
      originStatus = { state: "idle" };
      lastRegisteredKey = "";
      stopLoopIfIdle();
    },
    getStatus() {
      return originStatus;
    }
  };
  return {
    slack,
    github,
    origin,
    scmConnect: {
      start(sink) {
        scmConnectSink = sink;
      },
      stop() {
        scmConnectSink = null;
        scmConnectWaitLeaseUntilMs = 0;
        stopLoopIfIdle();
      }
    },
    registerScmConnectWait: async (wait) => {
      await callRelay("/sand/scm-connect/wait", {
        agentId: wait.agentId,
        provider: wait.provider,
        ...wait.intent == null ? {} : { intent: wait.intent },
        ...wait.repoSlug == null ? {} : { repoSlug: wait.repoSlug },
        ...wait.cardProvider == null ? {} : { cardProvider: wait.cardProvider }
      });
      scmConnectWaitLeaseUntilMs = Date.now() + SCM_CONNECT_WAIT_LEASE_MS;
      ensureLoop();
      void tick();
    },
    isGithubSubscribed: (repo) => subscribedGithubRepos.has(repo.toLowerCase()),
    requestDrain: () => {
      notifyGate.recordNotify();
      if (timer == null) return;
      void tick();
    }
  };
}

