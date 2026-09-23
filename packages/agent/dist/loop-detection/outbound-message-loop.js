function withholdLoopingOutboundToolArgs(policy, toolName, argsStream) {
  if (policy?.responseAction !== "retry_once" || policy.isOutboundMessageTool === void 0 || !policy.isOutboundMessageTool(toolName)) {
    return argsStream;
  }
  return (async function* () {
    const args = new JsonStringContentStream();
    const detector = new SingleMessageLoopDetector2();
    for await (const chunk of argsStream) {
      if (detector.addText({ newText: args.push(chunk), caller: "nal" })) {
        const singleLine2 = detector.getSingleLineLoopInfo();
        throw new AgentLoopError({
          loopType: "singleMessage",
          loopKind: singleLine2 !== null ? "single_message_single_line" : "single_message_multi_line",
          repetitions: singleLine2?.repetitions ?? detector.getMultiLineLoopInfo()?.repetitions ?? 0,
          period: singleLine2?.period
        });
      }
      yield chunk;
    }
  })();
}
