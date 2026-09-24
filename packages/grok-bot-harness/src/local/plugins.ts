/** Filesystem ports for the retained plugin loader, marketplace manager and MCP
 * engine. Bundle parsing, variable fields, skills and tool execution stay in
 * their original modules. */
import {
  chmodSync,
  existsSync,
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";
import {
  hashLocalPluginDirectory,
  listLocalPluginPointers,
  localPluginId,
  localPluginServerId,
  pluginBundlePath,
  removeLocalPluginPointer,
  snapshotLocalPlugin,
  writeAtomicJson,
  writeLocalPluginPointer,
  type LocalPluginPointer,
} from "./plugin-files.js";
import {
  MARKETPLACE_SOURCES,
  stageMarketplaceSource,
  type MarketplaceProvenance,
  type MarketplaceSource,
} from "./marketplace.js";

type Json = Record<string, any>;
type Installed = LocalPluginPointer & {
  variables: Json;
  marketplace?: MarketplaceProvenance;
  baselineFiles?: Record<string, string>;
  effectiveDigest?: string;
};
type State = { version: 1; plugins: Record<string, Installed> };
type Ports = {
  load(path: string, sourceInfo: Json): Promise<Json>;
  fields(schema: unknown): { fields: Json[]; unsupportedFieldKeys: string[] };
  validateVariables(schema: unknown, values: Json): boolean;
  validateConfig(value: unknown): { mcpServers: Record<string, Json> };
  validateName(value: string): string;
  validateManifest(content: string): { success: boolean };
};
const mutations = new Map<string, Promise<unknown>>();
const serverPrefix = "local_plugin_";
function curatedSource(pluginId: string) {
  return MARKETPLACE_SOURCES.find((source) => localPluginId(source.slug) === pluginId);
}
function safePluginFile(directory: string, path: string) {
  const target = resolve(directory, path), part = relative(directory, target);
  if (part === ".." || part.startsWith(".." + sep) || part.includes(sep + ".." + sep))
    throw Error("Plugin path escapes its snapshot.");
  return target;
}
function fileMode(entry: string) {
  return entry.endsWith(":755") ? 0o755 : 0o644;
}
function changesFromBaseline(
  actual: Record<string, string>,
  baseline: Record<string, string>,
) {
  return [...new Set([...Object.keys(actual), ...Object.keys(baseline)])]
    .filter((path) => actual[path] !== baseline[path])
    .sort((a, b) => a.localeCompare(b));
}
function carryLocalEdits(args: {
  previousPath: string;
  stagingPath: string;
  actualFiles: Record<string, string>;
  baselineFiles: Record<string, string>;
  oldSourceFiles: Record<string, string>;
  newSourceFiles: Record<string, string>;
}) {
  const changedPaths = changesFromBaseline(args.actualFiles, args.baselineFiles);
  const conflicts = changedPaths.filter(
    (path) => args.oldSourceFiles[path] !== args.newSourceFiles[path],
  );
  if (conflicts.length > 0)
    throw Error(
      `This update conflicts with local edits to: ${conflicts.join(", ")}. Resolve those paths before updating.`,
    );
  for (const path of changedPaths) {
    const from = safePluginFile(args.previousPath, path);
    const to = safePluginFile(args.stagingPath, path);
    if (!Object.hasOwn(args.actualFiles, path)) {
      rmSync(to, { recursive: true, force: true });
      continue;
    }
    mkdirSync(dirname(to), { recursive: true, mode: 0o700 });
    writeFileSync(to, readFileSync(from), { mode: fileMode(args.actualFiles[path]), flag: "w" });
    chmodSync(to, fileMode(args.actualFiles[path]));
  }
  return changedPaths;
}
function sourceDescription(source: MarketplaceSource) {
  return source.description;
}
function curatedVariableFields(source: MarketplaceSource) {
  if (source.kind !== "mcp") return [];
  return [
    {
      key: "FIRECRAWL_MCP_URL",
      label: "Firecrawl MCP endpoint",
      type: "string",
      placeholder: "https://mcp.firecrawl.dev/v2/mcp",
      isRequired: false,
      isSecret: false,
      defaultValue: "https://mcp.firecrawl.dev/v2/mcp",
      hint: "Use a compatible custom server.",
    },
    {
      key: "FIRECRAWL_API_KEY",
      label: "Firecrawl API key",
      type: "string",
      placeholder: "FIRECRAWL_API_KEY",
      isRequired: true,
      isSecret: true,
      hint: "Saved by the Host on this server; the marketplace catalog never returns its value.",
    },
  ];
}
export function createLocalPluginStore(root: string, ports: Ports) {
  const file = join(root, "plugins", "local-installs.json");
  const read = (): State => {
    if (!existsSync(file)) return { version: 1, plugins: {} };
    const state = JSON.parse(readFileSync(file, "utf8")) as State;
    if (
      !state ||
      state.version !== 1 ||
      !state.plugins ||
      typeof state.plugins !== "object" ||
      Array.isArray(state.plugins)
    )
      throw Error("Invalid local plugin install state.");
    for (const [id, value] of Object.entries(state.plugins)) {
      if (
        !value ||
        typeof value.slug !== "string" ||
        localPluginId(value.slug) !== id ||
        value.version !== 1 ||
        !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value.slug) ||
        !/^[a-f0-9]{64}$/.test(value.digest) ||
        !value.variables ||
        typeof value.variables !== "object" ||
        Array.isArray(value.variables)
      )
        throw Error("Invalid local plugin installation.");
      if (value.marketplace !== undefined) {
        const source = value.marketplace;
        if (
          !source ||
          typeof source.entryId !== "string" ||
          typeof source.sourceUrl !== "string" ||
          typeof source.revision !== "string" ||
          !/^[a-f0-9]{40}$/.test(source.revision) ||
          typeof source.terms !== "string" ||
          typeof source.licenseEvidence !== "string" ||
          !/^[a-f0-9]{64}$/.test(source.upstreamDigest) ||
          !source.upstreamFiles ||
          typeof source.upstreamFiles !== "object" ||
          !source.installedSourceFiles ||
          typeof source.installedSourceFiles !== "object" ||
          !value.baselineFiles ||
          typeof value.baselineFiles !== "object" ||
          Array.isArray(value.baselineFiles) ||
          (value.effectiveDigest !== undefined &&
            !/^[a-f0-9]{64}$/.test(value.effectiveDigest))
        )
          throw Error("Invalid marketplace provenance record.");
      }
    }
    // The install record is authoritative. current.json exists only for the
    // retained local plugin loader and can always be reconstructed after a
    // crash between the record commit and pointer update.
    for (const value of Object.values(state.plugins)) {
      if (!value.marketplace) continue;
      let pointer: LocalPluginPointer | undefined;
      try {
        pointer = JSON.parse(
          readFileSync(
            join(root, "plugins", "local", value.slug, "current.json"),
            "utf8",
          ),
        ) as LocalPluginPointer;
      } catch {
        pointer = undefined;
      }
      if (
        pointer?.version !== value.version ||
        pointer.slug !== value.slug ||
        pointer.digest !== value.digest
      )
        writeLocalPluginPointer(root, value);
    }
    return state;
  };
  const mutate = <T>(operation: () => Promise<T>): Promise<T> => {
    const previous = mutations.get(file) ?? Promise.resolve();
    const next = previous.catch(() => {}).then(operation);
    mutations.set(file, next);
    void next
      .finally(() => {
        if (mutations.get(file) === next) mutations.delete(file);
      })
      .catch(() => {});
    return next;
  };
  const load = async (pointer: LocalPluginPointer, variables: Json = {}) => {
    const directory = pluginBundlePath(root, pointer);
    for (const manifest of [
      ".cursor-plugin/plugin.json",
      ".claude-plugin/plugin.json",
    ]) {
      const filename = join(directory, manifest);
      if (
        existsSync(filename) &&
        !ports.validateManifest(readFileSync(filename, "utf8")).success
      )
        throw Error(`Invalid manifest in local plugin ${pointer.slug}.`);
    }
    const plugin = await ports.load(directory, {
      name: pointer.slug,
      version: pointer.digest,
      localPluginId: localPluginId(pointer.slug),
      configuredVariables: variables,
    });
    if (plugin.loadError)
      throw Error(`Cannot load local plugin ${pointer.slug}.`);
    try {
      ports.validateConfig(plugin.mcpConfig ?? { mcpServers: {} });
    } catch {
      throw Error(`Invalid MCP configuration in local plugin ${pointer.slug}.`);
    }
    return plugin;
  };
  const rows = (pointer: LocalPluginPointer, plugin: Json) => {
    const config = ports.validateConfig(plugin.mcpConfig ?? { mcpServers: {} });
    return Object.entries(config.mcpServers).map(([name, server]) => {
      ports.validateName(name);
      const serverIdentifier = ports.validateName(
        `${serverPrefix}${localPluginId(pointer.slug)}_${name}`,
      );
      return {
        id: localPluginServerId(pointer.slug, name),
        name,
        serverIdentifier,
        pluginId: localPluginId(pointer.slug),
        config: server,
        isTeamServer: false,
        disabledByTeamAdminPolicy: false,
        hasStaticCredentialHeaders:
          !!server.headers && Object.keys(server.headers).length > 0,
      };
    });
  };
  const listServers = async () => {
    const servers = [];
    for (const pointer of Object.values(read().plugins))
      servers.push(...rows(pointer, await load(pointer, pointer.variables)));
    return { servers };
  };
  const configure = (
    request: { pluginId: bigint | string; variables?: Json },
    update: boolean,
  ) =>
    mutate(async () => {
      const id = String(request.pluginId),
        state = read();
      const installed = state.plugins[id];
      if (update && !installed)
        throw Error("Local plugin is not installed.");
      // Replaying install after a lost response never replaces saved values or
      // a user's configuration with an empty form payload.
      if (!update && installed) return;
      let pointer: LocalPluginPointer | undefined = installed?.marketplace
        ? { version: installed.version, slug: installed.slug, digest: installed.digest }
        : listLocalPluginPointers(root).find(
        (p) => localPluginId(p.slug) === id,
      );
      const source = curatedSource(id);
      let marketplace = installed?.marketplace;
      let baselineFiles = installed?.baselineFiles;
      let stage = "";
      const sourceRevisionChanged =
        installed?.marketplace !== undefined &&
        installed.marketplace.revision !== source?.revision;
      const shouldStageMarketplace =
        source !== undefined &&
        (installed?.marketplace !== undefined
          ? sourceRevisionChanged
          : pointer === undefined);
      if (shouldStageMarketplace && source) {
        if (installed?.marketplace && !update)
          throw Error("Marketplace install already exists; use update to refresh it.");
        mkdirSync(join(root, "plugins"), { recursive: true, mode: 0o700 });
        stage = mkdtempSync(join(root, "plugins", ".marketplace-"));
        try {
          const staged = await stageMarketplaceSource(source.entryId, stage);
          const pristineFiles = hashLocalPluginDirectory(stage).files;
          if (installed?.marketplace) {
            const previousPath = pluginBundlePath(root, installed);
            const actual = hashLocalPluginDirectory(previousPath);
            carryLocalEdits({
              previousPath,
              stagingPath: stage,
              actualFiles: actual.files,
              baselineFiles: installed.baselineFiles ?? {},
              oldSourceFiles: installed.marketplace.installedSourceFiles,
              newSourceFiles: staged.provenance.installedSourceFiles,
            });
          }
          const snapshot = snapshotLocalPlugin(root, stage, source.slug);
          pointer = {
            version: snapshot.version,
            slug: snapshot.slug,
            digest: snapshot.digest,
          };
          marketplace = staged.provenance;
          baselineFiles = pristineFiles;
        } finally {
          rmSync(stage, { recursive: true, force: true });
        }
      }
      if (!pointer)
        throw Error("Local plugin is missing from the catalog. Import its directory first.");
      const metadata = await load(pointer);
      const variables = {
        ...(installed?.variables ?? {}),
        ...(request.variables ?? {}),
      };
      const schema = metadata.variablesSchema;
      if (schema) {
        for (const [key, value] of Object.entries(schema.properties ?? {}) as [
          string,
          Json,
        ][]) {
          if (!Object.hasOwn(variables, key) && value.default !== undefined)
            variables[key] = structuredClone(value.default);
        }
        if (!ports.validateVariables(schema, variables))
          throw Error(
            `Variables for ${pointer.slug} do not match its manifest schema.`,
          );
      }
      // Validate the resolved configuration before making the installation visible.
      rows(pointer, await load(pointer, variables));
      const effective = hashLocalPluginDirectory(pluginBundlePath(root, pointer));
      state.plugins[id] = {
        version: pointer.version,
        slug: pointer.slug,
        digest: pointer.digest,
        variables,
        ...(marketplace === undefined ? {} : { marketplace }),
        ...(baselineFiles === undefined ? {} : { baselineFiles }),
        ...(marketplace === undefined ? {} : { effectiveDigest: effective.digest }),
      };
      // Commit the record first. On restart read() repairs current.json from it.
      writeAtomicJson(file, state);
      if (marketplace) writeLocalPluginPointer(root, pointer);
    });
  return {
    file,
    listServers,
    async catalog() {
      const plugins = [];
      const state = read();
      const curatedIds = new Set<string>();
      const pointers = listLocalPluginPointers(root);
      for (const source of MARKETPLACE_SOURCES) {
        const pluginId = localPluginId(source.slug);
        const existingPointer = pointers.find(
          (pointer) => localPluginId(pointer.slug) === pluginId,
        );
        if (existingPointer && !state.plugins[pluginId]?.marketplace) continue;
        curatedIds.add(pluginId);
        const installed = state.plugins[pluginId];
        const loaded = installed
          ? await load(installed, installed.variables)
          : undefined;
        const actual = installed
          ? hashLocalPluginDirectory(pluginBundlePath(root, installed))
          : undefined;
        const modifiedPaths = installed?.baselineFiles && actual
          ? changesFromBaseline(actual.files, installed.baselineFiles)
          : [];
        const fields = loaded
          ? ports.fields(loaded.variablesSchema)
          : { fields: curatedVariableFields(source), unsupportedFieldKeys: [] };
        const skills = loaded
          ? loaded.skills.map((skill: Json) => ({
              name: skill.name,
              description: skill.description || "",
            }))
          : source.supportedSkills;
        const missingFields = fields.fields
          .filter((field) => field.isRequired &&
            !(typeof installed?.variables[field.key] === "string"
              ? installed?.variables[field.key].trim().length > 0
              : installed?.variables[field.key] !== undefined))
          .map((field) => field.key);
        const provenance = installed?.marketplace;
        plugins.push({
          pluginId,
          name: source.slug,
          pluginName: source.slug,
          displayName: source.displayName,
          description: sourceDescription(source),
          category: source.kind === "mcp" ? "Web Research" : "Skills",
          repositoryUrl: `https://github.com/${source.owner}/${source.repository}`,
          websiteUrl: source.sourceUrl,
          connectors:
            source.kind === "mcp"
              ? [{ name: "firecrawl", description: "HTTP MCP using a server-side bearer key." }]
              : [],
          skills,
          variableFields: fields.fields,
          unsupportedVariableFieldKeys: fields.unsupportedFieldKeys,
          marketplaceMetadata: {
            kind: source.kind,
            sourceUrl: provenance?.sourceUrl ?? source.sourceUrl,
            revision: provenance?.revision ?? source.revision,
            availableRevision: source.revision,
            updateAvailable: provenance !== undefined && provenance.revision !== source.revision,
            terms: provenance?.terms ?? source.terms,
            licenseEvidence: provenance?.licenseEvidence ?? source.licenseEvidence,
            upstreamDigest: provenance?.upstreamDigest,
            effectiveDigest: actual?.digest,
            skillCount: skills.length,
            connectorCount: source.kind === "mcp" ? 1 : 0,
            installationState: installed ? "installed" : "not_installed",
            configurationState: !installed
              ? "not_configured"
              : fields.fields.length === 0
                ? "not_required"
                : missingFields.length > 0
                  ? "awaiting_configuration"
                  : "configured",
            configuredVariableKeys: installed ? Object.keys(installed.variables) : [],
            missingRequiredFields: missingFields,
            modifiedPaths,
            commands: source.omittedComponents.filter((item) => item.kind === "command"),
            routines: source.omittedComponents.filter((item) => item.kind === "routine"),
            dependencies: source.dependencies,
            removalEffect: "The installed Skill and MCP configuration are removed; the Bot profile remains.",
          },
        });
      }
      for (const pointer of pointers) {
        const pluginId = localPluginId(pointer.slug);
        if (curatedIds.has(pluginId)) continue;
        const plugin = await load(pointer),
          variables = ports.fields(plugin.variablesSchema);
        plugins.push({
          pluginId,
          name: pointer.slug,
          pluginName: pointer.slug,
          displayName: plugin.displayName || pointer.slug,
          description: [
            plugin.description || "",
            MARKETPLACE_SOURCES.some((source) => source.slug === pointer.slug)
              ? "This local directory uses the reserved slug for a curated starter, so marketplace source provenance is unavailable. Remove this local import before installing that starter."
              : "",
          ].filter(Boolean).join("\n\n"),
          category: "Local",
          repositoryUrl: plugin.repository,
          websiteUrl: plugin.homepage,
          connectors: Object.keys(plugin.mcpConfig?.mcpServers ?? {}).map(
            (name) => ({ name, description: "" }),
          ),
          skills: plugin.skills.map((skill: Json) => ({
            name: skill.name,
            description: skill.description || "",
          })),
          variableFields: variables.fields,
          unsupportedVariableFieldKeys: variables.unsupportedFieldKeys,
        });
      }
      return {
        plugins,
        includesPrivateMarketplaces: false,
        memberPublishMarketplaces: [],
      };
    },
    async effective() {
      const entries = [];
      for (const [pluginId, pointer] of Object.entries(read().plugins)) {
        const plugin = await load(pointer, pointer.variables);
        const actual = hashLocalPluginDirectory(pluginBundlePath(root, pointer));
        const modifiedPaths = pointer.baselineFiles
          ? changesFromBaseline(actual.files, pointer.baselineFiles)
          : [];
        entries.push({
          pluginId,
          name: pointer.slug,
          displayName: plugin.displayName || pointer.slug,
          installMode: "user",
          isEnabled: true,
          configuredVariableKeys: Object.keys(pointer.variables),
          ...(pointer.marketplace
            ? {
                sourceUrl: pointer.marketplace.sourceUrl,
                sourceRevision: pointer.marketplace.revision,
                terms: pointer.marketplace.terms,
                upstreamDigest: pointer.marketplace.upstreamDigest,
                effectiveDigest: actual.digest,
                hasLocalEdits: modifiedPaths.length > 0,
                modifiedPaths,
              }
            : {}),
        });
      }
      return entries;
    },
    async installedContents() {
      const state = read(),
        plugins = [];
      for (const pointer of Object.values(state.plugins))
        plugins.push(await load(pointer, pointer.variables));
      return {
        plugins,
        authBlocked: [],
        listedPluginIds: Object.keys(state.plugins),
        listedCacheKeys: [],
        publisherFacts: new Map(),
        currentUserId: null,
      };
    },
    installPlugin: (request: { pluginId: bigint | string; variables?: Json }) =>
      configure(request, false),
    updatePluginInstall: (request: {
      pluginId: bigint | string;
      variables: Json;
    }) => configure(request, true),
    uninstallPlugin: ({ pluginId }: { pluginId: bigint | string }) =>
      mutate(async () => {
        const state = read();
        const id = String(pluginId), removed = state.plugins[id];
        // current.json is derived. Remove it before the authoritative record so
        // a crash before commit is repaired from the still-present record.
        if (removed?.marketplace) removeLocalPluginPointer(root, removed.slug);
        delete state.plugins[id];
        writeAtomicJson(file, state);
      }),
  };
}
/** Keep standalone server configuration separate from plugin-owned rows. */
export function combineLocalMcpStores(
  custom: any,
  plugins: ReturnType<typeof createLocalPluginStore>,
) {
  const listServers = async () => {
    const [a, b] = await Promise.all([
      custom.listServers(),
      plugins.listServers(),
    ]);
    const servers = [...a.servers, ...b.servers],
      ids = new Set(),
      names = new Set();
    for (const row of servers) {
      if (ids.has(row.id) || names.has(row.serverIdentifier))
        throw Error("Local plugin and standalone MCP identities conflict.");
      ids.add(row.id);
      names.add(row.serverIdentifier);
    }
    return { servers };
  };
  const assertCustomNames = (servers: Json) => {
    if (Object.keys(servers).some((name) => name.startsWith(serverPrefix)))
      throw Error("This MCP name is reserved for local plugin connectors.");
  };
  return {
    ...custom,
    ...plugins,
    listServers,
    async getConfigForEdit() {
      const { servers } = await listServers();
      return {
        config: {
          mcpServers: Object.fromEntries(
            servers.map((s) => [s.serverIdentifier, s.config]),
          ),
        },
        serverIdsByName: Object.fromEntries(
          servers.map((s) => [s.serverIdentifier, BigInt(s.id)]),
        ),
      };
    },
    async addServers(servers: Json) {
      assertCustomNames(servers);
      await custom.addServers(servers);
    },
    async setConfig(config: { mcpServers: Json }, ids: Json) {
      assertCustomNames(config.mcpServers);
      await custom.setConfig(config, ids);
    },
    removeServer: (id: string) => custom.removeServer(id),
  };
}
