function getReleasePluginSource(fields2, fallbackReleaseTag) {
  var _a19;
  const releaseTag = (_a19 = fields2.releaseTag) !== null && _a19 !== void 0 ? _a19 : fallbackReleaseTag;
  if (fields2.releaseRepo && fields2.releaseAsset && releaseTag) {
    return {
      kind: "release",
      releaseRepo: fields2.releaseRepo,
      releaseAsset: fields2.releaseAsset,
      releaseTag
    };
  }
  return void 0;
}
