function readAhead(source) {
  const chunks = [];
  let failure2;
  const drained = (async () => {
    try {
      for await (const chunk of source) chunks.push(chunk);
    } catch (error42) {
      failure2 = { error: error42 };
    }
  })();
  return {
    async *[Symbol.asyncIterator]() {
      await drained;
      if (failure2 !== void 0) throw failure2.error;
      yield* chunks;
    }
  };
}
function gateToolOnCredentialFillLease(tool, lease, resolveWindowIndex) {
  if (lease === void 0) return tool;
  return {
    ...tool,
    execute: async (ctx, interactionHandler, argsStream, meta) => {
      const args = readAhead(argsStream);
      ctx.get(turnToolCallAttributionStartKey)?.(meta.toolCallId);
      const windowIndex = await resolveWindowIndex?.(ctx);
      const acquisition = await lease.acquireAgentTool({
        toolName: tool.name,
        ...windowIndex === void 0 ? {} : { windowIndex },
        signal: ctx.signal
      });
      if (!acquisition.ok) throw new ToolCallUnexpectedEnvironmentError(acquisition.detail);
      try {
        return await tool.execute(ctx, interactionHandler, args, meta);
      } finally {
        acquisition.release();
      }
    }
  };
}
