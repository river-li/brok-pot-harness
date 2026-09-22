/** Filesystem ports for the retained plugin loader, marketplace manager and MCP
 * engine. Bundle parsing, variable fields, skills and tool execution stay in
 * their original modules. */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import {
  listLocalPluginPointers,
  localPluginId,
  localPluginServerId,
  pluginBundlePath,
  writeAtomicJson,
  type LocalPluginPointer,
} from "./plugin-files.js";

type Json = Record<string, any>;
type Installed = LocalPluginPointer & { variables: Json };
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
      if (update && !Object.hasOwn(state.plugins, id))
        throw Error("Local plugin is not installed.");
      const pointer = listLocalPluginPointers(root).find(
        (p) => localPluginId(p.slug) === id,
      );
      if (!pointer)
        throw Error(
          "Local plugin is missing from the catalog. Import its directory first.",
        );
      const metadata = await load(pointer);
      const variables = { ...(request.variables ?? {}) };
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
      state.plugins[id] = { ...pointer, variables };
      writeAtomicJson(file, state);
    });
  return {
    file,
    listServers,
    async catalog() {
      const plugins = [];
      for (const pointer of listLocalPluginPointers(root)) {
        const plugin = await load(pointer),
          variables = ports.fields(plugin.variablesSchema);
        plugins.push({
          pluginId: localPluginId(pointer.slug),
          name: pointer.slug,
          pluginName: pointer.slug,
          displayName: plugin.displayName || pointer.slug,
          description: plugin.description || "",
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
        entries.push({
          pluginId,
          name: pointer.slug,
          displayName: plugin.displayName || pointer.slug,
          installMode: "user",
          isEnabled: true,
          configuredVariableKeys: Object.keys(pointer.variables),
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
        delete state.plugins[String(pluginId)];
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
