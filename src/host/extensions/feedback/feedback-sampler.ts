/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/feedback/feedback-sampler.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_errors();
function createFeedbackSampler(deps) {
  const now = deps.now ?? Date.now;
  const random = deps.random ?? Math.random;
  return {
    handleTurnSettled(event) {
      const config2 = deps.getConfig();
      if (!config2.enabled) return;
      const nowMs2 = now();
      const firstSeenAtMs = deps.store.ensureFirstSeenAtMs(nowMs2);
      if (nowMs2 - firstSeenAtMs < config2.signup_grace_seconds * 1e3) return;
      const lastShownAtMs = deps.store.lastShownAtMs();
      if (lastShownAtMs != null && nowMs2 - lastShownAtMs < config2.cooldown_seconds * 1e3) {
        return;
      }
      const denominator = Math.max(1, Math.floor(config2.sample_rate_denominator));
      if (random() * denominator >= 1) return;
      deps.store.markShown(nowMs2);
      void deps.appendPrompt(event).then((entryId) => {
        if (entryId != null) deps.onPromptShown(event.agentId);
      }).catch((error42) => deps.reportAppendFailure(errorLogTag(error42)));
    }
  };
}

