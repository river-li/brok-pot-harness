var import_node_crypto71 = require("node:crypto");
init_dist3();
init_errors();
function spendInitiationForRequest(session, requestId2) {
  if (requestId2 == null) return void 0;
  try {
    return session.db.getSpendInitiation(requestId2)?.initiation;
  } catch (error42) {
    reportHostDiagnostic({
      kind: "fallback_taken",
      stage: "transcript_manager",
      errorClass: errorLogTag(error42)
    });
    return void 0;
  }
}
function messageSpendInitiation(session, messageIds, now = Date.now()) {
  const ids = [...new Set(messageIds)].sort();
  const firstId = ids[0];
  if (firstId === void 0) return void 0;
  const read = attemptSync(() => {
    const entries2 = ids.map((id) => session.db.getEntryById(id));
    const target = entries2.find((entry) => entry?.id === messageIds.at(-1));
    const prior2 = target?.kind === "message" && target.requestId != null ? session.db.getSpendInitiation(target.requestId)?.initiation : void 0;
    return { entries: entries2, prior: prior2 };
  });
  if (!read.ok) {
    reportHostDiagnostic({
      kind: "fallback_taken",
      stage: "transcript_manager",
      errorClass: errorLogTag(read.error)
    });
    return void 0;
  }
  const { entries, prior } = read.value;
  if (prior?.type === "message") return prior;
  const timestamps = entries.flatMap(
    (entry) => entry?.timestampMs != null && entry.timestampMs > 0 ? [entry.timestampMs] : []
  );
  const initiation = {
    type: "message",
    id: ids.length === 1 ? firstId : `batch-${(0, import_node_crypto71.createHash)("sha256").update(JSON.stringify(ids)).digest("hex")}`,
    timestampMs: timestamps.length > 0 ? Math.min(...timestamps) : now,
    initiatingMessageCount: ids.length
  };
  return initiation;
}
function spendInitiationRecorder(session, initiation, onPersisted) {
  if (initiation == null) return void 0;
  const event = { ...initiation };
  return (requestId2) => {
    const persisted = attemptSync(
      () => session.db.appendSpendInitiation(
        createSandSpendInitiationEntry({
          agentId: session.id,
          requestId: requestId2,
          timestampMs: Date.now(),
          initiation: event
        })
      )
    );
    if (!persisted.ok) {
      reportHostDiagnostic({
        kind: "fallback_taken",
        stage: "transcript_manager",
        errorClass: errorLogTag(persisted.error)
      });
      return;
    }
    if (persisted.value) onPersisted?.(requestId2);
  };
}
