/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/runner/tools/credential-fill-lease-gate.ts
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function readAhead(source) {
  const chunks = [];
  let failure;
  const drained = (async () => {
    try {
      for await (const chunk of source) chunks.push(chunk);
    } catch (error3) {
      failure = { error: error3 };
    }
  })();
  return {
    async *[Symbol.asyncIterator]() {
      await drained;
      if (failure !== void 0) throw failure.error;
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

