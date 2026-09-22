/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/node/mcp/mcp-catalog-cache.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var CATALOG_CACHE_TTL_MS = 30 * 1e3;
function isLoopbackHostname2(hostname3) {
  return hostname3 === "localhost" || hostname3 === "127.0.0.1";
}
function validateAuthorizationUrl(authUrl, serverUrl) {
  let parsed2;
  try {
    parsed2 = new URL(authUrl.trim());
  } catch {
    return void 0;
  }
  if (parsed2.protocol === "https:") {
    return parsed2.toString();
  }
  if (parsed2.protocol === "http:" && isLoopbackHostname2(parsed2.hostname)) {
    try {
      const server = serverUrl != null ? new URL(serverUrl) : void 0;
      if (server != null && isLoopbackHostname2(server.hostname)) {
        return parsed2.toString();
      }
    } catch {
    }
  }
  return void 0;
}

