/** Isolate temporary MCP clients while retaining the Box's MCP engine.
 * Only internal registration names change; tool/provider names exposed to the
 * original runner remain unchanged. Configurations never enter the local store.
 */
import { AsyncLocalStorage } from "node:async_hooks";
import { randomUUID } from "node:crypto";

type Config = { mcpServers: Record<string, Record<string, unknown>> };
type Tool = {
  name: string;
  toolName: string;
  providerIdentifier: string;
  clientKey?: string;
};
type Server = { serverIdentifier: string; tools: Tool[] };
type Args = { name: string; toolName: string; providerIdentifier: string };
type ExecutionOptions = { agentId?: string; configJson?: string };
type Port<C, A extends Args, R, S extends Server> = {
  loadServers(configJson: string): Promise<unknown>;
  listTools(
    names: readonly string[],
    options?: { kickOnly?: boolean },
  ): Promise<S[]>;
  executeTool(ctx: C, args: A, options?: ExecutionOptions): Promise<R>;
};
type Scope = {
  configJson: string;
  config: Config;
  names: Map<string, string>;
  active: boolean;
};

export function createScopedBoxMcpExec<C, A extends Args, R, S extends Server>(
  raw: Port<C, A, R, S>,
  validation: {
    parseConfig(value: unknown): Config;
    validateName(value: string): string;
  },
) {
  const context = new AsyncLocalStorage<Scope | undefined>();
  const scopes = new Set<Scope>();
  let workspace: Config = { mcpServers: {} };
  let chain: Promise<unknown> = Promise.resolve();
  let disposed = false;

  const parse = (json: string): Config => {
    try {
      const config = validation.parseConfig(JSON.parse(json));
      for (const name of Object.keys(config.mcpServers)) {
        if (validation.validateName(name) !== name)
          throw new Error("Noncanonical MCP server name");
      }
      return config;
    } catch {
      // Schema diagnostics may include inline credentials. Keep them private.
      throw new Error("Invalid local MCP configuration or server name.");
    }
  };
  const assertOpen = () => {
    if (disposed) throw new Error("The local MCP executor is closed.");
  };
  const current = (configJson: string) => {
    assertOpen();
    const scope = context.getStore();
    if (!scope?.active || scope.configJson !== configJson)
      throw new Error(
        "The temporary MCP configuration has no active task scope.",
      );
    return scope;
  };
  const push = () => {
    const next = chain
      .catch(() => {})
      .then(() => {
        // Read current state inside the queue. A late discovery cannot resurrect
        // clients that a completed or cancelled turn has already removed.
        const servers = { ...workspace.mcpServers };
        for (const scope of scopes) {
          for (const [name, internal] of scope.names) {
            if (Object.hasOwn(servers, internal))
              throw new Error("Local MCP registration name collision.");
            servers[internal] = scope.config.mcpServers[name];
          }
        }
        return raw.loadServers(JSON.stringify({ mcpServers: servers }));
      });
    chain = next;
    return next;
  };
  const selectedNames = (
    names: readonly string[],
    available: readonly string[],
  ) => {
    const allowed = new Set(available);
    return names.length === 0
      ? [...available]
      : names.filter((name) => allowed.has(name));
  };

  return {
    async loadServers(configJson: string) {
      assertOpen();
      workspace = parse(configJson);
      await push();
    },
    async listTools(
      names: readonly string[],
      options?: { kickOnly?: boolean },
    ) {
      assertOpen();
      await chain;
      const requested = selectedNames(names, Object.keys(workspace.mcpServers));
      if (requested.length === 0) return [];
      const allowed = new Set(requested);
      return (await raw.listTools(requested, options)).filter((s) =>
        allowed.has(s.serverIdentifier),
      );
    },
    async executeTool(ctx: C, args: A, options?: ExecutionOptions) {
      assertOpen();
      await chain;
      if (!Object.hasOwn(workspace.mcpServers, args.providerIdentifier))
        throw new Error("The MCP server is not configured in this workspace.");
      // Forked desktop daemons receive only workspace configuration; temporary
      // credentials from unrelated turns stay in their primary scoped clients.
      return raw.executeTool(ctx, args, {
        ...options,
        configJson: JSON.stringify(workspace),
      });
    },
    async withConfigScope<T>(
      configJson: string | undefined,
      run: () => Promise<T>,
    ): Promise<T> {
      assertOpen();
      if (configJson === undefined) return context.run(undefined, run);
      const config = parse(configJson);
      const prefix = `gbl_${randomUUID().replaceAll("-", "")}_`;
      const scope: Scope = {
        configJson,
        config,
        active: true,
        names: new Map(
          Object.keys(config.mcpServers).map((name, i) => [
            name,
            `${prefix}${i}`,
          ]),
        ),
      };
      scopes.add(scope);
      try {
        return await context.run(scope, run);
      } finally {
        scope.active = false;
        scopes.delete(scope);
        await push();
      }
    },
    async listInlineTools(names: readonly string[], configJson: string) {
      const scope = current(configJson);
      await push();
      current(configJson);
      const requested = selectedNames(names, [...scope.names.keys()]);
      if (requested.length === 0) return [];
      const reverse = new Map(
        requested.map((name) => [scope.names.get(name)!, name]),
      );
      const servers = await raw.listTools([...reverse.keys()]);
      current(configJson);
      return servers
        .filter((s) => reverse.has(s.serverIdentifier))
        .map((server) => {
          const name = reverse.get(server.serverIdentifier)!;
          return {
            ...server,
            serverIdentifier: name,
            tools: server.tools.map((tool) => ({
              ...tool,
              name: `${name}-${tool.toolName}`,
              providerIdentifier: name,
              clientKey: name,
            })),
          };
        });
    },
    async executeInlineTool(ctx: C, args: A, configJson: string) {
      const scope = current(configJson);
      const internal = scope.names.get(args.providerIdentifier);
      if (!internal)
        throw new Error("The MCP server is not configured for this task.");
      await push();
      current(configJson);
      return raw.executeTool(ctx, {
        ...args,
        providerIdentifier: internal,
        name: `${internal}-${args.toolName}`,
      });
    },
    currentTransport(providerIdentifier: string) {
      const scope = context.getStore();
      if (!scope?.active) return undefined;
      const server = scope.config.mcpServers[providerIdentifier];
      return server === undefined
        ? "unknown"
        : "command" in server
          ? "stdio"
          : "http";
    },
    async dispose() {
      disposed = true;
      for (const scope of scopes) scope.active = false;
      scopes.clear();
      await push();
    },
  };
}
