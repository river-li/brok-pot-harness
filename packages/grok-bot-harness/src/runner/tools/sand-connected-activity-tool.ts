init_zod();
var SAND_FETCH_CONNECTED_ACTIVITY_TOOL_NAME = "FetchConnectedActivity";
var SOURCE_NOTES = {
  cursor: "cursor: recent Cursor agent activity from the user's connected Cursor account.",
  claude_code: "claude_code: the Claude Code setup on the user's own computer, read by their desktop app after they approve a permission card: MCP connector names and transports, installed plugins, skill and command names, and recent session titles. Never secrets, URLs, file paths, or conversation bodies.",
  codex: "codex: the Codex CLI setup on the user's own computer, read the same way: MCP connector names and transports, skill and prompt names, and recent session titles."
};
function sourceSchema(sources) {
  const [first, ...rest] = sources;
  if (first === void 0) {
    throw new Error("FetchConnectedActivity requires at least one connected source");
  }
  return external_exports.enum([first, ...rest]);
}
function describeSources(sources) {
  return sources.map((source) => SOURCE_NOTES[source]).join(" ");
}
function formatConnectedActivity(source, items) {
  return JSON.stringify(
    {
      source,
      items: items.map((item) => ({
        ...item.kind === void 0 ? {} : { kind: item.kind },
        title: item.title,
        excerpt: item.excerpt,
        ...item.occurredAtMs === void 0 ? {} : { occurred_at: new Date(item.occurredAtMs).toISOString() },
        ...item.project == null ? {} : {
          project: {
            name: item.project.name,
            relationship: item.project.relationship
          }
        }
      }))
    },
    null,
    2
  );
}
function createFetchConnectedActivityTool(port) {
  const sources = port.sources;
  const localNote = sources.some(isLocalAiToolActivitySource) ? " A local source shows the user one approval card on their desktop before anything is read; your framing line is the ask, so do not put a confirmation widget in front of the call. Use what comes back to propose new routines and connectors, or to remake an old connector through AddMcpServer with fresh credentials from the user. Never copy configuration or credentials." : "";
  return defineCommunicateTool(port, {
    id: "COMMUNICATE_UPDATE",
    name: SAND_FETCH_CONNECTED_ACTIVITY_TOOL_NAME,
    description: "Fetch a bounded summary of one of the user's connected sources so you can understand how they already work. Only call after the user explicitly asks you to use, or grants access in this conversation to, that source. Never call proactively. Returns up to 40 items, each with a kind, a title, a short excerpt, and a time when known; never full threads or configuration values. Sources: " + describeSources(sources) + localNote,
    parameters: external_exports.object({
      source: sourceSchema(sources).describe(
        "The connected source to read. Only sources currently connected for this user are available."
      )
    }),
    describeActivity: (args) => ({ detail: args.source }),
    execute: async (ctx, args, deps) => formatConnectedActivity(args.source, await deps.fetch(args.source, ctx))
  });
}
