/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/mcp-core/dist/oauth/rest-mcp-provider-metadata.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function resolveRestMcpProviderMetadataFromPrm(serverUrl_1) {
  return __awaiter29(this, arguments, void 0, function* (serverUrl, fetchImpl = fetch) {
    if (getRestMcpProviderIdForUrlPath(serverUrl) === void 0) {
      return void 0;
    }
    const url2 = new URL(serverUrl);
    const prmUrl = `${url2.origin}/.well-known/oauth-protected-resource${url2.pathname.replace(/\/+$/, "")}`;
    const cached2 = cache.get(prmUrl);
    if (cached2 !== void 0 && cached2.expiresAtMs > Date.now()) {
      return cached2.metadata;
    }
    let metadata;
    try {
      const response = yield fetchImpl(prmUrl);
      if (!response.ok) {
        return void 0;
      }
      metadata = parseRestMcpProviderMetadataFromPrm(yield response.json());
    } catch (_a20) {
      return void 0;
    }
    cache.set(prmUrl, {
      metadata,
      expiresAtMs: Date.now() + PRM_CACHE_TTL_MS
    });
    return metadata;
  });
}
var __awaiter29, PRM_CACHE_TTL_MS, cache;
var init_rest_mcp_provider_metadata = __esm({
  "../packages/mcp-core/dist/oauth/rest-mcp-provider-metadata.js"() {
    "use strict";
    init_dist2();
    __awaiter29 = function(thisArg, _arguments, P2, generator) {
      function adopt(value) {
        return value instanceof P2 ? value : new P2(function(resolve14) {
          resolve14(value);
        });
      }
      return new (P2 || (P2 = Promise))(function(resolve14, reject2) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject2(e);
          }
        }
        function rejected3(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject2(e);
          }
        }
        function step(result) {
          result.done ? resolve14(result.value) : adopt(result.value).then(fulfilled, rejected3);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    PRM_CACHE_TTL_MS = 5 * 60 * 1e3;
    cache = /* @__PURE__ */ new Map();
  }
});

