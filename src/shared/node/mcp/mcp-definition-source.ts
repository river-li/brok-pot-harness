var EMPTY_MCP_CONFIG = { mcpServers: {} };
function backendEntryBelongsToRow(entry, rowIdentifier) {
  return entry.rowServerIdentifier === rowIdentifier;
}
function displayRowOwnsIdentifier(identifier, rowIdentifier, slots) {
  return identifier === rowIdentifier || (slots?.some((slot) => slot.serverIdentifier === identifier) ?? false);
}
var UnresolvedBoxServers = class {
  constructor(error42) {
    this.error = error42;
  }
  error;
};
var SandMcpDefinitionSource = class {
  constructor(builtins, accountConfigProvider, boxServers = async () => ({})) {
    this.builtins = builtins;
    this.accountConfigProvider = accountConfigProvider;
    this.boxServers = boxServers;
    this.accountConfigPromise = this.loadAccountConfig();
    this.boxServersPromise = this.loadBoxServers();
  }
  builtins;
  accountConfigProvider;
  boxServers;
  accountConfigPromise;
  accountConfigEpoch = 0;
  lastKnownConfig = null;
  boxServersPromise;
  loadBoxServers() {
    return this.boxServers().then(
      (servers) => servers,
      (error42) => new UnresolvedBoxServers(error42)
    );
  }
  loadAccountConfig() {
    const epoch = ++this.accountConfigEpoch;
    const promise2 = this.accountConfigProvider?.() ?? Promise.resolve(null);
    void promise2.then(
      (config2) => {
        if (config2 != null && epoch === this.accountConfigEpoch) {
          this.lastKnownConfig = config2;
        }
      },
      () => {
      }
    );
    return promise2;
  }
  clearLastKnownAccountConfig() {
    this.accountConfigEpoch++;
    this.lastKnownConfig = null;
    this.accountConfigPromise = Promise.resolve(null);
  }
  adoptAccountConfig(config2) {
    this.accountConfigEpoch++;
    this.lastKnownConfig = config2;
    this.accountConfigPromise = Promise.resolve(config2);
  }
  peekHttpServerNames() {
    if (this.lastKnownConfig === null) {
      return void 0;
    }
    return Object.entries(this.lastKnownConfig.mcpServers).filter(([name17, config2]) => !BUILTIN_MCP_SERVER_NAMES.has(name17) && "url" in config2).map(([name17]) => name17);
  }
  peekStdioServerNames() {
    if (this.lastKnownConfig === null) {
      return void 0;
    }
    return Object.entries(this.lastKnownConfig.mcpServers).filter(([name17, config2]) => !BUILTIN_MCP_SERVER_NAMES.has(name17) && "command" in config2).map(([name17]) => name17);
  }
  async getStdioServerConfigs() {
    const userServers = await this.getUserServerConfigs();
    const stdioServers = {};
    for (const [name17, config2] of Object.entries(userServers)) {
      if ("command" in config2) {
        stdioServers[name17] = config2;
      }
    }
    return stdioServers;
  }
  async getPushedServerConfigs() {
    const stdioServers = await this.getStdioServerConfigs();
    const boxServers = await this.boxServersPromise;
    if (boxServers instanceof UnresolvedBoxServers) throw boxServers.error;
    return { ...stdioServers, ...boxServers };
  }
  reloadBoxServers() {
    this.boxServersPromise = this.loadBoxServers();
  }
  clearCache() {
    this.accountConfigPromise = this.loadAccountConfig();
    this.reloadBoxServers();
  }
  async ensureConfigLoaded() {
    this.clearCache();
    if (await this.accountConfigPromise.catch(() => null) != null) {
      return;
    }
    this.clearCache();
    if (await this.accountConfigPromise.catch(() => null) == null && this.lastKnownConfig != null) {
      this.accountConfigPromise = Promise.resolve(this.lastKnownConfig);
    }
  }
  refreshInBackground() {
    this.reloadBoxServers();
    const superseded = this.accountConfigPromise;
    void this.loadAccountConfig().then(
      (config2) => {
        if (config2 != null && this.accountConfigPromise === superseded) {
          this.accountConfigPromise = Promise.resolve(config2);
        }
      },
      () => {
      }
    );
  }
  async getUserServerConfigs() {
    const account = await this.accountConfigPromise ?? EMPTY_MCP_CONFIG;
    const servers = {};
    for (const [name17, config2] of Object.entries(account.mcpServers)) {
      if (!BUILTIN_MCP_SERVER_NAMES.has(name17)) {
        servers[name17] = config2;
      }
    }
    return servers;
  }
  async getServerUrlForIdentifier(identifier) {
    const account = await this.accountConfigPromise ?? this.lastKnownConfig;
    if (account == null) return void 0;
    const server = account.mcpServers[identifier];
    return server != null && "url" in server ? server.url : void 0;
  }
  async getDefinitions() {
    const builtins = this.builtins == null ? {} : getBuiltinMcpServers(this.builtins);
    const builtinDefinitions = Object.entries(builtins).map(
      ([identifier, serverConfig]) => ({
        identifier,
        serverConfig,
        source: "builtin"
      })
    );
    const userServers = await this.getUserServerConfigs();
    const userDefinitions = Object.entries(userServers).filter(([identifier, serverConfig]) => !(identifier in builtins) && "url" in serverConfig).map(([identifier, serverConfig]) => ({
      identifier,
      serverConfig,
      source: "account"
    }));
    return [...builtinDefinitions, ...userDefinitions];
  }
};
