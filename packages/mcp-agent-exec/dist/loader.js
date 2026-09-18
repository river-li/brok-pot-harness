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
var __addDisposableResource12 = function(env, value, async) {
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
var __disposeResources12 = /* @__PURE__ */ (function(SuppressedError2) {
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
var logger12 = createLogger("DefinitionMcpLoader");
function expandPath(args) {
  const { filePath, baseDir } = args;
  if (filePath === "~" || filePath.startsWith("~/")) {
    return import_node_path28.default.join(import_node_os9.default.homedir(), filePath.slice(1));
  }
  if (filePath.startsWith("./") || filePath === ".") {
    return import_node_path28.default.resolve(baseDir !== null && baseDir !== void 0 ? baseDir : process.cwd(), filePath);
  }
  return filePath;
}
function isMcpNetworkControlsConfigService(middleware) {
  return typeof middleware.getMcpNetworkControlsConfig === "function";
}
function getMcpNetworkControlsServerIdentity(server) {
  var _a20;
  if ("url" in server) {
    return { url: server.url };
  }
  return {
    command: [server.command, ...(_a20 = server.args) !== null && _a20 !== void 0 ? _a20 : []].join(" ")
  };
}
function countMcpSandboxLogList(values) {
  var _a20;
  return (_a20 = values === null || values === void 0 ? void 0 : values.length) !== null && _a20 !== void 0 ? _a20 : 0;
}
function computeMcpSandboxPolicyHash(config2) {
  if (config2 === void 0) {
    return void 0;
  }
  return (0, import_node_crypto10.createHash)("sha256").update(computeMcpSandboxPolicyFingerprint(config2)).digest("hex");
}
function getMcpSandboxLogMessage(args) {
  var _a20, _b2, _c2, _d, _e2;
  var _f, _g;
  return `Sandboxing local MCP server "${args.serverName}" with network controls: networkControlsEnabled=${String(((_a20 = args.networkControlsConfig) === null || _a20 === void 0 ? void 0 : _a20.enabled) === true)}, mcpNetworkMode=${(_f = (_b2 = args.networkControlsConfig) === null || _b2 === void 0 ? void 0 : _b2.mcpNetworkMode) !== null && _f !== void 0 ? _f : "unset"}, mcpNetworkAllowlistCount=${countMcpSandboxLogList((_c2 = args.networkControlsConfig) === null || _c2 === void 0 ? void 0 : _c2.mcpNetworkAllowlist)}, mcpNetworkDenylistCount=${countMcpSandboxLogList((_d = args.networkControlsConfig) === null || _d === void 0 ? void 0 : _d.mcpNetworkDenylist)}, localAgentNetworkAllowlistCount=${countMcpSandboxLogList((_e2 = args.networkControlsConfig) === null || _e2 === void 0 ? void 0 : _e2.localAgentNetworkAllowlist)}, sandboxPolicyHash=${(_g = computeMcpSandboxPolicyHash(args.sandboxNetworkControlsConfig)) !== null && _g !== void 0 ? _g : "none"}`;
}
function getMcpSandboxLogMetadata(args) {
  var _a20, _b2, _c2, _d, _e2;
  return {
    event: "mcp_stdio_sandbox_policy",
    serverName: args.serverName,
    networkControlsEnabled: ((_a20 = args.networkControlsConfig) === null || _a20 === void 0 ? void 0 : _a20.enabled) === true,
    mcpNetworkMode: (_b2 = args.networkControlsConfig) === null || _b2 === void 0 ? void 0 : _b2.mcpNetworkMode,
    mcpNetworkAllowlistCount: countMcpSandboxLogList((_c2 = args.networkControlsConfig) === null || _c2 === void 0 ? void 0 : _c2.mcpNetworkAllowlist),
    mcpNetworkDenylistCount: countMcpSandboxLogList((_d = args.networkControlsConfig) === null || _d === void 0 ? void 0 : _d.mcpNetworkDenylist),
    localAgentNetworkAllowlistCount: countMcpSandboxLogList((_e2 = args.networkControlsConfig) === null || _e2 === void 0 ? void 0 : _e2.localAgentNetworkAllowlist),
    sandboxPolicyHash: computeMcpSandboxPolicyHash(args.sandboxNetworkControlsConfig)
  };
}
function loadCommandBasedServerWithElicitation(ctx, serverName, commandBasedServer, networkControlsService) {
  return __awaiter35(this, void 0, void 0, function* () {
    var _a20;
    var _b2, _c2;
    const expandedCwd = commandBasedServer.cwd ? expandPath({ filePath: commandBasedServer.cwd }) : void 0;
    let command;
    let args;
    if (commandBasedServer.args && commandBasedServer.args.length > 0) {
      command = expandPath({
        filePath: commandBasedServer.command,
        baseDir: expandedCwd
      });
      args = commandBasedServer.args.map((arg) => expandPath({ filePath: arg, baseDir: expandedCwd }));
    } else {
      const parts = parseArgsStringToArgv(commandBasedServer.command);
      command = expandPath({ filePath: parts[0], baseDir: expandedCwd });
      args = parts.slice(1).map((arg) => expandPath({ filePath: arg, baseDir: expandedCwd }));
    }
    const env = (_b2 = commandBasedServer.env) !== null && _b2 !== void 0 ? _b2 : {};
    const networkControlsConfig = yield (_a20 = networkControlsService === null || networkControlsService === void 0 ? void 0 : networkControlsService.getMcpNetworkControlsConfig) === null || _a20 === void 0 ? void 0 : _a20.call(networkControlsService, {
      command: [
        commandBasedServer.command,
        ...(_c2 = commandBasedServer.args) !== null && _c2 !== void 0 ? _c2 : []
      ].join(" ")
    });
    const sandboxNetworkControlsConfig = getStdioMcpSandboxConfig(networkControlsConfig);
    if (sandboxNetworkControlsConfig !== void 0) {
      const { buildMcpSandboxPolicy: buildMcpSandboxPolicy2 } = yield Promise.resolve().then(() => (init_mcp_sandbox_policy2(), mcp_sandbox_policy_exports));
      const { SandboxUnsupportedError: SandboxUnsupportedError2, spawnInSandbox: spawnInSandbox2 } = yield Promise.resolve().then(() => (init_dist4(), dist_exports));
      const effectiveCwd = expandedCwd !== null && expandedCwd !== void 0 ? expandedCwd : process.cwd();
      const sandboxPolicy = yield buildMcpSandboxPolicy2(sandboxNetworkControlsConfig, effectiveCwd);
      logger12.info(ctx, getMcpSandboxLogMessage({
        serverName,
        networkControlsConfig,
        sandboxNetworkControlsConfig
      }), getMcpSandboxLogMetadata({
        serverName,
        networkControlsConfig,
        sandboxNetworkControlsConfig
      }));
      try {
        return yield McpSdkClient.fromCommand(ctx, serverName, { command, args, cwd: expandedCwd }, env, {
          spawn: (cmd, spawnArgs, opts) => spawnInSandbox2(cmd, spawnArgs, opts, sandboxPolicy)
        });
      } catch (error3) {
        if (error3 instanceof SandboxUnsupportedError2) {
          throw new McpSandboxUnavailableError(serverName, error3);
        }
        throw error3;
      }
    }
    if ((networkControlsConfig === null || networkControlsConfig === void 0 ? void 0 : networkControlsConfig.enabled) === true && networkControlsConfig.mcpNetworkMode === "no_sandbox") {
      if (networkControlsConfig.win32UserExtensionUnsandbox === true) {
        logger12.info(ctx, `Starting local MCP server "${serverName}" without MCP sandboxing`, {
          event: "mcp_stdio_win32_user_extension_unsandbox",
          serverName
        });
      } else {
        logger12.info(ctx, `Starting local MCP server "${serverName}" without MCP sandboxing`);
      }
    }
    return McpSdkClient.fromCommand(ctx, serverName, { command, args, cwd: expandedCwd }, env);
  });
}
function createHttpExchangeLogging(ctx, serverName) {
  return {
    logger: {
      debug: (message, metadata) => logger12.debug(ctx, message, metadata),
      info: (message, metadata) => logger12.info(ctx, message, metadata),
      warn: (message, metadata) => logger12.warn(ctx, message, metadata),
      error: (message, error3, metadata) => logger12.error(ctx, message, error3, metadata)
    },
    metadata: {
      identifier: serverName,
      source: "mcp-agent-exec"
    }
  };
}
function loadLegacyHttpServer(ctx, serverName, remoteServer, tokenStorage, authRedirectUrl) {
  return __awaiter35(this, void 0, void 0, function* () {
    const lifecycleLogger = createContextStructuredLifecycleLogger(ctx, logger12);
    const httpExchangeLogging = createHttpExchangeLogging(ctx, serverName);
    return McpSdkClient.fromStreamableHttp(serverName, remoteServer, tokenStorage, remoteServer.headers, authRedirectUrl, void 0, httpExchangeLogging, lifecycleLogger);
  });
}
function loadServer(ctx_1, serverName_1, server_1, tokenStorage_1) {
  return __awaiter35(this, arguments, void 0, function* (ctx, serverName, server, tokenStorage, middlewareSettings = {
    middlewares: [],
    configPath: ""
  }, authRedirectUrlGenerator) {
    const env_1 = { stack: [], error: void 0, hasError: false };
    try {
      const { middlewares, configPath } = middlewareSettings;
      const span = __addDisposableResource12(env_1, createSpan(ctx.withName("mcp-agent-exec.loadServer")), false);
      span.span.setAttribute("serverName", serverName);
      let next = (previousCtx, currentServer) => __awaiter35(this, void 0, void 0, function* () {
        const env_2 = { stack: [], error: void 0, hasError: false };
        try {
          const nextSpan = __addDisposableResource12(env_2, createSpan(previousCtx.withName("loadServer.next")), false);
          nextSpan.span.setAttribute("serverName", serverName);
          const middlewareCtx = nextSpan.ctx;
          if ("command" in currentServer) {
            nextSpan.span.setAttribute("kind", "command");
            const networkService = middlewares.find(isMcpNetworkControlsConfigService);
            return yield loadCommandBasedServerWithElicitation(middlewareCtx, serverName, currentServer, networkService);
          }
          if ("url" in currentServer) {
            nextSpan.span.setAttribute("kind", "url");
            const authRedirectUrl = authRedirectUrlGenerator === null || authRedirectUrlGenerator === void 0 ? void 0 : authRedirectUrlGenerator(serverName);
            return yield loadLegacyHttpServer(middlewareCtx, serverName, currentServer, tokenStorage, authRedirectUrl);
          }
          throw new Error(`Invalid server: ${JSON.stringify(currentServer)}`);
        } catch (e_2) {
          env_2.error = e_2;
          env_2.hasError = true;
        } finally {
          __disposeResources12(env_2);
        }
      });
      for (const middleware of middlewares) {
        const previousNext = next;
        next = (middlewareCtx, middlewareServer) => __awaiter35(this, void 0, void 0, function* () {
          return yield middleware.load(middlewareCtx, serverName, middlewareServer, configPath, previousNext);
        });
      }
      return yield next(span.ctx, server);
    } catch (e_1) {
      env_1.error = e_1;
      env_1.hasError = true;
    } finally {
      __disposeResources12(env_1);
    }
  });
}
function isExpectedSkippedMcpLoadError(error3) {
  return error3 instanceof McpServerDisabledError || error3 instanceof McpServerNotApprovedError || error3 instanceof McpServerBlockedError;
}
function logMcpDefinitionLoadFailure(ctx, definition2, error3) {
  logger12.warn(ctx, "Failed to load MCP server", {
    identifier: definition2.identifier,
    source: definition2.source,
    configPath: definition2.configPath,
    metadata: definition2.metadata,
    errorMessage: error3 instanceof Error ? error3.message : String(error3),
    stderrTail: getMcpStdioStderrTail(error3)
  });
}
var FileConfigMcpDefinitionSource = class {
  constructor(configPath) {
    this.configPath = configPath;
    this.configPromise = getMcpConfig(configPath);
  }
  clearCache() {
    this.configPromise = getMcpConfig(this.configPath);
  }
  getDefinitions(_ctx_1) {
    return __awaiter35(this, arguments, void 0, function* (_ctx, _cache = true) {
      const config2 = yield this.configPromise;
      return Object.entries(config2.mcpServers).map(([identifier, serverConfig]) => ({
        identifier,
        serverConfig,
        configPath: this.configPath
      }));
    });
  }
};
var DefinitionMcpLoader = class {
  constructor(source, tokenStorage, middlewares = [], options2 = {}) {
    this.source = source;
    this.tokenStorage = tokenStorage;
    this.middlewares = middlewares;
    this.options = options2;
    this.clientCache = /* @__PURE__ */ new Map();
  }
  load(ctx_1) {
    return __awaiter35(this, arguments, void 0, function* (ctx, cache3 = true) {
      var _a20, _b2;
      var _c2;
      const env_3 = { stack: [], error: void 0, hasError: false };
      try {
        const _span = __addDisposableResource12(env_3, createSpan(ctx.withName("DefinitionMcpLoader.load")), false);
        if (!cache3) {
          yield this.closeAllCachedClients();
          (_b2 = (_a20 = this.source).clearCache) === null || _b2 === void 0 ? void 0 : _b2.call(_a20);
        }
        const definitions = yield this.source.getDefinitions(ctx, cache3);
        yield this.evictClientsOnSandboxPolicyChange(ctx, definitions);
        const clients = {};
        yield asyncMapValues([...definitions], (definition2) => __awaiter35(this, void 0, void 0, function* () {
          try {
            const cachedClient = cache3 ? this.clientCache.get(definition2.identifier) : void 0;
            const client = cachedClient !== null && cachedClient !== void 0 ? cachedClient : yield this.loadDefinitionClient(ctx, definition2);
            if (!cachedClient) {
              this.clientCache.set(definition2.identifier, client);
            }
            clients[definition2.identifier] = client;
          } catch (error3) {
            if (this.handleDefinitionLoadError(ctx, definition2, error3)) {
              return;
            }
            logMcpDefinitionLoadFailure(ctx, definition2, error3);
          }
        }), { max: (_c2 = this.options.maxConcurrency) !== null && _c2 !== void 0 ? _c2 : Math.max(definitions.length, 1) });
        return new McpManager(clients, this.options.elicitationFactory);
      } catch (e_3) {
        env_3.error = e_3;
        env_3.hasError = true;
      } finally {
        __disposeResources12(env_3);
      }
    });
  }
  clearClient(identifier) {
    this.clientCache.delete(identifier);
  }
  clearAllMcpCaches() {
    this.clientCache.clear();
  }
  /**
   * Live policy revocation for cached MCP clients.
   *
   * Sandboxed stdio MCP servers bake their network egress policy in at spawn
   * time (OS-level Seatbelt/Landlock rules), so a team admin tightening the MCP
   * network allowlist mid-session would otherwise leave already-running servers
   * with stale egress rules. On each load we recompute a fingerprint of the
   * sandbox-relevant config (gate state + effective allowlist); when it changes,
   * we close all cached clients so they are re-spawned under the new policy.
   *
   * No-op when no network-controls middleware is present, keeping behavior
   * byte-for-byte identical for setups that do not use MCP network controls.
   */
  evictClientsOnSandboxPolicyChange(ctx, definitions) {
    return __awaiter35(this, void 0, void 0, function* () {
      const service = this.middlewares.find(isMcpNetworkControlsConfigService);
      if (!service) {
        return;
      }
      let fingerprint;
      try {
        fingerprint = JSON.stringify(yield Promise.all([...definitions].sort((a, b2) => a.identifier.localeCompare(b2.identifier)).map((definition2) => __awaiter35(this, void 0, void 0, function* () {
          var _a20;
          var _b2;
          const config2 = (_b2 = yield (_a20 = service.getMcpNetworkControlsConfig) === null || _a20 === void 0 ? void 0 : _a20.call(service, getMcpNetworkControlsServerIdentity(definition2.serverConfig))) !== null && _b2 !== void 0 ? _b2 : {};
          return [
            definition2.identifier,
            computeMcpSandboxPolicyFingerprint(config2)
          ];
        }))));
      } catch (_a20) {
        return;
      }
      const previous = this.sandboxPolicyFingerprint;
      this.sandboxPolicyFingerprint = fingerprint;
      if (previous !== void 0 && previous !== fingerprint) {
        logger12.info(ctx, "MCP network-controls policy changed; reloading MCP clients to apply the new egress policy");
        yield this.closeAllCachedClients();
      }
    });
  }
  closeAllCachedClients() {
    return __awaiter35(this, void 0, void 0, function* () {
      const cachedClients = [...this.clientCache.values()];
      this.clientCache.clear();
      yield asyncMapValues(cachedClients, (client) => __awaiter35(this, void 0, void 0, function* () {
        var _a20;
        try {
          yield (_a20 = client.close) === null || _a20 === void 0 ? void 0 : _a20.call(client);
        } catch (_b2) {
        }
      }), { max: Math.max(cachedClients.length, 1) });
    });
  }
  loadClient(ctx, identifier, ignoreTokens) {
    return __awaiter35(this, void 0, void 0, function* () {
      const env_4 = { stack: [], error: void 0, hasError: false };
      try {
        const _span = __addDisposableResource12(env_4, createSpan(ctx.withName("DefinitionMcpLoader.loadClient")), false);
        const definitions = yield this.source.getDefinitions(ctx);
        yield this.evictClientsOnSandboxPolicyChange(ctx, definitions);
        if (!ignoreTokens) {
          const cached2 = this.clientCache.get(identifier);
          if (cached2) {
            return cached2;
          }
        }
        const definition2 = definitions.find((candidate) => candidate.identifier === identifier);
        if (!definition2) {
          throw new Error(`MCP server "${identifier}" not found in config`);
        }
        let client;
        try {
          client = yield this.loadDefinitionClient(ctx, definition2, ignoreTokens);
        } catch (error3) {
          this.handleDefinitionLoadError(ctx, definition2, error3);
          throw error3;
        }
        if (!ignoreTokens) {
          this.clientCache.set(identifier, client);
        }
        return client;
      } catch (e_4) {
        env_4.error = e_4;
        env_4.hasError = true;
      } finally {
        __disposeResources12(env_4);
      }
    });
  }
  loadDefinitionClient(ctx, definition2, ignoreTokens) {
    return __awaiter35(this, void 0, void 0, function* () {
      var _a20, _b2;
      const identifier = (_a20 = definition2.authStorageKey) !== null && _a20 !== void 0 ? _a20 : definition2.identifier;
      const inner = new IdentifierScopedTokenStorage(this.tokenStorage, identifier);
      const lifecycleLogger = createContextStructuredLifecycleLogger(ctx, logger12);
      const loggedScopedTokenStorage = new LoggedScopedMcpTokenStorage({
        inner,
        logger: lifecycleLogger,
        identifier,
        serverUrl: "url" in definition2.serverConfig ? definition2.serverConfig.url : void 0
      });
      const scopedTokenStorage = ignoreTokens ? new NoOpScopedTokenStorage(loggedScopedTokenStorage) : loggedScopedTokenStorage;
      return loadServer(ctx, definition2.identifier, definition2.serverConfig, scopedTokenStorage, {
        middlewares: this.middlewares,
        configPath: (_b2 = definition2.configPath) !== null && _b2 !== void 0 ? _b2 : ""
      }, this.options.authRedirectUrlGenerator);
    });
  }
  handleDefinitionLoadError(ctx, definition2, error3) {
    var _a20, _b2;
    let handled = false;
    try {
      handled = ((_b2 = (_a20 = this.options).onDefinitionLoadError) === null || _b2 === void 0 ? void 0 : _b2.call(_a20, ctx, definition2, error3)) === "handled";
    } catch (hookError) {
      logger12.warn(ctx, "MCP definition load error hook failed", {
        identifier: definition2.identifier,
        source: definition2.source,
        configPath: definition2.configPath,
        metadata: definition2.metadata,
        errorMessage: hookError instanceof Error ? hookError.message : String(hookError)
      });
    }
    return handled || isExpectedSkippedMcpLoadError(error3);
  }
};
var McpServerBlockedError = class extends Error {
  constructor(serverName, reason, message) {
    super(message !== null && message !== void 0 ? message : reason === "teamNetworkAllowlist" ? `MCP server "${serverName}" is not on the team network allowlist` : `MCP server "${serverName}" is blocked by team policy`);
    this.serverName = serverName;
    this.reason = reason;
    this.name = "McpServerBlockedError";
  }
};
var FileConfigMcpLoader = class _FileConfigMcpLoader extends DefinitionMcpLoader {
  constructor(configPath, tokenStorage, middlewares = [], authRedirectUrlGenerator, elicitationFactory) {
    super(new FileConfigMcpDefinitionSource(configPath), tokenStorage, middlewares, {
      authRedirectUrlGenerator,
      elicitationFactory
    });
    this.configPath = configPath;
    this.elicitationFactory = elicitationFactory;
  }
  static init(tokenStorage, configPath, middlewares = []) {
    return new _FileConfigMcpLoader(configPath, tokenStorage, middlewares);
  }
};
