function splitRestMcpCursorAuthHeader(serverUrl, headers) {
  if (headers === void 0) {
    return {
      headers,
      cursorAuthHeaderValue: void 0,
      cursorAuthOrigin: void 0
    };
  }
  const entries = Object.entries(headers);
  const cursorAuthEntry = entries.find(([name17]) => name17.toLowerCase() === REST_MCP_CURSOR_AUTH_HEADER);
  if (cursorAuthEntry === void 0) {
    return {
      headers,
      cursorAuthHeaderValue: void 0,
      cursorAuthOrigin: void 0
    };
  }
  let origin;
  try {
    origin = new URL(serverUrl).origin;
  } catch (_a20) {
    origin = void 0;
  }
  return {
    headers: Object.fromEntries(entries.filter(([name17]) => name17.toLowerCase() !== REST_MCP_CURSOR_AUTH_HEADER)),
    cursorAuthHeaderValue: cursorAuthEntry[1],
    cursorAuthOrigin: origin
  };
}
function wrapFetchWithRestMcpCursorAuthHeader(supplier, allowedOrigin, baseFetch) {
  return (url2, init) => __awaiter29(this, void 0, void 0, function* () {
    let requestOrigin;
    try {
      requestOrigin = new URL(typeof url2 === "string" ? url2 : url2.toString()).origin;
    } catch (_a20) {
      return baseFetch(url2, init);
    }
    if (requestOrigin !== allowedOrigin) {
      return baseFetch(url2, init);
    }
    const cursorAuthHeaderValue = yield supplier();
    if (cursorAuthHeaderValue === void 0 || cursorAuthHeaderValue.length === 0) {
      return baseFetch(url2, init);
    }
    const requestHeaders = new Headers(init === null || init === void 0 ? void 0 : init.headers);
    requestHeaders.set(REST_MCP_CURSOR_AUTH_HEADER, cursorAuthHeaderValue);
    return baseFetch(url2, Object.assign(Object.assign({}, init), { headers: requestHeaders, redirect: "manual" }));
  });
}
var __awaiter29;
var init_rest_mcp_cursor_auth = __esm({
  "../packages/mcp-core/dist/transport/rest-mcp-cursor-auth.js"() {
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
  }
});
