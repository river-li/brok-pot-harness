/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/cursor-plugins/dist/manifest-parser.js
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/2
var import_node_crypto21 = require("node:crypto");
var import_node_path47 = require("node:path");
init_zod();

// @recovered-fragment 2/2
var MAX_MANIFEST_SIZE_BYTES = 10 * 1024 * 1024;
var KEBAB_CASE_PATTERN = /^[a-z0-9]([a-z0-9.-]*[a-z0-9])?$/;
var PLUGIN_MANIFEST_PATHS = [
  ".cursor-plugin/plugin.json",
  ".claude-plugin/plugin.json",
  "plugin.json"
];
var PLUGIN_ROOT_DIR_NAMES = [".cursor-plugin", ".claude-plugin"];
var MARKETPLACE_MANIFEST_PATHS = [
  ".cursor-plugin/marketplace.json",
  ".claude-plugin/marketplace.json"
];
var GitHubSourceSchema = external_exports.object({
  source: external_exports.literal("github"),
  repo: external_exports.string().regex(/^[^/]+\/[^/]+$/, "Must be in owner/repo format"),
  ref: external_exports.string().optional(),
  sha: external_exports.string().length(40, "SHA must be 40 characters").regex(/^[a-f0-9]+$/, "SHA must be hexadecimal").optional()
});
var GitUrlSourceSchema = external_exports.object({
  source: external_exports.literal("url"),
  url: external_exports.string().url().endsWith(".git", "URL must end with .git"),
  ref: external_exports.string().optional(),
  sha: external_exports.string().length(40, "SHA must be 40 characters").regex(/^[a-f0-9]+$/, "SHA must be hexadecimal").optional()
});
var GitSubdirSourceSchema = external_exports.object({
  source: external_exports.literal("git-subdir"),
  url: external_exports.string().url().endsWith(".git", "URL must end with .git"),
  path: external_exports.string().min(1),
  ref: external_exports.string().optional(),
  sha: external_exports.string().length(40, "SHA must be 40 characters").regex(/^[a-f0-9]+$/, "SHA must be hexadecimal").optional()
});
var PluginSourceSchema = external_exports.union([external_exports.string(), GitHubSourceSchema, GitUrlSourceSchema, GitSubdirSourceSchema]);
var MIN_CLIENT_VERSION_PATTERN = /^(\d+\.\d+\.\d+(-[0-9A-Za-z.-]+)?|never)$/;
var MIN_CLIENT_VERSION_MESSAGE = 'Must be a semver version (X.Y.Z) or "never"';
var MinClientVersionsSchema = external_exports.object({
  cursor: external_exports.string().regex(MIN_CLIENT_VERSION_PATTERN, MIN_CLIENT_VERSION_MESSAGE).optional(),
  sand: external_exports.string().regex(MIN_CLIENT_VERSION_PATTERN, MIN_CLIENT_VERSION_MESSAGE).optional()
});
function parsePluginMinClientVersions(value) {
  const result = MinClientVersionsSchema.safeParse(value);
  if (!result.success) {
    return void 0;
  }
  if (result.data.cursor === void 0 && result.data.sand === void 0) {
    return void 0;
  }
  return result.data;
}
var AuthorSchema = external_exports.object({
  name: external_exports.string().min(1, "Author name is required"),
  email: external_exports.string().email().optional()
});
var PluginVariablePrimitiveTypeSchema = external_exports.enum([
  "string",
  "number",
  "integer",
  "boolean",
  "object",
  "array",
  "null"
]);
var PluginVariableTypeSchema = external_exports.union([
  PluginVariablePrimitiveTypeSchema,
  external_exports.array(PluginVariablePrimitiveTypeSchema).nonempty().superRefine((types3, ctx) => {
    if (new Set(types3).size !== types3.length) {
      ctx.addIssue({
        code: external_exports.ZodIssueCode.custom,
        message: "Schema type arrays must not contain duplicates"
      });
    }
  })
]);
function validatePluginVariableSchemaShape(schema2, ctx) {
  if (schema2.required !== void 0) {
    if (schema2.properties === void 0) {
      for (const propertyName of schema2.required) {
        ctx.addIssue({
          code: external_exports.ZodIssueCode.custom,
          message: `Required property "${propertyName}" must be declared in properties`,
          path: ["required"]
        });
      }
    } else {
      for (const propertyName of schema2.required) {
        if (!(propertyName in schema2.properties)) {
          ctx.addIssue({
            code: external_exports.ZodIssueCode.custom,
            message: `Required property "${propertyName}" must be declared in properties`,
            path: ["required"]
          });
        }
      }
    }
  }
  if (schema2.minLength !== void 0 && schema2.maxLength !== void 0 && schema2.minLength > schema2.maxLength) {
    ctx.addIssue({
      code: external_exports.ZodIssueCode.custom,
      message: "minLength must be less than or equal to maxLength",
      path: ["minLength"]
    });
  }
  if (schema2.minimum !== void 0 && schema2.maximum !== void 0 && schema2.minimum > schema2.maximum) {
    ctx.addIssue({
      code: external_exports.ZodIssueCode.custom,
      message: "minimum must be less than or equal to maximum",
      path: ["minimum"]
    });
  }
  if (schema2.exclusiveMinimum !== void 0 && schema2.exclusiveMaximum !== void 0 && schema2.exclusiveMinimum >= schema2.exclusiveMaximum) {
    ctx.addIssue({
      code: external_exports.ZodIssueCode.custom,
      message: "exclusiveMinimum must be less than exclusiveMaximum",
      path: ["exclusiveMinimum"]
    });
  }
  if (schema2.minItems !== void 0 && schema2.maxItems !== void 0 && schema2.minItems > schema2.maxItems) {
    ctx.addIssue({
      code: external_exports.ZodIssueCode.custom,
      message: "minItems must be less than or equal to maxItems",
      path: ["minItems"]
    });
  }
  if (schema2.minProperties !== void 0 && schema2.maxProperties !== void 0 && schema2.minProperties > schema2.maxProperties) {
    ctx.addIssue({
      code: external_exports.ZodIssueCode.custom,
      message: "minProperties must be less than or equal to maxProperties",
      path: ["minProperties"]
    });
  }
}
var PluginVariableSchemaSchema = external_exports.lazy(() => external_exports.object({
  type: PluginVariableTypeSchema.optional(),
  title: external_exports.string().optional(),
  description: external_exports.string().optional(),
  format: external_exports.string().optional(),
  writeOnly: external_exports.boolean().optional(),
  default: external_exports.unknown().optional(),
  enum: external_exports.array(external_exports.any()).nonempty().optional(),
  const: external_exports.unknown().optional(),
  properties: external_exports.record(external_exports.string(), PluginVariableSchemaSchema).optional(),
  required: external_exports.array(external_exports.string()).optional(),
  additionalProperties: external_exports.union([external_exports.boolean(), PluginVariableSchemaSchema]).optional(),
  items: external_exports.union([PluginVariableSchemaSchema, external_exports.array(PluginVariableSchemaSchema)]).optional(),
  minLength: external_exports.number().int().nonnegative().optional(),
  maxLength: external_exports.number().int().nonnegative().optional(),
  minimum: external_exports.number().optional(),
  maximum: external_exports.number().optional(),
  exclusiveMinimum: external_exports.number().optional(),
  exclusiveMaximum: external_exports.number().optional(),
  multipleOf: external_exports.number().positive().optional(),
  minItems: external_exports.number().int().nonnegative().optional(),
  maxItems: external_exports.number().int().nonnegative().optional(),
  uniqueItems: external_exports.boolean().optional(),
  minProperties: external_exports.number().int().nonnegative().optional(),
  maxProperties: external_exports.number().int().nonnegative().optional()
}).strict().superRefine(validatePluginVariableSchemaShape));
function parsePluginVariablesJsonSchema(schema2) {
  const result = PluginVariableSchemaSchema.superRefine((value, ctx) => {
    const candidate = value;
    if (candidate.type !== "object") {
      ctx.addIssue({
        code: external_exports.ZodIssueCode.custom,
        message: 'Plugin variable schemas must declare type "object"',
        path: ["type"]
      });
    }
  }).safeParse(schema2);
  if (!result.success) {
    return result;
  }
  return {
    success: true,
    data: result.data
  };
}
var PluginVariablesJsonSchemaSchema = external_exports.unknown().superRefine((value, ctx) => {
  const result = parsePluginVariablesJsonSchema(value);
  if (result.success) {
    return;
  }
  for (const issue2 of result.error.issues) {
    ctx.addIssue(issue2);
  }
}).transform((value) => value);
var MarketplacePluginEntrySchema = external_exports.object({
  name: external_exports.string().min(1).transform((name17) => name17.toLowerCase()).refine((name17) => KEBAB_CASE_PATTERN.test(name17), "Name must be kebab-case (lowercase alphanumeric with hyphens and periods)"),
  displayName: external_exports.string().optional(),
  source: PluginSourceSchema,
  description: external_exports.string().optional(),
  version: external_exports.string().optional(),
  author: AuthorSchema.optional(),
  publisher: external_exports.string().min(1).optional(),
  homepage: external_exports.string().url().optional(),
  repository: external_exports.string().url().optional(),
  license: external_exports.string().optional(),
  keywords: external_exports.array(external_exports.string()).optional(),
  capabilities: CapabilitiesSchema.optional(),
  logo: external_exports.string().optional(),
  category: external_exports.string().optional(),
  tags: external_exports.array(external_exports.string()).optional(),
  minClientVersions: MinClientVersionsSchema.optional(),
  strict: external_exports.boolean().default(true),
  commands: external_exports.union([external_exports.string(), external_exports.array(external_exports.string())]).optional(),
  agents: external_exports.union([external_exports.string(), external_exports.array(external_exports.string())]).optional(),
  skills: external_exports.union([external_exports.string(), external_exports.array(external_exports.string())]).optional(),
  rules: external_exports.union([external_exports.string(), external_exports.array(external_exports.string())]).optional(),
  hooks: external_exports.union([external_exports.string(), external_exports.record(external_exports.unknown())]).optional(),
  variables: PluginVariablesJsonSchemaSchema.optional(),
  mcpServers: external_exports.union([
    external_exports.string(),
    external_exports.record(external_exports.unknown()),
    external_exports.array(external_exports.union([external_exports.string(), external_exports.record(external_exports.unknown())]))
  ]).optional()
});
var MarketplaceMetadataSchema = external_exports.object({
  description: external_exports.string().optional(),
  version: external_exports.string().optional(),
  pluginRoot: external_exports.string().optional()
});
var PluginManifestSchema = external_exports.object({
  name: external_exports.string().min(1).regex(KEBAB_CASE_PATTERN, "Name must be kebab-case (lowercase alphanumeric with hyphens and periods)"),
  displayName: external_exports.string().optional(),
  description: external_exports.string().optional(),
  version: external_exports.string().optional(),
  author: AuthorSchema.optional(),
  publisher: external_exports.string().min(1).optional(),
  homepage: external_exports.string().url().optional(),
  repository: external_exports.string().url().optional(),
  license: external_exports.string().optional(),
  logo: external_exports.string().optional(),
  keywords: external_exports.array(external_exports.string()).optional(),
  capabilities: CapabilitiesSchema.optional(),
  minClientVersions: MinClientVersionsSchema.optional(),
  commands: external_exports.union([external_exports.string(), external_exports.array(external_exports.string())]).optional(),
  agents: external_exports.union([external_exports.string(), external_exports.array(external_exports.string())]).optional(),
  skills: external_exports.union([external_exports.string(), external_exports.array(external_exports.string())]).optional(),
  rules: external_exports.union([external_exports.string(), external_exports.array(external_exports.string())]).optional(),
  hooks: external_exports.union([external_exports.string(), external_exports.record(external_exports.unknown())]).optional(),
  variables: PluginVariablesJsonSchemaSchema.optional(),
  mcpServers: external_exports.union([
    external_exports.string(),
    external_exports.record(external_exports.unknown()),
    external_exports.array(external_exports.union([external_exports.string(), external_exports.record(external_exports.unknown())]))
  ]).optional()
});
function isRecord2(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function normalizeMarketplaceName(value) {
  return value.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]+/g, "-").replace(/-+/g, "-").replace(/^-+|-+$/g, "");
}
function fallbackMarketplaceName(options2) {
  var _a19;
  const repoName = options2.repoName !== void 0 ? normalizeMarketplaceName(options2.repoName) : "";
  if (repoName.length > 0) {
    return repoName;
  }
  return `cursor-marketplace-${(_a19 = options2.fallbackId) !== null && _a19 !== void 0 ? _a19 : (0, import_node_crypto21.randomUUID)()}`;
}
function readMarketplaceName(json3, options2) {
  if (isRecord2(json3) && typeof json3.name === "string") {
    const name17 = normalizeMarketplaceName(json3.name);
    if (name17.length > 0) {
      return name17;
    }
  }
  return fallbackMarketplaceName(options2);
}
function readOwner(json3) {
  if (isRecord2(json3) && isRecord2(json3.owner)) {
    const name17 = typeof json3.owner.name === "string" && json3.owner.name.trim().length > 0 ? json3.owner.name : "Unknown";
    const email3 = typeof json3.owner.email === "string" && json3.owner.email.trim().length > 0 ? json3.owner.email : void 0;
    return Object.assign({ name: name17 }, email3 !== void 0 ? { email: email3 } : {});
  }
  return { name: "Unknown" };
}
function readOptionalString(value) {
  return typeof value === "string" ? value : void 0;
}
function readStringArray(value) {
  if (!Array.isArray(value)) {
    return void 0;
  }
  const strings = value.filter((item) => typeof item === "string");
  return strings.length > 0 ? strings : void 0;
}
function readComponentPaths(value) {
  if (typeof value === "string") {
    return value;
  }
  return readStringArray(value);
}
function readMetadata(json3) {
  if (!isRecord2(json3) || !isRecord2(json3.metadata)) {
    return void 0;
  }
  const metadata = {
    description: readOptionalString(json3.metadata.description),
    version: readOptionalString(json3.metadata.version),
    pluginRoot: readOptionalString(json3.metadata.pluginRoot)
  };
  return metadata.description !== void 0 || metadata.version !== void 0 || metadata.pluginRoot !== void 0 ? metadata : void 0;
}
function readAuthor(value) {
  if (!isRecord2(value)) {
    return void 0;
  }
  const name17 = readOptionalString(value.name);
  if (name17 === void 0 || name17.length === 0) {
    return void 0;
  }
  const email3 = readOptionalString(value.email);
  return Object.assign({ name: name17 }, email3 !== void 0 ? { email: email3 } : {});
}
function readMcpServers(value) {
  if (typeof value === "string" || isRecord2(value)) {
    return value;
  }
  if (Array.isArray(value)) {
    const servers = value.filter((item) => typeof item === "string" || isRecord2(item));
    return servers.length > 0 ? servers : void 0;
  }
  return void 0;
}
function readHooks(value) {
  if (typeof value === "string" || isRecord2(value)) {
    return value;
  }
  return void 0;
}
function readVariables(value) {
  if (value === void 0) {
    return void 0;
  }
  const result = parsePluginVariablesJsonSchema(value);
  return result.success ? result.data : void 0;
}
function readPluginSource(value) {
  if (typeof value === "string") {
    return value;
  }
  if (!isRecord2(value)) {
    return void 0;
  }
  if (value.source === "github" && typeof value.repo === "string" && value.repo.length > 0) {
    return {
      source: "github",
      repo: value.repo,
      ref: readOptionalString(value.ref),
      sha: readOptionalString(value.sha)
    };
  }
  if ((value.source === "url" || value.source === void 0) && typeof value.url === "string" && value.url.length > 0) {
    return {
      source: "url",
      url: value.url,
      ref: readOptionalString(value.ref),
      sha: readOptionalString(value.sha)
    };
  }
  if (value.source === "git-subdir" && typeof value.url === "string" && value.url.length > 0 && typeof value.path === "string" && value.path.length > 0) {
    return {
      source: "git-subdir",
      url: value.url,
      path: value.path,
      ref: readOptionalString(value.ref),
      sha: readOptionalString(value.sha)
    };
  }
  if (typeof value.repo === "string" && value.repo.length > 0) {
    return {
      source: "github",
      repo: value.repo,
      ref: readOptionalString(value.ref),
      sha: readOptionalString(value.sha)
    };
  }
  return void 0;
}
function derivePluginNameFromSource(source) {
  var _a19;
  if (typeof source === "string") {
    const name18 = normalizeMarketplaceName((0, import_node_path47.basename)(source));
    return name18.length > 0 ? name18 : void 0;
  }
  if (source.source === "github") {
    const name18 = normalizeMarketplaceName((_a19 = source.repo.split("/").at(-1)) !== null && _a19 !== void 0 ? _a19 : "");
    return name18.length > 0 ? name18 : void 0;
  }
  if (source.source === "git-subdir") {
    const name18 = normalizeMarketplaceName((0, import_node_path47.basename)(source.path));
    return name18.length > 0 ? name18 : void 0;
  }
  let urlPath = source.url;
  try {
    urlPath = new URL(source.url).pathname;
  } catch (_b2) {
  }
  while (urlPath.endsWith("/")) {
    urlPath = urlPath.slice(0, -1);
  }
  if (urlPath.toLowerCase().endsWith(".git")) {
    urlPath = urlPath.slice(0, -4);
  }
  const name17 = normalizeMarketplaceName((0, import_node_path47.basename)(urlPath));
  return name17.length > 0 ? name17 : void 0;
}
function readMarketplacePluginEntry(rawEntry, index) {
  if (!isRecord2(rawEntry)) {
    return {
      skippedEntry: {
        index,
        error: `Plugin entry at index ${index} is not an object`
      }
    };
  }
  const source = readPluginSource(rawEntry.source);
  if (source === void 0) {
    const rawName = readOptionalString(rawEntry.name);
    return {
      skippedEntry: Object.assign(Object.assign({ index }, rawName !== void 0 && rawName.length > 0 ? { name: rawName } : {}), { error: `Plugin entry at index ${index} has no usable source` })
    };
  }
  const nameFromEntry = typeof rawEntry.name === "string" ? normalizeMarketplaceName(rawEntry.name) : "";
  const name17 = nameFromEntry || derivePluginNameFromSource(source);
  if (name17 === void 0) {
    return {
      skippedEntry: {
        index,
        error: `Plugin entry at index ${index} has no usable name`
      }
    };
  }
  const capabilitiesResult = CapabilitiesSchema.safeParse(rawEntry.capabilities);
  if (rawEntry.capabilities !== void 0 && !capabilitiesResult.success) {
    return {
      skippedEntry: {
        index,
        name: name17,
        error: `Plugin entry at index ${index} has invalid capabilities: ${capabilitiesResult.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join(", ")}`
      }
    };
  }
  const capabilities = capabilitiesResult.success ? capabilitiesResult.data : void 0;
  const minClientVersions = parsePluginMinClientVersions(rawEntry.minClientVersions);
  return {
    entry: Object.assign(Object.assign({ name: name17, displayName: readOptionalString(rawEntry.displayName), source, description: readOptionalString(rawEntry.description), version: readOptionalString(rawEntry.version), author: readAuthor(rawEntry.author), publisher: readOptionalString(rawEntry.publisher), homepage: readOptionalString(rawEntry.homepage), repository: readOptionalString(rawEntry.repository), license: readOptionalString(rawEntry.license), keywords: readStringArray(rawEntry.keywords), logo: readOptionalString(rawEntry.logo), category: readOptionalString(rawEntry.category), tags: readStringArray(rawEntry.tags), strict: typeof rawEntry.strict === "boolean" ? rawEntry.strict : true, commands: readComponentPaths(rawEntry.commands), agents: readComponentPaths(rawEntry.agents), skills: readComponentPaths(rawEntry.skills), rules: readComponentPaths(rawEntry.rules), hooks: readHooks(rawEntry.hooks), variables: readVariables(rawEntry.variables), mcpServers: readMcpServers(rawEntry.mcpServers) }, capabilities !== void 0 && { capabilities }), minClientVersions !== void 0 && { minClientVersions })
  };
}
function parseMarketplaceManifest(content, options2 = {}) {
  if (content.length > MAX_MANIFEST_SIZE_BYTES) {
    return {
      success: false,
      error: `Manifest exceeds maximum size of ${MAX_MANIFEST_SIZE_BYTES} bytes`
    };
  }
  let json3;
  try {
    json3 = JSON.parse(content);
  } catch (e) {
    return {
      success: false,
      error: `Invalid JSON: ${e instanceof Error ? e.message : "Unknown error"}`
    };
  }
  if (!isRecord2(json3)) {
    return {
      success: false,
      error: "Invalid marketplace manifest: expected a JSON object"
    };
  }
  const validPlugins = [];
  const skippedPluginEntries = [];
  const seenNames = /* @__PURE__ */ new Set();
  const rawPlugins = Array.isArray(json3.plugins) ? json3.plugins : [];
  rawPlugins.forEach((rawEntry, index) => {
    const entryResult = readMarketplacePluginEntry(rawEntry, index);
    if ("skippedEntry" in entryResult) {
      skippedPluginEntries.push(entryResult.skippedEntry);
      return;
    }
    if (seenNames.has(entryResult.entry.name)) {
      skippedPluginEntries.push({
        index,
        name: entryResult.entry.name,
        error: `Duplicate plugin name "${entryResult.entry.name}" at index ${index}`
      });
      return;
    }
    seenNames.add(entryResult.entry.name);
    validPlugins.push(entryResult.entry);
  });
  return {
    success: true,
    data: {
      name: readMarketplaceName(json3, options2),
      owner: readOwner(json3),
      description: readOptionalString(json3.description),
      plugins: validPlugins,
      metadata: readMetadata(json3),
      skippedPluginEntries
    }
  };
}
function parsePluginManifest(content) {
  if (content.length > MAX_MANIFEST_SIZE_BYTES) {
    return {
      success: false,
      error: `Manifest exceeds maximum size of ${MAX_MANIFEST_SIZE_BYTES} bytes`
    };
  }
  let json3;
  try {
    json3 = JSON.parse(content);
  } catch (e) {
    return {
      success: false,
      error: `Invalid JSON: ${e instanceof Error ? e.message : "Unknown error"}`
    };
  }
  const schema2 = resolveSchemaVersion(readSchemaId(json3));
  const result = PluginManifestSchema.safeParse(json3);
  if (!result.success) {
    return {
      success: false,
      error: `Invalid plugin manifest: ${result.error.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ")}`,
      details: result.error
    };
  }
  return Object.assign({ success: true, data: result.data }, schema2.kind === "unsupported" && { unrecognizedSchemaId: schema2.id });
}
function parseAndClassifyManifestEntries(plugins, pluginRoot) {
  var _a19, _b2, _c2;
  const results = [];
  for (const entry of plugins) {
    const source = entry.source;
    if (typeof source === "string") {
      const resolved = resolvePluginSourcePath(source, pluginRoot);
      if (resolved !== null) {
        results.push({ entry, kind: "local", localPath: resolved });
      } else {
        results.push({ entry, kind: "unresolvable", rawSource: source });
      }
      continue;
    }
    switch (source.source) {
      case "github":
        results.push({
          entry,
          kind: "external-github",
          externalUrl: `https://github.com/${source.repo}.git`,
          externalRef: source.ref,
          externalSha: source.sha,
          effectiveRef: (_a19 = source.sha) !== null && _a19 !== void 0 ? _a19 : source.ref
        });
        break;
      case "url":
        results.push({
          entry,
          kind: "external-url",
          externalUrl: source.url,
          externalRef: source.ref,
          externalSha: source.sha,
          effectiveRef: (_b2 = source.sha) !== null && _b2 !== void 0 ? _b2 : source.ref
        });
        break;
      case "git-subdir":
        results.push({
          entry,
          kind: "external-git-subdir",
          externalUrl: source.url,
          externalRef: source.ref,
          externalSha: source.sha,
          effectiveRef: (_c2 = source.sha) !== null && _c2 !== void 0 ? _c2 : source.ref,
          subdirPath: source.path
        });
        break;
      default: {
        const _exhaustive = source;
        void _exhaustive;
      }
    }
  }
  return results;
}
function resolvePluginSourcePath(source, pluginRoot) {
  if (typeof source !== "string") {
    return null;
  }
  let path31 = source;
  if (path31.startsWith("./")) {
    path31 = path31.slice(2);
  }
  if (pluginRoot !== void 0) {
    let root = pluginRoot;
    if (root.startsWith("./")) {
      root = root.slice(2);
    }
    if (root.endsWith("/")) {
      root = root.slice(0, -1);
    }
    path31 = `${root}/${path31}`;
  }
  return path31 || ".";
}
function containsPluginRootDir(entryNames) {
  return entryNames.some((name17) => PLUGIN_ROOT_DIR_NAMES.includes(name17));
}
function isPathSafe(path31) {
  if (path31.includes("..")) {
    return false;
  }
  if ((0, import_node_path47.isAbsolute)(path31)) {
    return false;
  }
  if (path31.includes("://")) {
    return false;
  }
  return true;
}

