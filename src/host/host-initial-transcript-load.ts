init_errors();
async function loadInitialTranscriptResiliently(transcript, reportHostLog) {
  try {
    return (await retrySqliteBusy(() => transcript.ensureLoaded())).length;
  } catch (error41) {
    if (!isSqliteBusyError(error41)) throw error41;
    reportHostLog(
      "error",
      `[sand-host] initial transcript load still locked after retries (kept alive): ${errorLogTag(error41)}`
    );
    return 0;
  }
}
