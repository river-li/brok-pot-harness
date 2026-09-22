/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/mcp-agent-exec/dist/token-store.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var import_promises39 = require("node:fs/promises");
var path20 = __toESM(require("node:path"), 1);
var __awaiter65 = function(thisArg, _arguments, P2, generator) {
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
var FileBasedTokenStore = class _FileBasedTokenStore {
  constructor(mcpAuthPath) {
    this.mcpAuthPath = mcpAuthPath;
    const cachedPromise = _FileBasedTokenStore.mcpAuthPromises.get(mcpAuthPath);
    if (cachedPromise) {
      this.mcpAuthPromise = cachedPromise;
    } else {
      const mcpAuthPromise = this.loadMcpAuth();
      this.mcpAuthPromise = mcpAuthPromise;
      _FileBasedTokenStore.mcpAuthPromises.set(mcpAuthPath, mcpAuthPromise);
      void mcpAuthPromise.catch(() => {
        if (_FileBasedTokenStore.mcpAuthPromises.get(mcpAuthPath) === mcpAuthPromise) {
          _FileBasedTokenStore.mcpAuthPromises.delete(mcpAuthPath);
        }
      });
    }
    if (!_FileBasedTokenStore.saveLocks.has(mcpAuthPath)) {
      _FileBasedTokenStore.saveLocks.set(mcpAuthPath, Promise.resolve());
    }
  }
  loadMcpAuth() {
    return __awaiter65(this, void 0, void 0, function* () {
      try {
        const mcpAuth = yield (0, import_promises39.readFile)(this.mcpAuthPath, "utf8");
        const data = JSON.parse(mcpAuth);
        if (data && typeof data === "object") {
          const hasDirectTokens = Object.values(data).some((value) => value && typeof value === "object" && value !== null && ("access_token" in value || "refresh_token" in value) && !("tokens" in value) && !("clientInfo" in value));
          if (hasDirectTokens) {
            const converted = {};
            for (const [key, value] of Object.entries(data)) {
              converted[key] = { tokens: value };
            }
            return converted;
          }
          const result = {};
          for (const [key, value] of Object.entries(data)) {
            if (value && typeof value === "object" && value !== null) {
              result[key] = {
                tokens: "tokens" in value ? value.tokens : void 0,
                clientInfo: "clientInfo" in value ? value.clientInfo : void 0
              };
            }
          }
          return result;
        }
        return {};
      } catch (e) {
        if (e instanceof Error && e.message.includes("ENOENT")) {
          return {};
        }
        throw e;
      }
    });
  }
  loadTokens(identifier) {
    return __awaiter65(this, void 0, void 0, function* () {
      var _a19;
      const mcpAuth = yield this.mcpAuthPromise;
      return (_a19 = mcpAuth[identifier]) === null || _a19 === void 0 ? void 0 : _a19.tokens;
    });
  }
  saveTokens(identifier, tokens) {
    return __awaiter65(this, void 0, void 0, function* () {
      yield this.withSaveLock(() => __awaiter65(this, void 0, void 0, function* () {
        const mcpAuth = yield this.mcpAuthPromise;
        if (!mcpAuth[identifier]) {
          mcpAuth[identifier] = {};
        }
        mcpAuth[identifier].tokens = tokens;
        yield this.saveMcpAuth(mcpAuth);
      }));
    });
  }
  loadClientInformation(identifier) {
    return __awaiter65(this, void 0, void 0, function* () {
      var _a19;
      const mcpAuth = yield this.mcpAuthPromise;
      return (_a19 = mcpAuth[identifier]) === null || _a19 === void 0 ? void 0 : _a19.clientInfo;
    });
  }
  withSaveLock(fn) {
    return __awaiter65(this, void 0, void 0, function* () {
      var _a19;
      const previousLock = (_a19 = _FileBasedTokenStore.saveLocks.get(this.mcpAuthPath)) !== null && _a19 !== void 0 ? _a19 : Promise.resolve();
      let releaseLock;
      _FileBasedTokenStore.saveLocks.set(this.mcpAuthPath, new Promise((resolve29) => {
        releaseLock = resolve29;
      }));
      try {
        yield previousLock;
        return yield fn();
      } finally {
        releaseLock();
      }
    });
  }
  saveClientInformation(identifier, clientInfo) {
    return __awaiter65(this, void 0, void 0, function* () {
      yield this.withSaveLock(() => __awaiter65(this, void 0, void 0, function* () {
        const mcpAuth = yield this.mcpAuthPromise;
        if (!mcpAuth[identifier]) {
          mcpAuth[identifier] = {};
        }
        mcpAuth[identifier].clientInfo = clientInfo;
        yield this.saveMcpAuth(mcpAuth);
      }));
    });
  }
  deleteCredentials(identifier) {
    return __awaiter65(this, void 0, void 0, function* () {
      yield this.withSaveLock(() => __awaiter65(this, void 0, void 0, function* () {
        const mcpAuth = yield this.mcpAuthPromise;
        if (identifier in mcpAuth) {
          delete mcpAuth[identifier];
          yield this.saveMcpAuth(mcpAuth);
        }
      }));
    });
  }
  saveMcpAuth(data) {
    return __awaiter65(this, void 0, void 0, function* () {
      yield (0, import_promises39.mkdir)(path20.dirname(this.mcpAuthPath), { recursive: true });
      yield (0, import_promises39.writeFile)(this.mcpAuthPath, JSON.stringify(data, null, 2));
    });
  }
};
FileBasedTokenStore.mcpAuthPromises = /* @__PURE__ */ new Map();
FileBasedTokenStore.saveLocks = /* @__PURE__ */ new Map();

