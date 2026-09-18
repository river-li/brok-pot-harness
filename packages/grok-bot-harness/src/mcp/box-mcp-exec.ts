init_dist3();
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
function errorLabel3(error41) {
  if (error41 instanceof Error) {
    return error41.message.length > 0 ? error41.message : error41.name;
  }
  return String(error41);
}
function createBoxSandMcpExec(box) {
  const boxCtx = createContext().withName("sandBoxMcp");
  let loadedConfigJson;
  const executingAccessor = async (agentId) => {
    const host = agentId === void 0 ? void 0 : await boxAgentMcpHost(box, boxCtx, agentId);
    if (host === void 0) {
      return await boxMcpResourceAccessor(box, boxCtx);
    }
    if (loadedConfigJson !== void 0) {
      await host.loadMcpServers(boxCtx, loadedConfigJson);
    }
    return await host.mcpResourceAccessor(boxCtx);
  };
  return {
    async loadServers(configJson) {
      loadedConfigJson = configJson;
      await boxLoadMcpServers(box, boxCtx, configJson);
    },
    async listTools(serverIdentifiers, options2) {
      const accessor = await boxMcpResourceAccessor(box, boxCtx);
      const result = await accessor.get(mcpStateExecutorResource).execute(
        boxCtx,
        new McpStateExecArgs({
          serverIdentifiers: [...serverIdentifiers],
          kickOnly: options2?.kickOnly === true
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
    async executeTool(ctx, args, options2) {
      try {
        const accessor = await executingAccessor(options2?.agentId);
        return await accessor.get(mcpExecutorResource).execute(boxCtx, args);
      } catch (error41) {
        recordMcpExecErrorClass(ctx, error41);
        return errorResult2(`Box MCP execution failed for "${args.name}": ${errorLabel3(error41)}`);
      }
    }
  };
}
