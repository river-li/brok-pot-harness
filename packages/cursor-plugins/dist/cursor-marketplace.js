var __awaiter51 = function(thisArg, _arguments, P2, generator) {
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
var PLUGINS_CACHE_ROOT = "plugins/cache";
var PLUGIN_CACHE_SENTINEL = ".cache-complete";
function sanitizePluginCacheMarketplaceSlug(raw) {
  return raw.replace(/[^a-zA-Z0-9_-]/g, "_");
}
function sanitizePluginCachePluginId(raw) {
  return raw.replace(/[^a-zA-Z0-9_-]/g, "_");
}
function sanitizePluginCacheVersion(raw) {
  return sanitizeFilename(raw);
}
function getPluginCachePath(cacheRoot, marketplaceSlug, pluginId, version3) {
  const parts = [cacheRoot, marketplaceSlug, pluginId];
  if (version3 !== void 0) {
    parts.push(version3);
  }
  return (0, import_node_path57.join)(...parts);
}
function getPluginInstallCachePath(cacheRoot, args) {
  return getPluginCachePath(cacheRoot, sanitizePluginCacheMarketplaceSlug(args.marketplaceSlug), sanitizePluginCachePluginId(args.pluginId), args.version !== void 0 ? sanitizePluginCacheVersion(args.version) : void 0);
}
var DefaultPluginCacheManager = class {
  /**
   * Create a new cache manager.
   * @param userHomeDir - User's home directory (defaults to process.env.HOME)
   */
  constructor(userHomeDir, options2) {
    var _a19, _b2;
    const home = (_a19 = userHomeDir !== null && userHomeDir !== void 0 ? userHomeDir : process.env.HOME) !== null && _a19 !== void 0 ? _a19 : "";
    this.cacheRoot = (_b2 = options2 === null || options2 === void 0 ? void 0 : options2.cacheRoot) !== null && _b2 !== void 0 ? _b2 : (0, import_node_path57.join)(home, ".cursor", PLUGINS_CACHE_ROOT);
  }
  getCacheDir(args) {
    return getPluginInstallCachePath(this.cacheRoot, args);
  }
  isCached(args) {
    return __awaiter51(this, void 0, void 0, function* () {
      const cacheDir = this.getCacheDir(args);
      try {
        const sentinelPath = (0, import_node_path57.join)(cacheDir, PLUGIN_CACHE_SENTINEL);
        const stats = yield (0, import_promises28.stat)(sentinelPath);
        return stats.isFile();
      } catch (_a19) {
        return false;
      }
    });
  }
  extractToCache(args) {
    return __awaiter51(this, void 0, void 0, function* () {
      const cacheDir = this.getCacheDir(args);
      yield (0, import_promises28.mkdir)(cacheDir, { recursive: true });
      const bufferStream = import_node_stream5.Readable.from(args.tarball);
      yield (0, import_promises29.pipeline)(bufferStream, (0, import_node_zlib3.createGunzip)(), So({ cwd: cacheDir, strip: 1 }));
      yield this.markCacheComplete(args);
      return cacheDir;
    });
  }
  listCachedVersions(args) {
    return __awaiter51(this, void 0, void 0, function* () {
      const safeSlug = sanitizePluginCacheMarketplaceSlug(args.marketplaceSlug);
      const safePluginId = sanitizePluginCachePluginId(args.pluginId);
      const pluginDir = (0, import_node_path57.join)(this.cacheRoot, safeSlug, safePluginId);
      try {
        const entries = yield (0, import_promises28.readdir)(pluginDir, { withFileTypes: true });
        return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);
      } catch (_a19) {
        return [];
      }
    });
  }
  removeVersion(args) {
    return __awaiter51(this, void 0, void 0, function* () {
      const cacheDir = this.getCacheDir(args);
      try {
        yield (0, import_promises28.rm)(cacheDir, { recursive: true, force: true });
      } catch (_a19) {
      }
    });
  }
  removeAllVersions(args) {
    return __awaiter51(this, void 0, void 0, function* () {
      const pluginDir = getPluginInstallCachePath(this.cacheRoot, args);
      yield (0, import_promises28.rm)(pluginDir, { recursive: true, force: true });
    });
  }
  pruneOldVersions(args) {
    return __awaiter51(this, void 0, void 0, function* () {
      const cachedVersions2 = yield this.listCachedVersions({
        marketplaceSlug: args.marketplaceSlug,
        pluginId: args.pluginId
      });
      const keepSet = new Set(args.keepVersions.map((version3) => sanitizePluginCacheVersion(version3)));
      for (const version3 of cachedVersions2) {
        if (!keepSet.has(version3)) {
          yield this.removeVersion({
            marketplaceSlug: args.marketplaceSlug,
            pluginId: args.pluginId,
            version: version3
          });
        }
      }
    });
  }
  markCacheComplete(args) {
    return __awaiter51(this, void 0, void 0, function* () {
      const cacheDir = this.getCacheDir(args);
      yield (0, import_promises28.writeFile)((0, import_node_path57.join)(cacheDir, PLUGIN_CACHE_SENTINEL), "");
    });
  }
};
