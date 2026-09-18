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
