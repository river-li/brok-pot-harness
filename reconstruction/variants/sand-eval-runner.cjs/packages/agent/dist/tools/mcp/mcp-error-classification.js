/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/tools/mcp/mcp-error-classification.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var MCP_JSON_RPC_ERROR_CODE_REGEX = /MCP error\s*(-\d+):/i;
var MCP_AUTH_ERROR_FRAGMENTS = [
  "requires authentication",
  "invalid refresh token",
  "invalid_grant",
  "unauthorized",
  "authentication failed",
  "oauth token exchange failed",
  "oauth token refresh failed",
  "authentication timed out",
  "authentication required",
  "not authenticated",
  "bad credentials",
  "credential error",
  "invalid_token",
  "invalid token",
  "token is expired",
  "token was revoked"
];
function isMcpAuthErrorMessage(errorMessage4) {
  const message = errorMessage4.toLowerCase();
  return MCP_AUTH_ERROR_FRAGMENTS.some((fragment) => message.includes(fragment)) || /\b401\b/.test(message);
}
function parseMcpJsonRpcErrorCode(errorMessage4) {
  const match2 = errorMessage4.match(MCP_JSON_RPC_ERROR_CODE_REGEX);
  if (!match2) {
    return void 0;
  }
  const code = Number.parseInt(match2[1], 10);
  if (Number.isNaN(code)) {
    return void 0;
  }
  return code;
}
var MCP_ENVIRONMENT_ERROR_FRAGMENTS = [
  // Matched by message, not by its -32000 code: servers reuse that code for
  // application errors like rate limits.
  "connection closed",
  "econnrefused",
  "econnreset",
  "enotfound",
  "ehostunreach",
  "enetunreach",
  "epipe",
  "enoent",
  "no local mcp resource executor is configured",
  "unsupported operation:",
  "unsupported exec:",
  "unsupported cursor exec request",
  "did not advertise",
  "failed to reinitialize mcp session",
  "not available through this gateway"
];
var MCP_TIMEOUT_ERROR_FRAGMENTS = ["connection timed out after", "etimedout"];
function isMcpEnvironmentErrorMessage(errorMessage4) {
  const message = errorMessage4.toLowerCase();
  return MCP_ENVIRONMENT_ERROR_FRAGMENTS.some((fragment) => message.includes(fragment));
}
function isMcpTimeoutErrorMessage(errorMessage4) {
  const message = errorMessage4.toLowerCase();
  return MCP_TIMEOUT_ERROR_FRAGMENTS.some((fragment) => message.includes(fragment));
}
function classifyMcpErrorMessage(errorMessage4) {
  if (isMcpAuthErrorMessage(errorMessage4)) {
    return ToolErrorClassification.MCP_AUTH_ERROR;
  }
  const code = parseMcpJsonRpcErrorCode(errorMessage4);
  switch (code) {
    case -32700:
    case -32600:
    case -32602:
      return ToolErrorClassification.INVALID_ARGS;
    case -32601:
      return ToolErrorClassification.UNEXPECTED_ENVIRONMENT;
    case -32001:
      return ToolErrorClassification.TIMEOUT;
  }
  if (isMcpTimeoutErrorMessage(errorMessage4)) {
    return ToolErrorClassification.TIMEOUT;
  }
  if (isMcpEnvironmentErrorMessage(errorMessage4)) {
    return ToolErrorClassification.UNEXPECTED_ENVIRONMENT;
  }
  if (code === void 0) {
    return void 0;
  }
  return ToolErrorClassification.OTHER_ERROR;
}

