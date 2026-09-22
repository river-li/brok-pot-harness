function createSandShellApprovalProvider(args) {
  return {
    requestApproval: async (request5) => {
      const description9 = request5.target.description?.trim();
      if (args.beforeApproval !== void 0) {
        const prior = await args.beforeApproval({
          toolCallId: request5.toolCallId,
          signal: request5.signal,
          command: request5.target.command,
          ...description9 !== void 0 && description9.length > 0 ? { description: description9 } : {},
          ...request5.machineId !== void 0 ? { machineId: request5.machineId } : {}
        });
        if (!prior.allowed) {
          return { approved: false, reason: prior.reason };
        }
      }
      const summary = describeSandShellAutoReviewActionSource({
        surface: args.surface,
        command: request5.target.command,
        workingDirectory: request5.target.workingDirectory,
        ...description9 !== void 0 && description9.length > 0 ? { description: description9 } : {}
      });
      return args.controller.requestApproval({
        agentId: args.agentId,
        surface: args.surface,
        fingerprint: request5.fingerprint,
        reason: request5.target.blockReason,
        summary: summary.summary,
        summaryCopy: summary.summaryCopy,
        command: request5.target.command,
        ...request5.target.proposedAllowRule === void 0 ? {} : { proposedRule: request5.target.proposedAllowRule },
        signal: request5.signal,
        expiryPolicy: args.getExpiryPolicy()
      });
    }
  };
}
function createSandMcpApprovalProvider(args) {
  return {
    requestApproval: (request5) => {
      const description9 = request5.target.description?.trim();
      const summary = describeSandMcpAutoReviewActionSource({
        serverDisplayName: request5.target.serverDisplayName,
        toolName: request5.target.toolName,
        ...request5.target.mcpArguments === void 0 ? {} : { mcpArguments: request5.target.mcpArguments },
        ...description9 !== void 0 && description9.length > 0 ? { description: description9 } : {}
      });
      return args.controller.requestApproval({
        agentId: args.agentId,
        surface: "mcp",
        fingerprint: request5.fingerprint,
        reason: request5.target.blockReason,
        summary: summary.summary,
        summaryCopy: summary.summaryCopy,
        command: summarizeSandMcpAutoReviewAction({
          serverDisplayName: request5.target.serverDisplayName,
          toolName: request5.target.toolName,
          mcpArguments: request5.target.mcpArguments
        }),
        ...request5.target.proposedAllowRule === void 0 ? {} : { proposedRule: request5.target.proposedAllowRule },
        signal: request5.signal,
        expiryPolicy: args.getExpiryPolicy()
      });
    }
  };
}
