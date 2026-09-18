var __awaiter48 = function(thisArg, _arguments, P2, generator) {
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
var PLUGIN_MCP_CONFIG_FILE_NAMES = [".mcp.json", "mcp.json"];
var MCP_NON_SERVER_METADATA_KEYS = [
  "author",
  "owner",
  "source",
  "metadata"
];
var NON_SERVER_METADATA_KEY_SET = new Set(MCP_NON_SERVER_METADATA_KEYS.map((key) => key.toLowerCase()));
function isMcpMetadataKey(key) {
  return NON_SERVER_METADATA_KEY_SET.has(key.toLowerCase());
}
function isMcpLikelyMetadataObject(key, value) {
  if (!isMcpMetadataKey(key)) {
    return false;
  }
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const metadata = value;
  switch (key.toLowerCase()) {
    case "author":
    case "owner":
      return typeof metadata.name === "string";
    case "source":
      return typeof metadata.source === "string" || typeof metadata.repo === "string" || typeof metadata.path === "string" || typeof metadata.ref === "string" || typeof metadata.sha === "string";
    case "metadata":
      return typeof metadata.description === "string" || typeof metadata.version === "string" || typeof metadata.pluginRoot === "string";
    default:
      return false;
  }
}
function isMcpServerLikeObject(value) {
  return typeof value === "object" && value !== null && ("command" in value || "url" in value);
}
function resolvePluginMcpConfigPaths(pluginPath) {
  const normalizedPluginPath = pluginPath !== void 0 && pluginPath.length > 0 ? pluginPath.replace(/\/+$/, "") : void 0;
  return PLUGIN_MCP_CONFIG_FILE_NAMES.map((mcpConfigFileName) => normalizedPluginPath !== void 0 ? `${normalizedPluginPath}/${mcpConfigFileName}` : mcpConfigFileName);
}
function expandMcpEnvPlaceholders(obj, options2) {
  const cloud = options2 === null || options2 === void 0 ? void 0 : options2.cloudAgentEnvLookup;
  const configured2 = options2 === null || options2 === void 0 ? void 0 : options2.configuredVariables;
  if (cloud !== void 0) {
    return expandEnvVarsWithLookup(obj, cloud);
  }
  const lookup3 = (key) => {
    const env = process.env[key];
    if (env !== void 0) {
      return env;
    }
    const val = configured2 === null || configured2 === void 0 ? void 0 : configured2[key];
    if (val === void 0 || val === null) {
      return void 0;
    }
    return typeof val === "string" ? val : String(val);
  };
  return expandEnvVarsWithLookup(obj, lookup3);
}
function expandMcpServerConfig(config2, pluginPath, options2) {
  if (!config2.mcpServers) {
    return config2;
  }
  const expandedServers = {};
  for (const [serverName, serverConfig] of Object.entries(config2.mcpServers)) {
    const expanded = Object.assign({}, serverConfig);
    if (typeof serverConfig.command === "string") {
      expanded.command = expandPluginVariables(serverConfig.command, pluginPath);
    }
    if (Array.isArray(serverConfig.args)) {
      expanded.args = serverConfig.args.map((arg) => typeof arg === "string" ? expandPluginVariables(arg, pluginPath) : arg);
    }
    if (serverConfig.env && typeof serverConfig.env === "object") {
      const expandedEnv = {};
      for (const [key, value] of Object.entries(serverConfig.env)) {
        expandedEnv[key] = typeof value === "string" ? expandPluginVariables(value, pluginPath) : value;
      }
      expanded.env = expandedEnv;
    }
    if (typeof serverConfig.cwd === "string") {
      expanded.cwd = expandPluginVariables(serverConfig.cwd, pluginPath);
    }
    expandedServers[serverName] = expanded;
  }
  return expandMcpEnvPlaceholders(Object.assign(Object.assign({}, config2), { mcpServers: expandedServers }), options2);
}
function parsePluginMcpConfig(content, installPath, options2) {
  var _a19;
  try {
    const data = parse9(content);
    const mcpSchemaId = readSchemaId(data);
    if (mcpSchemaId !== void 0) {
      const logger107 = (_a19 = options2 === null || options2 === void 0 ? void 0 : options2.log) !== null && _a19 !== void 0 ? _a19 : noopPluginMetricsLogger;
      if (resolveSchemaVersion(mcpSchemaId).kind === "unsupported") {
        logger107.log("warn", `mcp.json declares an unrecognized $schema, loading anyway: ${mcpSchemaId}`);
      } else if (schemaVersionsDisagree(options2 === null || options2 === void 0 ? void 0 : options2.pluginSchemaId, mcpSchemaId)) {
        logger107.log("warn", `mcp.json $schema ${mcpSchemaId} disagrees with plugin.json $schema ${options2 === null || options2 === void 0 ? void 0 : options2.pluginSchemaId}, loading anyway`);
      }
    }
    const parsed2 = mcpConfigSchema.safeParse(data);
    const skipExpansion = (options2 === null || options2 === void 0 ? void 0 : options2.skipExpansion) === true;
    if (parsed2.success && parsed2.data.mcpServers && Object.keys(parsed2.data.mcpServers).length > 0) {
      return skipExpansion ? parsed2.data : expandMcpServerConfig(parsed2.data, installPath, options2);
    }
    const rootServers = {};
    for (const [key, value] of Object.entries(data)) {
      if (key !== "mcpServers" && !isMcpLikelyMetadataObject(key, value) && isMcpServerLikeObject(value)) {
        rootServers[key] = value;
      }
    }
    if (Object.keys(rootServers).length > 0) {
      const wrappedParsed = mcpConfigSchema.safeParse({
        mcpServers: rootServers
      });
      if (wrappedParsed.success) {
        return skipExpansion ? wrappedParsed.data : expandMcpServerConfig(wrappedParsed.data, installPath, options2);
      }
    }
    return null;
  } catch (_b2) {
    return null;
  }
}
function mergeResolvedServers(target, servers, sourcePath) {
  for (const [name17, server] of Object.entries(servers)) {
    target.mcpServers[name17] = server;
    target.mcpServerSourcePaths[name17] = sourcePath;
  }
}
function resolveManifestMcpServersWithReader(mcpServers_1, readFileContent_1) {
  return __awaiter48(this, arguments, void 0, function* (mcpServers, readFileContent, options2 = {}) {
    var _a19, _b2;
    const toSourcePath = (_a19 = options2.toSourcePath) !== null && _a19 !== void 0 ? _a19 : ((p2) => p2);
    const installPathForExpansion = (_b2 = options2.installPathForExpansion) !== null && _b2 !== void 0 ? _b2 : "";
    const resolved = {
      mcpServers: {},
      mcpServerSourcePaths: {}
    };
    const loadFromPath = (rawPath) => __awaiter48(this, void 0, void 0, function* () {
      const normalized = rawPath.replace(/^\.\//, "");
      if (!isPathSafe(normalized)) {
        return;
      }
      const content = yield readFileContent(normalized);
      if (content === null) {
        return;
      }
      const config2 = parsePluginMcpConfig(content, installPathForExpansion, options2.parserOptions);
      if ((config2 === null || config2 === void 0 ? void 0 : config2.mcpServers) && Object.keys(config2.mcpServers).length > 0) {
        mergeResolvedServers(resolved, config2.mcpServers, toSourcePath(normalized));
      }
    });
    const loadInline = (item) => {
      var _a20;
      const config2 = parsePluginMcpConfig(JSON.stringify(item), installPathForExpansion, options2.parserOptions);
      if ((config2 === null || config2 === void 0 ? void 0 : config2.mcpServers) && Object.keys(config2.mcpServers).length > 0) {
        mergeResolvedServers(resolved, config2.mcpServers, (_a20 = options2.manifestSourcePath) !== null && _a20 !== void 0 ? _a20 : "manifest");
      }
    };
    if (typeof mcpServers === "string") {
      yield loadFromPath(mcpServers);
    } else if (Array.isArray(mcpServers)) {
      for (const item of mcpServers) {
        if (typeof item === "string") {
          yield loadFromPath(item);
        } else if (typeof item === "object" && item !== null) {
          loadInline(item);
        }
      }
    } else if (typeof mcpServers === "object" && mcpServers !== null) {
      loadInline(mcpServers);
    }
    return resolved;
  });
}
function resolvePluginMcpConfigFromReader(readFileContent_1, manifestMcpServers_1, manifestSourcePath_1) {
  return __awaiter48(this, arguments, void 0, function* (readFileContent, manifestMcpServers, manifestSourcePath, options2 = {}) {
    var _a19, _b2, _c2, _d;
    const toSourcePath = (_a19 = options2.toSourcePath) !== null && _a19 !== void 0 ? _a19 : ((p2) => p2);
    const installPathForExpansion = (_b2 = options2.installPathForExpansion) !== null && _b2 !== void 0 ? _b2 : "";
    const fallbackFileNames = (_c2 = options2.fallbackFileNames) !== null && _c2 !== void 0 ? _c2 : PLUGIN_MCP_CONFIG_FILE_NAMES;
    const manifestPrecedence = (_d = options2.manifestPrecedence) !== null && _d !== void 0 ? _d : "override";
    const mcpServers = {};
    const mcpServerSourcePaths = {};
    for (const fileName of fallbackFileNames) {
      const content = yield readFileContent(fileName);
      if (content === null) {
        continue;
      }
      const config2 = parsePluginMcpConfig(content, installPathForExpansion, options2.parserOptions);
      if (!(config2 === null || config2 === void 0 ? void 0 : config2.mcpServers)) {
        continue;
      }
      for (const [name17, server] of Object.entries(config2.mcpServers)) {
        if (mcpServers[name17] === void 0) {
          mcpServers[name17] = server;
          mcpServerSourcePaths[name17] = toSourcePath(fileName);
        }
      }
    }
    if (manifestMcpServers !== void 0) {
      const fromManifest = yield resolveManifestMcpServersWithReader(manifestMcpServers, readFileContent, {
        toSourcePath,
        manifestSourcePath,
        installPathForExpansion,
        parserOptions: options2.parserOptions
      });
      for (const [name17, server] of Object.entries(fromManifest.mcpServers)) {
        if (manifestPrecedence === "fill" && mcpServers[name17] !== void 0) {
          continue;
        }
        mcpServers[name17] = server;
        mcpServerSourcePaths[name17] = fromManifest.mcpServerSourcePaths[name17];
      }
    }
    if (Object.keys(mcpServers).length === 0) {
      return null;
    }
    return Object.assign({ mcpServers }, Object.keys(mcpServerSourcePaths).length > 0 && {
      mcpServerSourcePaths
    });
  });
}
function resolvePluginMcpConfigWithManifestLookup(readFileContent_1) {
  return __awaiter48(this, arguments, void 0, function* (readFileContent, options2 = {}) {
    var _a19;
    const toSourcePath = (_a19 = options2.toSourcePath) !== null && _a19 !== void 0 ? _a19 : ((p2) => p2);
    let manifestMcpServers;
    let manifestSourcePath;
    let pluginSchemaId;
    for (const manifestPath2 of PLUGIN_MANIFEST_PATHS) {
      const content = yield readFileContent(manifestPath2);
      if (content === null) {
        continue;
      }
      let rawManifest;
      try {
        rawManifest = JSON.parse(content);
      } catch (_b2) {
        continue;
      }
      pluginSchemaId = readSchemaId(rawManifest);
      const parsed2 = parsePluginManifest(content);
      if (!parsed2.success) {
        continue;
      }
      if (parsed2.data.mcpServers !== void 0) {
        manifestMcpServers = parsed2.data.mcpServers;
        manifestSourcePath = toSourcePath(manifestPath2);
      }
      break;
    }
    const resolvedOptions = pluginSchemaId === void 0 ? options2 : Object.assign(Object.assign({}, options2), { parserOptions: Object.assign(Object.assign({}, options2.parserOptions), { pluginSchemaId }) });
    return resolvePluginMcpConfigFromReader(readFileContent, manifestMcpServers, manifestSourcePath, resolvedOptions);
  });
}
