function buildOAuthTokensSnapshotForLog(tokens, options2) {
  const accessToken = tokens === null || tokens === void 0 ? void 0 : tokens.access_token;
  const accessTokenLen = typeof accessToken === "string" ? accessToken.length : 0;
  const refreshTokenPresent = Boolean(tokens === null || tokens === void 0 ? void 0 : tokens.refresh_token);
  const expiresInSec = typeof (tokens === null || tokens === void 0 ? void 0 : tokens.expires_in) === "number" && Number.isFinite(tokens.expires_in) ? tokens.expires_in : null;
  const expiresAtTimestamp = (options2 === null || options2 === void 0 ? void 0 : options2.expiresInIsFresh) && expiresInSec !== null ? Date.now() + Math.round(expiresInSec * 1e3) : null;
  const grantedScope = typeof (tokens === null || tokens === void 0 ? void 0 : tokens.scope) === "string" && tokens.scope.length > 0 ? tokens.scope : null;
  return {
    accessTokenLen,
    refreshTokenPresent,
    expiresAtTimestamp,
    grantedScope
  };
}
var init_oauth_log_events = __esm({
  "../packages/mcp-core/dist/oauth-log-events.js"() {
    "use strict";
    init_log_metadata();
    init_mcp_oauth_keys();
  }
});
