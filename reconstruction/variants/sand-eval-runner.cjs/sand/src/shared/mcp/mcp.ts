/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/mcp/mcp.ts
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var DESIGNATED_DANGEROUS_MCP_TOOL_NAMES = /* @__PURE__ */ new Set([
  "notion-create-pages",
  "create_anyship_deployment"
]);
var DANGEROUS_MCP_TOOL_EXECUTE_TIMEOUT_MS = 45 * 6e4;
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
      const parsed = JSON.parse(value);
      if (typeof parsed === "string") return parsed;
    } catch {
    }
  }
  return rawArgument;
}
function formatMcpAccountLabelForPrompt(rawLabel) {
  const inert = rawLabel.replace(/["'`\\[\]{}()<>]/g, "").replace(/\s+/g, " ").trim();
  return inert.slice(0, MAX_RENDERED_MCP_ACCOUNT_LABEL_LENGTH);
}
var MAX_CONNECTOR_ERROR_LENGTH = 300;
var MAX_UNTRUSTED_MARKUP_SCAN_LENGTH = 16384;
function stripMarkupAndBoundConnectorError(raw) {
  const collapsed = raw.slice(0, MAX_UNTRUSTED_MARKUP_SCAN_LENGTH).replace(/<(script|style)\b[^<>]*>[\s\S]*?(?:<\/\1>|$)/gi, " ").replace(/<[^<>]*>/g, " ").replace(/\s+/g, " ").trim();
  if (collapsed.length === 0) return "";
  return collapsed.length > MAX_CONNECTOR_ERROR_LENGTH ? `${collapsed.slice(0, MAX_CONNECTOR_ERROR_LENGTH - 1).trimEnd()}\u2026` : collapsed;
}

