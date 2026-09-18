function computeRestoredTokenStaleness(args) {
  const boundary = args.messageCountAtLastCompaction;
  if (boundary === void 0) {
    return false;
  }
  if (args.messages.length < boundary) {
    return false;
  }
  return !args.messages.slice(boundary).some((message) => message.role === "assistant");
}
