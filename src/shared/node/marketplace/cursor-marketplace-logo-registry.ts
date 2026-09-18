function rememberPluginLogoUrl(url2) {
  knownLogoUrls.add(url2);
}
function isKnownPluginLogoUrl(url2) {
  return knownLogoUrls.has(url2);
}
var knownLogoUrls;
var init_cursor_marketplace_logo_registry = __esm({
  "src/shared/node/marketplace/cursor-marketplace-logo-registry.ts"() {
    "use strict";
    knownLogoUrls = /* @__PURE__ */ new Set();
  }
});
