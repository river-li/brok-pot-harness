/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/update/update-track.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var NIGHTLY_UPDATE_TRACK_DISABLED = true;
function coerceToEnabledTrack(track) {
  if (NIGHTLY_UPDATE_TRACK_DISABLED && track === "nightly") {
    return "stable";
  }
  return track;
}

