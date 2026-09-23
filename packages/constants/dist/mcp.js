function cursorScmMcpServerIdentifier(provider) {
  return `${CURSOR_SCM_MCP_SERVER_IDENTIFIER_PREFIX}${provider}`;
}
function cursorScmProviderForMcpServerIdentifier(serverIdentifier) {
  return CURSOR_SCM_MCP_PROVIDERS.find((provider) => cursorScmMcpServerIdentifier(provider) === serverIdentifier);
}
function parseRestMcpScmToolError(args) {
  const boundProvider = cursorScmProviderForMcpServerIdentifier(args.emittingServerIdentifier);
  if (boundProvider === void 0) {
    return void 0;
  }
  let parsed;
  try {
    parsed = JSON.parse(args.text);
  } catch (_a20) {
    return void 0;
  }
  if (typeof parsed !== "object" || parsed === null) {
    return void 0;
  }
  const body = parsed;
  if (typeof body.error !== "string" || !REST_MCP_SCM_ERROR_CODE_SET.has(body.error) || body.provider !== boundProvider) {
    return void 0;
  }
  return Object.assign({ code: body.error, provider: body.provider }, typeof body.repo === "string" ? { repo: body.repo } : {});
}
function getRestMcpProviderIdForUrlPath(serverUrl) {
  if (serverUrl === void 0) {
    return void 0;
  }
  let url2;
  try {
    url2 = new URL(serverUrl);
  } catch (_a20) {
    return void 0;
  }
  const match2 = /^\/rest-mcp\/([^/]+)\/mcp\/?$/.exec(url2.pathname);
  return match2 === null || match2 === void 0 ? void 0 : match2[1];
}
function parseRestMcpProviderMetadataFromPrm(document2) {
  if (typeof document2 !== "object" || document2 === null) {
    return {};
  }
  const fields2 = document2;
  const clientId = typeof fields2.cursor_client_id === "string" && fields2.cursor_client_id.length > 0 ? fields2.cursor_client_id : void 0;
  let authorizationParams;
  if (typeof fields2.cursor_authorization_params === "object" && fields2.cursor_authorization_params !== null) {
    const stringEntries = Object.entries(fields2.cursor_authorization_params).filter((entry) => {
      return typeof entry[1] === "string";
    });
    if (stringEntries.length > 0) {
      authorizationParams = Object.fromEntries(stringEntries);
    }
  }
  return Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, clientId !== void 0 ? { clientId } : {}), fields2.cursor_omit_resource_indicator === true ? { omitResourceIndicator: true } : {}), fields2.cursor_omit_consent_prompt === true ? { omitConsentPrompt: true } : {}), authorizationParams !== void 0 ? { authorizationParams } : {}), fields2.cursor_rejects_custom_scheme_redirects === true ? { rejectsCustomSchemeRedirects: true } : {}), fields2.cursor_unauthenticated_connect === true ? { unauthenticatedConnect: true } : {}), fields2.cursor_loopback_ipv4 === true ? { loopbackIpv4: true } : {}), fields2.cursor_backend_only_token_exchange === true ? { backendOnlyTokenExchange: true } : {});
}
function getMcpOAuthProviderPolicy(hostname2) {
  return MCP_OAUTH_PROVIDER_POLICIES.get(hostname2.toLowerCase());
}
function getMcpOAuthProviderPolicyForUrl(serverUrl) {
  if (serverUrl === void 0) {
    return void 0;
  }
  let hostname2;
  try {
    hostname2 = new URL(serverUrl).hostname;
  } catch (_a20) {
    return void 0;
  }
  return getMcpOAuthProviderPolicy(hostname2);
}
function applyMcpOAuthProviderAuthorizationParams(authorizationUrl, mcpServerUrl) {
  var _a20;
  const params = (_a20 = getMcpOAuthProviderPolicyForUrl(mcpServerUrl)) === null || _a20 === void 0 ? void 0 : _a20.authorizationParams;
  if (params === void 0) {
    return;
  }
  for (const [key, value] of Object.entries(params)) {
    authorizationUrl.searchParams.set(key, value);
  }
}
function isLoopbackHttpUri(uri) {
  try {
    const parsed = new URL(uri);
    if (parsed.protocol !== "http:") {
      return false;
    }
    const host = parsed.hostname;
    return host === "localhost" || host === "127.0.0.1" || host === "[::1]";
  } catch (_a20) {
    return false;
  }
}
function mcpOAuthLoopbackRedirectUrl(args) {
  var _a20;
  const redirectUrl = (_a20 = args.redirectUrl) !== null && _a20 !== void 0 ? _a20 : MCP_OAUTH_LOOPBACK_CALLBACK_URL;
  if (args.loopbackIpv4 !== true || !isLoopbackHttpUri(redirectUrl)) {
    return redirectUrl;
  }
  const parsed = new URL(redirectUrl);
  parsed.hostname = MCP_OAUTH_LOOPBACK_IPV4_HOSTNAME;
  return parsed.toString();
}
function getCanonicalMcpOAuthRedirectUris(currentRedirectUri) {
  const redirectUris = /* @__PURE__ */ new Set();
  const isCurrentLoopbackHttp = currentRedirectUri !== void 0 && isLoopbackHttpUri(currentRedirectUri);
  if (currentRedirectUri && !isCurrentLoopbackHttp) {
    redirectUris.add(currentRedirectUri);
  }
  redirectUris.add(MCP_OAUTH_PORTAL_CALLBACK_URL);
  if (currentRedirectUri === MCP_OAUTH_GROK_BOT_MOBILE_CALLBACK_URL) {
    redirectUris.add(MCP_OAUTH_GROK_BOT_BOUNCE_CALLBACK_URL);
  }
  redirectUris.add(MCP_OAUTH_LOOPBACK_CALLBACK_URL);
  if (currentRedirectUri && isCurrentLoopbackHttp) {
    redirectUris.add(currentRedirectUri);
  }
  return Array.from(redirectUris);
}
var GOOGLE_WORKSPACE_POLICY_BASE, X_MONEY_POLICY_BASE, REST_MCP_CURSOR_AUTH_HEADER, REST_MCP_SCM_ERROR_CODES, CURSOR_SCM_MCP_SERVER_IDENTIFIER_PREFIX, CURSOR_SCM_MCP_PROVIDERS, REST_MCP_SCM_ERROR_CODE_SET, GROK_CONNECTORS_POLICY_BASE, MCP_OAUTH_PROVIDER_POLICIES, GOOGLE_WORKSPACE_MCP_HOSTS, MCP_OAUTH_CLIENT_LOGO_URI, MCP_OAUTH_EXTENSION_ID, MCP_OAUTH_RETURN_PATH, MCP_OAUTH_DESKTOP_RETURN_URL, MCP_OAUTH_PORTAL_CALLBACK_URL, MCP_OAUTH_GROK_BOT_BOUNCE_CALLBACK_URL, MCP_OAUTH_GROK_BOT_MOBILE_CALLBACK_URL, MCP_OAUTH_LOOPBACK_CALLBACK_URL, MCP_OAUTH_LOOPBACK_IPV4_HOSTNAME, MCP_OAUTH_LOOPBACK_IPV4_CALLBACK_URL;
var init_mcp = __esm({
  "../packages/constants/dist/mcp.js"() {
    "use strict";
    GOOGLE_WORKSPACE_POLICY_BASE = {
      provider: "google-workspace",
      clientRegistration: "static",
      unauthenticatedConnect: true,
      rejectsCustomSchemeRedirects: true,
      authorizationParams: {
        access_type: "offline",
        prompt: "consent"
      }
    };
    X_MONEY_POLICY_BASE = {
      provider: "x-money",
      clientRegistration: "static",
      // Assumed, matching every other static-registration provider: these
      // clients register Cursor's https portal and loopback callbacks, not the
      // `cursor://` deeplink. Relax if x-money registers the custom scheme.
      rejectsCustomSchemeRedirects: true,
      // Mirrors api.x.com: an unauthenticated `initialize` is rejected, so a
      // successful connect IS proof of authorization.
      unauthenticatedConnect: false,
      backendOnlyTokenExchange: true
    };
    REST_MCP_CURSOR_AUTH_HEADER = "x-cursor-auth";
    REST_MCP_SCM_ERROR_CODES = {
      /** The Cursor account has no connection for `provider`. */
      notConnected: "scm_not_connected",
      /** A connection exists but its token could not be resolved right now. */
      tokenUnavailable: "scm_token_unavailable",
      /** The provider rejected the stored grant; the user must reconnect. */
      tokenRejected: "scm_token_rejected",
      /** The connection cannot see `repo` (not granted, private, or missing). */
      repoNotAccessible: "scm_repo_not_accessible",
      /**
       * `repo`'s organization blocks the connection (SAML SSO not authorized for
       * the App, or an IP allow list). Fixed on the organization side, never by a
       * repo grant, so no connect / access card: the message carries the remedy.
       */
      orgBlocked: "scm_org_blocked"
    };
    CURSOR_SCM_MCP_SERVER_IDENTIFIER_PREFIX = "cursor-";
    CURSOR_SCM_MCP_PROVIDERS = ["github"];
    REST_MCP_SCM_ERROR_CODE_SET = new Set(Object.values(REST_MCP_SCM_ERROR_CODES));
    GROK_CONNECTORS_POLICY_BASE = {
      provider: "grok-connectors",
      clientRegistration: "static",
      rejectsCustomSchemeRedirects: true,
      unauthenticatedConnect: false,
      scopes: ["grok-plugins:access", "offline_access"]
    };
    MCP_OAUTH_PROVIDER_POLICIES = /* @__PURE__ */ new Map([
      [
        "gmailmcp.googleapis.com",
        Object.assign(Object.assign({}, GOOGLE_WORKSPACE_POLICY_BASE), { scopes: [
          "https://www.googleapis.com/auth/gmail.readonly",
          "https://www.googleapis.com/auth/gmail.compose",
          "https://www.googleapis.com/auth/gmail.modify"
        ] })
      ],
      [
        "drivemcp.googleapis.com",
        Object.assign(Object.assign({}, GOOGLE_WORKSPACE_POLICY_BASE), { scopes: [
          "https://www.googleapis.com/auth/drive.readonly",
          "https://www.googleapis.com/auth/drive.file"
        ] })
      ],
      [
        "calendarmcp.googleapis.com",
        Object.assign(Object.assign({}, GOOGLE_WORKSPACE_POLICY_BASE), { scopes: [
          "https://www.googleapis.com/auth/calendar.events",
          "https://www.googleapis.com/auth/calendar.calendarlist.readonly",
          "https://www.googleapis.com/auth/calendar.events.readonly",
          "https://www.googleapis.com/auth/calendar.events.freebusy"
        ] })
      ],
      [
        "docsmcp.googleapis.com",
        Object.assign(Object.assign({}, GOOGLE_WORKSPACE_POLICY_BASE), { scopes: ["https://www.googleapis.com/auth/documents"] })
      ],
      [
        "sheetsmcp.googleapis.com",
        Object.assign(Object.assign({}, GOOGLE_WORKSPACE_POLICY_BASE), { scopes: ["https://www.googleapis.com/auth/spreadsheets"] })
      ],
      [
        "slidesmcp.googleapis.com",
        Object.assign(Object.assign({}, GOOGLE_WORKSPACE_POLICY_BASE), { scopes: ["https://www.googleapis.com/auth/presentations"] })
      ],
      [
        "bigquery.googleapis.com",
        Object.assign(Object.assign({}, GOOGLE_WORKSPACE_POLICY_BASE), { scopes: ["https://www.googleapis.com/auth/bigquery"] })
      ],
      // The hosted X MCP server. Mirrors the X marketplace plugin's full scope
      // list — pinning a narrower set here would shrink existing users' tokens
      // and break the plugin's bookmark/list/block/chat tools. `developer.write` is
      // required by the X API credit-provisioning deal
      // (backend/server/src/mcp/xApiCreditProvisioning.ts calls /2/account with
      // the minted token on every OAuth completion). Pinned here rather than in
      // the plugin config because installed connectors keep a snapshot of that
      // config forever.
      [
        "api.x.com",
        {
          provider: "x",
          clientRegistration: "static",
          unauthenticatedConnect: false,
          rejectsCustomSchemeRedirects: false,
          scopes: [
            "tweet.read",
            "users.read",
            "follows.read",
            "space.read",
            "mute.read",
            "like.read",
            "list.read",
            "list.write",
            "block.read",
            "block.write",
            "bookmark.read",
            "bookmark.write",
            "dm.read",
            "dm.write",
            "developer.billing.write",
            "developer.write",
            "offline.access"
          ],
          pinsScopesOverConfiguredScopes: true
        }
      ],
      // The x-money MCP servers. Separate provider from `api.x.com` above
      // despite the shared registrable domain: that entry exists only to pin X
      // API scopes and has no backend credential resolver, while these carry
      // backend-held signing keys and cannot be exchanged client-side.
      ["mcp.money-dev.x.com", X_MONEY_POLICY_BASE],
      ["mcp.money-staging.x.com", X_MONEY_POLICY_BASE],
      ["mcp.money.x.com", X_MONEY_POLICY_BASE],
      ["connectors-gateway.grok.gcp.mouseion.dev", GROK_CONNECTORS_POLICY_BASE],
      ["connectors-gateway.grok.com", GROK_CONNECTORS_POLICY_BASE]
    ]);
    GOOGLE_WORKSPACE_MCP_HOSTS = new Set([...MCP_OAUTH_PROVIDER_POLICIES].filter(([, policy]) => policy.provider === "google-workspace").map(([hostname2]) => hostname2));
    MCP_OAUTH_CLIENT_LOGO_URI = "https://ptht05hbb1ssoooe.public.blob.vercel-storage.com/assets/uploads/cursorlogomcpv3.svg";
    MCP_OAUTH_EXTENSION_ID = "anysphere.cursor-mcp";
    MCP_OAUTH_RETURN_PATH = "/oauth/return";
    MCP_OAUTH_DESKTOP_RETURN_URL = `cursor://${MCP_OAUTH_EXTENSION_ID}${MCP_OAUTH_RETURN_PATH}`;
    MCP_OAUTH_PORTAL_CALLBACK_URL = "https://www.cursor.com/agents/mcp/oauth/callback";
    MCP_OAUTH_GROK_BOT_BOUNCE_CALLBACK_URL = "https://www.cursor.com/bot/mcp/oauth/callback";
    MCP_OAUTH_GROK_BOT_MOBILE_CALLBACK_URL = "grokbot://mcp/oauth/callback";
    MCP_OAUTH_LOOPBACK_CALLBACK_URL = "http://localhost:8787/callback";
    MCP_OAUTH_LOOPBACK_IPV4_HOSTNAME = "127.0.0.1";
    MCP_OAUTH_LOOPBACK_IPV4_CALLBACK_URL = mcpOAuthLoopbackRedirectUrl({
      loopbackIpv4: true
    });
  }
});
