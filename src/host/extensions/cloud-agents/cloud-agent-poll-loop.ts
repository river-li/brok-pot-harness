/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/cloud-agents/cloud-agent-poll-loop.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
init_background_composer_pb();
init_invariant();

// @recovered-fragment 2/2
var CLOUD_AGENT_MAX_WAIT_MS = 5 * 60 * 6e4;
var CLOUD_AGENT_POLL_INTERVAL_MS = 1e4;
var CLOUD_AGENT_POLL_RPC_TIMEOUT_MS = 3e4;
var CLOUD_AGENT_RATE_LIMIT_FALLBACK_MS = 6e4;
var CLOUD_AGENT_RATE_LIMIT_JITTER_RATIO = 0.25;
function cloudAgentRateLimitPauseMs(error42, random = Math.random) {
  const baseMs = getConnectRetryAfterMs(error42) ?? CLOUD_AGENT_RATE_LIMIT_FALLBACK_MS;
  return Math.round(baseMs + random() * baseMs * CLOUD_AGENT_RATE_LIMIT_JITTER_RATIO);
}
var CLOUD_AGENT_RUN_RESTART_GRACE_MS = 3 * 6e4;
var MODEL_CATALOG_TTL_MS = 5 * 6e4;
async function missingMachineId() {
  invariant(
    false,
    "SandCloudAgentManagerOptions.getMachineId was not provided; inject the process's machine-id resolver"
  );
}
var CloudAgentModelCatalogCache = class {
  constructor(options2) {
    this.options = options2;
  }
  options;
  modelCatalogCache;
  async listModels() {
    if (this.options.modelCatalogForTesting != null) {
      return this.options.modelCatalogForTesting;
    }
    const now = this.options.clock.monotonicNow();
    if (this.modelCatalogCache != null && now - this.modelCatalogCache.fetchedAtMs < MODEL_CATALOG_TTL_MS) {
      return this.modelCatalogCache.catalog;
    }
    const catalog = await fetchSandModelCatalog({
      backend: this.options.backend,
      getAccessToken: this.options.getCursorAccessToken,
      getTeamId: this.options.getTeamId,
      getMachineId: this.options.getMachineId ?? missingMachineId,
      onRequestId: this.options.onRequestId
    });
    this.modelCatalogCache = { catalog, fetchedAtMs: now };
    return catalog;
  }
};
var CloudAgentCompletionPoller = class {
  constructor(options2, getClient) {
    this.options = options2;
    this.getClient = getClient;
  }
  options;
  getClient;
  activeCompletionPolls = /* @__PURE__ */ new Set();
  dispose() {
    for (const poll of this.activeCompletionPolls) {
      poll.dispose();
    }
    this.activeCompletionPolls.clear();
  }
  async awaitCompletion(bcId, options2) {
    const client = this.getClient();
    const maxWaitMs = this.options.maxWaitMs ?? CLOUD_AGENT_MAX_WAIT_MS;
    const deadline = this.options.clock.monotonicNow() + maxWaitMs;
    let awaitingRestart = options2?.waitForRestart ?? false;
    const restartDeadline = this.options.clock.monotonicNow() + (this.options.runRestartGraceMs ?? CLOUD_AGENT_RUN_RESTART_GRACE_MS);
    let skipImmediateTick = true;
    let rateLimitPauseUntilMs = 0;
    return await new Promise((resolve29) => {
      let settled = false;
      let poll;
      const timedOut = () => ({
        status: "error",
        text: `The Cursor agent (${bcId}) is still running after ${Math.round(
          maxWaitMs / 6e4
        )} minutes. It keeps running on the VM; check the Cursor cloud agents dashboard for the result.`
      });
      const finish = (result) => {
        if (settled) return;
        settled = true;
        poll?.dispose();
        if (poll != null) {
          this.activeCompletionPolls.delete(poll);
        }
        resolve29(result);
      };
      poll = this.options.completionPolling.start(async () => {
        try {
          if (skipImmediateTick) {
            skipImmediateTick = false;
            return;
          }
          if (this.options.clock.monotonicNow() < rateLimitPauseUntilMs) {
            if (this.options.clock.monotonicNow() >= deadline) {
              finish(timedOut());
            }
            return;
          }
          let detailed;
          try {
            const response = await client.getBackgroundComposerInfo(
              new GetBackgroundComposerInfoRequest({
                bcId,
                includeDiff: false,
                doNotThrowIfSetupNotFinished: true
              }),
              { timeoutMs: CLOUD_AGENT_POLL_RPC_TIMEOUT_MS }
            );
            detailed = response.composer;
          } catch (error42) {
            if (isRateLimitConnectError(error42)) {
              rateLimitPauseUntilMs = this.options.clock.monotonicNow() + cloudAgentRateLimitPauseMs(error42, this.options.randomFn);
            }
            if (this.options.clock.monotonicNow() >= deadline) {
              finish(timedOut());
            }
            return;
          }
          const now = this.options.clock.monotonicNow();
          const status = detailed?.composer?.status ?? BackgroundComposerStatus.UNSPECIFIED;
          const isActive = status === BackgroundComposerStatus.RUNNING || status === BackgroundComposerStatus.CREATING;
          if (awaitingRestart) {
            if (isActive) {
              awaitingRestart = false;
            } else if (now >= restartDeadline) {
              awaitingRestart = false;
            } else {
              if (now >= deadline) {
                finish(timedOut());
              }
              return;
            }
          }
          if (status === BackgroundComposerStatus.RUNNING || status === BackgroundComposerStatus.CREATING || status === BackgroundComposerStatus.UNSPECIFIED) {
            if (now >= deadline) {
              finish(timedOut());
            }
            return;
          }
          finish(
            buildWatchResult(
              bcId,
              status,
              detailed,
              await fetchCloudAgentReport(client, bcId, {
                timeoutMs: CLOUD_AGENT_POLL_RPC_TIMEOUT_MS
              })
            )
          );
        } catch {
          finish({
            status: "error",
            text: `The Cursor agent (${bcId}) status check failed unexpectedly. Check the Cursor cloud agents dashboard for the result.`
          });
        }
      });
      if (!settled) {
        this.activeCompletionPolls.add(poll);
      }
    });
  }
};

