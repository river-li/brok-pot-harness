var NIGHTLY_UPDATE_TRACK_DISABLED = true;
function coerceToEnabledTrack(track) {
  if (NIGHTLY_UPDATE_TRACK_DISABLED && track === "nightly") {
    return "stable";
  }
  return track;
}
