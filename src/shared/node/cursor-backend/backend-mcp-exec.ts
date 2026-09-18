init_mcp_tool_annotations();
init_esm();
init_esm2();
init_errors();
init_proto();
init_mcp_diagnostics();
init_cursor_inference();
var SandBackendMcpExecError = class extends SandDomainError {
  name = "SandBackendMcpExecError";
};
var SandMcpOAuthCompletionRejectedError = class extends SandDomainError {
  name = "SandMcpOAuthCompletionRejectedError";
};
var DEFINITIVE_OAUTH_REJECTION_CODES = /* @__PURE__ */ new Set([
  Code.InvalidArgument,
  Code.NotFound,
  Code.PermissionDenied,
  Code.Unauthenticated,
  Code.FailedPrecondition
]);
function isDefinitiveOAuthCompletionRejection(error41) {
  return error41 instanceof ConnectError && DEFINITIVE_OAUTH_REJECTION_CODES.has(error41.code);
}
function accountKeyFromOAuthCompletion(result) {
  if (result == null || typeof result !== "object") return void 0;
  const raw = result.accountKey;
  if (raw == null) return void 0;
  const accountKey = raw.trim();
  return accountKey.length > 0 ? normalizeAccountLabel(accountKey) : void 0;
}
var defaultCreateBackendClient = (options2) => createSandCursorBackendClient(DashboardService2, options2);
function backendMcpExecClient(deps) {
  if (deps.backend === void 0) return deps.createBackendClient();
  return (deps.createBackendClient ?? defaultCreateBackendClient)({
    backend: deps.backend,
    getAccessToken: deps.getAccessToken,
    getTeamId: deps.getTeamId,
    getMachineId: deps.getMachineId
  });
}
function backendToolToNamed(tool) {
  const annotations = parseMcpToolAnnotations(tool.annotationsJson);
  return {
    name: tool.name,
    providerIdentifier: tool.providerIdentifier,
    toolName: tool.toolName,
    clientKey: tool.providerIdentifier,
    description: tool.description.length > 0 ? tool.description : void 0,
    inputSchema: tool.inputSchema !== void 0 ? tool.inputSchema.toJson() : void 0,
    ...annotations === void 0 ? {} : { annotations }
  };
}
function errorResult(message) {
  return new McpResult({
    result: {
      case: "error",
      value: new McpError({ error: message })
    }
  });
}
function errorLabel(error41) {
  if (error41 instanceof ConnectError) {
    return Code[error41.code];
  }
  return errorClassOf(error41);
}
function normalizeAccountLabel(label) {
  return label != null && label.length > 0 ? label : "default";
}
var LIST_TOOLS_TIMEOUT_MS = 6e4;
var CONTROL_RPC_TIMEOUT_MS = 3e4;
var MCP_SDK_REQUEST_TIMEOUT_MS = 6e4;
var EXECUTE_TOOL_DIAL_DISCOVER_CALL_TIMEOUT_MS = 3 * MCP_SDK_REQUEST_TIMEOUT_MS;
function createDashboardSandBackendMcpExec(deps) {
  const client = backendMcpExecClient(deps);
  return {
    async listTools(serverIdentifiers, mcpConfigJson) {
      try {
        const response = await client.listSandMcpTools(
          new ListSandMcpToolsRequest({
            serverIdentifiers: [...serverIdentifiers],
            mcpConfigJson
          }),
          { timeoutMs: LIST_TOOLS_TIMEOUT_MS }
        );
        return response.servers.map((server) => ({
          serverIdentifier: server.serverIdentifier,
          status: server.status,
          tools: server.tools.map(backendToolToNamed),
          accountLabel: normalizeAccountLabel(server.accountLabel),
          rowServerIdentifier: server.rowServerIdentifier != null && server.rowServerIdentifier.length > 0 ? server.rowServerIdentifier : server.serverIdentifier
        }));
      } catch (error41) {
        reportMcpHostEdgeFailure("backend-list-tools", error41);
        throw new SandBackendMcpExecError(
          `Backend MCP tool discovery failed: ${errorLabel(error41)}`,
          {
            cause: error41
          }
        );
      }
    },
    async executeTool(ctx, args) {
      const catalogToolName = args.toolName.startsWith(`${args.serverIdentifier}-`) ? args.toolName.slice(args.serverIdentifier.length + 1) : args.toolName;
      const timeoutMs = DESIGNATED_DANGEROUS_MCP_TOOL_NAMES.has(catalogToolName) ? DANGEROUS_MCP_TOOL_EXECUTE_TIMEOUT_MS : EXECUTE_TOOL_DIAL_DISCOVER_CALL_TIMEOUT_MS;
      try {
        const response = await client.executeSandMcpTool(
          new ExecuteSandMcpToolRequest({
            serverIdentifier: args.serverIdentifier,
            toolName: args.toolName,
            args: Struct.fromJson(args.args),
            toolCallId: args.toolCallId,
            agentId: args.agentId ?? "",
            turnId: ctx.get(requestIdKey) ?? "",
            mcpConfigJson: args.mcpConfigJson
          }),
          { timeoutMs }
        );
        return response.result ?? errorResult(`Backend MCP execution returned no result for "${args.toolName}".`);
      } catch (error41) {
        recordMcpExecErrorClass(ctx, error41);
        if (error41 instanceof ConnectError && error41.code === Code.DeadlineExceeded) {
          return errorResult(
            `Backend MCP execution for "${args.toolName}" timed out after ${timeoutMs / 1e3}s. The connector may still have applied it, so retry only if repeating the call is safe.`
          );
        }
        return errorResult(
          `Backend MCP execution failed for "${args.toolName}": ${errorLabel(error41)}`
        );
      }
    },
    async checkAuthStatus(args) {
      try {
        const response = await client.checkHttpMcpStatus(
          new CheckHttpMcpStatusRequest({
            serverIds: args.serverIdentifier == null ? [args.serverId] : [],
            serverIdentifiers: args.serverIdentifier == null ? [] : [args.serverIdentifier],
            oauthRedirectUri: args.oauthRedirectUri,
            forceReauth: args.forceReauth === true,
            accountKey: args.accountKey
          }),
          { timeoutMs: CONTROL_RPC_TIMEOUT_MS }
        );
        const status = args.serverIdentifier == null ? response.statuses.find((entry) => entry.id === args.serverId) : response.statuses.find(
          (entry) => entry.serverIdentifier === args.serverIdentifier
        ) ?? (response.statuses.length === 1 ? response.statuses[0] : void 0);
        if (status == null) {
          throw new SandBackendMcpExecError(
            "The backend did not report OAuth status for this connector."
          );
        }
        return {
          isAvailable: status.isAvailable,
          requiresAuth: status.requiresAuth,
          hasValidToken: status.hasValidToken,
          authUrl: status.authUrl,
          error: status.error
        };
      } catch (error41) {
        reportMcpHostEdgeFailure("backend-check-auth-status", error41);
        throw new SandBackendMcpExecError(
          `Backend MCP OAuth status check failed: ${errorLabel(error41)}`,
          {
            cause: error41
          }
        );
      }
    },
    async completeOAuth(args) {
      try {
        const response = await client.completeMcpOAuth(
          new CompleteMcpOAuthRequest({
            stateId: args.stateId,
            authorizationCode: args.code
          }),
          { timeoutMs: CONTROL_RPC_TIMEOUT_MS }
        );
        return { accountKey: normalizeAccountLabel(response.accountKey) };
      } catch (error41) {
        if (isDefinitiveOAuthCompletionRejection(error41)) {
          throw new SandMcpOAuthCompletionRejectedError(
            `Backend MCP OAuth completion was rejected: ${errorLabel(error41)}`,
            { cause: error41 }
          );
        }
        throw error41;
      }
    },
    async validateTokens(targets) {
      const cleaned = targets.flatMap((target) => {
        const serverUrl = target.serverUrl.trim();
        return serverUrl.length > 0 ? [{ serverUrl, accountKey: target.accountKey }] : [];
      });
      const serverIdentifiers = targets.flatMap((target) => {
        if (target.serverUrl.trim().length > 0) return [];
        const serverIdentifier = target.serverIdentifier?.trim() ?? "";
        return serverIdentifier.length > 0 ? [serverIdentifier] : [];
      });
      if (cleaned.length === 0 && serverIdentifiers.length === 0) return [];
      try {
        const response = await client.validateMcpOAuthTokens(
          new ValidateMcpOAuthTokensRequest({
            targets: cleaned.map((target) => new ValidateMcpOAuthTokensRequest_Target(target)),
            serverIdentifiers
          }),
          { timeoutMs: CONTROL_RPC_TIMEOUT_MS }
        );
        return response.results.map((result) => ({
          serverUrl: result.serverUrl,
          accountKey: normalizeAccountLabel(result.accountKey),
          hasValidToken: result.hasValidToken,
          ...result.serverIdentifier == null || result.serverIdentifier.length === 0 ? {} : { serverIdentifier: result.serverIdentifier }
        }));
      } catch (error41) {
        reportMcpHostEdgeFailure("backend-validate-tokens", error41);
        return [];
      }
    },
    async logoutAccount(args) {
      await client.deleteMcpOAuthToken(
        new DeleteMcpOAuthTokenRequest({
          serverUrl: args.serverUrl,
          accountKey: args.accountKey,
          source: "sand"
        }),
        { timeoutMs: CONTROL_RPC_TIMEOUT_MS }
      );
    },
    async renameAccount(args) {
      await client.renameMcpOAuthAccount(
        new RenameMcpOAuthAccountRequest({
          serverId: args.serverId,
          accountKey: args.accountKey,
          newAccountKey: args.newAccountKey
        }),
        { timeoutMs: CONTROL_RPC_TIMEOUT_MS }
      );
    },
    async deleteAccount(args) {
      await client.deleteMcpOAuthAccount(
        new DeleteMcpOAuthAccountRequest({
          serverId: args.serverId,
          accountKey: args.accountKey
        }),
        { timeoutMs: CONTROL_RPC_TIMEOUT_MS }
      );
    }
  };
}
