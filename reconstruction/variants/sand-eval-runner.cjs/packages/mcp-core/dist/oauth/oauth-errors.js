/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/mcp-core/dist/oauth/oauth-errors.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function isRejectedTokenInvalidRequestOAuthError(error3) {
  if (error3 === null || typeof error3 !== "object") {
    return false;
  }
  const name17 = error3.name;
  const errorCode = error3.errorCode;
  const isInvalidRequest = name17 === "InvalidRequestError" || typeof errorCode === "string" && errorCode.toLowerCase() === "invalid_request";
  if (!isInvalidRequest) {
    return false;
  }
  const message = error3.message;
  return typeof message === "string" && OAUTH_REJECTED_TOKEN_MESSAGE_PATTERNS.some((pattern) => pattern.test(message));
}
function isOAuthCredentialRejectionError(error3) {
  if (error3 === null || typeof error3 !== "object") {
    return false;
  }
  const name17 = error3.name;
  if (typeof name17 === "string" && OAUTH_CREDENTIAL_ERROR_NAMES.has(name17)) {
    return true;
  }
  const errorCode = error3.errorCode;
  if (typeof errorCode === "string" && OAUTH_CREDENTIAL_ERROR_CODES.has(errorCode.toLowerCase())) {
    return true;
  }
  return isRejectedTokenInvalidRequestOAuthError(error3);
}
var OAUTH_CREDENTIAL_ERROR_NAMES, OAUTH_CREDENTIAL_ERROR_CODES, OAUTH_EXPIRED_TOKEN_MESSAGE_PATTERN, OAUTH_REJECTED_TOKEN_MESSAGE_PATTERNS;
var init_oauth_errors = __esm({
  "../packages/mcp-core/dist/oauth/oauth-errors.js"() {
    "use strict";
    OAUTH_CREDENTIAL_ERROR_NAMES = /* @__PURE__ */ new Set([
      "UnauthorizedError",
      "InvalidGrantError",
      "InvalidTokenError",
      "InvalidClientError",
      "UnauthorizedClientError"
    ]);
    OAUTH_CREDENTIAL_ERROR_CODES = /* @__PURE__ */ new Set([
      "invalid_grant",
      "invalid_token",
      "invalid_client",
      "unauthorized_client"
    ]);
    OAUTH_EXPIRED_TOKEN_MESSAGE_PATTERN = /\btoken (?:has |is )?expired\b/i;
    OAUTH_REJECTED_TOKEN_MESSAGE_PATTERNS = [
      OAUTH_EXPIRED_TOKEN_MESSAGE_PATTERN,
      /\btoken (?:was|is) invalid\b/i,
      /\binvalid (?:refresh[ _]?)?token\b/i,
      /\btoken (?:has been |was )?revoked\b/i
    ];
  }
});

