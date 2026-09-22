/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/cloud-agents/cloud-agent-completion.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
async function augmentCloudAgentWatchResult(args) {
  const withTranscript = await augmentWatchResultWithTranscriptDump(args);
  if (!args.artifactsEnabled) {
    return withTranscript;
  }
  return await augmentWatchResultWithArtifacts({
    ...args,
    result: withTranscript,
    ...args.syncArtifacts === void 0 ? {} : { sync: args.syncArtifacts }
  });
}

