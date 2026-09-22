/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/cursor-plugins/dist/component-discovery.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
var import_node_path63 = require("node:path");

// @recovered-fragment 2/2
var __awaiter59 = function(thisArg, _arguments, P2, generator) {
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
var MARKDOWN_EXTENSIONS2 = [".md", ".mdc", ".markdown"];
var COMMAND_EXTRA_EXTENSIONS = [".txt"];
var COMMAND_EXTENSIONS = [...MARKDOWN_EXTENSIONS2, ...COMMAND_EXTRA_EXTENSIONS];
var FRONTMATTER_REGEX = /^---\s*\n([\s\S]*?)\n---/;
function toKebabCase(str3) {
  return str3.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9.-]/g, "");
}
function parseNameAndDescription(content) {
  var _a19, _b2;
  const frontmatterMatch = content.match(FRONTMATTER_REGEX);
  if (!frontmatterMatch) {
    return {};
  }
  try {
    const parsed2 = yaml2.load(frontmatterMatch[1], {
      schema: yaml2.JSON_SCHEMA
    });
    if (!parsed2 || typeof parsed2 !== "object") {
      return {};
    }
    const metadata = parsed2.metadata !== null && typeof parsed2.metadata === "object" ? parsed2.metadata : void 0;
    const environments = normalizeEnvironmentList((_a19 = parsed2.environments) !== null && _a19 !== void 0 ? _a19 : metadata === null || metadata === void 0 ? void 0 : metadata.environments);
    const disabledEnvironments = normalizeEnvironmentList((_b2 = parsed2["disabled-environments"]) !== null && _b2 !== void 0 ? _b2 : metadata === null || metadata === void 0 ? void 0 : metadata.disabledEnvironments);
    return {
      disabledEnvironments,
      environments,
      name: typeof parsed2.name === "string" ? parsed2.name : void 0,
      description: typeof parsed2.description === "string" ? parsed2.description : void 0
    };
  } catch (_c2) {
    const raw = frontmatterMatch[1];
    const nameMatch = raw.match(/^name:\s*(.+)$/m);
    const descMatch = raw.match(/^description:\s*(.+)$/m);
    if (nameMatch || descMatch) {
      return {
        name: nameMatch ? nameMatch[1].trim() : void 0,
        description: descMatch ? descMatch[1].trim() : void 0
      };
    }
    return {};
  }
}
function normalizeEnvironmentList(value) {
  if (Array.isArray(value)) {
    const normalized = value.filter((entry) => typeof entry === "string" && entry.length > 0);
    return normalized.length === 0 ? void 0 : normalized;
  }
  if (typeof value === "string") {
    const normalized = value.split(",").map((entry) => entry.trim()).filter((entry) => entry.length > 0);
    return normalized.length === 0 ? void 0 : normalized;
  }
  return void 0;
}
function deriveNameFromPath(filePath) {
  const fileName = (0, import_node_path63.basename)(filePath);
  const baseName = fileName.replace(/\.(md|mdc|markdown|txt)$/i, "");
  return toKebabCase(baseName);
}
function deduplicateByName(components) {
  const seen = /* @__PURE__ */ new Set();
  const result = [];
  for (const component of components) {
    if (!seen.has(component.name)) {
      seen.add(component.name);
      result.push(component);
    }
  }
  return result;
}
var PluginComponentDiscovery = class {
  constructor(fetcher) {
    this.fetcher = fetcher;
  }
  discoverComponents() {
    return __awaiter59(this, arguments, void 0, function* (options2 = {}) {
      var _a19;
      const basePath = (_a19 = options2.basePath) !== null && _a19 !== void 0 ? _a19 : "";
      const basePrefix = basePath ? `${basePath}/` : "";
      const manifest = options2.manifest;
      let rootContents;
      try {
        rootContents = yield this.fetcher.listDirectory(basePath);
      } catch (_b2) {
        rootContents = [];
      }
      const folderNames = new Set(rootContents.filter((item) => item.type === "dir").map((item) => item.name.toLowerCase()));
      const presentMcpConfigFiles = PLUGIN_MCP_CONFIG_FILE_NAMES.filter((name17) => rootContents.some((item) => item.type === "file" && item.name === name17));
      const hasRootSkillMd = rootContents.some((item) => item.type === "file" && item.name === "SKILL.md");
      const [rootSkill, skillsFromManifestOrFolder, agents, hooks, commands, rules, mcpServers] = yield Promise.all([
        // Root-level SKILL.md (only if no manifest.skills defined)
        hasRootSkillMd && (manifest === null || manifest === void 0 ? void 0 : manifest.skills) === void 0 ? this.discoverRootSkill(basePrefix) : Promise.resolve(null),
        // Skills: manifest paths or folder discovery
        (manifest === null || manifest === void 0 ? void 0 : manifest.skills) !== void 0 ? this.discoverFromManifestPaths(basePrefix, manifest.skills, true, MARKDOWN_EXTENSIONS2) : folderNames.has("skills") ? this.discoverSkills(`${basePrefix}skills`) : Promise.resolve([]),
        // Agents: manifest paths or folder discovery
        (manifest === null || manifest === void 0 ? void 0 : manifest.agents) !== void 0 ? this.discoverFromManifestPaths(basePrefix, manifest.agents, false, MARKDOWN_EXTENSIONS2) : folderNames.has("agents") ? this.discoverMarkdownComponents(`${basePrefix}agents`, MARKDOWN_EXTENSIONS2) : Promise.resolve([]),
        // Hooks: manifest or folder discovery
        (manifest === null || manifest === void 0 ? void 0 : manifest.hooks) !== void 0 ? this.discoverHooksFromManifest(basePrefix, manifest.hooks) : folderNames.has("hooks") ? this.discoverHooksFromJson(`${basePrefix}hooks/hooks.json`) : Promise.resolve([]),
        // Commands: manifest paths or folder discovery (also accepts .txt files)
        (manifest === null || manifest === void 0 ? void 0 : manifest.commands) !== void 0 ? this.discoverFromManifestPaths(basePrefix, manifest.commands, false, COMMAND_EXTENSIONS) : folderNames.has("commands") ? this.discoverMarkdownComponents(`${basePrefix}commands`, COMMAND_EXTENSIONS) : Promise.resolve([]),
        // Rules: manifest paths or folder discovery
        (manifest === null || manifest === void 0 ? void 0 : manifest.rules) !== void 0 ? this.discoverFromManifestPaths(basePrefix, manifest.rules, false, MARKDOWN_EXTENSIONS2) : folderNames.has("rules") ? this.discoverMarkdownComponents(`${basePrefix}rules`, MARKDOWN_EXTENSIONS2) : Promise.resolve([]),
        // MCP servers: default config files present in the plugin root plus the
        // manifest's declared `mcpServers` location, via the shared resolver.
        this.discoverMcpServers(basePrefix, manifest === null || manifest === void 0 ? void 0 : manifest.mcpServers, presentMcpConfigFiles)
      ]);
      const combinedSkills = rootSkill ? [rootSkill, ...skillsFromManifestOrFolder] : skillsFromManifestOrFolder;
      return {
        skills: deduplicateByName(combinedSkills),
        agents: deduplicateByName(agents),
        hooks,
        commands: deduplicateByName(commands),
        rules: deduplicateByName(rules),
        mcpServers: mcpServers.servers,
        mcpVariables: mcpServers.variables,
        mcpConfigs: mcpServers.configs
      };
    });
  }
  discoverHooksFromJson(hooksJsonPath) {
    return __awaiter59(this, void 0, void 0, function* () {
      try {
        const exists = yield this.fetcher.fileExists(hooksJsonPath);
        if (!exists) {
          return [];
        }
        const { content } = yield this.fetcher.fetchFile(hooksJsonPath);
        const config2 = JSON.parse(content);
        if (!config2.hooks || typeof config2.hooks !== "object" || Array.isArray(config2.hooks)) {
          return [];
        }
        const hookNames = Object.keys(config2.hooks);
        return hookNames.map((name17) => ({
          name: toKebabCase(name17),
          path: hooksJsonPath,
          description: `Hook: ${name17}`
        }));
      } catch (_a19) {
        return [];
      }
    });
  }
  /**
   * Discover hooks from manifest definition (can be string path or inline object)
   */
  discoverHooksFromManifest(basePrefix, hooksConfig) {
    return __awaiter59(this, void 0, void 0, function* () {
      var _a19;
      if (typeof hooksConfig === "string") {
        if (!isPathSafe(hooksConfig)) {
          return [];
        }
        const fullPath = `${basePrefix}${hooksConfig.replace(/^\.\//, "")}`;
        if (fullPath.endsWith(".json")) {
          return this.discoverHooksFromJson(fullPath);
        }
        return this.discoverHooksFromJson(`${fullPath}/hooks.json`);
      }
      const hooks = (_a19 = hooksConfig.hooks) !== null && _a19 !== void 0 ? _a19 : hooksConfig;
      if (!hooks || typeof hooks !== "object" || Array.isArray(hooks)) {
        return [];
      }
      const hookNames = Object.keys(hooks);
      return hookNames.map((name17) => ({
        name: toKebabCase(name17),
        path: "manifest",
        description: `Hook: ${name17}`
      }));
    });
  }
  /**
   * Discover components from manifest-defined paths.
   * - If paths is a string, treat as directory and discover all matching files
   * - If paths is an array, treat as explicit paths (directories for skills, files for others)
   * - For skills (isSkillDir=true), look for SKILL.md in each directory
   * - `extensions` controls which file extensions are accepted (defaults to MARKDOWN_EXTENSIONS)
   */
  discoverFromManifestPaths(basePrefix_1, paths_1) {
    return __awaiter59(this, arguments, void 0, function* (basePrefix, paths, isSkillDir = false, extensions = MARKDOWN_EXTENSIONS2) {
      var _a19, _b2;
      if (typeof paths === "string") {
        if (!isPathSafe(paths)) {
          return [];
        }
        const dirPath = `${basePrefix}${paths.replace(/^\.\//, "")}`.replace(/\/$/, "");
        if (isSkillDir) {
          return this.discoverSkills(dirPath);
        }
        return this.discoverMarkdownComponents(dirPath, extensions);
      }
      const results = [];
      for (const itemPath of paths) {
        try {
          if (!isPathSafe(itemPath)) {
            continue;
          }
          const fullPath = `${basePrefix}${itemPath.replace(/^\.\//, "")}`;
          if (isSkillDir) {
            const skillMdPath = fullPath.endsWith("SKILL.md") ? fullPath : `${fullPath.replace(/\/$/, "")}/SKILL.md`;
            const exists = yield this.fetcher.fileExists(skillMdPath);
            if (!exists) {
              const dirPath2 = fullPath.replace(/\/$/, "");
              const discovered = yield this.discoverSkills(dirPath2);
              results.push(...discovered);
              continue;
            }
            const dirPath = fullPath.endsWith("SKILL.md") ? fullPath.slice(0, -"SKILL.md".length).replace(/\/$/, "") : fullPath;
            let finalName = deriveNameFromPath(dirPath);
            const { content } = yield this.fetcher.fetchFile(skillMdPath);
            const parsed2 = parseNameAndDescription(content);
            finalName = (_a19 = parsed2.name) !== null && _a19 !== void 0 ? _a19 : finalName;
            if (finalName) {
              const component = {
                disabledEnvironments: parsed2.disabledEnvironments,
                environments: parsed2.environments,
                name: toKebabCase(finalName),
                path: skillMdPath
              };
              if (parsed2.description !== void 0) {
                component.description = parsed2.description;
              }
              results.push(component);
            }
          } else {
            const exists = yield this.fetcher.fileExists(fullPath);
            if (!exists) {
              continue;
            }
            let finalName = deriveNameFromPath(fullPath);
            const { content } = yield this.fetcher.fetchFile(fullPath);
            const parsed2 = parseNameAndDescription(content);
            finalName = (_b2 = parsed2.name) !== null && _b2 !== void 0 ? _b2 : finalName;
            const description9 = parsed2.description;
            if (finalName) {
              const component = {
                name: toKebabCase(finalName),
                path: fullPath
              };
              if (description9 !== void 0) {
                component.description = description9;
              }
              results.push(component);
            }
          }
        } catch (_c2) {
        }
      }
      return results;
    });
  }
  discoverMarkdownComponents(folderPath_1) {
    return __awaiter59(this, arguments, void 0, function* (folderPath, extensions = MARKDOWN_EXTENSIONS2, visitedRealDirPaths = /* @__PURE__ */ new Set()) {
      let contents;
      try {
        contents = yield this.fetcher.listDirectory(folderPath, visitedRealDirPaths);
      } catch (_a19) {
        return [];
      }
      const matchingFiles = contents.filter((item) => item.type === "file" && extensions.some((ext2) => item.name.endsWith(ext2)));
      const subdirs = contents.filter((item) => item.type === "dir");
      const [fileResults, subdirResults] = yield Promise.all([
        Promise.all(matchingFiles.map((file2) => __awaiter59(this, void 0, void 0, function* () {
          try {
            let finalName = deriveNameFromPath(file2.name);
            const { content } = yield this.fetcher.fetchFile(file2.path);
            const parsed2 = parseNameAndDescription(content);
            finalName = parsed2.name ? toKebabCase(parsed2.name) : finalName;
            const description9 = parsed2.description;
            if (!finalName) {
              return null;
            }
            const component = {
              name: finalName,
              path: file2.path
            };
            if (description9 !== void 0) {
              component.description = description9;
            }
            return component;
          } catch (_a19) {
            return null;
          }
        }))),
        // Recurse into subdirectories to find nested files
        Promise.all(subdirs.map((dir) => this.discoverMarkdownComponents(dir.path, extensions, visitedRealDirPaths)))
      ]);
      return [
        ...fileResults.filter((r) => r !== null),
        ...subdirResults.flat()
      ];
    });
  }
  /**
   * Discover a root-level SKILL.md file (when the plugin itself is a skill)
   */
  discoverRootSkill(basePrefix) {
    return __awaiter59(this, void 0, void 0, function* () {
      try {
        const skillMdPath = `${basePrefix}SKILL.md`;
        const dirName = (0, import_node_path63.basename)(basePrefix.replace(/[\\/]+$/, ""));
        let finalName = toKebabCase(dirName);
        const { content } = yield this.fetcher.fetchFile(skillMdPath);
        const parsed2 = parseNameAndDescription(content);
        finalName = parsed2.name ? toKebabCase(parsed2.name) : finalName;
        if (!finalName) {
          return null;
        }
        const component = {
          disabledEnvironments: parsed2.disabledEnvironments,
          environments: parsed2.environments,
          name: finalName,
          path: skillMdPath
        };
        if (parsed2.description !== void 0) {
          component.description = parsed2.description;
        }
        return component;
      } catch (_a19) {
        return null;
      }
    });
  }
  discoverSkills(skillsPath) {
    return __awaiter59(this, void 0, void 0, function* () {
      let contents;
      try {
        contents = yield this.fetcher.listDirectory(skillsPath);
      } catch (_a19) {
        return [];
      }
      const skillDirs = contents.filter((item) => item.type === "dir");
      const results = yield Promise.all(skillDirs.map((dir) => __awaiter59(this, void 0, void 0, function* () {
        try {
          const skillMdPath = `${dir.path}/SKILL.md`;
          const exists = yield this.fetcher.fileExists(skillMdPath);
          if (!exists) {
            return null;
          }
          const { content } = yield this.fetcher.fetchFile(skillMdPath);
          const parsed2 = parseNameAndDescription(content);
          const finalName = parsed2.name ? toKebabCase(parsed2.name) : toKebabCase(dir.name);
          if (!finalName) {
            return null;
          }
          const component = {
            disabledEnvironments: parsed2.disabledEnvironments,
            environments: parsed2.environments,
            name: finalName,
            path: skillMdPath
          };
          if (parsed2.description !== void 0) {
            component.description = parsed2.description;
          }
          return component;
        } catch (_a19) {
          return null;
        }
      })));
      return results.filter((r) => r !== null);
    });
  }
  /**
   * Discover MCP servers from the default config files (.mcp.json / mcp.json)
   * and the manifest's declared `mcpServers` location, via the shared resolver.
   * Returns one descriptor per server (name + defining source path), plus the
   * `${VAR}` placeholders the config leaves unresolved. Default config files
   * take precedence over the manifest on name conflicts, matching legacy
   * indexing behavior.
   */
  discoverMcpServers(basePrefix, manifestMcpServers, presentMcpConfigFiles) {
    return __awaiter59(this, void 0, void 0, function* () {
      var _a19;
      const fetched = /* @__PURE__ */ new Map();
      const readFileContent = (relativePath) => __awaiter59(this, void 0, void 0, function* () {
        const cached2 = fetched.get(relativePath);
        if (cached2 !== void 0) {
          return cached2;
        }
        const pending = this.fetcher.fetchFile(`${basePrefix}${relativePath}`).then(({ content }) => content).catch(() => null);
        fetched.set(relativePath, pending);
        return pending;
      });
      const resolveWith = (manifestPrecedence) => __awaiter59(this, void 0, void 0, function* () {
        return resolvePluginMcpConfigFromReader(readFileContent, manifestMcpServers, manifestMcpServers !== void 0 ? "manifest" : void 0, {
          // Only probe default config files known to exist (from the directory
          // listing) to avoid speculative reads of absent files.
          fallbackFileNames: presentMcpConfigFiles,
          manifestPrecedence,
          toSourcePath: (relativePath) => `${basePrefix}${relativePath}`,
          parserOptions: { skipExpansion: true }
        });
      });
      const resolved = yield resolveWith("fill");
      if ((resolved === null || resolved === void 0 ? void 0 : resolved.mcpServers) === void 0) {
        return { servers: [], variables: void 0, configs: void 0 };
      }
      const runtimeResolved = manifestMcpServers === void 0 ? resolved : yield resolveWith("override");
      const runtimeServers = (_a19 = runtimeResolved === null || runtimeResolved === void 0 ? void 0 : runtimeResolved.mcpServers) !== null && _a19 !== void 0 ? _a19 : resolved.mcpServers;
      const configs = {};
      for (const [name17, config2] of Object.entries(runtimeServers)) {
        configs[name17] = config2;
      }
      return {
        servers: Object.keys(resolved.mcpServers).map((name17) => {
          var _a20;
          var _b2;
          return {
            name: toKebabCase(name17),
            path: (_b2 = (_a20 = resolved.mcpServerSourcePaths) === null || _a20 === void 0 ? void 0 : _a20[name17]) !== null && _b2 !== void 0 ? _b2 : "manifest"
          };
        }),
        // `skipExpansion` above keeps `${VAR}` intact, so the config still shows
        // which values it expects the installer to supply.
        variables: inferMcpPlaceholderVariables(runtimeResolved !== null && runtimeResolved !== void 0 ? runtimeResolved : resolved),
        configs
      };
    });
  }
};

