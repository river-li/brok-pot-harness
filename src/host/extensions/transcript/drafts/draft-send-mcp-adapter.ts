init_errors();
var draftSendDeadline = createDeadlinePolicy({
  name: "draft-send-call",
  timeoutMs: 6e4
});
function createDraftExecutionAdapter(mcp) {
  const ctx = createContext().withName("sandDraftSend");
  return {
    async executeDraftCall(call) {
      let failure2;
      let resultText = "";
      try {
        const executor = mcp.createExecutor(void 0, void 0, {
          agentId: call.agentId
        });
        const result = await draftSendDeadline.run(
          () => executor.execute(
            ctx,
            buildDraftCallArgs({
              providerIdentifier: call.providerIdentifier,
              toolName: call.toolName,
              callIdPrefix: "sand-draft-send",
              args: call.args
            })
          )
        );
        failure2 = describeDraftCallFailure(result);
        if (failure2 == null) resultText = draftCallResultText(result);
      } catch (error42) {
        if (error42 instanceof DeadlineExceededError) return { outcome: "unconfirmed" };
        failure2 = errorMessage(error42);
      }
      if (failure2 == null) return { outcome: "sent", resultText };
      const slot = await mcp.resolveNeedsAuthSlot?.(call.providerIdentifier) ?? null;
      if (slot != null) {
        return { outcome: "needs-auth", serverId: slot.serverId, serverName: slot.serverName };
      }
      return { outcome: "failed", error: failure2 };
    }
  };
}
