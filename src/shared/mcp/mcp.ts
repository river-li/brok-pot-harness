var DEFAULT_MCP_ACCOUNT_KEY = "default";
var DESIGNATED_DANGEROUS_MCP_TOOL_NAMES = /* @__PURE__ */ new Set([
  "notion-create-pages",
  "create_anyship_deployment"
]);
var DANGEROUS_MCP_TOOL_EXECUTE_TIMEOUT_MS = 45 * 6e4;
function normalizeMcpAccountLabel(rawLabel) {
  return rawLabel.trim().toLowerCase();
}
function provisionalMcpAccountServerIdentifier(rowIdentifier, accountKey) {
  return accountKey === DEFAULT_MCP_ACCOUNT_KEY ? rowIdentifier : `${rowIdentifier}--${accountKey}`;
}
var MAX_RENDERED_MCP_ACCOUNT_LABEL_LENGTH = 64;
var MCP_LABEL_HOSTILE_CHARS = /[\u0000-\u001f\u007f"'`\\[\]{}()<>\u2028\u2029]/g;
function encodeMcpAccountLabelForListing(label) {
  const escaped = label.replace(
    MCP_LABEL_HOSTILE_CHARS,
    (char) => `\\u${char.charCodeAt(0).toString(16).padStart(4, "0")}`
  );
  return `"${escaped}"`;
}
function decodeMcpAccountLabelArgument(rawArgument) {
  const value = rawArgument.trim();
  if (value.length >= 2 && value.startsWith('"') && value.endsWith('"')) {
    try {
      const parsed2 = JSON.parse(value);
      if (typeof parsed2 === "string") return parsed2;
    } catch {
    }
  }
  return rawArgument;
}
function formatMcpAccountLabelForPrompt(rawLabel) {
  const inert = rawLabel.replace(/["'`\\[\]{}()<>]/g, "").replace(/\s+/g, " ").trim();
  return inert.slice(0, MAX_RENDERED_MCP_ACCOUNT_LABEL_LENGTH);
}
function formatMcpAccountDisplayName(name17, accountKey) {
  return accountKey != null && accountKey !== DEFAULT_MCP_ACCOUNT_KEY ? `${name17} (${formatMcpAccountLabelForPrompt(accountKey)})` : name17;
}
function isEffectivePluginInstalled(plugin) {
  return plugin.isEnabled;
}
function uninstallClearedInstallRecord(result) {
  return result.removed || result.reason === "team-server";
}
var BLOCKED_MCP_OAUTH_REDIRECT_SCHEMES = /* @__PURE__ */ new Set([
  "javascript:",
  "data:",
  "file:",
  "blob:",
  "about:",
  "vbscript:",
  "ftp:",
  "ws:",
  "wss:",
  "mailto:",
  "tel:",
  "sms:",
  "intent:",
  "chrome:",
  "chrome-extension:",
  "moz-extension:",
  "filesystem:",
  "view-source:",
  "jar:",
  "resource:",
  "ms-appx:",
  "ms-appx-web:"
]);
var MAX_MCP_OAUTH_REDIRECT_URI_LENGTH = 2048;
function hasForbiddenMcpOAuthRedirectChar(value) {
  for (let index = 0; index < value.length; index++) {
    const code = value.charCodeAt(index);
    if (code <= 32 || code === 127 || code === 35) return true;
  }
  return false;
}
var MCP_OAUTH_LOOPBACK_HOSTS = /* @__PURE__ */ new Set(["localhost", "127.0.0.1", "[::1]"]);
function isValidMcpOAuthRedirectUri(value) {
  if (typeof value !== "string" || value.length === 0) return false;
  if (value.length > MAX_MCP_OAUTH_REDIRECT_URI_LENGTH) return false;
  if (hasForbiddenMcpOAuthRedirectChar(value)) return false;
  if (!URL.canParse(value)) return false;
  const url2 = new URL(value);
  if (url2.href !== value) return false;
  if (url2.username.length > 0 || url2.password.length > 0) return false;
  if (BLOCKED_MCP_OAUTH_REDIRECT_SCHEMES.has(url2.protocol)) return false;
  if (url2.protocol === "http:") return MCP_OAUTH_LOOPBACK_HOSTS.has(url2.hostname);
  if (url2.protocol === "https:") return true;
  return url2.hostname.length > 0 || url2.pathname.length > 0;
}
var MAX_CONNECTOR_ERROR_LENGTH = 300;
var MAX_UNTRUSTED_MARKUP_SCAN_LENGTH = 16384;
function stripMarkupAndBoundConnectorError(raw) {
  const collapsed = raw.slice(0, MAX_UNTRUSTED_MARKUP_SCAN_LENGTH).replace(/<(script|style)\b[^<>]*>[\s\S]*?(?:<\/\1>|$)/gi, " ").replace(/<[^<>]*>/g, " ").replace(/\s+/g, " ").trim();
  if (collapsed.length === 0) return "";
  return collapsed.length > MAX_CONNECTOR_ERROR_LENGTH ? `${collapsed.slice(0, MAX_CONNECTOR_ERROR_LENGTH - 1).trimEnd()}\u2026` : collapsed;
}
var MCP_RAW_SERVER_STATUSES = { connected: true, needsAuth: true, loading: true, error: true };
function parseMcpRawServerStatus(raw) {
  return isKeyOf(MCP_RAW_SERVER_STATUSES, raw) ? { kind: "known", status: raw } : { kind: "unreported", raw };
}
function statusFromMcpRawServerStatus(status, technicalDetail) {
  switch (status) {
    case "connected":
      return { status: "connected" };
    case "needsAuth":
      return { status: "needsAuth", statusDetail: { kind: "authentication_required" } };
    case "loading":
      return { status: "initializing" };
    case "error":
      return {
        status: "error",
        statusDetail: {
          kind: "failed_to_load",
          ...technicalDetail != null && technicalDetail.length > 0 ? { technicalDetail } : {}
        }
      };
    default: {
      const _exhaustive = status;
      return _exhaustive;
    }
  }
}
