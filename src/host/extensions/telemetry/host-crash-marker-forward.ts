function hostCrashMarkerMetadata(marker17) {
  const times = {
    ...marker17.startedAtMs === void 0 ? {} : { started_at_ms: String(Math.round(marker17.startedAtMs)) },
    crashed_at_ms: String(Math.round(marker17.crashedAtMs)),
    ...marker17.uptimeMs === void 0 ? {} : { uptime_ms: String(Math.round(marker17.uptimeMs)) }
  };
  if ("kind" in marker17) {
    return {
      kind: marker17.kind,
      stage: marker17.stage,
      ...marker17.extensionId === void 0 ? {} : { extension_id: marker17.extensionId },
      error_class: marker17.errorClass,
      ...times
    };
  }
  return {
    kind: "process_exit",
    error_class: marker17.errorClass,
    exit_signal: marker17.exitSignal,
    ...times
  };
}
async function deleteIfUnchanged(store, raw) {
  const current = await store.read();
  if (current.kind === "unavailable") return "failed";
  if (current.kind === "absent") return "deleted";
  if (current.raw !== raw) return "changed";
  return await store.delete() === "deleted" ? "deleted" : "failed";
}
async function forwardHostCrashMarkerWith(forwarder) {
  const read = await forwarder.store.read();
  if (read.kind === "unavailable") return "deferred";
  if (read.kind === "absent") return "absent";
  const { raw } = read;
  if (forwarder.wasForwarded(raw)) {
    const deletion2 = await deleteIfUnchanged(forwarder.store, raw);
    if (deletion2 === "failed") return "delete_deferred";
    return deletion2 === "changed" ? "pending" : "delivered";
  }
  const marker17 = parseHostCrashMarker(raw);
  if (marker17 === null) {
    await forwarder.emitUnparseable();
    forwarder.markForwarded(raw);
    const deletion2 = await deleteIfUnchanged(forwarder.store, raw);
    if (deletion2 === "failed") return "delete_deferred";
    return deletion2 === "changed" ? "pending" : "parse_error";
  }
  if (!await forwarder.emit(marker17)) return "deferred";
  forwarder.markForwarded(raw);
  const deletion = await deleteIfUnchanged(forwarder.store, raw);
  if (deletion === "failed") return "delete_deferred";
  return deletion === "changed" ? "pending" : "delivered";
}
