var __awaiter60 = function(thisArg, _arguments, P2, generator) {
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
var MAX_FILE_SIZE = 10 * 1024 * 1024;
function isSymlink2(filePath) {
  return __awaiter60(this, void 0, void 0, function* () {
    try {
      const stats = yield (0, import_promises32.lstat)(filePath);
      return stats.isSymbolicLink();
    } catch (_a19) {
      return false;
    }
  });
}
function readFileNoSymlink(filePath) {
  return __awaiter60(this, void 0, void 0, function* () {
    if (yield isSymlink2(filePath)) {
      throw new Error(`Refusing to read symlink: ${filePath}`);
    }
    return (0, import_promises32.readFile)(filePath, "utf-8");
  });
}
function checkFileSize(filePath) {
  return __awaiter60(this, void 0, void 0, function* () {
    const stats = yield (0, import_promises32.stat)(filePath);
    if (stats.size > MAX_FILE_SIZE) {
      throw new Error(`File ${filePath} exceeds maximum size of ${MAX_FILE_SIZE} bytes`);
    }
  });
}
function classifyLoadError(error42) {
  const msg = error42 instanceof Error ? error42.message : String(error42);
  if (/timed?\s*out/i.test(msg))
    return "timeout";
  if (/clone|fetch|git/i.test(msg))
    return "clone";
  if (/manifest|marketplace\.json/i.test(msg))
    return "manifest";
  if (/parse|invalid|malformed/i.test(msg))
    return "parse";
  if (/install|download|copy/i.test(msg))
    return "install";
  return "unknown";
}
function createLocalPluginFileFetcher(basePath, options2) {
  var _a19;
  const fileContentCache = /* @__PURE__ */ new Map();
  const resolvedBasePath = (0, import_node_path55.resolve)(basePath);
  const resolvedSymlinkTargetRoot = (0, import_node_path55.resolve)((_a19 = options2 === null || options2 === void 0 ? void 0 : options2.symlinkTargetRoot) !== null && _a19 !== void 0 ? _a19 : resolvedBasePath);
  const resolvedSymlinkTargetRootPromise = (0, import_promises32.realpath)(resolvedSymlinkTargetRoot).catch(() => resolvedSymlinkTargetRoot);
  function assertContained(fullPath) {
    const resolvedFullPath = (0, import_node_path55.resolve)(fullPath);
    try {
      return validateAndResolveSubpath(resolvedBasePath, resolvedFullPath);
    } catch (_a20) {
      throw new Error(`Path escapes plugin directory: ${fullPath}`);
    }
  }
  function assertContainedRealPath(fullPath) {
    return __awaiter60(this, void 0, void 0, function* () {
      const containedPath = assertContained(fullPath);
      const resolvedAllowedRealPath = yield resolvedSymlinkTargetRootPromise;
      const resolvedRealPath = yield (0, import_promises32.realpath)(containedPath);
      try {
        return validateAndResolveSubpath(resolvedAllowedRealPath, resolvedRealPath);
      } catch (_a20) {
        throw new Error(`Path escapes plugin directory via symlink: ${fullPath}`);
      }
    });
  }
  return {
    listDirectory(dirPath, visitedRealDirPaths) {
      return __awaiter60(this, void 0, void 0, function* () {
        const candidatePath = assertContained(dirPath ? (0, import_node_path55.join)(basePath, dirPath) : basePath);
        try {
          const fullPath = yield assertContainedRealPath(candidatePath);
          if (visitedRealDirPaths === null || visitedRealDirPaths === void 0 ? void 0 : visitedRealDirPaths.has(fullPath)) {
            return [];
          }
          visitedRealDirPaths === null || visitedRealDirPaths === void 0 ? void 0 : visitedRealDirPaths.add(fullPath);
          const entries = yield (0, import_promises32.readdir)(fullPath, { withFileTypes: true });
          const results = [];
          for (const e of entries) {
            const entryFullPath = (0, import_node_path55.join)(candidatePath, e.name);
            let entryType = e.isDirectory() ? "dir" : "file";
            if (e.isSymbolicLink()) {
              try {
                const resolvedEntryPath = yield assertContainedRealPath(entryFullPath);
                const resolvedEntryStats = yield (0, import_promises32.stat)(resolvedEntryPath);
                entryType = resolvedEntryStats.isDirectory() ? "dir" : "file";
              } catch (_a20) {
                continue;
              }
            }
            results.push({
              name: e.name,
              type: entryType,
              path: dirPath ? `${dirPath}/${e.name}` : e.name
            });
          }
          return results;
        } catch (_b2) {
          return [];
        }
      });
    },
    fetchFile(filePath) {
      return __awaiter60(this, void 0, void 0, function* () {
        const cached2 = fileContentCache.get(filePath);
        if (cached2 !== void 0) {
          return { content: cached2 };
        }
        const candidatePath = assertContained((0, import_node_path55.join)(basePath, filePath));
        const fullPath = yield assertContainedRealPath(candidatePath);
        yield checkFileSize(fullPath);
        const content = yield (0, import_promises32.readFile)(fullPath, "utf-8");
        fileContentCache.set(filePath, content);
        return { content };
      });
    },
    fileExists(filePath) {
      return __awaiter60(this, void 0, void 0, function* () {
        try {
          const candidatePath = assertContained((0, import_node_path55.join)(basePath, filePath));
          const fullPath = yield assertContainedRealPath(candidatePath);
          const stats = yield (0, import_promises32.stat)(fullPath);
          return stats.isFile();
        } catch (_a20) {
          return false;
        }
      });
    }
  };
}
function resolveLocalPluginLogoUrl(_a19) {
  return __awaiter60(this, arguments, void 0, function* ({ installPath, logo }) {
    const relativeLogoPath = logo === null || logo === void 0 ? void 0 : logo.trim();
    if (!relativeLogoPath || (0, import_node_path55.isAbsolute)(relativeLogoPath) || relativeLogoPath.includes("://")) {
      return void 0;
    }
    try {
      const canonicalRoot = yield (0, import_promises32.realpath)(installPath);
      const targetPath = validateAndResolveSubpath(canonicalRoot, relativeLogoPath);
      const canonicalTarget = yield (0, import_promises32.realpath)(targetPath);
      validateAndResolveSubpath(canonicalRoot, canonicalTarget);
      const targetStats = yield (0, import_promises32.stat)(canonicalTarget);
      if (!targetStats.isFile()) {
        return void 0;
      }
      yield checkFileSize(canonicalTarget);
      return (0, import_node_url6.pathToFileURL)(canonicalTarget).href;
    } catch (_b2) {
      return void 0;
    }
  });
}
function pickIdentity(source) {
  const fields2 = {};
  if (source.version !== void 0) {
    fields2.version = source.version;
  }
  if (source.homepage !== void 0) {
    fields2.homepage = source.homepage;
  }
  if (source.repository !== void 0) {
    fields2.repository = source.repository;
  }
  return fields2;
}
function hasIdentity(fields2) {
  return fields2.version !== void 0 || fields2.homepage !== void 0 || fields2.repository !== void 0;
}
function preferIdentity(preferred, fallback2) {
  var _a19, _b2, _c2;
  return pickIdentity({
    version: (_a19 = preferred.version) !== null && _a19 !== void 0 ? _a19 : fallback2 === null || fallback2 === void 0 ? void 0 : fallback2.version,
    homepage: (_b2 = preferred.homepage) !== null && _b2 !== void 0 ? _b2 : fallback2 === null || fallback2 === void 0 ? void 0 : fallback2.homepage,
    repository: (_c2 = preferred.repository) !== null && _c2 !== void 0 ? _c2 : fallback2 === null || fallback2 === void 0 ? void 0 : fallback2.repository
  });
}
function readLocalPluginManifestData(installPath, pluginDisplayName, pluginLogger) {
  return __awaiter60(this, void 0, void 0, function* () {
    var _a19;
    let identityOnly;
    for (const manifestPath2 of PLUGIN_MANIFEST_PATHS) {
      const fullPath = (0, import_node_path55.join)(installPath, manifestPath2);
      let content;
      try {
        if (yield isSymlink2(fullPath))
          continue;
        const stats = yield (0, import_promises32.stat)(fullPath);
        if (!stats.isFile())
          continue;
        yield checkFileSize(fullPath);
        content = yield readFileNoSymlink(fullPath);
      } catch (_b2) {
        continue;
      }
      const parseResult = parsePluginManifest(content);
      if (!parseResult.success) {
        continue;
      }
      const manifest = parseResult.data;
      const commands = manifest.commands;
      const agents = manifest.agents;
      const skills = manifest.skills;
      const rules = manifest.rules;
      const hooks = manifest.hooks;
      const mcpServers = manifest.mcpServers;
      const hasManifestOptions = commands !== void 0 || agents !== void 0 || skills !== void 0 || rules !== void 0 || hooks !== void 0 || mcpServers !== void 0;
      const displayName2 = typeof manifest.displayName === "string" ? manifest.displayName : void 0;
      const description9 = typeof manifest.description === "string" ? manifest.description : void 0;
      const authorName = (_a19 = manifest.author) === null || _a19 === void 0 ? void 0 : _a19.name;
      const logoUrl = yield resolveLocalPluginLogoUrl({
        installPath,
        logo: manifest.logo
      });
      const identity = pickIdentity(manifest);
      const variables = manifest.variables;
      const capabilities = manifest.capabilities;
      const hasUiMetadata = displayName2 !== void 0 || description9 !== void 0 || authorName !== void 0 || logoUrl !== void 0 || variables !== void 0 || capabilities !== void 0;
      if (!hasManifestOptions && !hasUiMetadata && !hasIdentity(identity)) {
        continue;
      }
      if (!hasManifestOptions && !hasUiMetadata) {
        identityOnly = identityOnly ? Object.assign(Object.assign({}, identityOnly), { fields: preferIdentity(identityOnly.fields, identity) }) : {
          fields: identity,
          path: fullPath,
          relPath: manifestPath2,
          unrecognizedSchemaId: parseResult.unrecognizedSchemaId
        };
        continue;
      }
      if (parseResult.unrecognizedSchemaId !== void 0) {
        pluginLogger.log("debug", `${pluginDisplayName}: ${manifestPath2} declares an unrecognized $schema, loading anyway: ${parseResult.unrecognizedSchemaId}`);
      }
      const mergedIdentity = preferIdentity(identity, identityOnly === null || identityOnly === void 0 ? void 0 : identityOnly.fields);
      const hasMetadata = hasUiMetadata || hasIdentity(mergedIdentity);
      return Object.assign(Object.assign({ manifestFilePath: fullPath }, hasManifestOptions && {
        manifestOptions: {
          commands,
          agents,
          skills,
          rules,
          hooks,
          mcpServers
        }
      }), hasMetadata && {
        metadata: Object.assign(Object.assign({
          displayName: displayName2,
          description: description9,
          authorName,
          logoUrl
        }, mergedIdentity), {
          variables,
          capabilities
        })
      });
    }
    if (identityOnly === void 0) {
      return void 0;
    }
    if (identityOnly.unrecognizedSchemaId !== void 0) {
      pluginLogger.log("debug", `${pluginDisplayName}: ${identityOnly.relPath} declares an unrecognized $schema, loading anyway: ${identityOnly.unrecognizedSchemaId}`);
    }
    return {
      manifestFilePath: identityOnly.path,
      metadata: identityOnly.fields
    };
  });
}
function discoverAndLoadComponents(installPath, manifestOptions) {
  return __awaiter60(this, void 0, void 0, function* () {
    const fetcher = createLocalPluginFileFetcher(installPath);
    const discovery = new PluginComponentDiscovery(fetcher);
    const discovered = yield discovery.discoverComponents({
      manifest: manifestOptions
    });
    const [skills, agents, commands, rules] = yield Promise.all([
      loadSkillsFromDiscovered(fetcher, discovered.skills, installPath),
      loadAgentsFromDiscovered(fetcher, discovered.agents, installPath),
      loadCommandsFromDiscovered(fetcher, discovered.commands, installPath),
      loadRulesFromDiscovered(fetcher, discovered.rules, installPath)
    ]);
    return { skills, agents, commands, rules };
  });
}
function loadSkillsFromDiscovered(fetcher, descriptors, installPath) {
  return __awaiter60(this, void 0, void 0, function* () {
    const skills = [];
    for (const desc of descriptors) {
      try {
        const { content: rawContent } = yield fetcher.fetchFile(desc.path);
        const content = expandPluginVariables(rawContent, installPath);
        const skill = parseSkillContent({ content, relativePath: desc.path });
        if (skill)
          skills.push(skill);
      } catch (_a19) {
      }
    }
    return skills;
  });
}
function loadRulesFromDiscovered(fetcher, descriptors, installPath) {
  return __awaiter60(this, void 0, void 0, function* () {
    const rules = [];
    for (const desc of descriptors) {
      try {
        const { content: rawContent } = yield fetcher.fetchFile(desc.path);
        const content = expandPluginVariables(rawContent, installPath);
        const skill = parseSkillContent({ content, relativePath: desc.path });
        if (skill)
          rules.push(Object.assign(Object.assign({}, skill), { name: desc.name }));
      } catch (_a19) {
      }
    }
    return rules;
  });
}
function loadAgentsFromDiscovered(fetcher, descriptors, installPath) {
  return __awaiter60(this, void 0, void 0, function* () {
    const agents = [];
    for (const desc of descriptors) {
      try {
        const { content: rawContent } = yield fetcher.fetchFile(desc.path);
        const content = expandPluginVariables(rawContent, installPath);
        const agent = parseAgentContent({ content, relativePath: desc.path });
        if (agent)
          agents.push(agent);
      } catch (_a19) {
      }
    }
    return agents;
  });
}
function loadCommandsFromDiscovered(fetcher, descriptors, installPath) {
  return __awaiter60(this, void 0, void 0, function* () {
    const commands = [];
    for (const desc of descriptors) {
      try {
        const { content: rawContent } = yield fetcher.fetchFile(desc.path);
        const content = expandPluginVariables(rawContent, installPath);
        const command = parseCommandContent({ content, relativePath: desc.path });
        if (command)
          commands.push(command);
      } catch (_a19) {
      }
    }
    return commands;
  });
}
function splitCommaSeparatedGlobs(value) {
  const globs = [];
  let start = 0;
  let braceDepth = 0;
  for (let index = 0; index < value.length; index++) {
    const character = value[index];
    if (character === "{") {
      braceDepth++;
    } else if (character === "}" && braceDepth > 0) {
      braceDepth--;
    } else if (character === "," && braceDepth === 0) {
      const glob2 = value.slice(start, index).trim();
      if (glob2)
        globs.push(glob2);
      start = index + 1;
    }
  }
  const glob = value.slice(start).trim();
  if (glob)
    globs.push(glob);
  return globs;
}
function parseGlobs(value) {
  if (typeof value === "string") {
    const globs = splitCommaSeparatedGlobs(value);
    return globs.length > 0 ? globs : void 0;
  }
  if (Array.isArray(value)) {
    const globs = value.filter((g2) => typeof g2 === "string").map((g2) => g2.trim()).filter(Boolean);
    return globs.length > 0 ? globs : void 0;
  }
  return void 0;
}
function parseSkillContent({ content, relativePath }) {
  var _a19, _b2;
  var _c2, _d, _e2;
  try {
    const parsed2 = grayMatter(content);
    const normalizedRelativePath = relativePath.replace(/\\/g, "/");
    const pathSegments = normalizedRelativePath.split("/").filter((segment) => segment.length > 0);
    const parentDirectoryName = pathSegments.length >= 2 ? pathSegments[pathSegments.length - 2] : void 0;
    const fileName = (_c2 = pathSegments[pathSegments.length - 1]) !== null && _c2 !== void 0 ? _c2 : normalizedRelativePath;
    const fallbackName = parentDirectoryName !== null && parentDirectoryName !== void 0 ? parentDirectoryName : fileName.replace(/\.md$/i, "");
    const frontmatterName = typeof parsed2.data.name === "string" ? parsed2.data.name.trim() : void 0;
    const environments = normalizeEnvironmentList((_d = parsed2.data.environments) !== null && _d !== void 0 ? _d : (_a19 = parsed2.data.metadata) === null || _a19 === void 0 ? void 0 : _a19.environments);
    const disabledEnvironments = normalizeEnvironmentList((_e2 = parsed2.data["disabled-environments"]) !== null && _e2 !== void 0 ? _e2 : (_b2 = parsed2.data.metadata) === null || _b2 === void 0 ? void 0 : _b2.disabledEnvironments);
    return {
      path: relativePath,
      name: frontmatterName && frontmatterName.length > 0 ? frontmatterName : fallbackName,
      description: typeof parsed2.data.description === "string" ? parsed2.data.description : void 0,
      globs: parseGlobs(parsed2.data.globs),
      alwaysApply: parsed2.data.alwaysApply === true,
      content,
      environments,
      disabledEnvironments
    };
  } catch (_f) {
    return null;
  }
}
function parsePermissionMode(raw) {
  const normalized = (raw !== null && raw !== void 0 ? raw : "").trim().toLowerCase();
  return normalized === "readonly" ? "readonly" : "default";
}
function parseAgentContent({ content, relativePath }) {
  var _a19;
  try {
    const parsed2 = grayMatter(content);
    const body = parsed2.content.trim();
    if (!body)
      return null;
    let tools;
    if (typeof parsed2.data.tools === "string") {
      tools = parsed2.data.tools.split(",").map((t) => t.trim()).filter(Boolean);
    } else if (Array.isArray(parsed2.data.tools)) {
      tools = parsed2.data.tools.map((t) => typeof t === "string" ? t.trim() : String(t)).filter(Boolean);
    }
    const permissionModeRaw = (_a19 = parsed2.data.permissionMode) !== null && _a19 !== void 0 ? _a19 : parsed2.data.permissionmode;
    const fileName = (0, import_node_path55.basename)(relativePath);
    return {
      path: relativePath,
      name: typeof parsed2.data.name === "string" ? parsed2.data.name : (0, import_node_path55.basename)(fileName, (0, import_node_path55.extname)(fileName)).replace(/[\s_]+/g, "-"),
      description: typeof parsed2.data.description === "string" ? parsed2.data.description : void 0,
      tools,
      model: typeof parsed2.data.model === "string" ? parsed2.data.model : "inherit",
      prompt: body,
      permissionMode: parsePermissionMode(permissionModeRaw)
    };
  } catch (_b2) {
    return null;
  }
}
function parseCommandContent({ content, relativePath }) {
  try {
    const parsed2 = grayMatter(content);
    let argumentHint;
    const argumentHintRaw = parsed2.data["argument-hint"];
    if (typeof argumentHintRaw === "string") {
      argumentHint = argumentHintRaw;
    } else if (Array.isArray(argumentHintRaw)) {
      argumentHint = `[${argumentHintRaw.join(" ")}]`;
    }
    const fileName = (0, import_node_path55.basename)(relativePath);
    return {
      path: relativePath,
      name: typeof parsed2.data.name === "string" ? parsed2.data.name : (0, import_node_path55.basename)(fileName, (0, import_node_path55.extname)(fileName)),
      description: typeof parsed2.data.description === "string" ? parsed2.data.description : void 0,
      argumentHint,
      content: parsed2.content.trim()
    };
  } catch (_a19) {
    return null;
  }
}
function mcpParseOptionsFromPluginSource(sourceInfo) {
  if (sourceInfo === void 0) {
    return void 0;
  }
  return { configuredVariables: sourceInfo.configuredVariables };
}
function createSafeFsPluginMcpFileReader(installPath) {
  return (relativePath) => __awaiter60(this, void 0, void 0, function* () {
    if (!isPathSafe(relativePath)) {
      return null;
    }
    const fullPath = (0, import_node_path55.join)(installPath, relativePath);
    try {
      if (yield isSymlink2(fullPath))
        return null;
      const fileStats = yield (0, import_promises32.stat)(fullPath);
      if (!fileStats.isFile())
        return null;
      yield checkFileSize(fullPath);
      return yield readFileNoSymlink(fullPath);
    } catch (_a19) {
      return null;
    }
  });
}
function readPluginMcpConfigSimple(installPath, sourceInfo, explicitMcpOptions) {
  return __awaiter60(this, void 0, void 0, function* () {
    const mcpOptions = explicitMcpOptions !== null && explicitMcpOptions !== void 0 ? explicitMcpOptions : mcpParseOptionsFromPluginSource(sourceInfo);
    return resolvePluginMcpConfigWithManifestLookup(createSafeFsPluginMcpFileReader(installPath), {
      fallbackFileNames: resolvePluginMcpConfigPaths(),
      manifestPrecedence: "override",
      toSourcePath: (relativePath) => (0, import_node_path55.join)(installPath, relativePath),
      installPathForExpansion: installPath,
      parserOptions: mcpOptions
    });
  });
}
function expandHooksConfigVariables(config2, installPath) {
  const expandedHooks = {};
  for (const [step, scripts] of Object.entries(config2.hooks)) {
    if (!Array.isArray(scripts))
      continue;
    expandedHooks[step] = scripts.map((script) => {
      if ("command" in script && typeof script.command === "string") {
        return Object.assign(Object.assign({}, script), { command: expandPluginVariables(script.command, installPath) });
      }
      if ("prompt" in script && typeof script.prompt === "string") {
        return Object.assign(Object.assign({}, script), { prompt: expandPluginVariables(script.prompt, installPath) });
      }
      return script;
    });
  }
  return Object.assign(Object.assign({}, config2), { hooks: expandedHooks });
}
function loadPluginHooksInternal(installPath, pluginDisplayName, manifestHooks, manifestSourcePath) {
  return __awaiter60(this, void 0, void 0, function* () {
    if (typeof manifestHooks === "object") {
      const result2 = validateAndTransformHooks(manifestHooks, pluginDisplayName);
      if (result2 && "config" in result2) {
        return Object.assign({ config: expandHooksConfigVariables(result2.config, installPath) }, manifestSourcePath !== void 0 && {
          sourcePath: manifestSourcePath
        });
      }
      return result2;
    }
    let hooksPath;
    if (typeof manifestHooks === "string") {
      const resolved = manifestHooks.replace(/^\.\//, "");
      if (!isPathSafe(resolved)) {
        return void 0;
      }
      hooksPath = resolved.endsWith(".json") ? (0, import_node_path55.join)(installPath, resolved) : (0, import_node_path55.join)(installPath, resolved, "hooks.json");
    } else {
      hooksPath = (0, import_node_path55.join)(installPath, "hooks", "hooks.json");
    }
    try {
      if (yield isSymlink2(hooksPath))
        return void 0;
      const st2 = yield (0, import_promises32.stat)(hooksPath);
      if (!st2.isFile())
        return void 0;
    } catch (_a19) {
      return void 0;
    }
    let raw;
    try {
      yield checkFileSize(hooksPath);
      raw = yield (0, import_promises32.readFile)(hooksPath, "utf-8");
    } catch (_b2) {
      return void 0;
    }
    let parsed2;
    try {
      parsed2 = JSON.parse(raw);
    } catch (_c2) {
      return {
        error: {
          source: "claude-plugin",
          message: `Plugin ${pluginDisplayName} ${hooksPath}: invalid JSON`
        }
      };
    }
    const result = validateAndTransformHooks(parsed2, pluginDisplayName);
    if (result && "config" in result) {
      return {
        config: expandHooksConfigVariables(result.config, installPath),
        sourcePath: hooksPath
      };
    }
    return result;
  });
}
function validateAndTransformHooks(parsed2, pluginDisplayName) {
  const schemaType = detectHooksSchema(parsed2);
  if (schemaType === "cursor") {
    const config2 = parsed2;
    const validation = validateHooksConfig(config2);
    if (!validation.isValid) {
      return {
        error: {
          source: "claude-plugin",
          message: `Plugin ${pluginDisplayName} hooks: ${validation.errors.join("; ")}`
        }
      };
    }
    return { config: config2 };
  }
  if (schemaType === "claude-code") {
    const parsedObj = parsed2;
    const parsedHooks = parsedObj === null || parsedObj === void 0 ? void 0 : parsedObj.hooks;
    if (!parsedHooks || Object.keys(parsedHooks).length === 0)
      return void 0;
    const config2 = transformClaudeHooksToConfig(parsedHooks);
    const validation = validateHooksConfig(config2);
    if (!validation.isValid) {
      return {
        error: {
          source: "claude-plugin",
          message: `Plugin ${pluginDisplayName} hooks: ${validation.errors.join("; ")}`
        }
      };
    }
    return { config: config2 };
  }
  return void 0;
}
function loadPluginContentFromDir(installPath, pluginDisplayName, sourceInfo, options2) {
  return __awaiter60(this, void 0, void 0, function* () {
    var _a19, _b2, _c2, _d, _e2, _f, _g, _h, _j, _k;
    var _l, _m, _o2;
    const pluginLogger = (_l = options2 === null || options2 === void 0 ? void 0 : options2.log) !== null && _l !== void 0 ? _l : noopPluginMetricsLogger;
    const manifestData = yield readLocalPluginManifestData(installPath, pluginDisplayName, pluginLogger);
    const mcpOptions = Object.assign(Object.assign({}, (_m = mcpParseOptionsFromPluginSource(sourceInfo)) !== null && _m !== void 0 ? _m : (options2 === null || options2 === void 0 ? void 0 : options2.configuredVariables) ? { configuredVariables: options2.configuredVariables } : void 0), { log: pluginLogger });
    const [components, mcpConfig, hooks] = yield Promise.all([
      discoverAndLoadComponents(installPath, manifestData === null || manifestData === void 0 ? void 0 : manifestData.manifestOptions),
      readPluginMcpConfigSimple(installPath, sourceInfo, mcpOptions),
      loadPluginHooksInternal(installPath, pluginDisplayName, (_a19 = manifestData === null || manifestData === void 0 ? void 0 : manifestData.manifestOptions) === null || _a19 === void 0 ? void 0 : _a19.hooks, manifestData === null || manifestData === void 0 ? void 0 : manifestData.manifestFilePath)
    ]);
    return Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, components), ((_b2 = manifestData === null || manifestData === void 0 ? void 0 : manifestData.metadata) === null || _b2 === void 0 ? void 0 : _b2.displayName) !== void 0 && {
      displayName: manifestData.metadata.displayName
    }), ((_c2 = manifestData === null || manifestData === void 0 ? void 0 : manifestData.metadata) === null || _c2 === void 0 ? void 0 : _c2.description) !== void 0 && {
      description: manifestData.metadata.description
    }), ((_d = manifestData === null || manifestData === void 0 ? void 0 : manifestData.metadata) === null || _d === void 0 ? void 0 : _d.authorName) !== void 0 && {
      authorName: manifestData.metadata.authorName
    }), ((_e2 = manifestData === null || manifestData === void 0 ? void 0 : manifestData.metadata) === null || _e2 === void 0 ? void 0 : _e2.logoUrl) !== void 0 && {
      logoUrl: manifestData.metadata.logoUrl
    }), ((_f = manifestData === null || manifestData === void 0 ? void 0 : manifestData.metadata) === null || _f === void 0 ? void 0 : _f.version) !== void 0 && {
      version: manifestData.metadata.version
    }), ((_g = manifestData === null || manifestData === void 0 ? void 0 : manifestData.metadata) === null || _g === void 0 ? void 0 : _g.homepage) !== void 0 && {
      homepage: manifestData.metadata.homepage
    }), ((_h = manifestData === null || manifestData === void 0 ? void 0 : manifestData.metadata) === null || _h === void 0 ? void 0 : _h.repository) !== void 0 && {
      repository: manifestData.metadata.repository
    }), { variablesSchema: (_j = manifestData === null || manifestData === void 0 ? void 0 : manifestData.metadata) === null || _j === void 0 ? void 0 : _j.variables, mcpConfig, capabilities: (_o2 = (_k = manifestData === null || manifestData === void 0 ? void 0 : manifestData.metadata) === null || _k === void 0 ? void 0 : _k.capabilities) !== null && _o2 !== void 0 ? _o2 : [], hooks });
  });
}
function loadCursorPluginFromPath(installPath, sourceType, sourceInfo, options2) {
  return __awaiter60(this, void 0, void 0, function* () {
    const pluginDisplayName = `${sourceInfo.name}@${sourceInfo.version}`;
    const { displayName: displayName2, description: description9, authorName, logoUrl, version: version3, homepage, repository, variablesSchema, skills, rules, agents, commands, mcpConfig, capabilities, hooks } = yield loadPluginContentFromDir(installPath, pluginDisplayName, sourceInfo, {
      log: options2 === null || options2 === void 0 ? void 0 : options2.log
    });
    const identifier = {
      source: sourceType,
      sourceInfo
    };
    return Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({
      identifier,
      installPath
    }, displayName2 !== void 0 && { displayName: displayName2 }), description9 !== void 0 && { description: description9 }), authorName !== void 0 && { authorName }), logoUrl !== void 0 && { logoUrl }), version3 !== void 0 && { version: version3 }), homepage !== void 0 && { homepage }), repository !== void 0 && { repository }), {
      variablesSchema,
      skills,
      rules,
      agents,
      commands,
      mcpConfig: mcpConfig !== null && mcpConfig !== void 0 ? mcpConfig : void 0,
      capabilities,
      hooks
    });
  });
}
function loadFromMarketplaceSource(options2) {
  return __awaiter60(this, void 0, void 0, function* () {
    var _a19, _b2, _c2, _d, _e2, _f;
    var _g, _h;
    const pluginLogger = (_g = options2.log) !== null && _g !== void 0 ? _g : noopPluginMetricsLogger;
    const startTime = performance.now();
    const { client, userId, teamId, onCursorError, pruneOldVersions, pluginFilter, onPluginsListed } = options2;
    const failures = [];
    const cacheManager = (_h = options2.cacheManager) !== null && _h !== void 0 ? _h : new DefaultPluginCacheManager(options2.userHomeDir);
    const listStartTime = performance.now();
    let response;
    try {
      response = yield client.listEnabledPlugins(userId, teamId);
    } catch (err) {
      pluginLogger.captureException(err, {
        error_type: "list_enabled_plugins"
      });
      pluginLogger.increment("marketplace.source_unavailable", 1);
      pluginLogger.log("error", `marketplace listEnabledPlugins failed after ${(performance.now() - listStartTime).toFixed(1)}ms; treating source as unavailable: ${err instanceof Error ? err.message : String(err)}`);
      return { plugins: [], failures: [], sourceUnavailable: true };
    }
    pluginLogger.log("info", `marketplace listEnabledPlugins completed in ${(performance.now() - listStartTime).toFixed(1)}ms (${response.plugins.length} plugins)`);
    if (onPluginsListed) {
      yield onPluginsListed(response.plugins);
    }
    const plugins = [];
    if (response.listFailures) {
      failures.push(...response.listFailures);
      for (const failure2 of response.listFailures) {
        plugins.push({
          identifier: {
            source: failure2.marketplaceName && failure2.marketplaceName !== "cursor-public" ? "cursor-third-party" : "cursor-first-party",
            sourceInfo: Object.assign(Object.assign({ name: failure2.pluginName, version: "" }, failure2.pluginDbId !== void 0 && {
              pluginDbId: failure2.pluginDbId
            }), { marketplace: failure2.marketplaceName })
          },
          installPath: "",
          loadError: failure2.errorMessage,
          skills: [],
          rules: [],
          agents: [],
          commands: [],
          capabilities: []
        });
      }
    }
    const versionsByKey = /* @__PURE__ */ new Map();
    for (const entry of response.plugins) {
      if (pluginFilter && !pluginFilter(entry)) {
        continue;
      }
      try {
        const slug = (_a19 = entry.marketplace) === null || _a19 === void 0 ? void 0 : _a19.name;
        if (!slug) {
          const noMetadataError = new Error(`Plugin ${entry.name} has no marketplace metadata \u2014 cannot determine cache path`);
          failures.push({
            pluginName: entry.name,
            pluginId: entry.pluginId,
            marketplaceName: void 0,
            errorMessage: noMetadataError.message,
            errorType: "manifest"
          });
          if (onCursorError) {
            onCursorError(entry, noMetadataError);
          }
          continue;
        }
        const cacheKey3 = `${slug}/${entry.pluginId}`;
        let record2 = versionsByKey.get(cacheKey3);
        if (!record2) {
          record2 = { slug, pluginId: entry.pluginId, versions: [] };
          versionsByKey.set(cacheKey3, record2);
        }
        record2.versions.push(entry.version);
        const isCached = yield cacheManager.isCached({
          marketplaceSlug: slug,
          pluginId: entry.pluginId,
          version: entry.version
        });
        let installPath;
        if (isCached) {
          installPath = cacheManager.getCacheDir({
            marketplaceSlug: slug,
            pluginId: entry.pluginId,
            version: entry.version
          });
          pluginLogger.log("info", `loadFromMarketplaceSource: Found cached plugin: ${entry.pluginId} at ${installPath}`, {
            marketplaceSlug: slug,
            pluginId: entry.pluginId,
            gitRef: entry.version,
            marketplaceId: (_b2 = entry.marketplace) === null || _b2 === void 0 ? void 0 : _b2.id
          });
        } else {
          const targetDir = cacheManager.getCacheDir({
            marketplaceSlug: slug,
            pluginId: entry.pluginId,
            version: entry.version
          });
          pluginLogger.log("info", `loadFromMarketplaceSource: Plugin missing from cache, installing: ${entry.pluginId} at ${targetDir}`, {
            marketplaceSlug: slug,
            pluginId: entry.pluginId,
            gitRef: entry.version,
            marketplaceId: (_c2 = entry.marketplace) === null || _c2 === void 0 ? void 0 : _c2.id
          });
          yield (0, import_promises32.mkdir)(targetDir, { recursive: true });
          try {
            yield client.installPlugin(entry, targetDir);
            yield cacheManager.markCacheComplete({
              marketplaceSlug: slug,
              pluginId: entry.pluginId,
              version: entry.version
            });
          } catch (err) {
            try {
              yield (0, import_promises32.rm)(targetDir, { recursive: true, force: true });
            } catch (_j) {
            }
            throw err;
          }
          installPath = targetDir;
        }
        const marketplaceName = (_d = entry.marketplace) === null || _d === void 0 ? void 0 : _d.name;
        const isThirdPartyMarketplace = marketplaceName !== void 0 && marketplaceName !== "cursor-public" && marketplaceName.length > 0;
        const sourceType = isThirdPartyMarketplace ? "cursor-third-party" : "cursor-first-party";
        const sourceInfo = {
          name: entry.name,
          version: entry.version,
          pluginDbId: entry.pluginDbId,
          configuredVariables: entry.configuredVariables,
          marketplace: marketplaceName,
          marketplaceDbId: entry.marketplaceDbId,
          isTeamRequired: entry.isTeamRequired
        };
        const plugin = yield loadCursorPluginFromPath(installPath, sourceType, sourceInfo, {
          log: pluginLogger
        });
        plugins.push(plugin);
        try {
          yield cacheManager.pruneOldVersions({
            marketplaceSlug: slug,
            pluginId: entry.pluginId,
            keepVersions: [entry.version]
          });
        } catch (_k) {
        }
      } catch (err) {
        pluginLogger.captureException(err, {
          error_type: "load_plugin_from_marketplace"
        });
        const error42 = err instanceof Error ? err : new Error(String(err));
        failures.push({
          pluginName: entry.name,
          pluginId: entry.pluginId,
          marketplaceName: (_e2 = entry.marketplace) === null || _e2 === void 0 ? void 0 : _e2.name,
          errorMessage: error42.message,
          errorType: classifyLoadError(error42)
        });
        const marketplaceName = (_f = entry.marketplace) === null || _f === void 0 ? void 0 : _f.name;
        const isThirdParty = marketplaceName !== void 0 && marketplaceName !== "cursor-public" && marketplaceName.length > 0;
        plugins.push({
          identifier: {
            source: isThirdParty ? "cursor-third-party" : "cursor-first-party",
            sourceInfo: {
              name: entry.name,
              version: entry.version,
              pluginDbId: entry.pluginDbId,
              marketplace: marketplaceName,
              marketplaceDbId: entry.marketplaceDbId,
              isTeamRequired: entry.isTeamRequired
            }
          },
          installPath: "",
          loadError: error42.message || "Plugin load failed",
          skills: [],
          rules: [],
          agents: [],
          commands: [],
          capabilities: []
        });
        if (onCursorError) {
          onCursorError(entry, error42);
        }
      }
    }
    if (pruneOldVersions) {
      for (const { slug, pluginId, versions } of versionsByKey.values()) {
        try {
          yield cacheManager.pruneOldVersions({
            marketplaceSlug: slug,
            pluginId,
            keepVersions: versions
          });
        } catch (_l) {
        }
      }
    }
    pluginLogger.log("info", `loadFromMarketplaceSource completed in ${(performance.now() - startTime).toFixed(1)}ms (${plugins.length} plugins loaded, ${failures.length} failures)`);
    return { plugins, failures, sourceUnavailable: false };
  });
}
