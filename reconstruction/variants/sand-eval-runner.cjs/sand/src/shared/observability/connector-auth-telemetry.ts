/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/observability/connector-auth-telemetry.ts
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var KNOWN_CONNECTOR_TAGS = /* @__PURE__ */ new Set([
  "asana",
  "atlassian",
  "buildkite",
  "confluence",
  "context7",
  "databricks",
  "datadog",
  "deepwiki",
  "dock",
  "figma",
  "filesystem",
  "github",
  "gmail",
  "google",
  "googlecalendar",
  "googledocs",
  "googledrive",
  "googlesheets",
  "googleworkspace",
  "huggingface",
  "jira",
  "linear",
  "memory",
  "notion",
  "playwright",
  "salesforce",
  "sentry",
  "sequentialthinking",
  "slack",
  "stripe",
  "telegram",
  "todoist",
  "zoominfo"
]);
var OTHER_CONNECTOR_TAG = "other";
var UNKNOWN_CONNECTOR_TAG = "unknown";
var PER_BROWSER_WINDOW_MCP_SERVER_SUFFIX = /-w\d+$/;
function boundedConnectorTag(serverName) {
  if (serverName === void 0) return UNKNOWN_CONNECTOR_TAG;
  const normalized = serverName.toLowerCase().replace(PER_BROWSER_WINDOW_MCP_SERVER_SUFFIX, "").replace(/[^a-z0-9]/g, "");
  if (normalized.length === 0) return UNKNOWN_CONNECTOR_TAG;
  return KNOWN_CONNECTOR_TAGS.has(normalized) ? normalized : OTHER_CONNECTOR_TAG;
}

