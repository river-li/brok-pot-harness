/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/rules/team-rules.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function createSandTeamRulesResolverFromLoad(options2) {
  let snapshot;
  let inFlight;
  const runLoad = async () => {
    let result;
    try {
      result = await options2.load();
    } catch (error42) {
      options2.reportLoadFailure(error42);
      return;
    }
    if (result.outcome === "rules") {
      snapshot = result.rules;
      return;
    }
    if (result.outcome === "no_team") {
      snapshot = [];
      return;
    }
  };
  const ensureLoad = () => {
    if (inFlight === void 0) {
      inFlight = runLoad().finally(() => {
        inFlight = void 0;
      });
    }
    return inFlight;
  };
  return {
    start() {
      void ensureLoad();
    },
    refresh() {
      void (async () => {
        const prior = inFlight;
        if (prior !== void 0) {
          await prior;
        }
        await ensureLoad();
      })();
    },
    async resolveRules() {
      await ensureLoad();
      return snapshot;
    }
  };
}

