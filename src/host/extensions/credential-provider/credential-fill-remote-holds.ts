/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/credential-provider/credential-fill-remote-holds.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_scheduling();
var CREDENTIAL_FILL_REMOTE_HOLD_DEFAULT_TTL_MS = 12e4;
var CREDENTIAL_FILL_REMOTE_HOLD_MAX_TTL_MS = 3e5;
var CREDENTIAL_FILL_REMOTE_HOLD_DEFAULT_WAIT_MS = 25e3;
var CREDENTIAL_FILL_REMOTE_HOLD_MAX_WAIT_MS = 3e4;
function createCredentialFillRemoteHolds(lease, options2 = {}) {
  const clock = options2.clock ?? realClock;
  const log4 = options2.log ?? (() => void 0);
  const holds = /* @__PURE__ */ new Map();
  const bounded = (value, fallback2, max) => Math.min(Math.max(1, Math.round(value ?? fallback2)), max);
  return {
    acquire: async (request5) => {
      if (request5.holdId.length === 0 || holds.has(request5.holdId)) {
        return {
          kind: "refused",
          reason: "unavailable",
          detail: AGENT_TOOL_REFUSAL_DETAIL.unavailable
        };
      }
      const ttlMs = bounded(
        request5.ttlMs,
        CREDENTIAL_FILL_REMOTE_HOLD_DEFAULT_TTL_MS,
        CREDENTIAL_FILL_REMOTE_HOLD_MAX_TTL_MS
      );
      const acquisition = await lease.acquireAgentTool({
        toolName: request5.toolName,
        ...request5.windowIndex === void 0 ? {} : { windowIndex: request5.windowIndex },
        waitMs: bounded(
          request5.waitMs,
          CREDENTIAL_FILL_REMOTE_HOLD_DEFAULT_WAIT_MS,
          CREDENTIAL_FILL_REMOTE_HOLD_MAX_WAIT_MS
        )
      });
      if (!acquisition.ok) {
        return { kind: "refused", reason: acquisition.reason, detail: acquisition.detail };
      }
      if (holds.has(request5.holdId)) {
        acquisition.release();
        return {
          kind: "refused",
          reason: "unavailable",
          detail: AGENT_TOOL_REFUSAL_DETAIL.unavailable
        };
      }
      const expiry = clock.schedule(ttlMs, () => {
        if (!holds.delete(request5.holdId)) return;
        log4(
          `credentials: remote ${request5.toolName} hold lapsed after ${ttlMs}ms without a release`
        );
        acquisition.release();
      });
      holds.set(request5.holdId, () => {
        expiry.dispose();
        acquisition.release();
      });
      return { kind: "held", ttlMs };
    },
    release: (holdId) => {
      const release = holds.get(holdId);
      if (release === void 0) return;
      holds.delete(holdId);
      release();
    },
    size: () => holds.size,
    dispose: () => {
      for (const [holdId, release] of holds) {
        holds.delete(holdId);
        release();
      }
    }
  };
}

