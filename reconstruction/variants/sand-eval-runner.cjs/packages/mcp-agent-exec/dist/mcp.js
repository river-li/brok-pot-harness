/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/mcp-agent-exec/dist/mcp.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/3
var import_node_child_process10 = require("node:child_process");
var import_node_crypto9 = require("node:crypto");
init_dist2();
init_dist();
init_dist5();
init_dist3();
init_auth2();

// @recovered-fragment 2/3
init_types5();

// @recovered-fragment 3/3
var __awaiter34 = function(thisArg, _arguments, P2, generator) {
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
var __addDisposableResource11 = function(env, value, async) {
  if (value !== null && value !== void 0) {
    if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
    var dispose, inner;
    if (async) {
      if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
      dispose = value[Symbol.asyncDispose];
    }
    if (dispose === void 0) {
      if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
      dispose = value[Symbol.dispose];
      if (async) inner = dispose;
    }
    if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
    if (inner) dispose = function() {
      try {
        inner.call(this);
      } catch (e) {
        return Promise.reject(e);
      }
    };
    env.stack.push({ value, dispose, async });
  } else if (async) {
    env.stack.push({ async: true });
  }
  return value;
};
var __disposeResources11 = /* @__PURE__ */ (function(SuppressedError2) {
  return function(env) {
    function fail(e) {
      env.error = env.hasError ? new SuppressedError2(e, env.error, "An error was suppressed during disposal.") : e;
      env.hasError = true;
    }
    var r, s3 = 0;
    function next() {
      while (r = env.stack.pop()) {
        try {
          if (!r.async && s3 === 1) return s3 = 0, env.stack.push(r), Promise.resolve().then(next);
          if (r.dispose) {
            var result = r.dispose.call(r.value);
            if (r.async) return s3 |= 2, Promise.resolve(result).then(next, function(e) {
              fail(e);
              return next();
            });
          } else s3 |= 1;
        } catch (e) {
          fail(e);
        }
      }
      if (s3 === 1) return env.hasError ? Promise.reject(env.error) : Promise.resolve();
      if (env.hasError) throw env.error;
    }
    return next();
  };
})(typeof SuppressedError === "function" ? SuppressedError : function(error3, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error3, e.suppressed = suppressed, e;
});
var COMMAND_MCP_CONNECT_TIMEOUT_MS = 6e4;
var OAUTH_GRANT_TYPES = ["authorization_code", "refresh_token"];
var OAUTH_RESPONSE_TYPES = ["code"];
function getMcpOAuthCallbackOwner(redirectUrl) {
  return { workspaceId: redirectUrl };
}
function encodeMcpOAuthState(identifier, owner, attemptId) {
  const payload = Object.assign({ id: identifier, owner }, attemptId ? { attemptId } : {});
  return Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
}
function buildStaticClientInformation(authConfig, redirectUrl) {
  if (!authConfig) {
    return void 0;
  }
  return Object.assign(Object.assign({ client_id: authConfig.CLIENT_ID }, authConfig.CLIENT_SECRET ? { client_secret: authConfig.CLIENT_SECRET } : {}), { redirect_uris: getCanonicalMcpOAuthRedirectUris(redirectUrl), grant_types: [...OAUTH_GRANT_TYPES], response_types: [...OAUTH_RESPONSE_TYPES], token_endpoint_auth_method: "none" });
}
function resolveClientInformation({ storedClientInformation, staticClientInformation }) {
  var _a20, _b2, _c2, _d;
  if (!staticClientInformation) {
    return storedClientInformation;
  }
  if (storedClientInformation && storedClientInformation.client_id === staticClientInformation.client_id) {
    return Object.assign(Object.assign(Object.assign({}, staticClientInformation), storedClientInformation), { client_secret: (_a20 = staticClientInformation.client_secret) !== null && _a20 !== void 0 ? _a20 : storedClientInformation.client_secret, redirect_uris: staticClientInformation.redirect_uris, grant_types: (_b2 = storedClientInformation.grant_types) !== null && _b2 !== void 0 ? _b2 : staticClientInformation.grant_types, response_types: (_c2 = storedClientInformation.response_types) !== null && _c2 !== void 0 ? _c2 : staticClientInformation.response_types, token_endpoint_auth_method: (_d = storedClientInformation.token_endpoint_auth_method) !== null && _d !== void 0 ? _d : staticClientInformation.token_endpoint_auth_method });
  }
  return staticClientInformation;
}
var InMemoryOAuthClientProvider = class {
  constructor(options2) {
    var _a20;
    this._identifier = options2.identifier;
    this._redirectUrl = options2.redirectUrl;
    this._serverUrl = options2.serverUrl;
    this._restMcpProviderMetadata = options2.restMcpProviderMetadata;
    if (((_a20 = options2.restMcpProviderMetadata) === null || _a20 === void 0 ? void 0 : _a20.omitResourceIndicator) === true) {
      this.validateResourceURL = () => __awaiter34(this, void 0, void 0, function* () {
        return void 0;
      });
    }
    this._clientMetadata = options2.clientMetadata;
    this._scopes = options2.scopes;
    this._tokens = options2.tokens;
    this._clientInformation = options2.clientInformation;
    this._saveTokens = options2.saveTokens;
    this._prepareForRefresh = options2.prepareForRefresh;
    this._releaseRefreshLeaseOnError = options2.releaseRefreshLeaseOnError;
    this._invalidateCredentials = options2.invalidateCredentials;
    this._saveClientInformation = options2.saveClientInformation;
    this.addClientAuthentication = options2.addClientAuthentication;
  }
  get redirectUrl() {
    return this._redirectUrl;
  }
  get clientMetadata() {
    return this._clientMetadata;
  }
  state() {
    this._oauthAttemptId = (0, import_node_crypto9.randomUUID)();
    this._oauthState = encodeMcpOAuthState(this._identifier, getMcpOAuthCallbackOwner(this._redirectUrl), this._oauthAttemptId);
    return this._oauthState;
  }
  clientInformation() {
    return this._clientInformation;
  }
  hasClientInformation() {
    return this._clientInformation !== void 0;
  }
  saveClientInformation(info2) {
    return __awaiter34(this, void 0, void 0, function* () {
      this._clientInformation = info2;
      yield this._saveClientInformation(info2);
    });
  }
  tokens() {
    return this._tokens;
  }
  saveTokens(tokens) {
    return __awaiter34(this, void 0, void 0, function* () {
      this._tokens = tokens;
      yield this._saveTokens(tokens);
    });
  }
  prepareForRefresh() {
    return __awaiter34(this, void 0, void 0, function* () {
      var _a20;
      yield (_a20 = this._prepareForRefresh) === null || _a20 === void 0 ? void 0 : _a20.call(this);
    });
  }
  releaseRefreshLeaseOnError(underlyingError) {
    return __awaiter34(this, void 0, void 0, function* () {
      var _a20;
      yield (_a20 = this._releaseRefreshLeaseOnError) === null || _a20 === void 0 ? void 0 : _a20.call(this, underlyingError);
    });
  }
  invalidateCredentials(scope) {
    return __awaiter34(this, void 0, void 0, function* () {
      var _a20;
      switch (scope) {
        case "tokens":
          this._tokens = void 0;
          break;
        case "client":
          this._clientInformation = void 0;
          break;
        case "verifier":
          this._codeVerifier = void 0;
          this._oauthState = void 0;
          this._oauthAttemptId = void 0;
          break;
        case "all":
          this._tokens = void 0;
          this._clientInformation = void 0;
          this._codeVerifier = void 0;
          this._oauthState = void 0;
          this._oauthAttemptId = void 0;
          this._lastRedirectUrl = void 0;
          break;
        default: {
          const _exhaustiveCheck = scope;
          return _exhaustiveCheck;
        }
      }
      yield (_a20 = this._invalidateCredentials) === null || _a20 === void 0 ? void 0 : _a20.call(this, scope);
    });
  }
  redirectToAuthorization(authorizationUrl) {
    var _a20, _b2;
    var _c2;
    applyConfiguredOAuthScopeOverride(authorizationUrl, this._scopes);
    if (this._serverUrl !== void 0) {
      applyMcpOAuthProviderAuthorizationParams(authorizationUrl, this._serverUrl);
    }
    for (const [key, value] of Object.entries((_c2 = (_a20 = this._restMcpProviderMetadata) === null || _a20 === void 0 ? void 0 : _a20.authorizationParams) !== null && _c2 !== void 0 ? _c2 : {})) {
      authorizationUrl.searchParams.set(key, value);
    }
    if (((_b2 = this._restMcpProviderMetadata) === null || _b2 === void 0 ? void 0 : _b2.omitConsentPrompt) === true) {
      authorizationUrl.searchParams.delete("prompt");
    }
    this._lastRedirectUrl = authorizationUrl;
  }
  get lastRedirectUrl() {
    return this._lastRedirectUrl;
  }
  saveCodeVerifier(codeVerifier) {
    return __awaiter34(this, void 0, void 0, function* () {
      this._codeVerifier = codeVerifier;
    });
  }
  codeVerifier() {
    if (!this._codeVerifier) {
      throw new Error("No code verifier saved");
    }
    return this._codeVerifier;
  }
};
function createInMemoryOAuthClientProvider(args) {
  return __awaiter34(this, void 0, void 0, function* () {
    var _a20, _b2;
    const { serverName, config: config2, tokenStorage } = args;
    const restMcpProviderMetadata = yield resolveRestMcpProviderMetadataFromPrm(config2.url, args.fetchImpl);
    const authRedirectUrl = mcpOAuthLoopbackRedirectUrl({
      loopbackIpv4: restMcpProviderMetadata === null || restMcpProviderMetadata === void 0 ? void 0 : restMcpProviderMetadata.loopbackIpv4,
      redirectUrl: args.authRedirectUrl
    });
    const staticClientInformation = buildStaticClientInformation(config2.auth, authRedirectUrl);
    const clientInformation = resolveClientInformation({
      storedClientInformation: yield tokenStorage.loadClientInformation(),
      staticClientInformation
    });
    return new InMemoryOAuthClientProvider({
      identifier: serverName,
      redirectUrl: authRedirectUrl,
      serverUrl: config2.url,
      restMcpProviderMetadata,
      clientMetadata: {
        redirect_uris: getCanonicalMcpOAuthRedirectUris(authRedirectUrl),
        token_endpoint_auth_method: "none",
        grant_types: [...OAUTH_GRANT_TYPES],
        response_types: [...OAUTH_RESPONSE_TYPES],
        client_name: "Cursor",
        logo_uri: MCP_OAUTH_CLIENT_LOGO_URI
      },
      scopes: (_a20 = config2.auth) === null || _a20 === void 0 ? void 0 : _a20.scopes,
      tokens: yield tokenStorage.loadTokens(),
      clientInformation,
      saveTokens: (newTokens) => tokenStorage.saveTokens(newTokens),
      prepareForRefresh: () => {
        var _a21;
        var _b3;
        return (_b3 = (_a21 = tokenStorage.prepareForRefresh) === null || _a21 === void 0 ? void 0 : _a21.call(tokenStorage)) !== null && _b3 !== void 0 ? _b3 : Promise.resolve();
      },
      releaseRefreshLeaseOnError: (underlyingError) => {
        var _a21;
        var _b3;
        return (_b3 = (_a21 = tokenStorage.releaseRefreshLeaseOnError) === null || _a21 === void 0 ? void 0 : _a21.call(tokenStorage, underlyingError)) !== null && _b3 !== void 0 ? _b3 : Promise.resolve();
      },
      invalidateCredentials: tokenStorage.invalidateCredentials ? (scope) => tokenStorage.invalidateCredentials(scope) : void 0,
      saveClientInformation: (clientInfo) => tokenStorage.saveClientInformation(clientInfo),
      // Fed the client information the provider starts with, so the assertion's
      // `iss` matches the `client_id` the SDK sends beside it.
      addClientAuthentication: (_b2 = tokenStorage.tokenEndpointAuth) === null || _b2 === void 0 ? void 0 : _b2.call(tokenStorage, {
        clientId: clientInformation === null || clientInformation === void 0 ? void 0 : clientInformation.client_id
      })
    });
  });
}
var liveStdioMcpChildPids = /* @__PURE__ */ new Set();
var stdioMcpKillOnExitInstalled = false;
function killRegisteredStdioMcpChildren() {
  for (const childPid of liveStdioMcpChildPids) {
    try {
      process.kill(childPid, "SIGKILL");
    } catch (_a20) {
    }
  }
}
function registerStdioMcpChildPid(pid) {
  liveStdioMcpChildPids.add(pid);
  if (stdioMcpKillOnExitInstalled) {
    return;
  }
  stdioMcpKillOnExitInstalled = true;
  process.on("exit", killRegisteredStdioMcpChildren);
}
function unregisterStdioMcpChildPid(pid) {
  liveStdioMcpChildPids.delete(pid);
}
function wrapDefaultStdioSpawnAsWorkload(base) {
  if (base !== void 0 || process.platform !== "linux") {
    return base;
  }
  return (command, args, opts) => spawnWorkload(import_node_child_process10.spawn, command, args, opts);
}
var McpSdkClient = class _McpSdkClient {
  constructor(serverName, client, options2) {
    this._callToolLock = Promise.resolve();
    this._stateEnteredAtMs = Date.now();
    this.serverName = serverName;
    this.client = client;
    this.tools = new AsyncCache();
    this.stateValue = options2.initialState;
    this._authProvider = options2.authProvider;
    this._authCodeExchange = options2.authCodeExchange;
    this._sessionId = options2.sessionId;
    this.config = options2.config;
    this._oauthLifecycleLogger = options2.oauthLifecycleLogger;
    this._stdioChildPid = options2.stdioChildPid;
    this.setupElicitationHandler();
  }
  _stateKindLabel(state) {
    return state.kind === "requires_authentication" ? "needsAuth" : state.kind;
  }
  _logStateTransition(from2, to3, cause, errorMeta) {
    if (!this._oauthLifecycleLogger) {
      return;
    }
    const fromKind = this._stateKindLabel(from2);
    const toKind = this._stateKindLabel(to3);
    if (fromKind === toKind) {
      return;
    }
    const previousStateDurationMs = Date.now() - this._stateEnteredAtMs;
    const serverUrlHost = (() => {
      try {
        const url2 = this.config && "url" in this.config ? this.config.url : void 0;
        return url2 ? new URL(url2).host : void 0;
      } catch (_a20) {
        return void 0;
      }
    })();
    emitMcpOAuthLifecycleLog({
      logger: this._oauthLifecycleLogger,
      event: "mcp_oauth_state_transition",
      metadata: Object.assign({
        identifier: this.serverName,
        from: fromKind,
        to: toKind,
        cause,
        serverUrlHost,
        previousStateDurationMs
      }, errorMeta)
    });
  }
  static createClient() {
    return new Client({
      name: "Cursor",
      version: "1.0.0"
    }, {
      capabilities: {
        elicitation: { form: {} }
      }
    });
  }
  setupElicitationHandler() {
    this.client.setRequestHandler(ElicitRequestSchema, (request3) => __awaiter34(this, void 0, void 0, function* () {
      if (!this._currentElicitationProvider) {
        return {
          action: "decline"
        };
      }
      if (!("requestedSchema" in request3.params)) {
        return {
          action: "decline"
        };
      }
      try {
        const response = yield this._currentElicitationProvider.elicit({
          message: request3.params.message,
          requestedSchema: request3.params.requestedSchema
        });
        return {
          action: response.action,
          content: response.content
        };
      } catch (_error) {
        return {
          action: "decline"
        };
      }
    }));
  }
  static fromStreamableHttp(serverName, config2, tokenStorage, headers, authRedirectUrl, fetch2, httpExchangeLogging, oauthLifecycleLogger) {
    return __awaiter34(this, void 0, void 0, function* () {
      const url2 = new URL(config2.url);
      authRedirectUrl = authRedirectUrl !== null && authRedirectUrl !== void 0 ? authRedirectUrl : MCP_OAUTH_LOOPBACK_CALLBACK_URL;
      const tokens = yield tokenStorage.loadTokens();
      const oauthProvider = yield createInMemoryOAuthClientProvider({
        serverName,
        config: config2,
        tokenStorage,
        authRedirectUrl,
        fetchImpl: fetch2
      });
      const cursorAuthSplit = splitRestMcpCursorAuthHeader(config2.url, headers);
      const transportHeaders = cursorAuthSplit.headers;
      const rawFetch = fetch2 !== null && fetch2 !== void 0 ? fetch2 : globalThis.fetch ? globalThis.fetch.bind(globalThis) : void 0;
      const baseFetch = cursorAuthSplit.cursorAuthHeaderValue !== void 0 && cursorAuthSplit.cursorAuthOrigin !== void 0 && rawFetch !== void 0 ? wrapFetchWithRestMcpCursorAuthHeader(() => cursorAuthSplit.cursorAuthHeaderValue, cursorAuthSplit.cursorAuthOrigin, rawFetch) : rawFetch;
      const buildLoggedFetch = (transportType) => {
        if (baseFetch === void 0 || httpExchangeLogging === void 0) {
          return baseFetch;
        }
        return createLoggedMcpHttpFetch({
          fetch: baseFetch,
          logger: httpExchangeLogging.logger,
          metadata: Object.assign(Object.assign({}, httpExchangeLogging.metadata), { transportType })
        });
      };
      const createSseTransport = () => new SSEClientTransport(url2, {
        authProvider: oauthProvider,
        requestInit: {
          headers: Object.assign({ "User-Agent": "Cursor/1.0.0" }, transportHeaders !== null && transportHeaders !== void 0 ? transportHeaders : {})
        },
        fetch: buildLoggedFetch("sse")
      });
      const client = _McpSdkClient.createClient();
      const isConnectAuthFailure = (error3) => error3 instanceof UnauthorizedError || isOAuthCredentialRejectionError(error3);
      const exchangeAuthorizationCode = (code) => __awaiter34(this, void 0, void 0, function* () {
        if (!oauthProvider.hasClientInformation()) {
          throw new Error("OAuth client registration has not completed. The MCP server may not support dynamic client registration or the registration failed.");
        }
        yield auth(oauthProvider, Object.assign({ serverUrl: url2.toString(), authorizationCode: code }, baseFetch !== void 0 ? { fetchFn: baseFetch } : {}));
        if (oauthLifecycleLogger) {
          emitMcpOAuthLifecycleLog({
            logger: oauthLifecycleLogger,
            event: "mcp_oauth_callback_completion",
            metadata: Object.assign(Object.assign({ identifier: serverName }, snapshotServerUrlForLog(url2.toString())), buildOAuthTokensSnapshotForLog(oauthProvider.tokens(), {
              expiresInIsFresh: true
            }))
          });
        }
      });
      const createRequiresAuthenticationClient = (sessionId) => {
        var _a20, _b2;
        var _c2;
        const authUrl = (_c2 = (_b2 = (_a20 = oauthProvider.lastRedirectUrl) === null || _a20 === void 0 ? void 0 : _a20.toString) === null || _b2 === void 0 ? void 0 : _b2.call(_a20)) !== null && _c2 !== void 0 ? _c2 : "";
        const mcpClient = new _McpSdkClient(serverName, client, {
          oauthLifecycleLogger,
          initialState: {
            kind: "requires_authentication",
            url: authUrl,
            callback: (code) => __awaiter34(this, void 0, void 0, function* () {
              try {
                yield exchangeAuthorizationCode(code);
                mcpClient.updateState({ kind: "ready" });
              } catch (authError) {
                const errorMessage4 = authError instanceof Error ? authError.message : "Authentication failed";
                throw new Error(`Authentication callback failed: ${errorMessage4}`);
              }
            })
          },
          authProvider: oauthProvider,
          authCodeExchange: exchangeAuthorizationCode,
          sessionId,
          config: config2
        });
        return mcpClient;
      };
      const connectSse = () => __awaiter34(this, void 0, void 0, function* () {
        const sseTransport = createSseTransport();
        try {
          yield client.connect(sseTransport);
          return new _McpSdkClient(serverName, client, {
            initialState: { kind: "ready" },
            authProvider: oauthProvider,
            authCodeExchange: exchangeAuthorizationCode,
            config: config2,
            oauthLifecycleLogger
          });
        } catch (sseError) {
          if (isConnectAuthFailure(sseError)) {
            if (oauthLifecycleLogger) {
              emitMcpOAuthLifecycleLog({
                logger: oauthLifecycleLogger,
                event: "mcp_oauth_state_transition",
                metadata: Object.assign(Object.assign({ identifier: serverName, from: "connecting", to: "needsAuth", cause: "connect_auth_error", transport: "sse", refreshTokenPresent: Boolean(tokens === null || tokens === void 0 ? void 0 : tokens.refresh_token) }, snapshotServerUrlForLog(url2.toString())), getMcpOAuthErrorLogMetadata(sseError))
              });
            }
            return createRequiresAuthenticationClient();
          }
          throw sseError;
        }
      });
      if (config2.type === "sse") {
        return connectSse();
      }
      const transport = new StreamableHTTPClientTransport(url2, {
        authProvider: oauthProvider,
        requestInit: {
          headers: Object.assign({ "User-Agent": "Cursor/1.0.0" }, transportHeaders !== null && transportHeaders !== void 0 ? transportHeaders : {})
        },
        fetch: buildLoggedFetch("streamableHttp")
      });
      try {
        yield client.connect(transport);
        return new _McpSdkClient(serverName, client, {
          initialState: { kind: "ready" },
          authProvider: oauthProvider,
          authCodeExchange: exchangeAuthorizationCode,
          sessionId: transport.sessionId,
          config: config2,
          oauthLifecycleLogger
        });
      } catch (error3) {
        if (isConnectAuthFailure(error3)) {
          if (oauthLifecycleLogger) {
            emitMcpOAuthLifecycleLog({
              logger: oauthLifecycleLogger,
              event: "mcp_oauth_state_transition",
              metadata: Object.assign(Object.assign({ identifier: serverName, from: "connecting", to: "needsAuth", cause: "connect_auth_error", transport: "streamableHttp", refreshTokenPresent: Boolean(tokens === null || tokens === void 0 ? void 0 : tokens.refresh_token) }, snapshotServerUrlForLog(url2.toString())), getMcpOAuthErrorLogMetadata(error3))
            });
          }
          return createRequiresAuthenticationClient(transport.sessionId);
        }
        if (isSseFallbackAppropriate(error3)) {
          return connectSse();
        }
        throw error3;
      }
    });
  }
  /**
   * Resume a cached MCP session while keeping the normal OAuth provider wired.
   * On 404 (session expired), caller should fall back to fromStreamableHttp.
   */
  static fromCachedSession(serverName_1, config_1, cachedSession_1, tokenStorage_1, headers_1) {
    return __awaiter34(this, arguments, void 0, function* (serverName, config2, cachedSession, tokenStorage, headers, authRedirectUrl = MCP_OAUTH_LOOPBACK_CALLBACK_URL, fetch2, httpExchangeLogging, oauthLifecycleLogger) {
      const url2 = new URL(config2.url);
      const oauthProvider = yield createInMemoryOAuthClientProvider({
        serverName,
        config: config2,
        tokenStorage,
        authRedirectUrl,
        fetchImpl: fetch2
      });
      const cursorAuthSplit = splitRestMcpCursorAuthHeader(config2.url, headers);
      const transportHeaders = cursorAuthSplit.headers;
      const rawFetch = fetch2 !== null && fetch2 !== void 0 ? fetch2 : globalThis.fetch ? globalThis.fetch.bind(globalThis) : void 0;
      const baseFetch = cursorAuthSplit.cursorAuthHeaderValue !== void 0 && cursorAuthSplit.cursorAuthOrigin !== void 0 && rawFetch !== void 0 ? wrapFetchWithRestMcpCursorAuthHeader(() => cursorAuthSplit.cursorAuthHeaderValue, cursorAuthSplit.cursorAuthOrigin, rawFetch) : rawFetch;
      const transport = new StreamableHTTPClientTransport(url2, {
        authProvider: oauthProvider,
        sessionId: cachedSession.sessionId,
        requestInit: {
          headers: Object.assign({ "User-Agent": "Cursor/1.0.0" }, transportHeaders !== null && transportHeaders !== void 0 ? transportHeaders : {})
        },
        fetch: baseFetch !== void 0 && httpExchangeLogging !== void 0 ? createLoggedMcpHttpFetch({
          fetch: baseFetch,
          logger: httpExchangeLogging.logger,
          metadata: Object.assign(Object.assign({}, httpExchangeLogging.metadata), { transportType: "streamableHttp" })
        }) : baseFetch
      });
      const client = _McpSdkClient.createClient();
      yield client.connect(transport);
      return new _McpSdkClient(serverName, client, {
        initialState: { kind: "ready" },
        authProvider: oauthProvider,
        sessionId: transport.sessionId,
        config: config2,
        oauthLifecycleLogger
      });
    });
  }
  get sessionId() {
    return this._sessionId;
  }
  static fromCommand(ctx, serverName, config2, env, options2) {
    return __awaiter34(this, void 0, void 0, function* () {
      var _a20, _b2, _c2;
      const env_1 = { stack: [], error: void 0, hasError: false };
      try {
        const _span = __addDisposableResource11(env_1, createSpan(ctx.withName("McpSdkClient.fromCommand")), false);
        const spawnFn = wrapDefaultStdioSpawnAsWorkload(options2 === null || options2 === void 0 ? void 0 : options2.spawn);
        const transport = new StdioClientTransport(Object.assign({ command: config2.command, args: (_a20 = config2.args) !== null && _a20 !== void 0 ? _a20 : [], env, cwd: config2.cwd, stderr: "pipe" }, spawnFn && { spawn: spawnFn }));
        const stderrCapture = captureStdioStderr(transport.stderr);
        const client = _McpSdkClient.createClient();
        const connection = client.connect(transport);
        const connectTimeoutMs = (_b2 = options2 === null || options2 === void 0 ? void 0 : options2.connectTimeoutMs) !== null && _b2 !== void 0 ? _b2 : COMMAND_MCP_CONNECT_TIMEOUT_MS;
        let timeoutHandle;
        const timeout2 = new Promise((_resolve, reject2) => {
          timeoutHandle = setTimeout(() => reject2(new Error(`MCP server connection timed out after ${connectTimeoutMs}ms: ${serverName}`)), connectTimeoutMs);
        });
        try {
          yield Promise.race([connection, timeout2]);
        } catch (error3) {
          connection.catch(() => {
          });
          yield transport.close().catch(() => {
          });
          yield stderrCapture.waitForFlush();
          throw annotateMcpStdioConnectError(error3, stderrCapture.read());
        } finally {
          if (timeoutHandle !== void 0) {
            clearTimeout(timeoutHandle);
          }
        }
        const stdioChildPid = (_c2 = transport.pid) !== null && _c2 !== void 0 ? _c2 : void 0;
        if (typeof stdioChildPid === "number") {
          registerStdioMcpChildPid(stdioChildPid);
        }
        return new _McpSdkClient(serverName, client, {
          initialState: { kind: "ready" },
          config: config2,
          stdioChildPid
        });
      } catch (e_1) {
        env_1.error = e_1;
        env_1.hasError = true;
      } finally {
        __disposeResources11(env_1);
      }
    });
  }
  close() {
    return __awaiter34(this, void 0, void 0, function* () {
      if (this._stdioChildPid !== void 0) {
        unregisterStdioMcpChildPid(this._stdioChildPid);
      }
      yield this.client.close();
    });
  }
  getTools(ctx) {
    return __awaiter34(this, void 0, void 0, function* () {
      var _a20, _b2;
      var _c2;
      const env_2 = { stack: [], error: void 0, hasError: false };
      try {
        const _span = __addDisposableResource11(env_2, createSpan(ctx.withName("McpSdkClient.getTools")), false);
        if (this.stateValue.kind === "requires_authentication") {
          return [];
        }
        try {
          return yield this.tools.get(() => __awaiter34(this, void 0, void 0, function* () {
            const tools = yield collectPaginatedMcpList({
              fetchPage: (cursor) => this.client.listTools({ cursor }),
              itemsOf: (page) => page.tools,
              nextCursorOf: (page) => page.nextCursor
            });
            return tools.map((tool) => Object.assign(Object.assign({}, tool), { inputSchema: tool.inputSchema, outputSchema: tool.outputSchema }));
          }));
        } catch (error3) {
          if (error3 instanceof UnauthorizedError && this.stateValue.kind === "ready") {
            const previousState = this.stateValue;
            const redirectUrl = (_c2 = (_b2 = (_a20 = this._authProvider) === null || _a20 === void 0 ? void 0 : _a20.lastRedirectUrl) === null || _b2 === void 0 ? void 0 : _b2.toString()) !== null && _c2 !== void 0 ? _c2 : "";
            this.stateValue = {
              kind: "requires_authentication",
              url: redirectUrl,
              callback: (code) => this.completeRuntimeAuthorization(code)
            };
            this._logStateTransition(previousState, this.stateValue, "runtime_unauthorized", Object.assign({}, getMcpOAuthErrorLogMetadata(error3)));
            this._stateEnteredAtMs = Date.now();
          }
          throw error3;
        }
      } catch (e_2) {
        env_2.error = e_2;
        env_2.hasError = true;
      } finally {
        __disposeResources11(env_2);
      }
    });
  }
  callTool(ctx, name17, args, toolCallId, elicitationProvider) {
    return __awaiter34(this, void 0, void 0, function* () {
      var _a20, _b2;
      var _c2;
      const env_3 = { stack: [], error: void 0, hasError: false };
      try {
        const span = __addDisposableResource11(env_3, createSpan(ctx.withName("McpSdkClient.callTool")), false);
        span.span.setAttribute("toolName", name17);
        const previousLock = this._callToolLock;
        let releaseLock;
        this._callToolLock = new Promise((resolve14) => {
          releaseLock = resolve14;
        });
        try {
          yield previousLock;
          if (this.stateValue.kind === "requires_authentication") {
            throw new UnauthorizedError(`MCP server "${this.serverName}" requires authentication`);
          }
          this._currentToolCallId = toolCallId;
          this._currentToolName = name17;
          this._currentElicitationProvider = elicitationProvider;
          try {
            const response = yield this.client.callTool({
              name: name17,
              arguments: args
            });
            return {
              content: response.content,
              isError: response.isError === true
            };
          } catch (error3) {
            if (error3 instanceof UnauthorizedError && this.stateValue.kind === "ready") {
              const previousState = this.stateValue;
              const redirectUrl = (_c2 = (_b2 = (_a20 = this._authProvider) === null || _a20 === void 0 ? void 0 : _a20.lastRedirectUrl) === null || _b2 === void 0 ? void 0 : _b2.toString()) !== null && _c2 !== void 0 ? _c2 : "";
              this.stateValue = {
                kind: "requires_authentication",
                url: redirectUrl,
                callback: (code) => this.completeRuntimeAuthorization(code)
              };
              this._logStateTransition(previousState, this.stateValue, "runtime_unauthorized", Object.assign({}, getMcpOAuthErrorLogMetadata(error3)));
              this._stateEnteredAtMs = Date.now();
            }
            throw error3;
          } finally {
            this._currentElicitationProvider = void 0;
            this._currentToolCallId = void 0;
            this._currentToolName = void 0;
          }
        } finally {
          releaseLock();
        }
      } catch (e_3) {
        env_3.error = e_3;
        env_3.hasError = true;
      } finally {
        __disposeResources11(env_3);
      }
    });
  }
  getInstructions(ctx) {
    return __awaiter34(this, void 0, void 0, function* () {
      const env_4 = { stack: [], error: void 0, hasError: false };
      try {
        const _span = __addDisposableResource11(env_4, createSpan(ctx.withName("McpSdkClient.getInstructions")), false);
        if (this.stateValue.kind === "requires_authentication") {
          return void 0;
        }
        return yield this.client.getInstructions();
      } catch (e_4) {
        env_4.error = e_4;
        env_4.hasError = true;
      } finally {
        __disposeResources11(env_4);
      }
    });
  }
  listResources(ctx) {
    return __awaiter34(this, void 0, void 0, function* () {
      const env_5 = { stack: [], error: void 0, hasError: false };
      try {
        const _span = __addDisposableResource11(env_5, createSpan(ctx.withName("McpSdkClient.listResources")), false);
        if (this.stateValue.kind === "requires_authentication") {
          return { resources: [] };
        }
        const capabilities = this.client.getServerCapabilities();
        if (!(capabilities === null || capabilities === void 0 ? void 0 : capabilities.resources)) {
          return { resources: [] };
        }
        const resources = yield collectPaginatedMcpList({
          fetchPage: (cursor) => this.client.listResources({ cursor }),
          itemsOf: (page) => page.resources,
          nextCursorOf: (page) => page.nextCursor
        });
        return { resources };
      } catch (e_5) {
        env_5.error = e_5;
        env_5.hasError = true;
      } finally {
        __disposeResources11(env_5);
      }
    });
  }
  readResource(ctx, args) {
    return __awaiter34(this, void 0, void 0, function* () {
      const env_6 = { stack: [], error: void 0, hasError: false };
      try {
        const _span = __addDisposableResource11(env_6, createSpan(ctx.withName("McpSdkClient.readResource")), false);
        if (this.stateValue.kind === "requires_authentication") {
          return { contents: [] };
        }
        const response = yield this.client.readResource({ uri: args.uri });
        return { contents: response.contents };
      } catch (e_6) {
        env_6.error = e_6;
        env_6.hasError = true;
      } finally {
        __disposeResources11(env_6);
      }
    });
  }
  listPrompts(ctx) {
    return __awaiter34(this, void 0, void 0, function* () {
      var _a20;
      const env_7 = { stack: [], error: void 0, hasError: false };
      try {
        const _span = __addDisposableResource11(env_7, createSpan(ctx.withName("McpSdkClient.listPrompts")), false);
        if (this.stateValue.kind === "requires_authentication") {
          return [];
        }
        const capabilities = (_a20 = this.client.getServerCapabilities()) !== null && _a20 !== void 0 ? _a20 : {
          prompts: false
        };
        if (!capabilities.prompts) {
          return [];
        }
        const prompts = yield collectPaginatedMcpList({
          fetchPage: (cursor) => this.client.listPrompts({ cursor }),
          itemsOf: (page) => page.prompts,
          nextCursorOf: (page) => page.nextCursor
        });
        return prompts.map((prompt) => {
          var _a21;
          return {
            name: prompt.name,
            description: prompt.description,
            arguments: (_a21 = prompt.arguments) === null || _a21 === void 0 ? void 0 : _a21.map((arg) => ({
              name: arg.name,
              description: arg.description,
              required: arg.required
            }))
          };
        });
      } catch (e_7) {
        env_7.error = e_7;
        env_7.hasError = true;
      } finally {
        __disposeResources11(env_7);
      }
    });
  }
  getPrompt(ctx, name17, args) {
    return __awaiter34(this, void 0, void 0, function* () {
      const env_8 = { stack: [], error: void 0, hasError: false };
      try {
        const _span = __addDisposableResource11(env_8, createSpan(ctx.withName("McpSdkClient.getPrompt")), false);
        if (this.stateValue.kind === "requires_authentication") {
          return { messages: [] };
        }
        const response = yield this.client.getPrompt({
          name: name17,
          arguments: args
        });
        return {
          messages: response.messages.map((msg) => ({
            role: msg.role,
            content: Array.isArray(msg.content) ? msg.content.map((content) => {
              if (content.type === "text") {
                return {
                  type: "text",
                  text: content.text
                };
              }
              if (content.type === "image") {
                return {
                  type: "image",
                  data: content.data,
                  mimeType: content.mimeType
                };
              }
              return {
                type: "text",
                text: JSON.stringify(content)
              };
            }) : [
              {
                type: "text",
                text: typeof msg.content === "string" ? msg.content : JSON.stringify(msg.content)
              }
            ]
          }))
        };
      } catch (e_8) {
        env_8.error = e_8;
        env_8.hasError = true;
      } finally {
        __disposeResources11(env_8);
      }
    });
  }
  /**
   * Get the current tool call context for debugging.
   * This shows which tool is currently being executed and can be used to correlate
   * elicitation requests with their corresponding tool calls.
   * @returns Object with current tool name and toolCallId, or undefined if no tool is executing
   */
  getCurrentToolCallContext() {
    if (this._currentToolName) {
      return {
        toolName: this._currentToolName,
        toolCallId: this._currentToolCallId
      };
    }
    return void 0;
  }
  // Observable state API
  getState(_ctx) {
    return __awaiter34(this, void 0, void 0, function* () {
      return this.stateValue;
    });
  }
  /**
   * Finishes a login that started from a runtime 401 (see the
   * `requires_authentication` transitions in getTools/callTool). Without the
   * exchange hook there is nothing to redeem the code with, so the callback
   * stays a no-op and the caller's reconnect will 401 again.
   */
  completeRuntimeAuthorization(code) {
    return __awaiter34(this, void 0, void 0, function* () {
      if (!this._authCodeExchange) {
        throw new Error(`MCP server "${this.serverName}" cannot complete authorization: no code exchange is configured for this client.`);
      }
      try {
        yield this._authCodeExchange(code);
      } catch (authError) {
        const errorMessage4 = authError instanceof Error ? authError.message : "Authentication failed";
        throw new Error(`Authentication callback failed: ${errorMessage4}`);
      }
      this.updateState({ kind: "ready" }, "runtime_authorization_completed");
    });
  }
  updateState(newState, cause) {
    const oldState = this.stateValue;
    this.stateValue = newState;
    this._logStateTransition(oldState, newState, cause !== null && cause !== void 0 ? cause : "explicit_update");
    this._stateEnteredAtMs = Date.now();
  }
};
var McpToolNotFoundError = class extends Error {
  constructor(toolName, availableTools) {
    super(`Tool ${toolName} not found, available tools: ${availableTools.join(", ")}`);
    this.toolName = toolName;
    this.availableTools = availableTools;
    this.name = "McpToolNotFoundError";
  }
};
function isMcpToolNotFoundError(error3) {
  if (error3 instanceof McpToolNotFoundError) {
    return true;
  }
  if (!(error3 instanceof Error) || error3.name !== "McpToolNotFoundError") {
    return false;
  }
  const candidate = error3;
  return typeof candidate.toolName === "string" && Array.isArray(candidate.availableTools);
}
var McpServerNotFoundError = class extends Error {
  constructor(serverName, availableServers) {
    super(`MCP server ${serverName} not found, available servers: ${availableServers.join(", ")}`);
    this.serverName = serverName;
    this.availableServers = availableServers;
    this.name = "McpServerNotFoundError";
  }
};
var ExecutableMcpToolSet = class {
  constructor(tools) {
    this.tools = tools;
  }
  execute(name17, args, toolCallId, elicitationFactory) {
    return __awaiter34(this, void 0, void 0, function* () {
      const tool = this.tools[name17];
      if (!tool) {
        throw new McpToolNotFoundError(name17, Object.keys(this.tools));
      }
      return tool.execute(args, toolCallId, elicitationFactory);
    });
  }
  getTools() {
    return Object.entries(this.tools).map(([name17, tool]) => Object.assign(Object.assign({}, tool.definition), { name: name17 }));
  }
};
var ManagerMcpLease = class {
  constructor(manager) {
    this.manager = manager;
  }
  getClients(_ctx) {
    return __awaiter34(this, void 0, void 0, function* () {
      return this.manager.getClients();
    });
  }
  getClient(_ctx, name17) {
    return __awaiter34(this, void 0, void 0, function* () {
      return this.manager.getClient(name17);
    });
  }
  getInstructions(ctx) {
    return __awaiter34(this, void 0, void 0, function* () {
      const env_10 = { stack: [], error: void 0, hasError: false };
      try {
        const span = __addDisposableResource11(env_10, createSpan(ctx.withName("ManagerMcpLease.getInstructions")), false);
        return yield this.manager.getInstructions(span.ctx);
      } catch (e_10) {
        env_10.error = e_10;
        env_10.hasError = true;
      } finally {
        __disposeResources11(env_10);
      }
    });
  }
  getToolSet(ctx) {
    return __awaiter34(this, void 0, void 0, function* () {
      const env_11 = { stack: [], error: void 0, hasError: false };
      try {
        const span = __addDisposableResource11(env_11, createSpan(ctx.withName("ManagerMcpLease.getToolSet")), false);
        return yield this.manager.getToolSet(span.ctx);
      } catch (e_11) {
        env_11.error = e_11;
        env_11.hasError = true;
      } finally {
        __disposeResources11(env_11);
      }
    });
  }
  getTools(ctx) {
    return __awaiter34(this, void 0, void 0, function* () {
      const env_12 = { stack: [], error: void 0, hasError: false };
      try {
        const span = __addDisposableResource11(env_12, createSpan(ctx.withName("ManagerMcpLease.getTools")), false);
        const toolSet = yield this.getToolSet(span.ctx);
        return toolSet.getTools();
      } catch (e_12) {
        env_12.error = e_12;
        env_12.hasError = true;
      } finally {
        __disposeResources11(env_12);
      }
    });
  }
  getToolsForServers(ctx, serverIdentifiers) {
    return __awaiter34(this, void 0, void 0, function* () {
      const requestedServerIds = new Set(serverIdentifiers);
      const allTools = yield this.getTools(ctx);
      return allTools.filter((tool) => requestedServerIds.has(tool.clientKey));
    });
  }
  onDidChange(listener) {
    const unsubscribe = this.manager.onDidChange(() => listener(void 0));
    return { dispose: unsubscribe };
  }
  /**
   * Apply a targeted selection change to the live manager: add the newly
   * selected servers and remove the deselected ones, without rebuilding every
   * other client. Mirrors the editor's MCPService transition handling.
   */
  reconcileSelection(ctx, changes, loadClient) {
    return __awaiter34(this, void 0, void 0, function* () {
      var _a20;
      for (const identifier of changes.removed) {
        const existing = this.manager.getClient(identifier);
        this.manager.deleteClient(identifier);
        try {
          yield (_a20 = existing === null || existing === void 0 ? void 0 : existing.close) === null || _a20 === void 0 ? void 0 : _a20.call(existing);
        } catch (_b2) {
        }
      }
      for (const identifier of changes.added) {
        if (this.manager.getClient(identifier)) {
          continue;
        }
        const client = yield loadClient(ctx, identifier);
        this.manager.setClient(identifier, client);
      }
    });
  }
};
var McpManager = class {
  constructor(clients, elicitationFactory) {
    this.clients = clients;
    this.elicitationFactory = elicitationFactory;
    this.changeListeners = /* @__PURE__ */ new Set();
  }
  /**
   * Register a listener that will be called when clients are added or removed.
   * Returns a function to unregister the listener.
   */
  onDidChange(listener) {
    this.changeListeners.add(listener);
    return () => {
      this.changeListeners.delete(listener);
    };
  }
  fireDidChange() {
    for (const listener of this.changeListeners) {
      try {
        listener();
      } catch (e) {
        console.error("Error in McpManager change listener:", e);
      }
    }
  }
  getClients() {
    return this.clients;
  }
  getClient(name17) {
    return this.clients[name17];
  }
  setClient(name17, client) {
    this.clients[name17] = client;
    this.fireDidChange();
  }
  deleteClient(name17) {
    delete this.clients[name17];
    this.fireDidChange();
  }
  /**
   * Close every MCP transport (stdio child processes, HTTP sessions, etc.).
   * Safe to call multiple times; failures from individual clients are ignored.
   */
  closeAllClients() {
    return __awaiter34(this, void 0, void 0, function* () {
      const clients = Object.values(this.clients);
      yield Promise.all(clients.map((client) => __awaiter34(this, void 0, void 0, function* () {
        var _a20;
        try {
          yield (_a20 = client.close) === null || _a20 === void 0 ? void 0 : _a20.call(client);
        } catch (_b2) {
        }
      })));
    });
  }
  getToolSet(ctx) {
    return __awaiter34(this, void 0, void 0, function* () {
      const env_13 = { stack: [], error: void 0, hasError: false };
      try {
        const span = __addDisposableResource11(env_13, createSpan(ctx.withName("McpManager.getToolSet")), false);
        const clientTools = yield asyncMapValues(Object.entries(this.clients), ([key, client]) => client.getTools(span.ctx).then((tools2) => tools2.map((tool) => Object.assign(Object.assign({}, tool), { clientKey: key, clientName: client.serverName, client }))).catch(() => []), { max: 4 });
        const tools = Array.from(clientTools.values()).flat();
        const toolsMap = {};
        for (const tool of tools) {
          toolsMap[`${tool.clientName}-${tool.name}`] = {
            definition: Object.assign(Object.assign({}, tool), { clientKey: tool.clientKey, providerIdentifier: tool.clientName, toolName: tool.name }),
            execute: (args, toolCallId, elicitationFactory) => __awaiter34(this, void 0, void 0, function* () {
              const elicitationProvider = elicitationFactory === null || elicitationFactory === void 0 ? void 0 : elicitationFactory.createProvider(tool.clientName, tool.name, toolCallId);
              const result = yield tool.client.callTool(span.ctx, tool.name, args, toolCallId, elicitationProvider);
              return result;
            })
          };
        }
        return new ExecutableMcpToolSet(toolsMap);
      } catch (e_13) {
        env_13.error = e_13;
        env_13.hasError = true;
      } finally {
        __disposeResources11(env_13);
      }
    });
  }
  getInstructions(ctx) {
    return __awaiter34(this, void 0, void 0, function* () {
      const env_14 = { stack: [], error: void 0, hasError: false };
      try {
        const span = __addDisposableResource11(env_14, createSpan(ctx.withName("McpManager.getInstructions")), false);
        const instructionResults = yield asyncMapValues(Object.entries(this.clients), ([_2, client]) => client.getInstructions(span.ctx).then((instructions) => {
          if (!instructions || instructions.trim().length === 0) {
            return null;
          }
          return new McpInstructions({
            serverName: client.serverName,
            instructions: instructions.trim()
          });
        }).catch(() => null), { max: 4 });
        return Array.from(instructionResults.values()).filter((result) => result !== null);
      } catch (e_14) {
        env_14.error = e_14;
        env_14.hasError = true;
      } finally {
        __disposeResources11(env_14);
      }
    });
  }
};

