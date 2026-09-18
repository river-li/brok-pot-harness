init_scheduling();
init_errors();
var USER_SKILLS_CACHE_PUBLISH_DEBOUNCE_MS = 1500;
var USER_SKILLS_CACHE_RETRY_INITIAL_DELAY_MS = 5e3;
var USER_SKILLS_CACHE_RETRY_MAX_DELAY_MS = 5 * 6e4;
function createUserSkillsCacheDebounce(delayMs = USER_SKILLS_CACHE_PUBLISH_DEBOUNCE_MS) {
  return createDebouncePolicy({
    name: "user-skills-cache-publish",
    delayMs
  });
}
function createUserSkillsCachePublishRetry(options2) {
  return createRetryPolicy({
    name: "user-skills-cache-publish-retry",
    mode: "until-signal",
    initialDelayMs: USER_SKILLS_CACHE_RETRY_INITIAL_DELAY_MS,
    maxDelayMs: USER_SKILLS_CACHE_RETRY_MAX_DELAY_MS,
    jitter: "full",
    clock: options2?.clock,
    random: options2?.random
  });
}
function createUserSkillsCacheService(deps) {
  if (!deps.isInBox) {
    return {
      api: { isEnabled: false },
      dispose: () => {
      }
    };
  }
  const watch4 = deps.watch ?? new WatchedDirectory(
    deps.libraryDir,
    createDebouncePolicy({
      name: "user-skills-cache-watch",
      delayMs: 0
    })
  );
  const stopped2 = new AbortController();
  let lastFingerprint;
  let changedWhilePublishing = false;
  const publishSoon = deps.debounce.wrap(() => {
    void publishSnapshot();
  });
  const publishAttempt = async (attempt, signal) => {
    const fingerprint = await deps.fingerprintLibrary(deps.libraryDir);
    if (fingerprint === lastFingerprint) return void 0;
    await deps.publishDeadline.run(
      (rpcSignal) => deps.publish({ fingerprint, signal: rpcSignal }),
      signal
    );
    if (attempt > 1) {
      deps.log(`[sand:user-skills-cache] publish recovered on attempt ${attempt}`);
    }
    return fingerprint;
  };
  const publishes = createSingleFlight({
    read: () => deps.publishRetry.runWithRetry(
      (attempt, signal) => publishAttempt(attempt, signal).catch((error41) => {
        if (attempt === 1 && !signal.aborted) {
          deps.log(`[sand:user-skills-cache] publish failed, retrying: ${errorLogTag(error41)}`);
        }
        throw error41;
      }),
      stopped2.signal
    ),
    install: (fingerprint) => {
      if (fingerprint !== void 0) lastFingerprint = fingerprint;
    },
    installFailure: (error41) => {
      if (stopped2.signal.aborted) return;
      deps.log(`[sand:user-skills-cache] publish gave up: ${errorLogTag(error41)}`);
    }
  });
  const publishSnapshot = async () => {
    if (publishes.isInFlight) {
      changedWhilePublishing = true;
      return;
    }
    do {
      changedWhilePublishing = false;
      await publishes.run();
    } while (changedWhilePublishing && !stopped2.signal.aborted);
  };
  watch4.setOnChange(() => {
    publishSoon();
  });
  publishSoon();
  return {
    api: { isEnabled: true },
    dispose: () => {
      stopped2.abort();
      publishSoon.dispose();
      publishes.dispose();
      watch4.setOnChange(void 0);
    }
  };
}
