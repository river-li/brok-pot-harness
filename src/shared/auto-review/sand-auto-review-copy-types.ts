/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/auto-review/sand-auto-review-copy-types.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
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
    const description9 = optionalString(params.description);
    const workingDirectory = optionalString(params.workingDirectory);
    return {
      kind: "shell",
      params: {
        surface,
        ...description9 === void 0 ? {} : { description: description9 },
        ...workingDirectory === void 0 ? {} : { workingDirectory }
      }
    };
  }
  if (value.kind === "mcp") {
    const description9 = optionalString(params.description);
    const serverDisplayName = optionalString(params.serverDisplayName);
    const toolName = optionalString(params.toolName);
    const destinationHint = optionalString(params.destinationHint);
    return {
      kind: "mcp",
      params: {
        ...description9 === void 0 ? {} : { description: description9 },
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

