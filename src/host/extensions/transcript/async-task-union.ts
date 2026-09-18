function markerLabel(marker17) {
  if (marker17.title != null && marker17.title.length > 0) return marker17.title;
  switch (marker17.kind) {
    case "cloud-agent":
      return `Cloud agent ${marker17.workId}`;
    case "shell":
      return `Background command ${marker17.workId}`;
    case "subagent":
      return `Background task ${marker17.workId}`;
  }
}
function pendingWakeMarkerToAsyncTask(marker17) {
  const kind = marker17.kind;
  const detail = marker17.subagentType != null && marker17.subagentType.length > 0 ? `${marker17.subagentType} \xB7 ${ASYNC_TASK_DURABLE_LEDGER_DETAIL}` : ASYNC_TASK_DURABLE_LEDGER_DETAIL;
  return {
    kind,
    id: marker17.workId,
    label: markerLabel(marker17),
    ...marker17.labelKind != null && marker17.labelParams != null ? { labelKind: marker17.labelKind, labelParams: marker17.labelParams } : {},
    status: "running",
    startedAtMs: marker17.markedAtMs,
    detail,
    detailKind: "durable_pending_wake_ledger",
    ...marker17.subagentType != null ? { detailParams: { subagentType: marker17.subagentType } } : {}
  };
}
function mergeAsyncTasks(liveTasks, ledgerMarkers) {
  const seen = new Set(liveTasks.map((task) => `${task.kind}\0${task.id}`));
  const merged = [...liveTasks];
  for (const marker17 of ledgerMarkers) {
    if (seen.has(`${marker17.kind}\0${marker17.workId}`)) continue;
    merged.push(pendingWakeMarkerToAsyncTask(marker17));
  }
  return merged.sort((a, b2) => a.startedAtMs - b2.startedAtMs || a.id.localeCompare(b2.id));
}
