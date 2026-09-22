/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/runner/sand-auto-review-tool-escalations.ts
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function createSandShellApprovalProvider(args) {
  return {
    requestApproval: async (request3) => {
      const description9 = request3.target.description?.trim();
      if (args.beforeApproval !== void 0) {
        const prior = await args.beforeApproval({
          toolCallId: request3.toolCallId,
          signal: request3.signal,
          command: request3.target.command,
          ...description9 !== void 0 && description9.length > 0 ? { description: description9 } : {},
          ...request3.machineId !== void 0 ? { machineId: request3.machineId } : {}
        });
        if (!prior.allowed) {
          return { approved: false, reason: prior.reason };
        }
      }
      const summary = describeSandShellAutoReviewActionSource({
        surface: args.surface,
        command: request3.target.command,
        workingDirectory: request3.target.workingDirectory,
        ...description9 !== void 0 && description9.length > 0 ? { description: description9 } : {}
      });
      return args.controller.requestApproval({
        agentId: args.agentId,
        surface: args.surface,
        fingerprint: request3.fingerprint,
        reason: request3.target.blockReason,
        summary: summary.summary,
        summaryCopy: summary.summaryCopy,
        command: request3.target.command,
        ...request3.target.proposedAllowRule === void 0 ? {} : { proposedRule: request3.target.proposedAllowRule },
        signal: request3.signal,
        expiryPolicy: args.getExpiryPolicy()
      });
    }
  };
}
function createSandMcpApprovalProvider(args) {
  return {
    requestApproval: (request3) => {
      const description9 = request3.target.description?.trim();
      const summary = describeSandMcpAutoReviewActionSource({
        serverDisplayName: request3.target.serverDisplayName,
        toolName: request3.target.toolName,
        ...request3.target.mcpArguments === void 0 ? {} : { mcpArguments: request3.target.mcpArguments },
        ...description9 !== void 0 && description9.length > 0 ? { description: description9 } : {}
      });
      return args.controller.requestApproval({
        agentId: args.agentId,
        surface: "mcp",
        fingerprint: request3.fingerprint,
        reason: request3.target.blockReason,
        summary: summary.summary,
        summaryCopy: summary.summaryCopy,
        command: summarizeSandMcpAutoReviewAction({
          serverDisplayName: request3.target.serverDisplayName,
          toolName: request3.target.toolName,
          mcpArguments: request3.target.mcpArguments
        }),
        ...request3.target.proposedAllowRule === void 0 ? {} : { proposedRule: request3.target.proposedAllowRule },
        signal: request3.signal,
        expiryPolicy: args.getExpiryPolicy()
      });
    }
  };
}

