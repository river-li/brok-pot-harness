/* Recovered emitted JavaScript; original types/imports may be absent.
 * Source: ../packages/grok-bot-harness/src/runner/cookie-import-skip-sites.ts
 * Bundle: sand-host/host-main.cjs
 * See reconstruction-manifest.json for exact byte ranges. */
// @recovered-fragment 1/1
var COOKIE_IMPORT_SKIP_SITES = [
  "Linear",
  "Okta",
  "United Airlines (united.com)",
  "Rippling",
  "Databricks",
  "Airtable"
];
function skipSitesInProse(conjunction) {
  const sites = [...COOKIE_IMPORT_SKIP_SITES];
  const last = sites.pop();
  return last === void 0 ? "" : `${sites.join(", ")}, ${conjunction} ${last}`;
}
function cookieImportSkipToolNote() {
  return `Listing origins (omitting origins) is always fine. Do not request origins for ${skipSitesInProse("or")} unless the listing shows the user's Chrome has the site: for those, a login made fresh just to feed the import does not persist, so with no existing Chrome session send the user to the normal sign-in on the box instead.`;
}

