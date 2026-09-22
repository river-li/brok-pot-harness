/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/runner/tools/sand-connected-activity-tool.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_zod();
var SAND_FETCH_CONNECTED_ACTIVITY_TOOL_NAME = "FetchConnectedActivity";
function sourceSchema(sources) {
  if (sources.includes("cursor")) return external_exports.literal("cursor");
  throw new Error("FetchConnectedActivity requires at least one connected source");
}
function formatConnectedActivity(source, items) {
  return JSON.stringify(
    {
      source,
      items: items.map((item) => ({
        title: item.title,
        excerpt: item.excerpt,
        occurred_at: new Date(item.occurredAtMs).toISOString(),
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
  return defineCommunicateTool(port, {
    id: "COMMUNICATE_UPDATE",
    name: SAND_FETCH_CONNECTED_ACTIVITY_TOOL_NAME,
    description: "Fetch a bounded list of recent activity from one of the user's connected sources so you can understand how they use that product. Only call after the user explicitly asks you to use, or grants access in this conversation to, activity from that source. Never call proactively. Returns up to 40 recent items with a title, time, short excerpt, and Cursor Project name/relationship when applicable; never full threads.",
    parameters: external_exports.object({
      source: sourceSchema(port.sources).describe(
        "The connected source to read. Only sources currently connected for this user are available."
      )
    }),
    describeActivity: (args) => ({ detail: args.source }),
    execute: async (_ctx, args, deps) => formatConnectedActivity(args.source, await deps.fetch(args.source))
  });
}

