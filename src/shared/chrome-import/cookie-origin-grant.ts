init_unknown_record();
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
function parseCookieOriginGrant(raw) {
  if (!isUnknownRecord(raw)) return null;
  const profileId = parseChromeProfileId(raw.profileId);
  const origin = parseCookieOrigin(raw.origin);
  if (profileId === null || origin === null) return null;
  return { profileId, origin };
}
function parseCookieOriginGrants(raw) {
  const grants = [];
  for (const entry of raw) {
    const grant = parseCookieOriginGrant(entry);
    if (grant !== null) grants.push(grant);
  }
  return grants;
}
function cookieOriginGrantKey(grant) {
  return JSON.stringify([grant.profileId, grant.origin]);
}
