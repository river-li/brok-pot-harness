/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/team-admin-policy/team-admin-policy-service.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
init_scheduling();
init_dashboard_pb();

// @recovered-fragment 2/2
init_errors();
var TEAM_ADMIN_POLICY_TTL_MS = 5 * 6e4;
var TEAM_ADMIN_POLICY_REQUEST_TIMEOUT_MS = 1e4;
var TEAM_ADMIN_POLICY_ERROR_RETRY_MS = 3e4;
var TEAM_ADMIN_POLICY_WAIT_MS = TEAM_ADMIN_POLICY_REQUEST_TIMEOUT_MS;
var TEAM_ADMIN_POLICY_FIRST_READ_RETRY_INITIAL_DELAY_MS = 500;
var TEAM_ADMIN_POLICY_FIRST_READ_RETRY_MAX_DELAY_MS = 2e3;
var TeamAdminPolicyUnreadError = class extends Error {
  constructor() {
    super("team-admin-policy-unread");
  }
};
function snapshotFromResponse(response, teamId) {
  return {
    teamId,
    cloudAgentsDisabled: response.backgroundAgentSettings?.disableCloudAgentsInSand === true,
    autoReviewEnforced: response.sandAutoReviewControls?.enforceEnabled === true,
    agentEmailAllowed: response.grokBotAgentEmailControls?.allowed ?? AGENT_EMAIL_DENIED_WITHOUT_A_BACKEND_ANSWER
  };
}
function currentTeamId(getTeamId) {
  return getTeamId() ?? null;
}
function createTeamAdminPolicyService(deps) {
  const ttlMs = deps.ttlMs ?? TEAM_ADMIN_POLICY_TTL_MS;
  const requestTimeoutMs = deps.requestTimeoutMs ?? TEAM_ADMIN_POLICY_REQUEST_TIMEOUT_MS;
  const errorRetryMs = deps.errorRetryMs ?? TEAM_ADMIN_POLICY_ERROR_RETRY_MS;
  const cache3 = {
    snapshot: void 0,
    snapshotAtMs: Number.NEGATIVE_INFINITY,
    lastFailureAtMs: Number.NEGATIVE_INFINITY,
    lastWaitGaveUpAtMs: Number.NEGATIVE_INFINITY,
    generation: 0,
    inFlight: void 0,
    loading: false,
    disposed: false
  };
  const isFresh = () => cache3.snapshot !== void 0 && deps.clock.monotonicNow() - cache3.snapshotAtMs < ttlMs;
  const runFetch = () => {
    if (cache3.disposed) return Promise.resolve();
    if (cache3.inFlight !== void 0) return cache3.inFlight;
    const attempt = cache3.generation;
    cache3.loading = true;
    const request5 = (async () => {
      const teamId = currentTeamId(deps.getTeamId);
      try {
        const response = await deps.getDashboardClient().getTeamAdminSettingsOrEmptyIfNotInTeam(new GetTeamAdminSettingsRequest({}), {
          timeoutMs: requestTimeoutMs
        });
        if (cache3.disposed || attempt !== cache3.generation) return;
        cache3.snapshot = snapshotFromResponse(response, teamId);
        cache3.snapshotAtMs = deps.clock.monotonicNow();
        cache3.lastFailureAtMs = Number.NEGATIVE_INFINITY;
        cache3.loading = false;
      } catch (error42) {
        if (cache3.disposed || attempt !== cache3.generation) return;
        cache3.lastFailureAtMs = deps.clock.monotonicNow();
        cache3.loading = false;
        deps.log(`[sand:team-admin-policy] fetch failed: ${errorLogTag(error42)}`);
      }
    })().finally(() => {
      if (cache3.inFlight === request5) cache3.inFlight = void 0;
    });
    cache3.inFlight = request5;
    return request5;
  };
  const loadUnlessBackingOff = () => {
    if (cache3.disposed) return void 0;
    if (deps.clock.monotonicNow() - cache3.lastFailureAtMs < errorRetryMs) return void 0;
    if (isFresh()) return void 0;
    return runFetch();
  };
  const firstReadRetry = createRetryPolicy({
    name: "sand-team-admin-policy-first-read",
    mode: "until-signal",
    initialDelayMs: TEAM_ADMIN_POLICY_FIRST_READ_RETRY_INITIAL_DELAY_MS,
    maxDelayMs: TEAM_ADMIN_POLICY_FIRST_READ_RETRY_MAX_DELAY_MS,
    shouldRetry: (error42) => error42 instanceof TeamAdminPolicyUnreadError,
    clock: deps.clock
  });
  const loadThroughSupersededReads = async (signal) => {
    do {
      await runFetch();
      if (cache3.disposed || signal.aborted) return;
    } while (cache3.loading);
  };
  const retryFirstReadUntilKnown = (signal) => firstReadRetry.runWithRetry(async (_attempt, workSignal) => {
    await loadThroughSupersededReads(workSignal);
    if (cache3.disposed) return;
    if (cache3.snapshot === void 0) throw new TeamAdminPolicyUnreadError();
  }, signal);
  return {
    isCloudAgentsDisabled: () => {
      void loadUnlessBackingOff();
      return cache3.snapshot?.cloudAgentsDisabled ?? false;
    },
    isAutoReviewEnforced: () => {
      void loadUnlessBackingOff();
      return cache3.snapshot?.autoReviewEnforced ?? false;
    },
    isAgentEmailAllowed: () => {
      void loadUnlessBackingOff();
      return cache3.snapshot?.agentEmailAllowed ?? AGENT_EMAIL_DENIED_WITHOUT_A_BACKEND_ANSWER;
    },
    prefetch: () => {
      void loadUnlessBackingOff();
    },
    waitForPolicy: async (timeoutMs = TEAM_ADMIN_POLICY_WAIT_MS) => {
      if (cache3.snapshot !== void 0) {
        void loadUnlessBackingOff();
        return true;
      }
      if (deps.clock.monotonicNow() - cache3.lastWaitGaveUpAtMs < errorRetryMs) return false;
      const deadline = createDeadlinePolicy({
        name: "sand-team-admin-policy-wait",
        timeoutMs,
        clock: deps.clock
      });
      try {
        await deadline.run(retryFirstReadUntilKnown);
      } catch (error42) {
        if (!(error42 instanceof DeadlineExceededError)) throw error42;
        deps.log(`[sand:team-admin-policy] first read still pending after ${timeoutMs}ms`);
      }
      const known = cache3.snapshot !== void 0;
      if (!known) cache3.lastWaitGaveUpAtMs = deps.clock.monotonicNow();
      return known;
    },
    invalidate: () => {
      cache3.generation += 1;
      cache3.snapshot = void 0;
      cache3.snapshotAtMs = Number.NEGATIVE_INFINITY;
      cache3.lastFailureAtMs = Number.NEGATIVE_INFINITY;
      cache3.lastWaitGaveUpAtMs = Number.NEGATIVE_INFINITY;
      cache3.inFlight = void 0;
      cache3.loading = true;
    },
    dispose: () => {
      cache3.disposed = true;
      cache3.generation += 1;
      cache3.inFlight = void 0;
      cache3.loading = false;
    }
  };
}

