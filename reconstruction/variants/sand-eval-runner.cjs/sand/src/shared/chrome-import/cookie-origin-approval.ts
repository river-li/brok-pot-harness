/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/chrome-import/cookie-origin-approval.ts
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function cookieOriginRequestEntryFromWire(entry) {
  return typeof entry === "string" ? { origin: entry, profileId: null } : { origin: entry.origin, profileId: entry.profileId };
}
var COOKIE_ORIGIN_APPROVAL_DECISIONS = ["approve-once", "always-allow", "deny"];
var COOKIE_ORIGIN_APPROVAL_DENY = "deny";
var COOKIE_ORIGIN_GRANTING_DECISIONS = COOKIE_ORIGIN_APPROVAL_DECISIONS.filter(
  (decision) => decision !== COOKIE_ORIGIN_APPROVAL_DENY
);

