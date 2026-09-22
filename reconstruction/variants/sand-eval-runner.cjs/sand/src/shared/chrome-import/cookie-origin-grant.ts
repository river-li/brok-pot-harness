/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/chrome-import/cookie-origin-grant.ts
 * Bundle: sand-host/sand-eval-runner.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
function parseChromeProfileId(raw) {
  if (typeof raw !== "string") return null;
  const trimmed = raw.trim();
  return trimmed.length === 0 ? null : brandParsedString(trimmed);
}
function isNormalizedCookieHost(host) {
  return host.length > 0 && chromeCookieAllowHost(host) === host;
}
function parseCookieOrigin(raw) {
  if (typeof raw !== "string") return null;
  const host = chromeCookieAllowHost(raw.trim());
  return isNormalizedCookieHost(host) ? brandParsedString(host) : null;
}
function cookieOriginGrantKey(grant) {
  return JSON.stringify([grant.profileId, grant.origin]);
}

