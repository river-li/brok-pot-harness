/** Implements the original MCP configuration port using the local host data
 * directory. The retained manager still validates names/configs and manages
 * tool toggles, instructions, discovery and calls. */
import { mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { randomUUID } from "node:crypto";

type Config = { mcpServers: Record<string, Record<string, any>> };
type State = Config & {
  version: 1;
  nextServerId: number;
  serverIdsByName: Record<string, string>;
};
type Validation = {
  parseConfig(value: unknown): Config;
  validateName(value: string): string;
};

export function createLocalMcpStore(root: string, validation: Validation) {
  const file = join(root, "mcp-servers.json");
  const empty = (): State => ({
    version: 1,
    nextServerId: 1,
    mcpServers: {},
    serverIdsByName: {},
  });
  const read = (): State => {
    let raw: State;
    try {
      raw = JSON.parse(readFileSync(file, "utf8"));
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return empty();
      throw new Error(
        "Cannot read local mcp-servers.json; check its JSON format.",
      );
    }
    const config = validation.parseConfig(raw);
    if (
      raw.version !== 1 ||
      !Number.isSafeInteger(raw.nextServerId) ||
      raw.nextServerId < 1
    )
      throw new Error("Invalid local MCP store version or nextServerId.");
    const ids = new Set<string>();
    for (const name of Object.keys(config.mcpServers)) {
      validation.validateName(name);
      const id = raw.serverIdsByName?.[name];
      if (
        typeof id !== "string" ||
        !/^[1-9]\d*$/.test(id) ||
        Number(id) >= raw.nextServerId ||
        ids.has(id)
      )
        throw new Error("Invalid or duplicate local MCP server ID.");
      ids.add(id);
    }
    return { ...raw, ...config };
  };
  const save = (state: State) => {
    mkdirSync(root, { recursive: true, mode: 0o700 });
    const temporary = `${file}.${randomUUID()}.tmp`;
    writeFileSync(temporary, JSON.stringify(state, null, 2) + "\n", {
      mode: 0o600,
      flag: "wx",
    });
    renameSync(temporary, file);
  };
  const setConfig = async (
    input: Config,
    previousIds: Record<string, bigint | string> = {},
  ) => {
    const config = validation.parseConfig(input);
    const previous = read();
    const state: State = {
      ...config,
      version: 1,
      nextServerId: previous.nextServerId,
      serverIdsByName: {},
    };
    const used = new Set<string>();
    for (const name of Object.keys(config.mcpServers)) {
      validation.validateName(name);
      const existing = previous.serverIdsByName[name];
      const requested = previousIds[name]?.toString();
      if (requested !== undefined && requested !== existing)
        throw new Error(
          "Local MCP server identity changed; reload before saving.",
        );
      const id = existing ?? String(state.nextServerId++);
      if (used.has(id)) throw new Error("Duplicate local MCP server identity.");
      used.add(id);
      state.serverIdsByName[name] = id;
    }
    save(state);
  };
  const getConfigForEdit = async () => {
    const state = read();
    return {
      config: { mcpServers: state.mcpServers },
      serverIdsByName: Object.fromEntries(
        Object.entries(state.serverIdsByName).map(([name, id]) => [
          name,
          BigInt(id),
        ]),
      ),
    };
  };
  return {
    file,
    getConfigForEdit,
    setConfig,
    // Atomic merge is used by the local manager path so parallel AddMcpServer
    // calls cannot lose a server between the original read and replace steps.
    async addServers(servers: Config["mcpServers"]) {
      const current = read();
      await setConfig(
        { mcpServers: { ...current.mcpServers, ...servers } },
        current.serverIdsByName,
      );
    },
    async removeServer(serverId: string) {
      const current = read();
      const entries = Object.entries(current.mcpServers).filter(
        ([name]) => current.serverIdsByName[name] !== serverId,
      );
      await setConfig(
        { mcpServers: Object.fromEntries(entries) },
        Object.fromEntries(
          entries.map(([name]) => [name, current.serverIdsByName[name]]),
        ),
      );
    },
    async listServers() {
      const state = read();
      return {
        servers: Object.entries(state.mcpServers).map(([name, config]) => ({
          id: state.serverIdsByName[name],
          name,
          serverIdentifier: name,
          config,
          isTeamServer: false,
          disabledByTeamAdminPolicy: false,
          hasStaticCredentialHeaders:
            !!config.headers && Object.keys(config.headers).length > 0,
        })),
      };
    },
  };
}
