/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/mcp/box-mcp-exec.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_dist4();
init_mcp_exec_pb();
init_errors();
init_mcp_diagnostics();
var SandBoxMcpExecError = class extends SandDomainError {
  name = "SandBoxMcpExecError";
};
function errorResult2(message) {
  return new McpResult({
    result: {
      case: "error",
      value: new McpError({ error: message })
    }
  });
}
function errorLabel3(error42) {
  if (error42 instanceof Error) {
    return error42.message.length > 0 ? error42.message : error42.name;
  }
  return String(error42);
}
function createBoxSandMcpExec(box, options2 = {}) {
  const boxCtx = createContext().withName("sandBoxMcp");
  let loadedConfigJson;
  let configLoad = Promise.resolve();
  const loadOptions = (configJson) => ({ removeMissing: options2.removeMissing?.(configJson) ?? true });
  const executingAccessor = async (agentId, configJson = loadedConfigJson) => {
    const host = agentId === void 0 ? void 0 : await boxAgentMcpHost(box, boxCtx, agentId);
    if (host === void 0) {
      return await boxMcpResourceAccessor(box, boxCtx);
    }
    if (configJson !== void 0) {
      await host.loadMcpServers(boxCtx, configJson, loadOptions(configJson));
    }
    return await host.mcpResourceAccessor(boxCtx);
  };
  const executor = {
    async loadServers(configJson) {
      if (process.env.GROKBOT_LOCAL_MODE === "1") {
        // HTTP discovery and stdio reconciliation share this executor. Avoid
        // racing identical reloads that restart freshly connected MCP clients.
        const next = configLoad.catch(() => {}).then(async () => {
          if (loadedConfigJson === configJson) return;
          await boxLoadMcpServers(box, boxCtx, configJson, loadOptions(configJson));
          loadedConfigJson = configJson;
        });
        configLoad = next;
        return await next;
      }
      loadedConfigJson = configJson;
      await boxLoadMcpServers(box, boxCtx, configJson, loadOptions(configJson));
    },
    async listTools(serverIdentifiers, options3) {
      const accessor = await boxMcpResourceAccessor(box, boxCtx);
      const result = await accessor.get(mcpStateExecutorResource).execute(
        boxCtx,
        new McpStateExecArgs({
          serverIdentifiers: [...serverIdentifiers],
          kickOnly: options3?.kickOnly === true
        })
      );
      if (result.result.case !== "success") {
        throw new SandBoxMcpExecError(
          `Box MCP tool discovery failed: ${result.result.case ?? "empty result"}`
        );
      }
      const requested = new Set(serverIdentifiers);
      return result.result.value.servers.filter((server) => requested.size === 0 || requested.has(server.serverIdentifier)).map((server) => {
        const statusDetail = stripMarkupAndBoundConnectorError(server.errorMessage ?? "");
        return {
          serverIdentifier: server.serverIdentifier,
          status: server.status ?? "connected",
          ...statusDetail.length > 0 ? { statusDetail } : {},
          toolCount: server.tools.length,
          tools: server.tools.map((tool) => ({
            name: tool.name,
            providerIdentifier: tool.providerIdentifier,
            toolName: tool.toolName,
            clientKey: server.serverIdentifier,
            description: tool.description.length > 0 ? tool.description : void 0,
            inputSchema: tool.inputSchema?.toJson()
          }))
        };
      });
    },
    async executeTool(ctx, args, options3) {
      try {
        const accessor = await executingAccessor(options3?.agentId, options3?.configJson);
        return await accessor.get(mcpExecutorResource).execute(ctx, process.env.GROKBOT_LOCAL_MODE === "1" ? new McpArgs(args) : args);
      } catch (error42) {
        recordMcpExecErrorClass(ctx, error42);
        return errorResult2(`Box MCP execution failed for "${args.name}": ${errorLabel3(error42)}`);
      }
    }
  };
  return process.env.GROKBOT_LOCAL_MODE === "1" ? require("./local/mcp-scopes.js").createScopedBoxMcpExec(executor, {
    parseConfig: value => mcpConfigSchema2.parse(value), validateName: validateServerName
  }) : executor;
}

// Preserve the backend port expected by the manager, while executing HTTP/SSE
// MCP in the same local Box engine that already implements stdio servers.
function createLocalBoxBackendMcpExec(store, boxExec, boxServers) {
  const ensureLoaded = async () => {
    const { config: config2 } = await store.getConfigForEdit();
    await boxExec.loadServers(JSON.stringify({mcpServers:{...config2.mcpServers,...await boxServers()}}));
  };
  return {
    async listTools(serverIdentifiers, mcpConfigJson) {
      if (mcpConfigJson === void 0) await ensureLoaded();
      const names3 = serverIdentifiers;
      const list = () => mcpConfigJson === void 0 ? boxExec.listTools(names3) : boxExec.listInlineTools(names3, mcpConfigJson);
      let servers = await list();
      const settleBy = Date.now() + 5000;
      while (servers.some(server => server.status === "loading" || server.status === "initializing") && Date.now() < settleBy) {
        await new Promise(resolve => setTimeout(resolve, 100));
        servers = await list();
      }
      return servers.map(server => ({...server,accountLabel:"default",rowServerIdentifier:server.serverIdentifier}));
    },
    async executeTool(ctx, args) {
      if (args.mcpConfigJson === void 0) await ensureLoaded();
      const toolName = args.toolName.startsWith(`${args.serverIdentifier}-`) ? args.toolName.slice(args.serverIdentifier.length + 1) : args.toolName;
      const mcpArgs = new McpArgs({
        name:args.toolName, toolName, providerIdentifier:args.serverIdentifier, toolCallId:args.toolCallId,
        args:Object.fromEntries(Object.entries(args.args).map(([key,value]) => [key,Value.fromJson(value)]))
      });
      return args.mcpConfigJson === void 0 ? await boxExec.executeTool(ctx, mcpArgs, {agentId:args.agentId}) : await boxExec.executeInlineTool(ctx, mcpArgs, args.mcpConfigJson);
    },
    async checkAuthStatus(args) {
      const display = await store.listServers();
      const server = display.servers.find(server => server.id === String(args.serverId) || server.serverIdentifier === args.serverIdentifier);
      if (server == null) return {isAvailable:false,requiresAuth:false,hasValidToken:false,error:"MCP server is not configured locally."};
      await ensureLoaded();
      const result = (await boxExec.listTools([server.serverIdentifier]))[0];
      return {isAvailable:result?.status === "connected",requiresAuth:result?.status === "needsAuth",hasValidToken:false,
        error:result?.status === "connected" ? "" : "Configure this MCP server's credentials in its local headers or environment. Vendor account login is disabled."};
    },
    async validateTokens() { return []; },
    async completeOAuth() { throw new SandMcpConfigError("Vendor MCP OAuth is unavailable in local mode. Configure server credentials locally."); },
    async logoutAccount() { throw new SandMcpConfigError("Local MCP credentials are managed in mcp-servers.json."); },
    async renameAccount() { throw new SandMcpConfigError("Local MCP servers do not use vendor account slots."); },
    async deleteAccount() { throw new SandMcpConfigError("Remove or edit the local MCP server configuration instead."); }
  };
}
