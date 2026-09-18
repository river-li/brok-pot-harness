function selectSandEvalFinalMessage(args) {
  return args.deliveredMessages.length === 0 && args.systemPrompt != null ? args.assistantText : args.deliveredMessages.join("\n\n");
}
