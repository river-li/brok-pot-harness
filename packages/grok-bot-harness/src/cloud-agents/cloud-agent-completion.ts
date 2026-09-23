function cloudAgentWatchArmedBy(options2) {
  if (options2?.afterFollowup === true) return "reply";
  if (options2?.afterLaunch === true) return "launch";
  return "watch";
}
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
