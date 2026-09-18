function isMcpHttpRequestLike(value) {
  return typeof value === "object" && value !== null && "url" in value && typeof value.url === "string";
}
function resolveRequestUrl(input) {
  if (typeof input === "string") {
    return input;
  }
  if (input instanceof URL) {
    return input.toString();
  }
  return input.url;
}
function buildMergedHeaders(input, init) {
  const merged = new Headers(isMcpHttpRequestLike(input) ? input.headers : void 0);
  const extra = new Headers(init === null || init === void 0 ? void 0 : init.headers);
  extra.forEach((value, key) => {
    merged.set(key, value);
  });
  return merged;
}
function getHeaderNames(headers) {
  const names3 = [];
  headers.forEach((_value, key) => {
    names3.push(key);
  });
  return names3.sort();
}
function parseContentLength(value) {
  if (value === null) {
    return null;
  }
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? null : parsed;
}
function summarizeBody(body, headers) {
  var _a20, _b2, _c2, _d, _e2;
  if (body === void 0 || body === null) {
    return {
      kind: "none",
      bytes: 0,
      contentLength: parseContentLength(headers.get("content-length"))
    };
  }
  if (typeof body === "string") {
    const bodyBytes = new TextEncoder().encode(body).length;
    return {
      kind: "text",
      bytes: bodyBytes,
      contentLength: (_a20 = parseContentLength(headers.get("content-length"))) !== null && _a20 !== void 0 ? _a20 : bodyBytes
    };
  }
  if (body instanceof URLSearchParams) {
    const serialized = body.toString();
    const bodyBytes = new TextEncoder().encode(serialized).length;
    return {
      kind: "text",
      bytes: bodyBytes,
      contentLength: (_b2 = parseContentLength(headers.get("content-length"))) !== null && _b2 !== void 0 ? _b2 : bodyBytes
    };
  }
  if (body instanceof Blob) {
    return {
      kind: "blob",
      bytes: body.size,
      contentLength: (_c2 = parseContentLength(headers.get("content-length"))) !== null && _c2 !== void 0 ? _c2 : body.size
    };
  }
  if (body instanceof ArrayBuffer) {
    return {
      kind: "binary",
      bytes: body.byteLength,
      contentLength: (_d = parseContentLength(headers.get("content-length"))) !== null && _d !== void 0 ? _d : body.byteLength
    };
  }
  if (ArrayBuffer.isView(body)) {
    return {
      kind: "binary",
      bytes: body.byteLength,
      contentLength: (_e2 = parseContentLength(headers.get("content-length"))) !== null && _e2 !== void 0 ? _e2 : body.byteLength
    };
  }
  if (typeof body === "object" && body !== null) {
    if ("getReader" in body || Symbol.asyncIterator in body) {
      return {
        kind: "stream",
        bytes: null,
        contentLength: parseContentLength(headers.get("content-length"))
      };
    }
  }
  return {
    kind: "unknown",
    bytes: null,
    contentLength: parseContentLength(headers.get("content-length"))
  };
}
function extractFormValue(body, fieldName) {
  for (const pair of body.split("&")) {
    const separatorIndex = pair.indexOf("=");
    const rawKey = separatorIndex >= 0 ? pair.slice(0, separatorIndex) : pair;
    let key;
    try {
      key = decodeURIComponent(rawKey.replaceAll("+", " "));
    } catch (_a20) {
      return void 0;
    }
    if (key !== fieldName) {
      continue;
    }
    const rawValue = separatorIndex >= 0 ? pair.slice(separatorIndex + 1) : "";
    try {
      return decodeURIComponent(rawValue.replaceAll("+", " "));
    } catch (_b2) {
      return void 0;
    }
  }
  return void 0;
}
function sanitizeOAuthGrantTypeForLog(grantType) {
  switch (grantType) {
    case "authorization_code":
    case "refresh_token":
    case "client_credentials":
    case "urn:ietf:params:oauth:grant-type:jwt-bearer":
    case "urn:ietf:params:oauth:grant-type:token-exchange":
      return grantType;
    default:
      return "other";
  }
}
function extractOAuthGrantTypeForLog(contentType, body) {
  var _a20;
  if (contentType === null || !contentType.toLowerCase().startsWith("application/x-www-form-urlencoded")) {
    return void 0;
  }
  const grantType = typeof body === "string" ? extractFormValue(body, "grant_type") : body instanceof URLSearchParams ? (_a20 = body.get("grant_type")) !== null && _a20 !== void 0 ? _a20 : void 0 : void 0;
  return grantType ? sanitizeOAuthGrantTypeForLog(grantType) : void 0;
}
function buildMcpHttpRequestSnapshotForLog(args) {
  var _a20, _b2, _c2, _d;
  const { input, init } = args;
  const requestUrl = resolveRequestUrl(input);
  const urlSnapshot = snapshotUrlForLog(requestUrl);
  const headers = buildMergedHeaders(input, init);
  const headerNames = getHeaderNames(headers);
  const contentType = headers.get("content-type");
  const sessionIdHash = hashMcpOAuthValueForLog((_a20 = headers.get("mcp-session-id")) !== null && _a20 !== void 0 ? _a20 : void 0);
  const authorizationHeader = headers.get("authorization");
  const authorizationScheme = authorizationHeader ? (_b2 = authorizationHeader.split(/\s+/, 1)[0]) !== null && _b2 !== void 0 ? _b2 : null : null;
  return {
    method: ((_d = (_c2 = init === null || init === void 0 ? void 0 : init.method) !== null && _c2 !== void 0 ? _c2 : isMcpHttpRequestLike(input) ? input.method : void 0) !== null && _d !== void 0 ? _d : "GET").toUpperCase(),
    url: urlSnapshot,
    headers: { names: headerNames, count: headerNames.length },
    contentType,
    body: summarizeBody(init === null || init === void 0 ? void 0 : init.body, headers),
    sessionIdHash: sessionIdHash !== null && sessionIdHash !== void 0 ? sessionIdHash : null,
    authorizationScheme
  };
}
function buildMcpHttpResponseSnapshotForLog(response, errorSummary) {
  var _a20, _b2, _c2, _d, _e2;
  const headerNames = getHeaderNames(response.headers);
  const contentLength = parseContentLength(response.headers.get("content-length"));
  return {
    status: response.status,
    ok: response.ok,
    headers: { names: headerNames, count: headerNames.length },
    contentType: response.headers.get("content-type"),
    body: Object.assign({ kind: response.body === null ? "none" : "stream", bytes: response.body === null ? 0 : contentLength, contentLength }, errorSummary !== void 0 ? { errorSummary } : {}),
    sessionIdHash: (_b2 = hashMcpOAuthValueForLog((_a20 = response.headers.get("mcp-session-id")) !== null && _a20 !== void 0 ? _a20 : void 0)) !== null && _b2 !== void 0 ? _b2 : null,
    wwwAuthenticateHash: (_d = hashMcpOAuthValueForLog((_c2 = response.headers.get("www-authenticate")) !== null && _c2 !== void 0 ? _c2 : void 0)) !== null && _d !== void 0 ? _d : null,
    mcpProtocolVersion: (_e2 = response.headers.get("mcp-protocol-version")) !== null && _e2 !== void 0 ? _e2 : null
  };
}
function buildErrorSnapshotForLog(errorMeta) {
  const result = {};
  if (errorMeta.errorName !== void 0)
    result.name = errorMeta.errorName;
  if (errorMeta.errorMessage !== void 0)
    result.message = errorMeta.errorMessage;
  if (errorMeta.errorType !== void 0)
    result.type = errorMeta.errorType;
  if (errorMeta.oauthErrorCode !== void 0)
    result.oauthErrorCode = errorMeta.oauthErrorCode;
  if (errorMeta.errorResponseSummary !== void 0)
    result.responseSummary = errorMeta.errorResponseSummary;
  if (errorMeta.networkClassification !== void 0)
    result.networkClassification = errorMeta.networkClassification;
  if (errorMeta.sdkErrorKind !== void 0)
    result.sdkErrorKind = errorMeta.sdkErrorKind;
  return result;
}
function buildMcpHttpExchangeSuccessMetadata(args) {
  const { input, init, response, durationMs, metadata, responseErrorSummary, oauthTokenErrorBodySummary } = args;
  const request3 = buildMcpHttpRequestSnapshotForLog({ input, init });
  const oauthGrantType = extractOAuthGrantTypeForLog(request3.contentType, init === null || init === void 0 ? void 0 : init.body);
  return {
    event: "mcp_http_exchange",
    outcome: response.ok ? "success" : "http_error",
    durationMs,
    cursorMcp: {
      transport: Object.assign(Object.assign(Object.assign(Object.assign({}, metadata), { request: request3, response: buildMcpHttpResponseSnapshotForLog(response, responseErrorSummary) }), oauthGrantType !== void 0 ? { oauth: { grantType: oauthGrantType } } : {}), oauthTokenErrorBodySummary !== void 0 ? { oauthTokenErrorBodySummary } : {})
    }
  };
}
function isOAuthTokenEndpointRequest(input, init) {
  var _a20;
  var _b2;
  const request3 = buildMcpHttpRequestSnapshotForLog({ input, init });
  if (extractOAuthGrantTypeForLog(request3.contentType, init === null || init === void 0 ? void 0 : init.body) !== void 0) {
    return true;
  }
  const path30 = (_b2 = (_a20 = request3.url.path) === null || _a20 === void 0 ? void 0 : _a20.toLowerCase()) !== null && _b2 !== void 0 ? _b2 : "";
  return path30.endsWith("/token") || path30.includes("/oauth/token") || path30.includes("/connect/token");
}
function readClonedResponseTextUpToMax(response, maxBytes) {
  return __awaiter26(this, void 0, void 0, function* () {
    try {
      const text2 = yield response.clone().text();
      return text2.length > maxBytes ? text2.slice(0, maxBytes) : text2;
    } catch (_a20) {
      return void 0;
    }
  });
}
function summarizeResponseBodyForLog(args) {
  const path30 = snapshotUrlForLog(resolveRequestUrl(args.input)).path;
  if (!isMcpEndpointPath(path30)) {
    return sanitizeErrorMessageForLog(args.rawText, {
      maxLength: MAX_RESPONSE_ERROR_SUMMARY_LOG_BYTES
    });
  }
  try {
    const parsed = JSON.parse(args.rawText);
    return typeof parsed === "object" && parsed !== null ? summarizeMcpErrorBody(parsed) : void 0;
  } catch (_a20) {
    return void 0;
  }
}
function buildOAuthTokenEndpointErrorBodySummaryForLog(args) {
  return __awaiter26(this, void 0, void 0, function* () {
    if (!isOAuthTokenEndpointRequest(args.input, args.init)) {
      return void 0;
    }
    const rawText = yield readClonedResponseTextUpToMax(args.response, MAX_RESPONSE_ERROR_SUMMARY_LOG_BYTES);
    if (rawText === void 0) {
      return void 0;
    }
    try {
      return sanitizeStructuredValueForLog(JSON.parse(rawText));
    } catch (_a20) {
      return sanitizeErrorMessageForLog(rawText, {
        maxLength: MAX_RESPONSE_ERROR_SUMMARY_LOG_BYTES
      });
    }
  });
}
function readHttpExchangeErrorSummariesForLog(args) {
  return __awaiter26(this, void 0, void 0, function* () {
    const responseErrorSummary = yield readErrorResponseSummaryForLog(args.input, args.response);
    const oauthTokenErrorBodySummary = responseErrorSummary === void 0 ? yield buildOAuthTokenEndpointErrorBodySummaryForLog({
      input: args.input,
      response: args.response,
      init: args.init
    }) : void 0;
    return { responseErrorSummary, oauthTokenErrorBodySummary };
  });
}
function buildMcpHttpExchangeFailureMetadata(args) {
  var _a20;
  const { input, init, error: error3, durationMs, metadata, responseFromError, responseErrorSummary, oauthTokenErrorBodySummary } = args;
  const errorMetadata = getMcpOAuthErrorLogMetadata(error3);
  const request3 = buildMcpHttpRequestSnapshotForLog({ input, init });
  const oauthGrantType = extractOAuthGrantTypeForLog(request3.contentType, init === null || init === void 0 ? void 0 : init.body);
  const response = responseFromError !== void 0 ? buildMcpHttpResponseSnapshotForLog(responseFromError, responseErrorSummary) : {
    status: (_a20 = errorMetadata.httpStatus) !== null && _a20 !== void 0 ? _a20 : null,
    ok: null,
    headers: { names: [], count: 0 },
    contentType: null,
    body: Object.assign({ kind: "none", bytes: null, contentLength: null }, responseErrorSummary !== void 0 ? { errorSummary: responseErrorSummary } : {}),
    sessionIdHash: null,
    wwwAuthenticateHash: null,
    mcpProtocolVersion: null
  };
  return {
    event: "mcp_http_exchange",
    outcome: "error",
    durationMs,
    cursorMcp: {
      transport: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, metadata), {
        request: request3,
        response
      }), oauthGrantType !== void 0 ? { oauth: { grantType: oauthGrantType } } : {}), oauthTokenErrorBodySummary !== void 0 ? { oauthTokenErrorBodySummary } : {}), { error: buildErrorSnapshotForLog(errorMetadata) })
    }
  };
}
function logMcpHttpExchangeSuccess(args) {
  var _a20, _b2;
  const { logger: logger107, response } = args;
  const logMetadata = buildMcpHttpExchangeSuccessMetadata(args);
  if (response.ok) {
    (_a20 = logger107.info) === null || _a20 === void 0 ? void 0 : _a20.call(logger107, "MCP HTTP exchange completed", logMetadata);
  } else {
    (_b2 = logger107.warn) === null || _b2 === void 0 ? void 0 : _b2.call(logger107, "MCP HTTP exchange completed", logMetadata);
  }
}
function logMcpHttpExchangeFailure(args) {
  var _a20;
  const { logger: logger107 } = args;
  (_a20 = logger107.warn) === null || _a20 === void 0 ? void 0 : _a20.call(logger107, "MCP HTTP exchange failed", buildMcpHttpExchangeFailureMetadata(args));
}
function isMcpEndpointPath(path30) {
  return path30 === "/mcp" || (path30 === null || path30 === void 0 ? void 0 : path30.endsWith("/mcp")) === true;
}
function summarizeMcpErrorBody(parsed) {
  const error3 = parsed.error;
  if (typeof error3 === "string") {
    return JSON.stringify({ error: error3 });
  }
  if (typeof error3 !== "object" || error3 === null) {
    return void 0;
  }
  const errorRecord = error3;
  const code = typeof errorRecord.code === "number" || typeof errorRecord.code === "string" ? errorRecord.code : void 0;
  const message = typeof errorRecord.message === "string" ? sanitizeErrorMessageForLog(errorRecord.message, {
    maxLength: MAX_RESPONSE_ERROR_SUMMARY_LOG_BYTES
  }) : void 0;
  if (code === void 0 && message === void 0) {
    return void 0;
  }
  return JSON.stringify(Object.assign(Object.assign({}, code !== void 0 ? { code } : {}), message !== void 0 ? { message } : {}));
}
function readErrorResponseSummaryForLog(input, response) {
  return __awaiter26(this, void 0, void 0, function* () {
    var _a20;
    var _b2;
    try {
      if (response.ok) {
        return void 0;
      }
      const contentType = (_b2 = (_a20 = response.headers.get("content-type")) === null || _a20 === void 0 ? void 0 : _a20.toLowerCase()) !== null && _b2 !== void 0 ? _b2 : "";
      if (!contentType.includes("json") && !contentType.includes("text")) {
        return void 0;
      }
      const rawText = yield readClonedResponseTextUpToMax(response, MAX_RESPONSE_ERROR_SUMMARY_LOG_BYTES);
      if (rawText === void 0) {
        return void 0;
      }
      return summarizeResponseBodyForLog({
        input,
        rawText
      });
    } catch (_c2) {
      return void 0;
    }
  });
}
function safelyLogExchange(action, logger107, phase) {
  var _a20;
  try {
    action();
  } catch (_b2) {
    (_a20 = logger107.warn) === null || _a20 === void 0 ? void 0 : _a20.call(logger107, "MCP HTTP exchange logging failed", {
      event: "mcp_http_exchange_logging_failure",
      phase
    });
  }
}
function createLoggedMcpHttpFetch(options2) {
  const { fetch: fetch2, logger: logger107, metadata, logSuccessfulExchanges = true } = options2;
  return (input, init) => __awaiter26(this, void 0, void 0, function* () {
    const startedAtMs = Date.now();
    try {
      const response = yield fetch2(input, init);
      const { responseErrorSummary, oauthTokenErrorBodySummary } = response.ok ? {} : yield readHttpExchangeErrorSummariesForLog({
        input,
        init,
        response
      });
      if (logSuccessfulExchanges || !response.ok) {
        safelyLogExchange(() => {
          logMcpHttpExchangeSuccess({
            logger: logger107,
            input,
            init,
            response,
            durationMs: Date.now() - startedAtMs,
            metadata,
            responseErrorSummary,
            oauthTokenErrorBodySummary
          });
        }, logger107, "success");
      }
      return response;
    } catch (error3) {
      const responseFromError = extractResponseFromFetchError(error3);
      const { responseErrorSummary, oauthTokenErrorBodySummary } = responseFromError ? yield readHttpExchangeErrorSummariesForLog({
        input,
        init,
        response: responseFromError
      }) : {};
      safelyLogExchange(() => {
        logMcpHttpExchangeFailure({
          logger: logger107,
          input,
          init,
          error: error3,
          durationMs: Date.now() - startedAtMs,
          metadata,
          responseFromError,
          responseErrorSummary,
          oauthTokenErrorBodySummary
        });
      }, logger107, "failure");
      throw error3;
    }
  });
}
var __awaiter26, MAX_RESPONSE_ERROR_SUMMARY_LOG_BYTES;
var init_http_logging = __esm({
  "../packages/mcp-core/dist/http-logging.js"() {
    "use strict";
    init_log_metadata();
    init_oauth_logging();
    __awaiter26 = function(thisArg, _arguments, P2, generator) {
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
    MAX_RESPONSE_ERROR_SUMMARY_LOG_BYTES = 4096;
  }
});
