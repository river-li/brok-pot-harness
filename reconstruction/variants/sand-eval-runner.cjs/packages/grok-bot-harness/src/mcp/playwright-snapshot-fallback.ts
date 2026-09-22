/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/mcp/playwright-snapshot-fallback.ts
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var UNRESOLVED_TARGET_PHRASES = {
  stale_ref: "is from an older snapshot",
  target_missing: "matches nothing on the current page",
  target_ambiguous: "matches more than one element"
};
function isUnresolvedTargetReason(reason) {
  return reason in UNRESOLVED_TARGET_PHRASES;
}
function scopedSnapshotTarget(args) {
  if (playwrightBoxMcpWindowIndex(args.providerIdentifier) === void 0) return void 0;
  if (args.toolName !== "browser_snapshot") return void 0;
  const target = args.args.target;
  return target?.kind.case === "stringValue" ? target.kind.value : void 0;
}
function unresolvedTarget(result) {
  if (result.result.case !== "success" || !result.result.value.isError) return void 0;
  const text2 = result.result.value.content.flatMap((item) => item.content.case === "text" ? [item.content.value.text] : []).join("\n");
  const reason = playwrightToolErrorReason(text2);
  return isUnresolvedTargetReason(reason) ? reason : void 0;
}
function withPlaywrightSnapshotFallback(executor, harness) {
  return {
    isBackendRouted: (provider) => executor.isBackendRouted?.(provider) === true,
    async execute(ctx, args, options2) {
      const result = await executor.execute(ctx, args, options2);
      const target = scopedSnapshotTarget(args);
      if (target === void 0) return result;
      const reason = unresolvedTarget(result);
      if (reason === void 0) return result;
      recordPlaywrightSnapshotRecovery(ctx, { reason, harness });
      const wholePage = new McpArgs(args);
      delete wholePage.args.target;
      delete wholePage.args.depth;
      const retried = await executor.execute(ctx, wholePage, options2);
      if (retried.result.case === "success" && !retried.result.value.isError) {
        retried.result.value.content.unshift(
          new McpToolResultContentItem({
            content: {
              case: "text",
              value: new McpTextContent({
                text: `Target ${target} ${UNRESOLVED_TARGET_PHRASES[reason]}. The whole page follows instead.`
              })
            }
          })
        );
      }
      return retried;
    }
  };
}

