init_unknown_record();
function parseHostUpgradeMarker(raw) {
  let value;
  try {
    value = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!isUnknownRecord(value)) return null;
  const str4 = (x) => typeof x === "string" && x.length > 0 ? x : void 0;
  const num2 = (x) => typeof x === "number" && Number.isFinite(x) ? x : void 0;
  const outcome = value.outcome === "applied" || value.outcome === "failed" ? value.outcome : void 0;
  const commandId = str4(value.commandId);
  if (value.outcome !== void 0 && outcome === void 0 || outcome === void 0 && commandId === void 0) {
    return null;
  }
  return {
    outcome,
    commandId,
    fromVersion: str4(value.fromVersion),
    toVersion: str4(value.toVersion),
    mode: str4(value.mode),
    reason: str4(value.reason),
    issuedAtMs: num2(value.issuedAtMs),
    appliedAtMs: num2(value.appliedAtMs),
    swapMs: num2(value.swapMs),
    swapError: str4(value.swapError)
  };
}
function computeHostUpgradeMetadata(marker17, nowMs2) {
  if (marker17.outcome === "failed") {
    return {
      from_version: marker17.fromVersion,
      to_version: marker17.toVersion,
      mode: marker17.mode,
      trigger: marker17.reason,
      outcome: "failed",
      phase: "swap",
      error_class: marker17.swapError ?? "swap-failed"
    };
  }
  const { issuedAtMs, appliedAtMs, swapMs } = marker17;
  const hasIssuedAt = issuedAtMs !== void 0 && issuedAtMs > 0;
  const hasAppliedAt = appliedAtMs !== void 0 && appliedAtMs > 0;
  const deliverToApplyMs = hasIssuedAt && hasAppliedAt ? Math.max(0, appliedAtMs - issuedAtMs) : void 0;
  const totalMs = hasIssuedAt ? Math.max(0, nowMs2 - issuedAtMs) : void 0;
  return {
    from_version: marker17.fromVersion,
    to_version: marker17.toVersion,
    mode: marker17.mode,
    trigger: marker17.reason,
    outcome: "applied",
    deliver_to_apply_ms: deliverToApplyMs !== void 0 ? String(deliverToApplyMs) : void 0,
    swap_ms: swapMs !== void 0 ? String(swapMs) : void 0,
    total_ms: totalMs !== void 0 ? String(totalMs) : void 0
  };
}
async function forwardHostUpgradeMarkerWith(deps) {
  const raw = await deps.readRaw();
  if (raw == null) return "absent";
  if (deps.wasForwarded(raw)) return "skipped";
  const deleteIfUnchanged2 = async () => {
    if (await deps.readRaw() === raw) await deps.deleteMarker();
  };
  const marker17 = parseHostUpgradeMarker(raw);
  if (marker17 == null) {
    deps.warn(`discarding unparseable host-upgrade marker (len=${raw.length})`);
    deps.markForwarded(raw);
    await deleteIfUnchanged2();
    return "parse_error";
  }
  const delivered = await deps.emit(computeHostUpgradeMetadata(marker17, deps.now(raw)));
  if (!delivered) return "deferred";
  deps.markForwarded(raw);
  try {
    deps.onForwarded?.(marker17);
  } catch {
  }
  await deleteIfUnchanged2();
  return "emitted";
}
