function pullPathsAttemptFromRound(summary, engineStateAfterRound) {
  return engineStateAfterRound === "passive" && !summary.listingComplete ? { kind: "holder-owns-fetch" } : { kind: "ran", summary };
}
