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
