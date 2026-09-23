init_bounded();
var KNOWN_CONNECTOR_TAGS = /* @__PURE__ */ new Set([
  "1password",
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
function analyticsOnlyUnboundedConnectorDomain(serverUrl) {
  if (serverUrl === void 0 || serverUrl.length === 0) return void 0;
  if (!URL.canParse(serverUrl)) return void 0;
  const hostname3 = new URL(serverUrl).hostname.toLowerCase();
  return hostname3.length === 0 ? void 0 : hostname3;
}
function connectorAuthAnalyticsProps(report, surface) {
  const tags = report.error === void 0 ? {} : sandErrorTags(report.error);
  const domain2 = analyticsOnlyUnboundedConnectorDomain(report.serverUrl);
  const serverId = brandedId(report.serverId);
  return {
    phase: report.phase,
    outcome: report.outcome,
    connector: boundedConnectorTag(report.serverName),
    surface,
    ...tags.reason === void 0 ? {} : { reason: tags.reason },
    ...tags.error_code === void 0 ? {} : { error_code: tags.error_code },
    ...report.reauth === void 0 ? {} : { reauth: report.reauth },
    ...domain2 === void 0 ? {} : { domain: domain2 },
    ...serverId === void 0 ? {} : { server_id: serverId }
  };
}
function connectorAuthTelemetry(report, surface) {
  return {
    level: report.outcome === "failed" || report.outcome === "timeout" ? "warn" : "info",
    metadata: {
      phase: report.phase,
      connector: boundedConnectorTag(report.serverName),
      outcome: report.outcome,
      surface,
      server_id: brandedId(report.serverId),
      reauth: report.reauth === void 0 ? void 0 : String(report.reauth),
      ...report.error === void 0 ? {} : sandErrorTags(report.error)
    }
  };
}
