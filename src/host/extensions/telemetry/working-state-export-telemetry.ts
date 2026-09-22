/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/extensions/telemetry/working-state-export-telemetry.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_bounded();
function workingStateDetailMetadata(report) {
  return {
    listing_pages: cappedNumberString(report.listingPages),
    listed_blobs: cappedNumberString(report.listedBlobs),
    listing_known_blobs: cappedNumberString(report.listingKnownBlobs)
  };
}
function workingStateExportTelemetry(report) {
  return {
    level: report.outcome === "failed" || report.listingOutcome === "failed" ? "warn" : "info",
    event: WORKING_STATE_EXPORT_EVENT,
    metadata: {
      agent_id: brandedId(report.agentId),
      trigger: brandLiteralEnum(report.trigger),
      outcome: brandLiteralEnum(report.outcome),
      skip_reason: report.skipReason !== void 0 ? brandLiteralEnum(report.skipReason) : void 0,
      error_class: brandedErrorClass(report.errorClass),
      listing_outcome: brandLiteralEnum(report.listingOutcome),
      ...workingStateDetailMetadata(report),
      possible_reupload: brandLiteralEnum(report.possibleReupload ? "true" : "false"),
      closure_blobs: cappedNumberString(report.closureBlobs),
      closure_bytes: cappedNumberString(report.closureBytes),
      already_durable_blobs: cappedNumberString(report.alreadyDurableBlobs),
      already_durable_bytes: cappedNumberString(report.alreadyDurableBytes),
      uploaded_blobs: cappedNumberString(report.uploadedBlobs),
      uploaded_bytes: cappedNumberString(report.uploadedBytes),
      duration_ms: cappedNumberString(report.durationMs),
      snapshot_duration_ms: cappedNumberString(report.snapshotDurationMs),
      listing_duration_ms: cappedNumberString(report.listingDurationMs),
      read_duration_ms: cappedNumberString(report.readDurationMs),
      upload_duration_ms: cappedNumberString(report.uploadDurationMs)
    }
  };
}
function workingStateWarmTelemetry(report) {
  return {
    level: report.outcome === "failed" || report.listingOutcome === "failed" ? "warn" : "info",
    event: WORKING_STATE_WARM_EVENT,
    metadata: {
      agent_id: brandedId(report.agentId),
      population_agents: cappedNumberString(report.populationAgents),
      put_concurrency: cappedNumberString(report.putConcurrency),
      trigger: brandLiteralEnum(report.trigger),
      outcome: brandLiteralEnum(report.outcome),
      skip_reason: report.skipReason !== void 0 ? brandLiteralEnum(report.skipReason) : void 0,
      has_transcript: brandedBooleanTag(report.hasTranscript),
      error_class: brandedErrorClass(report.errorClass),
      listing_outcome: brandLiteralEnum(report.listingOutcome),
      ...workingStateDetailMetadata(report),
      possible_reupload: brandLiteralEnum(report.possibleReupload ? "true" : "false"),
      closure_blobs: cappedNumberString(report.closureBlobs),
      closure_bytes: cappedNumberString(report.closureBytes),
      already_durable_blobs: cappedNumberString(report.alreadyDurableBlobs),
      already_durable_bytes: cappedNumberString(report.alreadyDurableBytes),
      uploaded_blobs: cappedNumberString(report.uploadedBlobs),
      uploaded_bytes: cappedNumberString(report.uploadedBytes),
      duration_ms: cappedNumberString(report.durationMs),
      snapshot_duration_ms: cappedNumberString(report.snapshotDurationMs),
      listing_duration_ms: cappedNumberString(report.listingDurationMs),
      read_duration_ms: cappedNumberString(report.readDurationMs),
      upload_duration_ms: cappedNumberString(report.uploadDurationMs)
    }
  };
}
function cappedNumberString(value) {
  return value !== void 0 ? String(Math.min(Number.MAX_SAFE_INTEGER, Math.max(0, Math.round(value)))) : void 0;
}
function brandedBooleanTag(value) {
  if (value === void 0) return brandLiteralEnum("unknown");
  if (value) return brandLiteralEnum("true");
  return brandLiteralEnum("false");
}

