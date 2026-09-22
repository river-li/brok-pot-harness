/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/desktop/deep-link.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var GROK_BOT_DEEP_LINK_SCHEME = SAND_BOT_TEMPLATE_LINK.schemes[0];
var LEGACY_SAND_DEEP_LINK_SCHEME = SAND_BOT_TEMPLATE_LINK.schemes[1];
var SAND_DEEP_LINK_AUTHORITY = SAND_BOT_TEMPLATE_LINK.authority;
var SAND_DEEP_LINK_MAX_LENGTH = SAND_BOT_TEMPLATE_LINK.maxLength;
var SAND_MARKETPLACE_TABS = ["plugins", "bots"];
var SAND_MARKETPLACE_ITEM_ID_PATTERN = /[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?/;
var AGENT_ID_PATTERN = /[A-Za-z0-9_-]{1,128}/;
var sandDeepLinks = declareDeepLinkSurface({
  authority: SAND_DEEP_LINK_AUTHORITY,
  schemes: [GROK_BOT_DEEP_LINK_SCHEME, LEGACY_SAND_DEEP_LINK_SCHEME],
  maxUrlLength: SAND_DEEP_LINK_MAX_LENGTH,
  routes: {
    agent: deepLinkRoute("/v1/agent", {
      id: routeString(AGENT_ID_PATTERN)
    }),
    "bot-template": deepLinkRoute(SAND_BOT_TEMPLATE_LINK.path, {
      id: routeString(BOT_TEMPLATE_SHARE_ID_PATTERN)
    }),
    marketplace: deepLinkRoute("/v1/marketplace", {
      tab: routeOptional(routeString({ oneOf: SAND_MARKETPLACE_TABS })),
      id: routeOptional(
        routeString({
          pattern: SAND_MARKETPLACE_ITEM_ID_PATTERN,
          maxDecodedLength: 128
        })
      )
    }),
    "plugin-add": deepLinkRoute("/v1/plugin/add", {
      id: routeString(/[0-9]{1,19}/)
    }),
    "github-connect-callback": deepLinkRoute("/v1/github-connect-callback", {
      state: routeString(/cursor_grok_bot_github_v1\.[0-9a-f]{32}\.[0-9a-f]{32}/),
      code: routeOptional(routeString(/[A-Za-z0-9_-]{1,200}/)),
      installationId: routeOptional(routeString(/[1-9][0-9]{0,18}/)),
      setupAction: routeOptional(routeString({ oneOf: ["install", "update", "request"] })),
      error: routeOptional(routeString(/[a-z_]{1,64}/))
    }),
    "gitlab-connect-callback": deepLinkRoute("/v1/gitlab-connect-callback", {
      state: routeString(/cursor_grok_bot_gitlab_v1\.[0-9a-f]{32}\.[0-9a-f]{32}/),
      code: routeOptional(routeString(/[A-Za-z0-9_-]{1,200}/)),
      error: routeOptional(routeString(/[a-z_]{1,64}/))
    }),
    "bitbucket-connect-callback": deepLinkRoute("/v1/bitbucket-connect-callback", {
      state: routeString(/cursor_grok_bot_bitbucket_v1\.[0-9a-f]{32}\.[0-9a-f]{32}/),
      code: routeOptional(routeString(/[A-Za-z0-9._-]{1,1800}/)),
      error: routeOptional(routeString(/[a-z_]{1,64}/))
    }),
    "azure-devops-connect-callback": deepLinkRoute("/v1/azure-devops-connect-callback", {
      state: routeString(/cursor_grok_bot_azure_devops_v1\.[0-9a-f]{32}\.[0-9a-f]{32}/),
      code: routeOptional(routeString(/[A-Za-z0-9._-]{1,1800}/)),
      error: routeOptional(routeString(/[a-z_]{1,64}/))
    }),
    open: deepLinkRoute("/v1/open", {}),
    settings: deepLinkRoute("/v1/settings", {
      id: routeString({ oneOf: SETTINGS_DEEP_LINK_ANCHOR_IDS })
    }),
    sidebar: deepLinkRoute("/v1/sidebar", {
      target: routeOptional(routeString({ oneOf: SIDEBAR_DEEP_LINK_TARGET_IDS })),
      automation: routeOptional(routeString(AUTOMATION_ID_PATTERN)),
      agent: routeOptional(routeString(AGENT_ID_PATTERN)),
      tab: routeOptional(routeString({ oneOf: OVERVIEW_TAB_IDS }))
    })
  }
});
var GROK_BOT_DEEP_LINK_SCHEMES = sandDeepLinks.schemes;
var SAND_OPEN_DEEP_LINK_URL = sandDeepLinks.buildUrl("open");
var SAND_AGENT_SHARE_LINK_BASE = `${SAND_BOT_TEMPLATE_LINK.httpsOrigin}${SAND_BOT_TEMPLATE_LINK.httpsPathPrefixes[0]}`;
function buildSandSettingsDeepLinkUrl(anchor) {
  return sandDeepLinks.buildUrl("settings", { id: anchor });
}
function buildSandPluginDeepLinkUrl(pluginId) {
  try {
    return sandDeepLinks.buildUrl("plugin-add", { id: pluginId });
  } catch (error42) {
    if (error42 instanceof DeepLinkBuildError) return null;
    throw error42;
  }
}
function buildSandSidebarDeepLinkUrl(target, automationId) {
  try {
    return sandDeepLinks.buildUrl("sidebar", { target, automation: automationId });
  } catch (error42) {
    if (error42 instanceof DeepLinkBuildError) return null;
    throw error42;
  }
}
var TRANSCRIPT_DEEP_LINK_ROUTES = ["settings", "plugin-add", "sidebar"];
var TRANSCRIPT_DEEP_LINK_ROUTE_SET = new Set(TRANSCRIPT_DEEP_LINK_ROUTES);

