init_agent_pb();
init_shell_tool_pb();
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
