var SAND_CONNECTED_ACTIVITY_LIMIT = 40;
var SAND_CONNECTED_ACTIVITY_SOURCES = ["cursor", ...SAND_AI_TOOL_SOURCES];
function isLocalAiToolActivitySource(source) {
  return SAND_AI_TOOL_SOURCES.some((candidate) => candidate === source);
}
function combineConnectedActivityPorts(ports) {
  return {
    get sources() {
      const seen = /* @__PURE__ */ new Set();
      for (const port of ports) {
        for (const source of port.sources) seen.add(source);
      }
      return SAND_CONNECTED_ACTIVITY_SOURCES.filter((source) => seen.has(source));
    },
    fetch: async (source, ctx) => {
      const port = ports.find((candidate) => candidate.sources.includes(source));
      if (port === void 0) {
        throw new Error(`Connected activity source "${source}" is unavailable for this turn`);
      }
      return await port.fetch(source, ctx);
    }
  };
}
