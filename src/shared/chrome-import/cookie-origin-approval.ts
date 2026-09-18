function cookieOriginRequestEntryFromWire(entry) {
  return typeof entry === "string" ? { origin: entry, profileId: null } : { origin: entry.origin, profileId: entry.profileId };
}
function cookieOriginRequestEntryToWire(entry) {
  return entry.profileId === null ? entry.origin : { origin: entry.origin, profileId: entry.profileId };
}
var COOKIE_ORIGIN_APPROVAL_DECISIONS = ["approve-once", "always-allow", "deny"];
var COOKIE_ORIGIN_APPROVAL_DENY = "deny";
var COOKIE_ORIGIN_GRANTING_DECISIONS = COOKIE_ORIGIN_APPROVAL_DECISIONS.filter(
  (decision) => decision !== COOKIE_ORIGIN_APPROVAL_DENY
);
function parseCookieOriginApprovalItem(raw) {
  if (!isUnknownRecord(raw)) return null;
  const profileId = parseChromeProfileId(raw.profileId);
  const origin = parseCookieOrigin(raw.origin);
  if (profileId === null || origin === null) return null;
  const profileDisplayName = typeof raw.profileDisplayName === "string" ? raw.profileDisplayName.trim() : "";
  return { profileId, profileDisplayName, origin };
}
