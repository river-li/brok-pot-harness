/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/runner/tools/scm-write-gate.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_dist2();
init_mcp_tool_annotations();
async function scmWriteBlock(args) {
  if (args.blockedReason === void 0) return null;
  if (cursorScmProviderForMcpServerIdentifier(args.providerIdentifier) === void 0) return null;
  const tool = (await args.tools()).find(
    (candidate) => candidate.providerIdentifier === args.providerIdentifier && (candidate.name === args.toolName || candidate.toolName === args.toolName)
  );
  if (tool !== void 0 && isDeclaredReadOnlyMcpTool(tool.annotations)) return null;
  const reason = await args.blockedReason();
  return reason === void 0 ? null : `This write is not available in this turn: ${reason} Ask the owner to confirm \u2014 their reply unblocks it. Reads still work.`;
}

