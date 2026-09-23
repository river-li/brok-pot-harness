var SAND_LOCAL_AI_TOOL_NO_DESKTOP_MESSAGE = "No connected desktop app can read that tool's setup right now. Ask the user to open the Grok Bot desktop app on the computer where they use it, then try again.";
function readerOf2(userComputers) {
  const connected2 = userComputers.list().filter((descriptor2) => descriptor2.connected);
  const preferred = userComputers.resolve(void 0);
  const candidates = preferred !== void 0 && connected2.some((descriptor2) => descriptor2.id === preferred.id) ? [preferred, ...connected2.map((descriptor2) => userComputers.resolve(descriptor2.id))] : connected2.map((descriptor2) => userComputers.resolve(descriptor2.id));
  return candidates.find((handle) => handle?.readAiToolSetup !== void 0);
}
function localAiToolActivityItems(setup) {
  const name17 = SAND_AI_TOOL_DISPLAY_NAMES[setup.source];
  if (!setup.found) {
    return [
      {
        kind: "session",
        title: `${name17} is not set up on this computer`,
        excerpt: "No local configuration or history was found, so there is nothing to draw on from it."
      }
    ];
  }
  return setup.items.slice(0, SAND_CONNECTED_ACTIVITY_LIMIT).map((item) => ({
    kind: item.kind,
    title: item.title,
    excerpt: item.excerpt ?? "",
    ...item.occurredAtMs === void 0 ? {} : { occurredAtMs: item.occurredAtMs }
  }));
}
function createLocalAiToolActivityPort(args) {
  const isAvailable = args.isAvailable ?? (() => true);
  return {
    get sources() {
      return isAvailable() && readerOf2(args.userComputers) !== void 0 ? SAND_AI_TOOL_SOURCES : [];
    },
    fetch: async (source, ctx) => {
      if (!isLocalAiToolActivitySource(source)) {
        throw new Error(`Source "${source}" is not read from the user's computer`);
      }
      if (!isAvailable()) {
        throw new Error("Local AI tool activity is unavailable for this turn");
      }
      const reader = readerOf2(args.userComputers)?.readAiToolSetup;
      if (reader === void 0) throw new Error(SAND_LOCAL_AI_TOOL_NO_DESKTOP_MESSAGE);
      return localAiToolActivityItems(await reader(ctx, source));
    }
  };
}
