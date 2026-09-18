init_unknown_record();
function optionalString(value) {
  return typeof value === "string" && value.length > 0 ? value : void 0;
}
function parseSandAutoReviewSummaryCopy(value) {
  if (!isUnknownRecord(value)) return void 0;
  if (value.kind === "sensitive_action") return { kind: "sensitive_action" };
  const params = value.params;
  if (!isUnknownRecord(params)) return void 0;
  if (value.kind === "shell") {
    const surface = params.surface;
    if (surface !== "host_shell" && surface !== "box_shell") return void 0;
    const description10 = optionalString(params.description);
    const workingDirectory = optionalString(params.workingDirectory);
    return {
      kind: "shell",
      params: {
        surface,
        ...description10 === void 0 ? {} : { description: description10 },
        ...workingDirectory === void 0 ? {} : { workingDirectory }
      }
    };
  }
  if (value.kind === "mcp") {
    const description10 = optionalString(params.description);
    const serverDisplayName = optionalString(params.serverDisplayName);
    const toolName = optionalString(params.toolName);
    const destinationHint = optionalString(params.destinationHint);
    return {
      kind: "mcp",
      params: {
        ...description10 === void 0 ? {} : { description: description10 },
        ...serverDisplayName === void 0 ? {} : { serverDisplayName },
        ...toolName === void 0 ? {} : { toolName },
        ...destinationHint === void 0 ? {} : { destinationHint }
      }
    };
  }
  return void 0;
}
function parseSandAutoReviewAwaitingCopy(value) {
  if (!isUnknownRecord(value) || value.kind !== "auto_review_approval") return void 0;
  const params = value.params;
  if (!isUnknownRecord(params)) return void 0;
  const summary = optionalString(params.summary);
  if (summary == null) return void 0;
  const summaryCopy = parseSandAutoReviewSummaryCopy(params.summaryCopy);
  return {
    kind: "auto_review_approval",
    params: {
      summary,
      ...summaryCopy === void 0 ? {} : { summaryCopy }
    }
  };
}
