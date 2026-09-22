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
  const loadOptions = (configJson) => ({
    removeMissing: options2.removeMissing?.(configJson) ?? true
  });
  const executingAccessor = async (agentId) => {
    const host = agentId === void 0 ? void 0 : await boxAgentMcpHost(box, boxCtx, agentId);
    if (host === void 0) {
      return await boxMcpResourceAccessor(box, boxCtx);
    }
    if (loadedConfigJson !== void 0) {
      await host.loadMcpServers(boxCtx, loadedConfigJson, loadOptions(loadedConfigJson));
    }
    return await host.mcpResourceAccessor(boxCtx);
  };
  return {
    async loadServers(configJson) {
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
        const accessor = await executingAccessor(options3?.agentId);
        return await accessor.get(mcpExecutorResource).execute(ctx, args);
      } catch (error42) {
        recordMcpExecErrorClass(ctx, error42);
        return errorResult2(`Box MCP execution failed for "${args.name}": ${errorLabel3(error42)}`);
      }
    }
  };
}

