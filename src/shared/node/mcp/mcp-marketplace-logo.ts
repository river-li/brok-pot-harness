/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/node/mcp/mcp-marketplace-logo.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
async function withLogoFetchSlot(run) {
  if (activeLogoFetches >= LOGO_FETCH_CONCURRENCY) {
    await new Promise((resolve29) => pendingLogoFetches.push(resolve29));
  }
  activeLogoFetches += 1;
  try {
    return await run();
  } finally {
    activeLogoFetches -= 1;
    pendingLogoFetches.shift()?.();
  }
}
async function resolvePluginLogo(url2) {
  if (logoCache.has(url2)) {
    return logoCache.get(url2) ?? null;
  }
  if (!isKnownPluginLogoUrl(url2)) {
    return null;
  }
  let parsed2;
  try {
    parsed2 = new URL(url2);
  } catch {
    logoCache.set(url2, null);
    return null;
  }
  if (parsed2.protocol !== "https:") {
    logoCache.set(url2, null);
    return null;
  }
  try {
    const dataUrl = await withLogoFetchSlot(async () => {
      const response = await MARKETPLACE_FETCH_DEADLINE.run(
        (signal) => fetch(parsed2.toString(), { signal })
      );
      return responseToImageDataUrl(response, LOGO_MAX_BYTES);
    });
    logoCache.set(url2, dataUrl);
    return dataUrl;
  } catch {
    logoCache.set(url2, null);
    return null;
  }
}
var LOGO_MAX_BYTES, LOGO_FETCH_CONCURRENCY, logoCache, activeLogoFetches, pendingLogoFetches, MARKETPLACE_FETCH_DEADLINE;
var init_mcp_marketplace_logo = __esm({
  "src/shared/node/mcp/mcp-marketplace-logo.ts"() {
    "use strict";
    init_scheduling();
    init_http_image();
    init_cursor_marketplace_client();
    init_cursor_marketplace_logo_registry();
    LOGO_MAX_BYTES = 512 * 1024;
    LOGO_FETCH_CONCURRENCY = 6;
    logoCache = /* @__PURE__ */ new Map();
    activeLogoFetches = 0;
    pendingLogoFetches = [];
    MARKETPLACE_FETCH_DEADLINE = createDeadlinePolicy({
      name: "mcp-marketplace-logo-fetch",
      timeoutMs: CURSOR_MARKETPLACE_REQUEST_TIMEOUT_MS
    });
  }
});

