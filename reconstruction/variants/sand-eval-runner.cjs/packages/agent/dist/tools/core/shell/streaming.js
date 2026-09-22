/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/agent/dist/tools/core/shell/streaming.js
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function createShellToolCall(shellTool) {
  return new ToolCall({
    tool: {
      case: "shellToolCall",
      value: shellTool
    }
  });
}
function createStreamingShellHandler(interactionHandler, meta, _shellArgs, options2) {
  const startTime = Date.now();
  startInterruptedShellOutputSnapshot(meta.toolCallId);
  const handleShellEvent = async (ctx, event) => {
    switch (event.type) {
      case "stdout":
        if (event.data) {
          appendInterruptedShellOutputSnapshot(meta.toolCallId, event.data);
          if (options2?.suppressOutputDeltas === true) {
            break;
          }
          await interactionHandler.emitToolCallDelta(ctx, meta.toolCallId, new ToolCallDelta({
            delta: {
              case: "shellToolCallDelta",
              value: new ShellToolCallDelta({
                delta: {
                  case: "stdout",
                  value: new ShellToolCallStdoutDelta({
                    content: event.data
                  })
                }
              })
            }
          }));
        }
        break;
      case "stderr":
        if (event.data) {
          appendInterruptedShellOutputSnapshot(meta.toolCallId, event.data);
          if (options2?.suppressOutputDeltas === true) {
            break;
          }
          await interactionHandler.emitToolCallDelta(ctx, meta.toolCallId, new ToolCallDelta({
            delta: {
              case: "shellToolCallDelta",
              value: new ShellToolCallDelta({
                delta: {
                  case: "stderr",
                  value: new ShellToolCallStderrDelta({
                    content: event.data
                  })
                }
              })
            }
          }));
        }
        break;
      case "exit":
        break;
    }
  };
  return {
    startTime,
    handleShellEvent
  };
}

