/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/runner/tools/draft-connector-results.ts
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var import_node_crypto36 = require("node:crypto");
init_esm13();
function buildDraftCallArgs(spec) {
  return new McpArgs({
    name: `${spec.providerIdentifier}-${spec.toolName}`,
    providerIdentifier: spec.providerIdentifier,
    toolName: spec.toolName,
    toolCallId: `${spec.callIdPrefix}-${(0, import_node_crypto36.randomUUID)()}`,
    args: Object.fromEntries(
      Object.entries(spec.args).map(([key, value]) => [key, Value.fromJson(value)])
    )
  });
}
function describeDraftCallFailure(result) {
  const inner = result.result;
  switch (inner.case) {
    case "success": {
      if (!inner.value.isError) return null;
      const text2 = inner.value.content.map((item) => item.content.case === "text" ? item.content.value.text : "").join(" ").trim();
      return text2.length > 0 ? text2 : "The connector reported a tool error.";
    }
    case "error":
      return inner.value.error;
    case "rejected":
      return inner.value.reason.length > 0 ? inner.value.reason : "The call was rejected.";
    case "permissionDenied":
      return "The connector denied permission for this call.";
    case "toolNotFound":
      return "The connector does not offer this tool.";
    case "serverNotFound":
      return "The connector is not installed or connected.";
    case "approved":
      return "The call was approved but never executed.";
    case void 0:
      return "The connector returned no result.";
  }
}
function draftCallResultText(result) {
  const inner = result.result;
  if (inner.case !== "success") return "";
  return inner.value.content.map((item) => item.content.case === "text" ? item.content.value.text : "").join(" ").trim();
}
function parseDraftConnectorJson(text2) {
  try {
    return { ok: true, value: JSON.parse(text2) };
  } catch {
    return { ok: false };
  }
}
function parseDraftConnectorRecord(text2) {
  const parsed = parseDraftConnectorJson(text2);
  if (!parsed.ok || typeof parsed.value !== "object" || parsed.value == null) return null;
  return Object.fromEntries(Object.entries(parsed.value));
}

