/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/runner/tools/tool-handoff.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function createToolHandoff() {
  const active = /* @__PURE__ */ new Set();
  let handedOff = false;
  function stopOtherTools({ toolCallId }) {
    handedOff = true;
    for (const call of active) {
      if (call.toolCallId !== toolCallId) {
        call.cancel(new SandRunAbortError({ intentional: true, reason: "awaiting box hand-back" }));
      }
    }
  }
  function wrapTool(tool) {
    return {
      ...tool,
      execute: async (ctx, interactionHandler, argsStream, meta) => {
        ctx.signal.throwIfAborted();
        if (handedOff) throw new ToolCallAbortedError();
        const [callCtx, cancel] = ctx.withCancel();
        const call = { toolCallId: meta.toolCallId, cancel };
        active.add(call);
        try {
          return await tool.execute(callCtx, interactionHandler, argsStream, meta);
        } finally {
          active.delete(call);
          cancel();
        }
      }
    };
  }
  return { stopOtherTools, wrapTool };
}

