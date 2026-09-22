/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/tools/mcp/backend-routed-mcp-hooks.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function isBackendRoutedMcpServer(executor, providerIdentifier) {
  return executor.isBackendRouted?.(providerIdentifier) === true;
}
function wrapBackendRoutedMcpExecute(args) {
  if (args.hookOptions.enableExecuteHookExec !== true) {
    return args.executeFn;
  }
  const hooked = withRemoteHooks({
    executeFn: args.executeFn,
    config: {
      toolName: `MCP:${args.toolName}`,
      createToolInput: (mcpArgs) => mcpArgsToHookInput(mcpArgs),
      // Project hooks can deny the call. They cannot rewrite args after
      // Smart Mode already classified the original request — that would
      // execute a different backend-routed operation under the same
      // skipApproval / allow decision.
      applyUpdatedInput: () => false,
      createRejectedResult: (_mcpArgs, reason) => new McpResult({
        result: {
          case: "permissionDenied",
          value: new McpPermissionDenied({
            error: reason,
            isReadonly: false
          })
        }
      }),
      createSuccessOutput: (_mcpArgs, result) => redactBackendMcpResultForHook(result),
      getFailureInfo: (result) => mcpResultFailureInfo(result)
    },
    requestContext: args.requestContext,
    options: args.hookOptions
  });
  return (ctx, mcpArgs) => {
    const routingIdentifier = mcpArgs.providerIdentifier !== void 0 && mcpArgs.providerIdentifier !== "" ? mcpArgs.providerIdentifier : args.providerIdentifier;
    if (!isBackendRoutedMcpServer(args.executor, routingIdentifier)) {
      return args.executeFn(ctx, mcpArgs);
    }
    return hooked(ctx, mcpArgs);
  };
}
function mcpArgsToHookInput(mcpArgs) {
  return Object.fromEntries(Object.entries(mcpArgs.args).map(([key, value]) => [key, value?.toJson()]));
}
function mcpResultFailureInfo(result) {
  switch (result.result.case) {
    case "error":
    case "toolNotFound":
    case "serverNotFound":
      return {
        errorMessage: "backend MCP result redacted",
        failureType: "error"
      };
    case "rejected":
    case "permissionDenied":
      return {
        errorMessage: "backend MCP result redacted",
        failureType: "permission_denied"
      };
    case "success":
    case "approved":
    case void 0:
      return void 0;
    default: {
      const _exhaustive = result.result;
      void _exhaustive;
      return {
        errorMessage: "backend MCP result redacted",
        failureType: "error"
      };
    }
  }
}
function redactBackendMcpResultForHook(result) {
  if (result.result.case === "success") {
    return { redacted: true, isError: result.result.value.isError };
  }
  return { redacted: true };
}

