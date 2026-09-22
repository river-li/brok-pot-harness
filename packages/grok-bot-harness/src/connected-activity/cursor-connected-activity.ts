/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/connected-activity/cursor-connected-activity.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function createCursorConnectedActivityPort(api, options2 = {}) {
  const isAvailable = options2.isAvailable ?? (() => true);
  return {
    get sources() {
      return isAvailable() ? SAND_CONNECTED_ACTIVITY_SOURCES : [];
    },
    fetch: async () => {
      if (!isAvailable()) {
        throw new Error("Cursor connected activity is unavailable for this turn");
      }
      return await api.listRecentActivity(SAND_CONNECTED_ACTIVITY_LIMIT);
    }
  };
}

