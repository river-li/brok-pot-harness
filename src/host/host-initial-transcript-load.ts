/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/host/host-initial-transcript-load.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_errors();
async function loadInitialTranscriptResiliently(transcript, reportHostLog) {
  try {
    return (await retrySqliteBusy(() => transcript.ensureLoaded())).length;
  } catch (error42) {
    if (!isSqliteBusyError(error42)) throw error42;
    reportHostLog(
      "error",
      `[sand-host] initial transcript load still locked after retries (kept alive): ${errorLogTag(error42)}`
    );
    return 0;
  }
}

