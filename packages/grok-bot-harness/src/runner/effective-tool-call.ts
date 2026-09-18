function resolveEffectiveToolCall(part) {
  const { toolName, args } = part;
  if (toolName !== SAND_DYNAMIC_MCP_META_TOOL_NAMES.invocation) {
    return { toolName, args, dispatch: "direct" };
  }
  const invocation = parseDynamicInvocationArgs(args);
  if (invocation?.toolName === void 0) {
    return { toolName, args, dispatch: "direct" };
  }
  const isFirstParty = invocation.namespace !== void 0 && isReservedDynamicToolsNamespace(invocation.namespace);
  return {
    toolName: invocation.toolName,
    // The dispatcher recovers `arguments` the model wrote as a JSON string;
    // the transcript keeps the string, so match that here.
    args: typeof invocation.arguments === "string" ? parseNativeToolArguments(invocation.arguments) : invocation.arguments,
    dispatch: isFirstParty ? "first-party-dynamic" : "external-dynamic"
  };
}
function invokesFirstPartyTool(part, matches) {
  const call = resolveEffectiveToolCall(part);
  return call.dispatch !== "external-dynamic" && matches(call.toolName, call.args);
}
