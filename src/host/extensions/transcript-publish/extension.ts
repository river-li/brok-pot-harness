var TRANSCRIPT_PUBLISH_GATE = "sand_transcript_double_write";
var BLOB_KEY_PREFIX2 = "blobs/";
var transcriptPublishExtension = defineHostExtension({
  id: "transcript-publish",
  dependencies: [
    HostExtensions.Auth,
    HostExtensions.BoxStoreSync,
    HostExtensions.Experiments,
    HostExtensions.Telemetry
  ],
  start: (context2) => {
    const boxStoreSync = context2.deps["box-store-sync"];
    const client = createSandCursorBackendClient(GrokBotService, {
      backend: context2.host.environment.backend,
      getAccessToken: context2.deps.auth.getAccessToken,
      getTeamId: context2.deps.auth.getTeamId,
      getMachineId: context2.deps.auth.getMachineId
    });
    const agentsRootDir = getSandAgentsRootDir();
    const publisher = new TranscriptEntryPublisher({
      agentsRootDir,
      ledgerDir: (0, import_node_path149.join)(getSandRootDir(), "transcript-publish"),
      isTemporalAgent: (agentId) => readSandProfileHarness(getSandProfilePath((0, import_node_path149.join)(agentsRootDir, agentId))) === "temporal",
      putBlob: async (blobHash, bytes) => {
        const storeId = await boxStoreSync.getStoreId();
        await boxStoreSync.objectStoreProvider.forStore(storeId).put(`${BLOB_KEY_PREFIX2}${blobHash}`, bytes, { contentAddressed: true });
      },
      commit: async (commit) => {
        const response = await client.commitGrokBotTranscriptEntries({
          agentId: commit.agentId,
          generation: commit.generation,
          entries: commit.entries.map((entry) => ({
            seq: BigInt(entry.seq),
            entryKind: entry.entryKind,
            entryId: entry.entryId,
            body: entry.body,
            blobHash: entry.blobHash,
            updatedSeq: BigInt(entry.updatedSeq)
          })),
          deletes: commit.deletes.map((del) => ({
            seq: BigInt(del.seq),
            updatedSeq: BigInt(del.updatedSeq),
            entryId: del.entryId
          }))
        });
        return {
          committedCount: response.committedCount,
          deletedCount: response.deletedCount,
          rejections: response.rejections.map((rejection) => ({
            seq: Number(rejection.seq),
            currentUpdatedSeq: Number(rejection.currentUpdatedSeq)
          }))
        };
      },
      report: (level, metadata) => context2.deps.telemetry.logs.reportTranscriptPublish(level, metadata)
    });
    const createPublishSoon = (name17, delayMs, scope) => createDebouncePolicy({ name: name17, delayMs }).wrap(() => void publisher.flush(scope));
    let publishSoon;
    let publishBulkSoon;
    let unsubscribe;
    const disarm = () => {
      const wasArmed = unsubscribe != null;
      unsubscribe?.();
      unsubscribe = void 0;
      publishSoon?.dispose();
      publishSoon = void 0;
      publishBulkSoon?.dispose();
      publishBulkSoon = void 0;
      return wasArmed;
    };
    const applyGate = (isEnabled) => {
      if (!isEnabled || !boxStoreSync.isEnabled) {
        disarm();
        return;
      }
      if (unsubscribe != null) return;
      const interactive = createPublishSoon(
        "transcript-publish",
        TRANSCRIPT_PUBLISH_DEBOUNCE_MS,
        "interactive"
      );
      const bulk = createPublishSoon(
        "transcript-publish-bulk",
        TRANSCRIPT_PUBLISH_BULK_DEBOUNCE_MS,
        "all"
      );
      publishSoon = interactive;
      publishBulkSoon = bulk;
      unsubscribe = subscribeTranscriptMutations((mutation) => {
        publisher.applyMutation(mutation);
        if (isInteractiveTranscriptMutation(mutation)) interactive();
        else bulk();
      });
      void publisher.sweepAllAgents().then(() => bulk());
    };
    const gate = context2.deps.experiments.getFeatureGateProperty(TRANSCRIPT_PUBLISH_GATE);
    context2.onStop(gate.subscribe(applyGate));
    applyGate(gate.get());
    context2.onStop(() => {
      if (disarm()) return publisher.flush();
    });
    return {
      flushAgent: async (agentId) => {
        if (unsubscribe == null) return "disarmed";
        return await publisher.flushAgent(agentId) ? "drained" : "dirty";
      }
    };
  }
});
