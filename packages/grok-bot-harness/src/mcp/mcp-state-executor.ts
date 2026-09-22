/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/mcp/mcp-state-executor.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_mcp_exec_pb();
init_mcp_pb();
init_esm();
var UNUSABLE_SERVER_STATUSES = /* @__PURE__ */ new Set(["needsAuth", "error"]);
function createSandMcpStateExecutor(provider) {
  return {
    async execute(ctx, _args) {
      const [tools, statuses] = await Promise.all([
        provider.getTools(ctx),
        provider.getServerStatuses?.().catch(() => /* @__PURE__ */ new Map()) ?? Promise.resolve(/* @__PURE__ */ new Map())
      ]);
      const toolsByServer = /* @__PURE__ */ new Map();
      for (const tool of tools) {
        const existing = toolsByServer.get(tool.providerIdentifier);
        if (existing === void 0) {
          toolsByServer.set(tool.providerIdentifier, [tool]);
        } else {
          existing.push(tool);
        }
      }
      const servers = [...toolsByServer.entries()].map(
        ([serverIdentifier, serverTools]) => new McpStateServer({
          serverIdentifier,
          serverName: serverIdentifier,
          status: statusForCatalog(statuses.get(serverIdentifier)),
          tools: serverTools.map(
            (tool) => new McpToolDefinition({
              name: tool.name,
              providerIdentifier: tool.providerIdentifier,
              toolName: tool.toolName,
              description: tool.description,
              inputSchema: tool.inputSchema !== void 0 ? Value.fromJson(tool.inputSchema) : void 0
            })
          )
        })
      );
      return new McpStateExecResult({
        result: { case: "success", value: new McpStateSuccess({ servers }) }
      });
    }
  };
}
function statusForCatalog(status) {
  return status !== void 0 && UNUSABLE_SERVER_STATUSES.has(status) ? status : "connected";
}

