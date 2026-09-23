init_dist5();
var __awaiter35 = function(thisArg, _arguments, P2, generator) {
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
function structuredLoggerToMcpOAuthLifecycleLogger(args) {
  const { logger: logger110, ctx } = args;
  return {
    debug: (message, metadata) => logger110.debug(ctx, message, metadata),
    info: (message, metadata) => logger110.info(ctx, message, metadata),
    warn: (message, metadata) => logger110.warn(ctx, message, metadata),
    error: (message, error3, metadata) => logger110.error(ctx, message, error3, metadata)
  };
}
function createContextStructuredLifecycleLogger(ctx, logger110) {
  return structuredLoggerToMcpOAuthLifecycleLogger({ ctx, logger: logger110 });
}
var LoggedScopedMcpTokenStorage = class {
  constructor(options2) {
    this.options = options2;
    emitMcpOAuthLifecycleLog({
      logger: options2.logger,
      event: "mcp_oauth_provider_initialized",
      metadata: this.baseMetadata
    });
  }
  get baseMetadata() {
    return Object.assign({ identifier: this.options.identifier }, this.options.serverUrl ? { serverUrl: snapshotServerUrlForLog(this.options.serverUrl) } : {});
  }
  loadTokens() {
    return __awaiter35(this, void 0, void 0, function* () {
      const tokens = yield this.options.inner.loadTokens();
      emitMcpOAuthLifecycleLog({
        logger: this.options.logger,
        event: "mcp_oauth_tokens_loaded",
        level: "debug",
        metadata: Object.assign(Object.assign({}, this.baseMetadata), buildOAuthTokensSnapshotForLog(tokens))
      });
      return tokens;
    });
  }
  saveTokens(tokens) {
    return __awaiter35(this, void 0, void 0, function* () {
      yield this.options.inner.saveTokens(tokens);
      emitMcpOAuthLifecycleLog({
        logger: this.options.logger,
        event: "mcp_oauth_tokens_saved",
        metadata: Object.assign(Object.assign({}, this.baseMetadata), buildOAuthTokensSnapshotForLog(tokens, {
          expiresInIsFresh: true
        }))
      });
    });
  }
  prepareForRefresh() {
    return __awaiter35(this, void 0, void 0, function* () {
      var _a20, _b2;
      emitMcpOAuthLifecycleLog({
        logger: this.options.logger,
        event: "mcp_oauth_refresh_prepare",
        metadata: this.baseMetadata
      });
      yield (_b2 = (_a20 = this.options.inner).prepareForRefresh) === null || _b2 === void 0 ? void 0 : _b2.call(_a20);
    });
  }
  releaseRefreshLeaseOnError(underlyingError) {
    return __awaiter35(this, void 0, void 0, function* () {
      var _a20, _b2;
      emitMcpOAuthLifecycleLog({
        logger: this.options.logger,
        event: "mcp_oauth_refresh_error_release",
        level: "warn",
        error: underlyingError,
        metadata: Object.assign(Object.assign({}, this.baseMetadata), getMcpOAuthErrorLogMetadata(underlyingError))
      });
      yield (_b2 = (_a20 = this.options.inner).releaseRefreshLeaseOnError) === null || _b2 === void 0 ? void 0 : _b2.call(_a20, underlyingError);
    });
  }
  loadClientInformation() {
    return __awaiter35(this, void 0, void 0, function* () {
      const clientInformation = yield this.options.inner.loadClientInformation();
      emitMcpOAuthLifecycleLog({
        logger: this.options.logger,
        event: "mcp_oauth_client_info_loaded",
        level: "debug",
        metadata: Object.assign(Object.assign({}, this.baseMetadata), buildOAuthClientInformationSnapshotForLog(clientInformation))
      });
      return clientInformation;
    });
  }
  saveClientInformation(clientInfo) {
    return __awaiter35(this, void 0, void 0, function* () {
      yield this.options.inner.saveClientInformation(clientInfo);
      emitMcpOAuthLifecycleLog({
        logger: this.options.logger,
        event: "mcp_oauth_client_info_saved",
        metadata: Object.assign(Object.assign({}, this.baseMetadata), buildOAuthClientInformationSnapshotForLog(clientInfo))
      });
    });
  }
  invalidateCredentials(scope) {
    return __awaiter35(this, void 0, void 0, function* () {
      if (this.options.inner.invalidateCredentials === void 0) {
        return;
      }
      emitMcpOAuthLifecycleLog({
        logger: this.options.logger,
        event: "mcp_oauth_credentials_invalidated",
        level: "warn",
        metadata: Object.assign(Object.assign({}, this.baseMetadata), { scope })
      });
      yield this.options.inner.invalidateCredentials(scope);
    });
  }
  tokenEndpointAuth(args) {
    var _a20, _b2;
    return (_b2 = (_a20 = this.options.inner).tokenEndpointAuth) === null || _b2 === void 0 ? void 0 : _b2.call(_a20, args);
  }
};
var IdentifierScopedTokenStorage = class {
  constructor(storage, identifier) {
    this.storage = storage;
    this.identifier = identifier;
  }
  loadTokens() {
    return __awaiter35(this, void 0, void 0, function* () {
      return this.storage.loadTokens(this.identifier);
    });
  }
  saveTokens(tokens) {
    return __awaiter35(this, void 0, void 0, function* () {
      return this.storage.saveTokens(this.identifier, tokens);
    });
  }
  loadClientInformation() {
    return __awaiter35(this, void 0, void 0, function* () {
      return this.storage.loadClientInformation(this.identifier);
    });
  }
  saveClientInformation(clientInfo) {
    return __awaiter35(this, void 0, void 0, function* () {
      return this.storage.saveClientInformation(this.identifier, clientInfo);
    });
  }
};
var NoOpScopedTokenStorage = class {
  constructor(inner) {
    this.inner = inner;
  }
  loadTokens() {
    return __awaiter35(this, void 0, void 0, function* () {
      return void 0;
    });
  }
  loadClientInformation() {
    return __awaiter35(this, void 0, void 0, function* () {
      return void 0;
    });
  }
  saveTokens(tokens) {
    return __awaiter35(this, void 0, void 0, function* () {
      return this.inner.saveTokens(tokens);
    });
  }
  saveClientInformation(clientInfo) {
    return __awaiter35(this, void 0, void 0, function* () {
      return this.inner.saveClientInformation(clientInfo);
    });
  }
  invalidateCredentials(scope) {
    return __awaiter35(this, void 0, void 0, function* () {
      var _a20, _b2;
      yield (_b2 = (_a20 = this.inner).invalidateCredentials) === null || _b2 === void 0 ? void 0 : _b2.call(_a20, scope);
    });
  }
};
