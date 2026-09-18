var exportAttempts = createCounter("sand.working_state_export.attempts", {
  labelNames: ["trigger", "outcome", "skip_reason", "listing_outcome"]
});
var exportDuration = createHistogram("sand.working_state_export.duration_ms", {
  labelNames: ["trigger", "outcome"]
});
var exportListingDuration = createHistogram("sand.working_state_export.listing_duration_ms", {
  labelNames: ["trigger", "listing_outcome"]
});
var exportClosureBytes = createHistogram("sand.working_state_export.closure_bytes", {
  labelNames: ["trigger", "outcome"]
});
var exportUploadedBytes = createHistogram("sand.working_state_export.uploaded_bytes", {
  labelNames: ["trigger", "outcome", "listing_outcome"]
});
var exportClosureBlobs = createHistogram("sand.working_state_export.closure_blobs", {
  labelNames: ["trigger", "outcome"]
});
var exportUploadedBlobs = createHistogram("sand.working_state_export.uploaded_blobs", {
  labelNames: ["trigger", "outcome", "listing_outcome"]
});
var exportPossibleReupload = createCounter("sand.working_state_export.possible_reupload", {
  labelNames: ["trigger"]
});
var warmAttempts = createCounter("sand.working_state.warm.attempts", {
  labelNames: ["outcome", "skip_reason", "has_transcript", "listing_outcome"]
});
var warmDuration = createHistogram("sand.working_state.warm.duration_ms", {
  labelNames: ["outcome"]
});
var warmClosureBytes = createHistogram("sand.working_state.warm.closure_bytes", {
  labelNames: ["outcome"]
});
var warmUploadedBytes = createHistogram("sand.working_state.warm.uploaded_bytes", {
  labelNames: ["outcome", "listing_outcome"]
});
var warmClosureBlobs = createHistogram("sand.working_state.warm.closure_blobs", {
  labelNames: ["outcome"]
});
var warmUploadedBlobs = createHistogram("sand.working_state.warm.uploaded_blobs", {
  labelNames: ["outcome", "listing_outcome"]
});
var warmPossibleReupload = createCounter("sand.working_state.warm.possible_reupload", {
  labelNames: ["trigger"]
});
function recordWorkingStateExportMetrics(ctx, report) {
  exportAttempts.increment(ctx, 1, {
    trigger: report.trigger,
    outcome: report.outcome,
    skip_reason: report.skipReason ?? "none",
    listing_outcome: report.listingOutcome
  });
  exportDuration.histogram(ctx, report.durationMs, {
    trigger: report.trigger,
    outcome: report.outcome
  });
  if (report.listingDurationMs !== void 0) {
    exportListingDuration.histogram(ctx, report.listingDurationMs, {
      trigger: report.trigger,
      listing_outcome: report.listingOutcome
    });
  }
  if (report.closureBytes !== void 0) {
    exportClosureBytes.histogram(ctx, report.closureBytes, {
      trigger: report.trigger,
      outcome: report.outcome
    });
  }
  if (report.uploadedBytes !== void 0) {
    exportUploadedBytes.histogram(ctx, report.uploadedBytes, {
      trigger: report.trigger,
      outcome: report.outcome,
      listing_outcome: report.listingOutcome
    });
  }
  if (report.closureBlobs !== void 0) {
    exportClosureBlobs.histogram(ctx, report.closureBlobs, {
      trigger: report.trigger,
      outcome: report.outcome
    });
  }
  if (report.uploadedBlobs !== void 0) {
    exportUploadedBlobs.histogram(ctx, report.uploadedBlobs, {
      trigger: report.trigger,
      outcome: report.outcome,
      listing_outcome: report.listingOutcome
    });
  }
  if (report.possibleReupload) {
    exportPossibleReupload.increment(ctx, 1, { trigger: report.trigger });
  }
}
function recordWorkingStateWarmMetrics(ctx, report) {
  warmAttempts.increment(ctx, 1, {
    outcome: report.outcome,
    skip_reason: report.skipReason ?? "none",
    has_transcript: report.hasTranscript === void 0 ? "unknown" : String(report.hasTranscript),
    listing_outcome: report.listingOutcome
  });
  warmDuration.histogram(ctx, report.durationMs, { outcome: report.outcome });
  if (report.closureBytes !== void 0) {
    warmClosureBytes.histogram(ctx, report.closureBytes, { outcome: report.outcome });
  }
  if (report.uploadedBytes !== void 0) {
    warmUploadedBytes.histogram(ctx, report.uploadedBytes, {
      outcome: report.outcome,
      listing_outcome: report.listingOutcome
    });
  }
  if (report.closureBlobs !== void 0) {
    warmClosureBlobs.histogram(ctx, report.closureBlobs, { outcome: report.outcome });
  }
  if (report.uploadedBlobs !== void 0) {
    warmUploadedBlobs.histogram(ctx, report.uploadedBlobs, {
      outcome: report.outcome,
      listing_outcome: report.listingOutcome
    });
  }
  if (report.possibleReupload) {
    warmPossibleReupload.increment(ctx, 1, { trigger: report.trigger });
  }
}
