/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/mcp-core/dist/oauth/oauth-scope-override.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function applyConfiguredOAuthScopeOverride(authorizationUrl, scopes) {
  if (scopes !== void 0 && scopes.length > 0) {
    authorizationUrl.searchParams.set("scope", scopes.join(" "));
  }
}
var init_oauth_scope_override = __esm({
  "../packages/mcp-core/dist/oauth/oauth-scope-override.js"() {
    "use strict";
  }
});

