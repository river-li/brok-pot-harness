var CURSOR_SOURCES = ["cursor"];
function createCursorConnectedActivityPort(api, options2 = {}) {
  const isAvailable = options2.isAvailable ?? (() => true);
  return {
    get sources() {
      return isAvailable() ? CURSOR_SOURCES : [];
    },
    fetch: async (source) => {
      if (source !== "cursor") {
        throw new Error(`Source "${source}" is not served by the Cursor connected activity port`);
      }
      if (!isAvailable()) {
        throw new Error("Cursor connected activity is unavailable for this turn");
      }
      return await api.listRecentActivity(SAND_CONNECTED_ACTIVITY_LIMIT);
    }
  };
}
