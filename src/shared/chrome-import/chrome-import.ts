/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: src/shared/chrome-import/chrome-import.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
init_unknown_record();
function brandParsedString(raw) {
  return raw;
}
var asCookieValue = brandParsedString;
function parseChromeCookieRecord(raw) {
  if (!isUnknownRecord(raw)) return null;
  if (typeof raw.name !== "string" || raw.name.length === 0) return null;
  if (typeof raw.value !== "string") return null;
  if (typeof raw.domain !== "string" || raw.domain.length === 0) return null;
  if (typeof raw.path !== "string") return null;
  if (typeof raw.expires !== "number" || !Number.isFinite(raw.expires)) return null;
  if (typeof raw.httpOnly !== "boolean" || typeof raw.secure !== "boolean") return null;
  const sameSite = raw.sameSite === "Strict" || raw.sameSite === "Lax" || raw.sameSite === "None" ? raw.sameSite : void 0;
  const session = typeof raw.session === "boolean" ? raw.session : void 0;
  const priority = raw.priority === "Low" || raw.priority === "Medium" || raw.priority === "High" ? raw.priority : void 0;
  const partitionKey = typeof raw.partitionKey === "string" || isUnknownRecord(raw.partitionKey) ? raw.partitionKey : void 0;
  return {
    name: raw.name,
    value: asCookieValue(raw.value),
    domain: raw.domain,
    path: raw.path,
    expires: raw.expires,
    httpOnly: raw.httpOnly,
    secure: raw.secure,
    ...sameSite === void 0 ? {} : { sameSite },
    ...session === void 0 ? {} : { session },
    ...priority === void 0 ? {} : { priority },
    ...partitionKey === void 0 ? {} : { partitionKey }
  };
}
function chromeCookieAllowHost(domain2) {
  return domain2.replace(/^\./, "").toLowerCase();
}
var CHROME_COOKIE_IMPORT_UNAVAILABLE = "chrome-cookie-import-unavailable";

