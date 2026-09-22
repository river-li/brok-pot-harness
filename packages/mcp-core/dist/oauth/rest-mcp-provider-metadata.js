function resolveRestMcpProviderMetadataFromPrm(serverUrl_1) {
  return __awaiter64(this, arguments, void 0, function* (serverUrl, fetchImpl = fetch) {
    if (getRestMcpProviderIdForUrlPath(serverUrl) === void 0) {
      return void 0;
    }
    const url2 = new URL(serverUrl);
    const prmUrl = `${url2.origin}/.well-known/oauth-protected-resource${url2.pathname.replace(/\/+$/, "")}`;
    const cached2 = cache2.get(prmUrl);
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
    } catch (_a19) {
      return void 0;
    }
    cache2.set(prmUrl, {
      metadata,
      expiresAtMs: Date.now() + PRM_CACHE_TTL_MS
    });
    return metadata;
  });
}
function resolveMcpOAuthLoopbackRedirectUrl(args) {
  return __awaiter64(this, void 0, void 0, function* () {
    const metadata = yield resolveRestMcpProviderMetadataFromPrm(args.serverUrl, args.fetchImpl);
    return mcpOAuthLoopbackRedirectUrl({
      loopbackIpv4: metadata === null || metadata === void 0 ? void 0 : metadata.loopbackIpv4,
      redirectUrl: args.redirectUrl
    });
  });
}
var __awaiter64, PRM_CACHE_TTL_MS, cache2;
var init_rest_mcp_provider_metadata = __esm({
  "../packages/mcp-core/dist/oauth/rest-mcp-provider-metadata.js"() {
    "use strict";
    init_dist2();
    __awaiter64 = function(thisArg, _arguments, P2, generator) {
      function adopt(value) {
        return value instanceof P2 ? value : new P2(function(resolve29) {
          resolve29(value);
        });
      }
      return new (P2 || (P2 = Promise))(function(resolve29, reject2) {
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
          result.done ? resolve29(result.value) : adopt(result.value).then(fulfilled, rejected3);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    PRM_CACHE_TTL_MS = 5 * 60 * 1e3;
    cache2 = /* @__PURE__ */ new Map();
  }
});
