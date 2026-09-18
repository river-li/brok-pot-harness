init_agent_pb();
init_privacy_mode_pb();
var serializedSnapshotCache = /* @__PURE__ */ new WeakMap();
function rootPromptBlobIdsKey(blobIds) {
  return blobIds.map(toHex3).join(",");
}
async function persistPromptContextUsageSnapshot(options2) {
  if (options2.privacyMode === PrivacyMode.NO_STORAGE || options2.usageTree === void 0) {
    return void 0;
  }
  const rootBlobIdsKey = rootPromptBlobIdsKey(options2.rootPromptMessagesJson);
  const cached2 = serializedSnapshotCache.get(options2.usageTree);
  if (cached2?.rootPromptBlobIdsKey === rootBlobIdsKey) {
    return cached2.blobId;
  }
  const snapshot = new PromptContextUsageSnapshot({
    promptContextUsageTree: fromRedactedPromptContextUsageTree(options2.usageTree, PrivacyCapability.UNSAFE_ALWAYS_ALLOWED),
    rootPromptMessagesJson: [...options2.rootPromptMessagesJson]
  });
  const serialized = snapshot.toBinary();
  const blobId = await getBlobId(serialized);
  getBlobMetadataCallback(options2.blobStore)?.({
    blobId,
    blobType: {
      kind: "proto",
      typeName: "agent.v1.PromptContextUsageSnapshot"
    }
  });
  await setBlobReadableFromCloudMirror({
    blobStore: options2.blobStore,
    ctx: options2.ctx,
    blobId,
    blobData: serialized
  });
  serializedSnapshotCache.set(options2.usageTree, {
    rootPromptBlobIdsKey: rootBlobIdsKey,
    blobId
  });
  return blobId;
}
